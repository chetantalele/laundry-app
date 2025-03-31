import express from "express";
import bcrypt from "bcrypt";
import mysql from "mysql2";

const router = express.Router();
const saltRounds = 10;

const db = mysql.createConnection({
    host: "localhost",
    user: "root",
    password: "root",
    database: "secrets",
  });
  

db.connect((err) => {
  if (err) {
    console.error("Error connecting to MySQL:", err);
    return;
  }
  console.log("Connected to MySQL database");
});

// Register route
router.post("/", async (req, res) => {
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
                return res
                  .status(500)
                  .json({ error: "Internal server error" });
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

export default router;
