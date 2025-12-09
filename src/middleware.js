// ========== MIDDLEWARE 1 : Vérifier la connexion ==========
// Cette fonction vérifie que l'utilisateur est connecté
function requireAuth(req, res, next) {
  // Si pas de user en session, rediriger vers la page de login
  if (!req.session.user) {
    return res.redirect("/login");
  }
  // Si l'utilisateur est connecté, continuer vers la route
  next();
}

// ========== MIDDLEWARE 2 : Vérifier le rôle d'enseignant ==========
// Cette fonction vérifie que l'utilisateur est connecté ET qu'il est enseignant
function requireEnseignant(req, res, next) {
  // Vérifier que la session a un user ET que son rôle est "ENSEIGNANT"
  if (!req.session.user || req.session.user.role !== "ENSEIGNANT") {
    // Sinon, envoyer une erreur 403 (Accès interdit)
    return res.status(403).send("Accès réservé aux enseignants");
  }
  // Si c'est bien un enseignant, continuer
  next();
}

// Exporter les middlewares pour les utiliser dans les routes
module.exports = { requireAuth, requireEnseignant };
