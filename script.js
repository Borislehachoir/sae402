
/* Variables responsables des interactions sur zerkalo.html */
const PRIX_BASE = 55;
const DELTA_EPAISSEUR = { 1: -5, 2: -2, 3: 0, 4: 5, 5: 10 };
const HAUTEUR_BANDE = { 1: 2, 2: 4, 3: 6, 4: 9, 5: 13 };

const etat = {
  epaisseur: 3
};

const bgContexte = document.getElementById('bg-contexte');
const fondBtns = document.querySelectorAll('.fond-btn');
const sliderEpaisseur = document.getElementById('slider-epaisseur');
const valEpaisseur = document.getElementById('val-epaisseur');
const epaisseurBar = document.getElementById('epaisseur-bar');
const prixTotal = document.getElementById('prix-total');
const prixRecap = document.getElementById('prix-recap');
const btnPanier = document.getElementById('btn-panier');
const dragHint = document.getElementById('drag-hint');

const bande1 = document.getElementById('bande-orange-1');
const bande2 = document.getElementById('bande-orange-2');
const svgEl = document.getElementById('svg-bandes');

bgContexte.style.backgroundImage = "url('img/bg-studio.png')";

fondBtns.forEach(btn => {
  btn.addEventListener('click', () => {
    fondBtns.forEach(b => b.classList.remove('selected'));
    btn.classList.add('selected');
    const nomFond = btn.dataset.fond;
    bgContexte.style.backgroundImage = `url('${nomFond}')`;
  });
});

sliderEpaisseur.addEventListener('input', () => {
  const val = parseInt(sliderEpaisseur.value);
  etat.epaisseur = val;
  valEpaisseur.textContent = val;
  const hauteur = HAUTEUR_BANDE[val];
  bande1.querySelector('rect').setAttribute('height', hauteur);
  bande2.querySelector('rect').setAttribute('height', hauteur);
  bande1.querySelector('rect').setAttribute('y', -hauteur / 2);
  bande2.querySelector('rect').setAttribute('y', -hauteur / 2);
  epaisseurBar.style.height = hauteur + 'px';
  miseAJourPrix();
});

function miseAJourPrix() {
  const dEpais = DELTA_EPAISSEUR[etat.epaisseur];
  const total = PRIX_BASE + dEpais;
  prixTotal.textContent = total + ' €';
  const signEpais = dEpais >= 0 ? '+' : '';
  prixRecap.textContent =
    `Base : ${PRIX_BASE} € · Bandes : ${signEpais}${dEpais} €`;
}

let bandeDragActive = null;
let offsetDrag = { x: 0, y: 0 };

function lireTranslate(el) {
  const t = el.getAttribute('transform') || 'translate(0,0)';
  const m = t.match(/translate\(([^,]+),\s*([^)]+)\)/);
  if (!m) return { x: 0, y: 0 };
  return { x: parseFloat(m[1]), y: parseFloat(m[2]) };
}

function ecrireTranslate(el, x, y) {
  const t = el.getAttribute('transform') || '';
  const mRot = t.match(/rotate\(([^)]+)\)/);
  const rotate = mRot ? `rotate(${mRot[1]})` : '';
  el.setAttribute('transform', `translate(${x}, ${y}) ${rotate}`);
}

function pixelsVersSVG(svg, px, py) {
  const pt = svg.createSVGPoint();
  pt.x = px;
  pt.y = py;
  return pt.matrixTransform(svg.getScreenCTM().inverse());
}

function clamp(val, min, max) {
  return Math.max(min, Math.min(max, val));
}

[bande1, bande2].forEach(bande => {
  bande.addEventListener('mousedown', (e) => {
    e.preventDefault();
    bandeDragActive = bande;
    dragHint.style.opacity = '0';
    const posSVG = pixelsVersSVG(svgEl, e.clientX, e.clientY);
    const posGroupe = lireTranslate(bande);
    offsetDrag.x = posSVG.x - posGroupe.x;
    offsetDrag.y = posSVG.y - posGroupe.y;
  });
});

document.addEventListener('mousemove', (e) => {
  if (!bandeDragActive) return;
  const posSVG = pixelsVersSVG(svgEl, e.clientX, e.clientY);
  let nx = posSVG.x - offsetDrag.x;
  let ny = posSVG.y - offsetDrag.y;
  nx = clamp(nx, -20, 270);
  ny = clamp(ny, 80, 480);
  ecrireTranslate(bandeDragActive, nx, ny);
});

document.addEventListener('mouseup', () => {
  bandeDragActive = null;
});

[bande1, bande2].forEach(bande => {
  bande.addEventListener(
    'touchstart',
    (e) => {
      e.preventDefault();
      bandeDragActive = bande;
      dragHint.style.opacity = '0';
      const touch = e.touches[0];
      const posSVG = pixelsVersSVG(svgEl, touch.clientX, touch.clientY);
      const posGroupe = lireTranslate(bande);
      offsetDrag.x = posSVG.x - posGroupe.x;
      offsetDrag.y = posSVG.y - posGroupe.y;
    },
    { passive: false }
  );
});

document.addEventListener(
  'touchmove',
  (e) => {
    if (!bandeDragActive) return;
    const touch = e.touches[0];
    const posSVG = pixelsVersSVG(svgEl, touch.clientX, touch.clientY);
    let nx = clamp(posSVG.x - offsetDrag.x, -20, 270);
    let ny = clamp(posSVG.y - offsetDrag.y, 80, 480);
    ecrireTranslate(bandeDragActive, nx, ny);
  },
  { passive: true }
);

document.addEventListener('touchend', () => {
  bandeDragActive = null;
});

btnPanier.addEventListener('click', () => {
  btnPanier.textContent = '✓ Ajouté !';
  btnPanier.classList.add('added');
  setTimeout(() => {
    btnPanier.textContent = 'Ajouter au panier';
    btnPanier.classList.remove('added');
  }, 2000);
});


/*Menu hamburger*/
const burger = document.getElementById('burger');
const nav = document.getElementById('main-nav');
burger.addEventListener('click', () => nav.classList.toggle('open'));
nav.querySelectorAll('a').forEach(l =>
  l.addEventListener('click', () => nav.classList.remove('open'))
);

setTimeout(() => {
  dragHint.style.transition = 'opacity 0.5s';
  dragHint.style.opacity = '0';
}, 4000);

sliderEpaisseur.dispatchEvent(new Event('input'));


