# YouTube in Media

User-confirmed video mappings:

- Thu gui cac hoc sinh: `https://youtu.be/NcY1AuUy9Po`.
- Trung bo ngua no / Vu Tu Nam: `https://youtu.be/w0A1BD9CRcE`.

The museum overview and Nguyen My videos remain pending sources. Local
illustrative covers are retained and can be replaced independently.

In `assets/data/media-library.json`, add `youtubeId` to a video item:

```json
"src": null,
"youtubeId": "NcY1AuUy9Po"
```

Use the 11-character ID, not the full watch URL. Only validated IDs are
embedded. Local MP4 sources continue to use `src`; YouTube takes precedence
when both are supplied. Covers stay local. No YouTube iframe or request is
created until the visitor clicks View Video.

The iframe uses youtube-nocookie.com with controls, inline playback and
fullscreen support. An origin-bearing referrer policy supports authenticated
embed requests. Selecting a different video, leaving the video tab, or leaving
the page removes the iframe to stop playback. A 15-second connection fallback
restores the cover and retry button; the original YouTube link stays available.

Documentation: https://developers.google.com/youtube/player_parameters

QA confirmed lazy iframe creation, correct video ID, 200px minimum player size,
desktop/mobile layout, tab-switch cleanup, missing-video states, successful
embed-load handling with a test fixture and the timeout/retry path. Actual
YouTube playback could not be verified because the test environment did not
receive a response from YouTube; restrictions on the video must be checked in
the visitor's browser. No MP4 file is added to GitHub.
