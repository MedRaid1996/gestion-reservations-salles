// Importer la librairie sql.js pour utiliser SQLite en JavaScript
const initSqlJs = require("sql.js");
// Importer les modules pour lire/écrire les fichiers
const fs = require("fs");
const path = require("path");

// Chemin vers le fichier de la base de données
const dbPath = path.join(__dirname, "..", "data", "reservations.db");

// Variable globale pour stocker la base de données
let db;

// ========== INITIALISER LA BASE DE DONNÉES ==========
// Initialiser sql.js et charger la base de données existante
(async () => {
  const SQL = await initSqlJs();
  
  // Si le fichier existe, on le charge, sinon on crée une nouvelle BD vide
  if (fs.existsSync(dbPath)) {
    const buffer = fs.readFileSync(dbPath);
    db = new SQL.Database(buffer);
  } else {
    db = new SQL.Database();
  }
})();

// ========== CRÉER UN WRAPPER COMPATIBLE ==========
// Créer un wrapper qui imite le fonctionnement de better-sqlite3
// Permet d'utiliser les mêmes fonctions (prepare, get, all, run) avec sql.js
const dbWrapper = {
  // Fonction prepare() : prépare une requête SQL
  prepare(sql) {
    return {
      // get(...params) : retourne UNE SEULE ligne (le premier résultat)
      get(...params) {
        if (!db) throw new Error("Database not initialized");
        const stmt = db.prepare(sql);
        stmt.bind(params);
        // Si step() retourne true, il y a un résultat
        const result = stmt.step() ? stmt.getAsObject() : null;
        stmt.free();
        return result;
      },
      // all(...params) : retourne TOUTES les lignes du résultat
      all(...params) {
        if (!db) throw new Error("Database not initialized");
        const results = [];
        const stmt = db.prepare(sql);
        stmt.bind(params);
        // Boucler sur tous les résultats
        while (stmt.step()) {
          results.push(stmt.getAsObject());
        }
        stmt.free();
        return results;
      },
      // run(...params) : exécuter une requête INSERT/UPDATE/DELETE
      run(...params) {
        if (!db) throw new Error("Database not initialized");
        const stmt = db.prepare(sql);
        stmt.bind(params);
        stmt.step();
        stmt.free();
        
        // Sauvegarder la base de données après chaque modification
        const data = db.export();
        fs.writeFileSync(dbPath, data);
        
        return { changes: db.getRowsModified() };
      }
    };
  },
  // Fonction exec() : exécuter du SQL brut (pour les schémas par exemple)
  exec(sql) {
    if (!db) throw new Error("Database not initialized");
    db.run(sql);
    const data = db.export();
    fs.writeFileSync(dbPath, data);
  }
};

module.exports = dbWrapper;
