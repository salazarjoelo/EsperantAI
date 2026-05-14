/* ============================================================================
 * EsperantAI — Trigger Engine
 * Interpreta resultados de Human.js + eventos de plataforma → acciones.
 *
 * Soporta:
 * - Gestos continuos (head/distance/gaze) con debounce de frames estables
 * - Gestos puntuales (blink doble, emoción, mano)
 * - Combos: evento de plataforma + gesto del streamer = acción confirmada
 * - Cooldown global y por tipo
 * ========================================================================== */

'use strict';

class TriggerEngine {
    constructor(config) {
        this.config = config;
        this.listeners = {};

        // Estado de pose continua
        this.lastTrigger = 'center';
        this.stableCount = 0;
        this.lastSceneChangeTime = 0;
        this.framesSinceFace = 0;

        // Estado de acciones puntuales
        this.blinkBuffer = [];
        this.BLINK_WINDOW = 700;
        this.lastEmotionTrigger = null;
        this.lastEmotionTime = 0;
        this.EMOTION_COOLDOWN = 2000;
        this.lastHandGestureTime = 0;
        this.HAND_COOLDOWN = 1500;

        // Hysteresis: threshold to exit a zone is tighter than to enter it
        this.hysteresisFactor = 0.6; // exit threshold = enterThreshold * 0.6
        this.activeZones = { yaw: null, pitch: null, roll: null }; // track which zones are active

        // returnToCenterMs: ignore 'center' for a period after a direction fires
        this.lastNonCenterTime = 0;
        this.RETURN_TO_CENTER_DELAY = 800; // ms before 'center' can re-trigger after a direction

        // Estado de combo events: evento que espera confirmación gestual
        this.pendingEventConfirmations = []; // [{event, expires, requireGesture}]
        this.EVENT_CONFIRMATION_WINDOW = 5000; // 5s para confirmar con gesto
        this.MAX_PENDING_CONFIRMATIONS = 50;
    }

    /**
     * Llamar cada frame de detección con el result de Human.js + gestos.
     * @returns {Object|null} { trigger, scene, label, sourceEvent } o null si nada que hacer
     */
    process(result) {
        if (!result || !result.face || !result.face.length) {
            this.framesSinceFace++;
            return null;
        }
        this.framesSinceFace = 0;

        const face = result.face[0];
        const gestures = result.gesture || [];
        // Expose hands array para detectores que requieren landmarks completos
        // (ej. gassho, que necesita los 21 landmarks de ambas manos simultáneo).
        this._handsArray = result.hand || [];

        // 1) Acciones puntuales primero — pueden override la pose continua
        const punctualTrigger = this._evaluatePunctual(face, gestures);
        if (punctualTrigger) return punctualTrigger;

        // 2) Verificar confirmación de evento pendiente
        const eventConfirm = this._checkEventConfirmation(face, gestures);
        if (eventConfirm) return eventConfirm;

        // 3) Pose continua (head → distance → gaze)
        const posTrigger = this._evaluateContinuous(face);
        if (posTrigger) {
            // Debounce
            if (posTrigger.trigger === this.lastTrigger) {
                this.stableCount++;
            } else {
                this.stableCount = 0;
                this.lastTrigger = posTrigger.trigger;
            }
            if (this.stableCount === this.config.get('thresholds.stableFrames', 5)) {
                return this._makeAction(posTrigger);
            }
        }
        return null;
    }

