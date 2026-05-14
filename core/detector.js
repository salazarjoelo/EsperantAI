/* ============================================================================
 * EsperantAI — Detector
 * Wrapper alrededor de Human.js 3.3.6 + gestión de cámara.
 * ========================================================================== */

'use strict';

class Detector {
    constructor(config) {
        this.config = config;
        this.human = null;
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
    }

    buildHumanConfig() {
        const enabled = this.config.get('enabled');
        return {
            modelBasePath: 'https://vladmandic.github.io/human-models/models/',
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

        this.human = new Human.Human(this.buildHumanConfig());
        try {
            await this.human.load();
            this.emit('ai_ready');
        } catch (e) {
            this.emit('ai_error', e);
            throw e;
        }
    }

    /** Recargar Human con nueva config (cuando user toggle categorías). */
    async reload() {
        try {
            this.emit('ai_loading');
            this.human = new Human.Human(this.buildHumanConfig());
            await this.human.load();
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
            requestAnimationFrame(loop);
        };
        requestAnimationFrame(loop);
        // Return stop function
        return () => { running = false; };
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

    setPaused(p) { this.isPaused = p; }

    on(event, fn) {
        if (!this.listeners[event]) this.listeners[event] = [];
        this.listeners[event].push(fn);
    }

    emit(event, payload) {
        (this.listeners[event] || []).forEach(fn => { try { fn(payload); } catch {} });
    }

    backend() {
        return this.human?.tf?.getBackend?.() || 'unknown';
    }
}

window.Detector = Detector;
