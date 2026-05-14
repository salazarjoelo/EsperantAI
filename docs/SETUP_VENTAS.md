# EsperantAI — Guía de Configuración de Ventas

> Instrucciones paso a paso para configurar LemonSqueezy como plataforma de venta de EsperantAI.

---

## 1. Crear cuenta en LemonSqueezy

1. Ir a [lemonsqueezy.com](https://lemonsqueezy.com) y registrarse
2. Completar el onboarding (datos fiscales, método de pago)
3. Elegir plan: **Juice** ($0/mes) para empezar, migrar a **Squeezy** cuando sea necesario

## 2. Crear el producto en LemonSqueezy

1. Dashboard → **Products** → **+ New Product**
2. Nombre: `EsperantAI — Licencia Perpetua`
3. Descripción: Controlador AI universal por gestos para streamers. Compatible con OBS, Streamlabs, vMix, PRISM y XSplit. 5 plataformas integradas. 13 idiomas. Privacy by design.
4. Precio: configurar en MXN (pesos mexicanos) con conversión automática
5. Tipo: **Digital Product** → **License Key**
6. Configurar License Key:
   - Activación: hasta **3 dispositivos** por licencia
   - Formato: `XXXX-XXXX-XXXX-XXXX-XXXX`
7. Guardar producto

## 3. Configurar checkout

1. Products → EsperantAI → **Checkout**
2. Personalizar colores para que coincidan con la marca (gradient #58a6ff → #bc8cff → #ff7b72)
3. Habilitar: nombre, email, dirección (mínimo para IVA internacional)
4. Deshabilitar: newsletter opt-in (no queremos spam)
5. Configurar redirect post-compra a la URL de EsperantAI

## 4. Obtener URL de checkout

1. Products → EsperantAI → **Payment Links**
2. Copiar la URL del checkout
3. Pegar esta URL en `landing.html`, reemplazando `REEMPLAZAR_CON_URL_LEMONSQUEEZY_CHECKOUT`

## 5. Configurar webhooks (opcional)

1. Settings → **Webhooks**
2. Agregar endpoint para recibir notificaciones de:
   - `license_key_created`
   - `license_key_activated`
   - `license_key_deactivated`
   - `order_created`
3. URL del webhook: requiere servidor (futuro, no necesario para v1.0)

## 6. Configurar reembolsos

1. Settings → **Refunds**
2. Política: reembolso completo dentro de 14 días
3. Procesar manualmente desde el Dashboard o automatizar vía API

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
- [ ] Flujo de reembolso probado
- [ ] EULA, ToS, Privacy y Cookie Policy revisados por abogado

---

*Última actualización: Marzo 2026 — EdugameDigital*
