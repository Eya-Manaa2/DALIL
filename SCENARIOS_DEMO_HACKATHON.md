# Scénarios de Test pour la Démo Hackathon

## Scénario 1: Assistant Vocal (Accessibilité)
**Objectif:** Démontrer l'accessibilité pour les personnes analphabètes

**Étapes:**
1. Cliquez sur le bouton "Parler à l'assistant"
2. Activez l'enregistrement vocal
3. Dites: *"Je cherche une aide pour ma famille, je n'ai pas de travail"*
4. Confirmez la transcription
5. L'assistant répond avec les services pertinents
6. Cochez "Lire les réponses à voix haute"
7. Cliquez sur "écouter la réponse"

**Points clés à mettre en avant:**
- Transcription vocale (Groq Whisper - fonctionne sur Firefox)
- Synthèse vocale (API navigateur - illimité)
- Support du darija tunisien
- Accessibilité pour les analphabètes

---

## Scénario 2: Guide Pas à Pas (Familles)
**Objectif:** Démontrer le guide personnalisé pour les familles

**Étapes:**
1. Sur la page d'accueil, cliquez sur "Familles"
2. Répondez aux questions du guide:
   - *"Combien d'enfants avez-vous?"* → 3
   - *"Avez-vous un revenu?"* → Non
   - *"Vivez-vous en location?"* → Oui
3. Le guide recommande les services pertinents
4. Cliquez sur une fiche service pour voir les détails

**Points clés à mettre en avant:**
- Guide personnalisé et interactif
- Questions simples et adaptées
- Recommandations ciblées
- Interface intuitive

---

## Scénario 3: Recherche de Services (Carte)
**Objectif:** Démontrer la carte interactive des bureaux

**Étapes:**
1. Cliquez sur "Carte des bureaux"
2. Sélectionnez votre gouvernorat (ex: Tunis)
4. La carte affiche les bureaux proches
5. Cliquez sur un marqueur pour voir les détails

**Points clés à mettre en avant:**
- Carte interactive
- Géolocalisation
- Informations pratiques (horaires, adresse)
- Mobile-friendly

---

## Scénario 4: Mode Hors-Ligne (USSD)
**Objectif:** Démontrer l'accessibilité sans internet

**Étapes:**
1. Cliquez sur "Sans internet"
2. Expliquez le simulateur USSD
3. Montrez comment naviguer avec les codes
4. Démontrer la simplicité pour les utilisateurs basiques

**Points clés à mettre en avant:**
- Accessibilité sans internet
- Codes USSD simples
- Inclusivité numérique
- Solution pour zones rurales

---

## Scénario 5: Assistant AI (Questions Complexes)
**Objectif:** Démontrer l'intelligence de l'assistant

**Étapes:**
1. Cliquez sur "Parler à l'assistant"
2. Tapez ou dites: *"Quels sont les documents nécessaires pour le carnet blanc?"*
3. L'assistant répond avec la liste complète
4. Testez avec: *"Comment demander une aide logement?"*
5. L'assistant guide étape par étape

**Points clés à mettre en avant:**
- Compréhension du darija
- Base de connaissances locale
- Réponses précises et contextualisées
- Support multilingue

---

## Scénario 6: Synthèse Vocale (Lecture)
**Objectif:** Démontrer la lecture des réponses

**Étapes:**
1. Envoyez une question à l'assistant
2. Cochez "Lire les réponses à voix haute"
3. La réponse est lue automatiquement
4. Testez avec du texte en arabe et en français

**Points clés à mettre en avant:**
- Synthèse vocale native du navigateur
- Support de l'arabe et du français
- Gratuit et illimité
- Accessibilité pour les malvoyants

---

## Conseils pour la Présentation

### Avant la Démo
- Testez tous les scénarios au moins 2 fois
- Ayez un plan de connexion internet de secours
- Préparez des réponses de fallback si l'API échoue
- Vérifiez le niveau de son pour la synthèse vocale

### Pendant la Démo
- Commencez par le scénario le plus impressionnant (Assistant Vocal)
- Mettez en avant l'impact social réel
- Expliquez la technologie de manière simple
- Montrez la simplicité d'utilisation
- Insistez sur l'accessibilité (votre atout majeur)

### Points Forts à Mettre en Avant
1. **Accessibilité:** Support vocal pour les analphabètes
2. **Localisation:** Darija tunisien, gouvernorats, programmes spécifiques
3. **Innovation:** Assistant AI avec base de connaissances locale
4. **Impact Social:** Solution concrète pour les citoyens tunisiens
5. **Technologie:** Moderne mais accessible (fonctionne sur tous les navigateurs)

### Gestion des Problèmes
- **Si l'API échoue:** Utilisez le mode hors-ligne ou le guide pas à pas
- **Si la transcription ne fonctionne pas:** Utilisez la saisie au clavier
- **Si la synthèse vocale échoue:** Montrez que le texte est toujours lisible
- **Si internet est lent:** Montrez le mode USSD hors-ligne

### Statistiques à Mentionner
- 500 requêtes/jour (free tier) - suffisant pour la démo
- Support de 24 gouvernorats tunisiens
- Base de connaissances avec X services
- Compatible avec tous les navigateurs (Firefox, Chrome, Edge, Safari)
- Fonctionne sans internet (mode USSD)

### Conclusion
Terminez par:
- L'impact potentiel sur la population tunisienne
- La scalabilité de la solution
- Les futures améliorations possibles
- L'alignement avec les objectifs sociaux du ministère
