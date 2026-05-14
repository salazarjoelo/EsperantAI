/**
 * EsperantAI Detector Worker — TASK-104
 *
 * Corre Human.js en un Web Worker separado del main thread.
 * Diseño de DeepSeek (refactorizado por Claude para preservar el contrato
 * postMessage del spec en docs/SPEC_DETECTOR_WORKER.md).
 *
 * Carga Human.js via importScripts (necesario para Web Workers, no usa
 * ES modules). Recibe FRAME por ImageBitmap transferable. Aplica
 * backpressure si el main thread envía más frames de los que puede procesar.
 *
 * Contrato (main → worker):
 *   INIT       { config, offscreenCanvas? }  → INIT_DONE { backend } o INIT_ERROR
 *   FRAME      { frameId, timestamp, bitmap, width, height }
 *   PAUSE      {}
 *   RESUME     {}
 *   TERMINATE  {}
 *
 * Contrato (worker → main):
 *   WORKER_READY       {}                                   ← al cargar el script
 *   INIT_DONE          { backend, modelsLoaded }
 *   INIT_ERROR         { error, fatal }
 *   MODEL_LOAD_PROGRESS { model, progress }                ← durante INIT
 *   RESULT             { frameId, timestamp, workerLatencyMs, result }
 *   ERROR              { error, frameId?, fatal }
 *   BACKEND_LOSS       {}                                   ← si WebGL context se pierde
 */

'use strict';

// Cargar Human.js (relativo al location del worker, que está en core/)
try {
    self.importScripts('../libs/human.js');
} catch (e) {
    self.postMessage({ type: 'INIT_ERROR', error: 'Failed to importScripts(human.js): ' + e.message, fatal: true });
}

// Estado interno
let human = null;
let canvas = null;
let ctx = null;
let running = true;
let pendingFrames = 0;
const MAX_PENDING = 2;
let backend = 'unknown';

/**
 * Inicializa Human.js con backend óptimo (WebGPU > WebGL > CPU).
 */
async function initHuman(config) {
    // Try WebGPU first
    if (typeof navigator !== 'undefined' && navigator.gpu) {
        try {
            human = new self.Human.Human({ ...config, backend: 'webgpu' });
            await human.load();
            backend = 'webgpu';
            return;
        } catch (e) {
            console.warn('[worker] WebGPU init failed, trying WebGL:', e.message);
        }
    }
    // WebGL
    try {
        human = new self.Human.Human({ ...config, backend: 'webgl' });
        await human.load();
        backend = 'webgl';
        return;
    } catch (e) {
        console.warn('[worker] WebGL init failed, falling back to CPU:', e.message);
    }
    // CPU fallback
    human = new self.Human.Human({ ...config, backend: 'cpu' });
    await human.load();
    backend = 'cpu';
}

async function processFrame(msg) {
    const { frameId, timestamp, bitmap, width, height } = msg;
    if (!human || !running) {
        if (bitmap && !bitmap.detached && bitmap.close) bitmap.close();
        return;
    }

    // Backpressure
    if (pendingFrames >= MAX_PENDING) {
        if (bitmap && !bitmap.detached && bitmap.close) bitmap.close();
        return;
    }

    pendingFrames++;
    const start = performance.now();
    try {
        // Ajustar canvas si el bitmap tiene tamaño distinto
        if (canvas && (canvas.width !== width || canvas.height !== height)) {
            canvas.width = width;
            canvas.height = height;
        }
        if (ctx && bitmap) {
            ctx.drawImage(bitmap, 0, 0, width, height);
        }

        // Detect
        const result = await human.detect(canvas);

        self.postMessage({
            type: 'RESULT',
            frameId,
            timestamp,
            workerLatencyMs: performance.now() - start,
            result,
        });
    } catch (e) {
        self.postMessage({ type: 'ERROR', error: e.message, frameId, fatal: false });
    } finally {
        pendingFrames--;
        if (bitmap && !bitmap.detached && bitmap.close) bitmap.close();
    }
}

self.onmessage = async function (event) {
    const data = event.data || {};
    const { type } = data;

    switch (type) {
        case 'INIT': {
            try {
                if (data.offscreenCanvas) {
                    canvas = data.offscreenCanvas;
                    ctx = canvas.getContext('2d');
                }
                await initHuman(data.config || {});
                self.postMessage({
                    type: 'INIT_DONE',
                    backend,
                    modelsLoaded: ['face', 'gesture', 'hand'].filter((m) => {
                        return (data.config?.[m]?.enabled !== false);
                    }),
                });
            } catch (e) {
                self.postMessage({ type: 'INIT_ERROR', error: e.message, fatal: true });
            }
            break;
        }
        case 'FRAME': {
            await processFrame(data);
            break;
        }
        case 'PAUSE': {
            running = false;
            break;
        }
        case 'RESUME': {
            running = true;
            break;
        }
        case 'TERMINATE': {
            running = false;
            human = null;
            canvas = null;
            ctx = null;
            self.close();
            break;
        }
        default:
            self.postMessage({
                type: 'ERROR',
                error: `Unknown message type: ${type}`,
                fatal: false,
            });
    }
};

// Listo para recibir INIT
self.postMessage({ type: 'WORKER_READY' });
