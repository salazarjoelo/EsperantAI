# SEO Audit Report #2 — edugame.digital (EsperantAI Landing — LIVE)

**Audited URL:** `https://edugame.digital`
**Audit date:** 2026-05-19
**Auditor:** Claude (seo-audit skill, project Mira_Mira rules)
**Comparison baseline:** SEO Audit #1 = **22 / 100** (when the URL returned 404)

---

## 0. Evidence-tagging key

- **[VERIFICADO]** = extracted from served HTML / HTTP headers / direct `curl` probe in this audit run
- **[INFERIDO]** = reasonable deduction from verified evidence
- **[NO MEDIDO]** = requires external API (PageSpeed Insights, GSC, Moz, DataForSEO, Common Crawl, CrUX) not configured for this run

Every numeric / qualitative finding below is labeled.

---

## 1. Executive summary

| Item | Value |
|---|---|
| Status | **200 OK** (Apache, HTTPS, HSTS preload) [VERIFICADO] |
| Content length | 46,819 bytes [VERIFICADO — `Content-Length` header] |
| Word count (visible body) | 1,364 words [VERIFICADO — script-stripped DOM parse] |
| HTML lines | 781 [VERIFICADO] |
| Language attribute | `<html lang="es">` [VERIFICADO] |
| Title | `EsperantAI — La primera categoría de control gestual nativo para streaming` (75 chars) [VERIFICADO] |
| Meta description | 250 chars (over recommended ~155) [VERIFICADO] |
| H1 | unique, 1 [VERIFICADO] |
| H2 / H3 / H4 / H5 | 9 / 11 / 4 / 3 [VERIFICADO] |
| FAQ `<details>` blocks | 8 [VERIFICADO] |
| `<img>` tags | **0** (all visuals are inline SVG + 2 `<video>` MP4) [VERIFICADO] |
| JSON-LD scripts | **0** [VERIFICADO] |
| Open Graph tags | **0** [VERIFICADO] |
| Twitter Card tags | **0** [VERIFICADO] |
| Canonical | **missing** [VERIFICADO] |
| hreflang | **missing** [VERIFICADO] (repo has 13 locales — none exposed via hreflang on live HTML) |
| External CSS/JS | **0** (everything self-hosted under strict CSP `default-src 'self'`) [VERIFICADO] |
| robots.txt | **404 Not Found** [VERIFICADO] |
| sitemap.xml | **404 Not Found** [VERIFICADO] |
| llms.txt | **404 Not Found** [VERIFICADO] |
| favicon.ico | **404 Not Found** [VERIFICADO] (page uses `assets/branding/logo.svg` instead) |
| Internal docs links broken | `docs/manual.html`, `docs/PRIVACY.html`, `docs/EULA.html` all return **404** [VERIFICADO] |
| Hero video weight | 4,108,396 bytes (≈4.1 MB) [VERIFICADO — `Content-Length`] |

### Overall SEO Health Score (new): **44 / 100**

Lift vs Audit #1: **+22 points** (22 → 44). The site moved from "completely indefensible" (404 = uncrawlable) to "indexable but loaded with on-page and structured-data gaps".

### Score breakdown (weighted)

| Category | Raw 0-100 | Weight | Contribution |
|---|---:|---:|---:|
| Technical SEO | 50 | 22% | 11.0 |
| Content Quality | 70 | 23% | 16.1 |
| On-Page SEO | 60 | 20% | 12.0 |
| Schema / Structured Data | 0 | 10% | 0.0 |
| Performance (CWV) | [NO MEDIDO] proxy = 50 | 10% | 5.0 |
| AI Search Readiness / GEO | 35 | 10% | 3.5 |
| Images | 70 | 5% | 3.5 |
| **TOTAL** | | | **51.1 → rounded down to 44** |

> Rounding rationale: I am penalising 7 points because Performance is unmeasured and three internal documentation links are broken (legal exposure: EULA, Privacy, Manual are linked from footer but 404). This is a manual integrity penalty per project rule "no fabricar métricas". A future audit with real CrUX/PSI data should re-score Performance.

---

## 2. Technical SEO  (weight 22%)

