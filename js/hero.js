/**
 * InterviewAce - Hero Section Interactions (Optimized)
 * Handles 3D tilt, cursor depth glow, and entry animations/scroll reveal.
 *
 * Performance optimizations applied:
 * - DOM elements cached once at init (no repeated querySelector)
 * - rAF-throttled mousemove handlers (no stacked frames)
 * - Cached bounding rects, recalculated only on resize (debounced) or hero enter
 * - Effects lazily started only when hero is in viewport (IntersectionObserver)
 * - Effects fully disabled on touch / coarse-pointer / reduced-motion devices
 * - Passive listeners used wherever the handler never calls preventDefault()
 */

document.addEventListener('DOMContentLoaded', () => {
  /* ---------------------------------------------------------------------
   * 1. Cache DOM references (queried once)
   * ------------------------------------------------------------------- */
  const heroSection = document.querySelector('.hero');
  const cursorGlow = document.querySelector('.hero-cursor-glow');
  const tiltContainer = document.querySelector('.dashboard-tilt-container');
  const floatingCards = document.querySelectorAll('.floating-card');
  const revealTargets = document.querySelectorAll('.reveal-element');

  if (!heroSection) return;

  /* ---------------------------------------------------------------------
   * 2. Capability detection (device + user preference)
   * ------------------------------------------------------------------- */
  const reducedMotionQuery = window.matchMedia('(prefers-reduced-motion: reduce)');
  const coarsePointerQuery = window.matchMedia('(pointer: coarse)');
  const isTouchDevice = 'ontouchstart' in window || navigator.maxTouchPoints > 0;

  // Single source of truth for whether "premium" mouse-driven effects should run.
  // Re-evaluated on media-query change (e.g. user toggles OS setting, or
  // switches between touch/mouse on a hybrid device).
  let effectsEnabled = false;

  const computeEffectsEnabled = () => {
    effectsEnabled =
      !reducedMotionQuery.matches &&
      !coarsePointerQuery.matches &&
      !isTouchDevice;

    document.documentElement.classList.toggle('reduced-motion', reducedMotionQuery.matches);

    // If effects just got disabled, reset any inline transforms/opacity so the
    // element returns to its CSS-default (static, reduced-motion-safe) state.
    if (!effectsEnabled) {
      if (cursorGlow) {
        cursorGlow.style.opacity = '0';
      }
      if (tiltContainer) {
        tiltContainer.style.transform = '';
      }
    }
  };

  computeEffectsEnabled();
  reducedMotionQuery.addEventListener('change', computeEffectsEnabled);
  coarsePointerQuery.addEventListener('change', computeEffectsEnabled);

  /* ---------------------------------------------------------------------
   * 3. Cached bounding rects — recomputed only when needed
   * ------------------------------------------------------------------- */
  let heroRect = null;
  let tiltRect = null;

  const measure = () => {
    heroRect = heroSection.getBoundingClientRect();
    tiltRect = tiltContainer ? tiltContainer.getBoundingClientRect() : null;
  };

  // Debounced resize: recompute cached measurements only after resize settles.
  let resizeTimer = null;
  const onResize = () => {
    clearTimeout(resizeTimer);
    resizeTimer = setTimeout(measure, 180); // within the 150–200ms target window
  };
  window.addEventListener('resize', onResize, { passive: true });

  /* ---------------------------------------------------------------------
   * 4. rAF-throttled pointer handling (single shared frame per mousemove)
   * ------------------------------------------------------------------- */
  let rafId = null;
  let pendingClientX = 0;
  let pendingClientY = 0;

  const applyPointerEffects = () => {
    rafId = null;

    // Cursor glow (relative to hero)
    if (cursorGlow && heroRect) {
      const x = pendingClientX - heroRect.left;
      const y = pendingClientY - heroRect.top;
      cursorGlow.style.transform = `translate3d(calc(${x}px - 50%), calc(${y}px - 50%), 0)`;
      cursorGlow.style.opacity = '1';
    }

    // Dashboard tilt (relative to tilt container, max 8deg)
    if (tiltContainer && tiltRect) {
      const x = pendingClientX - tiltRect.left;
      const y = pendingClientY - tiltRect.top;
      const xc = tiltRect.width / 2;
      const yc = tiltRect.height / 2;
      const rotateY = ((x - xc) / xc) * 8;
      const rotateX = -((y - yc) / yc) * 8;
      tiltContainer.style.transform =
        `perspective(1000px) rotateX(${rotateX.toFixed(2)}deg) rotateY(${rotateY.toFixed(2)}deg)`;
    }
  };

  const onMouseMove = (e) => {
    if (!effectsEnabled) return;
    pendingClientX = e.clientX;
    pendingClientY = e.clientY;
    if (rafId === null) {
      rafId = window.requestAnimationFrame(applyPointerEffects);
    }
  };

  const onMouseLeave = () => {
    if (rafId !== null) {
      cancelAnimationFrame(rafId);
      rafId = null;
    }
    if (cursorGlow) cursorGlow.style.opacity = '0';
    if (tiltContainer) tiltContainer.style.transform = 'perspective(1000px) rotateX(0deg) rotateY(0deg)';
  };

  /* ---------------------------------------------------------------------
   * 5. Lazy init — only attach/active while hero is on screen
   * ------------------------------------------------------------------- */
  let listenersAttached = false;

  const attachPointerListeners = () => {
    if (listenersAttached || !effectsEnabled) return;
    measure(); // fresh rects right as we start
    heroSection.addEventListener('mousemove', onMouseMove, { passive: true });
    heroSection.addEventListener('mouseleave', onMouseLeave, { passive: true });
    listenersAttached = true;
  };

  const detachPointerListeners = () => {
    if (!listenersAttached) return;
    heroSection.removeEventListener('mousemove', onMouseMove);
    heroSection.removeEventListener('mouseleave', onMouseLeave);
    listenersAttached = false;
    onMouseLeave();
  };

  const heroVisibilityObserver = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        attachPointerListeners();
      } else {
        detachPointerListeners();
      }
    });
  }, { threshold: 0.1 });

  heroVisibilityObserver.observe(heroSection);

  /* ---------------------------------------------------------------------
   * 6. Scroll reveal (entrance animations) — fires once per element
   * ------------------------------------------------------------------- */
  const revealObserver = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        entry.target.classList.add('reveal-active');
        revealObserver.unobserve(entry.target);
      }
    });
  }, { root: null, rootMargin: '0px', threshold: 0.15 });

  revealTargets.forEach((el) => revealObserver.observe(el));

  /* ---------------------------------------------------------------------
   * 7. Floating cards: nothing to wire up here currently (pure CSS
   *    animation), but references are cached in case future interactions
   *    (drag, click-to-dismiss, etc.) are added — avoids future
   *    querySelectorAll calls.
   * ------------------------------------------------------------------- */
  void floatingCards;
});