/* ============================================================================
 * EsperantAI — Detector
 * Wrapper alrededor de Human.js 3.3.6 + gestión de cámara.
 *
 * TASK-104 (2026-05-14): puede ejecutar Human.js en un Web Worker
 * (core/detector-worker.js) cuando OffscreenCanvas + Worker están soportados.
 * Auto-fallback a main thread (comportamiento legacy) si no.
 *
 * API pública NO cambia: class Detector + window.Detector + on() + startCamera()
 * + startLoop() + setPaused() + reload() + backend() — todo igual que antes.
 * ========================================================================== */

'use strict';

class Detector {
    constructor(config) {
        this.config = config;
        this.human = null;                  // Solo poblado en main-thread mode
        this.currentStream = null;
        this.videoElement = null;
        this.canvasElement = null;
        this.ctx = null;
        this.isPaused = false;
        this.frameCount = 0;
        this.lastReportTime = 0;
        this.listeners = {};

        // Modo silencioso automático (desactivar logs después de 60s estable)
        this.verboseMode = true;
        this.firstGoodFrameTime = 0;
        this.VERBOSE_TIMEOUT_MS = 60000;
        this.SILENT_FRAMES_LOST = 15;

        // TASK-104: Web Worker fields. _useWorker se decide en init() según
        // soporte de OffscreenCanvas + Worker.
        this._useWorker = false;
        this._worker = null;
        this._workerReady = false;
        this._workerFrameId = 0;
        this._pendingWorkerFrames = 0;
        this._workerOnFrame = null;  // Set en startLoop() para entregar results
    }

    /** Detecta si podemos usar Web Worker + OffscreenCanvas. */
    _supportsWorker() {
        try {
            return typeof Worker !== 'undefined'
                && typeof OffscreenCanvas !== 'undefined'
                && typeof createImageBitmap === 'function';
        } catch {
            return false;
        }
    }

    buildHumanConfig() {
        const enabled = this.config.get('enabled');
        return {
            // Fix audit H-04: modelos empaquetados localmente en /models/.
            // Cero dependencia de supply chain externo, funciona 100% offline.
            modelBasePath: 'models/',
            backend: 'webgl',
            warmup: 'face',
            face: {
                enabled: true,
                detector: { rotation: true, return: false, minConfidence: 0.15, iouThreshold: 0.1, skipFrames: 0, skipTime: 0 },
                mesh: { enabled: true },
                iris: { enabled: !!(enabled.gaze || enabled.blink) },
                emotion: { enabled: !!enabled.emotion, minConfidence: 0.20 },
                description: { enabled: false },
                attention: { enabled: false },
                antispoof: { enabled: false },
                liveness: { enabled: false }
            },
            body: { enabled: false },
            hand: { enabled: !!enabled.hand, rotation: true, minConfidence: 0.5 },
            object: { enabled: false },
            gesture: { enabled: !!(enabled.blink || enabled.hand) },
            segmentation: { enabled: false }
        };
    }

    async init(videoEl, canvasEl) {
        this.videoElement = videoEl;
        this.canvasElement = canvasEl;
        this.ctx = canvasEl.getContext('2d');
        this._useWorker = this._supportsWorker();

        if (this._useWorker) {
            // TASK-104: intentar inicializar worker. Si falla, fallback a main thread.
            try {
                await this._initWorker();
                this.emit('ai_ready');
                console.log('[Detector] Running in Web Worker mode, backend:', this._workerBackend);
                return;
            } catch (e) {
                console.warn('[Detector] Worker init failed, falling back to main thread:', e.message);
                this._useWorker = false;
                if (this._worker) {
                    try { this._worker.terminate(); } catch {}
                    this._worker = null;
                }
            }
        }

        // Main-thread fallback (comportamiento legacy)
        this.human = new Human.Human(this.buildHumanConfig());
        try {
            await this.human.load();
            this.emit('ai_ready');
            console.log('[Detector] Running in main thread mode');
        } catch (e) {
            this.emit('ai_error', e);
            throw e;
        }
    }

