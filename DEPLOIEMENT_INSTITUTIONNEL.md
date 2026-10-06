# Guide de Déploiement Institutionnel - Dalil Social

## Objectif

Ce guide explique comment déployer Dalil Social dans un environnement institutionnel réel (ministère des Affaires sociales, gouvernorats, délégations).

## Prérequis

### Infrastructure Technique

- **Serveur**: VPS ou cloud (AWS, Azure, Google Cloud, ou serveur gouvernemental)
- **Système d'exploitation**: Linux (Ubuntu 20.04+ recommandé)
- **RAM**: 2 GB minimum (4 GB recommandé)
- **Stockage**: 20 GB minimum
- **Domaine**: Nom de domaine personnalisé (ex: dalil.social.gov.tn)

### Logiciels Requis

- **Node.js**: Version 18+ (LTS)
- **pnpm**: Version 8+ (gestionnaire de paquets)
- **Git**: Pour le déploiement
- **Docker** (optionnel): Pour le déploiement containerisé
- **PostgreSQL** (optionnel): Pour la base de données (rate limiting, analytics)

### Comptes API Requis

- **Google Generative AI**: Clé API pour l'assistant AI
- **Groq AI** (optionnel): Clé API pour la transcription vocale de fallback
- **Vercel** (optionnel): Pour le déploiement simplifié

## Option 1: Déploiement sur Vercel (Recommandé pour le déploiement rapide)

### Étape 1: Préparer le dépôt

```bash
# Cloner le dépôt
git clone https://github.com/Eya-Manaa2/DALIL.git
cd DALIL

# Installer les dépendances
pnpm install
```

### Étape 2: Configurer les variables d'environnement

Créer un fichier `.env.production`:

```env
# Google AI API (OBLIGATOIRE)
GOOGLE_GENERATIVE_AI_API_KEY=votre_clé_google_ai

# Groq API (optionnel - pour transcription vocale de fallback)
GROQ_API_KEY=votre_clé_groq

# Base de données PostgreSQL (optionnel - pour rate limiting et analytics)
DATABASE_URL=postgresql://user:password@host:5432/dalil

# Authentification (optionnel)
BETTER_AUTH_URL=https://votre-domaine.tn
ADMIN_EMAILS=admin@gouv.tn,moderator@gouv.tn

# Rate limiting (optionnel)
RATE_LIMIT_SALT=votre_salt_secret

# Vercel (auto-rempli par Vercel)
VERCEL_URL=https://votre-domaine.tn
VERCEL_PROJECT_PRODUCTION_URL=https://votre-domaine.tn

NODE_ENV=production
```

### Étape 3: Déployer sur Vercel

```bash
# Installer Vercel CLI
npm i -g vercel

# Se connecter
vercel login

# Déployer
vercel --prod
```

### Étape 4: Configurer le domaine personnalisé

1. Aller sur le dashboard Vercel
2. Ajouter le domaine personnalisé (ex: dalil.social.gov.tn)
3. Configurer les DNS selon les instructions de Vercel
4. Activer SSL automatique

## Option 2: Déploiement sur serveur dédié (Recommandé pour souveraineté des données)

### Étape 1: Préparer le serveur

```bash
# Mettre à jour le serveur
sudo apt update && sudo apt upgrade -y

# Installer Node.js
curl -fsSL https://deb.nodesource.com/setup_18.x | sudo -E bash -
sudo apt install -y nodejs

# Installer pnpm
npm install -g pnpm

# Installer Git
sudo apt install -y git

# (Optionnel) Installer PostgreSQL
sudo apt install -y postgresql postgresql-contrib
```

### Étape 2: Cloner et configurer l'application

```bash
# Cloner le dépôt
git clone https://github.com/Eya-Manaa2/DALIL.git
cd DALIL

# Installer les dépendances
pnpm install

# Créer le fichier .env.production
nano .env.production
```

Ajouter les mêmes variables d'environnement que dans l'Option 1.

### Étape 3: Construire l'application

```bash
# Build de production
pnpm build

# Démarrer en production
pnpm start
```

### Étape 4: Configurer Nginx (reverse proxy)

```bash
# Installer Nginx
sudo apt install -y nginx

# Configurer Nginx
sudo nano /etc/nginx/sites-available/dalil
```

