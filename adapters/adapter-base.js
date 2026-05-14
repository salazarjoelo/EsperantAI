/* ============================================================================
 * EsperantAI — Adapter Base
 * Interfaz común para todos los adapters de streaming software.
 * Cada adapter (OBS, Streamlabs, vMix, PRISM, XSplit) extiende esta clase.
 * ========================================================================== */

'use strict';

class AdapterBase {
    constructor(name) {
        this.name = name;
        this.connected = false;
        this.listeners = {}; // eventName → [handlers]
    }

    /**
     * Establece conexión con el software.
     * @param {Object} config { url, port, password, ... } específico de cada adapter
     * @returns {Promise<boolean>} true si conectó, false si falló
     */
    async connect(config) {
        throw new Error(`${this.name}.connect() must be implemented by subclass`);
    }

    async disconnect() {
        throw new Error(`${this.name}.disconnect() must be implemented by subclass`);
    }

    isConnected() {
        return this.connected;
    }

    /**
     * @returns {Promise<Array<{name: string, uuid?: string}>>}
     */
    async getScenes() {
        throw new Error(`${this.name}.getScenes() must be implemented by subclass`);
    }

    /**
     * @returns {Promise<string>} nombre de la escena actual de programa
     */
    async getCurrentScene() {
        throw new Error(`${this.name}.getCurrentScene() must be implemented by subclass`);
    }

    /**
     * Cambia la escena de programa.
     */
    async switchScene(sceneName) {
        throw new Error(`${this.name}.switchScene() must be implemented by subclass`);
    }

    /**
     * Studio Mode: pone una escena en Preview (no programa).
     * Si el adapter no soporta, debe lanzar excepción o caer a switchScene.
     */
    async setPreviewScene(sceneName) {
        throw new Error(`${this.name}.setPreviewScene() not supported`);
    }

    /**
     * Studio Mode: dispara transición Preview → Programa.
     */
    async triggerTransition() {
        throw new Error(`${this.name}.triggerTransition() not supported`);
    }

    /**
     * @returns {Promise<boolean>} true si el software está en Studio Mode
     */
    async isStudioMode() {
        return false;
    }

    /**
     * Capacidades del adapter — el core puede consultarlas para habilitar/ocultar UI.
     */
    capabilities() {
        return {
            sceneSwitch: true,
            studioMode: false,
            previewScene: false,
            transition: false,
            sourceVisibility: false,
            audioControl: false,
            recordingControl: false,
            streamingControl: false
        };
    }

    // ======== Event system (observer) ========

    on(event, handler) {
        if (!this.listeners[event]) this.listeners[event] = [];
        this.listeners[event].push(handler);
    }

    off(event, handler) {
        if (!this.listeners[event]) return;
        this.listeners[event] = this.listeners[event].filter(h => h !== handler);
    }

    emit(event, ...args) {
        (this.listeners[event] || []).forEach(h => {
            try { h(...args); } catch (e) { console.error(`Adapter ${this.name} handler error:`, e); }
        });
    }

    // Eventos comunes que todos los adapters emiten:
    // - 'connected'
    // - 'disconnected'
    // - 'reconnecting' (attempt, max)
    // - 'scene_changed' (sceneName)
    // - 'scene_list_changed' (scenes[])
    // - 'studio_mode_changed' (enabled)
    // - 'error' (err)
}

// Export to window
window.AdapterBase = AdapterBase;
