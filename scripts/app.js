/**
 * GRID STROKE STUDIO (gridstroke.studio) - Core Interactive & Motion Engine
 * Fluid Scroll Reveals, Mouse Parallax, Brand Rail & Cinema Lightbox
 * Inspired by Agrumea Farm, Cerebrium.ai & Trevor Noah
 */

document.addEventListener('DOMContentLoaded', () => {
  initSiteLoadSequence();
  initStaggeredMenu();
  initDepthTextLogo();
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

  // Allow clicking stage to fast-forward
  stage.addEventListener('click', (e) => {
    if (!isComplete) finishInstantly();
  });

  runSequence();
}

/* ==========================================================================
   00B. REACTBITS STAGGERED MENU (GSAP & MINIMALIST 2-LINE HAMBURGER)
   ========================================================================== */
function initStaggeredMenu() {
  const toggleBtn = document.getElementById('sm-toggle-btn');
  const panel = document.getElementById('staggered-menu-panel');
  const preContainer = document.getElementById('sm-prelayers');
  const backdrop = document.getElementById('sm-backdrop');
  const navLinks = document.querySelectorAll('.sm-panel-item, .sm-socials-link');

  if (!toggleBtn || !panel) return;

  let isOpen = false;
  let isBusy = false;
  let openTl = null;
  let closeTween = null;

  const preLayers = preContainer ? Array.from(preContainer.querySelectorAll('.sm-prelayer')) : [];

  // Setup initial GSAP state
  if (window.gsap) {
    gsap.set([panel, ...preLayers], { xPercent: 100, opacity: 1 });
    if (preContainer) gsap.set(preContainer, { xPercent: 0, opacity: 1 });
  }

  function buildOpenTimeline() {
    if (!window.gsap) return null;
    if (openTl) openTl.kill();
    if (closeTween) { closeTween.kill(); closeTween = null; }

    const itemEls = Array.from(panel.querySelectorAll('.sm-panel-itemLabel'));
    const numberEls = Array.from(panel.querySelectorAll('.sm-panel-list[data-numbering] .sm-panel-item'));
    const socialTitle = panel.querySelector('.sm-socials-title');
    const socialLinks = Array.from(panel.querySelectorAll('.sm-socials-link'));

    if (itemEls.length) gsap.set(itemEls, { yPercent: 140, rotate: 10 });
    if (numberEls.length) gsap.set(numberEls, { '--sm-num-opacity': 0 });
    if (socialTitle) gsap.set(socialTitle, { opacity: 0 });
    if (socialLinks.length) gsap.set(socialLinks, { y: 25, opacity: 0 });

    const tl = gsap.timeline({ paused: true });

    preLayers.forEach((layer, i) => {
      tl.fromTo(layer, { xPercent: 100 }, { xPercent: 0, duration: 0.5, ease: 'power4.out' }, i * 0.07);
    });

    const lastTime = preLayers.length ? (preLayers.length - 1) * 0.07 : 0;
    const panelInsertTime = lastTime + (preLayers.length ? 0.08 : 0);
    const panelDuration = 0.65;

    tl.fromTo(panel, { xPercent: 100 }, { xPercent: 0, duration: panelDuration, ease: 'power4.out' }, panelInsertTime);

    if (backdrop) {
      tl.to(backdrop, { opacity: 1, duration: 0.4, ease: 'power2.out' }, 0);
    }

    if (itemEls.length) {
      const itemsStartRatio = 0.15;
      const itemsStart = panelInsertTime + panelDuration * itemsStartRatio;

      tl.to(itemEls, {
        yPercent: 0,
        rotate: 0,
        duration: 0.9,
        ease: 'power4.out',
        stagger: { each: 0.08, from: 'start' }
      }, itemsStart);

      if (numberEls.length) {
        tl.to(numberEls, {
          duration: 0.6,
          ease: 'power2.out',
          '--sm-num-opacity': 1,
          stagger: { each: 0.06, from: 'start' }
        }, itemsStart + 0.1);
      }
    }

    if (socialTitle || socialLinks.length) {
      const socialsStart = panelInsertTime + panelDuration * 0.35;
      if (socialTitle) tl.to(socialTitle, { opacity: 1, duration: 0.45, ease: 'power2.out' }, socialsStart);
      if (socialLinks.length) {
        tl.to(socialLinks, {
          y: 0,
          opacity: 1,
          duration: 0.5,
          ease: 'power3.out',
          stagger: { each: 0.06, from: 'start' }
        }, socialsStart + 0.04);
      }
    }

    return tl;
  }

  function playOpen() {
    if (isBusy) return;
    isBusy = true;
    if (backdrop) backdrop.style.pointerEvents = 'auto';
    panel.setAttribute('aria-hidden', 'false');
    toggleBtn.setAttribute('aria-expanded', 'true');
    toggleBtn.classList.add('is-open');
    document.body.style.overflow = 'hidden';

    if (window.gsap) {
      openTl = buildOpenTimeline();
      if (openTl) {
        openTl.eventCallback('onComplete', () => { isBusy = false; });
        openTl.play(0);
      } else {
        isBusy = false;
      }
    } else {
      panel.style.transform = 'translateX(0)';
      if (backdrop) backdrop.style.opacity = '1';
      isBusy = false;
    }
  }

  function playClose() {
    if (openTl) { openTl.kill(); openTl = null; }
    if (backdrop) {
      backdrop.style.pointerEvents = 'none';
      if (!window.gsap) backdrop.style.opacity = '0';
    }
    panel.setAttribute('aria-hidden', 'true');
    toggleBtn.setAttribute('aria-expanded', 'false');
    toggleBtn.classList.remove('is-open');
    document.body.style.overflow = '';

    const all = [...preLayers, panel];
    if (window.gsap) {
      if (closeTween) closeTween.kill();
      if (backdrop) gsap.to(backdrop, { opacity: 0, duration: 0.25 });
      closeTween = gsap.to(all, {
        xPercent: 100,
        duration: 0.35,
        ease: 'power3.in',
        overwrite: 'auto',
        onComplete: () => {
          const itemEls = Array.from(panel.querySelectorAll('.sm-panel-itemLabel'));
          if (itemEls.length) gsap.set(itemEls, { yPercent: 140, rotate: 10 });
          const numberEls = Array.from(panel.querySelectorAll('.sm-panel-list[data-numbering] .sm-panel-item'));
          if (numberEls.length) gsap.set(numberEls, { '--sm-num-opacity': 0 });
          const socialTitle = panel.querySelector('.sm-socials-title');
          const socialLinks = Array.from(panel.querySelectorAll('.sm-socials-link'));
          if (socialTitle) gsap.set(socialTitle, { opacity: 0 });
          if (socialLinks.length) gsap.set(socialLinks, { y: 25, opacity: 0 });
          isBusy = false;
        }
      });
    } else {
      panel.style.transform = 'translateX(100%)';
      isBusy = false;
    }
  }

  function toggleMenu() {
    isOpen = !isOpen;
    if (isOpen) {
      playOpen();
    } else {
      playClose();
    }
  }

  function closeMenu() {
    if (isOpen) {
      isOpen = false;
      playClose();
    }
  }

  toggleBtn.addEventListener('click', toggleMenu);
  if (backdrop) backdrop.addEventListener('click', closeMenu);

  navLinks.forEach(link => {
    link.addEventListener('click', () => {
      closeMenu();
    });
  });

  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && isOpen) {
      closeMenu();
    }
  });
}

