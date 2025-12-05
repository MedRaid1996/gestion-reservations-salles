const express = require("express");
const router = express.Router();
const { requireAuth, requireEnseignant } = require("../middleware");
// const db = require("../db");
// const { v4: uuidv4 } = require("uuid");

// Zaid: GET /reservations/ma-classe
router.get("/ma-classe", requireAuth, (req, res) => {
  const { classeId, classeNom } = req.query;

  // Pour l'instant on laisse la liste vide,
  // Zaid implémentera la requête SQLite ici !
  const reservations = [];

  res.render("reservations", {
    title: "Réservations de classe",
    reservations,
    classeId,
    classeNom
  });
});


// Zaid: POST /reservations  (réserver une salle)
router.post("/", requireEnseignant, (req, res) => {
  // TODO (Zaid) : implémenter la création de réservation
  res.send("TODO: créer une réservation (Zaid)");
});

// Kamilia: PUT /reservations/:id (modifier une réservation)
router.put("/:id", requireEnseignant, (req, res) => {
  // TODO (Kamilia) : implémenter la modification de réservation
  res.send("TODO: modifier une réservation (Kamilia)");
});

// Kamilia: POST /reservations/:id/annuler (annuler une réservation)
router.post("/:id/annuler", requireEnseignant, (req, res) => {
  // TODO (Kamilia) : implémenter l'annulation de réservation
  res.send("TODO: annuler une réservation (Kamilia)");
});

module.exports = router;
