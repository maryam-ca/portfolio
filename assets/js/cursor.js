// ===== CUSTOM CURSOR — ORBIT COMET + MAGNETIC ELEMENTS =====
const curWrap = document.getElementById('curWrap');
const curCore = document.getElementById('curCore');
const curOrbit = document.getElementById('curOrbit');
const curRing2 = document.getElementById('curRing2');
const curLabel = document.getElementById('curLabel');
const trailDots = Array.from(document.querySelectorAll('#curTrail span'));
const trailPos = trailDots.map(()=>({x:0,y:0}));

let mx=0, my=0, cx=0, cy=0, lastX=0, lastY=0;
document.addEventListener('mousemove', e=>{
  mx = e.clientX; my = e.clientY;
  curLabel.style.left = mx+'px'; curLabel.style.top = (my-40)+'px';
});
(function raf(){
  cx += (mx-cx)*0.75; cy += (my-cy)*0.75;
  const vx = mx-lastX, vy = my-lastY;
  lastX = mx; lastY = my;
  const speed = Math.min(Math.hypot(vx,vy)*0.05, 1);
  const angle = Math.atan2(vy,vx)*180/Math.PI;
  curWrap.style.transform = `translate(${cx}px,${cy}px)`;
  curCore.style.transform = `rotate(${angle}deg) scaleX(${1+speed*0.7}) scaleY(${1-speed*0.35})`;

  let px = cx, py = cy;
  trailDots.forEach((dot, i)=>{
    const p = trailPos[i];
    p.x += (px - p.x) * 0.45;
    p.y += (py - p.y) * 0.45;
    dot.style.transform = `translate(${p.x}px,${p.y}px)`;
    dot.style.opacity = (1 - (i+1)/trailDots.length) * 0.55 * Math.min(speed*2.2, 1);
    dot.style.width = dot.style.height = (7 - i*0.9) + 'px';
    dot.style.marginLeft = dot.style.marginTop = -(7 - i*0.9)/2 + 'px';
    px = p.x; py = p.y;
  });
  requestAnimationFrame(raf);
})();
document.addEventListener('mousedown', ()=>curCore.style.filter='brightness(1.4)');
document.addEventListener('mouseup', ()=>curCore.style.filter='');

function refreshCursorTargets(){
  document.querySelectorAll('[data-cursor]').forEach(el=>{
    if(el.dataset.curBound) return; el.dataset.curBound='1';
    el.addEventListener('mouseenter', ()=>{
      const t = el.getAttribute('data-cursor');
      if(t){ curLabel.textContent = t; curLabel.classList.add('show'); }
    });
    el.addEventListener('mouseleave', ()=>{ curLabel.classList.remove('show'); });
  });
  document.querySelectorAll('a, .det-card').forEach(el=>{
    if(el.classList.contains('magnetic') || el.dataset.curBound) return;
    el.dataset.curBound='1';
    el.addEventListener('mouseenter', ()=>{ curCore.classList.add('hover'); curOrbit.classList.add('hover'); });
    el.addEventListener('mouseleave', ()=>{ curCore.classList.remove('hover'); curOrbit.classList.remove('hover'); });
  });

  document.querySelectorAll('.magnetic').forEach(el=>{
    if(el.dataset.magBound) return; el.dataset.magBound='1';
    const strength = parseFloat(el.dataset.magnetStrength || '0.35');
    el.addEventListener('mouseenter', ()=>{
      document.body.classList.add('magnet-active');
    });
    el.addEventListener('mousemove', (e)=>{
      const r = el.getBoundingClientRect();
      const relX = e.clientX - (r.left + r.width/2);
      const relY = e.clientY - (r.top + r.height/2);
      el.style.transform = `translate(${relX*strength}px, ${relY*strength}px)`;
      const ringW = r.width + 22, ringH = r.height + 22;
      curRing2.style.width = ringW+'px'; curRing2.style.height = ringH+'px';
      curRing2.style.left = (r.left + r.width/2) + 'px';
      curRing2.style.top = (r.top + r.height/2) + 'px';
      curRing2.style.borderRadius = getComputedStyle(el).borderRadius !== '0px' ? '16px' : '4px';
    });
    el.addEventListener('mouseleave', ()=>{
      el.style.transform = 'translate(0,0)';
      document.body.classList.remove('magnet-active');
    });
  });
}
refreshCursorTargets();

// Mobile menu toggle
const menuToggle = document.getElementById('menuToggle');
const navLinksContainer = document.getElementById('navLinks');
if(menuToggle){
  menuToggle.addEventListener('click', () => {
    navLinksContainer.classList.toggle('open');
  });
}

// Animate skill bars on skills page
document.querySelectorAll('.bar-fill').forEach(bar=>{
  if(bar.dataset.w) bar.style.width = bar.dataset.w + '%';
});