Contenu de la configuration Nginx:

```nginx
server {
    listen 80;
    server_name dalil.social.gov.tn;

    location / {
        proxy_pass http://localhost:3000;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_cache_bypass $http_upgrade;
    }
}
```

Activer le site:

```bash
sudo ln -s /etc/nginx/sites-available/dalil /etc/nginx/sites-enabled/
sudo nginx -t
sudo systemctl restart nginx
```

### Étape 5: Configurer SSL avec Let's Encrypt

```bash
# Installer Certbot
sudo apt install -y certbot python3-certbot-nginx

# Obtenir le certificat SSL
sudo certbot --nginx -d dalil.social.gov.tn
```

### Étape 6: Configurer le service systemd (pour démarrage automatique)

```bash
sudo nano /etc/systemd/system/dalil.service
```

Contenu:

```ini
[Unit]
Description=Dalil Social Application
After=network.target

[Service]
Type=simple
User=www-data
WorkingDirectory=/var/www/DALIL
ExecStart=/usr/bin/pnpm start
Restart=always
Environment=NODE_ENV=production

[Install]
WantedBy=multi-user.target
```

Activer le service:

```bash
sudo systemctl daemon-reload
sudo systemctl enable dalil
sudo systemctl start dalil
```

## Option 3: Déploiement avec Docker (Recommandé pour la reproductibilité)

### Étape 1: Créer le Dockerfile

Créer un fichier `Dockerfile` à la racine:

```dockerfile
FROM node:18-alpine AS base

# Install dependencies only when needed
FROM base AS deps
RUN apk add --no-cache libc6-compat
WORKDIR /app

COPY package.json pnpm-lock.yaml ./
RUN npm install -g pnpm
RUN pnpm install --frozen-lockfile

# Rebuild the source code only when needed
FROM base AS builder
WORKDIR /app
COPY --from=deps /app/node_modules ./node_modules
COPY . .

RUN npm install -g pnpm
RUN pnpm build

# Production image, copy all the files and run next
FROM base AS runner
WORKDIR /app

ENV NODE_ENV production

RUN addgroup --system --gid 1001 nodejs
RUN adduser --system --uid 1001 nextjs

COPY --from=builder /app/public ./public
COPY --from=builder --chown=nextjs:nodejs /app/.next/standalone ./
COPY --from=builder --chown=nextjs:nodejs /app/.next/static ./.next/static

USER nextjs

EXPOSE 3000

ENV PORT 3000

CMD ["node", "server.js"]
```

### Étape 2: Configurer next.config.mjs pour le build standalone

Modifier `next.config.mjs`:

```javascript
export default {
  output: 'standalone',
  // ... autres configurations
}
```

### Étape 3: Créer docker-compose.yml

```yaml
version: '3.8'

services:
  dalil:
    build: .
    ports:
      - "3000:3000"
    environment:
      - NODE_ENV=production
      - GOOGLE_GENERATIVE_AI_API_KEY=${GOOGLE_GENERATIVE_AI_API_KEY}
      - GROQ_API_KEY=${GROQ_API_KEY}
      - DATABASE_URL=${DATABASE_URL}
    restart: always

  postgres:
    image: postgres:15
    environment:
      - POSTGRES_USER=dalil
      - POSTGRES_PASSWORD=dalil_password
      - POSTGRES_DB=dalil
    volumes:
      - postgres_data:/var/lib/postgresql/data
    restart: always

volumes:
  postgres_data:
```

### Étape 4: Déployer avec Docker

```bash
# Construire et démarrer
docker-compose up -d --build

# Voir les logs
docker-compose logs -f
```

## Configuration par Gouvernorat

### Base de données des bureaux

Pour ajouter les bureaux sociaux spécifiques à chaque gouvernorat:

1. Créer un fichier `lib/offices-data.ts`:

```typescript
export const offices = [
  {
    id: 'tunis-1',
    governorate: 'Tunis',
    delegation: 'Tunis',
    name: 'Unité locale de promotion sociale - Tunis',
    address: 'Rue de la Kasbah, Tunis',
    phone: '71 123 456',
    hours: '8h-16h, Lun-Ven',
    lat: 36.8065,
    lng: 10.1815,
  },
  // ... ajouter tous les bureaux
]
```

