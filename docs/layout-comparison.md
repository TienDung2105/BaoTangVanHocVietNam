# Layout Comparison

Reference: user-provided `web (1).pdf`, one page, 1919.88 x 7146.36.
The PDF was rendered with Windows.Data.Pdf at 1259px width and inspected.

Changes:
- Restore the compact centered introduction composition from the new PDF.
- Restore taller museum-story photos and their asymmetric column proportions.
- Scale desktop story captions with the existing typography breakpoints.
- Remove the extra top-right news label absent from the new reference.
- Clip photographic containers at an 8px radius, including overlays and hover zoom.
- Wrap artifact photos in a stable, clipped square media frame, separately from labels.

The latest requested copy is preserved when the PDF differs: the removed story
strapline stays removed, and the complete new story paragraphs stay intact.
The user's supplied Thai Vu photo remains in place. Bicycle and typewriter use
contain rather than crop to retain the entire photographed artifact.

This is a responsive layout reconstruction, not a pixel-identical flattened PDF.
Mobile keeps readable flowing layouts because the PDF provides only desktop art.
