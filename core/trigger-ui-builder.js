/* ============================================================================
 * EsperantAI — Trigger UI Builder
 *
 * Dibuja dinámicamente el panel de mapeo gesto → escena.
 * Las escenas se cargan en tiempo real del adapter conectado (OBS / Streamlabs /
 * vMix / PRISM).
 *
 * Filosofía:
 *   - Universal triggers (biológicos): rotación cabeza, emociones, gaze, blink,
 *     distancia. Estos son IDÉNTICOS en cualquier cultura (Ekman 1972).
 *   - Cultural triggers (aprendidos): gestos de mano. Pulgar arriba significa
 *     "ok" en occidente pero puede ser ofensivo en Medio Oriente / Asia Occ.
 *
 * Por eso EsperantAI marca con badge visual qué gestos son universales vs
 * culturales — el usuario decide cuáles usar según su audiencia.
 * ========================================================================== */

'use strict';

/**
 * Catálogo canónico de triggers con metadata.
 * universal: el gesto significa lo mismo en cualquier cultura humana.
 * category: agrupación en la UI (head, emotion, gaze, etc.)
 * requires: qué capability del Human.js config debe estar enabled
 */
const TRIGGER_CATALOG = [
    // ========== HEAD ROTATION (universal) ==========
    { key: 'center',     category: 'head',     universal: true,  icon: '⏺️',  i18n: 'scenes.center',     requires: 'head' },
    { key: 'left',       category: 'head',     universal: true,  icon: '⬅️',  i18n: 'scenes.left',       requires: 'head' },
    { key: 'right',      category: 'head',     universal: true,  icon: '➡️',  i18n: 'scenes.right',      requires: 'head' },
    { key: 'up',         category: 'head',     universal: true,  icon: '⬆️',  i18n: 'scenes.up',         requires: 'head' },
    { key: 'down',       category: 'head',     universal: true,  icon: '⬇️',  i18n: 'scenes.down',       requires: 'head' },
    { key: 'tilt-left',  category: 'head',     universal: true,  icon: '↩️',  i18n: 'scenes.tilt_left',  requires: 'head' },
    { key: 'tilt-right', category: 'head',     universal: true,  icon: '↪️',  i18n: 'scenes.tilt_right', requires: 'head' },

    // ========== DISTANCE (universal) ==========
    { key: 'near',       category: 'distance', universal: true,  icon: '🔍+', i18n: 'scenes.near',       requires: 'distance' },
    { key: 'far',        category: 'distance', universal: true,  icon: '🔍-', i18n: 'scenes.far',        requires: 'distance' },

    // ========== GAZE (universal - mover los ojos) ==========
    { key: 'gaze-left',  category: 'gaze',     universal: true,  icon: '👁️⬅', i18n: 'scenes.gaze_left',  requires: 'gaze' },
    { key: 'gaze-right', category: 'gaze',     universal: true,  icon: '👁️➡', i18n: 'scenes.gaze_right', requires: 'gaze' },
    { key: 'gaze-up',    category: 'gaze',     universal: true,  icon: '👁️⬆', i18n: 'scenes.gaze_up',    requires: 'gaze' },
    { key: 'gaze-down',  category: 'gaze',     universal: true,  icon: '👁️⬇', i18n: 'scenes.gaze_down',  requires: 'gaze' },

    // ========== EMOTIONS (universal - Ekman 1972) ==========
    { key: 'happy',      category: 'emotion',  universal: true,  icon: '😊',  i18n: 'scenes.happy',      requires: 'emotion' },
    { key: 'surprise',   category: 'emotion',  universal: true,  icon: '😲',  i18n: 'scenes.surprise',   requires: 'emotion' },
    { key: 'angry',      category: 'emotion',  universal: true,  icon: '😠',  i18n: 'scenes.angry',      requires: 'emotion' },
    { key: 'neutral',    category: 'emotion',  universal: true,  icon: '😐',  i18n: 'scenes.neutral',    requires: 'emotion' },

    // ========== BLINK (universal - acción puntual) ==========
    { key: 'blink',      category: 'blink',    universal: true,  icon: '😉😉', i18n: 'scenes.blink',     requires: 'blink' },

    // ========== HAND GESTURES (CULTURAL — pueden variar de significado) ==========
    { key: 'thumbs-up',  category: 'hand',     universal: false, icon: '👍',  i18n: 'scenes.thumbs_up',  requires: 'hand', culturalNote: 'En Medio Oriente / Asia Occidental puede ser ofensivo. En Occidente = aprobación.' },
    { key: 'peace',      category: 'hand',     universal: false, icon: '✌️',  i18n: 'scenes.peace',      requires: 'hand', culturalNote: 'En Reino Unido / Irlanda / Australia con palma hacia adentro = ofensa. Hacia afuera = paz/victoria.' },
    { key: 'rock',       category: 'hand',     universal: false, icon: '🤘',  i18n: 'scenes.rock',       requires: 'hand', culturalNote: 'En Italia con palma hacia abajo = "los cuernos" (insulto). Hacia arriba = rock metal.' },
    { key: 'ok',         category: 'hand',     universal: false, icon: '👌',  i18n: 'scenes.ok',         requires: 'hand', culturalNote: 'En Brasil / Turquía / Alemania puede ser ofensivo. En USA = OK.' },
    { key: 'fist',       category: 'hand',     universal: false, icon: '✊',  i18n: 'scenes.fist',       requires: 'hand', culturalNote: 'Significado político variable según contexto.' },
    { key: 'open-palm',  category: 'hand',     universal: false, icon: '🖐️',  i18n: 'scenes.open_palm',  requires: 'hand', culturalNote: 'En Grecia (mountza) hacia alguien = ofensa fuerte. Generalmente "stop" en otros lados.' },
    { key: 'point',      category: 'hand',     universal: false, icon: '☝️',  i18n: 'scenes.point',      requires: 'hand', culturalNote: 'Apuntar con el dedo se considera grosero en muchas culturas asiáticas.' }
];

