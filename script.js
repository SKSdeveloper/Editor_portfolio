/* ============================================================
   ABHISHEK YADAV VIDEO EDITING SERVICES — script.js
   ============================================================ */

'use strict';

/* ===== CUSTOM CURSOR ===== */
(function initCursor() {
  const dot  = document.getElementById('cursorDot');
  const ring = document.getElementById('cursorRing');
  if (!dot || !ring) return;

  let ringX = 0, ringY = 0, dotX = 0, dotY = 0;
  let rafId;

  document.addEventListener('mousemove', (e) => {
    dotX = e.clientX; dotY = e.clientY;
  });

  function animateRing() {
    ringX += (dotX - ringX) * 0.12;
    ringY += (dotY - ringY) * 0.12;
    dot.style.left  = dotX + 'px';
    dot.style.top   = dotY + 'px';
    ring.style.left = ringX + 'px';
    ring.style.top  = ringY + 'px';
    rafId = requestAnimationFrame(animateRing);
  }
  animateRing();

  // Expand ring on interactive elements
  document.querySelectorAll('a, button, .service-card, .pricing-card, .portfolio-item').forEach(el => {
    el.addEventListener('mouseenter', () => {
      ring.style.width  = '54px';
      ring.style.height = '54px';
      ring.style.opacity = '1';
    });
    el.addEventListener('mouseleave', () => {
      ring.style.width  = '32px';
      ring.style.height = '32px';
      ring.style.opacity = '0.6';
    });
  });

  // Hide on leave
  document.addEventListener('mouseleave', () => { dot.style.opacity = '0'; ring.style.opacity = '0'; });
  document.addEventListener('mouseenter', () => { dot.style.opacity = '1'; ring.style.opacity = '0.6'; });
})();


/* ===== NAVBAR — scroll state & active link ===== */
(function initNavbar() {
  const navbar   = document.getElementById('navbar');
  const hamburger= document.getElementById('hamburger');
  const navLinks = document.getElementById('navLinks');
  const links    = navLinks ? navLinks.querySelectorAll('.nav-link') : [];

  // Scroll class
  window.addEventListener('scroll', () => {
    if (window.scrollY > 40) {
      navbar.classList.add('scrolled');
    } else {
      navbar.classList.remove('scrolled');
    }
    updateActiveLink();
  }, { passive: true });

  // Mobile menu
  if (hamburger && navLinks) {
    hamburger.addEventListener('click', () => {
      const open = navLinks.classList.toggle('open');
      hamburger.classList.toggle('open', open);
      hamburger.setAttribute('aria-expanded', open);
    });

    // Close on link click
    links.forEach(link => {
      link.addEventListener('click', () => {
        navLinks.classList.remove('open');
        hamburger.classList.remove('open');
        hamburger.setAttribute('aria-expanded', 'false');
      });
    });

    // Close on outside click
    document.addEventListener('click', (e) => {
      if (!navbar.contains(e.target)) {
        navLinks.classList.remove('open');
        hamburger.classList.remove('open');
        hamburger.setAttribute('aria-expanded', 'false');
      }
    });
  }

  // Active section highlighting
  function updateActiveLink() {
    const sections = document.querySelectorAll('section[id]');
    let current = '';
    sections.forEach(sec => {
      if (window.scrollY >= sec.offsetTop - 100) {
        current = sec.getAttribute('id');
      }
    });
    links.forEach(link => {
      link.classList.toggle('active', link.getAttribute('href') === `#${current}`);
    });
  }
  updateActiveLink();
})();


/* ===== BACK TO TOP ===== */
(function initBackToTop() {
  const btn = document.getElementById('backToTop');
  if (!btn) return;

  window.addEventListener('scroll', () => {
    btn.classList.toggle('visible', window.scrollY > 400);
  }, { passive: true });

  btn.addEventListener('click', () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  });
})();


/* ===== SCROLL REVEAL — data-animate ===== */
(function initScrollReveal() {
  const targets = document.querySelectorAll('[data-animate]');
  if (!targets.length) return;

  // Apply delay from data attribute
  targets.forEach(el => {
    const delay = el.getAttribute('data-delay');
    if (delay) el.style.transitionDelay = `${delay}ms`;
  });

  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('in-view');
        observer.unobserve(entry.target);
      }
    });
  }, { threshold: 0.1, rootMargin: '0px 0px -50px 0px' });

  targets.forEach(el => observer.observe(el));
})();


