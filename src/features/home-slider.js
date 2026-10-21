import { homeSlides } from '../data/home-slides.js';

export function initHomeSlider(root = document) {
  const slides = [...root.querySelectorAll('.hero__slide')];
  const dots = [...root.querySelectorAll('.hero__dots button')];
  const prev = root.querySelector('.hero__arrow--prev');
  const next = root.querySelector('.hero__next');
  const copy = root.querySelector('#heroCopy');
  if (!slides.length || !prev || !next || !copy) return;
  const hero = slides[0].closest('.hero');
  if (!hero || hero.dataset.sliderInitialized) return;
  hero.dataset.sliderInitialized = 'true';
  const motion = matchMedia('(prefers-reduced-motion: reduce)');
  let currentSlide = 0;
  let timer = null, paused = motion.matches, focused = false, visible = true;
  function schedule() {
    clearTimeout(timer);
    timer = null;
    if (paused || focused || !visible || document.hidden || slides.length < 2) return;
    timer = setTimeout(() => { renderSlide(currentSlide + 1); schedule(); }, 2000);
  }

  function renderSlide(index) {
    currentSlide = (index + slides.length) % slides.length;
    const content = homeSlides[currentSlide];
    slides.forEach((slide, slideIndex) => {
      slide.classList.toggle('is-active', slideIndex === currentSlide);
      slide.setAttribute('aria-hidden', String(slideIndex !== currentSlide));
    });
    dots.forEach((dot, dotIndex) => {
      dot.classList.toggle('is-active', dotIndex === currentSlide);
      dot.setAttribute('aria-pressed', String(dotIndex === currentSlide));
    });
    prev.classList.remove('is-hidden');
    next.classList.remove('is-hidden');
    copy.className = `hero__copy ${content.copyClass}`;
    root.querySelector('#heroEyebrow').textContent = content.eyebrow;
    copy.hidden = currentSlide !== 0;
    const title = root.querySelector('#heroTitle');
    title.replaceChildren();
    content.lines.filter(Boolean).forEach((line, lineIndex) => {
      if (lineIndex) title.append(document.createElement('br'));
      const span = document.createElement('span');
      span.textContent = line;
      title.append(span);
    });
    root.querySelector('#heroCaption').innerHTML = content.caption;
  }

  prev.addEventListener('click', () => { renderSlide(currentSlide - 1); schedule(); });
  next.addEventListener('click', () => { renderSlide(currentSlide + 1); schedule(); });
  dots.forEach((dot, index) => dot.addEventListener('click', () => { renderSlide(index); schedule(); }));
  hero.addEventListener('focusin', event => { focused = event.target.matches(':focus-visible'); schedule(); });
  hero.addEventListener('focusout', event => { focused = hero.contains(event.relatedTarget) && event.relatedTarget.matches(':focus-visible'); schedule(); });
  document.addEventListener('visibilitychange', schedule);
  window.addEventListener('pagehide', () => { clearTimeout(timer); timer = null; });
  window.addEventListener('pageshow', schedule);
  motion.addEventListener('change', event => { paused = event.matches; schedule(); });
  if ('IntersectionObserver' in window) {
    new IntersectionObserver(entries => {
      visible = entries[0].isIntersecting;
      schedule();
    }).observe(hero);
  }
  renderSlide(0);
  schedule();
}
