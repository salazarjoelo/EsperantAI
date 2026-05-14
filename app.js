/* ============================================================================
 * EsperantAI — Bootstrap (app.js)
 * Une todos los módulos: detector + adapters + platforms + trigger engine + UI.
 * ========================================================================== */

'use strict';

(async function bootstrap() {

    // ====== 1. i18n ======
    try {
        await window.i18n.load();
    } catch (e) {
        console.warn('i18n load failed, using fallback:', e);
    }
    window.i18n.applyToDom();
    populateLangSelector();

    // ====== 1.5. License check — lockout total si no hay license válida ======
    const lic = window.licenseManager;
    let licenseValid = lic.isValid();
    if (licenseValid) {
        // Re-validate online en background
        licenseValid = await lic.validate();
    }
    if (!licenseValid) {
        showLicenseLockout();
        return; // detiene bootstrap aquí. Sin license = sin app.
    }
    // License válida — programar revalidation cada 7 días
    lic.startBackgroundRevalidation();

    // ====== 2. DOM refs ======
    const DOM = {
        statusAi: document.getElementById('status-ai'),
        statusAdapter: document.getElementById('status-adapter'),
        statusDetection: document.getElementById('status-detection'),
        video: document.getElementById('video'),
        canvas: document.getElementById('overlay'),
        cameraSelect: document.getElementById('camera-select'),
        currentPoseMain: document.getElementById('current-pose-main'),
        currentPoseSub: document.getElementById('current-pose-sub'),
        m: {
            yaw: document.getElementById('m-yaw'),
            pitch: document.getElementById('m-pitch'),
            roll: document.getElementById('m-roll'),
            distance: document.getElementById('m-distance'),
            gaze: document.getElementById('m-gaze'),
            emotion: document.getElementById('m-emotion')
        },
        adapterType: document.getElementById('adapter-type'),
        adapterConfigArea: document.getElementById('adapter-config-area'),
        btnConnect: document.getElementById('btn-connect'),
        btnDisconnect: document.getElementById('btn-disconnect'),
        slidersArea: document.getElementById('sliders-area'),
        btnExport: document.getElementById('btn-export'),
        btnImport: document.getElementById('btn-import'),
        btnReset: document.getElementById('btn-reset'),
        importFile: document.getElementById('import-file')
    };

    // ====== 3. Singletons ======
    const config = window.configManager;
    const detector = new Detector(config);
    const triggerEngine = new TriggerEngine(config);
    let activeAdapter = null;
    let activePlatforms = {};

    // Trigger UI Builder — panel de mapeo gesto → escena (extrae escenas del adapter)
    const triggerMappingArea = document.getElementById('trigger-mapping-area');
    const triggerUI = new TriggerUIBuilder(triggerMappingArea, config, window.i18n);
    triggerUI.onCategoryToggle = async (category, enabled) => {
        // Si toggle gaze/emotion/blink/hand cambia, recargar modelo Human.js
        if (['gaze', 'emotion', 'blink', 'hand'].includes(category)) {
            await detector.reload();
        }
    };
    triggerUI.render();

    // ====== 4. Detector init ======
    detector.on('ai_loading', () => setStatusBadge(DOM.statusAi, 'warn', 'status.ai_loading'));
    detector.on('ai_ready', () => setStatusBadge(DOM.statusAi, 'ok', 'status.ai_ready'));
    detector.on('ai_error', () => setStatusBadge(DOM.statusAi, 'err', 'status.ai_error'));

    try {
        await detector.init(DOM.video, DOM.canvas);
    } catch (e) {
        console.error('Detector init failed:', e);
        setStatusBadge(DOM.statusAi, 'err', 'status.ai_error');
        return;
    }

    // ====== 5. Camera ======
    try {
        const stream = await detector.startCamera(config.get('cameraId'));
        await populateCameraList(stream);
    } catch (e) {
        console.error('Camera error:', e);
        // Mostrar inline en el badge de detección, NO alert modal
        setStatusBadge(DOM.statusDetection, 'err', 'errors.camera_denied');
    }

    // ====== 6. Detection loop ======
    detector.startLoop((result, frameCount) => {
        // Update metrics UI
        updateMetricsUI(result);

        // Run trigger engine
        const action = triggerEngine.process(result);
        if (action && action.type === 'action') {
            handleAction(action);
        }

        // Update pose text
        updatePoseText(result);
    });

    // ====== 7. Adapter UI binding ======
    DOM.adapterType.value = config.get('adapter.type', 'obs');
    renderAdapterConfigForm(DOM.adapterType.value);
    DOM.adapterType.addEventListener('change', () => {
        config.set('adapter.type', DOM.adapterType.value);
        renderAdapterConfigForm(DOM.adapterType.value);
    });

    DOM.btnConnect.addEventListener('click', connectAdapter);
    DOM.btnDisconnect.addEventListener('click', disconnectAdapter);

    // ====== 8. Sliders ======
    renderSliders();

    // ====== 9. Buttons (config) ======
    DOM.btnExport.addEventListener('click', () => {
        const data = config.export();
        const blob = new Blob([data], { type: 'application/json' });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `esperantai-config-${new Date().toISOString().slice(0,10)}.json`;
        a.click();
        URL.revokeObjectURL(url);
    });
    DOM.btnImport.addEventListener('click', () => DOM.importFile.click());
    DOM.importFile.addEventListener('change', (e) => {
        const file = e.target.files[0];
        if (!file) return;
        const reader = new FileReader();
        reader.onload = (ev) => {
            const ok = config.import(ev.target.result);
            if (ok) location.reload();
            else console.error('Import failed: invalid JSON');
        };
        reader.readAsText(file);
    });
    DOM.btnReset.addEventListener('click', () => {
        if (confirm(window.i18n.t('errors.reset_confirm'))) {
            config.reset();
            location.reload();
        }
    });

    // ====== 9.5. Platform OAuth buttons + postMessage handler ======
    setupPlatformAuth();

    // Recibir tokens del popup OAuth
    window.addEventListener('message', (event) => {
        // Solo aceptamos mensajes del mismo origin
        if (event.origin !== window.location.origin) return;
        const data = event.data || {};
        if (data.type === 'oauth_token') {
            handleOAuthToken(data);
        } else if (data.type === 'oauth_code') {
            handleOAuthCode(data);
        } else if (data.type === 'oauth_error') {
            console.warn(`OAuth error from ${data.provider}:`, data.error, data.errorDesc);
        }
    });

    // Si hay token pendiente de un popup que se desacopló, recogerlo
    const pending = localStorage.getItem('esperantai-oauth-pending');
    if (pending) {
        try {
            handleOAuthToken(JSON.parse(pending));
            localStorage.removeItem('esperantai-oauth-pending');
        } catch {}
    }

    // ====== 10. Keyboard shortcuts ======
    document.addEventListener('keydown', (e) => {
        if (['INPUT', 'SELECT', 'TEXTAREA'].includes(e.target.tagName)) return;
        switch (e.code) {
            case 'Space':
                e.preventDefault();
                detector.setPaused(!detector.isPaused);
                setStatusBadge(DOM.statusDetection,
                    detector.isPaused ? 'warn' : 'ok',
                    detector.isPaused ? 'status.detection_paused' : 'status.detection_active');
                break;
            case 'KeyC':
                if (activeAdapter?.isConnected()) {
                    const centerScene = config.get('scenes.center');
                    if (centerScene) activeAdapter.switchScene(centerScene);
                }
                break;
            case 'KeyR':
                if (activeAdapter?.isConnected()) activeAdapter.getScenes();
                break;
            case 'Escape':
                disconnectAdapter();
                break;
        }
    });

    // ====== Helper functions ======

    function setStatusBadge(el, klass, i18nKey) {
        el.className = `badge ${klass}`;
        el.textContent = window.i18n.t(i18nKey);
        el.dataset.i18n = i18nKey;
    }

    function populateLangSelector() {
        const sel = document.getElementById('lang-selector');
        const locales = window.i18n.getAvailableLocales();
        sel.innerHTML = locales.map(l =>
            `<option value="${l.code}" ${l.code === window.i18n.locale ? 'selected' : ''}>${l.name}</option>`
        ).join('');
        sel.addEventListener('change', async () => {
            await window.i18n.setLocale(sel.value);
            window.i18n.applyToDom();
        });
    }

    async function populateCameraList(activeStream) {
        const devices = await detector.listCameras();
        if (!devices.length) return;
        let activeId = activeStream?.getVideoTracks?.()[0]?.getSettings?.()?.deviceId;
        if (!activeId && config.get('cameraId')) activeId = config.get('cameraId');

        DOM.cameraSelect.innerHTML = devices.map((d, i) =>
            `<option value="${d.deviceId}">${d.label || `Camera ${i+1}`}</option>`
        ).join('');
        if (activeId) DOM.cameraSelect.value = activeId;

        if (devices.length <= 1) {
            DOM.cameraSelect.style.display = 'none';
        }

        DOM.cameraSelect.addEventListener('change', async () => {
            config.set('cameraId', DOM.cameraSelect.value);
            await detector.startCamera(DOM.cameraSelect.value);
        });
    }

    function renderAdapterConfigForm(type) {
        const area = DOM.adapterConfigArea;
        area.innerHTML = '';
        if (type === 'obs' || type === 'prism') {
            const cur = config.get(`adapter.${type}`, {});
            area.innerHTML = `
                <label>WebSocket URL</label>
                <input type="text" id="adapter-url" value="${cur.url || 'ws://127.0.0.1:4455'}">
                <label>Password</label>
                <input type="password" id="adapter-password" placeholder="${window.i18n.t('ui.password_placeholder')}" value="${cur.password || ''}">
            `;
        } else if (type === 'streamlabs') {
            const cur = config.get('adapter.streamlabs', {});
            area.innerHTML = `
                <label>API Token (from Streamlabs Settings → Remote Control)</label>
                <input type="password" id="adapter-token" value="${cur.token || ''}">
                <label>Port</label>
                <input type="text" id="adapter-port" value="${cur.port || 59650}">
            `;
        } else if (type === 'vmix') {
            const cur = config.get('adapter.vmix', {});
            area.innerHTML = `
                <label>Host</label>
                <input type="text" id="adapter-host" value="${cur.host || '127.0.0.1'}">
                <label>Port</label>
                <input type="text" id="adapter-port" value="${cur.port || 8088}">
            `;
        } else if (type === 'xsplit') {
            const cur = config.get('adapter.xsplit', {});
            area.innerHTML = `
                <label>Remote xjs Proxy URL</label>
                <input type="text" id="adapter-proxy-url" value="${cur.proxyUrl || 'ws://127.0.0.1:5555/xjs'}">
                <div class="hint" data-i18n="hints.xsplit_hint">Install "Remote xjs" extension in XSplit and enable Remote in preferences.</div>
            `;
        }
    }

    async function connectAdapter() {
        const type = DOM.adapterType.value;
        if (activeAdapter) await disconnectAdapter();

        if (type === 'obs' || type === 'prism') {
            activeAdapter = new AdapterOBS();
            const url = document.getElementById('adapter-url').value;
            const password = document.getElementById('adapter-password').value;
            config.set(`adapter.${type}.url`, url);
            if (config.get('savePassword')) config.set(`adapter.${type}.password`, password);
            wireAdapterEvents();
            const ok = await activeAdapter.connect({ url, password });
            if (!ok) setStatusBadge(DOM.statusAdapter, 'err', 'errors.obs_unreachable_short');
        } else if (type === 'streamlabs') {
            activeAdapter = new AdapterStreamlabs();
            const token = document.getElementById('adapter-token').value;
            const port = parseInt(document.getElementById('adapter-port').value, 10);
            config.set('adapter.streamlabs.token', token);
            wireAdapterEvents();
            const ok = await activeAdapter.connect({ token, port });
            if (!ok) setStatusBadge(DOM.statusAdapter, 'err', 'errors.obs_unreachable_short');
        } else if (type === 'vmix') {
            activeAdapter = new AdapterVMix();
            const host = document.getElementById('adapter-host').value;
            const port = parseInt(document.getElementById('adapter-port').value, 10);
            config.set('adapter.vmix.host', host);
            config.set('adapter.vmix.port', port);
            wireAdapterEvents();
            const ok = await activeAdapter.connect({ host, port });
            if (!ok) setStatusBadge(DOM.statusAdapter, 'err', 'errors.obs_unreachable_short');
        } else if (type === 'xsplit') {
            activeAdapter = new AdapterXSplit();
            const proxyUrl = document.getElementById('adapter-proxy-url').value;
            config.set('adapter.xsplit.proxyUrl', proxyUrl);
            wireAdapterEvents();
            const ok = await activeAdapter.connect({ proxyUrl });
            if (!ok) setStatusBadge(DOM.statusAdapter, 'err', 'errors.obs_unreachable_short');
        }
    }

    function wireAdapterEvents() {
        activeAdapter.on('connected', () => {
            setStatusBadge(DOM.statusAdapter, 'ok', 'status.obs_connected');
            triggerUI.setAdapterConnected(true);
        });
        activeAdapter.on('disconnected', () => {
            setStatusBadge(DOM.statusAdapter, 'err', 'status.obs_disconnected');
            triggerUI.setAdapterConnected(false);
        });
        activeAdapter.on('reconnecting', (attempt, max) => {
            DOM.statusAdapter.className = 'badge warn';
            DOM.statusAdapter.textContent = window.i18n.t('status.obs_reconnecting', { attempt, max });
        });
        activeAdapter.on('scene_list_changed', (scenes) => {
            console.log(`📡 ${activeAdapter.name}: ${scenes.length} scenes extraídas`);
            triggerUI.updateAvailableScenes(scenes);
        });
    }

    async function disconnectAdapter() {
        if (activeAdapter) {
            await activeAdapter.disconnect();
            activeAdapter = null;
        }
    }

    function renderSliders() {
        const fields = [
            { key: 'yaw', i18n: 'sensitivity.yaw', min: 0.05, max: 0.50, step: 0.01 },
            { key: 'pitchUp', i18n: 'sensitivity.pitch_up', min: -0.40, max: -0.05, step: 0.01 },
            { key: 'pitchDown', i18n: 'sensitivity.pitch_down', min: 0.05, max: 0.40, step: 0.01 },
            { key: 'roll', i18n: 'sensitivity.roll', min: 0.10, max: 0.50, step: 0.01 },
            { key: 'stableFrames', i18n: 'sensitivity.stable_frames', min: 1, max: 20, step: 1 },
            { key: 'cooldownMs', i18n: 'sensitivity.cooldown_ms', min: 200, max: 3000, step: 50 }
        ];
        DOM.slidersArea.innerHTML = fields.map(f => `
            <label data-i18n="${f.i18n}">${window.i18n.t(f.i18n)}</label>
            <div style="display:flex; gap:8px; align-items:center;">
                <input type="range" id="slider-${f.key}" min="${f.min}" max="${f.max}" step="${f.step}" value="${config.get('thresholds.' + f.key)}" style="flex:1; accent-color: var(--brand-1);">
                <span id="val-${f.key}" style="font-family:monospace; color:var(--brand-1); min-width:50px; text-align:right;">${config.get('thresholds.' + f.key)}</span>
            </div>
        `).join('');
        fields.forEach(f => {
            const sl = document.getElementById(`slider-${f.key}`);
            const val = document.getElementById(`val-${f.key}`);
            sl.addEventListener('input', () => {
                const v = parseFloat(sl.value);
                val.textContent = v;
                config.set(`thresholds.${f.key}`, v);
            });
        });
    }

    function updateMetricsUI(result) {
        if (!result?.face?.length) {
            ['yaw','pitch','roll','distance','gaze','emotion'].forEach(k => DOM.m[k].textContent = '—');
            return;
        }
        const face = result.face[0];
        const a = face.rotation?.angle || {};
        DOM.m.yaw.textContent = (a.yaw || 0).toFixed(2);
        DOM.m.pitch.textContent = (a.pitch || 0).toFixed(2);
        DOM.m.roll.textContent = (a.roll || 0).toFixed(2);
        if (face.box) DOM.m.distance.textContent = Math.round(Math.max(face.box[2], face.box[3])) + 'px';
        if (face.rotation?.gaze) {
            const { bearing, strength } = face.rotation.gaze;
            DOM.m.gaze.textContent = strength > 0.05 ? `${bearing.toFixed(2)} (${strength.toFixed(2)})` : 'centro';
        }
        if (face.emotion?.length) {
            const top = face.emotion.reduce((a,b) => (a.score > b.score ? a : b));
            DOM.m.emotion.textContent = `${top.emotion} (${(top.score*100).toFixed(0)}%)`;
        }
    }

    function updatePoseText(result) {
        if (!result?.face?.length) {
            DOM.currentPoseMain.textContent = window.i18n.t('status.searching_face');
            DOM.currentPoseSub.textContent = `frames=${detector.frameCount} · backend=${detector.backend()}`;
            return;
        }
        // El trigger engine ya tiene la lógica, mostrar trigger actual
        DOM.currentPoseMain.textContent = triggerEngine.lastTrigger || '⏺';
        DOM.currentPoseSub.textContent = '';
    }

    /**
     * Handler unificado: recibe el trigger detectado y ejecuta TODAS las
     * acciones configuradas para ese trigger via ActionEngine.
     * Soporta tanto formato legacy (scenes[trigger] = name) como nuevo
     * formato (triggerActions[trigger] = [...acciones]).
     */
    async function handleAction(action) {
        if (!action.trigger) return;
        const actions = config.getActionsForTrigger(action.trigger);
        if (!actions.length) {
            DOM.currentPoseSub.textContent = `${action.label} (sin acciones)`;
            return;
        }
        // Construir contexto del ActionEngine
        const ctx = {
            config,
            adapter: activeAdapter,
            platforms: activePlatforms,
            i18n: window.i18n
        };
        const engine = new ActionEngine(ctx);
        const results = await engine.execute(actions);
        const successCount = results.filter(r => r.success).length;
        DOM.currentPoseSub.textContent = `${action.label} → ${successCount}/${actions.length} ✓`;
    }

    // ====== Platform OAuth ======

    function setupPlatformAuth() {
        // Twitch
        const btnTwitch = document.getElementById('btn-twitch-connect');
        if (btnTwitch) {
            btnTwitch.addEventListener('click', () => {
                const clientId = document.getElementById('twitch-client-id').value.trim();
                if (!clientId) {
                    setStatusBadge(DOM.statusAdapter, 'warn', 'errors.missing_client_id');
                    return;
                }
                config.set('platforms.twitch.clientId', clientId);
                openOAuthPopup('twitch', clientId);
            });
        }
        // YouTube
        const btnYT = document.getElementById('btn-youtube-connect');
        if (btnYT) {
            btnYT.addEventListener('click', () => {
                const clientId = document.getElementById('youtube-client-id').value.trim();
                if (!clientId) return;
                config.set('platforms.youtube.clientId', clientId);
                openOAuthPopup('youtube', clientId);
            });
        }
        // Kick
        const btnKick = document.getElementById('btn-kick-connect');
        if (btnKick) {
            btnKick.addEventListener('click', async () => {
                const clientId = document.getElementById('kick-client-id').value.trim();
                if (!clientId) return;
                config.set('platforms.kick.clientId', clientId);
                await openOAuthPopup('kick', clientId);
            });
        }
        // StreamElements (manual token, no OAuth flow)
        const btnSE = document.getElementById('btn-se-connect');
        if (btnSE) {
            btnSE.addEventListener('click', async () => {
                const jwt = document.getElementById('se-jwt').value.trim();
                if (!jwt) return;
                await connectStreamElements(jwt);
            });
        }
    }

    async function openOAuthPopup(provider, clientId) {
        const redirectUri = `${window.location.origin}${window.location.pathname.replace(/index\.html?$/, '')}oauth-callback.html`;
        let authUrl;

        if (provider === 'twitch') {
            const platform = new PlatformTwitch();
            authUrl = platform.oauthUrl(clientId, redirectUri) + '&state=twitch';
        } else if (provider === 'youtube') {
            const platform = new PlatformYouTube();
            authUrl = platform.oauthUrl(clientId, redirectUri) + '&state=youtube';
        } else if (provider === 'kick') {
            const platform = new PlatformKick();
            // Kick usa async + PKCE
            activePlatforms.kick = platform; // guardar para usar code_verifier después
            authUrl = (await platform.oauthUrl(clientId, redirectUri)) + '&state=kick';
        }

        if (!authUrl) return;
        const popup = window.open(authUrl, 'esperantai_oauth', 'width=600,height=750');
        if (!popup) {
            console.warn('Popup blocked. Allow popups for esperantai.com');
        }
    }

    async function handleOAuthToken(data) {
        const { provider, access_token } = data;
        const clientId = config.get(`platforms.${provider}.clientId`);
        config.set(`platforms.${provider}.token`, access_token);
        config.set(`platforms.${provider}.enabled`, true);

        // Conectar el platform correspondiente
        let platform;
        if (provider === 'twitch') {
            platform = new PlatformTwitch();
        } else if (provider === 'youtube') {
            platform = new PlatformYouTube();
        } else if (provider === 'kick') {
            // Kick usa code, no token directo, pero por compatibilidad
            platform = activePlatforms.kick || new PlatformKick();
        }

        if (platform) {
            wirePlatformEvents(platform, provider);
            const ok = await platform.connect({ token: access_token, clientId });
            if (ok) {
                activePlatforms[provider] = platform;
                console.log(`✅ Connected to ${provider}`);
            } else {
                console.warn(`Failed to connect to ${provider}`);
            }
        }
    }

    async function handleOAuthCode(data) {
        const { provider, code } = data;
        if (provider === 'kick') {
            // Intercambiar code por token via PKCE
            const platform = activePlatforms.kick;
            if (!platform) return;
            try {
                const redirectUri = `${window.location.origin}${window.location.pathname.replace(/index\.html?$/, '')}oauth-callback.html`;
                const clientId = config.get('platforms.kick.clientId');
                const tokenData = await platform.exchangeCodeForToken(code, clientId, redirectUri);
                config.set('platforms.kick.token', tokenData.access_token);
                config.set('platforms.kick.enabled', true);
                wirePlatformEvents(platform, 'kick');
                await platform.connect({ token: tokenData.access_token, clientId });
                console.log('✅ Connected to Kick via PKCE');
            } catch (e) {
                console.error('Kick PKCE exchange failed:', e);
            }
        }
    }

    async function connectStreamElements(jwt) {
        config.set('platforms.streamelements.jwt', jwt);
        config.set('platforms.streamelements.enabled', true);
        const platform = new PlatformStreamElements();
        wirePlatformEvents(platform, 'streamelements');
        const ok = await platform.connect({ jwt });
        if (ok) activePlatforms.streamelements = platform;
    }

    function wirePlatformEvents(platform, providerName) {
        const eventTypes = platform.supportedEvents();
        for (const eventType of eventTypes) {
            platform.on(eventType, (data) => {
                console.log(`🔔 ${providerName} event:`, eventType, data);
                // Pasar al TriggerEngine para combo triggers
                const result = triggerEngine.handlePlatformEvent(eventType, data);
                if (result?.type === 'action') {
                    handleAction({ trigger: result.trigger || eventType, label: result.label });
                }
            });
        }
        platform.on('disconnected', () => {
            console.log(`🔌 ${providerName} disconnected`);
            delete activePlatforms[providerName];
        });
        platform.on('auth_error', (e) => {
            console.warn(`⚠️ ${providerName} auth error:`, e);
        });
    }

})().catch(err => {
    console.error('Bootstrap error:', err);
});

