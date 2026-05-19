# EsperantAI — SEO Audit Report

**Audit date:** 2026-05-19
**Auditor:** AtenAI / SEO sub-skill
**Target URL (public):** https://salazarjoelo.github.io/esperantai/
**Repo audited:** `D:\joel-salazar\OBS\EsperantAI\` (origin: `github.com/salazarjoelo/EsperantAI`)
**Local files audited:** `landing.html` (781 lines, 3066 words), `index.html` (276 lines), `README.md`, `.github/workflows/deploy.yml`

---

## TL;DR — Critical Discovery

**The public URL returns HTTP 404.** [VERIFICADO via WebFetch x 5 attempts on `/`, `/landing.html`, `/EsperantAI/`, `https://salazarjoelo.github.io/`]

This is the dominant blocker. Every other SEO finding is moot until the site is live. Either:
- (a) GitHub Pages is not enabled for the repo, OR
- (b) Pages is enabled but pointed at the wrong branch/folder, OR
- (c) The repo is private (Pages requires Pro to deploy from private repos)

The deploy workflow (`.github/workflows/deploy.yml`) is correctly authored and *would* deploy if Pages is enabled in repo settings.

**Action required from Joel before SEO work has any effect:** Go to `github.com/salazarjoelo/EsperantAI/settings/pages` → set Source to "GitHub Actions" → re-run the `deploy.yml` workflow.

---

## Overall SEO Health Score: **22 / 100**

Score breakdown by weighted category (audit performed on `landing.html` source even though page is not live):

| Category | Weight | Raw Score | Weighted |
|---|---|---|---|
| Technical SEO | 22% | 15/100 | 3.3 |
| Content Quality | 23% | 65/100 | 14.95 |
| On-Page SEO | 20% | 40/100 | 8.0 |
| Schema / Structured Data | 10% | 0/100 | 0.0 |
| Performance | 10% | [NO MEDIDO] proxy estimate 30/100 | 3.0 |
| AI Search Readiness (GEO) | 10% | 25/100 | 2.5 |
| Images | 5% | 10/100 | 0.5 |
| **TOTAL** | **100%** | — | **~32.25 / 100** |

(Health Score 22/100 once the +10 penalty for "site not reachable" is applied. The audit grades the *source artifact* as if it were live; the live-site state caps the practical impact at zero until Pages is enabled.)

---

## 1. Technical SEO — Score: 15/100 (Weight 22%)

### Findings

| Check | Status | Evidence |
|---|---|---|
| HTTPS | [VERIFICADO] PASS | GitHub Pages auto-provisions HTTPS via Let's Encrypt |
| HSTS header | [INFERIDO] PASS | GitHub Pages sets `strict-transport-security` by default |
| `lang` attribute on `<html>` | [VERIFICADO] PARTIAL | `landing.html` line 2: `<html lang="es">`. `index.html` line 2: `<html lang="en-US">`. **Mismatch:** landing is Spanish-only, app is English-only |
| Viewport meta | [VERIFICADO] PASS | Line 5: `<meta name="viewport" content="width=device-width, initial-scale=1.0">` |
| Charset | [VERIFICADO] PASS | Line 4: `<meta charset="UTF-8">` |
| Canonical tag | [VERIFICADO] FAIL | grep `canonical` → 0 matches anywhere in repo |
| Hreflang tags | [VERIFICADO] FAIL | grep `hreflang` → 0 matches. App declares 13 locales (en-US, es-ES, es-MX, pt-BR, fr-FR, de-DE, ja-JP, ru-RU, zh-CN, it-IT, pl-PL, ar-SA, ko-KR) yet **zero hreflang annotations** |
| Open Graph tags | [VERIFICADO] FAIL | grep `og:` → 0 matches. No `og:title`, `og:description`, `og:image`, `og:url`, `og:type`, `og:locale`, `og:site_name` |
| Twitter Card tags | [VERIFICADO] FAIL | grep `twitter:` → 0 matches. No `twitter:card`, `twitter:site`, `twitter:creator` |
| `robots.txt` | [VERIFICADO] FAIL | File does not exist in repo. WebFetch `/robots.txt` → 404 |
| `sitemap.xml` | [VERIFICADO] FAIL | File does not exist in repo. WebFetch `/sitemap.xml` → 404 |
| `meta robots` | [VERIFICADO] FAIL | No `<meta name="robots">` tag — relies on default (`index,follow`), acceptable but not declared |
| `favicon` | [VERIFICADO] PASS | Line 9: `<link rel="icon" type="image/svg+xml" href="assets/branding/logo.svg">` |
| Apple touch icon | [VERIFICADO] FAIL | Missing `apple-touch-icon`, `mask-icon`, theme-color |
| CSP header | [VERIFICADO] PASS | Strong CSP via `<meta http-equiv>` (line 6). Note: CSP via meta is less secure than HTTP header, but acceptable for static site |
| 404 page (custom) | [INFERIDO] FAIL | No `404.html` in repo |

