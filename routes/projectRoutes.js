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


router.post("/creerProjet" , async(req , res) => {
    try{
        const { user , description , nom_projet , theme} = req.body

        if (!user || !description || !nom_projet || !theme) {
            return res.status(400).json({message: "Touts les champs sont requis"});
        }

        const nouveauProjet = new Projet({
            user ,
            description , 
            nom_projet , 
            theme
        });

        const projet_enregistre = await nouveauProjet.save();

        res.status(201).json({
            message: "Projet creer avec succes",
            projet: projet_enregistre
        });
    } catch(err) {
        console.error("Erreur POST " , err);
        res.status(500).json({error: "Erreur lors de la creation d'un projet"})
    }
});

router.get("/mesProjets/:userId", async (req, res) => {
    try {
        const projets = await Projet.find({ user: req.params.userId });
        const projetsAvecUtilisateur = [];

        for (let projet of projets) {
            const userData = await User.findById(projet.user).select("name");
            const projetObj = projet.toObject();
            projetObj.user = userData ? userData.name : "Unknown";
            projetsAvecUtilisateur.push(projetObj);
        }
        res.json(projetsAvecUtilisateur);
    } catch (err) {
        console.error("Erreur GET /api/projets/mesProjets/:userId :", err);
        res.status(500).json({ error: "Erreur serveur" });
    }
});

router.delete("/:id", async (req, res) => {
  try {
    const projetId = req.params.id;
    const projetSupprime = await Projet.findByIdAndDelete(projetId);

    if (!projetSupprime) {
      return res.status(404).json({ message: "Projet non trouvé" });
    }

    res.json({ message: "Projet supprimé avec succès", projet: projetSupprime });
  } catch (err) {
    console.error("Erreur DELETE /api/projects/:id :", err);
    res.status(500).json({ error: "Erreur serveur" });
  }
});

module.exports = router;