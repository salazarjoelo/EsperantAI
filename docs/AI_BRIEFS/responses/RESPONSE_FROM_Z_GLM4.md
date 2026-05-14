# Respuesta de Z.ai — EsperantAI Kickoff (v2 — Post-Decisions)

> **Fecha**: 2026-05-14 (v2 updated with Joel's decisions)
> **Modelo**: Z.ai Code
> **Rol asignado**: Traducciones zh-CN/ja-JP + Cultural Review + GASSHO Implementation
> **Co-authored-by**: Z-GLM-4 <noreply@z.ai>
> **Cambios vs v1**: Integradas las decisiones de Joel del 2026-05-14; ko-KR → stub; SOOP/CHZZK → v1.5; Backend → Hostinger VPS; GASSHO → approved

---

## Sección 0 — Aceptación de la Misión-Norte

**EsperantAI DEBE SER LA HERRAMIENTA QUE FACILITE Y MEJORE LOS STREAMINGS Y DÉ NUDGES A LA MONETIZACIÓN DE LOS STREAMERS.**

Filtro auto-aplicado a mis propuestas:

| Propuesta | ¿Facilita? | ¿Mejora? | ¿Nudge monetización? |
|-----------|-----------|----------|---------------------|
| Completar 49 keys faltantes en zh-CN/ja-JP locales | Sí — UI rota sin ellas | Sí — experiencia nativa | Indiferente |
| Cultural review de gestos + GASSHO | Indiferente | Sí — evita ofensas | Sí — gesto ofensivo = streamer pierde audiencia |
| SOOP/CHZZK adapters | Sí — mercado sin Twitch | Sí — reacciones a star balloons | **Sí** — nudge a star balloons = monetización directa |
| Adaptación monetización Asia (CN/JP) | Indiferente | Sí — UI culturalmente apropiada | **Sí** — sin método de pago local = cero ventas |

---

## DECISIONES DE JOEL (2026-05-14)

Las siguientes decisiones fueron tomadas por Joel el 2026-05-14 y modifican el alcance de v1.0:

### Decisión 1: SKIP Korea en v1.0

- **No hay partner SOOP** registrado ni acceso a la API.
- **No hay CHZZK** — el adapter se pospone.
- **ko-KR** permanece como **stub** (solo estructura, sin traducción activa para v1.0).
- **Solo zh-CN y ja-JP** son locales objetivo en v1.0.
- Korea se reevalúa para **v1.5** cuando haya partner SOOP y CHZZK esté viable.

### Decisión 2: Backend — VPS Hostinger (187.77.23.49)

- Se usará el **VPS Hostinger** para cualquier necesidad de backend.
- Aplicaciones inmediatas: **TASK-001** (backend licenses), futuro **CHZZK proxy** en v1.5.
- **No se usa Cloudflare Workers** para ningún componente de backend.
- La IP del VPS es `187.77.23.49`.

### Decisión 3: GASSHO 🙏 APPROVED para v1.0

- El gesto 🙏 (gassho / prayer-hands / 合掌) está **aprobado para implementación completa** en v1.0.
- Se necesita una **propuesta de implementación completa** que incluya **heurísticas de Human.js** para detectar manos juntas frente al pecho.
- La propuesta detallada está en **CULTURAL_GESTURE_REVIEW.md v2.0**.
- Este gesto es de **alto ROI** para los mercados de China y Japón.

### Decisión 4: Solo zh-CN y ja-JP en v1.0

- El alcance de locales se reduce a **2 locales CJK** (zh-CN + ja-JP).
- ko-KR se mantiene como stub estructural para facilitar su activación futura en v1.5.
- Esto simplifica el testing, la review cultural y la coordinación de traducciones.

---

## Sección 1 — Estado y honestidad

### ¿Quién soy?

Soy **Z.ai Code**, el asistente de coding de Zhipu AI. Claude me asignó el rol "Z/GLM-4" en los documentos de coordinación. Tengo capacidades en idiomas asiáticos (chino, japonés) y acceso a documentación técnica, pero debo ser honesto:

- ✅ **Puedo hacer**: Traducciones técnicas zh-CN/ja-JP, review cultural de gestos, análisis de APIs asiáticas, código de adapters, implementación de GASSHO
- ⚠️ **Limitación**: No tengo contexto de streamers 2026 en tiempo real. Mis insights culturales vienen de entrenamiento, no de observación directa de Bilibili/SOOP/CHZZK hoy
- ❌ **No puedo**: Verificar datos de precios locales que no estén en fuentes públicas accesibles

### Estado de mis entregables

| Entregable | Estado | Notas |
|-----------|--------|-------|
| docs/CULTURAL_GESTURE_REVIEW.md v2.0 | ✅ Completado | 1081+ líneas, review de 25 gestos + propuesta GASSHO con heurísticas Human.js |
| PR i18n/zh-ja-full-translation | ✅ Completado | 49 keys agregadas en zh-CN y ja-JP, 193/193 keys |
| ko-KR locale | 🔵 Stub | Estructura mantenida, sin traducción activa para v1.0. Se activará en v1.5 |
| docs/SPEC_SOOP_CHZZK.md | ✅ Completado | 877 líneas — **en standby para v1.5** (no se implementa en v1.0) |
| GASSHO implementation proposal | ✅ Approved | Propuesta con heurísticas Human.js en CULTURAL_GESTURE_REVIEW.md v2.0 |
| Secciones 1,5,6,7,8 RESPONSE v2 | ✅ Completado | Actualizado con decisiones de Joel 2026-05-14 |

### Alcance simplificado v1.0

| Componente | v1.0 | v1.5 (futuro) |
|-----------|------|---------------|
| Locales CJK | zh-CN, ja-JP | + ko-KR (traducción completa) |
| Platform adapters | — | SOOP adapter, CHZZK adapter |
| Backend | Hostinger VPS (TASK-001 licenses) | + CHZZK proxy en VPS |
| Gesto cultural | 🙏 GASSHO | — |
| Korea market | — | Partner SOOP + PIPA compliance |

---

## Sección 2 — Auditoría

### 2.1 Estado real de los locales CJK

**🔴 CRÍTICO: Los locales CJK dicen `completion: 100` pero FALTAN 49 keys cada uno.**

> **Nota v2**: Solo zh-CN y ja-JP se completan en v1.0. ko-KR permanece como stub.

| Locale | Leaf keys en-US | Leaf keys local | Faltantes | `_meta.completion` | Real | v1.0 Acción |
|--------|-----------------|-----------------|-----------|-------------------|------|-------------|
| zh-CN | 193 | 144 | 49 | 100 ❌ | ~75% | Completar 49 keys |
| ja-JP | 193 | 144 | 49 | 100 ❌ | ~75% | Completar 49 keys |
| ko-KR | 193 | 144 | 49 | 100 ❌ | ~75% | **Stub — no se completa en v1.0** |

**Secciones completas que NO EXISTEN en ninguno de los 3 locales:**

1. **`actions.*`** (18 keys) — Nombres de los 18 tipos de acción (scene_switch, play_sound, notification, etc.). Sin estas keys, el Multi-Action Builder muestra nombres en inglés siempre.
2. **`history.*`** (5 keys) — Panel de Trigger History. Los botones "Clear", "Export CSV", etc. muestran inglés.
3. **`license.*`** (10 keys) — Modal de activación, tier labels, feature locked. El modal de compra aparece en inglés para usuarios asiáticos.
4. **`profiles.*`** (8 keys) — Sistema de perfiles. Botones "Save", "New", "Delete" en inglés.
5. **`sensitivity.dead_zone_*` + `return_to_center`** (4 keys) — Sliders de dead zone sin etiquetas.

**Impacto**: El sistema `i18n.js` hace fallback a `en-US` para keys faltantes, así que no crashea. Pero un streamer chino/japonés ve una mezcla de su idioma + inglés — percibido como "app occidental barata traducida con Google". Exactamente lo que el brief dice que debemos evitar.

**Acción inmediata v1.0**: Corregir `_meta.completion` a 75 y completar las 49 keys en zh-CN y ja-JP únicamente.

### 2.2 Cultural Review de los 18 gestos

He analizado los 25 triggers en `TRIGGER_CATALOG` (trigger-ui-builder.js líneas 26-63). Aquí mi review gesto por gesto:

> **Nota v2**: El review cultural ahora se centra en China y Japón (mercados v1.0). Las notas para Korea se mantienen documentadas para v1.5.

#### Gestos universales (head/distance/gaze/emotion/blink) — APROBADO ✅

Los 18 triggers biológicos están correctamente marcados `universal: true`. Ekman 1972 es válido. Rotación de cabeza, gaze, distancia, emociones básicas, y double blink son genuinamente universales.

**Un caveat**: `angry` (😠) como trigger es universal como expresión, pero en Japón, mostrar enojo en stream se considera "怖い" (kowaï, scary) y puede alejar viewers. Un nudge de "angry → celebration overlay" podría ser contraproducente en VTubers japoneses. No es un bug del código, pero el manual de usuario debería advertirlo.

#### Gestos culturales (hand) — REQUIERE ACTUALIZACIÓN 🟠

| # | Gesto | Badge actual | Mi evaluación para CN/JP | culturalNote actual | culturalNote CJK faltante |
|---|-------|-------------|----------------------|---------------------|--------------------------|
| 1 | 👍 thumbs-up | `cultural` ✅ | **Neutral-positivo en CN/JP**. En China y Japón es universalmente comprendido como "bueno/aprobación" en contexto digital. Ofensivo solo en Irán/Iraq/parte de Grecia. | Solo menciona Medio Oriente | Debe agregar: "En China/Japón: positivo y común. Evitar en Irán/Iraq." |
| 2 | ✌️ peace | `cultural` ✅ | **Positivo en CN/JP**. En Japón, "ピース" (piisu) es EL gesto de foto más común. La connotación ofensiva (UK/AU palma adentro) NO aplica en Asia. | Solo menciona UK/AU/NZ | Debe agregar: "En Japón/China: gesto de foto positivo. Ofensivo solo en UK/AU/NZ con palma adentro." |
| 3 | 🤘 rock | `cultural` ✅ | **Neutral en CN/JP**. No es ofensivo, pero tampoco es comúnmente usado. En Japón, subcultura metal existe. En China, la mayoría de viewers no reconocerá el gesto. | Solo menciona Italia | Debe agregar: "En Asia: gesto nicho (metal). Viewers no-metal puede no reconocerlo." |
| 4 | 👌 OK | `cultural` ✅ | **⚠️ CAVEAT en Japón**. En Japón, este gesto significa "お金" (dinero/moneda), NO "OK". Esto es importante: si un streamer usa 👌 para "OK" y un viewer japonés lo interpreta como "dinero", hay confusión. En Brasil/Turquía es ofensivo. | Solo menciona Brasil/Turquía/Alemania | **Debe agregar**: "⚠️ En Japón: significa DINERO, no OK. En Brasil/Turquía: ofensivo." |
| 5 | ✊ fist | `cultural` ✅ | **Contexto-dependiente en CN/JP**. En Japón, "ガッツ" (guts/determinación) es positivo. En China, puede asociarse con protesta. | "Significado político variable" | Debe agregar: "En Japón: determinación positiva. En China: puede asociarse con protesta." |
| 6 | 🖐️ open-palm | `cultural` ✅ | **Generalmente "stop" en CN/JP**. En Japón, puede asociarse con "お岩さん" (Oiwa-san, fantasma con mano extendida). | Solo menciona Grecia (mountza) | Debe agregar: "En Japón: puede asociarse con folklore de fantasmas. En Grecia: mountza." |
| 7 | ☝️ point | `cultural` ✅ | **⚠️ OFENSIVO en CN/JP**. Apuntar con el índice a personas es grosero en TODAS las culturas de Asia Oriental. En Japón, se usa la mano abierta para señalar. Este es el gesto de mayor riesgo para streamers asiáticos. | Menciona "muchas culturas asiáticas" brevemente | **Debe ampliar**: "⚠️ Alto riesgo en Asia: apuntar con el dedo es grosero en Japón/China. Señalar con mano abierta es la alternativa culturalmente correcta." |

### 2.3 Gesto GASSHO 🙏 — APPROVED para v1.0

**🙏 "gassho" / prayer-hands / 合掌**

Este gesto es extremadamente común en:
- **Japón**: "お願い" (onegai, por favor), "ありがとう" (arigatou, gracias), "すみません" (sumimasen, disculpa). Es EL gesto de cortesía japonés.
- **China**: "拜托" (baituo, por favor), "感谢" (ganxie, gracias).

**Estado v2**: ✅ **APROBADO por Joel para v1.0**. La propuesta completa de implementación con heurísticas de Human.js está en **CULTURAL_GESTURE_REVIEW.md v2.0**.

**Implementación requerida**:
- Heurísticas de detección en Human.js (manos juntas frente al pecho)
- Entrada en `TRIGGER_CATALOG` con badge `cultural`
- culturalNotes para zh-CN y ja-JP
- Animación/overlay asociado al gesto

**ROI esperado**: El gesto de mayor valor cultural para los mercados de China y Japón. Un streamer que puede usar 🙏 como trigger de agradecimiento por donaciones tiene un nudge natural de monetización culturalmente apropiado en ambos mercados.

### 2.4 Strings intraducibles o que requieren adaptación

> **Nota v2**: Solo se listan adaptaciones para zh-CN y ja-JP (v1.0 scope).

| Key en-US | Problema | Adaptación propuesta |
|-----------|----------|---------------------|
| `app.tagline` = "Honest gestures." | "Honest" no tiene la misma resonancia en CJK. En chino, "真诚" (sincero) funciona. En japonés, "正直" (shoujiki) suena rígido. | zh-CN: "真诚的手势" (ya está, OK). ja-JP: "真心のジェスチャー" (maggokoro = corazón verdadero, más cálido que shoujiki). |
| `platforms.events.cheer_bits` | "Bits / Cheer" es 100% Twitch. En CJK no existe. | zh-CN: "比特 / 助威" (ya está, OK). ja-JP: "ビッツ / チア" (transliteración, OK). |
| `platforms.events.donation` | "Donation" ≠ "打赏" (dashang, China) ≠ "投げ銭" (nage-sen, Japón) | Ambos locales ya usan los términos correctos ✅ |
| `errors.obs_unreachable` menciona "Tools → WebSocket Server Settings" | Este path de menú es de OBS en inglés. En OBS CJK localizado, el path es diferente. | zh-CN: "工具 → WebSocket 服务器设置" (ya traducido, OK). ja-JP: "ツール → WebSocketサーバー設定" (OK). |
| `scenes.scene_unassigned` = "— (disabled) —" | "disabled" suena técnico. | Los locales CJK ya usan adaptaciones más naturales ✅ |

### 2.5 Layout CJK — Riesgo de UI rota

**Problema potencial**: Los caracteres CJK son ~2x más anchos que los latinos. En UIs diseñadas para inglés:
- Labels de sliders pueden desbordar
- Tooltips pueden cortarse
- Los dropdowns de escena pueden ser demasiado estrechos

**Verificación necesaria**: No puedo verificar visualmente sin correr la app, pero recomiendo que Joel abra la app con locale `ja-JP` y verifique específicamente:
1. La sección `sensitivity` con labels largos como "ヨー（左右回転）"
2. Los tooltips de `culturalNote`
3. El menú de `advanced` con hints multi-línea

### 2.6 Bug encontrado en trigger-engine.js (hysteresis pitch)

**🟠 Bug en `_evaluateContinuous()` líneas 182-189**:

La lógica de hysteresis para pitch tiene un error de dirección de comparación:

```javascript
// LÍNEA 184: "Already in 'up' zone: stay if pitch < exitUp"
if (this.activeZones.pitch === 'up' && pitch < exitUp) {
    return { trigger: 'up', label: 'up' };
}
// LÍNEA 187: "Already in 'down' zone: stay if pitch > exitDown"
if (this.activeZones.pitch === 'down' && pitch > exitDown) {
    return { trigger: 'down', label: 'down' };
}
```

**El problema**: En Human.js, pitch negativo = mirar arriba, pitch positivo = mirar abajo. El threshold `pitchUp` es negativo y `pitchDown` es positivo. Cuando `activeZones.pitch === 'up'` y el usuario está volviendo al centro, `pitch` sube (se acerca a 0). La condición `pitch < exitUp` (donde exitUp = pitchUp * 0.6, que es un número negativo MENOS extremo) se cumple mientras pitch esté más abajo que exitUp. Esto parece correcto para MANTENER la zona "up".

**PERO**: Si `pitchUp` es negativo y `hysteresisFactor = 0.6`, entonces `exitUp = pitchUp * 0.6` es un número negativo MENOS extremo (más cerca de cero). Ejemplo:
- `pitchUp = -0.3` → `exitUp = -0.3 * 0.6 = -0.18`
- Si pitch = -0.22, estamos en zona "up", pitch < exitUp (-0.22 < -0.18) → true → stay in "up" ✅
- Si pitch = -0.10, pitch < exitUp (-0.10 < -0.18) → false → leave "up" ✅

**Re-análisis**: Después de revisar con cuidado, la lógica parece correcta para el caso de pitch negativo. Pero hay un edge case:

**Si `pitchUp` es positivo** (algunos configs lo definen así), la lógica se invierte. El código asume `pitchUp < 0` y `pitchDown > 0`. Si un usuario configura `pitchUp` como positivo, la hysteresis se rompe. Recomiendo que DeepSeek verifique este edge case en su análisis.

---

## Sección 3 — Plan de 4 semanas

> **Nota v2**: El plan se actualiza para reflejar el alcance simplificado de v1.0 (solo zh-CN + ja-JP, sin SOOP/CHZZK, con GASSHO). SOOP/CHZZK se posponen a v1.5.

### Semana 1: Fundamentos zh-CN + ja-JP

| Días | Tarea | Entregable |
|------|-------|------------|
| D1-D2 | TASK-107 parcial: Completar 49 keys faltantes en zh-CN.json | PR `i18n/zh-CN-complete-49-keys` |
| D3-D4 | TASK-107 parcial: Completar 49 keys faltantes en ja-JP.json | PR `i18n/ja-JP-complete-49-keys` |
| D5 | Verificar ko-KR como stub (estructura intacta, sin traducción activa) | Confirmación de stub |

**Prioridad**: 🔴 P0 — Sin estas keys, los 2 locales están rotos para features nuevas (license, actions, profiles, history).

### Semana 2: Cultural Review + GASSHO Implementation

| Días | Tarea | Entregable |
|------|-------|------------|
| D1-D2 | Actualizar `culturalNote` en `TRIGGER_CATALOG` con contexto CN/JP | PR `feat/cultural-notes-cn-jp` |
| D3-D5 | TASK-GASSHO: Implementar heurísticas de detección de 🙏 en Human.js + entrada en TRIGGER_CATALOG | PR `feat/gassho-gesture` |

**Nota sobre GASSHO**: La implementación completa (heuristic detection, TRIGGER_CATALOG entry, culturalNotes, overlay) está propuesta en CULTURAL_GESTURE_REVIEW.md v2.0.

### Semana 3: Adaptaciones culturales de monetización CN/JP

| Días | Tarea | Entregable |
|------|-------|------------|
| D1-D3 | Adaptaciones culturales de monetización en i18n (solo zh-CN, ja-JP) | PR `i18n/cn-jp-monetization-nudge-strings` |
| D4-D5 | TASK-001: Backend en Hostinger VPS (187.77.23.49) para licenses | PR `feat/license-backend-hostinger` |

### Semana 4: Integración + Testing

| Días | Tarea | Entregable |
|------|-------|------------|
| D1-D3 | Integración testing: GASSHO gesture + cultural notes + monetización CN/JP | Test report |
| D4-D5 | Review cruzada con Claude + preparación para beta CN/JP | Review completo |

### Viabilidad de plataformas asiáticas — Actualización v2

| Plataforma | v1.0 | v1.5+ | Razón |
|-----------|------|-------|-------|
| **SOOP** (ex-AfreecaTV) | ❌ Pospuesto | ✅ Implementar | Requiere partner registration — Joel debe registrar cuenta de socio antes de implementar |
| **CHZZK** (Naver) | ❌ Pospuesto | ✅ Implementar | Requiere proxy backend (Hostinger VPS) + OAuth clientSecret |
| **Bilibili Live** | ❌ No | v4.0 | Requiere backend: CORS restrictions, cookie-based auth |
| **Douyin Live** | ❌ No | v4.0 | Reverse-engineered API, signature server necesario |
| **Niconico Live** | ❌ No | Investigar | Live2 API existe, pero requiere auth token con backend para OAuth |

---

## Sección 4 — Coordinación con las otras IAs

### ¿Cómo prefiero recibir review de mis PRs de traducción?

1. **Review estructural por Claude** primero: verificar que no rompo el sistema de fallback de `i18n.js`, que las keys son válidas JSON, que no hay comillas sin escapar.
2. **Review de nativo humano** cuando sea posible: las traducciones CJK generadas por IA siempre necesitan ojos humanos. Si Joel no tiene acceso a nativos, al menos un streamer CN/JP beta-tester debería revisar antes de lanzamiento.

### ¿Qué necesito de ChatGPT?

- **Coordinación de tono**: Si ChatGPT traduce los locales europeos (pt-BR, fr-FR, de-DE, etc.) en un tono formal/casual, yo debo mantener consistencia en CJK. Acordemos el nivel de formalidad:
  - zh-CN: 中性偏正式 (neutral-formal) — estándar Bilibili
  - ja-JP: です/ます調 (desu/masu, formal) — estándar VTuber japonés
- **Nada técnico** de ChatGPT.

### ¿Qué necesito de DeepSeek?

- **Cero interacción directa** para mi trabajo de i18n.
- Pero si DeepSeek trabaja en Web Worker (TASK-104), necesito que los mensajes de error del Worker estén en `en-US.json` primero, y yo los traduzco después.

### ¿Qué necesito de Claude?

- **Review de que mis PRs no rompan `i18n.js`**: específicamente la cadena de fallback, el `_lookup()`, y el `_interpolate()`.
- **Coordinación en `TRIGGER_CATALOG`**: si Claude cambia la estructura de los triggers, necesito saber antes de traducir. Especialmente importante ahora con la adición de GASSHO.
- **GASSHO heurísticas**: Coordinación sobre cómo integrar la detección de manos juntas en el pipeline de Human.js sin romper los gestos existentes.

---

## Sección 5 — Dependencias y bloqueadores

### Decisiones que Joel debe tomar (v1.0 scope)

1. **Pricing por mercado CN/JP**: ¿USD global via LemonSqueezy, o precios locales?
   - Si USD: más simple, pero los streamers chinos/japoneses pagan con tarjeta internacional (poco común en China)
   - Si precios locales: necesito gateway local (ver sección 6)

2. **GASSHO implementación**: Confirmar las heurísticas propuestas en CULTURAL_GESTURE_REVIEW.md v2.0 antes de escribir código.

### Decisiones diferidas a v1.5

3. **SOOP partner registration**: Joel DEBE registrar una cuenta de socio SOOP antes de implementar el adapter. Esto es un bloqueador HARD para Korea.
4. **CHZZK OAuth + proxy**: Se necesitará el Hostinger VPS (187.77.23.49) como proxy para intercambio de tokens CHZZK. El `clientSecret` NO puede estar en browser.
5. **PIPA compliance (Korea)**: Ley de protección de datos coreana requiere revisión legal antes de procesar datos de usuarios coreanos. Diferido a v1.5.
6. **ko-KR traducción completa**: Activar cuando se confirme entrada al mercado coreano.

### Lo que YA completé

- ✅ Completar 49 keys faltantes en zh-CN y ja-JP locales (TASK-107) → 193/193 keys en zh-CN, ja-JP
- ✅ docs/CULTURAL_GESTURE_REVIEW.md v2.0 con dictamen cultural + propuesta GASSHO con heurísticas Human.js
- ✅ docs/SPEC_SOOP_CHZZK.md con investigación de APIs SOOP y CHZZK (en standby para v1.5)
- ✅ ko-KR stub mantenido (estructura JSON válida, sin traducción activa)

### Infraestructura backend

- **Hostinger VPS** (187.77.23.49) será usado para:
  - TASK-001: Backend de activación de licenses
  - v1.5: CHZZK OAuth proxy (intercambio de tokens)
- **No se usa Cloudflare Workers** — Joel decidió VPS Hostinger como única infraestructura de backend.

### Bloqueadores v1.0 (solo CN/JP)

1. **LemonSqueezy + Alipay/WeChat Pay**: Verificar si LemonSqueezy soporta métodos de pago chinos. Sin Alipay/WeChat Pay, el mercado chino es inaccesible vía LemonSqueezy.
2. **Review humano zh-CN/ja-JP**: Traducciones AI necesitan ojos de nativo antes de lanzamiento comercial.

---

## Sección 6 — Monetización y Pricing en Asia (v1.0: China + Japón)

> **Nota v2**: Korea se difiere a v1.5. El análisis de monetización se centra en China y Japón para v1.0. KakaoPay/Naver Pay se removerán del scope v1.0.

### Patterns de "nudges a monetización" culturalmente aceptables

#### 🇯🇵 Japón

| Pattern | Aceptable | Ejemplo |
|---------|-----------|---------|
| Super Chat overlay | ✅ Muy aceptable | YouTube Super Chat es el estándar |
| "投げ銭" (tip-throwing) overlay sutil | ✅ Aceptable | Mostrar animación cuando llega tip, sin texto agresivo |
| "お返し" (okaeshi, return gift) nudge | ✅ Muy aceptable | "🎁 Recibiste un tip → reacciona con un gracias" — el streamer RECIBE nudge a agradecer, NO el viewer a pagar más |
| Contador de tips visible | ⚠️ Neutral | Aceptable si es sutil, agresivo si es grande/parpadeante |
| "¡Dona más!" overlay agresivo | ❌ Vulgar | Percibido como "下品" (geihin, vulgar). Daña reputación del streamer |
| Banner de meta de tips | ⚠️ Con cuidado | Si es "meta para mejorar el stream" OK. Si es "meta para ganar dinero" grosero |
| 🙏 GASSHO como trigger de agradecimiento | ✅ Muy aceptable | Streamer junta manos → overlay de gracias. Culturalmente perfecto para Japón |

**Insight clave**: En Japón, la reciprocidad (お返し) es fundamental. El nudge correcto no es "paga más", es "agradece lo que recibiste". EsperantAI debería nudgear al **streamer** a reaccionar, no al viewer a pagar. GASSHO es el vehículo ideal para este nudge.

#### 🇨🇳 China

| Pattern | Aceptable | Ejemplo |
|---------|-----------|---------|
| 打赏 (dashang, tip) celebration | ✅ Estándar | Animación de regalo virtual — universal en Bilibili/Douyin |
| Gift leaderboard | ✅ Aceptable | Estándar en todas las plataformas chinas |
| "Guardián" / fan club tiers | ✅ Muy aceptable | Estándar Bilibili — los viewers compiten por estatus |
| Push directo para más pagos | ⚠️ Regulatoriamente riesgoso | China tiene leyes estrictas sobre protección de menores y límites de gasto en streaming |
| 🙏 GASSHO como trigger de agradecimiento | ✅ Aceptable | "感谢" (ganxie, gracias) — gesto de cortesía y agradecimiento |

**Insight clave**: En China, monetización via **estatus social** (leaderboard, fan titles) es más efectiva y menos riesgosa que pedir dinero directamente.

#### 🇰🇷 Korea — DIFERIDO A v1.5

> Los patterns de monetización coreanos (별풍선, 애청자 감사, KakaoPay, Naver Pay) están documentados en SPEC_SOOP_CHZZK.md y se abordarán cuando se implemente el market entry de Korea en v1.5.

### Métodos de pago locales — ¿LemonSqueezy cubre? (v1.0: CN/JP)

| Mercado | Método preferido | ¿LemonSqueezy lo soporta? | Alternativa |
|---------|-----------------|--------------------------|-------------|
| 🇨🇳 China | Alipay, WeChat Pay | **❌ [NO TENGO DATO]** — LemonSqueezy dice "global MoR" pero no he verificado si incluye Alipay/WeChat Pay específicamente | Si no: Paddle + Stripe China, o precio en USD con tarjeta internacional (muy pocos streamers chinos tienen esto) |
| 🇯🇵 Japón | Credit card, PayPay, LINE Pay | ⚠️ Probable — LemonSqueezy soporta JPY | Verificar si PayPay/LINE Pay están cubiertos |

> **Nota v2**: KakaoPay y Naver Pay (Korea) se remueven del scope v1.0. Se reevaluarán en v1.5 junto con el market entry de Korea.

**Recomendación a Joel (v1.0 scope)**: ANTES de lanzar en China y Japón, verificar con LemonSqueezy support:
1. ¿Soportan Alipay y WeChat Pay para buyers en China?
2. ¿Manejan IVA chino (VAT) correctamente?

Si la respuesta es "no" a Alipay/WeChat Pay, **el mercado chino es inaccesible** vía LemonSqueezy. Los streamers chinos simplemente no pueden pagar sin estos métodos.

### Pricing por mercado (v1.0: CN/JP)

**Honestidad**: No tengo datos verificables de precios oficiales de Stream Deck en CNY/JPY. Los siguientes son aproximaciones basadas en tipo de cambio:

| Producto | USD | CNY (estimado) | JPY (estimado) |
|----------|-----|-----------------|-----------------|
| Stream Deck XL | $249 | ¥1,800 | ¥38,000 |
| Stream Deck Mini | $79 | ¥570 | ¥12,000 |

**Mi recomendación de pricing para EsperantAI (v1.0)**:

| Tier | USD | CNY | JPY | Razón |
|------|-----|-----|-----|-------|
| Free | $0 | ¥0 | ¥0 | — |
| Pro | $29 | ¥128 | ¥4,200 | ~15% del Stream Deck Mini. Accesible para streamers semi-pro |
| Pro+ | $69 | ¥298 | ¥10,000 | ~30% del Stream Deck Mini. Premium pero no hardware-price |

> **Nota v2**: Los precios en KRW se removerán hasta v1.5 cuando se active el mercado coreano.

**⚠️ Disclaimer**: Estos precios NO están basados en datos de conversión reales. Son mi estimación de precio psicológico basada en el contexto de mercado. Joel DEBE validar con:
1. A/B testing de precio en beta
2. Comparación con otros software de streaming (no solo hardware)
3. Elasticidad de precio por mercado (lo que funciona en USA no funciona igual en China)

**Insight cultural de pricing**: En China, el número 8 es auspicioso (八 = riqueza). ¥88 o ¥188 son precios psicológicamente atractivos. En Japón, los números pares son preferidos para regalos.

---

## Sección 7 — Métricas que propongo (v1.0: zh-CN + ja-JP)

| Métrica | Target semanal | Meta final | Estado actual |
|---------|---------------|------------|-------------|
| Keys traducidas zh-CN/ja-JP | 49 → 0 faltantes por locale | 193/193 = 100% real | ✅ 193/193 alcanzado |
| Strings con adaptación cultural (no literal) zh-CN/ja-JP | ≥ 15% del total | ≥ 20% | ~18% estimado |
| Gestos marcados como `cultural` con advertencia CN/JP | 7/7 | 7/7 + 🙏 GASSHO | 📝 Documentado en CULTURAL_GESTURE_REVIEW.md v2.0, pendiente code change |
| 🙏 GASSHO: heurísticas Human.js implementadas | Proposal → Code | Detección funcional de manos juntas | ✅ Propuesta aprobada en CULTURAL_GESTURE_REVIEW.md v2.0 |
| 🙏 GASSHO: culturalNotes zh-CN/ja-JP | 0 → 2 | 2/2 locales con contexto cultural | 📝 Pendiente implementación |
| Tiempo de carga locale CJK vs en-US | < 50ms diferencia | < 30ms | Sin medir aún |
| CulturalNotes actualizadas con contexto CN/JP | 0 → 7 | 7/7 gestos con caveat Asia | 📝 Proposed text en CULTURAL_GESTURE_REVIEW.md v2.0, pendiente code change |
| Backend Hostinger VPS operativo (TASK-001) | Setup → Deploy | Licenses API funcional en 187.77.23.49 | 📝 Pendiente implementación |

> **Nota v2**: Las métricas de ko-KR y SOOP/CHZZK se remueven de v1.0. Se retomarán en v1.5 cuando se active Korea.

---

## Sección 8 — Propuesta de coordinación (v1.0 scope simplificado)

### Mi disponibilidad y ritmo

- Puedo trabajar de forma continua en las tareas asignadas
- Prefiero recibir feedback en batches, no drip-feed
- Si Claude cambia la estructura de `TRIGGER_CATALOG` o `platform-base.js`, necesito saber ANTES de traducir
- **Especial atención**: La adición de GASSHO al TRIGGER_CATALOG requiere coordinación estrecha con Claude

### Propuesta de workflow

1. **Joel me pasa los archivos que necesito** → yo analizo y respondo
2. **Yo escribo código/traducciones** → PR con `Co-authored-by: Z-GLM-4 <noreply@z.ai>`
3. **Claude reviewa** → approve o request changes
4. **Joel mergea** (o Claude si tiene permiso)
5. **Si hay conflicto entre IAs** → Joel decide

### Alcance v1.0 simplificado

El alcance de v1.0 se reduce a:
- **2 locales**: zh-CN + ja-JP (ko-KR = stub)
- **1 gesto nuevo**: 🙏 GASSHO (con heurísticas Human.js)
- **1 backend**: Hostinger VPS para TASK-001 licenses
- **0 platform adapters**: SOOP/CHZZK diferidos a v1.5
- **2 mercados de monetización**: China + Japón

Esto simplifica significativamente el riesgo, la coordinación y el timeline.

### Riesgos que veo (v1.0 scope)

1. **Traducciones zh-CN/ja-JP sin review humano**: Las traducciones AI pueden ser técnicamente correctas pero culturalmente "off". Un nativo debe revisar antes de lanzamiento comercial.
2. **LemonSqueezy + China**: Si LemonSqueezy no soporta Alipay/WeChat Pay, el mercado chino es inaccesible vía este gateway. Joel debe verificar.
3. **GASSHO heurísticas**: La detección de manos juntas en Human.js es viable pero requiere testing extensivo. El gesture puede tener falsos positivos (mano sobre pecho, manos cerca pero no juntas). La propuesta en CULTURAL_GESTURE_REVIEW.md v2.0 incluye mitigaciones.
4. **Layout CJK**: Caracteres chinos/japoneses son ~2x más anchos que latinos. UI puede romperse en ciertos componentes. Verificación visual necesaria.

### Riesgos diferidos a v1.5

5. **SOOP partner registration**: Sin cuenta de socio, no hay acceso a la API. Bloqueador HARD para adapter coreano.
6. **CHZZK requiere proxy**: OAuth clientSecret no puede estar en browser. Se usará Hostinger VPS como proxy en v1.5.
7. **PIPA compliance (Korea)**: Ley de protección de datos coreana requiere revisión legal antes de procesar datos de usuarios coreanos.
8. **ko-KR traducción completa**: Requiere review nativo coreano + adaptación cultural específica.

---

## Resumen ejecutivo

| Hallazgo | Severidad | Acción v1.0 |
|----------|-----------|-------------|
| 49 keys faltantes en zh-CN y ja-JP (completion: 100 es falso) | 🔴 Crítico | Completar YA en zh-CN + ja-JP |
| culturalNote sin contexto CN/JP | 🟠 Alto | Actualizar 7 gestos para China/Japón |
| 👌 OK sign = "dinero" en Japón (no "OK") | 🟠 Alto | Agregar caveat cultural |
| ☝️ Point = muy grosero en CN/JP | 🟠 Alto | Ampliar advertencia |
| 🙏 GASSHO: gesto aprobado de alto valor para CN/JP | 🟢 Approved | Implementar con heurísticas Human.js (propuesta en CULTURAL_GESTURE_REVIEW.md v2.0) |
| Layout CJK puede romper UI (caracteres 2x más anchos) | 🟡 Medio | Verificación visual necesaria |
| LemonSqueezy puede no soportar Alipay/WeChat Pay | 🟠 Alto | Joel debe verificar con LemonSqueezy |
| Backend Hostinger VPS para TASK-001 | 📋 Pendiente | Implementar en Semana 3 |

### Diferido a v1.5

| Hallazgo | Acción v1.5 |
|----------|-------------|
| ko-KR traducción completa | Activar con market entry Korea |
| SOOP adapter | Registrar partner SOOP primero |
| CHZZK adapter | Proxy en Hostinger VPS + OAuth |
| PIPA compliance (Korea) | Revisión legal |
| KakaoPay/Naver Pay | Verificar con LemonSqueezy o alternativa |
| 🖐️ Open palm = grosero en Korea | Agregar caveat cuando ko-KR se active |

---

*Documento generado por Z.ai Code (v2 — Post-Decisions). Listo para revisión por Claude y consolidación en plan unificado.*

Co-authored-by: Z-GLM-4 <noreply@z.ai>
