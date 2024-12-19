# Étape 1 : Utiliser l'image officielle Node.js comme base
FROM node:18 AS builder

# Étape 2 : Créer le répertoire de l'application
WORKDIR /app

# Étape 3 : Copier les fichiers package.json et package-lock.json pour l'installation des dépendances
COPY package*.json ./

# Étape 4 : Installer les dépendances
RUN npm install

# Étape 5 : Copier le reste des fichiers de l'application
COPY . .

# Étape 6 : Configurer Prisma pour générer les fichiers adaptés à la plateforme de production
RUN npx prisma generate

# Étape 7 : Build de l'application Next.js
RUN npm run build

# Étape 8 : Préparer l'environnement de production
FROM node:18

# Étape 9 : Créer le répertoire de l'application
WORKDIR /app

# Étape 10 : Copier uniquement les fichiers nécessaires (build et node_modules)
COPY --from=builder /app ./

# Étape 11 : Exposer le port de l'application
EXPOSE 3000

# Étape 12 : Démarrer l'application Next.js en mode production
CMD ["npm", "start"]