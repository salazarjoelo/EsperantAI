/* ============================================================================
 * EsperantAI — Adapter vMix
 * Conecta vía vMix HTTP Web Controller API (default port 8088).
 *
 * Docs:
 *   - https://www.vmix.com/help25/WebController.html
 *   - https://www.vmix.com/help25/DeveloperAPI.html
 *   - https://vmixapi.com/ (unofficial reference)
 *
 * Setup en vMix:
 *   Settings → Web Controller → Enable
 *   Default port: 8088
 *
 * API es HTTP REST simple, polling-based.
 * Endpoint: http://127.0.0.1:8088/api/?Function=NAME&Input=ID
 * Return: XML con estado actual
 *
 * Z-204 hardening (2026-05-14):
 *   Z-ADP-03: isConnecting guard contra doble connect
 *   Z-ADP-04: AbortController con timeout en cada fetch
 *             (sin esto, fetches acumulaban si vMix tardaba > 1.5s)
 *   Z-ADP-06: capabilities ajustadas — métodos no implementados
 *             reportan false en lugar de mentir
 *   Z-ADP-10: validación de activeIdx 1-based contra inputs.length
 * ========================================================================== */

'use strict';

class AdapterVMix extends AdapterBase {
    constructor() {
        super('vMix');
        this.baseUrl = null;
        this.pollInterval = null;
        this.pollMs = 1500; // polling cada 1.5s
        this.currentScene = '';
        this.availableScenes = [];
        this.lastScenesHash = '';

        // Z-ADP-03: connect guard
        this.isConnecting = false;
        // Z-ADP-04: timeout para todos los fetches
        this.fetchTimeoutMs = 3000;
        // Z-ADP-04: AbortController del fetch en curso para cancelar el anterior
        // antes de lanzar uno nuevo del poll loop
        this._currentFetchController = null;
    }

    capabilities() {
        // Z-ADP-06: reportar SOLO lo que realmente está implementado en esta clase.
        // sceneSwitch, studioMode, previewScene, transition → implementados.
        // sourceVisibility, audioControl, recordingControl, streamingControl →
        // NO implementados (el adapter base lanzaría "must be implemented by subclass")
        // — reportarlos como false evita que la UI muestre features fantasma.
        return {
            sceneSwitch: true,
            studioMode: true,
            previewScene: true,
            transition: true,
            sourceVisibility: false, // TODO: implementar via vMix HTTP API (Function=SetVisibility)
            audioControl: false,     // TODO: Function=AudioOn/AudioOff
            recordingControl: false, // TODO: Function=StartRecording/StopRecording
            streamingControl: false  // TODO: Function=StartStreaming/StopStreaming
        };
    }

    /**
     * @param {Object} cfg { host, port }  ej. { host: "127.0.0.1", port: 8088 }
     */
    async connect(cfg) {
        // Z-ADP-03: prevenir doble connect
        if (this.isConnecting || this.connected) return false;
        this.isConnecting = true;

        const host = cfg.host || '127.0.0.1';
        const port = cfg.port || 8088;
        this.baseUrl = `http://${host}:${port}/api/`;

        // Ping inicial
        try {
            await this._fetchState();
            this.connected = true;
            this.isConnecting = false;
            this.emit('connected');
            this._startPolling();
            return true;
        } catch (e) {
            this.isConnecting = false;
            this.emit('error', e);
            return false;
        }
    }

    async disconnect() {
        this._stopPolling();
        // Z-ADP-04: cancelar fetch en curso para liberar recursos
        if (this._currentFetchController) {
            try { this._currentFetchController.abort(); } catch { /* ignore */ }
            this._currentFetchController = null;
        }
        this.connected = false;
        this.emit('disconnected');
    }

    _startPolling() {
        this._stopPolling();
        this.pollInterval = setInterval(async () => {
            try {
                await this._fetchState();
            } catch (e) {
                // Si falla, marcar desconectado y detener polling.
                // (Z-ADP-04: el AbortError de timeout también cae aquí — esperado)
                this.connected = false;
                this.emit('disconnected');
                this._stopPolling();
            }
        }, this.pollMs);
    }

