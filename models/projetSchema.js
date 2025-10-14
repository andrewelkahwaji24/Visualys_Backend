const mongoose = require("mongoose");

const projetSchema = new mongoose.Schema(
    {
        user: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User",
            required: true,
        },
        description: { type: String, required: true },
        nom_projet: { type: String, required: true },
        theme: { type: String, required: true },
        validite: { type: Boolean, default: false },
        date_creation: { type: Date, default: Date.now },
    },
    { timestamps: true }
);

module.exports = projetSchema;
