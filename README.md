# Swathi Jain – Acting Portfolio

Static site (HTML/CSS/JS, no build). Works on GitHub Pages as is.

## Publish
Repo Settings → Pages → Deploy from branch → `main` / root.

## Files
- `index.html` – landing, about, work (filterable credits), gallery, contact
- `style.css` – red/cream theme, Bebas Neue + Satoshi fonts
- `script.js` – intro animation, filters, reveal, counters
- `gallery.js` – morphing gallery (Coverflow / Grid / Stack) with a lightbox, plain JS, no dependencies
- `assets/swathi.jpg` – original photo; `assets/hero-cutout.webp` – hero cut-out
- `assets/gallery/` – gallery images (`06-photo`, `07-photo` are your real photos; add more `<figure class="g-item">` entries in `index.html`)
- `assets/posters/` – add `<slug>.jpg` (2:3) per credit; a title card shows until then

## Notes
- After publishing, change `og:image` in `index.html` to the full URL of `assets/swathi.jpg`.
- No phone number or WhatsApp is shown.
