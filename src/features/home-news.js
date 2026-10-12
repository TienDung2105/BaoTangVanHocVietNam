export function initHomeNews() {
  const stack = document.querySelector('.news-stack');
  if (!stack) return;
  const cards = [...stack.querySelectorAll('.news-card')];
  if (!cards.length) return;
  let pinnedIndex = 0;

  function show(index, expanded = true) {
    cards.forEach((card, position) => {
      const active = position === index;
      card.classList.toggle('is-selected', active);
      card.classList.toggle('is-expanded', active && expanded);
      card.classList.toggle('is-before', expanded && position < index);
      card.classList.toggle('is-after', expanded && position > index);
      card.setAttribute('aria-pressed', String(active));
    });
  }

  cards.forEach((card, index) => {
    card.addEventListener('pointerenter', (event) => {
      if (event.pointerType !== 'touch') show(index);
    });
    card.addEventListener('focus', () => show(index));
    card.addEventListener('click', () => {
      pinnedIndex = index;
      show(index);
    });
    card.addEventListener('keydown', (event) => {
      let target;
      if (event.key === 'ArrowRight') target = (index + 1) % cards.length;
      if (event.key === 'ArrowLeft') target = (index - 1 + cards.length) % cards.length;
      if (event.key === 'Home' || event.key === 'Escape') target = 0;
      if (event.key === 'End') target = cards.length - 1;
      if (target === undefined) return;
      event.preventDefault();
      if (event.key === 'Escape') pinnedIndex = 0;
      cards[target].focus({ preventScroll: true });
      if (event.key === 'Escape') show(0, false);
    });
  });

  stack.addEventListener('pointerleave', () => {
    const focused = cards.indexOf(document.activeElement);
    show(focused >= 0 ? focused : pinnedIndex, focused >= 0);
  });
  stack.addEventListener('focusout', (event) => {
    if (!stack.contains(event.relatedTarget)) show(pinnedIndex, false);
  });
  show(0, false);
}
