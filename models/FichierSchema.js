const mongoose = require("mongoose");

const fichierSchema = new mongoose.Schema(
    {
        nom_fichier: { type: String, required: true },
        nom_original: { type: String, required: true },
        projet: {type: mongoose.Schema.Types.ObjectId, ref: "Projet", required: true},
        uploaded_by : {type: mongoose.Schema.Types.ObjectId, ref: "User", required: true},
        taille : {type: Number, required: true},
        chemin_fichier : {type: String, required: true},
        mime_type : {type: String, default: "text/csv"},
        delimiter : {type: String, default: ","},
        encoding : {type: String, default: "utf-8"},
        metadata : {
            rowCount: Number,
            columnCount: Number,
            columns : [{
                name:String,
                type:String,
                hasNullValues : Boolean,
                nullCount : Number,
                sampleValues : [String],
            }],
            status:{
                type:String,
                enum: ["uploaded", "processed", "error" , "analyzed"],
                default: "uploaded",
            }
        }
    },
    { timestamps: true }
);

module.exports = fichierSchema;