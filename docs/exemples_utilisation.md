# Guide d'utilisation - Exemples pratiques

Ce document présente des exemples d'utilisation concrets du système de gestion des réservations de salles. Chaque cas d'utilisation est détaillé avec les pré-conditions, les étapes à suivre, les données d'entrée et les résultats attendus.

## Table des matières

1. [Installation et démarrage](#installation-et-démarrage)
2. [Cas d'utilisation 1 : Créer une réservation simple](#cas-dutilisation-1--créer-une-réservation-simple)
3. [Cas d'utilisation 2 : Consulter les réservations (Enseignant)](#cas-dutilisation-2--consulter-les-réservations-enseignant)
4. [Cas d'utilisation 3 : Modifier une réservation existante](#cas-dutilisation-3--modifier-une-réservation-existante)
5. [Cas d'utilisation 4 : Annuler une réservation](#cas-dutilisation-4--annuler-une-réservation)
6. [Cas d'utilisation 5 : Consulter le planning (Étudiant)](#cas-dutilisation-5--consulter-le-planning-étudiant)
7. [Cas d'utilisation 6 : Gestion des conflits de réservation](#cas-dutilisation-6--gestion-des-conflits-de-réservation)

---

## Installation et démarrage

### Pré-requis
- Node.js (version 14 ou supérieure)
- npm (gestionnaire de paquets Node.js)

### Étapes d'installation

1. **Cloner le dépôt** (si ce n'est pas déjà fait)
   ```bash
   git clone https://github.com/MedRaid1996/gestion-reservations-salles.git
   cd gestion-reservations-salles
   ```

2. **Installer les dépendances**
   ```bash
   npm install
   ```

3. **Initialiser la base de données** (si nécessaire)
   
   La base de données SQLite est déjà créée dans le dossier `data/`. Si vous souhaitez réinitialiser les données, vous pouvez supprimer `data/reservations.db` et recréer la base avec le schéma fourni :
   ```bash
   sqlite3 data/reservations.db < data/schema.sql
   ```

4. **Démarrer le serveur**
   
   En mode développement (avec rechargement automatique) :
   ```bash
   npm run dev
   ```
   
   Ou en mode production :
   ```bash
   npm start
   ```

5. **Accéder à l'application**
   
   Ouvrir un navigateur et aller à l'adresse :
   ```
   http://localhost:3000
   ```

### Comptes de test disponibles

La base de données contient deux comptes de démonstration :

- **Enseignant**
  - Email : `prof@example.com`
  - Mot de passe : `prof123`

- **Étudiant**
  - Email : `etu@example.com`
  - Mot de passe : `etu123`
  - Classe assignée : Groupe 1

---

## Cas d'utilisation 1 : Créer une réservation simple

### Description
Un enseignant souhaite réserver une salle pour un cours avec une classe spécifique.

### Pré-conditions
- L'utilisateur doit être connecté avec un compte enseignant
- Au moins une salle doit exister dans le système
- Au moins une classe doit exister dans le système

### Étapes détaillées

1. **Se connecter en tant qu'enseignant**
   - Ouvrir `http://localhost:3000/login`
   - Entrer l'email : `prof@example.com`
   - Entrer le mot de passe : `prof123`
   - Cliquer sur "Se connecter"

2. **Accéder à la page de création de réservation**
   - Une fois connecté, cliquer sur "Mes réservations" dans le menu de navigation
   - Cliquer sur le bouton "➕ Créer une réservation"

3. **Remplir le formulaire de réservation**
   
   Exemple de données à remplir :
   - **Salle** : Sélectionner "Salle A101" (capacité 30, Bloc A)
   - **Classe** : Sélectionner "Groupe 1"
   - **Date début** : `2025-12-15T09:00` (15 décembre 2025, 9h00)
   - **Date fin** : `2025-12-15T11:00` (15 décembre 2025, 11h00)

4. **Soumettre le formulaire**
   - Cliquer sur le bouton "Créer la réservation"

### Résultat attendu

- **Redirection** : L'utilisateur est redirigé vers la page "Mes réservations"
- **Message de confirmation** : La nouvelle réservation apparaît dans le tableau
- **Données affichées** :
  ```
  Salle       | Classe    | Début                | Fin                  | Statut | Actions
  Salle A101  | Groupe 1  | 2025-12-15T09:00     | 2025-12-15T11:00    | ACTIVE | Annuler | Modifier
  ```
- **Base de données** : Une nouvelle ligne est insérée dans la table `reservations` avec :
  - `salle_id` = 1 (Salle A101)
  - `classe_id` = 1 (Groupe 1)
  - `enseignant_id` = 1 (Prof Démo)
  - `date_debut` = "2025-12-15T09:00"
  - `date_fin` = "2025-12-15T11:00"
  - `statut` = "ACTIVE"

### Capture d'écran / Reproduction visuelle

```
┌─────────────────────────────────────────────────────────────────┐
│ Système de gestion des réservations de salles                  │
│ Connecté : Prof Démo (ENSEIGNANT) [Se déconnecter]             │
│ [Salles] [Mes réservations]                                     │
├─────────────────────────────────────────────────────────────────┤
│ Mes réservations                                                 │
│ [➕ Créer une réservation]                                       │
│                                                                  │
│ ┌──────────────────────────────────────────────────────────┐   │
│ │ Salle     │ Classe   │ Début           │ Fin             │   │
│ │ Salle A101│ Groupe 1 │ 2025-12-15T09:00│ 2025-12-15T11:00│   │
│ │           │          │                 │                 │   │
│ │ [Annuler] [Modifier]                                      │   │
│ └──────────────────────────────────────────────────────────┘   │
└─────────────────────────────────────────────────────────────────┘
```

---

## Cas d'utilisation 2 : Consulter les réservations (Enseignant)

### Description
Un enseignant souhaite consulter toutes ses réservations existantes pour planifier ses cours.

### Pré-conditions
- L'utilisateur doit être connecté avec un compte enseignant
- L'enseignant doit avoir créé au moins une réservation

### Étapes détaillées

1. **Se connecter en tant qu'enseignant**
   - Email : `prof@example.com`
   - Mot de passe : `prof123`

2. **Accéder à la liste des réservations**
   - Cliquer sur "Mes réservations" dans le menu de navigation
   - Ou accéder directement à : `http://localhost:3000/reservations/ma-classe`

3. **Visualiser les réservations**
   - Le tableau affiche toutes les réservations créées par l'enseignant
   - Les colonnes affichées sont : Salle, Classe, Début, Fin, Statut, Actions

### Résultat attendu

- **Page affichée** : "Mes réservations"
- **Contenu** : Tableau avec toutes les réservations de l'enseignant connecté
- **Tri** : Les réservations sont triées par date de début (ordre croissant)
- **Actions disponibles** : Pour chaque réservation, les boutons "Annuler" et "Modifier" sont visibles

### Exemple de résultat

```
Mes réservations
[➕ Créer une réservation]

Salle       | Classe    | Début                | Fin                  | Statut | Actions
─────────────────────────────────────────────────────────────────────────────────────
Salle A101  | Groupe 1  | 2025-12-15T09:00     | 2025-12-15T11:00    | ACTIVE | Annuler | Modifier
Salle B202  | Groupe 2  | 2025-12-16T14:00     | 2025-12-16T16:00    | ACTIVE | Annuler | Modifier
```

---

## Cas d'utilisation 3 : Modifier une réservation existante

### Description
Un enseignant souhaite modifier les détails d'une réservation existante (changer la salle, la classe, ou les horaires).

### Pré-conditions
- L'utilisateur doit être connecté avec un compte enseignant
- Une réservation doit exister dans le système

### Étapes détaillées

1. **Se connecter et accéder à la liste des réservations**
   - Se connecter en tant qu'enseignant (`prof@example.com` / `prof123`)
   - Aller sur "Mes réservations"

2. **Sélectionner la réservation à modifier**
   - Dans le tableau, cliquer sur le lien "Modifier" de la réservation souhaitée

3. **Modifier les informations**
   
   Exemple de modification :
   - **Salle** : Changer de "Salle A101" à "Salle B202"
   - **Classe** : Garder "Groupe 1"
   - **Date début** : Changer de `2025-12-15T09:00` à `2025-12-15T10:00`
   - **Date fin** : Changer de `2025-12-15T11:00` à `2025-12-15T12:00`

4. **Enregistrer les modifications**
   - Cliquer sur le bouton "Enregistrer les modifications"

### Résultat attendu

- **Redirection** : Retour à la page "Mes réservations"
- **Mise à jour** : La réservation affiche les nouvelles informations
  ```
  Salle       | Classe    | Début                | Fin                  | Statut
  Salle B202  | Groupe 1  | 2025-12-15T10:00     | 2025-12-15T12:00    | ACTIVE
  ```
- **Base de données** : La ligne correspondante dans la table `reservations` est mise à jour avec les nouvelles valeurs

### Formulaire de modification (exemple visuel)

```
┌─────────────────────────────────────────────────┐
│ Modifier une réservation                        │
├─────────────────────────────────────────────────┤
│ Salle :      [▼ Salle B202      ]              │
│                                                  │
│ Classe :     [▼ Groupe 1        ]              │
│                                                  │
│ Date début : [2025-12-15T10:00  ]              │
│                                                  │
│ Date fin :   [2025-12-15T12:00  ]              │
│                                                  │
│ [Enregistrer les modifications]                 │
└─────────────────────────────────────────────────┘
```

---

## Cas d'utilisation 4 : Annuler une réservation

### Description
Un enseignant souhaite annuler (supprimer) une réservation qu'il a créée.

### Pré-conditions
- L'utilisateur doit être connecté avec un compte enseignant
- Une réservation doit exister dans le système

### Étapes détaillées

1. **Se connecter et accéder à la liste des réservations**
   - Se connecter en tant qu'enseignant (`prof@example.com` / `prof123`)
   - Aller sur "Mes réservations"

2. **Sélectionner la réservation à annuler**
   - Dans le tableau, cliquer sur le lien "Annuler" de la réservation souhaitée

3. **Confirmer l'annulation**
   - Une fenêtre de confirmation JavaScript apparaît : "Voulez-vous vraiment annuler cette réservation ?"
   - Cliquer sur "OK" pour confirmer

### Résultat attendu

- **Redirection** : Retour à la page "Mes réservations"
- **Suppression** : La réservation n'apparaît plus dans le tableau
- **Base de données** : La ligne correspondante est supprimée de la table `reservations`
- **Si aucune réservation** : Le message "Aucune réservation trouvée pour cette recherche." s'affiche

### Exemple avant/après

**Avant l'annulation :**
```
Salle       | Classe    | Début                | Fin                  | Statut | Actions
─────────────────────────────────────────────────────────────────────────────────────
Salle A101  | Groupe 1  | 2025-12-15T09:00     | 2025-12-15T11:00    | ACTIVE | Annuler | Modifier
Salle B202  | Groupe 2  | 2025-12-16T14:00     | 2025-12-16T16:00    | ACTIVE | Annuler | Modifier
```

**Après avoir annulé la première réservation :**
```
Salle       | Classe    | Début                | Fin                  | Statut | Actions
─────────────────────────────────────────────────────────────────────────────────────
Salle B202  | Groupe 2  | 2025-12-16T14:00     | 2025-12-16T16:00    | ACTIVE | Annuler | Modifier
```

---

## Cas d'utilisation 5 : Consulter le planning (Étudiant)

### Description
Un étudiant souhaite consulter toutes les réservations de sa classe pour connaître son emploi du temps.

### Pré-conditions
- L'utilisateur doit être connecté avec un compte étudiant
- L'étudiant doit être assigné à une classe
- Des réservations doivent exister pour cette classe

### Étapes détaillées

1. **Se connecter en tant qu'étudiant**
   - Ouvrir `http://localhost:3000/login`
   - Entrer l'email : `etu@example.com`
   - Entrer le mot de passe : `etu123`
   - Cliquer sur "Se connecter"

2. **Accéder aux réservations**
   - L'étudiant est automatiquement redirigé vers `/reservations/ma-classe`
   - Ou cliquer sur "Consulter les réservations de ma classe" dans le menu

3. **Consulter les réservations de sa classe**
   - Par défaut, les réservations de la classe de l'étudiant (Groupe 1) sont affichées
   - L'étudiant peut choisir une autre classe dans le menu déroulant

4. **Changer de classe (optionnel)**
   - Sélectionner une autre classe dans le menu déroulant "Choisir la classe"
   - Cliquer sur "Afficher les réservations"

### Résultat attendu

- **Page affichée** : "Réservations de la classe"
- **Menu déroulant** : Liste de toutes les classes disponibles
- **Tableau** : Affiche toutes les réservations de la classe sélectionnée
- **Colonnes affichées** : Salle, Classe, Début, Fin, Statut
- **Actions** : Aucune action (Annuler/Modifier) n'est visible pour les étudiants (lecture seule)

### Exemple de résultat

```
┌─────────────────────────────────────────────────────────────────┐
│ Système de gestion des réservations de salles                  │
│ Connecté : Étudiant Démo (ETUDIANT) [Se déconnecter]           │
│ [Consulter les réservations de ma classe] [Liste des salles]   │
├─────────────────────────────────────────────────────────────────┤
│ Réservations de la classe                                       │
│                                                                  │
│ Choisir la classe : [▼ Groupe 1  ] [Afficher les réservations] │
│                                                                  │
│ ────────────────────────────────────────────────────────────    │
│                                                                  │
│ Salle     │ Classe   │ Début           │ Fin             │ Statut│
│───────────────────────────────────────────────────────────────  │
│ Salle A101│ Groupe 1 │ 2025-12-15T09:00│ 2025-12-15T11:00│ ACTIVE│
│ Salle B202│ Groupe 1 │ 2025-12-17T13:00│ 2025-12-17T15:00│ ACTIVE│
└─────────────────────────────────────────────────────────────────┘
```

### Données JSON correspondantes

```json
{
  "reservations": [
    {
      "id": "uuid-1",
      "salleNom": "Salle A101",
      "classeNom": "Groupe 1",
      "date_debut": "2025-12-15T09:00",
      "date_fin": "2025-12-15T11:00",
      "statut": "ACTIVE"
    },
    {
      "id": "uuid-2",
      "salleNom": "Salle B202",
      "classeNom": "Groupe 1",
      "date_debut": "2025-12-17T13:00",
      "date_fin": "2025-12-17T15:00",
      "statut": "ACTIVE"
    }
  ]
}
```

---

## Cas d'utilisation 6 : Gestion des conflits de réservation

### Description
Ce cas illustre ce qui se passe lorsqu'un enseignant tente de créer une réservation qui pourrait entrer en conflit avec une réservation existante.

### Note importante
**Limitation actuelle** : Le système ne vérifie pas automatiquement les conflits de réservation (même salle, même période). Cette fonctionnalité pourrait être ajoutée dans une future version.

### Comportement actuel

Si un enseignant crée deux réservations pour la même salle avec des horaires qui se chevauchent, les deux réservations seront créées sans avertissement.

**Exemple de conflit :**

1. **Réservation 1**
   - Salle : A101
   - Date début : 2025-12-15T09:00
   - Date fin : 2025-12-15T11:00

2. **Réservation 2 (conflit)**
   - Salle : A101
   - Date début : 2025-12-15T10:00
   - Date fin : 2025-12-15T12:00

Les deux réservations seront enregistrées dans la base de données.

### Recommandation

Pour éviter les conflits, il est recommandé aux enseignants de :
1. Consulter d'abord la liste de leurs réservations avant d'en créer une nouvelle
2. Vérifier visuellement qu'il n'y a pas de chevauchement d'horaires pour la même salle
3. Coordonner avec les autres enseignants si nécessaire

### Évolution future suggérée

Dans une version future, le système pourrait :
- Vérifier les conflits avant de créer une réservation
- Afficher un message d'avertissement si un conflit est détecté
- Proposer des créneaux horaires disponibles pour une salle donnée
- Afficher un calendrier visuel des réservations par salle

---

## Scénario complet : Exemple de livrable

### Contexte
Prof Démo doit organiser une série de cours pour le Groupe 1 sur la semaine du 15 au 19 décembre 2025.

### Tâches et jalons

#### Jalon 1 : Planification des réservations

**Tâche 1.1** : Réserver la Salle A101 pour un cours de 2 heures le lundi
- Date : 15 décembre 2025
- Horaire : 9h00 - 11h00
- Salle : A101
- Classe : Groupe 1

**Tâche 1.2** : Réserver la Salle B202 pour un TP de 3 heures le mercredi
- Date : 17 décembre 2025
- Horaire : 13h00 - 16h00
- Salle : B202
- Classe : Groupe 1

**Tâche 1.3** : Réserver la Salle A101 pour un examen de 2 heures le vendredi
- Date : 19 décembre 2025
- Horaire : 10h00 - 12h00
- Salle : A101
- Classe : Groupe 1

#### Jalon 2 : Modification d'une réservation

**Tâche 2.1** : Changement de salle pour le cours du mercredi
- La Salle B202 n'est plus disponible
- Modifier la réservation pour utiliser la Salle A101 à la place
- Nouvel horaire : 14h00 - 17h00 (ajustement d'une heure)

#### Jalon 3 : Annulation et consultation

**Tâche 3.1** : Annuler le cours du lundi (férié non prévu)
- Supprimer la réservation du 15 décembre

**Tâche 3.2** : Vérification par l'étudiant
- L'étudiant du Groupe 1 se connecte et consulte son planning
- Il voit les deux réservations restantes (mercredi et vendredi)

### Instructions pour reproduire le scénario

1. **Démarrer l'application**
   ```bash
   npm run dev
   ```

2. **Réinitialiser la base de données** (optionnel, pour partir d'un état propre)
   ```bash
   rm data/reservations.db
   sqlite3 data/reservations.db < data/schema.sql
   ```

3. **Exécuter le Jalon 1**
   - Se connecter en tant que `prof@example.com`
   - Créer les 3 réservations selon les spécifications de Tâche 1.1, 1.2 et 1.3
   - Vérifier que les 3 réservations apparaissent dans "Mes réservations"

4. **Exécuter le Jalon 2**
   - Cliquer sur "Modifier" pour la réservation du mercredi (17 décembre)
   - Changer la salle de B202 à A101
   - Modifier l'horaire de 13h00-16h00 à 14h00-17h00
   - Enregistrer

5. **Exécuter le Jalon 3**
   - Cliquer sur "Annuler" pour la réservation du lundi (15 décembre)
   - Confirmer la suppression
   - Se déconnecter
   - Se connecter en tant que `etu@example.com`
   - Consulter les réservations du Groupe 1
   - Vérifier que seules 2 réservations sont visibles (17 et 19 décembre)

### Résultat final attendu

**Vue enseignant (Prof Démo) :**
```
Mes réservations

Salle       | Classe    | Début                | Fin                  | Statut | Actions
─────────────────────────────────────────────────────────────────────────────────────
Salle A101  | Groupe 1  | 2025-12-17T14:00     | 2025-12-17T17:00    | ACTIVE | Annuler | Modifier
Salle A101  | Groupe 1  | 2025-12-19T10:00     | 2025-12-19T12:00    | ACTIVE | Annuler | Modifier
```

**Vue étudiant (Étudiant Démo) :**
```
Réservations de la classe

Salle       | Classe    | Début                | Fin                  | Statut
──────────────────────────────────────────────────────────────────────────────
Salle A101  | Groupe 1  | 2025-12-17T14:00     | 2025-12-17T17:00    | ACTIVE
Salle A101  | Groupe 1  | 2025-12-19T10:00     | 2025-12-19T12:00    | ACTIVE
```

---

## Vérification de l'état de la base de données

Pour vérifier manuellement les données en base, vous pouvez utiliser SQLite :

```bash
sqlite3 data/reservations.db
```

Puis exécuter des requêtes SQL :

```sql
-- Voir toutes les réservations
SELECT r.id, rm.nom as salle, c.nom as classe, r.date_debut, r.date_fin, r.statut
FROM reservations r
JOIN rooms rm ON r.salle_id = rm.id
JOIN classes c ON r.classe_id = c.id;

-- Voir les utilisateurs
SELECT * FROM users;

-- Voir les salles
SELECT * FROM rooms;

-- Voir les classes
SELECT * FROM classes;
```

Pour quitter SQLite : `.exit`

---

## Support et dépannage

### L'application ne démarre pas
- Vérifier que Node.js est installé : `node --version`
- Vérifier que les dépendances sont installées : `npm install`
- Vérifier que le port 3000 n'est pas déjà utilisé

### Impossible de se connecter
- Vérifier que la base de données existe : `ls -la data/reservations.db`
- Vérifier les identifiants (voir section "Comptes de test disponibles")
- Réinitialiser la base avec `sqlite3 data/reservations.db < data/schema.sql`

### Les réservations ne s'affichent pas
- Vérifier que vous êtes connecté
- Vérifier que des réservations ont été créées
- Consulter les logs du serveur dans le terminal

---

## Conclusion

Ce guide présente les fonctionnalités principales du système de gestion des réservations de salles à travers des exemples pratiques et reproductibles. Chaque cas d'utilisation a été testé et documenté pour faciliter la prise en main de l'application.

Pour toute question ou suggestion d'amélioration, n'hésitez pas à contacter l'équipe de développement.
