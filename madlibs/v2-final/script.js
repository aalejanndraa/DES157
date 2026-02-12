(function () {
  "use strict";
  console.log("reading js");

  const form = document.querySelector("#madForm");
  const overlay = document.querySelector("#overlay");
  const storyOut = document.querySelector("#storyOut");

  const closeBtn = document.querySelector("#closeBtn");
  const resetBtn = document.querySelector("#resetBtn");
  const againBtn = document.querySelector("#againBtn");

  const formError = document.querySelector("#formError");

  function wrapWord(word) {
    return `<span class="user-word">${word}</span>`;
  }

  function getArticle(word) {
    const firstLetter = word.charAt(0).toLowerCase();
    return "aeiou".includes(firstLetter) ? "an" : "a";
  }

  function openOverlay() {
    overlay.classList.add("active");
  }

  function closeOverlay() {
    overlay.classList.remove("active");
  }

  function showError(message) {
    formError.textContent = message;
  }

  function clearError() {
    formError.textContent = "";
  }

  function focusFirstEmpty(fields) {
    for (let i = 0; i < fields.length; i++) {
      if (!fields[i].value.trim()) {
        fields[i].focus();
        return true;
      }
    }
    return false;
  }

  form.addEventListener("submit", function (event) {
    event.preventDefault();

    const fields = [
      document.querySelector("#adj1"),
      document.querySelector("#noun1"),
      document.querySelector("#verb1"),
      document.querySelector("#adverb1"),
      document.querySelector("#place"),
      document.querySelector("#noun2")
    ];

    if (focusFirstEmpty(fields)) {
      showError("Please fill in all fields so your story can bloom 🌸");
      return;
    }

    clearError();

    const adj1 = fields[0].value.trim();
    const noun1 = fields[1].value.trim();
    const verb1 = fields[2].value.trim();
    const adverb1 = fields[3].value.trim();
    const place = fields[4].value.trim();
    const noun2 = fields[5].value.trim();

    const article = getArticle(adj1);

    storyOut.innerHTML = `
      It was ${article} ${wrapWord(adj1)} afternoon at ${wrapWord(place)}, and the weather finally felt like spring.
      I was walking along with my ${wrapWord(noun1)}, not really paying attention, when a few cherry blossom petals started falling around me.

      <br><br>

      It felt like one of those moments where everything slows down a little,
      so I decided to ${wrapWord(verb1)} ${wrapWord(adverb1)} and just enjoy it.
      Then ${wrapWord(noun2)} showed up unexpectedly, which somehow made the whole moment even better.

      <br><br>

      Sometimes spring doesn’t need a reason — it just happens.
    `;

    openOverlay();
  });

  form.addEventListener("input", function () {
    clearError();
  });

  closeBtn.addEventListener("click", closeOverlay);

  overlay.addEventListener("click", function (event) {
    if (event.target === overlay) closeOverlay();
  });

  againBtn.addEventListener("click", function () {
    form.reset();
    clearError();
    closeOverlay();
    document.querySelector("#adj1").focus();
  });

  resetBtn.addEventListener("click", function () {
    form.reset();
    clearError();
    closeOverlay();
    document.querySelector("#adj1").focus();
  });
})();
