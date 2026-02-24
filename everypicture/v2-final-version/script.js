(function () {
  "use strict";
  console.log("reading js");

  // grabbing the stuff we need for the interaction
  const img = document.querySelector("#heroImg");
  const card = document.querySelector(".card");
  const belowStory = document.querySelector("#belowStory");

  // if anything is missing, just stop so it doesn't break
  if (!img || !card || !belowStory) return;

  // this is the spot in the image where the mirror basically is
  // if it zooms slightly off, tweak these numbers a bit
  const target = { x: 0.74, y: 0.30 };

  // zoom range (not too crazy so it stays readable)
  const zoomMin = 1.0;
  const zoomMax = 2.2;

  // used so the story doesn't instantly flip the second you reach the mirror
  let storyTimer = null;

  // keeps a value from going past min/max
  function clamp(n, min, max) {
    return Math.max(min, Math.min(max, n));
  }

  // adds/removes class that switches front/back panels
  function setStory(on) {
    if (on) {
      card.classList.add("is-story");
    } else {
      card.classList.remove("is-story");
    }
  }

  // main function: scroll = zoom + then reveal story
  function setZoomAndReveal() {
    const rect = card.getBoundingClientRect();
    const vh = window.innerHeight || 1;

    // this controls where the "zoom zone" starts/ends while you scroll
    const start = vh * 0.20;
    const end = vh * 0.80;

    // progress goes from 0 to 1 while the card moves through that zone
    const progress = clamp((start - rect.top) / (end - start), 0, 1);

    // calculate zoom based on progress
    const z = zoomMin + (zoomMax - zoomMin) * progress;

    // figure out how to translate while zooming so it aims at the mirror
    const w = rect.width;
    const h = rect.height;

    const centerX = w * 0.5;
    const centerY = h * 0.5;

    const targetX = w * target.x;
    const targetY = h * target.y;

    const dx = (centerX - targetX) * (z - 1);
    const dy = (centerY - targetY) * (z - 1);

    img.style.transform = `translate(${dx}px, ${dy}px) scale(${z})`;

    // story below fades in once you're past the first part of the zoom
    if (progress >= 0.55) {
      belowStory.classList.add("is-on");
    } else {
      belowStory.classList.remove("is-on");
    }

    // when you're basically at the mirror, wait a sec then flip to story
    const nearMirror = progress >= 0.92;

    if (nearMirror) {
      if (!storyTimer && !card.classList.contains("is-story")) {
        storyTimer = window.setTimeout(() => {
          setStory(true);
          storyTimer = null;
        }, 1400);
      }
    } else {
      // if you scroll back up, cancel the timer and reset everything
      if (storyTimer) {
        window.clearTimeout(storyTimer);
        storyTimer = null;
      }
      setStory(false);
    }
  }

  // run on scroll and when the window size changes
  window.addEventListener("scroll", setZoomAndReveal);
  window.addEventListener("resize", setZoomAndReveal);

  // run once on load so it's not weird at the start
  setZoomAndReveal();
})();