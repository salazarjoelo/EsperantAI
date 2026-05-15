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
 *
 * Z-204 hardening (2026-05-14):
 *   Z-ADP-01: reconnect con backoff exponencial portado del patrón OBS
 *   Z-ADP-02: listeners del WS viejo limpiados antes de crear uno nuevo
 *   Z-ADP-03: isConnecting guard previene doble socket en doble click
 *   Z-ADP-05: timeout de connect ahora SÍ cierra el WS viejo
 *   Z-ADP-08: pendingRequests rechazadas en disconnect (no memory leak)
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

        // Z-ADP-01/03: reconnect state (mismo patrón que OBS)
        this.isConnecting = false;
        this.reconnectTimer = null;
        this.manualDisconnect = false;
        this.maxReconnectAttempts = 5;
        this._lastConfig = null;
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
        // Z-ADP-03: guard contra doble click "Connect"
        if (this.isConnecting || this.connected) return false;
        this.isConnecting = true;
        this.manualDisconnect = false;
        this._lastConfig = cfg;
        this.token = cfg.token;
        this.port = cfg.port || 59650;

        // Z-ADP-02: limpiar WS anterior si existe (evita race condition al reconectar)
        this._cleanupWebSocket();

        return new Promise((resolve) => {
            let resolved = false;
            const finish = (result) => {
                if (resolved) return;
                resolved = true;
                this.isConnecting = false;
                resolve(result);
            };

            try {
                this.ws = new WebSocket(`ws://127.0.0.1:${this.port}/api/websocket`);
            } catch (e) {
                this.emit('error', e);
                return finish(false);
            }

            this.ws.onopen = async () => {
                try {
                    await this._authenticate();
                    this.connected = true;
                    await this._fetchScenes();
                    this.emit('connected');
                    finish(true);
                } catch (e) {
                    this.emit('error', e);
                    finish(false);
                }
            };

            this.ws.onmessage = (event) => this._handleMessage(event.data);
            this.ws.onerror = (err) => this.emit('error', err);
            this.ws.onclose = () => this._handleClose();

            // Z-ADP-05: timeout de connect cierra el WS viejo y limpia listeners
            setTimeout(() => {
                if (!this.connected && !resolved) {
                    this._cleanupWebSocket();
                    finish(false);
                }
            }, 5000);
        });
    }

    /**
     * Z-ADP-02: limpia listeners del WebSocket actual y lo cierra.
     * Previene race conditions cuando se reconecta rápido.
     */
    _cleanupWebSocket() {
        if (!this.ws) return;
        try {
            this.ws.onopen = null;
            this.ws.onmessage = null;
            this.ws.onerror = null;
            this.ws.onclose = null;
            this.ws.close();
        } catch { /* ignore */ }
        this.ws = null;
    }

    /**
     * Z-ADP-01: cierre del WS → intentar reconectar con backoff exponencial.
     * Mismo patrón que adapter-obs._handleClose().
     */
    _handleClose() {
        const wasConnected = this.connected;
        this.connected = false;

        if (this.manualDisconnect) {
            this.emit('disconnected');
            return;
        }
        if (!wasConnected) {
            // Cierre durante connect inicial — no reconectar
            this.emit('disconnected');
            return;
        }

        // Reconexión con backoff exponencial: 3s, 6s, 9s, 12s, 15s (cap)
        let attempt = 0;
        const tryReconnect = async () => {
            if (this.connected || this.manualDisconnect) return;
            if (attempt >= this.maxReconnectAttempts) {
                this.emit('reconnect_exhausted');
                return;
            }
            attempt++;
            this.emit('reconnecting', attempt, this.maxReconnectAttempts);
            const delay = Math.min(3000 * attempt, 15000);
            this.reconnectTimer = setTimeout(async () => {
                if (this.manualDisconnect) return;
                this.emit('reconnect_attempt', attempt);
                const ok = await this.connect(this._lastConfig);
                if (!ok) tryReconnect();
            }, delay);
        };
        tryReconnect();
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
            try {
                this.ws.send(JSON.stringify(payload));
            } catch (e) {
                this.pendingRequests.delete(id);
                return reject(e);
            }

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
        this.manualDisconnect = true;
        // Z-ADP-01: cancelar reconnect pendiente
        if (this.reconnectTimer) {
            clearTimeout(this.reconnectTimer);
            this.reconnectTimer = null;
        }

        // Z-ADP-08: rechazar todas las pending requests para evitar leak de callbacks
        for (const [, { reject }] of this.pendingRequests) {
            try { reject(new Error('Adapter disconnected')); } catch { /* ignore */ }
        }
        this.pendingRequests.clear();

        // Z-ADP-02: cleanup completo del WS con listeners
        this._cleanupWebSocket();
        this.connected = false;
        this.emit('disconnected');
    }
}

window.AdapterStreamlabs = AdapterStreamlabs;
