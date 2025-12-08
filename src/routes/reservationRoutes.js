// Routes pour la gestion des réservations
const express = require("express");
const router = express.Router();
const { requireAuth, requireEnseignant } = require("../middleware");
const db = require("../db");

/**
 * GET /reservations/ma-classe
 * Affiche les réservations selon le rôle de l'utilisateur
 * - Enseignant : affiche ses propres réservations
 * - Étudiant : affiche les réservations de sa classe (avec possibilité de changer de classe)
 */
router.get("/ma-classe", requireAuth, (req, res) => {
  const user = req.session.user;
  const { classeId } = req.query; // Classe sélectionnée par l'étudiant (optionnel)
  let reservations = [];

  try {
    if (user.role === "ENSEIGNANT") {
      // Cas ENSEIGNANT : récupérer toutes les réservations créées par cet enseignant
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

      // Rendu de la vue avec les réservations de l'enseignant
      return res.render("reservations", {
        title: "Mes réservations",
        reservations
      });
    }

    // Cas ÉTUDIANT : récupérer la liste des classes et les réservations de la classe sélectionnée
    const classes = db.prepare("SELECT id, nom FROM classes").all();

    // Si l'étudiant n'a pas sélectionné de classe, utiliser sa propre classe par défaut
    const effectiveClasseId = classeId || user.classeId;
    if (effectiveClasseId) {
      // Récupérer les réservations de la classe sélectionnée
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

    // Rendu de la vue avec les réservations et la liste des classes
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

/**
 * GET /reservations/new
 * Affiche le formulaire de création d'une nouvelle réservation
 * Accessible uniquement aux enseignants
 */
router.get("/new", requireEnseignant, (req, res) => {
  // Charger les listes des salles et des classes depuis la base de données
  const rooms = db.prepare("SELECT id, nom FROM rooms").all();
  const classes = db.prepare("SELECT id, nom FROM classes").all();

  // Rendu du formulaire avec les options disponibles
  res.render("reservation_new", {
    title: "Nouvelle réservation",
    rooms,
    classes
  });
});

/**
 * POST /reservations
 * Traite la soumission du formulaire de création de réservation
 * Insère une nouvelle réservation dans la base de données
 * Accessible uniquement aux enseignants
 */
router.post("/", requireEnseignant, (req, res) => {
  const { salle_id, classe_id, date_debut, date_fin } = req.body;
  const enseignant_id = req.session.user.id;

  try {
    // Insertion de la nouvelle réservation dans la base de données
    db.prepare(`
      INSERT INTO reservations (salle_id, classe_id, enseignant_id, date_debut, date_fin, statut)
      VALUES (?, ?, ?, ?, ?, ?)
    `).run(salle_id, classe_id, enseignant_id, date_debut, date_fin, "ACTIVE");

    // Redirection vers la liste des réservations de l'enseignant
    res.redirect("/reservations/ma-classe");
  } catch (err) {
    console.error("Erreur création réservation:", err);
    res.status(500).send("Erreur lors de la création de la réservation : " + err.message);
  }
});



/**
 * GET /reservations/edit/:id
 * Affiche le formulaire de modification d'une réservation existante
 * Accessible uniquement aux enseignants
 */
router.get("/edit/:id", requireEnseignant, (req, res) => {
  const id = req.params.id;

  // Récupération de la réservation à modifier
  const reservation = db.prepare("SELECT * FROM reservations WHERE id = ?").get(id);
  const rooms = db.prepare("SELECT id, nom FROM rooms").all();
  const classes = db.prepare("SELECT id, nom FROM classes").all();

  if (!reservation) return res.status(404).send("Réservation introuvable");

  // Rendu du formulaire pré-rempli avec les données actuelles
  res.render("reservation_edit", {
    title: "Modifier réservation",
    reservation,
    rooms,
    classes
  });
});

/**
 * POST /reservations/edit/:id
 * Traite la soumission du formulaire de modification
 * Met à jour les informations de la réservation dans la base de données
 * Accessible uniquement aux enseignants
 */
router.post("/edit/:id", requireEnseignant, (req, res) => {
  const id = req.params.id;
  const { salle_id, classe_id, date_debut, date_fin } = req.body;

  try {
    // Mise à jour de la réservation dans la base de données
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

/**
 * GET /reservations/delete/:id
 * Annule (supprime) une réservation existante
 * Accessible uniquement aux enseignants
 */
router.get("/delete/:id", requireEnseignant, (req, res) => {
  const id = req.params.id;

  try {
    // Suppression de la réservation de la base de données
    db.prepare("DELETE FROM reservations WHERE id = ?").run(id);
    res.redirect("/reservations/ma-classe");
  } catch (err) {
    console.error("Erreur suppression réservation :", err);
    res.status(500).send("Erreur lors de l'annulation de la réservation.");
  }
});

module.exports = router;
