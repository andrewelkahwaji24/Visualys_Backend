const multer = require("multer");
const path = require("path");
const fs = require("fs");

const repertoire_upload = 'uploads';
if (!fs.existsSync(repertoire_upload)) {
    fs.mkdirSync(repertoire_upload);
}

const stockage = multer.diskStorage({
    destination : function(req , fichier , cb){
        cb(null , repertoire_upload);
    },
    filename : function(req , file , cb){
        const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
        const ext = path.extname(fichier.originalname);
        const nom_fichier_sans_ext = path.basename(fichier.originalname, ext);
        cb(null , nom_fichier_sans_ext + '-' + uniqueSuffix + ext);
    }
});

const fileFilter = (req , fichier , cb) => {
    const type_fichiers_valides = ['text/csv', 'application/vnd.ms-excel', 'text/plain'];
    const ext = path.extname(fichier.originalname).toLowerCase();

    if (type_fichiers_valides.includes(fichier.mimetype) || ext === '.csv') {
        cb(null , true);
    } else {
        cb(new Error('Type de fichier non valide'), false);
    }
}

const upload = multer({
    storage: stockage,
    fileFilter: fileFilter,
    limits: {
        fileSize: 1024 * 1024 * 5, 
    }
});
module.exports = upload;

