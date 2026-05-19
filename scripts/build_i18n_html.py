#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""
Build pre-rendered HTML per locale for SEO.

Lee landing.html (base ES) + locales/landing-XX.json (15 idiomas) y genera:
- dist/landing-i18n/<locale>/index.html con todos los textos traducidos en HTML inicial,
  JSON-LD traducido (FAQPage, SoftwareApplication), hreflang completo,
  og:locale correcto y RTL automatico para ar-*.
- dist/landing-i18n/sitemap.xml con xhtml:link alternates entre todas las versiones.

Por que: el i18n client-side era OK para UX pero los crawlers (Bing, AI bots,
Yandex, Baidu) no ejecutan JS o lo hacen limitado. Para SEO real Google+otros
necesitan HTML con title/meta/JSON-LD ya en el idioma desde el primer byte.

URL plan:
  /                  -> ES (x-default), copy de /es-es/
  /es-es/            -> ES (Spain)
  /es-mx/            -> ES (Mexico)
  /en-us/            -> EN (US)
  /pt-br/            -> PT (Brazil)
  /fr-fr/, /de-de/, /ja-jp/, /ru-ru/, /zh-cn/, /it-it/, /pl-pl/,
  /ar-sa/, /ko-kr/, /hi-in/, /id-id/

Usage:
    python scripts/build_i18n_html.py
