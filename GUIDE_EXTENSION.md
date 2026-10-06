# Guide d'Extension - Dalil Social

## Objectif

Ce guide explique comment étendre Dalil Social pour:
- Ajouter de nouveaux services sociaux
- Ajouter de nouveaux gouvernorats ou régions
- Adapter la solution à d'autres pays
- Ajouter de nouvelles fonctionnalités

## Architecture du Système

### Structure des Données

```
lib/
├── services-data.ts      # Base de connaissances des services
├── i18n.ts              # Traductions de l'interface
└── offices-data.ts      # Données des bureaux (à créer)

components/
├── ai-assistant.tsx     # Assistant AI
├── service-card.tsx      # Affichage des services
└── orientation-wizard.tsx # Guide pas à pas

app/
├── api/
│   ├── chat/route.ts    # API de l'assistant
│   └── voice/           # API vocale
└── page.tsx             # Pages de l'application
```

## 1. Ajouter un Nouveau Service Social

### Étape 1: Définir le service

Ouvrir `lib/services-data.ts` et ajouter un nouveau service à la liste `services`:

```typescript
{
  id: 'nouveau-service', // Identifiant unique (minuscules, tirets)
  title: {
    fr: 'Titre du service en français',
    ar: 'عنوان الخدمة بالعربية'
  },
  summary: {
    fr: 'Description courte du service en français',
    ar: 'وصف قصير للخدمة بالعربية'
  },
  audiences: ['family', 'elderly'], // Audiences concernées
  needs: ['income', 'health'],     // Besoins couverts
  urgent: false,                   // Est-ce un service d'urgence?
  hotline: '123',                  // Numéro de téléphone (optionnel)
  documents: [
    { fr: 'Document 1', ar: 'وثيقة 1' },
    { fr: 'Document 2', ar: 'وثيقة 2' },
  ],
  where: {
    fr: 'Où faire la demande en français',
    ar: 'أين يقدم المطلب بالعربية'
  },
  steps: [
    { fr: 'Étape 1', ar: 'الخطوة 1' },
    { fr: 'Étape 2', ar: 'الخطوة 2' },
    { fr: 'Étape 3', ar: 'الخطوة 3' },
  ],
}
```

### Étape 2: Comprendre les champs

#### `id` (Obligatoire)
- Identifiant unique du service
- Format: minuscules, tirets uniquement
- Exemple: 'amen', 'handicap', 'nouveau-service'

#### `title` (Obligatoire)
- Titre du service en français et arabe
- Utilise le type `Localized`

#### `summary` (Obligatoire)
- Description courte (1-2 phrases)
- Explique ce que fait le service

#### `audiences` (Obligatoire)
- Liste des audiences concernées
- Valeurs possibles: 'family', 'child', 'elderly', 'disability', 'woman'
- Un service peut concerner plusieurs audiences

#### `needs` (Obligatoire)
- Liste des besoins couverts
- Valeurs possibles: 'income', 'health', 'education', 'housing', 'protection', 'work'
- Un service peut couvrir plusieurs besoins

#### `urgent` (Optionnel)
- `true` si c'est un service d'urgence
- Affiche un badge "Urgent" dans l'interface

#### `hotline` (Optionnel)
- Numéro de téléphone pour contacter le service
- Affiché dans la fiche service

#### `documents` (Obligatoire)
- Liste des documents nécessaires
- Utilise le type `Localized`

#### `where` (Obligatoire)
- Où faire la demande
- Peut inclure une URL, une adresse, ou les deux

#### `steps` (Obligatoire)
- Étapes pour obtenir le service
- Liste ordonnée des étapes

### Étape 3: Tester le nouveau service

1. Redémarrer l'application
2. Aller sur la page "Tous les services"
3. Vérifier que le nouveau service apparaît
4. Tester le guide pas à pas avec les audiences/besoins du service
5. Tester l'assistant AI avec une question sur le service

## 2. Ajouter une Nouvelle Audience

### Étape 1: Définir le type

Ouvrir `lib/services-data.ts` et modifier le type `Audience`:

```typescript
export type Audience = 'family' | 'child' | 'elderly' | 'disability' | 'woman' | 'nouvelle-audience'
```

### Étape 2: Ajouter le label

Ajouter à la liste `audiences`:

