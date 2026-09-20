/* =========================================================
   agi.gt – Scroll-Effekte
   1) Menüleiste: wird beim Herunterscrollen zunehmend
      durchsichtiger und etwas kompakter/schmaler.
   2) Titelbild (Seehaus): die dunkle Abblendung hellt sich
      beim Herunterscrollen langsam auf und bleibt hell,
      auch wenn man wieder nach oben scrollt. Erst ein
      erneuter Seitenaufruf setzt sie zurück.

   Hinweis zur Umsetzung: Die Menüleiste wird bewusst direkt
   per JavaScript eingefärbt/verkleinert (nicht nur per CSS-
   Variable), damit unser Effekt unabhängig von der eigenen
   Farblogik der Seiten-Software zuverlässig funktioniert.
   ========================================================= */
(function () {
  'use strict';

  var NAV_FADE_DISTANCE = 320;
  var NAV_ALPHA_START = 0.45;
  var NAV_ALPHA_END = 0.10;
  var NAV_PAD_START = 18;
  var NAV_PAD_END = 9;

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

    var navProgress = Math.min(Math.max(y / NAV_FADE_DISTANCE, 0), 1);
    document.documentElement.style.setProperty('--agi-nav-progress', navProgress.toFixed(3));

    if (navEl) {
      if (y > 0) {
        var alpha = (NAV_ALPHA_START - (NAV_ALPHA_START - NAV_ALPHA_END) * navProgress).toFixed(3);
        var pad = (NAV_PAD_START - (NAV_PAD_START - NAV_PAD_END) * navProgress).toFixed(1);
        navEl.style.setProperty('--navigation-background-color', 'rgba(180, 138, 97, ' + alpha + ')');
        navEl.style.setProperty('padding-top', pad + 'px');
        navEl.style.setProperty('padding-bottom', pad + 'px');
      } else {
        navEl.style.removeProperty('--navigation-background-color');
        navEl.style.removeProperty('padding-top');
        navEl.style.removeProperty('padding-bottom');
      }
    }

    var overlay = document.getElementById('agi-hero-overlay');
    if (overlay) {
      var heroProgress = Math.min(Math.max(y / heroFadeDistance, 0), 1);
      if (heroProgress > heroMaxProgress) heroMaxProgress = heroProgress;
      overlay.style.opacity = (0.6 * (1 - heroMaxProgress)).toFixed(3);
    }
  }

  document.addEventListener('DOMContentLoaded', cacheElements);
  window.addEventListener('load', function () {
    cacheElements();
    updateEffects();
  });
  window.addEventListener('resize', cacheElements, { passive: true });
  window.addEventListener('scroll', updateEffects, { passive: true });

  cacheElements();
  updateEffects();
})();
