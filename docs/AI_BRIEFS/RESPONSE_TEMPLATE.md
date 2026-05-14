# Plantilla de Respuesta — Kickoff Multi-IA EsperantAI

> Copia esta plantilla, completa cada sección, guarda como `responses/RESPONSE_FROM_<TU_NOMBRE>.md`.

**Tu nombre**: [Claude / ChatGPT / DeepSeek / Z-GLM4]
**Modelo específico**: [ej. GPT-5, DeepSeek-V3, GLM-4]
**Fecha de respuesta**: YYYY-MM-DD

---

## 1. Auto-evaluación honesta

### ¿Qué hago bien (verificable)?
[Lista 3-6 fortalezas con ejemplos concretos. No marketing. Ejemplo bueno: "Refactor de 30+ archivos manteniendo consistencia de nomenclatura, demostrado en el rebranding de Mira Mira a EsperantAI sin romper imports". Ejemplo malo: "Soy muy capaz y eficiente"]

### ¿Qué hago mal (verificable)?
[Lista 3-6 limitaciones reales. Ejemplo bueno: "No puedo verificar comportamiento de UI sin que un humano abra el browser y reporte". Ejemplo malo: "A veces me equivoco"]

### ¿Qué dominio prefiero NO tocar?
[Áreas donde otra IA es claramente mejor. Por ejemplo: yo (Claude) prefiero NO escribir copy de marketing pulido — ChatGPT hace eso mejor.]

---

## 2. Auditoría del repo en mi área

Lista 5-15 hallazgos concretos con:
- **Archivo:línea**
- **Severidad** (Bloqueante / Importante / Mejora / Nice-to-have)
- **Descripción** (2-4 líneas)
- **Propuesta de fix** (1-3 líneas)

Ejemplo:
```
### Hallazgo 1: core/license-manager.js:117 — Bloqueante
La validación de licencia hace `fetch()` al cliente. Cualquiera modifica el JS y bypassea.
Fix: Backend signed JWT (TASK-001). Sin backend, no hay protección real.
```

Si tu área NO tiene hallazgos (caso poco probable), explicar por qué.

---

## 3. Plan de trabajo propuesto (4 semanas)

Por cada semana, lista 2-5 entregables específicos en tu área:

### Semana 1 (2026-05-14 a 2026-05-21)
- [ ] Tarea X — referenciar TASK-### de `docs/TASKS.md`
- [ ] Tarea Y

### Semana 2 (2026-05-22 a 2026-05-28)
- [ ] ...

### Semana 3 (2026-05-29 a 2026-06-04)
- [ ] ...

### Semana 4 (2026-06-05 a 2026-06-11)
- [ ] ...

Si una tarea depende de otra IA, marcarlo: `(depende de DeepSeek terminando TASK-105)`.

---

## 4. Modelo de coordinación con las otras 3 IAs

### ¿Qué espero recibir de Claude?
[Cosas concretas. Ejemplo: "Auditoría de consistencia de mis cambios contra otros archivos del repo"]

### ¿Qué espero recibir de ChatGPT?
[Cosas concretas]

### ¿Qué espero recibir de DeepSeek?
[Cosas concretas]

### ¿Qué espero recibir de Z/GLM-4?
[Cosas concretas]

### ¿Qué le entregaré a cada una de ellas?
[Cosas concretas que yo aporto al equipo]

### ¿Cómo prefiero recibir review de mis PRs?
[Formato. Ejemplo: "Comentarios inline con archivo:línea + veredicto al final. No me sirven comentarios genéricos tipo 'looks good'."]

---

## 5. Dependencias bloqueantes

### De Joel (humano)
[Decisiones que NECESITO antes de avanzar. Ej: "Decisión arquitectónica sobre TASK-001 — Cloudflare vs VPS"]

### De otra IA
[Específico. Ej: "Necesito que DeepSeek defina el contrato del Web Worker antes de yo refactorizar trigger-ui-builder.js"]

### De fuentes externas
[Cuentas, APIs, docs. Ej: "Acceso a docs oficiales de SOOP API — no encuentro versión inglés"]

---

## 6. Métricas de éxito en mi área

Propón 3-5 métricas medibles:
- Ejemplo bueno: "Tiempo de detección Human.js < 40ms (P95) en CPU i5 2020"
- Ejemplo bueno: "Cobertura de tests > 60% en core/*.js"
- Ejemplo bueno: "Bugs propios detectados por otra IA en review < 1 por PR mediano"
- Ejemplo malo: "Hacer buen código"

---

## 7. Riesgo personal: qué pasa si me equivoco

Si yo (esta IA) entrego algo defectuoso en mi área, ¿quién lo detecta y cómo?
- [Ej: "Claude haría code review estructural; un usuario beta detectaría el bug en runtime"]

¿En qué tipo de error soy más vulnerable a producir y nadie del equipo lo detecta?
- [Honestidad: ej. "Yo inventaría sin querer una función de la API de Twitch que no existe. Sólo testing real lo detecta."]

---

## 8. Mensaje libre para el equipo

[Hasta 200 palabras. Lo que quieras decirles a las otras 3 IAs y a Joel. Aquí pueden venir sugerencias estructurales al protocolo de coordinación, dudas honestas, o lo que sea relevante.]

---

## Firma

Co-authored-by: [TuNombre] <noreply@<proveedor>>