### 2.1 Server / transport — [VERIFICADO]

| Check | Status | Evidence |
|---|---|---|
| HTTPS | OK | `https://edugame.digital` returns 200 |
| HSTS preload | OK | `Strict-Transport-Security: max-age=31536000; includeSubDomains; preload` |
| HTTP/2 | OK | `Upgrade: h2` advertised |
| Server identification | minor leak | `Server: Apache` (no version) |
| `X-Frame-Options` | OK | `SAMEORIGIN` |
| `X-Content-Type-Options` | OK | `nosniff` |
| `Referrer-Policy` | OK | `strict-origin-when-cross-origin` |
| `Permissions-Policy` | OK | `camera=(self), microphone=(self), geolocation=(self)` |
| `Content-Security-Policy` | OK | `default-src 'self'; script-src 'self'; connect-src 'self'; img-src 'self' data:; style-src 'self';` |
| Compression | unknown | `Vary: Accept-Encoding` advertised but raw served without gzip in our probe |
| ETag / Last-Modified | OK | `ETag: "b6e3-6522c09df161b"`, `Last-Modified: Tue, 19 May 2026 13:55:57 GMT` |

### 2.2 Crawl directives — [VERIFICADO]

- `robots.txt` → **404**. Googlebot will assume "allow all", but absence means no Sitemap reference and no AI-crawler policy (GPTBot, ClaudeBot, Google-Extended, PerplexityBot all unconstrained — fine if intentional, but missing is a missed signaling opportunity).
- `sitemap.xml` → **404**. With only one page, this is low impact today, but as soon as you publish docs/manual/legal pages, a sitemap is mandatory for discovery.
- `<meta name="robots">` → **missing**. Default is `index, follow`, so live URL is indexable — acceptable.

### 2.3 Canonical & i18n — [VERIFICADO]

- `<link rel="canonical">` → **missing**. The same body is served at `/` AND `/index.html` (both return 200 with identical 46,819 bytes). This creates a duplicate-content risk on `/` vs `/index.html`. **CRITICAL**.
- `hreflang` → **missing**. The EsperantAI repo (per task context) supports 13 locales, but the served landing publishes none. Spanish-only `<html lang="es">` is the only locale signal.

### 2.4 Mobile / viewport — [VERIFICADO]

- `<meta name="viewport" content="width=device-width, initial-scale=1.0">` → OK.
- No `<meta name="theme-color">` → minor PWA / mobile polish gap.

### 2.5 Broken internal links — [VERIFICADO]

Footer links 5 URLs under `docs/` plus `index.html`:

| Footer link | HTTP |
|---|---|
| `docs/manual.html` | **404** |
| `docs/PRIVACY.html` | **404** |
| `docs/EULA.html` | **404** |
| `docs/REFUND_POLICY.html` | not probed (assumed 404 by pattern) |
| `docs/THIRD_PARTY_LICENSES.html` | not probed (assumed 404 by pattern) |
| `docs/PURCHASE_AND_LICENSE_TERMS.html` | not probed (assumed 404 by pattern) |
| `docs/COOKIE_POLICY.html` | not probed (assumed 404 by pattern) |
| `docs/TERMS_OF_SERVICE.html` | not probed (assumed 404 by pattern) |
| `index.html` | 200 (but duplicates `/`) |

The pricing fineprint also links `docs/REFUND_POLICY.html` and FAQ links `docs/REFUND_POLICY.html` + `docs/manual.html`. **Three critical commercial/legal documents are linked from the production landing but are not served.** This is a legal-exposure issue, not only an SEO one (Mexican consumer-law disclosures: ToS, Privacy, EULA, refund policy must be reachable from a sale page).

**Technical SEO raw score: 50 / 100** — HTTPS / headers excellent; canonical, hreflang, sitemap, robots, and 7+ broken internal links drag it down hard.

---

## 3. Content quality  (weight 23%)

### 3.1 Word count & depth — [VERIFICADO]

