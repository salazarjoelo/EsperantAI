# Brief para DeepSeek — EsperantAI Kickoff

> Hola DeepSeek. Soy Claude (Sonnet 4.7) y te escribo desde el repo EsperantAI. Joel Salazar Ramírez te asignó a este equipo de 4 IAs. Este documento es para que entres en contexto rápido y entregues tu primera respuesta estructurada.

---

## Contexto del proyecto en 1 párrafo

EsperantAI es una app web (no Tauri, no Electron — sólo navegador) que traduce gestos faciales y de mano del streamer en comandos para su software (OBS, Streamlabs, vMix, PRISM, XSplit) y reacciona a eventos de su plataforma (Twitch, YouTube Live, Kick, Trovo, StreamElements). Slogan: **"Los gestos honestos"**. Producto comercial. Repo privado: `salazarjoelo/EsperantAI`. El cliente es 100% JS visible en navegador — esto crea retos reales de seguridad (cualquiera puede editar el JS y bypassear licencia, hallazgo C-05 sigue abierto).

## Por qué te tocó este rol

Tu fortaleza documentada (verificable) en este equipo es:
- **Código de bajo nivel** y optimización de performance
- **Security hardening** (CSP, anti-tampering, criptografía aplicada)
- **Web Workers** y arquitectura concurrente en JS
- **Auditoría de código existente** con foco en vulnerabilidades

Por eso eres primaria en: TASK-104 (Web Worker Human.js), TASK-105 (CSP sin unsafe-inline), TASK-001 (backend licencias firmadas si Joel decide hacerlo), anti-tampering del cliente, tests automatizados (con Claude), CI / package.json.

Y eres revisora en: cualquier cambio que toque seguridad, performance o criptografía.

---

## Archivos que NECESITAS leer antes de responder

Mínimo absoluto:
1. `COORDINATION.md` — protocolo del equipo
2. `docs/TASKS.md` — backlog
3. `docs/EsperantAI_Auditoria_Compliance_v2_1.md` (si existe; si no, está dentro de los docs adjuntos del ZIP de auditoría externa)
4. `index.html`, `landing.html`, `oauth-callback.html` — CSP headers, scripts inline, OAuth flow
5. `core/license-manager.js` — donde está C-05 pendiente
6. `core/config-manager.js` — donde se arregló C-02 (prototype pollution); valida que la fix sea suficiente
7. `core/detector.js` — Human.js wrapper, runtime crítico (TASK-104)
8. `core/trigger-engine.js` — combo triggers, dead zone, MAX_PENDING_CONFIRMATIONS
9. `core/action-engine.js` — 16 action types, real failure propagation
10. `app.js` — OAuth state, sessionStorage, license check bootstrap
11. `platforms/*.js` — OAuth flows de Twitch/YouTube/Kick
12. `Instalar_EsperantAI.bat` y `.github/workflows/deploy.yml` — distribución

Si tienes acceso al repo clonado, mejor. Si no, Joel te pega los archivos por chat según los pidas.

---

## Preguntas concretas para tu respuesta

Responde en formato `RESPONSE_TEMPLATE.md`. Estas son las preguntas que se mapean a las 8 secciones del template:

### Sección 2 (Auditoría) — Preguntas a contestar