2. Mettre à jour l'API `/api/nearby` pour utiliser cette base de données

### Services spécifiques par région

Certains services peuvent varier par région. Pour gérer cela:

1. Ajouter un champ `governorates` aux services dans `lib/services-data.ts`:

```typescript
{
  id: 'service-local',
  title: { fr: 'Service local', ar: 'خدمة محلية' },
  // ...
  governorates: ['Tunis', 'Ariana'], // Disponible seulement dans ces gouvernorats
}
```

2. Filtrer les services dans le guide et l'assistant selon le gouvernorat de l'utilisateur

## Sécurité et Conformité

### 1. Protection des données

- Ne stocker aucune donnée personnelle (nom, CIN, adresse)
- Utiliser des tokens anonymes pour le rate limiting
- Logs anonymisés
- Conformité RGPD et loi tunisienne sur la protection des données

### 2. Authentification et Autorisation

Si l'authentification est activée:

- Utiliser Better Auth avec configuration sécurisée
- Utiliser HTTPS obligatoirement
- Configurer les cookies avec les flags sécurisés (HttpOnly, Secure, SameSite)

### 3. Rate Limiting

- Configurer des limites raisonnables (ex: 15 requêtes/minute pour l'assistant)
- Fail open si la base de données n'est pas disponible (ne pas bloquer les utilisateurs vulnérables)

### 4. Audit et Monitoring

- Configurer Vercel Analytics ou solution similaire
- Surveiller les erreurs et les temps de réponse
- Alertes en cas de problème critique

## Maintenance et Mises à Jour

### Mise à jour de la base de connaissances

1. Modifier `lib/services-data.ts`
2. Tester les modifications localement
3. Commit et push sur GitHub
4. Redéployer (automatique avec Vercel, manuel sur serveur dédié)

### Mise à jour des dépendances

```bash
# Sur le serveur
cd /var/www/DALIL
git pull
pnpm install
pnpm build
sudo systemctl restart dalil
```

### Sauvegarde de la base de données

Si PostgreSQL est utilisé:

```bash
# Sauvegarde automatique avec cron
sudo crontab -e

# Ajouter:
0 2 * * * pg_dump -U dalil dalil > /backups/dalil_$(date +\%Y\%m\%d).sql
```

## Support et Documentation

### Documentation pour les agents sociaux

Créer un guide simple pour les travailleurs sociaux:

1. Comment utiliser Dalil Social pour orienter les citoyens
2. Comment vérifier l'information affichée
3. Comment signaler des erreurs

### Canal de support

- Email: support@dalil.social.gov.tn
- Téléphone: Numéro du ministère
- Formulaire de signalement d'erreur intégré dans l'application

## Coûts Estimés

### Vercel (Option 1)

- Plan Hobby: Gratuit (500 requêtes API/jour)
- Plan Pro: $20/mois (100,000 requêtes API/jour)
- Domaine personnalisé: ~$10/an

### Serveur dédié (Option 2)

- VPS: ~$10-30/mois (selon le fournisseur)
- Domaine: ~$10/an
- Maintenance: Temps du personnel IT

### Coûts API

- Google Generative AI: Gratuit (15 requêtes/minute)
- Groq: Gratuit (2,000 requêtes/jour)
- Total: $0 pour usage modéré

## Checklist de Déploiement

- [ ] Variables d'environnement configurées
- [ ] Clés API obtenues et testées
- [ ] Application buildée sans erreur
- [ ] SSL configuré
- [ ] Domaine personnalisé configuré
- [ ] Base de données configurée (si utilisée)
- [ ] Rate limiting testé
- [ ] Tests de charge effectués
- [ ] Documentation agents sociaux créée
- [ ] Canal de support mis en place
- [ ] Sauvegardes automatisées configurées
- [ ] Monitoring configuré
- [ ] Formation des agents sociaux effectuée
- [ ] Communication aux citoyens lancée

## Conclusion

Ce guide permet un déploiement institutionnel de Dalil Social en suivant les meilleures pratiques de sécurité, de scalabilité et de maintenance. L'option Vercel est recommandée pour un déploiement rapide, tandis que l'option serveur dédié offre plus de contrôle sur les données.
