// src/routes/roomRoutes.js
const express = require("express");
const router = express.Router();
const { requireAuth } = require("../middleware");
const db = require("../db");

// GET /salles : liste toutes les salles
router.get("/", requireAuth, (req, res) => {
  try {
    const rooms = db.prepare("SELECT id, nom, capacite, localisation FROM rooms").all();

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

