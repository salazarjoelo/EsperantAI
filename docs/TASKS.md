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

---

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

---

### TASK-002 — Completar placeholders legales
**Hallazgo**: L-01 a L-06 de auditoría
**Estado**: `[BLOQUEADA — datos personales de Joel]`
**Asignada a**: Joel (humano) · revisión por abogado mexicano
**Descripción**:
Los docs en `docs/EULA.html`, `docs/TERMS_OF_SERVICE.html`, etc. tienen placeholders `[TU_RFC]`, `[TU_DOMICILIO]`, `[NOMBRE_FISCAL]`.

**Bloqueado hasta que Joel proporcione**:
- RFC
- Domicilio fiscal completo
- Nombre fiscal (persona física con actividad empresarial o moral)
- Confirmación con su contador sobre el modelo MoR (LemonSqueezy es Merchant of Record)

---

### TASK-003 — Configurar LemonSqueezy en producción
**Estado**: `[BLOQUEADA — cuenta y datos de Joel]`
**Asignada a**: Joel
**Descripción**: ver `docs/SETUP_VENTAS.md`. Sin esto, el botón de compra no funciona.

---

## 🟠 P1 — IMPORTANTES PARA UX/CALIDAD

### TASK-101 — UI Multi-Action Builder
**Hallazgo**: M-03 de auditoría (claim no demostrable)
**Estado**: `[CERRADA — merge de v2.1_collab por Z.ai, integrado 2026-05-14]`
**Asignada a**: ~~ChatGPT~~ Z.ai (primario) · Claude (revisión integración)
**Implementación final**:
- `core/trigger-ui-builder.js:223` botón ⚙️ por trigger
- `core/trigger-ui-builder.js:260+` modal con addAction/removeAction
- `index.html` IDs `action-modal-overlay`, `action-list`, `btn-close-action-modal`
- `locales/en-US.json` strings agregados

**Pending para ChatGPT (UX polish)**: review del modal, dropdown de acción más visual, test runtime button, drag-and-drop. Crear TASK-101b si lo amerita.

---

### TASK-102 — Calibration Wizard
**Estado**: `[ABIERTA]`
**Asignada a**: ChatGPT (UX flow) · Claude (integración detector)
**Estimación**: 2-3 días
**Descripción**:
Wizard de 4 pasos al primer inicio (o desde Advanced):
1. "Mira al centro" — captura baseline yaw/pitch/roll
2. "Mira a la izquierda" — auto-calibra threshold de yaw
3. "Inclina tu cabeza" — auto-calibra threshold de roll
4. "Haz pulgar arriba" — verifica hand detection

Resultado: thresholds personalizados por persona en `config.thresholds`.

**Archivos**: nuevo `core/calibration-wizard.js`, modal en `index.html`, strings i18n.

---

### TASK-103 — Sistema de Perfiles
**Estado**: `[CERRADA — merge de v2.1_collab por Z.ai, integrado 2026-05-14]`
**Asignada a**: ~~Claude~~ Z.ai (primario) · ChatGPT (UX polish pending)
**Implementación final**:
- `core/config-manager.js` métodos `saveProfile`, `switchProfile`, `createProfile`, `deleteProfile`
- `app.js` profile-bar UI con dropdown + botones save/new/delete
- `index.html` IDs `profile-bar`, `profile-select`, `btn-profile-save`, `btn-profile-new`, `btn-profile-delete`
- Tier gating: profile-bar oculto si `lic.hasFeature('profiles')` es false

**Pending para ChatGPT (UX polish)**: import/export JSON por perfil, preview del perfil al hover, modal de confirmación al delete.

---

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

---

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

---

### TASK-106 — Adapters SOOP + CHZZK (mercado coreano)
**Hallazgo**: feature #12 + Twitch Korea cerró feb 2024
**Estado**: `[ABIERTA]`
**Asignada a**: Z/GLM-4 (primario, ko-KR + APIs koreanas) · Claude (estructura)
**Estimación**: 5-7 días
**Descripción**:
- `platforms/platform-soop.js` (SOOP WebSocket API, docs en coreano)
- `platforms/platform-chzzk.js` (CHZZK Chat API)
- Twitch Korea cerró, 100% del mercado pasó a estas 2 plataformas

---

