# moussakafal.com

Personal site for Moussa Kafal — industry advisor at the intersection of grid modernization, AI sensing, and Industry 4.0.

Single-page static site (one self-contained `index.html` with inline CSS + JS). Deployed automatically to GitHub Pages via the workflow in `.github/workflows/static.yml` on every push to `main`.

## Structure

- `index.html` — full single-page site (hero, thesis, expertise, work, insights, speaking, about, contact)
- `about.html`, `work.html`, `contact.html` — redirect stubs preserving legacy URLs (bounce to anchors on `index.html`)
- `assets/` — favicon and profile placeholder SVG
- `CNAME` — custom domain (`moussakafal.com`)
- `.github/workflows/static.yml` — auto-deploy to GitHub Pages

## Local preview

```bash
cd "/Users/mikekaf/Documents/Claude/Projects/MoussaKafal.com"
python3 -m http.server 8080
```

Open <http://localhost:8080>.

## Deploy

`git push` to `main` — the GitHub Action builds and deploys to Pages within ~1 minute. The custom-domain CNAME already points at GitHub Pages.

## Placeholders to replace before going public

Search `index.html` for `<TBD>` and `<…>` to find every spot that needs your real content:

- Selected work — replace `<TBD>` outcome figures with cleared numbers
- Speaking & media — replace `<Conference name>`, `<City>`, `<Podcast / publication>` with confirmed events
- About → quick facts — fill in `<City, Country>` and additional languages
- About → CV — replace the `#` link with the URL of a hosted PDF
- Insights — replace `href="#"` on each article card with the real article URLs
- LinkedIn — current handle is `linkedin.com/in/moussakafal`; update if different
- `assets/profile-placeholder.svg` — swap for your photo if/when you want one

## DNS (already configured — for reference)

- `A` records for the apex domain:
  - `185.199.108.153`
  - `185.199.109.153`
  - `185.199.110.153`
  - `185.199.111.153`
- Optional `CNAME` for `www` → `<github-username>.github.io`
