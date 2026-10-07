# Plan d'Implémentation - Défi 2: Digitalisation du Dépôt

## Objectif

Ajouter toutes les fonctionnalités manquantes du Défi 2 pour répondre à 100% aux exigences du ministère.

**Deadline**: 8 novembre 2026 (POC)
**Temps disponible**: ~32 jours (du 7 octobre au 8 novembre)

---

## 📊 Vue d'Ensemble des Fonctionnalités

| # | Fonctionnalité | Priorité | Complexité | Estimation | Dépendances |
|---|----------------|----------|------------|-------------|-------------|
| 1 | Système de suivi de l'état d'avancement | 🔴 Critique | Moyenne | 3-4 jours | Aucune |
| 2 | Saisie de formulaires en ligne | 🔴 Critique | Haute | 4-5 jours | Aucune |
| 3 | Générateur de dossiers préremplis | 🟡 Haute | Haute | 5-6 jours | 2 |
| 4 | Dépôt de pièces justificatives | 🟡 Haute | Moyenne | 3-4 jours | 2 |
| 5 | Dashboard intervenants sociaux | 🟢 Moyenne | Haute | 5-6 jours | 1, 2, 4 |
| 6 | Workflow pour intervenants sociaux | 🟢 Moyenne | Haute | 4-5 jours | 5 |

**Total estimé**: 24-30 jours de travail

---

## 🗓️ Calendrier Recommandé

