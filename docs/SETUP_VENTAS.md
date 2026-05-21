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
   - `EsperantAI Pro` — MX$999.99 MXN
   - `EsperantAI Pro+` — MX$1,999.99 MXN
6. Configurar License Key por variante:
   - Activación: hasta **3 dispositivos** por licencia
   - Duración: **sin expiración / unlimited**. En LemonSqueezy, marcar la casilla que indica que la licencia no expira.
   - Formato: `XXXX-XXXX-XXXX-XXXX-XXXX`
7. Guardar producto

### Descripciones de variantes

**EsperantAI Pro**

`Para streamers individuales que quieren controlar su directo sin tocar teclado durante momentos clave. Incluye hasta 18 triggers configurables, gestos de rostro y manos, acciones múltiples por gesto, calibración, perfiles guardados e historial. Compatible con OBS, Streamlabs, vMix, PRISM y XSplit; integra Twitch, YouTube, Trovo, StreamElements y Kick via Streamer.bot. Pago único en pesos mexicanos. Licencia sin expiración. Hasta 3 dispositivos.`

**EsperantAI Pro+**

`Para creadores que monetizan, producen directos más complejos o necesitan automatización avanzada. Incluye todo lo de Pro, más triggers ilimitados, combo triggers de evento + gesto, StreamElements bridge multi-plataforma y soporte prioritario. Diseñado para streams donde cada gesto puede disparar una secuencia completa sin interrumpir el ritmo en vivo. Pago único en pesos mexicanos. Licencia sin expiración. Hasta 3 dispositivos.`

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
  "pro": "https://checkout.edugame.digital/checkout/buy/2e8e57db-2213-4626-9163-8ae060540462",
  "pro_plus": "https://checkout.edugame.digital/checkout/buy/44c63553-64b0-4537-8734-e937664e597d"
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

### Estado real verificado en LemonSqueezy

```env
LEMONSQUEEZY_STORE_ID=375741
LEMONSQUEEZY_PRODUCT_ID=1071782
LEMONSQUEEZY_VARIANT_PRO=1680087
LEMONSQUEEZY_VARIANT_PRO_PLUS=1685295
```

```json
{
  "pro": "https://checkout.edugame.digital/checkout/buy/2e8e57db-2213-4626-9163-8ae060540462",
  "pro_plus": "https://checkout.edugame.digital/checkout/buy/44c63553-64b0-4537-8734-e937664e597d"
}
```

Antes de publicar los botones de compra, ambos variants deben mostrar `is_license_length_unlimited=true` en la API de LemonSqueezy. Si aparece `false`, la casilla de licencia sin expiración todavía no está marcada.

## 8. Regalar licencias a streamers

Estado confirmado contra la documentación vigente de LemonSqueezy: la License API permite `activate`, `validate` y `deactivate`; la API principal permite listar/actualizar license keys ya generadas. No hay endpoint público para crear una license key suelta sin una orden. La ruta segura para regalar licencias y conservar trazabilidad legal/comercial es generar una orden de $0 con cupón 100%.

### Opción recomendada: cupón 100% de un solo uso

1. En LemonSqueezy, crear un discount:
   - `amount_type=percent`
   - `amount=100`
   - `is_limited_redemptions=true`
   - `max_redemptions=1`
   - `is_limited_to_products=true`
   - limitarlo al variant `Pro` o `Pro+`
   - definir `expires_at` si el regalo es temporal
2. Crear o compartir un checkout del variant regalado con el discount prellenado.
3. Enviar al streamer un link directo, no la landing pública.
4. El streamer completa el checkout de $0, acepta términos y LemonSqueezy emite la license key en su recibo.
5. EsperantAI valida esa key sin cambios de código: el backend revisa LemonSqueezy server-side y sólo acepta `LEMONSQUEEZY_VARIANT_PRO` o `LEMONSQUEEZY_VARIANT_PRO_PLUS`.

### Si Joel quiere mandar la key ya generada

También se puede completar internamente el checkout de $0 usando el email real del streamer, recuperar la license key desde LemonSqueezy y enviarla por correo. Esta opción debe usarse con más cuidado porque Joel tendría que conservar evidencia de:

- email del destinatario
- variant regalado
- fecha de emisión
- aceptación o envío de EULA/ToS
- código de cupón usado
- license key parcial, nunca completa en documentos públicos

### Datos mínimos por licencia regalada

Registrar cada regalo en una bitácora privada, fuera de la landing:

```csv
fecha,email,streamer,plan,variant_id,discount_code,order_id,license_key_short,expira,notas
```

No poner esta bitácora en el frontend ni en repos públicos.

### No recomendado para lanzamiento

No conviene inventar claves manuales fuera de LemonSqueezy en esta etapa. Para hacerlo bien habría que extender el backend con una tabla propia de `gift_licenses`, panel/admin script de emisión, revocación, expiración y auditoría. Es viable, pero ya sería otro sistema de licencias paralelo al Merchant of Record.

## 9. Checklist pre-lanzamiento

- [ ] Cuenta LemonSqueezy verificada
- [ ] Producto creado con License Key habilitado
- [ ] Checkout personalizado con marca
- [ ] `checkout-config.json` publicado con las URLs `/checkout/buy/`
- [ ] `LEMONSQUEEZY_API_KEY`, `LEMONSQUEEZY_WEBHOOK_SECRET` y variant IDs configurados sólo en backend
- [ ] Flujo de licencias regaladas definido: cupón 100% single-use por streamer o checkout interno con bitácora privada
- [ ] Página de ventas revisada en móvil y desktop
- [ ] Flujo de compra probado con tarjeta de prueba
- [ ] Email de confirmación personalizado
- [ ] Política de no reembolso visible y coherente con EULA/checkout
- [ ] Aceptación anti ingeniería inversa registrada en checkout/backend
- [ ] EULA, ToS, Privacy y Cookie Policy revisados por abogado

---

*Última actualización: Mayo 2026 — EdugameDigital*
