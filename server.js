const express = require("express");
const dotenv = require("dotenv");
const connectDB = require("./config/db");
const authRoutes = require("./routes/authRoutes");
const mailRoutes = require("./routes/mailRoutes");
const fichierRoutes = require("./routes/fichier_upload");


dotenv.config();
connectDB();

const app = express();
app.use(express.json());

// Routes
app.use("/api/auth", authRoutes);
app.use("/api/mail", mailRoutes);
app.use("/api/fichiers", fichierRoutes);


app.get("/", (req, res) => {
  res.send("🚀 API running, MongoDB connected");
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`✅ Server running on port ${PORT}`));
