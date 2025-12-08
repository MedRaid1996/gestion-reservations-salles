// Importation des modules nécessaires
const express = require("express");
const session = require("express-session");
const path = require("path");
const hbs = require("hbs");

// Importation des routes de l'application
const authRoutes = require("./routes/authRoutes");
const roomRoutes = require("./routes/roomRoutes");
const reservationRoutes = require("./routes/reservationRoutes");

// Initialisation de l'application Express
const app = express();

// ---------- Configuration de Handlebars (hbs) ----------
app.set("view engine", "hbs");
app.set("views", path.join(__dirname, "views"));

// Enregistrement des partials Handlebars (header, footer, etc.)
hbs.registerPartials(path.join(__dirname, "views", "partials"));

// Helper personnalisé : eq (pour comparer deux valeurs dans les templates Handlebars)
// Permet d'utiliser {{#if (eq value1 value2)}} dans les vues
hbs.registerHelper("eq", (a, b) => a == b);

// ---------- Middlewares ----------
// Middleware pour parser les requêtes JSON
app.use(express.json());
// Middleware pour parser les données de formulaires
app.use(express.urlencoded({ extended: true }));

// Configuration de la gestion de session
// La session permet de maintenir l'état de connexion de l'utilisateur entre les requêtes
app.use(
  session({
    secret: "unSecretBienCache", // Clé secrète pour signer le cookie de session
    resave: false, // Ne pas sauvegarder la session si elle n'a pas été modifiée
    saveUninitialized: false, // Ne pas créer de session pour les visiteurs non connectés
  })
);

// Servir les fichiers statiques (CSS, images, etc.) depuis le dossier public
app.use(express.static(path.join(__dirname, "..", "public")));

// Middleware pour rendre les informations utilisateur disponibles dans toutes les vues
// Cela évite de devoir passer ces variables manuellement à chaque render()
app.use((req, res, next) => {
  const user = req.session.user || null;
  res.locals.user = user; // Informations de l'utilisateur connecté
  res.locals.isEnseignant = !!(user && user.role === "ENSEIGNANT"); // Booléen pour vérifier si c'est un enseignant
  next();
});

// ---------- Routes ----------
// Définition des routes de l'application
app.use("/", authRoutes); // Routes d'authentification (login, logout)
app.use("/salles", roomRoutes); // Routes pour la gestion des salles
app.use("/reservations", reservationRoutes); // Routes pour la gestion des réservations

// ---------- Lancement du serveur ----------
const PORT = 3000;
app.listen(PORT, () => {
  console.log(`Serveur sur http://localhost:${PORT}`);
});
