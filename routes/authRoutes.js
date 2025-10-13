const express = require("express");
const router = express.Router();
const {
  registerUser,
  loginUser,
  forgotPassword,
  getMe,
} = require("../controllers/auth_controller");
const { protect } = require("../middleware/auth_middleware");

router.post("/register", registerUser);
router.post("/login", loginUser);
router.post("/forgot-password", forgotPassword);
//router.get("/me", protect, getMe);

module.exports = router;
