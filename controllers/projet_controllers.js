const mongoose = require("mongoose");
const projetSchema = require("../models/projetSchema");

// Create the Projet model
const Projet = require("../models/projet");

// Controller to fetch all projets
const getAllProjets = async (req, res) => {
    try {
        const projets = await Projet.find({ user: req.params.id });
        if (!projets.length) return res.status(404).json({ message: "No projets found" });
        res.status(200).json(projets);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};


// Controller to fetch a single projet by ID
const getProjetById = async (req, res) => {
    try {
        const projet = await Projet.getProjetById(req.params.id); // ✅ call static method
        res.status(200).json(projet);
    } catch (error) {
        res.status(404).json({ message: error.message });
    }
};


// Controller to create a new projet
const createProjet = async (req, res) => {
    try {
        const projet = await Projet.create(req.body);  // ✅ built-in Mongoose method
        res.status(201).json(projet);
    } catch (error) {
        res.status(400).json({ message: "Error creating projet", error });
    }
};

const recuperertheme = async (req, res) => {
    try {
        const themes = await Projet.recuperertheme();
        res.status(200).json(themes);
    }
    catch (error) {
        res.status(500).json({ message: error.message });
    }
};

module.exports = { getAllProjets, getProjetById, createProjet, recuperertheme };
