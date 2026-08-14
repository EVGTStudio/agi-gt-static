/* =========================================================
   agi.gt – Scroll-Enthüllung
   Beobachtet Sections/Elemente und blendet sie sanft ein,
   sobald sie beim Scrollen ins sichtbare Fenster kommen.
   ========================================================= */
(function () {
  "use strict";

  var reduceMotion = window.matchMedia(
    "(prefers-reduced-motion: reduce)"
  ).matches;

  function revealAll() {
    document
      .querySelectorAll(".animated-element, .section-root")
      .forEach(function (el) {
        el.classList.add("is-visible");
      });
  }

  if (reduceMotion || !("IntersectionObserver" in window)) {
    revealAll();
    return;
  }

  var observer = new IntersectionObserver(
    function (entries) {
      entries.forEach(function (entry) {
        if (entry.isIntersecting) {
          entry.target.classList.add("is-visible");
          observer.unobserve(entry.target);
        }
      });
    },
    {
      root: null,
      rootMargin: "0px 0px -80px 0px",
      threshold: 0.1,
    }
  );

  function initObserver() {
    document
      .querySelectorAll(".animated-element, .section-root")
      .forEach(function (el) {
        observer.observe(el);
      });
  }

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", initObserver);
  } else {
    initObserver();
  }

  // Sicherheitsnetz: falls nach 3 Sekunden Elemente aus irgendeinem
  // Grund nicht animiert wurden, trotzdem einblenden.
  setTimeout(revealAll, 3000);
})();
