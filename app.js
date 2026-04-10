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
  toggle.addEventListener('click', () => {
    toggle.classList.toggle('open');
    mobileMenu.classList.toggle('open');
    document.body.style.overflow = mobileMenu.classList.contains('open') ? 'hidden' : '';
  });
}

function closeMenu() {
  if (toggle) toggle.classList.remove('open');
  if (mobileMenu) mobileMenu.classList.remove('open');
  document.body.style.overflow = '';
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