    /** TASK-104: Inicializar el Web Worker. */
    async _initWorker() {
        return new Promise((resolve, reject) => {
            this._worker = new Worker('core/detector-worker.js');
            const initTimeout = setTimeout(() => reject(new Error('Worker init timeout (10s)')), 10000);

            this._worker.onmessage = (event) => {
                const msg = event.data || {};
                switch (msg.type) {
                    case 'WORKER_READY': {
                        // Enviar INIT con OffscreenCanvas transferido
                        const offscreen = this.canvasElement.transferControlToOffscreen();
                        this._worker.postMessage({
                            type: 'INIT',
                            config: this.buildHumanConfig(),
                            offscreenCanvas: offscreen,
                        }, [offscreen]);
                        break;
                    }
                    case 'INIT_DONE':
                        clearTimeout(initTimeout);
                        this._workerReady = true;
                        this._workerBackend = msg.backend;
                        resolve();
                        break;
                    case 'INIT_ERROR':
                        clearTimeout(initTimeout);
                        reject(new Error(msg.error || 'worker init error'));
                        break;
                    case 'RESULT':
                        this._pendingWorkerFrames = Math.max(0, this._pendingWorkerFrames - 1);
                        if (this._workerOnFrame) {
                            this.frameCount++;
                            try { this._workerOnFrame(msg.result, this.frameCount); } catch (e) {
                                console.error('[Detector] onFrame callback threw:', e);
                            }
                            this.emit('frame', { result: msg.result, frame: this.frameCount });
                        }
                        break;
                    case 'ERROR':
                        console.error('[Detector] Worker error:', msg.error);
                        this.emit('ai_error', new Error(msg.error));
                        if (msg.fatal) {
                            this._useWorker = false;
                        }
                        break;
                    case 'BACKEND_LOSS':
                        console.warn('[Detector] WebGL context lost in worker');
                        this.emit('ai_loading');
                        break;
                }
            };

            this._worker.onerror = (e) => {
                clearTimeout(initTimeout);
                reject(new Error('Worker script error: ' + e.message));
            };
        });
    }

    /** Recargar Human con nueva config (cuando user toggle categorías). */
    async reload() {
        try {
            this.emit('ai_loading');
            if (this._useWorker) {
                // En worker mode: terminar el worker y re-init (más simple que
                // mensaje RELOAD; Human.js no soporta cambiar config caliente).
                if (this._worker) {
                    try { this._worker.terminate(); } catch {}
                    this._worker = null;
                }
                this._workerReady = false;
                this._pendingWorkerFrames = 0;
                await this._initWorker();
            } else {
                this.human = new Human.Human(this.buildHumanConfig());
                await this.human.load();
            }
            this.emit('ai_ready');
        } catch (e) {
            this.emit('ai_error', e);
        }
    }

    async listCameras() {
        try {
            const devices = await navigator.mediaDevices.enumerateDevices();
            return devices.filter(d => d.kind === 'videoinput');
        } catch {
            return [];
        }
    }

    async startCamera(preferredDeviceId = null) {
        if (this.currentStream) {
            this.currentStream.getTracks().forEach(t => t.stop());
            this.currentStream = null;
        }
        this.videoElement.srcObject = null;

        const constraints = {
            video: { width: { ideal: 640 }, height: { ideal: 480 } }
        };
        if (preferredDeviceId) constraints.video.deviceId = { exact: preferredDeviceId };
        else constraints.video.facingMode = 'user';

        try {
            const stream = await navigator.mediaDevices.getUserMedia(constraints);
            this.currentStream = stream;
            this.videoElement.srcObject = stream;

            // Esperar a que video tenga datos
            await new Promise(resolve => {
                if (this.videoElement.readyState >= 2 && this.videoElement.videoWidth > 0) return resolve();
                const onReady = () => {
                    this.videoElement.removeEventListener('loadeddata', onReady);
                    this.videoElement.removeEventListener('canplay', onReady);
                    resolve();
                };
                this.videoElement.addEventListener('loadeddata', onReady, { once: true });
                this.videoElement.addEventListener('canplay', onReady, { once: true });
            });

            this.canvasElement.width = this.videoElement.videoWidth || 640;
            this.canvasElement.height = this.videoElement.videoHeight || 480;
            return stream;
        } catch (e) {
            if (preferredDeviceId) {
                console.warn('Camera failed with preferred device, retrying default');
                return this.startCamera(null);
            }
            throw e;
        }
    }

    /**
     * Loop de detección. Llama callback con result + meta cada frame.
     * @param {Function} onFrame (result, framesSinceFace, ms) => void
     */
    startLoop(onFrame) {
        if (this._useWorker && this._workerReady) {
            return this._startLoopWorker(onFrame);
        }
        return this._startLoopMainThread(onFrame);
    }

