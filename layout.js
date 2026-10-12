// Shared header/footer injected on every page (works from file:// without a server)
(function () {
  const pages = [
    ['index.html', 'Home'],
    ['about.html', 'About'],
    ['academics.html', 'Academics'],
    ['programs.html', 'Programs'],
    ['admissions.html', 'Admissions'],
    ['placements.html', 'Placements'],
    ['life.html', 'Life@KCC'],
    ['contact.html', 'Contact']
  ];
  const more = [
    ['scholarship.html', 'Scholarship'],
    ['courses.html', 'Courses'],
    ['announcements.html', 'Announcements']
  ];
  const here = location.pathname.split('/').pop() || 'index.html';
  let user = null;
  try { user = JSON.parse(localStorage.getItem('kcc_user')); } catch (e) {}

  const header = `
<div class="topbar"><div class="container topbar-inner">
  <div><a href="tel:+919210065555">📞 Call us: +91 92100 65555</a>
  <a href="tel:+919217030230">💬 WhatsApp: +91 92170 30230</a></div>
  ${user
    ? `<span>Hi, ${user.name} · <a href="dashboard.html">Dashboard</a> · <a href="#" id="logout">Log out</a></span>`
    : `<a href="login.html" class="login">Log in</a>`}
</div></div>
<header class="navbar"><div class="container nav-inner">
  <a href="index.html" class="brand"><img src="images/kcc-logo.png" alt="KCC Institutes, Greater Noida"></a>
  <button class="menu-btn" aria-label="Toggle menu" aria-expanded="false">☰</button>
  <nav id="nav">${pages.map(([h, t]) => `<a href="${h}"${h === here ? ' class="active"' : ''}>${t}</a>`).join('')}<div class="more"><button type="button" class="more-btn">More ▾</button><div class="more-menu">${more.map(([h, t]) => `<a href="${h}"${h === here ? ' class="active"' : ''}>${t}</a>`).join('')}</div></div></nav>
</div></header>`;

  const footer = `
<footer><div class="container foot-grid">
  <div><h4>KCC ITM</h4><p>2B-2C, Knowledge Park-III, Greater Noida, Uttar Pradesh 201310</p></div>
  <div><h4>KCC ILHE</h4><p>KCC Institute of Legal and Higher Education, Knowledge Park III, Greater Noida</p></div>
  <div><h4>Delhi Admission Office</h4><p>M-78, Connaught Place, New Delhi 110001</p>
    <p><a href="tel:+919210065555">+91 92100 65555</a><br><a href="mailto:admissions@kccitm.edu.in">admissions@kccitm.edu.in</a></p></div>
  <div><h4>Quick links</h4><p><a href="admissions.html">Admissions</a> · <a href="programs.html">Programs</a> · <a href="courses.html">Courses</a> · <a href="contact.html">Contact</a></p>
    <p><a href="https://www.facebook.com/KCCinstitutes">Facebook</a> · <a href="https://x.com/KCCinstitutes">X</a> · <a href="https://www.instagram.com/kccinstitutes">Instagram</a></p></div>
</div>
<div class="copy">Maintained by KCC Institute of Technology and Management · <a href="https://www.kccitm.edu.in/">kccitm.edu.in</a></div></footer>
<a href="#" class="to-top" aria-label="Back to top">↑</a>`;

  const h = document.getElementById('site-header');
  const f = document.getElementById('site-footer');
  if (h) h.innerHTML = header;
  if (f) f.innerHTML = footer;

  // Global looping video background for every inner-page header
  document.querySelectorAll('.page-head').forEach(ph => {
    if (ph.querySelector('.page-head-video')) return;
    const v = document.createElement('video');
    v.className = 'page-head-video';
    v.autoplay = v.muted = v.loop = v.playsInline = true;
    v.setAttribute('muted', ''); v.setAttribute('aria-hidden', 'true');
    v.preload = 'metadata'; v.poster = 'images/campus/academic_block_img2.jpg';
    v.innerHTML = '<source src="video/kcc-header.mp4" type="video/mp4">';
    ph.prepend(v);
    v.play().catch(() => {});
  });

  const btn = document.querySelector('.menu-btn'), nav = document.getElementById('nav');
  if (btn && nav) {
    btn.onclick = () => btn.setAttribute('aria-expanded', nav.classList.toggle('open'));
  }
  const lo = document.getElementById('logout');
  if (lo) lo.onclick = e => { e.preventDefault(); localStorage.removeItem('kcc_user'); location.href = 'index.html'; };
})();
