const express = require("express");
const session = require("express-session");
const path = require("path");
const hbs = require("hbs");

const authRoutes = require("./routes/authRoutes");
const roomRoutes = require("./routes/roomRoutes");
const reservationRoutes = require("./routes/reservationRoutes");

const app = express();

// ---------- Configuration de Handlebars (hbs) ----------
app.set("view engine", "hbs");
app.set("views", path.join(__dirname, "views"));

// Partials (header, footer, etc.)
hbs.registerPartials(path.join(__dirname, "views", "partials"));

// Helper personnalisé : eq (pour comparer dans les templates)
hbs.registerHelper("eq", (a, b) => a == b);

// ---------- Middlewares ----------
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use(
  session({
    secret: "unSecretBienCache",
    resave: false,
    saveUninitialized: false,
  })
);

// Fichiers statiques (CSS, images, etc.)
app.use(express.static(path.join(__dirname, "..", "public")));

// Variables globales pour les vues
app.use((req, res, next) => {
  const user = req.session.user || null;
  res.locals.user = user;
  res.locals.isEnseignant = !!(user && user.role === "ENSEIGNANT");
  next();
});

// ---------- Routes ----------
app.use("/", authRoutes);
app.use("/salles", roomRoutes);
app.use("/reservations", reservationRoutes);

// ---------- Lancement du serveur ----------
const PORT = 3000;
app.listen(PORT, () => {
  console.log(`Serveur sur http://localhost:${PORT}`);
});
