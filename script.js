'use strict';

const root = document.documentElement;
const reduced = matchMedia('(prefers-reduced-motion: reduce)').matches;

/* ---------- Theme (remembers choice, else follows system) ---------- */
const themeBtn = document.getElementById('theme');
const saved = localStorage.getItem('theme');
const systemDark = matchMedia('(prefers-color-scheme: dark)');
const currentTheme = () => saved || (systemDark.matches ? 'dark' : 'light');
function applyTheme(t) {
  root.dataset.theme = t;
  themeBtn.setAttribute('aria-label', `Switch to ${t === 'dark' ? 'light' : 'dark'} theme`);
  document.querySelector('meta[name="theme-color"]').content = t === 'dark' ? '#0f0a0d' : '#f6f1e6';
}
applyTheme(currentTheme());
themeBtn.addEventListener('click', () => {
  const next = root.dataset.theme === 'dark' ? 'light' : 'dark';
  const swap = () => { applyTheme(next); localStorage.setItem('theme', next); };
  document.startViewTransition && !reduced ? document.startViewTransition(swap) : swap();
});

/* ---------- Spotlight on the hero name follows the pointer ---------- */
const hero = document.querySelector('.hero');
if (!reduced && matchMedia('(pointer: fine)').matches) {
  hero.addEventListener('pointermove', (e) => {
    document.querySelectorAll('.spot').forEach((el) => {
      const r = el.getBoundingClientRect();
      el.style.setProperty('--spot-x', ((e.clientX - r.left) / r.width * 100).toFixed(1) + '%');
      el.style.setProperty('--spot-y', ((e.clientY - r.top) / r.height * 100).toFixed(1) + '%');
    });
  });
}

/* ---------- Filmography filter with View Transitions ---------- */
const buttons = [...document.querySelectorAll('.filters button')];
const credits = [...document.querySelectorAll('.credit')];
credits.forEach((c, i) => { c.style.viewTransitionName = `credit-${i}`; });

function applyFilter(f) {
  credits.forEach((c) => { c.hidden = f !== 'all' && c.dataset.type !== f; });
  buttons.forEach((b) => b.setAttribute('aria-pressed', String(b.dataset.f === f)));
}
buttons.forEach((b) => b.addEventListener('click', () => {
  const f = b.dataset.f;
  document.startViewTransition && !reduced
    ? document.startViewTransition(() => applyFilter(f))
    : applyFilter(f);
}));

/* ---------- Fallback reveal for browsers without scroll-driven animations ---------- */
if (!CSS.supports('animation-timeline: view()')) {
  const io = new IntersectionObserver((entries) => {
    entries.forEach((e) => {
      if (e.isIntersecting) {
        e.target.animate(
          [{ opacity: 0, transform: 'translateY(2rem)' }, { opacity: 1, transform: 'none' }],
          { duration: reduced ? 0 : 600, easing: 'cubic-bezier(.2,.8,.2,1)', fill: 'backwards' }
        );
        io.unobserve(e.target);
      }
    });
  }, { threshold: 0.15 });
  document.querySelectorAll('.reveal').forEach((el) => io.observe(el));
}

/* ---------- Count-up numbers ---------- */
if (!reduced) {
  const nums = document.querySelectorAll('[data-count]');
  const io2 = new IntersectionObserver((entries) => {
    entries.forEach((e) => {
      if (!e.isIntersecting) return;
      const el = e.target, end = +el.dataset.count, t0 = performance.now();
      const tick = (t) => {
        const p = Math.min((t - t0) / 900, 1);
        el.textContent = Math.round(end * (1 - Math.pow(1 - p, 3)));
        if (p < 1) requestAnimationFrame(tick);
      };
      requestAnimationFrame(tick);
      io2.unobserve(el);
    });
  }, { threshold: 0.6 });
  nums.forEach((n) => io2.observe(n));
}

/* ---------- Copy phone number ---------- */
const status = document.getElementById('status');
document.getElementById('copy').addEventListener('click', async () => {
  try {
    await navigator.clipboard.writeText('+91 8123465902');
    status.textContent = 'Number copied to clipboard.';
  } catch {
    status.textContent = 'Copy failed. Number: +91 8123465902';
  }
  setTimeout(() => (status.textContent = ''), 3500);
});

document.getElementById('yr').textContent = new Date().getFullYear();
