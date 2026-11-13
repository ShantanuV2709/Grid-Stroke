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
  initHeroInfiniteSpiral();
  initSunDrunkControls();
  initScrollRevealEngine();
  initKlickpinScrub();
  initMouseParallax();
  initStickyProgressIndicator();
  initPhotoshopClientTabs();
  initHoverVideoPreviews();
  initVideoLightbox();
  initFaqAccordion();
  initContactForm();
  initFullPageScrollEngine();
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
    card1.style.opacity = '';
    card2.style.opacity = '';
    card1.style.transform = '';
    card2.style.transform = '';
    card3.style.transform = '';
    card1.classList.remove('is-entered');
    card2.classList.remove('is-entered');
    card3.classList.remove('is-entered', 'is-docking');
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
    }, 950);

    // Step 3: Pure Grid Stroke Logo rises on top (Zero card background, purely transparent)
    setTimeout(() => {
      if (isComplete) return;
      card3.classList.add('is-entered');
    }, 1650);

    // Step 4: Card 1 & Card 2 sink away, while Logo moves and expands to its place on the right half of the page
    setTimeout(() => {
      if (isComplete) return;

      // Card 1 & Card 2 sink away smoothly
      card1.style.transition = 'transform 0.65s cubic-bezier(0.16, 1, 0.3, 1), opacity 0.5s ease';
      card2.style.transition = 'transform 0.65s cubic-bezier(0.16, 1, 0.3, 1), opacity 0.5s ease';
      card1.style.opacity = '0';
      card2.style.opacity = '0';
      card1.style.transform = 'translateY(60px) scale(0.9) rotate(-6deg)';
      card2.style.transform = 'translateY(60px) scale(0.9) rotate(5deg)';

      // Calculate dock transform from center to hero-brand-logo on the right half
      const heroLogo = document.getElementById('hero-brand-logo');
      const loaderImg = card3.querySelector('img') || card3;

      if (heroLogo && loaderImg) {
        const hRect = heroLogo.getBoundingClientRect();
        const lRect = loaderImg.getBoundingClientRect();

        if (hRect.width > 0 && lRect.width > 0) {
          const deltaX = (hRect.left + hRect.width / 2) - (lRect.left + lRect.width / 2);
          const deltaY = (hRect.top + hRect.height / 2) - (lRect.top + lRect.height / 2);
          const scale = hRect.width / lRect.width;

          card3.classList.add('is-docking');
          card3.style.transform = `translate(${deltaX.toFixed(2)}px, ${deltaY.toFixed(2)}px) scale(${scale.toFixed(3)})`;
        }
      }

      // Simultaneously reveal hero content
      if (heroSection) heroSection.classList.add('hero-content-ready');
    }, 2450);

    // Step 5: Complete transition seamlessly
    setTimeout(() => {
      if (isComplete) return;
      stage.classList.add('is-done');
      if (heroSection) heroSection.classList.add('hero-content-ready');
      isComplete = true;
    }, 3450);
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
  const closeBtn = document.getElementById('sm-close-btn');
  if (closeBtn) closeBtn.addEventListener('click', closeMenu);
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
   INFINITE 3D SPIRAL ENGINE (Surrounding the Grid Stroke Logo from Bottom to Navbar)
   ========================================================================== */