### Semaine 1 (7-13 octobre): Fondations Critiques
- **Jour 1-2**: Système de suivi (Fonctionnalité #1)
- **Jour 3-5**: Saisie de formulaires (Fonctionnalité #2)

### Semaine 2 (14-20 octobre): Fonctionnalités Utilisateurs
- **Jour 6-8**: Dépôt de pièces (Fonctionnalité #4)
- **Jour 9-11**: Générateur de dossiers (Fonctionnalité #3)

### Semaine 3 (21-27 octobre): Fonctionnalités Admin
- **Jour 12-15**: Dashboard intervenants (Fonctionnalité #5)
- **Jour 16-18**: Workflow intervenants (Fonctionnalité #6)

### Semaine 4 (28 octobre - 8 novembre): Tests & Documentation
- **Jour 19-22**: Tests utilisateurs
- **Jour 23-25**: Documentation
- **Jour 26-28**: Debug et améliorations
- **Jour 29-30**: Préparation soumission POC

---

## 🎯 DÉTAIL PAR FONCTIONNALITÉ

---

## FONCTIONNALITÉ #1: Système de Suivi de l'État d'Avancement

### Objectif
Permettre à un bénéficiaire de comprendre l'état d'avancement de sa demande.

### Spécifications

#### Fonctionnalités Utilisateur
- [ ] Page `/suivi` avec champ pour entrer un code de suivi
- [ ] Affichage du statut en temps réel
- [ ] Liste des actions restantes à accomplir
- [ ] Historique des étapes
- [ ] Notifications (email/SMS - futur)

#### États de Demande
- `draft`: Brouillon
- `submitted`: Soumis
- `under_review`: En cours d'examen
- `additional_docs_requested`: Documents supplémentaires demandés
- `approved`: Approuvé
- `rejected`: Rejeté

#### Base de Données
```sql
CREATE TABLE applications (
  id SERIAL PRIMARY KEY,
  tracking_code VARCHAR(10) UNIQUE NOT NULL,
  user_data JSONB,
  service_id VARCHAR(50),
  status VARCHAR(50),
  steps JSONB,
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);
```

### Implémentation

#### Étape 1: Créer la page de suivi (Jour 1)
```bash
# Créer le fichier
app/suivi/page.tsx
```

**Contenu:**
- Formulaire simple avec champ "Code de suivi"
- Bouton "Rechercher"
- Affichage des résultats si code trouvé

#### Étape 2: Créer l'API de suivi (Jour 1)
```bash
# Créer le fichier
app/api/suivi/[code]/route.ts
```

**Endpoint:**
```typescript
GET /api/suivi/{code}
Response: {
  trackingCode: string,
  status: string,
  steps: [
    { name: string, completed: boolean, date: timestamp }
  ],
  nextAction: string
}
```

#### Étape 3: Intégrer avec le guide (Jour 2)
Modifier `components/orientation-wizard.tsx`:
- Après obtention des résultats, générer un code de suivi
- Afficher le code à l'utilisateur
- Stocker dans la base de données

#### Étape 4: Créer le schéma Drizzle (Jour 2)
```typescript
// lib/db/schema.ts
export const applications = pgTable('applications', {
  id: serial('id').primaryKey(),
  trackingCode: text('tracking_code').unique().notNull(),
  userData: jsonb('user_data'),
  serviceId: text('service_id'),
  status: text('status').notNull(),
  steps: jsonb('steps'),
  createdAt: timestamp('created_at').defaultNow(),
  updatedAt: timestamp('updated_at').defaultNow(),
})
```

#### Étape 5: Tests (Jour 3-4)
- [ ] Créer une demande
- [ ] Vérifier le code de suivi
- [ ] Tester la page de suivi
- [ ] Tester l'API

### Livrables
- [ ] Page `/suivi` fonctionnelle
- [ ] API `/api/suivi/[code]` fonctionnelle
- [ ] Génération de codes de suivi
- [ ] Base de données mise à jour

### Temps estimé: 3-4 jours

---

## FONCTIONNALITÉ #2: Saisie de Formulaires en Ligne

### Objectif
Faciliter et simplifier la saisie des formulaires pour les bénéficiaires.

### Spécifications

#### Fonctionnalités
- [ ] Page `/formulaire` avec formulaire dynamique
- [ ] Formulaire adapté selon le service choisi
- [ ] Sauvegarde automatique (brouillon)
- [ ] Validation en temps réel
- [ ] Support du darija dans les labels
- [ ] Progression étape par étape (wizard)

#### Types de Champs
- Texte simple
- Sélection (dropdown)
- Cases à cocher
- Upload de fichier (voir Fonctionnalité #4)
- Date
- Nombre

### Implémentation

#### Étape 1: Définir les schémas de formulaires (Jour 3)
Créer `lib/form-schemas.ts`:

```typescript
export const formSchemas = {
  amen: {
    title: { fr: 'Demande AMEN Social', ar: 'طلب الأمان الاجتماعي' },
    fields: [
      {
        id: 'nom',
        type: 'text',
        label: { fr: 'Nom complet', ar: 'الاسم الكامل' },
        required: true,
      },
      {
        id: 'cin',
        type: 'text',
        label: { fr: 'Numéro CIN', ar: 'رقم بطاقة التعريف' },
        required: true,
        validation: /^[0-9]{8}$/,
      },
      {
        id: 'enfants',
        type: 'number',
        label: { fr: 'Nombre d\'enfants', ar: 'عدد الأبناء' },
        required: true,
        min: 0,
        max: 20,
      },
      // ... autres champs
    ],
  },
  handicap: {
    // ... schéma pour carte handicap
  },
  // ... autres services
}
```

#### Étape 2: Créer le composant FormWizard (Jour 3-4)
Créer `components/form-wizard.tsx`:

```typescript
interface FormWizardProps {
  serviceId: string;
  lang: 'fr' | 'ar';
  onSave: (data: any) => void;
}

export function FormWizard({ serviceId, lang, onSave }: FormWizardProps) {
  const [step, setStep] = useState(0);
  const [formData, setFormData] = useState({});
  const schema = formSchemas[serviceId];

  // Implémentation du wizard avec:
  // - Navigation étape par étape
  // - Validation
  // - Sauvegarde automatique
  // - Progression visuelle
}
```

#### Étape 3: Créer la page de formulaire (Jour 4)
Créer `app/formulaire/page.tsx`:

```typescript
export default function FormulairePage() {
  const searchParams = useSearchParams();
  const serviceId = searchParams.get('service');

  return (
    <main>
      <FormWizard serviceId={serviceId} lang={lang} onSave={handleSave} />
    </main>
  );
}
```

#### Étape 4: API de sauvegarde (Jour 4)
Créer `app/api/formulaire/save/route.ts`:

```typescript
POST /api/formulaire/save
Body: {
  serviceId: string,
  formData: any,
  trackingCode: string,
}
Response: {
  success: boolean,
  trackingCode: string,
}
```

#### Étape 5: Intégration avec le guide (Jour 5)
Modifier `components/orientation-wizard.tsx`:
- Après sélection d'un service, bouton "Remplir le formulaire"
- Redirection vers `/formulaire?service=amen`

#### Étape 6: Tests (Jour 5)
- [ ] Tester tous les types de champs
- [ ] Tester la validation
- [ ] Tester la sauvegarde
- [ ] Tester la navigation wizard

### Livrables
- [ ] Page `/formulaire` fonctionnelle
- [ ] Component FormWizard réutilisable
- [ ] Schémas de formulaires pour tous les services
- [ ] API de sauvegarde
- [ ] Intégration avec le guide

### Temps estimé: 4-5 jours

---

## FONCTIONNALITÉ #3: Générateur de Dossiers Préremplis

### Objectif
Générer automatiquement un dossier de demande prérempli avec la liste exacte des pièces justificatives.

### Spécifications

#### Fonctionnalités
- [ ] Génération PDF du formulaire rempli
- [ ] Liste personnalisée des documents selon le profil
- [ ] Checklist visuelle des documents à fournir
- [ ] Instructions pour chaque document
- [ ] Option d'impression ou téléchargement

### Implémentation

#### Étape 1: Installer les dépendances (Jour 9)
```bash
pnpm add jspdf react-pdf @react-pdf/renderer
```

#### Étape 2: Créer le composant PDF (Jour 9-10)
Créer `components/pdf-generator.tsx`:

```typescript
import { Document, Page, Text, View } from '@react-pdf/renderer';

export function ApplicationPDF({ formData, service, lang }: PDFProps) {
  return (
    <Document>
      <Page>
        <Text>Formulaire de demande - {service.title[lang]}</Text>
        {/* Contenu du formulaire */}
        {/* Liste des documents */}
      </Page>
    </Document>
  );
}
```

#### Étape 3: Créer la page de génération (Jour 10)
Créer `app/generer-dossier/page.tsx`:

```typescript
export default function GenererDossierPage() {
  const { trackingCode } = useParams();

  return (
    <main>
      <PDFDownloadLink document={<ApplicationPDF {...data />} fileName="dossier.pdf">
        {({ loading }) => (loading ? 'Chargement...' : 'Télécharger')}
      </PDFDownloadLink>
    </main>
  );
}
```

#### Étape 4: Personnaliser la liste de documents (Jour 11)
Modifier pour:
- Afficher seulement les documents pertinents selon le profil
- Ajouter des instructions spécifiques
- Format checklist avec cases à cocher

#### Étape 5: Tests (Jour 11-12)
- [ ] Générer un PDF pour chaque service
- [ ] Vérifier le contenu
- [ ] Tester le téléchargement
- [ ] Tester l'impression

### Livrables
- [ ] Composant PDF fonctionnel
- [ ] Page `/generer-dossier` fonctionnelle
- [ ] Génération pour tous les services
- [ ] Liste personnalisée de documents

### Temps estimé: 5-6 jours

---

## FONCTIONNALITÉ #4: Dépôt de Pièces Justificatives

### Objectif
Permettre aux bénéficiaires de déposer leurs pièces justificatives en ligne.

### Spécifications

#### Fonctionnalités
- [ ] Interface d'upload de fichiers
- [ ] Support des formats: PDF, JPG, PNG
- [ ] Preview des images uploadées
- [ ] Suppression de fichiers
- [ ] Validation de taille (max 5MB)
- [ ] Organisation par type de document

### Implémentation

#### Étape 1: Installer les dépendances (Jour 6)
```bash
pnpm add react-dropzone
```

#### Étape 2: Créer le composant d'upload (Jour 6-7)
Créer `components/file-upload.tsx`:

```typescript
import { useDropzone } from 'react-dropzone';

export function FileUpload({ onUpload, documentType }: FileUploadProps) {
  const { getRootProps, getInputProps } = useDropzone({
    accept: {
      'application/pdf': ['.pdf'],
      'image/jpeg': ['.jpg', '.jpeg'],
      'image/png': ['.png'],
    },
    maxSize: 5 * 1024 * 1024, // 5MB
    onDrop: (acceptedFiles) => {
      onUpload(acceptedFiles, documentType);
    },
  });

  return (
    <div {...getRootProps()}>
      <input {...getInputProps()} />
      <p>Glissez vos fichiers ici ou cliquez pour sélectionner</p>
    </div>
  );
}
```

#### Étape 3: API d'upload (Jour 7)
Options de stockage:
- **Option A**: Vercel Blob Storage (recommandé)
- **Option B**: Cloudinary
- **Option C**: Supabase Storage

Créer `app/api/upload/route.ts`:

```typescript
POST /api/upload
Body: FormData avec fichier
Response: {
  url: string,
  filename: string,
}
```

#### Étape 4: Intégrer dans le formulaire (Jour 7-8)
Modifier `components/form-wizard.tsx`:
- Ajouter une étape pour les documents
- Utiliser `FileUpload` pour chaque type de document
- Afficher les fichiers uploadés

#### Étape 5: Mettre à jour la base de données (Jour 8)
Ajouter à `lib/db/schema.ts`:

```typescript
export const documents = pgTable('documents', {
  id: serial('id').primaryKey(),
  applicationId: integer('application_id').references('applications'),
  type: text('type').notNull(),
  url: text('url').notNull(),
  filename: text('filename').notNull(),
  uploadedAt: timestamp('uploaded_at').defaultNow(),
})
```

#### Étape 6: Tests (Jour 8)
- [ ] Upload de différents formats
- [ ] Validation de taille
- [ ] Suppression de fichiers
- [ ] Preview d'images

### Livrables
- [ ] Composant FileUpload fonctionnel
- [ ] API d'upload fonctionnelle
- [ ] Intégration dans le formulaire
- [ ] Stockage configuré

### Temps estimé: 3-4 jours

---

## FONCTIONNALITÉ #5: Dashboard pour Intervenants Sociaux

### Objectif
Outil de gestion de cas pour qualifier rapidement une situation familiale et identifier les mécanismes de protection activables.

### Spécifications

#### Fonctionnalités
- [ ] Liste de toutes les demandes
- [ ] Filtres (statut, service, gouvernorat, date)
- [ ] Vue détaillée d'une demande
- [ ] Possibilité de changer le statut
- [ ] Ajout de notes/commentaires
- [ ] Assignation à un intervenant
- [ ] Statistiques de base

### Implémentation

#### Étape 1: Créer la page dashboard (Jour 12-13)
La page existe déjà: `app/tableau-de-bord/page.tsx`

Modifier pour:
- Authentification (Better Auth déjà configuré)
- Liste des demandes
- Filtres

#### Étape 2: API des demandes (Jour 13)
Créer `app/api/admin/applications/route.ts`:

```typescript
GET /api/admin/applications
Query: ?status=&service=&governorate=
Response: {
  applications: [...],
  total: number,
}

GET /api/admin/applications/[id]
Response: {
  application: {...},
  documents: [...],
  notes: [...],
}
```

#### Étape 3: Composant ApplicationCard (Jour 14)
Créer `components/application-card.tsx`:

```typescript
export function ApplicationCard({ application, onUpdate }: Props) {
  return (
    <div className="card">
      <h3>{application.trackingCode}</h3>
      <p>Status: {application.status}</p>
      <p>Service: {application.serviceId}</p>
      <button onClick={() => onUpdate(application.id, 'approved')}>
        Approuver
      </button>
    </div>
  );
}
```

#### Étape 4: Composant ApplicationDetail (Jour 14-15)
Créer `components/application-detail.tsx`:

```typescript
export function ApplicationDetail({ applicationId }: Props) {
  // Affichage détaillé:
  // - Données du formulaire
  // - Documents uploadés
  // - Historique des changements
  // - Formulaire pour changer le statut
  // - Formulaire pour ajouter des notes
}
```

#### Étape 5: API de mise à jour (Jour 15)
Créer `app/api/admin/applications/[id]/route.ts`:

```typescript
PATCH /api/admin/applications/[id]
Body: {
  status: string,
  notes?: string,
  assignedTo?: string,
}
Response: {
  success: boolean,
}
```

#### Étape 6: Statistiques (Jour 15)
Créer `components/admin-stats.tsx`:

```typescript
export function AdminStats() {
  // Afficher:
  // - Total des demandes
  // - Par statut
  // - Par service
  // - Par gouvernorat
}
```

#### Étape 7: Tests (Jour 15-16)
- [ ] Tester l'affichage de la liste
- [ ] Tester les filtres
- [ ] Tester la vue détaillée
- [ ] Tester la mise à jour du statut
- [ ] Tester l'ajout de notes

### Livrables
- [ ] Dashboard fonctionnel
- [ ] API CRUD pour les demandes
- [ ] Composants de liste et détail
- [ ] Statistiques
- [ ] Authentification configurée

### Temps estimé: 5-6 jours

---

## FONCTIONNALITÉ #6: Workflow pour Intervenants Sociaux

### Objectif
Mieux organiser le travail et le workflow des intervenants sociaux.

### Spécifications

#### Fonctionnalités
- [ ] Workflow configurable par service
- [ ] Étapes automatiques (ex: "En attente de documents")
- [ ] Notifications automatiques (email - futur)
- [ ] Historique des actions
- [ ] Rapports d'activité
- [ ] Export des données

### Implémentation

#### Étape 1: Définir les workflows (Jour 16)
Créer `lib/workflows.ts`:

```typescript
export const workflows = {
  amen: [
    { id: 'submitted', label: 'Soumis', next: ['under_review'] },
    { id: 'under_review', label: 'En examen', next: ['additional_docs', 'approved', 'rejected'] },
    { id: 'additional_docs', label: 'Documents demandés', next: ['under_review'] },
    { id: 'approved', label: 'Approuvé', next: [] },
    { id: 'rejected', label: 'Rejeté', next: [] },
  ],
  // ... autres services
}
```

#### Étape 2: Composant WorkflowStepper (Jour 16-17)
Créer `components/workflow-stepper.tsx`:

```typescript
export function WorkflowStepper({ serviceId, currentStatus }: Props) {
  const workflow = workflows[serviceId];
  const currentIndex = workflow.findIndex(s => s.id === currentStatus);

  return (
    <div className="stepper">
      {workflow.map((step, index) => (
        <div key={step.id} className={index <= currentIndex ? 'active' : ''}>
          {step.label}
        </div>
      ))}
    </div>
  );
}
```

#### Étape 3: Historique des actions (Jour 17)
Créer `lib/db/schema.ts`:

```typescript
export const activityLog = pgTable('activity_log', {
  id: serial('id').primaryKey(),
  applicationId: integer('application_id').references('applications'),
  action: text('action').notNull(),
  actor: text('actor').notNull(), // ID de l'intervenant
  timestamp: timestamp('timestamp').defaultNow(),
  details: jsonb('details'),
})
```

#### Étape 4: API d'historique (Jour 17)
Créer `app/api/admin/applications/[id]/history/route.ts`:

```typescript
GET /api/admin/applications/[id]/history
Response: {
  activities: [...],
}
```

#### Étape 5: Rapports d'activité (Jour 18)
Créer `app/admin/rapports/page.tsx`:

```typescript
export default function RapportsPage() {
  // Rapports:
  // - Demandes par intervenant
  // - Temps de traitement moyen
  // - Taux d'approbation
  // - Export CSV
}
```

#### Étape 6: Export des données (Jour 18)
Créer `app/api/admin/export/route.ts`:

```typescript
GET /api/admin/export
Query: ?type=&dateFrom=&dateTo=
Response: CSV file
```

#### Étape 7: Tests (Jour 18-19)
- [ ] Tester le workflow pour chaque service
- [ ] Tester l'historique
- [ ] Tester les rapports
- [ ] Tester l'export

### Livrables
- [ ] Workflows configurés
- [ ] Composant WorkflowStepper
- [ ] Historique des actions
- [ ] Rapports d'activité
- [ ] Export des données

### Temps estimé: 4-5 jours

---

## 🧪 PHASE DE TESTS (Semaine 4)

### Tests Utilisateurs (Jour 19-22)

#### Scénarios à Tester

1. **Complet: Guide → Formulaire → Upload → Suivi**
   - Utilisateur complète le guide
   - Remplit le formulaire
   - Upload les documents
   - Génère le dossier PDF
   - Suit l'avancement via le code de suivi

2. **Admin: Dashboard → Workflow**
   - Intervenant voit les demandes
   - Change le statut
   - Ajoute des notes
   - Consulte l'historique

#### Testeurs Recommandés
- 2 bénéficiaires potentiels
- 1 intervenant social (si possible)
- 1 administrateur

### Documentation (Jour 23-25)

Créer `MANUEL_UTILISATEUR.md`:
- Guide pour les bénéficiaires
- Guide pour les intervenants sociaux
- Captures d'écran
- FAQ

### Debug et Améliorations (Jour 26-28)

- Corriger les bugs identifiés
- Améliorer l'UX basé sur les tests
- Optimiser les performances

### Préparation Soumission (Jour 29-30)

- Finaliser le rapport de POC
- Préparer la vidéo de démonstration
- Vérifier tous les livrables

---

## 📋 CHECKLIST FINALE

### Avant Soumission (8 novembre)

#### Fonctionnalités
- [ ] Système de suivi opérationnel
- [ ] Saisie de formulaires opérationnelle
- [ ] Générateur de dossiers opérationnel
- [ ] Dépôt de documents opérationnel
- [ ] Dashboard admin opérationnel
- [ ] Workflow intervenants opérationnel

#### Documentation
- [ ] POC_REPORT.md complété
- [ ] MANUEL_UTILISATEUR.md créé
- [ ] TECHNICAL.md mis à jour
- [ ] GUIDE_EXTENSION.md mis à jour

#### Tests
- [ ] Tests utilisateurs conduits
- [ ] Résultats documentés
- [ ] Améliorations apportées
- [ ] Re-test validé

#### Déploiement
- [ ] Application déployée en production
- [ ] Base de données configurée
- [ ] Stockage configuré
- [ ] Domaine configuré

---

## ⚠️ RISQUES ET MITIGATIONS

### Risque #1: Temps insuffisant
**Probabilité**: Élevée
**Mitigation**:
- Prioriser les fonctionnalités critiques (#1, #2)
- Si nécessaire, décaler #5 et #6 à après le POC
- Présenter comme MVP avec roadmap

### Risque #2: Complexité technique
**Probabilité**: Moyenne
**Mitigation**:
- Utiliser des bibliothèques existantes (react-pdf, react-dropzone)
- Suivre les guides step-by-step
- Tester chaque fonctionnalité avant de passer à la suivante

### Risque #3: Problèmes de base de données
**Probabilité**: Moyenne
**Mitigation**:
- Utiliser Vercel Postgres (facile à configurer)
- Avoir un fallback (localStorage pour le POC)
- Documenter clairement la configuration

### Risque #4: Tests utilisateurs impossibles
**Probabilité**: Faible
**Mitigation**:
- Tester avec l'entourage immédiat
- Créer des scénarios de test self-service
- Documenter même avec peu de testeurs

---

## 🎯 PLAN B (SI TEMPS INSUFFISANT)

Si vous n'avez pas le temps de tout implémenter:

### Minimum Viable pour POC:
1. ✅ Système de suivi (#1) - CRITIQUE
2. ✅ Saisie de formulaires (#2) - CRITIQUE
3. ⏸️ Générateur de dossiers (#3) - Peut être simple (liste de documents sans PDF)
4. ⏸️ Dépôt de documents (#4) - Peut être simulé (pas de vrai upload)
5. ❌ Dashboard admin (#5) - Reporter après POC
6. ❌ Workflow (#6) - Reporter après POC

### Présentation:
- Honnête sur l'état
- Roadmap claire pour les fonctionnalités manquantes
- Démontrer ce qui fonctionne parfaitement
- Expliquer que le POC inclut une roadmap de développement

---

## 📞 SUPPORT

Si vous bloquez sur une étape:
- Consulter la documentation existante
- Chercher dans les issues GitHub
- Demander de l'aide sur les forums (Stack Overflow, Discord Next.js)

---

## 📊 RÉSUMÉ

**Fonctionnalités à ajouter**: 6
**Temps estimé total**: 24-30 jours
**Deadline**: 8 novembre 2026
**Plan réaliste**: ✅ Si vous commencez immédiatement

**Recommandation**: Commencer par les fonctionnalités #1 et #2 (critiques), puis évaluer le temps restant pour les autres.
