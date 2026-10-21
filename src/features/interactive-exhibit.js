import { siteUrl } from '../data/navigation.js';
import { hydrateIcons } from './media-icons.js';

export function createInteractiveExhibit() {
  const root = document.querySelector('#interactiveExhibit');
  const rooms = [
    { id: 'album-1', title: 'Không gian sinh hoạt', description: 'Khám phá những chi tiết trong không gian sinh hoạt được tái hiện.', images: [{ src: 'assets/images/media/interactive-left.png', alt: 'Không gian sinh hoạt với vách tre, quang gánh và các mô hình nhân vật', points: [
      { label: 'Quang gánh', x: 18, y: 69, zoom: 2, text: 'Quang gánh trong không gian sinh hoạt được tái hiện.' },
      { label: 'Vách tre', x: 24, y: 28, zoom: 1.9, text: 'Những nan tre đan trên vách của không gian trưng bày.' },
      { label: 'Bếp lửa', x: 53, y: 76, zoom: 2.1, text: 'Góc bếp với những viên gạch và vật dụng sinh hoạt.' },
      { label: 'Góc sinh hoạt', x: 83, y: 68, zoom: 1.8, text: 'Các mô hình nhân vật trong một cảnh sinh hoạt.' }
    ] }] },
    { id: 'album-2', title: 'Góc làm việc', description: 'Ghé gần bàn viết, giá sách và chiếc võng trong gian nhà.', images: [{ src: 'assets/images/media/interactive-center.png', alt: 'Góc làm việc với bàn viết, giá sách và mô hình nhân vật bên chiếc võng', points: [
      { label: 'Bàn viết', x: 31.2, y: 64.4, zoom: 1.95, text: 'Bàn gỗ, giấy tờ và các vật dụng trong góc làm việc được tái hiện.' },
      { label: 'Giá sách', x: 54.4, y: 20.1, zoom: 2.15, text: 'Giá sách treo trên vách gỗ, phía trên không gian làm việc.' },
      { label: 'Chiếc võng', x: 74.6, y: 65.8, zoom: 1.85, text: 'Chiếc võng nằm bên cạnh bàn viết trong không gian trưng bày.' },
      { label: 'Mô hình nhân vật', x: 83.1, y: 58.1, zoom: 2.35, text: 'Mô hình nhân vật trong không gian sinh hoạt được tái hiện.' }
    ] }] },
    { id: 'album-3', title: 'Lớp học xưa', description: 'Quan sát thầy giáo, sách và không gian lớp học được tái hiện.', images: [{ src: 'assets/images/media/interactive-right.png', alt: 'Không gian lớp học xưa với thầy giáo, học trò và sách trên bàn', points: [
      { label: 'Thầy giáo', x: 62, y: 37, zoom: 2.1, text: 'Mô hình thầy giáo ở vị trí trung tâm lớp học.' },
      { label: 'Sách trên bàn', x: 61, y: 50, zoom: 2.4, text: 'Những trang sách mở trên bàn trong không gian lớp học.' },
      { label: 'Hòm sách', x: 43, y: 45, zoom: 2.3, text: 'Chiếc hòm được đặt bên cạnh sách và vật dụng trên bàn.' },
      { label: 'Học trò', x: 29, y: 64, zoom: 1.85, text: 'Các mô hình học trò ngồi trên chiếu, hướng về phía thầy giáo.' }
    ] }] }
  ];
  root.innerHTML = `
    <section class="exhibit-gallery" aria-labelledby="exhibitGalleryTitle">
      <h2 id="exhibitGalleryTitle">Chọn không gian khám phá</h2>
      <p class="exhibit-gallery-intro">Ba góc nhìn, những câu chuyện qua từng chi tiết. Chọn một ảnh để bắt đầu.</p>
      <div class="exhibit-tours" id="exhibitTours"></div>
      <p class="exhibit-gallery-note">Kéo ảnh để di chuyển · Chọn dấu tròn để phóng tới chi tiết</p>
    </section>
    <dialog class="exhibit-dialog" id="exhibitDialog" aria-labelledby="exhibitViewerTitle">
    <div class="exhibit-stage" id="exhibitStage">
      <h2 class="sr-only" id="exhibitViewerTitle"></h2>
      <div class="exhibit-viewport" id="exhibitViewport" tabindex="0" role="region" aria-label="Ảnh tương tác. Dùng phím mũi tên để di chuyển, cộng trừ để phóng to thu nhỏ, số 0 để đặt lại.">
        <div class="exhibit-content" id="exhibitContent" hidden><img id="exhibitImage" alt="" draggable="false"><div id="exhibitPoints"></div></div>
      </div>
      <p class="exhibit-hint" id="exhibitHint">Chọn một dấu tròn để khám phá chi tiết</p>
      <div class="exhibit-controls" role="group" aria-label="Điều khiển ảnh">
        <button type="button" data-exhibit-action="out" aria-label="Thu nhỏ" title="Thu nhỏ"><span data-icon="zoom-out"></span></button><output id="exhibitScale" aria-label="Mức phóng to">100%</output><button type="button" data-exhibit-action="in" aria-label="Phóng to" title="Phóng to"><span data-icon="zoom-in"></span></button><span class="exhibit-control-divider"></span><button type="button" data-exhibit-action="left" aria-label="Di chuyển sang trái" title="Di chuyển sang trái"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" aria-hidden="true"><path d="m14 6-6 6 6 6"/></svg></button><button type="button" data-exhibit-action="right" aria-label="Di chuyển sang phải" title="Di chuyển sang phải"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" aria-hidden="true"><path d="m10 6 6 6-6 6"/></svg></button><button type="button" data-exhibit-action="reset" aria-label="Về góc nhìn ban đầu" title="Về góc nhìn ban đầu"><span data-icon="rotate-ccw"></span></button><button type="button" data-exhibit-action="fullscreen" aria-label="Quay lại chọn không gian" title="Quay lại chọn không gian"><span data-icon="maximize"></span></button>
      </div>
      <section class="exhibit-info" id="exhibitInfo" aria-labelledby="exhibitInfoTitle" hidden><button type="button" class="exhibit-close" aria-label="Đóng thông tin">×</button><h3 id="exhibitInfoTitle"></h3><p id="exhibitInfoText"></p></section>
      <p class="exhibit-state" id="exhibitState" role="status" hidden></p>
    </div>
    </dialog>`;
  const el = id => root.querySelector('#' + id);
  const stage = el('exhibitStage'), viewport = el('exhibitViewport'), content = el('exhibitContent'), image = el('exhibitImage');
  const dialog = el('exhibitDialog'), info = el('exhibitInfo'), state = el('exhibitState');
  let room = rooms[0], index = 0, zoom = 1, x = 0, y = 0, base = 1, width = 0, height = 0, ready = false, active = false, selectedPoint = null, animation = null, loadToken = 0, resetPending = true;
  const pointers = new Map();
  let drag = null, pinch = null, renderFrame = null;
  const reduceMotion = matchMedia('(prefers-reduced-motion: reduce)');
  let opener = null, ownsFullscreen = false;
  rooms.forEach(item => {
    const button = document.createElement('button'); button.type = 'button'; button.className = 'exhibit-tour';
    button.setAttribute('aria-haspopup', 'dialog'); button.setAttribute('aria-label', 'Khám phá ' + item.title.toLocaleLowerCase('vi'));
    const photo = document.createElement('img'); photo.src = siteUrl(item.images[0].src); photo.alt = item.images[0].alt; photo.loading = 'lazy'; photo.width = 2048; photo.height = 1368;
    const copy = document.createElement('span'); copy.className = 'exhibit-tour-copy';
    const title = document.createElement('strong'); title.textContent = item.title;
    const description = document.createElement('span'); description.textContent = item.description;
    const action = document.createElement('span'); action.className = 'exhibit-tour-action'; action.textContent = 'Khám phá không gian';
    copy.append(title, description, action); button.append(photo, copy);
    button.addEventListener('click', () => { opener = button; openRoom(item.id); }); el('exhibitTours').append(button);
  });
  function collapse() {
    cancelAnimation(); closeInfo(); pointers.clear(); drag = pinch = null;
    viewport.classList.remove('is-dragging');
    if (ownsFullscreen && document.fullscreenElement === document.documentElement) document.exitFullscreen().catch(() => {});
    ownsFullscreen = false;
    dialog.close(); document.body.classList.remove('exhibit-is-open'); opener?.focus({ preventScroll: true });
  }
  dialog.addEventListener('cancel', event => { event.preventDefault(); collapse(); });
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
  function positionInfo() {
    if (info.hidden || !selectedPoint) return;
    const bounds = stage.getBoundingClientRect(), point = selectedPoint.getBoundingClientRect();
    const margin = 12, gap = 16, radius = point.width / 2;
    const centerX = point.left + radius - bounds.left;
    const centerY = point.top + point.height / 2 - bounds.top;
    const panelWidth = info.offsetWidth, panelHeight = info.offsetHeight;
    const controls = root.querySelector('.exhibit-controls').getBoundingClientRect();
    const maxLeft = Math.max(margin, bounds.width - panelWidth - margin);
    const maxTop = Math.max(margin, controls.top - bounds.top - panelHeight - margin);
    let left, top;
    if (centerX + radius + gap + panelWidth <= bounds.width - margin) {
      left = centerX + radius + gap; top = centerY - panelHeight / 2;
    } else if (centerX - radius - gap - panelWidth >= margin) {
      left = centerX - radius - gap - panelWidth; top = centerY - panelHeight / 2;
    } else {
      left = centerX - panelWidth / 2;
      top = centerY + radius + gap;
      if (top > maxTop) top = centerY - radius - gap - panelHeight;
    }
    info.style.left = Math.max(margin, Math.min(maxLeft, left)) + 'px';
    info.style.top = Math.max(margin, Math.min(maxTop, top)) + 'px';
    info.classList.add('is-positioned');
  }
  function render() {
    if (!ready || !width || !height) return;
    clampPosition();
    content.style.transform = `translate3d(${x}px, ${y}px, 0) scale(${base * zoom})`;
    content.style.setProperty('--point-scale', 1 / (base * zoom));
    el('exhibitScale').textContent = Math.round(zoom * 100) + '%';
    root.querySelector('[data-exhibit-action="out"]').disabled = zoom <= 1;
    root.querySelector('[data-exhibit-action="in"]').disabled = zoom >= 4;
    positionInfo();
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
    info.classList.remove('is-positioned');
    if (restoreFocus && selectedPoint) selectedPoint.focus({ preventScroll: true });
    root.querySelectorAll('.exhibit-point').forEach(button => button.setAttribute('aria-expanded', 'false'));
    selectedPoint = null;
  }
  function focusPoint(point, button) {
    if (!ready) return;
    cancelAnimation(); closeInfo(); selectedPoint = button;
    button.setAttribute('aria-expanded', 'true');
    el('exhibitInfoTitle').textContent = point.label; el('exhibitInfoText').textContent = point.text; info.hidden = false; positionInfo();
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
    el('exhibitViewerTitle').textContent = room.title;
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
    room = rooms.find(item => item.id === id) || rooms[0];
    // Enter native screen fullscreen directly from the click, before opening the modal.
    if (document.fullscreenEnabled && !document.fullscreenElement) {
      document.documentElement.requestFullscreen({ navigationUI: 'hide' }).then(() => {
        ownsFullscreen = true;
        if (!dialog.open) { ownsFullscreen = false; document.exitFullscreen().catch(() => {}); }
      }).catch(() => {
        state.textContent = 'Trình duyệt chưa cho phép toàn màn hình. Hãy kiểm tra quyền toàn màn hình của trang.';
        state.hidden = false;
      });
    }
    if (!dialog.open) { dialog.showModal(); document.body.classList.add('exhibit-is-open'); }
    showImage(0); viewport.focus({ preventScroll: true });
  }
  root.querySelector('.exhibit-close').addEventListener('click', () => closeInfo(true));
  root.querySelectorAll('[data-exhibit-action]').forEach(button => {

    button.addEventListener('click', async () => {
      switch (button.dataset.exhibitAction) {
        case 'in': zoomTo(zoom * 1.25); break;
        case 'out': zoomTo(zoom / 1.25); break;
        case 'left': cancelAnimation(); x += width * .18; render(); break;
        case 'right': cancelAnimation(); x -= width * .18; render(); break;
        case 'reset': closeInfo(); layout(true); break;
        case 'fullscreen': collapse(); break;
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
  root.addEventListener('keydown', event => { if (event.key === 'Escape' && !info.hidden) { event.preventDefault(); event.stopPropagation(); closeInfo(true); } });
  new ResizeObserver(() => layout()).observe(viewport);
  document.addEventListener('fullscreenchange', () => {
    if (document.fullscreenElement === document.documentElement && dialog.open) ownsFullscreen = true;
    else if (ownsFullscreen && !document.fullscreenElement) {
      ownsFullscreen = false;
      if (dialog.open) collapse();
    }
    layout();
  });
  hydrateIcons(root);
  return {
    setActive(value) { active = value; if (value) { if (dialog.open) layout(); } else { if (dialog.open) collapse(); cancelAnimation(); pointers.clear(); drag = pinch = null; viewport.classList.remove('is-dragging');  } },
    openAlbumById(id) { if (rooms.some(item => item.id === id)) openRoom(id); }
  };
}
