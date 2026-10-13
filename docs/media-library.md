# Media Library

Route: `pages/media.html`. Plain HTML/CSS/JavaScript; shared museum navigation,
footer and local fonts are preserved. Three tabs organize the ten supplied
titles: four videos, three statue models and three inspectable images.

## Replace Content

Edit `assets/data/media-library.json`. All asset paths are relative to the
site root, without a leading slash, so GitHub Pages subfolder hosting works.

- Videos: replace `src: null` with an MP4/WebM path, for example
  `assets/videos/toan-canh.mp4`, and replace `poster` when a real cover is ready.
  Native playback controls appear when a source is supplied. No autoplay or
  fabricated video duration. YouTube page URLs are not direct video sources.
- Photos: replace `src`. Set `illustration: false` after providing the actual
  Nguyen Du or Xom Choi model photos. The classroom uses a supplied real photo.
- Models: `src` points at the optimized web copy; `poster` is rendered from
  that model. Keep the source models intact for higher-detail exports.

## Performance and Controls

Three.js r180, OrbitControls, GLTFLoader and Draco decoder are self-hosted.
Lucide controls are limited to the icons in use, with license retained.
The viewer imports and GLB requests start only after clicking Open 3D.
Only one model is resident; old GPU resources are released on replacement.
Downloads are cancellable; stale loads cannot replace a newly selected item.
Rendering pauses for hidden tabs/pages; automatic rotation requires a click.
Pixel ratio is capped at 1.5. Native video uses preload=none and pauses when
leaving its tab.

Original GLB files are unchanged. Web copies are about 16.7, 10.0 and 10.4 MB
in decimal units. Ba Huyen Thanh Quan retains its mesh with Draco compression;
the other two have simplified meshes. Texture dimensions are capped at 1536px.
The gitignore exception permits only `assets/models/web/*.glb` to be published.
Original GLBs remain ignored. No code was committed or pushed automatically.

The image viewer supports 100-400% zoom, constrained drag/pan, reset and
fullscreen. Plus/minus/zero keys control zoom; arrow keys pan a zoomed photo.
Tabs support arrow/Home/End navigation. Buttons include accessible names and
native title tooltips. Errors remain visible with retry on model loads.

## Verification

Playwright checked 1920, 1440, 768, 390 and 320px layouts, image controls,
keyboard tabs, fullscreen, empty video states and lazy loading. All three
models were rendered at desktop/mobile sizes, with screenshot pixel bounds
checking nonblank canvases and complete framing; zoom and rotation changed
the rendered pixels. No failed asset requests or page errors were observed.

Intentional design exceptions: the existing cream museum shell and shared
header structure are retained. The image inspection surface uses contain
to avoid discarding image details; thumbnail frames use cover. Viewer controls
overlay the scene at an edge rather than introducing a nested decorative card.
