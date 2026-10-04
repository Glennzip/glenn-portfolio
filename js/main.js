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

/* ── Contact Form — EmailJS Real Send ──────────────────────── */

/* ─────────────────────────────────────────────────────────────
   EMAILJS SETUP — fill in your 3 IDs below.
   See: Portfolio/EMAILJS_SETUP.md for step-by-step guide.
   ───────────────────────────────────────────────────────────── */
const EMAILJS_CONFIG = {
  publicKey:   'HWTIPZSDJS2EEaa_2',
  serviceId:   'service_69dzp69',
  templateId:  'template_0tvxb5b',
};

function initContactForm() {
  const form      = document.getElementById('contactForm');
  const note      = document.getElementById('formNote');
  const submitBtn = form ? form.querySelector('button[type="submit"]') : null;

  if (!form || !submitBtn) return;

  /* Initialise EmailJS SDK with your public key */
  if (typeof emailjs !== 'undefined') {
    emailjs.init({ publicKey: EMAILJS_CONFIG.publicKey });
  }

  form.addEventListener('submit', async (e) => {
    e.preventDefault();

    const name    = form.name.value.trim();
    const email   = form.email.value.trim();
    const subject = form.subject.value.trim();
    const message = form.message.value.trim();

    /* ── Client-side validation ──────────────────────────── */
    if (!name || !email || !subject || !message) {
      showNote('⚠️ Please fill in all fields.', 'var(--red, #f87171)');
      shakeForm(form);
      return;
    }
    if (!isValidEmail(email)) {
      showNote('⚠️ Please enter a valid email address.', 'var(--red, #f87171)');
      shakeForm(form);
      return;
    }

    /* ── Check IDs are configured ────────────────────────── */
    if (
      EMAILJS_CONFIG.publicKey  === 'YOUR_PUBLIC_KEY'  ||
      EMAILJS_CONFIG.serviceId  === 'YOUR_SERVICE_ID'  ||
      EMAILJS_CONFIG.templateId === 'YOUR_TEMPLATE_ID'
    ) {
      showNote('⚠️ EmailJS not configured yet. See EMAILJS_SETUP.md.', 'var(--red, #f87171)');
      return;
    }

    /* ── Loading state ───────────────────────────────────── */
    setLoading(true);

    try {
      /* ── Send via EmailJS ────────────────────────────────
         These keys must match your EmailJS template variables:
         {{from_name}}, {{from_email}}, {{subject}}, {{message}}
      */
      await emailjs.send(
        EMAILJS_CONFIG.serviceId,
        EMAILJS_CONFIG.templateId,
        {
          from_name:  name,
          from_email: email,
          subject:    subject,
          message:    message,
          reply_to:   email,
          to_name:    'Glenn',
        }
      );

      /* ── Success ─────────────────────────────────────────── */
      showNote('✅ Message sent! I\'ll get back to you soon.', 'var(--green)');
      form.reset();

    } catch (err) {
      /* ── Error ───────────────────────────────────────────── */
      console.error('EmailJS error:', err);
      const errMsg = err?.text || err?.message || 'Unknown error';
      showNote(`❌ Failed to send. (${errMsg}) — try emailing me directly.`, 'var(--red, #f87171)');
    } finally {
      setLoading(false);
    }
  });

  /* ── Helpers ─────────────────────────────────────────────── */
  function setLoading(on) {
    submitBtn.disabled = on;
    submitBtn.innerHTML = on
      ? `<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="spin-loader"><path d="M21 12a9 9 0 1 1-6.219-8.56"/></svg> Sending…`
      : `<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><line x1="22" y1="2" x2="11" y2="13"/><polygon points="22 2 15 22 11 13 2 9 22 2"/></svg> Send Message`;
  }

  function showNote(msg, color) {
    note.textContent = msg;
    note.style.color = color;
    clearTimeout(note._timer);
    note._timer = setTimeout(() => { note.textContent = ''; }, 6000);
  }

  function isValidEmail(email) {
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
  }

  function shakeForm(el) {
    el.classList.add('form-shake');
    el.addEventListener('animationend', () => el.classList.remove('form-shake'), { once: true });
  }
}

document.addEventListener('DOMContentLoaded', initContactForm);


/* ── Footer Year ───────────────────────────────────────────── */
document.addEventListener('DOMContentLoaded', () => {
  const yearEl = document.getElementById('year');
  if (yearEl) yearEl.textContent = new Date().getFullYear();
});
