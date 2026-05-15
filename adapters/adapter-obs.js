/* ============================================================================
 * EsperantAI — Adapter OBS Studio
 * Wrapper alrededor de obs-websocket-js para implementar AdapterBase.
 * Soporta OBS Studio 28+ con WebSocket v5.
 * También soporta PRISM Live Studio (mismo backend OBS).
 *
 * Docs: https://github.com/obsproject/obs-websocket
 * Cliente: obs-websocket-js 5.0.8 (libs/obs-ws.min.js)
 * ========================================================================== */

'use strict';

class AdapterOBS extends AdapterBase {
    constructor() {
        super('OBS');
        this.obs = null;  // Z-ADP-07: se crea en _initObs() para poder recrear en reconnect
        this.currentScene = '';
        this.studioMode = false;
        this.availableScenes = [];
        this.lastScenesHash = '';
        this.isConnecting = false;
        this.reconnectTimer = null;
        this.manualDisconnect = false;
        this.maxReconnectAttempts = 5;

        this._initObs();
    }

    /**
     * Z-ADP-07: crea una instancia fresca de OBSWebSocket y registra todos
     * los event handlers. Llamado en constructor + cada vez que _handleClose
     * decide reconectar, para evitar estado interno stale de obs-websocket-js
     * tras múltiples ciclos de connect/disconnect.
     */
    _initObs() {
        this.obs = new OBSWebSocket();

        this.obs.on('CurrentProgramSceneChanged', (data) => {
            this.currentScene = data.sceneName;
            this.emit('scene_changed', data.sceneName);
        });
        this.obs.on('StudioModeStateChanged', (data) => {
            this.studioMode = !!data.studioModeEnabled;
            this.emit('studio_mode_changed', this.studioMode);
        });
        this.obs.on('SceneListChanged', async () => {
            await this._syncSceneList();
        });
        this.obs.on('ConnectionClosed', () => this._handleClose());
    }

    capabilities() {
        return {
            sceneSwitch: true,
            studioMode: true,
            previewScene: true,
            transition: true,
            sourceVisibility: true,
            sourceTransform: true,
            sourceCrop: true,
            audioControl: true,
            recordingControl: true,
            streamingControl: true
        };
    }

    /**
     * @param {Object} config { url, password }
     *   url: "ws://127.0.0.1:4455"
     *   password: string|undefined
     */
    async connect(config) {
        if (this.isConnecting) return false;
        this.isConnecting = true;
        this.manualDisconnect = false;
        this._lastConfig = config;

        try {
            await this.obs.connect(config.url, config.password || undefined, { rpcVersion: 1 });
            this.connected = true;
            this.isConnecting = false;
            await this._syncSceneList();
            const sm = await this.obs.call('GetStudioModeEnabled');
            this.studioMode = !!sm.studioModeEnabled;
            this.emit('connected');
            return true;
        } catch (e) {
            this.isConnecting = false;
            this.connected = false;
            this.emit('error', e);
            return false;
        }
    }

    async disconnect() {
        this.manualDisconnect = true;
        if (this.reconnectTimer) { clearTimeout(this.reconnectTimer); this.reconnectTimer = null; }
        try { await this.obs.disconnect(); } catch { /* ignore */ }
        this.connected = false;
        this.emit('disconnected');
    }

    async _syncSceneList() {
        try {
            const list = await this.obs.call('GetSceneList');
            const newScenes = (list.scenes || []).map(s => ({ name: s.sceneName, uuid: s.sceneUuid })).reverse();
            const newHash = newScenes.map(s => s.name).join('|');
            this.availableScenes = newScenes;
            this.currentScene = list.currentProgramSceneName || '';
            if (newHash !== this.lastScenesHash) {
                this.lastScenesHash = newHash;
                this.emit('scene_list_changed', newScenes);
            }
        } catch (e) {
            console.warn('OBS _syncSceneList failed:', e);
        }
    }

    async getScenes() {
        if (!this.connected) return [];
        if (!this.availableScenes.length) await this._syncSceneList();
        return this.availableScenes;
    }

    async getCurrentScene() {
        return this.currentScene;
    }

    async switchScene(sceneName) {
        if (!this.connected || !sceneName) return false;
        try {
            await this.obs.call('SetCurrentProgramScene', { sceneName });
            this.currentScene = sceneName;
            return true;
        } catch (e) {
            this.emit('error', e);
            return false;
        }
    }

    async setPreviewScene(sceneName) {
        if (!this.connected || !sceneName) return false;
        try {
            await this.obs.call('SetCurrentPreviewScene', { sceneName });
            return true;
        } catch (e) {
            this.emit('error', e);
            return false;
        }
    }

    async triggerTransition() {
        if (!this.connected) return false;
        try {
            await this.obs.call('TriggerStudioModeTransition');
            return true;
        } catch (e) {
            this.emit('error', e);
            return false;
        }
    }

    async isStudioMode() {
        return this.studioMode;
    }

