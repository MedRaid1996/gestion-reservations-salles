# gestion-reservations-salles

Système de Gestion des Réservations de Salles

Ce projet a été réalisé dans le cadre du cours de développement web.
L’objectif est de permettre la gestion des réservations de salles dans un établissement scolaire, avec deux types d’utilisateurs : enseignants et étudiants.

L’application permet de créer, consulter, modifier et annuler des réservations selon le rôle de l’utilisateur.

1. Équipe du projet
Nom	Rôle	Contribution
Raid Sellai	Développeur principal	Authentification, architecture générale, intégration, tests
Ali Boutaha	Collaborateur	Création des réservations
Zaid Messahli	Collaborateur	Consultation des réservations
Kamilia Gamouri	Collaboratrice	Modification et annulation des réservations
2. Fonctionnalités
Authentification

Connexion avec email et mot de passe

Gestion d’une session utilisateur

Distinction entre enseignant et étudiant

Enseignant

Créer une réservation

Voir ses propres réservations

Modifier une réservation

Annuler une réservation

Étudiant

Choisir une classe dans une liste

Consulter les réservations associées à cette classe

3. Technologies utilisées

Node.js

Express.js

SQLite3

SQLiteStudio (gestion de la base de données)

Handlebars (hbs)

express-session

HTML / CSS

4. Structure du projet
/src
  /routes
    authRoutes.js
    roomRoutes.js
    reservationRoutes.js
  /views
    /partials
    login.hbs
    salles.hbs
    reservations.hbs
    reservation_new.hbs
    reservation_edit.hbs
  app.js
/db
  reservations.db
/public
  styles.css
README.md
package.json

5. Installation et exécution
Installation des dépendances
npm install

Lancement du serveur
npm run dev


L’application sera accessible à :
http://localhost:3000

6. Base de données

Le système utilise SQLite.
La table des réservations est configurée avec un identifiant auto-incrémenté :

id INTEGER PRIMARY KEY AUTOINCREMENT


Les autres tables utilisées sont :

users (rôle, email, mot de passe, classe associée)

rooms (liste des salles)

classes (groupes d’étudiants)

7. Scénarios de test
Ensemble des tests pour l’enseignant

Se connecter

Créer une réservation

Modifier une réservation existante

Annuler une réservation

Vérifier la mise à jour en base de données

Ensemble des tests pour l’étudiant

Se connecter

Choisir une classe

Afficher les réservations correspondantes

8. Diagrammes UML

Le projet est accompagné de :

un diagramme de cas d’utilisation

un mini-diagramme de classes

plusieurs diagrammes de séquence

Ils reflètent le comportement réel du système.

9. Exemples d'utilisation

Pour faciliter la prise en main de l'application, un guide complet d'exemples d'utilisation est disponible. Ce guide présente des cas d'utilisation concrets avec des étapes détaillées pour :

- Créer, consulter, modifier et annuler des réservations
- Utiliser l'application en tant qu'enseignant ou étudiant
- Comprendre le fonctionnement du système avec des scénarios réalistes

📖 **Consulter le guide** : [docs/exemples_utilisation.md](docs/exemples_utilisation.md)

Le guide inclut :
- Instructions d'installation et de démarrage
- 6 cas d'utilisation détaillés avec pré-conditions, étapes et résultats attendus
- Un scénario complet de bout en bout
- Des exemples de données et de résultats visuels

10. Conclusion

Ce projet met en pratique plusieurs notions vues en cours :

développement avec Express

gestion d'une base de données SQLite

utilisation d’un moteur de templates

gestion de rôles et d’accès

organisation du code et travail collaboratif via GitHub

Le système final est fonctionnel et couvre toutes les fonctionnalités demandées dans l’énoncé.