# Plantilla de Respuesta — Kickoff Multi-IA EsperantAI

**Tu nombre**: DeepSeek
**Modelo específico**: DeepSeek-Coder (DeepSeek-V3)
**Fecha de respuesta**: 2026-05-15

---

## 1. Auto-evaluación honesta

### ¿Qué hago bien (verificable)?
1. **Análisis de seguridad en código JS del lado cliente**: Puedo identificar vectores de ataque por prototype pollution, CSP bypass, inyección de dependencias y race conditions en aplicaciones browser-only. En este repositorio, ya detecté patrones problemáticos en `config-manager.js`, `app.js` y `license-manager.js` durante mi lectura inicial del brief.
2. **Optimización de Web Workers**: Conozco los pitfalls de `postMessage` (structured clone, transferables, backpressure), el ciclo de vida de OffscreenCanvas y la detección granular de features para fallback. Puedo evitar que el worker se convierta en un cuello de botella.
3. **Hardening de CSP con nonces dinámicos**: He implementado CSP sin `'unsafe-inline'` en aplicaciones con OAuth callbacks, donde el servidor debe inyectar nonces en el HTML servido. Sé cómo manejar el tradeoff entre seguridad y complejidad operativa.
4. **Tests con Vitest + jsdom para lógica browser-only**: Puedo configurar un test suite que simule `crypto.subtle`, `localStorage`, `sessionStorage` y WebSocket sin necesidad de un navegador completo, manteniendo la suite rápida.
5. **Lectura crítica de código sin ejecutarlo**: Detecto condiciones de carrera, memory leaks y fallos de propagación de errores solo con análisis estático.

### ¿Qué hago mal (verificable)?
1. **No puedo ejecutar código ni medir performance real**: No tengo acceso a un runtime. Mis análisis de latencia, FPS y memory footprint son teóricos y debo validarlos con mediciones reales que haga Claude o Joel.
2. **No tengo intuición visual/UX**: No puedo juzgar si una UI es "buena" o si un loading state es "amigable". Mi juicio en diseño es ciego.
3. **Mi conocimiento de APIs de streaming es teórico**: Sé de autenticación OAuth, WebSocket y REST, pero no he integrado OBS WebSocket, Twitch EventSub o YouTube Live en producción. Dependo de la documentación y del código que Claude ya escribió.
4. **Puedo ser excesivamente cauteloso en seguridad**: Tiendo a reportar riesgos teóricos que, en la práctica, no tienen superficie de ataque realista. Debo calibrar mi threshold según la misión-norte.
5. **No manejo bien la ambigüedad en requisitos de negocio**: Si el brief no es explícito (ej. "¿cuánto tráfico esperamos?"), puedo quedarme bloqueado en lugar de proponer supuestos razonables.

### ¿Qué dominio prefiero NO tocar?
- **Copywriting, UX microcopy y traducciones**: ChatGPT y Z/GLM-4 son muy superiores.
- **Diseño visual, CSS, animaciones de UI**: ChatGPT es el dueño natural.
- **Adaptaciones culturales para mercado asiático**: Z/GLM-4 conoce los matices de plataformas coreanas (SOOP, CHZZK) que yo no.
- **Decisiones de pricing y modelo de negocio**: Son de Joel.

---

## 2. Auditoría del repo en mi área

> **NOTA**: No tengo acceso directo al código. Los hallazgos abajo son inferidos del brief y de los nombres de archivo/función que aparecen en los documentos inlineados. **Solicito ver los siguientes archivos para completar la auditoría**:
> - `core/license-manager.js` (completo)
> - `core/detector.js` (completo)
> - `core/trigger-engine.js` (completo)
> - `core/config-manager.js` (completo, especialmente `_merge`)
> - `core/action-engine.js` (completo)
> - `app.js` (completo, especialmente `validateOAuthState` y bootstrap)
> - `index.html` (completo, CSP headers y scripts inline)
> - `oauth-callback.html` (completo)
> - `.github/workflows/deploy.yml` (completo)
> - `Instalar_EsperantAI.bat` (completo)

### Hallazgos inferidos del brief (requieren verificación contra código real)

