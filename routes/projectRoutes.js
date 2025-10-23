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

router.get("/", async (req, res) => {
  try {
    const projets = await Projet.find();
    res.json(projets);
  } catch (err) {
    console.error("Erreur GET /api/projects :", err);
    res.status(500).json({ error: "Erreur serveur" });
  }
});


module.exports = router;