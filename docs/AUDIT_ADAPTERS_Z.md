# Audit estructural — Adapters (Z, 2026-05-14)

## Resumen ejecutivo

- **10 findings**: 1 CRITICAL · 3 HIGH · 4 MEDIUM · 2 LOW
- **Adapter con más riesgo**: Streamlabs (sin reconnect, sin cleanup de listeners, sin timeout en connect)
- **Adapter más maduro**: OBS (backoff exponencial, reconnect con max attempts, isConnecting guard)
- **Problema transversal**: Ningún adapter limpia event listeners del WebSocket al hacer `disconnect()`. Si se reconecta, los listeners se acumulan sobre el nuevo socket sin eliminar los del anterior.
- **Problema más urgente** (Z-ADP-01): Streamlabs y XSplit no tienen reconnect logic. Si la conexión se pierde durante un stream en vivo, el adapter queda silenciosamente desconectado y el streamer no recibe feedback.

## Findings

---

### Z-ADP-01 — Streamlabs y XSplit sin reconnect: conexión perdida = features muertos

- **Severity:** CRITICAL
- **Adapter afectado:** streamlabs, xsplit
- **Archivo + línea:** `adapters/adapter-streamlabs.js:73-76` + `adapters/adapter-xsplit.js:53-56`
- **Descripción:** Cuando el WebSocket de Streamlabs o XSplit se cierra inesperadamente, el `onclose` callback solo emite `'disconnected'` y marca `this.connected = false`. No hay intento de reconexión automática. El streamer no recibe feedback hasta que nota que sus gestos ya no disparan acciones.
- **PoC:**
  1. Conectar Streamlabs adapter
  2. Cerrar Streamlabs Desktop → el WebSocket se cierra
  3. `onclose` → `emit('disconnected')` → `connected = false`
  4. Reabrir Streamlabs Desktop → el adapter NO reconecta automáticamente
  5. El streamer tiene que clicar "Disconnect" + "Connect" manualmente
- **Impacto:** Stream en vivo con gestos rotos. El streamer no sabe que perdió conexión hasta que intenta un gesto y no pasa nada.
- **Fix recomendado:** Implementar reconnect con backoff exponencial similar a `_handleClose()` de OBS. Agregar `maxReconnectAttempts`, `manualDisconnect` flag, y emisión de evento `'reconnecting'`.

---

### Z-ADP-02 — Ningún adapter remueve listeners del WebSocket viejo al desconectar

- **Severity:** HIGH
- **Adapter afectado:** streamlabs, xsplit (ambos usan WebSocket directo)
- **Archivo + línea:** `adapters/adapter-streamlabs.js:53-76` + `adapters/adapter-xsplit.js:40-56`
- **Descripción:** En `connect()`, se asignan `ws.onopen`, `ws.onmessage`, `ws.onerror`, `ws.onclose`. En `disconnect()`, se llama `ws.close()` y se setea `this.ws = null`, pero los listeners del objeto WebSocket permanecen registrados hasta que el garbage collector lo reclame. Si `connect()` se llama de nuevo rápidamente, se crea un nuevo WebSocket con nuevos listeners, pero si el viejo no se destruyó completamente (ej. `close` event se dispara después del `null`), los listeners del viejo pueden ejecutarse en contexto del nuevo adapter state.
- **PoC:**
  1. Conectar adapter Streamlabs
  2. Desconectar inmediatamente
  3. Reconectar rápidamente
  4. Si el `onclose` del viejo WS se dispara DESPUÉS de que `this.ws` ya es el nuevo socket, `this.connected = false` y `emit('disconnected')` se ejecutan incorrectamente
- **Impacto:** Race condition entre close handlers del socket viejo y el nuevo. Puede marcar como desconectado un adapter que acaba de conectar.
- **Fix recomendado:** Antes de crear un nuevo WebSocket en `connect()`, limpiar explícitamente los listeners del anterior:
  ```js
  if (this.ws) {
      this.ws.onopen = null;
      this.ws.onmessage = null;
      this.ws.onerror = null;
      this.ws.onclose = null;
      this.ws.close();
  }
  ```

---

### Z-ADP-03 — Race condition al conectar: doble click = doble socket

