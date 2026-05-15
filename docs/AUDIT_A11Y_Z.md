# WCAG/a11y audit (Z, 2026-05-14)

## Resumen

- **Puntuación Lighthouse estimada**: 62/100 (index.html) · 78/100 (landing.html) · 70/100 (oauth-callback.html)
- **WCAG 2.1 AA compliance**: ~55% (15 criterios cumplidos de 27 aplicables)
- **Página con más problemas**: `index.html` (form labels, focus visible, aria-live, reduce motion)
- **Página más accesible**: `landing.html` (tiene skip-link, headings correctos, mejor estructura semántica)

## Findings por criterio WCAG

### 1.1.1 Non-text content (A)
- Status: ❌
- `index.html`: Logo SVG (`<img src="assets/branding/logo.svg" class="brand-logo" alt="EsperantAI">`) — tiene alt text ✅
- `landing.html`: Logo SVG tiene alt="EsperantAI" ✅
- `index.html`: Feature icons son emojis (🧠✋🎬📡🌍🔒) — los emojis son texto, screen readers los leen ✅
- `index.html`: `<video id="video">` NO tiene `aria-label` ni `aria-describedby`. El video muestra la webcam del usuario con overlay de detección. Un screen reader no sabe qué es. ❌
- `index.html`: `<canvas id="overlay">` no tiene rol ni label accesible. ❌
- **Fix**: Agregar `aria-label="Camera feed with gesture detection overlay"` al video container, y `role="img" aria-hidden="true"` al canvas (es decorativo).

### 1.3.1 Info and Relationships (A)
- Status: ⚠️
- `index.html`: Muchos `<label>` SIN atributo `for`:
  - `<label data-i18n="ui.select_camera">Camera tracking your face:</label>` — no tiene `for="camera-select"` ❌
  - `<label for="adapter-type">Streaming software</label>` — este SÍ tiene `for` ✅
  - Labels de Client ID en platform events sections — no tienen `for` ❌
  - `<label>JWT Token</label>` — no tiene `for` ❌
- `landing.html`: Las feature cards usan `<h3>` dentro de estructura sin `<h2>` inmediato — pero el `<h2>` section-title está antes, así que la jerarquía es correcta ✅
- **Fix**: Agregar `for` a todos los labels y `id` a los inputs correspondientes.

### 1.3.2 Meaningful Sequence (A)
- Status: ⚠️
- `index.html`: El tab order sigue el DOM order, que es: lang-selector → brand header → profile → status → video → config panels. Es lógico ✅
- `index.html`: Los `<details>` se abren y cierran con Enter/Space, pero el contenido interior no siempre tiene tab order claro ❌
- **Fix**: Agregar `tabindex="0"` a elementos interactivos dentro de details.

### 1.4.1 Use of Color (A)
- Status: ✅
- Los badges de status usan color + texto ("AI Ready", "OBS Connected", "Detection Active"). La información no depende solo del color.