function initHeroInfiniteSpiral() {
  const root = document.getElementById('infinite-spiral-root');
  const track = document.getElementById('infinite-spiral-track');
  if (!root || !track) return;

  const items = [
    { src: './content/hero/product-1-meura.jpg', alt: 'Meura Haute Couture Editorial' },
    { src: './content/branding/meura-1.png', alt: 'Meura Brand Architecture' },
    { src: './content/branding/meura-3.png', alt: 'Meura Tactile Packaging' },
    { src: './content/branding/meura-2.png', alt: 'Meura Embossed Apparel' },
    { src: './content/ecommerce/sundrunk-1.jpg', alt: 'Sun Drunk Amazon A+ Launch' },
    { src: './content/ecommerce/sundrunk-2.jpg', alt: 'Sun Drunk Sand-Free Technology' },
    { src: './content/ecommerce/sundrunk-3.jpg', alt: 'Sun Drunk Resort Duo Collection' },
    { src: './content/hero/product-2-avi.jpg', alt: 'Avi Organics Brand Visuals' },
    { src: './content/social/avi-sbo.jpg', alt: 'Avi SBO Product Creative' },
    { src: './content/social/crown-carousel.jpg', alt: 'Crown Residences Carousel' },
    { src: './content/social/eemos-pushpa.jpg', alt: 'Eemos Pushpa Campaign' },
    { src: './content/social/fusion-coats.jpg', alt: 'Fusion Paints Post' },
    { src: './content/social/lotus-healthcare.jpg', alt: 'Lotus Healthcare Identity' },
    { src: './content/social/pnps-admissions.jpg', alt: 'PNPS Academy Campaign' },
    { src: './content/social/eemos-facial.jpg', alt: 'Eemos Lightening Facial' },
    { src: './content/social/eemos-natural.jpg', alt: 'Eemos Natural Tech Treatment' },
    { src: './content/social/avi-groundnut.jpg', alt: 'Avi Groundnut Oil Story' },
    { src: './content/branding/meura-4.png', alt: 'Meura Lookbook Editorial' }
  ];

  // Parameters matching React InfiniteSpiral specification
  const speed = 0.55;
  const direction = 'up';
  const animationMode = 'all'; // 'auto', 'scroll', 'drag', 'all'
  const radius = 295;
  const cardWidth = 112;
  const cardHeight = 112;
  const verticalSpacing = 68;
  const perspective = 1000;
  const cardsPerTurn = 7;
  const rotation = 0;
  const cardTilt = 3;
  const cardRadius = 14;
  const centerScale = 1.15;
  const edgeFade = 0.25;
  const edgeBlur = 6;
  const pauseOnHover = true;

  const clamp = (val, min, max) => Math.min(Math.max(val, min), max);
  const modulo = (val, div) => ((val % div) + div) % div;
  const smoothstep = (min, max, val) => {
    const x = clamp((val - min) / (max - min || 1), 0, 1);
    return x * x * (3 - 2 * x);
  };

  const cardElements = [];
  items.forEach((item, index) => {
    const card = document.createElement('div');
    card.className =
      'spiral-card absolute left-1/2 top-1/2 block overflow-hidden rounded-[14px] border border-white/25 bg-black/40 shadow-[0_14px_38px_rgba(0,0,0,0.6)] [backface-visibility:hidden] [transform-style:preserve-3d] [will-change:transform,opacity,filter] pointer-events-auto cursor-pointer transition-colors duration-300';
    card.style.width = `${cardWidth}px`;
    card.style.height = `${cardHeight}px`;
    card.style.borderRadius = `${cardRadius}px`;
    card.setAttribute('role', 'listitem');
    card.setAttribute('aria-label', item.alt);
    card.setAttribute('data-lightbox', '');
    card.setAttribute('data-src', item.src);
    card.setAttribute('data-title', item.alt);

    const img = document.createElement('img');
    img.className = 'absolute inset-0 block h-full w-full select-none object-cover pointer-events-none';
    img.src = item.src;
    img.alt = item.alt;
    img.loading = index < 6 ? 'eager' : 'lazy';
    img.draggable = false;
    img.style.objectFit = 'cover';

    card.appendChild(img);
    track.appendChild(card);
    cardElements.push(card);
  });

  let progress = 0;
  let targetProgress = 0;
  let autoSpeed = 0;
  let isHovered = false;
  let isVisible = true;
  let isDragging = false;
  let lastPointerY = 0;
  let dragMoved = false;

  let bounds = root.getBoundingClientRect();
  const resizeObserver = new ResizeObserver(() => {
    bounds = root.getBoundingClientRect();
  });
  resizeObserver.observe(root);

  const intersectionObserver = new IntersectionObserver(([entry]) => {
    isVisible = entry.isIntersecting;
  });
  intersectionObserver.observe(root);

  // Scroll interaction
  let lastScrollY = window.scrollY;
  const scrollSpeedMultiplier = Math.max(speed, 0) / 0.55;
  const handleScroll = () => {
    const nextScrollY = window.scrollY;
    const scrollDelta = nextScrollY - lastScrollY;
    lastScrollY = nextScrollY;
    if (!isVisible || scrollDelta === 0) return;
    targetProgress += clamp(
      (scrollDelta * scrollSpeedMultiplier) / Math.max(verticalSpacing * 2, 1),
      -1.5,
      1.5
    );
  };
  window.addEventListener('scroll', handleScroll, { passive: true });

  // Hover detection
  if (pauseOnHover) {
    root.addEventListener('mouseenter', () => { isHovered = true; });
    root.addEventListener('mouseleave', () => { isHovered = false; });
  }

  // Pointer drag interaction
  const dragEnabled = animationMode === 'drag' || animationMode === 'all';
  root.addEventListener('pointerdown', event => {
    if (!dragEnabled || event.button !== 0) return;
    isDragging = true;
    dragMoved = false;
    lastPointerY = event.clientY;
    targetProgress = progress;
    root.setPointerCapture(event.pointerId);
    root.style.cursor = 'grabbing';
  });

  root.addEventListener('pointermove', event => {
    if (!isDragging) return;
    const pointerDelta = event.clientY - lastPointerY;
    lastPointerY = event.clientY;
    if (Math.abs(pointerDelta) > 0.5) dragMoved = true;
    targetProgress -= pointerDelta / Math.max(verticalSpacing, 1);
  });

  const stopDragging = event => {
    if (!isDragging) return;
    isDragging = false;
    if (root.hasPointerCapture(event.pointerId)) {
      root.releasePointerCapture(event.pointerId);
    }
    root.style.cursor = dragEnabled ? 'grab' : 'default';
  };

  root.addEventListener('pointerup', stopDragging);
  root.addEventListener('pointercancel', stopDragging);

  root.addEventListener('click', event => {
    if (dragMoved) {
      event.preventDefault();
      event.stopPropagation();
      dragMoved = false;
    }
  }, true);

  // Render loop
  let previousTime = performance.now();
  const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)');

  function render(time) {
    const delta = Math.min((time - previousTime) / 1000, 0.05);
    previousTime = time;

    const autoEnabled = animationMode === 'auto' || animationMode === 'all';
    const motionPaused = isDragging || (pauseOnHover && isHovered);
    const directionMultiplier = direction === 'down' ? -1 : 1;
    const desiredAutoSpeed =
      autoEnabled && isVisible && !reducedMotion.matches && !motionPaused
        ? speed * directionMultiplier
        : 0;

    const speedBlend = 1 - Math.exp(-delta * 7);
    autoSpeed += (desiredAutoSpeed - autoSpeed) * speedBlend;
    targetProgress += autoSpeed * delta;

    const followBlend = 1 - Math.exp(-delta * (isDragging ? 22 : 11));
    progress += (targetProgress - progress) * followBlend;

    const count = items.length;
    const half = count / 2;
    const width = Math.max(bounds.width, 1);
    const height = Math.max(bounds.height, 1);
    const fit = Math.min(1, width / 560, height / 660);
    const responsiveRadius = Math.min(radius * fit, Math.max(75, width * 0.36));
    const fadeStart = clamp(1 - edgeFade, 0, 0.98);
    const turnSize = Math.max(cardsPerTurn, 1);

    cardElements.forEach((card, index) => {
      const offset = modulo(index - progress + half, count) - half;
      const edge = Math.min(Math.abs(offset) / Math.max(half, 1), 1);
      const focus = 1 - Math.min(Math.abs(offset) / Math.max(turnSize * 0.65, 1), 1);
      const scale = (1 + (centerScale - 1) * focus) * fit;
      const angle = offset * (360 / turnSize) + rotation;
      const angleRadians = (angle * Math.PI) / 180;
      const x = Math.sin(angleRadians) * responsiveRadius;
      const z = Math.cos(angleRadians) * responsiveRadius;
      const yPos = offset * verticalSpacing * fit;
      const depthScale = clamp(perspective / Math.max(perspective - z, 1), 0.72, 1.45);
      const visualScale = scale * depthScale;
      const depth = (z / Math.max(responsiveRadius, 1) + 1) / 2;

      // Smooth vertical boundary fade so cards dissolve cleanly before reaching top/bottom bounds
      const maxVertSpan = Math.min(height * 0.42, 280 * fit);
      const vertBoundFade = 1 - smoothstep(maxVertSpan * 0.55, maxVertSpan, Math.abs(yPos));
      const edgeOpacity = (1 - smoothstep(0.40, 0.92, edge)) * vertBoundFade;

      // Fade out spiral cards when they pass in front of the central Grid Stroke logo
      const vertLogoZone = 1 - smoothstep(45 * fit, 175 * fit, Math.abs(yPos));
      const horizLogoZone = 1 - smoothstep(240 * fit, 390 * fit, Math.abs(x));
      const inFrontOfLogo = smoothstep(-50 * fit, 30 * fit, z);
      const logoOverlap = vertLogoZone * horizLogoZone;
      const logoClearFade = 1 - logoOverlap * Math.max(inFrontOfLogo * 0.95, 0.55);

      const blur = edgeBlur * smoothstep(0.35, 1, edge) + logoOverlap * inFrontOfLogo * 4;

      const depthDim = 0.28 + 0.60 * Math.pow(depth, 1.3);
      const finalOpacity = edgeOpacity * depthDim * logoClearFade;
      const cardOpacity = finalOpacity.toFixed(3);
      const brightness = (0.45 + 0.55 * depth).toFixed(2);

      card.style.transform = `translate(-50%, -50%) translate3d(${x.toFixed(2)}px, ${yPos.toFixed(2)}px, ${z.toFixed(2)}px) rotateZ(${cardTilt}deg) scale(${visualScale.toFixed(3)})`;
      card.style.opacity = cardOpacity;
      const filterList = [`brightness(${brightness})`];
      if (blur > 0.01) filterList.push(`blur(${blur.toFixed(2)}px)`);
      card.style.filter = filterList.join(' ');
      card.style.zIndex = String(Math.round(depth * 100000) + index);
      card.style.pointerEvents = finalOpacity > 0.22 ? 'auto' : 'none';
    });

    requestAnimationFrame(render);
  }

  requestAnimationFrame(render);
}

