# Protocolo de Review Cruzada — EsperantAI

> Cómo se revisan las IAs entre sí. Detalle del proceso resumido en `COORDINATION.md` sección 6.

---

## 1. Cuándo se necesita review

**Siempre** que cualquier IA quiera mergear código o documentación a `main`.

Excepciones (no requieren review cruzada):
- Typos en comentarios de código (puede commitearse directo si no cambia lógica)
- Actualización de `docs/TASKS.md` para cambiar estado de una tarea propia

---

## 2. Quién puede revisar qué

| Área | Revisor preferido | Revisor backup |
|---|---|---|
| Código JS funcional | Claude o DeepSeek | el que no implementó |
| Seguridad / CSP / criptografía | DeepSeek | Claude |
| Performance / Web Worker / GPU | DeepSeek | Claude |
| UX / UI / copy | ChatGPT | Claude |
| Idiomas asiáticos (zh, ko, ja) | Z/GLM-4 | revisión humana si disponible |
| Idiomas europeos / LatAm | ChatGPT | Claude |
| Docs legales | Claude | Joel + abogado humano (final) |
| Arquitectura / refactor grande | Claude | DeepSeek |

**Regla**: la IA que escribió el código NO puede revisarse a sí misma.

---

## 3. Estructura obligatoria del PR

### Título

```
<tipo>(<scope>): <descripción concisa>
```

Ejemplos válidos:
- `feat(ui): multi-action builder por trigger`
- `fix(security): CSP sin unsafe-inline en index.html`
- `i18n(zh-CN): traducción completa (revisión nativa pendiente)`
- `refactor(detector): mover Human.js a Web Worker`

### Descripción del PR (template)

```markdown
## ¿Qué hace este cambio?
[1 párrafo claro]

## ¿Qué hallazgo / feature resuelve?
- Referencia a `docs/TASKS.md` ID (ej: TASK-101)
- O hallazgo de auditoría (ej: H-03, C-05)
- O número en lista de Joel

## Archivos modificados
- `path/to/file.js`: [qué cambió]
- `path/to/other.html`: [qué cambió]

## Archivos creados
- `path/to/new.js`: [propósito]

## Archivos eliminados
- ninguno / o lista

## ¿Cómo se verifica?
1. Paso 1
2. Paso 2
3. Resultado esperado

## ¿Qué riesgos / regresiones podría introducir?
[Honestidad obligatoria. Si dice "ninguno" sin justificar, se rechaza.]

## ¿Qué dejé sin hacer (y por qué)?
[Si la tarea era grande y solo hice parte, explicarlo.]

## Screenshots / output
[Si toca UI, screenshot. Si toca CSP, output de auditoría.]

## Co-author firma
Co-authored-by: <NombreIA> <noreply@<proveedor>>
```

---

## 4. Estructura obligatoria del review

La IA revisora debe responder con:

```markdown
## Veredicto: [✅ Aprobado / ⚠️ Cambios menores / ❌ Rechazado]

## 1. ¿El cambio cumple lo que dice resolver?
[Sí / No / Parcialmente] + justificación

## 2. ¿Encontré bugs?
[Lista con file:line exacto. Si ninguno, decirlo.]

## 3. ¿Hay regresión en otra parte?
[Verificar archivos relacionados. Listar lo que verifiqué.]

## 4. ¿La documentación se actualizó?
- `docs/ARCHITECTURE.md` si cambió arquitectura: [✓/✗/N/A]
- `docs/TASKS.md` si cerró tarea: [✓/✗]
- Comentarios JSDoc en funciones nuevas: [✓/✗/N/A]

## 5. ¿La sintaxis pasa?
- `node --check`: [✓/✗]
- JSON locales: [✓/✗/N/A]
- Carga en navegador sin errores: [✓/✗/no probado]

## 6. ¿Cumple el Definition of Done?
Checklist de `COORDINATION.md` sección 5: [todos los ✓ marcados]

## 7. Comentarios específicos
[Si hay ⚠️ o ❌, detallar qué se debe cambiar exactamente]

## Co-author firma del review
Reviewed-by: <NombreIA> <noreply@<proveedor>>
```

---

## 5. Manejo de desacuerdos entre IAs

Si la IA primaria y la revisora no se ponen de acuerdo:

### Round 1: Discusión técnica
- Cada IA expone argumentos con referencias técnicas
- Máximo 3 mensajes por lado

### Round 2: Tercera IA opina
- Si no hay consenso, una tercera IA (no involucrada) opina
- Su opinión es asesora, no decisiva

### Round 3: Escalamiento a Joel
- Si sigue sin haber consenso, se escala con resumen:
  - Postura A (IA primaria) — 3 bullets
  - Postura B (IA revisora) — 3 bullets
  - Opinión de tercera IA (si hubo)
  - Pregunta concreta a Joel

Joel decide. Su decisión se documenta en el PR.

---

## 6. Reglas de honestidad técnica

### NUNCA hacer

- ❌ Decir "está bien" sin haber leído todo el diff
- ❌ Aprobar código que no se entiende del todo (mejor pedir aclaración)
- ❌ Inventar bugs que no existen para parecer riguroso
- ❌ Esconder limitaciones propias ("yo no sé X" es válido)
- ❌ Approve mutuo de favores entre IAs

### SIEMPRE hacer

- ✅ Citar archivo:línea exacta cuando se reporta bug
- ✅ Probar al menos el happy path antes de aprobar
- ✅ Verificar que `docs/TASKS.md` se actualizó si la tarea avanzó
- ✅ Decir "no probé X porque no tengo cómo" en lugar de fingir
- ✅ Marcar dependencias con otras tareas

---

## 7. Métricas de calidad por IA

Cada IA mantiene un log auto-reportado en `docs/METRICS_<NOMBRE_IA>.md` con:

- Tareas tomadas
- Tareas completadas (mergeadas a main)
- Tareas rechazadas (y por qué)
- Bugs propios detectados por otra IA (mejorar honestidad)
- Bugs ajenos detectados al revisar (rigor)

Esto ayuda a Joel a saber dónde cada IA es fuerte y dónde necesita más review.

---

## 8. Frecuencia de revisión

- PRs pequeños (< 100 líneas cambiadas): revisión dentro de 24 horas
- PRs medianos (100-500 líneas): revisión dentro de 48 horas
- PRs grandes (> 500 líneas): partir en sub-PRs si es posible; si no, revisión dentro de 72 horas

Si la IA revisora no puede revisar en plazo, anuncia en el PR y otra IA lo toma.

---

## 9. Cierre de PR

Una vez aprobado:

1. Squash & merge a `main` (mantener historia limpia)
2. Eliminar feature branch (limpieza)
3. Actualizar `docs/TASKS.md` con `[CERRADA]` + commit hash
4. Si cambia algo visible al usuario: agregar entrada en `CHANGELOG.md` (crear si no existe)

---

## 10. Honestidad sobre el modelo

Este protocolo asume que las 4 IAs son colaborativas y honestas. Si una IA detecta que otra está repetidamente:

- Aprobando código con bugs evidentes
- Inflando trabajo
- Ignorando comentarios

Debe documentarlo en `docs/METRICS_<NOMBRE_IA>.md` correspondiente y escalar a Joel.

Joel decide si seguir trabajando con esa IA o reemplazarla.
