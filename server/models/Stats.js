const mongoose = require("mongoose");

const StatsSchema = new mongoose.Schema({
    points: {
        type: Number,
        required: true,
    },
    nbParties: {
        type: Number,
        required: true
    },
    victoires: {
        type: Number,
        required: false,
    },
    idJoueur: {
        type: Number,
        required:true
    }
}, {
    virtuals: {
        setNbParties(){
            this.nbParties+=1;
        },
        setVictories(){
            this.victoires+=1;
        },
        setScore(s){
            this.points*=this.nbParties-1;
            this.points+=s;
            this.points*=1/this.nbParties;
        },
    }
});

const StatsModel = mongoose.model("Stats", StatsSchema);

module.exports = StatsModel; 
