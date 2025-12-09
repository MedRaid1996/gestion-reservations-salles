# Système de Gestion des Réservations de Salles

Ce projet a été réalisé dans le cadre du cours d'Analyse et conception de systèmes.
L'objectif est de permettre la gestion des réservations de salles dans un établissement scolaire, avec deux types d'utilisateurs : enseignants et étudiants.

L'application permet de créer, consulter, modifier et annuler des réservations selon le rôle de l'utilisateur.

## 1. Équipe du projet

| Nom | Rôle | Contribution |
|-----|------|--------------|
| Mohammed Raid Sellai | Développeur principal | Authentification, architecture générale, intégration, tests |
| Ali Boutaha | Collaborateur | Création des réservations |
| Zaid Messahli | Collaborateur | Consultation des réservations |
| Kamilia Gamouri | Collaboratrice | Modification et annulation des réservations |

## 2. Fonctionnalités

### Authentification
- Connexion avec email et mot de passe
- Gestion d'une session utilisateur
- Distinction entre enseignant et étudiant

### Enseignant
- Créer une réservation
- Voir ses propres réservations
- Modifier une réservation
- Annuler une réservation

### Étudiant
- Choisir une classe dans une liste
- Consulter les réservations associées à cette classe

## 3. Technologies utilisées

- Node.js
- Express.js
- SQLite avec sql.js (JavaScript pur, pas de compilation native)
- Handlebars (hbs)
- express-session
- bcrypt (hashage sécurisé des mots de passe)
- HTML / CSS

**Note importante** : Le projet utilise sql.js au lieu de better-sqlite3, ce qui élimine le besoin de Visual Studio Build Tools et assure la compatibilité avec toutes les versions de Node.js.

## 4. Structure du projet

```
gestion-reservations-salles/
├── src/
│   ├── routes/
│   │   ├── authRoutes.js
│   │   ├── roomRoutes.js
│   │   └── reservationRoutes.js
│   ├── views/
│   │   ├── layouts/
│   │   │   └── main.hbs
│   │   ├── partials/
│   │   │   ├── header.hbs
│   │   │   └── footer.hbs
│   │   ├── login.hbs
│   │   ├── rooms.hbs
│   │   ├── reservations.hbs
│   │   ├── reservation_new.hbs
│   │   └── reservation_edit.hbs
│   ├── app.js
│   ├── db.js
│   └── middleware.js
├── data/
│   └── reservations.db
├── public/
│   └── css/
│       └── styles.css
├── init-db.js
├── package.json
└── README.md
```

## 5. Installation et exécution

### Prérequis
- Node.js (version 18 ou supérieure recommandée)
- npm (inclus avec Node.js)

### Installation des dépendances

```bash
npm install
```

### Initialisation de la base de données

```bash
node init-db.js
```

### Lancement du serveur

```bash
npm run dev
```

L'application sera accessible à : **http://localhost:3000**

## 6. Comptes de test

### Enseignant
- **Email** : prof@example.com
- **Mot de passe** : password123

### Étudiant
- **Email** : etudiant@example.com
- **Mot de passe** : password123

## 7. Base de données

Le système utilise SQLite avec sql.js.
La table des réservations est configurée avec un identifiant auto-incrémenté :

```sql
id INTEGER PRIMARY KEY AUTOINCREMENT
```

Les autres tables utilisées sont :

- **users** : rôle, email, mot de passe, classe associée
- **rooms** : liste des salles
- **classes** : groupes d'étudiants
- **reservations** : réservations de salles

## 8. Scénarios de test

### Ensemble des tests pour l'enseignant
1. Se connecter
2. Créer une réservation
3. Modifier une réservation existante
4. Annuler une réservation
5. Vérifier la mise à jour en base de données

### Ensemble des tests pour l'étudiant
1. Se connecter
2. Choisir une classe
3. Afficher les réservations correspondantes

## 9. Diagrammes UML

Le projet est accompagné de :
- un diagramme de cas d'utilisation
- un mini-diagramme de classes
- plusieurs diagrammes de séquence

Ils reflètent le comportement réel du système.

## 10. Scripts disponibles

- **npm start** : Lance le serveur en mode production
- **npm run dev** : Lance le serveur en mode développement avec nodemon
- **node init-db.js** : Initialise ou réinitialise la base de données

## 11. Problèmes courants et solutions

### Le serveur ne démarre pas
**Solution** : Vérifiez que le port 3000 n'est pas déjà utilisé ou supprimez node_modules et relancez `npm install`

### La base de données est vide
**Solution** : Exécutez `node init-db.js` pour réinitialiser la base de données

### Impossible de se connecter
**Solution** : Vérifiez les identifiants ou réinitialisez la base de données avec `node init-db.js`

## 12. Conclusion

Ce projet met en pratique plusieurs notions vues en cours d'Analyse et conception de systèmes :

- Développement avec Express
- Gestion d'une base de données SQLite
- Utilisation d'un moteur de templates
- Gestion de rôles et d'accès
- Organisation du code et travail collaboratif via GitHub

Le système final est fonctionnel et couvre toutes les fonctionnalités demandées dans l'énoncé.