/* ============================================================================
 * License lockout — paywall UI cuando no hay license válida.
 * Función standalone, fuera del IIFE de bootstrap.
 * ========================================================================== */

function showLicenseLockout() {
    const lic = window.licenseManager;
    const t = window.i18n ? (k, fb) => window.i18n.t(k, {}, fb) : (k, fb) => fb || k;

    const wrap = document.createElement('div');
    wrap.id = 'license-lockout';
    wrap.style.cssText = `
        position: fixed; inset: 0;
        background: rgba(13,17,23,0.97);
        backdrop-filter: blur(10px);
        z-index: 100000;
        display: flex; align-items: center; justify-content: center;
        padding: 20px;
        font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
        color: #c9d1d9;
    `;
    wrap.innerHTML = `
        <div style="max-width: 480px; width: 100%; background: #161b22; border: 1px solid #30363d; border-radius: 16px; padding: 32px; box-shadow: 0 20px 60px rgba(0,0,0,0.5);">
            <div style="text-align: center; margin-bottom: 24px;">
                <img src="assets/branding/logo.svg" alt="EsperantAI" style="width: 72px; height: 72px; margin-bottom: 12px;">
                <h1 style="margin: 0; font-size: 2em; background: linear-gradient(135deg, #58a6ff, #bc8cff, #ff7b72); -webkit-background-clip: text; background-clip: text; color: transparent; letter-spacing: -1px;">EsperantAI</h1>
                <p style="margin: 4px 0 0 0; color: #8b949e; font-style: italic;">${t('app.tagline', 'Los gestos honestos.')}</p>
            </div>

            <div style="background: #1c2128; border-radius: 8px; padding: 16px; margin-bottom: 20px; border-left: 3px solid #58a6ff;">
                <p style="margin: 0 0 12px 0; font-size: 14px; line-height: 1.5;">
                    <strong>${t('license.required_title', 'Activación requerida')}</strong>
                </p>
                <p style="margin: 0; font-size: 13px; color: #8b949e; line-height: 1.5;">
                    ${t('license.required_desc', 'EsperantAI requiere una licencia válida para funcionar. Si ya compraste, pega tu license key abajo. Si no, adquiérela en esperantai.com')}
                </p>
            </div>

            <label style="display: block; font-size: 12px; color: #8b949e; margin-bottom: 6px;">
                ${t('license.key_label', 'License Key')}
            </label>
            <input
                type="text"
                id="license-key-input"
                placeholder="XXXX-XXXX-XXXX-XXXX-XXXX"
                autocomplete="off"
                spellcheck="false"
                style="width: 100%; padding: 12px; border-radius: 8px; border: 1px solid #30363d; background: #0d1117; color: #c9d1d9; font-family: 'Consolas', monospace; font-size: 14px; outline: none; box-sizing: border-box; text-transform: uppercase;"
            >

            <div id="license-error" style="display:none; margin-top: 12px; padding: 10px 12px; background: rgba(218,54,51,0.1); border-left: 3px solid #da3633; border-radius: 4px; font-size: 12px; color: #ff7b72;"></div>

            <button id="btn-activate-license" style="width: 100%; margin-top: 16px; padding: 12px; border: none; border-radius: 8px; background: linear-gradient(135deg, #58a6ff, #bc8cff, #ff7b72); color: #0d1117; font-weight: 700; font-size: 14px; cursor: pointer;">
                ${t('license.activate_button', 'Activar licencia')}
            </button>

            <div style="text-align: center; margin-top: 20px; padding-top: 20px; border-top: 1px solid #30363d;">
                <p style="margin: 0 0 8px 0; font-size: 13px; color: #8b949e;">
                    ${t('license.no_license', '¿Aún no tienes licencia?')}
                </p>
                <a id="btn-buy-license" href="landing.html" style="display: inline-block; padding: 10px 20px; border: 1px solid #58a6ff; border-radius: 8px; color: #58a6ff; text-decoration: none; font-weight: 600; font-size: 13px;">
                    ${t('license.buy_button', 'Adquirir EsperantAI')}
                </a>
            </div>

            <p style="text-align: center; margin: 16px 0 0 0; font-size: 11px; color: #6e7681;">
                © 2026 EdugameDigital · <a href="docs/EULA.html" style="color: #6e7681;">EULA</a> · <a href="docs/TERMS_OF_SERVICE.html" style="color: #6e7681;">ToS</a> · <a href="docs/PRIVACY.html" style="color: #6e7681;">Privacy</a> · <a href="docs/COOKIE_POLICY.html" style="color: #6e7681;">Cookies</a> · <a href="docs/THIRD_PARTY_LICENSES.html" style="color: #6e7681;">OSS</a>
            </p>
        </div>
    `;
    document.body.appendChild(wrap);

    const input = wrap.querySelector('#license-key-input');
    const btn = wrap.querySelector('#btn-activate-license');
    const errBox = wrap.querySelector('#license-error');
    const buyBtn = wrap.querySelector('#btn-buy-license');

    buyBtn.addEventListener('click', (e) => {
        e.preventDefault();
        // Abrir landing en nueva pestaña sin perder el modal
        window.open('landing.html', '_blank');
    });

    btn.addEventListener('click', async () => {
        const key = input.value.trim();
        if (!key) {
            showErr('License key vacía');
            return;
        }
        btn.disabled = true;
        btn.textContent = '...';
        errBox.style.display = 'none';
        const result = await window.licenseManager.activate(key);
        if (result.ok) {
            // Recargar la app para arrancar con license válida
            location.reload();
        } else {
            showErr(result.error || 'Activation failed');
            btn.disabled = false;
            btn.textContent = window.i18n ? window.i18n.t('license.activate_button', {}, 'Activar licencia') : 'Activar licencia';
        }
    });

    input.addEventListener('keydown', (e) => {
        if (e.key === 'Enter') btn.click();
    });

    function showErr(msg) {
        errBox.textContent = msg;
        errBox.style.display = 'block';
    }
}
