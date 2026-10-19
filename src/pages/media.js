import { registerSiteHeader } from '../components/site-header.js';
import { registerSiteFooter } from '../components/site-footer.js';
import { siteUrl } from '../data/navigation.js';
import { hydrateIcons } from '../features/media-icons.js';
import { createInteractiveExhibit } from '../features/interactive-exhibit.js';

registerSiteHeader(); registerSiteFooter(); hydrateIcons(document);
const tabs = [...document.querySelectorAll('[data-tab]')];
let library, modelViewer, activeTab = 'videos', selectedModel, selectionToken = 0, loadedModelId = null, loadingModelId = null;
let photoGallery;
const video = document.querySelector('#mediaVideo');
const videoCover = document.querySelector('#videoCover');
const videoState = document.querySelector('.video-state');
let currentVideo = null, youtubeFrame = null, youtubeTimeout = null;
const playYouTube = document.createElement('button');
playYouTube.type = 'button'; playYouTube.className = 'video-play'; playYouTube.hidden = true;
const playIcon = document.createElement('span'); playIcon.className = 'video-play-symbol'; playIcon.setAttribute('aria-hidden', 'true');
playIcon.innerHTML = '<svg viewBox="0 0 24 24" width="20" height="20" fill="currentColor" focusable="false"><path d="M8 5.5a1 1 0 0 1 1.5-.86l10 6a1 1 0 0 1 0 1.72l-10 6A1 1 0 0 1 8 17.5z"/></svg>';
playYouTube.append(playIcon, document.createTextNode('Xem video')); videoCover.append(playYouTube); hydrateIcons(playYouTube);
const modelPoster = document.querySelector('#modelPoster');
const loadButton = document.querySelector('#loadModel');
const modelStatus = document.querySelector('#modelStatus');
const progress = document.querySelector('#modelProgress');

function setTab(name, updateUrl = true) {
  if (!['videos', 'models', 'photos'].includes(name)) name = 'videos';
  activeTab = name;
  photoGallery?.setActive(name === 'photos');
  tabs.forEach(tab => { const current = tab.dataset.tab === name; tab.setAttribute('aria-selected', current); tab.tabIndex = current ? 0 : -1; document.querySelector(`#panel-${tab.dataset.tab}`).hidden = !current; });
  if (name !== 'videos') { video.pause(); stopYouTube(); }
  modelViewer?.setActive(name === 'models');
  if (name === 'models' && selectedModel && loadedModelId !== selectedModel.id && loadingModelId !== selectedModel.id) loadSelectedModel();
  if (updateUrl) history.replaceState(null, '', `#${name}`);
}
tabs.forEach((tab, index) => {
  tab.addEventListener('click', () => setTab(tab.dataset.tab));
  tab.addEventListener('keydown', event => { let next; if (event.key === 'ArrowRight') next = (index + 1) % tabs.length; if (event.key === 'ArrowLeft') next = (index + tabs.length - 1) % tabs.length; if (event.key === 'Home') next = 0; if (event.key === 'End') next = tabs.length - 1; if (next !== undefined) { event.preventDefault(); tabs[next].focus(); setTab(tabs[next].dataset.tab); } });
});
addEventListener('hashchange', () => setTab(location.hash.slice(1), false));

