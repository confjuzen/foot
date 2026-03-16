# Application de Gestion de Club de Football

Une application web simple pour suivre les performances des joueurs lors des matchs, développée avec NestJS (backend) et React (frontend).

## Fonctionnalités

- **Gestion des joueurs** : Créer et lister les joueurs avec leur position
- **Gestion des matchs** : Créer et lister les matchs entre équipes
- **Enregistrement des performances** : Ajouter les statistiques des joueurs (buts, passes décisives, note) pour chaque match
- **Statistiques** : Calcul de la moyenne des notes pour chaque joueur

## Architecture

### Backend (NestJS)
- API REST avec TypeScript
- Stockage des données en mémoire
- Endpoints pour la gestion des joueurs, matchs et performances

### Frontend (React)
- Interface utilisateur avec React et TypeScript
- Navigation entre les différentes pages
- Communication avec l'API via Axios

## Démarrage rapide

### Installation des dépendances

#### Prérequis
- Node.js
- npm

```bash
./install.sh
```

### Lancement de l'application

```bash
./start.sh
```

### Accès à l'application
- Frontend : http://localhost:3000
- Backend API : http://localhost:3001

## API Endpoints

GET /players
→ récupérer tous les joueurs

POST /players
→ créer un joueur

GET /matches
→ récupérer les matchs

POST /matches
→ créer un match

POST /matches/:matchId/performances
→ Ajouter une performance

- `GET /players/stats` - Récupérer les joueurs avec leur note moyenne


- `GET /matches/:id` - Récupérer un match spécifique
GET /matches/:id (match details)


- `GET /matches/:matchId/performances` - Récupérer les performances d'un match
GET /matches/:matchId/performances (list performances for a match)


GET /performances (list all performances)
GET /players/:id/performances (list performances for a player)

### Exemple Body
```json
POST /players
{
  "name": "Kylian Mbappé",
  "position": "Forward"
}

POST /matches
{
  "teamA": "PSG",
  "teamB": "OM",
  "date": "2026-03-12"
}

POST /matches/:matchId/performances
{
  "playerId": 2,
  "goals": 1,
  "assists": 1,
  "rating": 8
}
```

## Structure du projet

```
/
├── backend/                 # API NestJS
│   ├── src/
│   │   ├── player/        # Gestion des joueurs
│   │   ├── match/         # Gestion des matchs
│   │   ├── performance/   # Gestion des performances
│   │   ├── data/          # Service de stockage en mémoire
│   │   └── app.module.ts  # Module principal
│   └── package.json
├── frontend/               # Application React
│   ├── src/
│   │   ├── components/    # Composants réutilisables
│   │   ├── pages/         # Pages de l'application
│   │   ├── services/      # Services API
│   │   ├── types/         # Types TypeScript
│   │   └── App.tsx        # Composant principal
│   └── package.json
└── README.md
```

## Fonctionnalités implémentées

✅ **Backend**
- CRUD des joueurs
- CRUD des matchs
- CRUD des performances
- Calcul des moyennes de notes
- Tests unitaires

✅ **Frontend**
- Page de gestion des joueurs
- Page de gestion des matchs
- Page de détails d'un match avec performances
- Page de statistiques des joueurs
- Navigation intuitive

✅ **Calcul des statistiques**
- Moyenne des notes par joueur sur tous les matchs
- Affichage des performances détaillées par match

## Améliorations possibles (bonus)

- Validation des données côté backend
- Gestion des erreurs améliorée
- Base de données persistante (PostgreSQL, MongoDB)
- Interface utilisateur plus moderne
- Tests e2e
- Authentification des utilisateurs
- Export des statistiques

## Technologies utilisées

- **Backend** : NestJS, TypeScript, Jest
- **Frontend** : React, TypeScript, React Router, Axios
- **Développement** : Node.js, npm
