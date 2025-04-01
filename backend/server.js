import express from "express";
import bodyParser from "body-parser";
import mysql from "mysql2";
import bcrypt from "bcrypt";
import passport from "passport";
import { Strategy } from "passport-local";
import session from "express-session";
import cors from "cors";
import dotenv from "dotenv";
import GoogleStrategy from "passport-google-oauth2";
import fs from 'fs';
import PDFDocument from 'pdfkit';
import path from 'path';
import nodemailer from "nodemailer";
import crypto from "crypto";
import dayjs from "dayjs";
import serviceProviderApp from "./serviceProviderServer.js";

const app = express();
const port = 3000;
const saltRounds = 10;
dotenv.config();

app.use(cors({
  origin: [
    "http://localhost:5173", // Local development frontend
    "http://yourfrontenddomain.com", // If your frontend is deployed on a domain
    "http://13.232.118.100",  // Your public IP, if you are testing or accessing directly
  ], 
  credentials: true
}));

app.use(
  session({
    secret: process.env.SESSION_SECRET,
    resave: false,
    saveUninitialized: true,
  })
);
app.use(bodyParser.json());

app.use(passport.initialize());
app.use(passport.session());

const db  = mysql.createPool({
  host: process.env.USER_HOST,
  user: process.env.USER_USER,
  password: process.env.USER_PASSWORD,
  database: process.env.USER_DATABASE,
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit:10,
});


db.getConnection((err, connection) => {
    if(err)
    {
      console.error("Error handling mysql ", err);
      return;
    }
    else{
      console.log("Connected to MYSQL databse for user");
      connection.release();
    }
});

app.get("/", (req, res) => {
  res.json({ message: "Welcome to the API" });
});



function attachUser(req, res, next) {
  if (req.isAuthenticated()) {
    req.userId = req.session.passport.user; // Attach user ID to request
  }
  next();
}

app.use(attachUser);


app.get("/secrets", (req, res) => {
  if (req.isAuthenticated()) {
    res.json({ message:  req.userId });
  } else {
    res.status(401).json({ message: "Unauthorized" });
  }
});

app.post(
  "/login",
  passport.authenticate("local", {
    successRedirect: "/secrets",
    failureRedirect: "/login",
  })
);


//Update User ------------------------------------------------------------------------------
app.post("/update-user", (req, res) => {
  const { phone, address } = req.body;

  const email = req.session.email;

  if (!email) {
    return res.status(401).json({ message: "User not logged in. Please log in first!" });
  }

  if (!phone || !address) {
    return res.status(400).json({ message: "Phone and address are required" });
  }

  const query = `UPDATE userdetails SET phone = ?, address = ? WHERE email = ?`;

  db.query(query, [phone, address, email], (err, result) => {
    if (err) {
      console.error("Error updating user details:", err);
      return res.status(500).json({ message: "Failed to update details. Try again!" });
    }

    if (result.affectedRows > 0) {
      return res.json({ message: "User details updated successfully!" });
    } else {
      return res.status(404).json({ message: "User not found." });
    }
  });
});


app.get(
  "/auth/google",
  passport.authenticate("google", {
    scope: ["profile", "email"],
  })
);

app.get(
  "/auth/google/secrets",
  passport.authenticate("google", {
    successRedirect: "http://localhost:5173/home",
    failureRedirect: "/login",
  })
);