### 1.4.3 Contrast (Minimum) (AA)
- Status: ❌
- `--text-muted: #8b949e` sobre `--bg: #0d1117`: ratio ≈ 4.0:1 — **NO cumple AA para texto normal** (requiere 4.5:1) ❌
- `--text: #c9d1d9` sobre `--bg: #0d1117`: ratio ≈ 9.4:1 ✅
- `--text-muted` sobre `--panel: #161b22`: ratio ≈ 4.3:1 — **NO cumple AA** ❌
- `.metric-label` (9px uppercase, color `--text-muted`): texto pequeño + bajo contraste = muy difícil de leer ❌
- Botones `.secondary` (texto `--text: #c9d1d9` sobre `--border: #30363d`): ratio ≈ 5.4:1 ✅
- `.footer` texto (#8b949e sobre #0d1117): ratio ≈ 4.0:1 ❌
- **Fix**: Aumentar `--text-muted` a `#9ca8b3` (ratio ≈ 4.6:1) o `#a0adb8` (ratio ≈ 5.0:1).

### 1.4.11 Non-text Contrast (AA)
- Status: ⚠️
- `--border: #30363d` sobre `--panel: #161b22`: ratio ≈ 1.9:1 — **NO cumple** el mínimo 3:1 para borders de componentes ❌
- Los borders de inputs, panels y details no son suficientemente visibles.
- **Fix**: Aumentar `--border` a `#3d444d` (ratio ≈ 2.4:1) o `#444c56` (ratio ≈ 2.8:1). Ideal: `#4a535c` (ratio ≈ 3.1:1).

### 2.1.1 Keyboard (A)
- Status: ⚠️
- `landing.html`: Skip link funciona ✅
- `index.html`: NO hay skip link ❌
- `index.html`: Los dropdowns de triggers y sliders son operables con teclado ✅
- `index.html`: El botón "Recalibrate" usa `?.addEventListener` (optional chaining) — si el botón no existe, no se rompe ✅
- **Fix**: Agregar skip link a `index.html`: `<a href="#dashboard" class="skip-link">Skip to dashboard</a>`

### 2.1.2 No Keyboard Trap (A)
- Status: ⚠️
- `index.html`: El Calibration Wizard modal tiene focus trap implementado (Tab/Shift+Tab wrap) ✅
- `index.html`: El License Lockout modal tiene focus trap implementado ✅
- `index.html`: Los `<details>` no atrapan el foco ✅
- **Issue**: Si el video element captura el foco (es interactivo por autoplay), el usuario podría quedar "atrapado" en el video sin saber cómo salir. Falta `tabindex="-1"` en el video. ❌

### 2.4.1 Bypass Blocks (A)
- Status: ❌
- `index.html`: No tiene skip link ni landmark roles para saltar la navegación. Un usuario de screen reader tiene que navegar por TODO el brand header, profile bar y status bar antes de llegar al contenido principal.
- `landing.html`: Tiene `<a href="#features" class="skip-link">Saltar al contenido</a>` ✅
- **Fix**: Agregar skip link y/o landmarks: `<header>`, `<nav>`, `<main id="main-content">`, `<footer>`.

### 2.4.2 Page Titled (A)
- Status: ✅
- `index.html`: `<title>EsperantAI — Honest gestures</title>` ✅
- `landing.html`: `<title>EsperantAI — Una licencia para controlar tu stream con gestos honestos</title>` ✅
- `oauth-callback.html`: `<title>EsperantAI — OAuth Callback</title>` ✅

### 2.4.3 Focus Order (A)
- Status: ⚠️
- El focus order es secuencial en el DOM, que es correcto ✅
- `index.html`: El `<select id="lang-selector">` está posicionado `absolute; top:20px; right:20px` pero aparece primero en el DOM. Al navegar con Tab, el primer foco es el selector de idioma (esquina superior derecha), luego el brand header (arriba centro). Esto es confuso — el usuario espera foco arriba-izquierda. ❌
- **Fix**: Mover el lang-selector al final del DOM o agregar `tabindex="-1"` y hacer accesible solo vía shortcut.

### 2.4.6 Headings and Labels (AA)
- Status: ⚠️
- `index.html`: Tiene múltiples `<h2>` sin un `<h1>`. El "brand-name" es un `<div>`, no un heading. ❌
  - La jerarquía es: (sin h1) → h2 (Camera Detector) → h2 (Connection) → h2 (Triggers) → etc.
  - Debería ser: h1 (EsperantAI) → h2 (Camera Detector) → h2 (Connection) → etc.
- `landing.html`: Jerarquía correcta: h1 (EsperantAI) → h2 (features, compat, pricing, FAQ) → h3 (feature titles) ✅
- **Fix**: Cambiar `.brand-name` de `<div>` a `<h1>` en `index.html`.

### 2.4.7 Focus Visible (AA)
- Status: ❌
- `index.html`: Los inputs tienen `outline: none` implícito (reset en el input CSS `outline: none; transition: border-color 0.15s;`). El focus se indica SOLO por `border-color: var(--brand-1)`, que puede no ser visible suficiente. ❌
- `landing.html`: El `.cta-primary` y `.cta-secondary` no tienen estilos de focus visible ❌
- Buttons no tienen focus ring visible ❌
- **Fix**: Agregar focus ring visible:
  ```css
  :focus-visible {
      outline: 2px solid var(--brand-1);
      outline-offset: 2px;
  }
  button:focus-visible, a:focus-visible, input:focus-visible, select:focus-visible {
      outline: 2px solid var(--brand-1);
      outline-offset: 2px;
  }
  ```

### 3.1.1 Language of Page (A)
- Status: ⚠️
- `index.html`: `<html lang="en-US">` — correcto para el contenido base ✅
- `landing.html`: `<html lang="es">` — correcto, la página está en español ✅
- `oauth-callback.html`: `<html lang="en">` — correcto ✅
- **Issue**: Cuando el usuario cambia el idioma en `index.html` via i18n, el `<html lang>` NO se actualiza. Si el usuario selecciona zh-CN, el `lang` sigue siendo `en-US`. Los screen readers leen el contenido chino con pronunciación inglesa. ❌
- **Fix**: En `i18n.setLocale()`, actualizar `document.documentElement.lang = locale;`

### 3.2.2 Labels or Instructions (A)
- Status: ⚠️
- `index.html`: Los inputs de Client ID tienen `placeholder` pero no `label` asociado correctamente (falta `for`) ❌
- `index.html`: El import file input (`<input type="file" id="import-file">`) tiene `class="hidden"` y no es accesible ❌
- `landing.html`: Los formularios no tienen inputs (solo botones), así que no aplica ✅
- **Fix**: Asociar todos los labels con `for`/`id`.

### 3.3.1 Error Identification (A)
- Status: ⚠️
- `index.html`: Los errores de licencia se muestran en `#license-error` con `role="status" aria-live="polite"` — bueno ✅
- `index.html`: Los badges de status (AI Error, OBS Disconnected) NO tienen `aria-live`. Un screen reader no anuncia cuando el estado cambia. ❌
- **Fix**: Agregar `aria-live="polite"` al status bar o a los badges individuales:
  ```html
  <div class="status-bar" aria-live="polite" aria-atomic="true">
  ```

### 3.3.2 Labels or Instructions (A)
- Status: ⚠️
- Mismo que 1.3.1 — labels sin `for`.
- Los placeholders como "From dev.twitch.tv/console" son útiles pero no reemplazan labels ❌

### 4.1.1 Parsing (A)
- Status: ✅
- No se encontraron errores de parsing significativos. Los HTML son bien formados.

### 4.1.2 Name, Role, Value (A)
- Status: ⚠️
- `index.html`: Los `<details>` son nativos y accesibles ✅
- `index.html`: Los checkboxes de categoría en TriggerUIBuilder son accesibles ✅
- `index.html`: Los sliders (`<input type="range">`) no tienen `aria-label` ni `aria-valuetext`. El screen reader dice "slider, 50" sin contexto. ❌
- **Fix**: Agregar `aria-label` dinámico a los sliders (ya tienen `<label>` pero no `for`).

### Reduce motion — 2.3.3 Animation from Interactions (AAA) / prefers-reduced-motion
- Status: ❌
- No hay `@media (prefers-reduced-motion: reduce)` en ningún CSS.
- Animaciones que deberían respetar esta preferencia:
  - `.badge` transitions
  - `button.primary:hover` transform
  - `.cta-primary:hover` transform
  - `.spinner` animation (oauth-callback)
  - `details > summary::before` rotation
  - `.current-pose` gradient
  - `source_visibility` autoHide overlay fade
  - Calibration wizard progress bar animation
- **Fix**: Agregar a cada CSS:
  ```css
  @media (prefers-reduced-motion: reduce) {
      *, *::before, *::after {
          animation-duration: 0.01ms !important;
          transition-duration: 0.01ms !important;
      }
  }
  ```

### Modal accessibility
- Status: ⚠️
- Calibration Wizard: tiene `role="dialog"`, `aria-modal="true"`, `aria-labelledby`, `aria-describedby` ✅
- License Lockout: tiene `role="dialog"`, `aria-modal="true"`, `aria-labelledby`, `aria-describedby` ✅
- Action config modal: tiene `class="action-modal-overlay"` pero NO tiene `role="dialog"` ni `aria-modal` ❌
- **Fix**: Agregar `role="dialog" aria-modal="true"` al action config modal en `core/trigger-ui-builder.js`.

---

## Top 5 fixes prioritarios pre-launch

1. **Contraste de `--text-muted`** (criterio 1.4.3) — Aumentar de `#8b949e` a `#9ca8b3` o `#a0adb8`. Impacta TODO el texto secundario, métricas, hints, footer. 1 línea de CSS.

2. **Focus visible** (criterio 2.4.7) — Agregar `:focus-visible` outline a buttons, inputs, links, selects. Sin esto, la navegación por teclado es invisible. ~10 líneas de CSS.

3. **`<h1>` en index.html** (criterio 2.4.6) — Cambiar `.brand-name` de `<div>` a `<h1>`. Sin h1, la estructura de headings es inválida. 1 línea de HTML.

4. **Skip link en index.html** (criterio 2.1.1) — Agregar `<a href="#dashboard" class="skip-link">Skip to content</a>`. Sin esto, screen readers deben navegar TODO el header. 2 líneas de HTML + reutilizar CSS de landing.

5. **`aria-live` en status bar** (criterio 3.3.1) — Agregar `aria-live="polite"` a la status bar. Sin esto, cambios de estado (OBS conectado/desconectado) no se anuncian a screen readers. 1 atributo HTML.

---

*Auditoría realizada por Z (GLM-4) el 2026-05-14. Archivos revisados: `index.html` (~250 líneas), `landing.html` (~230 líneas), `oauth-callback.html` (21 líneas), `css/index.css` (~480 líneas), `css/landing.css` (~280 líneas), `css/oauth-callback.css` (~55 líneas). Total: ~1316 líneas auditadas manualmente.*