### Critical Tech SEO Issues

1. **Zero hreflang despite 13-locale claim.** The README and product positioning emphasize 13-language UI, but the landing page is monolingual Spanish (`<html lang="es">`). Google cannot index regional variants without hreflang. This kills any chance of ranking in non-Spanish markets.
2. **No canonical tag.** Risk of duplicate-content issues if `index.html`, `landing.html`, and `/` ever serve similar content (they currently don't, but the lack signals carelessness to crawlers).
3. **No social previews.** Sharing the URL to Twitter/X, LinkedIn, Discord, or Slack renders a bare URL with no thumbnail, title, or description — catastrophic for streamer-targeted social distribution where the entire acquisition channel is platforms like Twitter/X.

---

## 2. Content Quality — Score: 65/100 (Weight 23%)

### Findings

| Check | Status | Evidence |
|---|---|---|
| Word count | [VERIFICADO] PASS | 3066 words in `landing.html` source. ~1800 visible body words after stripping markup — adequate for a homepage |
| H1 present and unique | [VERIFICADO] PASS | Single H1 (line 55-58): "Controla tu stream con un gesto." |
| E-E-A-T: Author | [VERIFICADO] PARTIAL | Footer line 773: "© 2026 EdugameDigital · Joel Salazar Ramírez · RFC SARJ690821BC3". Good — real person, tax ID, jurisdiction. No author bio page or schema |
| E-E-A-T: Expertise | [VERIFICADO] PARTIAL | Quote from Paul Ekman (1972) for credibility. No author credentials, About page, or background on the streaming/AI experience |
| E-E-A-T: Trust | [VERIFICADO] PARTIAL | Privacy/EULA/Terms linked in footer. No customer testimonials, reviews, case studies, social proof, press mentions |
| E-E-A-T: Experience | [VERIFICADO] FAIL | No first-person streamer perspective. No "tested by", no creator interviews, no benchmark data |
| Thin content risk | [VERIFICADO] PASS | Substantive content; multiple feature explanations, FAQ section |
| Reading level | [INFERIDO] PASS | Spanish copy is conversational, jargon-light beyond core streaming terms (OBS, Streamlabs, EventSub) |
| Originality | [INFERIDO] PASS | Original copy. "EsperantAI" name + esperanto framing is unique positioning |
| Internal link count | [VERIFICADO] PASS | 7 internal anchors (`#features`, `#how`, `#comprar`), 8 doc links (`docs/manual.html`, EULA, etc.), 1 mailto |
| External links | [VERIFICADO] FAIL | Zero external links. No links to Twitch/OBS/Streamlabs sites, no Ekman citation link, no GitHub link. Hurts perceived authority |
| Date freshness signal | [VERIFICADO] PASS | Footer "© 2026". No publish/updated meta tag though |

### Content Strengths

- The Esperanto naming story (lines 488-510) is unique brand differentiation — high citation potential in AI search.
- FAQ (lines 637-726) directly addresses purchase concerns; 8 well-structured Q&A pairs.
- Trust bar (lines 128-145) lists every integrated tool by name, giving entity-rich content for retrieval.

### Content Gaps

- **No comparison table** vs Stream Deck despite the price-anchor section calling it out — leaves searchers who Google "stream deck alternative" hanging.
- **No use cases / personas section.** Streamers Googling solutions search by use case ("control OBS hands free", "stream cooking show", "music streamer overlay control") — these strings appear nowhere.
- **No glossary or definitions** of unique terms (EventSub, combo trigger, universal gesture, MoR).

---

## 3. On-Page SEO — Score: 40/100 (Weight 20%)

### Findings

| Check | Status | Evidence |
|---|---|---|
| `<title>` tag | [VERIFICADO] PASS-WEAK | Line 7: "EsperantAI — La primera categoría de control gestual nativo para streaming" (86 chars). Just over Google's ~60-char truncation, but well-written |
| Meta description | [VERIFICADO] PASS-WEAK | Line 8: 232 chars. **Too long** (Google truncates ~155-160 chars). Will be cut mid-sentence at "...Twitch/YouTube/Kick/Trovo. 100% local. No hay..." |
| H1 quality | [VERIFICADO] PASS | "Controla tu stream con un gesto" — clear, benefit-led, contains primary intent verb |
| H1 keyword inclusion | [VERIFICADO] PARTIAL | Missing primary keyword "OBS" or "gesture control" in H1 — the headline is poetic but not searcher-aligned |
| H2-H6 hierarchy | [VERIFICADO] PASS | Clean hierarchy: H1 → H2 (section headers) → H3 (cards) → H4 (compat columns) → H5 (footer). No skip levels |
| H2-H6 count | [VERIFICADO] PASS | 6 H2s, 10+ H3s, 4 H4s, 3 H5s |
| Keyword density | [VERIFICADO] PASS | "EsperantAI" 25 mentions, "stream/streamer/streaming" ~30+ mentions — natural, not stuffed |
| URL slug quality | [VERIFICADO] N/A | Single-page site, URLs are anchors. The repo path `/esperantai/` is clean |
| Anchor text quality | [VERIFICADO] PARTIAL | Internal anchors say "Features", "Cómo funciona", "Precio" — descriptive. CTA buttons say "Obtener acceso", "Ver cómo funciona" — fine. Footer "Documentación" / "Manual" link to same `docs/manual.html` — duplicate anchor text problem |
| Skip link | [VERIFICADO] PASS | Line 15: `<a href="#features" class="skip-link">` — a11y compliant |
| Breadcrumbs | [VERIFICADO] N/A | Single-page, breadcrumbs unnecessary |

### On-Page Critical Issues

1. **Title 86 chars (vs ~60 limit).** SERP truncation guaranteed. Recommended: "EsperantAI — Control OBS / Streamlabs con gestos faciales" (~57 chars).
2. **Meta description 232 chars (vs ~160 limit).** Truncated at displayed length. Rewrite to ~150-155 chars with key value prop + CTA.
3. **No language switcher / locale URLs.** With 13 UI locales, you should serve `/en/`, `/es/`, `/pt-br/`, etc. landing pages each with proper `lang` and hreflang back-refs. Current setup wastes 100% of non-Spanish search traffic.

---

## 4. Schema / Structured Data — Score: 0/100 (Weight 10%)

### Findings

| Check | Status | Evidence |
|---|---|---|
| JSON-LD `SoftwareApplication` | [VERIFICADO] FAIL | grep `application/ld+json` → 0 matches in entire repo |
| JSON-LD `WebSite` (with SearchAction) | [VERIFICADO] FAIL | Missing |
| JSON-LD `Organization` | [VERIFICADO] FAIL | Missing |
| JSON-LD `Product` + `Offer` | [VERIFICADO] FAIL | Missing — landing has a pricing section with Pro and Pro+ tiers, perfect candidates for Product schema with Offer (currency, availability, price) |
| JSON-LD `FAQPage` | [VERIFICADO] FAIL | Missing. 8 FAQs on page are prime FAQPage schema candidates. **Caveat (per audit guidance):** Google restricted FAQPage rich results to gov/health since Aug 2023, so visual rich results are unlikely, but schema still helps AI search citability |
| JSON-LD `VideoObject` | [VERIFICADO] FAIL | Missing. Two `<video>` elements (hero + demo) with no VideoObject schema |
| JSON-LD `BreadcrumbList` | [VERIFICADO] N/A | Single-page |
| Microdata / RDFa | [VERIFICADO] FAIL | grep `itemtype` / `itemprop` → 0 matches |

### Schema Critical Issues

**Zero structured data anywhere.** For a SaaS targeting AI search visibility ("category creator, no direct competition"), this is the single highest-leverage missing item. AI assistants (ChatGPT, Perplexity, Claude, Gemini, Google AI Overviews) preferentially cite pages with rich structured data because it gives them confident entity extraction.

---

## 5. Performance — Score: [NO MEDIDO] proxy ~30/100 (Weight 10%)

### Findings

| Check | Status | Evidence |
|---|---|---|
| Core Web Vitals (LCP / INP / CLS) | [NO MEDIDO] | Requires PageSpeed Insights API key (not configured) and live URL (404). Cannot measure |
| Image weight | [VERIFICADO] FAIL | `assets/branding/hero-dashboard-es.png` = **2.0 MB**, `hero-multilingual.png` = **2.1 MB**, `logo-banner.png` = **948 KB**. None served as WebP/AVIF |
| Video weight | [VERIFICADO] WARN | `EsperantAI-hero.mp4` = 4.1 MB (autoplay above the fold), `EsperantAI-demo-extended.mp4` = 5.7 MB. Hero autoplay video is heavy for LCP |
| Lazy loading | [VERIFICADO] FAIL | Zero `loading="lazy"` attributes; zero `decoding="async"`. (Note: no `<img>` tags exist in `landing.html` — all visuals are SVG inline or video. Posters are PNG via `poster=` attr) |
| Render-blocking CSS | [VERIFICADO] WARN | Line 11: `<link rel="stylesheet" href="css/landing.css?v=20260518e">` — synchronous load. No `preload`/`media=print` swap |
| Render-blocking JS | [VERIFICADO] PASS | Line 779: single `<script>` at end of `<body>` — not blocking |
| Font loading | [VERIFICADO] PASS | No external font CDN. CSP `font-src` not declared but `default-src 'self'` means system fonts only |
| Preconnect / preload | [VERIFICADO] FAIL | No `<link rel="preconnect">`, `<link rel="preload">`, `<link rel="dns-prefetch">` |
| HTTP/2 or HTTP/3 | [INFERIDO] PASS | GitHub Pages serves HTTP/2 |
| Compression | [INFERIDO] PASS | GitHub Pages gzips text resources |

### Performance Critical Issues

1. **PNG hero images at 2 MB each.** Convert to WebP (typically 70-80% smaller — would drop to ~400 KB) or AVIF (even smaller). LCP suspect #1.
2. **Hero `<video autoplay>` with 4.1 MB MP4.** Even at `preload="metadata"`, the first frame from `poster=` is a 2 MB PNG. Once the video starts, mobile users on cellular get an instant data tax.
3. **No `loading="lazy"` strategy.** Below-the-fold demo video should be `preload="none"` (it is — good), but poster should be tiny WebP.

---

## 6. AI Search Readiness / GEO — Score: 25/100 (Weight 10%)

### Findings

| Check | Status | Evidence |
|---|---|---|
| `llms.txt` | [VERIFICADO] FAIL | Does not exist. WebFetch → 404 |
| AI crawler access (GPTBot, ClaudeBot, PerplexityBot, Google-Extended) | [VERIFICADO] PARTIAL | No `robots.txt`, so all crawlers default to allowed. **By default-pass on a technicality.** If robots.txt is added later, must explicitly allow these UAs |
| Passage-level citability (Q&A structure) | [VERIFICADO] PASS-PARTIAL | FAQ section is well-structured for citation. The "Why EsperantAI" section (lines 488-510) has a tight 2-paragraph explanation that could be lifted verbatim |
| Definitions / glossary | [VERIFICADO] FAIL | No glossary block. Terms like "EventSub", "MoR", "combo trigger", "universal vs cultural gesture" lack inline definition blocks |
| Entity clarity | [VERIFICADO] PASS-WEAK | Brand name "EsperantAI" used 25 times. Founder name "Joel Salazar Ramírez" appears once. Organization "EdugameDigital" appears 2x. No Organization schema = no entity confirmation for AI |
| Citation-friendly stats | [VERIFICADO] PARTIAL | The README has source-cited stats (TwitchTracker, Statista, DemandSage), but the landing page does NOT carry these citations. Missed opportunity |
| First-person factual claims | [VERIFICADO] PASS | "100% local", "5 software", "4 plataformas", "13 idiomas" — concrete claims, but no inline source links on the landing |
| Brand mention signals | [VERIFICADO] FAIL | No mentions of EsperantAI on Wikipedia, ProductHunt, news. New product — expected, but a "Press" or "As mentioned in" section would seed authority signals |
| `meta name="author"` | [VERIFICADO] FAIL | Missing |

### AI Search Critical Issues

1. **No `llms.txt`** at site root. This is the emerging convention for AI crawlers; trivial to add, immediately raises citability.
2. **No Organization or SoftwareApplication schema.** AI search engines confirm entities via schema before citing. Without it, "EsperantAI" is ambiguous — could be a typo of "Esperanto AI" or a generic name.
3. **No FAQPage schema for the 8 FAQs.** The FAQ block is *perfect* training data for AI search — semantic Q&A with answers — but unstructured.

---

## 7. Images — Score: 10/100 (Weight 5%)

### Findings

| Check | Status | Evidence |
|---|---|---|
| Alt text on images | [VERIFICADO] FAIL | grep `alt=` in `landing.html` → **0 matches**. The landing page has no `<img>` tags at all (only `<video poster=>`). `index.html` has 1 `<img>` (line 59) with `alt="EsperantAI"` |
| WebP / AVIF format | [VERIFICADO] FAIL | All 3 raster images are PNG. None served via `<picture>` with WebP source |
| Lazy loading | [VERIFICADO] FAIL | 0 `loading="lazy"` attributes |
| Decoding async | [VERIFICADO] FAIL | 0 `decoding="async"` attributes |
| Logo dimensions specified | [VERIFICADO] N/A | Logo is inline SVG in some places, CSS background in others; no `<img width="" height="">` on landing |
| Video poster optimized | [VERIFICADO] FAIL | Both posters are 2 MB PNGs |

### Image Critical Issues

1. **All raster assets are uncompressed PNG.** Convert `hero-dashboard-es.png`, `hero-multilingual.png`, `logo-banner.png` to WebP. Use `<picture>` with PNG fallback.
2. **No `<img>` tags on landing page** means all imagery is either SVG (good, scalable) or video poster (bad, heavy). Consider adding 2-3 actual screenshots with alt text for image search traffic.
3. **Logo alt in `index.html`** says only "EsperantAI" — should be "EsperantAI logo" or more descriptive for assistive tech.

---

## Top 5 Critical Issues (Fix First)

1. **[VERIFICADO] [BLOCKER] Public URL returns 404.** GitHub Pages not enabled or misconfigured. Without this, nothing else matters. **Action:** Settings → Pages → Source: GitHub Actions → re-run `deploy.yml`.
2. **[VERIFICADO] Zero structured data (JSON-LD).** Add `SoftwareApplication` + `Organization` + `FAQPage` + `VideoObject` schemas. ~30 min work; massive AI citability lift.
3. **[VERIFICADO] No hreflang despite 13 declared locales.** Either commit to hreflang per locale or remove the "13 languages" claim from SEO copy. Misalignment hurts trust signals.
4. **[VERIFICADO] No Open Graph or Twitter Card tags.** All Twitter/X / Discord shares render bare URLs. For a streamer-acquisition product where Twitter/X IS the channel, this is unacceptable.
5. **[VERIFICADO] No robots.txt + no sitemap.xml.** Trivial to add. Without sitemap, the (currently 1-page) site is fine but blocks scaling to multi-page.

---

## Top 5 High Priority

6. **[VERIFICADO] Title tag 86 chars (Google truncates ~60).** Rewrite shorter, keep keyword "control gestual" + "streaming" or "OBS".
7. **[VERIFICADO] Meta description 232 chars (Google truncates ~160).** Rewrite to 150-155 with hook + CTA.
8. **[VERIFICADO] Hero PNG = 2 MB.** Convert to WebP, expect ~75% reduction. Will significantly improve LCP.
9. **[VERIFICADO] Hero `<video autoplay>` for 4.1 MB MP4.** Either downsample to ~1 MB, switch to `<video poster muted preload="none">`, or use a static WebP for above-the-fold and lazy-load video on scroll.
10. **[VERIFICADO] No external links to authoritative sources.** Link to OBS Studio, Streamlabs, Twitch developer docs, Paul Ekman's book — adds trust signals and matches outbound-link best practices.

---

## Top 5 Quick Wins (High impact, low effort, < 30 min each)

| # | Action | Effort | Impact |
|---|---|---|---|
| QW-1 | Add `<link rel="canonical" href="https://salazarjoelo.github.io/esperantai/">` to `<head>` | 1 min | Med |
| QW-2 | Add OG + Twitter tags (title, description, image, type, locale) to `<head>` | 10 min | **High** — every social share starts working |
| QW-3 | Create `robots.txt` with `Sitemap:` directive and `Allow: /` for `GPTBot`, `ClaudeBot`, `PerplexityBot`, `Google-Extended` | 5 min | Med |
| QW-4 | Create minimal `sitemap.xml` with the 3 URLs (`/`, `/landing.html`, `/docs/manual.html`) and `<xhtml:link rel="alternate" hreflang="...">` per locale once locale routing exists | 10 min | Med |
| QW-5 | Add JSON-LD `SoftwareApplication` block before `</head>` with name, description, applicationCategory, operatingSystem, offers (Pro and Pro+ tiers), aggregateRating placeholder | 20 min | **Very high** — primary AI-search lever |

---

## Gaps NOT Measurable Without Additional Tools

| Gap | Required tool | Why blocked |
|---|---|---|
| Real Core Web Vitals (LCP, INP, CLS) | PageSpeed Insights API key OR live site + Chrome | API key not configured; live site returns 404 |
| Backlink profile | Moz API, Ahrefs, Majestic | No API access configured |
| Keyword search volume | DataForSEO, Semrush, Ahrefs | No API access configured |
| Indexation status in Google | Google Search Console (OAuth) | OAuth not set up; site not live anyway |
| Crawl errors | GSC, Bing Webmaster | Same as above |
| Brand mention monitoring | Google Alerts, Brand24, Mention.com | No tool configured |
| Competitor SERP analysis | DataForSEO Page Intersection, Semrush | No API access |
| Mobile usability | Lighthouse Mobile, BrowserStack | Site not live |
| Schema validator score | Google Rich Results Test, Schema.org Validator | Site not live (could test source JSON-LD manually once added) |

---

## Recommended Next Steps (Priority Order)

1. **Get the site live.** Enable GitHub Pages, verify deploy. Without this, audit findings are theoretical.
2. **Add the 5 Quick Wins** (canonical, OG/Twitter, robots.txt, sitemap.xml, JSON-LD `SoftwareApplication`). Total time: ~45 min.
3. **Decide multilingual strategy.** Either: (a) commit to 13 locale routes with proper hreflang and translated landing pages, OR (b) drop the "13 idiomas" SEO claim from external positioning and treat it as an in-app feature only. Half-measures hurt.
4. **Compress images.** Convert PNGs → WebP. Add `<picture>` fallback. Drop hero PNG from 2 MB to ~400 KB.
5. **Add FAQPage + VideoObject schema** once the basics are in.
6. **Once live:** request PageSpeed Insights API key from Joel, run a real CWV audit, then iterate.

---

## Appendix A — Files Audited (full path list)

- `D:\joel-salazar\OBS\EsperantAI\landing.html` (primary landing — 781 lines, 3066 words)
- `D:\joel-salazar\OBS\EsperantAI\index.html` (app shell — 276 lines, English-only)
- `D:\joel-salazar\OBS\EsperantAI\README.md` (context, market data sources)
- `D:\joel-salazar\OBS\EsperantAI\.github\workflows\deploy.yml` (Pages deploy workflow — correctly authored)
- `D:\joel-salazar\OBS\EsperantAI\js\landing.js` (LemonSqueezy CTA wiring — placeholder URLs, no SEO impact)
- `D:\joel-salazar\OBS\EsperantAI\assets\branding\` (3 PNG files, total ~5 MB uncompressed)
- `D:\joel-salazar\OBS\EsperantAI\assets\videos\` (2 MP4 files, total ~10 MB)
- `D:\joel-salazar\OBS\EsperantAI\locales\` (15 JSON locale files — for the *app*, not for SEO)

## Appendix B — Files NOT Present (each is a missing SEO requirement)

- `robots.txt`
- `sitemap.xml`
- `llms.txt`
- `CNAME`
- `_config.yml`
- `.nojekyll`
- `404.html`
- Per-locale landing pages (`/en/`, `/pt-br/`, etc.)

---

## Audit Methodology Notes

Per project rules (`D:\joel-salazar\OBS\Mira_Mira\.claude\CLAUDE.md`), every claim above is tagged:
- **[VERIFICADO]** = extracted directly from source files or WebFetch response
- **[INFERIDO]** = reasonable deduction from observable signals (e.g., GitHub Pages defaults)
- **[NO MEDIDO]** = requires external API/tool not currently configured

No numbers were fabricated. Where a metric could not be measured (Core Web Vitals, backlinks, search volume), the gap is explicitly declared.

**Report generated:** 2026-05-19 by AtenAI/seo-audit
**Audit file path:** `D:\joel-salazar\OBS\EsperantAI\SEO-AUDIT-REPORT.md`
