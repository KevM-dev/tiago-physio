/* ============================================================
   SHARED.JS — runs on every page
   ============================================================ */

// Year
document.querySelectorAll('#year, .year').forEach(el => {
  el.textContent = new Date().getFullYear();
});

// Navbar scroll
const navbar = document.getElementById('navbar');
if (navbar) {
  const onScroll = () => navbar.classList.toggle('scrolled', window.scrollY > 50);
  window.addEventListener('scroll', onScroll, { passive: true });
  onScroll();
}

// Hamburger
const hamburger = document.getElementById('hamburger');
const navLinks  = document.getElementById('navLinks');
if (hamburger && navLinks) {
  hamburger.addEventListener('click', () => {
    const open = navLinks.classList.toggle('open');
    hamburger.classList.toggle('open', open);
    document.body.style.overflow = open ? 'hidden' : '';
  });
  navLinks.querySelectorAll('a').forEach(a => {
    a.addEventListener('click', () => {
      navLinks.classList.remove('open');
      hamburger.classList.remove('open');
      document.body.style.overflow = '';
    });
  });
}

// Reveal on scroll
const revealObserver = new IntersectionObserver((entries) => {
  entries.forEach((entry, i) => {
    if (entry.isIntersecting) {
      setTimeout(() => entry.target.classList.add('visible'), i * 80);
      revealObserver.unobserve(entry.target);
    }
  });
}, { threshold: 0.1 });

document.querySelectorAll('.reveal').forEach(el => revealObserver.observe(el));

// ===== COUNTER ANIMATION (hero card) =====
function animateCounter(el) {
  const target = parseInt(el.dataset.count, 10);
  const duration = 1600;
  const step = Math.max(1, Math.ceil(target / (duration / 16)));
  let current = 0;
  const timer = setInterval(() => {
    current = Math.min(current + step, target);
    el.textContent = current;
    if (current >= target) clearInterval(timer);
  }, 16);
}

const heroCard = document.querySelector('.hero-card');
if (heroCard) {
  const counterObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.querySelectorAll('.hstat-num[data-count]').forEach(animateCounter);
        counterObserver.unobserve(entry.target);
      }
    });
  }, { threshold: 0.3 });
  counterObserver.observe(heroCard);
}

// ===== CONDITION PILLS (home page) =====
const cpills = document.querySelectorAll('.cpill');
if (cpills.length) {
  cpills.forEach(pill => {
    pill.addEventListener('click', () => {
      cpills.forEach(p => p.classList.remove('active'));
      pill.classList.add('active');
      document.querySelectorAll('.cpanel').forEach(p => p.classList.remove('active'));
      const target = document.getElementById('info-' + pill.dataset.info);
      if (target) target.classList.add('active');
    });
  });
}

// ===== TESTIMONIAL SLIDER =====
const slides = document.querySelectorAll('.tslide');
const dotsWrap = document.getElementById('tDots');
if (slides.length && dotsWrap) {
  let current = 0;
  let autoTimer;

  slides.forEach((_, i) => {
    const dot = document.createElement('button');
    dot.className = 'tdot' + (i === 0 ? ' active' : '');
    dot.setAttribute('aria-label', 'Go to slide ' + (i + 1));
    dot.addEventListener('click', () => { goTo(i); resetAuto(); });
    dotsWrap.appendChild(dot);
  });

  function goTo(index) {
    slides[current].classList.remove('active');
    dotsWrap.querySelectorAll('.tdot')[current].classList.remove('active');
    current = (index + slides.length) % slides.length;
    slides[current].classList.add('active');
    dotsWrap.querySelectorAll('.tdot')[current].classList.add('active');
  }

  function resetAuto() {
    clearInterval(autoTimer);
    autoTimer = setInterval(() => goTo(current + 1), 6000);
  }

  document.getElementById('tPrev')?.addEventListener('click', () => { goTo(current - 1); resetAuto(); });
  document.getElementById('tNext')?.addEventListener('click', () => { goTo(current + 1); resetAuto(); });

  resetAuto();
}

// ===== SERVICE TABS (services page) =====
const stabBtns = document.querySelectorAll('.stab-btn');
if (stabBtns.length) {
  stabBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      stabBtns.forEach(b => b.classList.remove('active'));
      btn.classList.add('active');
      document.querySelectorAll('.stab-panel').forEach(p => p.classList.remove('active'));
      const panel = document.getElementById('tab-' + btn.dataset.tab);
      if (panel) {
        panel.classList.add('active');
        panel.querySelectorAll('.reveal').forEach(el => {
          el.classList.remove('visible');
          setTimeout(() => el.classList.add('visible'), 60);
        });
      }
    });
  });
  // Trigger reveal on initial active tab
  document.querySelector('.stab-panel.active')?.querySelectorAll('.reveal').forEach(el => {
    setTimeout(() => el.classList.add('visible'), 300);
  });
}

