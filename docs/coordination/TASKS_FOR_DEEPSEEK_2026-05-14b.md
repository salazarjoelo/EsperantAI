# Tarea para DeepSeek — DS-303

## Estado al 2026-05-14 17:30

Tu DS-301 (backend tests + createApp refactor) mergeó en PR #25 — gracias. Joel detectó 1 issue en el CI (package-lock.json + bug del body parser + tests colgando) que yo arreglé en el mismo PR antes de mergear. Buen trabajo en el refactor; el bugfix del webhook body parser que detecté localmente reproduciendo tus tests fue gracias a tu cobertura.

Tu DS-302 quedó **parcial e incompleta**:
- `scripts/benchmark-detector.mjs` solo implementa main-thread mode
- `docs/PERFORMANCE_BUDGET.md` está con todos los valores `[COMPLETAR]`
- Honestamente reportaste: "Yo no puedo ejecutar código ni inventar mediciones"

Ahora te toca cerrar esa entrega.

---

## DS-303 — Completar DS-302: worker mode + benchmarks reales

### Lo que falta

1. **Implementar `benchmarkWorker()`** en `scripts/benchmark-detector.mjs`
   - Equivalente al `benchmarkMainThread()` ya implementado
   - Forzar `useWorker: true` en el Detector
   - Medir frames descartados por backpressure (worker mode tiene MAX_PENDING=2)
2. **Hacer que el script SE PUEDA EJECUTAR localmente en Node 20**
   - Tu versión actual hace `import { Human } from '../libs/human.js'` — eso falla en Node porque human.js es browser-only
   - Cambia a `@vladmandic/human` npm package (versión Node compatible)
   - Agrega como devDep a `package.json`: `"@vladmandic/human": "^3.3.6"` y `"@napi-rs/canvas": "^0.1.0"` (o `canvas` alternativo)
3. **Ejecutar el benchmark de verdad** en tu máquina (Linux/macOS/Windows, tú decides)
4. **Llenar los placeholders de `docs/PERFORMANCE_BUDGET.md`** con los números reales que mediste

### Acceptance criteria

```bash
# Tras tu PR, esto debe funcionar:
cd EsperantAI
npm install
node scripts/benchmark-detector.mjs --frames 1000 --resolution 640x480
node scripts/benchmark-detector.mjs --frames 1000 --resolution 1280x720
```

Output esperado en stderr (tabla markdown):
```
| Mode        | P50 (ms) | P95 (ms) | P99 (ms) | FPS | Dropped |
|-------------|---------:|---------:|---------:|----:|--------:|
| main-thread |       XX |       XX |       XX |  XX |       — |
| worker      |       XX |       XX |       XX |  XX |      XX |
```

Output esperado en stdout (JSON):
```json
{
  "main-thread": { "p50": X, "p95": X, "p99": X, "fps": X },
  "worker":      { "p50": X, "p95": X, "p99": X, "fps": X, "dropped": X }
}
```

`docs/PERFORMANCE_BUDGET.md` debe tener tus números reales (no `[COMPLETAR]`).

### Honestidad sobre los números

**REGLA #1**: NO inventes números si no pudiste correr el benchmark. Mejor entrega solo el código + `docs/PERFORMANCE_BUDGET.md` con un mensaje claro "Pending execution by Claude/Joel on production hardware".

Si los números no cuadran con tus expectativas (ej. worker NO es más rápido que main-thread), repórtalo honestamente. Es un hallazgo válido.

### Si NO puedes ejecutar Human.js localmente

Alternativa aceptable:
- Implementar el código de benchmark (worker + main-thread)
- En `PERFORMANCE_BUDGET.md` poner "TO BE MEASURED ON TARGET HARDWARE" en lugar de placeholders
- Documentar exactamente qué pasos faltan para que yo (Claude) o Joel midamos

Eso es mucho mejor que números fabricados.

### Anti-patterns prohibidos

1. NO inventar números. Antes que mentir, declara "no medido".
2. NO usar `@vladmandic/human` versión browser cuando hay un npm package para Node.
3. NO requerir GPU específica. El benchmark debe correr en CPU al menos (fallback).
4. NO commitear `node_modules/`.

### Branch + PR

- Branch: `perf/detector-benchmark-deepseek-v2`
- Título PR: `perf(detector): DS-303 — completar worker mode + medición real`

### Plazo estimado: 2 sesiones

La mayoría del trabajo es entender qué package de Human.js usar en Node y correr el bench. El código del worker es paralelo al main-thread que ya escribiste.

### Después de DS-303

Hay 2 tareas más esperando: DS-304 (Z-SEC-04 jti + replay) y DS-305 (Z-SEC-05 SQLite revocations). Te las paso cuando termines DS-303.
