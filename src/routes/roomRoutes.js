// Routes pour la gestion des salles
const express = require("express");
const router = express.Router();
const { requireAuth } = require("../middleware");
const db = require("../db");

/**
 * GET /salles
 * Affiche la liste de toutes les salles disponibles
 * Accessible aux utilisateurs authentifiés (enseignants et étudiants)
 */
router.get("/", requireAuth, (req, res) => {
  try {
    // Récupération de toutes les salles depuis la base de données
    const rooms = db.prepare("SELECT id, nom, capacite, localisation FROM rooms").all();

    // Rendu de la vue avec la liste des salles
    res.render("rooms", {
      title: "Liste des salles",
      rooms
    });
  } catch (err) {
    console.error("Erreur lors de la récupération des salles :", err);
    res.status(500).send("Erreur serveur lors de la récupération des salles");
  }
});

module.exports = router;

