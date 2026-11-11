/**
 * GRID STROKE STUDIO (gridstroke.studio) - Core Interactive & Motion Engine
 * Fluid Scroll Reveals, Mouse Parallax, Brand Rail & Cinema Lightbox
 * Inspired by Agrumea Farm, Cerebrium.ai & Trevor Noah
 */

document.addEventListener('DOMContentLoaded', () => {
  initSiteLoadSequence();
  initHeroBrandCanvas();
  initScrollRevealEngine();
  initMouseParallax();
  initStickyProgressIndicator();
  initPhotoshopClientTabs();
  initHoverVideoPreviews();
  initVideoLightbox();
  initFaqAccordion();
  initContactForm();
});

/* ==========================================================================
   00. SITE LOAD INTRO SEQUENCE (3 Product Cards -> Fullscreen Hero)
   ========================================================================== */
function initSiteLoadSequence() {
  const stage = document.getElementById('site-loader-stage');
  const card1 = document.getElementById('loader-card-1');
  const card2 = document.getElementById('loader-card-2');
  const card3 = document.getElementById('loader-card-3');
  const skipBtn = document.getElementById('loader-skip-btn');
  const replayBtn = document.getElementById('replay-intro-btn');
  const heroSection = document.getElementById('hero');

  if (!stage || !card1 || !card2 || !card3) return;

  let isComplete = false;

  function runSequence() {
    isComplete = false;
    stage.classList.remove('is-done');
    card1.style.display = 'block';
    card2.style.display = 'block';
    card1.classList.remove('is-entered');
    card2.classList.remove('is-entered');
    card3.classList.remove('is-entered', 'is-expanded');
    if (heroSection) heroSection.classList.remove('hero-content-ready');

    // Step 1: Card 1 (Meura) rises from page bottom to center
    setTimeout(() => {
      if (isComplete) return;
      card1.classList.add('is-entered');
    }, 250);

    // Step 2: Card 2 (Avi) rises from page bottom and overlaps Card 1
    setTimeout(() => {
      if (isComplete) return;
      card2.classList.add('is-entered');
    }, 1000);

    // Step 3: Card 3 (Grid Stroke Card) rises from page bottom and overlaps both
    setTimeout(() => {
      if (isComplete) return;
      card3.classList.add('is-entered');
    }, 1750);

    // Step 4: Card 3 expands into full hero background with current color
    setTimeout(() => {
      if (isComplete) return;
      card3.classList.add('is-expanded');
    }, 2550);

    // Step 5: Reveal Hero Section with logo on left and Brog layout
    setTimeout(() => {
      if (isComplete) return;
      stage.classList.add('is-done');
      if (heroSection) heroSection.classList.add('hero-content-ready');
      isComplete = true;
    }, 3250);
  }

  function finishInstantly() {
    isComplete = true;
    stage.classList.add('is-done');
    if (heroSection) heroSection.classList.add('hero-content-ready');
  }

  if (skipBtn) skipBtn.addEventListener('click', finishInstantly);
  if (replayBtn) {
    replayBtn.addEventListener('click', () => {
      window.scrollTo({ top: 0, behavior: 'smooth' });
      runSequence();
    });
  }

  runSequence();
}

/* ==========================================================================
   0. HERO BRAND LOGO CANVAS ENGINE (Pure Video Reveal Over Deep Aubergine)
   ========================================================================== */
