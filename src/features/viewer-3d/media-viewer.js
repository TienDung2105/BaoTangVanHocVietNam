import * as THREE from 'three';
import { OrbitControls } from '../../vendor/three/OrbitControls.js';
import { GLTFLoader } from '../../vendor/three/GLTFLoader.js';
import { DRACOLoader } from '../../vendor/three/DRACOLoader.js';

export function createModelViewer(container) {
  const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
  renderer.setPixelRatio(Math.min(devicePixelRatio, 1.5));
  renderer.outputColorSpace = THREE.SRGBColorSpace;
  renderer.toneMapping = THREE.ACESFilmicToneMapping;
  renderer.toneMappingExposure = 1.15;
  container.append(renderer.domElement);
  renderer.domElement.setAttribute('aria-label', 'Tượng 3D tương tác');
  renderer.domElement.tabIndex = 0;
  const scene = new THREE.Scene();
  const camera = new THREE.PerspectiveCamera(38, 1, 0.01, 100);
  const controls = new OrbitControls(camera, renderer.domElement);
  controls.enableDamping = true;
  controls.dampingFactor = 0.1;
  controls.enablePan = true;
  controls.autoRotateSpeed = 0.8;
  scene.add(new THREE.HemisphereLight(0xffffff, 0x577261, 2.2));
  const key = new THREE.DirectionalLight(0xfff5e5, 3.2); key.position.set(3, 4, 5); scene.add(key);
  const fill = new THREE.DirectionalLight(0xdbeaff, 1.4); fill.position.set(-3, 2, -2); scene.add(fill);
  const draco = new DRACOLoader();
  draco.setDecoderPath(new URL('../../vendor/three/draco/', import.meta.url).href);
  draco.setWorkerLimit(1);
  const loader = new GLTFLoader().setDRACOLoader(draco);
  let model = null, frame = 0, disposed = false, controller = null, generation = 0, distance = 3.4;
  let enabled = true;
  const reducedMotion = matchMedia('(prefers-reduced-motion: reduce)');

  // Render only during interaction, damping or an explicitly enabled rotation.
  function draw() { frame = 0; if (disposed || !enabled || document.hidden) return; const changed = controls.update(); renderer.render(scene, camera); if (changed || controls.autoRotate) requestDraw(); }
  function requestDraw() { if (!frame && !disposed && enabled && !document.hidden) frame = requestAnimationFrame(draw); }
  controls.addEventListener('change', requestDraw);
  function resize() { const { width, height } = container.getBoundingClientRect(); if (!width || !height) return; camera.aspect = width / height; renderer.setSize(width, height, false); if (model) fit(false); requestDraw(); }
  const observer = new ResizeObserver(resize); observer.observe(container);
  function fit(reset = true) {
    const previousDistance = distance;
    distance = 1.45 / Math.tan(THREE.MathUtils.degToRad(camera.fov / 2)) / Math.min(camera.aspect, 1);
    controls.minDistance = distance * 0.4; controls.maxDistance = distance * 2.5;
    if (reset) { controls.target.set(0, 0, 0); camera.position.set(0, 0.05, distance); controls.update(); controls.saveState(); }
    else camera.position.sub(controls.target).multiplyScalar(distance / previousDistance).add(controls.target);
    camera.near = 0.01; camera.far = distance * 20; camera.updateProjectionMatrix();
  }
  function release(object) {
    const textures = new Set(), materials = new Set(), geometries = new Set();
    object.traverse(child => { if (child.geometry) geometries.add(child.geometry); for (const material of Array.isArray(child.material) ? child.material : child.material ? [child.material] : []) { materials.add(material); for (const value of Object.values(material)) if (value?.isTexture) textures.add(value); } });
    textures.forEach(texture => { texture.source?.data?.close?.(); texture.dispose(); });
    materials.forEach(material => material.dispose()); geometries.forEach(geometry => geometry.dispose());
  }
  async function load(url, onProgress) {
    const token = ++generation; controller?.abort(); controller = new AbortController();
    const response = await fetch(url, { signal: controller.signal });
    if (!response.ok) throw new Error('Không tìm thấy file 3D.');
    const total = Number(response.headers.get('Content-Length'));
    let buffer;
    if (response.body && total) {
      const reader = response.body.getReader(), chunks = []; let received = 0;
      while (true) { const { done, value } = await reader.read(); if (done) break; chunks.push(value); received += value.byteLength; onProgress?.(Math.round(received / total * 100)); }
      const bytes = new Uint8Array(received); let offset = 0; for (const chunk of chunks) { bytes.set(chunk, offset); offset += chunk.byteLength; } buffer = bytes.buffer;
    } else buffer = await response.arrayBuffer();
    if (token !== generation || disposed) return false;
    const gltf = await loader.parseAsync(buffer, new URL('.', url).href);
    if (token !== generation || disposed) { release(gltf.scene); return false; }
    if (model) { scene.remove(model); release(model); }
    model = gltf.scene;
    const bounds = new THREE.Box3().setFromObject(model), size = bounds.getSize(new THREE.Vector3()), center = bounds.getCenter(new THREE.Vector3());
    const scale = 2 / Math.max(size.x, size.y, size.z);
    model.scale.multiplyScalar(scale); model.position.sub(center.multiplyScalar(scale));
    scene.add(model); fit(); resize(); requestDraw(); return true;
  }
  function cancel() { ++generation; controller?.abort(); }
  function action(name) {
    if (!model) return;
    if (name === 'reset') { controls.autoRotate = false; fit(); }
    if (name === 'in' || name === 'out') { const direction = camera.position.clone().sub(controls.target); const length = THREE.MathUtils.clamp(direction.length() * (name === 'in' ? 0.8 : 1.25), controls.minDistance, controls.maxDistance); camera.position.copy(controls.target).add(direction.setLength(length)); }
    if (name === 'rotate') controls.autoRotate = !controls.autoRotate && !reducedMotion.matches;
    controls.update(); requestDraw(); return controls.autoRotate;
  }
  function keyboard(event) { if (['+', '=', '-', '0', 'ArrowLeft', 'ArrowRight'].includes(event.key)) { event.preventDefault(); if (event.key === 'ArrowLeft' || event.key === 'ArrowRight') { camera.position.applyAxisAngle(new THREE.Vector3(0, 1, 0), event.key === 'ArrowLeft' ? -0.15 : 0.15); controls.update(); requestDraw(); } else action(event.key === '0' ? 'reset' : event.key === '-' ? 'out' : 'in'); } }
  renderer.domElement.addEventListener('keydown', keyboard);
  function visibility() { if (document.hidden) { cancelAnimationFrame(frame); frame = 0; } else requestDraw(); }
  document.addEventListener('visibilitychange', visibility);
  resize();
  return { load, cancel, action, setActive(value) { enabled = value; if (!value) { cancelAnimationFrame(frame); frame = 0; } else { resize(); requestDraw(); } }, dispose() { disposed = true; cancel(); cancelAnimationFrame(frame); observer.disconnect(); controls.dispose(); draco.dispose(); if (model) release(model); renderer.dispose(); renderer.forceContextLoss(); renderer.domElement.remove(); document.removeEventListener('visibilitychange', visibility); } };
}
