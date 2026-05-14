# Tareas para DeepSeek — 2026-05-14

Tienes 2 tareas. Trabájalas en orden. La 1 cierra deuda técnica de tu PR #8 (backend); la 2 es nueva (performance benchmarks).

## Contexto rápido del proyecto

EsperantAI es un controlador de gestos AI para streamers, browser-based. Detecta cara/manos con Human.js 3.3.6 en Web Worker (con fallback main-thread) y dispara acciones en OBS/Streamlabs/vMix/etc. Licenciado vía LemonSqueezy + backend Node Express con JWT Ed25519.

- Repo: https://github.com/salazarjoelo/EsperantAI
- Branch base: `main`
- Tus contribuciones previas: PR #8 backend JWT Ed25519, PR #9 PUBLIC_KEY hex2bytes, PR #15 CSP fase 2, PR #16 Web Worker detector
- Stack backend: Node 20+, Express 4, jose 5 (JWT), rate-limiter-flexible
- VPS deploy: paramiko Python (NO bash ssh), Apache reverse proxy + systemd + Let's Encrypt

Tu fortaleza es **técnica profunda + security + performance**. Por eso te toca lo de abajo.

---

## TASK DS-301 — Refactor server.js para tests + cobertura backend

### Por qué importa
Tu PR #8 entregó `backend/src/server.js` (249 líneas) que arranca el server directamente (no exporta). Eso bloquea tests automatizados. `backend/package.json` ya tiene el script `"test": "node --test src/*.test.js"` pero no hay archivos `.test.js`. Sin tests, cualquier regresión en activate/validate rompe el negocio sin que nadie se entere hasta que un cliente reclame.