    _evaluatePunctual(face, gestures) {
        // Blink doble
        if (this.config.get('enabled.blink')) {
            const now = Date.now();
            const hasBlink = gestures.some(g => g.gesture && /blink/i.test(g.gesture));
            if (hasBlink) {
                if (!this.blinkBuffer.length || now - this.blinkBuffer.at(-1) > 80) {
                    this.blinkBuffer.push(now);
                }
            }
            this.blinkBuffer = this.blinkBuffer.filter(t => now - t < this.BLINK_WINDOW);
            if (this.blinkBuffer.length >= 2) {
                this.blinkBuffer = [];
                return this._makeAction({ trigger: 'blink', label: 'double blink' });
            }
        }

        // Emoción
        if (this.config.get('enabled.emotion') && face.emotion?.length) {
            const top = face.emotion.reduce((a, b) => (a.score > b.score ? a : b));
            if (top.score >= this.config.get('thresholds.emotion', 0.6)) {
                const map = { happy: 'happy', surprise: 'surprise', angry: 'angry', neutral: 'neutral' };
                const key = map[top.emotion];
                if (key) {
                    const now = Date.now();
                    if (this.lastEmotionTrigger !== key || now - this.lastEmotionTime > this.EMOTION_COOLDOWN) {
                        this.lastEmotionTrigger = key;
                        this.lastEmotionTime = now;
                        return this._makeAction({ trigger: key, label: `emotion: ${key}` });
                    }
                }
            }
        }

        // Hand gestures (cuando Human.js hand está habilitado)
        if (this.config.get('enabled.hand') && gestures.length) {
            const now = Date.now();
            if (now - this.lastHandGestureTime > this.HAND_COOLDOWN) {
                for (const g of gestures) {
                    const handGesture = this._mapHandGesture(g);
                    if (handGesture) {
                        this.lastHandGestureTime = now;
                        return this._makeAction({ trigger: handGesture, label: `hand: ${handGesture}` });
                    }
                }
            }
        }

        // 🙏 Gassho (TASK-208 — gesto 19, aprobado Joel 2026-05-14).
        // Diseño completo en docs/CULTURAL_GESTURE_REVIEW.md sección 6.4 (Z/GLM-4).
        // Se procesa SEPARADO del switch de _mapHandGesture porque requiere los
        // landmarks completos de ambas manos (no la string `gesture` de Human.js).
        if (this.config.get('enabled.hand') && this._handsArray && typeof window.detectGassho === 'function') {
            const now = Date.now();
            if (now - this.lastHandGestureTime > this.HAND_COOLDOWN) {
                const gasshoResult = window.detectGassho(this._handsArray, performance.now());
                if (gasshoResult.detected && gasshoResult.confidence >= 0.5) {
                    this.lastHandGestureTime = now;
                    return this._makeAction({
                        trigger: 'gassho',
                        label: `gassho conf=${gasshoResult.confidence.toFixed(2)} hold=${Math.round(gasshoResult.holdMs)}ms`,
                    });
                }
            }
        }

        return null;
    }

    _mapHandGesture(g) {
        // Human.js hand gestures pueden venir como { hand: 0, gesture: 'thumb forward middlefinger up' }
        if (!g.gesture || typeof g.gesture !== 'string' || g.hand === undefined) return null;
        const text = g.gesture.toLowerCase();
        if (text.includes('thumb') && text.includes('up') && !text.includes('forward')) return 'thumbs-up';
        if (text.includes('peace') || (text.includes('index') && text.includes('middle') && text.includes('up'))) return 'peace';
        if (text.includes('rock') || text.includes('horn')) return 'rock';
        if (text.includes('ok') || text.includes('o-sign')) return 'ok';
        if (text.includes('fist')) return 'fist';
        if (text.includes('open') && text.includes('palm')) return 'open-palm';
        if ((text.includes('point') || text.includes('index')) && text.includes('up') && !text.includes('middle')) return 'point';
        return null;
    }

    _evaluateContinuous(face) {
        if (!face.rotation?.angle) return { trigger: 'center', label: 'no rotation' };
        const { yaw, pitch, roll } = face.rotation.angle;
        const T = this.config.get('thresholds');

        if (this.config.get('enabled.head')) {
            // Roll with hysteresis + dead zone
            const deadZoneRoll = T.deadZoneRoll ?? 0.08;
            if (Math.abs(roll) < deadZoneRoll) {
                this.activeZones.roll = null;
            } else if (this.activeZones.roll) {
                // Already in a roll zone: stay if above exit threshold
                if (Math.abs(roll) > T.roll * this.hysteresisFactor) {
                    return { trigger: roll > 0 ? 'tilt-right' : 'tilt-left', label: 'tilt' };
                }
                this.activeZones.roll = null;
            } else {
                // Not in a roll zone: enter if above enter threshold
                if (Math.abs(roll) > T.roll) {
                    this.activeZones.roll = roll > 0 ? 'tilt-right' : 'tilt-left';
                    return { trigger: this.activeZones.roll, label: 'tilt' };
                }
            }

            // Pitch with hysteresis + dead zone
            const deadZonePitch = T.deadZonePitch ?? 0.05;
            if (Math.abs(pitch) < deadZonePitch) {
                this.activeZones.pitch = null;
            } else if (this.activeZones.pitch) {
                // Already in a pitch zone: stay if above exit threshold
                const exitUp = T.pitchUp * this.hysteresisFactor;
                const exitDown = T.pitchDown * this.hysteresisFactor;
                if (this.activeZones.pitch === 'up' && pitch < exitUp) {
                    return { trigger: 'up', label: 'up' };
                }
                if (this.activeZones.pitch === 'down' && pitch > exitDown) {
                    return { trigger: 'down', label: 'down' };
                }
                this.activeZones.pitch = null;
            } else {
                // Not in a pitch zone: enter if above enter threshold
                if (pitch < T.pitchUp) {
                    this.activeZones.pitch = 'up';
                    return { trigger: 'up', label: 'up' };
                }
                if (pitch > T.pitchDown) {
                    this.activeZones.pitch = 'down';
                    return { trigger: 'down', label: 'down' };
                }
            }

            // Yaw with hysteresis + dead zone
            const deadZoneYaw = T.deadZoneYaw ?? 0.05;
            if (Math.abs(yaw) < deadZoneYaw) {
                this.activeZones.yaw = null;
            } else if (this.activeZones.yaw) {
                // Already in a yaw zone: stay if above exit threshold
                if (Math.abs(yaw) > T.yaw * this.hysteresisFactor) {
                    return { trigger: yaw > 0 ? 'right' : 'left', label: yaw > 0 ? 'right' : 'left' };
                }
                this.activeZones.yaw = null;
            } else {
                // Not in a yaw zone: enter if above enter threshold
                if (Math.abs(yaw) > T.yaw) {
                    this.activeZones.yaw = yaw > 0 ? 'right' : 'left';
                    return { trigger: this.activeZones.yaw, label: this.activeZones.yaw };
                }
            }
        }

        if (this.config.get('enabled.distance') && face.box) {
            const size = Math.max(face.box[2], face.box[3]);
            if (size > T.near) return { trigger: 'near', label: 'near' };
            if (size < T.far) return { trigger: 'far', label: 'far' };
        }

        if (this.config.get('enabled.gaze') && face.rotation.gaze) {
            const { bearing, strength } = face.rotation.gaze;
            if (strength >= T.gazeStrength) {
                const sec = this._bearingToSector(bearing);
                return { trigger: `gaze-${sec}`, label: `gaze ${sec}` };
            }
        }

        // Returning center — apply returnToCenterMs delay
        const returnToCenterMs = T.returnToCenterMs ?? 800;
        if (this.lastNonCenterTime) {
            if (Date.now() - this.lastNonCenterTime < returnToCenterMs) {
                return null; // ignore center too soon after a direction
            }
            this.lastNonCenterTime = 0;
        }

        return { trigger: 'center', label: 'center' };
    }