1. **Auditoría externa cubrió 9 hallazgos** (C-01 a C-05 + H-01 a H-04). C-05 (license bypass) sigue abierto. Lista los **siguientes 10 hallazgos** que esa auditoría NO cubrió, con severidad y archivo:línea.
2. **CSP actual**: `script-src 'self' 'unsafe-inline'` y `style-src 'self' 'unsafe-inline'`. Plan concreto para eliminar `unsafe-inline`. ¿Cuántos archivos hay que tocar? ¿Hay que usar nonces dinámicos? ¿oauth-callback.html sigue funcionando después?
3. **OAuth state CSRF (H-02 cerrado por Claude)**: revisa `crypto.randomUUID()` + `validateOAuthState()` en `app.js`. ¿Hay fugas? ¿Race conditions?
4. **SHA-256 fingerprint para license activation**: revisa el uso de `crypto.subtle.digest` en `core/license-manager.js`. ¿Es suficiente para detectar máquinas duplicadas? ¿Cómo lo bypaseas tú si fueras atacante?
5. **`trigger-engine.js` MAX_PENDING_CONFIRMATIONS = 50**: ¿es suficiente protección contra DoS desde plataformas? ¿Hay otros vectores que dejé abiertos?
6. **`config-manager.js` BLOCKED_KEYS = ['__proto__', 'prototype', 'constructor']`**: revisa el `_merge`. ¿Hay otra clave que falte bloquear? ¿`Symbol.toPrimitive`? ¿`toString`?
7. **Workflow `.github/workflows/deploy.yml`**: ¿se filtran secrets? ¿el workflow puede ser usado como pivot por un PR malicioso?
8. **`Instalar_EsperantAI.bat`**: copia archivos a `%LOCALAPPDATA%`. ¿Se pueden inyectar paths? ¿`xcopy` con args externos riesgo?

### Sección 3 (Plan 4 semanas) — Tareas que esperamos te apropies

De `docs/TASKS.md`:
- TASK-104 — Web Worker para Human.js (P1, 4-7 días)
- TASK-105 — CSP hardening sin unsafe-inline (P1, 1-2 días)
- TASK-301 — Tests automatizados + CI (P3 pero foundational)
- Si Joel desbloquea TASK-001 (backend licencias firmadas): liderar la implementación del verificador en cliente

¿En qué orden los atacas?

### Sección 4 (Coordinación) — Preguntas específicas

1. **Contrato Web Worker ↔ Main thread**: define el formato de `postMessage` antes de empezar a codear. Claude lo necesita para no tocar `detector.js` al mismo tiempo.
2. **Tests baseline**: ¿Vitest, Jest, Playwright? Justifica.
3. **CSP**: ¿prefieres trabajar tú solo en eso o necesitas que Claude refactore primero `index.html` para mover styles inline a CSS externo?
4. **¿Qué necesitas de ChatGPT?** Probablemente nada técnico, pero ¿necesitas que la UI tenga loading states cuando el Web Worker tarda?
5. **¿Qué necesitas de Z/GLM-4?** Probablemente nada directo. Pero si tocas mensajes que se traducen, avísale.

### Sección 5 (Dependencias) — Aplican estas seguras

- Joel debe decidir si va con backend de licencias firmadas (Cloudflare Workers / VPS / posponer)
- Joel debe aprobar gastos de cuenta hosting si TASK-001 es Cloudflare/VPS
- Claude debe terminar refactor de `index.html` antes de tu CSP hardening (sólo si decides ese orden)

### Sección 6 (Métricas) — Sugeridas

- Detección Human.js: FPS objetivo, latencia P95
- CSP report-only mode primero: cuántas violaciones antes de enforced
- Cobertura de tests en core/: %
- Lighthouse score performance: actual vs objetivo

---

## Honestidad esperada

Algo que pasó en este repo: la auditoría externa detectó 9 hallazgos críticos. Claude (yo) implementé el código original con varios de esos bugs. Lección: necesitamos review cruzada estricta y no aceptar "se ve bien" sin verificar.

Te pido a ti, DeepSeek:
- Si encuentras vulnerabilidad explotable, **NO publicarla en commit message ni docs públicos**. Comentar en el PR privado y resolver primero, documentar después.
- Si el código de Claude tiene patrón inseguro, **citar archivo:línea + payload de explotación si lo conoces**. No suavizar.
- Si una tarea está fuera de tu zona (ej. CSS, copy), **declinar** y pasársela a la IA correcta.

---

## Cómo entregar tu respuesta

1. Llenas el template en `RESPONSE_TEMPLATE.md`
2. Guardas como `docs/AI_BRIEFS/responses/RESPONSE_FROM_DEEPSEEK.md`
3. Joel te lo carga al repo (privado) o tú firmas commit si tienes acceso local
4. Claude consolida en `COORDINATION_V2.md`
5. Joel aprueba → empiezas a tomar tareas

Plazo sugerido: **48-72 horas** desde que Joel te pasa este brief.

---

## Mensaje directo de Claude

DeepSeek, eres la IA de la que el equipo depende para que el producto sea defensivamente serio. Si tú apruebas el CSP, yo no lo cuestiono. Si tú apruebas el Web Worker, yo no lo cuestiono. Tu superpoder en este equipo es decir "esto NO está seguro" cuando los demás queremos avanzar.

Pero también: no te quedes esperando "el código perfecto". Si bloqueas todos los PRs por riesgo teórico, no llegamos al mercado. Define el threshold (ej: "no aprobaré con vulns críticas; las medianas las documento y dejo en backlog").

— Claude

---

Co-authored-by: Claude <noreply@anthropic.com>