### Sub-tarea 301a — Refactor a `createApp()`
- `backend/src/server.js` debe **exportar** `createApp(deps?)` que retorna la instancia Express **sin escucharla**.
- `deps` opcional: `{ lemonSqueezyFetch, signKey, rateLimiterFactory, logger }` — para inyectar mocks en tests.
- El bootstrap real queda al final del archivo, protegido por:
  ```js
  if (import.meta.url === `file://${process.argv[1]}`) {
    const app = createApp();
    app.listen(PORT, () => console.log(`Listening on ${PORT}`));
  }
  ```
- **No cambies el comportamiento externo.** Mismas rutas, mismos status codes, mismos response shapes. Solo extrae las dependencias.

### Sub-tarea 301b — Tests (`backend/src/server.test.js`)
Mínimo **12 casos** con `node --test` nativo (no instales vitest ni mocha — el package.json ya dice `node --test`):

1. **POST /api/license/activate con key válida** → 200 + JWT en response
2. **POST /api/license/activate con key inválida** → 401
3. **POST /api/license/activate sin body** → 400
4. **POST /api/license/activate dispara LemonSqueezy** — verifica que `lemonSqueezyFetch` fue llamado con el endpoint correcto + body correcto
5. **JWT firmado contiene tier + licenseKey + exp** — decode + verify con la clave pública
6. **JWT `exp` está entre now+1d y now+8d** (revalidation cada 7 días)
7. **POST /api/license/validate con JWT válido** → 200 + `{valid: true}`
8. **POST /api/license/validate con JWT expirado** → 200 + `{valid: false, reason: 'expired'}`
9. **POST /api/license/validate con JWT firmado por otra clave** → 200 + `{valid: false, reason: 'bad_signature'}`
10. **POST /api/webhook con HMAC válido** → 200 + procesa evento
11. **POST /api/webhook con HMAC inválido** → 401
12. **Rate limiting en /api/license/activate** — 11ª request en 1 min desde misma IP → 429

### Sub-tarea 301c — CI workflow
- Crea `.github/workflows/backend-tests.yml` que corre:
  ```yaml
  - cd backend && npm ci && npm test
  ```
- Solo dispara cuando hay cambios en `backend/**`

### Validación
```bash
cd backend
npm ci
npm test
# Expected: 12 pass, 0 fail
```

### Anti-patterns prohibidos
1. NO uses Express supertest. Tests con `node --test` nativo + `node:http.request` o `fetch()` interno via createApp().
2. NO mockes `jose` — usa una clave real generada en el setup (`generateKeyPair('Ed25519')`).
3. NO hagas requests HTTP reales a LemonSqueezy. Inyecta `lemonSqueezyFetch` mock vía `createApp(deps)`.
4. NO toques `backend/scripts/generate-keypair.js` ni la clave pública del frontend.
5. NO cambies puertos, rutas ni shape de responses — solo añade la capa de exportación + tests.

### Branch + PR
- Branch: `tests/backend-server-deepseek`
- Título PR: `test(backend): DeepSeek — createApp() refactor + 12 server tests + CI workflow`

---

## TASK DS-302 — Performance benchmark del detector

### Por qué importa
Tu PR #16 puso el detector en Web Worker con fallback main-thread + backpressure (MAX_PENDING=2). Nadie ha medido si:
- El worker realmente es más rápido que main-thread (asumido pero no probado)
- La latencia P50/P95/P99 es aceptable para gestos rápidos (sub-100ms ideal)
- Frames se descartan en exceso bajo carga (backpressure)
- Hay memory leaks en sesiones largas

Sin un benchmark baseline, no podemos detectar regresiones cuando agreguemos features futuras.

### Entregable (2 archivos)
1. `scripts/benchmark-detector.mjs` — runner Node que invoca Human.js sintéticamente
2. `docs/PERFORMANCE_BUDGET.md` — documento con las métricas baseline + budget de regresión aceptable

### Diseño del benchmark
- **Input sintético**: genera `N` frames de 640x480 con un patrón de cara fija (puedes usar canvas + drawRect o cargar un sample frame de disco — sample en `tests/helpers/sample-face-640x480.png` que tienes que crear si no existe).
- **Modos a comparar**: main-thread vs worker (forzando `useWorker:true|false` en el detector).
- **Sample size**: 1000 frames mínimo, descarta primeros 50 (warmup).
- **Métricas a reportar**:
  - Latency P50, P95, P99 (ms por `human.detect()`)
  - Throughput (fps sustained)
  - Frames descartados por backpressure (worker mode only)
  - Memory delta (RSS antes vs después, opcional)
- **Resoluciones**: 640x480 y 1280x720 (Pro+ suele usar HD)
- **Output**: JSON estructurado a stdout + tabla markdown a stderr

### Ejemplo de output esperado
```
$ node scripts/benchmark-detector.mjs --frames 1000 --resolution 640x480

| Mode        | P50 (ms) | P95 (ms) | P99 (ms) | FPS | Dropped |
|-------------|---------:|---------:|---------:|----:|--------:|
| main-thread |       18 |       42 |       89 |  47 |       — |
| worker      |       12 |       28 |       65 |  78 |       3 |

{
  "main-thread": { "p50": 18, "p95": 42, ... },
  "worker": { "p50": 12, "p95": 28, ... }
}
```

### Documento (`docs/PERFORMANCE_BUDGET.md`)
Plantilla:
```markdown
# Performance Budget — EsperantAI Detector

## Baseline (medido 2026-05-14 con DS-302)
- Hardware: [especifica tuyo]
- Node: 20.x
- Human.js: 3.3.6

### 640x480, 1000 frames
[tabla con tus números reales — NO inventes]

### 1280x720, 1000 frames
[tabla]

## Budget de regresión aceptable
- P50 worker: +10% sobre baseline → warning
- P95 worker: +20% sobre baseline → bloquear merge
- FPS sustained worker: -15% sobre baseline → bloquear merge

## Cómo correr el benchmark
[comando + flags]

## Cómo interpretar resultados
[guía corta para futuros devs]
```

### Validación
```bash
node scripts/benchmark-detector.mjs --frames 100  # smoke test rápido
node scripts/benchmark-detector.mjs --frames 1000 # baseline real
```
Termina sin errors. Output JSON parseable.

### Anti-patterns prohibidos
1. NO inventes números — corre el benchmark de verdad en tu máquina y reporta lo que mida.
2. NO uses headless browser (puppeteer/playwright) — el benchmark corre en Node puro contra `@vladmandic/human` directamente. Si no se puede sin DOM, usa `jsdom` + canvas polyfill.
3. NO modifiques `core/detector.js` excepto si encuentras un bug — en ese caso, separa el fix en su propio commit dentro del mismo PR y documéntalo.
4. NO commitees el sample frame si pesa >100KB. Usa generación sintética con canvas.

### Branch + PR
- Branch: `perf/detector-benchmark-deepseek`
- Título PR: `perf(detector): DeepSeek — benchmark suite + baseline doc`

---

## Orden recomendado
1. **DS-301 primero** — cierra deuda técnica de PR #8, desbloquea tests CI backend.
2. **DS-302 después** — independiente, requiere instalar Human.js localmente para correr el bench.

## Cuando termines
- PRs abiertos contra `main`. Yo reviewo y mergeo.
- Si la sub-tarea 301a (refactor a createApp) descubre que hay bugs latentes en server.js, repórtalos en el PR description con severidad — yo decido si parchamos en el mismo PR o en uno nuevo.
- Si en DS-302 descubres que el worker NO es más rápido que main-thread, decláralo honestamente con los números — eso es un hallazgo válido que cambia decisiones futuras.
