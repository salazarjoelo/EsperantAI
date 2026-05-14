/* ============================================================================
 * EsperantAI — Combo Trigger UI
 *
 * Panel visual para configurar combos: evento de plataforma + gesto físico
 * del streamer → array de acciones.
 *
 * Ejemplo de combo:
 *   - eventType: 'donation' (Twitch / YouTube super_chat / etc.)
 *   - requireGesture: 'thumbs-up'
 *   - actions: [scene_switch, play_sound, create_clip] (configurado vía
 *     el modal del TriggerUIBuilder reusando triggerActions namespace)
 *
 * Almacenamiento en config:
 *   comboTriggers: [
 *     { id, eventType, requireGesture, enabled }
 *   ]
 *   triggerActions['combo:<id>']: [ {type, target, params}, ... ]
 *
 * El engine (trigger-engine.js) consume comboTriggers para configurar
 * pending event confirmations + lee triggerActions['combo:<id>'] cuando
 * la confirmación dispara.
 *
 * License gate: Pro+ tier solamente (licenseManager.hasFeature('comboTriggers')).
 * ========================================================================== */

'use strict';

// Eventos soportados por al menos 1 plataforma. Si una plataforma no soporta
// un evento dado, el combo simplemente no dispara (no rompe nada).
const COMBO_EVENT_TYPES = [
    { key: 'sub',                i18n: 'platforms.events.sub' },
    { key: 'resub',              i18n: 'platforms.events.resub' },
    { key: 'gift_sub',           i18n: 'platforms.events.gift_sub' },
    { key: 'follow',             i18n: 'platforms.events.follow' },
    { key: 'donation',           i18n: 'platforms.events.donation' },
    { key: 'cheer_bits',         i18n: 'platforms.events.cheer_bits' },
    { key: 'raid',               i18n: 'platforms.events.raid' },
    { key: 'channel_points',     i18n: 'platforms.events.channel_points' },
    { key: 'super_chat',         i18n: 'platforms.events.super_chat' },
    { key: 'gift',               i18n: 'platforms.events.gift' },
    { key: 'member_milestone',   i18n: 'platforms.events.member_milestone' }
];

// Gestos físicos disponibles para confirmar combos.
// Solo manos (los gestos faciales como happy/surprise también podrían usarse
// pero el engine actualmente solo verifica handGesture en _checkEventConfirmation).
const COMBO_GESTURE_TYPES = [
    { key: 'thumbs-up',  i18n: 'scenes.thumbs_up' },
    { key: 'peace',      i18n: 'scenes.peace' },
    { key: 'rock',       i18n: 'scenes.rock' },
    { key: 'ok',         i18n: 'scenes.ok' },
    { key: 'fist',       i18n: 'scenes.fist' },
    { key: 'open-palm',  i18n: 'scenes.open_palm' },
    { key: 'point',      i18n: 'scenes.point' },
    { key: 'gassho',     i18n: 'scenes.gassho' }
];

class ComboTriggerUI {
    /**
     * @param {HTMLElement} container — donde montar el panel
     * @param {Object} config — instancia de ConfigManager
     * @param {Object} i18n — instancia de i18n
     * @param {Object} licenseManager — para feature gating
     * @param {Object} triggerUI — instancia de TriggerUIBuilder (para reusar modal de acciones)
     */
    constructor(container, config, i18n, licenseManager, triggerUI) {
        this.container = container;
        this.config = config;
        this.i18n = i18n;
        this.licenseManager = licenseManager;
        this.triggerUI = triggerUI;
        // Callback opcional: invocado cuando el set de combos cambia
        // (app.js lo usa para re-suscribir eventos de plataforma).
        this.onCombosChanged = null;
    }

    render() {
        if (!this.container) return;
        const hasFeature = !!this.licenseManager?.hasFeature?.('comboTriggers');
        if (!hasFeature) {
            this.container.innerHTML = this._renderUpgradeHint();
            this._wireUpgradeButton();
            return;
        }

        const combos = this._getCombos();
        this.container.innerHTML = `
            <div class="combo-hint">${this._t('combo.hint', {}, 'Combine a platform event with a physical gesture to confirm celebrations. Useful to avoid accidental triggers during streams.')}</div>
            <div class="combo-list" id="combo-list">
                ${combos.length ? combos.map(c => this._renderComboRow(c)).join('') : this._renderEmptyState()}
            </div>
            <div class="combo-toolbar">
                <button type="button" class="primary" id="btn-combo-add">+ ${this._t('combo.add', {}, 'Add combo')}</button>
            </div>
        `;
        this._wireEvents();
    }

