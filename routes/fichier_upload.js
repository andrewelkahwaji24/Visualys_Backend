const express = require("express");
const { protect } = require("../middleware/auth_middleware");
const upload = require("../middleware/upload");
const {
  uploadFichier,
  getFichiers,
  getFichierById,
  deleteFichier,
  updateMetadata,
} = require("../controllers/fichier_controller");

const router = express.Router();

router.post("/upload", protect, upload.single("fichier"), uploadFichier);
router.get("/projet/:projetId", protect, getFichiers);
router.get("/:id", protect, getFichierById);
router.delete("/:id", protect, deleteFichier);
router.put("/:id/metadata", protect, updateMetadata);

module.exports = router;
