# 080888.com — Phase-wise Build Prompt

Use these prompts in order with any capable AI coding assistant, or as a spec for developers. Each phase has a clear deliverable and acceptance criteria. This repository is the finished output of Phases 1–7. Phases 8–10 are the expansion roadmap.

---

## Global constraints (paste at the top of every phase)

```
You are building 080888.com, "Lucky Numbers Lab", a Chinese prosperity-number intelligence website.
Hosting: GitHub Pages free plan. Pure static HTML/CSS/vanilla JS on GitHub Pages' built-in Jekyll (no plugins, no Actions). No server, no database.
Design: modern, mobile-first, responsive (no horizontal scroll at 360px), accessible (WCAG 2.1 AA), light and dark mode,
red (#c8102e) / gold (#d4a017) / jade (#0f7b5f) palette, Inter + Noto Serif SC fonts.
Every page MUST show a top bar reading "Contact, if you are interested in this website / domain name / Sponsorship /
Advertisement / Partnership" linking to https://web.works/contact (opens in a new tab).
ALL forms and contact actions deliver to ONE inbox. The inbox address must NEVER appear in page text, HTML source
or any repo file in plain form. Store it encoded in config.js, assemble it in memory only at submit/click time,
and send via a static-friendly relay (FormSubmit AJAX). Fall back to a runtime-built mail link.
Avoid trademark/copyright issues: use "080888" only as a numeral and domain name, include a Trademark & Copyright
Disclosure page, write only original text, and use only licensed fonts and official YouTube embeds.
Performance: Lighthouse 90+ on mobile, lazy YouTube facades, no heavy frameworks.
```

---

## Phase 1 — Research & positioning
**Prompt:** "Research the cultural and economic meaning of 0 and 8 in Chinese numerology, the 08-08-08 Olympics, lucky-number auctions (phone numbers, plates) and numeric commerce (618, 520). Audit 25+ sites in the lucky-numbers, Chinese zodiac, feng shui, CNY and vanity-number-marketplace niches. Produce RESEARCH.md with: meaning of 080888, cited economic evidence, chosen concept, revenue model, and a competitor feature matrix."
**Accept when:** at least 25 sites are listed, every figure has a source, and a single concept is chosen with revenue streams ranked.

## Phase 2 — Information architecture & design system
**Prompt:** "Create the sitemap and a CSS design system (tokens, dark mode, grid, cards, buttons, forms, multi-step forms, tabs, accordions, score ring, ad slots, video facade, lead band, pricing tiers, sticky mobile CTA, modal, cookie banner). Use GitHub Pages' built-in Jekyll: one _layouts/default.html holding the shared head (SEO meta, OG, JSON-LD WebSite, WebPage, FAQPage, Article), top interest bar, nav with dropdowns, mobile menu and footer; each page is a small .html file with front matter (title, description, canonical, jsonld) plus its content. Add sitemap.xml."
**Pages:** Home, Lucky Number Analyzer, Number Meanings, Meaning of 080888, Chinese Zodiac, Auspicious Dates, Lucky Numbers for Business, Chinese New Year, Feng Shui & Numbers, Marketplace, Consultation (lead gen), Videos, Articles hub + articles, Contests, Support/Donate, Careers, Advertise, About, Contact, FAQ, Trademark & Copyright, Privacy, Terms, 404.

## Phase 3 — Core engine & tools
**Prompt:** "Write assets/js/numbers.js: (a) digit weights from homophones (8 +10, 6/9 +6, 2/3 +3, 0 +2, 1 +1, 5/7 0, 4 −10); (b) 27 named combinations (168, 518, 888, 0808, 666, 999, 520, 1314, 68, 58, 28, 18 positive; 14, 514, 748, 74, 54, 94, 250, 44, 38 negative); (c) endings weighted 1.5×, pattern bonuses (AAA, ABAB, ends-in-8), 1–100 score and grade (Imperial, Excellent, Good, Neutral, Weak, Avoid); (d) luckier same-length variants; (e) Chinese-calendar helpers using Intl 'u-ca-chinese' plus a verified Lunar New Year table; zodiac animal, element, yin/yang and personal lucky numbers; 12×12 compatibility (Six Harmonies, Trines, Clashes); date scoring (digits, lunar day, Ghost Month, weekday by event); next-CNY finder."
**Accept when:** 080888 scores ≥ 90; 4444 scores < 10; 1988-08-08 returns Earth Dragon; CNY 2027 = 6 Feb 2027.

