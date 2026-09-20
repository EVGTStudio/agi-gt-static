/* =========================================================
   agi.gt – Scroll-Effekte
   1) Menüleiste: das milchige Glas wird beim Herunterscrollen
      zunehmend klarer – Farbe UND Weichzeichner nehmen ab –
      bis es nach ~340px ganz klares (unsichtbares) Glas ist.
   2) Titelbild (Seehaus): die dunkle Abblendung hellt sich
      beim Herunterscrollen langsam auf und bleibt hell, auch
      wenn man wieder nach oben scrollt. Erst ein erneuter
      Seitenaufruf setzt sie zurück.
   3) Übersetzer-Widget: wird beim Laden automatisch freige-
      schaltet, ohne dass dafür ein Cookie-Banner nötig ist.

   Hinweis: Die Menüleiste wird bewusst direkt per JavaScript
   eingefärbt (nicht nur per CSS-Variable), damit der Effekt
   unabhängig von der eigenen Farblogik der Seiten-Software
   zuverlässig funktioniert.
   ========================================================= */
(function () {
  'use strict';

  var NAV_FADE_DISTANCE = 340; // Scroll-Strecke bis "ganz klares Glas"
  var NAV_ALPHA_START = 0.45;  // milchig
  var NAV_ALPHA_END = 0;       // ganz klar
  var NAV_BLUR_START = 14;     // px
  var NAV_BLUR_END = 0;        // px

  var navEl = null;
  var heroMaxProgress = 0;
  var heroFadeDistance = 0;

  function cacheElements() {
    if (!navEl) {
      navEl = document.querySelector('.navigation-root.navigation') || document.querySelector('.navigation-root');
    }
    var hero = document.getElementById('Home');
    heroFadeDistance = (hero && hero.offsetHeight) || window.innerHeight || 800;
  }

  function updateEffects() {
    var y = window.scrollY || window.pageYOffset || 0;

    // --- Menüleiste ---
    var navProgress = Math.min(Math.max(y / NAV_FADE_DISTANCE, 0), 1);
    document.documentElement.style.setProperty('--agi-nav-progress', navProgress.toFixed(3));

    var blur = (NAV_BLUR_START - (NAV_BLUR_START - NAV_BLUR_END) * navProgress).toFixed(2);
    document.documentElement.style.setProperty('--agi-nav-blur', blur + 'px');

    if (navEl) {
      if (y > 0) {
        var alpha = (NAV_ALPHA_START - (NAV_ALPHA_START - NAV_ALPHA_END) * navProgress).toFixed(3);
        navEl.style.setProperty('--navigation-background-color', 'rgba(180, 138, 97, ' + alpha + ')');
      } else {
        navEl.style.removeProperty('--navigation-background-color');
      }
    }

    // --- Titelbild ---
    var overlay = document.getElementById('agi-hero-overlay');
    if (overlay) {
      var heroProgress = Math.min(Math.max(y / heroFadeDistance, 0), 1);
      if (heroProgress > heroMaxProgress) heroMaxProgress = heroProgress;
      overlay.style.opacity = (0.6 * (1 - heroMaxProgress)).toFixed(3);
    }
  }

  // --- Übersetzer-Widget ---
  // War bisher hinter einem Cookie-Consent versteckt; ohne Banner
  // schalten wir es hier einmalig direkt frei, ganz ohne Pop-up.
  function unlockTranslator() {
    try {
      if (
        window.CONSENT_REGISTRY &&
        window.CONSENT_REGISTRY.websiteTranslator &&
        window.CONSENT_REGISTRY.websiteTranslator.websiteTranslatorModule &&
        typeof window.CONSENT_REGISTRY.websiteTranslator.websiteTranslatorModule.consentAction === 'function'
      ) {
        window.CONSENT_REGISTRY.websiteTranslator.websiteTranslatorModule.consentAction();
      }
    } catch (e) {
      /* still fine if this fails – widget just stays as-is */
    }
  }

  document.addEventListener('DOMContentLoaded', cacheElements);
  window.addEventListener('load', function () {
    cacheElements();
    updateEffects();
    unlockTranslator();
  });
  window.addEventListener('resize', cacheElements, { passive: true });
  window.addEventListener('scroll', updateEffects, { passive: true });

  cacheElements();
  updateEffects();
})();
