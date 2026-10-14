import { siteUrl } from '../data/navigation.js';
import { hydrateIcons } from './media-icons.js';

// Native scroll snapping handles touch; pointer dragging adds the same gesture for mice.
function enableDragScroll(rail) {
  let drag = null, suppressClickUntil = 0, lastWheel = 0;
  rail.addEventListener('pointerdown', event => {
    if (event.pointerType === 'touch' || event.button !== 0) return;
    drag = { id: event.pointerId, x: event.clientX, left: rail.scrollLeft, moved: false };
  });
  rail.addEventListener('pointermove', event => {
    if (!drag || drag.id !== event.pointerId) return;
    const distance = event.clientX - drag.x;
    if (!drag.moved && Math.abs(distance) < 7) return;
    if (!drag.moved) { drag.moved = true; rail.setPointerCapture(event.pointerId); rail.classList.add('is-dragging'); }
    event.preventDefault(); rail.scrollLeft = drag.left - distance;
  });
  function finish(event) {
    if (!drag || drag.id !== event.pointerId) return;
    if (drag.moved) {
      suppressClickUntil = performance.now() + 350;
      const card = rail.firstElementChild;
      const step = card.getBoundingClientRect().width + parseFloat(getComputedStyle(rail).gap);
      const destination = Math.round(rail.scrollLeft / step) * step;
      rail.classList.remove('is-dragging'); rail.scrollTo({ left: destination, behavior: matchMedia('(prefers-reduced-motion: reduce)').matches ? 'instant' : 'smooth' });
    }
    if (rail.hasPointerCapture(event.pointerId)) rail.releasePointerCapture(event.pointerId);
    drag = null;
  }
  rail.addEventListener('pointerup', finish); rail.addEventListener('pointercancel', finish);
  rail.addEventListener('lostpointercapture', () => { drag = null; rail.classList.remove('is-dragging'); });
  rail.addEventListener('click', event => { if (performance.now() < suppressClickUntil) { event.preventDefault(); event.stopImmediatePropagation(); } }, true);
  rail.addEventListener('wheel', event => {
    if (event.ctrlKey || event.metaKey) return;
    const delta = Math.abs(event.deltaX) > Math.abs(event.deltaY) ? event.deltaX : event.deltaY;
    const next = Math.max(0, Math.min(rail.scrollWidth - rail.clientWidth, rail.scrollLeft + delta));
    if (Math.abs(next - rail.scrollLeft) < 1) return;
    event.preventDefault();
    if (performance.now() - lastWheel < 250) return;
    lastWheel = performance.now();
    const step = rail.firstElementChild.getBoundingClientRect().width + parseFloat(getComputedStyle(rail).gap);
    rail.scrollBy({left: Math.sign(delta) * step, behavior: matchMedia('(prefers-reduced-motion: reduce)').matches ? 'instant' : 'smooth'});
  }, { passive: false });
  rail.addEventListener('keydown', event => {
    if (!['ArrowLeft', 'ArrowRight', 'Home', 'End'].includes(event.key)) return;
    event.preventDefault();
    const step = rail.firstElementChild.getBoundingClientRect().width + parseFloat(getComputedStyle(rail).gap);
    const left = event.key === 'Home' ? 0 : event.key === 'End' ? rail.scrollWidth : rail.scrollLeft + (event.key === 'ArrowLeft' ? -step : step);
    rail.scrollTo({left, behavior: matchMedia('(prefers-reduced-motion: reduce)').matches ? 'instant' : 'smooth'});
  });
}