class TriggerUIBuilder {
    /**
     * @param {HTMLElement} container — donde renderizar
     * @param {ConfigManager} config — config global
     * @param {I18n} i18n
     */
    constructor(container, config, i18n) {
        this.container = container;
        this.config = config;
        this.i18n = i18n;
        this.availableScenes = []; // poblado cuando un adapter se conecta
        this.adapterConnected = false;
    }

    /**
     * Recibir la lista de escenas reales del adapter conectado.
     * Cada vez que cambian, re-renderiza los dropdowns.
     */
    updateAvailableScenes(scenes) {
        this.availableScenes = scenes || [];
        this.render();
    }

    setAdapterConnected(connected) {
        this.adapterConnected = connected;
        this.render();
    }

    /**
     * Renderiza el panel completo agrupado por categoría.
     */
    render() {
        // Preserve open/closed state of details elements across re-renders
        const openCategories = new Set();
        if (this.container) {
            this.container.querySelectorAll('details.tb-category[open]').forEach(d => {
                const toggle = d.querySelector('[data-category-toggle]');
                if (toggle) openCategories.add(toggle.dataset.categoryToggle);
            });
        }

        const enabled = this.config.get('enabled', {});
        const html = [];

        // Banner explicativo sobre universalidad
        html.push(this._renderUniversalityBanner());

        // Banner si no hay adapter conectado
        if (!this.adapterConnected) {
            html.push(`
                <div class="tb-warning">
                    <strong>${this.i18n.t('triggers.connect_first', {}, 'Conecta tu app de streaming primero')}</strong>
                    <p style="margin: 6px 0 0 0; font-size: 12px;">${this.i18n.t('triggers.connect_first_hint', {}, 'Las escenas reales aparecerán en los dropdowns automáticamente.')}</p>
                </div>
            `);
        }

        // Agrupar triggers por categoría
        const categories = [
            { id: 'head',     label_i18n: 'categories.head_rotation', universal: true,  emoji: '🧠' },
            { id: 'distance', label_i18n: 'categories.distance',      universal: true,  emoji: '📏' },
            { id: 'gaze',     label_i18n: 'categories.gaze',          universal: true,  emoji: '👁️' },
            { id: 'emotion',  label_i18n: 'categories.emotion',       universal: true,  emoji: '😀' },
            { id: 'blink',    label_i18n: 'categories.blink',         universal: true,  emoji: '👁️‍🗨️' },
            { id: 'hand',     label_i18n: 'categories.hand_gestures', universal: false, emoji: '✋' }
        ];

        for (const cat of categories) {
            const triggers = TRIGGER_CATALOG.filter(t => t.category === cat.id);
            const isEnabled = enabled[cat.id === 'head' ? 'head' : cat.id] === true;
            html.push(this._renderCategory(cat, triggers, isEnabled, openCategories));
        }

        this.container.innerHTML = html.join('');
        this._wireEvents();
    }

