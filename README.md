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

### Installation locale sans Docker

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
npx prisma generate
npx prisma migrate dev
```

4. Démarrez l'application en mode développement :

```.bash

npm run dev

```

## Dockerisation

Le projet est entièrement configuré pour fonctionner dans un environnement Docker. Suivez ces étapes pour lancer l'application avec Docker.

### Étapes

1. Clonez le repository :

2. Assurez-vous que Docker et Docker Compose sont installés sur votre machine.
3. Créez un fichier `.env` pour configurer vos variables d'environnement. Exemple :

   ```.env
   # Configuration de la base de données
   DATABASE_URL="postgresql://admin:1234@db:5432/nyc-urban-data"
   REDIS_HOST=redis
   REDIS_PORT=6379
   REDIS_PASSWORD=your_redis_password
   ```

4. Construisez les images Docker :

   ```.bash
   docker-compose build
   ```

5. Démarrez les conteneurs :

   ```.bash
   docker-compose up
   ```

6. Accédez à l'application sur [http://localhost:3000](http://localhost:3000).

## Routes disponibles

### **Frontend**

-   `/`: Accès à l'interface principale pour visualiser les cartes des crimes et des stations de vélos.

### **Backend**

-   **`/api/metrics`**: Retourne des métriques pour Prometheus afin de surveiller l'application.
-   **`/api/crimes`**: Endpoint permettant d’accéder aux données des crimes. Vous pouvez utiliser des paramètres pour filtrer les résultats par date, type de crime, ou localisation.
-   **`/api/stations`**: Fournit des données en temps réel sur les stations de vélos libres, incluant la disponibilité actuelle.

## Technologies utilisées

-   **Next.js** : Framework React.
-   **Prisma** : ORM pour la gestion des bases de données.
-   **PostgreSQL** : Base de données relationnelle.
-   **Redis** : Cache pour des performances optimales.
-   **Docker** : Conteneurisation pour un environnement de développement reproductible.
-   **Prometheus & Grafana** : Surveillance et visualisation des métriques.

### Services Docker

Le fichier `docker-compose.yml` inclut plusieurs services :

- **Base de données PostgreSQL** : Utilisée pour stocker les données des crimes et des stations.
- **Redis** : Cache utilisé pour des opérations rapides en mémoire.
- **Prometheus** : Collecte de métriques pour la surveillance.
- **Grafana** : Tableau de bord pour la visualisation des métriques Prometheus.
- **Next.js App** : Application web front-end.

### Structure du projet

Voici la structure des fichiers de ce projet :

```.ruby
NYC-URBAN-DATA-ANALYTICS-NEXT/
│
├── .next/ # Dossier de build Next.js
├── data/ # Données CSV des crimes
├── prisma/ # Prisma setup (Schémas, migrations)
├── public/ # Assets publics (images, icônes)
├── src/ # Code source de l'application
│ ├── api/ # API (endpoints)
│ ├── components/ # Composants React
│ ├── pages/ # Pages Next.js
│ └── styles/ # Fichiers de styles
├── .env # Variables d'environnement
├── docker-compose.yml # Docker Compose pour l'environnement de développement
├── next.config.js # Configuration de Next.js
├── package.json # Dépendances et scripts du projet
└── README.md # Ce fichier
```

### Utilisation

1. Accédez à la carte des crimes et stations de vélos à travers l'interface.

2. Utilisez les filtres pour explorer les données par date, type de crime, ou quartier.

3. Visualisez les statistiques sur le tableau de bord.
