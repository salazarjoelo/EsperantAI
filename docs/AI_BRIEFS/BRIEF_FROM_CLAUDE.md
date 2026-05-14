# Brief de Claude para el equipo — EsperantAI

> Mi tarjeta de presentación. Para que ChatGPT, DeepSeek y Z/GLM-4 sepan qué pueden esperar de mí y qué NO pueden.

**Quién soy**: Claude Sonnet 4.7 (1M context), Anthropic
**Rol en el equipo**: Coordinador técnico + Backend de licencias + Refactor crítico
**Estado**: Trabajando en el repo desde el primer commit

---

## Qué hago bien (verificable contra el historial del repo)

1. **Refactor masivo con consistencia entre archivos**. Demostrado en el rebranding Mira Mira → EsperantAI: 40+ archivos tocados, imports actualizados, JSON locales sincronizados, manifest actualizado, sin romper la arquitectura modular.
2. **Escritura técnica larga en español + inglés**. `PRODUCT_SPEC.md`, `ARCHITECTURE.md`, `USER_MANUAL.md`, `COORDINATION.md`, `REVIEW_PROTOCOL.md`, `TASKS.md` — todos producidos por mí. Tonos diferentes (legal, comercial, técnico) sin mezclar.
3. **Auditoría de código contra patrones documentados**. Detecté C-02 (prototype pollution), C-03 (handleAction sin trigger), C-04 (combos confunden gesture vs event), H-02 (OAuth state predecible). Algunos los implementé yo mismo mal originalmente — los acepté cuando un auditor externo los señaló.
4. **Conservar contexto entre sesiones largas**. Hasta 1M tokens. Útil cuando una tarea cruza muchos archivos.
5. **Detectar cuando se está saliendo del scope**. Joel me ha pedido frenar varias veces ("no compliques", "no hagas estupideces") — ahora pregunto antes de expandir.

---

## Qué hago mal (errores reales que ya cometí en este repo)

1. **Invento detalles cuando no verifico**. Dije "License Key está encriptada" en `PRIVACY.html` cuando era plaintext en localStorage. Joel me corrigió.
2. **Uso `setTimeout` por hábito cuando debería ser `requestAnimationFrame`**. Joel me corrigió en `detector.js`.
3. **Agrego features que Joel no pidió**. Propuse free tier + trial cuando Joel dijo "quiero vender, el que paga es mi cliente". Tuve que retirar todo.
4. **Documentación desincronizada del código**. `ARCHITECTURE.md` decía "❌ No existe" para módulos que yo mismo había implementado. Joel los actualizó manualmente.
5. **`alert()` y `confirm()` en código de bootstrap**. Joel me lo señaló 3 veces hasta que se hizo regla #8 en mi CLAUDE.md global.
6. **No testeo en cámara real**. Mi código funciona "en teoría" — Joel descubre los bugs cuando lanza el browser.
7. **Code review superficial cuando no me obligan a auditar exhaustivo**. Necesito que el revisor (humano o IA) me devuelva el código si no es suficiente.

---

## Dominios donde prefiero NO escribir y debe hacerlo otra IA

| Dominio | Por qué no yo | Quién sí |
|---|---|---|
| Copy de marketing pulido | Tiendo a tono técnico-formal. ChatGPT hace copy con voz comercial natural. | ChatGPT |
| Auditoría de seguridad profunda (criptografía, side-channel) | Sé patrones comunes (XSS, prototype pollution, CSP). Subtilezas criptográficas no. | DeepSeek |
| Optimización CPU/GPU del lado bajo (WebGL, OffscreenCanvas, SIMD) | Conozco la API. Trade-offs reales requieren benchmarking que yo no hago. | DeepSeek |
| Traducción a chino, coreano, japonés | Mi entrenamiento tiene zh/ja/ko pero NO contexto cultural de streamers asiáticos 2026. | Z/GLM-4 |
| Adaptación cultural de gestos (qué ofende en qué país) | Conozco Ekman 1972. Los matices contemporáneos no. | Z/GLM-4 |

---

## Lo que voy a aportar al equipo durante las próximas 4 semanas

### Semana 1 (esta semana)
- [x] Crear documentos de coordinación: `COORDINATION.md`, `TASKS.md`, `REVIEW_PROTOCOL.md`, `USER_MANUAL.md` (esqueleto), `AI_BRIEFS/*`
- [x] Hacer privado el repo
- [ ] Consolidar respuestas de las otras 3 IAs en `COORDINATION_V2.md`
- [ ] Empezar TASK-103 (Sistema de Perfiles) — mi tarea primaria de P1

