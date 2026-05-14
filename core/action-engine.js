/* ============================================================================
 * EsperantAI — Action Engine
 *
 * Ejecuta acciones cuando se dispara un trigger.
 * Cada trigger puede tener MÚLTIPLES acciones simultáneas:
 *   - Cambio de escena en el streaming app
 *   - Mostrar/ocultar source (overlay)
 *   - Reproducir sonido local (sin servidor)
 *   - Cambiar visibilidad de filtros
 *   - Mute/unmute audio
 *   - Enviar mensaje al chat de la plataforma
 *   - Crear clip
 *   - Notificación browser
 *   - Text-to-Speech
 *   - Etc.
 *
 * Estructura de una acción:
 *   {
 *     type: 'scene_switch' | 'play_sound' | 'source_visibility' | ...,
 *     target: 'adapter' | 'platform' | 'local',
 *     params: { ... específicos del type ... }
 *   }
 * ========================================================================== */

'use strict';

const ACTION_REGISTRY = {
    // ===== Acciones sobre el adapter (streaming software) =====
    scene_switch: {
        target: 'adapter',
        label_i18n: 'actions.scene_switch',
        params: ['sceneName'],
        execute: async (action, ctx) => {
            if (!ctx.adapter?.isConnected()) return false;
            const studio = await ctx.adapter.isStudioMode();
            if (studio && ctx.config.get('usePreviewInStudioMode')) {
                await ctx.adapter.setPreviewScene(action.params.sceneName);
                await ctx.adapter.triggerTransition();
            } else {
                await ctx.adapter.switchScene(action.params.sceneName);
            }
            return true;
        }
    },

    source_visibility: {
        target: 'adapter',
        label_i18n: 'actions.source_visibility',
        params: ['sceneName', 'sourceName', 'visible', 'autoHideMs'],
        execute: async (action, ctx) => {
            if (!ctx.adapter?.isConnected()) return false;
            // Cada adapter implementa setSourceVisibility de manera diferente
            if (typeof ctx.adapter.setSourceVisibility !== 'function') {
                console.warn(`${ctx.adapter.name} doesn't support source_visibility`);
                return false;
            }
            await ctx.adapter.setSourceVisibility(action.params.sceneName, action.params.sourceName, action.params.visible);
            // Auto-hide después de N ms
            if (action.params.autoHideMs && action.params.visible) {
                setTimeout(() => {
                    ctx.adapter.setSourceVisibility(action.params.sceneName, action.params.sourceName, false).catch(() => {});
                }, action.params.autoHideMs);
            }
            return true;
        }
    },

    source_filter_toggle: {
        target: 'adapter',
        label_i18n: 'actions.source_filter_toggle',
        params: ['sourceName', 'filterName', 'enabled'],
        execute: async (action, ctx) => {
            if (!ctx.adapter?.isConnected() || typeof ctx.adapter.setSourceFilterEnabled !== 'function') return false;
            await ctx.adapter.setSourceFilterEnabled(action.params.sourceName, action.params.filterName, action.params.enabled);
            return true;
        }
    },

    audio_mute: {
        target: 'adapter',
        label_i18n: 'actions.audio_mute',
        params: ['sourceName', 'muted'],
        execute: async (action, ctx) => {
            if (!ctx.adapter?.isConnected() || typeof ctx.adapter.setSourceMuted !== 'function') return false;
            await ctx.adapter.setSourceMuted(action.params.sourceName, action.params.muted);
            return true;
        }
    },

    recording_start: {
        target: 'adapter',
        label_i18n: 'actions.recording_start',
        params: [],
        execute: async (action, ctx) => {
            if (!ctx.adapter?.isConnected() || typeof ctx.adapter.startRecording !== 'function') return false;
            await ctx.adapter.startRecording();
            return true;
        }
    },

    recording_stop: {
        target: 'adapter',
        label_i18n: 'actions.recording_stop',
        params: [],
        execute: async (action, ctx) => {
            if (!ctx.adapter?.isConnected() || typeof ctx.adapter.stopRecording !== 'function') return false;
            await ctx.adapter.stopRecording();
            return true;
        }
    },

    // ===== Acciones LOCALES (sin servidor) =====
    play_sound: {
        target: 'local',
        label_i18n: 'actions.play_sound',
        params: ['url', 'volume'],
        execute: async (action) => {
            try {
                const audio = new Audio(action.params.url);
                audio.volume = Math.min(1, Math.max(0, action.params.volume ?? 0.8));
                await audio.play();
                return true;
            } catch (e) {
                console.warn('play_sound failed:', e);
                return false;
            }
        }
    },

    speak_tts: {
        target: 'local',
        label_i18n: 'actions.speak_tts',
        params: ['text', 'lang', 'rate', 'pitch'],
        execute: async (action) => {
            if (!window.speechSynthesis) return false;
            const u = new SpeechSynthesisUtterance(action.params.text);
            u.lang = action.params.lang || navigator.language;
            u.rate = action.params.rate ?? 1.0;
            u.pitch = action.params.pitch ?? 1.0;
            window.speechSynthesis.speak(u);
            return true;
        }
    },

    notification: {
        target: 'local',
        label_i18n: 'actions.notification',
        params: ['title', 'body', 'icon'],
        execute: async (action) => {
            if (!('Notification' in window)) return false;
            if (Notification.permission === 'default') {
                await Notification.requestPermission();
            }
            if (Notification.permission !== 'granted') return false;
            new Notification(action.params.title || 'EsperantAI', {
                body: action.params.body,
                icon: action.params.icon || 'assets/branding/logo.svg'
            });
            return true;
        }
    },

    flash_screen: {
        target: 'local',
        label_i18n: 'actions.flash_screen',
        params: ['color', 'duration'],
        execute: async (action) => {
            const overlay = document.createElement('div');
            overlay.style.cssText = `
                position: fixed; top:0; left:0; width:100%; height:100%;
                background: ${action.params.color || 'rgba(88,166,255,0.3)'};
                z-index: 99999; pointer-events: none;
                transition: opacity 0.3s; opacity: 1;
            `;
            document.body.appendChild(overlay);
            setTimeout(() => {
                overlay.style.opacity = '0';
                setTimeout(() => overlay.remove(), 300);
            }, action.params.duration || 300);
            return true;
        }
    },

    vibrate: {
        target: 'local',
        label_i18n: 'actions.vibrate',
        params: ['pattern'],
        execute: async (action) => {
            if (!navigator.vibrate) return false;
            navigator.vibrate(action.params.pattern || [100, 50, 100]);
            return true;
        }
    },

    // ===== Acciones sobre platforms =====
    chat_message: {
        target: 'platform',
        label_i18n: 'actions.chat_message',
        params: ['platform', 'text'],
        execute: async (action, ctx) => {
            const p = ctx.platforms?.[action.params.platform];
            if (!p?.isConnected() || typeof p.sendChatMessage !== 'function') return false;
            await p.sendChatMessage(action.params.text);
            return true;
        }
    },

    create_clip: {
        target: 'platform',
        label_i18n: 'actions.create_clip',
        params: ['platform'],
        execute: async (action, ctx) => {
            const p = ctx.platforms?.[action.params.platform];
            if (!p?.isConnected() || typeof p.createClip !== 'function') return false;
            await p.createClip();
            return true;
        }
    },

    // ===== Acciones compuestas =====
    sequence: {
        target: 'composite',
        label_i18n: 'actions.sequence',
        params: ['actions', 'delayMs'],
        execute: async (action, ctx) => {
            for (const sub of action.params.actions || []) {
                await ActionEngine.executeSingle(sub, ctx);
                if (action.params.delayMs) {
                    await new Promise(r => setTimeout(r, action.params.delayMs));
                }
            }
            return true;
        }
    },

    random_choice: {
        target: 'composite',
        label_i18n: 'actions.random_choice',
        params: ['actions'],
        execute: async (action, ctx) => {
            const choices = action.params.actions || [];
            if (!choices.length) return false;
            const chosen = choices[Math.floor(Math.random() * choices.length)];
            return ActionEngine.executeSingle(chosen, ctx);
        }
    },

    delay_then: {
        target: 'composite',
        label_i18n: 'actions.delay_then',
        params: ['delayMs', 'action'],
        execute: async (action, ctx) => {
            await new Promise(r => setTimeout(r, action.params.delayMs || 1000));
            return ActionEngine.executeSingle(action.params.action, ctx);
        }
    }
};


