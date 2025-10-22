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
    const count = await user.countDocuments();
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




app.get("/", (req, res) => {
  res.send("API running, MongoDB connected");
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));