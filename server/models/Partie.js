const mongoose = require("mongoose");

const PartieSchema = new mongoose.Schema({
    identifiant: {
      type: String,
      required: true,
      unique: true, 
    },
    nomDuJoueur: {
      type: String,
      required: true,
    },
   
  });

const Partie = mongoose.model('Partie', PartieSchema);

module.exports = Partie;
