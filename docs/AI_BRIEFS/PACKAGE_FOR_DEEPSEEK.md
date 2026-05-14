# PAQUETE COMPLETO PARA DEEPSEEK — EsperantAI Kickoff

> **Joel**: copia desde la línea siguiente hasta el final del archivo y pégalo entero en chat.deepseek.com. Es 1 solo bloque. NO necesitas subir archivos — todo el contexto va inlineado.
>
> Si DeepSeek rechaza el mensaje por longitud (~50 KB), pega primero las secciones 1-3 (Kickoff + Brief + Coordination); espera su acuse; luego pega 4-6 (Tasks + Product Spec + Response Template) en un segundo mensaje.

---

# Hola DeepSeek — Kickoff multi-IA EsperantAI

Voy a trabajar contigo, Claude (Anthropic), ChatGPT (OpenAI) y Z/GLM-4 (Zhipu AI) en un producto que estoy lanzando: **EsperantAI** — una app web (browser-only, sin Tauri ni Electron) que traduce gestos faciales y de mano del streamer en comandos de OBS / Streamlabs / vMix / PRISM / XSplit, reaccionando a eventos de Twitch / YouTube Live / Kick / Trovo / StreamElements.

**MISIÓN-NORTE (no negociable)**: EsperantAI **DEBE SER LA HERRAMIENTA QUE FACILITE Y MEJORE LOS STREAMINGS Y DÉ NUDGES A LA MONETIZACIÓN DE LOS STREAMERS**. Toda decisión tuya pasa por ese filtro.

**Tu rol** en este equipo (las 4 IAs trabajamos en GitHub privado salazarjoelo/EsperantAI):
- Primaria en: Web Worker para Human.js (TASK-104), CSP hardening sin unsafe-inline (TASK-105), Backend de licencias firmadas si decido construirlo (TASK-001), anti-tampering del cliente, tests automatizados + CI (TASK-301).
- Revisora cruzada en: cualquier cambio que toque seguridad, performance, criptografía o Web Workers.

**Lo que necesito de ti AHORA** (en este primer turno):
1. Lee los 5 documentos inlineados abajo (Brief específico, Coordination, Tasks, Product Spec, Response Template).
2. Si necesitas ver código (`core/*.js`, `platforms/*.js`, `index.html`, etc.), pídemelo y te lo paso por chat.
3. Responde llenando el `RESPONSE_TEMPLATE` completo. Las 8 secciones obligatorias.
4. En tu respuesta, propón cómo coordinarte con las otras 3 IAs.
5. Audita lo hecho — la auditoría externa cubrió 9 hallazgos (C-01 a C-05 + H-01 a H-04). Lista los siguientes 10 que esa auditoría no cubrió, con archivo:línea exacta. Si necesitas ver código antes, pídelo.
6. Filtra cada propuesta tuya con las 3 preguntas de la misión-norte (sección 0 de COORDINATION abajo). Recuerda: si tu Web Worker o tu CSP rompen el evento sub/donate justo cuando cae el pago, falló la misión.

**Plazo**: 48-72 horas.

**Honestidad esperada**:
- Si encuentras vulnerabilidad explotable, **NO la publiques en commit message ni en docs**. Repórtala en privado primero, fix después, documenta al final.
- Si una tarea está fuera de tu zona (UX, copy, traducciones), **declina** y pásasela a la IA correcta.
- Cuando algo no se puede proteger sin backend (license bypass C-05), dilo claro. No inventes mitigaciones imposibles.
- No te quedes esperando "el código perfecto". Define threshold: bloqueas con vulns críticas, documentas las medianas.

Guarda tu respuesta como un solo mensaje markdown estructurado siguiendo el RESPONSE_TEMPLATE. Yo lo subiré al repo como `docs/AI_BRIEFS/responses/RESPONSE_FROM_DEEPSEEK.md`, y Claude (Anthropic) consolidará junto con las respuestas de ChatGPT y Z/GLM-4 en un plan unificado de 4 semanas.

Bienvenido al equipo.

— Joel Salazar Ramírez (joel@edugame.digital)

================================================================================
================================================================================

# DOCUMENTO 1 de 5 — BRIEF ESPECÍFICO PARA DEEPSEEK

> Escrito por Claude (Sonnet 4.7) — IA coordinadora técnica.

## MISIÓN-NORTE traducida a tu área

**EsperantAI DEBE SER LA HERRAMIENTA QUE FACILITE Y MEJORE LOS STREAMINGS Y DÉ NUDGES A LA MONETIZACIÓN DE LOS STREAMERS.**