    _bearingToSector(b) {
        while (b > Math.PI) b -= 2 * Math.PI;
        while (b < -Math.PI) b += 2 * Math.PI;
        const pi4 = Math.PI / 4;
        if (b >= -pi4 && b < pi4) return 'right';
        if (b >= pi4 && b < 3 * pi4) return 'up';
        if (b >= 3 * pi4 || b < -3 * pi4) return 'left';
        return 'down';
    }

    /**
     * Llamar cuando llega un evento de plataforma (donation, sub, raid...).
     * Si el config dice "requireGesture", se queda esperando confirmación gestual.
     * Si no, dispara la escena inmediatamente.
     */
    handlePlatformEvent(eventType, data) {
        const cfg = this.config.get(`eventTriggers.${eventType}`);
        if (!cfg || !cfg.enabled) return null;

        if (cfg.requireGesture) {
            // Clean expired entries first
            const now = Date.now();
            this.pendingEventConfirmations = this.pendingEventConfirmations.filter(p => p.expires > now);
            // Cap check — remove oldest if at limit
            if (this.pendingEventConfirmations.length >= this.MAX_PENDING_CONFIRMATIONS) {
                this.pendingEventConfirmations.shift(); // remove oldest
            }
            // Agregar a lista de pendientes
            this.pendingEventConfirmations.push({
                eventType,
                data,
                requireGesture: cfg.requireGesture,
                scene: cfg.scene,
                expires: now + this.EVENT_CONFIRMATION_WINDOW
            });
            return { type: 'pending_confirmation', eventType, requireGesture: cfg.requireGesture };
        }

        // Disparo directo
        return {
            type: 'action',
            scene: cfg.scene,
            sourceEvent: { type: eventType, data },
            label: `event: ${eventType}`
        };
    }

    _checkEventConfirmation(face, gestures) {
        const now = Date.now();
        // Limpiar expirados
        this.pendingEventConfirmations = this.pendingEventConfirmations.filter(p => p.expires > now);

        for (let i = 0; i < this.pendingEventConfirmations.length; i++) {
            const pending = this.pendingEventConfirmations[i];
            // Detectar el gesto requerido
            const handGesture = this._mapHandGesture(gestures.find(g => g.hand !== undefined) || {});
            if (handGesture === pending.requireGesture) {
                this.pendingEventConfirmations.splice(i, 1);
                return {
                    type: 'action',
                    trigger: pending.requireGesture,
                    scene: pending.scene,
                    sourceEvent: { type: pending.eventType, data: pending.data },
                    label: `${pending.eventType} confirmed by ${handGesture}`
                };
            }
        }
        return null;
    }

    _makeAction(pose) {
        const sceneName = this.config.get(`scenes.${pose.trigger}`);
        const now = Date.now();
        if (now - this.lastSceneChangeTime < this.config.get('thresholds.cooldownMs', 500)) {
            return null;
        }
        this.lastSceneChangeTime = now;

        // Track non-center triggers for returnToCenterMs delay
        if (pose.trigger !== 'center') {
            this.lastNonCenterTime = now;
        }

        return {
            type: 'action',
            trigger: pose.trigger,
            scene: sceneName,
            label: pose.label
        };
    }
}

window.TriggerEngine = TriggerEngine;
