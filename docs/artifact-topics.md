# Artifact introductions and shared dropdown

The main header on every page contains a hover/focus dropdown below `Hiện vật`, with the three supplied topic titles. Each link opens `pages/trung-bay.html?topic=<id>`; selecting a topic while already on that page switches the introduction in place, without reloading. The duplicate in-page tab bar is removed for all three topic views; the main-header dropdown is the only topic selector.

Mobile navigation includes a dedicated 44px submenu toggle with expanded state. Escape closes the desktop dropdown and mobile menu. Plain anchors remain usable without JavaScript.

The ancient-literature topic has four supplied cards and count `4 bài viết`; the Ho Chi Minh Award topic has two supplied cards and count `2 bài viết`; the State Award topic retains the old six-card grid and count `6 bài viết`. The extra list heading, rule, pending, unclassified and zero-count notices are removed. No existing articles, catalog records, images, fonts or model files were deleted. Two former large featured blocks remain removed from the listing.

The ancient-topic image/title mapping is documented in `docs/ancient-artifacts.md`; the second topic is documented in `docs/hcm-artifacts.md`. Until the user supplies its article list, the State Award topic retains the original six cards. Topic titles and description copy remain in the static page and `assets/data/artifact-topics.json`; no additional award classification is inferred.

The menu is pre-rendered in HTML and mirrored in the shared template. Header height, primary menu spacing, native links, font preloads, hover/focus prefetch, reserved image dimensions and lazy image behavior are preserved. No framework or large new dependency is loaded.
