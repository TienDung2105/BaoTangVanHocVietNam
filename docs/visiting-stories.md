# Visiting and Museum Stories

Implemented in the existing vanilla project, preserving the homepage menu and navigation prefetch.

## Design references

- Drive: `5. MỤC THAM QUAN` and `6. MỤC CHUYỆN BẢO TÀNG`.
- Reviewed all 102 PNG files: overview images plus grouped title, category, CTA, divider and image-frame layers.
- These folders contain PNG exports, not separate PDF files. Full-page references are both 5333 x 8167.
- Kept the shared header instead of the different menu in the new mockups, as requested previously.
- Qalogre: italic page titles and featured number. Uber Move: story titles. Proxima: descriptions, categories and controls. Nexa: shared menu. Visiting detail copy uses Brother regular.

## Replacing content

Edit `assets/data/collections.json`, under `visiting` or `stories`.

- `image`: local filename under `assets/images/home`, or a site-relative asset path.
- `imageAlt`: describe the actual photo, especially when it is illustrative.
- `imagePosition`: optional CSS object-position.
- `body`: paragraph strings for detail pages.
- `actions`: optional `{label, href}` links, e.g. contact email.
- `destination`: listing link override, e.g. Media or directions.

All supplied image frames were empty; existing optimized museum photos are temporary and flagged `temporaryImage: true`. They are illustrative, not verified photos of every named object or floor. The floor-plan detail remains explicitly pending until a real diagram is supplied. Missing long-form story text also displays a pending state rather than an invented article.

Hours and ticket prices transcribe the user's supplied copy, not a fresh verification of current museum policy. Group registration opens an email; it does not claim to send or confirm a booking.

## Navigation and performance

Static menu markup and reserved dimensions prevent late JS insertion from moving content. Existing hover/focus prefetch, stable scrollbar gutter, local font files, fixed image aspect ratios and lazy below-fold images remain in place. The new page fonts are preloaded. No external frameworks, router, animation library or 3D model download is introduced by these pages.

## Verification

Checked both pages at 1920, 1440, 1025, 768 and 390 pixels: no horizontal overflow, overflowing heading text, missing images, failed requests or JavaScript exceptions. Menu bounds matched the homepage at each size. All 12 internal detail links, email registration, mobile menu/Escape, a JavaScript-disabled static menu and GitHub Pages-style subfolder paths passed. Local Chromium measured zero layout shift for these page loads; this is a local result, not a guarantee for every device or connection.

The detector's cream-palette warning is intentional reference fidelity. Its header-wrapper padding warnings are false positives for these wrappers: actual text is inset by shared nav padding and individual mobile link padding. No per-page menu overrides were added to satisfy those warnings.