    _renderUniversalityBanner() {
        return `
            <div class="tb-banner">
                <div class="tb-banner-title">🌍 ${this.i18n.t('triggers.universality_title', {}, 'Universalidad de gestos')}</div>
                <div class="tb-banner-text">
                    <span class="tb-universal-marker">🌐 ${this.i18n.t('triggers.universal_label', {}, 'Universal')}</span>
                    = ${this.i18n.t('triggers.universal_desc', {}, 'mismo significado en cualquier cultura (Ekman 1972 — emociones básicas, rotación de cabeza, mirada)')}.
                    <br>
                    <span class="tb-cultural-marker">⚠️ ${this.i18n.t('triggers.cultural_label', {}, 'Cultural')}</span>
                    = ${this.i18n.t('triggers.cultural_desc', {}, 'el significado puede variar según país/cultura (gestos de mano)')}.
                </div>
            </div>
        `;
    }

    _renderCategory(cat, triggers, enabled, openCategories = null) {
        const label = this.i18n.t(cat.label_i18n);
        const universalBadge = cat.universal
            ? '<span class="tb-universal-marker tb-small">🌐</span>'
            : '<span class="tb-cultural-marker tb-small">⚠️</span>';

        const rows = triggers.map(t => this._renderTriggerRow(t, enabled)).join('');

        const shouldBeOpen = enabled || (openCategories && openCategories.has(cat.id));
        return `
            <details class="tb-category" ${shouldBeOpen ? 'open' : ''}>
                <summary>
                    <span class="tb-cat-emoji">${cat.emoji}</span>
                    <span class="tb-cat-label">${label}</span>
                    ${universalBadge}
                    <label class="tb-toggle" onclick="event.stopPropagation()">
                        <input type="checkbox" data-category-toggle="${cat.id}" ${enabled ? 'checked' : ''}>
                        <span>${this.i18n.t('ui.enable', {}, 'Habilitar')}</span>
                    </label>
                </summary>
                <div class="tb-category-body ${enabled ? '' : 'tb-disabled'}">
                    ${rows}
                </div>
            </details>
        `;
    }

    _renderTriggerRow(t, categoryEnabled) {
        const triggerLabel = this.i18n.t(t.i18n) || t.key;
        const currentValue = this.config.get(`scenes.${t.key}`, '');
        const isUniversal = t.universal;
        const culturalTooltip = t.culturalNote ? `title="${this._escape(t.culturalNote)}"` : '';

        // Get multi-action count
        const actions = this.config.getActionsForTrigger(t.key);
        const actionCount = actions.length;
        const actionBadge = actionCount > 1
            ? `<span class="tb-action-count">${actionCount} actions</span>`
            : '';

        // Scene dropdown (kept as quick action)
        const options = [`<option value="">${this.i18n.t('scenes.scene_unassigned', {}, '— sin asignar —')}</option>`];
        for (const scene of this.availableScenes) {
            const selected = scene.name === currentValue ? 'selected' : '';
            options.push(`<option value="${this._escape(scene.name)}" ${selected}>${this._escape(scene.name)}</option>`);
        }
        if (currentValue && !this.availableScenes.find(s => s.name === currentValue)) {
            options.push(`<option value="${this._escape(currentValue)}" selected>${this._escape(currentValue)} ⚠️ (no existe)</option>`);
        }

        const universalIndicator = isUniversal
            ? '<span class="tb-universal-marker tb-small" title="Universal: mismo significado en cualquier cultura">🌐</span>'
            : `<span class="tb-cultural-marker tb-small" ${culturalTooltip}>⚠️</span>`;

        return `
            <div class="tb-row" data-trigger="${t.key}">
                <div class="tb-row-label">
                    <span class="tb-icon">${t.icon}</span>
                    <span class="tb-label">${triggerLabel}</span>
                    ${universalIndicator}
                </div>
                <div class="tb-row-actions">
                    <select class="tb-scene-select" data-trigger="${t.key}" ${categoryEnabled ? '' : 'disabled'}>
                        ${options.join('')}
                    </select>
                    ${actionBadge}
                    <button class="tb-action-config-btn" data-trigger="${t.key}" title="Configure actions" ${categoryEnabled ? '' : 'disabled'}>⚙️</button>
                </div>
            </div>
        `;
    }

    _wireEvents() {
        // Selects de escena
        this.container.querySelectorAll('.tb-scene-select').forEach(sel => {
            sel.addEventListener('change', () => {
                const trigger = sel.dataset.trigger;
                this.config.set(`scenes.${trigger}`, sel.value);
            });
        });

        // Action config buttons
        this.container.querySelectorAll('.tb-action-config-btn').forEach(btn => {
            btn.addEventListener('click', () => {
                const trigger = btn.dataset.trigger;
                this._showActionConfigModal(trigger);
            });
        });

        // Toggles de categoría
        this.container.querySelectorAll('[data-category-toggle]').forEach(cb => {
            cb.addEventListener('change', () => {
                const cat = cb.dataset.categoryToggle;
                this.config.set(`enabled.${cat}`, cb.checked);
                // Re-render para reflejar cambio (selects enable/disable)
                this.render();
                // Notify external listener (detector debe recargar Human.js si cambia gaze/emotion/blink/hand)
                if (this.onCategoryToggle) this.onCategoryToggle(cat, cb.checked);
            });
        });
    }

