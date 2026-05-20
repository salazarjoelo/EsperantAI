# EsperantAI — Guía de Configuración de Ventas

> Instrucciones paso a paso para configurar LemonSqueezy como plataforma de venta de EsperantAI.

---

## 1. Crear cuenta en LemonSqueezy

1. Ir a [lemonsqueezy.com](https://lemonsqueezy.com) y registrarse
2. Completar el onboarding (datos fiscales, método de pago)
3. Elegir plan: **Juice** ($0/mes) para empezar, migrar a **Squeezy** cuando sea necesario

## 2. Crear el producto en LemonSqueezy

1. Dashboard → **Products** → **+ New Product**
2. Nombre: `EsperantAI — AI Gesture Controller for Streamers`
3. Descripción: `Switchea escenas, overlays y alertas con gestos de rostro y señas de mano. EsperantAI detecta tus gestos en local desde el navegador para controlar OBS, Streamlabs, vMix, PRISM y XSplit, y reaccionar a Twitch, YouTube, Kick y Trovo sin hardware extra.`
4. Tipo: **Digital Product**
5. Usar **Variants** para los planes:
   - `EsperantAI Pro` — $49 USD
   - `EsperantAI Pro+` — $89 USD
6. Configurar License Key por variante:
   - Activación: hasta **3 dispositivos** por licencia
   - Formato: `XXXX-XXXX-XXXX-XXXX-XXXX`
7. Guardar producto

### Descripciones de variantes

**EsperantAI Pro**

`Para streamers individuales que quieren controlar su directo sin tocar teclado durante momentos clave. Incluye hasta 18 triggers configurables, gestos de rostro y manos, acciones múltiples por gesto, calibración, perfiles guardados e historial. Compatible con OBS, Streamlabs, vMix, PRISM y XSplit; integra Twitch, YouTube, Kick y Trovo. Pago único. Hasta 3 dispositivos.`

**EsperantAI Pro+**

`Para creadores que monetizan, producen directos más complejos o necesitan automatización avanzada. Incluye todo lo de Pro, más triggers ilimitados, combo triggers de evento + gesto, StreamElements bridge multi-plataforma y soporte prioritario. Diseñado para streams donde cada gesto puede disparar una secuencia completa sin interrumpir el ritmo en vivo. Pago único. Hasta 3 dispositivos.`

## 3. Configurar checkout

1. Products → EsperantAI → **Checkout**
2. Personalizar colores para que coincidan con la marca (gradient #58a6ff → #bc8cff → #ff7b72)
3. Habilitar: nombre, email y campos fiscales requeridos por LemonSqueezy/Merchant of Record
4. No ofrecer trial, free tier ni cupón por defecto
5. Configurar redirect post-compra a la URL de EsperantAI
6. Si se usa Checkouts API, pasar `custom_data` con:
   - `plan=pro|pro_plus`
   - `terms_version=2026-05-20`
   - `eula_acceptance=true`
   - `anti_reverse_engineering_acceptance=true`

## 4. Obtener URL de checkout

1. Products → EsperantAI → **Payment Links**
2. Copiar la URL del checkout
3. Pegar las URLs en `js/landing.js`, reemplazando `REEMPLAZAR_CON_URL_LEMONSQUEEZY_PRO` y `REEMPLAZAR_CON_URL_LEMONSQUEEZY_PRO_PLUS`

## 5. Configurar webhooks

1. Settings → **Webhooks**
2. Agregar endpoint para recibir notificaciones de:
   - `license_key_created`
   - `license_key_activated`
   - `license_key_deactivated`
   - `order_created`
3. URL del webhook: endpoint del backend de licencias de EsperantAI

## 6. Configurar reembolsos

1. Settings → **Refunds**
2. Política comercial: producto digital final, sin trial y sin reembolso después de emitir o activar licencia, salvo error técnico imputable a EsperantAI que impida activación y no pueda resolverse
3. LemonSqueezy puede aplicar reglas operativas propias como Merchant of Record; conservar evidencia de aceptación de términos, versión legal, email, orden y license key

## 7. Integrar License API en EsperantAI

Ya está integrado en `core/license-manager.js`. Los endpoints usados son:

| Endpoint | Uso |
|---|---|
| `POST /v1/licenses/activate` | Activar licencia al primer inicio |
| `POST /v1/licenses/validate` | Re-validación cada 7 días |
| `POST /v1/licenses/deactivate` | Desactivar instancia al cambiar de dispositivo |

## 8. Checklist pre-lanzamiento

- [ ] Cuenta LemonSqueezy verificada
- [ ] Producto creado con License Key habilitado
- [ ] Checkout personalizado con marca
- [ ] URL de checkout configurada en `landing.html`
- [ ] Página de ventas revisada en móvil y desktop
- [ ] Flujo de compra probado con tarjeta de prueba
- [ ] Email de confirmación personalizado
- [ ] Política de no reembolso visible y coherente con EULA/checkout
- [ ] Aceptación anti ingeniería inversa registrada en checkout/backend
- [ ] EULA, ToS, Privacy y Cookie Policy revisados por abogado

---

*Última actualización: Mayo 2026 — EdugameDigital*
