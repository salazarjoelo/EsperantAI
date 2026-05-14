# Spec: Web Worker para Human.js (TASK-104)

> Contrato de mensajes entre `core/detector-worker.js` (nuevo, ejecuta en Web Worker) y `core/detector.js` (existente, queda como cliente del worker). Diseño para que **DeepSeek** implemente sin tocar `trigger-engine.js` ni el resto del bootstrap.

**Autor**: Claude
**Estado**: propuesta — DeepSeek puede modificar antes de implementar
**Para**: DeepSeek (primario TASK-104), Claude (revisor)

---

## Por qué

Hoy Human.js corre en el main thread. En máquinas medias (i5 2020 + GPU integrada), `human.detect()` puede tomar 30-60ms por frame. Esto bloquea la UI: animaciones, scroll y clicks lag. Para un streamer que está manipulando OBS al mismo tiempo, el lag es perceptible.

Mover la detección a un Web Worker (con OffscreenCanvas) libera el main thread completamente. Objetivo: **≥25 FPS detección + ≥55 FPS UI** simultáneo en hardware de referencia.

---

## Arquitectura propuesta

```
┌──────────────────────────────────────────────────────────────┐
│ Main thread (existente)                                      │
│                                                              │
│  app.js                                                      │
│   ↓ pasa <video> stream                                      │
│  core/detector.js  ← queda como wrapper público              │
│   ↓ postMessage al worker                                    │
│   ↑ recibe resultados                                        │
│  trigger-engine.js (sin cambios)                             │
│  trigger-ui-builder.js (sin cambios)                         │
└──────────────────────────────────────────────────────────────┘
         ↕  postMessage + structured clone
┌──────────────────────────────────────────────────────────────┐
│ Web Worker thread (nuevo: core/detector-worker.js)           │
│                                                              │
│  - importScripts('libs/human.js')                            │
│  - OffscreenCanvas para procesar frames                      │
│  - Loop interno: extraer frame del VideoFrame transferable   │
│  - human.detect(offscreenCanvas)                             │
│  - postMessage({result, frameMeta})                          │
└──────────────────────────────────────────────────────────────┘
```

### Fallback obligatorio

Si `typeof OffscreenCanvas === 'undefined'` o `typeof Worker === 'undefined'`, el detector debe operar **en main thread como hoy**. Browsers afectados: Firefox <110 (OffscreenCanvas detrás de flag pre-2023), Safari ≤16.4 (parcial).

DeepSeek: detecta la capacidad al cargar y elige la ruta. La API pública del detector NO cambia entre las dos rutas.

---

## Contrato de mensajes (postMessage)

### Main → Worker

#### `INIT`
Envía configuración inicial. Se llama una vez al cargar.

```javascript
{
  type: 'INIT',
  config: {
    modelBasePath: 'models/',
    face: { enabled: true, detector: { rotation: false } },
    hand: { enabled: false, landmarks: true },
    gesture: { enabled: true },
    emotion: { enabled: false },
    backend: 'webgl' // o 'webgpu', 'cpu', 'wasm' — DeepSeek decide auto-detect
  },
  // Si OffscreenCanvas soportado, transferir aquí. Si no, omitir y usar
  // ImageBitmap por frame (rama de fallback)
  offscreenCanvas: OffscreenCanvas | undefined
}
```

Worker responde con:
```javascript
{
  type: 'INIT_DONE',
  backend: 'webgl' | 'webgpu' | 'cpu' | 'wasm',  // el que efectivamente usa
  modelsLoaded: ['face', 'gesture', 'hand'],
  errors: []
}
```

O en caso de error:
```javascript
{
  type: 'INIT_ERROR',
  error: 'string',
  fatal: boolean  // si true, main debe caer a fallback main-thread
}
```

#### `FRAME`
Envía un frame del video al worker. Llamado por `requestAnimationFrame` en main thread.

```javascript
{
  type: 'FRAME',
  frameId: number,            // incremental, para tracking
  timestamp: number,           // performance.now() del main
  // Usar ImageBitmap transferable (zero-copy a worker):
  bitmap: ImageBitmap,        // transferable, se mueve, no se copia
  width: number,
  height: number
}
```

Main thread debe usar `postMessage(msg, [bitmap])` para que el bitmap sea transferable. El main pierde la referencia tras enviarlo (es el comportamiento correcto: el frame ya se consumió).

#### `PAUSE` / `RESUME`
Cuando el streamer pausa la detección desde el UI:
```javascript
{ type: 'PAUSE' }
{ type: 'RESUME' }
```

#### `TERMINATE`
Cuando el componente se destruye:
```javascript
{ type: 'TERMINATE' }
```

Worker debe limpiar handlers y `self.close()`.

### Worker → Main

#### `RESULT`
Después de procesar un frame:

