import express from "express";
import passport from "passport";

const router = express.Router();

// Login route
router.post(
  "/",
  passport.authenticate("local", {
    successRedirect: "/secrets",
    failureRedirect: "/login",
  })
);

export default router;
