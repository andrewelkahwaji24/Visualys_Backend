const express = require('express');
const ContactMessage = require('../models/ContactezNous');

const router = express.Router();

router.post('/', async (req, res) => {
  try {
    const nouveauMessage = await ContactMessage.create(req.body);
    res.status(201).json(nouveauMessage);
  } catch (err) {
    console.error('Erreur contact POST:', err);
    res.status(500).json({ message: 'Erreur lors de l\'envoi du message.' });
  }
});

router.get('/', async (req, res) => {
  try {
    const messages = await ContactMessage.find().sort({ createdAt: -1 });
    res.json(messages);
  } catch (err) {
    console.error('Erreur contact GET:', err);
    res.status(500).json({ message: 'Erreur lors de la récupération des messages.' });
  }
});

module.exports = router;