    // ─── Render helpers ──────────────────────────────────────────────────

    _renderUpgradeHint() {
        return `
            <div class="combo-locked" role="region" aria-label="${this._escapeAttr(this._t('combo.locked_aria', {}, 'Combo Triggers locked'))}">
                <h3>🔒 ${this._t('combo.locked_title', {}, 'Combo Triggers')}</h3>
                <p>${this._t('combo.locked_desc', {}, 'Combo triggers let you require a physical gesture to confirm platform events before the action fires — perfect to avoid accidental celebrations during streams.')}</p>
                <p><strong>${this._t('license.feature_locked', { tier: 'Pro+' }, 'Available in Pro+ tier')}</strong></p>
                <button type="button" class="primary" id="btn-combo-upgrade">${this._t('license.buy_button', {}, 'Get EsperantAI')}</button>
            </div>
        `;
    }

    _renderEmptyState() {
        return `<div class="combo-empty">${this._t('combo.empty', {}, 'No combos yet. Click + Add combo to create one.')}</div>`;
    }

    _renderComboRow(combo) {
        const id = combo.id;
        const eventOptions = ['<option value="">' + this._escape(this._t('combo.select_event', {}, '— event —')) + '</option>']
            .concat(COMBO_EVENT_TYPES.map(e => {
                const selected = combo.eventType === e.key ? 'selected' : '';
                return `<option value="${this._escapeAttr(e.key)}" ${selected}>${this._escape(this._t(e.i18n, {}, e.key))}</option>`;
            }))
            .join('');

        const gestureOptions = ['<option value="">' + this._escape(this._t('combo.select_gesture', {}, '— gesture —')) + '</option>']
            .concat(COMBO_GESTURE_TYPES.map(g => {
                const selected = combo.requireGesture === g.key ? 'selected' : '';
                return `<option value="${this._escapeAttr(g.key)}" ${selected}>${this._escape(this._t(g.i18n, {}, g.key))}</option>`;
            }))
            .join('');

        const actionKey = `combo:${id}`;
        const actions = this.config.getActionsForTrigger
            ? this.config.getActionsForTrigger(actionKey)
            : (this.config.get(`triggerActions.${actionKey}`, []) || []);
        const actionCount = Array.isArray(actions) ? actions.length : 0;
        const actionBadge = actionCount
            ? this._t('actions.count', { count: actionCount }, `${actionCount} actions`)
            : this._t('combo.no_actions', {}, 'No actions');

        const enabledLabel = this._t('combo.enabled', {}, 'Enabled');
        const removeLabel = this._t('combo.remove', {}, 'Remove');
        const actionsLabel = this._t('actions.configure_short', {}, 'Actions');

        return `
            <div class="combo-row" data-combo-id="${this._escapeAttr(id)}">
                <label class="combo-toggle">
                    <input type="checkbox" data-combo-enabled ${combo.enabled ? 'checked' : ''}>
                    <span>${enabledLabel}</span>
                </label>
                <select class="combo-event-select" data-combo-event aria-label="${this._escapeAttr(this._t('combo.event_label', {}, 'Event'))}">
                    ${eventOptions}
                </select>
                <span class="combo-arrow" aria-hidden="true">→</span>
                <select class="combo-gesture-select" data-combo-gesture aria-label="${this._escapeAttr(this._t('combo.gesture_label', {}, 'Confirming gesture'))}">
                    ${gestureOptions}
                </select>
                <span class="combo-action-summary">${this._escape(actionBadge)}</span>
                <button type="button" class="secondary combo-actions-btn" data-combo-actions>
                    ⚙️ ${this._escape(actionsLabel)}
                </button>
                <button type="button" class="danger btn-small combo-remove-btn" data-combo-remove aria-label="${this._escapeAttr(removeLabel)}">
                    ✕
                </button>
            </div>
        `;
    }

    // ─── Event wiring ────────────────────────────────────────────────────

