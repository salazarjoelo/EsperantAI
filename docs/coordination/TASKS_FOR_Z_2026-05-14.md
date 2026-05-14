# Tareas para Z (GLM-4) — 2026-05-14

Tienes 2 tareas. Trabájalas en orden. La 1 es review (1-2 sesiones), la 2 es código (2-3 sesiones). Cada una se entrega como un PR separado.

## Contexto rápido del proyecto

EsperantAI es un controlador de gestos AI para streamers, browser-based. Detecta cara/manos con Human.js y dispara acciones en OBS/Streamlabs/vMix/etc. Licenciado vía LemonSqueezy + backend JWT Ed25519.

- Repo: https://github.com/salazarjoelo/EsperantAI
- Branch base: `main`
- Estado: 20 PRs mergeados, en preparación para launch comercial
- Stack: vanilla JS (sin frameworks), window globals, no ES modules en frontend
- Tests: vitest + jsdom (frontend), node --test (backend, pendiente)
- 4 AIs coordinándose: Claude (yo), ChatGPT, DeepSeek, Z (tú)

Tu fortaleza es **auditoría estructural + edge cases + code review riguroso**. Por eso te toca lo de abajo.

---

## TASK Z-201 — Security audit del license flow end-to-end

### Por qué importa
EsperantAI cuesta dinero (LemonSqueezy). El cliente almacena la licencia en `localStorage` y revalida cada 7 días contra el backend. Si hay un bypass —ej. monkey-patching `LicenseManager`, MITM del backend response, replay de un JWT viejo, XSS en el input— alguien puede usar Pro+ sin pagar. **Nadie ha hecho audit profundo todavía**.

### Lo que tienes que revisar (4 archivos)
1. `core/license-manager.js` (475 líneas) — toda la lógica cliente
2. `backend/src/server.js` (249 líneas) — el endpoint que valida con LemonSqueezy
3. `oauth-callback.html` — postMessage handshake
4. `app.js` líneas 19-31 — el lockout de bootstrap

### Entregable (1 archivo, no código)
`docs/AUDIT_LICENSE_SECURITY_Z.md` con esta estructura:

```markdown
# Security audit — License flow (Z, 2026-05-14)

## Resumen ejecutivo
[3-5 bullets: severidad agregada + cuántos críticos / high / medium / low]

## Findings

### Z-SEC-01 — [Título corto]
- **Severity:** CRITICAL | HIGH | MEDIUM | LOW
- **Archivo + línea:** `core/license-manager.js:142`
- **Descripción:** [qué bypass / qué falla]
- **PoC:** [pasos exactos para reproducirlo, o snippet JS que lo demuestre]
- **Impacto:** [qué gana el atacante]
- **Fix recomendado:** [código concreto o estrategia]

### Z-SEC-02 — ...
[etc, mínimo 8 findings — si encuentras menos, declara "exhausted" honestamente]

## Lo que NO encontré (revisado y descartado)
[lista 5-10 vectores que verificaste y están bien]

## Recomendaciones generales
[hardening sugerido fuera del scope de findings individuales]
```

### Áreas que DEBES tocar en el audit (checklist mínimo)
- [ ] ¿Se puede hacer monkey-patch de `LicenseManager.hasFeature` desde DevTools y bypasear tier gating?
- [ ] ¿El JWT del backend tiene `exp` corto? ¿Se valida `iat` y `nbf`?
- [ ] ¿Hay defensa contra replay (jti único)? ¿Una licencia robada de localStorage de otra máquina se puede usar?
- [ ] ¿El input de license key sanitiza? (XSS si el backend devuelve el key en algún error message)
- [ ] ¿`Content-Security-Policy` actual bloquea `eval()` / inline scripts si alguien inyecta?
- [ ] ¿Race condition entre `lic.isValid()` (sync local) y `lic.validate()` (async backend)?
- [ ] ¿Qué pasa si el backend responde 500 — ¿app se abre como Pro por error de fail-open?
- [ ] ¿El webhook de LemonSqueezy valida HMAC signature?
- [ ] ¿Rate limiting en `/api/license/activate` previene brute-force de keys?
- [ ] ¿`localStorage.removeItem('esperantai-license')` permite revocation real, o el cliente sigue activo hasta revalidation?

### Validación
- Tu doc se incluye via PR, sin código de implementación. Yo (Claude) o DeepSeek implementaremos los fixes en PRs posteriores referenciando tus findings por número.