/* ==========================================================================
   1. FLUID SCROLL REVEAL ENGINE (Agrumea Farm / Studio Naam Style)
   ========================================================================== */
function initScrollRevealEngine() {
  const els = Array.from(document.querySelectorAll('.reveal-init, section:not(#hero) h2'));
  if (!els.length) return;

  // AnimatedContent (GSAP ScrollTrigger): fade + rise with power3.out, once per element
  if (window.gsap && window.ScrollTrigger) {
    gsap.registerPlugin(ScrollTrigger);
    const reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    els.forEach((el) => {
      const delayed = el.classList.contains('delay-100') ? 0.1 : 0;
      el.classList.remove('reveal-init');
      el.style.transition = 'none';
      el.style.transitionDelay = '0s';
      if (reduce) { gsap.set(el, { opacity: 1, y: 0 }); return; }
      const tl = gsap.timeline({ paused: true });
      tl.fromTo(el,
        { y: 24, opacity: 0 },
        { y: 0, opacity: 1, duration: 0.65, delay: delayed, ease: 'power3.out',
          onComplete: () => gsap.set(el, { clearProps: 'all' }) });
      gsap.set(el, { opacity: 0, y: 24 });
      ScrollTrigger.create({ trigger: el, start: 'top 90%', once: true, onEnter: () => tl.play() });
    });
    return;
  }

  const revealObserver = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        entry.target.classList.add('reveal-active');
        revealObserver.unobserve(entry.target);
      }
    });
  }, { rootMargin: '0px 0px -80px 0px', threshold: 0.12 });
  els.forEach((el) => { el.classList.add('reveal-init'); revealObserver.observe(el); });
}