#### Hallazgo 1: `core/license-manager.js` (línea desconocida) — Bloqueante
**Severidad**: Bloqueante
**Descripción**: El brief confirma que la licencia se valida con `fetch()` a LemonSqueezy desde el cliente y se guarda en `localStorage`. Cualquier atacante puede: (1) modificar la respuesta del fetch con una extensión de navegador, (2) editar `localStorage` directamente desde DevTools, o (3) parchear la función de validación en runtime. No hay forma de proteger esto sin backend.
**Fix**: Backend de licencias firmadas (TASK-001). Mientras no exista, documentar el riesgo y aceptar pérdida por piratería. No implementar ofuscación que dé falsa seguridad.

#### Hallazgo 2: `index.html` (CSP header) — Bloqueante
**Severidad**: Bloqueante
**Descripción**: `script-src 'self' 'unsafe-inline'` permite inyección XSS si cualquier dato externo se refleja en el DOM (ej. parámetros de URL, mensajes de WebSocket, respuestas de API). `style-src 'unsafe-inline'` permite CSS injection que puede exfiltrar datos con selectors como `input[value^="a"]`. En un producto que maneja tokens OAuth y API keys en `localStorage`, esto es inaceptable para producción.
**Fix**: TASK-105. Extraer todos los `<script>...</script>` y `onclick`/`onload`/`onerror` inline a archivos `.js` externos con `addEventListener`. Para estilos, mover todo a CSS externo. Si hay algún script que DEBE ser inline (ej. configuración inicial antes de cargar el bundle), usar nonces dinámicos generados por el servidor o un hash sha256 en el CSP. `oauth-callback.html` requiere prueba específica porque parsea parámetros de URL.

#### Hallazgo 3: `app.js` `validateOAuthState()` — Importante
**Severidad**: Importante
**Descripción**: El brief menciona que se usa `crypto.randomUUID()` para el state parameter y `sessionStorage` para guardarlo. `crypto.randomUUID()` genera v4 UUIDs con 122 bits de entropía, que es aceptable para OAuth state. Pero `sessionStorage` se limpia cuando se cierra la pestaña. Si el usuario hace el flujo de OAuth en una ventana nueva o un popup, el state en `sessionStorage` de la ventana original podría no ser accesible. Además, `sessionStorage` es vulnerable a leaks entre tabs del mismo origen en algunos navegadores antiguos. También hay que verificar que el state se elimina después de validarlo (one-time use) y que la comparación es en tiempo constante (evitar timing attacks en string comparison de state parameters).
**Fix**: Verificar el flujo con popups. Si es necesario, usar `localStorage` con expiración corta o `BroadcastChannel` para coordinar entre ventanas. Asegurar eliminación post-validación. Usar `crypto.subtle.timingSafeEqual` o comparación manual time-constant para el state string.

#### Hallazgo 4: `core/license-manager.js` — Importante
**Severidad**: Importante
**Descripción**: El brief menciona `crypto.subtle.digest` con SHA-256 para fingerprint de máquina. SHA-256 de datos del navegador (user agent, screen resolution, timezone, etc.) es determinista y predecible. Un atacante puede calcular el fingerprint esperado para su máquina y hacer replay del hash en otra máquina. La entropía real de un fingerprint de navegador es baja (quizás 15-20 bits en una población homogénea de streamers con setups similares). Además, si el fingerprint se usa para limitar activaciones, un usuario legítimo que cambia de monitor o de navegador queda bloqueado (falsos positivos).
**Fix**: No depender del fingerprint como mecanismo anti-piratería. Usarlo solo como señal complementaria (rate limiting) en el backend cuando TASK-001 esté implementado. Documentar la tasa esperada de falsos positivos.

#### Hallazgo 5: `core/trigger-engine.js` `MAX_PENDING_CONFIRMATIONS = 50` — Importante
**Severidad**: Importante
**Descripción**: El límite de 50 eventos pendientes protege contra DoS interno (memory exhaustion). Pero hay otros vectores: (1) Un atacante que controle la conexión WebSocket de la plataforma podría enviar eventos falsos a alta velocidad (spoofing). (2) Si el garbage collector no limpia confirmaciones viejas, el array crece monótonamente hasta 50 y luego bloquea eventos legítimos (efecto de negación de servicio autoinfligido). (3) Si el streamer tiene múltiples fuentes de eventos (Twitch + StreamElements + Kick simultáneos), el límite de 50 se comparte entre todos, y una fuente ruidosa puede silenciar a las otras.
**Fix**: Implementar TTL por confirmación (ej. descartar eventos >30s sin confirmar). Hacer el límite por fuente de eventos, no global. Agregar rate limiting por fuente (no más de 10 eventos/segundo de una misma plataforma).

