import express from "express";
import bodyParser from "body-parser";
import mysql from "mysql2";
import bcrypt from "bcrypt";
import passport from "passport";
import { Strategy as LocalStrategy } from "passport-local";
import { Strategy as GoogleStrategy } from "passport-google-oauth2";
import session from "express-session";
import cors from "cors";
import dotenv from "dotenv";
import nodemailer from "nodemailer";
import crypto from "crypto";
import dayjs from "dayjs";

const serviceProviderApp = express();
const saltRounds = 10;
dotenv.config();

// Middleware setup
serviceProviderApp.use(
  cors({
     origin: [
      "http://43.204.96.204:5173", // Local development frontend
      "http://yourfrontenddomain.com", // If your frontend is deployed on a domain
      "http://43.204.96.204",  // Your public IP, if you are testing or accessing directly
    ],
    credentials: true,
  })
);


// Consider adding a persistent store for production:
// const MongoStore = require('connect-mongo'); // Example for MongoDB

serviceProviderApp.use(
  session({
    secret: process.env.SESSION_SECRET_LSP, // Keep using environment variable - ensure it's strong!
    resave: false,                           // Good setting, prevents saving unchanged sessions.
    saveUninitialized: false,                // Recommended: Set to false. Only creates a session cookie when you actually modify the session (e.g., user logs in). Set to true ONLY if you specifically need every visitor to get a session cookie immediately.
    // store: MongoStore.create({ mongoUrl: process.env.MONGO_URI }), // IMPORTANT: Add a persistent store (like Mongo, Redis, etc.) for production. MemoryStore (default) leaks memory and doesn't survive restarts.

    cookie: {
      secure: false,         // CORRECT for HTTP. **MUST change to 'true' if you enable HTTPS later.**
      httpOnly: true,        // IMPORTANT Security Measure: Prevents client-side JavaScript from accessing the cookie via `document.cookie`. Helps mitigate XSS attacks stealing the session ID.
      sameSite: 'Lax',       // BEST Practice for Same-Origin:
                             // - 'Lax' allows the cookie to be sent on same-site requests and top-level navigations (like clicking a link), but prevents it from being sent on cross-site subrequests (like those initiated by third-party sites). This is the generally recommended default and provides CSRF protection.
                             // - You DO NOT need 'None' because your frontend and backend are now same-origin.
                             // - 'Strict' is more restrictive and might break some legitimate cross-origin navigations to your site. 'Lax' is usually the best balance.
      maxAge: 1000 * 60 * 60 * 24 // Example: Sets cookie expiry to 1 day (in milliseconds). Adjust as needed.
                                 // If you omit maxAge, it becomes a "session cookie" tied to the browser session lifetime (deleted when the browser closes), which might also be acceptable depending on your needs. Setting an explicit maxAge is often preferred for predictability.
    }
  })
);

serviceProviderApp.use(bodyParser.json());
serviceProviderApp.use(passport.initialize());
serviceProviderApp.use(passport.session());




const db = mysql.createPool({
  host: process.env.PROVIDER_HOST,
  user: process.env.PROVIDER_USER,
  password: process.env.PROVIDER_PASSWORD,
  database: process.env.PROVIDER_DATABASE,
  waitForConnections: true,
  connectionLimit: 10,  
  queueLimit: 0,
});

db.getConnection((err, connection) => {
  if (err) {
    console.error("Error connecting to MySQL:", err);
    return;
  }
  console.log("Connected to MySQL database for Service Provider");
  connection.release();  
});








function generateOTP() {
  return crypto.randomBytes(3).toString("hex").toUpperCase();
}

// Setup nodemailer transporter
const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS,
  },
});