function initHeroBrandCanvas() {
  const video = document.getElementById('hero-brand-video');
  const canvas = document.getElementById('hero-brand-canvas');
  const fallback = document.getElementById('hero-fallback-video');

  if (!canvas || !video) return;

  const ctx = canvas.getContext('2d', { willReadFrequently: true });
  let isRunning = true;

  function renderFrame() {
    if (!isRunning) return;

    if (video.readyState >= 2) {
      ctx.drawImage(video, 0, 0, 1072, 242);
      const imgData = ctx.getImageData(0, 0, 1072, 242);
      const d = imgData.data;

      // Unmultiply white background to ensure 100% pure transparent rendering
      for (let i = 0; i < d.length; i += 4) {
        const r = d[i], g = d[i + 1], b = d[i + 2];
        const maxDiff = Math.max(255 - r, 255 - g, 255 - b);
        const alpha = Math.min(255, maxDiff * 1.35);

        if (alpha < 6) {
          d[i + 3] = 0;
        } else {
          const aNorm = alpha / 255;
          d[i] = Math.min(255, Math.max(0, (r - 255 * (1 - aNorm)) / aNorm));
          d[i + 1] = Math.min(255, Math.max(0, (g - 255 * (1 - aNorm)) / aNorm));
          d[i + 2] = Math.min(255, Math.max(0, (b - 255 * (1 - aNorm)) / aNorm));
          d[i + 3] = alpha;
        }
      }
      ctx.putImageData(imgData, 0, 0);
    }
    requestAnimationFrame(renderFrame);
  }

  video.play().then(() => {
    requestAnimationFrame(renderFrame);
  }).catch(() => {
    // If browser blocks autoplay, activate fallback video
    if (fallback) fallback.style.opacity = '1';
    window.addEventListener('click', () => {
      video.play().then(() => {
        if (fallback) fallback.style.opacity = '0';
        requestAnimationFrame(renderFrame);
      });
    }, { once: true });
  });
}

/* ==========================================================================
   1. FLUID SCROLL REVEAL ENGINE (Agrumea Farm / Studio Naam Style)
   ========================================================================== */
function initScrollRevealEngine() {
  const revealElements = document.querySelectorAll('.reveal-init');

  if (!revealElements.length) return;

  const revealObserver = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        entry.target.classList.add('reveal-active');
        // Once revealed, keep active
        revealObserver.unobserve(entry.target);
      }
    });
  }, {
    rootMargin: '0px 0px -80px 0px',
    threshold: 0.12
  });

  revealElements.forEach((el) => revealObserver.observe(el));
}

/* ==========================================================================
   2. MOUSE PARALLAX ON STUDIO BRAND PLATE & TOOL PILLS
   ========================================================================== */
function initMouseParallax() {
  const hero = document.getElementById('hero');
  const brandPlate = document.querySelector('.studio-brand-plate');
  const toolPills = document.querySelectorAll('.hero-tool-pill');

  if (!hero) return;

  // Only apply on non-touch desktop devices
  if (window.matchMedia('(pointer: coarse)').matches) return;

  hero.addEventListener('mousemove', (e) => {
    const rect = hero.getBoundingClientRect();
    const x = (e.clientX - rect.left) / rect.width - 0.5;
    const y = (e.clientY - rect.top) / rect.height - 0.5;

    if (brandPlate) {
      brandPlate.style.transform = `perspective(800px) rotateY(${x * 8}deg) rotateX(${-y * 8}deg) translateY(-3px)`;
    }

    toolPills.forEach((pill, idx) => {
      const depth = (idx % 2 === 0 ? 1 : -1) * 5;
      pill.style.transform = `translateY(${y * depth}px)`;
    });
  });

  hero.addEventListener('mouseleave', () => {
    if (brandPlate) {
      brandPlate.style.transform = 'perspective(800px) rotateY(0deg) rotateX(0deg)';
    }
    toolPills.forEach((pill) => {
      pill.style.transform = 'translateY(0px)';
    });
  });
}

/* ==========================================================================
   3. STICKY PROGRESS INDICATOR & SECTION TRACKING
   ========================================================================== */
