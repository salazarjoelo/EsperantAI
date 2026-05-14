# SETUP_VENTAS — Cómo poner EsperantAI a vender (paso a paso)

> Playbook step-by-step para Joel. Sigue este orden exacto la primera vez. Tiempo total: ~2-3 horas.

---

## Paso 1: Crear cuenta LemonSqueezy

1. Ve a https://www.lemonsqueezy.com/signup
2. Crea cuenta con tu email (joel@edugame.digital o similar)
3. Verifica email
4. En el dashboard, completa "Setup":
   - **Store name**: "EdugameDigital"
   - **Store URL**: ej. `edugame.lemonsqueezy.com` (puedes cambiar después)
   - **Country**: México
   - **Tax info**: ingresa tu RFC mexicano
   - **Payout method**: cuenta bancaria mexicana en USD (recibes USD, tu banco convierte a MXN al depositar)

**Costo**: Gratis. LemonSqueezy cobra 5% + $0.50 USD por venta. Cero fee fijo mensual.

---

## Paso 2: Crear el producto "EsperantAI"

1. Dashboard → Products → "+ New product"
2. Configurar:
   - **Name**: `EsperantAI`
   - **Description**: copia el texto del landing.html sección "¿Qué hace EsperantAI?"
   - **Type**: `Digital download` (NO subscription — es lifetime license)
   - **Price**: en MXN (ej: `$899 MXN`). LemonSqueezy convierte automáticamente al equivalente del país del comprador.
   - **Currency**: MXN
3. En la sección **License Keys**:
   - Habilita "Enable license keys"
   - **Activation limit**: 3 (1 license = hasta 3 dispositivos)
   - **License key length**: 24 caracteres (default)
   - **Expiration**: None (lifetime)
4. **Files**: por ahora deja vacío. Después de generar el ZIP de release subes el archivo.

---

## Paso 3: Configurar el dominio y landing

### Opción A: Subdominio gratis de LemonSqueezy (rápido)

LemonSqueezy te da `edugame.lemonsqueezy.com/buy/<product-id>` automáticamente. Para ir a vivo ya, esto basta.

### Opción B: Dominio propio (recomendado para profesional)

