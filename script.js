/* ============================================================
   Ganesh Mahajan Portfolio — script.js
   ============================================================ */

/* ── Custom Cursor ─────────────────────────────────────────── */
const cursor   = document.getElementById('cursor');
const follower = document.getElementById('cursorFollower');
let mx = 0, my = 0, fx = 0, fy = 0;

document.addEventListener('mousemove', e => {
  mx = e.clientX; my = e.clientY;
  cursor.style.transform = `translate(${mx - 9}px, ${my - 9}px)`;
});

(function animFollower() {
  fx += (mx - fx) * 0.12;
  fy += (my - fy) * 0.12;
  follower.style.transform = `translate(${fx - 18}px, ${fy - 18}px)`;
  requestAnimationFrame(animFollower);
})();

/* ── Particle Network (Canvas) ──────────────────────────────── */
const canvas = document.getElementById('particles');
const ctx    = canvas.getContext('2d');
let W, H, pts = [];

function resizeCanvas() {
  W = canvas.width  = window.innerWidth;
  H = canvas.height = window.innerHeight;
}
resizeCanvas();
window.addEventListener('resize', resizeCanvas);

for (let i = 0; i < 80; i++) {
  pts.push({
    x:  Math.random() * window.innerWidth,
    y:  Math.random() * window.innerHeight,
    vx: (Math.random() - 0.5) * 0.4,
    vy: (Math.random() - 0.5) * 0.4,
    r:  Math.random() * 1.5 + 0.5,
    a:  Math.random() * 0.6 + 0.2
  });
}

function drawParticles() {
  ctx.clearRect(0, 0, W, H);

  pts.forEach(p => {
    p.x += p.vx; p.y += p.vy;
    if (p.x < 0 || p.x > W) p.vx *= -1;
    if (p.y < 0 || p.y > H) p.vy *= -1;
    ctx.beginPath();
    ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2);
    ctx.fillStyle = `rgba(0,245,160,${p.a})`;
    ctx.fill();
  });

  for (let i = 0; i < pts.length; i++) {
    for (let j = i + 1; j < pts.length; j++) {
      const d = Math.hypot(pts[i].x - pts[j].x, pts[i].y - pts[j].y);
      if (d < 120) {
        ctx.beginPath();
        ctx.moveTo(pts[i].x, pts[i].y);
        ctx.lineTo(pts[j].x, pts[j].y);
        ctx.strokeStyle = `rgba(0,217,245,${0.18 * (1 - d / 120)})`;
        ctx.lineWidth = 0.6;
        ctx.stroke();
      }
    }
  }
  requestAnimationFrame(drawParticles);
}
drawParticles();

/* ── Typing Effect ───────────────────────────────────────────── */
const roles  = ['Frontend Devloper.','Full Stack Developer.','Python Devloper'];
let ri = 0, ci = 0, deleting = false;
const typeTarget = document.getElementById('typeTarget');

function type() {
  const word = roles[ri];
  typeTarget.textContent = deleting ? word.slice(0, ci--) : word.slice(0, ci++);
  if (!deleting && ci > word.length) { deleting = true; setTimeout(type, 1600); return; }
  if (deleting && ci < 0)            { deleting = false; ri = (ri + 1) % roles.length; }
  setTimeout(type, deleting ? 55 : 90);
}
type();

/* ── Navbar Scroll ───────────────────────────────────────────── */
window.addEventListener('scroll', () => {
  document.getElementById('navbar').classList.toggle('scrolled', window.scrollY > 50);
  document.getElementById('scrollTop').classList.toggle('visible', window.scrollY > 400);
  highlightNav();
});

/* ── Active Nav Highlight ────────────────────────────────────── */
const allSections = document.querySelectorAll('section[id]');
const navLinks    = document.querySelectorAll('.nav-link');

function highlightNav() {
  let current = '';
  allSections.forEach(s => {
    if (window.scrollY >= s.offsetTop - 130) current = s.id;
  });
  navLinks.forEach(l => {
    l.style.color = l.getAttribute('href') === '#' + current
      ? 'var(--primary)'
      : '';
  });
}

/* ── Scroll Reveal (IntersectionObserver) ────────────────────── */
const revealEls = document.querySelectorAll('.reveal');
const revealIO  = new IntersectionObserver(entries => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      entry.target.classList.add('visible');
      // Animate progress bars inside revealed element
      entry.target.querySelectorAll('.prog-bar').forEach(bar => {
        bar.style.width = bar.dataset.width + '%';
      });
    }
  });
}, { threshold: 0.15 });
revealEls.forEach(el => revealIO.observe(el));

/* ── Contact Form ────────────────────────────────────────────── */
function sendMsg() {
  const name    = document.getElementById('cName').value.trim();
  const email   = document.getElementById('cEmail').value.trim();
  const message = document.getElementById('cMsg').value.trim();
  if (!name || !email || !message) {
    alert('Please fill in all required fields.');
    return;
  }
  const successEl = document.getElementById('successMsg');
  successEl.style.display = 'block';
  ['cName', 'cEmail', 'cSubject', 'cMsg'].forEach(id => {
    document.getElementById(id).value = '';
  });
  setTimeout(() => { successEl.style.display = 'none'; }, 5000);
}

/* ══════════════════════════════════════════════════════════════
   CERTIFICATES — Add / Delete / Preview / Persist
   ══════════════════════════════════════════════════════════════ */