app.post("/register", async (req, res) => {
  const email = req.body.username;
  const password = req.body.password;

  try {
    db.query("SELECT * FROM users WHERE email = ?", [email], (err, results) => {
      if (err) {
        console.error("Error checking user:", err);
        return res.status(500).json({ error: "Internal server error" });
      }

      if (results.length > 0) {
        return res.status(400).json({ error: "User already exists" });
      }

      bcrypt.hash(password, saltRounds, (err, hash) => {
        if (err) {
          console.error("Error hashing password:", err);
          return res.status(500).json({ error: "Internal server error" });
        }

        db.query(
          "INSERT INTO users (email, password) VALUES (?, ?)",
          [email, hash],
          (err, results) => {
            if (err) {
              console.error("Error inserting user:", err);
              return res.status(500).json({ error: "Internal server error" });
            }

            const user = { id: results.insertId, email: email };
            req.login(user, (err) => {
              if (err) {
                return res.status(500).json({ error: "Internal server error" });
              }
              res.json({ message: "Registration successful" });
            });
          }
        );
      });
    });
  } catch (err) {
    console.log(err);
    res.status(500).json({ error: "Internal server error" });
  }
});




const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS,
  },
});

// Generate OTP
function generateOTP() {
  return crypto.randomBytes(3).toString("hex").toUpperCase();
}

