/* ═══════════════════════════════════════════════════
   Revise — Shared JavaScript
   Used across all pages
   ═══════════════════════════════════════════════════ */

// ─── Scroll Reveal ───
const revealObs = new IntersectionObserver((entries) => {
  entries.forEach(e => {
    if (e.isIntersecting) {
      e.target.classList.add('visible');
      revealObs.unobserve(e.target);
    }
  });
}, { threshold: 0.1, rootMargin: '0px 0px -40px 0px' });
document.querySelectorAll('.reveal').forEach(el => revealObs.observe(el));

// ─── Nav Shrink on Scroll ───
const nav = document.querySelector('nav');
if (nav) {
  window.addEventListener('scroll', () => {
    nav.classList.toggle('scrolled', window.scrollY > 60);
  }, { passive: true });
}

// ─── Mobile Hamburger Menu ───
const toggle = document.querySelector('.mobile-toggle');
const mobileMenu = document.getElementById('mobileMenu');
if (toggle && mobileMenu) {
  toggle.setAttribute('aria-expanded', 'false');
  toggle.setAttribute('aria-controls', 'mobileMenu');
  toggle.addEventListener('click', () => {
    const isOpen = toggle.classList.toggle('open');
    mobileMenu.classList.toggle('open');
    toggle.setAttribute('aria-expanded', isOpen);
    document.body.style.overflow = isOpen ? 'hidden' : '';
  });
}

function closeMenu() {
  if (toggle) {
    toggle.classList.remove('open');
    toggle.setAttribute('aria-expanded', 'false');
  }
  if (mobileMenu) mobileMenu.classList.remove('open');
  document.body.style.overflow = '';
}

// ─── Nav Theme Toggle (dark sections invert nav) ───
const darkSections = document.querySelectorAll('.section-dark');
if (nav && darkSections.length) {
  const navThemeObs = new IntersectionObserver((entries) => {
    // Check if any dark section is at the top of the viewport
    let inDark = false;
    darkSections.forEach(sec => {
      const rect = sec.getBoundingClientRect();
      if (rect.top <= 80 && rect.bottom > 80) inDark = true;
    });
    nav.classList.toggle('nav-dark', inDark);
  }, { threshold: 0, rootMargin: '-79px 0px -80% 0px' });

  // Observe with scroll instead for more reliable detection
  window.addEventListener('scroll', () => {
    let inDark = false;
    darkSections.forEach(sec => {
      const rect = sec.getBoundingClientRect();
      if (rect.top <= 80 && rect.bottom > 80) inDark = true;
    });
    nav.classList.toggle('nav-dark', inDark);
  }, { passive: true });
}

// ─── Cursor Spotlight on Service Cards ───
document.querySelectorAll('.service-card').forEach(card => {
  card.addEventListener('mousemove', e => {
    const r = card.getBoundingClientRect();
    card.style.setProperty('--mx', (e.clientX - r.left) + 'px');
    card.style.setProperty('--my', (e.clientY - r.top) + 'px');
  });
});

// ─── Smooth Page Transitions on Work Cards ───
document.querySelectorAll('.work-card').forEach(card => {
  card.addEventListener('click', e => {
    e.preventDefault();
    const href = card.getAttribute('href');
    if (!href) return;
    document.body.classList.add('transitioning');
    setTimeout(() => { window.location.href = href; }, 300);
  });
});
