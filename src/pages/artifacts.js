import { registerSiteHeader } from '../components/site-header.js';
import { registerSiteFooter } from '../components/site-footer.js';
import { hydrateCollectionImages } from '../features/collection-images.js';

registerSiteHeader();
registerSiteFooter();

const panels = [...document.querySelectorAll('.artifact-panel')];
const lists = [...document.querySelectorAll('[data-artifact-list]')];
const overview = document.querySelector('[data-artifact-overview]');
const overviewGrid = overview.querySelector('.collection-grid');

// Reuse the topic cards so the overview always matches their images and links.
lists.forEach(list => {
  list.querySelectorAll('.listing-card').forEach(card => overviewGrid.append(card.cloneNode(true)));
});
const total = overviewGrid.children.length;
overview.querySelector('.collection-count').textContent = `${total} bài viết`;
overview.querySelector('.collection-end').textContent = `Bạn đã xem ${total} / ${total} bài viết`;

function activate(id, push = false) {
  if (id !== 'overview' && !panels.some(panel => panel.id === id)) return;
  overview.hidden = id !== 'overview';
  panels.forEach(panel => { panel.hidden = panel.id !== id; });
  lists.forEach(list => {
    list.hidden = list.dataset.artifactList !== id;
  });
  document.querySelectorAll('museum-header a[data-artifact-topic]').forEach(link => {
    if (link.dataset.artifactTopic === id) link.setAttribute('aria-current', 'true');
    else link.removeAttribute('aria-current');
  });
  if (push && location.hash !== `#${id}`) history.pushState(null, '', `#${id}`);
}

function restoreTopic() {
  const requested = location.hash.slice(1) || new URLSearchParams(location.search).get('topic');
  activate(panels.some(panel => panel.id === requested) ? requested : 'overview');
}
window.addEventListener('hashchange', restoreTopic);
window.addEventListener('popstate', restoreTopic);
restoreTopic();

document.querySelector('museum-header').addEventListener('click', event => {
  const link = event.target.closest('a[data-artifact-topic]');
  if (!link || event.ctrlKey || event.metaKey || event.shiftKey || event.altKey) return;
  event.preventDefault();
  activate(link.dataset.artifactTopic, true);
  const dropdown = link.closest('.nav__dropdown');
  if (dropdown) {
    dropdown.querySelector(':scope > a').focus();
    dropdown.classList.add('is-dismissed');
  }
});

hydrateCollectionImages();