function initStickyProgressIndicator() {
  const sections = document.querySelectorAll('section[id]');
  const sectionPill = document.getElementById('active-section-indicator');
  const progressBar = document.getElementById('scroll-progress-bar');

  if (!sections.length) return;

  const sectionLabels = {
    'hero': '00 // STUDIO LAUNCH',
    'about': '00 // ABOUT STUDIO',
    'branding': '01 // BRANDING &bull; MEURA',
    'ecommerce': '02 // E-COMMERCE &bull; SUN DRUNK',
    'process': '03 // OUR WORKFLOW',
    'social-mgmt': '04 // SOCIAL PACKAGES',
    'three-d': '05 // 3D CGI &bull; KLICKPIN',
    'invitations': '06 // CEREMONIAL ATELIER',
    'motion': '07 // MOTION GRAPHICS',
    'lets-create': '08 // LET\'S CREATE'
  };

  const observer = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        const id = entry.target.getAttribute('id');
        if (sectionPill && sectionLabels[id]) {
          sectionPill.innerHTML = sectionLabels[id];
        }
      }
    });
  }, { threshold: 0.25 });

  sections.forEach((sec) => observer.observe(sec));

  // Progress bar on scroll
  window.addEventListener('scroll', () => {
    const totalHeight = document.documentElement.scrollHeight - window.innerHeight;
    if (totalHeight > 0 && progressBar) {
      const progress = (window.scrollY / totalHeight) * 100;
      progressBar.style.width = `${progress}%`;
    }
  }, { passive: true });
}

/* ==========================================================================
   4. CLIENT TABS SWITCHER
   ========================================================================== */
function initPhotoshopClientTabs() {
  const tabs = document.querySelectorAll('.client-tab-btn');
  const cards = document.querySelectorAll('.client-gallery-card');

  if (!tabs.length || !cards.length) return;

  tabs.forEach((tab) => {
    tab.addEventListener('click', (e) => {
      e.preventDefault();
      const client = tab.dataset.client;

      tabs.forEach((t) => {
        t.classList.remove('active', 'bg-[#BEF24D]', 'text-[#19031c]');
        t.classList.add('bg-white/10', 'text-white/70');
      });
      tab.classList.remove('bg-white/10', 'text-white/70');
      tab.classList.add('active', 'bg-[#BEF24D]', 'text-[#19031c]');

      cards.forEach((card) => {
        if (client === 'all' || card.dataset.client === client) {
          card.classList.remove('hidden');
          card.style.display = 'block';
        } else {
          card.classList.add('hidden');
          card.style.display = 'none';
        }
      });
    });
  });
}

/* ==========================================================================
   5. VIDEO HOVER PREVIEWS
   ========================================================================== */
function initHoverVideoPreviews() {
  const hoverVideos = document.querySelectorAll('video[data-hover-preview]');

  hoverVideos.forEach((video) => {
    const parent = video.closest('.video-preview-container') || video;

    parent.addEventListener('mouseenter', () => {
      video.muted = true;
      const playPromise = video.play();
      if (playPromise !== undefined) {
        playPromise.catch(() => {});
      }
    });

    parent.addEventListener('mouseleave', () => {
      video.pause();
      video.currentTime = 0;
    });
  });
}

/* ==========================================================================
   6. VIDEO & IMAGE LIGHTBOX MODAL
   ========================================================================== */
