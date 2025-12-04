const express = require("express");
const router = express.Router();
const db = require("../db");

router.get("/login", (req, res) => {
  res.render("login", { error: null });
});

router.post("/login", (req, res) => {
  const { email, motDePasse } = req.body;

  const stmt = db.prepare(
    "SELECT id, nom, email, role, motDePasse, classe_id FROM users WHERE email = ?"
  );
  const user = stmt.get(email);

  if (!user || user.motDePasse !== motDePasse) {
    return res.status(401).render("login", {
      error: "Identifiants invalides",
    });
  }

  req.session.user = {
    id: user.id,
    nom: user.nom,
    role: user.role,
    classeId: user.classe_id,
  };

  res.redirect("/salles");
});

router.post("/logout", (req, res) => {
  req.session.destroy(() => {
    res.redirect("/login");
  });
});

router.get("/", (req, res) => {
  if (!req.session.user) return res.redirect("/login");
  res.redirect("/salles");
});

module.exports = router;
