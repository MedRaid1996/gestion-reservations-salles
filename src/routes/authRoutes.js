// Routes d'authentification : login, logout et redirection de la page d'accueil
const express = require("express");
const router = express.Router();
const db = require("../db");

/**
 * GET /login
 * Affiche la page de connexion
 */
router.get("/login", (req, res) => {
  res.render("login", {
    title: "Connexion",
    error: null,
    user: null
  });
});

/**
 * POST /login
 * Traite la soumission du formulaire de connexion
 * Vérifie les identifiants et crée une session utilisateur si valides
 * Redirige vers la page appropriée selon le rôle (enseignant ou étudiant)
 */
router.post("/login", (req, res) => {
  const { email, motDePasse } = req.body;

  const stmt = db.prepare(
    "SELECT id, nom, email, role, motDePasse, classe_id FROM users WHERE email = ?"
  );
  const user = stmt.get(email);

  if (!user || user.motDePasse !== motDePasse) {
    return res.render("login", {
      title: "Connexion",
      error: "Identifiants invalides",
      user: null
    });
  }

  // On enregistre l'utilisateur dans la session
  req.session.user = {
    id: user.id,
    nom: user.nom,
    role: user.role,
    classeId: user.classe_id
  };

  // Redirection différente selon le rôle 
  if (user.role === "ENSEIGNANT") {
    // L’enseignant va vers la liste des salles
    return res.redirect("/salles");
  } else if (user.role === "ETUDIANT") {
    // L’étudiant va vers les réservations de SA classe
    return res.redirect("/reservations/ma-classe");
  } else {
    // Cas improbable : rôle inconnu
    return res.redirect("/login");
  }
});


/**
 * POST /logout
 * Détruit la session utilisateur et redirige vers la page de connexion
 */
router.post("/logout", (req, res) => {
  req.session.destroy(() => {
    res.redirect("/login");
  });
});

/**
 * GET /
 * Page d'accueil : redirige vers /salles si connecté, sinon vers /login
 */
router.get("/", (req, res) => {
  if (!req.session.user) return res.redirect("/login");
  res.redirect("/salles");
});

module.exports = router;
