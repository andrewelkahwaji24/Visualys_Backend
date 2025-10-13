const jwt = require("jsonwebtoken");
const dotenv = require("dotenv");

dotenv.config();

/**
 * Génère un token JWT pour un utilisateur
 * @param {string} id - ID de l'utilisateur MongoDB
 * @param {string} role - rôle de l'utilisateur (optionnel)
 * @returns {string} JWT token
 */
const generateToken = (id, role = "user") => {
  return jwt.sign(
    { id, role }, // payload
    process.env.JWT_SECRET, // clé secrète
    { expiresIn: process.env.JWT_EXPIRE || "1d" } // expiration
  );
};

module.exports = generateToken;
