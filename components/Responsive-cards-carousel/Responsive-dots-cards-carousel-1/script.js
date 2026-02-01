const track = document.querySelector(".carousel-track");
const dotsContainer = document.querySelector(".carousel-dots");
let cards = Array.from(document.querySelectorAll(".card"));

const gap = 15;
let currentIndex = 0;

// 1. GESTION DES CLONES pour l'effet infini
const cardsToClone = 4; // On clone les 4 premières pour boucher le vide
for (let i = 0; i < cardsToClone; i++) {
  const clone = cards[i].cloneNode(true);
  track.appendChild(clone);
}

// 2. SETUP DES DOTS (4 min, 8 max)
function setupDots() {
  dotsContainer.innerHTML = "";
  const numDots = Math.min(Math.max(cards.length, 4), 8);

  for (let i = 0; i < numDots; i++) {
    const dot = document.createElement("div");
    dot.classList.add("dot");
    if (i === 0) dot.classList.add("active");
    dot.addEventListener("click", () => moveToSlide(i));
    dotsContainer.appendChild(dot);
  }
}

// 3. FONCTION DE MOUVEMENT
function moveToSlide(index) {
  const cardWidth = cards[0].getBoundingClientRect().width; // Plus précis que offsetWidth

  // Calcul exact : index * (largeur d'une carte + l'espace qui la suit)
  const moveDistance = index * (cardWidth + gap);

  track.style.transition = "transform 0.5s ease-in-out";
  track.style.transform = `translateX(-${moveDistance}px)`;

  currentIndex = index;
  updateDots(index);
}

function updateDots(index) {
  const allDots = document.querySelectorAll(".dot");
  allDots.forEach((d, i) => {
    // On utilise le modulo pour que le point actif boucle si index > nombre de points
    d.classList.toggle("active", i === index % allDots.length);
  });
}

// Reset la position si on redimensionne
window.addEventListener("resize", () => {
  track.style.transition = "none";
  moveToSlide(0);
});

setupDots();
