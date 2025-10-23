const express = require('express');
const Parametres = require('../models/ParametresSchema');

const router = express.Router();

router.get('/', async (req, res) => {
  try {
    let parametres = await Parametres.findOne();
    if (!parametres) {
      parametres = await Parametres.create({}); 
    }
    res.json(parametres);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Erreur serveur' });
  }
});

router.put('/', async (req, res) => {
  try {
    const updated = await Parametres.findOneAndUpdate({}, req.body, { new: true, upsert: true });
    res.json(updated);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Erreur lors de la mise à jour' });
  }
});

router.post('/reset', async (req, res) => {
  try {
    await Parametres.deleteMany({});
    const defaults = await Parametres.create({});
    res.json(defaults);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Erreur lors de la réinitialisation' });
  }
});

module.exports = router;
