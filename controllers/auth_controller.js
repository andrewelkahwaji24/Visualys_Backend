const User = require("../models/Utilisateur");
const generateToken = require("../utils/generateToken");
const nodemailer = require("nodemailer");
const crypto = require("crypto");

const registerUser = async (req, res) => {
    const { name, email, password } = req.body;
    try {
        const userExists = await User.findOne({ email });
        if (userExists) return res.status(400).json({ message: "User exists" });

        const user = await User.create({ name, email, password });
        res.status(201).json({
            _id: user._id,
            name: user.name,
            email: user.email,
            role: user.role,
            token: generateToken(user._id, user.role),
        });
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
};

// LOGIN
const loginUser = async (req, res) => {
    const { email, password } = req.body;
    try {
        const user = await User.findOne({ email });
        if (user && (await user.matchPassword(password))) {
            res.json({
                _id: user._id,
                name: user.name,
                email: user.email,
                role: user.role,
                token: generateToken(user._id, user.role),
            });
        } else {
            res.status(401).json({ message: "Invalid email or password" });
        }
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
};

// FORGOT PASSWORD (juste token généré pour email)
const forgotPassword = async (req, res) => {
    const { email } = req.body;

    try {
        const user = await User.findOne({ email });

        if (!user) {
            return res.status(200).json({ message: "Un email a été envoyé avec les instructions de réinitialisation." });
        }

        const resetToken = user.getResetPasswordToken();
        await user.save({ validateBeforeSave: false });

        const resetUrl = `https://visualys.fr/reset-password/${resetToken}`;

        const message = `
        <div style="font-family: Arial, sans-serif; line-height: 1.6;">
            <h2>Réinitialisation de votre mot de passe pour Visualys</h2>
            <p>Bonjour,</p>
            <p>Vous avez demandé la réinitialisation de votre mot de passe. Veuillez cliquer sur le lien ci-dessous pour continuer :</p>
            <p style="margin: 20px 0;">
                <a href="${resetUrl}" style="background-color: #007bff; color: white; padding: 12px 20px; text-decoration: none; border-radius: 5px;">
                    Réinitialiser le mot de passe
                </a>
            </p>
            <p>Ce lien expirera dans 1 heure.</p>
            <p>Si vous n'êtes pas à l'origine de cette demande, veuillez ignorer cet email.</p>
        </div>
    `;

        const transporter = nodemailer.createTransport({
            host: process.env.EMAIL_HOST,
            port: process.env.EMAIL_PORT,
            secure: false,
            auth: {
                user: process.env.EMAIL_USER,
                pass: process.env.EMAIL_PASS,
            },
        });

        await transporter.sendMail({
            from: '"Visualys" <no-reply@visualys.fr>',
            to: user.email,
            subject: "Réinitialisation de mot de passe",
            html: message,
        });

        res.status(200).json({ message: "Un email a été envoyé avec les instructions de réinitialisation." });

    } catch (error) {
        console.error("Erreur dans forgotPassword:", error);
        const user = await User.findOne({ email });
        if(user) {
            user.resetPasswordToken = undefined;
            user.resetPasswordExpire = undefined;
            await user.save({ validateBeforeSave: false });
        }
        res.status(500).json({ message: "Erreur lors de l'envoi de l'email." });
    }
};

const resetPassword = async (req, res) => {
    const resetPasswordToken = crypto
        .createHash("sha256")
        .update(req.params.token)
        .digest("hex");

    try {
        const user = await User.findOne({
            resetPasswordToken,
            resetPasswordExpire: { $gt: Date.now() },
        });

        if (!user) {
            return res.status(400).json({ message: "Le lien est invalide ou a expiré." });
        }

        user.password = req.body.password;
        user.resetPasswordToken = undefined;
        user.resetPasswordExpire = undefined;
        await user.save();

        res.status(200).json({ message: "Le mot de passe a été mis à jour avec succès." });

    } catch (error) {
        console.error("Erreur dans resetPassword:", error);
        res.status(500).json({ message: "Erreur du serveur." });
    }
};

// GET CURRENT USER
const getMe = async (req, res) => {
    res.json({
        id: req.user._id,
        name: req.user.name,
        email: req.user.email,
        role: req.user.role,
    });
};

module.exports = {
    registerUser,
    loginUser,
    forgotPassword,
    resetPassword,
    getMe
};