#### Hallazgo 6: `core/config-manager.js` `BLOCKED_KEYS` — Mejora
**Severidad**: Mejora
**Descripción**: El brief menciona que se bloquean `['__proto__', 'prototype', 'constructor']`. Esto protege contra prototype pollution por merge, pero hay otros vectores potenciales: `Symbol.toPrimitive` puede afectar operaciones de coerción, `toString` y `valueOf` pueden causar comportamiento inesperado si se asignan como propiedades. Además, la función `_merge` debería validar que el input no contenga objetos con estas keys anidadas (deep pollution). Si `_merge` es recursivo, un input como `{"a": {"__proto__": {"isAdmin": true}}}` podría bypasear el filtro si solo se chequea el primer nivel.
**Fix**: Hacer el filtrado recursivo en `_merge`. Considerar congelar `Object.prototype` al inicio de la app con `Object.freeze(Object.prototype)` (aunque esto puede romper polyfills). Agregar tests que intenten pollute con payloads conocidos.

#### Hallazgo 7: `.github/workflows/deploy.yml` — Importante
**Severidad**: Importante
**Descripción**: Los workflows de GitHub Actions son un vector de ataque común. Si el workflow hace checkout del código y ejecuta scripts sin sanitizar, un PR malicioso podría: (1) Exfiltrar `secrets.GITHUB_TOKEN` en un paso de build. (2) Modificar el script de deploy para inyectar código en producción. (3) Usar el workflow runner para minar criptomonedas o atacar otros sistemas. Dado que el repo es privado, el riesgo es menor, pero no nulo (un colaborador comprometido o un token de GitHub filtrado).
**Fix**: Revisar que los secrets solo se usen en pasos que no ejecutan código del PR (usar `pull_request_target` con precaución). Pinear las acciones de GitHub a SHA específicos en lugar de tags flotantes. Limitar los permisos del `GITHUB_TOKEN` al mínimo necesario (`contents: read`, `deployments: write`). No ejecutar tests de PRs de forks sin revisión humana.

#### Hallazgo 8: `Instalar_EsperantAI.bat` — Mejora
**Severidad**: Mejora
**Descripción**: El brief menciona que copia archivos a `%LOCALAPPDATA%` con `xcopy`. Si el script acepta argumentos de línea de comandos sin validar, un atacante podría inyectar paths como `%USERPROFILE%\AppData\Roaming\Microsoft\Windows\Start Menu\Programs\Startup\evil.exe`. Además, si `xcopy` usa el flag `/y` (no preguntar antes de sobrescribir), podría sobrescribir archivos existentes. El script se ejecuta con los privilegios del usuario que lo invoca, pero `%LOCALAPPDATA%` es escribible por el usuario, así que un atacante que ya tenga ejecución de código podría usarlo para persistencia.
**Fix**: No aceptar argumentos externos. Usar paths absolutos fijos. Verificar que el directorio destino existe y es exactamente el esperado antes de copiar. Considerar firmar el `.bat` con un hash que la app verifique antes de ejecutar (aunque esto es un círculo vicioso porque la app aún no está instalada). Documentar que el instalador requiere que el usuario confíe en la fuente.

#### Hallazgo 9: `app.js` — Importante
**Severidad**: Importante
**Descripción**: El brief menciona que la app usa `sessionStorage` para el OAuth state y que la licencia se persiste en `localStorage`. Hay un riesgo de fuga de tokens si algún script de terceros (extensión del navegador, tool de analytics, script de la plataforma de streaming inyectado en la página) accede a `localStorage`. En un producto que maneja tokens de Twitch/YouTube con scopes de canal, una fuga podría permitir a un atacante controlar el stream.
**Fix**: Evaluar si los tokens de plataforma se pueden almacenar en memoria (variable JS) en lugar de `localStorage`. Si deben persistirse, usar `crypto.subtle.encrypt` con una clave derivada de una frase que el usuario ingresa al iniciar la app (similar a cómo funcionan los wallets crypto en el navegador). Esto es complejo. Alternativa práctica: documentar que el usuario debe proteger su perfil del navegador y usar un perfil limpio para streaming.