/* ==========================================================================
   00C. REACTBITS 3D DEPTHTEXT LOGO ENGINE (Interactive 3D Wordmark)
   ========================================================================== */
function initDepthTextLogo() {
  const mount = document.getElementById('hero-depth-logo');
  if (!mount) return;

  const MAX_LAYERS = 64;
  const INTRO_MS = 1200;
  const PUSH_STIFFNESS = 260;
  const PUSH_DAMPING = 17;
  const PRESS_EXTRA = 0.25;
  const FLOAT_EASE = 0.7;

  const clamp = (value, min, max) => Math.min(Math.max(value, min), max);

  const getLayerColor = (faceColor, depthColor, index, total) => {
    const progress = total <= 1 ? 1 : index / total;
    const eased = progress * progress;
    const faceMix = Math.round((1 - eased) * 72 + 4);
    return `color-mix(in srgb, color-mix(in srgb, ${faceColor} ${faceMix}%, ${depthColor}) 92%, black)`;
  };

  const getTransform = (rotateX, rotateY, lift = 0, roll = 0, sink = 0) =>
    [
      lift ? `translateY(${lift.toFixed(2)}px)` : '',
      roll ? `rotateZ(${roll.toFixed(3)}deg)` : '',
      `rotateX(${rotateX.toFixed(3)}deg) rotateY(${rotateY.toFixed(3)}deg)`,
      sink ? `translateZ(${(-sink).toFixed(2)}px)` : ''
    ]
      .filter(Boolean)
      .join(' ');

  // Configuration parameters
  const text = 'GRID STROKE';
  const layers = 34;
  const depth = 2.4;
  const faceColor = '#BEF24D'; // Electric neon lime face
  const depthColor = '#7C3AED'; // Electric purple depth layers
  const tilt = 8.5;
  const smoothing = 0.14;
  const perspective = 900;
  const autoOrbit = true;
  const orbitSpeed = 0.35;
  const hoverPush = 0.45;
  const float = true;
  const extent = layers * depth;

  const baseRotation = { x: -tilt * 0.32, y: tilt * 0.42 };

  // Build 3D DOM Elements
  const rootEl = document.createElement('div');
  rootEl.className = 'depth-text-root relative';
  rootEl.style.perspective = `${perspective}px`;
  rootEl.style.perspectiveOrigin = '50% 48%';

  const stageEl = document.createElement('div');
  stageEl.className = 'depth-text-stage';
  stageEl.style.transform = getTransform(baseRotation.x, baseRotation.y);
  stageEl.style.setProperty('--depth-text-grow', '0');

  // Pre-generate depth layers
  for (let layerIndex = 0; layerIndex < layers; layerIndex++) {
    const index = layers - layerIndex;
    const layerSpan = document.createElement('span');
    layerSpan.setAttribute('aria-hidden', 'true');
    layerSpan.className = 'depth-text-layer pointer-events-none absolute inset-0 z-0 inline-block text-4xl sm:text-6xl md:text-7xl lg:text-[5.5rem]';
    layerSpan.style.color = getLayerColor(faceColor, depthColor, index, layers);
    layerSpan.style.transform = `translateZ(calc(var(--depth-text-grow, 1) * ${(-index * depth).toFixed(2)}px))`;
    if (index === layers) {
      layerSpan.style.textShadow = `0 0.18em 0.32em color-mix(in srgb, ${depthColor} 24%, rgba(0, 0, 0, 0.42))`;
    }
    layerSpan.textContent = text;
    stageEl.appendChild(layerSpan);
  }

  // Face layer on top
  const faceSpan = document.createElement('span');
  faceSpan.className = 'depth-text-layer relative z-10 inline-block text-4xl sm:text-6xl md:text-7xl lg:text-[5.5rem]';
  faceSpan.style.color = faceColor;
  faceSpan.style.textShadow = '0 0.035em 0.07em rgba(0, 0, 0, 0.28), 0 0 35px rgba(190, 242, 77, 0.45)';
  faceSpan.style.transform = 'translateZ(0.6px)';
  faceSpan.textContent = text;
  stageEl.appendChild(faceSpan);

  rootEl.appendChild(stageEl);
  mount.innerHTML = '';
  mount.appendChild(rootEl);

  // Subtitle ".STUDIO • INDORE" below
  const subEl = document.createElement('div');
  subEl.className = 'font-mono text-xs sm:text-sm text-white/50 uppercase tracking-[0.35em] pt-4 pr-1 select-none flex items-center gap-2';
  subEl.innerHTML = '<span class="text-[#BEF24D]">&bull;</span> STUDIO INDORE <span class="text-[#BEF24D]">&bull;</span>';
  mount.appendChild(subEl);

  // Physics & Animation Loop
  const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  const finePointer = window.matchMedia('(hover: hover) and (pointer: fine)').matches;
  const canTrackPointer = finePointer && !reducedMotion;

  let activePointer = false;
  let hovered = false;
  let pressed = false;
  let lastTime = 0;
  let size = rootEl.offsetHeight || 100;
  const startTime = performance.now();
  const motion = { push: 0, velocity: 0, float: 0 };
  const current = { ...baseRotation };
  const target = { ...baseRotation };
  let introProgress = 0;

  const sinkAmount = () => clamp(motion.push, -0.25, 1);

  const applyTransform = (now = performance.now()) => {
    const time = (now - startTime) / 1000;
    const drift = motion.float;
    stageEl.style.transform = getTransform(
      current.x + (drift ? Math.cos(time * 1.19) * 2 * drift : 0),
      current.y + (drift ? Math.sin(time * 0.86 + 2.1) * 4 * drift : 0),
      drift ? Math.sin(time * 1.43) * size * 0.045 * drift : 0,
      drift ? Math.sin(time * 1.03 + 0.8) * 1.6 * drift : 0,
      sinkAmount() * extent
    );
  };

  const applyGrow = () => {
    const grow = introProgress >= 1 ? 1 : 1 - Math.pow(1 - introProgress, 3);
    const value = grow * (1 - sinkAmount());
    stageEl.style.setProperty('--depth-text-grow', value === 1 ? '1' : value.toFixed(4));
  };

  const tick = (now) => {
    const delta = lastTime ? Math.min(now - lastTime, 50) : 16;
    lastTime = now;

    if (introProgress < 1) {
      introProgress = Math.min(1, introProgress + delta / INTRO_MS);
    }

    if ((!canTrackPointer || !activePointer) && autoOrbit) {
      const elapsed = (now - startTime) / 1000;
      const orbit = elapsed * orbitSpeed * Math.PI * 2;
      const fallbackAmount = canTrackPointer ? 0.18 : 0.55;
      target.x = baseRotation.x + Math.sin(orbit) * tilt * fallbackAmount;
      target.y = baseRotation.y + Math.cos(orbit * 0.85) * tilt * fallbackAmount;
    }

    current.x += (target.x - current.x) * smoothing;
    current.y += (target.y - current.y) * smoothing;

    const pushGoal = hoverPush > 0 && (hovered || pressed) ? Math.min(1, hoverPush + (pressed ? PRESS_EXTRA : 0)) : 0;
    let remaining = delta / 1000;
    while (remaining > 0) {
      const step = Math.min(remaining, 1 / 120);
      motion.velocity += (PUSH_STIFFNESS * (pushGoal - motion.push) - PUSH_DAMPING * motion.velocity) * step;
      motion.push += motion.velocity * step;
      remaining -= step;
    }
    if (Math.abs(pushGoal - motion.push) < 0.0005 && Math.abs(motion.velocity) < 0.002) {
      motion.push = pushGoal;
      motion.velocity = 0;
    }

    const floatGoal = float && !hovered && !pressed ? 1 : 0;
    motion.float += (floatGoal - motion.float) * (1 - Math.exp(-delta / 1000 / FLOAT_EASE));
    if (Math.abs(floatGoal - motion.float) < 0.001) motion.float = floatGoal;

    applyGrow();
    applyTransform(now);

    requestAnimationFrame(tick);
  };

  requestAnimationFrame(tick);

  if (canTrackPointer) {
    window.addEventListener('pointermove', (event) => {
      const rect = rootEl.getBoundingClientRect();
      if (!rect.width || !rect.height) return;
      activePointer = true;
      const x = clamp((event.clientX - (rect.left + rect.width / 2)) / (rect.width * 0.8), -1, 1);
      const y = clamp((event.clientY - (rect.top + rect.height / 2)) / (rect.height * 0.8), -1, 1);
      target.x = baseRotation.x - y * tilt;
      target.y = baseRotation.y + x * tilt;
    });

    window.addEventListener('pointerleave', () => {
      activePointer = false;
      target.x = baseRotation.x;
      target.y = baseRotation.y;
    });
  }

  rootEl.addEventListener('pointerenter', () => { hovered = true; });
  rootEl.addEventListener('pointerleave', () => { hovered = false; pressed = false; });
  rootEl.addEventListener('pointerdown', () => { pressed = true; });
  rootEl.addEventListener('pointerup', () => { pressed = false; });
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
