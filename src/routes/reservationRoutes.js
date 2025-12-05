const express = require("express");
const router = express.Router();
const { requireAuth, requireEnseignant } = require("../middleware");
const db = require("../db");
// const { v4: uuidv4 } = require("uuid");

// Liste des réservations (différent selon rôle)
router.get("/ma-classe", requireAuth, (req, res) => {
  const user = req.session.user;
  const { classeId } = req.query;
  let reservations = [];

  try {
    if (user.role === "ENSEIGNANT") {
      // 🔹 Cas PROF : afficher les réservations qu'il a créées
      reservations = db.prepare(`
        SELECT r.id,
               r.date_debut,
               r.date_fin,
               r.statut,
               rm.nom  AS salleNom,
               c.nom   AS classeNom
        FROM reservations r
        JOIN rooms   rm ON r.salle_id  = rm.id
        JOIN classes c  ON r.classe_id = c.id
        WHERE r.enseignant_id = ?
        ORDER BY r.date_debut
      `).all(user.id);

      return res.render("reservations", {
        title: "Mes réservations",
        reservations
      });
    }

    // 🔹 Cas ÉTUDIANT : choisir la classe dans une liste
    const classes = db.prepare("SELECT id, nom FROM classes").all();

    // Si l'étudiant n'a rien choisi, on prend sa propre classe par défaut
    const effectiveClasseId = classeId || user.classeId;
    if (effectiveClasseId) {
      reservations = db.prepare(`
        SELECT r.id,
               r.date_debut,
               r.date_fin,
               r.statut,
               rm.nom  AS salleNom,
               c.nom   AS classeNom
        FROM reservations r
        JOIN rooms   rm ON r.salle_id  = rm.id
        JOIN classes c  ON r.classe_id = c.id
        WHERE r.classe_id = ?
        ORDER BY r.date_debut
      `).all(effectiveClasseId);
    }

    return res.render("reservations", {
      title: "Réservations de la classe",
      reservations,
      classes,
      selectedClasseId: effectiveClasseId
    });

  } catch (err) {
    console.error("Erreur récupération réservations :", err);
    res.status(500).send("Erreur lors de la récupération des réservations.");
  }
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



// Formulaire modification réservation
router.get("/edit/:id", requireEnseignant, (req, res) => {
  const id = req.params.id;

  const reservation = db.prepare("SELECT * FROM reservations WHERE id = ?").get(id);
  const rooms = db.prepare("SELECT id, nom FROM rooms").all();
  const classes = db.prepare("SELECT id, nom FROM classes").all();

  if (!reservation) return res.status(404).send("Réservation introuvable");

  res.render("reservation_edit", {
    title: "Modifier réservation",
    reservation,
    rooms,
    classes
  });
});

router.post("/edit/:id", requireEnseignant, (req, res) => {
  const id = req.params.id;
  const { salle_id, classe_id, date_debut, date_fin } = req.body;

  try {
    db.prepare(`
      UPDATE reservations
      SET salle_id = ?, classe_id = ?, date_debut = ?, date_fin = ?
      WHERE id = ?
    `).run(salle_id, classe_id, date_debut, date_fin, id);

    res.redirect("/reservations/ma-classe");
  } catch (err) {
    console.error("Erreur modification :", err);
    res.status(500).send("Erreur lors de la modification de la réservation.");
  }
});

// Annuler (supprimer) une réservation
router.get("/delete/:id", requireEnseignant, (req, res) => {
  const id = req.params.id;

  try {
    db.prepare("DELETE FROM reservations WHERE id = ?").run(id);
    res.redirect("/reservations/ma-classe");
  } catch (err) {
    console.error("Erreur suppression réservation :", err);
    res.status(500).send("Erreur lors de l'annulation de la réservation.");
  }
});



module.exports = router;