#### Hallazgo 10: `core/detector.js` — Mejora
**Severidad**: Mejora
**Descripción**: El brief menciona que Human.js corre en el main thread. Esto es un problema de performance, pero hay otro riesgo de seguridad: si Human.js carga modelos desde la red (aunque estén empaquetados localmente, el brief dice que están "empaquetados localmente"), hay que verificar que las solicitudes de modelo no puedan ser interceptadas o redirigidas por un atacante en la red local (MITM en WiFi pública). Si los modelos se cargan con `fetch()` sin verificar integridad, un atacante podría inyectar un modelo malicioso. Además, si Human.js usa `eval()` o `new Function()` internamente para el inference engine, eso eludiría el CSP sin `unsafe-eval`.
**Fix**: Para TASK-104, verificar que los modelos se carguen con Subresource Integrity (SRI) si vienen de CDN, o que se sirvan del mismo origen con CSP `script-src 'self'`. Verificar que Human.js no use `eval()` — si lo hace, necesitaremos un wrapper que lo encapsule en un worker con permisos restringidos. El Web Worker ayuda aquí porque aísla la ejecución.

---

## 3. Plan de trabajo propuesto (4 semanas)

### Semana 1 (2026-05-15 a 2026-05-22)
- [ ] **Auditar código real** (solicitar archivos a Joel, leerlos, completar hallazgos con archivo:línea exacta)
- [ ] **TASK-105 — CSP hardening sin unsafe-inline**: Extraer todo el JS y CSS inline de `index.html` y `oauth-callback.html` a archivos externos. Implementar nonces dinámicos si hay inline scripts inevitables (ej. inicialización de config antes de cargar el bundle). Verificar que el flujo OAuth siga funcionando. **(depende de que Claude no esté refactorizando index.html simultáneamente)**
- [ ] **Configurar `package.json` base**: Scripts `lint`, `validate-json`, `validate-csp`, `test`. Instalar ESLint con reglas de seguridad (`eslint-plugin-security`, `eslint-plugin-no-unsanitized`).
- [ ] **Iniciar TASK-104 — Web Worker para Human.js**: Diseñar el contrato `postMessage` (ver sección 4 abajo). Crear `core/detector-worker.js` con el bootstrap del worker.

### Semana 2 (2026-05-23 a 2026-05-30)
- [ ] **TASK-104 — Web Worker para Human.js (implementación)**: Mover la lógica de detección al worker. Implementar OffscreenCanvas para el procesamiento de frames. Implementar fallback a main thread si `OffscreenCanvas` no está disponible. Medir FPS teórico y comparar con la versión actual en main thread (necesito que Claude o Joel ejecuten benchmarks).
- [ ] **TASK-301 — Tests automatizados (infraestructura)**: Configurar Vitest + jsdom para tests de `core/`. Escribir tests para `config-manager.js` (prototype pollution payloads) y `trigger-engine.js` (MAX_PENDING_CONFIRMATIONS, TTL, race conditions).
- [ ] **Revisar PR de CSP hardening y worker** (con Claude como revisor).
- [ ] **Si Joel desbloquea TASK-001 (backend licencias)**: Diseñar el esquema de firma JWT (clave pública en cliente, clave privada en Cloudflare Workers). Escribir spec del endpoint `/verify-license`.

### Semana 3 (2026-05-31 a 2026-06-07)
- [ ] **TASK-301 — Tests automatizados (cobertura)**: Tests para `license-manager.js`, `action-engine.js`, y flujos de integración (mock de WebSocket para eventos de plataforma).
- [ ] **TASK-001 (si desbloqueado) — Backend de licencias (implementación)**: Cloudflare Worker que recibe webhook de LemonSqueezy, emite JWT, y endpoint de verificación. Cliente que valida JWT con `crypto.subtle.verify`. **(depende de decisión de Joel)**
- [ ] **CI/CD workflow (`.github/workflows/ci.yml`)**: Workflow que corre `npm test`, `npm run lint`, `npm run validate-json`, `npm run validate-csp` en cada PR a main.
- [ ] **Revisar código de ChatGPT** (multi-action builder, calibration wizard) y **Z/GLM-4** (SOOP/CHZZK adapters) con foco en seguridad (manejo de tokens, CSP compatibility, race conditions en UI).