/* ==========================================================================
   KLICKPIN 3D SCROLL SIMULATION (scroll scrubs the walkthrough video both ways)
   ========================================================================== */
function initKlickpinScrub() {
  const section = document.getElementById('three-d');
  const video = document.getElementById('klickpin-scrub-video');
  if (!section || !video) return;
  const bar = document.getElementById('klickpin-progress');
  const pct = document.getElementById('klickpin-percent');

  video.pause();
  let target = 0, current = 0, ready = false, seeking = false;
  video.addEventListener('loadedmetadata', () => { ready = true; video.currentTime = 0; });
  video.addEventListener('seeked', () => { seeking = false; });
  video.load();

  const update = () => {
    const rect = section.getBoundingClientRect();
    const total = Math.max(section.offsetHeight - window.innerHeight, 1);
    target = Math.min(Math.max(-rect.top / total, 0), 1);
  };
  window.addEventListener('scroll', update, { passive: true });
  window.addEventListener('resize', update);
  update();

  const tick = () => {
    current += (target - current) * 0.12;
    if (Math.abs(target - current) < 0.0005) current = target;
    if (ready && video.duration && !seeking) {
      const t = current * (video.duration - 0.05);
      if (Math.abs(video.currentTime - t) > 0.01) {
        seeking = true;
        if (video.fastSeek) video.fastSeek(t); else video.currentTime = t;
        setTimeout(() => { seeking = false; }, 60);
      }
    }
    if (bar) bar.style.width = (current * 100).toFixed(1) + '%';
    if (pct) pct.textContent = Math.round(current * 100);
    requestAnimationFrame(tick);
  };
  requestAnimationFrame(tick);
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
    'about': '01 // ABOUT STUDIO',
    'branding': '02 // BRANDING &bull; MEURA',
    'ecommerce': '03 // E-COMMERCE &bull; SUN DRUNK',
    'three-d': '04 // 3D CGI &bull; KLICKPIN',
    'invitations': '05 // CEREMONIAL ATELIER',
    'motion': '06 // COMMERCIAL REELS',
    'social-creatives': '07 // SOCIAL CREATIVES',
    'process': '08 // OUR WORKFLOW',
    'social-mgmt': '09 // SOCIAL PACKAGES',
    'faq-section': '10 // FREQUENTLY ASKED QUESTIONS',
    'lets-create': '11 // LET\'S CREATE'
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
   5. VIDEO HOVER & TOUCH PREVIEWS (Royal Weddings & Video Previews)
   ========================================================================== */
function initHoverVideoPreviews() {
  const hoverVideos = document.querySelectorAll('video[data-hover-preview]');
  if (!hoverVideos.length) return;

  const isTouchDevice = !window.matchMedia('(hover: hover) and (pointer: fine)').matches;

  hoverVideos.forEach((video) => {
    const parent = video.closest('.video-preview-container') || video;
    const previewTime = parseFloat(video.dataset.previewTime || '0');

    if (previewTime > 0) {
      const seekPreview = () => {
        if (video.paused && video.currentTime < 0.3) {
          try { video.currentTime = previewTime; } catch (_) {}
        }
      };
      if (video.readyState >= 1) {
        seekPreview();
      } else {
        video.addEventListener('loadedmetadata', seekPreview, { once: true });
      }
    }

    // Desktop hover
    parent.addEventListener('mouseenter', () => {
      video.muted = true;
      const playPromise = video.play();
      if (playPromise !== undefined) {
        playPromise.catch(() => {});
      }
    });

    parent.addEventListener('mouseleave', () => {
      if (!parent.classList.contains('is-touch-active')) {
        video.pause();
        if (previewTime > 0 && video.currentTime < 0.3) {
          try { video.currentTime = previewTime; } catch (_) {}
        }
      }
    });

    // Touch / Tap interaction (for mobile / tablet / non-hover devices)
    parent.addEventListener('click', () => {
      if (isTouchDevice || window.innerWidth < 1024) {
        const wasActive = parent.classList.contains('is-touch-active');
        const container = parent.closest('#invitations') || parent.parentElement;
        if (container) {
          container.querySelectorAll('.video-preview-container').forEach(c => {
            if (c !== parent) {
              c.classList.remove('is-touch-active');
            }
          });
        }
        if (wasActive) {
          parent.classList.remove('is-touch-active');
        } else {
          parent.classList.add('is-touch-active');
          video.muted = true;
          video.play().catch(() => {});
        }
      }
    });
  });

  // On touch / coarse pointer devices, autoplay videos when section is in viewport
  const invitationsSection = document.getElementById('invitations');
  if (invitationsSection && isTouchDevice) {
    const touchObserver = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          hoverVideos.forEach((v) => {
            v.muted = true;
            v.play().catch(() => {});
          });
        } else {
          hoverVideos.forEach((v) => {
            v.pause();
          });
        }
      });
    }, { threshold: 0.2 });
    touchObserver.observe(invitationsSection);
  }
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