    // ===== Capability methods for Action Engine =====

    async setSourceVisibility(sceneName, sourceName, visible) {
        if (!this.connected) return false;
        try {
            const list = await this.obs.call('GetSceneItemList', { sceneName });
            const item = (list.sceneItems || []).find(i => i.sourceName === sourceName);
            if (!item) {
                console.warn(`Source "${sourceName}" not found in scene "${sceneName}"`);
                return false;
            }
            await this.obs.call('SetSceneItemEnabled', {
                sceneName, sceneItemId: item.sceneItemId, sceneItemEnabled: !!visible
            });
            return true;
        } catch (e) { this.emit('error', e); return false; }
    }

    async setSourceFilterEnabled(sourceName, filterName, enabled) {
        if (!this.connected) return false;
        try {
            await this.obs.call('SetSourceFilterEnabled', { sourceName, filterName, filterEnabled: !!enabled });
            return true;
        } catch (e) { this.emit('error', e); return false; }
    }

    async setSourceTransform(sceneName, sourceName, transform) {
        if (!this.connected) return false;
        try {
            const list = await this.obs.call('GetSceneItemList', { sceneName });
            const item = (list.sceneItems || []).find(i => i.sourceName === sourceName);
            if (!item) {
                console.warn(`Source "${sourceName}" not found in scene "${sceneName}"`);
                return false;
            }
            await this.obs.call('SetSceneItemTransform', {
                sceneName,
                sceneItemId: item.sceneItemId,
                sceneItemTransform: {
                    positionX: transform.positionX ?? 0,
                    positionY: transform.positionY ?? 0,
                    scaleX: transform.scaleX ?? 1,
                    scaleY: transform.scaleY ?? 1,
                    rotation: transform.rotation ?? 0
                }
            });
            return true;
        } catch (e) { this.emit('error', e); return false; }
    }

    async setSourceCrop(sceneName, sourceName, crop) {
        if (!this.connected) return false;
        try {
            const list = await this.obs.call('GetSceneItemList', { sceneName });
            const item = (list.sceneItems || []).find(i => i.sourceName === sourceName);
            if (!item) return false;
            await this.obs.call('SetSceneItemCrop', {
                sceneName,
                sceneItemId: item.sceneItemId,
                sceneItemCrop: {
                    top: crop.top ?? 0,
                    bottom: crop.bottom ?? 0,
                    left: crop.left ?? 0,
                    right: crop.right ?? 0
                }
            });
            return true;
        } catch (e) { this.emit('error', e); return false; }
    }

    async setSourceMuted(sourceName, muted) {
        if (!this.connected) return false;
        try { await this.obs.call('SetInputMute', { inputName: sourceName, inputMuted: !!muted }); return true; }
        catch (e) { this.emit('error', e); return false; }
    }

    async setSourceVolume(sourceName, volumeDb) {
        if (!this.connected) return false;
        try { await this.obs.call('SetInputVolume', { inputName: sourceName, inputVolumeDb: volumeDb }); return true; }
        catch (e) { this.emit('error', e); return false; }
    }

    async startRecording() {
        if (!this.connected) return false;
        try { await this.obs.call('StartRecord'); return true; } catch (e) { this.emit('error', e); return false; }
    }

    async stopRecording() {
        if (!this.connected) return false;
        try { await this.obs.call('StopRecord'); return true; } catch (e) { this.emit('error', e); return false; }
    }

    async startStreaming() {
        if (!this.connected) return false;
        try { await this.obs.call('StartStream'); return true; } catch (e) { this.emit('error', e); return false; }
    }

    async stopStreaming() {
        if (!this.connected) return false;
        try { await this.obs.call('StopStream'); return true; } catch (e) { this.emit('error', e); return false; }
    }

    async getSources(sceneName) {
        if (!this.connected) return [];
        try {
            const list = await this.obs.call('GetSceneItemList', { sceneName });
            return (list.sceneItems || []).map(i => ({ name: i.sourceName, id: i.sceneItemId, kind: i.inputKind }));
        } catch { return []; }
    }

    _handleClose() {
        if (!this.connected) return;
        this.connected = false;

        if (this.manualDisconnect) {
            this.emit('disconnected');
            return;
        }

        // Reconexión con backoff exponencial
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
                // Z-ADP-07: recrear OBSWebSocket para evitar estado interno stale
                // tras ciclos repetidos de disconnect/reconnect. Los nuevos handlers
                // se registran sobre la instancia limpia.
                try { this.obs?.disconnect?.(); } catch { /* ignore */ }
                this._initObs();
                try {
                    await this.obs.connect(this._lastConfig?.url, this._lastConfig?.password || undefined, { rpcVersion: 1 });
                    this.connected = true;
                    await this._syncSceneList();
                    this.emit('connected');
                } catch (e) {
                    this.emit('reconnect_attempt', attempt);
                    tryReconnect();
                }
            }, delay);
        };
        tryReconnect();
    }
}

window.AdapterOBS = AdapterOBS;
