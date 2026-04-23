# Traçabilité IA — Projet Vinko / Zerkalo

# NOM :
# PRENOM :
# URL GIT REPO : 
# URL GIT PAGE : 

## TÂCHE #01 : Génération de la page d'accueil (index.html)

Date : 16/04/26   Temps total : ~1h   Gain temps : ~2h (vs manuel)

### 1. DEMANDE À L'IA

> Génère la structure HTML complète de la page d'accueil du site Vinko : header fixe avec logo et nav, sections hero, concept, produits (3 coupes), marque avec composition CSS Moholy-Nagy, preview galerie, footer. Inclure le système de variables CSS, la mise en page Grid/Flexbox responsive et le menu burger JS.

### 2. RÉPONSE DE L'IA

Parties générées :
- Structure HTML complète (header, main, sections, footer)
- Système de variables CSS (`:root` avec `--creme`, `--noir`, `--jaune`, `--orange`, `--gris-bleu`, `--font-display`, `--font-body`)
- Mise en page Grid/Flexbox responsive
- Composition géométrique Moholy-Nagy (CSS pur — `.cercle`, `.diag`, `.carre`)
- Menu burger JavaScript

### 3. MES CORRECTIONS

Vite fait au niveau des couleurs, parce que ça collait pas exactement à celles que j'avais fourni en pièce-jointe à l'IA. Je lui ai aussi posé plusieurs questions (non notées ici) pour comprendre clairement la logique derrière ses décisions.

### 4. RÉSULTAT

Temps IA : ~30min   Temps sans IA : ~3 heures   Gain : 2 heures 30

---

## TÂCHE #02 : Améliorations visuelles et corrections layout (zerkalo.html)

Date : 19/04/26   Temps total : ~1h30   Gain temps : ~2h (vs manuel)

### 1. DEMANDE À L'IA

> "salut, est-ce que tu peux m'expliquer pourquoi je ne vois pas ma div responsable du changement de couleurs (`<div class="config-bloc">` avec les `.couleur-btn`) ?"

### 2. RÉPONSE DE L'IA

Extrait de la réponse finale :

> **Le coupable : `grid-row: 2 / 4` sur `.panneau-config`**
>
> Ton `.page-wrapper` a `grid-template-rows: auto 1fr auto auto` — soit 4 rows. En forçant `.panneau-config` à occuper les rows 2 à 4, tu lui dis d'englober exactement les rows réservées aux autres blocs de contenu. Résultat : le panneau a une hauteur fixe déterminée par la grid, et les `config-bloc` qui dépassent cette hauteur sont coupés par `overflow-y: auto` — mais comme il n'y a pas assez de hauteur de viewport pour rendre le scroll visible, la section couleur disparaît tout simplement.

Code proposé :

```css
.panneau-config {
  grid-column: 2;
  grid-row: 2 / -1;  /* s'étire jusqu'à la dernière row disponible */
  align-self: stretch;
}
```

```css
.page-wrapper {
  padding-top: 60px;
  min-height: 100vh;
  display: grid;
  grid-template-columns: 1fr 380px;
  grid-template-rows: auto 1fr;
}
```

Problèmes repérés :
- `grid-row: 2 / 4` trop restrictif → panneau tronqué sans scroll visible
- Plusieurs fausses pistes explorées (z-index, ordre des divs, JS) avant d'identifier la cause CSS
- `overflow-y: auto` masquait le problème sans l'indiquer visuellement

### 3. MES CORRECTIONS

Changements CSS appliqués  :

- `.panneau-config` : `grid-row: 2` (fixe, au lieu de `2/4`)
- `footer` : `grid-row: 4`  + `grid-column: 1 / -1`
- `.zone-visuelle` : `padding 20px → 40px`, `min-height` augmentée à `700px`
- `.sweat-container` : `max-width 530px → 600px`, `height 615px → 700px`
- `.galerie-item:hover` : ajout `transform: translateY(-8px)` + `box-shadow: 0 12px 24px rgba(...)`
- `.galerie-item img:hover` : `scale: 1.05` avec transition `0.3s`
- Footer responsive : `flex-direction: column`, liens en colonne, texte centré
- Zone visuelle mobile : `padding 30px`
- `webkit-scrollbar` pour personnaliser la barre de défilement sur le côté aux couleurs de la marque.

Modifications expliquées :
- `grid-row: 2` au lieu de `2/4` → supprime le conflit d'attribution implicite qui poussait le navigateur à considérer la zone après le footer comme emplacement pour `grid-row`
- Footer avec `grid-row: 4` explicite → supprime le rectangle blanc résiduel causé par une row auto non assignée

### 4. RÉSULTAT

Temps IA : ~40min   Temps sans IA : ~2h30   Gain : 1h50

---

## TÂCHE #03 : Correction du script de personnalisation (script.js)

Date : 23/04/26   Temps total : 2h    Gain temps : 1h30 à 2h30

### 1. DEMANDE À L'IA

> "Dans ces trois fichiers (**zerkalo.html** / **styles.css** / **script.js**), j'ai une div qui gère le changement de couleurs, des styles qui lui sont attribués et j'ai un script qui gère ce changement. mais ça ne marche pas et ça reste totalement invisible : même en déplaçant la div avant celle qui gère les options de fond dans zerkalo.html, ou en modifiant le z-index pour le définir à 1000, ça change rien. Comment peux-tu m'aider, et peux-tu m'expliquer tes choix avec un choix de mots simples afin de comprendre pourquoi ça dérape ?"

### 2. RÉPONSE DE L'IA

Diagnostic :

> Le code JS lié à la lightbox (**galerie.html**) était déclaré au niveau global dans **script.js**, provoquant une erreur silencieuse sur **zerkalo.html** où les éléments `#lightbox`, `#lightbox-close`, etc. n'existent pas. Le script crashait avant d'atteindre les `addEventListener` des boutons couleur.

Code proposé :

```js
if (document.getElementById('lightbox')) {
  const lightboxClose = document.getElementById('lightbox-close');
  const lightboxPrev = document.getElementById('lightbox-prev');
  const lightboxNext = document.getElementById('lightbox-next');
  // ... toutes les déclarations ET addEventListener ici

  lightboxClose.addEventListener('click', closeLightbox);
  lightboxPrev.addEventListener('click', () => { ... });
  lightboxNext.addEventListener('click', () => { ... });
  lightbox.addEventListener('click', (e) => {
    if (e.target === lightbox) closeLightbox();
  });
  document.addEventListener('keydown', (e) => {
    if (!lightbox.classList.contains('active')) return;
    if (e.key === 'Escape') closeLightbox();
    if (e.key === 'ArrowLeft') lightboxPrev.click();
    if (e.key === 'ArrowRight') lightboxNext.click();
  });
}
```

Problèmes repérés :
- `const lightboxClose = document.getElementById('lightbox-close')` → `null` sur **zerkalo.html**
- `addEventListener` exécutés hors du `if` de garde → crash immédiat au chargement
- Le `if` initial ne protégeait qu'une partie du code, pas tous les `addEventListener`

### 3. MES CORRECTIONS

- Toutes les `const` lightbox et leurs `addEventListener` déplacés à l'intérieur du `if`
- Le script ne crashe plus sur les pages sans lightbox → les fonctions couleur s'exécutent normalement

Modifications expliquées :
- Pattern `if (document.getElementById(...))` appliqué sur l'ensemble du bloc galerie, pas partiellement
- Séparation claire du code **zerkalo.html** vs **galerie.html** dans un script partagé

### 4. RÉSULTAT

Temps IA : ~2h  Temps sans IA : ~3h30 à 4h30  Gain : 1h30 à 2h30