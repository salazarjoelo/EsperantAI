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

        // Estado de combo events: evento que espera confirmación gestual
        this.pendingEventConfirmations = []; // [{event, expires, requireGesture}]
        this.EVENT_CONFIRMATION_WINDOW = 5000; // 5s para confirmar con gesto
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
        if (text.includes('point') || text.includes('index') && text.includes('up')) return 'point';
        return null;
    }

    _evaluateContinuous(face) {
        if (!face.rotation?.angle) return { trigger: 'center', label: 'no rotation' };
        const { yaw, pitch, roll } = face.rotation.angle;
        const T = this.config.get('thresholds');

        if (this.config.get('enabled.head')) {
            if (Math.abs(roll) > T.roll) return { trigger: roll > 0 ? 'tilt-right' : 'tilt-left', label: 'tilt' };
            if (pitch < T.pitchUp) return { trigger: 'up', label: 'up' };
            if (pitch > T.pitchDown) return { trigger: 'down', label: 'down' };
            if (yaw > T.yaw) return { trigger: 'right', label: 'right' };
            if (yaw < -T.yaw) return { trigger: 'left', label: 'left' };
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
            // Agregar a lista de pendientes
            this.pendingEventConfirmations.push({
                eventType,
                data,
                requireGesture: cfg.requireGesture,
                scene: cfg.scene,
                expires: Date.now() + this.EVENT_CONFIRMATION_WINDOW
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
        return {
            type: 'action',
            trigger: pose.trigger,
            scene: sceneName,
            label: pose.label
        };
    }
}

window.TriggerEngine = TriggerEngine;
