# Books Platform — mobile design prototype

A clickable, bilingual (AR/EN) prototype of the **shipped Flutter app**: 26 routed screens plus their loading / empty /
error / filled states, built from the app's real tokens, translations and copy.

> **What this is not.** It is not a Claude Design export. `support.js` is a small hand-written runtime (see below), there
> is no compiled `_ds_bundle.js`, and importing this folder into Claude Design is not supported. It exists so the design
> can be viewed, navigated and screenshotted, and so `/capture-design-screens` has a prototype to work with.

The Flutter code is the source of truth. Nothing here is a design that the app should be changed to match.

## View it

Serve the folder over HTTP (a `file://` load can block the font and script requests) and open the `.dc.html`:

```bash
cd mobile/doc/design/ui-design
node ~/.claude/skills/capture-design-screens-w/scripts/serve.js . 4600   # or any static server
# open http://127.0.0.1:4600/books-platform-mobile.dc.html
```

On a wide window a side panel lists every screen key and the AR/EN switch. Tap targets inside the phone work too
(tabs, filters, sheets, back). Fonts (Cairo, Tajawal, Inter) and Material Icons load from Google Fonts, so the page needs
network access.

## Capture the screens

```bash
# from the repo root
node ~/.claude/skills/capture-design-screens-w/scripts/capture.js \
  --html mobile/doc/design/ui-design/books-platform-mobile.dc.html \
  --out  mobile/doc/design/screenshots \
  --config mobile/doc/design/ui-design/screens.json \
  --clip bezel --img-prefix mobile/doc/design/screenshots
```

`--list` prints the mounted logic and the 26 screen keys. `screens.json` captures 41 frames: every routed screen plus
the states that look different (loading, empty, filtered, download bar, publish steps, search results, and so on).
`--clip screen` gives exactly 780x1688 px (the 390x844 canvas at 2x); `--clip bezel` includes the phone frame.

## How it satisfies the capture contract

`capture.js` drives the prototype through its own navigation method instead of clicking:

| The skill needs | Where it lives here |
|---|---|
| A React class component whose instance owns `.logic` | `Host` in `support.js` |
| `logic.go(screen, extra)` / `host.__setLogicState(patch)` | `go` in the `<script data-dc-script>` block, `__setLogicState` in `Host` |
| Screen keys found in the dc script text (`screen: '<init>'`, `screenIs('<key>')`) | `books-platform-mobile.dc.html`, one `screenIs` per key |
| An element with `border-radius: 44px` (bezel) / `32px` + `overflow:hidden` (screen) | `.bezel` / `.screen` in `bp/styles.css` |

Two layout rules protect the clip rectangle: `<html>` stays `dir="ltr"` (only `.screen` switches to RTL) and the stage
uses `margin: 24px auto`, so the phone never lands at a negative x in the 390 px capture viewport.

## Layout

```
books-platform-mobile.dc.html   canvas: token links, dc script (Component extends DCLogic), script tags
support.js                      DCLogic base, Host (mounts Component, click delegation), side panel
vendor/react.bundle.js          React 19 + ReactDOM, bundled offline by tools/build-vendor.mjs
_ds/books-platform-mobile/tokens/*.css   design tokens taken from lib/core/theme and lib/core/constants
bp/core.js                      shared view helpers (app bar, bottom nav, book cover/card, states, markdown)
bp/data.js                      mock data using the real entity field names
bp/strings.js                   GENERATED from mobile/assets/translations/{ar,en}.json
bp/copy-static.js               GENERATED from the Dart sources (about/services/team/legal/onboarding) + privacy/terms md
bp/screens-*.js                 one file per feature area; each view returns an HTML string
bp/styles*.css                  shared + per-area styles
assets/                         logo, onboarding art, app icon, social SVGs (copied from mobile/assets)
tools/                          build-vendor.mjs, gen-strings.mjs, gen-static-copy.mjs
screens.json                    capture.js --config (41 frames)
```

## Keeping it in sync with the app

```bash
node tools/gen-strings.mjs        # after editing assets/translations/*.json
node tools/gen-static-copy.mjs    # after editing static_pages/*_body.dart, onboarding slides or assets/static/*.md
node tools/build-vendor.mjs       # only to rebuild the React bundle (needs web/node_modules)
```

Layout and styling are hand-written CSS, so screen structure changes in Flutter need a manual update here.

## Known gaps versus the real app

- **No photos.** Book covers, hero slides, article and media images use the app's own fallback (gradient plus title text),
  because the real ones come from the API. Team photos use the initials fallback.
- **Mock data.** Titles and publishers are realistic samples, not live catalog data.
- **Shipped quirks are reproduced on purpose:** the cart is empty by default (nothing in the app adds items), there is no
  cart icon in the app bar, Home's "Top Publishers" section never renders, and the Catalog subtitle count is hard-coded.
- **Status bar and home indicator** are mock chrome inside the frame, not part of the Flutter UI.
- Animation (carousel auto-advance, shimmer, page transitions) is not reproduced; frames are static.
