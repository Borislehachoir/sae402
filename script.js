
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


/* Variables pour les interactions avec la galerie (galerie.html) */

 const gallery = [
            { titre: 'Composition', annee: '1923', src: 'img/composition1923.jpg' },
            { titre: 'Space Modulator', annee: '1940', src: 'img/spacemodulator.jpg' },
            { titre: 'K VII', annee: '1922', src: 'img/kvii.jpg' },
            { titre: 'Radio Railway', annee: '1920', src: 'img/radiorailway.jpg' },
            { titre: 'Composition', annee: '1927', src: 'img/composition1927.jpg' },
            { titre: 'Photogram', annee: '1922', src: 'img/photogram1922.jpg' },
            { titre: 'Abstract Composition', annee: '1925', src: 'img/abstractcompo1925.jpg' },
            { titre: 'Rho + Ga CH 1', annee: '1938', src: 'img/rhoga.jpg' }
        ];

        let currentIndex = 0;

        const lightbox = document.getElementById('lightbox');
        const lightboxImg = document.getElementById('lightbox-img');
        const lightboxTitre = document.getElementById('lightbox-titre');
        const lightboxAnnee = document.getElementById('lightbox-annee');
        const lightboxClose = document.getElementById('lightbox-close');
        const lightboxPrev = document.getElementById('lightbox-prev');
        const lightboxNext = document.getElementById('lightbox-next');
        const cards = document.querySelectorAll('.galerie-card');

        function openLightbox(index) {
            currentIndex = index;
            const item = gallery[index];
            lightboxImg.src = item.src;
            lightboxTitre.textContent = item.titre;
            lightboxAnnee.textContent = item.annee;
            lightbox.classList.add('active');
            document.body.style.overflow = 'hidden';
        }

        function closeLightbox() {
            lightbox.classList.remove('active');
            document.body.style.overflow = 'auto';
        }

        cards.forEach(card => {
            card.addEventListener('click', () => {
                const index = parseInt(card.dataset.index);
                openLightbox(index);
            });
        });

        lightboxClose.addEventListener('click', closeLightbox);

        lightboxPrev.addEventListener('click', () => {
            currentIndex = (currentIndex - 1 + gallery.length) % gallery.length;
            const item = gallery[currentIndex];
            lightboxImg.src = item.src;
            lightboxTitre.textContent = item.titre;
            lightboxAnnee.textContent = item.annee;
        });

        lightboxNext.addEventListener('click', () => {
            currentIndex = (currentIndex + 1) % gallery.length;
            const item = gallery[currentIndex];
            lightboxImg.src = item.src;
            lightboxTitre.textContent = item.titre;
            lightboxAnnee.textContent = item.annee;
        });

        lightbox.addEventListener('click', (e) => {
            if (e.target === lightbox) closeLightbox();
        });

        document.addEventListener('keydown', (e) => {
            if (!lightbox.classList.contains('active')) return;
            if (e.key === 'Escape') closeLightbox();
            if (e.key === 'ArrowLeft') lightboxPrev.click();
            if (e.key === 'ArrowRight') lightboxNext.click();
        });