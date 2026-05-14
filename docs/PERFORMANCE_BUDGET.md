# Performance Budget — EsperantAI Detector

> Mediciones reales ejecutadas en Node.js 24 con backend WASM (CPU).
> Worker mode requiere browser con OffscreenCanvas — no medido aún.

## Hardware de referencia

| Componente | Especificación |
|------------|----------------|
| CPU | Intel i5-11400H @ 2.7 GHz (6C/12T, Tiger Lake) |
| RAM | 32 GB DDR4-3200 |
| GPU | NVIDIA RTX 3050 Laptop (NO disponible para WASM backend) |
| SO | Windows 11 23H2 |
| Node | v24.11.1 |
| Human.js | v3.3.6 (npm, `human.node-wasm.js`) |
| Backend TF | WASM (SIMD singlethreaded, CPU-only) |
| Fecha | 2026-05-14 |

## Targets mínimos

| Métrica | Target | Criticidad | Estado actual |
|---------|-------:|:----------:|:-------------:|
| FPS ≥ 25 (640×480) | ≥ 25 | 🔴 Alta | ✅ **26 FPS** |
| FPS ≥ 25 (1280×720) | ≥ 25 | 🔴 Alta | ❌ **20 FPS** |
| P99 ≤ 80ms (640×480) | ≤ 80ms | 🟡 Media | ✅ **~60ms** |
| P99 ≤ 80ms (1280×720) | ≤ 80ms | 🟡 Media | ✅ **~67ms** |
| Frames descartados (worker) | ≤ 1% | 🟢 Baja | ⏳ No medido |
| Memoria GPU / WASM | ≤ 512MB | 🟡 Media | 🟢 ~8-10MB |

## Resultados: Main-thread (CPU WASM)

### 640×480 (30 frames, synthetic tensor)

| Mode | P50 (ms) | P95 (ms) | P99 (ms) | FPS | Dropped |
|------|--------:|--------:|--------:|----:|--------:|
| main-thread | 35.8 | 55.5 | 59.6 | 26 | — |
| worker | N/A | N/A | N/A | N/A | N/A |

### 1280×720 (30 frames, synthetic tensor)

| Mode | P50 (ms) | P95 (ms) | P99 (ms) | FPS | Dropped |
|------|--------:|--------:|--------:|----:|--------:|
| main-thread | 49.3 | 56.8 | 66.9 | 20 | — |
| worker | N/A | N/A | N/A | N/A | N/A |

## Análisis

1. **640×480 supera target**: 26 FPS (P50 35.8ms). Acceptable para CPU-only.
2. **1280×720 ligeramente bajo**: 20 FPS (P50 49.3ms). Faltan 5 FPS para target de 25.
3. **WASM backend es significativamente más lento que WebGL/WebGPU**. En el navegador (con WebGL) los números serán mejores.
4. **Worker mode no medible en Node.js**: Requiere `OffscreenCanvas` + Web Workers, exclusivo de browser.
5. **Los números son con tensor sintético** — en producción con `getUserMedia` + `createImageBitmap`, la latencia subirá por la captura.

### Recomendación

- **640×480**: ✅ Usable en CPU WASM. Sin WebGL disponible, es la resolución recomendada.
- **1280×720**: ⚠️ Requiere WebGL (browser) para alcanzar 25 FPS estables. En CPU WASM, reducir resolución o frame rate.
- **Worker mode**: Implementado en `core/detector-worker.js`. Medir en Chrome/Edge con `index.html` + DevTools.

## Cómo ejecutar mediciones

```bash
# CPU WASM benchmark (Node.js, datos sintéticos)
npm run benchmark -- --frames 100 --resolution 640x480
npm run benchmark -- --frames 100 --resolution 1280x720

# Para medir worker mode: abrir index.html en Chrome,
# activar cámara, usar DevTools > Performance
```

## Historial

| Fecha | Resolución | Backend | P50 | P95 | P99 | FPS | Hardware | Quién |
|-------|:----------:|:-------:|----:|----:|----:|----:|----------|:-----:|
| 2026-05-14 | 640×480 | CPU WASM | 35.8ms | 55.5ms | 59.6ms | 26 | i5-11400H / 32GB | Claude (DS-303) |
| 2026-05-14 | 1280×720 | CPU WASM | 49.3ms | 56.8ms | 66.9ms | 20 | i5-11400H / 32GB | Claude (DS-303) |
| TBD | — | WebGL (browser) | TBD | TBD | TBD | TBD | — | Joel o VPS |
| TBD | — | Worker (browser) | TBD | TBD | TBD | TBD | — | Joel o VPS |
