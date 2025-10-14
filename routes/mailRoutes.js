const express = require('express');
const router = express.Router();
const transporter = require('../utils/mailer');

router.post('/send/:email', async (req, res) => {
    try {
        const { to, subject, text } = req.body;
        const message = {
            from: "Visualys <no-reply@visualys.fr>",
            to: "" + req.params.email,
            subject: subject || "No Subject",
            text: text || "No Content"
        }
    } catch (error) {
        
    }
});