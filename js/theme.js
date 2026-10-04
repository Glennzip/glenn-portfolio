/* ============================================================
   THEME.JS — Light / Dark mode toggle
   • Remembers preference via localStorage
   • Falls back to OS/system preference on first visit
   • Sets data-theme on BOTH <html> and <body> for consistency
   ============================================================ */

'use strict';

(function () {

  const STORAGE_KEY = 'portfolio-theme';
  const LIGHT       = 'light';
  const DARK        = 'dark';

  /* ── 1. Detect saved or preferred theme ──────────────────── */
  function getPreferredTheme() {
    const stored = localStorage.getItem(STORAGE_KEY);
    if (stored === LIGHT || stored === DARK) return stored;
    return window.matchMedia('(prefers-color-scheme: light)').matches ? LIGHT : DARK;
  }

  /* ── 2. Apply theme to <html> and <body> ─────────────────── */
  function applyTheme(theme) {
    const targets = [document.documentElement, document.body].filter(Boolean);
    targets.forEach(el => {
      if (theme === LIGHT) {
        el.setAttribute('data-theme', LIGHT);
      } else {
        el.removeAttribute('data-theme');
      }
    });
    localStorage.setItem(STORAGE_KEY, theme);
    updateAriaLabel(theme);
  }

  /* ── 3. Keep aria-label accurate ─────────────────────────── */
  function updateAriaLabel(theme) {
    const btn = document.getElementById('themeToggle');
    if (btn) {
      btn.setAttribute('aria-label',
        theme === LIGHT ? 'Switch to dark mode' : 'Switch to light mode'
      );
      btn.setAttribute('title',
        theme === LIGHT ? 'Switch to dark mode' : 'Switch to light mode'
      );
    }
  }

  /* ── 4. Apply immediately before first paint ─────────────── */
  applyTheme(getPreferredTheme());

  /* ── 5. Wire toggle button after DOM ready ────────────────── */
  document.addEventListener('DOMContentLoaded', () => {
    const btn = document.getElementById('themeToggle');
    if (!btn) return;

    // Set correct aria-label on load
    updateAriaLabel(getPreferredTheme());

    btn.addEventListener('click', () => {
      const isDark = document.documentElement.getAttribute('data-theme') !== LIGHT;
      const next   = isDark ? LIGHT : DARK;

      // Trigger spin animation
      btn.classList.remove('spinning');
      // Force reflow so animation re-triggers on rapid clicks
      void btn.offsetWidth;
      btn.classList.add('spinning');
      btn.addEventListener('animationend', () => btn.classList.remove('spinning'), { once: true });

      applyTheme(next);
    });

    /* ── 6. Respect OS theme change if no manual override ───── */
    window.matchMedia('(prefers-color-scheme: light)').addEventListener('change', (e) => {
      if (!localStorage.getItem(STORAGE_KEY)) {
        applyTheme(e.matches ? LIGHT : DARK);
      }
    });
  });

})();
