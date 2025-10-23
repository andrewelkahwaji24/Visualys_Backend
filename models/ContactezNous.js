const mongoose = require('mongoose');

const contactMessageSchema = new mongoose.Schema({
  nomComplet: { type: String, required: true },
  email: { type: String, required: true },
  sujet: { type: String, required: true },
  message: { type: String, required: true },
  statut: { type: String, default: 'non lu' }
}, { timestamps: true });

module.exports = mongoose.model('ContactMessage', contactMessageSchema);
