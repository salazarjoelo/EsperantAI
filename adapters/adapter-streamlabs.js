/* ============================================================================
 * EsperantAI — Adapter Streamlabs Desktop
 * Conecta vía Streamlabs Desktop API local (WebSocket :59650 con token).
 *
 * Docs: https://github.com/streamlabs/streamlabs-desktop-api-docs
 * Setup en Streamlabs Desktop:
 *   Settings → Remote Control → Enable WebSocket → Show QR / Token
 *   Default port: 59650
 *
 * El usuario obtiene el API token desde la UI de Streamlabs y lo pega en EsperantAI.
 * ========================================================================== */

'use strict';

class AdapterStreamlabs extends AdapterBase {
    constructor() {
        super('Streamlabs');
        this.ws = null;
        this.token = null;
        this.port = 59650;
        this.requestId = 0;
        this.pendingRequests = new Map();
        this.currentScene = '';
        this.availableScenes = [];
    }

    capabilities() {
        return {
            sceneSwitch: true,
            studioMode: false, // Streamlabs Desktop no expone studio mode via API local
            previewScene: false,
            transition: false,
            sourceVisibility: true,
            audioControl: true,
            recordingControl: false,
            streamingControl: false
        };
    }

    /**
     * @param {Object} cfg { token, port }
     */
    async connect(cfg) {
        this.token = cfg.token;
        this.port = cfg.port || 59650;

        return new Promise((resolve) => {
            try {
                this.ws = new WebSocket(`ws://127.0.0.1:${this.port}/api/websocket`);
            } catch (e) {
                this.emit('error', e);
                return resolve(false);
            }

            this.ws.onopen = async () => {
                try {
                    await this._authenticate();
                    this.connected = true;
                    await this._fetchScenes();
                    this.emit('connected');
                    resolve(true);
                } catch (e) {
                    this.emit('error', e);
                    resolve(false);
                }
            };

            this.ws.onmessage = (event) => this._handleMessage(event.data);
            this.ws.onerror = (err) => this.emit('error', err);
            this.ws.onclose = () => {
                this.connected = false;
                this.emit('disconnected');
            };

            setTimeout(() => {
                if (!this.connected) resolve(false);
            }, 5000);
        });
    }

    async _authenticate() {
        return this._request('TcpServerService', 'auth', [this.token]);
    }

    _request(resource, method, args = []) {
        return new Promise((resolve, reject) => {
            const id = ++this.requestId;
            const payload = {
                jsonrpc: '2.0',
                id,
                method,
                params: { resource, args }
            };
            this.pendingRequests.set(id, { resolve, reject });
            this.ws.send(JSON.stringify(payload));

            setTimeout(() => {
                if (this.pendingRequests.has(id)) {
                    this.pendingRequests.delete(id);
                    reject(new Error('Streamlabs request timeout'));
                }
            }, 5000);
        });
    }

    _handleMessage(data) {
        try {
            const msg = JSON.parse(data);
            if (msg.id && this.pendingRequests.has(msg.id)) {
                const { resolve, reject } = this.pendingRequests.get(msg.id);
                this.pendingRequests.delete(msg.id);
                if (msg.error) reject(msg.error);
                else resolve(msg.result);
            } else if (msg.method === 'sceneSwitched' || msg.method === 'scenesChanged') {
                // Re-fetch
                this._fetchScenes();
            }
        } catch (e) {
            console.warn('Streamlabs parse error:', e);
        }
    }

    async _fetchScenes() {
        try {
            const scenes = await this._request('ScenesService', 'getScenes');
            if (Array.isArray(scenes)) {
                const newList = scenes.map(s => ({ name: s.name, uuid: s.id }));
                this.availableScenes = newList;
                this.emit('scene_list_changed', newList);
            }
            const active = await this._request('ScenesService', 'activeScene');
            if (active) {
                this.currentScene = active.name;
                this.emit('scene_changed', active.name);
            }
        } catch (e) {
            console.warn('Streamlabs fetchScenes failed:', e);
        }
    }

    async getScenes() {
        if (!this.availableScenes.length) await this._fetchScenes();
        return this.availableScenes;
    }

    async getCurrentScene() {
        return this.currentScene;
    }

    async switchScene(sceneName) {
        const scene = this.availableScenes.find(s => s.name === sceneName);
        if (!scene) return false;
        try {
            await this._request('ScenesService', 'makeSceneActive', [scene.uuid]);
            this.currentScene = sceneName;
            return true;
        } catch (e) {
            this.emit('error', e);
            return false;
        }
    }

    async disconnect() {
        if (this.ws) {
            try { this.ws.close(); } catch { /* ignore */ }
            this.ws = null;
        }
        this.connected = false;
        this.emit('disconnected');
    }
}

window.AdapterStreamlabs = AdapterStreamlabs;
