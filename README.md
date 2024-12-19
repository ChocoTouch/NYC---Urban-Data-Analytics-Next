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
   DATABASE_URL="your-database-url"
   NEXT_PUBLIC_API_URL="your-api-url"
   ```

3. Pour migrez votre base de données avec prisma :

   ```.bash
   npx prisma migrate dev
   ```

4. Démarrez l'application en mode développement :

   ```.bash
   npm run dev
   ```

### Structure du projet

Voici un aperçu de la structure des répertoires du projet :

```bash
    /nyc-urban-data-analytics-next
|-- /pages
|   |-- index.js       # Page d'accueil
|   |-- /api           # Endpoints API
|-- /components
|   |-- CrimeMap.js    # Composant de la carte des crimes
|   |-- BikeStation.js # Composant des stations de vélos
|-- /prisma
|   |-- schema.prisma  # Schéma de la base de données
|-- /public
|   |-- /images        # Images statiques
|-- /styles
|   |-- globals.css    # Styles globaux
|-- /lib
|   |-- prisma.js      # Configuration Prisma
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