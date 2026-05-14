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
        deadZoneYaw: 0.05,
        deadZonePitch: 0.05,
        deadZoneRoll: 0.08,
        returnToCenterMs: 800
    },

    // Behavior
    usePreviewInStudioMode: false,
    silentMode: 'auto', // auto | always | never

    // Profiles
    profile: {
        current: 'default',
        list: {
            'default': { name: 'Default' }
        }
    }
};

class ConfigManager {
    constructor() {
        this.config = this._load();
        this.listeners = [];
        this._saveTimer = null;
    }

    _load() {
        try {
            const raw = localStorage.getItem(CONFIG_KEY);
            if (!raw) return this._clone(DEFAULT_CONFIG);
            const saved = JSON.parse(raw);
            return this._merge(this._clone(DEFAULT_CONFIG), saved);
        } catch (e) {
            console.warn('Config load failed:', e);
            return this._clone(DEFAULT_CONFIG);
        }
    }

    _clone(obj) {
        return JSON.parse(JSON.stringify(obj));
    }

    /**
     * Deep-merge source into target.
     * Fix audit C-02: bloquea __proto__, prototype, constructor para prevenir
     * contaminación de Object.prototype vía config malicioso (localStorage
     * editado o import de archivo JSON externo).
     */
    _merge(target, source) {
        if (!source || typeof source !== 'object' || Array.isArray(source)) return target;
        for (const key of Object.keys(source)) {
            if (ConfigManager.BLOCKED_KEYS.has(key)) continue;
            const value = source[key];
            if (value && typeof value === 'object' && !Array.isArray(value)) {
                const existing = Object.prototype.hasOwnProperty.call(target, key) &&
                    target[key] && typeof target[key] === 'object' && !Array.isArray(target[key])
                        ? target[key] : {};
                target[key] = this._merge(existing, value);
            } else {
                target[key] = value;
            }
        }
        return target;
    }

    save() {
        this._scheduleSave();
    }

    _scheduleSave() {
        if (this._saveTimer) clearTimeout(this._saveTimer);
        this._saveTimer = setTimeout(() => {
            this._saveNow();
            this._saveTimer = null;
        }, 300);
    }

    _saveNow() {
        try {
            const toSave = this._clone(this.config);
            // Higiene: no persistir passwords sin opt-in
            if (!toSave.savePassword) {
                if (toSave.adapter?.obs) toSave.adapter.obs.password = '';
                if (toSave.adapter?.prism) toSave.adapter.prism.password = '';
                if (toSave.adapter?.streamlabs) toSave.adapter.streamlabs.token = '';
                // OAuth tokens van guardados en sessionStorage, no localStorage
            }
            localStorage.setItem(CONFIG_KEY, JSON.stringify(toSave));
            this._notify();
        } catch (e) {
            console.warn('Config save failed:', e);
        }
    }

    flush() {
        if (this._saveTimer) {
            clearTimeout(this._saveTimer);
            this._saveTimer = null;
        }
        this._saveNow();
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

    set(path, value) {
        const parts = path.split('.');
        let cur = this.config;
        for (let i = 0; i < parts.length - 1; i++) {
            if (cur[parts[i]] == null) cur[parts[i]] = {};
            cur = cur[parts[i]];
        }
        cur[parts[parts.length - 1]] = value;
        this.save();
    }

    reset() {
        localStorage.removeItem(CONFIG_KEY);
        this.config = this._clone(DEFAULT_CONFIG);
        this.flush();
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
     * Listar perfiles disponibles.
     */
    getProfiles() {
        return this.get('profile.list', { 'default': { name: 'Default' } });
    }

    /**
     * Obtener el perfil activo actual.
     */
    getCurrentProfile() {
        return this.get('profile.current', 'default');
    }

    /**
     * Cambiar a un perfil existente.
     * Guarda la config actual en el perfil previo, carga la del nuevo.
     */
    switchProfile(profileId) {
        const currentId = this.getCurrentProfile();
        if (profileId === currentId) return;

        // Save current config into current profile
        this.set(`profile.list.${currentId}.config`, this._clone(this.config));

        // Load new profile config
        const profiles = this.getProfiles();
        const newConfig = profiles[profileId]?.config;

        // Update current profile
        this.set('profile.current', profileId);

        if (newConfig) {
            // Merge new profile config over defaults
            this.config = this._merge(this._clone(DEFAULT_CONFIG), newConfig);
            this.config.profile.current = profileId;
            this.flush();
        }
        this._notify();
    }

    /**
     * Crear un nuevo perfil con la config actual.
     */
    createProfile(profileId, name) {
        this.set(`profile.list.${profileId}`, {
            name: name || profileId,
            config: this._clone(this.config)
        });
    }

    /**
     * Eliminar un perfil (no el actual).
     */
    deleteProfile(profileId) {
        if (profileId === this.getCurrentProfile()) return false;
        const profiles = this.getProfiles();
        delete profiles[profileId];
        this.set('profile.list', profiles);
        return true;
    }

    /**
     * Guardar la config actual en el perfil activo.
     */
    saveCurrentProfile() {
        const currentId = this.getCurrentProfile();
        this.set(`profile.list.${currentId}.config`, this._clone(this.config));
    }

    export() {
        this.flush();
        return JSON.stringify(this.config, null, 2);
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

// Static set of keys que NUNCA se mergean (fix C-02 prototype pollution)
ConfigManager.BLOCKED_KEYS = new Set(['__proto__', 'prototype', 'constructor']);

window.ConfigManager = ConfigManager;
window.configManager = new ConfigManager();
