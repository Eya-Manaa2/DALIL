# Documentation Technique - Dalil Social

## Vue d'Ensemble

Dalil Social est une application web Next.js 16 qui fournit un assistant intelligent pour orienter les citoyens tunisiens vers les services sociaux. L'application utilise l'IA générative (Google Gemini) pour comprendre les questions en français, arabe et darija tunisien, et fournir des réponses personnalisées basées sur une base de connaissances vérifiée.

## Stack Technologique

### Frontend

- **Framework**: Next.js 16.3.3 (App Router)
- **UI**: React 19 avec shadcn/ui
- **Styling**: Tailwind CSS 4.3.3
- **Icons**: Lucide React
- **Fonts**: IBM Plex Sans Arabic, Readex Pro (Google Fonts)
- **AI SDK**: Vercel AI SDK (@ai-sdk/react, @ai-sdk/google)

### Backend

- **Runtime**: Node.js 18+
- **API**: Next.js API Routes
- **AI Model**: Google Gemini 3.1 Flash Lite
- **Speech Recognition**: Browser Web Speech API + Groq Whisper (fallback)
- **Text-to-Speech**: Browser Speech Synthesis API
- **Database**: PostgreSQL (optionnel, pour rate limiting et analytics)
- **ORM**: Drizzle ORM

### Déploiement

- **Platform**: Vercel (recommandé) ou serveur dédié
- **Environment**: Linux (Ubuntu 20.04+)
- **Containerisation**: Docker (optionnel)

## Architecture

### Structure du Projet

```
dalil/
├── app/                      # Next.js App Router
│   ├── api/                 # API Routes
│   │   ├── chat/            # Assistant AI
│   │   ├── voice/           # APIs vocales
│   │   ├── nearby/          # Recherche de bureaux
│   │   ├── events/          # Tracking d'usage
│   │   ├── reports/         # Signalements
│   │   └── ussd/            # Simulation USSD
│   ├── assistant/           # Page assistant
│   ├── carte/               # Page carte
│   ├── fiche/               # Page fiche personnalisée
│   ├── layout.tsx           # Layout racine
│   └── page.tsx             # Page d'accueil
├── components/              # Composants React
│   ├── ai-assistant.tsx     # Assistant AI
│   ├── service-card.tsx      # Carte de service
│   ├── orientation-wizard.tsx # Guide pas à pas
│   ├── offices-map.tsx      # Carte Leaflet
│   └── ui/                  # Composants UI shadcn
├── lib/                     # Bibliothèques utilitaires
│   ├── services-data.ts     # Base de connaissances
│   ├── i18n.ts              # Internationalisation
│   ├── db/                  # Database (Drizzle)
│   └── utils.ts             # Utilitaires
├── public/                  # Assets statiques
│   ├── images/              # Images
│   └── manifest.json        # PWA manifest
└── package.json             # Dépendances
```

### Flux de Données

#### 1. Assistant AI

```
User Input (Text/Voice)
    ↓
Frontend (ai-assistant.tsx)
    ↓
API Route (/api/chat)
    ↓
Google Gemini API
    ↓
Response Streaming
    ↓
Frontend Display
```

#### 2. Guide Pas à Pas

```
User Selection (Audience → Needs → Governorate)
    ↓
Frontend (orientation-wizard.tsx)
    ↓
matchServices() function
    ↓
Filtered Services
    ↓
Service Cards Display
```

#### 3. Transcription Vocale

```
User Speech
    ↓
Browser SpeechRecognition API (priorité)
    ↓
OR Groq Whisper API (fallback)
    ↓
Transcription Text
    ↓
User Confirmation
    ↓
Send to Assistant
```

#### 4. Synthèse Vocale

```
AI Response Text
    ↓
Browser SpeechSynthesis API
    ↓
Audio Playback
```

## API Routes

### POST /api/chat

**Description**: Endpoint principal de l'assistant AI

**Request Body**:
```json
{
  "messages": [
    {
      "role": "user",
      "content": {
        "text": "Question de l'utilisateur",
        "lang": "fr"
      }
    }
  ]
}
```

**Response**: Stream de texte (Server-Sent Events)

**Features**:
- Rate limiting (15 requêtes/minute)
- Cache des réponses fréquentes
- Tracking d'usage
- Support de la langue (FR/AR)
- Tool calling pour recommander des services

### POST /api/voice/transcribe

**Description**: Transcription audio en texte

**Request Body**: FormData avec fichier audio

**Response**:
```json
{
  "text": "Texte transcrit"
}
```

**Features**:
- Support de Groq Whisper API
- Bias vers le vocabulaire tunisien
- Taille max: 4MB
- Rate limiting (10 requêtes/minute)

### GET /api/nearby

**Description**: Recherche de bureaux sociaux proches

**Query Parameters**:
- `lat`: Latitude (optionnel)
- `lng`: Longitude (optionnel)
- `gov`: Gouvernorat (optionnel)

**Response**:
```json
{
  "offices": [
    {
      "id": "tunis-1",
      "name": "Unité locale...",
      "address": "...",
      "lat": 36.8065,
      "lng": 10.1815
    }
  ]
}
```

### POST /api/events

