# Collection Pages

## Design Sources

The shared Google Drive folder was inventoried on 2026-10-13. It contains four
new collections with 214 exported PNG assets: Explore, Media, Artifacts, News.
Each collection includes a full-page overview and individual section/text exports.
No separate PDF for these four collections was present in the shared folder.
The root `web.pdf` is the already-supplied homepage reference.

The new page compositions follow the collection overview PNGs, with supplied
local fonts: Qalogre for display headings, Uber Move Bold for article titles,
Proxima Nova for navigation, descriptions, links, and footer.
Native responsive Grid/Flex layouts preserve semantic, selectable text.

Skill direction: preservation, not a visual overhaul. DESIGN_VARIANCE=4,
MOTION_INTENSITY=2, VISUAL_DENSITY=4, matching the supplied editorial templates.
Impeccable and Taste defaults that conflict with the explicit reference are not
applied: the source cream palette, serif titles, 3-column item grid, and split
heading are intentional. Muted text is slightly darker than the source to meet
body-text contrast against the paper background.

## Pages

- `pages/trung-bay.html`: 2 featured artifacts and 6 article cards.
- `pages/kham-pha.html`: 1 featured article and 6 article cards.
- `pages/media.html`: 1 featured media item and 9 item cards.
- `pages/tin-tuc.html`: 1 featured article and 6 article cards.
- `pages/bai-viet.html`: item detail, ready for supplied article copy/video URLs.

Existing homepage code, news-overlap behavior, routes, and local models are preserved.
The shared footer is used only on these new pages. Header styling is scoped to
`.collection-page`, so it does not alter the homepage or other existing pages.

## Replace Images and Content

`assets/data/collections.json` lists every item and its temporary image.
All images are existing real museum photographs used as replacements for the
empty source-design rectangles; they do not claim to depict the named item.
`temporaryImage: true` records each placement that needs designer-approved media.

Updating an `image` in JSON updates both listing and detail photos automatically.
Use an existing filename from `assets/images/home`, or a root-relative project
path such as `assets/images/collections/new-photo.jpg`. Add the image file there.
The listing HTML also contains static fallbacks for catalog/network failure.
Keep width, height, and the photographic wrapper intact when editing markup.

Add a `body` array of paragraphs to an item to populate its detail text.
Add `video` with a playable URL to populate its native HTML video player.
No video files or article-body copy were supplied, so detail views show an honest
updating-content state. They do not fabricate an article or playable video.
The existing ignored GLB files are not published or automatically loaded here.

The source news claim about Anne Carson/Nobel 2026 is reproduced as supplied,
not independently verified; verify editorial facts before publishing.

## Stack and Verification

No framework, build tool, NPM dependency, or external font/image service is
required at runtime. Use Live Server on root `index.html`.
Desktop follows the provided compositions; tablet switches to two columns,
phone switches to one. Temporary images make image slots inspectable.

Verified all four pages at 1920, 1440, 1025, 768 and 390px, with no horizontal
overflow, failed image loads, or overflowing headings. Checked all 32 detail
links, mobile menu/Escape, unknown-item state, and a GitHub-Pages-style URL prefix.
No JavaScript errors or missing asset responses occurred. This is not a claim
of exact pixel identity or a measured Lighthouse/Core Web Vitals score.
