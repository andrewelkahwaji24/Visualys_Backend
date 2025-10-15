const Fichier = require("../models/Fichier");
const fs = require("fs");
const path = require("path");

const uploadFichier = async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ message: "Aucun fichier uploadé" });
    }

    const { projetId } = req.body;

    if (!projetId) {
      fs.unlinkSync(req.file.path);
      return res.status(400).json({ message: "Projet ID requis" });
    }

    const fichier = await Fichier.create({
      nom_fichier: req.file.filename,
      nom_original: req.file.originalname,
      projet: projetId,
      uploaded_by: req.user._id,
      taille: req.file.size,
      chemin_fichier: req.file.path,
      mime_type: req.file.mimetype,
    });

    res.status(201).json({
      message: "Fichier uploadé avec succès",
      fichier,
    });
  } catch (error) {
    if (req.file) {
      fs.unlinkSync(req.file.path);
    }
    res.status(500).json({ message: error.message });
  }
};

const getFichiers = async (req, res) => {
  try {
    const { projetId } = req.params;
    const fichiers = await Fichier.find({ projet: projetId })
      .populate("uploaded_by", "name email")
      .sort({ createdAt: -1 });

    res.json(fichiers);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const getFichierById = async (req, res) => {
  try {
    const fichier = await Fichier.findById(req.params.id)
      .populate("projet")
      .populate("uploaded_by", "name email");

    if (!fichier) {
      return res.status(404).json({ message: "Fichier non trouvé" });
    }

    res.json(fichier);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const deleteFichier = async (req, res) => {
  try {
    const fichier = await Fichier.findById(req.params.id);

    if (!fichier) {
      return res.status(404).json({ message: "Fichier non trouvé" });
    }

    if (fs.existsSync(fichier.chemin_fichier)) {
      fs.unlinkSync(fichier.chemin_fichier);
    }

    await Fichier.findByIdAndDelete(req.params.id);

    res.json({ message: "Fichier supprimé avec succès" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const updateMetadata = async (req, res) => {
  try {
    const fichier = await Fichier.findById(req.params.id);

    if (!fichier) {
      return res.status(404).json({ message: "Fichier non trouvé" });
    }

    fichier.metadata = req.body.metadata;
    fichier.metadata.status = "analyzed";
    await fichier.save();

    res.json({
      message: "Métadonnées mises à jour",
      fichier,
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = {
  uploadFichier,
  getFichiers,
  getFichierById,
  deleteFichier,
  updateMetadata,
};
