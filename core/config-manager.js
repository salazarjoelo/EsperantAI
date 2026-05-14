/* ============================================================================
 * EsperantAI — Config Manager
 * Gestiona persistencia de configuración en localStorage con esquema versionado.
 * Soporta import/export JSON.
 * ========================================================================== */

'use strict';

const CONFIG_VERSION = '2.0.0';
const CONFIG_KEY = 'esperantai-config-v2';

const DEFAULT_CONFIG = {
    version: CONFIG_VERSION,
    locale: null, // null = auto-detect

    // Streaming software adapter
    adapter: {
        type: 'obs', // obs | streamlabs | vmix | prism | xsplit
        obs: { url: 'ws://127.0.0.1:4455', password: '' },
        streamlabs: { token: '', port: 59650 },
        vmix: { host: '127.0.0.1', port: 8088 },
        prism: { url: 'ws://127.0.0.1:4455', password: '' },
        xsplit: { /* TBD */ }
    },
    savePassword: false,

    // Stream platforms (event sources)
    platforms: {
        twitch: { enabled: false, token: '', clientId: '' },
        youtube: { enabled: false, token: '', clientId: '' },
        kick: { enabled: false, token: '', clientId: '', channelSlug: '' },
        trovo: { enabled: false },
        streamelements: { enabled: false, jwt: '' }
    },

    // Camera
    cameraId: null,

    // Scene mapping (trigger → scene name in adapter)
    scenes: {
        center: '', left: '', right: '', up: '', down: '',
        'tilt-left': '', 'tilt-right': '',
        near: '', far: '',
        'gaze-left': '', 'gaze-right': '', 'gaze-up': '', 'gaze-down': '',
        happy: '', surprise: '', angry: '', neutral: '',
        blink: '',
        'thumbs-up': '', peace: '', rock: '', ok: '',
        fist: '', 'open-palm': '', point: ''
    },

    // Platform event triggers (event → action)
    eventTriggers: {
        sub: { enabled: false, scene: '', requireGesture: null },
        donation: { enabled: false, scene: '', requireGesture: null },
        raid: { enabled: false, scene: '', requireGesture: null },
        cheer_bits: { enabled: false, scene: '', requireGesture: null },
        super_chat: { enabled: false, scene: '', requireGesture: null }
    },

    // Categories enable
    enabled: {
        head: true,
        distance: false,
        gaze: false,
        emotion: false,
        blink: false,
        hand: false
    },

    // Thresholds
    thresholds: {
        yaw: 0.15,
        pitchUp: -0.18,
        pitchDown: 0.25,
        roll: 0.25,
        near: 350,
        far: 120,
        gaze: 0.50,
        gazeStrength: 0.35,
        emotion: 0.60,
        stableFrames: 5,
        cooldownMs: 500,
        // Dead Zone (anti-fatigue) — dentro de este rango NADA dispara.
        // Permite al streamer relajarse sin que micro-movimientos disparen triggers.
        deadZoneYaw: 0.05,
        deadZonePitch: 0.05,
        deadZoneRoll: 0.08,
        // Después de un trigger, ignorar nuevos triggers de "center" por este tiempo.
        returnToCenterMs: 1000
    },

    // Behavior
    usePreviewInStudioMode: false,
    silentMode: 'auto' // auto | always | never
};

class ConfigManager {
    constructor() {
        this.config = this._load();
        this.listeners = [];
        // Fix audit P0.3: debounce de save() para evitar lag con sliders rápidos
        this._saveDebounceMs = 300;
        this._saveDebounceTimer = null;
    }

    /**
     * Save debounceado — coalesce escrituras rápidas (típico de sliders en input event).
     */
    _saveDebounced() {
        if (this._saveDebounceTimer) clearTimeout(this._saveDebounceTimer);
        this._saveDebounceTimer = setTimeout(() => {
            this._saveDebounceTimer = null;
            this.save();
        }, this._saveDebounceMs);
    }

