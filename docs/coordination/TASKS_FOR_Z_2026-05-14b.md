# Tarea para Z (GLM-4) — Z-203

## Estado al 2026-05-14 17:30

Tu entrega Z-202 (test suite del Calibration Wizard, 26 cases) mergeó limpia en main vía PR #24. **Excelente trabajo de cobertura.**

También Z-SEC-06 que detectaste en Z-201 era REAL y rompía producción para todos los usuarios pagantes — Joel ya lo mergeó en PR #23 (hotfix con `startBackgroundRevalidation()`).

Ahora hay otro módulo crítico sin tests: `core/action-engine.js` (16 tipos de acción).

---

## Z-203 — Test suite para `core/action-engine.js`

### Por qué importa

`action-engine.js` ejecuta TODOS los disparos del sistema (cambiar escena OBS, reproducir sonido, enviar mensaje a chat Twitch, vibrar, TTS, etc.). 16 tipos de acción + secuencias + acciones aleatorias + retrasos. **Cero tests hoy.** Si una acción rompe silenciosamente, el streamer no sabe que su trigger no funciona hasta que sale en vivo.

### Entregable (1 archivo)

`tests/action-engine.test.js` — mínimo **16 casos** vitest + jsdom, uno por cada tipo de acción + extras para edge cases.

### Tipos de acción a cubrir

Listados en `core/action-engine.js`. Inventario (verifica contra el código, puede haber cambios menores):

1. `scene_switch` — cambiar escena en el adapter activo
2. `source_visibility` — toggle visibility de una fuente
3. `source_filter_toggle` — toggle filtro de fuente
4. `audio_mute` — mute/unmute fuente audio
5. `source_transform` — mover/escalar/rotar
6. `source_crop` — recortar fuente
7. `recording_start` — iniciar grabación
8. `recording_stop` — detener grabación
9. `play_sound` — reproducir archivo audio
10. `speak_tts` — text-to-speech
11. `notification` — notificación browser
12. `flash_screen` — flash visual
13. `vibrate` — navigator.vibrate()
14. `chat_message` — enviar a chat de plataforma
15. `create_clip` — crear clip Twitch/Kick
16. `sequence` — ejecutar lista de acciones en orden
17. `random_choice` — ejecutar 1 de N aleatoria
18. `delay_then` — esperar X ms + ejecutar acción

### Patrón de mocks

```js
function createMockAdapter() {
  return {
    isConnected: vi.fn(() => true),
    setScene: vi.fn(async () => true),
    setSourceVisibility: vi.fn(async () => true),
    toggleFilter: vi.fn(async () => true),
    setMute: vi.fn(async () => true),
    transformSource: vi.fn(async () => true),
    cropSource: vi.fn(async () => true),
    startRecording: vi.fn(async () => true),
    stopRecording: vi.fn(async () => true),
    sendChat: vi.fn(async () => true),
    createClip: vi.fn(async () => true),
  };
}

function createMockPlatforms() {
  return {
    twitch: { sendChat: vi.fn(), createClip: vi.fn() },
    youtube: { sendChat: vi.fn() },
  };
}
```

Para acciones con efectos browser (notification, vibrate, speak_tts, flash_screen, play_sound):
- `globalThis.Notification` → mock con permission='granted' + constructor stub
- `navigator.vibrate` → mock function
- `window.speechSynthesis.speak` → mock
- `new Audio()` → mock con play() stub

### Casos críticos a cubrir además de los 16+ básicos

- **Action falla silenciosa**: si `adapter.setScene` rechaza, ¿el engine loguea o swallow? Verifica que NO crashee la app.
- **Adapter desconectado**: `isConnected() === false` → la acción no se intenta + reporta error.
- **Sequence con fallo en el medio**: ¿continúa o aborta? Documenta comportamiento esperado.
- **Random choice con array vacío**: no debe crashear.
- **Delay con timeout > 5s**: usa `vi.useFakeTimers()` para no esperar real.

### Helper compartido

Usa el helper existente `tests/helpers/load-window-script.js` (mismo patrón que tu Z-202).

### Validación

```bash
npm test -- tests/action-engine.test.js
```

16+ casos pasan. CI verde.

### Anti-patterns prohibidos

1. NO modificar `core/action-engine.js`. Si encuentras bug, escribe `it.fails(...)` con TODO + repórtalo en el PR description.
2. NO usar `setTimeout` real — `vi.useFakeTimers()` para delays.
3. NO acoples a internals privados (`_runSingle`, etc.). Test solo API pública: `engine.run(actionDef)`.
4. NO mock de fetch global — los tests cubren engine, no platforms HTTP layer (eso es separado).

### Branch + PR

- Branch: `tests/action-engine-z`
- Título PR: `test(action-engine): Z test suite — 16+ cases covering all action types`

### Plazo estimado: 2 sesiones

Misma complejidad que Z-202 (26 casos), quizás un poco más por las dependencias browser (Notification, Audio, vibrate).

### Anti-cleanup importante

NO incluyas en este PR fixes a Z-SEC-04/05/08/11/12 que están pendientes — esos van en otro PR de DeepSeek (DS-304/305). Mantén el scope a tests.