- **Severity:** HIGH
- **Adapter afectado:** streamlabs, vmix, xsplit
- **Archivo + línea:** `adapters/adapter-streamlabs.js:43` + `adapters/adapter-xsplit.js:37`
- **Descripción:** Si el usuario clica "Connect" rápidamente 2 veces, `connect()` se ejecuta 2 veces. Solo el adapter OBS tiene `isConnecting` guard que previene doble invocación. Streamlabs, vMix y XSplit no tienen esta protección. El resultado es 2 WebSockets abiertos (o 2 polling loops en vMix), con listeners duplicados y estado inconsistente.
- **PoC:**
  1. Clicar "Connect" 2 veces rápidamente en adapter Streamlabs
  2. Se crean 2 WebSocket connections al puerto 59650
  3. Ambos callbacks `onopen` setean `this.connected = true` y emiten `'connected'`
  4. `this.ws` apunta solo al último socket — el primero se "pierde" pero sigue activo
  5. Mensajes del socket perdido no se procesan, requests se duplican
- **Impacto:** Comportamiento impredecible, requests duplicados a streaming software, memory leak del socket huérfano.
- **Fix recomendado:** Agregar `isConnecting` guard como OBS:
  ```js
  async connect(cfg) {
      if (this.isConnecting || this.connected) return false;
      this.isConnecting = true;
      // ... conectar ...
      this.isConnecting = false;
  }
  ```

---

### Z-ADP-04 — vMix polling con fetch sin timeout: HTTP colgado = app congelada

- **Severity:** HIGH
- **Adapter afectado:** vmix
- **Archivo + línea:** `adapters/adapter-vmix.js:82-90`
- **Descripción:** vMix usa `fetch(this.baseUrl)` cada 1.5s para polling. Si vMix no responde (CPU al 100%, network lag), el `fetch` no tiene timeout y se acumulan múltiples requests pendientes. Cada 1.5s se dispara un nuevo fetch mientras los anteriores no han resuelto. Esto consume memoria progresivamente y eventualmente el browser throttla los requests.
- **PoC:**
  1. Conectar vMix adapter
  2. Poner vMix bajo carga extrema (CPU 100%)
  3. Los fetches a `/api/` tardan >10s cada uno
  4. Cada 1.5s se lanza un nuevo fetch → 6+ fetches pendientes simultáneos
  5. Memory usage crece, UI se vuelve lenta
- **Impacto:** Degradación progresiva de performance. En escenarios extremos, el browser puede crashear por memory exhaustion.
- **Fix recomendado:** Agregar `AbortController` con timeout:
  ```js
  async _fetchState() {
      const controller = new AbortController();
      const timeout = setTimeout(() => controller.abort(), 3000);
      try {
          const res = await fetch(this.baseUrl, { signal: controller.signal });
          // ...
      } finally {
          clearTimeout(timeout);
      }
  }
  ```
  También: cancelar el fetch anterior antes de lanzar uno nuevo.

---

### Z-ADP-05 — Streamlabs y XSplit: connect timeout de 5s no cancela la conexión

- **Severity:** MEDIUM
- **Adapter afectado:** streamlabs, xsplit
- **Archivo + línea:** `adapters/adapter-streamlabs.js:73-76` + `adapters/adapter-xsplit.js:50`
- **Descripción:** Ambos adapters tienen un `setTimeout(() => { if (!this.connected) resolve(false); }, 5000)`. Si el WebSocket no conecta en 5s, la Promise se resuelve con `false`, pero el WebSocket sigue intentando conectarse en el background. Si eventualmente conecta, los handlers `onopen` se ejecutan y setean `this.connected = true`, pero la llamada original ya devolvió `false`. El adapter queda en un estado inconsistente donde `connected = true` pero el caller cree que falló.
- **PoC:**
  1. Conectar Streamlabs con puerto incorrecto
  2. A los 5s, `resolve(false)` → el caller muestra error
  3. El usuario cambia al puerto correcto y conecta de nuevo
  4. Pero si el primer WebSocket finalmente conecta (ej. puerto se abrió), `onopen` se ejecuta y `this.connected = true` con `this.ws` apuntando al socket viejo
  5. Estado inconsistente
