# moussakafal.com

Personal site for Moussa Kafal — industry advisor focused on electrification, intelligent infrastructure, AI sensing, and Industry 4.0.

Single-page static site with a cinematic, motion-led executive portfolio experience. Deployed automatically to GitHub Pages via the workflow in `.github/workflows/static.yml` on every push to `main`.

## Structure

- `index.html` — semantic content and metadata
- `styles.css` — responsive visual system, layouts, and motion
- `script.js` — interactions, accessibility states, canvas network, analytics consent
- `about.html`, `work.html`, `contact.html` — redirect stubs preserving legacy URLs (bounce to anchors on `index.html`)
- `assets/` — brand artwork, photography, favicon, and social preview imagery
- `CNAME` — custom domain (`moussakafal.com`)
- `.github/workflows/static.yml` — auto-deploy to GitHub Pages

## Local preview

```bash
cd "/Users/mikekaf/Documents/Codex/Projects/MoussaKafal.com"
python3 -m http.server 8080
```

Open <http://localhost:8080>.

## Deploy

`git push` to `main` — the GitHub Action builds and deploys to Pages within ~1 minute. The custom-domain CNAME already points at GitHub Pages.

## Content notes

- Selected work is intentionally anonymized and avoids undisclosed figures.
- Working-thesis cards are presented as upcoming ideas rather than broken article links.
- The primary conversion path is the Calendly call link, supported by email, LinkedIn, and WhatsApp.

## DNS (already configured — for reference)

- `A` records for the apex domain:
  - `185.199.108.153`
  - `185.199.109.153`
  - `185.199.110.153`
  - `185.199.111.153`
- Optional `CNAME` for `www` → `<github-username>.github.io`
