/* ============================================================================
 * EsperantAI — Trigger UI Builder
 *
 * Dibuja dinámicamente el panel de mapeo gesto → escena/acciones.
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
    // culturalNote actualizado 2026-05-14 con propuesta de Z/GLM-4
    // (CULTURAL_GESTURE_REVIEW.md secciones 2.2 y 5)
    { key: 'thumbs-up',  category: 'hand',     universal: false, icon: '👍',  i18n: 'scenes.thumbs_up',  requires: 'hand', culturalNote: 'Occidente / LatAm: aprobación. Medio Oriente / Asia Occidental: puede ser ofensivo. China / Japón: positivo aunque menos común; en JP los streamers prefieren 🙏 gassho para agradecer donaciones. Korea: positivo.' },
    { key: 'peace',      category: 'hand',     universal: false, icon: '✌️',  i18n: 'scenes.peace',      requires: 'hand', culturalNote: 'Japón / China / Taiwan / Korea: SAFE — gesto MUY común en fotos y streams. UK / Irlanda / Australia con palma hacia adentro = insulto. Hacia afuera = paz/victoria.' },
    { key: 'rock',       category: 'hand',     universal: false, icon: '🤘',  i18n: 'scenes.rock',       requires: 'hand', culturalNote: 'Italia / España / partes de LatAm con palma hacia abajo = "cornudo" (insulto). Hacia arriba = rock metal. CJK: generalmente safe pero menos común.' },
    { key: 'ok',         category: 'hand',     universal: false, icon: '👌',  i18n: 'scenes.ok',         requires: 'hand', culturalNote: 'Japón / Korea: significa "dinero" / "moneda" — IDEAL para triggers de monetización (donaciones, tips). USA: OK. Brasil / Turquía / Alemania / Francia: ofensivo. Korea reciente: contexto político problemático.' },
    { key: 'fist',       category: 'hand',     universal: false, icon: '✊',  i18n: 'scenes.fist',       requires: 'hand', culturalNote: 'Significado político variable según contexto. CJK: generalmente neutral. Evitar en streams con audiencia mixta política.' },
    { key: 'open-palm',  category: 'hand',     universal: false, icon: '🖐️',  i18n: 'scenes.open_palm',  requires: 'hand', culturalNote: 'Grecia (mountza) hacia alguien = ofensa fuerte. Korea hacia una persona = equivalente al dedo medio (deshabilitar por defecto en ko-KR cuando se active). Generalmente "stop" en otros lados.' },
    { key: 'point',      category: 'hand',     universal: false, icon: '☝️',  i18n: 'scenes.point',      requires: 'hand', culturalNote: 'EXTREMADAMENTE ofensivo en CJK (China / Korea / Japón / Taiwan / Singapur) — apuntar con el índice a personas se enseña como tabú desde la infancia. También ofensivo en Medio Oriente / Malasia / Indonesia. Occidente: aceptable para objetos, grosero para personas. NO usar para triggers de monetización.' },

    // 🙏 Gassho — TASK-208 aprobado Joel 2026-05-14
    // Detección via core/gesture-gassho.js (heurística landmarks Human.js, ~85% accuracy)
    { key: 'gassho',     category: 'hand',     universal: false, icon: '🙏',  i18n: 'scenes.gassho',     requires: 'hand', culturalNote: 'Japón / China / Taiwan / Korea: THE courtesy gesture — significa "gracias", "por favor", "perdón" y respeto (合掌 / 합장 / 合十). PERFECTO para triggers de agradecimiento por donaciones / subs / super chats en mercados asiáticos. Thailand / Vietnam / Laos: gesto primario de saludo (wai / ไหว้). India / Nepal: namaste. Occidente: contexto religioso/oración — puede no entenderse como "gracias" por defecto.' }
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
        this._activeModal = null;
        this._lastFocusedElement = null;
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
                <div class="tb-warning" role="status">
                    <strong>${this.i18n.t('triggers.connect_first', {}, 'Conecta tu app de streaming primero')}</strong>
                    <p class="tb-warning-hint">${this.i18n.t('triggers.connect_first_hint', {}, 'Las escenas reales aparecerán en los dropdowns automáticamente.')}</p>
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
        const toggleId = `tb-toggle-${cat.id}`;

        const shouldBeOpen = enabled || (openCategories && openCategories.has(cat.id));
        return `
            <details class="tb-category" ${shouldBeOpen ? 'open' : ''}>
                <summary>
                    <span class="tb-cat-emoji">${cat.emoji}</span>
                    <span class="tb-cat-label">${label}</span>
                    ${universalBadge}
                    <label class="tb-toggle" for="${toggleId}" data-stop-summary-toggle>
                        <input id="${toggleId}" type="checkbox" data-category-toggle="${cat.id}" ${enabled ? 'checked' : ''}>
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
        const explicitActions = this.config.get(`triggerActions.${t.key}`, []);
        const actionCount = Array.isArray(explicitActions) ? explicitActions.length : 0;
        const isUniversal = t.universal;
        const culturalTooltip = t.culturalNote ? `title="${this._escapeAttr(t.culturalNote)}"` : '';
        const triggerId = this._safeId(t.key);

        // Construir options del dropdown
        const options = [`<option value="">${this.i18n.t('scenes.scene_unassigned', {}, '— sin asignar —')}</option>`];
        for (const scene of this.availableScenes) {
            const selected = scene.name === currentValue ? 'selected' : '';
            options.push(`<option value="${this._escapeAttr(scene.name)}" ${selected}>${this._escape(scene.name)}</option>`);
        }

        // Si la escena guardada ya no existe en el adapter actual, agregarla en el dropdown como "(no existe)"
        if (currentValue && !this.availableScenes.find(s => s.name === currentValue)) {
            options.push(`<option value="${this._escapeAttr(currentValue)}" selected>${this._escape(currentValue)} ⚠️ ${this.i18n.t('actions.missing_scene_suffix', {}, '(missing)')}</option>`);
        }

        const universalIndicator = isUniversal
            ? `<span class="tb-universal-marker tb-small" title="${this._escapeAttr(this.i18n.t('triggers.universal_label', {}, 'Universal'))}">🌐</span>`
            : `<span class="tb-cultural-marker tb-small" ${culturalTooltip}>⚠️</span>`;

        const actionBadge = actionCount
            ? `<span id="tb-action-summary-${triggerId}" class="tb-action-count">${this.i18n.t('actions.count', { count: actionCount }, `${actionCount} actions`)}</span>`
            : `<span id="tb-action-summary-${triggerId}" class="tb-action-count tb-action-count-empty">${this.i18n.t('actions.quick_scene_only', {}, 'Quick scene')}</span>`;

        return `
            <div class="tb-row" data-trigger="${this._escapeAttr(t.key)}">
                <label class="tb-row-label" id="tb-label-${triggerId}" for="tb-scene-${triggerId}">
                    <span class="tb-icon" aria-hidden="true">${t.icon}</span>
                    <span class="tb-label">${triggerLabel}</span>
                    ${universalIndicator}
                </label>
                <div class="tb-row-actions">
                    <select id="tb-scene-${triggerId}" class="tb-scene-select" data-trigger="${this._escapeAttr(t.key)}" aria-describedby="tb-action-summary-${triggerId}" ${categoryEnabled ? '' : 'disabled'}>
                        ${options.join('')}
                    </select>
                    ${actionBadge}
                    <button type="button" class="tb-action-config-btn" data-trigger="${this._escapeAttr(t.key)}" aria-haspopup="dialog" aria-label="${this._escapeAttr(this.i18n.t('actions.configure_for_trigger', { trigger: triggerLabel }, `Configure actions for ${triggerLabel}`))}" ${categoryEnabled ? '' : 'disabled'}>
                        ⚙️ ${this.i18n.t('actions.configure_short', {}, 'Actions')}
                    </button>
                </div>
            </div>
        `;
    }

    _wireEvents() {
        // Evitar que el toggle abra/cierre el <details> al marcar checkbox.
        this.container.querySelectorAll('[data-stop-summary-toggle]').forEach(el => {
            el.addEventListener('click', (event) => event.stopPropagation());
            el.addEventListener('keydown', (event) => {
                if (event.key === 'Enter' || event.key === ' ') event.stopPropagation();
            });
        });

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
     * Shows an accessible modal for configuring multiple actions on a trigger.
     * @param {string} triggerKey — ej. 'left', 'thumbs-up', 'happy'
     */
    _showActionConfigModal(triggerKey) {
        this._closeActiveModal();

        const catalogEntry = TRIGGER_CATALOG.find(t => t.key === triggerKey);
        const triggerLabel = catalogEntry ? (this.i18n.t(catalogEntry.i18n) || triggerKey) : triggerKey;
        const modalId = `action-modal-${this._safeId(triggerKey)}`;
        const actionTypes = window.ActionEngine?.getActionTypes ? window.ActionEngine.getActionTypes() : [];
        const explicitActions = this._getExplicitActions(triggerKey);
        const quickScene = this.config.get(`scenes.${triggerKey}`, '');

        const overlay = document.createElement('div');
        overlay.className = 'action-modal-overlay';
        overlay.innerHTML = `
            <div class="action-modal" role="dialog" aria-modal="true" aria-labelledby="${modalId}-title" aria-describedby="${modalId}-desc" tabindex="-1">
                <div class="action-modal-header">
                    <div>
                        <h3 id="${modalId}-title">⚙️ ${this._escape(triggerLabel)}</h3>
                        <p id="${modalId}-desc">${this.i18n.t('actions.modal_desc', {}, 'Build the exact reaction this gesture should trigger while you stream.')}</p>
                    </div>
                    <button type="button" class="action-modal-close" data-action-modal-close aria-label="${this._escapeAttr(this.i18n.t('ui.close', {}, 'Close'))}">×</button>
                </div>

                <div class="action-modal-section">
                    <h4>${this.i18n.t('actions.current_actions', {}, 'Current actions')}</h4>
                    <div class="action-quick-scene" ${quickScene ? '' : 'hidden'}>
                        <strong>${this.i18n.t('actions.quick_scene_title', {}, 'Quick scene selected')}:</strong>
                        <span>${this._escape(quickScene)}</span>
                        <small>${this.i18n.t('actions.quick_scene_hint', {}, 'If you add custom actions, EsperantAI will preserve this scene as the first action automatically.')}</small>
                    </div>
                    <ol class="action-list" id="${modalId}-list">
                        ${this._renderActionItems(explicitActions)}
                    </ol>
                    ${explicitActions.length ? '' : `<p class="action-empty-state">${this.i18n.t('actions.empty_state', {}, 'No custom actions yet. The quick scene dropdown still works until you add custom actions.')}</p>`}
                </div>

                <form class="action-modal-section action-builder" id="${modalId}-form">
                    <h4>${this.i18n.t('actions.add_action', {}, 'Add action')}</h4>
                    <div class="action-builder-grid">
                        <label for="${modalId}-type">${this.i18n.t('actions.type_label', {}, 'Action type')}</label>
                        <select id="${modalId}-type" name="type" ${actionTypes.length ? '' : 'disabled'}>
                            ${actionTypes.map(a => `<option value="${this._escapeAttr(a.type)}">${this._escape(this._actionLabel(a))}</option>`).join('')}
                        </select>
                    </div>
                    <div class="action-param-grid" id="${modalId}-params"></div>
                    <div class="action-modal-footer">
                        <button type="button" class="secondary" data-action-modal-close>${this.i18n.t('ui.cancel', {}, 'Cancel')}</button>
                        <button type="submit" class="primary">${this.i18n.t('actions.add_action_button', {}, '+ Add action')}</button>
                    </div>
                </form>
            </div>
        `;

        document.body.appendChild(overlay);
        this._activeModal = overlay;
        this._lastFocusedElement = document.activeElement;

        const modal = overlay.querySelector('.action-modal');
        const typeSelect = overlay.querySelector(`#${modalId}-type`);
        const paramsContainer = overlay.querySelector(`#${modalId}-params`);
        const form = overlay.querySelector(`#${modalId}-form`);

        const close = () => this._closeActiveModal();
        overlay.querySelectorAll('[data-action-modal-close]').forEach(btn => btn.addEventListener('click', close));
        overlay.addEventListener('click', (e) => { if (e.target === overlay) close(); });
        overlay.addEventListener('keydown', (e) => this._handleModalKeydown(e, overlay, close));

        const renderParams = () => this._renderActionParamFields(paramsContainer, typeSelect.value, modalId);
        typeSelect?.addEventListener('change', renderParams);
        renderParams();

        overlay.querySelectorAll('[data-delete-index]').forEach(btn => {
            btn.addEventListener('click', () => {
                const idx = Number.parseInt(btn.dataset.deleteIndex, 10);
                this.config.removeActionFromTrigger(triggerKey, idx);
                close();
                this.render();
                this._showActionConfigModal(triggerKey);
            });
        });

        overlay.querySelectorAll('[data-test-index]').forEach(btn => {
            btn.addEventListener('click', async () => {
                const idx = Number.parseInt(btn.dataset.testIndex, 10);
                const action = this._getExplicitActions(triggerKey)[idx];
                if (!action || !this.onTestAction) return;
                btn.disabled = true;
                btn.textContent = this.i18n.t('actions.testing', {}, 'Testing…');
                try {
                    await this.onTestAction(action);
                } finally {
                    btn.disabled = false;
                    btn.textContent = this.i18n.t('actions.test', {}, 'Test');
                }
            });
        });

        form.addEventListener('submit', (event) => {
            event.preventDefault();
            const selectedType = typeSelect.value;
            const typeDef = actionTypes.find(a => a.type === selectedType);
            if (!typeDef) return;

            const newAction = {
                type: selectedType,
                target: typeDef.target,
                params: this._readActionParams(paramsContainer, typeDef)
            };

            const currentExplicit = this._getExplicitActions(triggerKey);
            const currentScene = this.config.get(`scenes.${triggerKey}`, '');
            const nextActions = [...currentExplicit];

            // UX fix: if the user already selected a quick scene, preserve it when the
            // first custom action is added. Otherwise getActionsForTrigger() would stop
            // using the legacy scene fallback as soon as triggerActions exists.
            if (!nextActions.length && currentScene && selectedType !== 'scene_switch') {
                nextActions.push({
                    type: 'scene_switch',
                    target: 'adapter',
                    params: { sceneName: currentScene }
                });
            }
            if (selectedType === 'scene_switch' && currentScene && !newAction.params.sceneName) {
                newAction.params.sceneName = currentScene;
            }

            nextActions.push(newAction);
            this.config.setActionsForTrigger(triggerKey, nextActions);
            close();
            this.render();
            this._showActionConfigModal(triggerKey);
        });

        requestAnimationFrame(() => {
            modal.focus();
            const firstInteractive = overlay.querySelector('button, select, input, textarea, [tabindex]:not([tabindex="-1"])');
            firstInteractive?.focus();
        });
    }

    _getExplicitActions(triggerKey) {
        const actions = this.config.get(`triggerActions.${triggerKey}`, []);
        return Array.isArray(actions) ? actions : [];
    }

    _renderActionItems(actions) {
        if (!actions.length) return '';
        return actions.map((action, index) => {
            const summary = this._paramsSummary(action.params || {});
            return `
                <li class="action-item" data-action-index="${index}">
                    <div class="action-item-main">
                        <span class="action-item-type">${this._escape(this._actionLabel(action))}</span>
                        <span class="action-item-params">${this._escape(summary || this.i18n.t('actions.no_params', {}, 'No parameters'))}</span>
                    </div>
                    <div class="action-item-controls">
                        <button type="button" class="secondary" data-test-index="${index}">${this.i18n.t('actions.test', {}, 'Test')}</button>
                        <button type="button" class="danger" data-delete-index="${index}" aria-label="${this._escapeAttr(this.i18n.t('actions.remove_action', { index: index + 1 }, `Remove action ${index + 1}`))}">✕</button>
                    </div>
                </li>
            `;
        }).join('');
    }

    _renderActionParamFields(container, type, modalId) {
        const typeDef = window.ActionEngine?.getActionTypes().find(a => a.type === type);
        const params = typeDef?.params || [];
        if (!params.length) {
            container.innerHTML = `<p class="action-empty-state">${this.i18n.t('actions.no_params_needed', {}, 'This action does not need extra settings.')}</p>`;
            return;
        }

        container.innerHTML = params.map(param => {
            const inputId = `${modalId}-param-${this._safeId(param)}`;
            const label = this.i18n.t(`actions.params.${param}`, {}, this._humanize(param));
            if (['visible', 'enabled', 'muted'].includes(param)) {
                return `
                    <label for="${inputId}">${this._escape(label)}</label>
                    <select id="${inputId}" name="${this._escapeAttr(param)}" data-param="${this._escapeAttr(param)}" data-param-kind="boolean">
                        <option value="true">${this.i18n.t('ui.yes', {}, 'Yes')}</option>
                        <option value="false">${this.i18n.t('ui.no', {}, 'No')}</option>
                    </select>
                `;
            }
            const numericParams = ['volume', 'rate', 'pitch', 'duration', 'autoHideMs', 'delayMs'];
            const isNumber = numericParams.includes(param);
            const defaultValue = this._defaultParamValue(param);
            const listAttr = param === 'sceneName' && this.availableScenes.length ? `list="${inputId}-list"` : '';
            const datalist = param === 'sceneName' && this.availableScenes.length
                ? `<datalist id="${inputId}-list">${this.availableScenes.map(s => `<option value="${this._escapeAttr(s.name)}"></option>`).join('')}</datalist>`
                : '';
            return `
                <label for="${inputId}">${this._escape(label)}</label>
                <input id="${inputId}" name="${this._escapeAttr(param)}" data-param="${this._escapeAttr(param)}" data-param-kind="${isNumber ? 'number' : 'string'}" type="${isNumber ? 'number' : 'text'}" value="${this._escapeAttr(defaultValue)}" ${listAttr}>
                ${datalist}
            `;
        }).join('');
    }

    _readActionParams(container, typeDef) {
        const params = {};
        for (const param of typeDef.params || []) {
            const input = container.querySelector(`[data-param="${CSS.escape(param)}"]`);
            if (!input) continue;
            if (input.dataset.paramKind === 'boolean') {
                params[param] = input.value === 'true';
            } else if (input.dataset.paramKind === 'number') {
                const n = Number(input.value);
                params[param] = Number.isFinite(n) ? n : this._defaultParamValue(param);
            } else if (param === 'actions' || param === 'action') {
                try {
                    params[param] = input.value ? JSON.parse(input.value) : (param === 'actions' ? [] : null);
                } catch {
                    params[param] = param === 'actions' ? [] : null;
                }
            } else {
                params[param] = input.value.trim();
            }
        }
        return params;
    }

    _defaultParamValue(param) {
        const defaults = {
            sceneName: '',
            sourceName: '',
            filterName: '',
            visible: true,
            muted: true,
            enabled: true,
            autoHideMs: 0,
            url: 'assets/sounds/gesture.mp3',
            volume: 0.8,
            title: 'EsperantAI',
            body: '',
            icon: 'assets/branding/logo.svg',
            color: 'rgba(88,166,255,0.3)',
            duration: 300,
            pattern: '[100,50,100]',
            text: '',
            lang: navigator.language || 'en-US',
            rate: 1,
            pitch: 1,
            platform: 'twitch',
            delayMs: 1000,
            actions: '[]',
            action: '{}'
        };
        return defaults[param] ?? '';
    }

    _handleModalKeydown(event, overlay, close) {
        if (event.key === 'Escape') {
            event.preventDefault();
            close();
            return;
        }
        if (event.key !== 'Tab') return;

        const focusables = [...overlay.querySelectorAll('button:not([disabled]), select:not([disabled]), input:not([disabled]), textarea:not([disabled]), [tabindex]:not([tabindex="-1"])')]
            .filter(el => el.offsetParent !== null || el === document.activeElement);
        if (!focusables.length) return;
        const first = focusables[0];
        const last = focusables[focusables.length - 1];
        if (event.shiftKey && document.activeElement === first) {
            event.preventDefault();
            last.focus();
        } else if (!event.shiftKey && document.activeElement === last) {
            event.preventDefault();
            first.focus();
        }
    }

    _closeActiveModal() {
        if (!this._activeModal) return;
        const modal = this._activeModal;
        this._activeModal = null;
        modal.remove();
        if (this._lastFocusedElement && typeof this._lastFocusedElement.focus === 'function') {
            this._lastFocusedElement.focus();
        }
    }

    _actionLabel(action) {
        const key = action.label_i18n || `actions.${action.type}`;
        return this.i18n.t(key, {}, this._humanize(action.type || 'action'));
    }

    _paramsSummary(params) {
        return Object.entries(params || {})
            .filter(([, value]) => value !== '' && value != null)
            .map(([key, value]) => `${this._humanize(key)}=${Array.isArray(value) || typeof value === 'object' ? JSON.stringify(value) : value}`)
            .join(' · ');
    }

    _humanize(s) {
        return String(s || '').replace(/_/g, ' ').replace(/([a-z])([A-Z])/g, '$1 $2');
    }

    _safeId(s) {
        return String(s || '').replace(/[^a-z0-9_-]+/gi, '-');
    }

    _escape(s) {
        if (s == null) return '';
        return String(s).replace(/[&<>"']/g, c => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]));
    }

    _escapeAttr(s) {
        return this._escape(s);
    }
}

window.TriggerUIBuilder = TriggerUIBuilder;
window.TRIGGER_CATALOG = TRIGGER_CATALOG;