**Description**: Tracking d'usage anonyme

**Request Body**:
```json
{
  "source": "assistant",
  "audience": "family",
  "needs": ["income"],
  "governorate": "Tunis",
  "resultsCount": 3
}
```

## Base de Données

### Schéma (Optionnel)

```sql
-- Rate limiting
CREATE TABLE rate_limits (
  key TEXT PRIMARY KEY,
  window_start TIMESTAMP,
  hits INTEGER
);

-- Usage tracking
CREATE TABLE usage_events (
  id SERIAL PRIMARY KEY,
  source TEXT,
  audience TEXT,
  needs TEXT[],
  governorate TEXT,
  results_count INTEGER,
  created_at TIMESTAMP DEFAULT NOW()
);
```

### Drizzle Schema

```typescript
import { pgTable, serial, text, timestamp, integer } from 'drizzle-orm/pg-core'

export const rateLimits = pgTable('rate_limits', {
  key: text('key').primaryKey(),
  windowStart: timestamp('window_start').notNull(),
  hits: integer('hits').notNull(),
})

export const usageEvents = pgTable('usage_events', {
  id: serial('id').primaryKey(),
  source: text('source').notNull(),
  audience: text('audience'),
  needs: text('needs').array(),
  governorate: text('governorate'),
  resultsCount: integer('results_count'),
  createdAt: timestamp('created_at').defaultNow(),
})
```

## Sécurité

### 1. Protection des Données

- Aucune donnée personnelle stockée
- Rate limiting pour prévenir les abus
- Tokens anonymes pour le tracking
- Logs anonymisés

### 2. API Keys

- Stockées dans les variables d'environnement
- Jamais exposées dans le code client
- Rotation régulière recommandée

### 3. Rate Limiting

- Assistant: 15 requêtes/minute
- Transcription: 10 requêtes/minute
- Événements: 60 requêtes/minute
- Fail open si DB indisponible

### 4. CORS

- Configuré dans `next.config.mjs`
- Origines autorisées en production

## Performance

### Optimisations

1. **Streaming**: Réponses AI en streaming pour réduire la latence perçue
2. **Cache**: Cache en mémoire pour les requêtes fréquentes (5 min TTL)
3. **Static Generation**: Pages statiques quand possible
4. **Image Optimization**: Next.js Image component
5. **Code Splitting**: Automatic avec Next.js

### Monitoring

- Vercel Analytics (si déployé sur Vercel)
- Custom logging pour les erreurs
- Performance monitoring recommandé

## Accessibilité

### WCAG 2.1 AA

- Contraste des couleurs (4.5:1 minimum)
- Labels ARIA pour les éléments interactifs
- Navigation au clavier
- Support des lecteurs d'écran
- Texte alternatif pour les images

### Support Vocal

- SpeechRecognition API (Chrome, Edge, Safari)
- SpeechSynthesis API (tous navigateurs)
- Fallback Groq Whisper pour Firefox

### Multilingue

- Français (langue par défaut)
- Arabe (support RTL)
- Darija tunisien (transcription et réponse)

## Développement

### Installation

```bash
# Cloner le dépôt
git clone https://github.com/Eya-Manaa2/DALIL.git
cd DALIL

# Installer les dépendances
pnpm install

# Configurer .env
cp .env.example .env
# Éditer .env avec vos clés API

# Démarrer en développement
pnpm dev
```

### Build

```bash
# Build de production
pnpm build

# Démarrer en production
pnpm start
```

### Linting

```bash
# Linter TypeScript
pnpm lint
```

## Déploiement

### Vercel (Recommandé)

```bash
# Installer Vercel CLI
npm i -g vercel

# Déployer
vercel --prod
```

### Docker

```bash
# Construire l'image
docker build -t dalil-social .

# Démarrer le conteneur
docker run -p 3000:3000 dalil-social
```

### Serveur Dédié

Voir `DEPLOIEMENT_INSTITUTIONNEL.md` pour les instructions détaillées.

## Maintenance

### Mises à jour

1. Mettre à jour les dépendances:
```bash
pnpm update
```

2. Mettre à jour la base de connaissances:
- Modifier `lib/services-data.ts`
- Tester localement
- Commit et push

3. Redéployer:
- Vercel: automatique
- Serveur: manuel

### Monitoring

- Surveiller les erreurs dans les logs
- Vérifier les métriques d'usage
- Tester les APIs régulièrement
- Vérifier les clés API (quota, expiration)

## Support

### Documentation

- `DEPLOIEMENT_INSTITUTIONNEL.md`: Guide de déploiement
- `GUIDE_EXTENSION.md`: Guide d'extension
- `PLAN_TESTS.md`: Plan de tests utilisateurs
- `IMPACT.md`: Impact social

### Issues

Signaler les bugs sur GitHub Issues:
https://github.com/Eya-Manaa2/DALIL/issues

## License

Ce projet est développé pour le ministère des Affaires sociales de Tunisie.

## Crédits

- Développé avec Next.js, Vercel AI SDK, Google Gemini
- UI avec shadcn/ui et Tailwind CSS
- Cartes avec Leaflet et React Leaflet
- Icons avec Lucide React
