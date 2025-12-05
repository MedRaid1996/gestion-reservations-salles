const express = require("express");
const router = express.Router();
const { requireAuth, requireEnseignant } = require("../middleware");
const db = require("../db");
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

// Formulaire de réservation (enseignant seulement)
router.get("/new", requireEnseignant, (req, res) => {
  // Charger les salles et classes depuis la BD
  const rooms = db.prepare("SELECT id, nom FROM rooms").all();
  const classes = db.prepare("SELECT id, nom FROM classes").all();

  res.render("reservation_new", {
    title: "Nouvelle réservation",
    rooms,
    classes
  });
});

// Création d'une réservation
router.post("/", requireEnseignant, (req, res) => {
  const { salle_id, classe_id, date_debut, date_fin } = req.body;
  const enseignant_id = req.session.user.id;

  try {
    db.prepare(`
  INSERT INTO reservations (salle_id, classe_id, enseignant_id, date_debut, date_fin, statut)
  VALUES (?, ?, ?, ?, ?, ?)
`).run(salle_id, classe_id, enseignant_id, date_debut, date_fin, "ACTIVE");


    res.redirect("/reservations/ma-classe");
  } catch (err) {
    console.error("Erreur création réservation:", err);
    // TEMPORAIREMENT : afficher l'erreur exacte dans le navigateur
    res.status(500).send("Erreur lors de la création de la réservation : " + err.message);
  }
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
