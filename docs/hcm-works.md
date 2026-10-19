# Tác phẩm: Các nhà văn Giải thưởng Hồ Chí Minh

Source: Google Doc `1IjbkCDCQQnXfSUp-BE3QUJwDw1bfbLSX_io-3StDfY0`, tab `t.0`.
This import uses only tab `t.0`. Three thumbnail links are mapped in document order.
The State Award works from tab `t.73acs0pj0m3e` are documented in `state-works.md`.

- Những cánh hoa tàn - Nam Cao: `pages/tac-pham/nhung-canh-hoa-tan.html`
- Hai người ăn Tết lạ – Nam Cao: `pages/tac-pham/hai-nguoi-an-tet-la.html`
- Nụ cười Võ Thị Thắng – Tế Hanh: `pages/tac-pham/nu-cuoi-vo-thi-thang.html`

The source wording, emphasis, paragraph order, poem lines, stanza breaks and
closing credits are preserved. Editorial labels (Thumbnail, Tiêu đề and ND)
are excluded from published body text. Source spelling has not been rewritten.
Images are local under `assets/images/works/ho-chi-minh/`.

Metadata lives in `assets/data/works.json`; static listing cards live in
`pages/trung-bay.html`. When adding another work, update the manifest, static
card and search index, and create a static article using the shared reading
layout. Set the card's `data-work-topic` to its menu topic. Counts and filtering
are derived from the cards; no framework or build step is required.

The top-level Tác phẩm tab aggregates all work cards. Topic pages filter the
same cards, while preserving the Hiện vật and Tác phẩm tabs. For example,
`pages/trung-bay.html?topic=ho-chi-minh&tab=works#tac-pham`.
The seven existing artifact articles and their routes remain intact.