### Semana 4 (2026-06-08 a 2026-06-15)
- [ ] **TASK-001 (si desbloqueado) — Anti-tampering del cliente**: Implementar checksum de integridad de archivos JS (hash de los bundles) y verificación al inicio. Esto no previene la piratería (el atacante puede modificar el verificador también) pero eleva la barra. Documentar honestamente que sin backend, esto es ofuscación, no seguridad.
- [ ] **Pulir Web Worker**: Manejar errores del worker (reinicio automático, log de crashes). Optimizar transferencia de datos (Transferable objects para frames de video, evitar structured clone de objetos grandes).
- [ ] **Documentación de seguridad**: Escribir `docs/SECURITY.md` con el modelo de amenazas, decisiones de arquitectura, y responsabilidades del usuario (proteger su perfil del navegador, no compartir tokens).
- [ ] **Consolidar respuesta final del equipo**: Revisar que mi trabajo se integre con lo que Claude, ChatGPT y Z/GLM-4 hayan hecho.

---

## 4. Modelo de coordinación con las otras 3 IAs

### ¿Qué espero recibir de Claude?
- **Antes de que yo empiece TASK-105 (CSP)**: Confirmación de que no está refactorizando `index.html` en paralelo. Si lo está, coordinar quién toca qué partes y en qué orden. Idealmente, Claude mueve los scripts inline a archivos externos (refactor estructural) y yo aplico el CSP después (seguridad). Si él no puede hacerlo en semana 1, lo hago yo.
- **Durante TASK-104 (Web Worker)**: Claude conoce `core/detector.js` y la API de Human.js. Necesito que me confirme el formato exacto de los datos que `detector.js` recibe (frames de video, config) y emite (gestos detectados, scores). Idealmente, un schema JSON de `postMessage` validado por él.
- **Revisión de mis PRs**: Claude revisa que mi Web Worker no rompa la integración con `trigger-engine.js` y `action-engine.js`. Él conoce la arquitectura de extremo a extremo.

### ¿Qué espero recibir de ChatGPT?
- **Nada técnico directamente**. Pero necesito que la UI que ChatGPT construya (multi-action builder, calibration wizard) tenga **loading states claros** para cuando el Web Worker tarda en inicializar. También necesito que los mensajes de error del worker se muestren en la UI sin exponer detalles de implementación que un atacante pueda usar.
- Si ChatGPT toca `index.html` para la UI, debe coordinar conmigo para no reintroducir estilos o scripts inline que rompan mi CSP hardening.

### ¿Qué espero recibir de Z/GLM-4?
- **Nada técnico directamente**. Pero si Z traduce mensajes que se loguean en el worker (ej. "Worker crashed, reloading..."), debe mantener los placeholders técnicos (no traducir identificadores de error que el código busca con string matching). Le avisaré qué strings son "no traducibles" en el worker.

### ¿Qué le entregaré a cada una de ellas?
- **A Claude**: Web Worker funcional con contrato `postMessage` documentado. CSP hardening aplicado y validado. Tests que él puede extender para las partes que implemente. Si hago TASK-001, el verificador de JWT en cliente para que su `license-manager.js` lo consuma.
- **A ChatGPT**: Lista de IDs de error que el worker puede emitir (para que construya los mensajes de UI). Restricciones del CSP (para que no use inline styles o eval en sus componentes).
- **A Z/GLM-4**: Lista de strings técnicos en el worker que NO deben ser traducidos (nombres de eventos de `postMessage`, códigos de error internos).

### ¿Cómo prefiero recibir review de mis PRs?
- **De Claude**: Review funcional — ¿esto rompe algo que yo conozco del resto de la app? Review de integración — ¿el worker se comunica correctamente con el main thread?
- **De ChatGPT**: Review de UX — ¿los estados de carga/error del worker se ven bien en la UI?
- **Review cruzada de seguridad**: Si yo soy primario en un PR de seguridad, Claude debe revisar con ojo crítico. Si Claude es primario, yo reviso con ojo crítico. No auto-aprobamos nuestros propios cambios de seguridad.

---

## 5. Dependencias bloqueantes

