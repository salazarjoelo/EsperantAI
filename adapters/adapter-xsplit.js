/* ============================================================================
 * EsperantAI — Adapter XSplit Broadcaster
 *
 * XSplit usa el XSplit JS Framework (XJS) para plugins/extensions.
 * Para control remoto desde browser, XSplit ofrece "Remote xjs" — un proxy
 * que el usuario instala como extension en XSplit, y permite llamadas
 * HTTP/WebSocket desde apps externas.
 *
 * Docs:
 *   - https://github.com/xjsframework/xjs
 *   - https://xjsframework.github.io/api.html
 *
 * Setup requerido por el usuario:
 *   1. Instalar "Remote xjs" extension en XSplit
 *   2. Habilitar Remote en preferencias
 *   3. Anotar la URL del proxy local (default: ws://127.0.0.1:5555/xjs)
 *
 * NOTA: La extension Remote xjs aún está marcada como BETA. Esta implementación
 * cubre los casos básicos: lista de escenas y cambio de escena.
 * Funcionalidades avanzadas (filters, audio control) están limitadas.
 *
 * Z-204 hardening (2026-05-14):
 *   Z-ADP-01/02/03/05/08: mismo patrón que adapter-streamlabs.
 * ========================================================================== */

'use strict';

class AdapterXSplit extends AdapterBase {
    constructor() {
        super('XSplit');
        this.ws = null;
        this.proxyUrl = null;
        this.requestId = 0;
        this.pendingRequests = new Map();
        this.currentScene = '';
        this.availableScenes = [];

        // Z-ADP-01/03: reconnect state
        this.isConnecting = false;
        this.reconnectTimer = null;
        this.manualDisconnect = false;
        this.maxReconnectAttempts = 5;
        this._lastConfig = null;
    }

    capabilities() {
        return {
            sceneSwitch: true,
            studioMode: false,
            previewScene: false,
            transition: false,
            sourceVisibility: true,
            audioControl: false, // Limitado en Remote xjs
            recordingControl: true,
            streamingControl: true
        };
    }

    /**
     * @param {Object} cfg { proxyUrl }
     *   proxyUrl: WebSocket URL del Remote xjs proxy
     *   Default: "ws://127.0.0.1:5555/xjs"
     */
    async connect(cfg) {
        // Z-ADP-03: guard contra doble click "Connect"
        if (this.isConnecting || this.connected) return false;
        this.isConnecting = true;
        this.manualDisconnect = false;
        this._lastConfig = cfg;
        this.proxyUrl = cfg.proxyUrl || 'ws://127.0.0.1:5555/xjs';

        // Z-ADP-02: cleanup WS anterior
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
                this.ws = new WebSocket(this.proxyUrl);
            } catch (e) {
                this.emit('error', e);
                return finish(false);
            }
            this.ws.onopen = async () => {
                try {
                    await this._fetchScenes();
                    this.connected = true;
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

            // Z-ADP-05: timeout cierra el WS viejo
            setTimeout(() => {
                if (!this.connected && !resolved) {
                    this._cleanupWebSocket();
                    finish(false);
                }
            }, 5000);
        });
    }

    /** Z-ADP-02: limpia listeners + close del WS actual. */
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

    /** Z-ADP-01: reconnect con backoff. */
    _handleClose() {
        const wasConnected = this.connected;
        this.connected = false;

        if (this.manualDisconnect) {
            this.emit('disconnected');
            return;
        }
        if (!wasConnected) {
            this.emit('disconnected');
            return;
        }

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

    /**
     * Envía un comando XJS y espera respuesta.
     * XJS Remote usa formato JSON-RPC sobre WebSocket.
     */
    _call(method, params = []) {
        return new Promise((resolve, reject) => {
            const id = ++this.requestId;
            this.pendingRequests.set(id, { resolve, reject });
            try {
                this.ws.send(JSON.stringify({ id, method, params }));
            } catch (e) {
                this.pendingRequests.delete(id);
                return reject(e);
            }
            setTimeout(() => {
                if (this.pendingRequests.has(id)) {
                    this.pendingRequests.delete(id);
                    reject(new Error('XSplit XJS request timeout'));
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
            } else if (msg.event === 'sceneChanged') {
                this.currentScene = msg.data?.sceneName || '';
                this.emit('scene_changed', this.currentScene);
            }
        } catch {}
    }

    async _fetchScenes() {
        try {
            const scenes = await this._call('Scene.getScenes');
            const newList = (scenes || []).map((s, i) => ({ name: s.name || `Scene ${i+1}`, uuid: s.id || s.uid }));
            this.availableScenes = newList;
            this.emit('scene_list_changed', newList);
            const active = await this._call('Scene.getActiveScene');
            if (active) {
                this.currentScene = active.name || '';
                this.emit('scene_changed', this.currentScene);
            }
        } catch (e) {
            console.warn('XSplit fetchScenes failed:', e);
        }
    }

    async getScenes() {
        if (!this.availableScenes.length) await this._fetchScenes();
        return this.availableScenes;
    }

    async getCurrentScene() { return this.currentScene; }

    async switchScene(sceneName) {
        const scene = this.availableScenes.find(s => s.name === sceneName);
        if (!scene) return false;
        try {
            await this._call('Scene.setActiveScene', [scene.uuid]);
            this.currentScene = sceneName;
            return true;
        } catch (e) { this.emit('error', e); return false; }
    }

    async setSourceVisibility(sceneName, sourceName, visible) {
        try {
            await this._call('Source.setVisibility', [sceneName, sourceName, !!visible]);
            return true;
        } catch (e) { return false; }
    }

    async startRecording() {
        try { await this._call('Output.startLocalRecording'); return true; } catch { return false; }
    }
    async stopRecording() {
        try { await this._call('Output.stopLocalRecording'); return true; } catch { return false; }
    }
    async startStreaming() {
        try { await this._call('Output.startBroadcast'); return true; } catch { return false; }
    }
    async stopStreaming() {
        try { await this._call('Output.stopBroadcast'); return true; } catch { return false; }
    }

    async disconnect() {
        this.manualDisconnect = true;
        if (this.reconnectTimer) {
            clearTimeout(this.reconnectTimer);
            this.reconnectTimer = null;
        }
        // Z-ADP-08: rechazar pending requests
        for (const [, { reject }] of this.pendingRequests) {
            try { reject(new Error('Adapter disconnected')); } catch { /* ignore */ }
        }
        this.pendingRequests.clear();
        // Z-ADP-02: cleanup completo
        this._cleanupWebSocket();
        this.connected = false;
        this.emit('disconnected');
    }
}

window.AdapterXSplit = AdapterXSplit;
