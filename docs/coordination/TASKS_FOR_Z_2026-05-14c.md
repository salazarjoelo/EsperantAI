# Tareas para Z (GLM-4) — Z-204 + Z-205

Tienes 2 tareas. Z-204 es audit (doc-only), Z-205 también es audit. Ambas son críticas pre-launch comercial.

## Z-204 — Audit estructural de los 4 adapters (OBS / Streamlabs / vMix / XSplit)

### Por qué importa

Los adapters son la capa que conecta EsperantAI con el software de streaming del usuario. Si un adapter tiene race conditions, leaks de socket o error handling débil:
- Stream se rompe en vivo
- Acción que el streamer activó no se ejecuta y no sabe por qué
- Reconnect infinito loop con CPU al 100%
- Memory leak por handlers no removidos

Z-201 audit cubrió license flow. Ahora toca lo MISMO pero para los 4 adapters.

### Archivos a revisar

1. `adapters/adapter-base.js` — clase abstracta
2. `adapters/adapter-obs.js` — usa obs-websocket-js v5
3. `adapters/adapter-streamlabs.js` — REST API
4. `adapters/adapter-vmix.js` — HTTP API + XML responses
5. `adapters/adapter-xsplit.js`

Y referencia:
- `app.js` líneas ~130-200 donde se instancian (cómo se montan)

### Checklist mínimo (cubre todo lo siguiente o documenta por qué no aplica)

- [ ] **Reconnect logic**: ¿hay backoff exponencial o reintenta cada 1s para siempre?
- [ ] **Socket cleanup**: cuando `disconnect()` se llama, ¿se remueven event listeners?
- [ ] **Race condition al connect**: si usuario clica Connect rápido 2 veces, ¿hay 2 sockets abiertos?
- [ ] **Error handling**: ¿qué pasa si scene NO existe? ¿Promise rejects o se queda colgado?
- [ ] **Heartbeat / keepalive**: ¿se detecta cuando el peer se cayó silenciosamente?
- [ ] **Auth state stale**: si el password cambia en OBS, ¿el adapter sabe que ya no autentica?
- [ ] **Memory leak**: cada `reconnect` ¿agrega un listener sin limpiar el anterior?
- [ ] **Concurrent calls**: 2 acciones simultáneas (ej. cambiar escena + togglear filter), ¿se ordenan o race?
- [ ] **Timeout en requests**: HTTP/WS sin timeout default puede colgar la app
- [ ] **XSplit/Streamlabs/vMix support real**: ¿existen métodos faltantes que retornan `false` silenciosa?
- [ ] **CSP**: ¿algún adapter intenta cargar script externo no permitido?
- [ ] **WS password en plain text** en localStorage si "save_password" enabled

### Entregable (sin código)

`docs/AUDIT_ADAPTERS_Z.md` con estructura:

```markdown
# Audit estructural — Adapters (Z, 2026-05-14)

## Resumen ejecutivo
- N findings: A CRITICAL, B HIGH, C MEDIUM, D LOW
- Adapter con más riesgo: [...]
- Adapter más maduro: [...]

## Findings

### Z-ADP-01 — [Título]
- **Severity:** CRITICAL/HIGH/MEDIUM/LOW
- **Adapter afectado:** obs / streamlabs / vmix / xsplit / base / todos
- **Archivo + línea:** ...
- **Descripción:** ...
- **PoC:** [si aplica, código o pasos]
- **Impacto:** [qué se rompe en producción]
- **Fix recomendado:** [código o estrategia]

## Lo que NO encontré (verificado y descartado)
[5-10 vectores que probaste]
```

### Mínimo 6 findings, máximo escribe lo que encuentres honestamente

### Branch + PR

- Branch: `audit/adapters-z`
- Título: `audit(adapters): Z structural audit — N findings across 4 adapters`

### Plazo: 1-2 sesiones

---

## Z-205 — Audit WCAG/a11y de `index.html` + `landing.html`

### Por qué importa

EsperantAI se vende globalmente. UE y California tienen regulación creciente sobre accesibilidad (EAA 2025, ADA). Sin un audit base:
- Lectores de pantalla no funcionan
- Navegación por teclado rota
- Contraste insuficiente excluye usuarios con baja visión
- Demandas legales potenciales en mercados regulados

### Archivos a revisar

1. `index.html` (app principal, ~250 líneas)
2. `landing.html` (página ventas)
3. `oauth-callback.html` (callback OAuth)
4. CSS asociado: `css/index.css`, `css/landing.css`, `css/oauth-callback.css`

### Checklist mínimo

- [ ] **Headings hierarchy**: `<h1>` único? `<h2>` lógicos? No saltos h1→h3
- [ ] **Alt text en imágenes** (incluido logo SVG)
- [ ] **Form labels** asociados (`<label for>` o `aria-label`)
- [ ] **Botones con texto** (NO solo iconos sin aria-label)
- [ ] **Focus visible** en navegación por teclado (TAB)
- [ ] **Tab order** lógico
- [ ] **Skip links** ("Saltar al contenido")
- [ ] **Color contrast** WCAG AA mínimo (4.5:1 texto normal, 3:1 large)
- [ ] **No texto en imágenes** (use CSS)
- [ ] **Anuncios dinámicos**: status badges con `aria-live`?
- [ ] **Modal accessibility**: focus trap, aria-modal, escape
- [ ] **Reduce motion**: `prefers-reduced-motion` respetado?
- [ ] **Lang attribute** correcto en `<html>`
- [ ] **Idioma de inputs/placeholders** consistente con `<html lang>`
- [ ] **Error messages** linkeados con `aria-describedby`
- [ ] **Video element**: si hay `<video>`, ¿tiene controles + transcripción/captions?

### Tools sugeridos para audit (manualmente, no automatizado)

- Lighthouse Accessibility (Chrome DevTools)
- axe-core extension
- Navegar todo con TAB sin mouse
- Probar con NVDA o VoiceOver

### Entregable

`docs/AUDIT_A11Y_Z.md` con estructura WCAG 2.1 Level AA:

```markdown
# WCAG/a11y audit (Z, 2026-05-14)

## Resumen
- Puntuación Lighthouse estimada: X/100
- WCAG 2.1 AA compliance: X% (Y criterios cumplidos de Z aplicables)

## Findings por criterio WCAG

### 1.1.1 Non-text content (A)
- Status: ✅ / ⚠️ / ❌
- [detalles si ❌]

### 1.3.1 Info and Relationships (A)
...

### 1.4.3 Contrast (Minimum) (AA)
...

## Top 5 fixes prioritarios pre-launch
1. [...]
2. [...]
```

### Branch + PR

- Branch: `audit/a11y-z`
- Título: `audit(a11y): Z WCAG 2.1 AA audit — N findings`

### Plazo: 1 sesión

---

## Orden recomendado

1. **Z-204 primero** (adapters): los bugs aquí pueden romper stream EN VIVO. Crítico.
2. **Z-205 después** (a11y): regulatorio pero no rompe funcionalidad.

Ambos PRs son doc-only. Si encuentras algo URGENTE (CRITICAL severity), márcalo en el PR description y avisa a Joel directamente.
