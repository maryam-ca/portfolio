// ===== CURSOR + PAGE TRANSITIONS =====

// --- Page Load ---
window.addEventListener('DOMContentLoaded', () => {
  document.body.classList.add('page-loading');
  const loader = document.createElement('div');
  loader.className = 'page-loader';
  loader.innerHTML = `<div class="loader-inner"><div class="loader-ring"></div><div class="loader-ring"></div><div class="loader-ring"></div><div class="loader-text">Maryam Fatima</div><div class="loader-sub">AI/ML Engineer</div></div>`;
  document.body.prepend(loader);
  window.addEventListener('load', () => {
    setTimeout(() => { loader.classList.add('loaded'); document.body.classList.remove('page-loading'); document.body.classList.add('page-visible'); setTimeout(() => loader.remove(), 600); }, 500);
  });
});

// --- Page Transitions ---
document.querySelectorAll('a[href]').forEach(link => {
  const href = link.getAttribute('href');
  if (!href || href.startsWith('#') || href.startsWith('mailto:') || href.startsWith('http') || href === window.location.pathname.split('/').pop()) return;
  link.addEventListener('click', function(e) { e.preventDefault(); document.body.classList.add('page-leaving'); setTimeout(() => { window.location.href = this.href; }, 350); });
});

// --- Cursor ---
const curWrap = document.getElementById('curWrap');
const curCore = document.getElementById('curCore');
const curHalo = document.getElementById('curHalo');
const curRing2 = document.getElementById('curRing2');
const curLabel = document.getElementById('curLabel');
const trailDots = Array.from(document.querySelectorAll('#curTrail span'));
const trailPos = trailDots.map(() => ({x:0, y:0}));
let mx=0, my=0, cx=0, cy=0;

document.addEventListener('mousemove', e => {
  mx = e.clientX; my = e.clientY;
  curLabel.style.left = mx+'px'; curLabel.style.top = (my-42)+'px';
});

(function raf() {
  cx += (mx - cx) * 0.14;
  cy += (my - cy) * 0.14;
  curWrap.style.transform = `translate(${cx}px, ${cy}px)`;
  
  let px = cx, py = cy;
  trailDots.forEach((dot, i) => {
    const p = trailPos[i];
    const speed = (i + 1) * 0.12;
    p.x += (px - p.x) * speed;
    p.y += (py - p.y) * speed;
    dot.style.transform = `translate(${p.x}px, ${p.y}px)`;
    dot.style.opacity = (1 - (i+1)/trailDots.length) * 0.6;
    const scale = 1 - (i * 0.15);
    dot.style.transform = `translate(${p.x}px, ${p.y}px) scale(${scale})`;
    px = p.x; py = p.y;
  });
  requestAnimationFrame(raf);
})();

document.addEventListener('mousedown', () => curCore.classList.add('cursor-press'));
document.addEventListener('mouseup', () => curCore.classList.remove('cursor-press'));

document.body.style.cursor = 'none';
document.querySelectorAll('a, button, input, textarea, [data-cursor]').forEach(el => el.style.cursor = 'none');

// --- Hover & Magnetic ---
function refreshCursorTargets() {
  document.querySelectorAll('[data-cursor]').forEach(el => {
    if (el.dataset.curBound) return; el.dataset.curBound = '1';
    el.addEventListener('mouseenter', () => { const t = el.getAttribute('data-cursor'); if (t) { curLabel.textContent = t; curLabel.classList.add('show'); } });
    el.addEventListener('mouseleave', () => curLabel.classList.remove('show'));
  });

  document.querySelectorAll('a, .det-card, .cert-card, .chip').forEach(el => {
    if (el.classList.contains('magnetic') || el.dataset.curBound) return; el.dataset.curBound = '1';
    el.addEventListener('mouseenter', () => curCore.classList.add('hover'));
    el.addEventListener('mouseleave', () => curCore.classList.remove('hover'));
  });

  document.querySelectorAll('.magnetic').forEach(el => {
    if (el.dataset.magBound) return; el.dataset.magBound = '1';
    const s = parseFloat(el.dataset.magnetStrength || '0.35');
    el.addEventListener('mouseenter', () => document.body.classList.add('magnet-active'));
    el.addEventListener('mousemove', e => {
      const r = el.getBoundingClientRect();
      const rx = e.clientX - (r.left + r.width/2);
      const ry = e.clientY - (r.top + r.height/2);
      el.style.transform = `translate(${rx*s}px, ${ry*s}px)`;
      curRing2.style.width = (r.width+22)+'px'; curRing2.style.height = (r.height+22)+'px';
      curRing2.style.left = (r.left+r.width/2)+'px'; curRing2.style.top = (r.top+r.height/2)+'px';
      curRing2.style.borderRadius = getComputedStyle(el).borderRadius !== '0px' ? '16px' : '4px';
    });
    el.addEventListener('mouseleave', () => { el.style.transform = 'translate(0,0)'; document.body.classList.remove('magnet-active'); });
  });
}
refreshCursorTargets();

// --- Mobile Menu ---
const menuToggle = document.getElementById('menuToggle');
const navLinksContainer = document.getElementById('navLinks');
if (menuToggle) menuToggle.addEventListener('click', () => navLinksContainer.classList.toggle('open'));

// --- Skill Bars ---
document.querySelectorAll('.bar-fill').forEach(bar => { if (bar.dataset.w) bar.style.width = bar.dataset.w + '%'; });

// --- Scroll Reveal ---
const observer = new IntersectionObserver(entries => {
  entries.forEach(entry => { if (entry.isIntersecting) entry.target.classList.add('in-view'); });
}, { threshold: 0.1, rootMargin: '0px 0px -40px 0px' });
document.querySelectorAll('.det-card, .cert-card, .log-entry, .spec-block, .chip').forEach(el => { el.classList.add('scroll-reveal'); observer.observe(el); });
