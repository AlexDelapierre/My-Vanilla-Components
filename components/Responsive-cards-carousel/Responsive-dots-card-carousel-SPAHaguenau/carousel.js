const carousels = document.querySelectorAll(".js-carousel-cards");

carousels.forEach((carousel) => {
  const track = carousel.querySelector(".js-carousel-track");
  const cards = Array.from(track.children);
  const dotsContainer = carousel.querySelector(".js-carousel-dots");

  let currentIndex = 0;
  let windowWidth = window.innerWidth; // Pour surveiller le vrai redimensionnement

  // GESTION DES CLONES
  const cardsToClone = 4;
  for (let i = 0; i < cardsToClone; i++) {
    const clone = cards[i].cloneNode(true);
    track.appendChild(clone);
  }

  // SETUP DES DOTS
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

  // FONCTION DE MOUVEMENT
  function moveToSlide(index) {
    const cardWidth = cards[0].getBoundingClientRect().width;
    const moveDistance = index * cardWidth;

    track.style.transition = "transform 0.5s ease-in-out";
    track.style.transform = `translateX(-${moveDistance}px)`;

    currentIndex = index;
    updateDots(index);
  }

  function updateDots(index) {
    const allDots = dotsContainer.querySelectorAll(".dot");
    allDots.forEach((d, i) => {
      d.classList.toggle("active", i === index % allDots.length);
    });
  }

  // --- GESTION DU SWIPE (SOURIS + TACTILE) ---
  let isDown = false;
  let startX = 0;
  let startY = 0; // Ajouté pour détecter le scroll vertical
  let isSwiping = false;

  const handleNext = () => {
    const totalDots = dotsContainer.querySelectorAll(".dot").length;
    moveToSlide((currentIndex + 1) % totalDots);
  };

  const handlePrev = () => {
    const totalDots = dotsContainer.querySelectorAll(".dot").length;
    moveToSlide((currentIndex - 1 + totalDots) % totalDots);
  };

  // Événements Souris
  carousel.addEventListener('mousedown', (e) => {
    isDown = true;
    isSwiping = false;
    startX = e.pageX;
    carousel.classList.add('dragging');
  });

  carousel.addEventListener('mousemove', (e) => {
    if (!isDown || isSwiping) return;
    const moveX = e.pageX - startX;

    if (Math.abs(moveX) > 50) {
      if (moveX > 50) handlePrev();
      else handleNext();
      isSwiping = true;
    }
  });

  const stopDragging = () => {
    isDown = false;
    isSwiping = false;
    carousel.classList.remove('dragging');
  };

  carousel.addEventListener('mouseup', stopDragging);
  carousel.addEventListener('mouseleave', stopDragging);

  // Événements Tactile (CORRIGÉS)
  carousel.addEventListener('touchstart', (e) => {
    startX = e.touches[0].pageX;
    startY = e.touches[0].pageY; // On enregistre le départ vertical
    isSwiping = false;
  }, { passive: true });

  carousel.addEventListener('touchmove', (e) => {
    if (isSwiping) return;

    const moveX = e.touches[0].pageX - startX;
    const moveY = e.touches[0].pageY - startY;

    // Calcul : est-ce que l'utilisateur glisse plus horizontalement que verticalement ?
    if (Math.abs(moveX) > Math.abs(moveY)) {
      // On bloque le scroll de la page pour éviter le "saut"
      if (e.cancelable) e.preventDefault();

      if (Math.abs(moveX) > 50) {
        if (moveX > 50) handlePrev();
        else handleNext();
        isSwiping = true;
      }
    }
  }, { passive: false }); // INDISPENSABLE : false pour permettre le preventDefault()

  carousel.addEventListener('touchend', () => {
    isSwiping = false;
  });

  // Initialisation
  setupDots();

  // Reset intelligent lors du redimensionnement
  window.addEventListener("resize", () => {
    // On ne reset que si la largeur change (évite les bugs de barres d'outils mobiles)
    if (window.innerWidth !== windowWidth) {
      windowWidth = window.innerWidth;
      track.style.transition = "none";
      moveToSlide(currentIndex); // Reste sur la slide actuelle
    }
  });
});