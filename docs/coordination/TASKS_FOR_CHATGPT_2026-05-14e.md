# Tarea para ChatGPT — TASK-110 (TROUBLESHOOTING bilingüe)

## Contexto

EsperantAI se lanza comercialmente pronto. Los usuarios (streamers) van a tener problemas comunes: cámara no detecta, OBS no conecta, gesto no dispara, license inválida. Sin un doc claro de troubleshooting, cada caso llega a soporte por email — costoso a escala. Necesitamos un doc que **el usuario lea ANTES de escribir**.

## TASK-110 — Crear `docs/TROUBLESHOOTING.md` (en) + `docs/TROUBLESHOOTING.es.md` (es)

### Entregable

2 archivos markdown bilingües (en-US y es-ES). Mismo contenido, traducciones nativas.

### Estructura obligatoria

Cada problema documentado con 3 secciones:

```markdown
### [Problema breve, observable] ([categoría])

**Síntoma:** Qué ve el usuario exactamente (mensaje, comportamiento)

**Causa:** Por qué pasa (1-2 frases técnicas pero accesibles)

**Solución:**
1. Paso 1 concreto
2. Paso 2 concreto
3. (si aplica) Cómo verificar que se resolvió

**Si persiste:** [link a Discord/soporte/email]
```

### Categorías a cubrir (mínimo)

1. **Cámara**
   - "No veo mi cámara" → permisos browser, otra app usando, drivers
   - "Cámara funciona pero EsperantAI no detecta cara" → iluminación, distancia, ángulo
   - "Múltiples cámaras → cuál elegir"

2. **OBS / Streamlabs / vMix**
   - "OBS Connected = rojo permanente" → WebSocket no enabled, puerto bloqueado, contraseña
   - "Cambio escena no se aplica" → escenas no detectadas, nombres con espacios
   - "vMix HTTP API no responde" → port, firewall

3. **Plataformas (Twitch/YouTube/Kick)**
   - "OAuth callback se queda colgado" → bloqueador de popups, redirect URI
   - "No recibo eventos en vivo" → scope insuficiente, EventSub vs IRC
   - "Token expirado cada hora"

4. **Triggers / gestos**
   - "Gesto detectado pero NO dispara acción" → enable category, scene unassigned
   - "Trigger se dispara solo / falsos positivos" → recalibrar wizard, thresholds altos
   - "Hand gestures no funcionan" → tier free (necesita Pro+), feature flag

5. **License / activación**
   - "Mi license key no se activa" → backend offline, formato, espacios
   - "App dice 'license inválida' aunque pagué" → email vs key, instance limit
   - "Cambié de PC y dice 'too many activations'"

6. **Performance**
   - "App lenta / pierdo FPS en OBS" → resolución cámara, worker mode, otra apps
   - "Battery drain en laptop"

7. **Audio / TTS / sonido**
   - "TTS no se escucha" → permisos, voz default
   - "play_sound trigger no reproduce" → URL bloqueada, autoplay policy

### Frecuencia + impacto

Ordenar problemas por **frecuencia esperada × impacto**. Los 3 primeros deben ser los que el 80% de usuarios va a encontrar:
1. Permisos cámara
2. OBS WebSocket no enabled
3. License key con espacios al pegar

### Reglas de escritura

- **Tono:** directo, sin jerga. "Tu cámara no se ve" mejor que "El stream MediaStream falló al inicializarse".
- **Imperativo:** "Abre OBS → Tools → WebSocket Server Settings → marca 'Enable'" — pasos numerados.
- **NO usar imágenes** (este doc se lee en GitHub, no en sitio): describe rutas con flechas y mayúsculas para botones.
- **Cross-link** entre problemas relacionados.
- **Versión** declarada al inicio: "Para EsperantAI v2.0+. Si tienes versión anterior, actualiza primero."

### Entregable

Zip con:
```
docs/TROUBLESHOOTING.md     ← English, target ~600-1000 líneas
docs/TROUBLESHOOTING.es.md  ← Spanish, mismo contenido + nativo
PR_DESCRIPTION_docs_troubleshooting.md
```

### Anti-patterns

- NO incluir bugs internos sin solución usuario-accionable (eso va en GitHub Issues, no acá)
- NO inventar URLs/emails de soporte (Joel te confirma email cuando lances)
- NO mencionar features que NO existen en main actual (Combo Triggers UI sí existe, ya está mergeado)
- NO usar emojis decorativos en headers (sí en estado: ✅⚠️❌)

### Plazo: 1-2 sesiones (es trabajo de copywriting técnico)

### Branch + PR (yo lo abro)

- Branch: `docs/troubleshooting-bilingual-task110`
- Título: `docs(troubleshooting): TASK-110 — guía bilingüe en/es por categorías`