### Anti-patterns prohibidos
1. NO inventes findings. Si no encuentras 8, di "exhausted at N findings".
2. NO repitas findings que el commit history ya cerró (ej. PR #15 cerró CSP inline-script, no lo cuentes como nuevo).
3. NO sugieras herramientas externas (Snyk, etc.) — todo el audit es manual sobre el código actual.
4. NO toques archivos. Solo lectura + el .md final.

### Branch + PR
- Branch: `audit/license-security-z`
- Título PR: `audit(license): Z security audit — N findings`

---

## TASK Z-202 — Test suite para Calibration Wizard

### Por qué importa
PR #18 mergeó el wizard (`core/calibration-wizard.js`, 396 líneas) sin tests. Es código nuevo, ejecutado al inicio de cada sesión Pro/Pro+, y modifica thresholds que afectan TODO el sistema de triggers. Si el algoritmo de "60% safety factor" se rompe, el usuario tiene que reabrir el wizard para arreglarse. Necesitamos cobertura.

### Entregable (1 archivo)
`tests/calibration-wizard.test.js` con mínimo **10 casos** vitest + jsdom. Setup similar a `tests/license-manager.test.js`.

### Casos mínimos a cubrir
1. **isAvailable() = false con licencia free** — wizard no abre
2. **isAvailable() = true con licencia pro** — wizard abre
3. **hasCompletedBefore() lee correcto de localStorage**
4. **markCompleted() escribe '1' a la key correcta**
5. **open({auto:true}) registra el handler de 'frame'** — verifica que `detector.on('frame', ...)` se llamó
6. **close({completed:true}) llama markCompleted + remueve handler** — `detector.off('frame', ...)` se llamó
7. **Algoritmo de safety factor** — dadas N muestras de baseline (yaw=±30°), `state.thresholds.yaw` ≈ 18° (60%)
8. **next()/back() respetan límites** — `back()` en step 0 no va negativo, `next()` en step 5 cierra
9. **onApplied callback se invoca** después de aplicar thresholds al config
10. **Skip during capture** — si user clica Skip mientras `collecting=true`, captura termina + step avanza

### Cómo mockear el detector
El wizard llama `detector.on('frame', fn)` y `detector.off('frame', fn)`. En el test:
```js
const detector = {
  _handlers: {},
  on(ev, fn) { (this._handlers[ev] ||= []).push(fn); },
  off(ev, fn) { this._handlers[ev] = (this._handlers[ev] || []).filter(x => x !== fn); },
  emit(ev, payload) { (this._handlers[ev] || []).forEach(fn => fn(payload)); }
};
```

### Cómo mockear el frame result
El wizard espera `{result: {face: [{rotation: {angle: {yaw, pitch, roll}}}]}, frame: N}`. Helper:
```js
function frame(yaw, pitch, roll) {
  return { result: { face: [{ rotation: { angle: { yaw, pitch, roll } } }] }, frame: 0 };
}
```

### Validación
```bash
npm test -- tests/calibration-wizard.test.js
```
Los 10+ casos pasan. CI verde.

### Anti-patterns prohibidos
1. NO modifiques `core/calibration-wizard.js`. Si encuentras un bug, escribe el test como `it.fails(...)` con TODO y dímelo en el PR description.
2. NO uses `setTimeout` real — usa `vi.useFakeTimers()`.
3. NO uses `document.createElement('canvas')` real — el overlay div debe poder testarse sin DOM browser real (jsdom basta).
4. NO acoples a la implementación interna (ej. nombres de funciones privadas `_makeState`). Testea solo API pública (`open`, `close`, `next`, `back`, `isAvailable`, etc.).

### Branch + PR
- Branch: `tests/calibration-wizard-z`
- Título PR: `test(calibration): Z test suite — 10 cases covering wizard lifecycle`

---

## Orden recomendado
1. **Z-201 primero** — es más rápido (1-2 sesiones de lectura). Suelta el doc, lo revisamos, decidimos qué fixes priorizar.
2. **Z-202 después** — código, requiere setup vitest local.

## Cuando termines
- PRs abiertos contra `main`. Yo reviewo y mergeo.
- Si descubres algo crítico en Z-201 que requiera hotfix, márcalo `CRITICAL` y avisa a Joel directamente en el PR description.
