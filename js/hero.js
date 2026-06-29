const initHero = () => {
  const heroSection = document.querySelector('.hero');
  const cursorGlow = document.querySelector('.hero-cursor-glow');
  const tiltContainer = document.querySelector('.dashboard-tilt-container');
  const floatingCards = document.querySelectorAll('.floating-card');
  const revealTargets = document.querySelectorAll('.reveal-element');
  if (!heroSection) return;
  const reducedMotionQuery = window.matchMedia('(prefers-reduced-motion: reduce)');
  const coarsePointerQuery = window.matchMedia('(pointer: coarse)');
  const isTouchDevice = 'ontouchstart' in window || navigator.maxTouchPoints > 0;
  let effectsEnabled = false;
  const computeEffectsEnabled = () => {
    effectsEnabled =
      !reducedMotionQuery.matches &&
      !coarsePointerQuery.matches &&
      !isTouchDevice;
    document.documentElement.classList.toggle('reduced-motion', reducedMotionQuery.matches);
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
  let heroRect = null;
  let tiltRect = null;
  const measure = () => {
    heroRect = heroSection.getBoundingClientRect();
    tiltRect = tiltContainer ? tiltContainer.getBoundingClientRect() : null;
  };
  let resizeTimer = null;
  const onResize = () => {
    clearTimeout(resizeTimer);
    resizeTimer = setTimeout(() => {
      heroRect = null;
      tiltRect = null;
    }, 180);
  };
  window.addEventListener('resize', onResize, { passive: true });
  let rafId = null;
  let pendingClientX = 0;
  let pendingClientY = 0;
  const applyPointerEffects = () => {
    rafId = null;
    if (cursorGlow && heroRect) {
      const x = pendingClientX - heroRect.left;
      const y = pendingClientY - heroRect.top;
      cursorGlow.style.transform = `translate3d(calc(${x}px - 50%), calc(${y}px - 50%), 0)`;
      cursorGlow.style.opacity = '1';
    }
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
    if (heroRect === null || tiltRect === null) {
      measure();
    }
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
  let listenersAttached = false;
  const attachPointerListeners = () => {
    if (listenersAttached || !effectsEnabled) return;
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
        document.documentElement.classList.add('hero-effects-active');
      } else {
        detachPointerListeners();
        document.documentElement.classList.remove('hero-effects-active');
      }
    });
  }, { threshold: 0.0 });
  heroVisibilityObserver.observe(heroSection);
  const revealObserver = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        entry.target.classList.add('reveal-active');
        revealObserver.unobserve(entry.target);
      }
    });
  }, { root: null, rootMargin: '0px', threshold: 0.0 });
  revealTargets.forEach((el) => revealObserver.observe(el));

  // Fail-safe fallback: force reveal all elements after 1 second if IntersectionObserver didn't trigger
  setTimeout(() => {
    revealTargets.forEach((el) => {
      if (!el.classList.contains('reveal-active')) {
        el.classList.add('reveal-active');
      }
    });
  }, 1000);

  void floatingCards;
};

if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', initHero);
} else {
  initHero();
}