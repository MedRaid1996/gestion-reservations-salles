// ========== ROUTES POUR LES RÉSERVATIONS ==========
const express = require("express");
const router = express.Router();
const { requireAuth, requireEnseignant } = require("../middleware");
const db = require("../db");

// Route : GET /reservations/ma-classe - Voir les réservations
// Affiche les réservations créées par l'enseignant, ou celles de la classe de l'étudiant
router.get("/ma-classe", requireAuth, (req, res) => {
  const user = req.session.user;
  const { classeId } = req.query;
  let reservations = [];

  try {
    // CASE 1 : L'utilisateur est un ENSEIGNANT
    if (user.role === "ENSEIGNANT") {
      // Afficher seulement les réservations qu'il a créées
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

    // CASE 2 : L'utilisateur est un ÉTUDIANT
    // Charger la liste des classes pour que l'étudiant puisse choisir
    const classes = db.prepare("SELECT id, nom FROM classes").all();

    // Si l'étudiant a sélectionné une classe, l'utiliser, sinon utiliser sa propre classe
    const effectiveClasseId = classeId || user.classeId;
    
    if (effectiveClasseId) {
      // Récupérer les réservations de cette classe
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

// Route : GET /reservations/new - Formulaire pour créer une nouvelle réservation
// Accès réservé aux enseignants uniquement
router.get("/new", requireEnseignant, (req, res) => {
  // Charger les salles et classes depuis la base de données
  const rooms = db.prepare("SELECT id, nom FROM rooms").all();
  const classes = db.prepare("SELECT id, nom FROM classes").all();

  res.render("reservation_new", {
    title: "Nouvelle réservation",
    rooms,
    classes
  });
});

// Route : POST /reservations - Créer une nouvelle réservation
// Accès réservé aux enseignants
router.post("/", requireEnseignant, (req, res) => {
  // Récupérer les données du formulaire
  const { salle_id, classe_id, date_debut, date_fin } = req.body;
  const enseignant_id = req.session.user.id;

  try {
    // Insérer la nouvelle réservation dans la BD
    db.prepare(`
  INSERT INTO reservations (salle_id, classe_id, enseignant_id, date_debut, date_fin, statut)
  VALUES (?, ?, ?, ?, ?, ?)
`).run(salle_id, classe_id, enseignant_id, date_debut, date_fin, "ACTIVE");

    // Redirection vers la liste des réservations
    res.redirect("/reservations/ma-classe");
  } catch (err) {
    console.error("Erreur création réservation:", err);
    // Afficher l'erreur au client pour le débogage
    res.status(500).send("Erreur lors de la création de la réservation : " + err.message);
  }
});

// Route : GET /reservations/edit/:id - Formulaire pour modifier une réservation
// Accès réservé aux enseignants
router.get("/edit/:id", requireEnseignant, (req, res) => {
  const id = req.params.id;

  // Récupérer les données de la réservation à modifier
  const reservation = db.prepare("SELECT * FROM reservations WHERE id = ?").get(id);
  const rooms = db.prepare("SELECT id, nom FROM rooms").all();
  const classes = db.prepare("SELECT id, nom FROM classes").all();

  // Vérifier que la réservation existe
  if (!reservation) return res.status(404).send("Réservation introuvable");

  res.render("reservation_edit", {
    title: "Modifier réservation",
    reservation,
    rooms,
    classes
  });
});

// Route : POST /reservations/edit/:id - Soumettre les modifications
router.post("/edit/:id", requireEnseignant, (req, res) => {
  const id = req.params.id;
  const { salle_id, classe_id, date_debut, date_fin } = req.body;

  try {
    // Mettre à jour la réservation
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

// Route : GET /reservations/delete/:id - Annuler (supprimer) une réservation
// Accès réservé aux enseignants
router.get("/delete/:id", requireEnseignant, (req, res) => {
  const id = req.params.id;

  try {
    // Supprimer la réservation de la BD
    db.prepare("DELETE FROM reservations WHERE id = ?").run(id);
    res.redirect("/reservations/ma-classe");
  } catch (err) {
    console.error("Erreur suppression réservation :", err);
    res.status(500).send("Erreur lors de l'annulation de la réservation.");
  }
});

module.exports = router;