// Local strategy for service provider login
passport.use(
  "service-provider-local",
  new LocalStrategy(async function (username, password, done) {
    try {
      db.query("SELECT * FROM service_providers WHERE email = ?", [username], (err, results) => {
        if (err) {
          console.error("Error finding service provider:", err);
          return done(err);
        }

        if (results.length === 0) {
          return done(null, false, { message: "Service provider not found" });
        }

        const serviceProvider = results[0];
        const storedHashedPassword = serviceProvider.password;
        bcrypt.compare(password, storedHashedPassword, (err, valid) => {
          if (err) {
            console.error("Error comparing passwords:", err);
            return done(err);
          }
          if (valid) {
            return done(null, serviceProvider);
          } else {
            return done(null, false, { message: "Incorrect password" });
          }
        });
      });
    } catch (err) {
      console.log(err);
      done(err);
    }
  })
);

// Google strategy for service provider OAuth
passport.use(
  "service-provider-google",
  new GoogleStrategy(
    {
      clientID: process.env.GOOGLE_CLIENT_ID,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET,
      callbackURL: "http://43.204.96.204:3000/service-provider/auth/google/secrets",
      userProfileURL: "https://www.googleapis.com/oauth2/v3/userinfo",
    },
    async (accessToken, refreshToken, profile, cb) => {
      try {
        const email = profile.emails[0].value; // Access the email correctly
        const [rows] = await db.promise().query("SELECT * FROM service_providers WHERE email = ?", [email]);

        if (rows.length === 0) {
          const [newUser] = await db.promise().query(
            "INSERT INTO service_providers (email, password) VALUES (?, ?)",
            [email, "google"]
          );
          return cb(null, { id: newUser.insertId, email });
        } else {
          return cb(null, rows[0]);
        }
      } catch (err) {
        console.log("Error during Google authentication:", err);
        return cb(err);
      }
    }
  )
);

passport.serializeUser((user, done) => {
  done(null, user.id);
});

passport.deserializeUser((id, done) => {
  db.query("SELECT * FROM service_providers WHERE id = ?", [id], (err, results) => {
    if (err) {
      return done(err);
    }
    const user = results[0];
    done(null, user);
  });
});

// Routes
serviceProviderApp.get(
  "/auth/google",
  passport.authenticate("service-provider-google", {
    scope: ["profile", "email"],
  })
);

serviceProviderApp.get(
  "/auth/google/secrets",
  passport.authenticate("service-provider-google", {
    successRedirect: "http://43.204.96.204:5173/aboutp",
    failureRedirect: "service-provider/login",
  })
);

serviceProviderApp.post(
  "/login",
  passport.authenticate("service-provider-local", {
    successRedirect: "/secrets",
    failureRedirect: "/service-provider/login",
  })
);

serviceProviderApp.get("/secrets", (req, res) => {
  if (req.isAuthenticated()) {
    res.json({ message: req.user.id }); // Accessing the user ID from the session
  } else {
    res.status(401).json({ message: "Unauthorized" });
  }
});

// Service provider registration
serviceProviderApp.post("/register", async (req, res) => {
  const email = req.body.username;
  const password = req.body.password;
  const name=req.body.name;
  const address=req.body.address;
  const latitude=req.body.latitude;
  const longitude=req.body.longitude;
  console.log(latitude,longitude);

  try {
    db.query("SELECT * FROM service_providers WHERE email = ?", [email], (err, results) => {
      if (err) {
        console.error("Error checking service provider:", err);
        return res.status(500).json({ error: "Internal server error" });
      }

      if (results.length > 0) {
        return res.status(400).json({ error: "Service provider already exists" });
      }

      bcrypt.hash(password, saltRounds, (err, hash) => {
        if (err) {
          console.error("Error hashing password:", err);
          return res.status(500).json({ error: "Internal server error" });
        }

        db.query(
          `INSERT INTO service_providers (email, password, name, address, lat, \`long\`) VALUES (?, ?, ?, ?, ?, ?)`,
          [email, hash,name,address,latitude,longitude],
          (err, results) => {
            if (err) {
              console.error("Error inserting service provider:", err);
              return res.status(500).json({ error: "Internal server error" });
            }

            res.json({ message: "Service provider registration successful" });
          }
        );
      });
    });
  } catch (err) {
    console.log(err);
    res.status(500).json({ error: "Internal server error" });
  }
});