function selectItem(kind, id) { document.querySelectorAll(`#${kind}Items .media-item`).forEach(button => button.setAttribute('aria-pressed', button.dataset.id === id)); }
function youtubeId(item) { return /^[a-zA-Z0-9_-]{11}$/.test(item?.youtubeId || '') ? item.youtubeId : null; }
function stopYouTube() {
  clearTimeout(youtubeTimeout); youtubeTimeout = null;
  youtubeFrame?.remove(); youtubeFrame = null;
  playYouTube.disabled = false; playYouTube.lastChild.textContent = 'Xem video';
  if (youtubeId(currentVideo)) { videoCover.hidden = false; playYouTube.hidden = false; }
}
// Create the third-party player only after a deliberate visitor click.
playYouTube.addEventListener('click', () => {
  const id = youtubeId(currentVideo); if (!id || youtubeFrame) return;
  const frame = document.createElement('iframe');
  const url = new URL(`https://www.youtube-nocookie.com/embed/${id}`);
  url.search = new URLSearchParams({ autoplay: '1', playsinline: '1', rel: '0', hl: 'vi' }).toString();
  frame.src = url.href; frame.title = currentVideo.title; frame.allow = 'autoplay; encrypted-media; picture-in-picture; fullscreen'; frame.allowFullscreen = true;
  frame.referrerPolicy = 'strict-origin-when-cross-origin';
  youtubeFrame = frame; playYouTube.disabled = true; playYouTube.lastChild.textContent = 'Đang mở video…';
  frame.addEventListener('load', () => { if (youtubeFrame !== frame) return; clearTimeout(youtubeTimeout); youtubeTimeout = null; videoCover.hidden = true; playYouTube.disabled = false; playYouTube.lastChild.textContent = 'Xem video'; frame.focus(); });
  youtubeTimeout = setTimeout(() => { if (youtubeFrame !== frame) return; stopYouTube(); const status = document.querySelector('#videoStatus'); status.textContent = 'Chưa tải được trình phát. Vui lòng thử lại.'; status.hidden = false; }, 15000);
  document.querySelector('.video-stage').append(frame);
});
function selectVideo(item) {
  stopYouTube(); currentVideo = item;
  video.pause(); video.removeAttribute('src'); video.load();
  const id = youtubeId(item), available = Boolean(item.src || id);
  document.querySelector('#videoTitle').textContent = item.title;
  document.querySelector('#videoDescription').textContent = item.description || '';
  document.querySelector('#videoStatus').textContent = available ? '' : 'Chưa có video';
  document.querySelector('#videoStatus').hidden = available;
  document.querySelector('#videoPoster').src = siteUrl(item.poster);
  document.querySelector('#videoPoster').alt = `Ảnh bìa minh họa: ${item.title}`;
  videoCover.hidden = Boolean(item.src && !id); video.hidden = !item.src || Boolean(id);
  playYouTube.hidden = !id; videoState.hidden = available;
  video.poster = siteUrl(item.poster);
  if (item.src && !id) video.src = siteUrl(item.src);
  selectItem('video', item.id);
}
video.addEventListener('error', () => { const status = document.querySelector('#videoStatus'); status.textContent = 'Không tải được video. Vui lòng thử lại sau.'; status.hidden = false; });

function selectModel(item) {
  if (selectedModel?.id === item.id && (loadedModelId === item.id || loadingModelId === item.id)) return;
  ++selectionToken; modelViewer?.cancel(); selectedModel = item;
  loadedModelId = null; loadingModelId = null;
  modelViewer?.setActive(false);
  modelPoster.src = siteUrl(item.poster); modelPoster.alt = item.title; modelPoster.hidden = false;
  document.querySelector('#modelTitle').textContent = item.title;
  loadButton.hidden = true; loadButton.disabled = false; modelStatus.textContent = ''; progress.hidden = true;
  document.querySelector('.model-explore').disabled = true;
  const description = document.querySelector('#modelDescription'); description.textContent = item.description || ''; description.hidden = !item.description;
  const facts = document.querySelector('#modelFacts'); facts.replaceChildren();
  for (const [key, label] of [['material','Chất liệu'],['location','Không gian'],['inventoryNumber','Số hiện vật']]) { if (!item[key]) continue; const row = document.createElement('div'), dt = document.createElement('dt'), dd = document.createElement('dd'); dt.textContent = label; dd.textContent = item[key]; row.append(dt, dd); facts.append(row); } facts.hidden = !facts.children.length;
  document.querySelectorAll('[data-model-action]').forEach(button => { button.disabled = true; if (button.hasAttribute('aria-pressed')) button.setAttribute('aria-pressed', 'false'); });
  selectItem('model', item.id);
  if (activeTab === 'models') loadSelectedModel();
}
async function loadSelectedModel() {
  if (!selectedModel) return;
  const token = ++selectionToken; const item = selectedModel;
  loadingModelId = item.id; loadButton.hidden = true; loadButton.disabled = true; modelStatus.textContent = 'Đang tải hiện vật…'; progress.value = 0; progress.hidden = false;
  document.querySelector('#modelStage').setAttribute('aria-busy', 'true');
  try {
    if (!modelViewer) { const { createModelViewer } = await import('../features/viewer-3d/media-viewer.js'); if (token !== selectionToken) return; if (!modelViewer) modelViewer = createModelViewer(document.querySelector('#modelCanvas')); }
    if (token !== selectionToken) return;
    modelViewer.setActive(activeTab === 'models');
    const ready = await modelViewer.load(siteUrl(item.src), value => { if (token === selectionToken) progress.value = value; });
    if (!ready || token !== selectionToken) return;
    loadedModelId = item.id;
    modelPoster.hidden = true; loadButton.hidden = true; modelStatus.textContent = ''; progress.hidden = true;
    document.querySelector('.model-explore').disabled = false;
    document.querySelectorAll('[data-model-action]').forEach(button => button.disabled = false);
  } catch (error) { if (token !== selectionToken || error.name === 'AbortError') return; modelStatus.textContent = 'Không tải được hiện vật 3D. Bạn có thể thử lại.'; progress.hidden = true; loadButton.hidden = false; loadButton.lastChild.textContent = 'Thử lại'; }
  finally { if (token === selectionToken) { loadButton.disabled = false; loadingModelId = null; document.querySelector('#modelStage').setAttribute('aria-busy', 'false'); } }
}
loadButton.addEventListener('click', loadSelectedModel);
document.querySelectorAll('[data-model-action]').forEach(button => button.addEventListener('click', () => { const rotating = modelViewer?.action(button.dataset.modelAction); document.querySelector('[data-model-action="rotate"]').setAttribute('aria-pressed', Boolean(rotating)); }));