// ===== FAQ ACCORDION =====
document.querySelectorAll('.faq-q').forEach(btn => {
  btn.addEventListener('click', () => {
    const item = btn.parentElement;
    const isOpen = item.classList.contains('open');
    document.querySelectorAll('.faq-item').forEach(i => i.classList.remove('open'));
    if (!isOpen) item.classList.add('open');
  });
});

// ===== MULTI-STEP BOOKING FORM (contact page) =====
const bookingForm = document.getElementById('bookingForm');
if (bookingForm) {

  const progressBar = document.querySelector('.form-progress');

  function showStep(n) {
    document.querySelectorAll('.form-step').forEach(s => s.classList.remove('active'));
    document.getElementById('step' + n)?.classList.add('active');
    document.querySelectorAll('.fp-step').forEach((s, i) => {
      s.classList.remove('active', 'done');
      if (i + 1 < n) s.classList.add('done');
      if (i + 1 === n) s.classList.add('active');
    });
  }

  function validateEmail(v) { return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v); }

  function setErr(id, msg) {
    const errEl = document.getElementById('err-' + id);
    const input = document.getElementById(id);
    if (errEl) errEl.textContent = msg;
    if (input) input.classList.toggle('error', !!msg);
  }

  document.getElementById('toStep2')?.addEventListener('click', () => {
    let ok = true;
    const fn = document.getElementById('firstName').value.trim();
    const ln = document.getElementById('lastName').value.trim();
    const em = document.getElementById('email').value.trim();
    if (!fn) { setErr('firstName', 'Please enter your first name.'); ok = false; } else setErr('firstName', '');
    if (!ln) { setErr('lastName', 'Please enter your last name.'); ok = false; } else setErr('lastName', '');
    if (!em || !validateEmail(em)) { setErr('email', 'Please enter a valid email address.'); ok = false; } else setErr('email', '');
    if (ok) showStep(2);
  });

  document.getElementById('backStep1')?.addEventListener('click', () => showStep(1));

  document.getElementById('toStep3')?.addEventListener('click', () => {
    let ok = true;
    const svc = document.getElementById('service').value;
    const msg = document.getElementById('message').value.trim();
    if (!svc) { setErr('service', 'Please select a service.'); ok = false; } else setErr('service', '');
    if (!msg) { setErr('message', 'Please describe your issue.'); ok = false; } else setErr('message', '');
    if (ok) showStep(3);
  });

  document.getElementById('backStep2')?.addEventListener('click', () => showStep(2));

  bookingForm.addEventListener('submit', (e) => {
    e.preventDefault();
    if (!document.getElementById('consent').checked) {
      setErr('consent', 'Please tick the consent box to continue.');
      return;
    }
    setErr('consent', '');

    const btn = document.getElementById('submitBtn');
    btn.disabled = true;
    document.querySelector('.submit-text').style.display = 'none';
    document.querySelector('.submit-spinner').style.display = 'inline';

    setTimeout(() => {
      bookingForm.style.display = 'none';
      if (progressBar) progressBar.style.display = 'none';
      const success = document.getElementById('formSuccess');
      success.style.display = 'block';
      const details = document.getElementById('successDetails');
      if (details) {
        const name = document.getElementById('firstName').value + ' ' + document.getElementById('lastName').value;
        const svc  = document.getElementById('service').value;
        details.innerHTML = '<p><strong>Name:</strong> ' + name + '</p><p><strong>Service:</strong> ' + (svc || 'Not specified') + '</p>';
      }
    }, 1200);
  });

  // Body area pills
  document.querySelectorAll('.bpill').forEach(pill => {
    pill.addEventListener('click', () => {
      document.querySelectorAll('.bpill').forEach(p => p.classList.remove('active'));
      pill.classList.add('active');
      const hidden = document.getElementById('bodyArea');
      if (hidden) hidden.value = pill.dataset.area;
    });
  });

  // Day pills (multi-select)
  document.querySelectorAll('.dpill').forEach(pill => {
    pill.addEventListener('click', () => pill.classList.toggle('active'));
  });

  // Pain slider
  const slider   = document.getElementById('painScale');
  const painVal  = document.getElementById('painVal');
  const painDesc = document.getElementById('painDesc');
  const descs = ['No pain', 'Very mild', 'Mild', 'Mild–moderate', 'Moderate', 'Moderate', 'Moderate–severe', 'Severe', 'Very severe', 'Severe pain', 'Maximum pain'];
  if (slider) {
    slider.addEventListener('input', () => {
      const v = parseInt(slider.value, 10);
      if (painVal)  painVal.textContent  = v;
      if (painDesc) painDesc.textContent = descs[v] || '';
    });
  }
}
