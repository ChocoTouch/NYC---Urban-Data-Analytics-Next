# NYC Urban Data Analytics - Next.js

Ce projet est une application d'analyse de données urbaines pour la ville de New York, incluant des informations sur les crimes et les stations de vélos. L'application utilise Next.js pour le front-end et Prisma pour la gestion de la base de données.

## Fonctionnalités

- **Carte des crimes**: Affiche les incidents criminels géolocalisés.
- **Stations de vélos**: Visualisation des stations de vélos libres avec des informations en temps réel.
- **Filtres de données**: Filtre par type de crime, par quartier, et par date.
- **Tableaux de bord**: Visualisation des statistiques de crimes et stations.
- **Responsivité**: Interface adaptée pour mobile et bureau.

## Installation

### Prérequis

- **Node.js** : Version 16.x ou supérieure.
- **Docker** (facultatif, mais recommandé pour les environnements de développement).
- **Prisma** : Pour la gestion de la base de données.

### Étapes d'installation

1. Clonez le repository :

   ```bash
   git clone https://github.com/yourusername/nyc-urban-data-analytics-next.git
   cd nyc-urban-data-analytics-next
   ```

2. Installez les dépendances :

   ```bash
   npm install
   ```

3. Configurez les variables d'environnement dans un fichier .env. Exemple de base :

   ```.env
   DATABASE_URL="postgresql://janedoe:mypassword@localhost:5432/mydb"
   REDIS_HOST=localhost
   REDIS_PORT=6379
   REDIS_PASSWORD=your_redis_password
   ```

3. Pour migrez votre base de données avec prisma :

   ```.bash
   npx prisma migrate dev
   ```

4. Démarrez l'application en mode développement :

   ```.bash
   npm run dev
   ```

### Technologies utilisées

- **Next.js** : Framework React

### Docker

Si vous souhaitez utiliser Docker pour le développement, vous pouvez utiliser les fichiers Docker inclus dans ce projet.

1. Construisez l'image Docker :

   ```.bash
   docker-compose build
   ```

2. Démarrez le conteneur Docker :

   ```.bash
   docker-compose up
   ```

### Structure du projet

Voici la structure des fichiers de ce projet :

   ```.ruby
   NYC-URBAN-DATA-ANALYTICS-NEXT/
    │
    ├── .next/                  # Dossier de build Next.js
    ├── data/                   # Données CSV des crimes
    ├── prisma/                 # Prisma setup (Schémas, migrations)
    ├── public/                 # Assets publics (images, icônes)
    ├── src/                    # Code source de l'application
    │   ├── api/                # API (endpoints)
    │   ├── components/         # Composants React
    │   ├── pages/              # Pages Next.js
    │   └── styles/             # Fichiers de styles
    ├── .env                    # Variables d'environnement
    ├── docker-compose.yml      # Docker Compose pour l'environnement de développement
    ├── next.config.js          # Configuration de Next.js
    ├── package.json            # Dépendances et scripts du projet
    └── README.md               # Ce fichier
   ```

### Structure du projet

1. Accédez à la carte des crimes et stations de vélos à travers l'interface.

2. Utilisez les filtres pour explorer les données par date, type de crime, ou quartier.

3. Visualisez les statistiques sur le tableau de bord.