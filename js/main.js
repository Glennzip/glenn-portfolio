/* ============================================================
   MAIN.JS — Glenn Beriño D. Portfolio
   Core logic: typed text, scroll reveal, project filter, form
   ============================================================ */

'use strict';

/* ── Typed Text ────────────────────────────────────────────── */
const TYPED_PHRASES = [
  'Websites.',
  'Web Apps.',
  'Games.',
  'Mobile Apps.',
  'UI/UX.',
  'E-Commerce.',
  'Experiences.',
];

const typedEl = document.getElementById('typedText');
let phraseIdx = 0;
let charIdx = 0;
let isDeleting = false;
let typingTimer;

function type() {
  const current = TYPED_PHRASES[phraseIdx];

  if (isDeleting) {
    charIdx--;
  } else {
    charIdx++;
  }

  typedEl.textContent = current.substring(0, charIdx);

  let delay = isDeleting ? 60 : 100;

  if (!isDeleting && charIdx === current.length) {
    delay = 1800;
    isDeleting = true;
  } else if (isDeleting && charIdx === 0) {
    isDeleting = false;
    phraseIdx = (phraseIdx + 1) % TYPED_PHRASES.length;
    delay = 300;
  }

  typingTimer = setTimeout(type, delay);
}

document.addEventListener('DOMContentLoaded', () => {
  setTimeout(type, 600);
});

/* ── Scroll Reveal ─────────────────────────────────────────── */
const revealObserver = new IntersectionObserver(
  (entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        entry.target.classList.add('visible');
        // Don't unobserve hero items so they animate once
      }
    });
  },
  { threshold: 0.12, rootMargin: '0px 0px -50px 0px' }
);

function initReveal() {
  document.querySelectorAll('.reveal').forEach((el) => {
    revealObserver.observe(el);
  });
}

document.addEventListener('DOMContentLoaded', initReveal);

/* ── Project Filter ────────────────────────────────────────── */
function initFilter() {
  const filterBtns = document.querySelectorAll('.filter-btn');
  const cards = document.querySelectorAll('.project-card');

  filterBtns.forEach((btn) => {
    btn.addEventListener('click', () => {
      filterBtns.forEach((b) => b.classList.remove('active'));
      btn.classList.add('active');

      const filter = btn.dataset.filter;

      cards.forEach((card) => {
        const cats = card.dataset.category || '';
        const matches = filter === 'all' || cats.split(' ').includes(filter);

        if (matches) {
          card.classList.remove('hidden');
          // Trigger reveal re-check
          setTimeout(() => revealObserver.observe(card), 50);
        } else {
          card.classList.add('hidden');
        }
      });
    });
  });
}

document.addEventListener('DOMContentLoaded', initFilter);

/* ── Contact Form ──────────────────────────────────────────── */
function initContactForm() {
  const form = document.getElementById('contactForm');
  const note = document.getElementById('formNote');

  if (!form) return;

  form.addEventListener('submit', (e) => {
    e.preventDefault();

    const name    = form.name.value.trim();
    const email   = form.email.value.trim();
    const subject = form.subject.value.trim();
    const message = form.message.value.trim();

    if (!name || !email || !subject || !message) {
      showNote('⚠️ Please fill in all fields.', '#f87171');
      return;
    }

    if (!isValidEmail(email)) {
      showNote('⚠️ Please enter a valid email address.', '#f87171');
      return;
    }

    // Simulate send (replace with actual EmailJS / fetch call)
    const submitBtn = form.querySelector('button[type="submit"]');
    submitBtn.disabled = true;
    submitBtn.textContent = 'Sending…';

    setTimeout(() => {
      showNote('✅ Message sent! I\'ll get back to you soon.', 'var(--green)');
      form.reset();
      submitBtn.disabled = false;
      submitBtn.innerHTML = '<i class="bx bx-send"></i> Send Message';
    }, 1200);
  });

  function showNote(msg, color) {
    note.textContent = msg;
    note.style.color = color;
    setTimeout(() => { note.textContent = ''; }, 5000);
  }

  function isValidEmail(email) {
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
  }
}

document.addEventListener('DOMContentLoaded', initContactForm);

/* ── Footer Year ───────────────────────────────────────────── */
document.addEventListener('DOMContentLoaded', () => {
  const yearEl = document.getElementById('year');
  if (yearEl) yearEl.textContent = new Date().getFullYear();
});