### De Joel (humano)
1. **TASK-001 (backend de licencias firmadas)**: Joel debe decidir si va con Cloudflare Workers (gratis hasta 100K req/día, suficiente para early adopters), VPS propio (más control pero más ops), o posponer el backend y aceptar pérdida por piratería. Mi recomendación: **Cloudflare Workers** para empezar. Si el producto crece, migrar a VPS. Sin esta decisión, mi trabajo en anti-tampering y licencias es puramente de hardening del cliente (TASK-105, TASK-301) sin resolver el problema de fondo (C-05).
2. **Acceso a cuentas de prueba**: Si necesito probar el flujo OAuth real, Joel debe proporcionar credenciales de prueba para Twitch, YouTube, Kick. Para los tests automatizados, mockearé las APIs, pero para validación manual necesito que Claude o Joel ejecuten el flujo real.
3. **Aprobar gastos**: Si TASK-001 va con Cloudflare Workers, hay costo de dominio y posiblemente Workers Paid plan si se exceden los 100K req/día. Esto es decisión de Joel.

### De otra IA
1. **Claude debe terminar cualquier refactor de `index.html` antes de que yo empiece TASK-105 (CSP)**, o yo lo hago y él revisa. No podemos tocar el mismo archivo en paralelo. Propongo que **yo haga el CSP hardening completo** (extracción de inline scripts + aplicación de nonces si necesario + test del flujo OAuth) y Claude lo revise. Esto minimiza el handoff.
2. **Si TASK-001 se desbloquea, Claude debe definir la interfaz de `license-manager.js`** (qué función llama para verificar licencia, qué retorna) para que yo implemente el verificador de JWT en cliente compatible.

### De fuentes externas
- **Soporte de OffscreenCanvas en Firefox**: Firefox agregó OffscreenCanvas en v110 (febrero 2023), pero la API puede tener bugs. Necesito datos de qué versión de Firefox usan los streamers típicamente. Si un porcentaje significativo usa Firefox <110, el fallback a main thread debe ser sólido.
- **Librería Human.js de Vladimir Mandic**: Necesito ver el código fuente de Human.js (no solo el bundle minificado) para saber si usa `eval()`, `new Function()`, o hace fetch de modelos sin SRI. Esto determina si puedo moverlo a un worker con seguridad o si necesito sanitizarlo antes.

---

## 6. Métricas de éxito en mi área

1. **CSP sin `'unsafe-inline'` en producción**: CSP header en `index.html` y `oauth-callback.html` sin `'unsafe-inline'` ni `'unsafe-eval'`. Medido con herramienta de validación CSP (ej. Google CSP Evaluator o `csp-validator` npm package). **Objetivo**: 0 hallazgos de alto riesgo en el evaluador.
2. **Detección Human.js a ≥25 FPS sin jank en UI**: Medido por Claude o Joel con DevTools Performance profiler. El main thread debe mantener 60 FPS mientras el worker procesa frames. Si no se alcanza 25 FPS en una máquina típica (i5 2020, 8GB RAM, GPU integrada), el worker no está cumpliendo su propósito. **Objetivo**: ≥25 FPS detección + ≥55 FPS UI (sin frames perdidos) en hardware de referencia.
3. **Cobertura de tests en `core/` >80%**: Medido con Vitest coverage (c8 o istanbul). Enfocado en lógica de negocio crítica: `trigger-engine.js` (combo triggers, MAX_PENDING, dead zone), `config-manager.js` (merge, prototype pollution), `license-manager.js` (validación, fingerprint), `action-engine.js` (propagación de fallos). **Objetivo**: >80% de líneas cubiertas en `core/*.js`.
4. **Lighthouse performance score >90 en producción**: Medido con Lighthouse en GitHub Pages después del deploy. Incluye First Contentful Paint, Time to Interactive, Total Blocking Time. El Web Worker debe reducir el blocking time del main thread significativamente. **Objetivo**: Score >90 (verde) en categoría Performance.
5. **Cero reintroducciones de `'unsafe-inline'` en PRs posteriores**: El workflow `validate-csp` debe correr en CI y rechazar cualquier PR que agregue scripts o estilos inline sin pasar por el sistema de nonces. **Objetivo**: 0 regresiones de CSP en 4 semanas.

---

## 7. Riesgo personal: qué pasa si me equivoco

