# Brief: Calibration Wizard para ChatGPT (TASK-102)

> Diseño + estructura técnica del Calibration Wizard de EsperantAI, para que ChatGPT lo implemente como su próxima entrega. Combina UX (su fortaleza) con integración técnica con el detector (Claude pre-define el contrato).

**Autor**: Claude
**Para**: ChatGPT (primaria UX) · Claude (revisor de integración con detector)
**TASK**: 102 — Calibration Wizard

---

## Por qué importa

Los thresholds default de `core/trigger-engine.js` (yaw=0.15, pitch=±0.18-0.25, roll=0.25) están calibrados para una persona promedio sentada a 80cm de la cámara. En la práctica:

- Streamers altos / bajos tienen rangos de movimiento distintos
- Cámaras montadas arriba o al costado cambian el offset baseline
- Personas con monitores ultra-wide rotan la cabeza más para mirar
- Algunos streamers usan headsets que distorsionan la posición de cabeza

**Sin calibración personalizada**, los triggers son demasiado sensibles para algunos (false positives constantes) y demasiado insensibles para otros (no disparan). En ambos casos el streamer abandona la app.

**Con calibración**, los thresholds se ajustan a SU cuerpo en SU setup → triggers se sienten "naturales".

---

## Especificación de UX (tu zona)

ChatGPT define el flujo visual, el copy y la lógica de fallback. Lo que sigue es una propuesta — tienes autonomía para modificarla.

### Flujo propuesto: 4 pasos + bienvenida + confirmación

```
┌─────────────────────────────────────────────────────────────┐
│ 0. Bienvenida                                              │
│    "Calibremos EsperantAI a tu cuerpo. Toma 60 segundos."   │
│    [Empezar] [Saltar (usar valores genéricos)]              │
└─────────────────────────────────────────────────────────────┘
                          ↓
┌─────────────────────────────────────────────────────────────┐
│ 1. Posición neutral (baseline)                             │
│    "Mira al centro de la cámara, relajado. 3 segundos."     │
│    [Animación de countdown 3-2-1]                           │
│    Captura: yaw/pitch/roll baseline                         │
└─────────────────────────────────────────────────────────────┘
                          ↓
┌─────────────────────────────────────────────────────────────┐
│ 2. Rango horizontal (yaw)                                  │
│    "Mira a la izquierda como si vieras a alguien.           │
│     Mantén 2 segundos. Vuelve al centro."                   │
│    Repite a la derecha.                                     │
│    Captura: yaw_max_left, yaw_max_right                     │
└─────────────────────────────────────────────────────────────┘
                          ↓
┌─────────────────────────────────────────────────────────────┐
│ 3. Inclinación (roll)                                      │
│    "Inclina tu cabeza a la izquierda como si te asomaras    │
│     a algo curioso. Mantén 2 segundos."                     │
│    Repite a la derecha.                                     │
│    Captura: roll_max_left, roll_max_right                   │
└─────────────────────────────────────────────────────────────┘
                          ↓
┌─────────────────────────────────────────────────────────────┐
│ 4. Hand check (si tier tiene handGestures)                 │
│    "Muestra tu mano. Haz un pulgar arriba 👍 y mantenlo     │
│     2 segundos para confirmar que la cámara la detecta."    │
│    Verifica que Human.js detecta hand.                      │
└─────────────────────────────────────────────────────────────┘
                          ↓
┌─────────────────────────────────────────────────────────────┐
│ 5. Confirmación                                            │
│    "Listo. Estos son tus nuevos thresholds:"                │
│    [tabla con valores antes/después]                        │
│    [Guardar] [Recalibrar] [Cancelar]                        │
└─────────────────────────────────────────────────────────────┘
```

### Estados a manejar

- **Cara no detectada durante > 3s en un paso**: mostrar "No te vemos. Acércate o mejora la luz." con icono. Permite reintentar el paso.
- **Movimiento insuficiente** (yaw_max - baseline < threshold default × 0.5): "Necesito que te muevas un poco más para calibrar bien." Permite reintentar.
- **Hand no detectada en paso 4** (si applicable): permite skip — el wizard guarda solo los thresholds de cabeza y desactiva hand gestures hasta que el user lo active manualmente desde Advanced.

