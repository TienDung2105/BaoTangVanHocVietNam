# 3D Models

The website-ready copies are stored here with ASCII filenames:

| Model | File | Approximate size |
| --- | --- | --- |
| BHTQ | `bhtq.glb` | 158.31 MiB |
| Le Quy Don | `le-quy-don.glb` | 69.61 MiB |
| Nguyen Khuyen | `nguyen-khuyen.glb` | 71.73 MiB |

`catalog.json` lists the models. Its `url` fields are relative to the website
root (`index.html`), not this directory. Display names retain Vietnamese accents.

The original GLB files remain in the project root. These copies have identical
contents; only their filenames and locations differ. No geometry, materials,
textures, or animations have been altered.

The current website does not yet have a 3D viewer. When adding one, use
`GLTFLoader` to load only the selected model. Avoid preloading all three large
files. Run the website through Live Server or another HTTP server.

Example path from a future `js/model-viewer.js`:

```js
const modelUrl = new URL('../assets/models/le-quy-don.glb', import.meta.url);
const gltf = await loader.loadAsync(modelUrl.href);
scene.add(gltf.scene);
```
