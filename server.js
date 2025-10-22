const express = require("express");
const dotenv = require("dotenv");
const cors = require("cors");
const connectDB = require("./config/db");
const authRoutes = require("./routes/authRoutes");
const mailRoutes = require("./routes/mailRoutes");
const fichierRoutes = require("./routes/fichier_upload");
const user = require ("./models/Utilisateur");
const projets = require("./models/projet");
const Fichier = require("./models/Fichier");
dotenv.config();
connectDB();

const app = express();

// CORS Configuration
app.use(cors({
  origin: "http://localhost:3000", // URL de ton frontend React
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH'],
  allowedHeaders: ['Content-Type', 'Authorization']
}));

app.use(express.json());

// Routes
app.use("/api/auth", authRoutes);
app.use("/api/mail", mailRoutes);
app.use("/api/fichiers", fichierRoutes);

app.get("/api/users/count", async (req, res) => {
  try {
    const filter = {};
    if (req.query.role) filter.role = req.query.role;

    const count = await user.countDocuments(filter);
    res.json({ totalUsers: count });
  } catch (err) {
    console.error("Error in /api/users/count:", err);
    res.status(500).json({ error: "Server error" });
  }
});


app.get("/api/projects/count", async (req, res) => {
  try {
    const totalProjects = await projets.countDocuments();
    res.json({ totalProjects });
  } catch (err) {
    console.error("Error in /api/projects/count:", err);
    res.status(500).json({ error: "Server error" });
  }
});

app.get("/api/files/count", async (req, res) => {
  try {
    const totalFiles = await Fichier.countDocuments();
    res.json({ totalFiles });
  } catch (err) {
    console.error("Error in /api/files/count:", err);
    res.status(500).json({ error: "Server error" });
  }
});


app.get("/api/files/total-size", async (req, res) => {
  try {
    const result = await Fichier.aggregate([
      {
        $group: {
          _id: null,
          totalSize: { $sum: "$taille" }
        }
      }
    ]);



    const totalSizeBytes = result[0]?.totalSize || 0;

    const totalSizeMB = (totalSizeBytes / (1024 * 1024)).toFixed(2);

    res.json({ totalSizeMB });
  } catch (err) {
    console.error("Error in /api/files/total-size:", err);
    res.status(500).json({ error: "Server error" });
  }
});

// Route pour récupérer tous les utilisateurs
app.get("/api/users", async (req, res) => {
  try {
    const users = await user.find().select('-password'); // Exclut le mot de passe
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

app.post("/api/users", async (req, res) => {
  try {
    const { name, email, password, role } = req.body;

    if (!name || !email || !password) {
      return res.status(400).json({ message: "Tous les champs sont obligatoires." });
    }

    const existingUser = await user.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ message: "Cet email est déjà utilisé." });
    }

    const newUser = new user({
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


app.put("/api/users/:id", async (req, res) => {
  try {
    const { name, email, role } = req.body;
    const updatedUser = await user.findByIdAndUpdate(
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

app.delete("/api/users/:id", async (req, res) => {
  try {
    const deletedUser = await user.findByIdAndDelete(req.params.id);

    if (!deletedUser) {
      return res.status(404).json({ message: "Utilisateur non trouvé." });
    }

    res.json({ message: "Utilisateur supprimé avec succès" });
  } catch (error) {
    console.error("Erreur lors de la suppression de l'utilisateur :", error);
    res.status(500).json({ message: "Erreur serveur" });
  }
});




app.get("/", (req, res) => {
  res.send("API running, MongoDB connected");
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));