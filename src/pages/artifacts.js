import { registerSiteHeader } from '../components/site-header.js';
import { registerSiteFooter } from '../components/site-footer.js';
import { hydrateCollectionImages } from '../features/collection-images.js';

registerSiteHeader();
registerSiteFooter();

const panels = [...document.querySelectorAll('.artifact-panel')];
const lists = [...document.querySelectorAll('[data-artifact-list]')];
const overview = document.querySelector('[data-artifact-overview]');
const overviewGrid = overview.querySelector('.collection-grid');
const tabs = [...document.querySelectorAll('[data-collection-tab]')];
const artifactPanel = document.querySelector('#panel-artifacts');
const worksPanel = document.querySelector('#panel-works');
const worksList = document.querySelector('[data-works-list]');
const worksCards = [...worksList.querySelectorAll('[data-work-topic]')];
let activeTopic = null;
let activeTab = 'artifacts';

// Keep the overview in sync with the existing topic articles.
lists.forEach(list => {
  list.querySelectorAll('.listing-card').forEach(card => overviewGrid.append(card.cloneNode(true)));
});
const total = overviewGrid.children.length;
overview.querySelector('.collection-count').textContent = `${total} bài viết`;
overview.querySelector('.collection-end').textContent = `Bạn đã xem ${total} / ${total} bài viết`;

function render() {
  const selectedList = lists.find(list => list.dataset.artifactList === activeTopic);
  const artifactCount = activeTopic ? selectedList?.querySelectorAll('.listing-card').length || 0 : total;
  let workCount = 0;
  worksCards.forEach(card => {
    card.hidden = Boolean(activeTopic && card.dataset.workTopic !== activeTopic);
    if (!card.hidden) workCount += 1;
  });
  document.querySelector('[data-artifact-count]').textContent = String(artifactCount).padStart(2, '0');
  document.querySelector('[data-work-count]').textContent = String(workCount).padStart(2, '0');
  worksList.querySelector('.collection-count').textContent = `${workCount} tác phẩm`;
  const end = worksList.querySelector('.collection-end');
  end.textContent = `Bạn đã xem ${workCount} / ${workCount} tác phẩm`;
  end.hidden = workCount === 0;
  worksList.querySelector('.collection-empty').hidden = workCount !== 0;

  artifactPanel.hidden = activeTab !== 'artifacts';
  worksPanel.hidden = activeTab !== 'works';
  overview.hidden = activeTopic !== null;
  panels.forEach(panel => { panel.hidden = panel.id !== activeTopic; });
  lists.forEach(list => { list.hidden = list.dataset.artifactList !== activeTopic; });
  tabs.forEach(tab => {
    const selected = tab.dataset.collectionTab === activeTab;
    tab.setAttribute('aria-selected', String(selected));
    tab.tabIndex = selected ? 0 : -1;
  });
  document.querySelectorAll('museum-header a[data-artifact-topic]').forEach(link => {
    if (link.dataset.artifactTopic === activeTopic) link.setAttribute('aria-current', 'true');
    else link.removeAttribute('aria-current');
  });
}

function updateUrl() {
  const url = new URL(location.href);
  url.searchParams.delete('topic');
  url.searchParams.delete('tab');
  if (activeTopic) url.searchParams.set('topic', activeTopic);
  if (activeTab === 'works') url.searchParams.set('tab', 'works');
  url.hash = activeTab === 'works' ? 'tac-pham' : activeTopic ? 'hien-vat' : 'overview';
  if (url.href !== location.href) history.pushState(null, '', url.href);
}

function selectTab(key) {
  activeTab = key;
  render();
  updateUrl();
}

function restoreTopic() {
  const params = new URLSearchParams(location.search);
  const hash = location.hash.slice(1);
  const requested = panels.some(panel => panel.id === hash) ? hash : params.get('topic');
  activeTopic = panels.some(panel => panel.id === requested) ? requested : null;
  activeTab = hash === 'tac-pham' || (params.get('tab') === 'works' && hash !== 'overview' && hash !== 'hien-vat') ? 'works' : 'artifacts';
  render();
}

tabs.forEach((tab, index) => {
  tab.addEventListener('click', () => selectTab(tab.dataset.collectionTab));
  tab.addEventListener('keydown', event => {
    let target;
    if (event.key === 'ArrowRight') target = (index + 1) % tabs.length;
    if (event.key === 'ArrowLeft') target = (index - 1 + tabs.length) % tabs.length;
    if (event.key === 'Home') target = 0;
    if (event.key === 'End') target = tabs.length - 1;
    if (target === undefined) return;
    event.preventDefault();
    selectTab(tabs[target].dataset.collectionTab);
    tabs[target].focus();
  });
});

window.addEventListener('hashchange', restoreTopic);
window.addEventListener('popstate', restoreTopic);

document.querySelector('museum-header').addEventListener('click', event => {
  const link = event.target.closest('a[data-artifact-topic]');
  if (!link || event.ctrlKey || event.metaKey || event.shiftKey || event.altKey || event.button !== 0) return;
  if (!panels.some(panel => panel.id === link.dataset.artifactTopic)) return;
  event.preventDefault();
  activeTopic = link.dataset.artifactTopic;
  render();
  updateUrl();
  const dropdown = link.closest('.nav__dropdown');
  if (dropdown) {
    dropdown.querySelector(':scope > a').focus();
    dropdown.classList.add('is-dismissed');
  }
});

restoreTopic();
hydrateCollectionImages();
