import React, { useState, useEffect } from 'react';
import './App.css';
import Cartes from './Cartes.js';
import io from 'socket.io-client';

function SixPrend() {
  const [users, setUsers] = useState([]); // Liste des utilisateurs
  const [mainPrise, setMainPrise] = useState(null); // Utilisateur qui a pris la main
  const [nouvellePartie, setNouvellePartie] = useState({
    identifiant: "",
    nomDuJoueur: "",
  }); // Détails de la nouvelle partie à créer
  const [codeRejoindrePartie, setCodeRejoindrePartie] = useState(""); // Code d'identifiant pour rejoindre une partie existante
  const [partieRejointe, setPartieRejointe] = useState(null); // Partie à laquelle l'utilisateur a rejoint

  const [messages, setMessages] = useState([]); // Liste des messages du chat
  const [newMessage, setNewMessage] = useState(''); // Nouveau message à envoyer
  const [socket, setSocket] = useState(null); // Socket pour la communication en temps réel

  useEffect(() => {
    const newSocket = io('http://localhost:3001'); // Crée une nouvelle connexion socket

    // Écoute les messages du serveur et met à jour la liste des messages
    newSocket.on('chat message', (msg) => {
      console.log('Message reçu du serveur :', msg); // Affichage de débogage
      setMessages((prevMessages) => [...prevMessages, msg]);
    });

    // Récupère la liste des utilisateurs depuis le serveur
    fetch('http://localhost:3001/users')
      .then((response) => response.json())
      .then((data) => setUsers(data))
      .catch((error) =>
        console.error('Erreur lors de la récupération des utilisateurs', error)
      );

    setSocket(newSocket); // Met à jour le socket avec la nouvelle connexion

    
    return () => {
      newSocket.disconnect();
    };
  }, []);

  // Fonction pour envoyer un message au serveur via le socket
  const envoyerMessage = () => {
    if (socket && newMessage) {
      console.log('Envoi du message au serveur :', newMessage); // Affichage de débogage
      socket.emit('chat message', newMessage); // Émet le message au serveur
      setNewMessage('');
    }
  };

  // Fonction pour prendre la main dans la partie
  const prendreLaMain = (userName) => {
    setMainPrise(userName);
  };

  // Fonction pour créer une nouvelle partie
  const creerNouvellePartie = async (e) => {
    e.preventDefault();

    try {
      const response = await fetch("http://localhost:3001/mesparties", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(nouvellePartie),
      });

      if (response.ok) {
        const data = await response.json();
        console.log("Partie créée avec succès !");
        setNouvellePartie({
          identifiant: data.identifiant, // Utilisez l'identifiant renvoyé par le serveur
          nomDuJoueur: "",
          
        });
      } else {
        console.error("Erreur lors de la création de la partie.");
      }
    } catch (error) {
      console.error("Erreur lors de la création de la partie :", error);
    }
  };

  // Fonction pour rejoindre une partie existante
  const rejoindrePartie = async () => {
    try {
      const response = await fetch(`http://localhost:3001/mesparties/${codeRejoindrePartie}`);
      if (response.ok) {
        const data = await response.json();
        setPartieRejointe(data); // Met à jour la partie à laquelle l'utilisateur a rejoint
      } else {
        console.error("Erreur lors de la récupération de la partie existante.");
      }
    } catch (error) {
      console.error("Erreur lors de la récupération de la partie existante :", error);
    }
  };

  // Fonction pour connecter un joueur
  const connecterJoueur = (joueur) => {
    setUsers((prevUsers) =>
      prevUsers.map((user) =>
        user._id === joueur._id ? { ...user, joueurConnecte: true } : user
      )
    );
  };
  
  // Fonction pour déconnecter un joueur
  const deconnecterJoueur = (joueur) => {
    setUsers((prevUsers) =>
      prevUsers.map((user) =>
        user._id === joueur._id ? { ...user, joueurConnecte: false } : user
      )
    );
  };
  
  return (
    <div className="six-prend-container">
      <form onSubmit={creerNouvellePartie}>
        <label className="label-blanc">Nom du joueur :</label>
        <input
          type="text"
          value={nouvellePartie.nomDuJoueur}
          onChange={(e) =>
            setNouvellePartie({ ...nouvellePartie, nomDuJoueur: e.target.value })
          }
          required
        />
        <label className="label-blanc">Identifiant de la partie :</label>
        <input
          type="text"
          value={nouvellePartie.identifiant}
          onChange={(e) =>
            setNouvellePartie({ ...nouvellePartie, identifiant: e.target.value })
          }
          required
        />
        {/*  les détails de la partie ici */}
        <button type="submit">Créer la partie</button>
      </form>

      <div className="table">
        <h3 className="user-list-title">Liste des joueurs présents</h3>
        {users.map((user) => (
          <div key={user._id} className="joueur">
            {user.name}
            {user.joueurConnecte ? (
              <>
                <button onClick={() => deconnecterJoueur(user)}>Déconnecter</button>
                {!mainPrise && (
                  <button onClick={() => prendreLaMain(user.name)}>Prendre la main</button>
                )}
              </>
            ) : (
              <button onClick={() => connecterJoueur(user)}>Connecter</button>
            )}
          </div>
        ))}

        {/* rejoindre une partie existante */}
        <div>
          <h3>Rejoindre une partie existante</h3>
          <label>Code d'identifiant de la partie :</label>
          <input
            type="text"
            value={codeRejoindrePartie}
            onChange={(e) => setCodeRejoindrePartie(e.target.value)}
            required
          />
          <button onClick={rejoindrePartie}>Rejoindre la partie</button>
        </div>

        {mainPrise && (
          <>
            <div>La main est prise par : {mainPrise}</div>
            {/* Afficher le composant Cartes après que la main est prise */}
            <Cartes />
          </>
        )}

        {/* Afficher les détails de la partie rejointe */}
        {partieRejointe && (
          <div>
            <h3>Partie Rejointe</h3>
            <p>Identifiant de la Partie : {partieRejointe.identifiant}</p>
            <p>Joueur : {partieRejointe.nomDuJoueur}</p>
            
          </div>
        )}
      </div>

      {/* Chat en direct */}
      <div className="chat-container">
        <h3>Chat en direct</h3>
        <div className="chat-messages">
          {messages.map((message, index) => (
            <div key={index} className="chat-message">
              {message}
            </div>
          ))}
        </div>
        <div className="chat-input">
          <input
            type="text"
            placeholder="Tapez votre message..."
            value={newMessage}
            onChange={(e) => setNewMessage(e.target.value)}
          />
          <button onClick={envoyerMessage}>Envoyer</button>
        </div>
      </div>
    </div>
  );
}

export default SixPrend;