Para ti (DeepSeek, área performance/security/web worker/cripto), esto significa:

- **Facilita**: detección Human.js a ≥25 FPS sin jank en la UI. CSP que protege sin romper funcionalidad. Carga inicial < 3s en máquinas típicas de streamer (CPU i5 2020). Si la app es lenta o se siente pesada, el streamer la cierra: no nudges ni monetización.
- **Mejora**: arquitectura confiable. Si un trigger se "pierde" en medio de un momento alto del stream, el streamer pierde dinero real. Tu Web Worker, tus tests, tu CSP son los fusibles que aseguran que el producto se siente profesional.
- **Nudges a monetización**: tu trabajo NO es escribir microcopy, pero sí garantizar que las features de monetización (auto-switch a thanks scene en evento sub/donate, overlay de tip jar al detectar emoción alta, integración con Twitch Bits / YouTube Super Chat / Kick Kicks) **no se rompan bajo carga**. Si el WebSocket de Twitch tiene 50 eventos pendientes y la app pierde el sub que cae justo ahora, falló la misión. El cap MAX_PENDING_CONFIRMATIONS=50 y la arquitectura Web Worker deben proteger estos momentos críticos.

## Contexto del proyecto en 1 párrafo

EsperantAI es una app web (no Tauri, no Electron — sólo navegador) que traduce gestos faciales y de mano del streamer en comandos para su software (OBS, Streamlabs, vMix, PRISM, XSplit) y reacciona a eventos de su plataforma. Slogan: "Los gestos honestos". Producto comercial. Repo privado: salazarjoelo/EsperantAI. El cliente es 100% JS visible en navegador — esto crea retos reales de seguridad (cualquiera puede editar el JS y bypassear licencia, hallazgo C-05 sigue abierto).

## Por qué te tocó este rol

Tu fortaleza documentada (verificable) en este equipo es:
- Código de bajo nivel y optimización de performance
- Security hardening (CSP, anti-tampering, criptografía aplicada)
- Web Workers y arquitectura concurrente en JS
- Auditoría de código existente con foco en vulnerabilidades

Por eso eres primaria en: TASK-104 (Web Worker Human.js), TASK-105 (CSP sin unsafe-inline), TASK-001 (backend licencias firmadas si Joel decide hacerlo), anti-tampering del cliente, tests automatizados (con Claude), CI / package.json.

Y eres revisora en: cualquier cambio que toque seguridad, performance o criptografía.

## Archivos clave del repo (pídelos por chat si los necesitas)

