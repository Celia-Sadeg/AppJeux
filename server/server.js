const express = require("express");
const cors = require("cors");
const mongoose = require("mongoose");
const fs = require('fs');
const path = require('path');
const http = require('http');
const socketIo = require('socket.io');

// Importez le modèle de données
const UserModel = require('./models/Users');
const Partie = require('./models/Partie');
const Stats = require("./models/Stats"); // 

const cartesDossier = 'C:/Users/sadeg/OneDrive/Bureau/cour fac universite de montpellier/ProjetL2/app2024/client/src/cartes';

// Création de l'application Express et du serveur HTTP
const app = express();
const server = http.createServer(app);
const io = socketIo(server);

//  activer CORS 
app.use(cors());

// Activer CORS avec une configuration personnalisée pour autoriser les connexions provenant du port 3000
app.use(cors({
  origin: "http://localhost:3000"
}));

//  traiter les données JSON
app.use(express.json());

// Connexion à la base de données MongoDB
mongoose.connect("mongodb+srv://sadeg:ZrbDwt4llyoNYKLV@dbmonjeux.yty8f5a.mongodb.net/dbprojetusers", {
    useNewUrlParser: true,
    useUnifiedTopology: true,
});

mongoose.connection.on("error", (error) => {
    console.error("Erreur de connexion à la base de données:", error);
});

mongoose.connection.once("open", () => {
    console.log("Connexion à la base de données établie avec succès");
});

// Routes pour la gestion des utilisateurs
app.get("/users", async (req, res) => {
    try {
        const users = await UserModel.find({}, 'name email');
        res.json(users);
    } catch (error) {
        console.error("Erreur lors de la récupération des utilisateurs :", error);
        res.status(500).json({ error: "Erreur interne du serveur" });
    }
});

app.post("/createUser", async (req, res) => {
    try {
        const userData = req.body;
        const newUser = new UserModel(userData);
        await newUser.save();
        res.json({ name: newUser.name, email: newUser.email });
    } catch (error) {
        console.error("Erreur lors de la création de l'utilisateur :", error);
        res.status(500).json({ error: "Erreur interne du serveur" });
    }
});

app.post("/login", async (req, res) => {
    try {
        const { email, password } = req.body;
        const user = await UserModel.findOne({ email: email });

        if (user) {
            res.json({ name: user.name });
        } else {
            res.status(404).json({ error: "Email non trouvé" });
        }
    } catch (error) {
        console.error("Erreur lors de la connexion :", error);
        res.status(500).json({ error: "Erreur interne du serveur" });
    }
});

// Routes pour la gestion des parties
app.get("/mesparties", async (req, res) => {
    try {
        const parties = await Partie.find();
        res.json(parties);
    } catch (error) {
        console.error("Erreur lors de la récupération des parties :", error);
        res.status(500).json({ error: "Erreur interne du serveur" });
    }
});

app.post("/mesparties", async (req, res) => {
    try {
        console.log("Requête de création de partie reçue :", req.body);
        const partieData = req.body;
        const nouvellePartie = new Partie(partieData);
        await nouvellePartie.save();
        res.json(nouvellePartie);
    } catch (error) {
        console.error("Erreur lors de la création de la partie :", error);
        res.status(500).json({ error: "Erreur interne du serveur" });
    }
});

// Rejoindre une partie par son identifiant
app.get("/mesparties/:identifiant", async (req, res) => {
    try {
        const identifiant = req.params.identifiant;
        const partie = await Partie.findOne({ identifiant: identifiant });
        if (!partie) {
            return res.status(404).json({ error: "Partie non trouvée" });
        }
        res.json(partie);
    } catch (error) {
        console.error("Erreur lors de la récupération de la partie :", error);
        res.status(500).json({ error: "Erreur interne du serveur" });
    }
});

// Fonction pour récupérer la liste des cartes
function getListeCartes() {
    try {
        return fs.readdirSync(cartesDossier).filter(file => file.endsWith('.svg'));
    } catch (err) {
        console.error(`Erreur lors de la lecture du dossier des cartes: `, err);
        return [];
    }
}

// Route pour afficher les cartes de jeu
app.get('/cartes', (req, res) => {
    const cartes = getListeCartes();
    let html = '<!DOCTYPE html><html lang="fr"><head><meta charset="UTF-8"><title>Cartes de Jeu</title></head><body>';

    cartes.forEach(nomFichier => {
        const numCarte = path.basename(nomFichier, '.svg');
        html += `<img src="/cartes/static/${nomFichier}" alt="Carte ${numCarte}" style="margin: 10px;">`;
    });

    html += '</body></html>';
    res.send(html);
});

//  servir les fichiers statiques du dossier des cartes
app.use('/cartes/static', express.static(cartesDossier));

// Gestion du chat en temps réel avec Socket.IO
io.on('connection', (socket) => {
    console.log('Un utilisateur s\'est connecté au chat');

    socket.on('chat message', (msg) => {
        io.emit('chat message', msg); // Envoie le message à tous les clients connectés
    });

    socket.on('disconnect', () => {
        console.log('Un utilisateur s\'est déconnecté du chat');
    });
});

// Route pour récupérer les scores des joueurs
app.get("/scores", async (req, res) => {
    try {
        const scores = await Stats.find().sort({ points: -1 });
        res.json(scores);
    } catch (error) {
        console.error("Erreur lors de la récupération des scores :", error);
        res.status(500).json({ error: "Erreur interne du serveur" });
    }
});

// Démarrage du serveur sur le port 3001
app.listen(3001, () => {
    console.log("Le serveur fonctionne sur le port 3001");
});
