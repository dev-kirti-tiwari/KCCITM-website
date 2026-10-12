// Hero slider (home page only)
const slides = document.querySelectorAll('.slide');
if (slides.length) {
  let current = 0;
  const show = i => {
    slides[current].classList.remove('active');
    current = (i + slides.length) % slides.length;
    slides[current].classList.add('active');
  };
  document.querySelector('.next').onclick = () => show(current + 1);
  document.querySelector('.prev').onclick = () => show(current - 1);
  setInterval(() => show(current + 1), 5000);
}

// Tabs (programs page)
document.querySelectorAll('.tab').forEach(tab => {
  tab.onclick = () => {
    document.querySelectorAll('.tab, .tab-panel').forEach(el => el.classList.remove('active'));
    tab.classList.add('active');
    document.getElementById(tab.dataset.tab).classList.add('active');
  };
});

// Count-up stats
const io = new IntersectionObserver(entries => {
  entries.forEach(e => {
    if (!e.isIntersecting) return;
    const el = e.target, end = parseFloat(el.dataset.count);
    const decimals = el.dataset.count.includes('.') ? 1 : 0;
    const start = performance.now();
    (function tick(now) {
      const p = Math.min((now - start) / 1200, 1);
      el.textContent = (end * p).toFixed(decimals);
      if (p < 1) requestAnimationFrame(tick);
    })(start);
    io.unobserve(el);
  });
}, { threshold: 0.5 });
document.querySelectorAll('[data-count]').forEach(c => io.observe(c));

// Course search/filter (courses page)
const q = document.getElementById('course-search');
if (q) {
  const cat = document.getElementById('course-cat');
  const apply = () => {
    const t = q.value.toLowerCase();
    document.querySelectorAll('.course').forEach(c => {
      const ok = c.textContent.toLowerCase().includes(t) && (!cat.value || c.dataset.cat === cat.value);
      c.style.display = ok ? '' : 'none';
    });
  };
  q.oninput = apply; cat.onchange = apply;
}

// Login (demo – stored only in this browser)
const lf = document.getElementById('login-form');
if (lf) lf.onsubmit = e => {
  e.preventDefault();
  const id = lf.elements.id.value.trim();
  localStorage.setItem('kcc_user', JSON.stringify({ name: id.split('@')[0] || id, id }));
  location.href = 'dashboard.html';
};

// Dashboard guard
const dash = document.getElementById('dash-name');
if (dash) {
  let u = null;
  try { u = JSON.parse(localStorage.getItem('kcc_user')); } catch (e) {}
  if (!u) location.href = 'login.html'; else dash.textContent = u.name;
}

// Contact form (saved locally in the browser)
const cf = document.getElementById('contact-form');
if (cf) cf.onsubmit = e => {
  e.preventDefault();
  let list = [];
  try { list = JSON.parse(localStorage.getItem('kcc_enquiries')) || []; } catch (x) {}
  list.push(Object.fromEntries(new FormData(cf)));
  localStorage.setItem('kcc_enquiries', JSON.stringify(list));
  cf.reset();
  document.getElementById('form-msg').textContent = 'Thank you! Your enquiry has been saved locally (demo).';
};

// Scroll reveal
const rv = new IntersectionObserver(es => es.forEach(e => {
  if (e.isIntersecting) { e.target.classList.add('in'); rv.unobserve(e.target); }
}), { threshold: 0.12 });
document.querySelectorAll('.reveal').forEach(el => rv.observe(el));

// Pinterest-style "save" hearts (remembered in this browser)
let saved = [];
try { saved = JSON.parse(localStorage.getItem('kcc_pins')) || []; } catch (e) {}
document.querySelectorAll('.pin').forEach(pin => {
  const key = pin.querySelector('img').getAttribute('src');
  const h = pin.querySelector('.heart');
  const paint = () => { const on = saved.includes(key); h.classList.toggle('on', on); h.textContent = on ? '♥' : '♡'; };
  paint();
  h.onclick = e => {
    e.stopPropagation();
    saved = saved.includes(key) ? saved.filter(k => k !== key) : [...saved, key];
    try { localStorage.setItem('kcc_pins', JSON.stringify(saved)); } catch (x) {}
    paint();
  };
});

// Lightbox
const lb = document.createElement('div');
lb.className = 'lightbox';
lb.innerHTML = '<img alt="">';
document.body.appendChild(lb);
lb.onclick = () => lb.classList.remove('open');
document.addEventListener('keydown', e => { if (e.key === 'Escape') lb.classList.remove('open'); });
document.querySelectorAll('.pin').forEach(pin => pin.onclick = () => {
  lb.querySelector('img').src = pin.querySelector('img').src;
  lb.classList.add('open');
});

// Hero background video: pause/play toggle
const hv = document.querySelector('.hero-video');
const vt = document.querySelector('.video-toggle');
if (hv && vt) {
  vt.onclick = () => {
    if (hv.paused) { hv.play(); vt.textContent = '❚❚'; vt.setAttribute('aria-label', 'Pause background video'); }
    else { hv.pause(); vt.textContent = '▶'; vt.setAttribute('aria-label', 'Play background video'); }
  };
}

// Admissions countdown (hero)
const cd = document.getElementById('countdown');
if (cd) {
  const end = new Date(cd.dataset.deadline).getTime();
  const pad = n => String(n).padStart(2, '0');
  const tick = () => {
    const left = end - Date.now();
    if (left <= 0) {
      ['d', 'h', 'm', 's'].forEach(k => document.getElementById('cd-' + k).textContent = '00');
      document.getElementById('cd-note').textContent = 'Applications closed – contact admissions: +91 92100 65555';
      return false;
    }
    document.getElementById('cd-d').textContent = pad(Math.floor(left / 864e5));
    document.getElementById('cd-h').textContent = pad(Math.floor(left % 864e5 / 36e5));
    document.getElementById('cd-m').textContent = pad(Math.floor(left % 36e5 / 6e4));
    document.getElementById('cd-s').textContent = pad(Math.floor(left % 6e4 / 1e3));
    return true;
  };
  if (tick()) { const t = setInterval(() => { if (!tick()) clearInterval(t); }, 1000); }
}
