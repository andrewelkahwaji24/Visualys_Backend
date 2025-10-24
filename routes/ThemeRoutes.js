const express = require("express");
const router = express.Router();
const Theme = require("../models/Theme");

router.get("/themes", async (req, res) => {
    const themes = await Theme.find();
    res.json(themes);
});

router.post("/themes", async (req, res) => {
    const { nom } = req.body;
    const theme = new Theme({ nom });
    await theme.save();
    res.status(201).json(theme);
});

module.exports = router