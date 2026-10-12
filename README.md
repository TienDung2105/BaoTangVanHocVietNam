# Bao Tang Van Hoc Viet Nam

Static multi-page website using HTML, CSS, and ES modules. No framework,
bundler, npm install, or build step is needed to run the site. Open this folder
in VS Code and start Live Server on `index.html`.

## Structure

```text
index.html                     Home page
pages/                         Search, works, exhibitions, news, visiting,
                               events, authors, and tickets page shells
templates/page.html            Starting point for another page
assets/css/base.css            Global tokens and reset
assets/css/components/         Shared component styles
assets/css/pages/              Styles scoped to home and content pages
assets/models/                 GLB copies and catalog.json
src/main.js                    Shared entry for content pages
src/pages/home.js              Home entry
src/components/                Reusable museum-header and its HTML template
src/data/navigation.js         Menu labels and page URLs
src/data/home-slides.js        Home slideshow content
src/features/home-slider.js   Slideshow behavior
src/features/viewer-3d/        3D catalog helper; no viewer implemented yet
backups/before-folder-refactor/ Original index.html, style.css, script.js
```

## Adding a page

1. Copy `templates/page.html` into `pages/`.
2. Replace `{{title}}` and `{{id}}` with the page name and ID.
3. Add its menu entry to `src/data/navigation.js` if needed.
4. Put unique styles in `assets/css/pages/<page>.css` and link that file.
5. Put unique behavior in `src/pages/<page>.js`. Import and call
   `registerSiteHeader()` from `src/components/site-header.js` in that entry.

The menu HTML is maintained only in `src/components/header-template.js`;
its destinations are maintained in `src/data/navigation.js`. `museum-header`
is a native Custom Element, not a library. ES modules and model loading require
an HTTP server, so do not launch the site using `file://`.

The generated content pages are shells with headings and working navigation.
Their content, search, ticket checkout, and other domain workflows still need
to be implemented. A shared footer can be added as another component when its
content is defined.

## 3D assets

Use `loadModelCatalog()` from `src/features/viewer-3d/model-catalog.js` to get
the model metadata and absolute model URLs. Add viewer code to that feature
folder and import it only on pages that display 3D. Do not load Three.js or the
large GLB files on the home page by default.

All original GLB files remain in the project root; website-ready copies are in
`assets/models/`. Existing home content and visual styling are preserved.
# BaoTangVanHocVietNam
