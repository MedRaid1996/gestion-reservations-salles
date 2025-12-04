function requireAuth(req, res, next) {
  if (!req.session.user) {
    return res.redirect("/login");
  }
  next();
}

function requireEnseignant(req, res, next) {
  if (!req.session.user || req.session.user.role !== "ENSEIGNANT") {
    return res.status(403).send("Accès réservé aux enseignants");
  }
  next();
}

module.exports = { requireAuth, requireEnseignant };
