PRAGMA foreign_keys = ON;

-- Table des utilisateurs (Enseignant / Étudiant)
CREATE TABLE IF NOT EXISTS users (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    nom TEXT NOT NULL,
    email TEXT NOT NULL UNIQUE,
    motDePasse TEXT NOT NULL,
    role TEXT NOT NULL CHECK (role IN ('ENSEIGNANT', 'ETUDIANT')),
    classe_id INTEGER, -- pour les étudiants (la classe à laquelle ils appartiennent)
    FOREIGN KEY (classe_id) REFERENCES classes(id)
);

-- Table des classes
CREATE TABLE IF NOT EXISTS classes (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    nom TEXT NOT NULL UNIQUE
);

-- Table des salles
CREATE TABLE IF NOT EXISTS rooms (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    nom TEXT NOT NULL,
    capacite INTEGER NOT NULL,
    localisation TEXT NOT NULL
);

-- Table des réservations
CREATE TABLE IF NOT EXISTS reservations (
    id TEXT PRIMARY KEY, -- uuid généré dans Node
    salle_id INTEGER NOT NULL,
    classe_id INTEGER NOT NULL,
    enseignant_id INTEGER NOT NULL,
    date_debut TEXT NOT NULL,  -- format ISO string
    date_fin   TEXT NOT NULL,
    statut TEXT NOT NULL CHECK (statut IN ('ACTIVE', 'ANNULEE')),
    FOREIGN KEY (salle_id) REFERENCES rooms(id) ON DELETE CASCADE,
    FOREIGN KEY (classe_id) REFERENCES classes(id) ON DELETE CASCADE,
    FOREIGN KEY (enseignant_id) REFERENCES users(id) ON DELETE CASCADE
);

-- Données de base pour les tests
INSERT INTO classes (nom) VALUES
('Groupe 1'),
('Groupe 2');

INSERT INTO users (nom, email, motDePasse, role, classe_id) VALUES
('Prof Démo', 'prof@example.com', 'prof123', 'ENSEIGNANT', NULL),
('Étudiant Démo', 'etu@example.com', 'etu123', 'ETUDIANT', 1);

INSERT INTO rooms (nom, capacite, localisation) VALUES
('Salle A101', 30, 'Bloc A'),
('Salle B202', 40, 'Bloc B');
