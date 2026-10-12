# Homepage PSD Implementation

Reference: `PSD TRANG CHU.psd` supplied by the user, 5333 x 19851 pixels.
Drive folder: https://drive.google.com/drive/folders/1V6QF2TXaig6jKlKL_vO32dQs40fDQY6i

## Source Review

- Enumerated the Drive root and all 14 section/subsection folders.
- Inspected 98 PNG assets and all eight supplied font files.
- Read the one-page `web .pdf` overview with its text and page dimensions.
  Full PDF raster rendering exceeded available resources; the PSD composite
  was used for pixel reference instead.
- Read PSD layer bounds, text, font styles, visibility, and composite image.
- Inspected the three statue GLB structures. Textures are embedded and no
  external image references are required. Existing GLB files remain intact.
- The root Drive `3d.glb` is the earlier Phuong model and is not part of the
  PSD homepage composition. No additional 3D region was invented for the home.

## Implemented

Measured desktop layout: hero, introduction, visiting information, exploration,
artifacts, museum stories, news, footer. Existing page routes are preserved.
Home content is semantic HTML with local fonts and images; the page is not a
single screenshot. The existing native shared header remains reusable.

The source PNG exports do not always match the PSD. The source PSD supplies
the historical hero photo, logo, artifact background, and lute image.
The source PSD is authoritative for copy and asset identity.

Some footer layers use Myriad Pro, absent from the provided fonts. Original
footer text PNGs preserve desktop lettering; semantic text remains present,
and mobile displays text using supplied Proxima Nova.

## Code Map

- `index.html`: semantic sections and measured region positions.
- `assets/css/base.css`: local font faces, design tokens, global rules.
- `assets/css/components/header.css`: shared navigation.
- `assets/css/pages/home.css`: desktop PSD region geometry and mobile flow.
- `src/data/home-slides.js`: slide text and state.
- `src/features/home-slider.js`: manual slider and pagination.
- `src/features/home-news.js`: news selection and accessible pressed state.
- `assets/images/home/`: 40 optimized image assets used by the page.
- `assets/fonts/`: eight original font files with ASCII filenames.
- `design-source/drive-inventory.json`: supplied asset metadata.

## Verification

Chromium/Playwright tested widths 1920, 1440, 768, 390. Local images and fonts
loaded, no horizontal overflow, mobile menu and Escape worked, each of the
four slides activated correctly, news selection worked. The 1920px page and
reference both measure 7147px tall. Mean sampled RGB error is 8.04/255; this
is a comparison measurement, not a claim of pixel-perfect identity.

Bounding rectangles of some introduction text regions overlap in the source
PSD. Rendered glyphs were visually inspected; their ink does not collide.
Mobile uses normal readable flow because no mobile PSD was supplied.

Impeccable detector ran once. Its cream-palette, capitalization, tight-leading,
and contrast advisories concern explicit source-design choices. These were
preserved rather than replacing the user's visual specification. No blanket
accessibility compliance claim is made.

## Scope and Remaining Work

The request implemented the home page. Existing destination pages are still
shells. Search, news articles, bookings, payments, official social destinations,
and 3D exhibition behavior need their own content and workflow requirements.
No fabricated backend or purchase success was added.

Previous changed source files are in `backups/home-before-psd/`.