- **Impacto:** Estado inconsistente si la conexión se establece después del timeout.
- **Fix recomendado:** Al resolver con `false`, cerrar el WebSocket y nullificar `this.ws`:
  ```js
  setTimeout(() => {
      if (!this.connected) {
          if (this.ws) { this.ws.onopen = null; this.ws.close(); this.ws = null; }
          resolve(false);
      }
  }, 5000);
  ```

---

### Z-ADP-06 — vMix: capabilities declara sourceVisibility/audioControl/recordingControl pero no implementa los métodos

- **Severity:** MEDIUM
- **Adapter afectado:** vmix
- **Archivo + línea:** `adapters/adapter-vmix.js:23-32` vs implementación
- **Descripción:** `capabilities()` declara `sourceVisibility: true`, `audioControl: true`, `recordingControl: true`, `streamingControl: true`. Pero la clase no implementa `setSourceVisibility()`, `setSourceMuted()`, `startRecording()`, `stopRecording()`, etc. Cuando el Action Engine intenta llamar estos métodos, el adapter base los hereda y lanzan `Error: vMix.method() must be implemented by subclass` — que es catcheado por Action Engine como `false`, pero el error se loguea en consola y confunde al usuario.
- **PoC:**
  1. Conectar vMix
  2. Configurar un trigger con acción "Mute/Unmute audio"
  3. Hacer el gesto → Action Engine llama `adapter.setSourceMuted()` → lanza Error
  4. Error se catchea → acción falla silenciosamente con `return false`
- **Impacto:** Features que la UI muestra como disponibles pero que no funcionan. Confusión para el usuario.
- **Fix recomendado:** Implementar los métodos usando la vMix HTTP API, o cambiar `capabilities()` para que refleje la realidad:
  ```js
  capabilities() {
      return {
          sceneSwitch: true,
          studioMode: true,
          previewScene: true,
          transition: true,
          sourceVisibility: false, // TODO: implement via vMix API
          audioControl: false,     // TODO
          recordingControl: false, // TODO
          streamingControl: false  // TODO
      };
  }
  ```

---

### Z-ADP-07 — OBS: reconexión no limpia listeners del OBSWebSocket viejo

- **Severity:** MEDIUM
- **Adapter afectado:** obs
- **Archivo + línea:** `adapters/adapter-obs.js:21-33` + `adapters/adapter-obs.js:162-170`
- **Descripción:** Los handlers de `CurrentProgramSceneChanged`, `StudioModeStateChanged`, `SceneListChanged`, `ConnectionClosed` se registran en el constructor sobre `this.obs`. Cuando `_handleClose` reconecta con `this.obs.connect(...)`, usa el mismo objeto `this.obs` — eso es correcto. Pero si la conexión falla repetidamente y `this.obs` queda en estado inconsistente (obs-websocket-js no siempre limpia su estado interno tras disconnect), los handlers pueden dispararse con datos stale o en contexto incorrecto.
- **Impacto:** Posible comportamiento inesperado después de múltiples ciclos de reconnect.
- **Fix recomendado:** Considerar recrear `this.obs = new OBSWebSocket()` en `_handleClose` antes de reconectar, y re-registrar los handlers. Agregar un test de stress con 5+ ciclos de connect/disconnect.

---

### Z-ADP-08 — Streamlabs: pendingRequests nunca se limpia en disconnect

- **Severity:** MEDIUM
- **Adapter afectado:** streamlabs
- **Archivo + línea:** `adapters/adapter-streamlabs.js:18`
- **Descripción:** `this.pendingRequests` es un Map que acumula callbacks `resolve/reject` para cada request JSON-RPC. Cuando `disconnect()` se llama, no se limpia `pendingRequests`. Las Promises pendientes nunca se resuelven ni rechazan, causando memory leak y potencialmente promesas colgadas.
- **PoC:**
  1. Conectar Streamlabs
  2. Llamar `switchScene()` 10 veces rápidamente
  3. Desconectar inmediatamente
  4. Las 10 Promises quedan en `pendingRequests` sin resolver
  5. Los `setTimeout` de 5s las rechazan eventualmente, pero si el request se completó antes del disconnect, el `resolve` queda en el Map