    _load() {
        try {
            const raw = localStorage.getItem(CONFIG_KEY);
            const base = this._clone(DEFAULT_CONFIG);
            const merged = raw ? this._merge(base, JSON.parse(raw)) : base;

            // Fix audit H-01: restaurar tokens OAuth desde sessionStorage (más volátil = menos riesgo)
            try {
                const sessTokens = sessionStorage.getItem('esperantai-oauth-tokens');
                if (sessTokens && merged.platforms) {
                    const tokens = JSON.parse(sessTokens);
                    for (const p of Object.keys(tokens)) {
                        if (merged.platforms[p]) {
                            if (tokens[p].token) merged.platforms[p].token = tokens[p].token;
                            if (tokens[p].jwt) merged.platforms[p].jwt = tokens[p].jwt;
                        }
                    }
                }
            } catch {}
            return merged;
        } catch (e) {
            console.warn('Config load failed:', e);
            return this._clone(DEFAULT_CONFIG);
        }
    }

    _clone(obj) {
        return JSON.parse(JSON.stringify(obj));
    }

    /**
     * Merge seguro contra prototype pollution.
     * Bloquea __proto__, prototype, constructor para prevenir contaminación de Object.prototype.
     */
    _merge(target, source) {
        if (!source || typeof source !== 'object' || Array.isArray(source)) return target;

        for (const key of Object.keys(source)) {
            if (ConfigManager.BLOCKED_KEYS.has(key)) continue;

            const value = source[key];
            if (value && typeof value === 'object' && !Array.isArray(value)) {
                const existing = Object.prototype.hasOwnProperty.call(target, key) &&
                    target[key] && typeof target[key] === 'object' && !Array.isArray(target[key])
                        ? target[key]
                        : {};
                target[key] = this._merge(existing, value);
            } else {
                target[key] = value;
            }
        }
        return target;
    }

    save() {
        try {
            const toSave = this._clone(this.config);
            // Higiene: no persistir passwords sin opt-in
            if (!toSave.savePassword) {
                if (toSave.adapter?.obs) toSave.adapter.obs.password = '';
                if (toSave.adapter?.prism) toSave.adapter.prism.password = '';
                if (toSave.adapter?.streamlabs) toSave.adapter.streamlabs.token = '';
            }
            // Fix audit H-01: tokens OAuth NUNCA persisten en localStorage.
            // Se mueven a sessionStorage al hacer save() y se restauran al load().
            if (toSave.platforms) {
                const tokens = {};
                for (const p of ['twitch', 'youtube', 'kick', 'trovo', 'streamelements']) {
                    if (toSave.platforms[p]?.token) {
                        tokens[p] = { token: toSave.platforms[p].token };
                        toSave.platforms[p].token = '';
                    }
                    if (toSave.platforms[p]?.jwt) {
                        tokens[p] = { ...(tokens[p] || {}), jwt: toSave.platforms[p].jwt };
                        toSave.platforms[p].jwt = '';
                    }
                }
                if (Object.keys(tokens).length) {
                    try { sessionStorage.setItem('esperantai-oauth-tokens', JSON.stringify(tokens)); } catch {}
                }
            }
            localStorage.setItem(CONFIG_KEY, JSON.stringify(toSave));
            this._notify();
        } catch (e) {
            console.warn('Config save failed:', e);
        }
    }

    get(path, fallback = null) {
        const parts = path.split('.');
        let cur = this.config;
        for (const p of parts) {
            if (cur == null) return fallback;
            cur = cur[p];
        }
        return cur ?? fallback;
    }

    set(path, value, immediate = false) {
        const parts = path.split('.');
        let cur = this.config;
        for (let i = 0; i < parts.length - 1; i++) {
            if (cur[parts[i]] == null) cur[parts[i]] = {};
            cur = cur[parts[i]];
        }
        cur[parts[parts.length - 1]] = value;
        // Fix audit P0.3: por default debounce (~300ms). immediate=true para casos críticos.
        if (immediate) {
            if (this._saveDebounceTimer) { clearTimeout(this._saveDebounceTimer); this._saveDebounceTimer = null; }
            this.save();
        } else {
            this._saveDebounced();
        }
    }