### TASK-107 — Traducciones completas (11 idiomas)
**Estado**: `[ABIERTA]`
**Asignada a**:
- Z/GLM-4: `zh-CN`, `ko-KR`, `ja-JP` (nativos asiáticos)
- ChatGPT: `pt-BR`, `fr-FR`, `de-DE`, `it-IT`, `ru-RU`, `pl-PL`, `ar-SA`
- Revisión cruzada: la otra IA + Joel cuando sea posible

**Archivos**: `locales/<locale>.json` (cada uno)
**Estimación**: 1-2 días por idioma

---

## 🟡 P2 — MEJORAS

### TASK-201 — Trigger History panel UI mejorada
**Estado**: `[PARCIAL]` (backend existe, UI básica existe)
**Asignada a**: ChatGPT (UX) · Claude (review)
**Mejoras pendientes**: filtros por tipo, gráfico de frecuencia, export JSON además de CSV.

### TASK-202 — Source Transform actions OBS
**Hallazgo**: feature #13
**Estado**: `[CERRADA — merge de v2.1_collab por Z.ai, integrado 2026-05-14]`
**Asignada a**: ~~Claude~~ Z.ai (primario) · DeepSeek (review pending)
**Implementación final**:
- `adapters/adapter-obs.js` métodos `SetSceneItemTransform` y `SetSceneItemCrop`
- `core/action-engine.js` tipos de acción `source_transform` y `source_crop`

### TASK-203 — Gestos secuenciales
**Hallazgo**: feature #11
**Asignada a**: Claude (lógica) · DeepSeek (perf, evitar overhead)
**Descripción**: motor de secuencias `['left', 'thumbs-up'] → action` con `maxGapMs`.

### TASK-204 — Audio Feedback configurable
**Hallazgo**: feature #15
**Asignada a**: ChatGPT (UX) · Claude (integración)
**Descripción**: panel para configurar sonido por categoría de gesto. Sonidos default en `assets/sounds/`.

### TASK-205 — Tier-based gating (Free/Pro/Pro+)
**Hallazgo**: feature #10
**Estado**: `[PARCIAL — merge de v2.1_collab integrado 2026-05-14; bloqueado por pricing de Joel]`
**Asignada a**: ~~Claude~~ Z.ai (primario) · Joel decide pricing final
**Implementación técnica**:
- `core/license-manager.js` `TIER_FEATURES` matriz con Free/Pro/Pro+
- Métodos `hasFeature(name)`, `getTier()`, `getFeatureLimit(name)`
- `app.js` aplica gating a categorías hand/gaze/emotion según tier
- Bandera oculta features Pro/Pro+ en UI si tier no las permite

**Bloqueador**: Joel debe definir precio X (Pro) y precio Y (Pro+) antes de publicar.

---

## 🟢 P3 — NICE TO HAVE

### TASK-301 — Tests automatizados + CI
**Asignada a**: Claude (primario) · DeepSeek (cobertura)
**Descripción**:
- `package.json` con scripts `test`, `lint`, `validate-json`, `validate-csp`
- Tests Vitest o similar
- Workflow `.github/workflows/ci.yml`

### TASK-302 — Conditional triggers (#18)
"Solo disparar si estoy en vivo / en horario X". Requiere integración con plataformas.

### TASK-303 — Macro Recording (#19)
Grabar secuencia de triggers y reproducirla.

### TASK-304 — Analytics Dashboard (#20)
Stats agregados de qué triggers se usan más. Requiere backend.

### TASK-305 — Cloud Config Backup
Sync via GitHub Gist u opción equivalente.

### TASK-306 — WebRTC / Remote Camera (#16)
Usar teléfono como cámara via WebRTC. Complejo, baja prioridad.

---

## Tracking

Cuando una IA tome una tarea:

1. Cambiar estado en este archivo a `[EN PROGRESO]` con su nombre y fecha
2. Crear branch siguiendo la convención
3. Trabajar, commit, push
4. Crear PR + cambiar estado a `[EN REVIEW]`
5. Otra IA revisa
6. Merge + cambiar estado a `[CERRADA]` + agregar commit hash

Ejemplo:

```markdown
### TASK-101 — UI Multi-Action Builder
**Estado**: `[EN REVIEW]` — ChatGPT, 2026-05-15, branch feat/multi-action-ui-builder, PR #3
```
