const mongoose = require("mongoose");
const themeSchema = new mongoose.Schema(
    {
        nom: {
            type: String , required:true , unique:true
        }
    }
);

module.exports = themeSchema;