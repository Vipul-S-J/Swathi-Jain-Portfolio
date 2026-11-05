# Swathi Jain – Acting Portfolio

Static site (HTML/CSS/JS, no build). Works on GitHub Pages as is.

## Publish
Repo Settings → Pages → Deploy from branch → `main` / root.

## Files
- `index.html` – landing, about, work (filterable credits), gallery, contact
- `style.css` – red/cream theme, Bebas Neue + Satoshi fonts
- `script.js` – intro animation, filters, reveal, counters
- `gallery.js` – horizontal scroll gallery (Motion `animate` + `scroll` from CDN, with fallback)
- `assets/swathi.jpg` – original photo; `assets/hero-cutout.webp` – hero cut-out
- `assets/gallery/` – gallery images (replace with real photos, keep the names or edit `index.html`)
- `assets/posters/` – add `<slug>.jpg` (2:3) per credit; a title card shows until then

## Notes
- After publishing, change `og:image` in `index.html` to the full URL of `assets/swathi.jpg`.
- No phone number or WhatsApp is shown.