    reset() {
        localStorage.removeItem(CONFIG_KEY);
        this.config = this._clone(DEFAULT_CONFIG);
        this._notify();
    }

    /**
     * Devuelve las acciones configuradas para un trigger.
     * Soporta dos formatos:
     *   1) Nuevo: this.config.triggerActions[triggerKey] = [{ type, params }, ...]
     *   2) Legacy: this.config.scenes[triggerKey] = "sceneName"
     *      → se convierte automáticamente a [{ type: 'scene_switch', params: { sceneName } }]
     *
     * @param {string} triggerKey — ej. 'left', 'thumbs-up', 'happy'
     * @returns {Array<Object>} array de acciones a ejecutar
     */
    getActionsForTrigger(triggerKey) {
        // Formato nuevo
        const newFormat = this.get(`triggerActions.${triggerKey}`);
        if (Array.isArray(newFormat) && newFormat.length) return newFormat;

        // Fallback al formato legacy (scenes plano)
        const sceneName = this.get(`scenes.${triggerKey}`);
        if (sceneName) {
            return [{ type: 'scene_switch', target: 'adapter', params: { sceneName } }];
        }
        return [];
    }

    /**
     * Setea acciones para un trigger (formato nuevo).
     */
    setActionsForTrigger(triggerKey, actions) {
        this.set(`triggerActions.${triggerKey}`, actions);
    }

    /**
     * Agrega una acción a un trigger existente.
     */
    addActionToTrigger(triggerKey, action) {
        const current = this.get(`triggerActions.${triggerKey}`) || [];
        current.push(action);
        this.set(`triggerActions.${triggerKey}`, current);
    }

    /**
     * Remueve la acción en el índice dado.
     */
    removeActionFromTrigger(triggerKey, index) {
        const current = this.get(`triggerActions.${triggerKey}`) || [];
        current.splice(index, 1);
        this.set(`triggerActions.${triggerKey}`, current);
    }

    /**
     * Sanitiza recursivamente eliminando secretos antes de exportar.
     * Vacía: passwords, tokens, JWT, license keys, code verifiers, refresh tokens.
     */
    _sanitizeForExport(obj) {
        const walk = (value) => {
            if (Array.isArray(value)) return value.map(walk);
            if (!value || typeof value !== 'object') return value;
            const out = {};
            for (const [k, v] of Object.entries(value)) {
                if (ConfigManager.SECRET_KEYS.has(k)) {
                    out[k] = '';
                } else {
                    out[k] = walk(v);
                }
            }
            return out;
        };
        return walk(obj);
    }

    export() {
        return JSON.stringify(this._sanitizeForExport(this.config), null, 2);
    }

    import(jsonString) {
        try {
            const imported = JSON.parse(jsonString);
            this.config = this._merge(this._clone(DEFAULT_CONFIG), imported);
            this.save();
            return true;
        } catch (e) {
            console.warn('Import error:', e);
            return false;
        }
    }

    onChange(fn) {
        this.listeners.push(fn);
    }

    _notify() {
        this.listeners.forEach(fn => {
            try { fn(this.config); } catch (e) { console.error(e); }
        });
    }
}

// Bloquea prototype pollution
ConfigManager.BLOCKED_KEYS = new Set(['__proto__', 'prototype', 'constructor']);

// Secrets que NUNCA deben exportarse en JSON
ConfigManager.SECRET_KEYS = new Set([
    'password', 'token', 'jwt', 'accessToken', 'refreshToken',
    'authorization', 'codeVerifier', 'licenseKey'
]);

window.ConfigManager = ConfigManager;
window.configManager = new ConfigManager();