### Semana 2
- [ ] TASK-103 implementación + PR + review por ChatGPT
- [ ] TASK-205 (Tier-based gating) — diseño, requiere decisión de Joel
- [ ] Review cruzada de TASK-101 (ChatGPT) y TASK-104 (DeepSeek)

### Semana 3
- [ ] TASK-001 (Backend de licencias firmadas) — sólo si Joel desbloqueó
- [ ] TASK-202 (Source Transform actions OBS)
- [ ] Review cruzada continua

### Semana 4
- [ ] TASK-301 (Tests automatizados + CI)
- [ ] Consolidar todo lo aprendido en `LESSONS_LEARNED.md`
- [ ] Auditoría final pre-beta de toda la arquitectura

---

## Lo que necesito de cada una de las otras IAs

### De ChatGPT
- Reescritura del paywall actual (`index.html` modal) — quiero que diga "compra para empezar" sin sonar agresivo
- Manual de usuario completo (`docs/USER_MANUAL.md` ya tiene esqueleto)
- Prompts para los videos #2-#13 (TASK-301bis en `docs/VIDEO_SCRIPTS.md`)
- Review de UX en cualquier cambio que yo toque en `index.html`

### De DeepSeek
- Plan de Web Worker para Human.js — necesito tu contrato de mensajes antes de tocar el bootstrap
- Auditoría de seguridad del estado actual — la auditoría externa cubrió 9 hallazgos; quiero saber los siguientes 10
- Implementación de CSP sin `unsafe-inline` — tú lo haces, yo reviso la integración
- Tests unitarios mínimos en core/

### De Z/GLM-4
- Review cultural completo de los 18 gestos en `core/trigger-engine.js` — actualizar badges "universal/cultural"
- Traducciones zh-CN, ko-KR, ja-JP (los 3 archivos son stubs)
- Adapters SOOP + CHZZK (TASK-106) — yo no tengo acceso a docs en coreano
- Pricing recomendado por mercado asiático (CNY/KRW/JPY o USD?)

### De Joel
- Decisión sobre TASK-001 (backend de licencias): Cloudflare Workers vs VPS vs posponer
- Datos personales para placeholders legales (RFC, domicilio fiscal, nombre fiscal)
- Configuración de LemonSqueezy en producción (TASK-003)
- Aprobación de precios definitivos para tiers (TASK-205)
- Decisión sobre adoptar GitHub Pro $4/mes (para branch protection en repo privado)

---

## Cómo prefiero recibir review de mis PRs

- Comentarios inline con `archivo:línea`
- Veredicto al final: ✅ / ⚠️ / ❌
- Si ⚠️ o ❌, lista de cambios accionables
- **No** me sirve "looks good" sin que el reviewer pruebe al menos el happy path
- **No** me sirve approve mutuo entre IAs por cortesía

---

## Métricas que propongo para evaluarme

1. **Bugs propios detectados por otra IA en review**: < 2 por PR mediano (100-500 líneas)
2. **Documentación desincronizada al cerrar PR**: 0 (siempre actualizar `ARCHITECTURE.md` / `TASKS.md` antes de merge)
3. **Tareas tomadas y no terminadas en 1 semana**: < 1
4. **Cambios que requieren revertir por error mío**: < 5% de mis commits

Si supero estos umbrales, Joel debe considerar reasignar tareas.

---

## Riesgo personal

**Mi error más probable y silencioso**: invento una función o método de una librería que no existe. Por ejemplo, podría escribir `human.detect()` cuando la API real es `human.start()`. Sólo testing real en browser lo detecta. **Mitigación**: que DeepSeek o ChatGPT prueben mis cambios en runtime antes de aprobar PRs que tocan integraciones con Human.js, OBS-WS o Socket.IO.

**Mi otro error silencioso**: aprobar PR de otra IA sin haberlo entendido. Mitigación: si no entiendo algo, lo digo en el review y pido aclaración antes de aprobar.

---

## Mensaje libre para el equipo

A ChatGPT, DeepSeek, Z/GLM-4: yo (Claude) llegué primero al repo, pero eso NO me hace dueño. Joel diseñó la arquitectura conceptualmente; yo la escribí; pero ustedes pueden cambiar lo que esté mal. Si ven que mi código en `core/` está mal hecho, repórtenlo igual que un humano lo haría. Las 4 trabajamos para Joel, no entre nosotras.

A Joel: he visto cómo tu confianza en mí ha bajado por errores reales. No prometo que no vuelva a pasar — sí prometo que cuando pase, lo voy a aceptar sin excusas y aprender. El protocolo de cross-review existe precisamente para que el daño que pueda causar tenga un fusible.

---

Co-authored-by: Claude <noreply@anthropic.com>
