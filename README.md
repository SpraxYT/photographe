# Sophie Bluel - Portfolio d'architecte (Frontend)

## Description du projet
Développement du frontend pour le portfolio d'une architecte d'intérieur, incluant une interface d'administration.

## Fonctionnalités implémentées

### 1. Page d'accueil
- Galerie de projets dynamique
- Système de filtres par catégorie
- Design responsive
- Navigation fluide

### 2. Système d'authentification
- Page de connexion sécurisée
- Gestion des tokens JWT
- Persistance de la session
- Messages d'erreur personnalisés

### 3. Interface d'administration
- Mode édition pour les administrateurs
- Modal d'ajout/suppression de projets
- Prévisualisation des images
- Gestion des catégories

### 4. Gestion des projets
- Ajout de nouveaux projets
- Suppression de projets existants
- Upload d'images
- Validation des formulaires

## Spécifications techniques

### JavaScript
- Programmation orientée objet
- Requêtes API REST
- Gestion asynchrone (async/await)
- Manipulation du DOM
- Event listeners
- Gestion des formulaires

### Sécurité
- Authentification JWT
- Validation des entrées
- Protection contre les injections
- Gestion sécurisée des tokens

### Architecture
- Organisation modulaire du code
- Séparation des responsabilités
- Réutilisation des composants
- Code maintenable

### Intégration
- HTML sémantique
- CSS responsive
- Interactions fluides
- Modales dynamiques

## API Endpoints utilisés
- GET /api/works : Récupération des projets
- POST /api/works : Ajout d'un projet
- DELETE /api/works/:id : Suppression d'un projet
- POST /api/users/login : Authentification
- GET /api/categories : Récupération des catégories

## Gestion des erreurs
- Validation des formulaires côté client
- Messages d'erreur explicites
- Gestion des erreurs API
- Feedback utilisateur

## Tests et validation
- Compatibilité navigateurs
- Responsive design
- Validation des formulaires
- Sécurité des données

## Installation
1. Cloner le repository
2. Installer les dépendances : `npm install`
3. Lancer le serveur backend (voir README du backend)
4. Ouvrir index.html avec Live Server
