const express = require("express");
const session = require("express-session");

const app = express();

// Middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(
  session({
    secret: "unSecretBienCache",
    resave: false,
    saveUninitialized: false,
  })
);

// Routes (on les ajoutera après)
app.get("/", (req, res) => {
  res.send("Système de gestion des réservations de salles - OK");
});

const PORT = 3000;
app.listen(PORT, () => {
  console.log(`Serveur démarré sur http://localhost:${PORT}`);
});