    _wireEvents() {
        // Add combo
        const btnAdd = this.container.querySelector('#btn-combo-add');
        btnAdd?.addEventListener('click', () => this._addCombo());

        // Per-row events
        this.container.querySelectorAll('.combo-row').forEach(row => {
            const id = row.dataset.comboId;

            const cbEnabled = row.querySelector('[data-combo-enabled]');
            cbEnabled?.addEventListener('change', () => {
                this._updateCombo(id, { enabled: cbEnabled.checked });
            });

            const selEvent = row.querySelector('[data-combo-event]');
            selEvent?.addEventListener('change', () => {
                this._updateCombo(id, { eventType: selEvent.value });
            });

            const selGesture = row.querySelector('[data-combo-gesture]');
            selGesture?.addEventListener('change', () => {
                this._updateCombo(id, { requireGesture: selGesture.value });
            });

            const btnActions = row.querySelector('[data-combo-actions]');
            btnActions?.addEventListener('click', () => this._openActionsModal(id));

            const btnRemove = row.querySelector('[data-combo-remove]');
            btnRemove?.addEventListener('click', () => {
                if (confirm(this._t('combo.confirm_delete', {}, 'Delete this combo?'))) {
                    this._removeCombo(id);
                }
            });
        });
    }

    _wireUpgradeButton() {
        const btn = this.container.querySelector('#btn-combo-upgrade');
        btn?.addEventListener('click', () => {
            // Reusa el flow de paywall existente si está disponible
            if (typeof window.showLicenseLockout === 'function') {
                window.showLicenseLockout();
            } else {
                window.open('https://esperantai.com', '_blank');
            }
        });
    }

    // ─── State manipulation ──────────────────────────────────────────────

    _getCombos() {
        const list = this.config.get('comboTriggers', []);
        return Array.isArray(list) ? list : [];
    }

    _setCombos(list) {
        this.config.set('comboTriggers', list);
        if (typeof this.onCombosChanged === 'function') {
            try { this.onCombosChanged(list); } catch (e) { console.warn('onCombosChanged threw:', e); }
        }
    }

    _addCombo() {
        const combos = this._getCombos();
        combos.push({
            id: this._generateId(),
            eventType: '',
            requireGesture: '',
            enabled: false
        });
        this._setCombos(combos);
        this.render();
    }

    _updateCombo(id, patch) {
        const combos = this._getCombos();
        const idx = combos.findIndex(c => c.id === id);
        if (idx === -1) return;
        combos[idx] = { ...combos[idx], ...patch };
        this._setCombos(combos);
        // Re-render para refrescar summaries; sin tocar focus si el cambio
        // viene de un input que el user todavía está editando.
        // (Aquí re-render completo es OK porque no afecta el flow del user.)
        this.render();
    }

    _removeCombo(id) {
        const combos = this._getCombos().filter(c => c.id !== id);
        this._setCombos(combos);
        // Limpiar acciones asociadas para no dejar huérfanas en config.
        const actionKey = `combo:${id}`;
        if (this.config.setActionsForTrigger) {
            this.config.setActionsForTrigger(actionKey, []);
        } else {
            this.config.set(`triggerActions.${actionKey}`, []);
        }
        this.render();
    }

    _openActionsModal(id) {
        // Reusa el modal del TriggerUIBuilder pasando el comboKey como triggerKey.
        // El modal escribe a triggerActions['combo:<id>'] que el engine leerá.
        if (!this.triggerUI || typeof this.triggerUI._showActionConfigModal !== 'function') {
            console.warn('TriggerUIBuilder.showActionConfigModal no disponible');
            return;
        }
        const actionKey = `combo:${id}`;
        // Inject this combo as a synthetic "trigger" for the modal to label correctly.
        // The modal uses TRIGGER_CATALOG to find the label, but for combo: keys it'll
        // fallback to the raw key — that's acceptable.
        this.triggerUI._showActionConfigModal(actionKey);
    }

    // ─── Utilities ───────────────────────────────────────────────────────

    _generateId() {
        // crypto.randomUUID() existe en browsers modernos. Fallback corto y seguro.
        if (globalThis.crypto?.randomUUID) {
            return globalThis.crypto.randomUUID();
        }
        return 'combo-' + Math.random().toString(36).slice(2, 10) + '-' + Date.now().toString(36);
    }

    _t(key, params = {}, fallback = null) {
        return this.i18n?.t ? this.i18n.t(key, params, fallback) : (fallback || key);
    }

    _escape(s) {
        return String(s ?? '').replace(/[&<>"']/g, c => (
            { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]
        ));
    }

    _escapeAttr(s) {
        return this._escape(s);
    }
}

window.ComboTriggerUI = ComboTriggerUI;
window.COMBO_EVENT_TYPES = COMBO_EVENT_TYPES;
window.COMBO_GESTURE_TYPES = COMBO_GESTURE_TYPES;
