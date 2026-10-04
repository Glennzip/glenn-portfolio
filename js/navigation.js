/* ============================================================
   NAVIGATION.JS — Navbar scroll state & active link tracking
   ============================================================ */

'use strict';

document.addEventListener('DOMContentLoaded', () => {

  const navbar      = document.getElementById('navbar');
  const hamburger   = document.getElementById('hamburger');
  const navLinks    = document.getElementById('navLinks');
  const navOverlay  = document.getElementById('navOverlay');
  const allLinks    = document.querySelectorAll('.nav-link');
  const sections    = document.querySelectorAll('section[id]');

  /* ── Navbar scroll shadow ────────────────────────────────── */
  function onScroll() {
    if (window.scrollY > 20) {
      navbar.classList.add('scrolled');
    } else {
      navbar.classList.remove('scrolled');
    }
    updateActiveLink();
  }

  window.addEventListener('scroll', onScroll, { passive: true });
  onScroll(); // run once on load

  /* ── Active link highlight based on scroll position ──────── */
  function updateActiveLink() {
    let current = '';
    const scrollY = window.scrollY + 100;

    sections.forEach((section) => {
      const sectionTop = section.offsetTop;
      const sectionH   = section.offsetHeight;
      if (scrollY >= sectionTop && scrollY < sectionTop + sectionH) {
        current = section.getAttribute('id');
      }
    });

    allLinks.forEach((link) => {
      link.classList.toggle('active', link.dataset.section === current);
    });
  }

  /* ── Smooth nav link click & close mobile menu ───────────── */
  allLinks.forEach((link) => {
    link.addEventListener('click', (e) => {
      const target = document.querySelector(link.getAttribute('href'));
      if (target) {
        e.preventDefault();
        closeMobileMenu();
        target.scrollIntoView({ behavior: 'smooth' });
      }
    });
  });

  /* ── Hamburger toggle ────────────────────────────────────── */
  hamburger.addEventListener('click', () => {
    const isOpen = navLinks.classList.toggle('open');
    hamburger.classList.toggle('open', isOpen);
    hamburger.setAttribute('aria-expanded', String(isOpen));
    if (navOverlay) navOverlay.classList.toggle('open', isOpen);
    document.body.style.overflow = isOpen ? 'hidden' : '';
  });

  function closeMobileMenu() {
    navLinks.classList.remove('open');
    hamburger.classList.remove('open');
    hamburger.setAttribute('aria-expanded', 'false');
    if (navOverlay) navOverlay.classList.remove('open');
    document.body.style.overflow = '';
  }

  /* ── Close when tapping the dim overlay ──────────────────── */
  if (navOverlay) {
    navOverlay.addEventListener('click', closeMobileMenu);
  }

  /* ── Close mobile menu when clicking outside ─────────────── */
  document.addEventListener('click', (e) => {
    if (
      navLinks.classList.contains('open') &&
      !navLinks.contains(e.target) &&
      !hamburger.contains(e.target) &&
      e.target !== navOverlay
    ) {
      closeMobileMenu();
    }
  });

  /* ── Close mobile menu on resize to desktop ──────────────── */
  window.addEventListener('resize', () => {
    if (window.innerWidth > 768) {
      closeMobileMenu();
    }
  });


});
