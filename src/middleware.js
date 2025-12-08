/**
 * Middleware pour vérifier qu'un utilisateur est authentifié
 * Redirige vers la page de login si l'utilisateur n'est pas connecté
 * @param {Object} req - Objet de requête Express
 * @param {Object} res - Objet de réponse Express
 * @param {Function} next - Fonction pour passer au middleware suivant
 */
function requireAuth(req, res, next) {
  if (!req.session.user) {
    return res.redirect("/login");
  }
  next();
}

/**
 * Middleware pour vérifier qu'un utilisateur est un enseignant
 * Retourne une erreur 403 si l'utilisateur n'est pas connecté ou n'est pas un enseignant
 * @param {Object} req - Objet de requête Express
 * @param {Object} res - Objet de réponse Express
 * @param {Function} next - Fonction pour passer au middleware suivant
 */
function requireEnseignant(req, res, next) {
  if (!req.session.user || req.session.user.role !== "ENSEIGNANT") {
    return res.status(403).send("Accès réservé aux enseignants");
  }
  next();
}

// Export des middlewares pour utilisation dans les routes
module.exports = { requireAuth, requireEnseignant };
