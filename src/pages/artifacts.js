import { registerSiteHeader } from '../components/site-header.js';
import { registerSiteFooter } from '../components/site-footer.js';
import { hydrateCollectionImages } from '../features/collection-images.js';

registerSiteHeader();
registerSiteFooter();

const panels = [...document.querySelectorAll('.artifact-panel')];

function activate(id, push = false) {
  if (!panels.some(panel => panel.id === id)) return;
  panels.forEach(panel => { panel.hidden = panel.id !== id; });
  const listId = id === 'nha-nuoc' ? 'shared' : id;
  document.querySelectorAll('[data-artifact-list]').forEach(list => {
    list.hidden = list.dataset.artifactList !== listId;
  });
  document.querySelectorAll('museum-header a[data-artifact-topic]').forEach(link => {
    if (link.dataset.artifactTopic === id) link.setAttribute('aria-current', 'true');
    else link.removeAttribute('aria-current');
  });
  if (push && location.hash !== `#${id}`) history.pushState(null, '', `#${id}`);
}

function restoreTopic() {
  const requested = location.hash.slice(1) || new URLSearchParams(location.search).get('topic');
  activate(panels.some(panel => panel.id === requested) ? requested : panels[0].id);
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
