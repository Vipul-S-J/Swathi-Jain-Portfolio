# Swathi Jain | Acting Portfolio

Static site (HTML, CSS, JS). No build step, no cost.

## Publish on GitHub Pages
1. Create a repo (for example `swathi-jain`) and push these files to the `main` branch root.
2. Repo **Settings → Pages → Build and deployment → Deploy from a branch → main / (root)**.
3. The site goes live at `https://<username>.github.io/<repo>/`.

## Add her photo
Save a portrait (about 4:5, e.g. 800x1000) as `assets/swathi.jpg`. Until then a monogram shows.
For link previews, replace `assets/og-card.svg` with a 1200x630 `og-card.png` and update the `og:image` tag
(use the full `https://...` URL, social sites need absolute URLs).

## Edit content
- Credits: `<ol class="credits">` in `index.html` (set `data-type` to `film`, `tv`, `short` or `audio`).
- Phone: search for `8123465902` in `index.html` and `script.js`.
- Colours: top of `style.css` (`--crimson`, `--gold`, `--teal`).

## Features used
CSS scroll-driven animations, View Transitions API, `@property`, `light-dark()`, `oklch()`, `color-mix()`,
container query units, `text-wrap: balance`, and a reduced-motion mode. Older browsers fall back gracefully.
