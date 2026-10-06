# DALIL — Dalil Social

Guide d'orientation vers les services sociaux en Tunisie (français, arabe, darija) : parcours guidé, assistant IA avec voix, carte des bureaux (OpenStreetMap), simulateur USSD et numéros d'urgence.

## Prérequis

- Node.js 22+
- PostgreSQL 14+
- Clés API : Gemini (assistant) et Groq (transcription vocale) — voir `.env.example`

## Installation

```bash
npm ci
cp .env.example .env.local   # puis remplir les valeurs
npm run db:migrate           # crée/met à jour toutes les tables (idempotent)
npm run dev                  # http://localhost:3000
```

`npm run db:migrate` applique `lib/db/migrations/*.sql` (rate limiting, statistiques anonymes, signalements, cache des bureaux) puis crée les tables better-auth (`user`, `session`, `account`, `verification`). À relancer après chaque mise à jour du schéma, y compris en production (`DATABASE_URL=... npm run db:migrate`).

## Scripts

| Commande | Rôle |
| --- | --- |
| `npm run dev` | Serveur de développement |
| `npm run build` / `npm start` | Build de production (avec vérification TypeScript) / serveur |
| `npm run typecheck` | `tsc --noEmit` |
| `npm run db:migrate` | Création/mise à jour du schéma PostgreSQL |

## Architecture

| Chemin | Rôle |
| --- | --- |
| `lib/services-data.ts` | Base de connaissances : programmes, conditions, pièces, numéros. Seule source utilisée par l'assistant. |
| `app/api/chat` | Assistant Gemini (`gemini-3.1-flash-lite`), restreint à la base de connaissances, outil `recommendServices` |
| `app/api/voice/transcribe` | Transcription Whisper (Groq) ; `lang=fr` force le français, sinon indices de vocabulaire darija |
| `app/api/nearby` | Bureaux proches via Nominatim (OpenStreetMap), cache PostgreSQL de 7 jours par zone |
| `app/api/ussd` + `lib/ussd.ts` | Passerelle USSD (format `CON`/`END`) |
| `app/api/events`, `app/api/reports` | Statistiques anonymes et signalements terrain |
| `app/tableau-de-bord`, `app/moderation`, `app/connexion` | Tableau de bord public, modération (comptes limités à `ADMIN_EMAILS`) |
| `public/sw.js` | Service worker network-first ; hors ligne, sert la dernière version ou `/sans-internet` |

## Comptes administrateurs

Seules les adresses listées dans `ADMIN_EMAILS` peuvent créer un compte sur `/connexion`. `BETTER_AUTH_SECRET` est obligatoire en production.