    _stopPolling() {
        if (this.pollInterval) {
            clearInterval(this.pollInterval);
            this.pollInterval = null;
        }
    }

    /**
     * Fetch con timeout via AbortController (Z-ADP-04).
     * Si el fetch tarda más de fetchTimeoutMs, se aborta para no acumular
     * requests pendientes bajo carga.
     */
    async _fetchWithTimeout(url, options = {}) {
        // Cancelar fetch anterior del poll loop si todavía está en curso
        if (this._currentFetchController) {
            try { this._currentFetchController.abort(); } catch { /* ignore */ }
        }
        const controller = new AbortController();
        this._currentFetchController = controller;
        const timeoutId = setTimeout(() => controller.abort(), this.fetchTimeoutMs);
        try {
            return await fetch(url, { ...options, signal: controller.signal });
        } finally {
            clearTimeout(timeoutId);
            if (this._currentFetchController === controller) {
                this._currentFetchController = null;
            }
        }
    }

    /**
     * Fetch estado y parse XML. vMix devuelve XML con todos los inputs.
     */
    async _fetchState() {
        const res = await this._fetchWithTimeout(this.baseUrl);
        if (!res.ok) throw new Error(`vMix HTTP ${res.status}`);
        const xmlText = await res.text();
        const xml = new DOMParser().parseFromString(xmlText, 'application/xml');

        // Inputs (escenas en vMix son "inputs")
        const inputs = Array.from(xml.querySelectorAll('inputs > input'));
        const newScenes = inputs.map(input => ({
            name: input.getAttribute('title') || input.textContent || '(unnamed)',
            uuid: input.getAttribute('key') // GUID en vMix
        }));

        const newHash = newScenes.map(s => s.name).join('|');
        if (newHash !== this.lastScenesHash) {
            this.lastScenesHash = newHash;
            this.availableScenes = newScenes;
            this.emit('scene_list_changed', newScenes);
        }

        // Active input (escena de programa)
        // Z-ADP-10: validar activeIdx contra inputs.length antes de indexar
        const activeIdx = parseInt(xml.querySelector('active')?.textContent || '1', 10);
        const activeInput = (Number.isFinite(activeIdx) && activeIdx >= 1 && activeIdx <= inputs.length)
            ? inputs[activeIdx - 1]
            : null;
        if (activeInput) {
            const newCurrent = activeInput.getAttribute('title') || '';
            if (newCurrent !== this.currentScene) {
                this.currentScene = newCurrent;
                this.emit('scene_changed', newCurrent);
            }
        }
    }

    async getScenes() {
        if (!this.availableScenes.length) await this._fetchState();
        return this.availableScenes;
    }

    async getCurrentScene() {
        return this.currentScene;
    }

    async switchScene(sceneName) {
        const scene = this.availableScenes.find(s => s.name === sceneName);
        if (!scene) return false;
        // Function=ActiveInput va directo a programa con corte
        try {
            const url = `${this.baseUrl}?Function=ActiveInput&Input=${encodeURIComponent(scene.uuid)}`;
            const res = await this._fetchWithTimeout(url);
            if (!res.ok) throw new Error(`vMix HTTP ${res.status}`);
            this.currentScene = sceneName;
            return true;
        } catch (e) {
            this.emit('error', e);
            return false;
        }
    }

    async setPreviewScene(sceneName) {
        const scene = this.availableScenes.find(s => s.name === sceneName);
        if (!scene) return false;
        try {
            const url = `${this.baseUrl}?Function=PreviewInput&Input=${encodeURIComponent(scene.uuid)}`;
            await this._fetchWithTimeout(url);
            return true;
        } catch (e) {
            this.emit('error', e);
            return false;
        }
    }

    async triggerTransition() {
        try {
            // Cut por default, podría exponerse Function=Fade&Duration=ms
            const url = `${this.baseUrl}?Function=Cut`;
            await this._fetchWithTimeout(url);
            return true;
        } catch (e) {
            this.emit('error', e);
            return false;
        }
    }

    async isStudioMode() {
        // vMix siempre tiene preview/program disponible
        return true;
    }
}

window.AdapterVMix = AdapterVMix;
