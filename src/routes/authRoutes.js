// ========== ROUTES D'AUTHENTIFICATION ==========

const express = require("express");
const router = express.Router();
const db = require("../db");

// Route : GET /login - Afficher la page de connexion
router.get("/login", (req, res) => {
  res.render("login", {
    title: "Connexion",
    error: null,
    user: null
  });
});

// POST login
// POST login
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


// POST logout
router.post("/logout", (req, res) => {
  // Détruire la session
  req.session.destroy(() => {
    // Rediriger vers la page de login
    res.redirect("/login");
  });
});

// Home → redirect to salles
router.get("/", (req, res) => {
  if (!req.session.user) return res.redirect("/login");
  res.redirect("/salles");
});

module.exports = router;
