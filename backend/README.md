# EsperantAI License Backend

Express server que valida licencias contra LemonSqueezy y emite **JWT firmados con Ed25519** que el cliente verifica con la clave pública embebida.

**Arquitectura**: cliente → `POST /verify {license_key}` → server valida en LemonSqueezy + firma JWT → cliente cachea JWT 30 días + verifica firma offline en cada arranque.

## Deploy en VPS Hostinger

### 1. Copiar archivos al VPS

```bash
ssh root@187.77.23.49
mkdir -p /opt/esperantai-license
# Subir backend/ desde el repo a /opt/esperantai-license/
# (Joel puede usar scp, paramiko, o git clone del repo público + symlink)
cd /opt/esperantai-license
npm install --omit=dev
```

### 2. Generar el par de claves (UNA sola vez)

```bash
cd /opt/esperantai-license
node scripts/generate-keypair.js
mkdir -p /etc/esperantai
mv priv.pem /etc/esperantai/priv.pem
chmod 600 /etc/esperantai/priv.pem
chown root:root /etc/esperantai/priv.pem
# pub.pem queda en /opt/esperantai-license/ — su contenido va al cliente
```

### 3. Copiar la clave pública al cliente

Copia el contenido de `/opt/esperantai-license/pub.pem` a `core/license-manager.js`:

```javascript
const PUBLIC_KEY_PEM = `-----BEGIN PUBLIC KEY-----
MCowBQYDK2VwAyEA...
-----END PUBLIC KEY-----`;
```

Commit y push esa modificación. El cliente queda hardcoded a tu clave pública.

### 4. Configurar variables de entorno

```bash
cd /opt/esperantai-license
cp .env.example .env
nano .env  # rellena LEMONSQUEEZY_API_KEY y LEMONSQUEEZY_WEBHOOK_SECRET
chmod 600 .env
```

### 5. Configurar Apache vhost para `license.edugame.digital`

DNS: agrega A record `license.edugame.digital` → `187.77.23.49` en tu provider.

```bash
# /etc/apache2/sites-available/license.edugame.digital.conf
<VirtualHost *:80>
    ServerName license.edugame.digital
    RewriteEngine On
    RewriteRule ^(.*)$ https://%{HTTP_HOST}$1 [R=301,L]
</VirtualHost>

<VirtualHost *:443>
    ServerName license.edugame.digital
    SSLEngine on
    SSLCertificateFile     /etc/letsencrypt/live/license.edugame.digital/fullchain.pem
    SSLCertificateKeyFile  /etc/letsencrypt/live/license.edugame.digital/privkey.pem

    ProxyPreserveHost On
    ProxyPass        / http://127.0.0.1:3201/
    ProxyPassReverse / http://127.0.0.1:3201/

    ErrorLog  ${APACHE_LOG_DIR}/license.error.log
    CustomLog ${APACHE_LOG_DIR}/license.access.log combined
</VirtualHost>
```

Activar:
```bash
sudo a2ensite license.edugame.digital
sudo certbot --apache -d license.edugame.digital
sudo systemctl reload apache2
```

### 6. Systemd service

```bash
# /etc/systemd/system/esperantai-license.service
[Unit]
Description=EsperantAI license backend
After=network.target

[Service]
Type=simple
WorkingDirectory=/opt/esperantai-license
EnvironmentFile=/opt/esperantai-license/.env
ExecStart=/usr/bin/node src/server.js
Restart=on-failure
RestartSec=10
User=edugame
Group=edugame
StandardOutput=journal
StandardError=journal

[Install]
WantedBy=multi-user.target
```

```bash
sudo systemctl daemon-reload
sudo systemctl enable --now esperantai-license
sudo systemctl status esperantai-license
curl https://license.edugame.digital/health
# {"status":"ok","service":"esperantai-license","version":"1.0.0"}
```

### 7. Configurar webhook en LemonSqueezy

LemonSqueezy Dashboard → Settings → Webhooks → New webhook:
- URL: `https://license.edugame.digital/webhook`
- Signing secret: copiarlo a `LEMONSQUEEZY_WEBHOOK_SECRET` en `.env`
- Eventos: `license_key_created`, `license_key_disabled`, `license_key_revoked`

## Endpoints

| Path | Método | Descripción |
|---|---|---|
| `/health` | GET | Health check, sin auth |
| `/verify` | POST | Validar license key + emitir JWT |
| `/deactivate` | POST | Liberar una instancia (cuando user pasa de PC) |
| `/webhook` | POST | LemonSqueezy events (HMAC-SHA256 firmado) |

### POST /verify

Request:
```json
{
  "license_key": "00000000-0000-0000-0000-000000000000",
  "instance_name": "joel-laptop"
}
```

Response OK:
```json
{
  "ok": true,
  "token": "eyJhbGc...",
  "tier": "pro",
  "expires": 1759329600
}
```

Response error:
```json
{ "ok": false, "error": "invalid|expired|revoked|limit_reached|rate_limited" }
```

## Security notes

- **Ed25519** para firmar JWT: claves cortas, fast, modern.
- **Rate limiting**: 10 intentos `/verify` por IP / 5 min, 10 min bloqueo.
- **HMAC-SHA256** para validar webhooks (timing-safe compare).
- **CORS** estricto: solo orígenes whitelisted.
- **Sin DB** por ahora: revoked keys en memoria. Si server reinicia, se reciben de nuevo via webhook re-sync (Joel puede llamar manualmente a LemonSqueezy API y poblar al startup).

## Para Claude / futuras IAs

- Cuando reciban una `feature request` para tier gating: el JWT ya contiene `tier`. El cliente lo lee y decide.
- Cuando reciban `limit reached`: el usuario debe ir a su cuenta LemonSqueezy y deactivar una instancia previa, o usar `/deactivate`.
- Mantener el código minimal — este server NO debería crecer mucho.
