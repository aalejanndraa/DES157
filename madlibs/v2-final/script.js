(function () {
  "use strict";
  console.log("reading js");

  const form = document.querySelector("#madForm");
  const overlay = document.querySelector("#overlay");
  const storyOut = document.querySelector("#storyOut");

  const closeBtn = document.querySelector("#closeBtn");
  const resetBtn = document.querySelector("#resetBtn");
  const againBtn = document.querySelector("#againBtn");

  function wrapWord(word) {
    return `<span class="user-word">${word}</span>`;
  }

  function getArticle(word) {
    const firstLetter = word.charAt(0).toLowerCase();
    return "aeiou".includes(firstLetter) ? "an" : "a";
  }

  function openOverlay() {
    overlay.classList.add("active");
    overlay.setAttribute("aria-hidden", "false");
  }

  function closeOverlay() {
    overlay.classList.remove("active");
    overlay.setAttribute("aria-hidden", "true");
  }

  form.addEventListener("submit", function (event) {
    event.preventDefault();

    const adj1 = document.querySelector("#adj1").value.trim();
    const noun1 = document.querySelector("#noun1").value.trim();
    const verb1 = document.querySelector("#verb1").value.trim();
    const adverb1 = document.querySelector("#adverb1").value.trim();
    const place = document.querySelector("#place").value.trim();
    const noun2 = document.querySelector("#noun2").value.trim();

    if (!adj1 || !noun1 || !verb1 || !adverb1 || !place || !noun2) {
      storyOut.innerHTML =
        `<span class="muted">Please fill in all the fields so your story can bloom 🌸</span>`;
      openOverlay();
      return;
    }

    const article = getArticle(adj1);

    storyOut.innerHTML = `
        It was ${article} ${wrapWord(adj1)} afternoon at ${wrapWord(place)}, and the weather finally felt like spring. I was walking along with my ${wrapWord(noun1)}, not really paying attention, when a few cherry blossom petals started falling around me.

    <br><br>

        It felt like one of those moments where everything slows down a little,
        so I decided to ${wrapWord(verb1)} ${wrapWord(adverb1)} and just enjoy it.
        Then ${wrapWord(noun2)} showed up unexpectedly, which somehow made the whole
        moment even better.

    <br><br>

        Sometimes spring doesn’t need a reason — it just happens.
    `;

    openOverlay();
  });

  closeBtn.addEventListener("click", closeOverlay);

  overlay.addEventListener("click", function (event) {
    if (event.target === overlay) closeOverlay();
  });

  againBtn.addEventListener("click", function () {
    closeOverlay();
    document.querySelector("#adj1").focus();
  });

  resetBtn.addEventListener("click", function () {
    form.reset();
    closeOverlay();
    document.querySelector("#adj1").focus();
  });
})();
