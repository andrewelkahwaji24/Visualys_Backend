const express = require("express");
const router = express.Router();
const transporter = require("../utils/mailer");

router.post("/send/:email", async (req, res) => {
    try {
        const recipient = req.params.email;

        if (!recipient) {
            return res.status(400).json({ message: "Recipient email is required" });
        }

        // Generate reset link first
        const resetLink = `https://visualys.fr/reset-password?email=${encodeURIComponent(
            recipient
        )}`;

        // Declare subject and body AFTER that
        const subject = "Réinitialisation de votre mot de passe - Visualys";

        const text = `Bonjour,

Vous avez demandé la réinitialisation de votre mot de passe sur Visualys.
Veuillez cliquer sur le lien ci-dessous pour le réinitialiser :

${resetLink}

Si vous n'êtes pas à l'origine de cette demande, ignorez simplement cet e-mail.`;

        const html = `
      <div style="font-family: Arial, sans-serif; line-height: 1.5;">
        <h2>Réinitialisation de votre mot de passe</h2>
        <p>Bonjour,</p>
        <p>Vous avez demandé la réinitialisation de votre mot de passe sur <strong>Visualys</strong>.</p>
        <p>Cliquez sur le bouton ci-dessous pour le réinitialiser :</p>
        <p>
          <a href="${resetLink}" 
             style="display:inline-block;padding:10px 20px;background:#007bff;color:white;text-decoration:none;border-radius:6px;">
             Réinitialiser le mot de passe
          </a>
        </p>
        <p>Si vous n'êtes pas à l'origine de cette demande, ignorez simplement cet e-mail.</p>
        <hr>
        <p style="font-size: 0.9em;">&copy; ${new Date().getFullYear()} Visualys. Tous droits réservés.</p>
      </div>
    `;

        // Build message object
        const message = {
            from: "Visualys <no-reply@visualys.fr>",
            to: recipient,
            subject,
            text,
            html,
        };

        // Send the email
        const info = await transporter.sendMail(message);

        res.status(200).json({
            message: "Password reset email sent successfully",
            recipient,
            resetLink,
            response: info.response,
        });
    } catch (error) {
        console.error("Error sending email:", error);
        res.status(500).json({
            message: "Error sending email",
            error: error.message,
        });
    }
});

module.exports = router;
