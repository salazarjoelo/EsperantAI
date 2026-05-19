#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""
Deploy Apache Accept-Language redirect para edugame.digital.

Cambios:
 1. /var/www/sites/edugame-landing/index.html: reemplazo por copia de en-us
    con canonical = https://edugame.digital/ y x-default self-referencial.
 2. /var/www/sites/edugame-landing/.htaccess: redirect 302 conditional a /xx-xx/
    segun Accept-Language, EXCLUYENDO bots (Googlebot, etc).
 3. configtest + reload Apache.
 4. HTTP verify: bot sees /, JA browser redirects to /ja-jp/, etc.
"""
import paramiko, sys, urllib.request, urllib.error
from pathlib import Path
if sys.platform == 'win32':
    import io
    sys.stdout = io.TextIOWrapper(sys.stdout.buffer, encoding='utf-8')

LOCAL_DIST = Path(r'D:\joel-salazar\OBS\EsperantAI\dist\landing-i18n')
REMOTE = '/var/www/sites/edugame-landing'

# ============================================================
# 1. PREP index.html nuevo (x-default = en-us con canonical /)
# ============================================================
en_us_html = (LOCAL_DIST / 'en-us' / 'index.html').read_text(encoding='utf-8')

# Canonical en-us tenia href=".../en-us/" → cambiar a "/"
en_us_html = en_us_html.replace(
    '<link rel="canonical" href="https://edugame.digital/en-us/"/>',
    '<link rel="canonical" href="https://edugame.digital/"/>'
)
# El hreflang x-default ya apunta a "https://edugame.digital/" (correcto)
# El hreflang en-us seguira apuntando a /en-us/ (correcto - es la otra version EN)
# og:url debe ser "/"
en_us_html = en_us_html.replace(
    '<meta property="og:url" content="https://edugame.digital/en-us/"/>',
    '<meta property="og:url" content="https://edugame.digital/"/>'
)
# twitter:url tambien
en_us_html = en_us_html.replace(
    '<meta property="twitter:url" content="https://edugame.digital/en-us/"/>',
    '<meta property="twitter:url" content="https://edugame.digital/"/>'
)

# Save preview local
preview = LOCAL_DIST / 'root-xdefault-index.html'
preview.write_text(en_us_html, encoding='utf-8')
print(f"[LOCAL] Preview x-default: {preview} ({len(en_us_html.encode('utf-8')):,} bytes)\n")

# ============================================================
# 2. PREP .htaccess (source of truth: infrastructure/apache/edugame-landing.htaccess)
# ============================================================
HTACCESS_SRC = Path(r'D:\joel-salazar\OBS\EsperantAI\infrastructure\apache\edugame-landing.htaccess')
HTACCESS = HTACCESS_SRC.read_text(encoding='utf-8')

print(f"[LOCAL] .htaccess content ready ({len(HTACCESS)} bytes)\n")

# ============================================================
# 3. SSH + DEPLOY + RELOAD
# ============================================================
ssh = paramiko.SSHClient()
ssh.set_missing_host_key_policy(paramiko.AutoAddPolicy())
ssh.connect('187.77.23.49', username='root', password='Coatequitl2026-+',
            timeout=30, allow_agent=False, look_for_keys=False)
print("Conectado al VPS\n")

def run(cmd, timeout=30):
    _, out, err = ssh.exec_command(cmd, timeout=timeout)
    status = out.channel.recv_exit_status()
    s_out = out.read().decode('utf-8', errors='ignore').rstrip()
    s_err = err.read().decode('utf-8', errors='ignore').rstrip()
    return status, s_out, s_err

# Backup original index.html antes de sobreescribir
print("=" * 70)
print("FASE A: Backup + Upload nuevo index.html + .htaccess")
print("=" * 70)
st, o, e = run(f"cp {REMOTE}/index.html {REMOTE}/index.html.bak.$(date +%Y%m%d-%H%M%S)")
print(f"  backup index.html original: exit={st}")

# Habilitar mods necesarios (idempotente)
st, o, e = run("a2enmod rewrite headers setenvif 2>&1")
print(f"  a2enmod rewrite headers setenvif: exit={st}")
if 'already enabled' not in o.lower() and o.strip():
    print(f"    {o[:200]}")

# SFTP upload
sftp = ssh.open_sftp()

# Upload nuevo index.html (x-default)
import tempfile
with tempfile.NamedTemporaryFile(mode='w', suffix='.html', encoding='utf-8', delete=False) as tmp:
    tmp.write(en_us_html)
    tmp_path_html = tmp.name
sftp.put(tmp_path_html, f"{REMOTE}/index.html")
print(f"  OK /index.html nuevo (x-default EN) subido")

# Upload .htaccess
with tempfile.NamedTemporaryFile(mode='w', suffix='.htaccess', encoding='utf-8', delete=False) as tmp:
    tmp.write(HTACCESS)
    tmp_path_ht = tmp.name
sftp.put(tmp_path_ht, f"{REMOTE}/.htaccess")
print(f"  OK /.htaccess subido")

sftp.close()

# Chown + chmod
st, o, e = run(f"chown www-data:www-data {REMOTE}/index.html {REMOTE}/.htaccess && "
               f"chmod 644 {REMOTE}/index.html {REMOTE}/.htaccess")
print(f"  chown+chmod: exit={st}\n")

# ============================================================
# 4. CONFIGTEST + RELOAD
# ============================================================
print("=" * 70)
print("FASE B: apache2ctl configtest + reload")
print("=" * 70)
st, o, e = run("apache2ctl configtest 2>&1")
print(f"  configtest exit={st}")
print(f"  output: {o[:400] or e[:400]}")
if st != 0:
    print("\n!!! configtest FALLO. Aborto reload. Restaurando index.html.bak...")
    run(f"cp $(ls -t {REMOTE}/index.html.bak.* | head -1) {REMOTE}/index.html && rm {REMOTE}/.htaccess")
    ssh.close()
    sys.exit(2)

st, o, e = run("systemctl reload apache2 && echo OK")
print(f"  reload exit={st}: {o}\n")

# ============================================================
# 5. VERIFY HTTP
# ============================================================
print("=" * 70)
print("FASE C: HTTP verify - bots vs browsers vs Accept-Language")
print("=" * 70)

import urllib.request
def http_test(label, accept_lang=None, user_agent=None):
    req = urllib.request.Request('https://edugame.digital/', method='GET')
    if accept_lang:
        req.add_header('Accept-Language', accept_lang)
    if user_agent:
        req.add_header('User-Agent', user_agent)
    try:
        # Sin seguir redirects para detectarlos
        class NoRedirect(urllib.request.HTTPRedirectHandler):
            def redirect_request(self, *args, **kwargs):
                return None
        opener = urllib.request.build_opener(NoRedirect)
        try:
            r = opener.open(req, timeout=8)
            status = r.status
            location = r.headers.get('Location', '-')
        except urllib.error.HTTPError as e:
            # Si 302, HTTPError captura
            status = e.code
            location = e.headers.get('Location', '-')
        return status, location
    except Exception as e:
        return 'ERR', str(e)[:60]

tests = [
    ("Bot Googlebot (no AL)",      None,            "Googlebot/2.1 (+http://www.google.com/bot.html)"),
    ("Bot Bingbot",                 "ja-JP",         "Mozilla/5.0 (compatible; bingbot/2.0)"),
    ("Browser sin Accept-Language", None,            "Mozilla/5.0 (Windows NT 10.0)"),
    ("Browser ja-JP",               "ja-JP,ja;q=0.9",   "Mozilla/5.0"),
    ("Browser de-DE",               "de-DE,de;q=0.9",   "Mozilla/5.0"),
    ("Browser pt-BR",               "pt-BR,pt;q=0.9",   "Mozilla/5.0"),
    ("Browser es-MX",               "es-MX,es;q=0.9",   "Mozilla/5.0"),
    ("Browser es-ES",               "es-ES,es;q=0.9",   "Mozilla/5.0"),
    ("Browser en-US",               "en-US,en;q=0.9",   "Mozilla/5.0"),
    ("Browser zh-TW (HK Chinese)",  "zh-TW,zh;q=0.9",   "Mozilla/5.0"),
    ("Browser ar-EG (Egypt)",       "ar-EG,ar;q=0.9",   "Mozilla/5.0"),
    ("Browser xx-XX desconocido",   "xx-XX,xx;q=0.9",   "Mozilla/5.0"),
]

for label, al, ua in tests:
    code, loc = http_test(label, al, ua)
    arrow = f" -> {loc}" if loc != '-' else ""
    print(f"  [{code}] {label}{arrow}")

ssh.close()
print("\n=== Deploy Apache Accept-Language COMPLETO ===")