document.querySelectorAll('[data-fullscreen]').forEach(button => { if (!document.fullscreenEnabled) { button.hidden = true; return; } button.addEventListener('click', async () => { try { if (document.fullscreenElement) await document.exitFullscreen(); else await document.getElementById(button.dataset.fullscreen).requestFullscreen(); } catch { button.title = 'Không thể mở toàn màn hình trên trình duyệt này'; } }); });
document.addEventListener('fullscreenchange', () => { document.querySelectorAll('[data-fullscreen]').forEach(button => { const active = document.fullscreenElement?.id === button.dataset.fullscreen; button.title = active ? 'Thoát toàn màn hình' : 'Toàn màn hình'; button.setAttribute('aria-label', button.title); }); });

function renderItems(kind, items, choose) {
  const host = document.querySelector(`#${kind}Items`);
  items.forEach(item => { const button = document.createElement('button'); button.type = 'button'; button.className = 'media-item'; button.dataset.id = item.id; button.setAttribute('aria-pressed', 'false');
    const picture = document.createElement('span'); picture.className = 'media-item-photo'; const image = document.createElement('img'); image.src = siteUrl(item.poster || item.src); image.alt = kind === 'video' || item.illustration ? `Ảnh minh họa: ${item.title}` : item.title; image.width = 640; image.height = 400; image.loading = 'lazy'; image.decoding = 'async'; const icon = document.createElement('span'); icon.dataset.icon = kind === 'video' ? 'film' : kind === 'model' ? 'box' : 'scan-search'; picture.append(image, icon);
    const title = document.createElement('span'); title.className = 'media-item-title'; title.textContent = item.title;
    const meta = document.createElement('span'); meta.className = 'media-item-meta'; const state = document.createElement('span'); state.textContent = kind === 'video' ? item.src || youtubeId(item) ? 'Video' : 'Chờ video' : kind === 'model' ? 'Xem mô hình 3D' : item.illustration ? 'Ảnh minh họa' : 'Xem ảnh'; const arrow = document.createElement('span'); arrow.dataset.icon = 'arrow-up-right'; meta.append(state, arrow); button.append(picture, title, meta); button.addEventListener('click', () => choose(item)); host.append(button);
  }); hydrateIcons(host);
}
async function initialize() {
  try { const response = await fetch(siteUrl('assets/data/media-library.json')); if (!response.ok) throw new Error(); library = await response.json(); renderItems('video', library.videos, selectVideo); renderItems('model', library.models, selectModel); photoGallery = createInteractiveExhibit(library.photos); const params = new URLSearchParams(location.search); selectVideo(library.videos.find(item => item.id === params.get('video')) || library.videos[0]); selectModel(library.models.find(item => item.id === params.get('model')) || library.models[0]); setTab(location.hash.slice(1), false); if (activeTab === 'photos') photoGallery.openAlbumById(params.get('album')); }
  catch { const error = document.querySelector('#libraryError'); error.hidden = false; error.textContent = 'Không tải được thư viện. Vui lòng tải lại trang.'; }
}
addEventListener('pagehide', () => { video.pause(); stopYouTube(); modelViewer?.dispose(); modelViewer = null; loadedModelId = null; loadingModelId = null; });
addEventListener('pageshow', event => { if (event.persisted && selectedModel) { selectModel(selectedModel); setTab(activeTab, false); } });
initialize();
