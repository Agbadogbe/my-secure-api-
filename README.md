# 🛡️ API Recettes Sécurisée (JWT + Bcrypt)

**Objectif du projet** : Concevoir et implémenter une API REST sécurisée utilisant Node.js, Express et MongoDB, en respectant les exigences de sécurité strictes du TP (JWT, bcrypt, CORS, Rate Limiting).

-----

## 📝 Thématique et Ressources

**Thématique** : Recettes de Cuisine.

| Ressource | Rôle | CRUD | Relation | Protection |
| :--- | :--- | :--- | :--- | :--- |
| **User** | Authentification / Auteur | Non (géré par `/auth`) | - | - |
| **Recipe** | Ressource principale (Recette) | CRUD complet (GET, POST, PATCH, DELETE) | Référence à `User` (Auteur) | CRUD Protégé (POST/PATCH/DELETE) |
| **Comment** | Contenu utilisateur | CRUD complet | Références à `User` et `Recipe` | CRUD Protégé (POST/PATCH/DELETE) |

-----

## ⚙️ Technologies Utilisées

  * **Langage/Runtime** : Node.js / JavaScript (ES Modules)
  * **Framework** : Express
  * **Base de Données** : MongoDB
  * **ORM** : Mongoose
  * **Sécurité** : JWT, bcrypt, CORS, Helmet, Rate Limiting, express-validator.

-----

## 🚀 Installation et Démarrage

### Prérequis

  * Node.js (\>= 18)
  * MongoDB en cours d'exécution

### Étapes

1.  **Cloner le dépôt et installer les dépendances :**

    ```bash
    git clone git@github.com:Agbadogbe/my-secure-api-.git
    cd my-secure-api-
    npm install
    ```

2.  **Configuration des variables d'environnement (.env) :**
    Créez un fichier `.env` à la racine du projet, en vous basant sur `.env.example`.
    *Assurez-vous que `MONGO_URI` et `JWT_SECRET` sont bien renseignés.*

3.  **Démarrage du serveur en mode développement :**

    ```bash
    npm run dev
    ```

    Le serveur sera accessible sur `http://localhost:3000`.

-----

## 🛣️ Endpoints Principaux (API REST)

Tous les endpoints sont préfixés par `/api`.

| Catégorie | Méthode | Endpoint | Description | Protection |
| :--- | :--- | :--- | :--- | :--- |
| **Auth** | `POST` | `/auth/register` | Création de compte (Hash bcrypt) | Public |
| **Auth** | `POST` | `/auth/login` | Connexion (Retourne le token JWT) | Public (Rate Limité) |
| **Recettes** | `GET` | `/recipes` | Liste (supporte `?page=1&limit=10` pour la pagination) | Public |
| **Recettes** | `POST` | `/recipes` | Créer une recette | Authentifié (JWT) |
| **Recettes** | `DELETE` | `/recipes/:id` | Supprimer une recette | Authentifié (Auteur ou Admin) |
| **Commentaires** | `POST` | `/recipes/:recipeId/comments` | Ajouter un commentaire à une recette | Authentifié (JWT) |
| **Commentaires** | `DELETE` | `/comments/:commentId` | Supprimer un commentaire | Authentifié (Auteur ou Admin) |