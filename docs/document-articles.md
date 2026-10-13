# Four native document articles

Implemented in plain HTML/CSS/ES modules from Google Doc `1hl7eKHkqK20O4KIjNHZaem0UMf299wNMt3SiC3W2HPs`:

| Source tab | Source title | HTML file | Images |
| --- | --- | --- | --- |
| `t.hozqbtpljodb` | Chữ viết được thể hiện trên chất liệu gì? | `pages/hien-vat/chu-viet.html` | 6 |
| `t.bwjo0so1rqff` | Làm giấy dó thủ công | `pages/hien-vat/giay-do.html` | 3 |
| `t.qsgznhdwuzmo` | Văn học đời Trần | `pages/hien-vat/van-hoc-tran.html` | 3 |
| `t.yfsotb3bbqa` | Mô hình dạy học thời phong kiến | `pages/hien-vat/lop-hoc.html` | 2 |

The native Docs resource, paragraph styles, text runs, inline image objects, display dimensions and crop offsets were read. Content is escaped during conversion; document text is never executed as HTML or JS. The conversion preserves all supplied text, bold/italic runs, named-heading semantics, paragraph alignment, first-line indents, spacing and image/caption order. Where the source has a dangling sentence, it stays dangling rather than being silently rewritten.

Body predominantly uses Times New Roman 14pt (18.6667px); titles use 18pt (24px). Line spacing and paragraph margins follow each actual source paragraph, including any exceptions to the prevalent 1.5 spacing. The A4 text measure is 451.2756pt (601.701px) on desktop. Mobile narrows the measure without changing the specified text sizes. No Google Fonts network dependency is needed for the supplied system fonts.

Fourteen real embedded images are downloaded, source crops applied and locally encoded as WebP under `assets/images/articles/<slug>/`. Their display width and aspect ratio match the Docs image dimensions, constrained to the available viewport. Captions span the article measure even when the preceding image is narrower. Native figure margins are reset, avoiding browser-added 40px gutters.

The existing portal header/dropdown and footer are retained outside the white document-reading band. The article content is fully static and usable without JavaScript. `src/pages/document-article.js` only activates shared navigation/footer; it fetches no article text. `assets/css/pages/document-article.css` owns the reading layout.

Ancient listing cards now directly link to these four HTML pages. The earlier `bai-viet.html?collection=exhibitions&id=co-trung-dai-...` URLs redirect to their native article via `documentPage` in the catalog. Other detail-page behavior is unchanged. Back links return to the ancient topic; no other topic, card image crop or two-by-two listing layout changes.

Verified four articles at 1440, 768, 390 and 320px: all text matches the corresponding source tab after whitespace normalization, all fourteen images/captions load, no horizontal overflow or JavaScript errors, all new/legacy links and topic-aware Back links work, old unrelated details remain functional, and GitHub Pages-style subfolder paths resolve.

The source's Times/Arial runs, understated heading hierarchy and alignment are deliberate reference fidelity. Detector warnings about cream or wrapper padding refer to incumbent portal surfaces, not a request to redesign the document. Original source snapshots and temporary image URLs are kept only in staging, not shipped into the site.