/* ===== COUNTER ANIMATION ===== */
(function initCounters() {
  const counters = document.querySelectorAll('[data-count]');
  if (!counters.length) return;

  function animateCounter(el) {
    const target = parseInt(el.getAttribute('data-count'), 10);
    const duration = 1800;
    const step = 16;
    const steps = duration / step;
    let current = 0;
    const increment = target / steps;

    const timer = setInterval(() => {
      current += increment;
      if (current >= target) {
        el.textContent = target;
        clearInterval(timer);
      } else {
        el.textContent = Math.floor(current);
      }
    }, step);
  }

  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        animateCounter(entry.target);
        observer.unobserve(entry.target);
      }
    });
  }, { threshold: 0.5 });

  counters.forEach(c => observer.observe(c));
})();


/* ===== SKILL BARS (triggered by in-view on about section) ===== */
(function initSkillBars() {
  // Triggered by the CSS .in-view .skill-fill selector — no JS needed
  // But we still observe the about visual to add in-view
  const aboutVisual = document.querySelector('.about-visual');
  if (!aboutVisual) return;

  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('in-view');
        observer.unobserve(entry.target);
      }
    });
  }, { threshold: 0.3 });

  observer.observe(aboutVisual);
})();


/* ===== PORTFOLIO FILTER ===== */
(function initPortfolioFilter() {
  const filterBtns = document.querySelectorAll('.filter-btn');
  const items       = document.querySelectorAll('.portfolio-item');
  if (!filterBtns.length || !items.length) return;

  filterBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      // Update active button
      filterBtns.forEach(b => {
        b.classList.remove('active');
        b.setAttribute('aria-selected', 'false');
      });
      btn.classList.add('active');
      btn.setAttribute('aria-selected', 'true');

      const filter = btn.getAttribute('data-filter');

      items.forEach((item, i) => {
        const cat = item.getAttribute('data-category');
        const show = (filter === 'all' || cat === filter);
        if (show) {
          item.classList.remove('hidden');
          item.style.animationDelay = `${i * 50}ms`;
          // Re-trigger fade-up
          item.style.opacity = '0';
          item.style.transform = 'translateY(20px)';
          requestAnimationFrame(() => {
            item.style.transition = 'opacity 0.4s ease, transform 0.4s ease';
            item.style.opacity = '1';
            item.style.transform = 'translateY(0)';
          });
        } else {
          item.classList.add('hidden');
        }
      });
    });
  });
})();


/* ===== HERO TIMELINE ANIMATION ===== */
(function initTimeline() {
  const container = document.getElementById('timelineAnim');
  if (!container) return;

  const colors = ['#00d4ff', '#0088ff', '#00ff88', '#ff4d8f', '#ffc857', '#9966ff'];
  const numRows = 5;

  for (let row = 0; row < numRows; row++) {
    const rowEl = document.createElement('div');
    rowEl.style.cssText = `
      position: absolute;
      bottom: ${row * 16}px;
      left: 0; right: 0; height: 14px;
    `;

    // Track
    const track = document.createElement('div');
    track.style.cssText = `
      position: absolute; bottom: 0; left: 0; right: 0;
      height: 2px; background: rgba(255,255,255,0.04);
      border-radius: 2px;
    `;
    rowEl.appendChild(track);

    // Bars (video clips)
    let offset = (row * 7) % 100;
    for (let b = 0; b < 8; b++) {
      const width  = 5 + Math.random() * 14;
      const gap    = 2 + Math.random() * 5;
      const color  = colors[Math.floor(Math.random() * colors.length)];
      const dur    = (2.5 + Math.random() * 3).toFixed(2);
      const dl     = (Math.random() * -4).toFixed(2);

      if (offset + width > 100) break;

      const bar = document.createElement('div');
      bar.className = 'tl-bar';
      bar.style.cssText = `
        left: ${offset}%; width: ${width}%;
        background: ${color}; opacity: 0.3;
        --dur: ${dur}s; --dl: ${dl}s;
      `;
      rowEl.appendChild(bar);

      // Moving playhead
      if (b === 3) {
        const clip = document.createElement('div');
        clip.className = 'tl-clip';
        clip.style.cssText = `
          height: ${8 + row * 1.5}px;
          background: ${color};
          --dur: ${(5 + row * 2).toFixed(1)}s;
          --dl: ${(-row * 1.5).toFixed(1)}s;
          opacity: 0.5;
        `;
        rowEl.appendChild(clip);
      }

      offset += width + gap;
    }

    container.appendChild(rowEl);
  }
})();


