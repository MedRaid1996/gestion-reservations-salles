const express = require("express");
const session = require("express-session");
const path = require("path");

const authRoutes = require("./routes/authRoutes");
const roomRoutes = require("./routes/roomRoutes");
const reservationRoutes = require("./routes/reservationRoutes");

const app = express();
const hbs = require("hbs");
hbs.registerPartials(path.join(__dirname, "views", "partials"));


app.set("view engine", "hbs");
app.set("views", path.join(__dirname, "views"));

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(
  session({
    secret: "unSecretBienCache",
    resave: false,
    saveUninitialized: false,
  })
);

app.use(express.static(path.join(__dirname, "..", "public")));

app.use((req, res, next) => {
  res.locals.user = req.session.user || null;
  next();
});

app.use("/", authRoutes);
app.use("/salles", roomRoutes);
app.use("/reservations", reservationRoutes);

const PORT = 3000;
app.listen(PORT, () => {
  console.log(`Serveur sur http://localhost:${PORT}`);
});
