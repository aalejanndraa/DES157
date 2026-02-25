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
  let zoomMax = 2.2;

  function updateZoomMax() {
    if (window.innerWidth <= 600) {
      zoomMax = 1.85;
    } else {
      zoomMax = 2.2;
    }
  }

  updateZoomMax();

  // used so the flip doesn’t happen instantly
  let storyTimer = null;

  // keeps numbers between a min and max value
  function clamp(n, min, max) {
    return Math.max(min, Math.min(max, n));
  }

  // toggles the class that reveals the back story panel
  function setStory(on) {
    if (on) {
      card.classList.add("is-story");
    } else {
      card.classList.remove("is-story");
    }
  }

  // main scroll interaction
  function setZoomAndReveal() {
    const rect = card.getBoundingClientRect();
    const vh = window.innerHeight || 1;

    // define the scroll zone where zooming happens
    const start = vh * 0.20;
    const end = vh * 0.80;

    // calculate progress from 0 to 1
    const progress = clamp((start - rect.top) / (end - start), 0, 1);

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

    // fade in the story section below after some scrolling
    if (progress >= 0.55) {
      belowStory.classList.add("is-on");
    } else {
      belowStory.classList.remove("is-on");
    }

    // once zoomed in enough, wait and then flip the card
    const nearMirror = progress >= 0.92;

    if (nearMirror) {
      if (!storyTimer && !card.classList.contains("is-story")) {
        storyTimer = window.setTimeout(() => {
          setStory(true);
          storyTimer = null;
        }, 1400);
      }
    } else {
      // if scrolling back up, reset everything
      if (storyTimer) {
        window.clearTimeout(storyTimer);
        storyTimer = null;
      }
      setStory(false);
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