```typescript
export const audiences: { id: Audience; label: Localized; hint: Localized }[] = [
  // ... audiences existantes
  {
    id: 'nouvelle-audience',
    label: { fr: 'Nouvelle audience', ar: 'جمهور جديد' },
    hint: { fr: 'Description de l\'audience', ar: 'وصف الجمهور' }
  },
]
```

### Étape 3: Mettre à jour les services existants

Ajouter la nouvelle audience aux services concernés:

```typescript
{
  id: 'amen',
  // ...
  audiences: ['family', 'elderly', 'disability', 'woman', 'nouvelle-audience'],
  // ...
}
```

### Étape 4: Mettre à jour l'interface

Ouvrir `lib/i18n.ts` et ajouter les traductions nécessaires pour la nouvelle audience dans les questions du guide.

## 3. Ajouter un Nouveau Besoin

### Étape 1: Définir le type

Ouvrir `lib/services-data.ts` et modifier le type `Need`:

```typescript
export type Need = 'income' | 'health' | 'education' | 'housing' | 'protection' | 'work' | 'nouveau-besoin'
```

### Étape 2: Ajouter le label

Ajouter à la liste `needs`:

```typescript
export const needs: { id: Need; label: Localized }[] = [
  // ... besoins existants
  {
    id: 'nouveau-besoin',
    label: { fr: 'Nouveau besoin', ar: 'حاجة جديدة' }
  },
]
```

### Étape 3: Mettre à jour les services existants

Ajouter le nouveau besoin aux services concernés.

## 4. Ajouter un Nouveau Gouvernorat

### Étape 1: Ajouter à la liste

Ouvrir `lib/services-data.ts` et ajouter à la liste `governorates`:

```typescript
export const governorates: Localized[] = [
  // ... gouvernorats existants
  { fr: 'Nouveau Gouvernorat', ar: 'ولاية جديدة' },
]
```

### Étape 2: Ajouter les bureaux

Si vous avez des données de bureaux pour ce gouvernorat, créez ou mettez à jour `lib/offices-data.ts`:

```typescript
export const offices = [
  {
    id: 'nouveau-gouv-1',
    governorate: 'Nouveau Gouvernorat',
    delegation: 'Délégation',
    name: 'Unité locale de promotion sociale',
    address: 'Adresse',
    phone: '71 123 456',
    hours: '8h-16h',
    lat: 36.0000,
    lng: 10.0000,
  },
]
```

## 5. Adapter à un Autre Pays

### Étape 1: Modifier les données de base

#### Gouvernorats/Régions

Remplacer la liste `governorates` par les régions du nouveau pays:

```typescript
export const governorates: Localized[] = [
  { fr: 'Région 1', ar: 'منطقة 1' },
  { fr: 'Région 2', ar: 'منطقة 2' },
  // ...
]
```

#### Services

Remplacer ou adapter la liste `services` avec les services du nouveau pays.

#### Numéros d'urgence

Remplacer la liste `hotlines`:

```typescript
export const hotlines: { number: string; label: Localized }[] = [
  { number: '123', label: { fr: 'Urgence', ar: 'طوارئ' } },
  // ...
]
```

### Étape 2: Adapter l'assistant AI

Modifier le prompt système dans `app/api/chat/route.ts`:

```typescript
const system = `Tu es « Dalil », l'assistant d'orientation vers les services sociaux du ministère des Affaires sociales [NOM DU PAYS].

RÈGLES STRICTES (périmètre contrôlé) :
- Tu réponds UNIQUEMENT à partir de la BASE DE CONNAISSANCES ci-dessous.
- // ... autres règles

INSTITUTIONS CONNEXES (contexte important) :
- [Institutions spécifiques au nouveau pays]
// ...
`
```

### Étape 3: Adapter l'interface

Modifier `lib/i18n.ts` pour adapter les traductions au nouveau pays.

### Étape 4: Adapter les institutions connexes

Modifier `relatedInstitutions` dans `lib/services-data.ts` pour ajouter les institutions spécifiques au nouveau pays.

## 6. Ajouter une Nouvelle Fonctionnalité

### Exemple: Ajouter un système de favoris

#### Étape 1: Créer le composant

Créer `components/favorites.tsx`:

```typescript
'use client'

import { useState, useEffect } from 'react'
import { Heart, HeartOff } from 'lucide-react'
import { Service } from '@/lib/services-data'

export function Favorites() {
  const [favorites, setFavorites] = useState<string[]>([])

  useEffect(() => {
    const saved = localStorage.getItem('favorites')
    if (saved) setFavorites(JSON.parse(saved))
  }, [])

  const toggleFavorite = (serviceId: string) => {
    const newFavorites = favorites.includes(serviceId)
      ? favorites.filter(id => id !== serviceId)
      : [...favorites, serviceId]
    setFavorites(newFavorites)
    localStorage.setItem('favorites', JSON.stringify(newFavorites))
  }

  return (
    <div>
      {/* Afficher les favoris */}
    </div>
  )
}
```

#### Étape 2: Intégrer dans l'interface

Ajouter le composant aux pages souhaitées.

## 7. Modifier le Prompt de l'Assistant

### Pour ajouter de nouvelles règles

Ouvrir `app/api/chat/route.ts` et modifier la variable `system`:

```typescript
const system = `Tu es « Dalil », l'assistant d'orientation vers les services sociaux du ministère des Affaires sociales (Tunisie).

RÈGLES STRICTES (périmètre contrôlé) :
- Nouvelle règle 1
- Nouvelle règle 2
// ... autres règles
`
```

### Pour ajouter de nouvelles informations

Ajouter à la variable `knowledgeBase`:

```typescript
const knowledgeBase = services
  .map(/* ... */)
  .join('\n\n')

const additionalInfo = `
### INFORMATIONS SUPPLÉMENTAIRES
Information supplémentaire 1
Information supplémentaire 2
`
```

Puis ajouter à la fin du prompt:

```typescript
BASE DE CONNAISSANCES :
${knowledgeBase}

${additionalInfo}
```

## 8. Personnaliser le Design

### Modifier les couleurs

Ouvrir `app/globals.css` et modifier les variables CSS:

```css
:root {
  --primary: #E70013; /* Couleur principale */
  --primary-foreground: #ffffff;
  --background: #ffffff;
  --foreground: #09090b;
  /* ... autres variables */
}
```

### Modifier les polices

Ouvrir `app/layout.tsx` et modifier les imports de polices:

```typescript
import { IBM_Plex_Sans_Arabic, Readex_Pro } from 'next/font/google'

const plex = IBM_Plex_Sans_Arabic({
  subsets: ['arabic', 'latin'],
  weight: ['400', '500', '600', '700'],
  variable: '--font-plex',
})
```

## 9. Ajouter des Tests

### Tests de composants

Créer `components/__tests__/service-card.test.tsx`:

```typescript
import { render, screen } from '@testing-library/react'
import { ServiceCard } from '../service-card'
import { services } from '@/lib/services-data'

describe('ServiceCard', () => {
  it('renders service title', () => {
    render(<ServiceCard service={services[0]} />)
    expect(screen.getByText(services[0].title.fr)).toBeInTheDocument()
  })
})
```

### Tests de l'API

Créer `app/api/__tests__/chat.test.ts`:

```typescript
import { POST } from '../chat/route'
import { NextRequest } from 'next/server'

describe('Chat API', () => {
  it('responds to user message', async () => {
    const request = new NextRequest('http://localhost:3000/api/chat', {
      method: 'POST',
      body: JSON.stringify({
        messages: [{ role: 'user', content: 'Test message' }]
      })
    })

    const response = await POST(request)
    expect(response.status).toBe(200)
  })
})
```

## 10. Bonnes Pratiques

### Pour les services

- **Soyez précis**: Décrivez clairement ce que fait le service
- **Soyez complet**: Incluez tous les documents nécessaires
- **Soyez à jour**: Vérifiez régulièrement que les informations sont correctes
- **Soyez bilingue**: Toujours fournir les traductions en français et arabe

### Pour le code

- **Suivez les conventions existantes**: Utilisez le même style de code
- **Testez vos modifications**: Vérifiez que tout fonctionne avant de commit
- **Documentez vos changements**: Ajoutez des commentaires si nécessaire
- **Commitez souvent**: Faites des petits commits avec des messages clairs

### Pour l'accessibilité

- **Testez avec un lecteur d'écran**: Assurez-vous que l'application est accessible
- **Vérifiez le contraste**: Assurez-vous que les couleurs sont lisibles
- **Testez sur mobile**: L'application doit fonctionner sur tous les appareils
- **Testez avec différents navigateurs**: Chrome, Firefox, Safari, Edge

## Support

Pour toute question sur l'extension de Dalil Social:

- Consulter la documentation technique
- Regarder les exemples dans le code existant
- Poser une question sur GitHub Issues