1. Compra `esperantai.com` (~$15/año en [Cloudflare Registrar](https://www.cloudflare.com/products/registrar/))
2. Activa Cloudflare Pages gratis:
   - GitHub → crea repo PRIVADO `esperantai-landing` con SOLO la `landing.html` + assets/branding/
   - Cloudflare Pages → Connect to GitHub → selecciona ese repo → Deploy
   - Apunta `esperantai.com` al Cloudflare Pages project
3. En la landing, edita `landing.html` línea 364 y cambia:
   ```js
   const LEMONSQUEEZY_CHECKOUT_URL = 'REEMPLAZAR_CON_URL_LEMONSQUEEZY_CHECKOUT';
   ```
   Por la URL de checkout que te dio LemonSqueezy en el paso 2.

---

## Paso 4: Configurar precio en landing.html

Edita `landing.html` y busca:
```html
<div class="price-amount">$<!--PRECIO_MXN-->___<!--/PRECIO_MXN--></div>
```

Reemplaza `___` con el precio en MXN que configuraste en LemonSqueezy (ej: `899`).

---

## Paso 5: Empaquetar EsperantAI para distribución

LemonSqueezy puede entregar archivos directamente. Crea el ZIP con TODOS los archivos necesarios:

```
EsperantAI-v2.0.zip
├── index.html         (renombrar a index.html en el ZIP final)
├── app.js
├── oauth-callback.html
├── README.md
├── Instalar_EsperantAI.bat
├── Lanzar_EsperantAI.bat
├── libs/
│   ├── human.js
│   └── obs-ws.min.js
├── core/                 (TODOS los archivos)
├── adapters/             (TODOS los archivos)
├── platforms/            (TODOS los archivos)
├── locales/              (TODOS los archivos)
├── assets/branding/
└── docs/
    ├── EULA.html
    └── PRIVACY.html
```

**Comando para generar el ZIP** (en Windows con bash de Git):
```bash
cd "D:\joel-salazar\OBS\Mira_Mira"
zip -r EsperantAI-v2.0.zip index.html app.js oauth-callback.html \
    README.md Instalar_EsperantAI.bat Lanzar_EsperantAI.bat \
    libs/ core/ adapters/ platforms/ locales/ assets/branding/ \
    docs/EULA.html docs/PRIVACY.html docs/PRODUCT_SPEC.md docs/ARCHITECTURE.md
```

Sube el ZIP a LemonSqueezy → Product → Files → "Upload file".

---

## Paso 6: Test de compra en sandbox

LemonSqueezy tiene modo Test:

1. Dashboard → Settings → "Test mode" → Enable
2. Realiza una compra de prueba con tarjeta de test: `4242 4242 4242 4242` (cualquier fecha futura, cualquier CVV)
3. Verifica:
   - Recibes email con link de descarga del ZIP
   - El email incluye una License Key
   - Descarga el ZIP, descomprime, abre `index.html` en navegador
   - Pega la License Key en el lockout
   - ✅ La app activa y arranca

Si todo funciona en test, desactiva Test mode → Disable.

---

## Paso 7: Lanzar oficialmente

1. Activa el producto en LemonSqueezy (Status: Published)
2. La URL de venta `https://edugame.lemonsqueezy.com/buy/<product-id>` ya acepta pagos reales
3. Comparte el link de tu landing `esperantai.com`
4. Promociona en r/OBS, r/Twitch, r/streaming, Twitter, YouTube tutoriales, etc.

---

## Paso 8: Marketing (lo que TÚ haces)

Como acordamos, yo construyo el producto, tú vendes:

- **Crear cuentas en Twitter / X, YouTube, TikTok** con el nombre EsperantAI
- **Grabar un video demo** (1-2 min mostrando OBS + tus gestos cambiando escenas)
- **Posts en comunidades**: r/OBS, r/Twitch, r/streaming, r/VirtualYoutubers, r/podcasting
- **Outreach a streamers hispanos** con audiencia mediana (10K-100K followers): Ibai, ElMariana, Auronplay community, JuansGuarnizo
- **Email a Streamer.bot Discord** ofreciéndoles cross-promotion
- **YouTube tutorial channels** ofreciendo licencia gratis a cambio de review

---

## Paso 9: Monitoreo y soporte

- **Email de soporte**: configura `soporte@edugame.digital` para recibir tickets
- **LemonSqueezy Dashboard**: revisa ventas + refunds semanalmente
- **Política de refunds**: 14 días sin preguntas. Mejor reputación que pelear.
- **Updates del producto**: cada vez que mejores EsperantAI, sube el nuevo ZIP a LemonSqueezy. Los usuarios reciben email automático.

---

## Costos fijos anuales (referencia)

| Concepto | Costo USD/año |
|---|---|
| Dominio esperantai.com (Cloudflare Registrar) | ~$10 |
| Cloudflare Pages | $0 |
| LemonSqueezy | $0 fijo + 5% + $0.50/venta |
| Email soporte@edugame.digital | $0 (Google Workspace ya lo tienes en EdugameDigital) |
| **Total fijo anual** | **~$10 USD** |

Recuperable con **1 sola venta** a precio $899 MXN (~$45 USD).

---

## Preguntas que te van a hacer

| Pregunta | Respuesta sugerida |
|---|---|
| ¿Por qué no hay versión gratis? | "EsperantAI es un producto profesional. La inversión inicial te da licencia perpetua + actualizaciones de por vida. Un Stream Deck XL cuesta $249 USD." |
| ¿Funciona offline? | "Sí, después de activar tu license. Online cada 7 días para revalidar, pero hay 30 días de grace period offline." |
| ¿Lo puedo instalar en mi PC y en mi laptop? | "Sí, hasta 3 dispositivos con la misma license." |
| ¿Tienen integración con [X plataforma rara]? | Si tiene API → "puedo agregar soporte en próximas versiones, mándame el detalle". Si no → "no es técnicamente posible". |

---

## Próximos pasos cuando ya estés vendiendo

1. Después de 50+ ventas: considera Cloudflare Page Rules para mejor performance global
2. Después de 200+ ventas: refactor de tier único a Pro/Studio si tiene sentido para tu mercado
3. Después de 500+ ventas: considera empaquetado con Tauri para Windows nativo + code signing (~$300/año extra)

---

**Tiempo estimado total para tener el sistema funcionando**: 2-4 horas (sin contar la espera de la cuenta LemonSqueezy si te piden verificación adicional).
