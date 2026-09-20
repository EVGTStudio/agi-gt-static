/* =========================================================
   agi.gt – Scroll-Effekte
   1) Menüleiste: wird beim Herunterscrollen zunehmend
      durchsichtiger und etwas schmaler (kompakter).
   2) Titelbild (Seehaus): die dunkle Abblendung hellt sich
      beim Herunterscrollen langsam auf und bleibt hell,
      auch wenn man wieder nach oben scrollt. Erst ein
      erneuter Seitenaufruf setzt sie zurück.
   ========================================================= */
(function () {
  'use strict';

  // Wie viele Pixel Scroll-Strecke, bis die Leiste ihren
  // "fertigen" Zustand (am transparentesten/schmalsten) erreicht.
  var NAV_FADE_DISTANCE = 320;

  // Session-Maximum: brennt sich nur in Richtung "heller" ein,
  // geht beim Zurückscrollen nicht wieder dunkler.
  var heroMaxProgress = 0;
  var heroFadeDistance = 0;

  function cacheHeroDistance() {
    var hero = document.getElementById('Home');
    heroFadeDistance = (hero && hero.offsetHeight) || window.innerHeight || 800;
  }

  function updateEffects() {
    var y = window.scrollY || window.pageYOffset || 0;

    // --- Menüleiste ---
    var navProgress = Math.min(Math.max(y / NAV_FADE_DISTANCE, 0), 1);
    document.documentElement.style.setProperty('--agi-nav-progress', navProgress.toFixed(3));

    // --- Titelbild ---
    var overlay = document.getElementById('agi-hero-overlay');
    if (overlay) {
      if (!heroFadeDistance) cacheHeroDistance();
      var heroProgress = Math.min(Math.max(y / heroFadeDistance, 0), 1);
      if (heroProgress > heroMaxProgress) heroMaxProgress = heroProgress;
      overlay.style.opacity = (0.6 * (1 - heroMaxProgress)).toFixed(3);
    }
  }

  document.addEventListener('DOMContentLoaded', cacheHeroDistance);
  window.addEventListener('load', function () {
    cacheHeroDistance();
    updateEffects();
  });
  window.addEventListener('resize', cacheHeroDistance, { passive: true });
  window.addEventListener('scroll', updateEffects, { passive: true });

  // Direkt einmal ausführen, falls die Seite mit Scroll-Position
  // neu geladen wird (z. B. per Browser-Zurück).
  updateEffects();
})();
