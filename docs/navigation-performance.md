# Navigation Performance

The existing multi-page structure and normal links are retained. No SPA router,
framework, artificial loading delay, or click interception was added.

- Every page has a static header rendered from the shared template, so menu
  geometry and links exist before JavaScript loads. The custom element upgrades
  that markup with mobile-menu and current-page behavior.
- Header height is reserved at existing breakpoints.
- The menu's local Nexa font and logo are preloaded, alongside shared JS modules.
- Hover/focus prefetches up to six same-origin menu destinations. Data-saving and
  2G connections opt out. Browsers may choose not to honor the prefetch hint.
- Ordinary cross-document navigation is retained. An experimental native-view
  transition introduced aborted-transition errors during browser testing and was
  removed; the optimization does not depend on that API or animations.
- A stable scrollbar gutter prevents centering shifts on shorter pages.

Header CSS and template still own the shared menu appearance. The static header
in HTML is the no-JavaScript fallback; keep it consistent when editing markup.
No cache-first service worker was added, so later code/image updates are not
hidden behind an application-managed stale cache.

In a controlled Chromium test at 1440px, with 100ms network latency and
180,000 bytes/second throughput, Media's load-time layout-shift sum decreased
from approximately 0.04146 to 0.00068. The main-content shift caused by late
header insertion was eliminated. This is a local test, not a guarantee of
instant navigation or a field Core Web Vitals measurement.
