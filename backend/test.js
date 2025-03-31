  import nodemailer from "nodemailer";
  import dotenv from "dotenv";

  dotenv.config();

  const transporter = nodemailer.createTransport({
    service: "gmail",
    auth: {
      user: process.env.EMAIL_USER,
      pass: process.env.EMAIL_PASS,
    },
  });

  const mailOptions = {
    from: process.env.EMAIL_USER,
    to: "prathameshkapadne1111@gmail.com", // Replace with a valid recipient email
    subject: "Test Email",
    text: "This is a test email.",
  };

  transporter.sendMail(mailOptions, (error, info) => {
    if (error) {
      console.error("Error sending email:", error);
    } else {
      console.log("Email sent:", info.response);
    }
  });
