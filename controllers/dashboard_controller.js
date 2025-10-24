const Utilisateur = require('../models/Utilisateur');

// CONNEXIONS - Semaine
const getConnexionsJour = async (req, res) => {
    try {
        const donnees = [];
        const joursNoms = ['Lun', 'Mar', 'Mer', 'Jeu', 'Ven', 'Sam', 'Dim'];

        const aujourdHui = new Date();
        const jourSemaine = aujourdHui.getDay();
        const diffAvecLundi = jourSemaine === 0 ? -6 : 1 - jourSemaine;
        const lundi = new Date(aujourdHui);
        lundi.setDate(aujourdHui.getDate() + diffAvecLundi);
        lundi.setHours(0, 0, 0, 0);

        for (let i = 0; i < 7; i++) {
            const date = new Date(lundi);
            date.setDate(lundi.getDate() + i);
            date.setHours(0, 0, 0, 0);

            const jourSuivant = new Date(date);
            jourSuivant.setDate(date.getDate() + 1);

            const users = await Utilisateur.find({}, 'connections');
            let compte = 0;
            users.forEach(user => {
                const connexionsDuJour = user.connections.filter(c => {
                    const dateConnexion = new Date(c.date);
                    return dateConnexion >= date && dateConnexion < jourSuivant;
                });
                compte += connexionsDuJour.length;
            });

            donnees.push({
                etiquette: joursNoms[i],
                compte: compte
            });
        }

        res.json(donnees);
    } catch (erreur) {
        console.error('Erreur getConnexionsJour:', erreur);
        res.status(500).json({ message: 'Erreur serveur' });
    }
};

// CONNEXIONS - Mois
const getConnexionsSemaine = async (req, res) => {
    try {
        const donnees = [];

        for (let i = 3; i >= 0; i--) {
            const date = new Date();
            date.setDate(date.getDate() - (i * 7));

            const jourSemaine = date.getDay();
            const diff = date.getDate() - jourSemaine + (jourSemaine === 0 ? -6 : 1);
            const lundi = new Date(date.setDate(diff));
            lundi.setHours(0, 0, 0, 0);

            const dimanche = new Date(lundi);
            dimanche.setDate(lundi.getDate() + 7);

            const users = await Utilisateur.find({}, 'connections');
            let compte = 0;
            users.forEach(user => {
                const connexionsSemaine = user.connections.filter(c => {
                    const dateConnexion = new Date(c.date);
                    return dateConnexion >= lundi && dateConnexion < dimanche;
                });
                compte += connexionsSemaine.length;
            });

            donnees.push({
                etiquette: `S${4-i}`,
                compte: compte
            });
        }

        res.json(donnees);
    } catch (erreur) {
        console.error('Erreur getConnexionsSemaine:', erreur);
        res.status(500).json({ message: 'Erreur serveur' });
    }
};

// CONNEXIONS - Année
const getConnexionsMois = async (req, res) => {
    try {
        const donnees = [];
        const moisNoms = ['Jan', 'Fév', 'Mar', 'Avr', 'Mai', 'Juin', 'Juil', 'Août', 'Sep', 'Oct', 'Nov', 'Déc'];

        const anneeActuelle = new Date().getFullYear();

        for (let mois = 0; mois < 12; mois++) {
            const dateDebut = new Date(anneeActuelle, mois, 1);
            dateDebut.setHours(0, 0, 0, 0);

            const dateFin = new Date(anneeActuelle, mois + 1, 1);
            dateFin.setHours(0, 0, 0, 0);

            const users = await Utilisateur.find({}, 'connections');
            let compte = 0;
            users.forEach(user => {
                const connexionsMois = user.connections.filter(c => {
                    const dateConnexion = new Date(c.date);
                    return dateConnexion >= dateDebut && dateConnexion < dateFin;
                });
                compte += connexionsMois.length;
            });

            donnees.push({
                etiquette: moisNoms[mois],
                compte: compte
            });
        }

        res.json(donnees);
    } catch (erreur) {
        console.error('Erreur getConnexionsMois:', erreur);
        res.status(500).json({ message: 'Erreur serveur' });
    }
};

getInscriptionsJour = async (req, res) => {
    try {
        const donnees = [];
        const joursNoms = ['Lun', 'Mar', 'Mer', 'Jeu', 'Ven', 'Sam', 'Dim'];

        const aujourdHui = new Date();
        const jourSemaine = aujourdHui.getDay();
        const diffAvecLundi = jourSemaine === 0 ? -6 : 1 - jourSemaine;
        const lundi = new Date(aujourdHui);
        lundi.setDate(aujourdHui.getDate() + diffAvecLundi);
        lundi.setHours(0, 0, 0, 0);

        for (let i = 0; i < 7; i++) {
            const date = new Date(lundi);
            date.setDate(lundi.getDate() + i);
            date.setHours(0, 0, 0, 0);

            const jourSuivant = new Date(date);
            jourSuivant.setDate(date.getDate() + 1);

            const compte = await Utilisateur.countDocuments({
                createdAt: { $gte: date, $lt: jourSuivant }
            });

            donnees.push({
                etiquette: joursNoms[i],
                compte: compte
            });
        }

        res.json(donnees);
    } catch (erreur) {
        console.error('Erreur getInscriptionsJour:', erreur);
        res.status(500).json({ message: 'Erreur serveur' });
    }
};