export function createPhotoGallery(albums, selectPhoto) {
  const home = document.querySelector('#photoGalleryHome'), detail = document.querySelector('#photoGalleryDetail');
  const rail = document.querySelector('#photoGalleryRail'), detailRail = document.querySelector('#photoDetailRail');
  const back = document.querySelector('#photoGalleryBack'), counter = document.querySelector('#photoCounter');
  const stage = document.querySelector('#photoStage'), image = document.querySelector('#inspectPhoto');
  const motion = document.querySelector('#photoMotion'), reduceMotion = matchMedia('(prefers-reduced-motion: reduce)');
  const inlineStates = new WeakMap();
  let coverFrame = null;
  let currentAlbum = null, currentIndex = 0, active = false, paused = false, opener = null;

  function syncMotion() {
    home.classList.toggle('is-moving', active && !document.hidden && !paused && !reduceMotion.matches && !home.hidden);
    motion.setAttribute('aria-pressed', String(paused || reduceMotion.matches));
    motion.textContent = paused || reduceMotion.matches ? 'Tiếp tục chuyển động' : 'Dừng chuyển động';
    motion.disabled = reduceMotion.matches;
  }
  function changeView(update) {
    update();
    scheduleCoverShape();
    if (!reduceMotion.matches) (home.hidden ? detail : home).animate([{opacity:0},{opacity:1}], {duration:250});
  }
  function showImage(index) {
    if (!currentAlbum) return;
    currentIndex = (index + currentAlbum.images.length) % currentAlbum.images.length;
    const item = currentAlbum.images[currentIndex];
    selectPhoto({...item, title: currentAlbum.title, illustration:false});
    image.alt = item.alt || `${currentAlbum.title}, ảnh ${currentIndex + 1}`;
    document.querySelector('#photoStatus').textContent = currentAlbum.coverOnly ? 'Ảnh bìa · Chờ bổ sung ảnh chi tiết' : `${currentAlbum.images.length} ảnh`;
    stage.setAttribute('aria-busy','true');
    const state = document.querySelector('#photoImageState'); state.textContent = 'Đang tải ảnh…';
    image.decode().then(() => {
      if (currentAlbum.images[currentIndex] !== item) return;
      stage.setAttribute('aria-busy','false'); state.textContent = '';
    }).catch(() => {
      if (currentAlbum.images[currentIndex] !== item) return;
      stage.setAttribute('aria-busy','false'); state.textContent = 'Không tải được ảnh. Vui lòng thử lại.';
    });
    document.querySelectorAll('[data-gallery-step]').forEach(button => button.disabled = currentAlbum.images.length < 2);
  }
  function makeCard(item, open, index) {
    const button = document.createElement(open ? 'button' : 'div');
    if (open) button.type = 'button';
    else { button.tabIndex = 0; button.setAttribute('role', 'group'); }
    button.className = 'photo-album';
    button.style.setProperty('--album-index',index); button.setAttribute('aria-label', item.alt || item.title);
    const picture = document.createElement('span'); picture.className = 'photo-album-picture';
    const img = document.createElement('img'); img.src = siteUrl(item.poster); img.alt = item.alt || item.title;
    img.width = 640; img.height = 428; img.draggable = false; img.decoding = 'async'; img.loading = 'lazy';
    picture.append(img); button.append(picture);
    if (open) button.addEventListener('click', open);
    return button;
  }
  function scheduleCoverShape() {
    if (coverFrame !== null) return;
    coverFrame = requestAnimationFrame(() => {
      coverFrame = null;
      if (!rail.clientWidth || home.hidden) return;
      const bounds = rail.getBoundingClientRect();
      for (const card of rail.children) {
        const rect = card.getBoundingClientRect();
        const position = Math.max(-1.5, Math.min(1.5, (rect.left - bounds.left + rect.width / 2 - bounds.width / 2) / (rect.width + parseFloat(getComputedStyle(rail).gap))));
        card.style.setProperty('--cover-angle', `${-position * 8}deg`);
        card.style.setProperty('--cover-left', `${Math.max(0, Math.min(18, 10 + position * 8))}%`);
        card.style.setProperty('--cover-right', `${Math.max(0, Math.min(18, 10 - position * 8))}%`);
        card.style.setProperty('--cover-left-bottom', `${100 - Math.max(0, Math.min(18, 10 + position * 8))}%`);
        card.style.setProperty('--cover-right-bottom', `${100 - Math.max(0, Math.min(18, 10 - position * 8))}%`);
      }
    });
  }
  function enableInlineZoom(card, item) {
    const picture = card.querySelector('.photo-album-picture'), img = picture.querySelector('img');
    const state = {zoom:1, x:0, y:0, drag:null, loaded:false}; inlineStates.set(card,state);
    const tools = document.createElement('div'); tools.className = 'photo-inline-tools';
    const scale = document.createElement('output'); scale.className = 'photo-inline-scale'; scale.setAttribute('aria-label','Mức phóng to'); scale.textContent = '100%';
    function control(icon, label, action) {
      const button = document.createElement('button'); button.type = 'button'; button.title = label; button.setAttribute('aria-label',label);
      const symbol = document.createElement('span'); symbol.dataset.icon = icon; button.append(symbol);
      button.addEventListener('click', action); tools.append(button); return button;
    }
    tools.append(scale);
    function update() {
      const maxX = picture.clientWidth * (state.zoom - 1) / 2, maxY = picture.clientHeight * (state.zoom - 1) / 2;
      state.x = Math.max(-maxX,Math.min(maxX,state.x)); state.y = Math.max(-maxY,Math.min(maxY,state.y));
      img.style.transform = `translate(${state.x}px,${state.y}px) scale(${state.zoom})`;
      card.classList.toggle('is-inline-zoomed',state.zoom > 1);
      card.dataset.zoom = String(state.zoom); scale.textContent = `${Math.round(state.zoom * 100)}%`;
    }
    function zoomTo(next, point = null) {
      const previous = state.zoom; state.zoom = Math.max(1,Math.min(4,next));
      if (point) { const ratio = state.zoom / previous; state.x = point.x - (point.x - state.x) * ratio; state.y = point.y - (point.y - state.y) * ratio; }
      if (state.zoom > 1 && !state.loaded) { state.loaded = true; img.src = siteUrl(item.src); }
      update();
    }
    control('rotate-ccw','Khôi phục ảnh',()=>{state.x = state.y = 0; zoomTo(1);});
    if (document.fullscreenEnabled) control('maximize','Toàn màn hình',async()=>{ try { if (document.fullscreenElement === card) await document.exitFullscreen(); else { if (!state.loaded) { state.loaded = true; img.src = siteUrl(item.src); } await card.requestFullscreen(); } update(); } catch { /* The inline image remains available when fullscreen is unavailable. */ } });
    card.append(tools); hydrateIcons(tools);
    card.addEventListener('wheel', event => {
      if (!event.deltaY || Math.abs(event.deltaX) > Math.abs(event.deltaY)) return;
      event.preventDefault(); event.stopPropagation();
      const rect = picture.getBoundingClientRect();
      const delta = event.deltaY * (event.deltaMode === 1 ? 16 : event.deltaMode === 2 ? rect.height : 1);
      zoomTo(state.zoom * Math.exp(-delta * .0025), {x:event.clientX - rect.left - rect.width / 2,y:event.clientY - rect.top - rect.height / 2});
    }, {passive:false});
    card.addEventListener('pointerdown', event => {
      if (state.zoom <= 1 || event.button !== 0 || event.target.closest('.photo-inline-tools')) return;
      event.preventDefault(); event.stopPropagation();
      state.drag = {id:event.pointerId,x:event.clientX,y:event.clientY,panX:state.x,panY:state.y};
      card.setPointerCapture(event.pointerId); card.classList.add('is-inline-panning');
    });
    card.addEventListener('pointermove', event => {
      if (!state.drag || state.drag.id !== event.pointerId) return;
      event.stopPropagation(); state.x = state.drag.panX + event.clientX - state.drag.x; state.y = state.drag.panY + event.clientY - state.drag.y; update();
    });
    function endPan(event) {
      if (!state.drag || state.drag.id !== event.pointerId) return;
      event.stopPropagation(); state.drag = null; card.classList.remove('is-inline-panning');
      if (card.hasPointerCapture(event.pointerId)) card.releasePointerCapture(event.pointerId);
    }
    card.addEventListener('pointerup',endPan); card.addEventListener('pointercancel',endPan);
    card.addEventListener('lostpointercapture',()=>{state.drag = null; card.classList.remove('is-inline-panning');});
    card.addEventListener('dblclick',event=>{if (event.target.closest('.photo-inline-tools')) return; state.x = state.y = 0; zoomTo(1);});
    card.addEventListener('keydown',event=>{
      if (event.target.closest('.photo-inline-tools') || !['+','=','-','0'].includes(event.key)) return;
      event.preventDefault(); event.stopPropagation();
      if (event.key === '0') { state.x = state.y = 0; zoomTo(1); }
      else zoomTo(state.zoom + (event.key === '-' ? -.25 : .25));
    });
    state.update = update; update();
  }
  function openAlbum(album, button) {
    currentAlbum = album; opener = button;
    detailRail.replaceChildren();
    album.images.forEach((item,index) => { const card = makeCard(item,null,index); enableInlineZoom(card,item); detailRail.append(card); });
    counter.textContent = `${String(album.images.length).padStart(2,'0')} ảnh`;
    changeView(() => { home.hidden = true; detail.hidden = false; detailRail.scrollLeft = 0; syncMotion(); back.focus({preventScroll:true}); });
  }
  albums.forEach((album,index) => {
    const button = makeCard(album, () => openAlbum(album,button), index);
    button.dataset.album = album.id; button.setAttribute('aria-label',`Mở bộ ảnh: ${album.title}`); rail.append(button);
  });
  enableDragScroll(rail); enableDragScroll(detailRail);
  rail.addEventListener('scroll',scheduleCoverShape,{passive:true});
  new ResizeObserver(() => { scheduleCoverShape(); for (const card of detailRail.children) inlineStates.get(card)?.update(); }).observe(rail);
  new ResizeObserver(() => { for (const card of detailRail.children) inlineStates.get(card)?.update(); }).observe(detailRail);
  document.addEventListener('fullscreenchange',()=>{for (const card of detailRail.children) inlineStates.get(card)?.update();});
  back.addEventListener('click', () => changeView(() => { detail.hidden = true; home.hidden = false; syncMotion(); opener?.focus({preventScroll:true}); }));
  motion.addEventListener('click', () => { paused = !paused; syncMotion(); });
  document.querySelector('#photoInspectClose').addEventListener('click', async () => { if (document.fullscreenElement && stage.contains(document.fullscreenElement)) await document.exitFullscreen(); stage.close(); });
  document.querySelectorAll('[data-gallery-step]').forEach(button => button.addEventListener('click', () => showImage(currentIndex + Number(button.dataset.galleryStep))));
  stage.addEventListener('keydown', event => {
    if (document.querySelector('#photoScale').textContent !== '100%') return;
    if (event.key === 'ArrowLeft' || event.key === 'ArrowRight') { event.preventDefault(); event.stopPropagation(); showImage(currentIndex + (event.key === 'ArrowLeft' ? -1 : 1)); }
  }, true);
  detail.addEventListener('keydown', event => { if (event.key === 'Escape' && !stage.open) back.click(); });
  document.addEventListener('visibilitychange', syncMotion); reduceMotion.addEventListener('change',syncMotion);
  return {
    setActive(value) { active = value; if (!value && stage.open) stage.close(); syncMotion(); scheduleCoverShape(); },
    openAlbumById(id) {
      const album = albums.find(item=>item.id===id);
      if (album) openAlbum(album, [...rail.children].find(card=>card.dataset.album===id));
    }
  };
}
