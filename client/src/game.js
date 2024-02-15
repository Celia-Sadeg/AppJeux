import React, { useState } from 'react';
import './App.css';
import SixPrend from './SixPrend';

function Game() {
  const [vueActuelle, setVueActuelle] = useState('jeu');
  const [nomJoueur, setNomJoueur] = useState(null); // Variable d'état pour le nom du joueur connecté

  const rejoindrePartie = () => {
    setVueActuelle('rejoindre');
  };

  const creerPartie = () => {
    setVueActuelle('creer');
  };

  // Fonction pour gérer la connexion du joueur
  const connecterJoueur = (nom) => {
    setNomJoueur(nom); //  à jour le nom du joueur lors de la connexion
    setVueActuelle('jeu'); //  à la vue de jeu après la connexion
  };

  return (
    <div className="game-container">
      {vueActuelle === 'jeu' && (
        <div className="game-content">
          <h1>SixQuiPrend </h1>
          <p>Voici le contenu du jeu.</p>
          {/* Affichez le nom du joueur s'il est connecté */}
          {nomJoueur && <p>Bonjour {nomJoueur}</p>}
          <div className="button-container">
            <button className="join-button" onClick={rejoindrePartie}>Commencer le jeu!</button>
            {/*<button className="create-button" onClick={creerPartie}>Créer une partie</button>*/}
          </div>
        </div>
      )}

      {(vueActuelle === 'rejoindre' || vueActuelle === 'creer') && (
        <SixPrend nomJoueur={nomJoueur} connecterJoueur={connecterJoueur} />
      )}
    </div>
  );
}

export default Game;