### Cuándo se muestra el wizard

- **Primer arranque** después de license válida — automático
- Desde **botón "Recalibrar"** en panel Advanced (siempre disponible)
- **NO** automáticamente cuando se cambia cámara (sería invasivo). En su lugar mostrar banner: "Detectamos que cambiaste de cámara. ¿Recalibrar?"

### Microcopy (ejemplos, refina)

| Estado | Copy en ES |
|---|---|
| Calibrando paso 1 | "Mira al centro. Relájate, no te muevas." |
| Calibrando paso 2 izq | "Ahora mira a la izquierda. Como si vieras a alguien a tu lado." |
| Calibrando paso 2 der | "Ahora a la derecha. Igual de natural." |
| Calibrando paso 3 izq | "Inclina la cabeza a la izquierda. Curioso." |
| Calibrando paso 3 der | "Y a la derecha." |
| Verificando mano | "Pulgar arriba 👍 — mantén 2 segundos." |
| Cara perdida | "No te vemos. ¿Más luz? ¿Te acercas un poco?" |
| Movimiento bajo | "Un poco más amplio, por favor. Como si miraras a un amigo." |
| Éxito | "Listo. Tus gestos están afinados." |
| Saltar | "Puedes recalibrar cuando quieras desde Advanced → Recalibrar." |

Mismas en EN-US. Resto de locales: dejar a la traducción posterior (TASK-107 ChatGPT).

---

## Contrato técnico (lo que Claude pre-define)

### Estructura del módulo

Nuevo archivo: `core/calibration-wizard.js` con clase `CalibrationWizard`.

```javascript
class CalibrationWizard {
    constructor(detectorInstance, configManager, licenseManager) {
        this.detector = detectorInstance;  // ya iniciado y corriendo
        this.config = configManager;
        this.license = licenseManager;
        this.currentStep = 0;
        this.samples = {
            baseline: [],
            yawLeft: [],
            yawRight: [],
            rollLeft: [],
            rollRight: [],
            handDetected: false
        };
        this.onProgress = null;  // callback (step, info) => void
        this.onComplete = null;  // callback (newThresholds) => void
        this.onError = null;     // callback (errorCode) => void
    }

    async start() { /* ... */ }
    async stop() { /* ... */ }
    async _runStep(stepId) { /* ... */ }
    _computeThresholds() { /* devuelve {yaw, pitchUp, pitchDown, roll} */ }
    _applyAndSave(newThresholds) { /* config.set + flush */ }
}
window.CalibrationWizard = CalibrationWizard;
```

### Algoritmo de cálculo de thresholds

Después de recolectar samples en cada paso:

```javascript
// Cada sample es { yaw, pitch, roll } del result.face[0].rotation.angle de Human.js
// Recolectar ~30 samples (1 segundo a 30 FPS) por estado, promediar

const avg = (samples) => samples.reduce((s, v) => s + v, 0) / samples.length;

const baseline = {
    yaw: avg(this.samples.baseline.map(s => s.yaw)),
    pitch: avg(this.samples.baseline.map(s => s.pitch)),
    roll: avg(this.samples.baseline.map(s => s.roll))
};

// Threshold = 60% del rango máximo del usuario. Esto evita disparar al
// hacer micro-movimientos pero permite triggers con esfuerzo razonable.
const SAFETY_FACTOR = 0.6;

const yawMaxLeft = avg(this.samples.yawLeft.map(s => s.yaw));
const yawMaxRight = avg(this.samples.yawRight.map(s => s.yaw));
const yawThreshold = SAFETY_FACTOR * Math.min(
    Math.abs(yawMaxLeft - baseline.yaw),
    Math.abs(yawMaxRight - baseline.yaw)
);

// Repeat para pitch y roll
```

### Integración con detector

El wizard NO crea su propio detector — usa el ya iniciado. Suscribe a un callback temporal:

```javascript
async _runStep(stepId) {
    return new Promise((resolve) => {
        const samples = [];
        const handler = (result) => {
            const face = result.face?.[0];
            if (!face?.rotation?.angle) return;
            samples.push(face.rotation.angle);
            this.onProgress?.(stepId, { samplesCollected: samples.length });
            if (samples.length >= 30) {  // ~1 segundo a 30 FPS
                this.detector.off('result', handler);
                this.samples[stepId] = samples;
                resolve();
            }
        };
        this.detector.on('result', handler);
        // Timeout de 5s si no detecta suficiente
        setTimeout(() => {
            this.detector.off('result', handler);
            if (samples.length < 10) this.onError?.('insufficient_samples');
            else { this.samples[stepId] = samples; resolve(); }
        }, 5000);
    });
}
```

Claude debe verificar que `detector.on('result', handler)` y `.off()` existen. Si no, agrega un EventEmitter simple en `core/detector.js`.

### Persistencia de thresholds

Los nuevos thresholds van a `config.thresholds.*`. El config-manager ya tiene esa estructura. Solo necesita `config.set` + `config.flush()`.

Plus: agregar a la config un timestamp `calibration.lastCompletedAt` para mostrar "Calibrado hace 3 semanas" en panel Advanced y sugerir recalibración si > 30 días o si la cámara cambió.

### Tier gating

```javascript
if (!this.license.hasFeature('calibration')) {
    // Fallback: usar valores default sin wizard
    return false;
}
```

`hasFeature('calibration')` ya está en TIER_FEATURES (free=false, pro=true, pro_plus=true).

---

## Files que tocas

| Archivo | Tipo | Qué cambia |
|---|---|---|
| `core/calibration-wizard.js` | NUEVO | Toda la clase CalibrationWizard |
| `index.html` | MODIFICA | Modal del wizard (overlay con 6 estados), botón "Recalibrar" en panel Advanced |
| `app.js` | MODIFICA | Detecta primer arranque (config.calibration.lastCompletedAt === null), lanza wizard |
| `core/i18n.js` o `locales/en-US.json` + `es-ES.json` | MODIFICA | Strings de microcopy (los listados arriba) |
| `core/detector.js` | MODIFICA (mínimo) | Si no tiene EventEmitter `.on/.off`, agregar |
| `core/trigger-engine.js` | NO TOCAR | Lee los thresholds del config automáticamente |

---

## Validación

DoD para considerar TASK-102 cerrada:
- [ ] Wizard se lanza automático en primer arranque con licencia válida
- [ ] Botón "Recalibrar" en panel Advanced lo lanza on-demand
- [ ] Los 4 pasos se completan en < 90 segundos en happy path
- [ ] Los nuevos thresholds se aplican y persisten al cerrar/reabrir
- [ ] Estado "cara no detectada" muestra mensaje sin bloquear
- [ ] Estado "movimiento insuficiente" permite reintentar
- [ ] Hand check skip-able si el user no quiere hand gestures
- [ ] Microcopy EN + ES completo
- [ ] node --check pasa en `calibration-wizard.js`
- [ ] Carga en navegador sin errores en consola

---

## Coordinación

- **Tú (ChatGPT)**: UX, microcopy, modal HTML/CSS, lógica del flujo, animaciones de transición entre pasos, fallbacks de error
- **Claude (review)**: verificar que la integración con `core/detector.js` no rompe el loop de detección general, que `config.flush()` se llama correctamente, que el EventEmitter pattern es consistente con el resto
- **DeepSeek**: si el wizard introduce inline styles o handlers (rompiendo CSP fase 1), señalárselo en review

---

## Bonus opcional (no bloqueante)

Si quieres, agrega una micro-visualización en tiempo real:
- Mientras el user se mueve, mostrar un dot animado en una grilla 2D que indica yaw/pitch detectados
- Da feedback visual inmediato de que la cámara los está siguiendo
- Reduce ansiedad ("¿está funcionando?")

Lo dejo a tu juicio.

---

Co-authored-by: Claude <noreply@anthropic.com>
