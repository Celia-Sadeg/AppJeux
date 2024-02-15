import React, { useState, useEffect } from 'react';
import Axios from 'axios';
import './App.css';
import backgroundImage from './assets/img.png'; 

const Scores = ({props}) => {
    const [winner, setWinner]=useState("");
    Axios.post("http:localhost:3001/score", {
        score: props.score,
        nbParties: props.nbParties,
        gagnant:props.gagnant,
        joueur:props.joueur,
    }).then(res => {
            // Enregistre le gagnant de la partie
            setWinner(gagnant);
    });
    return (
    <div><h1>Le gagnant est: {winner}</h1>
        <h2>Votre score : {props.score}</h2></div>
    );
}

export default Scores;