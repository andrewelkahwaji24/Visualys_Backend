const mongoose = require("mongoose");
const fichierSchema = require("./FichierSchema");

fichierSchema.statics.createFichier = async function (data) {
  if (!data.projet) throw new Error("Projet ID is required");
  return await this.create(data);
};

fichierSchema.statics.getFichiersByProjet = async function (projetId) {
  if (!projetId) throw new Error("Projet ID is required");
  return this.find({ projet: projetId }).sort({ createdAt: -1 });
};

fichierSchema.statics.getFichierById = async function (fichierId) {
  const fichier = await this.findById(fichierId)
    .populate("projet")
    .populate("uploaded_by", "name email");
  if (!fichier) throw new Error("Fichier not found");
  return fichier;
};

fichierSchema.statics.deleteFichier = async function (fichierId) {
  const fichier = await this.findById(fichierId);
  if (!fichier) throw new Error("Fichier not found");
  return await this.findByIdAndDelete(fichierId);
};

fichierSchema.methods.updateMetadata = async function (metadata) {
  this.metadata = metadata;
  this.metadata.status = "analyzed";
  return await this.save();
};

const Fichier = mongoose.model("Fichier", fichierSchema);
module.exports = Fichier;
