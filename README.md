# Dalil Social

![Version](https://img.shields.io/badge/version-1.0.0-blue)
![Next.js](https://img.shields.io/badge/Next.js-16.3.3-black)
![License](https://img.shields.io/badge/license-MIT-green)

🇹🇳 **Le guide des services sociaux en Tunisie** - Guide d'orientation intelligente vers les services sociaux pour les citoyens tunisiens.

---

## 📋 Table des matières

- [Description](#description)
- [Fonctionnalités](#fonctionnalités)
- [Technologies](#technologies)
- [Installation](#installation)
- [Configuration](#configuration)
- [Développement](#développement)
- [Déploiement](#déploiement)
- [Tests](#tests)
- [Documentation](#documentation)
- [Structure du projet](#structure-du-projet)
- [Contribution](#contribution)
- [Licence](#licence)

---

## 📖 Description

**Dalil Social** est une plateforme d'orientation intelligente vers les services sociaux en Tunisie. Elle aide les citoyens, y compris les personnes avec une faible littératie, les utilisateurs ruraux et les familles à faible revenu, à trouver les aides sociales appropriées.

### Problème résolu

De nombreux Tunisiens éligibles aux aides sociales ne peuvent pas y accéder car:
- Ils ne connaissent pas les programmes disponibles
- Ils ne comprennent pas les conditions d'éligibilité
- Ils ne savent pas comment remplir les formulaires
- Ils ne savent pas où déposer leur demande

### Solution

- **Assistant IA** : Répond aux questions en français, arabe et darija tunisien
- **Guide pas à pas** : 3 questions simples pour identifier les aides pertinentes
- **Carte interactive** : Localise les bureaux sociaux les plus proches
- **Système de suivi** : Suivez l'état de votre demande avec un code unique
- **Formulaire en ligne** : Remplissez votre demande numériquement
- **Génération de dossier** : Obtenez un dossier prérempli imprimable
- **Dépôt de documents** : Téléversez vos pièces justificatives
- **Dashboard admin** : Outil pour les intervenants sociaux

---

## ✨ Fonctionnalités

### Pour les Citoyens / Bénéficiaires

| Fonctionnalité | Description |
|---------------|-------------|
| 🔍 **Assistant IA** | Posez vos questions en darija, français ou arabe |
| 📝 **Guide d'orientation** | 3 questions pour trouver les aides adaptées |
| 🗺️ **Carte interactive** | Localisez les bureaux sociaux près de chez vous |
| 📱 **Mode USSD** | Accès sans internet via code USSD |
| 🔗 **Suivi de demande** | Code unique pour suivre l'état de votre dossier |
| 📄 **Formulaire en ligne** | Remplissez votre demande numériquement |
| 📋 **Génération de dossier** | Dossier prérempli imprimable |
- 📎 **Dépôt de documents** | Téléversez vos pièces justificatives |

### Pour les Intervenants Sociaux / Admins

| Fonctionnalité | Description |
|---------------|-------------|
| 📊 **Dashboard** | Vue d'ensemble de toutes les demandes |
| 🔍 **Filtres avancés** | Par statut, service, recherche |
| ✅ **Gestion des statuts** | Examiner, approuver, rejeter les demandes |
| 📈 **Statistiques** | Vue en temps réel des demandes |
| 🔄 **Workflow** | Organiser le travail des intervenants |

---

## 🛠 Technologies

### Frontend

- **Framework**: [Next.js 16.3.3](https://nextjs.org/) (App Router)
- **UI**: [React 19](https://react.dev/)
- **Styling**: [Tailwind CSS 4.3.3](https://tailwindcss.com/)
- **Icons**: [Lucide React](https://lucide.dev/)
- **Fonts**: IBM Plex Sans Arabic, Readex Pro (Google Fonts)
- **AI SDK**: [Vercel AI SDK](https://sdk.vercel.ai/) (@ai-sdk/react, @ai-sdk/google)

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

---

## 🚀 Installation

### Prérequis

- Node.js 18+ ([Télécharger](https://nodejs.org/))
- pnpm 8+ ([Installation](https://pnpm.io/installation))
- Git ([Télécharger](https://git-scm.com/))

### Étapes

1. **Cloner le dépôt**

```bash
git clone https://github.com/Eya-Manaa2/DALIL.git
cd DALIL
```

2. **Installer les dépendances**

```bash
pnpm install
```

3. **Configurer les variables d'environnement**

Créez un fichier `.env` à la racine du projet:

```env
# Google Generative AI (Assistant IA)
GOOGLE_GENERATIVE_AI_API_KEY=votre_clé_ici

# Groq API (Transcription vocale)
GROQ_API_KEY=votre_clé_ici

# Rate Limiting
RATE_LIMIT_SALT=votre_sel_ici

# Better Auth (Authentification)
BETTER_AUTH_URL=http://localhost:3000
ADMIN_EMAILS=admin@example.com

# Database (Optionnel - pour la production)
# DATABASE_URL=postgresql://user:password@localhost:5432/dalil
```

4. **Lancer le serveur de développement**

```bash
pnpm dev
```

L'application sera accessible sur [http://localhost:3000](http://localhost:3000)

---

## ⚙️ Configuration

### Clés API requises

1. **Google Generative AI** (Assistant IA)
   - Obtenez une clé sur [Google AI Studio](https://makersuite.google.com/app/apikey)
   - Activez l'API Gemini 3.1 Flash Lite

2. **Groq API** (Transcription vocale)
   - Obtenez une clé sur [Groq Console](https://console.groq.com/)
   - Activez le modèle Whisper

### Base de données (Optionnel)

Pour le développement, l'application fonctionne sans base de données (mode fail open avec données mock).

Pour la production, configurez PostgreSQL:

```env
DATABASE_URL=postgresql://user:password@localhost:5432/dalil
```

### Rate Limiting

Configurez le sel pour le rate limiting:

```env
RATE_LIMIT_SALT=clé_secrète_ici
```

---

## 💻 Développement

### Commandes disponibles

```bash
# Lancer le serveur de développement
pnpm dev

# Construire pour la production
pnpm build

# Lancer en mode production
pnpm start

# Linter
pnpm lint

# Formatter
pnpm format
```

### Structure du projet

```
DALIL/
├── app/                    # Next.js App Router
│   ├── api/               # API Routes
│   │   ├── chat/          # Assistant IA
│   │   ├── voice/         # APIs vocales
│   │   ├── formulaire/    # Formulaire
│   │   ├── suivi/         # Suivi des demandes
│   │   └── admin/         # Dashboard admin
│   ├── assistant/         # Page assistant
│   ├── carte/             # Page carte
│   ├── formulaire/        # Page formulaire
│   ├── generer-dossier/   # Page génération dossier
│   ├── suivi/             # Page suivi
│   └── tableau-de-bord/   # Page dashboard admin
├── components/            # Composants React
│   ├── ai-assistant.tsx
│   ├── orientation-wizard.tsx
│   ├── form-wizard.tsx
│   ├── file-upload.tsx
│   └── ...
├── lib/                   # Utilitaires
│   ├── db/               # Base de données
│   ├── services-data.ts  # Données des services
│   ├── form-schemas.ts   # Schémas de formulaires
│   └── ...
├── public/               # Fichiers statiques
└── docs/                 # Documentation
```

### Outils de développement

- **Hot Reload**: Les modifications sont automatiquement appliquées
- **DevTools**: Utilisez les DevTools du navigateur pour le débogage
- **API Testing**: Utilisez Postman ou curl pour tester les APIs

---

## 🌐 Déploiement

### Vercel (Recommandé)

1. **Créer un compte sur [Vercel](https://vercel.com/)**
2. **Importer le dépôt**
3. **Configurer les variables d'environnement**
4. **Déployer**

### Serveur dédié

Voir [DEPLOIEMENT_INSTITUTIONNEL.md](./DEPLOIEMENT_INSTITUTIONNEL.md) pour les instructions détaillées.

### Docker

```bash
# Construire l'image
docker build -t dalil-social .

# Lancer le conteneur
docker run -p 3000:3000 --env-file .env dalil-social
```

---

## 🧪 Tests

### Tests utilisateurs

Voir [PLAN_TESTS.md](./PLAN_TESTS.md) pour le plan détaillé de tests utilisateurs.

### Tests d'accessibilité

- Test avec un lecteur d'écran (NVDA)
- Vérifier le contraste des couleurs
- Tester sur un vrai mobile
- Tester avec throttling réseau (3G lent)

### Tests API

```bash
# Test assistant IA
curl -X POST http://localhost:3000/api/chat \
  -H "Content-Type: application/json" \
  -d '{"text":"Quelles aides pour une personne âgée?"}'

# Test suivi
curl http://localhost:3000/api/suivi/ABC12345
```

---

## 📚 Documentation

- [TECHNICAL.md](./TECHNICAL.md) - Documentation technique
- [IMPACT.md](./IMPACT.md) - Impact social
- [DEPLOIEMENT_INSTITUTIONNEL.md](./DEPLOIEMENT_INSTITUTIONNEL.md) - Guide de déploiement
- [GUIDE_EXTENSION.md](./GUIDE_EXTENSION.md) - Guide d'extension
- [PLAN_TESTS.md](./PLAN_TESTS.md) - Plan de tests utilisateurs
- [PLAN_IMPLEMENTATION_DEFI2.md](./PLAN_IMPLEMENTATION_DEFI2.md) - Plan d'implémentation Défi 2
- [SCENARIOS_DEMO_HACKATHON.md](./SCENARIOS_DEMO_HACKATHON.md) - Scénarios de démo

---

## 🏗 Structure du projet

### Pages principales

| Page | URL | Description |
|------|-----|-------------|
| Accueil | `/` | Page d'accueil avec guide d'orientation |
| Services | `/services` | Catalogue de tous les services |
| Carte | `/carte` | Carte interactive des bureaux |
| Assistant | `/assistant` | Assistant IA vocal |
| Suivi | `/suivi` | Suivi des demandes |
| Formulaire | `/formulaire` | Formulaire en ligne |
| Génération dossier | `/generer-dossier` | Génération de dossier |
| Dashboard | `/tableau-de-bord` | Dashboard admin |
| Sans internet | `/sans-internet` | Simulation USSD |

### API Routes

| Endpoint | Méthode | Description |
|----------|---------|-------------|
| `/api/chat` | POST | Assistant IA |
| `/api/voice/transcribe` | POST | Transcription vocale |
| `/api/formulaire/save` | POST | Sauvegarde formulaire |
| `/api/suivi/[code]` | GET | Récupérer une demande |
| `/api/admin/applications` | GET | Liste des demandes admin |
| `/api/admin/applications/[id]` | PATCH | Mettre à jour une demande |

---

## 🤝 Contribution

Les contributions sont les bienvenues! Voici comment contribuer:

1. Fork le projet
2. Créez une branche (`git checkout -b feature/AmazingFeature`)
3. Commit vos modifications (`git commit -m 'Add AmazingFeature'`)
4. Push vers la branche (`git push origin feature/AmazingFeature`)
5. Ouvrez une Pull Request

### Conventions de code

- Utilisez TypeScript
- Suivez le style existant
- Ajoutez des commentaires si nécessaire
- Testez vos modifications

---

## 📄 Licence

Ce projet est sous licence MIT - voir le fichier [LICENSE](LICENSE) pour plus de détails.

---

## 📞 Contact

- **Auteur**: Eya Manaa
- **Email**: eya.manaa@example.com
- **GitHub**: [@Eya-Manaa2](https://github.com/Eya-Manaa2)
- **Organisation**: Ministère des Affaires Sociales (MAS)

---

## 🙏 Remerciements

- Ministère des Affaires Sociales (MAS)
- Programme des Nations Unies pour le développement (PNUD)
- Banque mondiale
- Tous les contributeurs et testeurs

---

## 📝 Roadmap

### Version 1.0 (Actuelle)
- ✅ Assistant IA multilingue
- ✅ Guide d'orientation
- ✅ Carte interactive
- ✅ Système de suivi
- ✅ Formulaire en ligne
- ✅ Génération de dossier
- ✅ Dépôt de documents
- ✅ Dashboard admin

### Version 2.0 (Planifiée)
- 🔄 Intégration SSO MAS
- 🔄 MFA obligatoire
- 🔄 Notifications SMS/Email
- 🔄 Application mobile native
- 🔄 Intégration avec d'autres ministères

---

## ⚠️ Avertissement

Cette application est un POC (Proof of Concept) pour le hackathon Social Tech Challenge 2026. Les informations fournies sont indicatives et doivent être confirmées auprès des autorités compétentes avant toute démarche administrative.

---

**🇹🇳 Fait avec ❤️ pour la Tunisie**
