
const mongoose = require("mongoose");
const projetSchema = require ("./projetSchema");


projetSchema.statics.getAllProjets = async function (userId) {
    if (!userId) throw new Error("User ID is required");
    return this.find({ user: userId });
};


projetSchema.statics.getProjetById = async function (projetId) {
    const projet = await this.findById(projetId);
    if (!projet) throw new Error("Projet not found");
    return projet;
};

projetSchema.methods.createProjet = async function (data) {
    try {
        const projet = new this(data);
        return await projet.save();
    } catch (error) {
        throw new Error("Error creating projet: " + error.message);
    }
};

const Projet = mongoose.model("Projet", projetSchema);
module.exports = Projet;