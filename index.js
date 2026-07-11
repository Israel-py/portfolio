
const hamburger = document.getElementById('hamburger');
const sidebar = document.getElementById('sidebar');
const overlay = document.getElementById('overlay');

function closeMenu(){
  sidebar.classList.remove('open');
  hamburger.classList.remove('open');
  overlay.classList.remove('show');
}
function openMenu(){
  sidebar.classList.add('open');
  hamburger.classList.add('open');
  overlay.classList.add('show');
}
hamburger.addEventListener('click', () => {
  sidebar.classList.contains('open') ? closeMenu() : openMenu();
});
overlay.addEventListener('click', closeMenu);

document.querySelectorAll('.nav-link').forEach(link => {
  link.addEventListener('click', closeMenu);
});


const sections = document.querySelectorAll('.section');
const navLinks = document.querySelectorAll('.nav-link');

const sectionObserver = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting){
      const id = entry.target.getAttribute('id');
      navLinks.forEach(link => {
        link.classList.toggle('active', link.dataset.section === id);
      });
    }
  });
}, { threshold: 0.4 });

sections.forEach(section => sectionObserver.observe(section));


const typedEl = document.getElementById('typed');
const phrases = [
  'Frontend Developer',
  'Python Enthusiast',
  'Java Learner',
  'Problem Solver'
];
let phraseIndex = 0, charIndex = 0, deleting = false;

function typeLoop(){
  const current = phrases[phraseIndex];
  if (!deleting){
    charIndex++;
    typedEl.textContent = current.slice(0, charIndex);
    if (charIndex === current.length){
      deleting = true;
      setTimeout(typeLoop, 1400);
      return;
    }
  } else {
    charIndex--;
    typedEl.textContent = current.slice(0, charIndex);
    if (charIndex === 0){
      deleting = false;
      phraseIndex = (phraseIndex + 1) % phrases.length;
    }
  }
  setTimeout(typeLoop, deleting ? 45 : 90);
}
typeLoop();


const skillEls = document.querySelectorAll('.skill');
const skillObserver = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting){
      const fill = entry.target.querySelector('.bar-fill');
      const percent = entry.target.dataset.percent;
      fill.style.width = percent + '%';
      skillObserver.unobserve(entry.target);
    }
  });
}, { threshold: 0.4 });
skillEls.forEach(skill => skillObserver.observe(skill));


const revealTargets = document.querySelectorAll(
  '.service-card, .timeline-item, .resume-block, .about-grid, .contact-info, .contact-form'
);
revealTargets.forEach(el => el.classList.add('reveal'));

const revealObserver = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting){
      entry.target.classList.add('in');
      revealObserver.unobserve(entry.target);
    }
  });
}, { threshold: 0.15 });
revealTargets.forEach(el => revealObserver.observe(el));


const backToTop = document.getElementById('backToTop');
window.addEventListener('scroll', () => {
  backToTop.classList.toggle('show', window.scrollY > 500);
});
backToTop.addEventListener('click', () => {
  window.scrollTo({ top: 0, behavior: 'smooth' });
});


const lightbox = document.getElementById('lightbox');
const lightboxImg = document.getElementById('lightboxImg');
const lightboxTitle = document.getElementById('lightboxTitle');
const lightboxIssuer = document.getElementById('lightboxIssuer');
const lightboxCount = document.getElementById('lightboxCount');
const lightboxClose = document.getElementById('lightboxClose');
const lightboxPrev = document.getElementById('lightboxPrev');
const lightboxNext = document.getElementById('lightboxNext');

let currentImages = [];
let currentIndex = 0;
let currentTitle = '';
let currentIssuer = '';

function renderLightbox(){
  lightboxImg.src = currentImages[currentIndex];
  lightboxTitle.textContent = currentTitle;
  lightboxIssuer.textContent = currentIssuer;
  const multi = currentImages.length > 1;
  lightboxCount.textContent = multi ? `Image ${currentIndex + 1} of ${currentImages.length}` : '';
  lightboxPrev.hidden = !multi;
  lightboxNext.hidden = !multi;
}

function openCertCard(card){
  currentImages = JSON.parse(card.dataset.images);
  currentTitle = card.dataset.title;
  currentIssuer = card.dataset.issuer;
  currentIndex = 0;
  renderLightbox();
  lightbox.classList.add('show');
}

document.addEventListener('click', (e) => {
  const card = e.target.closest('.cert-card');
  if (!card) return;
  openCertCard(card);
});

document.addEventListener('keydown', (e) => {
  if (e.key !== 'Enter' && e.key !== ' ') return;
  const card = e.target.closest && e.target.closest('.cert-card');
  if (!card) return;
  e.preventDefault();
  openCertCard(card);
});

function closeLightbox(){ lightbox.classList.remove('show'); }
lightboxClose.addEventListener('click', closeLightbox);
lightbox.addEventListener('click', (e) => { if (e.target === lightbox) closeLightbox(); });

lightboxPrev.addEventListener('click', () => {
  currentIndex = (currentIndex - 1 + currentImages.length) % currentImages.length;
  renderLightbox();
});
lightboxNext.addEventListener('click', () => {
  currentIndex = (currentIndex + 1) % currentImages.length;
  renderLightbox();
});

document.addEventListener('keydown', (e) => {
  if (!lightbox.classList.contains('show')) return;
  if (e.key === 'Escape') closeLightbox();
  if (e.key === 'ArrowLeft') lightboxPrev.click();
  if (e.key === 'ArrowRight') lightboxNext.click();
});


const form = document.getElementById('contactForm');
const formSuccess = document.getElementById('formSuccess');

function validateField(field, isValid){
  field.closest('.field').classList.toggle('invalid', !isValid);
}

form.addEventListener('submit', (e) => {
  e.preventDefault();
  formSuccess.classList.remove('show');

  const name = document.getElementById('cf-name');
  const email = document.getElementById('cf-email');
  const subject = document.getElementById('cf-subject');
  const message = document.getElementById('cf-message');

  const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

  let valid = true;

  if (name.value.trim() === ''){ validateField(name, false); valid = false; }
  else validateField(name, true);

  if (!emailPattern.test(email.value.trim())){ validateField(email, false); valid = false; }
  else validateField(email, true);

  if (subject.value.trim() === ''){ validateField(subject, false); valid = false; }
  else validateField(subject, true);

  if (message.value.trim() === ''){ validateField(message, false); valid = false; }
  else validateField(message, true);

  if (valid){
   fetch("https://portfolio-contact-backend-m5md.onrender.com", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        name: name.value.trim(),
        email: email.value.trim(),
        subject: subject.value.trim(),
        message: message.value.trim()
      })
    })
    .then(res => res.json())
    .then(data => {
      if (data.success){
        formSuccess.classList.add('show');
        form.reset();
      } else {
        alert(data.message || "Something went wrong. Please try again.");
      }
    })
    .catch(() => {
      alert("Could not send message. Please check your connection and try again.");
    });
}
});