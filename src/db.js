// Configuration et initialisation de la connexion à la base de données SQLite
const Database = require("better-sqlite3");
const path = require("path");

// Chemin vers le fichier de base de données SQLite
const dbPath = path.join(__dirname, "..", "data", "reservations.db");

// Création de la connexion à la base de données
// L'option verbose permet d'afficher les requêtes SQL exécutées dans la console (utile pour le débogage)
const db = new Database(dbPath, { verbose: console.log });

// Export de l'instance de base de données pour utilisation dans les autres modules
module.exports = db;
