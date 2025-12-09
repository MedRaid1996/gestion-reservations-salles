// ========== ROUTES POUR LES SALLES ==========
const express = require("express");
const router = express.Router();
const { requireAuth } = require("../middleware");
const db = require("../db");

// Route : GET /salles - Afficher la liste de toutes les salles
// requireAuth = vérifier que l'utilisateur est connecté
router.get("/", requireAuth, (req, res) => {
  try {
    // Récupérer toutes les salles de la base de données
    const rooms = db.prepare("SELECT id, nom, capacite, localisation FROM rooms").all();

    // Afficher la page avec la liste des salles
    res.render("rooms", {
      title: "Liste des salles",
      rooms // Passer la liste aux templates
    });
  } catch (err) {
    // En cas d'erreur, afficher l'erreur en console et envoyer une erreur au client
    console.error("Erreur lors de la récupération des salles :", err);
    res.status(500).send("Erreur serveur lors de la récupération des salles");
  }
});

module.exports = router;

