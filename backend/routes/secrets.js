import express from "express";

const router = express.Router();

// Define your secrets route
router.get("/", (req, res) => {
  if (req.isAuthenticated()) {
    res.json({ message: "These are the secrets" });
  } else {
    res.status(401).json({ message: "Unauthorized" });
  }
});

export default router;