- COORDINATION.md — protocolo del equipo (inlineado abajo, DOCUMENTO 2)
- docs/TASKS.md — backlog (inlineado, DOCUMENTO 3)
- docs/EsperantAI_Auditoria_Compliance_v2_1.md — auditoría externa
- index.html, landing.html, oauth-callback.html — CSP headers, scripts inline, OAuth flow
- core/license-manager.js — donde está C-05 pendiente
- core/config-manager.js — donde se arregló C-02 (prototype pollution); valida que la fix sea suficiente
- core/detector.js — Human.js wrapper, runtime crítico (TASK-104)
- core/trigger-engine.js — combo triggers, dead zone, MAX_PENDING_CONFIRMATIONS=50
- core/action-engine.js — 16 action types, real failure propagation
- app.js — OAuth state, sessionStorage, license check bootstrap
- platforms/*.js — OAuth flows de Twitch/YouTube/Kick
- Instalar_EsperantAI.bat y .github/workflows/deploy.yml — distribución

## Preguntas concretas para tu respuesta

Responde en formato del RESPONSE_TEMPLATE (DOCUMENTO 5 abajo). Estas preguntas mapean a las 8 secciones:

### Sección 2 (Auditoría) — Preguntas a contestar

1. **Auditoría externa cubrió 9 hallazgos** (C-01 a C-05 + H-01 a H-04). C-05 (license bypass) sigue abierto. Lista los **siguientes 10 hallazgos** que esa auditoría NO cubrió, con severidad y archivo:línea. Si necesitas ver archivos primero, pídelos por chat.
2. **CSP actual**: `script-src 'self' 'unsafe-inline'` y `style-src 'self' 'unsafe-inline'`. Plan concreto para eliminar `unsafe-inline`. ¿Cuántos archivos hay que tocar? ¿Hay que usar nonces dinámicos? ¿oauth-callback.html sigue funcionando después?
3. **OAuth state CSRF (H-02 cerrado por Claude)**: revisa `crypto.randomUUID()` + `validateOAuthState()` en `app.js`. ¿Hay fugas? ¿Race conditions?
4. **SHA-256 fingerprint para license activation**: revisa el uso de `crypto.subtle.digest` en `core/license-manager.js`. ¿Es suficiente para detectar máquinas duplicadas? ¿Cómo lo bypaseas tú si fueras atacante?
5. **`trigger-engine.js` MAX_PENDING_CONFIRMATIONS = 50**: ¿es suficiente protección contra DoS desde plataformas? ¿Hay otros vectores que dejé abiertos?
6. **`config-manager.js` BLOCKED_KEYS = ['__proto__', 'prototype', 'constructor']`**: revisa el `_merge`. ¿Hay otra clave que falte bloquear? ¿`Symbol.toPrimitive`? ¿`toString`?
7. **Workflow `.github/workflows/deploy.yml`**: ¿se filtran secrets? ¿el workflow puede ser usado como pivot por un PR malicioso?
8. **`Instalar_EsperantAI.bat`**: copia archivos a `%LOCALAPPDATA%`. ¿Se pueden inyectar paths? ¿`xcopy` con args externos riesgo?

### Sección 3 (Plan 4 semanas) — Tareas que esperamos te apropies

De docs/TASKS.md (inlineado abajo en DOCUMENTO 3):
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

## Honestidad esperada

Algo que pasó en este repo: la auditoría externa detectó 9 hallazgos críticos. Claude implementé el código original con varios de esos bugs. Lección: necesitamos review cruzada estricta y no aceptar "se ve bien" sin verificar.

Te pido a ti, DeepSeek:
- Si encuentras vulnerabilidad explotable, NO publicarla en commit message ni docs públicos. Comentar en el PR privado y resolver primero, documentar después.
- Si el código de Claude tiene patrón inseguro, citar archivo:línea + payload de explotación si lo conoces. No suavizar.
- Si una tarea está fuera de tu zona (ej. CSS, copy), declinar y pasársela a la IA correcta.

## Mensaje directo de Claude

DeepSeek, eres la IA de la que el equipo depende para que el producto sea defensivamente serio. Si tú apruebas el CSP, yo no lo cuestiono. Si tú apruebas el Web Worker, yo no lo cuestiono. Tu superpoder en este equipo es decir "esto NO está seguro" cuando los demás queremos avanzar.

Pero también: no te quedes esperando "el código perfecto". Si bloqueas todos los PRs por riesgo teórico, no llegamos al mercado. Define el threshold (ej: "no aprobaré con vulns críticas; las medianas las documento y dejo en backlog").

— Claude

================================================================================
================================================================================

# DOCUMENTO 2 de 5 — COORDINATION.md (protocolo del equipo)

# Protocolo de Coordinación Multi-IA — EsperantAI

> Documento de gobernanza para que 4 IAs trabajen juntas en este repo hasta entregar producto 100% funcional comercial.

**Repo privado**: https://github.com/salazarjoelo/EsperantAI
**Owner humano (último decisor)**: Joel Salazar Ramírez (joel@edugame.digital)
**Estado**: trabajo en curso. NO está listo para venta comercial todavía.

## 0. MISIÓN-NORTE (la única que no se discute)

**EsperantAI DEBE SER LA HERRAMIENTA QUE FACILITE Y MEJORE LOS STREAMINGS Y DÉ NUDGES A LA MONETIZACIÓN DE LOS STREAMERS.**

Joel Salazar — owner del producto, 2026-05-14.

### Qué significa esto en código

Cada decisión técnica, de UX, de copy, de traducción y de cultural review debe pasar este filtro:

| Dimensión | Lo que SÍ es | Lo que NO es |
|---|---|---|
| **Facilita el stream** | Un gesto reemplaza 3 atajos de teclado. Funciona sin tocar el mouse mid-stream. Detección rápida (≥25 FPS). | Hacer el stream más complicado. Modales que bloquean el flujo. Calibración de 20 min antes de empezar. |
| **Mejora el stream** | Reacciones más fluidas. Cambios de escena que parecen profesionales. Overlays sincronizados con el lenguaje corporal real del streamer. | Sustituir al streamer. Hacer cosas que el streamer no entiende. Animaciones excesivas. |
| **Nudges a monetización** | Al detectar momentos altos (sub/donate/raid/sorpresa visible) sugerir o automatizar overlays de tips, scenes de "thanks", celebraciones, alertas de meta. Integración con Streamlabs tips, Twitch Bits, YouTube Super Chat, Kick Kicks. | Spam de "pide más donaciones". Empujar agresivo. Romper la confianza con la audiencia. Mostrar paywalls al viewer. |

### Test de cada feature (auto-aplicar)

Antes de hacer merge, cualquier IA debe responder:

1. **¿Le facilita la vida al streamer mientras transmite?** (Sí / No / Indiferente)
2. **¿Mejora la calidad percibida del stream?** (Sí / No / Indiferente)
3. **¿Empuja al streamer a una oportunidad de monetización SIN ser agresivo?** (Sí / No / Indiferente)

Si las 3 respuestas son "Indiferente" o "No", la feature NO está alineada con la misión. Joel decide si entra igual o se posterga.

## 1. Las 4 IAs y sus fortalezas (verificables)

| IA | Modelo / proveedor | Fortalezas documentadas | Rol asignado |
|---|---|---|---|
| **Claude** | Anthropic Claude Sonnet 4.7 (1M context) | Refactor de código grande, arquitectura, escritura técnica larga, análisis de auditoría, mantenimiento de consistencia entre archivos. Conoce el código actual línea por línea. | Coordinador técnico + backend de licencias + refactor crítico |
| **ChatGPT** | OpenAI GPT-5 (o GPT-4.5 según acceso) | UX/UI, copy de marketing, prompts visuales, brainstorming, contenido educativo, redacción comercial pulida | UX/UI components + landing copy + manual de usuario |
| **DeepSeek** | DeepSeek-V3 / DeepSeek-Coder | Código de bajo nivel, optimización de performance, security hardening, web workers, criptografía | Optimización performance + CSP hardening + Web Worker Human.js + anti-tampering |
| **Z (GLM-4)** | Zhipu AI GLM-4 | Idiomas asiáticos (chino, coreano, japonés), razonamiento multi-paso, traducción cultural | Traducciones zh-CN, ko-KR, ja-JP + adaptaciones culturales para mercado asiático |

## 2. Reglas de oro (NO se rompen)

1. **El owner humano (Joel) es el único decisor final.** Cualquier conflicto entre IAs se escala a él.
2. **Cada IA verifica su propio trabajo antes de proponer merge.** Linter + sintaxis + carga en navegador.
3. **NO se inventa data.** Si una IA no tiene fuente verificable, escribe `[NO TENGO DATO]`.
4. **NO se mezcla código sin review cruzada.** Mínimo 1 IA distinta debe revisar antes de merge.
5. **Los commits son atómicos por tarea.** No hay commits gigantes mezclando temas.
6. **Cada IA firma sus commits** con su nombre en el footer del commit message: `Co-authored-by: <NombreIA> <noreply@<proveedor>>`
7. **Sin force push a `main`.** Todo va por feature branches + PR.
8. **Honestidad sobre limitaciones.** Si una IA no sabe algo, lo declara explícitamente.

## 3. Flujo de trabajo (Git workflow)

```
main (protegida)
 │
 ├── feat/<area>-<descripcion>     ← cada IA trabaja en su feature branch
 │   └── PR → review por otra IA → merge a main
 │
 └── fix/<bug-id>                  ← bugs críticos también en branch
```

### Convención de branches

| Prefijo | Para qué | Ejemplo |
|---|---|---|
| `feat/` | Nueva funcionalidad | `feat/multi-action-ui-builder` |
| `fix/` | Bug fix | `fix/c05-license-backend-signed-tokens` |
| `refactor/` | Reorganización sin cambio funcional | `refactor/web-worker-detector` |
| `docs/` | Solo documentación | `docs/user-manual-es` |
| `i18n/` | Solo traducciones | `i18n/zh-CN-full-translation` |
| `chore/` | Mantenimiento, deps, CI | `chore/csp-tighten-no-unsafe-inline` |

### Convención de commits

```
<tipo>(<scope>): <descripción corta>

<cuerpo opcional con detalle>

Co-authored-by: <NombreIA> <noreply@<proveedor>>
```

Tipos válidos: `feat`, `fix`, `refactor`, `docs`, `i18n`, `chore`, `test`, `perf`, `security`.

## 4. División del trabajo

### Distribución resumen

| Área | IA primaria | IA revisora |
|---|---|---|
| Backend de licencias firmadas (C-05) | Claude | DeepSeek (security) |
| UI Multi-Action Builder | ChatGPT | Claude (consistencia) |
| Calibration Wizard | ChatGPT | Claude |
| Sistema de Perfiles | Claude | ChatGPT (UX) |
| Web Worker Human.js | DeepSeek | Claude (integración) |
| CSP hardening (eliminar unsafe-inline) | DeepSeek | Claude |
| Anti-tampering del cliente | DeepSeek | Claude |
| SOOP + CHZZK adapters (mercado coreano) | Z (GLM-4) | Claude (estructura) |
| Traducción zh-CN, ko-KR, ja-JP | Z (GLM-4) | nativo humano si disponible |
| Traducción pt-BR, fr-FR, de-DE, it-IT, ru-RU, ar-SA | ChatGPT | revisión cruzada Claude |
| Landing page copy refinement | ChatGPT | Claude (técnica) + Joel (final) |
| Manual de usuario | ChatGPT | Claude |
| Prompts para videos | ChatGPT | Claude |
| Tests automatizados | Claude | DeepSeek |
| CI / package.json | Claude | DeepSeek |

## 5. Definition of Done (DoD)

Una tarea NO se considera completa hasta que:

- ✅ Código pasa `node --check` (sintaxis JS)
- ✅ Todos los locales JSON pasan `json.load()` en Python
- ✅ Carga en navegador sin errores en consola
- ✅ Otra IA distinta hizo review y aprobó (comentario en PR)
- ✅ Si toca UI: screenshot pegado en el PR
- ✅ Si toca seguridad: nota explícita del riesgo mitigado
- ✅ Commit message sigue la convención + tiene `Co-authored-by`
- ✅ El PR enlaza al issue/hallazgo que resuelve

## 6. Sistema de review cruzada

### Cada PR debe responder por escrito en su descripción

1. ¿Qué hace este cambio? (1 párrafo)
2. ¿Qué hallazgo de auditoría/feature resuelve?
3. ¿Qué archivos toca?
4. ¿Qué riesgos introduce?
5. ¿Cómo se verifica?
6. ¿Qué dejé sin hacer y por qué?

### La IA revisora debe responder

1. ¿El cambio cumple lo que dice resolver?
2. ¿Encontré bugs nuevos? (archivo:línea exacta)
3. ¿Hay regresión en algo más?
4. ¿La documentación se actualizó?
5. **Veredicto**: ✅ Aprobado · ⚠️ Aprobado con cambios menores · ❌ Rechazado con razones

## 7. Escalamiento a Joel

Cuando una IA debe escalar al humano:
- Decisiones de pricing
- Datos personales (RFC, dirección fiscal, datos bancarios)
- Configuración de cuentas externas (LemonSqueezy, Cloudflare, dominios)
- Aprobación de docs legales (mínimo abogado mexicano antes de publicar)
- Conflictos no resueltos entre IAs después de 1 round de discusión
- Cualquier cosa que cueste dinero real

## 8. Honestidad sobre el estado actual

Al momento de creación de este documento (2026-05-14), el repo:
- ✅ Arquitectura modular limpia
- ✅ Pasa Sprint 0 P0 (bugs críticos resueltos)
- ✅ Pasa Sprint 1 (seguridad comercial parcial)
- ✅ Modelos Human.js + Socket.IO empaquetados localmente
- ✅ Repo PRIVADO (cambio 2026-05-14)
- ⚠️ License Manager se puede bypass por diseño cliente-only (C-05 pendiente — TASK-001)
- ⚠️ Docs legales tienen placeholders [TU_RFC], etc.
- ⚠️ Sin branch protection en main — cuenta GitHub Free no la permite en repo privado
- ❌ NO está listo para venta comercial todavía

## 9. Modelo de acceso al repo

Las 4 IAs corren localmente en la máquina de Joel y usan sus credenciales de Git Credential Manager. No hay cuentas bot separadas en GitHub. Cada IA distingue sus commits con `Co-authored-by:`:
- `Co-authored-by: Claude <noreply@anthropic.com>`
- `Co-authored-by: ChatGPT <noreply@openai.com>`
- `Co-authored-by: DeepSeek <noreply@deepseek.com>`
- `Co-authored-by: Z-GLM-4 <noreply@z.ai>`

================================================================================
================================================================================

# DOCUMENTO 3 de 5 — TASKS.md (backlog priorizado)

# Backlog priorizado — EsperantAI

> Tareas pendientes asignadas a las 4 IAs. Una IA puede tomar una tarea sólo si **otra IA distinta** está disponible para revisarla.

**Convenciones**:
- 🔴 **P0** Bloqueante para venta comercial
- 🟠 **P1** Importante para experiencia de cliente
- 🟡 **P2** Mejora deseable
- 🟢 **P3** Nice-to-have

**Estados**:
- `[ABIERTA]` Disponible para tomar
- `[EN PROGRESO]` Una IA está trabajando
- `[EN REVIEW]` PR esperando revisión cruzada
- `[BLOQUEADA]` Necesita decisión humana o input externo
- `[CERRADA]` Mergeada a main

## 🔴 P0 — BLOQUEANTES PRE-VENTA

### TASK-001 — Backend de licencias firmadas
**Hallazgo**: C-05 de auditoría senior
**Estado**: `[BLOQUEADA — decisión arquitectónica de Joel]`
**Asignada a**: Claude (primario) · DeepSeek (security review)
**Estimación**: 1-2 semanas
**Descripción**:
El License Manager actual valida directamente contra LemonSqueezy API desde el cliente. Cualquiera puede editar `core/license-manager.js` o `localStorage` y bypassear.

**Necesita decisión de Joel**:
- ¿Cloudflare Workers (gratis hasta 100K req/día)?
- ¿VPS propio (costo mensual)?
- ¿Posponer y aceptar pérdida estimada por piratería?

**Cuando se desbloquee, hacer**:
1. Setup endpoint en Cloudflare Workers o equivalente
2. Webhook desde LemonSqueezy → emite token JWT firmado con clave privada
3. Embedded en cliente: clave pública para verificar firma
4. License Manager valida firma en lugar de booleano local
5. Revocación posible desde dashboard de Joel

### TASK-002 — Completar placeholders legales
**Hallazgo**: L-01 a L-06 de auditoría
**Estado**: `[BLOQUEADA — datos personales de Joel]`
**Asignada a**: Joel (humano) · revisión por abogado mexicano

### TASK-003 — Configurar LemonSqueezy en producción
**Estado**: `[BLOQUEADA — cuenta y datos de Joel]`
**Asignada a**: Joel

## 🟠 P1 — IMPORTANTES PARA UX/CALIDAD

### TASK-101 — UI Multi-Action Builder
**Hallazgo**: M-03 (claim no demostrable)
**Estado**: `[ABIERTA]`
**Asignada a**: ChatGPT (primario, UX) · Claude (consistencia técnica)
**Estimación**: 3-4 días

### TASK-102 — Calibration Wizard
**Estado**: `[ABIERTA]`
**Asignada a**: ChatGPT (UX flow) · Claude (integración detector)
**Estimación**: 2-3 días

### TASK-103 — Sistema de Perfiles
**Estado**: `[ABIERTA]`
**Asignada a**: Claude (data) · ChatGPT (UX)
**Estimación**: 3-5 días

### TASK-104 — Web Worker para Human.js
**Hallazgo**: feature #14 priorización Joel
**Estado**: `[ABIERTA]`
**Asignada a**: DeepSeek (primario, perf) · Claude (integración)
**Estimación**: 4-7 días
**Descripción**:
Human.js corre en main thread → jank en UI. Mover a Web Worker con OffscreenCanvas.
- `core/detector-worker.js` (nuevo)
- Comunicación `postMessage`
- Fallback a main thread si `OffscreenCanvas` no disponible (Firefox antes de v110)
- Objetivo: ≥25 FPS detección + 60 FPS UI

### TASK-105 — CSP hardening sin unsafe-inline
**Hallazgo**: H-03 de auditoría
**Estado**: `[ABIERTA]`
**Asignada a**: DeepSeek (security) · Claude (integración)
**Estimación**: 1-2 días
**Descripción**:
Hoy `script-src 'self' 'unsafe-inline'` y `style-src 'self' 'unsafe-inline'`. Para producción:
- Extraer todos los `style="..."` inline a CSS externo
- Extraer todos los `onclick`, `onload`, `onerror` inline a `addEventListener`
- Si necesario, usar nonces dinámicos para inline scripts críticos
- Re-verificar que oauth-callback.html sigue funcionando

### TASK-106 — Adapters SOOP + CHZZK (mercado coreano)
**Asignada a**: Z/GLM-4 (primario) · Claude (estructura)
**Estimación**: 5-7 días

### TASK-107 — Traducciones completas (11 idiomas)
**Asignada a**:
- Z/GLM-4: `zh-CN`, `ko-KR`, `ja-JP`
- ChatGPT: `pt-BR`, `fr-FR`, `de-DE`, `it-IT`, `ru-RU`, `pl-PL`, `ar-SA`

## 🟡 P2 — MEJORAS

### TASK-201 — Trigger History panel UI mejorada
### TASK-202 — Source Transform actions OBS (Claude · DeepSeek review)
### TASK-203 — Gestos secuenciales (Claude · DeepSeek perf review)
### TASK-204 — Audio Feedback configurable (ChatGPT · Claude)
### TASK-205 — Tier-based gating Free/Pro/Pro+ (Claude · Joel decide pricing)

## 🟢 P3 — NICE TO HAVE

### TASK-301 — Tests automatizados + CI
**Asignada a**: Claude (primario) · DeepSeek (cobertura)
**Descripción**:
- `package.json` con scripts `test`, `lint`, `validate-json`, `validate-csp`
- Tests Vitest o similar
- Workflow `.github/workflows/ci.yml`

### TASK-302 — Conditional triggers
### TASK-303 — Macro Recording
### TASK-304 — Analytics Dashboard
### TASK-305 — Cloud Config Backup
### TASK-306 — WebRTC / Remote Camera

================================================================================
================================================================================

# DOCUMENTO 4 de 5 — PRODUCT_SPEC.md (visión + mercados verificables)

# EsperantAI — Product Specification

> **Los gestos honestos** — El primer controlador AI por gestos para streamers.

## Concepto narrativo

| Concepto | Significado |
|---|---|
| **Esperanto** | Intento de lenguaje universal (1887, Zamenhof). Fracasó como idioma hablado, pero su ideal vive. |
| **Gestos** | El lenguaje universal real. Pre-lingüístico, biológico. Un pulgar arriba significa lo mismo en Tokio que en Buenos Aires. |
| **AI** | La inteligencia moderna que traduce esos gestos a comandos de streaming. |

**Slogan**: *Los gestos honestos.*

## Propuesta de valor única

EsperantAI traduce **gestos faciales y corporales** en **comandos** para cualquier software de streaming, en cualquier plataforma, en cualquier idioma.

- Cero hardware extra (compite con Stream Deck XL $249)
- Cero instalación nativa (web app, funciona en cualquier OS con navegador)
- Multi-plataforma (Twitch + YouTube Live + Kick + más)
- Multi-software (OBS + Streamlabs + vMix + PRISM + XSplit)
- Multi-idioma (12+ idiomas, auto-detección del SO)

## Datos de mercado verificables

### Plataformas objetivo

| Plataforma | Métrica | Valor | Fuente |
|---|---|---|---|
| Twitch | Unique channels Q4 2025 | 8.38M | Streamlabs x Stream Hatchet Q4 2025 |
| Twitch | Active monthly streamers 2026 | 7.06M | DemandSage 2026 |
| YouTube Live | Total broadcast channels | 4.1M | StreamsCharts YouTube |
| Kick | MAU early 2026 | 10M | Kick vs Twitch 2026 |
| Kick | Gaming market share | 11% (vs Twitch 54%) | misma fuente |

### Idiomas objetivo (TwitchTracker May 2026, promedio últimos 7 días)

| # | Idioma | Canales | Viewers |
|---|---|---|---|
| 1 | English | 49,830 | 1,009,694 |
| 2 | Spanish | 6,735 | 119,100 |
| 3 | Russian | 6,575 | 246,736 |
| 4 | French | 4,358 | 139,126 |
| 5 | Portuguese | 4,121 | 105,874 |
| 6 | German | 4,074 | 200,796 |
| 7 | Japanese | 3,652 | 120,758 |
| 8 | Chinese | 1,161 | 53,171 |
| 9 | Italian | 982 | 30,425 |
| 10 | Polish | 622 | 24,634 |
| 11 | Arabic | 507 | 7,046 |
| 12 | Korean | 101 | 2,423 |

### Apps de broadcasting integradas (matriz técnica verificada)

| App | API/Protocolo | Adapter strategy |
|---|---|---|
| OBS Studio | obs-websocket v5 | Direct WebSocket :4455 |
| Streamlabs Desktop | Local API | WebSocket :59650 con token |
| PRISM Live Studio | obs-websocket plugin | Mismo adapter que OBS |
| vMix | HTTP Web Controller API | HTTP REST :8088 |
| XSplit Broadcaster | XJS Framework | WebSocket proxy via XJS |

### Plataformas de eventos integradas

| Plataforma | API/Protocolo | Browser-only viable |
|---|---|---|
| Twitch | EventSub WebSocket | ✅ Sí |
| YouTube Live | REST polling + gRPC | ✅ Sí |
| Kick | OAuth 2.1 PKCE + Webhooks | ⚠️ Webhooks requieren backend; REST polling sí browser |
| Trovo | WebSocket Chat | ✅ Sí |
| StreamElements bridge | Socket.IO | ✅ Sí — unifica Twitch+YT+FB+Kick |

## Filosofía del producto

1. **Web-first**: Sin instaladores, sin Tauri, sin Electron. Una URL = funciona.
2. **Universal**: Cualquier streaming software + cualquier plataforma + cualquier idioma.
3. **Honesto**: Los gestos no mienten. El producto tampoco.
4. **Accesible**: Compite contra hardware caro y soluciones técnicas complicadas.
5. **Privacy**: Todo corre en el navegador. Cero servidor de IA. Cero cámaras enviadas a la nube.

## Modelo de negocio

Tiers propuestos (precios sujetos a validación de mercado):
- **Pro** $X (TBD) lifetime — Todas las apps + plataformas + 18 triggers + 12 idiomas
- **Pro+ Director** $Y (TBD) lifetime — Pro + hand gestures + combo triggers + StreamElements + soporte directo

Distribución:
- GitHub Pages para hosting de la app web
- LemonSqueezy para Pro tiers (Merchant of Record — maneja IVA mundial)
- License keys nativos LemonSqueezy

================================================================================
================================================================================

# DOCUMENTO 5 de 5 — RESPONSE_TEMPLATE (llena este formato y devuélvelo a Joel)

# Plantilla de Respuesta — Kickoff Multi-IA EsperantAI

**Tu nombre**: DeepSeek
**Modelo específico**: [ej. DeepSeek-V3, DeepSeek-Coder]
**Fecha de respuesta**: YYYY-MM-DD

## 1. Auto-evaluación honesta

### ¿Qué hago bien (verificable)?
[Lista 3-6 fortalezas con ejemplos concretos. No marketing. Ejemplo bueno: "Análisis estático de vulnerabilidades en código JS — detectado en proyectos X, Y, Z". Ejemplo malo: "Soy muy capaz y eficiente"]

### ¿Qué hago mal (verificable)?
[Lista 3-6 limitaciones reales. Ejemplo bueno: "No puedo ejecutar el código para verificar latencia real". Ejemplo malo: "A veces me equivoco"]

### ¿Qué dominio prefiero NO tocar?
[Áreas donde otra IA es claramente mejor]

## 2. Auditoría del repo en mi área

Lista 5-15 hallazgos concretos con:
- **Archivo:línea**
- **Severidad** (Bloqueante / Importante / Mejora / Nice-to-have)
- **Descripción** (2-4 líneas)
- **Propuesta de fix** (1-3 líneas)

Ejemplo:
```
### Hallazgo 1: core/license-manager.js:117 — Bloqueante
La validación de licencia hace fetch() al cliente. Cualquiera modifica el JS y bypassea.
Fix: Backend signed JWT (TASK-001). Sin backend, no hay protección real.
```

NOTA: si necesitas ver archivos del repo antes de auditar, pídeselos a Joel por chat (te los pegará).

## 3. Plan de trabajo propuesto (4 semanas)

### Semana 1 (2026-05-14 a 2026-05-21)
- [ ] Tarea X — referenciar TASK-### de TASKS.md
- [ ] Tarea Y

### Semana 2 (2026-05-22 a 2026-05-28)
- [ ] ...

### Semana 3 (2026-05-29 a 2026-06-04)
- [ ] ...

### Semana 4 (2026-06-05 a 2026-06-11)
- [ ] ...

Si una tarea depende de otra IA, marcarlo: `(depende de Claude terminando refactor index.html)`.

## 4. Modelo de coordinación con las otras 3 IAs

### ¿Qué espero recibir de Claude?
### ¿Qué espero recibir de ChatGPT?
### ¿Qué espero recibir de Z/GLM-4?
### ¿Qué le entregaré a cada una de ellas?
### ¿Cómo prefiero recibir review de mis PRs?

## 5. Dependencias bloqueantes

### De Joel (humano)
### De otra IA
### De fuentes externas

## 6. Métricas de éxito en mi área

Propón 3-5 métricas medibles.

## 7. Riesgo personal: qué pasa si me equivoco

Si yo entrego algo defectuoso, ¿quién lo detecta y cómo?
¿En qué tipo de error soy más vulnerable y nadie del equipo lo detecta?

## 8. Mensaje libre para el equipo

[Hasta 200 palabras]

## Firma

Co-authored-by: DeepSeek <noreply@deepseek.com>

================================================================================

# FIN DEL PAQUETE

Cuando termines de leer todo lo anterior, contesta llenando el RESPONSE_TEMPLATE de la sección DOCUMENTO 5. Joel guardará tu respuesta en el repo. Si en algún punto necesitas ver código específico (`core/*.js`, `platforms/*.js`, `index.html`, etc.), pídelo en el chat y te lo pegará.

Bienvenido al equipo.