## Phase 4 — Monetisation layer
**Prompt:** "Add config-driven Google AdSense slots (top, in-article, sidebar, footer) that render house 'Advertise here' units until a publisher ID is set, and load after cookie consent (non-personalised on 'Essential only'). Add optional GA4. Add ads.txt. Build a YouTube facade grid fed from config (IDs only). Add a Support page with tiers ($8/$28/$88/$888), config-driven PayPal/Stripe/Ko-fi/BMC/Patreon/crypto buttons that fall back to a pledge form, a fundraising progress bar, and a 'fund a purpose' selector (operations, tools, promotion, hiring, prizes, video)."

## Phase 5 — Lead generation (highest priority revenue)
**Prompt:** "Build the dedicated lead-gen system: (1) a gated 'full Prosperity Report' form under every analyzer result; (2) a 3-step home Blueprint form (goal, numbers, contact) with a progress bar; (3) the Consultation page with 4 priced tiers and a 3-step form (service, details and budget, contact) with URL prefill (?service=); (4) a Marketplace with Buy / Sell / Free-valuation tabs; (5) exit-intent and 50-second modal offering '8 luckiest dates'; (6) sticky mobile CTA; (7) newsletter in the footer. All forms get a honeypot, validation, consent checkbox, success and error states, and a GA4 generate_lead event."

## Phase 6 — Community, talent & sponsors
**Prompt:** "Build Contests (3 monthly contests, prizes, entry form, full official rules: no purchase necessary, eligibility, judging, prizes, privacy), Careers (6 roles, application form with portfolio URL), Advertise (6 sponsorship products, partner categories, proposal form including domain acquisition), About, Contact (topic router plus a runtime-built email link)."

## Phase 7 — Legal, SEO, QA & deploy
**Prompt:** "Write the Trademark & Copyright Disclosure (numeral use, no affiliation with the Olympics or any company, third-party content, user licence, DMCA process), Privacy (AdSense cookie wording, rights, retention) and Terms. Add robots.txt, sitemap.xml, manifest, OG image, icons, 404. Run Playwright at 390px and 1366px on every page: no JS errors, no horizontal scroll, no inbox string in the DOM or repo. Push to GitHub repo webworksa1/080888-com and publish with GitHub Pages (Deploy from branch; Jekyll builds automatically)."

---

## Expansion roadmap

### Phase 8 — Chinese-language editions (traffic ×3–5)
"Add /zh-hans/ and /zh-hant/ mirrors with hreflang, a language switcher and localised copy. Target Baidu-friendly metadata and Xiaohongshu share cards."

### Phase 9 — Programmatic SEO
"Generate static pages for every number from 0–9999 ('/number/168.html': meaning, score, combos, similar numbers), for each zodiac sign × year (2026–2030), and for 'lucky dates in [month] [year]' for weddings and business. Add internal linking and breadcrumbs. Target 10,000+ indexable pages."

### Phase 10 — Productised revenue
"Add Stripe Payment Links for the $38 / $88 / $168 products, an instantly downloadable PDF report built client-side (jsPDF), affiliate modules (vanity phone numbers, plate dealers, domain registrars, feng shui shops), a sponsor rotation in config, and a membership (ad-free + monthly lucky calendar) via Ko-fi or Patreon."

### KPIs to track
Organic sessions, analyzer runs, lead conversion rate (target 3–6% of tool users), revenue per 1,000 sessions (AdSense + leads), sponsor fill rate, newsletter growth, donations per month.