class ActionEngine {
    /**
     * @param {Object} ctx { config, adapter, platforms, i18n }
     */
    constructor(ctx) {
        this.ctx = ctx;
    }

    /**
     * Ejecuta TODAS las acciones de un trigger en paralelo.
     * @param {Array<Object>} actions
     */
    async execute(actions) {
        if (!actions?.length) return [];
        const results = await Promise.allSettled(
            actions.map(a => ActionEngine.executeSingle(a, this.ctx))
        );
        return results.map((r, i) => ({
            action: actions[i],
            success: r.status === 'fulfilled' && r.value === true,
            error: r.status === 'rejected' ? r.reason : null
        }));
    }

    /**
     * Ejecuta una sola acción.
     */
    static async executeSingle(action, ctx) {
        if (!action || !action.type) return false;
        const def = ACTION_REGISTRY[action.type];
        if (!def) {
            console.warn(`Unknown action type: ${action.type}`);
            return false;
        }
        try {
            return await def.execute(action, ctx);
        } catch (e) {
            console.error(`Action ${action.type} failed:`, e);
            return false;
        }
    }

    static getActionTypes() {
        return Object.keys(ACTION_REGISTRY).map(type => ({
            type,
            target: ACTION_REGISTRY[type].target,
            label_i18n: ACTION_REGISTRY[type].label_i18n,
            params: ACTION_REGISTRY[type].params
        }));
    }

    static getActionsByTarget(target) {
        return ActionEngine.getActionTypes().filter(a => a.target === target);
    }
}

window.ActionEngine = ActionEngine;
window.ACTION_REGISTRY = ACTION_REGISTRY;
