const express = require('express');
const router = express.Router();
const dashboardCtrl = require('../controllers/dashboard_controller');

router.get('/inscriptions-jour', dashboardCtrl.getInscriptionsJour);
router.get('/inscriptions-semaine', dashboardCtrl.getInscriptionsSemaine);
router.get('/inscriptions-mois', dashboardCtrl.getInscriptionsMois);
router.get('/uploads-fichiers-jour', dashboardCtrl.getUploadsFichiersJour);
router.get('/uploads-fichiers-semaine', dashboardCtrl.getUploadsFichiersSemaine);
router.get('/uploads-fichiers-mois', dashboardCtrl.getUploadsFichiersMois);



module.exports = router;