- **Impacto:** Memory leak de callbacks. Si el adapter se reconecta, los IDs se reinician pero el Map tiene entries viejos.
- **Fix recomendado:** En `disconnect()`, rechazar todas las pending requests:
  ```js
  disconnect() {
      // Rechazar todas las pending requests
      for (const [id, { reject }] of this.pendingRequests) {
          reject(new Error('Adapter disconnected'));
      }
      this.pendingRequests.clear();
      // ... resto de cleanup
  }
  ```

---

### Z-ADP-09 — Password de OBS almacenado en localStorage en plain text

- **Severity:** LOW
- **Adapter afectado:** obs (y el storage en app.js)
- **Archivo + línea:** `app.js:254` (`config.set('adapter.obs.password', password)`)
- **Descripción:** Si el usuario tiene "Remember OBS password" activado, la contraseña de OBS WebSocket se almacena en localStorage en texto plano. Cualquier script del mismo origen (XSS) o extension maliciosa puede leerla. La contraseña de OBS WebSocket da control total sobre el streaming software.
- **Impacto:** Robo de credenciales de OBS. Un atacante con acceso al localStorage puede controlar OBS remotamente.
- **Fix recomendado:**
  1. Cifrar la password con una key derivada del device fingerprint antes de guardarla.
  2. O mejor: no almacenar la password. Usar `sessionStorage` (se pierde al cerrar browser) o pedir la password cada vez.
  3. El warning "careful on shared computers!" ya existe, pero no protege contra XSS.

---

### Z-ADP-10 — vMix: active scene se detecta por índice 1-based sin validación

- **Severity:** LOW
- **Adapter afectado:** vmix
- **Archivo + línea:** `adapters/adapter-vmix.js:93-97`
- **Descripción:** La escena activa se detecta parseando `xml.querySelector('active')?.textContent` como entero 1-based y usándolo como índice en el array `inputs`. Si el valor es `0`, `NaN`, o mayor que la longitud del array, `inputs[activeIdx - 1]` será `undefined` y no se detecta la escena activa. La condición `if (activeInput)` lo maneja graciosamente, pero silenciosamente.
- **Impacto:** En vMix con configuraciones no estándar, la escena activa no se detecta correctamente. Los gestos de "volver al centro" (que usan la escena activa) pueden no funcionar.
- **Fix recomendado:** Validar `activeIdx` antes de usarlo:
  ```js
  const activeIdx = parseInt(xml.querySelector('active')?.textContent || '1', 10);
  const activeInput = (activeIdx >= 1 && activeIdx <= inputs.length) ? inputs[activeIdx - 1] : null;
  ```

---

## Lo que NO encontré (verificado y descartado)

1. **OBS backoff exponencial** — Implementado correctamente en `_handleClose()`: `Math.min(3000 * attempt, 15000)` con `maxReconnectAttempts = 5` y `manualDisconnect` flag. ✅
2. **OBS isConnecting guard** — Prevención de doble connect implementada. ✅
3. **OBS scene list deduplication** — `_syncSceneList` usa hash para solo emitir `scene_list_changed` cuando la lista realmente cambió. ✅
4. **Action Engine catch de errores** — `executeSingle()` tiene try/catch que devuelve `false` si el adapter lanza. No crashea la app. ✅
5. **Adapter base event system** — `on()/off()/emit()` funciona correctamente, con try/catch en cada handler. ✅
6. **vMix polling stop on disconnect** — `_stopPolling()` se llama en `disconnect()` y limpia el `setInterval`. ✅
7. **XSplit timeout en requests** — `_call()` tiene timeout de 5s con `setTimeout` + reject. ✅
8. **Streamlabs JSON-RPC ID tracking** — `pendingRequests` Map con `requestId` incremental y cleanup en `_handleMessage`. ✅
9. **CSP compliance** — Ningún adapter carga scripts externos. Las URLs de WebSocket son locales (`127.0.0.1`). ✅
10. **OBS Studio Mode** — Correctamente implementado con `setPreviewScene` + `triggerTransition` + `isStudioMode` state tracking. ✅

---

*Auditoría realizada por Z (GLM-4) el 2026-05-14. Código revisado: `adapters/adapter-base.js` (107 líneas), `adapters/adapter-obs.js` (264 líneas), `adapters/adapter-streamlabs.js` (139 líneas), `adapters/adapter-vmix.js` (172 líneas), `adapters/adapter-xsplit.js` (154 líneas). Total: ~836 líneas auditadas manualmente.*
