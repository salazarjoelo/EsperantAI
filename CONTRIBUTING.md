# Cómo contribuir a EsperantAI

> Repo privado. Acceso compartido por las 4 IAs del equipo + Joel (owner humano).

---

## Las 4 IAs y sus áreas

| IA | Modelo | Área primaria |
|---|---|---|
| **Claude** | Anthropic Claude Sonnet 4.7 (1M context) | Coordinación técnica, refactor crítico, backend de licencias, docs técnicos |
| **ChatGPT** | OpenAI GPT-5 / GPT-4.5 | UI/UX, copy comercial, manual de usuario, video prompts, traducciones EU/LatAm |
| **DeepSeek** | DeepSeek-V3 / Coder | Performance, security, Web Workers, criptografía, CSP, tests/CI |
| **Z (GLM-4)** | Zhipu AI GLM-4 | Idiomas asiáticos (zh, ko, ja), adapters SOOP/CHZZK, adaptación cultural |

Ver `COORDINATION.md` y `docs/REVIEW_PROTOCOL.md` para protocolo completo.

---

## Modelo de acceso (elegido por Joel 2026-05-14)

Las 4 IAs corren **localmente en la máquina de Joel** usando sus credenciales de Git Credential Manager.

- **No** hay cuentas bot separadas en GitHub.
- **Toda** autoría se distingue por el trailer `Co-authored-by:` en cada commit.
- **Toda** IA debe firmar todos sus commits con su trailer correcto.

### Identidad de cada IA en commits

Cada IA fija su trailer al final del commit message:

```
Co-authored-by: Claude <noreply@anthropic.com>
Co-authored-by: ChatGPT <noreply@openai.com>
Co-authored-by: DeepSeek <noreply@deepseek.com>
Co-authored-by: Z-GLM-4 <noreply@z.ai>
```

Si una IA cobra commit de otra (ej. Claude commitea código que DeepSeek escribió y le dio aprobación), incluye AMBOS trailers:

```
Co-authored-by: Claude <noreply@anthropic.com>
Co-authored-by: DeepSeek <noreply@deepseek.com>
```

`git config user.name` y `user.email` mantienen `Joelo` y `salazarjoelo@gmail.com` — eso es **autor humano responsable legalmente** del commit. El co-author trailer es **atribución técnica de la IA que generó el código**.

---

## Flujo de commits (mismo para las 4 IAs)

### 1. Antes de empezar
- Verifica que `docs/TASKS.md` tenga la tarea con tu nombre y estado `[ABIERTA]` o `[EN PROGRESO]` con tu nombre
- Si no está, agrégala primero en un PR pequeño separado
- Si ya está y otra IA aparece como "EN PROGRESO", **NO la tomes**. Pregunta a Joel.

### 2. Branch
- Crea feature branch desde `main` siguiendo la convención:
  - `feat/<area>-<descripcion>` para nueva feature
  - `fix/<bug-id>` para bug
  - `refactor/<area>` para reorganización
  - `docs/<tema>` para sólo docs
  - `i18n/<locale>` para traducciones
  - `chore/<area>` para CI/mantenimiento
  - `security/<area>` para fixes de seguridad sensibles

Ejemplo: `feat/multi-action-ui-builder`

### 3. Trabajo
- Commit con frecuencia (atómicos por subtarea)
- Cada commit message:
  ```
  <tipo>(<scope>): <descripción corta>

  <cuerpo opcional con detalle>

  Co-authored-by: <TuNombreIA> <noreply@<proveedor>>
  ```
- Tipos válidos: `feat`, `fix`, `refactor`, `docs`, `i18n`, `chore`, `test`, `perf`, `security`

### 4. Verificación local antes de PR (Definition of Done)
- [ ] `node --check` pasa en archivos JS modificados
- [ ] `python -c "import json; json.load(open('archivo.json'))"` pasa en JSON modificados
- [ ] Si tocas UI: cargar en navegador, ver consola sin errores rojos
- [ ] Si tocas docs: links internos no rotos
- [ ] `docs/TASKS.md` actualizado con tu progreso
- [ ] Si tocas arquitectura: `docs/ARCHITECTURE.md` actualizado

### 5. PR
- Push tu branch a `origin`
- Crea PR con título siguiendo la convención:
  ```
  <tipo>(<scope>): <descripción concisa>
  ```
- Cuerpo del PR siguiendo el template de `docs/REVIEW_PROTOCOL.md` sección 3
- Cambia estado de la tarea en `docs/TASKS.md` a `[EN REVIEW]`
- Asigna revisor según matriz de `docs/REVIEW_PROTOCOL.md` sección 2
- Espera el review (24-72h según tamaño)

### 6. Después del review
- Si ✅ aprobado: Joel hace squash & merge a `main`
- Si ⚠️ cambios menores: aplicas, push fixes, esperas re-aprobación
- Si ❌ rechazado: ver `docs/REVIEW_PROTOCOL.md` sección 5 (3 rounds → escalar a Joel)

### 7. Después del merge
- Eliminar branch local + remoto
- Actualizar `docs/TASKS.md` a `[CERRADA]` + commit hash
- Si tu cambio es visible al usuario: agregar entrada a `CHANGELOG.md` (crear si no existe)

---

## Reglas inquebrantables

1. **NUNCA force push a `main`**. Repo privado no tiene branch protection pagada — la disciplina es el fusible.
2. **NUNCA mergear tu propio PR**. Joel (o IA distinta a la autora) aprueba primero.
3. **NUNCA commitear con secrets**. Si tocas claves de LemonSqueezy / Cloudflare / OAuth, usan vars de entorno o `[REDACTED]`.
4. **NUNCA inventar APIs**. Si no verificaste con docs oficiales, escribe `[NO VERIFICADO]` en el código.
5. **NUNCA aprobar PR que no entiendes**. Pregunta primero. Approve mutuo de cortesía está prohibido.

---

## Cuándo escalar a Joel

Ver `COORDINATION.md` sección 7. Resumen:
- Decisiones de pricing
- Datos personales / fiscales
- Gasto de dinero (hosting, dominios, APIs pagadas)
- Conflictos entre IAs no resueltos en 3 rounds
- Cualquier cambio en lo legal (`docs/*.html`)

---

## Cómo entrar en contexto si llegas como IA nueva

1. Lee `COORDINATION.md` (este protocolo)
2. Lee `docs/AI_BRIEFS/BRIEF_FOR_<TU_NOMBRE>.md`
3. Lee `docs/TASKS.md` tus tareas asignadas
4. Lee `docs/PRODUCT_SPEC.md` para entender el producto
5. Lee `docs/ARCHITECTURE.md` para entender la arquitectura
6. Lee los archivos específicos de tu área (ver brief)
7. Responde con `docs/AI_BRIEFS/RESPONSE_TEMPLATE.md` en `docs/AI_BRIEFS/responses/RESPONSE_FROM_<TU_NOMBRE>.md`
8. Espera a que Joel consolide en `COORDINATION_V2.md`
9. Empieza a tomar tareas siguiendo este `CONTRIBUTING.md`

---

*Documento bootstrap — pendiente revisión cruzada por ChatGPT, DeepSeek y Z/GLM-4.*

Co-authored-by: Claude <noreply@anthropic.com>
