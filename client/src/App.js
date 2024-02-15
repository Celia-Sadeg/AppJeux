import io from 'socket.io-client';

import React, { useState, useEffect } from 'react';
import Chat from './Chat';

import Axios from 'axios';
import './App.css';
import backgroundImage from './assets/img.png'; 
import Game from './game'; // Assurez-vous d'utiliser le chemin correct vers game.js
import UserIcon from './icon.svg.png'; // Remplacez par le chemin de votre icône utilisateur

export default function App() {
  const [users, setUsers] = useState([]);
  const [name, setName] = useState('');
  const [password, setPassword] = useState('');
  const [email, setEmail] = useState('');
  const [loggedInUser, setLoggedInUser] = useState(null); // État pour l'utilisateur connecté
  const [showGame, setShowGame] = useState(false);
  const [showLoginForm, setShowLoginForm] = useState(true);
  const [socket, setSocket] = useState(null);

  useEffect(() => {
    const newSocket = io(`http://localhost:3001`);
    setSocket(newSocket);
  
    newSocket.on('connect', () => {
      console.log('Connecté au serveur Socket.IO');
    });
  
    newSocket.on('disconnect', () => {
      console.log('Déconnecté du serveur Socket.IO');
    });
  
    return () => newSocket.close();
  }, []);
  
useEffect(() => {
  if (socket) {
    socket.on('chat message', (msg) => {
      console.log(msg);
      // Mettre à jour l'état avec le nouveau message ici
    });

    // Nettoyage lors du démontage du composant
    return () => {
      socket.off('chat message');
    };
  }
}, [socket]);

  useEffect(() => {
    Axios.get("http://localhost:3001/users")
      .then(res => {
        setUsers(res.data);
      })
      .catch(error => {
        console.error("Erreur lors de la récupération des utilisateurs :", error);
      });
  }, []);

  const createUser = () => {
    if (name && email && password) {
      Axios.post("http://localhost:3001/createUser", {
        name: name,
        email: email,
        password: password
      })
      .then(res => {
        setName('');
        setEmail('');
        setPassword('');
      })
      .catch(error => {
        console.error("Erreur lors de la création de l'utilisateur :", error);
      });
    }
  }

  const handleLogin = () => {
    Axios.post("http://localhost:3001/login", { email, password })
      .then(res => {
        if (res.data) {
          setLoggedInUser(res.data.name);
          setShowGame(true);
          setShowLoginForm(false);
        }
      })
      .catch(error => {
        let message = "Erreur lors de la connexion.";
        if (error.response) {
          if (error.response.status === 404) {
            // Si l'utilisateur n'est pas trouvé
            message = "Email non trouvé. Si vous n'avez pas encore de compte, veuillez vous inscrire.";
          } else if (error.response.status === 401) {
            // Si le mot de passe est incorrect
            message = "Mot de passe incorrect. Veuillez réessayer.";
          }
        }
        alert(message); // Utiliser alert pour afficher le message
        console.error("Erreur lors de la connexion :", error);
      });
  };
  
  

  return (
    <>
      {showLoginForm && (
        <>
          <h2>Inscription</h2>
          <div style={{ backgroundImage: `url(${backgroundImage})`, backgroundSize: 'cover', height: '100vh' }}>
            <div className="user-form">
              <input type="text" placeholder='Nom' value={name} onChange={(e) => setName(e.target.value)} />
              <input type="text" placeholder='Email' value={email} onChange={(e) => setEmail(e.target.value)} />
              <input type="password" placeholder='Password' value={password} onChange={(e) => setPassword(e.target.value)} />
              <button onClick={createUser}>Créer un compte</button>
            </div>
            <div className="user-list">
              {users.map(user => (
                <div className='user-card' key={user._id}>
                  <p>Email: {user.email}</p>
                </div>
              ))}
            </div>
          </div>
          <h2>Connexion</h2>
          <div style={{ backgroundImage: `url(${backgroundImage})`, backgroundSize: 'cover', height: '100vh' }}>
            <div className="user-form">
              <input type="text" placeholder='Email' onChange={(e) => setEmail(e.target.value)} />
              <input type="password" placeholder='Password' onChange={(e) => setPassword(e.target.value)} />
              <button onClick={handleLogin}>Se connecter</button>
            </div>
            <h3 className="user-list-title">Liste des joueurs présents</h3>
            <div className="user-list-container">
              <div className="user-list">
                {users.map(user => (
                  <div className='user-card' key={user._id}>
                    <p>Nom: {user.name}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </>
      )}

      {showGame && (
        <>
          {loggedInUser && (
            <div className="user-info">
              <img src={UserIcon} alt="User Icon" className="user-icon" />

              <p> Bonjour Vous êtes connecté, {loggedInUser}</p>
            </div>
          )}
          <Game socket={socket} />
          {/* Intégration du composant Chat */}
          <Chat />
        </>
      )}
    </>
  );
}
