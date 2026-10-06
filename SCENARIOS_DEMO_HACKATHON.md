# Scénarios de Test pour la Démo Hackathon

## Scénario 1: Assistant Vocal (Accessibilité)
**Objectif:** Démontrer l'accessibilité pour les personnes analphabètes

**Étapes:**
1. Ouvrez l'onglet "Assistant" (en français ou en arabe via le sélecteur de langue)
2. Cliquez sur "Parler au lieu d'écrire" et autorisez le micro
3. Dites: *"Je cherche une aide pour ma famille, je n'ai pas de travail"*, puis recliquez pour arrêter
4. Vérifiez la transcription ("J'ai compris : … C'est bien ça ?") et cliquez "Oui, c'est ça"
5. L'assistant répond dans la langue de la question et affiche les fiches des services pertinents
6. Cochez "Lire les réponses à voix haute" pour entendre les réponses suivantes

**Points clés à mettre en avant:**
- Transcription Whisper (Groq) sur tous les navigateurs, réglée pour le darija et les noms de programmes
- Synthèse vocale du navigateur (la qualité de la voix arabe dépend des voix installées)
- Réponses en français, arabe ou darija selon la question
- Accessibilité pour les personnes peu alphabétisées

---

## Scénario 2: Guide Pas à Pas (Familles)
**Objectif:** Démontrer le guide personnalisé pour les familles

**Étapes:**
1. Sur la page d'accueil, cliquez sur "Commencer le parcours" (ou l'onglet "Trouver une aide")
2. Répondez aux 3 questions du guide:
   - *"Pour qui cherchez-vous une aide ?"* → Moi ou ma famille
   - *"De quoi avez-vous besoin ?"* → Argent / revenu, Soins médicaux (plusieurs choix possibles)
   - *"Dans quel gouvernorat habitez-vous ?"* → Kairouan
3. Le guide recommande les services pertinents (ex. AMEN Social, carte de soins gratuits)
4. Ouvrez une fiche pour voir conditions, pièces à fournir et où aller

**Points clés à mettre en avant:**
- Guide personnalisé et interactif
- Questions simples et adaptées
- Recommandations ciblées
- Interface intuitive

---

## Scénario 3: Recherche de Services (Carte)
**Objectif:** Démontrer la carte interactive des bureaux

**Étapes:**
1. Ouvrez l'onglet "Carte"
2. Cliquez sur "Utiliser ma position" ou choisissez un gouvernorat (ex: Tunis)
3. La carte affiche les bureaux proches trouvés dans OpenStreetMap (affaires sociales, CNSS, CNAM, CNRPS, emploi)
   - Première recherche d'une zone : ~10 s (Nominatim, 1 requête/s) ; ensuite instantané (cache 7 jours)
   - Faites une recherche sur la zone de la démo avant de présenter
5. Cliquez sur un marqueur pour voir les détails

**Points clés à mettre en avant:**
- Carte interactive
- Géolocalisation
- Données réelles OpenStreetMap (horaires et téléphone quand ils sont renseignés)
- Mobile-friendly

---

## Scénario 4: Mode Hors-Ligne (USSD)
**Objectif:** Démontrer l'accessibilité sans internet

**Étapes:**
1. Ouvrez l'onglet "Sans internet"
2. Dans le simulateur, composez *000# (code de démonstration), puis choisissez la langue
3. Naviguez : public → besoin → programmes → détails/pièces ; l'option 0 donne les numéros d'urgence
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
3. L'assistant relie le "carnet blanc" à la carte de soins gratuits (AMG1) et cite les pièces
4. Testez en darija: *"3andi wild m3aw9, chnowa najem na3mel?"* → réponse en darija, carte handicap
5. Testez la sécurité: *"Mon voisin frappe son enfant"* → le 1809 est donné immédiatement

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
- Support de 24 gouvernorats tunisiens
- Compatible avec tous les navigateurs (Firefox, Chrome, Edge, Safari)
- Fonctionne sans internet (mode USSD)

### Conclusion
Terminez par:
- L'impact potentiel sur la population tunisienne
- La scalabilité de la solution
- Les futures améliorations possibles
- L'alignement avec les objectifs sociaux du ministère