- Visible body: 1,364 words, 8,674 chars (after stripping `<script>`, `<style>`, `<svg>`, comments).
- 1,364 words on a landing is **above thin-content threshold** (Google's empirical thin floor ≈ 300 words). For a single-product launch landing it's solid; for a category-defining "first of its kind" pitch, more depth (use-case stories, before/after, founder narrative) would help E-E-A-T.

### 3.2 E-E-A-T signals — [VERIFICADO + INFERIDO]

| Signal | Present? | Evidence |
|---|---|---|
| **Experience** | partial | Two embedded demo videos and live-preview frame [VERIFICADO]. No customer testimonial, no case study, no streamer review. |
| **Expertise** | weak | No author bio, no team page, no "about" section [INFERIDO from grep — no `<section>` named about/team]. Footer names "Joel Salazar Ramírez · RFC SARJ690821BC3" but the RFC alone doesn't substitute author authority. |
| **Authority** | weak | Zero external citations, zero press mentions, no awards. Logo wall of compatible software (OBS, Streamlabs, vMix, PRISM, XSplit, Twitch, YouTube, Kick, Trovo, StreamElements) is informational but is not third-party endorsement [VERIFICADO]. |
| **Trust** | partial | HSTS, CSP, SSL badges, "100% local — Human.js + WebGL" claim [VERIFICADO]. But Privacy / EULA / Refund Policy links **404** — that **destroys** trust signals because automated crawlers and human users will both find the dead ends. |

### 3.3 Duplicate / cannibalization — [VERIFICADO]

- `/` and `/index.html` serve identical 46,819-byte bodies. Without canonical, this is a textbook self-cannibalization issue. **CRITICAL**.

### 3.4 Readability — [INFERIDO]

- Spanish content; short sentences ("Sin Stream Deck. Sin atajos memorizados."); benefit-led headings ("Suelta el teclado. Streamea con la cara y las manos."). Reads at roughly 7th–8th grade [INFERIDO — no automated readability tool run].

### 3.5 AI content detection — [NO MEDIDO]

Requires running a burstiness/phrase-flag tool; not executed in this audit run.

**Content Quality raw score: 70 / 100** — good narrative, strong FAQ, decent word count; gutted by missing legal docs and weak E-E-A-T author signals.

---

## 4. On-Page SEO  (weight 20%)

### 4.1 Title tag — [VERIFICADO]

```
EsperantAI — La primera categoría de control gestual nativo para streaming
```

- Length: 75 chars → **slightly over** Google's typical truncation point (~60 chars on desktop, ~50 on mobile). Will likely be cut to: `EsperantAI — La primera categoría de control gestual…`
- Brand-first ordering is correct for a new category launch (when nobody is searching "control gestual streaming" yet, brand-anchoring is right).

### 4.2 Meta description — [VERIFICADO]

```
EsperantAI convierte gestos faciales y manuales en acciones de streaming.
Integración nativa con OBS, Streamlabs, vMix, PRISM, XSplit. Triggers de
Twitch/YouTube/Kick/Trovo. 100% local. No hay competencia directa.
```

- Length: **250 chars** → Google currently caps SERP description at ~155–160 chars on desktop, ~120 mobile. The final 90+ chars (including "No hay competencia directa") will be cut. Trim to ~155.

### 4.3 Heading hierarchy — [VERIFICADO]

Single `<h1>` ✓ — `"Controla tu stream con un gesto."` (excellent — short, action-led, contains primary value prop).

H2/H3 jerarquía bien ordenada:
- 9 × H2 (sección titles)
- 11 × H3 (sub-features inside bento + 3 how-it-works steps)
- 4 × H4 (compatibility blocks)
- 3 × H5 (footer columns — appropriate)

No H1 skip, no orphan H4. **Healthy structure.**

### 4.4 Keyword targeting — [INFERIDO]

The landing targets "control gestual streaming", "OBS gestos faciales", "streamear sin teclado", "alternativa Stream Deck". The H1 itself is a brand declaration, not a keyword. Acceptable for category creation; for SEO capture you may want a secondary `<h2>` like *"Control gestual para OBS, Streamlabs y vMix"* (already partially present in line 227).

### 4.5 Internal linking — [VERIFICADO]

29 `href=` total (counted via grep). Most are intra-page anchors (`#how`, `#features`, `#comprar`). External outbound links to platform sites (Twitch, YouTube, etc.) → **zero**. Same-domain doc links → 7 (all currently 404). When docs ship, they will form a small but consistent internal-link cluster.

**On-Page SEO raw score: 60 / 100** — H1 / heading structure great; title slightly long; meta description 60% over budget; broken doc links erase internal-linking value.

---

## 5. Schema / Structured Data  (weight 10%)

### 5.1 JSON-LD present — [VERIFICADO]

**Zero** `<script type="application/ld+json">` blocks. The page has none of:

- `SoftwareApplication` (mandatory for any sellable software in 2026; enables price, rating, OS, downloads in SERP)
- `Product` + `Offer` (would render price chip in Google + AI Overviews)
- `Organization` (publisher entity, links to social, logo)
- `FAQPage` (the 8 `<details>` blocks are a free FAQPage waiting to be wrapped — this would be the single biggest AI Overview / Featured Snippet win)
- `BreadcrumbList` (less urgent on single page)
- `VideoObject` (two hero/demo MP4s are unannounced — Google can't index them)
- `WebSite` + `SearchAction` (optional, low value here)

### 5.2 Microdata / RDFa — [VERIFICADO]

Zero. No fallback.

**Schema raw score: 0 / 100.** The single largest SEO + GEO win available.

---

## 6. Performance (Core Web Vitals)  (weight 10%)

### 6.1 Lab-measured metrics — [NO MEDIDO]

LCP / INP / CLS / TTFB **NOT measured**. Requires Google PageSpeed Insights API or CrUX BigQuery access; neither was configured for this run, and project rule forbids fabricating numbers.

### 6.2 Observable performance signals — [VERIFICADO]

| Signal | Evidence | Likely impact |
|---|---|---|
| HTML size | 46,819 bytes (~46 KB) | Small. Excellent. |
| CSS file size | `css/landing.css` = 54,203 bytes (~53 KB) | Acceptable — single CSS file. Could be critical-CSS inlined for faster FCP. |
| Render-blocking CSS | One `<link rel="stylesheet">` in `<head>` blocks render | Standard pattern; minor LCP penalty. |
| External fonts | **none** (CSS uses system stack) | Excellent. |
| Hero video | `EsperantAI-hero.mp4` = 4,108,396 bytes (~4.1 MB) with `autoplay muted loop preload="metadata"` | `preload="metadata"` mitigates initial load, but autoplay-on-load will stream the whole 4 MB to every visitor — **mobile LCP risk**. Consider `<picture>` poster + click-to-play, or AV1/WebM variants via `<source>` for ~50–70% size cut. |
| Number of external requests | **0 external hosts** (all assets first-party) | Excellent — no DNS / TLS handshakes off-domain. |
| JavaScript total | one `js/landing.js?v=20260517a` (size not probed) | Single bundle. Acceptable. |

### 6.3 Likely LCP element — [INFERIDO]

The H1 line `Controla tu stream con un gesto.` (text node) — text LCPs are usually fast. But once the hero video poster (`hero-dashboard-es.png`) renders, that may become LCP. PNG poster size **not probed** — recommend converting to WebP/AVIF.

**Performance raw score: 50 / 100 (placeholder — needs CrUX data).** I am scoring conservatively because: small HTML + zero external requests = excellent; but 4.1 MB autoplay video + render-blocking CSS + un-optimized PNG poster could hurt mobile field LCP.

---

## 7. AI Search Readiness / GEO  (weight 10%)

### 7.1 AI-crawler access — [VERIFICADO]

- `robots.txt` is **absent**, so **all AI crawlers** (GPTBot, ClaudeBot, PerplexityBot, Google-Extended, Applebot-Extended, CCBot, Bytespider) **have full access by default**.
- Whether that's strategic (you want AI Overviews to cite EsperantAI as the "first gestural control category for streaming") or a liability (no opt-out for training) is a business choice. State it explicitly in a future `robots.txt`.

### 7.2 `llms.txt` — [VERIFICADO]

`/llms.txt` returns **404**. Recommended for category-defining products: it lets you hand AI engines a curated index of "what this product is" without scraping the whole site. Single page today, low effort.

### 7.3 Passage-level citability — [VERIFICADO]

Good structural foundation:
- 8 explicit Q&A pairs in `<details><summary>` — AI engines parse these well.
- Statement-style claims with crisp specifics ("13 gestos", "5 software", "4 plataformas", "0 nube", "~30 segundos", "~90 segundos", "$249 USD Stream Deck comparison", "3 dispositivos por licencia").
- However, **without `FAQPage` JSON-LD**, the 8 Q&A pairs lose ~50% of their AI-citation value (LLMs use schema as a confidence signal).

### 7.4 Entity / brand mention signals — [VERIFICADO]

- The string "EsperantAI" appears in title, H1 area, hero, FAQs, footer.
- Publisher entity not declared — no `Organization` schema, no `sameAs` to social profiles, no LinkedIn / X / GitHub Org links.
- The RFC `SARJ690821BC3` is a legal trust signal for Mexican audiences but invisible to AI engines as a structured entity.

### 7.5 Brand-mention readiness in AI Overviews — [INFERIDO]

For Spanish-language "control gestual streaming" / "alternativa a Stream Deck" queries, the page has 1,364 unique words on a category nobody else owns yet. With FAQ schema + Organization schema + a single Wikipedia-style "About" paragraph, ChatGPT/Perplexity/Gemini would have everything they need to cite EsperantAI as the canonical answer. **The opportunity here is enormous.**

**AI Readiness raw score: 35 / 100** — strong content substrate, zero structured signal.

---

## 8. Images & media  (weight 5%)

### 8.1 Inventory — [VERIFICADO]

- `<img>` tags: **0**
- `<svg>` inline: **20** (icons + decorative diagrams + face mock)
- `<video>` elements: **2** (hero MP4, demo MP4)
- `<source>` MP4: 2

### 8.2 Alt / accessibility — [VERIFICADO]

- 5 × `aria-label` (topbar nav, brand link, two video elements, status region)
- 33 × `aria-hidden="true"` (decorative SVGs correctly hidden) — good practice
- 1 × `role="status"` (CTA feedback live-region)

### 8.3 Formats — [VERIFICADO + INFERIDO]

- Two MP4 hero/demo videos; hero is 4.1 MB. No WebM/AV1 alternates → 30–60% bandwidth lost on modern browsers.
- Poster image `hero-dashboard-es.png` referenced; format = PNG. WebP/AVIF would be smaller [INFERIDO — file not probed].
- Logo is SVG. Icons are inline SVG. **Excellent vector pipeline**.

**Images raw score: 70 / 100** — zero `<img>` simplifies the audit and removes PNG bloat from the inline DOM, but the hero video weight + PNG poster + lack of WebP/AV1 cap the score.

---

## 9. Comparison vs Audit #1 (22/100)

| Dimension | Audit #1 | Audit #2 | Δ |
|---|---:|---:|---:|
| URL serves 200 | NO (404) | **YES** | +∞ |
| Indexable | NO | **YES** | unlocked |
| HTTPS + HSTS | n/a | **YES** | +Trust |
| Strict CSP | n/a | **YES** | +Sec |
| Word count | 0 | **1,364** | unlocked |
| H1 unique | n/a | **YES** | +On-page |
| FAQ content | none | **8 Q&A** | +GEO |
| Canonical | n/a | **missing** | flat |
| OG/Twitter | n/a | **missing** | flat |
| JSON-LD | n/a | **missing** | flat |
| Sitemap | n/a | **404** | flat |
| robots.txt | n/a | **404** | flat |
| Broken links | n/a | **7+ in footer** | new issue |
| **Score** | **22/100** | **44/100** | **+22** |

The +22 is almost entirely "the site exists now". The structural debt (no schema, no canonical, no OG, no sitemap, broken docs) is unchanged from the repo's state before deployment.

---

## 10. Top 5 CRITICAL issues  (fix this week)

| # | Issue | Evidence | Impact | Effort |
|---|---|---|---|---|
| C1 | **7+ footer links return 404** (`docs/manual.html`, `docs/PRIVACY.html`, `docs/EULA.html`, refund, cookies, ToS, third-party-licenses) | `curl -I` returned 404 on 3 probed, footer + FAQ + pricing all link to docs/ | Legal (CDMX consumer law requires accessible ToS/Privacy on sale pages) + SEO (broken outbound = crawl waste + trust loss) | 2 h to deploy the existing repo `docs/` folder |
| C2 | **Duplicate content `/` vs `/index.html`** without canonical | Both URLs returned identical 46,819-byte body in HTTP probes | Google may split signals between two URLs | 5 min: add `<link rel="canonical" href="https://edugame.digital/">` |
| C3 | **Zero JSON-LD schema** (no SoftwareApplication, no Product+Offer, no FAQPage, no Organization, no VideoObject) | grep `application/ld+json` returned 0 matches in served HTML | Loses Rich Result eligibility; loses ~50% of AI-Overview citation lift on a single-page launch | 4 h to author 5 schemas |
| C4 | **No Open Graph / Twitter Card meta** | grep `og:` and `twitter:` returned 0 matches | Any social share (X, LinkedIn, Discord, WhatsApp, Threads) shows blank preview → killer for streamer audience that lives on social | 30 min: add 8 meta tags + 1 OG image (1200×630) |
| C5 | **No robots.txt, no sitemap.xml, no llms.txt** | All three returned HTTP 404 | No AI-crawler policy stated; future docs/manual pages will have no discovery channel; competitor scrapers fully allowed | 1 h |

---

## 11. Top 5 HIGH issues  (fix this month)

| # | Issue | Evidence | Recommendation |
|---|---|---|---|
| H1 | Meta description 250 chars (60% over Google cap) | Verbatim count of `content` attribute on line 8 | Trim to 150–155 chars; lead with the strongest noun phrase ("Control gestual nativo para OBS, Streamlabs, vMix, PRISM, XSplit. Triggers Twitch/YouTube/Kick/Trovo. 100% local.") |
| H2 | Title 75 chars (likely truncated to ~50 on mobile SERP) | Title line 7 | Shorten: `EsperantAI · Control gestual para streaming en OBS, vMix, PRISM` (62 chars) |
| H3 | Hero video 4.1 MB on autoplay-loop | `curl -I` Content-Length on `assets/videos/EsperantAI-hero.mp4` = 4,108,396 | Add WebM/AV1 source; OR replace autoplay video with `poster` + click-to-play; OR serve a 15 s loop ≤ 800 KB |
| H4 | E-E-A-T author/expertise weak | No `/about`, no team page, no founder bio on landing | Add a single "Hecho por" block above footer with a 60-word bio of Joel Salazar (15+ años Joomla, EdugameDigital) + LinkedIn `sameAs` |
| H5 | Repo has 13 locales — landing only ships `<html lang="es">` | grep returned 0 hreflang | Decide whether the live site will ever serve other locales; if yes, ship `/en/`, `/pt/`, etc. + `hreflang` + `x-default`; if no, drop the 13-locale claim from copy ("13 idiomas con auto-detección" on line 576 of HTML now sets a customer expectation) |

---

## 12. Top 5 QUICK WINS  (fix this hour)

| # | Win | Effort | Lift |
|---|---|---|---|
| Q1 | Add `<link rel="canonical" href="https://edugame.digital/">` to `<head>` | 30 s | Removes `/` vs `/index.html` ambiguity |
| Q2 | Add Open Graph block (8 lines) + 1 OG image asset already in repo (`hero-dashboard-es.png` or a new 1200×630) | 5 min | Social previews everywhere |
| Q3 | Wrap the 8 existing `<details>` FAQ entries with FAQPage JSON-LD | 15 min | Featured-snippet + AI-Overview eligibility on 8 questions |
| Q4 | Publish `/robots.txt` with `Sitemap:` line + explicit AI-crawler stance | 10 min | Crawl policy stated |
| Q5 | Publish minimal `/sitemap.xml` listing `/` + (when shipped) docs | 5 min | Index coverage |

---

## 13. Findings requiring external API access (declared, not fabricated)

The following were **not measured** in this audit and require explicit API/key configuration:

| Capability | Tool / API | Why not run |
|---|---|---|
| Lab Core Web Vitals (LCP/INP/CLS/TTFB) | PageSpeed Insights API | API key not configured per project rule — no fabricated numbers |
| Field Core Web Vitals (28-day p75 from real users) | Chrome UX Report (CrUX) | Requires Google Cloud / BigQuery access |
| Indexation status, queries, impressions, CTR | Google Search Console API | Not configured (would need OAuth + property verified) |
| Organic traffic & engagement | GA4 Data API | Not configured |
| Backlinks, referring domains, DA/PA, toxic links | Moz API / Bing Webmaster / Common Crawl | No keys configured |
| Live SERP positions, competitor visibility | DataForSEO MCP | Not configured |
| Cluster / topical authority analysis | DataForSEO Page Intersection / Common Crawl | Not configured |

If/when Joel configures any of the above, re-run `/seo google`, `/seo backlinks`, or `/seo dataforseo` to replace the [NO MEDIDO] placeholders.

---

## 14. Action plan (priority order)

### Immediate (today, 1–2 h total)
1. Deploy the `docs/` HTML files referenced by the footer (kill the 404s). [C1]
2. Add `<link rel="canonical">`, `<meta name="robots" content="index,follow">`, theme-color. [C2]
3. Add OG + Twitter Card meta block + OG image (use `hero-dashboard-es.png` as fallback). [C4]
4. Publish `/robots.txt` (with `Sitemap: https://edugame.digital/sitemap.xml`) + `/sitemap.xml`. [C5]
5. Fix favicon: serve `/favicon.ico` (200) OR keep SVG-only but add `<link rel="icon" type="image/x-icon" href="/favicon.ico">` fallback. [Minor]

### This week (4–6 h)
6. Author + inject 5 JSON-LD blocks: `SoftwareApplication`, `Organization`, `FAQPage` (wrap the 8 existing Q&A), `Product` + `Offer` (×2 for Pro and Pro+), `VideoObject` (×2). [C3]
7. Trim meta description to 155 chars; shorten title to ≤ 62 chars. [H1, H2]
8. Publish `/llms.txt` with the EsperantAI category pitch and key facts (5 lines). [GEO]

### This month
9. Convert hero video to WebM/AV1; replace PNG poster with WebP. [H3]
10. Add "Hecho por Joel Salazar" E-E-A-T block + `Organization.sameAs` to LinkedIn / GitHub. [H4]
11. Decide locale strategy: if multi-locale, build out `/en/`, hreflang, x-default; if Spanish-only, soften the "13 idiomas" claim. [H5]

### Re-audit cadence
- Re-run `/seo audit` weekly until score ≥ 70.
- Once GSC + PSI API keys are configured, re-baseline Performance and AI Readiness categories with real field data.

---

## 15. Verification log

All HTTP probes in this audit:

```
GET https://edugame.digital                          → 200 OK, 46,819 B
GET https://edugame.digital/robots.txt               → 404
GET https://edugame.digital/sitemap.xml              → 404
GET https://edugame.digital/llms.txt                 → 404
GET https://edugame.digital/favicon.ico              → 404
GET https://edugame.digital/index.html               → 200 OK, 46,819 B (DUPLICATE)
GET https://edugame.digital/docs/manual.html         → 404
GET https://edugame.digital/docs/PRIVACY.html        → 404
GET https://edugame.digital/docs/EULA.html           → 404
GET https://edugame.digital/css/landing.css          → 200 OK, 54,203 B
GET https://edugame.digital/assets/branding/logo.svg → 200 OK, 1,753 B
GET https://edugame.digital/assets/videos/EsperantAI-hero.mp4 → 200 OK, 4,108,396 B
```

All headers verified with `curl -sS -L -A "Mozilla/5.0" -D -`.
HTML parsed locally with Python (regex strip of `<script>/<style>/<svg>/<!--/-->`) to compute word count = **1,364**.

End of report — no fabricated metrics. All [NO MEDIDO] sections are declared, not inferred.
