(function () {
  "use strict";

  // grabbing the main elements we need for the interaction
  const img = document.querySelector("#heroImg");
  const card = document.querySelector(".card");
  const belowStory = document.querySelector("#belowStory");

  // if something didn’t load correctly, just stop the script
  if (!img || !card || !belowStory) return;

  // approximate position of the mirror inside the image
  // if the zoom feels slightly off, these numbers can be adjusted
  const target = { x: 0.74, y: 0.30 };

  // min and max zoom levels
  const zoomMin = 1.0;
  let zoomMax = 1.9;

  function updateZoomMax() {
    if (window.innerWidth <= 600) {
      zoomMax = 1.65;
    } else {
      zoomMax = 1.9;
    }
  }

  updateZoomMax();

  // keeps numbers between a min and max value
  function clamp(n, min, max) {
    return Math.max(min, Math.min(max, n));
  }

  // makes zoom feel faster at the beginning (so it reaches the mirror quicker)
  function easeOutQuad(t) {
    return 1 - (1 - t) * (1 - t);
  }

  // main scroll interaction
  function setZoomAndReveal() {
    const rect = card.getBoundingClientRect();
    const vh = window.innerHeight || 1;

    // define the scroll zone where zooming happens
    // improvement: shorter zone = faster zoom (feels like one scroll)
    const start = vh * 0.25;
    const end = vh * 0.45;

    // calculate progress from 0 to 1
    const raw = clamp((start - rect.top) / (end - start), 0, 1);
    const progress = easeOutQuad(raw);

    // calculate zoom amount
    const z = zoomMin + (zoomMax - zoomMin) * progress;

    const w = rect.width;
    const h = rect.height;

    // center of card
    const centerX = w * 0.5;
    const centerY = h * 0.5;

    // mirror position
    const targetX = w * target.x;
    const targetY = h * target.y;

    // shift image so zoom focuses on mirror
    const dx = (centerX - targetX) * (z - 1);
    const dy = (centerY - targetY) * (z - 1);

    img.style.transform = `translate(${dx}px, ${dy}px) scale(${z})`;

    // fade in the story section below after zooming closer to the mirror
    // improvement: story appears later so users see the mirror first
    if (progress >= 0.85) {
      belowStory.classList.add("is-on");
    } else {
      belowStory.classList.remove("is-on");
    }
  }

  // run when scrolling
  window.addEventListener("scroll", setZoomAndReveal);

  // also update if window size changes
  window.addEventListener("resize", function () {
    updateZoomMax();
    setZoomAndReveal();
  });

  // run once on load
  setZoomAndReveal();
})();