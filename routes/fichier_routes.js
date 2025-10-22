const express = require("express");
const router = express.Router();
const Fichier = require("../models/Fichier");

router.get("/count", async (req, res) => {
  try {
    const totalFiles = await Fichier.countDocuments();
    res.json({ totalFiles });
  } catch (err) {
    console.error("Error in /api/files/count:", err);
    res.status(500).json({ error: "Server error" });
  }
});

router.get("/total-size", async (req, res) => {
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

module.exports = router;