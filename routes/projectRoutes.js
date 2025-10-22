const express = require("express");
const router = express.Router();
const Projet = require("../models/projet");

router.get("/count", async (req, res) => {
  try {
    const totalProjects = await Projet.countDocuments();
    res.json({ totalProjects });
  } catch (err) {
    console.error("Error in /api/projects/count:", err);
    res.status(500).json({ error: "Server error" });
  }
});

module.exports = router;