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
3. Descripción: `Switchea escenas, overlays y alertas con gestos de rostro y señas de mano. EsperantAI detecta tus gestos en local desde el navegador para controlar OBS, Streamlabs, vMix, PRISM y XSplit, y reaccionar a Twitch, YouTube, Trovo, StreamElements y Kick via Streamer.bot sin hardware extra.`
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

`Para streamers individuales que quieren controlar su directo sin tocar teclado durante momentos clave. Incluye hasta 18 triggers configurables, gestos de rostro y manos, acciones múltiples por gesto, calibración, perfiles guardados e historial. Compatible con OBS, Streamlabs, vMix, PRISM y XSplit; integra Twitch, YouTube, Trovo, StreamElements y Kick via Streamer.bot. Pago único. Hasta 3 dispositivos.`

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
2. Copiar la URL original que contiene `/checkout/buy/` para cada variant. No copiar la URL convertida que contiene `/checkout/?cart=`, porque esa URL es de un solo uso.
3. Crear en producción un archivo `checkout-config.json` a partir de `checkout-config.example.json`:

```json
{
  "pro": "https://TU-TIENDA.lemonsqueezy.com/checkout/buy/VARIANT_ID_PRO",
  "pro_plus": "https://TU-TIENDA.lemonsqueezy.com/checkout/buy/VARIANT_ID_PRO_PLUS"
}
```

4. No commitear `checkout-config.json`: puede publicarse como configuración del servidor o del deploy. `js/landing.js` lo carga desde el mismo dominio y cae al fallback de reserva si el archivo no existe.
5. Si usas checkout URLs con query params, puedes agregar `checkout[custom][plan]=pro` o `checkout[custom][plan]=pro_plus`. LemonSqueezy devuelve esos datos en `meta.custom_data` de webhooks y eventos relacionados.

## 5. Configurar webhooks

1. Settings → **Webhooks**
2. Agregar endpoint para recibir notificaciones de:
   - `license_key_created`
   - `license_key_activated`
   - `license_key_deactivated`
   - `order_created`
3. URL del webhook: `https://license.edugame.digital/webhook`
4. Generar y guardar el **Signing Secret**. LemonSqueezy firma cada webhook con `X-Signature`; el backend de EsperantAI compara ese HMAC con `LEMONSQUEEZY_WEBHOOK_SECRET`.

## 6. Configurar reembolsos

1. Settings → **Refunds**
2. Política comercial: producto digital final, sin trial y sin reembolso después de emitir o activar licencia, salvo error técnico imputable a EsperantAI que impida activación y no pueda resolverse
3. LemonSqueezy puede aplicar reglas operativas propias como Merchant of Record; conservar evidencia de aceptación de términos, versión legal, email, orden y license key

## 7. Integrar License API en EsperantAI

La app no debe llamar LemonSqueezy directamente desde el navegador. `core/license-manager.js` usa el backend de licencias de EdugameDigital, y ese backend valida con LemonSqueezy del lado servidor.

| Endpoint | Uso |
|---|---|
| `POST /verify` | Activar o revalidar una licencia y emitir JWT firmado |
| `POST /deactivate` | Desactivar este dispositivo; requiere JWT vigente |
| `POST /verify-jwt` | Verificar JWT local emitido por el backend |
| `POST /webhook` | Recibir eventos de LemonSqueezy |

Solo el backend llama endpoints de LemonSqueezy como `/v1/licenses/activate`, `/v1/licenses/validate` o `/v1/licenses/deactivate`, usando credenciales server-side.

### Valores exactos que Joel debe obtener de LemonSqueezy

Enviar estos valores al configurar producción. Nunca poner el API key en `landing.html`, `js/landing.js`, `checkout-config.json` ni otro archivo frontend.

```env
LEMONSQUEEZY_API_KEY=
LEMONSQUEEZY_WEBHOOK_SECRET=
LEMONSQUEEZY_VARIANT_PRO=
LEMONSQUEEZY_VARIANT_PRO_PLUS=
```

Y estos valores públicos para el checkout:

```json
{
  "pro": "",
  "pro_plus": ""
}
```

El backend rechaza licencias de variants desconocidos con `product_mismatch`; por eso los IDs `LEMONSQUEEZY_VARIANT_PRO` y `LEMONSQUEEZY_VARIANT_PRO_PLUS` son obligatorios.

## 8. Checklist pre-lanzamiento

- [ ] Cuenta LemonSqueezy verificada
- [ ] Producto creado con License Key habilitado
- [ ] Checkout personalizado con marca
- [ ] `checkout-config.json` publicado con las URLs `/checkout/buy/`
- [ ] `LEMONSQUEEZY_API_KEY`, `LEMONSQUEEZY_WEBHOOK_SECRET` y variant IDs configurados sólo en backend
- [ ] Página de ventas revisada en móvil y desktop
- [ ] Flujo de compra probado con tarjeta de prueba
- [ ] Email de confirmación personalizado
- [ ] Política de no reembolso visible y coherente con EULA/checkout
- [ ] Aceptación anti ingeniería inversa registrada en checkout/backend
- [ ] EULA, ToS, Privacy y Cookie Policy revisados por abogado

---

*Última actualización: Mayo 2026 — EdugameDigital*
