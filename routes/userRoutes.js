const express = require("express");
const router = express.Router();
const User = require("../models/Utilisateur");

router.get("/count", async (req, res) => {
  try {
    const filter = {};
    if (req.query.role) filter.role = req.query.role;
    const count = await User.countDocuments(filter);
    res.json({ totalUsers: count });
  } catch (err) {
    console.error("Error in /api/users/count:", err);
    res.status(500).json({ error: "Server error" });
  }
});

router.get("/", async (req, res) => {
  try {
    const users = await User.find().select('-password');
    const formattedUsers = users.map(u => ({
      id: u._id,
      name: u.name,
      email: u.email,
      role: u.role
    }));
    res.json(formattedUsers);
  } catch (err) {
    console.error("Error fetching users:", err);
    res.status(500).json({ error: "Server error" });
  }
});

router.post("/", async (req, res) => {
  try {
    const { name, email, password, role } = req.body;
    if (!name || !email || !password) {
      return res.status(400).json({ message: "Tous les champs sont obligatoires." });
    }
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ message: "Cet email est déjà utilisé." });
    }
    const newUser = new User({
      name,
      email,
      password,
      role: role || "user",
    });
    await newUser.save();
    res.status(201).json({ message: "Utilisateur créé avec succès", user: newUser });
  } catch (error) {
    console.error("Erreur lors de la création d'utilisateur :", error);
    res.status(500).json({ message: "Erreur serveur" });
  }
});

router.put("/:id", async (req, res) => {
  try {
    const { name, email, role } = req.body;
    const updatedUser = await User.findByIdAndUpdate(
      req.params.id,
      { name, email, role },
      { new: true }
    );
    if (!updatedUser) {
      return res.status(404).json({ message: "Utilisateur non trouvé." });
    }
    res.json({ message: "Utilisateur mis à jour avec succès", user: updatedUser });
  } catch (error) {
    console.error("Erreur lors de la mise à jour :", error);
    res.status(500).json({ message: "Erreur serveur" });
  }
});

router.delete("/:id", async (req, res) => {
  try {
    const deletedUser = await User.findByIdAndDelete(req.params.id);
    if (!deletedUser) {
      return res.status(404).json({ message: "Utilisateur non trouvé." });
    }
    res.json({ message: "Utilisateur supprimé avec succès" });
  } catch (error) {
    console.error("Erreur lors de la suppression de l'utilisateur :", error);
    res.status(500).json({ message: "Erreur serveur" });
  }
});

module.exports = router;
