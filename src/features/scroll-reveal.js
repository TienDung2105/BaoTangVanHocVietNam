// Content stays visible by default. Animate only on entry: no hidden-state CSS,
// scroll handlers, permanent GPU layers, or animation library downloads.
const targets = [
  '.home-section .section-label', '.intro__title', '.intro__copy',
  '.intro__name', '.intro__statement', '.intro__left', '.intro__center', '.intro__right',
  '.home-section .psd-image:not(.visiting__icon)', '.visiting__details', '.news-stack',
  'main h2', 'main h3', '.explore-feature', '.explore-card', '.explore-note',
  '.explore-solo-inner', '.explore-mini', '.listing-card', '.collection-card',
  '.document-article figure', '.exhibit-tour', '.exhibit-gallery-intro'
].join(',');
const excluded = 'dialog, [role="dialog"], .hero, .article-toc, .article-sidebar, .exhibit-stage, .model-stage, .viewer-tools, .exhibit-controls';
let initialized = false;

export function initScrollReveal() {
  if (initialized) return;
  initialized = true;
  if (!('IntersectionObserver' in window) || !Element.prototype.animate || !CSS.supports('translate', '0 1px')) return;
  const motion = matchMedia('(prefers-reduced-motion: reduce)');
  // Respect data-saving preferences on constrained connections as well.
  if (motion.matches || navigator.connection?.saveData) return;

  const seen = new WeakSet();
  const running = new Map();
  let stopped = false;
  const observer = new IntersectionObserver(entries => {
    let order = 0;
    for (const entry of entries) {
      if (!entry.isIntersecting) continue;
      const element = entry.target;
      observer.unobserve(element);
      if (stopped || motion.matches || document.hidden || element.contains(document.activeElement)) continue;
      // Never delay someone scrolling upwards or jumping to an anchor.
      if (entry.boundingClientRect.bottom <= 0 || element.matches(':target')) continue;
      const animation = element.animate([
        { opacity: 0, translate: '0 20px' },
        { opacity: 1, translate: '0 0' }
      ], {
        duration: 1200,
        delay: Math.min(order++, 2) * 200,
        easing: 'cubic-bezier(0.16, 1, 0.3, 1)',
        // Only hold the start during the short stagger, then release all styles.
        fill: 'backwards'
      });
      running.set(element, animation);
      const release = () => { if (running.get(element) === animation) running.delete(element); };
      animation.onfinish = animation.oncancel = release;
    }
  }, { threshold: 0, rootMargin: '0px 0px -24px 0px' });

  function register(scope, initial = false) {
    const candidates = [...(scope.matches?.(targets) ? [scope] : []), ...scope.querySelectorAll(targets)];
    // Batch initial geometry reads before any animations are created.
    const viewportHeight = window.innerHeight;
    for (const element of candidates) {
      if (seen.has(element) || element.closest(excluded) || element.parentElement?.closest(targets)) continue;
      seen.add(element);
      if (initial) {
        const rect = element.getBoundingClientRect();
        if (rect.height > 0 && rect.bottom > 0 && rect.top < viewportHeight) continue;
      }
      observer.observe(element);
    }
  }
  // Discover asynchronously populated lists without rescanning on every scroll.
  const mutations = new MutationObserver(records => {
    for (const record of records) {
      for (const node of record.addedNodes) {
        if (node.nodeType === 1 && !node.closest(excluded)) register(node);
      }
    }
  });
  const main = document.querySelector('main');
  register(document, true);
  if (main) mutations.observe(main, { childList: true, subtree: true });

  function finishAnimations() {
    for (const animation of running.values()) animation.cancel();
    running.clear();
  }
  function onMotionChange(event) {
    if (!event.matches) return;
    stopped = true;
    observer.disconnect();
    mutations.disconnect();
    finishAnimations();
  }
  // Keyboard navigation must expose the focused card immediately.
  document.addEventListener('focusin', event => {
    for (const [element, animation] of running) {
      if (element.contains(event.target)) animation.cancel();
    }
  });
  document.addEventListener('visibilitychange', () => { if (document.hidden) finishAnimations(); });
  window.addEventListener('pagehide', finishAnimations);
  motion.addEventListener('change', onMotionChange);
}
