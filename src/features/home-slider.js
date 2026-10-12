import { homeSlides } from '../data/home-slides.js';

export function initHomeSlider(root = document) {
  const slides = [...root.querySelectorAll('.hero__slide')];
  const dots = [...root.querySelectorAll('.hero__dots button')];
  const prev = root.querySelector('.hero__arrow--prev');
  const next = root.querySelector('.hero__next');
  const copy = root.querySelector('#heroCopy');
  if (!slides.length || !prev || !next || !copy) return;
  let currentSlide = 0;

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
    prev.classList.toggle('is-hidden', currentSlide === 0);
    next.classList.toggle('is-hidden', currentSlide === slides.length - 1);
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

  prev.addEventListener('click', () => renderSlide(currentSlide - 1));
  next.addEventListener('click', () => renderSlide(currentSlide + 1));
  dots.forEach((dot, index) => dot.addEventListener('click', () => renderSlide(index)));
  renderSlide(0);
}
