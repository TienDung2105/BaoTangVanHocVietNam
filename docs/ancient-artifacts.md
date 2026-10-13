# Ancient literature: four supplied artifacts

Source: Google Doc `1MZ-eixGG1OPYbqpAdAXMVb45bTAF3Tq2uTcZXFSMZ6o`. Read text and exported its embedded images. DOCX paragraph image relationships establish the exact mapping:

1. Chữ viết được thể hiện trên chất liệu gì? - rId6 / image3.jpg.
2. Làm giấy dó thủ công - rId7 / image1.png.
3. Văn học đời Trần - rId8 / image4.jpg.
4. Mô hình dạy học thời phong kiến - rId9 / image2.png.

The ancient topic shows exactly these four cards, in this order, using the existing responsive three-column grid. Both the photo and the Read article control link to a distinct article ID using the existing detail template. Images are locally served WebP assets, with no invented replacement picture. `contain` preserves the complete source photo, including the portrait statue, inside the rounded frame and detail view.

Four new records are added under `exhibitions.items`. Existing article records and photos are untouched, so the two award topics still show their original six cards. No articles or models are removed.

The supplied document only has titles and images, not long-form body text. Detail views therefore show the existing explicit pending-content state until article text is supplied. Their Back link returns to the ancient topic rather than a different introduction.

Switching via the shared header hides/shows the cached ancient or existing six-card grid without a new page load or catalog request. Images retain reserved dimensions and lazy decoding. The documents and original extracted images remain in the temporary staging directory, not shipped in the website.

Verified at 1920, 1440, 768, 390 and 320px: exactly four ancient cards, correct title order, four unique article URLs, loaded source photos, topic-aware Back links, unchanged six-card award lists and GitHub Pages-style subfolder paths. No horizontal overflow, image failures, failed requests or JavaScript exceptions were observed. The four delivered images total about 447 KB versus about 2.55 MB of original embedded files.

Detector warnings for cream and shared header wrappers are intentional/incumbent. Introduction wrappers have no border and no bottom padding at the user's explicit request; no separator was reintroduced to satisfy the detector.