"""
import json
import re
import sys
import shutil
from pathlib import Path
from bs4 import BeautifulSoup
from bs4.element import NavigableString, Tag

# Force UTF-8 stdout on Windows (CJK + Arabic + Devanagari output)
if sys.platform == 'win32':
    import io
    sys.stdout = io.TextIOWrapper(sys.stdout.buffer, encoding='utf-8')

ROOT = Path(__file__).resolve().parent.parent
LANDING_HTML = ROOT / 'landing.html'
LOCALES_DIR = ROOT / 'locales'
OUT_DIR = ROOT / 'dist' / 'landing-i18n'
BASE_URL = 'https://edugame.digital'

LOCALES = [
    ('es-ES', 'es_ES', False),
    ('es-MX', 'es_MX', False),
    ('en-US', 'en_US', False),
    ('pt-BR', 'pt_BR', False),
    ('fr-FR', 'fr_FR', False),
    ('de-DE', 'de_DE', False),
    ('ja-JP', 'ja_JP', False),
    ('ru-RU', 'ru_RU', False),
    ('zh-CN', 'zh_CN', False),
    ('it-IT', 'it_IT', False),
    ('pl-PL', 'pl_PL', False),
    ('ar-SA', 'ar_SA', True),   # RTL
    ('ko-KR', 'ko_KR', False),
    ('hi-IN', 'hi_IN', False),
    ('id-ID', 'id_ID', False),
]

def get_by_path(obj, path):
    cur = obj
    for part in path.split('.'):
        if not isinstance(cur, dict) or part not in cur:
            return None
        cur = cur[part]
    return cur

def strip_html(s):
    """Remove inline HTML tags for use in JSON-LD text fields."""
    return re.sub(r'<[^>]+>', '', s).strip()

def build_hreflang_block(current_locale):
    """Return list of <link rel="alternate" hreflang="X" href="..."> tags as HTML string."""
    lines = []
    for loc, _, _ in LOCALES:
        href = f"{BASE_URL}/{loc.lower()}/"
        lines.append(f'<link rel="alternate" hreflang="{loc.lower()}" href="{href}">')
    # x-default = es-ES
    lines.append(f'<link rel="alternate" hreflang="x-default" href="{BASE_URL}/">')
    return '\n    '.join(lines)

def render_locale(html_source, locale_data, locale_code, og_locale, is_rtl, alternates_html):
    """Generate the full pre-rendered HTML for one locale."""
    soup = BeautifulSoup(html_source, 'lxml')

    # 1. <html lang="...">
    html_tag = soup.find('html')
    html_tag['lang'] = locale_code
    if is_rtl:
        html_tag['dir'] = 'rtl'
    elif 'dir' in html_tag.attrs:
        del html_tag['dir']

    # 2. Apply data-i18n to text content / inner HTML
    for el in soup.find_all(attrs={'data-i18n': True}):
        key = el['data-i18n']
        val = get_by_path(locale_data, key)
        if val is None:
            continue
        # Special handling
        if el.name == 'title':
            el.clear()
            el.append(NavigableString(val))
        elif el.name == 'meta':
            el['content'] = val
        else:
            # If key ends with _html: parse as HTML (preserves inline tags)
            if key.endswith('_html'):
                inner_soup = BeautifulSoup(val, 'lxml')
                # bs4 wraps fragments in <html><body>, extract inner content
                body = inner_soup.find('body')
                if body:
                    el.clear()
                    for child in list(body.children):
                        el.append(child)
                else:
                    el.string = val
            else:
                el.clear()
                el.append(NavigableString(val))

    # 3. Apply data-i18n-attr ("alt:key,aria-label:key2")
    for el in soup.find_all(attrs={'data-i18n-attr': True}):
        spec = el['data-i18n-attr']
        for pair in spec.split(','):
            if ':' not in pair:
                continue
            attr, key = pair.split(':', 1)
            attr = attr.strip()
            key = key.strip()
            val = get_by_path(locale_data, key)
            if val is not None:
                el[attr] = val

    # 4. og:locale content
    og_locale_tag = soup.find('meta', attrs={'property': 'og:locale'})
    if og_locale_tag:
        og_locale_tag['content'] = og_locale

    # Remove existing og:locale:alternate tags
    for t in soup.find_all('meta', attrs={'property': 'og:locale:alternate'}):
        t.decompose()
    # Add og:locale:alternate for all OTHER locales
    head = soup.find('head')
    for loc, og_loc, _ in LOCALES:
        if og_loc != og_locale:
            tag = soup.new_tag('meta')
            tag['property'] = 'og:locale:alternate'
            tag['content'] = og_loc
            head.append(tag)

    # 5. Update og:image to localized version if available (use es-ES default for now)
    # Keep current og:image — hero-dashboard-es.png. Future: localized screenshots.

    # 6. canonical to localized URL
    canonical = soup.find('link', attrs={'rel': 'canonical'})
    if canonical:
        canonical['href'] = f"{BASE_URL}/{locale_code.lower()}/"

    # 7. Insert hreflang block (right after canonical).
    # Build each <link> tag fresh via soup.new_tag so they're independent nodes.
    if canonical:
        # Insert in reverse so final DOM order matches LOCALES order
        last_inserted = canonical
        for loc, _, _ in LOCALES:
            tag = soup.new_tag('link')
            tag['rel'] = 'alternate'
            tag['hreflang'] = loc.lower()
            tag['href'] = f"{BASE_URL}/{loc.lower()}/"
            last_inserted.insert_after(tag)
            last_inserted = tag
        # x-default
        tag = soup.new_tag('link')
        tag['rel'] = 'alternate'
        tag['hreflang'] = 'x-default'
        tag['href'] = f"{BASE_URL}/"
        last_inserted.insert_after(tag)

    # 8. Rewrite JSON-LD scripts
    for script in soup.find_all('script', attrs={'type': 'application/ld+json'}):
        try:
            data = json.loads(script.string)
        except Exception:
            continue
        t = data.get('@type')

        if t == 'SoftwareApplication':
            # Translate description + featureList using JSON locale keys
            new_desc = get_by_path(locale_data, 'meta.description') or data.get('description')
            data['description'] = new_desc
            # featureList: gather from bento_* features available in locale
            features = []
            features_section = locale_data.get('features', {})
            for k, v in features_section.items():
                if isinstance(v, str) and k.startswith('bento_') and k.endswith('_title'):
                    features.append(v)
            if features:
                data['featureList'] = features
            script.string = json.dumps(data, ensure_ascii=False, indent=2)

        elif t == 'FAQPage':
            # Translate each question/answer using faq.qN / faq.aN
            faq_section = locale_data.get('faq', {})
            new_entities = []
            for i in range(1, 9):  # q1..q8
                q = faq_section.get(f'q{i}')
                a_html = faq_section.get(f'a{i}_html')
                a_plain = faq_section.get(f'a{i}')
                a = strip_html(a_html) if a_html else (a_plain or '')
                if q and a:
                    new_entities.append({
                        '@type': 'Question',
                        'name': q,
                        'acceptedAnswer': {
                            '@type': 'Answer',
                            'text': a
                        }
                    })
            if new_entities:
                data['mainEntity'] = new_entities
            script.string = json.dumps(data, ensure_ascii=False, indent=2)

        elif t == 'Organization':
            # No translatable fields (all brand/email). Skip.
            pass

    # Pretty-print and return
    return str(soup)

def build_sitemap():
    """Build sitemap.xml with xhtml:link alternates for each locale URL."""
    urls = []
    # Each locale page links to all others as alternates
    for loc, _, _ in LOCALES:
        url = f"{BASE_URL}/{loc.lower()}/"
        alternates = []
        for other_loc, _, _ in LOCALES:
            other_url = f"{BASE_URL}/{other_loc.lower()}/"
            alternates.append(f'    <xhtml:link rel="alternate" hreflang="{other_loc.lower()}" href="{other_url}"/>')
        alternates.append(f'    <xhtml:link rel="alternate" hreflang="x-default" href="{BASE_URL}/"/>')
        urls.append(f"""  <url>
    <loc>{url}</loc>
    <lastmod>2026-05-19</lastmod>
    <changefreq>weekly</changefreq>
    <priority>1.0</priority>
{chr(10).join(alternates)}
  </url>""")

    # Also include / as x-default (es-ES content) — same alternates
    alternates = []
    for other_loc, _, _ in LOCALES:
        other_url = f"{BASE_URL}/{other_loc.lower()}/"
        alternates.append(f'    <xhtml:link rel="alternate" hreflang="{other_loc.lower()}" href="{other_url}"/>')
    alternates.append(f'    <xhtml:link rel="alternate" hreflang="x-default" href="{BASE_URL}/"/>')
    root_url = f"""  <url>
    <loc>{BASE_URL}/</loc>
    <lastmod>2026-05-19</lastmod>
    <changefreq>weekly</changefreq>
    <priority>1.0</priority>
{chr(10).join(alternates)}
  </url>"""

    docs_urls = """  <url>
    <loc>{BASE_URL}/docs/manual.html</loc>
    <lastmod>2026-05-19</lastmod>
    <changefreq>monthly</changefreq>
    <priority>0.8</priority>
  </url>
  <url>
    <loc>{BASE_URL}/docs/PRIVACY.html</loc>
    <lastmod>2026-05-14</lastmod>
    <changefreq>yearly</changefreq>
    <priority>0.3</priority>
  </url>
  <url>
    <loc>{BASE_URL}/docs/EULA.html</loc>
    <lastmod>2026-05-14</lastmod>
    <changefreq>yearly</changefreq>
    <priority>0.3</priority>
  </url>
  <url>
    <loc>{BASE_URL}/docs/TERMS_OF_SERVICE.html</loc>
    <lastmod>2026-05-14</lastmod>
    <changefreq>yearly</changefreq>
    <priority>0.3</priority>
  </url>
  <url>
    <loc>{BASE_URL}/docs/REFUND_POLICY.html</loc>
    <lastmod>2026-05-14</lastmod>
    <changefreq>yearly</changefreq>
    <priority>0.3</priority>
  </url>""".replace('{BASE_URL}', BASE_URL)

    return f"""<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9"
        xmlns:xhtml="http://www.w3.org/1999/xhtml">
{root_url}
{chr(10).join(urls)}
{docs_urls}
</urlset>
"""

def main():
    html_source = LANDING_HTML.read_text(encoding='utf-8')

    if OUT_DIR.exists():
        shutil.rmtree(OUT_DIR)
    OUT_DIR.mkdir(parents=True, exist_ok=True)

    print(f"Building i18n HTML in {OUT_DIR}\n")

    alternates_html = build_hreflang_block(None)

    for locale_code, og_locale, is_rtl in LOCALES:
        json_path = LOCALES_DIR / f'landing-{locale_code}.json'
        if not json_path.exists():
            print(f"  SKIP {locale_code}: JSON not found")
            continue
        locale_data = json.loads(json_path.read_text(encoding='utf-8'))

        rendered = render_locale(html_source, locale_data, locale_code, og_locale, is_rtl, alternates_html)

        out_dir = OUT_DIR / locale_code.lower()
        out_dir.mkdir(parents=True, exist_ok=True)
        out_file = out_dir / 'index.html'
        out_file.write_text(rendered, encoding='utf-8')

        # Sample first-line metadata for sanity print
        soup_check = BeautifulSoup(rendered, 'lxml')
        title = soup_check.find('title').string if soup_check.find('title') else '?'
        lang = soup_check.find('html').get('lang', '?')
        dir_attr = soup_check.find('html').get('dir', 'ltr')
        size = len(rendered)
        print(f"  OK {locale_code:6}  lang={lang:6} dir={dir_attr:3}  {size:>6,} bytes  title: {title[:70]}")

    # Sitemap
    sitemap = build_sitemap()
    (OUT_DIR / 'sitemap.xml').write_text(sitemap, encoding='utf-8')
    print(f"\n  OK sitemap.xml ({len(sitemap):,} bytes)")

    print(f"\nDone. Output: {OUT_DIR}")

if __name__ == '__main__':
    main()
