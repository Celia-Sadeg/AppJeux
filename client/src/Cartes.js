import React, { useState } from 'react';
import './Cartes.css';
import { ReactComponent as Carte1 } from './cartes/1.svg';
import { ReactComponent as Carte2 } from './cartes/2.svg';
import { ReactComponent as Carte3 } from './cartes/3.svg';
import { ReactComponent as Carte4 } from './cartes/4.svg';
import { ReactComponent as Carte5 } from './cartes/5.svg';
import { ReactComponent as Carte6 } from './cartes/6.svg';
import { ReactComponent as Carte7 } from './cartes/7.svg';
import { ReactComponent as Carte8 } from './cartes/8.svg';
import { ReactComponent as Carte9 } from './cartes/9.svg';
import { ReactComponent as Carte10 } from './cartes/10.svg';
import { ReactComponent as Carte11 } from './cartes/70.svg';
import { ReactComponent as Carte12 } from './cartes/50.svg';
import { ReactComponent as Carte13 } from './cartes/60.svg';
import { ReactComponent as Carte14 } from './cartes/65.svg';


function Cartes() {
  const positionsParDefaut = {};
  for (let i = 1; i <= 24; i++) {
    positionsParDefaut[i] = { vide: true, composant: null, carteID: null }; // Aucune carte par défaut
  }

  // on Spécifie les cartes pour certaines positions
  positionsParDefaut[1] = { vide: false, composant: null, carteID: 1 };
  positionsParDefaut[7] = { vide: false, composant: null, carteID: 2 };
  positionsParDefaut[13] = { vide: false, composant: null, carteID: 3 };
  positionsParDefaut[19] = { vide: false, composant: null, carteID: 4 };

  const [positions, setPositions] = useState(positionsParDefaut);
  const [carteSelectionnee, setCarteSelectionnee] = useState(null);

  // Fonction pour sélectionner une carte
  const selectionnerCarte = (composantCarte) => {
    setCarteSelectionnee(composantCarte);
  };

  // Fonction pour désélectionner la carte
  const deselectionnerCarte = () => {
    setCarteSelectionnee(null);
  };

  // Fonction pour déplacer une carte vers une nouvelle position
  const deplacerCarte = (nouvelleIdPosition) => {
    // Vérifiez si une carte est actuellement sélectionnée
    if (carteSelectionnee) {
      // Créez une copie de l'état actuel des positions pour éviter de modifier directement l'état
      const nouvellesPositions = { ...positions };
  
      // Trouvez l'ancienne position de la carte sélectionnée
      let anciennePosition = null;
      for (const position in nouvellesPositions) {
        if (nouvellesPositions[position].carteID === carteSelectionnee.props.id) {
          anciennePosition = position;
          break;
        }
      }
  
      // Si l'ancienne position est trouvée, devient vide
      if (anciennePosition !== null) {
        nouvellesPositions[anciennePosition] = { vide: true, carteID: null };
      }
  
      // Mettre à jour la nouvelle position avec la carte sélectionnée
      nouvellesPositions[nouvelleIdPosition] = { vide: false, carteID: carteSelectionnee.props.id };
  
      // Mettre à jour l'état global des positions pour refléter les changements
      setPositions(nouvellesPositions);
  
      // Réinitialiser la carte sélectionnée, car elle a été déplacée
      setCarteSelectionnee(null);
    }
  };
  

  const renderPositions = () => {
    let lignes = [];
    for (let i = 0; i < 4; i++) {
      let positionsLigne = [];
      for (let j = 1; j <= 6; j++) {
        let idPosition = i * 6 + j;
        const carteID = positions[idPosition].carteID;
        const estVide = positions[idPosition].vide;
        positionsLigne.push(
          <div
            key={idPosition}
            className={`position ${estVide ? 'vide' : ''}`}
            onClick={() => carteSelectionnee && deplacerCarte(idPosition)}
          >
            {carteID !== null ? (
              <div className="carte">
                {carteID === 1 && <Carte1 id={1} onClick={() => deplacerCarte(idPosition)} />}
                {carteID === 2 && <Carte2 id={2} onClick={() => deplacerCarte(idPosition)} />}
                {carteID === 3 && <Carte3 id={3} onClick={() => deplacerCarte(idPosition)} />}
                {carteID === 4 && <Carte4 id={4} onClick={() => deplacerCarte(idPosition)} />}
                {carteID === 5 && <Carte5 id={5} onClick={() => deplacerCarte(idPosition)} />}
                {carteID === 6 && <Carte6 id={6} onClick={() => deplacerCarte(idPosition)} />}
                {carteID === 7 && <Carte7 id={7} onClick={() => deplacerCarte(idPosition)} />}
                {carteID === 8 && <Carte8 id={8} onClick={() => deplacerCarte(idPosition)} />}
                {carteID === 9 && <Carte9 id={9} onClick={() => deplacerCarte(idPosition)} />}
                {carteID === 10 && <Carte10 id={10} onClick={() => deplacerCarte(idPosition)} />}
              </div>
            ) : (
              `Position ${idPosition}`
            )}
          </div>
        );
      }
      lignes.push(
        <div key={i} className="ligne">
          {positionsLigne}
        </div>
      );
    }
    return lignes;
  };

  return (
    <div className="conteneur-sixprend">
      {renderPositions()}
      <div className="conteneur-cartes">
        {/* un bouton pour désélectionner la carte */}
        {carteSelectionnee && <button onClick={deselectionnerCarte}>Désélectionner</button>}

        <Carte1 id={1} className={`carte ${carteSelectionnee && carteSelectionnee.props.id === 1 ? 'selectionnee' : ''}`} onClick={() => selectionnerCarte(<Carte1 id={1} />)} />
        <Carte2 id={2} className={`carte ${carteSelectionnee && carteSelectionnee.props.id === 2 ? 'selectionnee' : ''}`} onClick={() => selectionnerCarte(<Carte2 id={2} />)} />
        <Carte3 id={3} className={`carte ${carteSelectionnee && carteSelectionnee.props.id === 3 ? 'selectionnee' : ''}`} onClick={() => selectionnerCarte(<Carte3 id={3} />)} />
        <Carte4 id={4} className={`carte ${carteSelectionnee && carteSelectionnee.props.id === 4 ? 'selectionnee' : ''}`} onClick={() => selectionnerCarte(<Carte4 id={4} />)} />
        <Carte5 id={5} className={`carte ${carteSelectionnee && carteSelectionnee.props.id === 5 ? 'selectionnee' : ''}`} onClick={() => selectionnerCarte(<Carte5 id={5} />)} />
        <Carte6 id={6} className={`carte ${carteSelectionnee && carteSelectionnee.props.id === 6 ? 'selectionnee' : ''}`} onClick={() => selectionnerCarte(<Carte6 id={6} />)} />
        <Carte7 id={7} className={`carte ${carteSelectionnee && carteSelectionnee.props.id === 7 ? 'selectionnee' : ''}`} onClick={() => selectionnerCarte(<Carte7 id={7} />)} />
        <Carte8 id={8} className={`carte ${carteSelectionnee && carteSelectionnee.props.id === 8 ? 'selectionnee' : ''}`} onClick={() => selectionnerCarte(<Carte8 id={8} />)} />
        <Carte9 id={9} className={`carte ${carteSelectionnee && carteSelectionnee.props.id === 9 ? 'selectionnee' : ''}`} onClick={() => selectionnerCarte(<Carte9 id={9} />)} />
        <Carte10 id={10} className={`carte ${carteSelectionnee && carteSelectionnee.props.id === 10 ? 'selectionnee' : ''}`} onClick={() => selectionnerCarte(<Carte10 id={10} />)} />
       
      </div>
    </div>
  );
}

export default Cartes;
