// ========== IMPORTER LES DÉPENDANCES ==========
// Framework web pour Node.js
const express = require("express");
// Gestion des sessions utilisateur
const session = require("express-session");
// Pour manipuler les chemins de fichiers
const path = require("path");
// Moteur de templates Handlebars
const hbs = require("hbs");

// ========== IMPORTER LES ROUTES ==========
const authRoutes = require("./routes/authRoutes");
const roomRoutes = require("./routes/roomRoutes");
const reservationRoutes = require("./routes/reservationRoutes");

// Créer l'application Express
const app = express();

// ========== CONFIGURATION HANDLEBARS ==========
// Définir le moteur de vue à utiliser (hbs = Handlebars)
app.set("view engine", "hbs");
// Dossier contenant les fichiers .hbs (les templates)
app.set("views", path.join(__dirname, "views"));

// Enregistrer les partials (header, footer, etc. qui se réutilisent dans plusieurs pages)
hbs.registerPartials(path.join(__dirname, "views", "partials"));

// Helper personnalisé : utiliser "eq" dans les templates pour comparer des valeurs
// Exemple : {{#if (eq user.role 'ENSEIGNANT')}}...{{/if}}
hbs.registerHelper("eq", (a, b) => a == b);

// ========== MIDDLEWARES ==========
// Parser pour les données JSON et formulaires HTML
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// ========== SESSION ==========
// Middleware de session (permet aux utilisateurs de rester connectés)
app.use(
  session({
    secret: "unSecretBienCache", // Secret pour chiffrer les données de session
    resave: false, // Ne pas sauvegarder la session si elle n'a pas changé
    saveUninitialized: false, // Ne pas créer de session si elle est vide
  })
);

// ========== FICHIERS STATIQUES ==========
// Dossier pour les fichiers CSS, images, JavaScript côté client, etc.
app.use(express.static(path.join(__dirname, "..", "public")));

// ========== MIDDLEWARE GLOBAL ==========
// Passer les infos utilisateur à TOUS les templates Handlebars
app.use((req, res, next) => {
  // res.locals = variables disponibles dans tous les templates
  const user = req.session.user || null;
  res.locals.user = user; // L'utilisateur actuellement connecté (ou null)
  res.locals.isEnseignant = !!(user && user.role === "ENSEIGNANT"); // Boolean : true si enseignant
  next(); // Continuer vers la prochaine route
});

// ========== ENREGISTRER LES ROUTES ==========
// Routes d'authentification (login, logout)
app.use("/", authRoutes);
// Routes pour voir la liste des salles
app.use("/salles", roomRoutes);
// Routes pour les réservations
app.use("/reservations", reservationRoutes);

// ========== DÉMARRER LE SERVEUR ==========
const PORT = 3000;
app.listen(PORT, () => {
  console.log(`✓ Serveur démarré sur http://localhost:${PORT}`);
});
