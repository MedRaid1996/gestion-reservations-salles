// src/routes/authRoutes.js

const express = require("express");
const router = express.Router();
const db = require("../db");

// GET login page
router.get("/login", (req, res) => {
  res.render("login", {
    title: "Connexion",
    error: null,
    user: null
  });
});

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

  // Save user in session
  req.session.user = {
    id: user.id,
    nom: user.nom,
    role: user.role,
    classeId: user.classe_id
  };

  res.redirect("/salles");
});

// POST logout
router.post("/logout", (req, res) => {
  req.session.destroy(() => {
    res.redirect("/login");
  });
});

// Home → redirect to salles
router.get("/", (req, res) => {
  if (!req.session.user) return res.redirect("/login");
  res.redirect("/salles");
});

module.exports = router;
