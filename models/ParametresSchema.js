const mongoose = require('mongoose');

const parametresSchema = new mongoose.Schema({
  nomSite: { type: String, default: 'VISUALYS' },
  urlSite: { type: String, default: 'https://visualys.example.com' },
  emailAdmin: { type: String, default: 'admin@visualys.com' },
  fuseeauHoraire: { type: String, default: 'Europe/Paris' },
  langue: { type: String, default: 'fr' },
  sessionTimeout: { type: Number, default: 90 },
  tentativesConnexionMax: { type: Number, default: 5 },
  forceMotDePasseComplexe: { type: Boolean, default: true },
  notificationsEmail: { type: Boolean, default: true },
  notificationsPush: { type: Boolean, default: false },
  notificationsNouveauxUtilisateurs: { type: Boolean, default: true },
  notificationsErreurs: { type: Boolean, default: true },
  sauvegardeAutomatique: { type: Boolean, default: true },
  frequenceSauvegarde: { type: String, default: 'quotidienne' },
  retentionDonnees: { type: Number, default: 90 },
  themeParDefaut: { type: String, default: 'auto' },
  taillePolice: { type: String, default: 'medium' },
  maintenanceMode: { type: Boolean, default: false },
  logsDebug: { type: Boolean, default: false },
  cacheActif: { type: Boolean, default: true },
  limiteTailleUpload: { type: Number, default: 50 },
}, { timestamps: true });

module.exports = mongoose.model('Parametres', parametresSchema);
