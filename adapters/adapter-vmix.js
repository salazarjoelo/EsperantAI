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
    }

    capabilities() {
        return {
            sceneSwitch: true,
            studioMode: true, // vMix tiene preview/program
            previewScene: true,
            transition: true,
            sourceVisibility: true,
            audioControl: true,
            recordingControl: true,
            streamingControl: true
        };
    }

    /**
     * @param {Object} cfg { host, port }  ej. { host: "127.0.0.1", port: 8088 }
     */
    async connect(cfg) {
        const host = cfg.host || '127.0.0.1';
        const port = cfg.port || 8088;
        this.baseUrl = `http://${host}:${port}/api/`;

        // Ping inicial
        try {
            await this._fetchState();
            this.connected = true;
            this.emit('connected');
            this._startPolling();
            return true;
        } catch (e) {
            this.emit('error', e);
            return false;
        }
    }

    async disconnect() {
        this._stopPolling();
        this.connected = false;
        this.emit('disconnected');
    }

    _startPolling() {
        this._stopPolling();
        this.pollInterval = setInterval(async () => {
            try {
                await this._fetchState();
            } catch (e) {
                // Si falla varios polls, marcar desconectado
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
     * Fetch estado y parse XML. vMix devuelve XML con todos los inputs.
     */
    async _fetchState() {
        const res = await fetch(this.baseUrl);
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
        const activeIdx = parseInt(xml.querySelector('active')?.textContent || '1', 10);
        const activeInput = inputs[activeIdx - 1]; // vMix usa 1-based
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
            const res = await fetch(url);
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
            await fetch(url);
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
            await fetch(url);
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