serviceProviderApp.post("/send-otp", (req, res) => {
  const { email } = req.body;
  const otp = generateOTP();
  const expiresAt = dayjs().add(3, "minute").toDate();

  db.query(
    "INSERT INTO service_provider_otps (email, otp, expires_at) VALUES (?, ?, ?)",
    [email, otp, expiresAt],
    (err) => {
      if (err) {
        console.error("Error storing OTP:", err);
        return res.status(500).json({ error: "Internal server error" });
      }

      const mailOptions = {
        from: process.env.EMAIL_USER,
        to: email,
        subject: "Your OTP Code",
        text: `Your OTP code is ${otp}. It will expire in 3 minutes.`,
      };

      transporter.sendMail(mailOptions, (error) => {
        if (error) {
          console.error("Error sending email:", error);
          return res.status(500).json({ error: "Error sending email" });
        }

        res.json({ message: "OTP sent" });
      });
    }
  );
});

// Verify OTP
serviceProviderApp.post("/verify-otp", (req, res) => {
  const { email, otp } = req.body;

  db.query(
    "SELECT * FROM service_provider_otps WHERE email = ? AND otp = ?",
    [email, otp],
    (err, results) => {
      if (err) {
        console.error("Error verifying OTP:", err);
        return res.status(500).json({ error: "Internal server error" });
      }

      if (results.length === 0) {
        return res.status(400).json({ error: "Invalid OTP" });
      }

      const record = results[0];
      if (dayjs().isAfter(record.expires_at)) {
        return res.status(400).json({ error: "OTP expired" });
      }

      res.json({ message: "OTP verified" });

      db.query("DELETE FROM service_provider_otps WHERE email = ?", [email]);
    }
  );
});





// Get all services
// Get all services
serviceProviderApp.get("/services", (req, res) => {
  db.query("SELECT * FROM services", (err, results) => {
    if (err) {
      console.error("Error fetching services:", err);
      return res.status(500).json({ error: "Internal server error" });
    }
    res.json(results);
  });
});

// Add new service
serviceProviderApp.post("/services", (req, res) => {
  const { name, description } = req.body;
  db.query("INSERT INTO services (name, description) VALUES (?, ?)", [name, description], (err, results) => {
    if (err) {
      console.error("Error adding service:", err);
      return res.status(500).json({ error: "Internal server error" });
    }
    res.json({ message: "Service added successfully", serviceId: results.insertId });
  });
});

function ensureAuthenticated(req, res, next) {
  if (req.isAuthenticated()) {
    return next();
  }
  res.status(401).json({ error: "Unauthorized" });
}

// Add service provider's service
serviceProviderApp.post("/add-service", ensureAuthenticated, (req, res) => {
  const { serviceId, price } = req.body;
  const serviceProviderId = req.user.id; // Ensure req.user is defined

  console.log("Authenticated User ID:", serviceProviderId); // Debug log

  db.query(
    "INSERT INTO service_providers_services (service_provider_id, service_id, price) VALUES (?, ?, ?)",
    [serviceProviderId, serviceId, price],
    (err) => {
      if (err) {
        console.error("Error adding service provider's service:", err);
        return res.status(500).json({ error: "Internal server error" });
      }
      res.json({ message: "Service provider's service added successfully" });
    }
  );
});


// Express route handler