// Default seed certificates
const DEFAULT_CERTS = [
  {
    id: 1,
    title: 'Full Stack Web Development',
    issuer: 'Udemy',
    date: 'January 2024',
    skills: ['React', 'Node JS', 'MongoDB', 'Express'],
    link: '#',
    img: ''
  },
  {
    id: 2,
    title: 'Java & Spring Boot Masterclass',
    issuer: 'Coursera',
    date: 'March 2023',
    skills: ['Java', 'Spring Boot', 'Hibernate', 'MySQL'],
    link: '#',
    img: ''
  },
  {
    id: 3,
    title: 'JavaScript Algorithms & Data Structures',
    issuer: 'freeCodeCamp',
    date: 'June 2023',
    skills: ['JavaScript', 'Algorithms', 'DS'],
    link: '#',
    img: ''
  }
];

// Emoji placeholders for cards without images
const CERT_EMOJIS = ['🏆', '📜', '🎖️', '🥇', '⭐', '🎓', '💡', '🚀'];

let certificates = [];

function loadCertificates() {
  try {
    const stored = localStorage.getItem('gm_certificates');
    certificates = stored ? JSON.parse(stored) : [...DEFAULT_CERTS];
  } catch (e) {
    certificates = [...DEFAULT_CERTS];
  }
}

function saveCertificates() {
  try { localStorage.setItem('gm_certificates', JSON.stringify(certificates)); } catch (e) {}
}

function renderCertificates() {
  const grid = document.getElementById('certGrid');
  if (!grid) return;
  grid.innerHTML = '';

  certificates.forEach((cert, idx) => {
    const emoji   = CERT_EMOJIS[idx % CERT_EMOJIS.length];
    const tagHTML = cert.skills.map(s => `<span class="cert-tag">${s}</span>`).join('');
    const imgHTML = cert.img
      ? `<img src="${cert.img}" alt="${cert.title}" style="width:100%;height:100%;object-fit:cover;">`
      : `<div class="cert-placeholder">${emoji}</div>`;

    const col = document.createElement('div');
    col.className = 'col-md-6 col-lg-4 reveal';
    col.innerHTML = `
      <div class="cert-card h-100">
        <div class="cert-img-wrap">
          ${imgHTML}
          <span class="cert-ribbon">CERTIFIED</span>
        </div>
        <div class="cert-body">
          <div class="cert-issuer">${cert.issuer}</div>
          <div class="cert-title">${cert.title}</div>
          <div class="cert-date"><i class="bi bi-calendar3 me-1"></i>${cert.date}</div>
          <div class="cert-skills">${tagHTML}</div>
          <div class="d-flex align-items-center flex-wrap gap-2">
            ${cert.link && cert.link !== '#'
              ? `<a href="${cert.link}" target="_blank" class="cert-btn view"><i class="bi bi-box-arrow-up-right me-1"></i>View</a>`
              : `<span class="cert-btn" style="opacity:.5;cursor:default;">No Link</span>`}
            <button class="cert-btn" onclick="deleteCert(${cert.id})" style="border-color:rgba(255,80,80,.4);color:#ff8080;">
              <i class="bi bi-trash me-1"></i>Remove
            </button>
          </div>
        </div>
      </div>`;
    grid.appendChild(col);

    // Re-observe new reveal elements
    col.querySelectorAll('.reveal').forEach(el => revealIO.observe(el));
    // Trigger immediately if already visible
    const rect = col.getBoundingClientRect();
    if (rect.top < window.innerHeight) col.classList.add('visible');
  });
}

function deleteCert(id) {
  if (!confirm('Remove this certificate?')) return;
  certificates = certificates.filter(c => c.id !== id);
  saveCertificates();
  renderCertificates();
}

/* Image preview inside modal */
function previewCertImage(input) {
  const thumb = document.getElementById('certImgThumb');
  if (input.files && input.files[0]) {
    const reader = new FileReader();
    reader.onload = e => {
      thumb.src = e.target.result;
      thumb.style.display = 'block';
    };
    reader.readAsDataURL(input.files[0]);
  }
}

/* Read uploaded file as base64 */
function fileToBase64(file) {
  return new Promise(resolve => {
    const reader = new FileReader();
    reader.onload = e => resolve(e.target.result);
    reader.readAsDataURL(file);
  });
}

/* Submit new certificate */
async function submitCert() {
  const title    = document.getElementById('certTitle').value.trim();
  const issuer   = document.getElementById('certIssuer').value.trim();
  const date     = document.getElementById('certDate').value.trim();
  const link     = document.getElementById('certLink').value.trim() || '#';
  const skillsRaw= document.getElementById('certSkills').value.trim();
  const imgFile  = document.getElementById('certImg').files[0];

  if (!title || !issuer || !date) {
    alert('Please fill in Title, Issuer, and Date.'); return;
  }
  const skills = skillsRaw ? skillsRaw.split(',').map(s => s.trim()).filter(Boolean) : [];
  let img = '';
  if (imgFile) img = await fileToBase64(imgFile);

  const newCert = {
    id: Date.now(),
    title, issuer, date, link, skills, img
  };
  certificates.push(newCert);
  saveCertificates();
  renderCertificates();

  // Close modal & reset form
  const modal = bootstrap.Modal.getInstance(document.getElementById('addCertModal'));
  modal.hide();
  document.getElementById('certForm').reset();
  document.getElementById('certImgThumb').style.display = 'none';

  // Scroll to cert section
  document.getElementById('certificates').scrollIntoView({ behavior: 'smooth' });
}

/* Init on DOM ready */
document.addEventListener('DOMContentLoaded', () => {
  loadCertificates();
  renderCertificates();
});
