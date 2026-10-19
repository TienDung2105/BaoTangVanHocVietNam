# Explore: October reference update

Current article content, supplied images and user-approved copy/footer changes
are documented in `explore-content.md`. The notes below describe the original
reference implementation before those updates.

Design authority: user-supplied Drive folder `1t0_GtRfrxKwPL7A7_QP5HdtLFsBNWnym`, refreshed for this task. Reviewed all 104 PNG exports. `tong quan.png` is 4000 x 9194; the folder has no PDF. This supersedes the earlier uniform collection grid for Explore only.

Direction: editorial museum experience, preserving the cream/red/charcoal reference. DESIGN_VARIANCE 4, MOTION_INTENSITY 2, VISUAL_DENSITY 4. Native HTML/CSS/ES modules; no framework. Shared menu retains the homepage's geometry and styling instead of the different menu drawn in the new reference.

Composition: oversized Qalogre page title; featured autumn story on the left and rounded photo on the right; staggered three-column stories with an editorial note; full-width red solo-date band; two smaller image/text stories; compact dark footer. Uber Move handles bold headings, Qalogre italic phrases, Proxima supporting copy, and Brother 1816 italic article controls as previously requested. Mobile uses readable flow rather than claiming an unspecified mobile mockup.

Photos are temporary existing museum illustrations because the supplied image frames are empty. Edit the Explore entries in `assets/data/collections.json` to replace `image`, `imageAlt`, and `imagePosition`; the native image helper applies these on load. Keep the original models, source fonts, and other page data untouched. No invented long-form articles or booking/payment behavior.

Performance: static shared menu retained; existing hover/focus prefetch and stable scrollbar gutter retained; important local fonts preloaded; images use reserved aspect ratios; only the leading photo is eager; below-fold photos use lazy loading and asynchronous decode. Explore alone uses a 1920px compressed copy of the same header photo (350308 bytes versus 965932 bytes). No 3D resources, scroll listeners, external calls, or transition framework are loaded.

Verification: checked 1920, 1440, 1025, 768, 390 and 320px. All seven articles present; no overflowing text, horizontal scroll, missing images, failed requests or JavaScript exceptions. Header bounds match the homepage at every size. Menu navigation, mobile toggle/Escape, the All anchor, seven article links and GitHub Pages-style subfolder paths pass.

Local Chromium cold-load comparison with 100ms latency and 300000 bytes/sec: resource transfer 2310771 -> 1396577 bytes (about 40% less), requests 25 -> 22, DOMContentLoaded 2558 -> 2039ms. These are local test results, not guaranteed production timings. Cold-load CLS remains low (0.0047); warm page-load tests measured zero. No claim of eliminating every device/network delay.

The small gold label on red was lightened to meet body-text contrast. Cream palette is intentional reference fidelity. The detector's header wrapper padding warnings refer to wrappers, not text: shared nav and mobile links supply their actual insets, which are kept unchanged.
