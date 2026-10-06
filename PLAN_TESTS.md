# Plan de Tests Utilisateurs - Dalil Social

## Objectif
Valider l'utilité, l'accessibilité et la simplicité de Dalil Social avec des utilisateurs réels pour maximiser le score au critère "Qualité du test réalisé" (20/20).

## Méthodologie

### 1. Profil des Testeurs (5-10 personnes)

#### Testeur 1: Personne analphabète ou peu alphabétisée
- **Âge**: 45+
- **Niveau d'éducation**: Primaire ou sans
- **Accès numérique**: Téléphone basique ou smartphone récent
- **Besoins**: Aides sociales pour famille
- **Scénario à tester**: Assistant vocal

#### Testeur 2: Personne âgée
- **Âge**: 60+
- **Niveau d'éducation**: Secondaire
- **Accès numérique**: Smartphone avec internet limité
- **Besoins**: Carte handicap ou soins
- **Scénario à tester**: Guide pas à pas

#### Testeur 3: Étudiant
- **Âge**: 18-25
- **Niveau d'éducation**: Universitaire
- **Accès numérique**: Smartphone avec bon internet
- **Besoins**: Aide à la rentrée scolaire
- **Scénario à tester**: Recherche de services

#### Testeur 4: Parent de famille
- **Âge**: 30-45
- **Niveau d'éducation**: Secondaire
- **Accès numérique**: Smartphone avec internet
- **Besoins**: AMEN Social
- **Scénario à tester**: Guide complet + carte

#### Testeur 5: Personne en zone rurale
- **Âge**: 35-50
- **Niveau d'éducation**: Primaire
- **Accès numérique**: Internet lent/instable
- **Besoins**: Aide logement ou revenu
- **Scénario à tester**: Mode hors-ligne (USSD)

### 2. Scénarios de Test

#### Scénario A: Assistant Vocal (Accessibilité)
**Objectif**: Tester l'accessibilité pour les personnes qui préfèrent parler

**Étapes**:
1. L'utilisateur clique sur "Parler à l'assistant"
2. Active l'enregistrement vocal
3. Pose une question en darija: "je n'ai pas de travail et j'ai 3 enfants"
4. Confirme la transcription
5. Écoute la réponse vocale
6. Coche "Lire les réponses à voix haute"

**Métriques**:
- Transcription correcte? (Oui/Non)
- Réponse compréhensible? (Oui/Non)
- Synthèse vocale claire? (Oui/Non)
- Temps total pour obtenir une réponse utile
- Satisfaction (1-5)

#### Scénario B: Guide Pas à Pas (Simplicité)
**Objectif**: Tester la facilité d'utilisation du guide

**Étapes**:
1. L'utilisateur clique sur "Familles"
2. Répond aux 3 questions:
   - Combien d'enfants?
   - Avez-vous un revenu?
   - Dans quel gouvernorat habitez-vous?
3. Lit les résultats
4. Clique sur une fiche service pour voir les détails

**Métriques**:
- Compréhension des questions (1-5)
- Facilité de navigation (1-5)
- Pertinence des résultats (1-5)
- Temps total pour compléter le guide
- Satisfaction (1-5)

#### Scénario C: Carte Interactive (Utilité)
**Objectif**: Tester l'utilité de la carte des bureaux

**Étapes**:
1. L'utilisateur clique sur "Carte des bureaux"
2. Sélectionne son gouvernorat
3. Voit les bureaux proches
4. Clique sur un marqueur pour voir les détails

**Métriques**:
- Carte se charge correctement? (Oui/Non)
- Informations utiles affichées? (Oui/Non)
- Facilité d'utilisation (1-5)
- Temps de chargement
- Satisfaction (1-5)

#### Scénario D: Mode Hors-Ligne (Accessibilité)
**Objectif**: Tester l'accessibilité sans internet

**Étapes**:
1. L'utilisateur clique sur "Sans internet"
2. Explore le simulateur USSD
3. Navigue avec les codes
4. Obtient des informations sur un service

**Métriques**:
- Compréhension du simulateur (1-5)
- Facilité de navigation (1-5)
- Utilité perçue (1-5)
- Satisfaction (1-5)

#### Scénario E: Questions Complexes (Intelligence)
**Objectif**: Tester l'intelligence de l'assistant

**Étapes**:
1. L'utilisateur clique sur "Parler à l'assistant"
2. Tape: "Quels sont les documents nécessaires pour le carnet blanc?"
3. Lit la réponse
4. Tape: "Comment demander une aide logement?"
5. Lit la réponse

**Métriques**:
- Réponse précise? (Oui/Non)
- Compréhension du darija (Oui/Non)
- Pertinence de l'information (1-5)
- Satisfaction (1-5)

### 3. Grille d'Observation

Pour chaque testeur, noter:

| Critère | Note (1-5) | Commentaires |
|---------|-----------|--------------|
| Compréhension de l'interface | | |
| Facilité de navigation | | |
| Pertinence des réponses | | |
| Vitesse de chargement | | |
| Accessibilité (langue, vocal) | | |
| Satisfaction globale | | |
| Probabilité d'utilisation future | | |

### 4. Questions ouvertes à poser après chaque test

1. Qu'avez-vous aimé?
2. Qu'avez-vous trouvé difficile?
3. Que vous manque-t-il?
4. L'information est-elle claire et utile?
5. Recommanderiez-vous cette application à d'autres?

### 5. Document des Problèmes Rencontrés

| Problème | Gravité (Mineur/Majeur/Critique) | Testeur | Scénario | Proposition de solution |
|----------|----------------------------------|---------|----------|------------------------|
| | | | | |

### 6. Améliorations Apportées

Documenter chaque amélioration faite après les tests:

| Amélioration | Date | Avant | Après |
|--------------|------|-------|-------|
| | | | |

## Calendrier

- **Jour 1**: Recrutement des testeurs (5 personnes)
- **Jour 2**: Tests avec Testeurs 1-3
- **Jour 3**: Tests avec Testeurs 4-5
- **Jour 4**: Analyse des résultats et premières améliorations
- **Jour 5**: Tests de validation avec les améliorations

## Livrables

1. Rapport de tests (ce document rempli)
2. Captures d'écran des problèmes rencontrés
3. Citations des testeurs
4. Liste des améliorations apportées
5. Preuves des améliorations (avant/après)

## Critères de Succès

- 80% des testeurs trouvent l'application utile
- 80% des testeurs trouvent l'application facile à utiliser
- 90% des questions obtiennent une réponse satisfaisante
- Moins de 2 problèmes majeurs identifiés
- Améliorations apportées à 100% des problèmes majeurs