/* Sun Drunk carousel side controls (presets + arrows drive the React/OGL FlexCarousel) */
function initSunDrunkControls() {
  const root = document.getElementById('sundrunk-flex-carousel');
  const press = (key) => {
    const c = root && root.querySelector('[role="region"]');
    if (c) { c.focus({ preventScroll: true }); c.dispatchEvent(new KeyboardEvent('keydown', { key, bubbles: true })); }
  };
  const prev = document.getElementById('flex-prev-btn');
  const next = document.getElementById('flex-next-btn');
  if (prev) prev.addEventListener('click', () => press('ArrowLeft'));
  if (next) next.addEventListener('click', () => press('ArrowRight'));
  const btns = document.querySelectorAll('[data-flex-preset]');
  btns.forEach((btn) => btn.addEventListener('click', () => {
    if (window.setSunDrunkPreset) window.setSunDrunkPreset(btn.dataset.flexPreset);
    btns.forEach((b) => {
      const on = b === btn;
      b.classList.toggle('bg-[#2BA3C9]', on);
      b.classList.toggle('text-black', on);
      b.classList.toggle('bg-black/50', !on);
      b.classList.toggle('text-white/80', !on);
    });
  }));
}

/* ==========================================================================
   FULL-PAGE SINGLE SECTION SCROLL ENGINE WITH SMOOTH ANIMATED CONTENT (GSAP)
   Except Simulation Section (#three-d) which scrubs smoothly
   ========================================================================== */
