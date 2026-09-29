# 080888.com — Lucky Numbers Lab

A static, responsive website about Chinese prosperity numbers. It includes a Lucky Number Analyzer, a zodiac and compatibility finder, an auspicious date finder, a lucky-number marketplace, and lead generation, donations, contests, careers and advertising sections. Built for **GitHub Pages (free plan)**.

- Research and concept: [`RESEARCH.md`](RESEARCH.md)
- Phase-wise build prompt and roadmap: [`BUILD-PROMPT.md`](BUILD-PROMPT.md)

## Structure (Jekyll — built automatically by GitHub Pages, free plan)
```
_layouts/default.html     ← shared layout: top interest bar, header/nav, footer, modals, cookie banner, scripts
_config.yml               ← site version (cache-busting) + excluded files
*.html                    ← one file per page: front matter (title, description, canonical, jsonld) + page content
assets/css/style.css      ← design system (light/dark)
assets/js/config.js       ← ALL settings: AdSense, GA4, donate links, YouTube videos, fundraising
assets/js/numbers.js      ← number / zodiac / date engine
assets/js/main.js         ← UI, forms, tools, ads, consent, video, modals
sitemap.xml, robots.txt, ads.txt, manifest.webmanifest
tools/preview.py          ← local preview without Ruby (renders to _site/)
```

## Add or edit a page
Copy any page (e.g. `about.html`), change the front matter and content, commit. GitHub Pages rebuilds in about a minute. Add the new URL to `sitemap.xml`.

## Local preview
```bash
python3 tools/preview.py && python3 -m http.server -d _site 8000
```

## Go-live checklist
1. **Forms:** submit any form once on the live site. The relay (FormSubmit) sends a one-time activation email to the site inbox. Click it, and every later submission is delivered. The inbox address is stored encoded in `config.js` and never rendered.
2. **AdSense:** apply with the live domain, then set `adsenseClient` and `adSlots` in `config.js` and uncomment the line in `ads.txt`.
3. **Donations:** paste your PayPal, Stripe, Ko-fi, Buy Me a Coffee and Patreon links into `config.donate`.
4. **YouTube:** set `youtubeChannel` and replace `videos` IDs with your own uploads.
5. **Custom domain:** in repo *Settings → Pages → Custom domain*, enter `080888.com`, then at your registrar add:
   - `A` records for `@` → 185.199.108.153, 185.199.109.153, 185.199.110.153, 185.199.111.153
   - `CNAME` for `www` → `webworksa1.github.io`
   Then tick **Enforce HTTPS**.

## Legal
See `legal.html` (Trademark & Copyright Disclosure). "080888" is used only as a numeral and domain name; no trademark rights in the numeral are claimed.

© 080888.com. All rights reserved.
