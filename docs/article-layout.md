# Shared Article Layout

Scope: six existing native artifact articles in `pages/hien-vat/` and seven
news articles in `pages/tin-tuc/`. Listing pages, Media, tickets, navigation,
source image files and article text are unchanged.

The latest request replaces Word-like visual fidelity with a shared editorial
layout. Paragraph alignment, emphasis, wording and image order remain intact;
local Uber Move headings and Proxima body type replace the imported document
fonts. The article title lives in `.article-heading` before `.article-grid`.
Source body paragraphs and figures live inside `.document-article`.

Shared files:

- `assets/css/pages/document-article.css`: title, measure, typography, spacing,
  image sizing, captions, sidebar and responsive layout.
- `src/pages/document-article.js`: copy-link feedback and current-section
  highlighting. Static article content, related links and TOC work without JS.

Desktop uses an 820px reading track with a 280px supplemental track, constrained
by a 1220px shell. Mobile has one column, a collapsed contents disclosure and
related articles after the body. Native details controls are keyboard usable.
Figures retain their natural aspect ratio and center within the reading track,
with 8px image corners. No stretched or cropped article photos.

The table of contents uses real section headings, not generated summaries.
Long document paragraphs mis-tagged as headings are represented as paragraphs,
with their source wording and bold runs preserved. Reading time is estimated
from the existing word count, not represented as publisher metadata. Related
items use existing catalog titles/images and native article URLs.

All thirteen articles were tested at 1440, 768, 390 and 320px. Body text matches
the pre-redesign content after whitespace normalization; every article image
keeps its source URL and order. Image decoding, heading hierarchy, font/color,
related navigation, copy-link action, TOC anchors and horizontal overflow were
checked. No browser errors or failed asset responses were observed.

Intentional detector exceptions: the established cream museum portal, shared
header wrappers and borderless first related section are retained. The latter
has no actual top border in its first-child variant.

The originals are backed up under `backups/article-template-20261014-035013/`.
No commits or pushes were made.
