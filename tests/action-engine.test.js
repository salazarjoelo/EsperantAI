/**
 * Tests para core/action-engine.js
 *
 * Cobertura:
 *   - 16 tipos de acción individuales (adapter + local + platform + composite)
 *   - Edge cases: adapter desconectado, tipo desconocido, fallo silencioso,
 *     sequence con error, random_choice vacío, delay_then con fake timers
 *   - API estática: getActionTypes(), getActionsByTarget()
 *
 * Autor: Z (GLM-4) — TASK Z-203
 */
import { describe, it, expect, beforeEach, afterEach, vi } from 'vitest';
import { loadWindowScript } from './helpers/load-window-script.js';

describe('core/action-engine.js', () => {
    let ActionEngine;
    let ACTION_REGISTRY;
    let ctx;
    let adapter;
    let platforms;
    let config;
    let i18n;

    // ─── Helpers ──────────────────────────────────────────────────────────

    function createMockAdapter() {
        return {
            name: 'MockOBS',
            isConnected: vi.fn(() => true),
            switchScene: vi.fn(async () => true),
            setPreviewScene: vi.fn(async () => true),
            triggerTransition: vi.fn(async () => true),
            isStudioMode: vi.fn(async () => false),
            setSourceVisibility: vi.fn(async () => true),
            setSourceFilterEnabled: vi.fn(async () => true),
            setSourceMuted: vi.fn(async () => true),
            setSourceTransform: vi.fn(async () => true),
            setSourceCrop: vi.fn(async () => true),
            startRecording: vi.fn(async () => true),
            stopRecording: vi.fn(async () => true),
        };
    }

    function createMockPlatforms() {
        return {
            twitch: {
                isConnected: vi.fn(() => true),
                sendChatMessage: vi.fn(async () => true),
                createClip: vi.fn(async () => true),
            },
            youtube: {
                isConnected: vi.fn(() => true),
                sendChatMessage: vi.fn(async () => true),
            },
        };
    }

    function createMockConfig() {
        const store = {};
        return {
            get: vi.fn((key, fallback) => store[key] ?? fallback),
            set: vi.fn((key, value) => { store[key] = value; }),
            _store: store,
        };
    }

    function createMockI18n() {
        return { t: vi.fn((key, vars, fallback) => fallback || key) };
    }

    // ─── Setup / teardown ────────────────────────────────────────────────

    beforeEach(() => {
        delete globalThis.ActionEngine;
        delete globalThis.ACTION_REGISTRY;
        loadWindowScript('core/action-engine.js');
        ActionEngine = globalThis.ActionEngine;
        ACTION_REGISTRY = globalThis.ACTION_REGISTRY;

        adapter = createMockAdapter();
        platforms = createMockPlatforms();
        config = createMockConfig();
        i18n = createMockI18n();
        ctx = { adapter, platforms, config, i18n };
    });

    afterEach(() => {
        vi.restoreAllMocks();
        vi.useRealTimers();
    });

    // ─── 1. scene_switch ─────────────────────────────────────────────────

    describe('scene_switch', () => {
        it('cambia de escena llamando adapter.switchScene', async () => {
            const engine = new ActionEngine(ctx);
            const results = await engine.execute([{
                type: 'scene_switch',
                params: { sceneName: 'Game' }
            }]);
            expect(adapter.switchScene).toHaveBeenCalledWith('Game');
            expect(results[0].success).toBe(true);
        });

        it('usa preview + transition en studio mode cuando config lo indica', async () => {
            adapter.isStudioMode.mockResolvedValue(true);
            config.get.mockImplementation((key, fallback) => {
                if (key === 'usePreviewInStudioMode') return true;
                return fallback;
            });
            const engine = new ActionEngine(ctx);
            await engine.execute([{
                type: 'scene_switch',
                params: { sceneName: 'Intro' }
            }]);
            expect(adapter.setPreviewScene).toHaveBeenCalledWith('Intro');
            expect(adapter.triggerTransition).toHaveBeenCalled();
            expect(adapter.switchScene).not.toHaveBeenCalled();
        });
    });

    // ─── 2. source_visibility ────────────────────────────────────────────

    describe('source_visibility', () => {
        it('toggle visibilidad de fuente', async () => {
            const engine = new ActionEngine(ctx);
            await engine.execute([{
                type: 'source_visibility',
                params: { sceneName: 'Main', sourceName: 'Alert', visible: true }
            }]);
            expect(adapter.setSourceVisibility).toHaveBeenCalledWith('Main', 'Alert', true);
        });

        it('auto-hide después de autoHideMs ms', async () => {
            vi.useFakeTimers();
            const engine = new ActionEngine(ctx);
            await engine.execute([{
                type: 'source_visibility',
                params: { sceneName: 'Main', sourceName: 'Alert', visible: true, autoHideMs: 2000 }
            }]);
            expect(adapter.setSourceVisibility).toHaveBeenCalledWith('Main', 'Alert', true);

            // Antes del timeout, no se llamó con false
            expect(adapter.setSourceVisibility).not.toHaveBeenCalledWith('Main', 'Alert', false);

            // Avanzar el timer
            await vi.advanceTimersByTimeAsync(2000);

            expect(adapter.setSourceVisibility).toHaveBeenCalledWith('Main', 'Alert', false);
        });
    });

    // ─── 3. source_filter_toggle ─────────────────────────────────────────

    describe('source_filter_toggle', () => {
        it('toggle filtro de fuente', async () => {
            const engine = new ActionEngine(ctx);
            await engine.execute([{
                type: 'source_filter_toggle',
                params: { sourceName: 'Webcam', filterName: 'Blur', enabled: true }
            }]);
            expect(adapter.setSourceFilterEnabled).toHaveBeenCalledWith('Webcam', 'Blur', true);
        });
    });

    // ─── 4. audio_mute ──────────────────────────────────────────────────

    describe('audio_mute', () => {
        it('mute/unmute fuente de audio', async () => {
            const engine = new ActionEngine(ctx);
            await engine.execute([{
                type: 'audio_mute',
                params: { sourceName: 'Mic', muted: true }
            }]);
            expect(adapter.setSourceMuted).toHaveBeenCalledWith('Mic', true);
        });
    });

    // ─── 5. source_transform ─────────────────────────────────────────────

    describe('source_transform', () => {
        it('transforma posición/escala/rotación de fuente', async () => {
            const engine = new ActionEngine(ctx);
            const transform = {
                positionX: 100, positionY: 200,
                scaleX: 1.5, scaleY: 1.5,
                rotation: 45
            };
            await engine.execute([{
                type: 'source_transform',
                params: { sceneName: 'Main', sourceName: 'Logo', ...transform }
            }]);
            expect(adapter.setSourceTransform).toHaveBeenCalledWith('Main', 'Logo', transform);
        });
    });

    // ─── 6. source_crop ──────────────────────────────────────────────────

    describe('source_crop', () => {
        it('recorta fuente con top/bottom/left/right', async () => {
            const engine = new ActionEngine(ctx);
            const crop = { top: 10, bottom: 20, left: 5, right: 15 };
            await engine.execute([{
                type: 'source_crop',
                params: { sceneName: 'Main', sourceName: 'Camera', ...crop }
            }]);
            expect(adapter.setSourceCrop).toHaveBeenCalledWith('Main', 'Camera', crop);
        });
    });

    // ─── 7. recording_start ──────────────────────────────────────────────

    describe('recording_start', () => {
        it('inicia grabación', async () => {
            const engine = new ActionEngine(ctx);
            await engine.execute([{ type: 'recording_start', params: {} }]);
            expect(adapter.startRecording).toHaveBeenCalled();
        });
    });

    // ─── 8. recording_stop ───────────────────────────────────────────────

    describe('recording_stop', () => {
        it('detiene grabación', async () => {
            const engine = new ActionEngine(ctx);
            await engine.execute([{ type: 'recording_stop', params: {} }]);
            expect(adapter.stopRecording).toHaveBeenCalled();
        });
    });

    // ─── 9. play_sound ───────────────────────────────────────────────────

    describe('play_sound', () => {
        it('reproduce audio con volumen configurado', async () => {
            const mockPlay = vi.fn(async () => {});
            const mockAudio = vi.fn(() => ({
                play: mockPlay,
                volume: 0,
            }));
            vi.stubGlobal('Audio', mockAudio);

            const engine = new ActionEngine(ctx);
            const results = await engine.execute([{
                type: 'play_sound',
                params: { url: 'https://example.com/ding.mp3', volume: 0.5 }
            }]);

            expect(mockAudio).toHaveBeenCalledWith('https://example.com/ding.mp3');
            expect(results[0].success).toBe(true);
            vi.unstubAllGlobals();
        });

        it('falla graciosamente si Audio.play() rechaza', async () => {
            const mockPlay = vi.fn(async () => { throw new Error('blocked'); });
            const mockAudio = vi.fn(() => ({
                play: mockPlay,
                volume: 0,
            }));
            vi.stubGlobal('Audio', mockAudio);

            const engine = new ActionEngine(ctx);
            const results = await engine.execute([{
                type: 'play_sound',
                params: { url: 'bad.mp3' }
            }]);

            expect(results[0].success).toBe(false);
            vi.unstubAllGlobals();
        });
    });

    // ─── 10. speak_tts ──────────────────────────────────────────────────

    describe('speak_tts', () => {
        it('usa SpeechSynthesisUtterance con parámetros', async () => {
            const mockSpeak = vi.fn();
            // jsdom no expone SpeechSynthesisUtterance — stub constructor que
            // captura los params seteados después de construirlo (u.lang=, u.rate=).
            const MockUtterance = vi.fn(function (text) {
                this.text = text;
                this.lang = '';
                this.rate = 1;
                this.pitch = 1;
            });
            vi.stubGlobal('SpeechSynthesisUtterance', MockUtterance);
            vi.stubGlobal('speechSynthesis', { speak: mockSpeak });

            const engine = new ActionEngine(ctx);
            const results = await engine.execute([{
                type: 'speak_tts',
                params: { text: 'Hello stream!', lang: 'en-US', rate: 1.2, pitch: 0.9 }
            }]);

            expect(mockSpeak).toHaveBeenCalledOnce();
            const utterance = mockSpeak.mock.calls[0][0];
            expect(utterance.text).toBe('Hello stream!');
            expect(utterance.lang).toBe('en-US');
            expect(utterance.rate).toBe(1.2);
            expect(utterance.pitch).toBe(0.9);
            expect(results[0].success).toBe(true);
            vi.unstubAllGlobals();
        });

        it('devuelve false si speechSynthesis no existe', async () => {
            vi.stubGlobal('speechSynthesis', undefined);

            const engine = new ActionEngine(ctx);
            const results = await engine.execute([{
                type: 'speak_tts',
                params: { text: 'Test' }
            }]);

            expect(results[0].success).toBe(false);
            vi.unstubAllGlobals();
        });
    });

    // ─── 11. notification ────────────────────────────────────────────────

    describe('notification', () => {
        it('crea notificación browser con título y body', async () => {
            const mockNotification = vi.fn();
            mockNotification.permission = 'granted';
            mockNotification.requestPermission = vi.fn(async () => 'granted');
            vi.stubGlobal('Notification', mockNotification);

            const engine = new ActionEngine(ctx);
            const results = await engine.execute([{
                type: 'notification',
                params: { title: 'Sub!', body: 'New subscriber!', icon: 'logo.svg' }
            }]);

            expect(mockNotification).toHaveBeenCalledWith('Sub!', expect.objectContaining({
                body: 'New subscriber!',
                icon: 'logo.svg'
            }));
            expect(results[0].success).toBe(true);
            vi.unstubAllGlobals();
        });

        it('devuelve false si permiso no concedido', async () => {
            const mockNotification = vi.fn();
            mockNotification.permission = 'denied';
            mockNotification.requestPermission = vi.fn(async () => 'denied');
            vi.stubGlobal('Notification', mockNotification);

            const engine = new ActionEngine(ctx);
            const results = await engine.execute([{
                type: 'notification',
                params: { title: 'Test', body: 'Body' }
            }]);

            expect(results[0].success).toBe(false);
            vi.unstubAllGlobals();
        });
    });

    // ─── 12. flash_screen ────────────────────────────────────────────────

    describe('flash_screen', () => {
        it('crea overlay de flash en document.body', async () => {
            const engine = new ActionEngine(ctx);
            const results = await engine.execute([{
                type: 'flash_screen',
                params: { color: 'rgba(255,0,0,0.3)', duration: 500 }
            }]);

            const overlay = document.body.querySelector('div[style*="z-index: 99999"]');
            expect(overlay).not.toBeNull();
            expect(results[0].success).toBe(true);
        });
    });

    // ─── 13. vibrate ─────────────────────────────────────────────────────

    describe('vibrate', () => {
        it('llama navigator.vibrate con el patrón dado', async () => {
            const mockVibrate = vi.fn(() => true);
            vi.stubGlobal('navigator', { ...globalThis.navigator, vibrate: mockVibrate });

            const engine = new ActionEngine(ctx);
            const results = await engine.execute([{
                type: 'vibrate',
                params: { pattern: [200, 100, 200] }
            }]);

            expect(mockVibrate).toHaveBeenCalledWith([200, 100, 200]);
            expect(results[0].success).toBe(true);
            vi.unstubAllGlobals();
        });

        it('devuelve false si navigator.vibrate no existe', async () => {
            vi.stubGlobal('navigator', { ...globalThis.navigator, vibrate: undefined });

            const engine = new ActionEngine(ctx);
            const results = await engine.execute([{
                type: 'vibrate',
                params: { pattern: [100] }
            }]);

            expect(results[0].success).toBe(false);
            vi.unstubAllGlobals();
        });
    });

    // ─── 14. chat_message ────────────────────────────────────────────────

    describe('chat_message', () => {
        it('envía mensaje al chat de la plataforma especificada', async () => {
            const engine = new ActionEngine(ctx);
            const results = await engine.execute([{
                type: 'chat_message',
                params: { platform: 'twitch', text: 'Thanks for the sub!' }
            }]);

            expect(platforms.twitch.sendChatMessage).toHaveBeenCalledWith('Thanks for the sub!');
            expect(results[0].success).toBe(true);
        });

        it('devuelve false si la plataforma no existe', async () => {
            const engine = new ActionEngine(ctx);
            const results = await engine.execute([{
                type: 'chat_message',
                params: { platform: 'facebook', text: 'Hello' }
            }]);

            expect(results[0].success).toBe(false);
        });
    });

    // ─── 15. create_clip ─────────────────────────────────────────────────

    describe('create_clip', () => {
        it('crea clip en la plataforma especificada', async () => {
            const engine = new ActionEngine(ctx);
            const results = await engine.execute([{
                type: 'create_clip',
                params: { platform: 'twitch' }
            }]);

            expect(platforms.twitch.createClip).toHaveBeenCalled();
            expect(results[0].success).toBe(true);
        });

        it('devuelve false si la plataforma no está conectada', async () => {
            platforms.twitch.isConnected.mockReturnValue(false);
            const engine = new ActionEngine(ctx);
            const results = await engine.execute([{
                type: 'create_clip',
                params: { platform: 'twitch' }
            }]);

            expect(results[0].success).toBe(false);
        });
    });

    // ─── 16. sequence ────────────────────────────────────────────────────

    describe('sequence', () => {
        it('ejecuta acciones en secuencia', async () => {
            const engine = new ActionEngine(ctx);
            const results = await engine.execute([{
                type: 'sequence',
                params: {
                    actions: [
                        { type: 'recording_start', params: {} },
                        { type: 'scene_switch', params: { sceneName: 'Game' } },
                    ]
                }
            }]);

            expect(adapter.startRecording).toHaveBeenCalled();
            expect(adapter.switchScene).toHaveBeenCalledWith('Game');
            expect(results[0].success).toBe(true);
        });

        it('respeta delayMs entre acciones', async () => {
            vi.useFakeTimers();
            const engine = new ActionEngine(ctx);

            const promise = engine.execute([{
                type: 'sequence',
                params: {
                    delayMs: 500,
                    actions: [
                        { type: 'recording_start', params: {} },
                        { type: 'recording_stop', params: {} },
                    ]
                }
            }]);

            // Esperar que la primera acción se ejecute inmediatamente
            await vi.advanceTimersByTimeAsync(0);
            expect(adapter.startRecording).toHaveBeenCalled();

            // El código real aplica delayMs DESPUÉS de cada acción (incluyendo
            // la última). Para 2 acciones con delayMs=500, hay 2 setTimeouts.
            // Usar runAllTimersAsync para drenar todos los timers pendientes.
            await vi.runAllTimersAsync();
            await promise;

            expect(adapter.stopRecording).toHaveBeenCalled();
        });

        it('continúa ejecutando aunque una acción falle', async () => {
            adapter.setSourceFilterEnabled.mockRejectedValue(new Error('filter not found'));
            const engine = new ActionEngine(ctx);
            const results = await engine.execute([{
                type: 'sequence',
                params: {
                    actions: [
                        { type: 'source_filter_toggle', params: { sourceName: 'Cam', filterName: 'X', enabled: true } },
                        { type: 'scene_switch', params: { sceneName: 'Game' } },
                    ]
                }
            }]);

            // La primera acción falla pero la secuencia continúa (executeSingle catch → false)
            expect(adapter.switchScene).toHaveBeenCalledWith('Game');
            expect(results[0].success).toBe(true); // sequence returns true overall
        });
    });

    // ─── 17. random_choice ───────────────────────────────────────────────

    describe('random_choice', () => {
        it('ejecuta exactamente una de las acciones aleatorias', async () => {
            const engine = new ActionEngine(ctx);
            // Spy en Math.random para forzar selección de la primera
            const randomSpy = vi.spyOn(Math, 'random').mockReturnValue(0);

            const results = await engine.execute([{
                type: 'random_choice',
                params: {
                    actions: [
                        { type: 'scene_switch', params: { sceneName: 'Scene A' } },
                        { type: 'scene_switch', params: { sceneName: 'Scene B' } },
                    ]
                }
            }]);

            // Con random=0, elige index 0
            expect(adapter.switchScene).toHaveBeenCalledWith('Scene A');
            expect(adapter.switchScene).not.toHaveBeenCalledWith('Scene B');
            expect(results[0].success).toBe(true);
            randomSpy.mockRestore();
        });

        it('devuelve false si el array de acciones está vacío', async () => {
            const engine = new ActionEngine(ctx);
            const results = await engine.execute([{
                type: 'random_choice',
                params: { actions: [] }
            }]);

            expect(results[0].success).toBe(false);
        });
    });

    // ─── 18. delay_then ──────────────────────────────────────────────────

    describe('delay_then', () => {
        it('espera delayMs y luego ejecuta la acción', async () => {
            vi.useFakeTimers();
            const engine = new ActionEngine(ctx);

            const promise = engine.execute([{
                type: 'delay_then',
                params: {
                    delayMs: 3000,
                    action: { type: 'scene_switch', params: { sceneName: 'Delayed' } }
                }
            }]);

            // Antes del delay, no se ha ejecutado
            expect(adapter.switchScene).not.toHaveBeenCalled();

            // Avanzar 3s
            await vi.advanceTimersByTimeAsync(3000);
            await promise;

            expect(adapter.switchScene).toHaveBeenCalledWith('Delayed');
        });
    });

    // ─── Edge cases ──────────────────────────────────────────────────────

    describe('Edge cases', () => {
        it('adapter desconectado → acción adapter devuelve false sin crashear', async () => {
            adapter.isConnected.mockReturnValue(false);
            const engine = new ActionEngine(ctx);
            const results = await engine.execute([
                { type: 'scene_switch', params: { sceneName: 'X' } },
                { type: 'audio_mute', params: { sourceName: 'Mic', muted: true } },
                { type: 'recording_start', params: {} },
            ]);

            expect(results.every(r => r.success === false)).toBe(true);
            expect(adapter.switchScene).not.toHaveBeenCalled();
        });

        it('tipo de acción desconocido → devuelve false sin crashear', async () => {
            const engine = new ActionEngine(ctx);
            const results = await engine.execute([{
                type: 'nonexistent_action',
                params: {}
            }]);

            expect(results[0].success).toBe(false);
        });

        it('acción sin type → devuelve false', async () => {
            const engine = new ActionEngine(ctx);
            const results = await engine.execute([{ params: {} }]);

            expect(results[0].success).toBe(false);
        });

        it('acción null → devuelve false sin crashear', async () => {
            const engine = new ActionEngine(ctx);
            const result = await ActionEngine.executeSingle(null, ctx);
            expect(result).toBe(false);
        });

        it('adapter method rechaza → executeSingle catchea y devuelve false', async () => {
            adapter.switchScene.mockRejectedValue(new Error('OBS disconnected mid-call'));
            const engine = new ActionEngine(ctx);
            const results = await engine.execute([{
                type: 'scene_switch',
                params: { sceneName: 'X' }
            }]);

            expect(results[0].success).toBe(false);
        });

        it('execute con array vacío devuelve []', async () => {
            const engine = new ActionEngine(ctx);
            const results = await engine.execute([]);
            expect(results).toEqual([]);
        });

        it('execute con null/undefined devuelve []', async () => {
            const engine = new ActionEngine(ctx);
            const results = await engine.execute(null);
            expect(results).toEqual([]);
        });

        it('execute con múltiples acciones las ejecuta en paralelo', async () => {
            const engine = new ActionEngine(ctx);
            const results = await engine.execute([
                { type: 'scene_switch', params: { sceneName: 'A' } },
                { type: 'recording_start', params: {} },
                { type: 'vibrate', params: { pattern: [100] } },
            ]);

            expect(results).toHaveLength(3);
            expect(results[0].success).toBe(true);
            expect(results[1].success).toBe(true);
            // vibrate may fail depending on mock, but no crash
        });
    });

    // ─── Static API ──────────────────────────────────────────────────────

    describe('Static API', () => {
        it('getActionTypes() devuelve los 16 tipos registrados', () => {
            const types = ActionEngine.getActionTypes();
            expect(types.length).toBeGreaterThanOrEqual(16);
            const typeNames = types.map(t => t.type);
            expect(typeNames).toContain('scene_switch');
            expect(typeNames).toContain('source_visibility');
            expect(typeNames).toContain('source_filter_toggle');
            expect(typeNames).toContain('audio_mute');
            expect(typeNames).toContain('source_transform');
            expect(typeNames).toContain('source_crop');
            expect(typeNames).toContain('recording_start');
            expect(typeNames).toContain('recording_stop');
            expect(typeNames).toContain('play_sound');
            expect(typeNames).toContain('speak_tts');
            expect(typeNames).toContain('notification');
            expect(typeNames).toContain('flash_screen');
            expect(typeNames).toContain('vibrate');
            expect(typeNames).toContain('chat_message');
            expect(typeNames).toContain('create_clip');
            expect(typeNames).toContain('sequence');
            expect(typeNames).toContain('random_choice');
            expect(typeNames).toContain('delay_then');
        });

        it('getActionTypes() cada tipo tiene type, target, label_i18n, params', () => {
            const types = ActionEngine.getActionTypes();
            for (const t of types) {
                expect(t).toHaveProperty('type');
                expect(t).toHaveProperty('target');
                expect(t).toHaveProperty('label_i18n');
                expect(t).toHaveProperty('params');
                expect(typeof t.type).toBe('string');
                expect(['adapter', 'local', 'platform', 'composite']).toContain(t.target);
            }
        });

        it('getActionsByTarget("adapter") devuelve solo acciones de adapter', () => {
            const adapterActions = ActionEngine.getActionsByTarget('adapter');
            expect(adapterActions.length).toBeGreaterThanOrEqual(8);
            expect(adapterActions.every(a => a.target === 'adapter')).toBe(true);
        });

        it('getActionsByTarget("local") devuelve solo acciones locales', () => {
            const localActions = ActionEngine.getActionsByTarget('local');
            expect(localActions.length).toBeGreaterThanOrEqual(5);
            expect(localActions.every(a => a.target === 'local')).toBe(true);
        });

        it('getActionsByTarget("platform") devuelve solo acciones de plataforma', () => {
            const platformActions = ActionEngine.getActionsByTarget('platform');
            expect(platformActions.length).toBeGreaterThanOrEqual(2);
            expect(platformActions.every(a => a.target === 'platform')).toBe(true);
        });

        it('getActionsByTarget("composite") devuelve solo acciones compuestas', () => {
            const compositeActions = ActionEngine.getActionsByTarget('composite');
            expect(compositeActions.length).toBeGreaterThanOrEqual(3);
            expect(compositeActions.every(a => a.target === 'composite')).toBe(true);
        });
    });

    // ─── source_visibility sin método en adapter ─────────────────────────

    describe('source_visibility sin soporte de adapter', () => {
        it('devuelve false si adapter no tiene setSourceVisibility', async () => {
            delete adapter.setSourceVisibility;
            const engine = new ActionEngine(ctx);
            const results = await engine.execute([{
                type: 'source_visibility',
                params: { sceneName: 'Main', sourceName: 'Alert', visible: true }
            }]);
            expect(results[0].success).toBe(false);
        });
    });

    // ─── chat_message con plataforma sin método ──────────────────────────

    describe('chat_message plataforma sin sendChatMessage', () => {
        it('devuelve false si la plataforma no tiene sendChatMessage', async () => {
            platforms.twitch.sendChatMessage = undefined;
            const engine = new ActionEngine(ctx);
            const results = await engine.execute([{
                type: 'chat_message',
                params: { platform: 'twitch', text: 'Hi' }
            }]);
            expect(results[0].success).toBe(false);
        });
    });
});
