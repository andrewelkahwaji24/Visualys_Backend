const express = require("express");
const router = express.Router();
const {
  registerUser,
  loginUser,
  forgotPassword,
  getMe,
} = require("../controllers/auth_controller");
const { protect } = require("../middleware/auth_middleware");

const {
  getAllProjets,
  getProjetById,
  createProjet,
} = require("../controllers/projet_controllers");

router.post("/register", registerUser);
router.post("/login", loginUser);
router.post("/forgot-password", forgotPassword);

router.get("/get-all-projects/:id", getAllProjets);
router.get("/get-project/:id", getProjetById);
router.post("/create-project", createProjet);
//router.get("/me", protect, getMe);

module.exports = router;