    /**
     * Shows a modal for configuring multiple actions on a single trigger.
     * @param {string} triggerKey — ej. 'left', 'thumbs-up', 'happy'
     */
    _showActionConfigModal(triggerKey) {
        const actions = this.config.getActionsForTrigger(triggerKey);
        const catalogEntry = TRIGGER_CATALOG.find(t => t.key === triggerKey);
        const triggerLabel = catalogEntry ? (this.i18n.t(catalogEntry.i18n) || triggerKey) : triggerKey;

        // Get available action types
        const actionTypes = window.ActionEngine.getActionTypes();

        // Build modal HTML
        const overlay = document.createElement('div');
        overlay.className = 'action-modal-overlay';

        const actionItemsHtml = actions.map((a, i) => {
            const typeDef = actionTypes.find(t => t.type === a.type);
            const paramsStr = a.params ? Object.entries(a.params).map(([k,v]) => `${k}=${v}`).join(', ') : '';
            return `<div class="action-item" data-action-index="${i}">
                <span class="action-item-type">${a.type}</span>
                <span class="action-item-params">${this._escape(paramsStr)}</span>
                <button class="action-item-delete" data-delete-index="${i}" title="Remove">✕</button>
            </div>`;
        }).join('');

        const addActionOptions = actionTypes.map(a =>
            `<option value="${a.type}">${a.type.replace(/_/g, ' ')} (${a.target})</option>`
        ).join('');

        overlay.innerHTML = `
            <div class="action-modal">
                <h3>⚙️ ${triggerLabel} — Actions</h3>
                <div id="action-list">
                    ${actionItemsHtml || '<p style="color:var(--text-muted);font-size:12px;">No actions configured. The scene dropdown above still works as a quick action.</p>'}
                </div>
                <div style="margin-top: 16px; padding-top: 12px; border-top: 1px solid var(--border);">
                    <label style="font-size: 12px; color: var(--text-muted);">Add action:</label>
                    <div style="display: flex; gap: 8px; margin-top: 4px;">
                        <select id="new-action-type" style="flex:1; padding:8px; background:var(--bg); color:var(--text); border:1px solid var(--border); border-radius:6px; font-size:12px;">
                            ${addActionOptions}
                        </select>
                        <button id="btn-add-action" class="primary" style="padding:8px 16px; font-size:12px;">+ Add</button>
                    </div>
                </div>
                <div style="margin-top: 16px; display: flex; justify-content: flex-end; gap: 8px;">
                    <button id="btn-close-action-modal" class="secondary" style="padding:8px 16px; font-size:12px;">Close</button>
                </div>
            </div>
        `;
        document.body.appendChild(overlay);

        // Wire events
        overlay.querySelector('#btn-close-action-modal').addEventListener('click', () => overlay.remove());
        overlay.addEventListener('click', (e) => { if (e.target === overlay) overlay.remove(); });

        // Delete action
        overlay.querySelectorAll('.action-item-delete').forEach(btn => {
            btn.addEventListener('click', () => {
                const idx = parseInt(btn.dataset.deleteIndex);
                this.config.removeActionFromTrigger(triggerKey, idx);
                overlay.remove();
                this._showActionConfigModal(triggerKey); // re-render
                this.render(); // refresh main UI
            });
        });

        // Add action
        overlay.querySelector('#btn-add-action').addEventListener('click', () => {
            const type = overlay.querySelector('#new-action-type').value;
            const typeDef = actionTypes.find(a => a.type === type);
            // Create action with default params
            const newAction = { type, target: typeDef.target, params: {} };

            // For scene_switch, use the scene from the dropdown if available
            if (type === 'scene_switch') {
                const currentScene = this.config.get(`scenes.${triggerKey}`, '');
                if (currentScene) newAction.params.sceneName = currentScene;
            }

            this.config.addActionToTrigger(triggerKey, newAction);
            overlay.remove();
            this._showActionConfigModal(triggerKey); // re-render modal
            this.render(); // refresh main UI
        });
    }

    _escape(s) {
        if (s == null) return '';
        return String(s).replace(/[&<>"']/g, c => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]));
    }
}

window.TriggerUIBuilder = TriggerUIBuilder;
window.TRIGGER_CATALOG = TRIGGER_CATALOG;