// Get all orders for a service provider
serviceProviderApp.get('/orders', ensureAuthenticated, async (req, res) => {
  try {
    const serviceProviderId = req.user.id;

    const [orders] = await db.promise().query(`
      SELECT o.OrderID, o.Name, o.Email, o.PhoneNo, o.Address, o.TotalAmount, o.Status, o.CreatedAt,
             oi.ServiceID, oi.Quantity, oi.Price,
             s.name AS ServiceName
      FROM \`order\` o
      JOIN orderitem oi ON o.OrderID = oi.OrderID
      JOIN services s ON oi.ServiceID = s.id
      WHERE o.LSPID = ?
    `, [serviceProviderId]);

    res.json(orders);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Get details of a single order
serviceProviderApp.get('/orders/:orderId', ensureAuthenticated, async (req, res) => {
  try {
    const orderId = req.params.orderId;

    const [orderDetails] = await db.promise().query(`
      SELECT o.OrderID, o.Name, o.Email, o.PhoneNo, o.Address, o.TotalAmount, o.Status, o.CreatedAt,
             oi.ServiceID, oi.Quantity, oi.Price,
             s.name AS ServiceName
      FROM \`order\` o
      JOIN orderitem oi ON o.OrderID = oi.OrderID
      JOIN services s ON oi.ServiceID = s.id
      WHERE o.OrderID = ?
    `, [orderId]);

    if (orderDetails.length === 0) {
      return res.status(404).json({ error: 'Order not found' });
    }

    // Structure the response to include services as an array
    const order = {
      OrderID: orderDetails[0].OrderID,
      Name: orderDetails[0].Name,
      Email: orderDetails[0].Email,
      PhoneNo: orderDetails[0].PhoneNo,
      Address: orderDetails[0].Address,
      TotalAmount: orderDetails[0].TotalAmount,
      Status: orderDetails[0].Status,
      CreatedAt: orderDetails[0].CreatedAt,
      services: orderDetails.map(detail => ({
        ServiceID: detail.ServiceID,
        ServiceName: detail.ServiceName,
        Quantity: detail.Quantity,
        Price: detail.Price
      }))
    };

    res.json(order);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

serviceProviderApp.post('/update-order', ensureAuthenticated, async (req, res) => {
  const { OrderID, PickupTime, DropoffTime } = req.body;

  try {
    await db.promise().query(`
      UPDATE \`order\`
      SET PickupTime = ?, DropoffTime = ?
      WHERE OrderID = ?
    `, [PickupTime || null, DropoffTime || null, OrderID]);

    res.status(200).json({ message: 'Order updated successfully' });
  } catch (error) {
    console.error('Error updating order:', error);
    res.status(500).json({ error: 'Failed to update order' });
  }
});


serviceProviderApp.post('/pickdropverify-otp', async (req, res) => {
  console.log("in pick-drop");
  const { orderId, otp } = req.body;

  try {
    // Check if the OTP is valid and not expired
    const [otpResult] = await db.promise().query(
      'SELECT * FROM pickupdrop WHERE order_id = ? AND otp = ? AND expiry_time > NOW()',
      [orderId, otp]
    );

    if (otpResult.length === 0) {
      return res.status(400).json({ success: false, message: 'Invalid or expired OTP.' });
    }

    // Get the current status of the order
    const [orderResult] = await db.promise().query('SELECT Status FROM `order` WHERE OrderID = ?', [orderId]);
    const currentStatus = orderResult[0]?.Status;

    if (!currentStatus) {
      return res.status(404).json({ success: false, message: 'Order not found.' });
    }

    // Determine the new status
    const newStatus = currentStatus === 'Pending' ? 'Pickup' : 'Completed';

    // Update the order status
    await db.promise().query('UPDATE `order` SET Status = ? WHERE OrderID = ?', [newStatus, orderId]);

    res.json({ success: true, message: 'OTP verified and order status updated successfully!', newStatus });
  } catch (error) {
    console.error('Error verifying OTP:', error);
    res.status(500).json({ success: false, message: 'Failed to verify OTP' });
  }
});


serviceProviderApp.post("/time-updation", (req, res) => {
  const { orderId, pickup, dropup } = req.body;

  // Fetch provider email based on the order ID
  db.query(
    "SELECT Email FROM `order` where OrderID=?",
    [orderId],
    (error, results) => {
      if (error) {
        console.error("Error fetching user email:", error);
        return res.status(500).json({ error: "Failed to fetch provider email" });
      }

      if (results.length === 0) {
        return res.status(404).json({ error: "No user found for this order" });
      }

      const providerEmail = results[0].Email;

      // Format the order details into a string
      

      const mailOptions = {
        from: process.env.EMAIL_USER,
        to: providerEmail,
        subject: "PickTime DropTime update ",
        text: `Expected:\n\nOrder ID: ${orderId}\nPickup Time: ${pickup}\nDropoff Time: ${dropup}`,
      };

      transporter.sendMail(mailOptions, (error, info) => {
        if (error) {
          console.error("Error sending email:", error);
          res.status(500).json({ error: "Failed to send email" });
        } else {
          console.log("Email sent:", info.response);
          res.status(200).json({ message: "Email sent successfully" });
        }
      });
    }
  );
});





serviceProviderApp.post("/forgsend-otp", (req, res) => {
  const { email } = req.body;
  const otp = generateOTP();
  const expiresAt = dayjs().add(3, "minute").toDate();

  // Save OTP to database
  db.query(
    "INSERT INTO spforgotps (email, otp, expires_at) VALUES (?, ?, ?)",
    [email, otp, expiresAt],
    (err) => {
      if (err) {
        console.error("Error storing OTP:", err);
        return res.status(500).json({ error: "Internal server error" });
      }

      // Send OTP via email
      const mailOptions = {
        from: process.env.EMAIL_USER,
        to: email,
        subject: "Your OTP Code For Password Reset",
        text: `Your OTP code is ${otp}. It will expire in 3 minutes.`,
      };

      transporter.sendMail(mailOptions, (error) => {
        if (error) {
          console.error("Error sending email:", error);
          return res.status(500).json({ error: "Error sending email" });
        }

        res.json({ message: "OTP sent" });
      });
    }
  );
});

// Verify OTP
serviceProviderApp.post("/forgverify-otp", (req, res) => {
  const { email, otp } = req.body;

  db.query(
    "SELECT * FROM spforgotps WHERE email = ? AND otp = ?",
    [email, otp],
    (err, results) => {
      if (err) {
        console.error("Error verifying OTP:", err);
        return res.status(500).json({ error: "Internal server error" });
      }

      if (results.length === 0) {
        return res.status(400).json({ error: "Invalid OTP" });
      }

      const record = results[0];
      if (dayjs().isAfter(record.expires_at)) {
        return res.status(400).json({ error: "OTP expired" });
      }

      res.json({ message: "OTP verified" });

      // Optionally, delete OTP after verification
      
    }
  );
});



serviceProviderApp.post("/forgpass", async (req, res) => {
  const { username: email, password } = req.body;

  try {
    // Check if the user exists
    db.query("SELECT * FROM service_providers WHERE email = ?", [email], (err, results) => {
      if (err) {
        console.error("Error checking user:", err);
        return res.status(500).json({ error: "Internal server error" });
      }

      if (results.length === 0) {
        return res.status(404).json({ error: "User not found" });
      }

      // Hash the new password
      bcrypt.hash(password, saltRounds, (err, hash) => {
        if (err) {
          console.error("Error hashing password:", err);
          return res.status(500).json({ error: "Internal server error" });
        }

        // Update the user's password
        db.query(
          "UPDATE service_providers SET password = ? WHERE email = ?",
          [hash, email],
          (err) => {
            if (err) {
              console.error("Error updating password:", err);
              return res.status(500).json({ error: "Internal server error" });
            }

            res.json({ message: "Password updated successfully" });
          }
        );
      });
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Internal server error" });
  }
});


serviceProviderApp.post('/providerlogout', (req, res) => {
  req.session.destroy((err) => {
    if (err) {
      return res.status(500).json({ error: 'Failed to logout' });
    }
    res.clearCookie('connect.sid'); // clear the session cookie
    res.json({ message: 'Logout successful' });
  });
});






export default serviceProviderApp;
