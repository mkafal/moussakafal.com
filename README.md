# Moussa Kafal - Personal Website

Static personal website built with plain HTML, CSS, and minimal JavaScript.

## Pages

- Home (`index.html`)
- About (`about.html`)
- Work (`work.html`)
- Contact (`contact.html`)

## Local Preview

1. Open a terminal in this folder:
   ```bash
   cd /Users/mikekaf/Desktop/Projects/moussakafal.com
   ```
2. Start a local static server (Python 3):
   ```bash
   python3 -m http.server 8080
   ```
3. Open:
   [http://localhost:8080](http://localhost:8080)

Alternative: open `index.html` directly in a browser, but using a local server is recommended.

## Deploy to GitHub Pages (Custom Domain: `moussakafal.com`)

1. Push this repository to GitHub.
2. In GitHub, go to:
   `Settings -> Pages`.
3. Under `Build and deployment`:
   - Source: `Deploy from a branch`
   - Branch: `main` (or your default branch), folder `/ (root)`
4. In `Custom domain`, set:
   `moussakafal.com`
5. Ensure `Enforce HTTPS` is enabled once certificate provisioning completes.

## DNS Setup

At your domain registrar/DNS provider, point `moussakafal.com` to GitHub Pages:

- `A` records for apex/root domain:
  - `185.199.108.153`
  - `185.199.109.153`
  - `185.199.110.153`
  - `185.199.111.153`
- Optional `CNAME` for `www`:
  - Host: `www`
  - Value: `<your-github-username>.github.io`

DNS updates may take from a few minutes to 48 hours.

## Customize Placeholders

- Profile image placeholder:
  `assets/profile-placeholder.svg`
- Favicon placeholder:
  `assets/favicon.svg`
- Contact placeholders:
  update `hello@example.com` and `https://www.linkedin.com/in/your-linkedin` in the HTML pages.