function initFullPageScrollEngine() {
  if (window.gsap && window.ScrollToPlugin) {
    gsap.registerPlugin(ScrollToPlugin);
  }

  const stageSections = Array.from(document.querySelectorAll('section.sticky-stage-section'));
  const threeDSection = document.getElementById('three-d');
  if (!stageSections.length) return;

  const threeDIdx = stageSections.indexOf(threeDSection);
  const heroSection = document.getElementById('hero');
  if (heroSection) heroSection.dataset.hasAnimated = 'true';

  let isAnimating = false;

  // Determine current active section index based on viewport scroll position
  function getActiveSectionIndex() {
    const scrollY = window.scrollY;
    const windowH = window.innerHeight;

    if (threeDSection) {
      const tTop = threeDSection.offsetTop;
      const tBottom = tTop + threeDSection.offsetHeight - windowH;
      // Strictly inside the 3D walkthrough track:
      if (scrollY >= tTop - 15 && scrollY <= tBottom + 15) {
        return threeDIdx;
      }
    }

    let closestIdx = 0;
    let minDiff = Infinity;
    stageSections.forEach((sec, idx) => {
      const diff = Math.abs(sec.offsetTop - scrollY);
      if (diff < minDiff) {
        minDiff = diff;
        closestIdx = idx;
      }
    });
    return closestIdx;
  }

  // Smooth AnimatedContent entrance: runs strictly ONCE per section so returning never causes jump/glitch
  function triggerAnimatedContent(section) {
    if (!window.gsap || !section) return;
    if (section.id === 'three-d' || section.id === 'hero') return;

    // Never re-animate a section that has already been revealed
    if (section.dataset.hasAnimated === 'true') return;
    section.dataset.hasAnimated = 'true';

    const targets = section.querySelectorAll(
      'h2, h3, p, .package-card, .brog-process-item, .faq-item, .video-preview-container, .hero-col-left > div'
    );
    if (!targets.length) return;

    gsap.fromTo(targets,
      { opacity: 0, y: 24 },
      {
        opacity: 1,
        y: 0,
        duration: 0.65,
        ease: 'power3.out',
        stagger: 0.035,
        clearProps: 'all'
      }
    );
  }

  // Smoothly glide viewport to target section index
  function goToSection(index, fromDirection = 1) {
    if (index < 0 || index >= stageSections.length) return;
    const targetSec = stageSections[index];
    if (!targetSec) return;

    isAnimating = true;

    let targetY = targetSec.offsetTop;

    // Special case: If scrolling UP into #three-d from #invitations, land at bottom of #three-d (100% video completion)
    if (targetSec === threeDSection && fromDirection === -1) {
      targetY = threeDSection.offsetTop + threeDSection.offsetHeight - window.innerHeight;
    }

    // Trigger entrance animation for target section right as scroll begins (if not already animated)
    triggerAnimatedContent(targetSec);

    if (window.gsap) {
      gsap.to(window, {
        scrollTo: { y: targetY, autoKill: false },
        duration: 0.85,
        ease: 'power3.out',
        onComplete: () => {
          setTimeout(() => {
            isAnimating = false;
          }, 140);
        }
      });
    } else {
      window.scrollTo({ top: targetY, behavior: 'smooth' });
      setTimeout(() => {
        isAnimating = false;
      }, 700);
    }
  }

  // Intercept desktop mousewheel / trackpad scrolling
  window.addEventListener('wheel', (e) => {
    // Only engage full-page single scroll snap on desktop viewports (>= 1024px)
    if (window.innerWidth < 1024) return;

    const scrollY = window.scrollY;
    const windowH = window.innerHeight;

    // Simulation Section (#three-d) continuous scrubbing logic:
    if (threeDSection) {
      const tTop = threeDSection.offsetTop;
      const tBottom = tTop + threeDSection.offsetHeight - windowH;

      // Inside #three-d scroll range:
      if (scrollY >= tTop - 15 && scrollY <= tBottom + 15) {
        // At the top boundary and scrolling UP -> exit to previous section (#ecommerce)
        if (scrollY <= tTop + 15 && e.deltaY < -20) {
          e.preventDefault();
          if (isAnimating) return;
          if (threeDIdx > 0) goToSection(threeDIdx - 1, -1);
          return;
        }

        // At the bottom boundary and scrolling DOWN -> exit to next section (#invitations)
        if (scrollY >= tBottom - 15 && e.deltaY > 20) {
          e.preventDefault();
          if (isAnimating) return;
          if (threeDIdx < stageSections.length - 1) goToSection(threeDIdx + 1, 1);
          return;
        }

        // Scrubbing inside #three-d: DO NOT INTERCEPT, allow natural scroll to scrub the 3D video!
        return;
      }
    }

    // Standard sections: advance exactly one section per deliberate scroll flick
    e.preventDefault();
    if (isAnimating) return;
    if (Math.abs(e.deltaY) < 20) return; // Discard tiny jitters

    const currentIdx = getActiveSectionIndex();
    if (e.deltaY > 0) {
      if (currentIdx < stageSections.length - 1) {
        goToSection(currentIdx + 1, 1);
      }
    } else {
      if (currentIdx > 0) {
        goToSection(currentIdx - 1, -1);
      }
    }
  }, { passive: false });

  // Keyboard Navigation: ArrowDown / PageDown / Space -> Next; ArrowUp / PageUp -> Prev
  window.addEventListener('keydown', (e) => {
    if (window.innerWidth < 1024) return;
    if (['INPUT', 'TEXTAREA', 'SELECT'].includes(document.activeElement?.tagName)) return;

    if (threeDSection) {
      const scrollY = window.scrollY;
      const tTop = threeDSection.offsetTop;
      const tBottom = tTop + threeDSection.offsetHeight - window.innerHeight;
      if (scrollY >= tTop - 15 && scrollY <= tBottom + 15) {
        if (scrollY <= tTop + 15 && (e.key === 'ArrowUp' || e.key === 'PageUp')) {
          e.preventDefault();
          if (isAnimating) return;
          if (threeDIdx > 0) goToSection(threeDIdx - 1, -1);
          return;
        }
        if (scrollY >= tBottom - 15 && (e.key === 'ArrowDown' || e.key === 'PageDown' || e.key === ' ')) {
          e.preventDefault();
          if (isAnimating) return;
          if (threeDIdx < stageSections.length - 1) goToSection(threeDIdx + 1, 1);
          return;
        }
        return; // Allow keyboard arrow scrubbing inside 3D simulation
      }
    }

    if (e.key === 'ArrowDown' || e.key === 'PageDown' || e.key === ' ') {
      e.preventDefault();
      if (isAnimating) return;
      const currentIdx = getActiveSectionIndex();
      if (currentIdx < stageSections.length - 1) goToSection(currentIdx + 1, 1);
    } else if (e.key === 'ArrowUp' || e.key === 'PageUp') {
      e.preventDefault();
      if (isAnimating) return;
      const currentIdx = getActiveSectionIndex();
      if (currentIdx > 0) goToSection(currentIdx - 1, -1);
    }
  });

  // Touch Swipe Support on Desktop Touchscreens (e.g., Surface Pro, iPad Pro)
  let touchStartY = 0;
  window.addEventListener('touchstart', (e) => {
    if (e.touches.length === 1) {
      touchStartY = e.touches[0].clientY;
    }
  }, { passive: true });

  window.addEventListener('touchend', (e) => {
    if (window.innerWidth < 1024) return;
    if (isAnimating) return;

    if (threeDSection) {
      const scrollY = window.scrollY;
      const tTop = threeDSection.offsetTop;
      const tBottom = tTop + threeDSection.offsetHeight - window.innerHeight;
      if (scrollY >= tTop - 15 && scrollY <= tBottom + 15) {
        return; // Natural touch scrub inside #three-d
      }
    }

    const touchEndY = e.changedTouches[0].clientY;
    const deltaY = touchStartY - touchEndY;
    if (Math.abs(deltaY) > 55) {
      const currentIdx = getActiveSectionIndex();
      if (deltaY > 0 && currentIdx < stageSections.length - 1) {
        goToSection(currentIdx + 1, 1);
      } else if (deltaY < 0 && currentIdx > 0) {
        goToSection(currentIdx - 1, -1);
      }
    }
  }, { passive: true });

  // Anchor Links Interception (#about, #branding, #process, #social-mgmt, #faq-section, #lets-create)
  document.querySelectorAll('a[href^="#"]').forEach((link) => {
    link.addEventListener('click', (e) => {
      const href = link.getAttribute('href');
      if (!href || href === '#' || href === '#!') return;
      const targetEl = document.querySelector(href);
      if (!targetEl) return;

      const targetSec = targetEl.closest('section.sticky-stage-section');
      if (targetSec) {
        const targetIdx = stageSections.indexOf(targetSec);
        if (targetIdx !== -1) {
          e.preventDefault();
          goToSection(targetIdx, targetIdx > getActiveSectionIndex() ? 1 : -1);
        }
      }
    });
  });
}