```javascript
{
  type: 'RESULT',
  frameId: number,             // mismo que en FRAME — main puede medir latencia
  timestamp: number,           // main timestamp original
  workerLatencyMs: number,     // tiempo dentro del worker
  result: {
    // Mismo shape que human.result actual — el main NO debe cambiar
    // cómo interpreta esto. trigger-engine.js sigue consumiendo result.
    face: [...],
    hand: [...],
    gesture: [...],
    emotion: [...],
    performance: {...}
  }
}
```

**Importante**: el `result` puede ser grande (varios MB con landmarks). Usar structured clone (default de postMessage). Si bench mide problema, optar por `Transferable` en arrays típados específicos.

#### `MODEL_LOAD_PROGRESS`
Durante INIT, reportar progreso para UI loading state:
```javascript
{
  type: 'MODEL_LOAD_PROGRESS',
  model: 'face' | 'gesture' | 'hand' | 'emotion',
  progress: 0..1  // 0 a 1
}
```

#### `ERROR`
Cualquier error no-fatal en el worker:
```javascript
{
  type: 'ERROR',
  error: string,
  frameId: number | null,
  fatal: false
}
```

Si `fatal: true`, main debe destruir el worker e intentar fallback a main thread (o bloquear).

#### `BACKEND_LOSS`
Si WebGL context se pierde (el browser libera GPU memory), notificar al main:
```javascript
{ type: 'BACKEND_LOSS' }
```

Main puede mostrar warning visual y el worker reintenta init automáticamente.

---

## Detalles de implementación que DeepSeek decide

1. **OffscreenCanvas vs ImageBitmap**: si OffscreenCanvas se puede transferir UNA vez al INIT y el main solo envía `VideoFrame.copyTo(offscreenCanvas)` o `drawImage`, el costo de transferencia desaparece. Pero requiere que el worker mantenga el canvas vivo.

   Alternativa: `createImageBitmap(videoElement)` en main thread, transferir al worker, el worker dibuja en su propio canvas privado. Más simple, ligeramente más caro.

   DeepSeek: bench ambos y elige.

2. **Backpressure**: si el worker es más lento que `requestAnimationFrame`, el main empezará a acumular FRAMEs en queue. Esto causa memory leak y aumenta latencia.

   Solución propuesta: main mantiene un `pendingFrames` counter. Si > 2, descarta el FRAME actual (no lo envía al worker). Esto degrada FPS pero mantiene latencia baja.

3. **WebGPU vs WebGL**: WebGPU es 2-5× más rápido si está disponible. Human.js 3.3.6 lo soporta. DeepSeek decide auto-detect al INIT con fallback.

4. **Resize de canvas**: si el video cambia de resolución (ej. usuario cambia cámara), el main envía un mensaje `{type: 'RESIZE', width, height}`. Worker actualiza su OffscreenCanvas.

5. **Reset de gassho state**: el worker llama a `resetGasshoState()` (de `core/gesture-gassho.js`) en PAUSE y TERMINATE. Pero `gesture-gassho.js` corre en main thread, NO en worker — el worker solo emite `result.hand` y main thread procesa gassho. Decisión: gassho se queda en main thread (es liviano comparado con Human.js), worker solo hace Human.js.

---

## Métricas de éxito

| Métrica | Objetivo | Cómo medir |
|---|---|---|
| FPS detección | ≥25 | `result.performance.fps` o frame counter del main |
| FPS UI | ≥55 | DevTools Performance, Long Task entries |
| Latencia frame→result | < 80ms P95 | `workerLatencyMs` + transfer time |
| Memory growth | < 5 MB/h | DevTools Memory, heap snapshots a 0h y 1h de uso |
| Fallback main-thread funciona | ✓ | Test con Firefox 109 (sin OffscreenCanvas) |

DeepSeek puede agregar más. Lo mínimo para considerar TASK-104 cerrada: las 5 anteriores.

---

## Lo que NO está en scope de TASK-104

- Cambiar el shape de `result` (sigue siendo lo de Human.js)
- Tocar `trigger-engine.js`, `action-engine.js`, `app.js` bootstrap
- Mover gassho al worker (queda en main thread)
- Web Worker para license-manager o platforms (no es necesario)
- Multi-worker (un worker es suficiente; si hace falta más, otro PR)

---

## Coordinación

- **Claude**: revisar consistencia del wrapper `core/detector.js` con `trigger-engine.js`. Verificar que el cambio no rompe el flow de `result` que ya consume `_evaluatePunctual` y `_checkEventConfirmation`.
- **DeepSeek**: implementación primaria. Tests de concurrencia con Vitest (mocks de Worker).
- **ChatGPT**: si la inicialización del worker tarda visible, agregar loading state UX (~2-5s la primera vez que carga modelos). Coordina con DeepSeek sobre cuándo mostrar/ocultar.

---

## Riesgo principal

OffscreenCanvas en Firefox tiene historia de bugs sutiles (race conditions en transferToImageBitmap con formatos específicos). DeepSeek debe probar explícitamente en Firefox 110+ además de Chrome.

---

Co-authored-by: Claude <noreply@anthropic.com>