// Send OTP
app.post("/send-otp", (req, res) => {
  const { email } = req.body;
  const otp = generateOTP();
  const expiresAt = dayjs().add(3, "minute").toDate();

  // Save OTP to database
  db.query(
    "INSERT INTO otps (email, otp, expires_at) VALUES (?, ?, ?)",
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
app.post("/verify-otp", (req, res) => {
  const { email, otp } = req.body;

  db.query(
    "SELECT * FROM otps WHERE email = ? AND otp = ?",
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
      db.query("DELETE FROM otps WHERE email = ?", [email]);
    }
  );
});

passport.use(
  new Strategy(async function verify(username, password, done) {
    try {
      db.query("SELECT * FROM users WHERE email = ?", [username], (err, results) => {
        if (err) {
          console.error("Error finding user:", err);
          return done(err);
        }

        if (results.length === 0) {
          return done(null, false, { message: "User not found" });
        }

        const user = results[0];
        const storedHashedPassword = user.password;
        bcrypt.compare(password, storedHashedPassword, (err, valid) => {
          if (err) {
            console.error("Error comparing passwords:", err);
            return done(err);
          }
          if (valid) {
            return done(null, user);
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


passport.use(
  "google",
  new GoogleStrategy(
    {
      clientID: process.env.GOOGLE_CLIENT_ID,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET,
      callbackURL: "http://localhost:3000/auth/google/secrets",
      userProfileURL: "https://www.googleapis.com/oauth2/v3/userinfo",
    },
    async (accessToken, refreshToken, profile, cb) => {
      try {
        const email = profile.emails[0].value; // Access the email correctly
        const [rows] = await db.promise().query("SELECT * FROM users WHERE email = ?", [email]);
        
        if (rows.length === 0) {
          const [newUser] = await db.promise().query(
            "INSERT INTO users (email, password) VALUES (?, ?)",
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
  db.query("SELECT * FROM users WHERE id = ?", [id], (err, results) => {
    if (err) {
      return done(err);
    }
    const user = results[0];
    done(null, user);
  });
});




function ensureAuthenticatedu(req, res, next) {
  if (req.isAuthenticated()) {
    return next();
  }
  res.status(401).json({ error: "Unauthorized" });
}


app.get('/orders', ensureAuthenticatedu, async (req, res) => {
  try {
    const providerId = req.user.id; // Use LSPID to filter orders for the provider
    console.log(providerId);
    const [orders] = await db.promise().query(`
      SELECT o.OrderID, o.TotalAmount, o.Status, o.CreatedAt, 
             oi.ServiceID, s.name AS ServiceName, oi.Quantity, oi.Price
      FROM \`order\` o
      JOIN orderitem oi ON o.OrderID = oi.OrderID
      JOIN services s ON oi.ServiceID = s.id
      WHERE o.CustomerId = ?;
    `, [providerId]);
      console.log(orders);
    res.json(orders);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Internal server error' });
  }
});


app.get('/orders/:orderId', ensureAuthenticatedu, async (req, res) => {
  try {
    const providerId = req.user.id; // Assuming user authentication provides the provider ID
    const { orderId } = req.params;

    // Query to fetch details of a specific order for the provider
    const orderQuery = `
      SELECT o.OrderID, o.TotalAmount, o.Status, o.CreatedAt, o.PickupTime, o.DropoffTime,
             oi.ServiceID, s.name AS ServiceName, oi.Quantity, oi.Price
      FROM \`order\` o
      JOIN orderitem oi ON o.OrderID = oi.OrderID
      JOIN services s ON oi.ServiceID = s.id
      WHERE o.OrderID = ? AND o.CustomerId = ?;
    `;

    const [orders] = await db.promise().query(orderQuery, [orderId, providerId]);

    if (orders.length === 0) {
      return res.status(404).json({ error: 'Order not found' });
    }



   
    // Create order object with services
    const orderDetails = {
      OrderID: orders[0].OrderID,
      TotalAmount: orders[0].TotalAmount,
      Status: orders[0].Status,
      CreatedAt: orders[0].CreatedAt,
      PickupTime: orders[0].PickupTime,
      DropoffTime: orders[0].DropoffTime,
      services: orders.map(({ ServiceID, ServiceName, Quantity, Price }) => ({
        ServiceID,
        ServiceName,
        Quantity,
        Price,
      })),
    };

    res.json(orderDetails);
  } catch (error) {
    console.error('Failed to fetch order details:', error);
    res.status(500).json({ error: 'Failed to fetch order details' });
  }
});



app.get('/user/providers', async (req, res) => {
  try {
    const [providers] = await db.promise().query('SELECT id, name, address, lat, \`long\` FROM service_providers');
    res.json(providers);
  } catch (error) {
    console.error('Failed to fetch service providers:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});



app.get('/user/providers/:providerId/services', async (req, res) => {
  try {
    const providerId = req.params.providerId;

    // Fetch services and prices for a particular provider
    const [services] = await db.promise().query(`
      SELECT s.id AS ServiceID, s.name AS ServiceName, p.price AS Price
      FROM services s
      JOIN service_providers_services p ON s.id = p.service_id
      WHERE p.service_provider_id = ?
    `, [providerId]);
    console.log(services);

    res.json(services);
  } catch (error) {
    console.error('Failed to fetch provider services:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});



app.post('/api/order', async (req, res) => {
  const { customerID, name, email, phone, address, providerId, totalAmount, pickupTime, dropoffTime } = req.body;

  try {
    const [result] = await db.promise().query(
      `INSERT INTO \`order\` (CustomerID, Name, Email, PhoneNo, Address, LSPID, TotalAmount, PickupTime, DropoffTime)
       VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)`,
      [customerID, name, email, phone, address, providerId, totalAmount, pickupTime, dropoffTime]
    );

    res.json({ orderId: result.insertId });
  } catch (error) {
    console.error('Failed to create order:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

app.post('/api/orderitem', async (req, res) => {
  const { orderID, serviceID, quantity, price } = req.body;

  try {
    await db.promise().query(
      `INSERT INTO \`orderitem\` (OrderID, ServiceID, Quantity, Price)
       VALUES (?, ?, ?, ?)`,
      [orderID, serviceID, quantity, price]
    );

    res.json({ status: 'success' });
  } catch (error) {
    console.error('Failed to create order item:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

function ensureAuthenticated(req, res, next) {
  if (req.isAuthenticated()) {
    return next();
  }
  res.status(401).json({ error: 'Unauthorized' });
}

// Route to get user ID
app.get('/api/user/me', ensureAuthenticated, (req, res) => {
  res.json({ id: req.user.id });
});



app.get('/user/orders', ensureAuthenticated, async (req, res) => {
  try {
    const usercId = req.user.id;

    const [orders] = await db.promise().query(`
      SELECT o.OrderID, o.Name, o.Email, o.PhoneNo, o.Address, o.TotalAmount, o.Status, o.CreatedAt,
             oi.ServiceID, oi.Quantity, oi.Price, sp.name,
             s.name AS ServiceName
      FROM \`order\` o
      JOIN orderitem oi ON o.OrderID = oi.OrderID
      JOIN services s ON oi.ServiceID = s.id
      JOIN service_providers sp ON sp.id=o.LSPID
      WHERE o.CustomerID= ?
    `, [usercId]);
    console.log(orders);
    res.json(orders);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Internal server error' });
  }
});


app.get('/user/orders/:orderId', ensureAuthenticated, async (req, res) => {
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


app.post('/user/update-order', ensureAuthenticated, async (req, res) => {
  const { OrderID, PickupTime, DropoffTime } = req.body;
  console.log(OrderID);

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



// Send OTP
app.post("/user/send-orderconfirmation", (req, res) => {
  const { userem, orderId, details, total } = req.body;

  const transporter = nodemailer.createTransport({
    service: "gmail",
    auth: {
      user: process.env.EMAIL_USER,
      pass: process.env.EMAIL_PASS,
    },
  });

  // Format the order details into a string -----------------------------------------------------------------------------------
  const orderDetailsString = details
    .map((service) => {
      const price = parseFloat(service.price);
      const formattedPrice = isNaN(price) ? 'N/A' : price.toFixed(2);
      return `Service Name: ${service.serviceName}, Quantity: ${service.quantity}, Price: Rs${formattedPrice}`;
    })
    .join("\n");

    const mailOptions = {
      from: process.env.EMAIL_USER,
      to: userem,
      subject: "✅ Order Confirmation - DryMe Laundry Services",
      text: `Dear Valued Customer,
  
  Thank you for choosing DryMe Laundry Services! 🧺  
  
  We are pleased to inform you that your order has been successfully received and is now being processed.  
  
  ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━  
  📋 Order Summary
  ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━  
  🔹 Order Reference: ${orderId}  
  
  ${orderDetailsString}  
  
  💰 Total Amount: Rs. ${total.toFixed(2)}  
  ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━  
  
  📌 Next Steps: 
  ✔️ Your items will be professionally cleaned with care.  
  ✔️ Our team ensures the highest standards for your garments.  
  ✔️ You will receive updates regarding your order status.  
  
  📞 Need Assistance?
  Our dedicated customer support team is always here to help. If you have any questions about your order, feel free to reach out to us.  
  
  Thank you for trusting **DryMe Laundry Services. We appreciate your business!  
  
  Best Regards,  
  DryMe Laundry Services Team ✨  
  
  ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━  
  🔔 Note: This is an automated message. For assistance, please contact our support team.  
  
  🏷️ Order Tags: #DryMeLaundry #PremiumCleaning #ExceptionalService  
  `,
  };
  
  
  transporter.sendMail(mailOptions, (error, info) => {
    if (error) {
      console.error("Error sending email:", error);
      res.status(500).json({ error: 'Failed to send email' });
    } else {
      console.log("Email sent:", info.response);
      res.status(200).json({ message: 'Email sent successfully' });
    }
  });
});



app.post("/provider/send-orderconfirmation", (req, res) => {
  const { orderId, details, total } = req.body; 

//Format order details into a string
// app.post("/provider/send-orderconfirmation", (req, res) => {
//   const { orderId, details, total, userEmail } = req.body;

//   if (!orderId || !details || !total || !userEmail) {
//     return res.status(400).json({ error: "Missing required fields" });
//   }

//   const orderDetailsString = details
//     .map((service, index) => {
//       const price = parseFloat(service.price);
//       const formattedPrice = isNaN(price) ? "N/A" : `Rs ${price.toFixed(2)}`;
//       const formattedQuantity = service.quantity || "N/A";

//       return `${index + 1}. Service: ${service.serviceName}\n   Quantity: ${formattedQuantity}\n   Price per unit: ${formattedPrice}\n   Subtotal: Rs ${(price * service.quantity).toFixed(2)}`;
//     })
//     .join("\n\n");

//   const mailOptions = {
//     from: process.env.EMAIL_USER,
//     to: userEmail,
//     subject: "Order Confirmation - Laundry Service",
//     text: `Dear Customer,\n\nThank you for using our laundry service. Your order has been confirmed.\n\nOrder Details:\n\nOrder ID: ${orderId}\n\n${orderDetailsString}\n\nTotal Amount: Rs ${total.toFixed(2)}\n\nWe appreciate your trust in our service.\n\nBest Regards,\nDryMe Team`,
//   };

//   transporter.sendMail(mailOptions, (error, info) => {
//     if (error) {
//       console.error("Error sending email:", error);
//       res.status(500).json({ error: "Failed to send email" });
//     } else {
//       console.log("Email sent:", info.response);
//       res.status(200).json({ message: "Order confirmation email sent successfully" });
//     }
//   });
// });


  // Fetch provider email based on the order ID
  db.query(
    "SELECT service_providers.email FROM `order` JOIN service_providers ON `order`.LSPID = service_providers.id WHERE `order`.OrderID = ?",
    [orderId],
    (error, results) => {
      if (error) {
        console.error("Error fetching provider email:", error);
        return res.status(500).json({ error: "Failed to fetch provider email" });
      }

      if (results.length === 0) {
        return res.status(404).json({ error: "No provider found for this order" });
      }

      const providerEmail = results[0].email;

      // Format the order details into a string
      const orderDetailsString = details
        .map((service) => {
          const price = parseFloat(service.price);
          const formattedPrice = isNaN(price) ? 'N/A' : price.toFixed(2);
          return `Service Name: ${service.serviceName}, Quantity: ${service.quantity}, Price: $${formattedPrice}`;
        })
        .join("\n");

      const mailOptions = {
        from: process.env.EMAIL_USER,
        to: providerEmail,
        subject: "New Order Received",
        text: `You have received a new order:\n\nOrder ID: ${orderId}\n${orderDetailsString}\nTotal Amount: ${total}`,
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



app.post('/user/send-otp', async (req, res) => {
  const { orderId } = req.body;

  // Validate the orderId
  if (!orderId) {
    return res.status(400).json({ error: 'Order ID is required' });
  }

  try {
    // Fetch user email from the order table
    const [orderRows] = await db.promise().query(
      'SELECT email FROM `order` WHERE OrderID = ?',
      [orderId]
    );

    if (orderRows.length === 0) {
      return res.status(404).json({ error: 'Order not found' });
    }

    const userEmail = orderRows[0].email;

    // Generate OTP
    const otp = Math.floor(100000 + Math.random() * 900000).toString();
    const expiresAt = new Date(Date.now() + 2 * 60 * 1000); // 2 minutes from now

    // Save OTP and expiration time in the pickupdrop table
    await db.promise().query(
      'INSERT INTO pickupdrop (order_id, otp, expiry_time) VALUES (?, ?, ?)',
      [orderId, otp, expiresAt]
    );

    // Set up nodemailer transporter
    const transporter = nodemailer.createTransport({
      service: 'gmail',
      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS,
      },
    });

    // Send OTP email
    const mailOptions = {
      from: process.env.EMAIL_USER,
      to: userEmail,
      subject: 'Your OTP Code',
      text: `Here is your OTP code: ${otp}. It will expire in 2 minutes.`,
    };

    transporter.sendMail(mailOptions, (error, info) => {
      if (error) {
        console.error('Error sending OTP email:', error);
        return res.status(500).json({ error: 'Failed to send OTP email' });
      } else {
        console.log('OTP email sent:', info.response);
        return res.status(200).json({ message: 'OTP sent successfully' });
      }
    });
  } catch (error) {
    console.error('Error handling OTP request:', error);
    return res.status(500).json({ error: 'Internal Server Error' });
  }
});


app.post('/user/cancel-order', (req, res) => {
  const { orderId } = req.body;

  if (!orderId) {
    return res.status(400).json({ message: 'Order ID is required.' });
  }

  const query = 'UPDATE `order` SET Status = ? WHERE OrderID = ?';
  db.query(query, ['Cancelled', orderId], (error, results) => {
    if (error) {
      console.error('Error updating order status:', error);
      return res.status(500).json({ message: 'Failed to cancel order.' });
    }

    if (results.affectedRows === 0) {
      return res.status(404).json({ message: 'Order not found.' });
    }

    res.json({ message: 'Order cancelled successfully.' });
  });
});




app.post('/user/cancel-orderconfirmation', async (req, res) => {
  const { orderId } = req.body;

  // Validate the orderId
  if (!orderId) {
    return res.status(400).json({ error: 'Order ID is required' });
  }

  try {
    // Fetch user email from the order table
    const [orderRows] = await db.promise().query(
      'SELECT email FROM `order` WHERE OrderID = ?',
      [orderId]
    );

    if (orderRows.length === 0) {
      return res.status(404).json({ error: 'Order not found' });
    }

    const userEmail = orderRows[0].email;

    
   

    // Set up nodemailer transporter
    const transporter = nodemailer.createTransport({
      service: 'gmail',
      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS,
      },
    });

    // Send OTP email
    const mailOptions = {
      from: process.env.EMAIL_USER,
      to: userEmail,
      subject: 'Order Cancel Successfully',
      text: `Order Id: ${orderId}.\n Order Cancelled Successfully.`,
    };

    transporter.sendMail(mailOptions, (error, info) => {
      if (error) {
        console.error('Error sending cancel email:', error);
        return res.status(500).json({ error: 'Failed to send cancel email' });
      } else {
        console.log('cancel email sent:', info.response);
        return res.status(200).json({ message: 'cancel sent successfully' });
      }
    });
  } catch (error) {
    console.error('Error handling cancel request:', error);
    return res.status(500).json({ error: 'Internal Server Error' });
  }
});



app.post("/provider/cancel-orderconfirmation", (req, res) => {
  const { orderId} = req.body;

  // Fetch provider email based on the order ID
  db.query(
    "SELECT service_providers.email FROM `order` JOIN service_providers ON `order`.LSPID = service_providers.id WHERE `order`.OrderID = ?",
    [orderId],
    (error, results) => {
      if (error) {
        console.error("Error fetching provider email:", error);
        return res.status(500).json({ error: "Failed to fetch provider email" });
      }

      if (results.length === 0) {
        return res.status(404).json({ error: "No provider found for this order" });
      }

      const providerEmail = results[0].email;

     
      

      const mailOptions = {
        from: process.env.EMAIL_USER,
        to: providerEmail,
        subject: "Order Cancelled",
        text: `Order Cancelled:\n\nOrder ID: ${orderId}`,
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



app.post("/forgsend-otp", (req, res) => {
  const { email } = req.body;
  const otp = generateOTP();
  const expiresAt = dayjs().add(3, "minute").toDate();

  // Save OTP to database
  db.query(
    "INSERT INTO forgotps (email, otp, expires_at) VALUES (?, ?, ?)",
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
app.post("/forgverify-otp", (req, res) => {
  const { email, otp } = req.body;

  db.query(
    "SELECT * FROM forgotps WHERE email = ? AND otp = ?",
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



app.post("/forgpass", async (req, res) => {
  const { username: email, password } = req.body;

  try {
    // Check if the user exists
    db.query("SELECT * FROM users WHERE email = ?", [email], (err, results) => {
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
          "UPDATE users SET password = ? WHERE email = ?",
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


app.post('/userlogout', (req, res) => {
  req.session.destroy((err) => {
    if (err) {
      return res.status(500).json({ error: 'Failed to logout' });
    }
    res.clearCookie('connect.sid'); // clear the session cookie
    res.json({ message: 'Logout successful' });
  });
});







app.use("/service-provider", serviceProviderApp);

app.listen(port, '0.0.0.0', () => {
  console.log(`Server running on port ${port}`);
});


