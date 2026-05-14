# Protocolo de Coordinación Multi-IA — EsperantAI

> Documento de gobernanza para que 4 IAs trabajen juntas en este repo hasta entregar producto 100% funcional comercial.

**Repo público** (mientras se construye): https://github.com/salazarjoelo/EsperantAI
**Owner humano (último decisor)**: Joel Salazar Ramírez (joel@edugame.digital)
**Estado**: trabajo en curso. NO está listo para venta comercial todavía.

---

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

---

## 1. Las 4 IAs y sus fortalezas (verificables)

| IA | Modelo / proveedor | Fortalezas documentadas | Rol asignado |
|---|---|---|---|
| **Claude** | Anthropic Claude Sonnet 4.7 (1M context) | Refactor de código grande, arquitectura, escritura técnica larga, análisis de auditoría, mantenimiento de consistencia entre archivos. Conoce el código actual línea por línea. | Coordinador técnico + backend de licencias + refactor crítico |
| **ChatGPT** | OpenAI GPT-5 (o GPT-4.5 según acceso) | UX/UI, copy de marketing, prompts visuales, brainstorming, contenido educativo, redacción comercial pulida | UX/UI components + landing copy + manual de usuario |
| **DeepSeek** | DeepSeek-V3 / DeepSeek-Coder | Código de bajo nivel, optimización de performance, security hardening, web workers, criptografía | Optimización performance + CSP hardening + Web Worker Human.js + anti-tampering |
| **Z (GLM-4)** | Zhipu AI GLM-4 | Idiomas asiáticos (chino, coreano, japonés), razonamiento multi-paso, traducción cultural | Traducciones zh-CN, ko-KR, ja-JP + adaptaciones culturales para mercado asiático |

**Importante**: ningún modelo es "el mejor en todo". Cada uno tiene un dominio asignado para evitar conflictos y aprovechar fortalezas reales.

---

## 2. Reglas de oro (NO se rompen)

1. **El owner humano (Joel) es el único decisor final.** Cualquier conflicto entre IAs se escala a él.
2. **Cada IA verifica su propio trabajo antes de proponer merge.** Linter + sintaxis + carga en navegador.
3. **NO se inventa data.** Si una IA no tiene fuente verificable, escribe `[NO TENGO DATO]`.
4. **NO se mezcla código sin review cruzada.** Mínimo 1 IA distinta debe revisar antes de merge.
5. **Los commits son atómicos por tarea.** No hay commits gigantes mezclando temas.
6. **Cada IA firma sus commits** con su nombre en el footer del commit message:
   ```
   Co-authored-by: <NombreIA> <noreply@<proveedor>>
   ```
7. **Sin force push a `main`.** Todo va por feature branches + PR.
8. **Honestidad sobre limitaciones.** Si una IA no sabe algo, lo declara explícitamente.

---

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

---

## 4. División del trabajo

Ver `docs/TASKS.md` para el backlog completo priorizado y asignaciones.

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
| Audit residuals (M-01 al M-07) | Reparto rotativo | la IA primaria + 1 más |
| Tests automatizados | Claude | DeepSeek |
| CI / package.json | Claude | DeepSeek |

---

## 5. Definition of Done (DoD)

Una tarea NO se considera completa hasta que:

- ✅ Código pasa `node --check` (sintaxis JS)
- ✅ Todos los locales JSON pasan `json.load()` en Python
- ✅ Carga en navegador sin errores en consola (verificación con preview)
- ✅ Otra IA distinta hizo review y aprobó (comentario en PR)
- ✅ Si toca UI: screenshot pegado en el PR
- ✅ Si toca seguridad: nota explícita del riesgo mitigado
- ✅ Si toca docs legales: el placeholder `[PLACEHOLDER]` está completado o explícitamente marcado para Joel
- ✅ Commit message sigue la convención + tiene `Co-authored-by`
- ✅ El PR enlaza al issue/hallazgo que resuelve

---

## 6. Sistema de review cruzada

### Cada PR debe responder por escrito en su descripción

1. **¿Qué hace este cambio?** (1 párrafo)
2. **¿Qué hallazgo de auditoría/feature resuelve?** (referencia a `docs/TASKS.md` o auditoría)
3. **¿Qué archivos toca?** (lista)
4. **¿Qué riesgos introduce?** (honestidad obligatoria)
5. **¿Cómo se verifica?** (pasos reproducibles)
6. **¿Qué dejé sin hacer y por qué?** (transparencia)

### La IA revisora debe responder

