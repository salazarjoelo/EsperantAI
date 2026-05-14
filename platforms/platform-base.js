/* ============================================================================
 * EsperantAI — Platform Base
 * Interfaz común para integración con plataformas de streaming (Twitch, YouTube, Kick...).
 * Cada platform recibe eventos (donations, subs, raids) y los normaliza al formato común.
 *
 * Eventos normalizados que cualquier platform debe emitir:
 *   - 'sub'             { user, tier, months }
 *   - 'resub'           { user, tier, months, message }
 *   - 'gift_sub'        { gifter, recipient, tier }
 *   - 'follow'          { user }
 *   - 'donation'        { user, amount, currency, message }
 *   - 'raid'            { from, viewers }
 *   - 'cheer_bits'      { user, bits, message }
 *   - 'channel_points'  { user, reward_title, input }
 *   - 'super_chat'      { user, amount, currency, message }
 *   - 'gift'            { user, gift_name, amount }
 *   - 'member_milestone'{ user, months }
 *   - 'connected'
 *   - 'disconnected'
 *   - 'auth_error'
 *   - 'error'
 * ========================================================================== */

'use strict';

class PlatformBase {
    constructor(name) {
        this.name = name;
        this.connected = false;
        this.listeners = {};
        this.subscribedEvents = new Set();
    }

    /**
     * @param {Object} authConfig { token, clientId, channelId, ... } específico
     */
    async connect(authConfig) {
        throw new Error(`${this.name}.connect() must be implemented`);
    }

    async disconnect() {
        throw new Error(`${this.name}.disconnect() must be implemented`);
    }

    isConnected() {
        return this.connected;
    }

    /**
     * Suscribe a un tipo de evento. Devuelve true si está soportado.
     */
    subscribe(eventType) {
        if (!this.supportedEvents().includes(eventType)) return false;
        this.subscribedEvents.add(eventType);
        return true;
    }

    unsubscribe(eventType) {
        this.subscribedEvents.delete(eventType);
    }

    unsubscribeAll() {
        this.subscribedEvents.clear();
    }

    /**
     * @returns {string[]} lista de evento soportados por la plataforma
     */
    supportedEvents() {
        return [];
    }

    /**
     * Auth method usado. UI puede mostrar instrucciones diferentes.
     * @returns {'oauth_implicit'|'oauth_pkce'|'api_key'|'webhook_url'|'manual_token'}
     */
    authMethod() {
        return 'manual_token';
    }

    /**
     * URL para iniciar OAuth (popup window).
     */
    oauthUrl(redirectUri) {
        return null;
    }

    // ======== Event system ========

    on(event, handler) {
        if (!this.listeners[event]) this.listeners[event] = [];
        this.listeners[event].push(handler);
    }

    off(event, handler) {
        if (!this.listeners[event]) return;
        this.listeners[event] = this.listeners[event].filter(h => h !== handler);
    }

    emit(event, payload) {
        (this.listeners[event] || []).forEach(h => {
            try { h(payload); } catch (e) { console.error(`Platform ${this.name} handler:`, e); }
        });
    }
}

window.PlatformBase = PlatformBase;
