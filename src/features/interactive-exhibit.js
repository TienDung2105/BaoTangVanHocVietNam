import { siteUrl } from '../data/navigation.js';
import { hydrateIcons } from './media-icons.js';

export function createInteractiveExhibit(albums) {
  const root = document.querySelector('#interactiveExhibit');
  const points = [
    { label: 'Bàn viết', x: 31.2, y: 64.4, zoom: 1.95, text: 'Bàn gỗ, giấy tờ và các vật dụng trong góc làm việc được tái hiện.' },
    { label: 'Giá sách', x: 54.4, y: 20.1, zoom: 2.15, text: 'Giá sách treo trên vách gỗ, phía trên không gian làm việc.' },
    { label: 'Chiếc võng', x: 74.6, y: 65.8, zoom: 1.85, text: 'Chiếc võng nằm bên cạnh bàn viết trong không gian trưng bày.' },
    { label: 'Mô hình nhân vật', x: 83.1, y: 58.1, zoom: 2.35, text: 'Mô hình nhân vật trong không gian sinh hoạt được tái hiện.' }
  ];
  const overview = { src: 'assets/images/media/interactive-room.jpg', poster: 'assets/images/media/interactive-room.jpg', alt: 'Không gian trưng bày với bàn viết, giá sách, võng và mô hình nhân vật', points };
  const rooms = albums.map((album, i) => i === 0 ? { ...album, images: [overview, ...album.images] } : album);
  root.innerHTML = `
    <div class="exhibit-heading"><div><h2>Khám phá không gian trưng bày</h2><p>Kéo để di chuyển · Phóng to để nhìn gần hơn</p></div><label class="exhibit-room-label">Chọn không gian<select id="exhibitRoom"></select></label></div>
    <div class="exhibit-stage" id="exhibitStage">
      <div class="exhibit-viewport" id="exhibitViewport" tabindex="0" role="region" aria-label="Ảnh tương tác. Dùng phím mũi tên để di chuyển, cộng trừ để phóng to thu nhỏ, số 0 để đặt lại.">
        <div class="exhibit-content" id="exhibitContent"><img id="exhibitImage" alt="" draggable="false"><div id="exhibitPoints"></div></div>
      </div>
      <p class="exhibit-hint" id="exhibitHint">Chọn một dấu tròn để khám phá chi tiết</p>
      <div class="exhibit-controls" role="group" aria-label="Điều khiển ảnh">
        <button type="button" data-exhibit-action="out" aria-label="Thu nhỏ" title="Thu nhỏ"><span data-icon="zoom-out"></span></button><output id="exhibitScale" aria-label="Mức phóng to">100%</output><button type="button" data-exhibit-action="in" aria-label="Phóng to" title="Phóng to"><span data-icon="zoom-in"></span></button><span class="exhibit-control-divider"></span><button type="button" data-exhibit-action="reset" aria-label="Về góc nhìn ban đầu" title="Về góc nhìn ban đầu"><span data-icon="rotate-ccw"></span></button><button type="button" data-exhibit-action="fullscreen" aria-label="Toàn màn hình" title="Toàn màn hình"><span data-icon="maximize"></span></button>
      </div>
      <section class="exhibit-info" id="exhibitInfo" aria-labelledby="exhibitInfoTitle" hidden><button type="button" class="exhibit-close" aria-label="Đóng thông tin">×</button><h3 id="exhibitInfoTitle"></h3><p id="exhibitInfoText"></p></section>
      <p class="exhibit-state" id="exhibitState" role="status" hidden></p>
    </div>
    <div class="exhibit-bottom"><p id="exhibitCaption" aria-live="polite"></p><div class="exhibit-thumbnails" id="exhibitThumbnails" aria-label="Chọn góc nhìn"></div></div>`;
  const el = id => root.querySelector('#' + id);
  const stage = el('exhibitStage'), viewport = el('exhibitViewport'), content = el('exhibitContent'), image = el('exhibitImage');
  const select = el('exhibitRoom'), info = el('exhibitInfo'), state = el('exhibitState');
  let room = rooms[0], index = 0, zoom = 1, x = 0, y = 0, base = 1, width = 0, height = 0, ready = false, active = false, selectedPoint = null, animation = null, loadToken = 0, resetPending = true;
  const pointers = new Map();
  let drag = null, pinch = null, renderFrame = null;
  const reduceMotion = matchMedia('(prefers-reduced-motion: reduce)');
  rooms.forEach(item => { const option = document.createElement('option'); option.value = item.id; option.textContent = item.title; select.append(option); });
  function cancelAnimation() {
    if (animation !== null) cancelAnimationFrame(animation);
    if (renderFrame !== null) cancelAnimationFrame(renderFrame);
    animation = renderFrame = null;
  }
  function clampPosition() {
    const scaledWidth = image.naturalWidth * base * zoom, scaledHeight = image.naturalHeight * base * zoom;
    x = Math.min(0, Math.max(width - scaledWidth, x)); y = Math.min(0, Math.max(height - scaledHeight, y));
  }
  function requestRender() {
    if (renderFrame !== null) return;
    renderFrame = requestAnimationFrame(() => { renderFrame = null; render(); });
  }
  function render() {
    if (!ready || !width || !height) return;
    clampPosition();
    content.style.transform = `translate3d(${x}px, ${y}px, 0) scale(${base * zoom})`;
    content.style.setProperty('--point-scale', 1 / (base * zoom));
    el('exhibitScale').textContent = Math.round(zoom * 100) + '%';
    root.querySelector('[data-exhibit-action="out"]').disabled = zoom <= 1;
    root.querySelector('[data-exhibit-action="in"]').disabled = zoom >= 4;
  }
  function layout(reset = false) {
    if (!ready || !viewport.clientWidth || !viewport.clientHeight) return;
    cancelAnimation();
    const centerX = (width / 2 - x) / (base * zoom), centerY = (height / 2 - y) / (base * zoom);
    width = viewport.clientWidth; height = viewport.clientHeight;
    content.style.width = image.naturalWidth + 'px'; content.style.height = image.naturalHeight + 'px';
    base = Math.max(width / image.naturalWidth, height / image.naturalHeight) * 1.012;
    if (reset || resetPending) { zoom = 1; x = (width - image.naturalWidth * base) / 2; y = (height - image.naturalHeight * base) / 2; resetPending = false; }
    else { x = width / 2 - centerX * base * zoom; y = height / 2 - centerY * base * zoom; }
    render();
  }
  function zoomTo(next, atX = width / 2, atY = height / 2) {
    if (!ready) return;
    cancelAnimation();
    next = Math.min(4, Math.max(1, next)); const ratio = next / zoom;
    x = atX - (atX - x) * ratio; y = atY - (atY - y) * ratio; zoom = next; render();
  }
  function closeInfo(restoreFocus = false) {
    info.hidden = true;
    if (restoreFocus && selectedPoint) selectedPoint.focus({ preventScroll: true });
    root.querySelectorAll('.exhibit-point').forEach(button => button.setAttribute('aria-expanded', 'false'));
    selectedPoint = null;
  }
  function focusPoint(point, button) {
    if (!ready) return;
    cancelAnimation(); closeInfo(); selectedPoint = button;
    button.setAttribute('aria-expanded', 'true');
    el('exhibitInfoTitle').textContent = point.label; el('exhibitInfoText').textContent = point.text; info.hidden = false;
    const start = { x, y, zoom }, targetZoom = point.zoom;
    const targetX = width * (width > 760 ? .38 : .5) - point.x / 100 * image.naturalWidth * base * targetZoom;
    const targetY = height * .44 - point.y / 100 * image.naturalHeight * base * targetZoom;
    const startTime = performance.now();
    function step(now) {
      const t = reduceMotion.matches ? 1 : Math.min(1, (now - startTime) / 360), eased = 1 - Math.pow(1 - t, 3);
      x = start.x + (targetX - start.x) * eased; y = start.y + (targetY - start.y) * eased; zoom = start.zoom + (targetZoom - start.zoom) * eased;
      render(); animation = t < 1 ? requestAnimationFrame(step) : null;
    }
    animation = requestAnimationFrame(step);
  }
  function showImage(next) {
    const token = ++loadToken; index = next; ready = false; resetPending = true; cancelAnimation(); closeInfo();
    pointers.clear(); drag = pinch = null; viewport.classList.remove('is-dragging');
    const item = room.images[index];
    content.hidden = true; state.textContent = 'Đang tải không gian…'; state.hidden = false;
    el('exhibitPoints').replaceChildren();
    el('exhibitHint').textContent = item.points ? 'Chọn một dấu tròn để khám phá chi tiết' : 'Giữ và kéo ảnh · Cuộn hoặc chụm hai ngón tay để phóng to';
    el('exhibitCaption').textContent = `${room.title} · ${index + 1} / ${room.images.length}`;
    root.querySelectorAll('.exhibit-thumb').forEach((button, i) => button.setAttribute('aria-pressed', String(i === index)));
    for (const point of item.points || []) {
      const button = document.createElement('button'); button.type = 'button'; button.className = 'exhibit-point';
      button.style.left = point.x + '%'; button.style.top = point.y + '%'; button.setAttribute('aria-label', point.label); button.setAttribute('aria-expanded', 'false'); button.setAttribute('aria-controls', 'exhibitInfo');
      const label = document.createElement('span'); label.textContent = point.label; button.append(label);
      button.addEventListener('click', () => focusPoint(point, button)); el('exhibitPoints').append(button);
    }
    image.onload = () => { if (token !== loadToken) return; ready = true; state.hidden = true; content.hidden = false; layout(true); };
    image.onerror = () => { if (token !== loadToken) return; state.textContent = 'Không tải được ảnh. Hãy chọn lại góc nhìn để thử lại.'; state.hidden = false; };
    image.alt = item.alt || room.title; image.src = siteUrl(item.src);
    if (image.complete && image.naturalWidth) image.onload();
  }
  function openRoom(id) {
    room = rooms.find(item => item.id === id) || rooms[0]; select.value = room.id;
    el('exhibitThumbnails').replaceChildren();
    room.images.forEach((item, i) => {
      const button = document.createElement('button'); button.type = 'button'; button.className = 'exhibit-thumb'; button.setAttribute('aria-label', `${room.title}, góc nhìn ${i + 1}`);
      const thumbnail = document.createElement('img'); thumbnail.src = siteUrl(item.poster || item.src); thumbnail.alt = ''; thumbnail.loading = 'lazy'; thumbnail.draggable = false;
      const number = document.createElement('span'); number.textContent = String(i + 1).padStart(2, '0'); button.append(thumbnail, number);
      button.addEventListener('click', () => showImage(i)); el('exhibitThumbnails').append(button);
    });
    showImage(0);
  }
  select.addEventListener('change', () => openRoom(select.value));
  root.querySelector('.exhibit-close').addEventListener('click', () => closeInfo(true));
  root.querySelectorAll('[data-exhibit-action]').forEach(button => {
    if (button.dataset.exhibitAction === 'fullscreen' && !document.fullscreenEnabled) button.hidden = true;
    button.addEventListener('click', async () => {
      switch (button.dataset.exhibitAction) {
        case 'in': zoomTo(zoom * 1.25); break;
        case 'out': zoomTo(zoom / 1.25); break;
        case 'reset': closeInfo(); layout(true); break;
        case 'fullscreen':
          try { if (document.fullscreenElement === stage) await document.exitFullscreen(); else await stage.requestFullscreen(); }
          catch { state.textContent = 'Trình duyệt chưa mở được toàn màn hình.'; state.hidden = false; }
          break;
      }
    });
  });
  viewport.addEventListener('wheel', event => {
    if (!active || !ready) return;
    event.preventDefault(); const rect = viewport.getBoundingClientRect();
    const delta = event.deltaY * (event.deltaMode === 1 ? 16 : event.deltaMode === 2 ? height : 1);
    zoomTo(zoom * Math.exp(-delta * .0015), event.clientX - rect.left, event.clientY - rect.top);
  }, { passive: false });
  function startGesture() {
    const values = [...pointers.values()];
    if (values.length === 1) { drag = { ...values[0] }; pinch = null; }
    else {
      const a = values[0], b = values[1], rect = viewport.getBoundingClientRect();
      const midX = (a.x + b.x) / 2 - rect.left, midY = (a.y + b.y) / 2 - rect.top;
      pinch = { distance: Math.hypot(a.x - b.x, a.y - b.y), zoom, imageX: (midX - x) / (base * zoom), imageY: (midY - y) / (base * zoom) }; drag = null;
    }
  }
  viewport.addEventListener('pointerdown', event => {
    if (!active || !ready || event.button !== 0 || event.target.closest('.exhibit-point')) return;
    event.preventDefault();
    viewport.focus({ preventScroll: true });
    cancelAnimation(); pointers.set(event.pointerId, { x: event.clientX, y: event.clientY }); viewport.setPointerCapture(event.pointerId); viewport.classList.add('is-dragging'); startGesture();
  });
  // Prevent the browser's translucent image drag preview from competing with panning.
  root.addEventListener('dragstart', event => event.preventDefault(), true);
  viewport.addEventListener('pointermove', event => {
    if (!pointers.has(event.pointerId)) return;
    event.preventDefault();
    pointers.set(event.pointerId, { x: event.clientX, y: event.clientY });
    if (pinch) {
      const [a, b] = [...pointers.values()], rect = viewport.getBoundingClientRect();
      zoom = Math.min(4, Math.max(1, pinch.zoom * Math.hypot(a.x - b.x, a.y - b.y) / Math.max(1, pinch.distance)));
      x = (a.x + b.x) / 2 - rect.left - pinch.imageX * base * zoom; y = (a.y + b.y) / 2 - rect.top - pinch.imageY * base * zoom;
    } else if (drag) {
      x += event.clientX - drag.x; y += event.clientY - drag.y;
      drag.x = event.clientX; drag.y = event.clientY;
    }
    clampPosition(); requestRender();
  });
  function endGesture(event) {
    if (!pointers.has(event.pointerId)) return;
    pointers.delete(event.pointerId); drag = pinch = null;
    if (pointers.size) startGesture(); else viewport.classList.remove('is-dragging');
    render();
  }
  for (const name of ['pointerup', 'pointercancel', 'lostpointercapture']) viewport.addEventListener(name, endGesture);
  viewport.addEventListener('keydown', event => {
    if (event.target !== viewport || !ready) return;
    if (!['ArrowLeft', 'ArrowRight', 'ArrowUp', 'ArrowDown', '+', '=', '-', '0'].includes(event.key)) return;
    event.preventDefault(); cancelAnimation();
    if (['+', '=', '-'].includes(event.key)) zoomTo(zoom * (event.key === '-' ? .8 : 1.25));
    else if (event.key === '0') { closeInfo(); layout(true); }
    else { x += event.key === 'ArrowLeft' ? 70 : event.key === 'ArrowRight' ? -70 : 0; y += event.key === 'ArrowUp' ? 70 : event.key === 'ArrowDown' ? -70 : 0; render(); }
  });
  root.addEventListener('keydown', event => { if (event.key === 'Escape' && !info.hidden) { event.stopPropagation(); closeInfo(true); } });
  new ResizeObserver(() => layout()).observe(viewport);
  document.addEventListener('fullscreenchange', () => { const button = root.querySelector('[data-exhibit-action="fullscreen"]'); button.setAttribute('aria-label', document.fullscreenElement === stage ? 'Thoát toàn màn hình' : 'Toàn màn hình'); layout(); });
  hydrateIcons(root);
  return {
    setActive(value) { active = value; if (value) { if (!image.getAttribute('src')) openRoom(rooms[0].id); else layout(); } else { cancelAnimation(); pointers.clear(); drag = pinch = null; viewport.classList.remove('is-dragging'); if (document.fullscreenElement === stage) document.exitFullscreen().catch(() => {}); } },
    openAlbumById(id) { if (rooms.some(item => item.id === id)) openRoom(id); }
  };
}
