# EsperantAI Launch Readiness Audit — 2026-05-21

## Resultado

Estado tecnico despues de la correccion: **release candidate verde para landing, traducciones, manuales, backend, deploy y configuracion Lemon Squeezy**.

No afirmo "cero errores absolutos": queda una validacion comercial que requiere ejecutar una compra real o checkout de MX$0 con cupon 100%, confirmar que Lemon Squeezy emite la license key y activar/desactivar esa key en la app. No se hizo para no crear una orden real sin instruccion explicita.

## Bloqueantes encontrados y corregidos

1. **Rutas localizadas fuera del deploy check.** `/es-mx/` y demas rutas servian HTML viejo, por eso se veian precios antiguos aunque `/` ya estuviera en MXN.
   - Fix: `scripts/build-deploy-site.mjs` ahora genera `dist/landing-i18n` antes de construir `_site`.
   - Fix: `.deploy-targets.json` ahora cubre las 15 rutas localizadas y `checkout-config.json`.

2. **Backend LS activaba mal.** `/verify` enviaba `instance_name` a `/v1/licenses/validate`. Segun la API oficial, la primera activacion debe usar `/v1/licenses/activate`; `validate` usa `instance_id`.
   - Fix: backend usa `/activate` cuando recibe `instance_name`.
   - Fix: refresh cliente envia `instance_id` cuando existe.
   - Fix: tests nuevos cubren activate, validate con instance_id y limite de activaciones.

3. **Webhooks de licencia dependian de eventos no disponibles en el selector actual.**
   - Fix: backend atiende `license_key_updated` con `status=disabled|expired` como revocacion.
   - Fix: docs de ventas y backend documentan `order_created`, `order_refunded`, `license_key_created`, `license_key_updated`.

4. **Pricing i18n tenia residuos y plan Pro+ mal nombrado.**
   - Fix: pricing de landing en 15 locales queda en MXN.
   - Fix: `plus_name` ahora es `Pro+` en todos los locales.
   - Fix: se corrigieron strings corruptos o ingleses en ar-SA, hi-IN, ja-JP, ko-KR, ru-RU, zh-CN y encabezados de pricing en de-DE, fr-FR, id-ID, it-IT, pl-PL, pt-BR.

5. **CSP audit reportaba artefactos no desplegados.**
   - Fix: `scripts/validate-csp.mjs` ignora `coverage/`; el audit de producto queda sin warnings.

6. **Hotfix post-auditoria: checkout config roto en rutas localizadas.** Desde `/es-mx/`, `js/landing.js` buscaba `checkout-config.json` como ruta relativa y podia pedir `/es-mx/checkout-config.json`, causando fallback de "tienda online lista pronto".
   - Fix: `js/landing.js` carga siempre `/checkout-config.json`.
   - Fix: `landing.html` usa `landing.js?v=20260521a` para romper cache del JS anterior.
   - Fix: test de regresion `tests/landing-checkout-config.test.js` cubre ruta localizada.
   - Fix: `scripts/build-deploy-site.mjs` copia `fonts/` y `.deploy-targets.json` ahora cubre `hot-sale.css`, `hot-sale.js`, `hot-sale.json` y fuentes Inter para evitar 404 de assets.

## Evidencia local

- `npm run lint`: OK.
- `npm test`: 13 archivos, 153 tests passed, 11 skipped.
- `npm run validate`: JSON OK, CSP 0 warnings, i18n app + landing 0 missing/extra/placeholders/untranslated.
- `python scripts/validate-user-manuals.py`: 15 manuales OK.
- `cd backend && npm test`: 38 tests passed.
- `npm run build:deploy`: 117 targets cubiertos en `_site`.

## Evidencia produccion

- `node scripts/check-deploy-targets.mjs --compare-local`: 117 URLs OK con hash local.
- Chrome headless real en `https://edugame.digital/es-mx/#comprar`:
  - `Comprar Pro`: carga `/checkout-config.json`, no pide `/es-mx/checkout-config.json`, sin warning de fallback, sin 404, navega a `checkout.edugame.digital/checkout/cart/...`.
  - `Comprar Pro+`: carga `/checkout-config.json`, no pide `/es-mx/checkout-config.json`, sin warning de fallback, sin 404, navega a `checkout.edugame.digital/checkout/cart/...`.
- Rutas muestreadas: `/`, `/es-mx/`, `/es-es/`, `/en-us/`, `/ja-jp/`, `/ru-ru/`, `/zh-cn/`, `/ar-sa/`, `/ko-kr/`, `/hi-in/`, `/id-id/`.
  - Todas: HTTP 200, `MX$`, `999.99`, `1,999.99`, `Pro+`, sin `$49`, sin `$89`, sin `USD pricing`, sin replacement char.
- `https://edugame.digital/checkout-config.json`: HTTP 200, links `/checkout/buy/`, sin secretos.
- `https://license.edugame.digital/health`: HTTP 200, `{status:"ok", service:"esperantai-license"}`.
- Webhook sin firma: HTTP 401.
- Webhook firmado de smoke test: HTTP 200.

## Evidencia Lemon Squeezy

Consultado contra API de Lemon Squeezy desde el VPS sin imprimir secretos:

- Store `375741`: currency `MXN`, domain `checkout.edugame.digital`.
- Product `1071782`: published.
- Variant Pro `1680087`:
  - status `published`
  - price raw `99999` = MX$999.99
  - `has_license_keys=true`
  - `license_activation_limit=3`
  - `is_license_length_unlimited=true`
  - `is_subscription=false`
- Variant Pro+ `1685295`:
  - status `published`
  - price raw `199999` = MX$1,999.99
  - `has_license_keys=true`
  - `license_activation_limit=3`
  - `is_license_length_unlimited=true`
  - `is_subscription=false`
- Checkout links Pro y Pro+ cargan HTTP 200 en `checkout.edugame.digital/checkout`, contienen EsperantAI, MXN/MX$ y referencia a license key.

## Fuentes LS usadas

- `Activate a license key`: `/v1/licenses/activate` requiere `license_key` + `instance_name` y devuelve `instance`.
- `Validate a license key`: `/v1/licenses/validate` acepta `instance_id`; sin `instance_id`, `instance` vuelve `null`.
- `Event types`: single payment minimo `order_created`; license keys generan `license_key_created`; cambios llegan como `license_key_updated`; refund como `order_refunded`.
- `Variant object`: `has_license_keys`, `license_activation_limit`, `is_license_length_unlimited`, `price`, `is_subscription`.

## Backups creados en VPS

- Static incremental: `/root/esperantai-backups/edugame-landing-incremental-20260521-103359.tar.gz`
- Backend incremental: `/root/esperantai-backups/esperantai-license-server-incremental-20260521-103359.js`
- Checkout/fonts hotfix: `/root/esperantai-backups/edugame-landing-checkout-fonts-fix-20260521-111555.tar.gz`

## Pendiente obligatorio antes de anunciar venta abierta

1. Ejecutar una orden real controlada o una orden MX$0 con cupon 100%.
2. Confirmar email/recibo de Lemon Squeezy con license key.
3. Activar esa key en EsperantAI y confirmar que se crea `instance.id`.
4. Desactivar la instancia desde la app y confirmar liberacion de dispositivo.
5. Validar el texto legal final con abogado si se va a operar publicamente fuera de una beta controlada.