    /** Loop legacy: ejecuta human.detect() en main thread cada frame. */
    _startLoopMainThread(onFrame) {
        let running = true;
        const loop = async () => {
            if (!running) return;
            if (this.videoElement.paused || this.videoElement.ended || this.isPaused) {
                setTimeout(() => requestAnimationFrame(loop), 100);
                return;
            }
            let result;
            try {
                result = await this.human.detect(this.videoElement);
                this.frameCount++;
                this._logIfVerbose(result);
            } catch (e) {
                console.error('human.detect error:', e);
                setTimeout(() => requestAnimationFrame(loop), 100);
                return;
            }
            this.ctx.clearRect(0, 0, this.canvasElement.width, this.canvasElement.height);
            try { this.human.draw.face(this.canvasElement, result.face || []); } catch {}
            onFrame(result, this.frameCount);
            this.emit('frame', { result, frame: this.frameCount });
            requestAnimationFrame(loop);
        };
        requestAnimationFrame(loop);
        return () => { running = false; };
    }

    /** TASK-104: Loop worker-mode. Envía frames vía postMessage. */
    _startLoopWorker(onFrame) {
        this._workerOnFrame = onFrame;
        let running = true;
        const MAX_PENDING = 2;

        const loop = async () => {
            if (!running) return;
            if (this.videoElement.paused || this.videoElement.ended || this.isPaused) {
                setTimeout(() => requestAnimationFrame(loop), 100);
                return;
            }
            // Backpressure: si el worker está saturado, descartar este frame
            if (this._pendingWorkerFrames >= MAX_PENDING) {
                requestAnimationFrame(loop);
                return;
            }
            try {
                const bitmap = await createImageBitmap(this.videoElement);
                const frameId = ++this._workerFrameId;
                this._pendingWorkerFrames++;
                this._worker.postMessage({
                    type: 'FRAME',
                    frameId,
                    timestamp: performance.now(),
                    bitmap,
                    width: this.videoElement.videoWidth || 640,
                    height: this.videoElement.videoHeight || 480,
                }, [bitmap]);
            } catch (e) {
                console.error('[Detector] createImageBitmap failed:', e);
            }
            requestAnimationFrame(loop);
        };
        requestAnimationFrame(loop);
        return () => {
            running = false;
            this._workerOnFrame = null;
        };
    }

    _logIfVerbose(result) {
        const now = Date.now();
        const faceCount = result?.face?.length || 0;

        if (faceCount > 0 && this.firstGoodFrameTime === 0) this.firstGoodFrameTime = now;

        if (this.verboseMode && faceCount > 0 && this.firstGoodFrameTime > 0
            && (now - this.firstGoodFrameTime) > this.VERBOSE_TIMEOUT_MS) {
            this.verboseMode = false;
            console.log('🔕 Silent mode activated after 60s stable.');
        }

        if (this.verboseMode && now - this.lastReportTime > 3000) {
            this.lastReportTime = now;
            if (faceCount === 0) {
                console.log(`🔍 Frame #${this.frameCount}: 0 faces. videoRes=${this.videoElement.videoWidth}x${this.videoElement.videoHeight}`);
            } else {
                console.log(`✓ Frame #${this.frameCount}: ${faceCount} face(s)`);
            }
        }
    }

    setPaused(p) {
        this.isPaused = p;
        if (this._useWorker && this._worker) {
            this._worker.postMessage({ type: p ? 'PAUSE' : 'RESUME' });
        }
    }

    on(event, fn) {
        if (!this.listeners[event]) this.listeners[event] = [];
        this.listeners[event].push(fn);
    }

    /** TASK-102: unsubscribe — used by CalibrationWizard. */
    off(event, fn) {
        if (!this.listeners[event]) return;
        this.listeners[event] = this.listeners[event].filter(x => x !== fn);
    }

    emit(event, payload) {
        (this.listeners[event] || []).forEach(fn => { try { fn(payload); } catch {} });
    }

    backend() {
        if (this._useWorker) return this._workerBackend || 'worker-unknown';
        return this.human?.tf?.getBackend?.() || 'unknown';
    }

    /** TASK-104: terminar worker limpiamente. Llamar al destruir. */
    terminate() {
        if (this._worker) {
            try { this._worker.postMessage({ type: 'TERMINATE' }); } catch {}
            try { this._worker.terminate(); } catch {}
            this._worker = null;
        }
        if (this.currentStream) {
            this.currentStream.getTracks().forEach((t) => t.stop());
            this.currentStream = null;
        }
    }
}

window.Detector = Detector;