getInscriptionsSemaine = async (req, res) => {
    try {
        const donnees = [];

        for (let i = 3; i >= 0; i--) {
            const date = new Date();
            date.setDate(date.getDate() - (i * 7));

            const jourSemaine = date.getDay();
            const diff = date.getDate() - jourSemaine + (jourSemaine === 0 ? -6 : 1);
            const lundi = new Date(date.setDate(diff));
            lundi.setHours(0, 0, 0, 0);

            const dimanche = new Date(lundi);
            dimanche.setDate(lundi.getDate() + 7);

            const compte = await Utilisateur.countDocuments({
                createdAt: { $gte: lundi, $lt: dimanche }
            });

            donnees.push({
                etiquette: `S${4-i}`,
                compte: compte
            });
        }

        res.json(donnees);
    } catch (erreur) {
        console.error('Erreur getInscriptionsSemaine:', erreur);
        res.status(500).json({ message: 'Erreur serveur' });
    }
};

getInscriptionsMois = async (req, res) => {
    try {
        const donnees = [];
        const moisNoms = ['Jan', 'Fév', 'Mar', 'Avr', 'Mai', 'Juin', 'Juil', 'Août', 'Sep', 'Oct', 'Nov', 'Déc'];

        const anneeActuelle = new Date().getFullYear();

        for (let mois = 0; mois < 12; mois++) {
            const dateDebut = new Date(anneeActuelle, mois, 1);
            dateDebut.setHours(0, 0, 0, 0);

            const dateFin = new Date(anneeActuelle, mois + 1, 1);
            dateFin.setHours(0, 0, 0, 0);

            const compte = await Utilisateur.countDocuments({
                createdAt: { $gte: dateDebut, $lt: dateFin }
            });

            donnees.push({
                etiquette: moisNoms[mois],
                compte: compte
            });
        }

        res.json(donnees);
    } catch (erreur) {
        console.error('Erreur getInscriptionsMois:', erreur);
        res.status(500).json({ message: 'Erreur serveur' });
    }
};

// FICHIERS - Semaine
getUploadsFichiersJour = async (req, res) => {
    try {
        const Fichier = require('../models/Fichier');
        const donnees = [];
        const joursNoms = ['Lun', 'Mar', 'Mer', 'Jeu', 'Ven', 'Sam', 'Dim'];

        const aujourdHui = new Date();
        const jourSemaine = aujourdHui.getDay();
        const diffAvecLundi = jourSemaine === 0 ? -6 : 1 - jourSemaine;
        const lundi = new Date(aujourdHui);
        lundi.setDate(aujourdHui.getDate() + diffAvecLundi);
        lundi.setHours(0, 0, 0, 0);

        for (let i = 0; i < 7; i++) {
            const date = new Date(lundi);
            date.setDate(lundi.getDate() + i);
            date.setHours(0, 0, 0, 0);

            const jourSuivant = new Date(date);
            jourSuivant.setDate(date.getDate() + 1);

            const compte = await Fichier.countDocuments({
                createdAt: { $gte: date, $lt: jourSuivant }
            });

            donnees.push({
                etiquette: joursNoms[i],
                compte: compte
            });
        }

        res.json(donnees);
    } catch (erreur) {
        console.error('Erreur getUploadsFichiersJour:', erreur);
        res.status(500).json({ message: 'Erreur serveur' });
    }
};

// FICHIERS - Mois
getUploadsFichiersSemaine = async (req, res) => {
    try {
        const Fichier = require('../models/Fichier');
        const donnees = [];

        for (let i = 3; i >= 0; i--) {
            const date = new Date();
            date.setDate(date.getDate() - (i * 7));

            const jourSemaine = date.getDay();
            const diff = date.getDate() - jourSemaine + (jourSemaine === 0 ? -6 : 1);
            const lundi = new Date(date.setDate(diff));
            lundi.setHours(0, 0, 0, 0);

            const dimanche = new Date(lundi);
            dimanche.setDate(lundi.getDate() + 7);

            const compte = await Fichier.countDocuments({
                createdAt: { $gte: lundi, $lt: dimanche }
            });

            donnees.push({
                etiquette: `S${4-i}`,
                compte: compte
            });
        }

        res.json(donnees);
    } catch (erreur) {
        console.error('Erreur getUploadsFichiersSemaine:', erreur);
        res.status(500).json({ message: 'Erreur serveur' });
    }
};

// FICHIERS - Année
getUploadsFichiersMois = async (req, res) => {
    try {
        const Fichier = require('../models/Fichier');
        const donnees = [];
        const moisNoms = ['Jan', 'Fév', 'Mar', 'Avr', 'Mai', 'Juin', 'Juil', 'Août', 'Sep', 'Oct', 'Nov', 'Déc'];

        const anneeActuelle = new Date().getFullYear();

        for (let mois = 0; mois < 12; mois++) {
            const dateDebut = new Date(anneeActuelle, mois, 1);
            dateDebut.setHours(0, 0, 0, 0);

            const dateFin = new Date(anneeActuelle, mois + 1, 1);
            dateFin.setHours(0, 0, 0, 0);

            const compte = await Fichier.countDocuments({
                createdAt: { $gte: dateDebut, $lt: dateFin }
            });

            donnees.push({
                etiquette: moisNoms[mois],
                compte: compte
            });
        }

        res.json(donnees);
    } catch (erreur) {
        console.error('Erreur getUploadsFichiersMois:', erreur);
        res.status(500).json({ message: 'Erreur serveur' });
    }
};

module.exports = {
    getInscriptionsJour,
    getInscriptionsSemaine,
    getInscriptionsMois,
    getUploadsFichiersJour,
    getUploadsFichiersSemaine,
    getUploadsFichiersMois,
    getConnexionsJour,
    getConnexionsSemaine,
    getConnexionsMois
};