/* ===== SMOOTH SCROLL — internal links ===== */
document.querySelectorAll('a[href^="#"]').forEach(link => {
  link.addEventListener('click', (e) => {
    const targetId = link.getAttribute('href');
    if (targetId === '#') return;
    const target = document.querySelector(targetId);
    if (target) {
      e.preventDefault();
      const navH = parseInt(getComputedStyle(document.documentElement).getPropertyValue('--nav-h'), 10) || 72;
      const top  = target.getBoundingClientRect().top + window.scrollY - navH;
      window.scrollTo({ top, behavior: 'smooth' });
    }
  });
});


/* ===== TOAST HELPER ===== */
function showToast(msg, duration = 3500) {
  const toast   = document.getElementById('toast');
  const toastMsg= document.getElementById('toastMsg');
  if (!toast) return;
  toastMsg.textContent = msg;
  toast.classList.add('show');
  setTimeout(() => toast.classList.remove('show'), duration);
}


/* ===== CONTACT FORM ===== */
(function initContactForm() {
  const form = document.getElementById('contactForm');
  if (!form) return;

  form.addEventListener('submit', (e) => {
    e.preventDefault();
    const name    = form.querySelector('#cName').value.trim();
    const email   = form.querySelector('#cEmail').value.trim();
    const message = form.querySelector('#cMessage').value.trim();

    if (!name || !email || !message) {
      showToast('⚠️ Please fill all required fields.');
      return;
    }
    if (!validateEmail(email)) {
      showToast('⚠️ Please enter a valid email address.');
      return;
    }

    // Build WhatsApp message
    const videoType = form.querySelector('#cVideoType').value || 'Not specified';
    const phone     = form.querySelector('#cPhone').value.trim() || 'Not provided';
    const length    = form.querySelector('#cVideoLength').value.trim() || 'Not specified';

    const text = encodeURIComponent(
      `Hello Abhishek! I want to discuss a project.\n\n` +
      `Name: ${name}\nEmail: ${email}\nPhone: ${phone}\n` +
      `Video Type: ${videoType}\nVideo Length: ${length}\n\nMessage: ${message}`
    );

    showToast('✅ Message sent! Redirecting to WhatsApp…');
    setTimeout(() => {
      window.open(`https://wa.me/919235856584?text=${text}`, '_blank');
      form.reset();
    }, 1500);
  });
})();


/* ===== ORDER FORM ===== */
(function initOrderForm() {
  const form = document.getElementById('orderForm');
  if (!form) return;

  form.addEventListener('submit', (e) => {
    e.preventDefault();
    const videoType = form.querySelector('#orderVideoType').value;
    const duration  = form.querySelector('#orderDuration').value;
    const style     = form.querySelector('#orderStyle').value;
    const link      = form.querySelector('#orderLink').value.trim();
    const notes     = form.querySelector('#orderNotes').value.trim();

    if (!videoType || !duration || !style) {
      showToast('⚠️ Please fill all required fields.');
      return;
    }

    const text = encodeURIComponent(
      `Hi Abhishek! I'd like to place an order.\n\n` +
      `Video Type: ${videoType}\nDuration: ${duration}\n` +
      `Editing Style: ${style}\nUpload Link: ${link || 'Will share separately'}\n` +
      `Notes: ${notes || 'None'}`
    );

    showToast('✅ Order details noted! Redirecting to WhatsApp…');
    setTimeout(() => {
      window.open(`https://wa.me/919235856584?text=${text}`, '_blank');
      form.reset();
    }, 1500);
  });
})();


/* ===== EMAIL VALIDATOR ===== */
function validateEmail(email) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
}


