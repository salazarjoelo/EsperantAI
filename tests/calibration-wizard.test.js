/**
 * Tests para core/calibration-wizard.js
 *
 * Cobertura:
 *   - Lifecycle: open/close con y sin licencia
 *   - localStorage: hasCompletedBefore / markCompleted
 *   - Captura de frames: detector.on/off, safety factor 60%
 *   - Navegación: next/prev con límites
 *   - Callbacks: onApplied se invoca con thresholds
 *   - Skip durante captura: termina captura + avanza
 *   - Edge cases: overlay nulo, step bounds
 *
 * Autor: Z (GLM-4) — TASK Z-202
 */
import { describe, it, expect, beforeEach, afterEach, vi } from 'vitest';
import { loadWindowScript } from './helpers/load-window-script.js';

describe('core/calibration-wizard.js', () => {
    let CalibrationWizard;
    let wizard;
    let detector;
    let config;
    let i18n;
    let licenseManager;
    let overlay;

    // ─── Helpers ──────────────────────────────────────────────────────────

    /** Crea un mock del detector con on/off/emit */
    function createMockDetector() {
        return {
            _handlers: {},
            on(ev, fn) { (this._handlers[ev] ||= []).push(fn); },
            off(ev, fn) {
                this._handlers[ev] = (this._handlers[ev] || []).filter(x => x !== fn);
            },
            emit(ev, payload) {
                (this._handlers[ev] || []).forEach(fn => fn(payload));
            }
        };
    }

    /** Crea un frame result con rotación dada */
    function frame(yaw, pitch, roll, size = 200) {
        return {
            result: {
                face: [{
                    rotation: { angle: { yaw, pitch, roll } },
                    box: [0, 0, size, size]
                }]
            },
            frame: 0
        };
    }

    /** Crea un frame result con gesture */
    function gestureFrame(gestureName) {
        return {
            result: {
                face: [],
                gesture: [{ gesture: gestureName }]
            },
            frame: 0
        };
    }

    /** Crea un mock de config con get/set/flush */
    function createMockConfig() {
        const store = { thresholds: {} };
        return {
            get(key, fallback) {
                const parts = key.split('.');
                let obj = store;
                for (const p of parts) {
                    if (obj == null) return fallback;
                    obj = obj[p];
                }
                return obj ?? fallback;
            },
            set(key, value) {
                const parts = key.split('.');
                let obj = store;
                for (let i = 0; i < parts.length - 1; i++) {
                    obj[parts[i]] = obj[parts[i]] || {};
                    obj = obj[parts[i]];
                }
                obj[parts[parts.length - 1]] = value;
            },
            flush: vi.fn(),
            _store: store
        };
    }

    // ─── Setup / teardown ────────────────────────────────────────────────

    beforeEach(() => {
        // Cargar script en window global
        delete globalThis.CalibrationWizard;
        loadWindowScript('core/calibration-wizard.js');
        CalibrationWizard = globalThis.CalibrationWizard;

        // Crear overlay en DOM
        overlay = document.createElement('div');
        overlay.id = 'calibration-wizard-overlay';
        overlay.hidden = true;
        document.body.appendChild(overlay);

        // Mocks
        detector = createMockDetector();
        config = createMockConfig();
        i18n = { t: (key, vars, fallback) => fallback || key };
        licenseManager = { hasFeature: vi.fn() };

        // Limpiar localStorage
        localStorage.clear();
    });

    afterEach(() => {
        if (wizard) {
            try { wizard.close({ completed: false }); } catch {}
        }
        overlay?.remove();
        localStorage.clear();
        vi.restoreAllMocks();
    });

    // ─── 1. isAvailable() = false con licencia free ─────────────────────

    describe('isAvailable()', () => {
        it('devuelve false cuando la licencia no tiene feature calibration', () => {
            licenseManager.hasFeature.mockReturnValue(false);
            wizard = new CalibrationWizard({ config, detector, i18n, licenseManager });
            expect(wizard.isAvailable()).toBe(false);
        });

        it('devuelve true cuando la licencia tiene feature calibration', () => {
            licenseManager.hasFeature.mockReturnValue(true);
            wizard = new CalibrationWizard({ config, detector, i18n, licenseManager });
            expect(wizard.isAvailable()).toBe(true);
        });
    });

    // ─── 2. hasCompletedBefore() lee de localStorage ────────────────────

    describe('hasCompletedBefore()', () => {
        it('devuelve false si no hay valor en localStorage', () => {
            wizard = new CalibrationWizard({ config, detector, i18n, licenseManager });
            expect(wizard.hasCompletedBefore()).toBe(false);
        });

        it('devuelve true si localStorage tiene "1"', () => {
            localStorage.setItem('esperantai-calibration-complete-v1', '1');
            wizard = new CalibrationWizard({ config, detector, i18n, licenseManager });
            expect(wizard.hasCompletedBefore()).toBe(true);
        });
    });

    // ─── 3. markCompleted() escribe "1" en la key correcta ───────────────

    describe('markCompleted()', () => {
        it('escribe "1" en localStorage bajo la key correcta', () => {
            wizard = new CalibrationWizard({ config, detector, i18n, licenseManager });
            wizard.markCompleted();
            expect(localStorage.getItem('esperantai-calibration-complete-v1')).toBe('1');
        });

        it('hasCompletedBefore devuelve true después de markCompleted', () => {
            wizard = new CalibrationWizard({ config, detector, i18n, licenseManager });
            expect(wizard.hasCompletedBefore()).toBe(false);
            wizard.markCompleted();
            expect(wizard.hasCompletedBefore()).toBe(true);
        });
    });

    // ─── 4. open({auto:true}) registra el handler de 'frame' ─────────────

    describe('open()', () => {
        it('registra detector.on("frame", handler) al abrir', () => {
            licenseManager.hasFeature.mockReturnValue(true);
            wizard = new CalibrationWizard({ config, detector, i18n, licenseManager });
            const spy = vi.spyOn(detector, 'on');
            wizard.open({ auto: true });
            expect(spy).toHaveBeenCalledWith('frame', expect.any(Function));
            expect(wizard.active).toBe(true);
        });

        it('no abre si isAvailable() es false', () => {
            licenseManager.hasFeature.mockReturnValue(false);
            wizard = new CalibrationWizard({ config, detector, i18n, licenseManager });
            wizard.open({ auto: true });
            expect(wizard.active).toBe(false);
        });

        it('no abre si overlay no existe en DOM', () => {
            licenseManager.hasFeature.mockReturnValue(true);
            overlay.remove();
            wizard = new CalibrationWizard({ config, detector, i18n, licenseManager });
            wizard.open({ auto: true });
            expect(wizard.active).toBe(false);
        });
    });

    // ─── 5. close({completed:true}) llama markCompleted + remueve handler ─

    describe('close()', () => {
        it('llama markCompleted cuando completed=true', () => {
            licenseManager.hasFeature.mockReturnValue(true);
            wizard = new CalibrationWizard({ config, detector, i18n, licenseManager });
            wizard.open({ auto: false });
            wizard.close({ completed: true });
            expect(wizard.hasCompletedBefore()).toBe(true);
            expect(wizard.active).toBe(false);
        });

        it('remueve detector.off("frame", handler) al cerrar', () => {
            licenseManager.hasFeature.mockReturnValue(true);
            wizard = new CalibrationWizard({ config, detector, i18n, licenseManager });
            wizard.open({ auto: false });
            const spy = vi.spyOn(detector, 'off');
            wizard.close({ completed: false });
            expect(spy).toHaveBeenCalledWith('frame', expect.any(Function));
        });

        it('invoca onCancelled cuando completed=false', () => {
            licenseManager.hasFeature.mockReturnValue(true);
            wizard = new CalibrationWizard({ config, detector, i18n, licenseManager });
            const cancelCb = vi.fn();
            wizard.onCancelled = cancelCb;
            wizard.open({ auto: false });
            wizard.close({ completed: false });
            expect(cancelCb).toHaveBeenCalledOnce();
        });

        it('no invoca onCancelled cuando completed=true', () => {
            licenseManager.hasFeature.mockReturnValue(true);
            wizard = new CalibrationWizard({ config, detector, i18n, licenseManager });
            const cancelCb = vi.fn();
            wizard.onCancelled = cancelCb;
            wizard.open({ auto: false });
            wizard.close({ completed: true });
            expect(cancelCb).not.toHaveBeenCalled();
        });
    });

    // ─── 6. Algoritmo de safety factor (60%) ─────────────────────────────

    describe('Safety factor 60%', () => {
        it('computeThresholds aplica 60% safety factor al yaw range', () => {
            licenseManager.hasFeature.mockReturnValue(true);
            wizard = new CalibrationWizard({ config, detector, i18n, licenseManager });
            wizard.open({ auto: false });

            // Step 1: baseline con yaw centrado (~0)
            wizard.startCapture('baseline');
            for (let i = 0; i < 45; i++) {
                detector.emit('frame', frame(0.01, -0.05, 0.02));
            }
            expect(wizard.state.baseline).toBeDefined();
            expect(Math.abs(wizard.state.baseline.yaw)).toBeLessThan(0.05);

            // Step 2: leftRight con rango ±30° (~0.52 rad)
            wizard.step = 2;
            wizard.startCapture('leftRight');
            for (let i = 0; i < 90; i++) {
                const yaw = Math.sin(i * 0.14) * 0.52; // oscila ±0.52 rad (~30°)
                detector.emit('frame', frame(yaw, -0.05, 0.02));
            }
            expect(wizard.state.leftRight).toBeDefined();

            // El yaw threshold debería ser ≈ baseline + max(leftRange, rightRange) * 0.60
            const maxRange = Math.max(
                wizard.state.leftRight.leftRange,
                wizard.state.leftRight.rightRange
            );
            const expectedYaw = Math.abs(wizard.state.baseline.yaw) + maxRange * 0.60;
            // El threshold final está clamp entre 0.08 y 0.55
            const clampedExpected = Math.min(0.55, Math.max(0.08, expectedYaw));

            // Step 3: pitchTilt para que _computeThresholds tenga datos completos
            wizard.step = 3;
            wizard.startCapture('pitchTilt');
            for (let i = 0; i < 90; i++) {
                const pitch = -0.05 + Math.sin(i * 0.07) * 0.35;
                const roll = Math.sin(i * 0.09) * 0.30;
                detector.emit('frame', frame(0.01, pitch, roll));
            }
            expect(wizard.state.thresholds).toBeDefined();

            const th = wizard.state.thresholds;
            // Verificar que el yaw threshold está en el rango esperado (±0.05 por rounding)
            expect(th.yaw).toBeGreaterThanOrEqual(0.08);
            expect(Math.abs(th.yaw - clampedExpected)).toBeLessThan(0.06);
        });
    });

    // ─── 7. next()/prev() respetan límites ──────────────────────────────

    describe('next()/prev() bounds', () => {
        it('prev() en step 0 no va negativo', () => {
            licenseManager.hasFeature.mockReturnValue(true);
            wizard = new CalibrationWizard({ config, detector, i18n, licenseManager });
            wizard.open({ auto: false });
            expect(wizard.step).toBe(0);
            wizard.prev();
            expect(wizard.step).toBe(0);
        });

        it('next() en step 5 no incrementa (cierre es manual)', () => {
            licenseManager.hasFeature.mockReturnValue(true);
            wizard = new CalibrationWizard({ config, detector, i18n, licenseManager });
            wizard.open({ auto: false });
            wizard.step = 5;
            wizard.next();
            expect(wizard.step).toBe(5); // no incrementa más allá de 5
        });

        it('next() incrementa step correctamente', () => {
            licenseManager.hasFeature.mockReturnValue(true);
            wizard = new CalibrationWizard({ config, detector, i18n, licenseManager });
            wizard.open({ auto: false });
            wizard.state.baseline = { yaw: 0, pitch: 0, roll: 0, size: 200 }; // habilitar next
            expect(wizard.step).toBe(0);
            wizard.next();
            expect(wizard.step).toBe(1);
        });

        it('prev() decrementa step correctamente', () => {
            licenseManager.hasFeature.mockReturnValue(true);
            wizard = new CalibrationWizard({ config, detector, i18n, licenseManager });
            wizard.open({ auto: false });
            wizard.step = 3;
            wizard.prev();
            expect(wizard.step).toBe(2);
        });
    });

    // ─── 8. onApplied callback se invoca después de aplicar thresholds ──

    describe('applyThresholds()', () => {
        it('invoca onApplied con los thresholds calculados', () => {
            licenseManager.hasFeature.mockReturnValue(true);
            wizard = new CalibrationWizard({ config, detector, i18n, licenseManager });
            const appliedCb = vi.fn();
            wizard.onApplied = appliedCb;

            // Simular datos de calibración completos
            wizard.open({ auto: false });
            wizard.state.baseline = { yaw: 0.01, pitch: -0.05, roll: 0.02, size: 200 };
            wizard.state.leftRight = { leftRange: 0.25, rightRange: 0.30, minYaw: -0.25, maxYaw: 0.30 };
            wizard.state.pitchTilt = { upRange: 0.20, downRange: 0.25, tiltRange: 0.22, minPitch: -0.25, maxPitch: 0.20, minRoll: -0.20, maxRoll: 0.22 };

            wizard.applyThresholds();

            expect(appliedCb).toHaveBeenCalledOnce();
            const thresholds = appliedCb.mock.calls[0][0];
            expect(thresholds).toBeDefined();
            expect(thresholds.yaw).toBeDefined();
            expect(thresholds.pitchUp).toBeDefined();
            expect(thresholds.pitchDown).toBeDefined();
            expect(thresholds.roll).toBeDefined();
        });

        it('escribe thresholds en config via config.set()', () => {
            licenseManager.hasFeature.mockReturnValue(true);
            wizard = new CalibrationWizard({ config, detector, i18n, licenseManager });
            wizard.onApplied = vi.fn();

            wizard.open({ auto: false });
            wizard.state.baseline = { yaw: 0.01, pitch: -0.05, roll: 0.02, size: 200 };
            wizard.state.leftRight = { leftRange: 0.25, rightRange: 0.30, minYaw: -0.25, maxYaw: 0.30 };
            wizard.state.pitchTilt = { upRange: 0.20, downRange: 0.25, tiltRange: 0.22, minPitch: -0.25, maxPitch: 0.20, minRoll: -0.20, maxRoll: 0.22 };

            wizard.applyThresholds();

            expect(config.get('thresholds.yaw')).toBeDefined();
            expect(config.get('thresholds.pitchUp')).toBeDefined();
            expect(config.get('thresholds.pitchDown')).toBeDefined();
            expect(config.get('thresholds.roll')).toBeDefined();
        });

        it('marca completed=true al aplicar', () => {
            licenseManager.hasFeature.mockReturnValue(true);
            wizard = new CalibrationWizard({ config, detector, i18n, licenseManager });
            wizard.onApplied = vi.fn();

            wizard.state.baseline = { yaw: 0.01, pitch: -0.05, roll: 0.02, size: 200 };
            wizard.state.leftRight = { leftRange: 0.25, rightRange: 0.30, minYaw: -0.25, maxYaw: 0.30 };
            wizard.state.pitchTilt = { upRange: 0.20, downRange: 0.25, tiltRange: 0.22, minPitch: -0.25, maxPitch: 0.20, minRoll: -0.20, maxRoll: 0.22 };

            wizard.open({ auto: false });
            wizard.applyThresholds();

            expect(wizard.hasCompletedBefore()).toBe(true);
        });
    });

    // ─── 9. Skip durante captura ─────────────────────────────────────────

    describe('Skip durante captura', () => {
        it('close() durante collecting=true termina captura y llama onCancelled', () => {
            licenseManager.hasFeature.mockReturnValue(true);
            wizard = new CalibrationWizard({ config, detector, i18n, licenseManager });
            const cancelCb = vi.fn();
            wizard.onCancelled = cancelCb;

            wizard.open({ auto: false });
            wizard.step = 1;
            wizard.startCapture('baseline');
            expect(wizard.collecting).toBe(true);

            // Simular que el usuario presiona Skip (close con completed=false)
            wizard.close({ completed: false });

            expect(wizard.collecting).toBe(false);
            expect(wizard.active).toBe(false);
            expect(cancelCb).toHaveBeenCalledOnce();
        });
    });

    // ─── 10. _canGoNext() requiere captura previa ────────────────────────

    describe('_canGoNext()', () => {
        it('step 0 siempre permite avanzar', () => {
            licenseManager.hasFeature.mockReturnValue(true);
            wizard = new CalibrationWizard({ config, detector, i18n, licenseManager });
            expect(wizard._canGoNext()).toBe(true);
        });

        it('step 1 requiere baseline', () => {
            licenseManager.hasFeature.mockReturnValue(true);
            wizard = new CalibrationWizard({ config, detector, i18n, licenseManager });
            wizard.step = 1;
            expect(wizard._canGoNext()).toBe(false);
            wizard.state.baseline = { yaw: 0, pitch: 0, roll: 0, size: 200 };
            expect(wizard._canGoNext()).toBe(true);
        });

        it('step 2 requiere leftRight', () => {
            licenseManager.hasFeature.mockReturnValue(true);
            wizard = new CalibrationWizard({ config, detector, i18n, licenseManager });
            wizard.step = 2;
            expect(wizard._canGoNext()).toBe(false);
            wizard.state.leftRight = { leftRange: 0.2, rightRange: 0.2 };
            expect(wizard._canGoNext()).toBe(true);
        });

        it('step 3 requiere pitchTilt', () => {
            licenseManager.hasFeature.mockReturnValue(true);
            wizard = new CalibrationWizard({ config, detector, i18n, licenseManager });
            wizard.step = 3;
            expect(wizard._canGoNext()).toBe(false);
            wizard.state.pitchTilt = { upRange: 0.2, downRange: 0.2, tiltRange: 0.2 };
            expect(wizard._canGoNext()).toBe(true);
        });

        it('step 4 requiere handGesture', () => {
            licenseManager.hasFeature.mockReturnValue(true);
            wizard = new CalibrationWizard({ config, detector, i18n, licenseManager });
            wizard.step = 4;
            expect(wizard._canGoNext()).toBe(false);
            wizard.state.handGesture = 'thumbs-up';
            expect(wizard._canGoNext()).toBe(true);
        });
    });

    // ─── 11. Hand gesture detection ──────────────────────────────────────

    describe('Hand gesture capture', () => {
        it('detecta thumbs-up y lo guarda en state.handGesture', () => {
            licenseManager.hasFeature.mockReturnValue(true);
            wizard = new CalibrationWizard({ config, detector, i18n, licenseManager });
            wizard.open({ auto: false });
            wizard.step = 4;
            wizard.startCapture('handCheck');
            expect(wizard.collecting).toBe(true);

            detector.emit('frame', gestureFrame('thumb up'));

            expect(wizard.state.handGesture).toBe('thumbs-up');
            expect(wizard.collecting).toBe(false);
        });

        it('detecta peace sign', () => {
            licenseManager.hasFeature.mockReturnValue(true);
            wizard = new CalibrationWizard({ config, detector, i18n, licenseManager });
            wizard.open({ auto: false });
            wizard.step = 4;
            wizard.startCapture('handCheck');

            detector.emit('frame', gestureFrame('peace'));

            expect(wizard.state.handGesture).toBe('peace');
        });

        it('ignora gestos no soportados', () => {
            licenseManager.hasFeature.mockReturnValue(true);
            wizard = new CalibrationWizard({ config, detector, i18n, licenseManager });
            wizard.open({ auto: false });
            wizard.step = 4;
            wizard.startCapture('handCheck');

            detector.emit('frame', gestureFrame('unknown_gesture_xyz'));

            expect(wizard.state.handGesture).toBeNull();
            expect(wizard.collecting).toBe(true); // sigue capturando
        });
    });

    // ─── 12. Capture targets y progreso ──────────────────────────────────

    describe('Capture targets', () => {
        it('baseline tiene captureTarget = 45', () => {
            licenseManager.hasFeature.mockReturnValue(true);
            wizard = new CalibrationWizard({ config, detector, i18n, licenseManager });
            wizard.open({ auto: false });
            wizard.startCapture('baseline');
            expect(wizard.captureTarget).toBe(45);
        });

        it('leftRight tiene captureTarget = 90', () => {
            licenseManager.hasFeature.mockReturnValue(true);
            wizard = new CalibrationWizard({ config, detector, i18n, licenseManager });
            wizard.open({ auto: false });
            wizard.startCapture('leftRight');
            expect(wizard.captureTarget).toBe(90);
        });

        it('pitchTilt tiene captureTarget = 90', () => {
            licenseManager.hasFeature.mockReturnValue(true);
            wizard = new CalibrationWizard({ config, detector, i18n, licenseManager });
            wizard.open({ auto: false });
            wizard.startCapture('pitchTilt');
            expect(wizard.captureTarget).toBe(90);
        });

        it('handCheck tiene captureTarget = 120', () => {
            licenseManager.hasFeature.mockReturnValue(true);
            wizard = new CalibrationWizard({ config, detector, i18n, licenseManager });
            wizard.open({ auto: false });
            wizard.startCapture('handCheck');
            expect(wizard.captureTarget).toBe(120);
        });

        it('captura se finaliza al alcanzar captureTarget', () => {
            licenseManager.hasFeature.mockReturnValue(true);
            wizard = new CalibrationWizard({ config, detector, i18n, licenseManager });
            wizard.open({ auto: false });
            wizard.startCapture('baseline'); // target = 45

            for (let i = 0; i < 45; i++) {
                detector.emit('frame', frame(0.01, -0.05, 0.02));
            }

            expect(wizard.collecting).toBe(false);
            expect(wizard.state.baseline).toBeDefined();
            expect(wizard.captureCount).toBe(45);
        });
    });

    // ─── 13. _computeThresholds clamps ───────────────────────────────────

    describe('_computeThresholds() clamps', () => {
        it('yaw se clamp entre 0.08 y 0.55', () => {
            licenseManager.hasFeature.mockReturnValue(true);
            wizard = new CalibrationWizard({ config, detector, i18n, licenseManager });

            wizard.state.baseline = { yaw: 0, pitch: 0, roll: 0, size: 200 };
            wizard.state.leftRight = { leftRange: 0.01, rightRange: 0.01, minYaw: -0.01, maxYaw: 0.01 };
            wizard.state.pitchTilt = { upRange: 0.20, downRange: 0.25, tiltRange: 0.22 };

            const th = wizard._computeThresholds();
            expect(th.yaw).toBeGreaterThanOrEqual(0.08);
        });

        it('pitchUp se clamp entre -0.45 y -0.03', () => {
            licenseManager.hasFeature.mockReturnValue(true);
            wizard = new CalibrationWizard({ config, detector, i18n, licenseManager });

            wizard.state.baseline = { yaw: 0, pitch: 0, roll: 0, size: 200 };
            wizard.state.leftRight = { leftRange: 0.20, rightRange: 0.20, minYaw: -0.20, maxYaw: 0.20 };
            wizard.state.pitchTilt = { upRange: 0.20, downRange: 0.25, tiltRange: 0.22 };

            const th = wizard._computeThresholds();
            expect(th.pitchUp).toBeGreaterThanOrEqual(-0.45);
            expect(th.pitchUp).toBeLessThanOrEqual(-0.03);
        });

        it('pitchDown se clamp entre 0.05 y 0.45', () => {
            licenseManager.hasFeature.mockReturnValue(true);
            wizard = new CalibrationWizard({ config, detector, i18n, licenseManager });

            wizard.state.baseline = { yaw: 0, pitch: 0, roll: 0, size: 200 };
            wizard.state.leftRight = { leftRange: 0.20, rightRange: 0.20, minYaw: -0.20, maxYaw: 0.20 };
            wizard.state.pitchTilt = { upRange: 0.20, downRange: 0.25, tiltRange: 0.22 };

            const th = wizard._computeThresholds();
            expect(th.pitchDown).toBeGreaterThanOrEqual(0.05);
            expect(th.pitchDown).toBeLessThanOrEqual(0.45);
        });

        it('roll se clamp entre 0.08 y 0.55', () => {
            licenseManager.hasFeature.mockReturnValue(true);
            wizard = new CalibrationWizard({ config, detector, i18n, licenseManager });

            wizard.state.baseline = { yaw: 0, pitch: 0, roll: 0, size: 200 };
            wizard.state.leftRight = { leftRange: 0.20, rightRange: 0.20, minYaw: -0.20, maxYaw: 0.20 };
            wizard.state.pitchTilt = { upRange: 0.20, downRange: 0.25, tiltRange: 0.22 };

            const th = wizard._computeThresholds();
            expect(th.roll).toBeGreaterThanOrEqual(0.08);
            expect(th.roll).toBeLessThanOrEqual(0.55);
        });
    });
});