1. **¿El cambio cumple lo que dice resolver?**
2. **¿Encontré bugs nuevos?** (con archivo:línea exacta)
3. **¿Hay regresión en algo más?**
4. **¿La documentación se actualizó?**
5. **Veredicto**: ✅ Aprobado · ⚠️ Aprobado con cambios menores · ❌ Rechazado con razones

---

## 7. Escalamiento a Joel

Cuando una IA debe escalar al humano:

- Decisiones de pricing
- Datos personales (RFC, dirección fiscal, datos bancarios)
- Configuración de cuentas externas (LemonSqueezy, Cloudflare, dominios)
- Aprobación de docs legales (mínimo abogado mexicano antes de publicar)
- Conflictos no resueltos entre IAs después de 1 round de discusión
- Cualquier cosa que cueste dinero real

Las IAs NUNCA toman estas decisiones por sí solas.

---

## 8. Honestidad sobre el estado actual

Al momento de creación de este documento (2026-05-14), el repo:

- ✅ Tiene arquitectura modular limpia
- ✅ Pasa Sprint 0 P0 (bugs críticos resueltos)
- ✅ Pasa Sprint 1 (seguridad comercial parcial)
- ✅ Modelos Human.js + Socket.IO empaquetados localmente
- ✅ **Repo PRIVADO** (cambio 2026-05-14) — el JS sigue siendo visible para quien compre, pero ya no público
- ⚠️ License Manager se puede bypass por diseño cliente-only (hallazgo C-05 pendiente — TASK-001)
- ⚠️ Docs legales tienen placeholders `[TU_RFC]`, etc. (Joel debe completar)
- ⚠️ Sin branch protection en `main` — cuenta GitHub Free no la permite en repo privado (requiere Pro $4/mes; opcional)
- ❌ NO está listo para venta comercial todavía

**Recomendación de la auditoría**: beta cerrada con usuarios confiables antes de venta pública.

---

## 9. Modelo de acceso al repo (privado desde 2026-05-14)

Las 4 IAs **corren localmente en la máquina de Joel** y usan sus credenciales de Git Credential Manager para push/pull. **No hay cuentas bot separadas en GitHub.**

### Autoría técnica
Cada IA distingue sus commits con el trailer `Co-authored-by:`:
- `Co-authored-by: Claude <noreply@anthropic.com>`
- `Co-authored-by: ChatGPT <noreply@openai.com>`
- `Co-authored-by: DeepSeek <noreply@deepseek.com>`
- `Co-authored-by: Z-GLM-4 <noreply@z.ai>`

`git config user.name` permanece `Joelo` y `user.email` permanece `salazarjoelo@gmail.com` (responsable legal del commit). El co-author es atribución técnica.

### Flujo concreto
Ver `CONTRIBUTING.md` en la raíz del repo.

### Sin branch protection server-side
Plan GitHub Free no permite branch protection en repos privados. Las salvaguardas son:
- Disciplina del protocolo (ver `docs/REVIEW_PROTOCOL.md`)
- Ninguna IA mergea su propio PR (siempre Joel o IA distinta)
- Sin force push a `main` (regla inquebrantable de `CONTRIBUTING.md`)
- Joel puede activar branch protection cuando suba a GitHub Pro

---

## 10. Archivos clave de coordinación

| Archivo | Propósito |
|---|---|
| `COORDINATION.md` (este) | Protocolo de trabajo entre IAs |
| `CONTRIBUTING.md` (raíz) | Flujo concreto de commits + Co-author |
| `docs/TASKS.md` | Backlog priorizado con asignaciones |
| `docs/REVIEW_PROTOCOL.md` | Cómo revisarse cruzado (detalle) |
| `docs/AI_BRIEFS/README.md` | Kickoff multi-IA + briefs individuales |
| `docs/AI_BRIEFS/BRIEF_FOR_*.md` | Brief específico por IA |
| `docs/AI_BRIEFS/RESPONSE_TEMPLATE.md` | Formato de respuesta unificado |
| `docs/AI_BRIEFS/responses/RESPONSE_FROM_*.md` | Respuestas de cada IA al kickoff |
| `docs/USER_MANUAL.md` | Manual de usuario final |
| `docs/VIDEO_SCRIPTS.md` | Prompts para crear videos explicativos |
| `docs/PRODUCT_SPEC.md` | Especificación del producto (verificable) |
| `docs/ARCHITECTURE.md` | Arquitectura técnica |
| `docs/SETUP_VENTAS.md` | Playbook para Joel sobre LemonSqueezy |
| `docs/EsperantAI_Auditoria_Compliance_v2_1.md` | Auditoría senior externa (referencia) |

---

*Documento bootstrap creado por Claude. Editable por cualquier IA con PR + review.*

Co-authored-by: Claude <noreply@anthropic.com>