/* ===== SECTION STRIPE BACKGROUND PARTICLES ===== */
(function initParticles() {
  const hero = document.querySelector('.hero-bg');
  if (!hero) return;

  for (let i = 0; i < 20; i++) {
    const dot = document.createElement('div');
    const size = 1 + Math.random() * 2.5;
    const x    = Math.random() * 100;
    const y    = Math.random() * 100;
    const dur  = 5 + Math.random() * 10;
    const dl   = -(Math.random() * dur);

    dot.style.cssText = `
      position: absolute;
      left: ${x}%; top: ${y}%;
      width: ${size}px; height: ${size}px;
      border-radius: 50%;
      background: rgba(0, 212, 255, ${0.3 + Math.random() * 0.5});
      animation: floatDot ${dur}s ${dl}s ease-in-out infinite alternate;
      pointer-events: none;
    `;
    hero.appendChild(dot);
  }

  // Inject keyframe if not present
  if (!document.getElementById('floatDotKF')) {
    const style = document.createElement('style');
    style.id = 'floatDotKF';
    style.textContent = `
      @keyframes floatDot {
        0%   { transform: translateY(0) scale(1); opacity: 0.5; }
        100% { transform: translateY(-18px) scale(1.3); opacity: 1; }
      }
    `;
    document.head.appendChild(style);
  }
})();


/* ===== CARD TILT EFFECT (desktop only) ===== */
(function initTilt() {
  if (window.matchMedia('(pointer: coarse)').matches) return;

  const tiltCards = document.querySelectorAll('.service-card, .pricing-card, .testimonial-card');

  tiltCards.forEach(card => {
    card.addEventListener('mousemove', (e) => {
      const rect    = card.getBoundingClientRect();
      const x       = e.clientX - rect.left;
      const y       = e.clientY - rect.top;
      const cx      = rect.width / 2;
      const cy      = rect.height / 2;
      const tiltX   = ((y - cy) / cy) * 4;
      const tiltY   = ((cx - x) / cx) * 4;
      card.style.transform = `perspective(900px) rotateX(${tiltX}deg) rotateY(${tiltY}deg) translateY(-4px)`;
    });
    card.addEventListener('mouseleave', () => {
      card.style.transform = '';
      card.style.transition = 'transform 0.5s cubic-bezier(0.4,0,0.2,1)';
      setTimeout(() => { card.style.transition = ''; }, 500);
    });
  });
})();


/* ===== GLITCH EFFECT — hero title ===== */
(function initGlitch() {
  const title = document.querySelector('.hero-title');
  if (!title) return;

  const originalText = title.innerHTML;
  let glitchInterval;

  function startGlitch() {
    let count = 0;
    glitchInterval = setInterval(() => {
      if (count % 2 === 0) {
        title.style.textShadow = `2px 0 var(--accent), -2px 0 var(--pink)`;
        title.style.transform  = `skewX(${(Math.random() - 0.5) * 1}deg)`;
      } else {
        title.style.textShadow = '';
        title.style.transform  = '';
      }
      count++;
      if (count > 6) {
        clearInterval(glitchInterval);
        title.style.textShadow = '';
        title.style.transform  = '';
      }
    }, 60);
  }

  // Random glitch every 6-12 seconds
  function scheduleGlitch() {
    const delay = 6000 + Math.random() * 6000;
    setTimeout(() => {
      startGlitch();
      scheduleGlitch();
    }, delay);
  }

  // Start after page load
  setTimeout(scheduleGlitch, 3000);
})();


/* ===== LAZY LOADING / Performance ===== */
if ('loading' in HTMLImageElement.prototype) {
  document.querySelectorAll('img[loading="lazy"]').forEach(img => {
    img.src = img.dataset.src || img.src;
  });
}


/* ===== INIT LOG ===== */
console.log(
  '%c[AY EDITS] Website loaded successfully.',
  'color: #00d4ff; font-weight: bold; font-size: 13px;'
);

function playVideo(id) {
  const modal = document.getElementById('videoModal');
  document.getElementById('videoFrame').src =
    'https://www.youtube-nocookie.com/embed/' + id + '?autoplay=1&rel=0';
  modal.style.display = 'flex';
  document.body.style.overflow = 'hidden';
}
function closeVideo() {
  document.getElementById('videoModal').style.display = 'none';
  document.getElementById('videoFrame').src = '';
  document.body.style.overflow = '';
}
document.getElementById('videoModal').addEventListener('click', function(e) {
  if (e.target === this) closeVideo();
});