function initVideoLightbox() {
  const modal = document.getElementById('global-media-modal');
  if (!modal) return;

  const modalMediaContainer = modal.querySelector('#modal-media-content');
  const modalTitle = modal.querySelector('#modal-title');
  const modalCaption = modal.querySelector('#modal-caption');
  const closeBtn = modal.querySelector('#modal-close-btn');

  const openModal = (data) => {
    modalMediaContainer.innerHTML = '';

    if (data.type === 'video') {
      const video = document.createElement('video');
      video.src = data.src;
      video.controls = true;
      video.autoplay = true;
      video.playsInline = true;
      video.className = 'w-full max-h-[75vh] rounded-xl object-contain bg-black shadow-2xl';
      modalMediaContainer.appendChild(video);
    } else {
      const img = document.createElement('img');
      img.src = data.src;
      img.alt = data.title || 'Client Work';
      img.className = 'w-full max-h-[75vh] rounded-xl object-contain shadow-2xl';
      modalMediaContainer.appendChild(img);
    }

    if (modalTitle) modalTitle.textContent = data.title || '';
    if (modalCaption) modalCaption.textContent = data.caption || '';

    modal.classList.add('active');
    document.body.style.overflow = 'hidden';
  };

  const closeModal = () => {
    modal.classList.remove('active');
    document.body.style.overflow = '';
    const activeVideo = modalMediaContainer.querySelector('video');
    if (activeVideo) activeVideo.pause();
  };

  document.querySelectorAll('[data-lightbox]').forEach((trigger) => {
    trigger.addEventListener('click', (e) => {
      e.preventDefault();
      openModal({
        src: trigger.dataset.src || trigger.getAttribute('href'),
        type: trigger.dataset.type || 'image',
        title: trigger.dataset.title || '',
        caption: trigger.dataset.caption || ''
      });
    });
  });

  if (closeBtn) closeBtn.addEventListener('click', closeModal);
  modal.addEventListener('click', (e) => {
    if (e.target === modal) closeModal();
  });

  window.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && modal.classList.contains('active')) closeModal();
  });
}

/* ==========================================================================
   7. ACCESSIBLE FAQ ACCORDION (Q1 through Q8)
   ========================================================================== */
function initFaqAccordion() {
  const faqItems = document.querySelectorAll('.faq-item');

  faqItems.forEach((item) => {
    const trigger = item.querySelector('.faq-trigger');
    const panel = item.querySelector('.faq-content');

    if (!trigger || !panel) return;

    trigger.addEventListener('click', () => {
      const isExpanded = trigger.getAttribute('aria-expanded') === 'true';

      faqItems.forEach((other) => {
        const otherTrigger = other.querySelector('.faq-trigger');
        const otherPanel = other.querySelector('.faq-content');
        if (otherTrigger && otherPanel && other !== item) {
          otherTrigger.setAttribute('aria-expanded', 'false');
          otherPanel.style.maxHeight = '0px';
          other.querySelector('.faq-icon')?.classList.remove('rotate-180');
        }
      });

      trigger.setAttribute('aria-expanded', !isExpanded);
      if (!isExpanded) {
        panel.style.maxHeight = panel.scrollHeight + 'px';
        item.querySelector('.faq-icon')?.classList.add('rotate-180');
      } else {
        panel.style.maxHeight = '0px';
        item.querySelector('.faq-icon')?.classList.remove('rotate-180');
      }
    });
  });
}

/* ==========================================================================
   8. CONTACT FORM VALIDATION & ANIMATION
   ========================================================================== */
function initContactForm() {
  const form = document.getElementById('studio-contact-form');
  const successState = document.getElementById('contact-success-state');

  if (!form) return;

  form.addEventListener('submit', (e) => {
    e.preventDefault();

    const honeypot = form.querySelector('input[name="_honey"]');
    if (honeypot && honeypot.value.trim() !== '') return;

    const name = form.querySelector('#lead-name');
    const email = form.querySelector('#lead-email');

    if (!name.value.trim() || !email.value.trim() || !email.checkValidity()) {
      alert('Please provide your name and a valid email address.');
      return;
    }

    const submitBtn = form.querySelector('#lead-submit-btn');
    if (submitBtn) {
      submitBtn.disabled = true;
      submitBtn.innerHTML = `
        <svg class="animate-spin -ml-1 mr-3 h-5 w-5 text-black" fill="none" viewBox="0 0 24 24">
          <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
          <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8H4z"></path>
        </svg>
        Sending Inquiry to Grid Stroke...
      `;
    }

    setTimeout(() => {
      form.classList.add('hidden');
      if (successState) {
        successState.classList.remove('hidden');
        successState.scrollIntoView({ behavior: 'smooth', block: 'center' });
      }
    }, 800);
  });
}
