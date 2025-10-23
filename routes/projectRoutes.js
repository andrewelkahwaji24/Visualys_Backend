const express = require("express");
const router = express.Router();
const Projet = require("../models/projet");
const User = require("../models/Utilisateur");

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
    const projetsAvecUtilisateur = [];

    for (let projet of projets) {
      const userId = projet.user;
      const userData = await User.findById(userId).select("name");
      const projetObj = projet.toObject();
      projetObj.user = userData ? userData.name : "Unknown";
      projetsAvecUtilisateur.push(projetObj);
    }
    res.json(projetsAvecUtilisateur);
  } catch (err) {
    console.error("Erreur GET /api/projects :", err);
    res.status(500).json({ error: "Erreur serveur" });
  }
});




module.exports = router;