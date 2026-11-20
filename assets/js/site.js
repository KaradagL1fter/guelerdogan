(() => {
  window.__site = 1;
  const root = document.documentElement;
  const calm = matchMedia('(prefers-reduced-motion: reduce)').matches;
  let lenis = null;

  // Slow, heavy scroll
  if (!calm && window.Lenis) {
    lenis = new Lenis({ lerp: 0.065, wheelMultiplier: 0.85, smoothWheel: true, anchors: { offset: -80 } });
    const raf = (t) => { lenis.raf(t); requestAnimationFrame(raf); };
    requestAnimationFrame(raf);
  }

  // Header gets a hairline once the page has scrolled
  const top = document.querySelector('.top');
  const onScroll = () => top.classList.toggle('scrolled', scrollY > 8);
  addEventListener('scroll', onScroll, { passive: true }); onScroll();

  // Mobile menu
  const btn = document.querySelector('.burger'), menu = document.getElementById('menu');
  const setMenu = (open) => {
    menu.classList.toggle('open', open);
    btn.setAttribute('aria-expanded', open);
    btn.setAttribute('aria-label', open ? btn.dataset.close : btn.dataset.open);
    document.body.classList.toggle('menu-open', open);
    if (lenis) open ? lenis.stop() : lenis.start();
  };
  if (btn) {
    btn.addEventListener('click', () => setMenu(!menu.classList.contains('open')));
    menu.addEventListener('click', (e) => { if (e.target.closest('a')) setMenu(false); });
    addEventListener('keydown', (e) => { if (e.key === 'Escape' && menu.classList.contains('open')) { setMenu(false); btn.focus(); } });
    matchMedia('(min-width: 761px)').addEventListener('change', (m) => { if (m.matches) setMenu(false); });
  }

  // Name rises in once, on load
  requestAnimationFrame(() => requestAnimationFrame(() => root.classList.add('ready')));
  setTimeout(() => root.classList.add('ready'), 120); // fallback when frames are paused

  // Gentle reveal as blocks enter the viewport
  const items = document.querySelectorAll('[data-reveal]');
  if (calm || !('IntersectionObserver' in window)) { items.forEach(el => el.classList.add('seen')); return; }
  const io = new IntersectionObserver((entries) => {
    entries.forEach((e) => {
      if (!e.isIntersecting) return;
      const el = e.target, sibs = [...el.parentElement.children].filter(n => n.hasAttribute('data-reveal'));
      el.style.transitionDelay = Math.min(sibs.indexOf(el), 5) * 90 + 'ms';
      el.classList.add('seen');
      io.unobserve(el);
    });
  }, { rootMargin: '0px 0px -8% 0px', threshold: 0.12 });
  items.forEach(el => io.observe(el));
})();