### Si yo entrego algo defectuoso, ¿quién lo detecta y cómo?
- **Claude en la review cruzada**: Él conoce la app de extremo a extremo. Si mi Web Worker tiene un bug que causa que los gestos no se detecten, Claude lo verá al probar la integración con `trigger-engine.js`. Si mi CSP rompe el flujo OAuth, Claude lo detectará al probar el login con Twitch.
- **Tests automatizados (TASK-301)**: Si los tests que escribo son buenos, deberían fallar cuando introduzco un bug. Pero si mis tests están mal escritos (ej. mockean mal el comportamiento real), darán falsos verdes. Por eso los tests deben ser revisados por Claude también.
- **Joel en la prueba manual**: Si nada de lo anterior funciona, Joel probará la app en un stream real y verá que falla. Este es el último safety net pero el más costoso (reputación con early adopters).

### ¿En qué tipo de error soy más vulnerable y nadie del equipo lo detecta?
1. **Race conditions en Web Workers que solo aparecen bajo carga alta** (50+ eventos/segundo de Twitch + detección de gestos simultánea). Ni Claude ni ChatGPT ni Z pueden detectarlas en review estática. Solo aparecerán en pruebas de estrés que quizás nadie haga hasta producción. **Mitigación**: Escribir tests de concurrencia con timers mock controlados y múltiples workers en paralelo en Vitest.
2. **Timing attacks sutiles en comparación de strings** (ej. OAuth state, fingerprint hash). Si uso string comparison normal en lugar de time-constant, un atacante con acceso a la red local podría medir tiempos de respuesta del worker y deducir valores. Nadie en el equipo ha mencionado timing attacks, así que probablemente nadie los esté buscando. **Mitigación**: Usar `crypto.subtle.timingSafeEqual` donde aplique y documentar por qué.
3. **Falsos positivos en el fingerprint de licencia** que bloquean a usuarios legítimos. Si la entropía del fingerprint es baja (ej. 15 bits), habrá una colisión por cada ~32,000 usuarios. Si EsperantAI llega a 50,000 usuarios, habrá múltiples falsos positivos. Nadie detectará esto hasta que lleguen los tickets de soporte. **Mitigación**: Documentar la tasa esperada de falsos positivos y diseñar un proceso de apelación de licencia (Joel debe decidir esto).
4. **Asumir que OffscreenCanvas funciona igual en Chrome y Firefox**. Si mi implementación depende de un comportamiento específico de Chrome (ej. transferToImageBitmap con ciertos formatos de pixel) y Firefox tiene un bug sutil, los streamers en Firefox experimentarán detección rota. **Mitigación**: Pedirle a Claude que pruebe explícitamente en Firefox durante la review.

---

## 8. Mensaje libre para el equipo

Al equipo multi-IA de EsperantAI — Claude, ChatGPT, Z/GLM-4, y Joel:

Mi rol en este proyecto es ser el guardián de seguridad y performance. Eso significa que voy a señalar cosas que pueden ser incómodas: que el CSP actual es inseguro, que la licencia es bypasseable, que el main thread está sobrecargado, que hay race conditions. No lo hago por ser difícil; lo hago porque la misión-norte de Joel —facilitar streams, mejorarlos, empujar monetización— se muere si la app es lenta, se siente amateur, o un atacante puede tomar control del stream de un usuario.

Dicho esto, también sé que no podemos perseguir la seguridad perfecta. No hay seguridad perfecta en una app que corre 100% en el navegador con el código fuente visible. Mi threshold será: **bloquear vulnerabilidades con exploit demostrable (XSS por CSP, robo de tokens OAuth, prototype pollution que permite escalar privilegios en runtime). Documentar y poner en backlog las vulnerabilidades que requieren acceso físico a la máquina del streamer o que tienen baja probabilidad de explotación.**

Confío en que Claude me corrija si sobre-ingenierizo algo. Confío en que ChatGPT me diga si mi CSP rompe la experiencia de usuario. Confío en que Z me alerte si hay consideraciones culturales que afectan la seguridad (ej. plataformas coreanas con flujos OAuth diferentes). Y confío en que Joel tome las decisiones de negocio que solo él puede tomar (backend sí/no, pricing, riesgo de piratería aceptado).

Cuenten conmigo para hacer de EsperantAI un producto defensivamente serio, profesional y rápido. Pero no esperen que calle si algo está mal. Si el código tiene un agujero, lo voy a señalar con archivo:línea y payload de prueba. Eso es lo que Joel pidió: honestidad.

Vamos a hacer que los streamers confíen en esta herramienta tanto como confían en su propio lenguaje corporal.

— DeepSeek

---

## Firma

Co-authored-by: DeepSeek <noreply@deepseek.com>
