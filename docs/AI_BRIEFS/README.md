# Kickoff de Coordinación Multi-IA — EsperantAI

> Briefs individuales para que cada IA del equipo (Claude, ChatGPT, DeepSeek, Z/GLM-4) entregue su análisis del repo y su propuesta de cómo trabajar en conjunto.

**Owner**: Joel Salazar (joel@edugame.digital)
**Repo**: https://github.com/salazarjoelo/EsperantAI (privado)
**Fecha de kickoff**: 2026-05-14

---

## Por qué este kickoff

El repo tiene 4 IAs asignadas (ver `COORDINATION.md`). Cada una tiene fortalezas verificables distintas. Antes de que cada una se ponga a generar código, **cada IA debe**:

1. **Leer el repo** completo (al menos los archivos de su área).
2. **Auditar** lo hecho hasta ahora en su área desde su perspectiva.
3. **Proponer cómo coordinarse** con las otras 3 IAs (no asumir).
4. **Declarar limitaciones honestas** (qué no puede hacer bien).
5. **Listar lo que necesita** de las otras 3 para ejecutar.

Las respuestas se consolidan en `docs/AI_BRIEFS/responses/` y se vuelven la **versión 2.0 de `COORDINATION.md`** después de que Joel apruebe.

---

## Cómo usar este directorio

| Archivo | Para quién | Qué hacer |
|---|---|---|
| `README.md` (este) | Joel + las 4 IAs | Overview |
| `BRIEF_FOR_CHATGPT.md` | ChatGPT | Joel copia/pega su contenido en chat.openai.com. ChatGPT responde según `RESPONSE_TEMPLATE.md` y Joel guarda la respuesta en `responses/RESPONSE_FROM_CHATGPT.md` |
| `BRIEF_FOR_DEEPSEEK.md` | DeepSeek | Mismo flujo. Joel pega en chat.deepseek.com |
| `BRIEF_FOR_Z_GLM4.md` | Z/GLM-4 | Mismo flujo. Joel pega en chat.z.ai |
| `BRIEF_FROM_CLAUDE.md` | Las otras 3 IAs | Mi tarjeta de presentación: qué hago bien, qué hago mal, qué necesito |
| `RESPONSE_TEMPLATE.md` | Las 4 IAs | Formato común de respuesta para que sea consolidable |

---

## Reglas para responder

Estas aplican a las 4 IAs (incluyo a Claude — el primer commit con esta estructura es mío y aún espera revisión cruzada).

1. **No inventar capacidades técnicas que no se verifican.** Si no sabes cómo funciona la API de CHZZK, di "no tengo dato verificado".
2. **No inflar limitaciones para sonar humilde.** Si sí sabes algo, dilo con seguridad.
3. **Citar archivo:línea cuando se reporta bug.**
4. **No tomar decisiones de pricing, datos personales o gasto de Joel.** Esas escalan.
5. **Honestidad sobre uso de fuentes**: si copiaste de Stack Overflow, dilo. Si fue de docs oficiales, link.

---

## Output esperado de cada IA

Cada respuesta debe contener (en este orden):

1. **Auto-evaluación honesta** (qué hace bien, qué hace mal)
2. **Auditoría del repo en su área** (5-15 hallazgos concretos con archivo:línea)
3. **Propuesta de plan de trabajo de las próximas 4 semanas** en su área
4. **Modelo de coordinación con las otras 3 IAs** (qué espera recibir, qué entregará)
5. **Dependencias bloqueantes** (qué necesita de Joel o de otra IA para empezar)
6. **Métricas de éxito proponibles** (cómo medimos que esa IA está haciendo bien su trabajo)

Formato: markdown. Extensión: 800-2,500 palabras (no menos, no más).

---

## Después de las 4 respuestas

Claude (coordinador técnico) consolida en `COORDINATION_V2.md`:
- Áreas donde las 4 IAs están alineadas
- Conflictos (ej: ChatGPT propone X, DeepSeek propone Y incompatible) → escala a Joel
- Plan unificado de 4 semanas con responsables y dependencias
- Cualquier decisión que requiera Joel (pricing, hosting, datos)

Joel aprueba el plan unificado → cada IA empieza a tomar tareas de `TASKS.md`.

---

*Documento bootstrap creado por Claude. Espera ratificación de las otras 3 IAs.*
