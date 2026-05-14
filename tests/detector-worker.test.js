/**
 * Tests para core/detector-worker.js + integración con core/detector.js
 *
 * Diseño de DeepSeek (refactorizado por Claude para usar el patrón de
 * window-script loading del repo en lugar de ES modules).
 *
 * NOTA: el detector real necesita Human.js + canvas/video reales. Aquí
 * mockeamos APIs de browser que jsdom no implementa (OffscreenCanvas,
 * Worker, createImageBitmap) y verificamos que el código del detector
 * NO CRASHEA y respeta el contrato.
 *
 * Tests positivos (worker mode end-to-end) requieren un browser real;
 * marcamos como .skip() y se validan manualmente.
 */

import { describe, it, expect, beforeEach, afterEach, vi } from 'vitest';
import { loadWindowScript } from './helpers/load-window-script.js';

describe('core/detector.js — TASK-104 Worker mode detection', () => {
    let Detector;
    let mockConfig;

    beforeEach(() => {
        delete globalThis.Detector;
        delete globalThis.Human;

        // Stub mínimo de Human (global.Human.Human) para que el detector
        // no falle al hacer new Human.Human() en main-thread mode
        globalThis.Human = {
            Human: class FakeHuman {
                constructor() {
                    this.tf = { getBackend: () => 'fake-webgl' };
                    this.draw = { face: () => {} };
                }
                async load() {}
                async detect() {
                    return { face: [], hand: [], gesture: [], emotion: [] };
                }
            },
        };

        loadWindowScript('core/detector.js');
        Detector = globalThis.Detector;

        mockConfig = {
            _store: { enabled: { hand: false, gaze: false, emotion: false, blink: false } },
            get(path, fallback) {
                const parts = path.split('.');
                let cur = this._store;
                for (const p of parts) {
                    if (cur && typeof cur === 'object' && p in cur) cur = cur[p];
                    else return fallback;
                }
                return cur;
            },
            set() {},
            flush() {},
        };
    });

    afterEach(() => {
        delete globalThis.Human;
        delete globalThis.Worker;
        delete globalThis.OffscreenCanvas;
        delete globalThis.createImageBitmap;
    });

    describe('Worker support detection', () => {
        it('_supportsWorker() devuelve false sin OffscreenCanvas', () => {
            // jsdom NO tiene OffscreenCanvas por default
            const det = new Detector(mockConfig);
            expect(det._supportsWorker()).toBe(false);
        });

        it('_supportsWorker() devuelve true con todos los APIs presentes', () => {
            globalThis.Worker = class MockWorker {};
            globalThis.OffscreenCanvas = class MockOffscreen { constructor(w, h) { this.width = w; this.height = h; } };
            globalThis.createImageBitmap = async () => ({ close: () => {}, detached: false });

            const det = new Detector(mockConfig);
            expect(det._supportsWorker()).toBe(true);
        });

        it('_supportsWorker() devuelve false si Worker existe pero OffscreenCanvas no', () => {
            globalThis.Worker = class {};
            // Sin OffscreenCanvas
            const det = new Detector(mockConfig);
            expect(det._supportsWorker()).toBe(false);
        });
    });

    describe('API pública preservada (regression check)', () => {
        it('class Detector se expone en window', () => {
            expect(globalThis.Detector).toBeDefined();
            expect(typeof globalThis.Detector).toBe('function');
        });

        it('new Detector(config) crea instancia con métodos esperados', () => {
            const det = new Detector(mockConfig);
            expect(typeof det.init).toBe('function');
            expect(typeof det.startCamera).toBe('function');
            expect(typeof det.startLoop).toBe('function');
            expect(typeof det.setPaused).toBe('function');
            expect(typeof det.reload).toBe('function');
            expect(typeof det.backend).toBe('function');
            expect(typeof det.on).toBe('function');
            expect(typeof det.emit).toBe('function');
            expect(typeof det.terminate).toBe('function');
        });

        it('on() / emit() event emitter funciona', () => {
            const det = new Detector(mockConfig);
            const callback = vi.fn();
            det.on('test_event', callback);
            det.emit('test_event', 'payload');
            expect(callback).toHaveBeenCalledWith('payload');
        });

        it('emit() con listener que lanza no rompe los otros', () => {
            const det = new Detector(mockConfig);
            const bad = vi.fn(() => { throw new Error('boom'); });
            const good = vi.fn();
            det.on('e', bad);
            det.on('e', good);
            det.emit('e');
            expect(bad).toHaveBeenCalled();
            expect(good).toHaveBeenCalled();
        });

        it('setPaused(true) marca isPaused', () => {
            const det = new Detector(mockConfig);
            det.setPaused(true);
            expect(det.isPaused).toBe(true);
            det.setPaused(false);
            expect(det.isPaused).toBe(false);
        });

        it('backend() devuelve "unknown" antes de init', () => {
            const det = new Detector(mockConfig);
            expect(det.backend()).toBe('unknown');
        });

        it('terminate() no crashea si no se inicializó', () => {
            const det = new Detector(mockConfig);
            expect(() => det.terminate()).not.toThrow();
        });
    });

    describe('Main-thread mode (fallback path)', () => {
        it('init() con APIs de browser ausentes cae a main-thread mode', async () => {
            // Sin Worker ni OffscreenCanvas en globalThis
            const det = new Detector(mockConfig);
            const mockVideo = { videoWidth: 640, videoHeight: 480, paused: false, ended: false };
            const mockCanvas = { width: 0, height: 0, getContext: () => ({
                clearRect: () => {}, drawImage: () => {},
            })};

            await det.init(mockVideo, mockCanvas);

            expect(det._useWorker).toBe(false);
            expect(det.human).toBeDefined(); // Human.Human creado en main thread
        });
    });

    // ─── Worker-mode integration tests ────────────────────────────────────
    // Requieren browser real (jsdom no soporta Worker scripts + OffscreenCanvas + Human.js).
    // Las dejamos como skip + se validan manualmente cargando index.html en Chrome.
    describe.skip('Worker-mode integration (manual browser tests)', () => {
        it('init() con OffscreenCanvas crea worker y recibe INIT_DONE', async () => {});
        it('startLoop() envía FRAMEs al worker', async () => {});
        it('worker backpressure descarta frames si pendingFrames >= 2', async () => {});
        it('terminate() libera el worker correctamente', async () => {});
    });
});
