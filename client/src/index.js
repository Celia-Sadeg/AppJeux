import React from 'react';
import ReactDOM from 'react-dom';
import './index.css'; // Assurez-vous que ce fichier existe également, ou supprimez cette ligne si vous n'utilisez pas de CSS spécifique.
import App from './App'; // Assurez-vous que le fichier App.js existe et qu'il exporte un composant React.

ReactDOM.render(
  <React.StrictMode>
    <App />
  </React.StrictMode>,
  document.getElementById('root')
);
