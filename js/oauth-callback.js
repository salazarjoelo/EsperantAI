/* EsperantAI — Script del callback OAuth.
 *
 * Extraído de oauth-callback.html (era inline) para TASK-105 CSP hardening
 * Fase 1. No cambios funcionales; solo movido de inline a externo.
 *
 * Procesa el callback de Twitch / YouTube / Kick / Trovo OAuth:
 *   1. Parsea fragment (Implicit Grant) y query string (Authorization Code)
 *   2. Valida que state tenga formato <provider>:<nonce> (anti-CSRF)
 *   3. postMessage al opener con access_token o code
 *   4. Fallback a localStorage si no hay opener (popup desacoplado)
 *
 * Triggered en DOMContentLoaded para asegurar que el DOM esté listo.
 */
'use strict';

(function () {
    function init() {
        const status = document.getElementById('status');
        const manual = document.getElementById('manual');
        const btnClose = document.getElementById('btn-close-window');

        // Wire del botón "Cerrar ventana" (reemplaza onclick inline)
        if (btnClose) {
            btnClose.addEventListener('click', function () {
                window.close();
            });
        }

        // Parse de tokens del fragment URL (OAuth Implicit Grant)
        const fragment = window.location.hash.substring(1);
        const params = new URLSearchParams(fragment);

        // También parse de query string (para Authorization Code flow ej. Kick PKCE)
        const queryParams = new URLSearchParams(window.location.search);

        // Parse del state — formato: <provider>:<nonce> (validado por el opener)
        const state = params.get('state') || queryParams.get('state') || '';
        const provider = detectProvider(state);

        // Si no hay state válido, mostrar error y NO postear nada
        if (!state || !state.includes(':')) {
            status.className = 'err';
            status.textContent = '❌ Error de seguridad: state OAuth inválido (posible CSRF)';
            manual.hidden = false;
            return;
        }

        const token = params.get('access_token');
        const code = queryParams.get('code'); // Para flows con Authorization Code
        const error = params.get('error') || queryParams.get('error');
        const errorDesc = params.get('error_description') || queryParams.get('error_description');

        if (error) {
            status.className = 'err';
            status.textContent = '❌ Error: ' + error + (errorDesc ? ' — ' + errorDesc : '');
            manual.hidden = false;
            postToOpener({ type: 'oauth_error', provider: provider, error: error, errorDesc: errorDesc });
            return;
        }

        if (token) {
            status.className = 'ok';
            status.textContent = '✓ Conectado a ' + (provider || 'plataforma') + '. Cerrando ventana…';
            const expiresIn = parseInt(params.get('expires_in') || '0', 10);
            postToOpener({
                type: 'oauth_token',
                provider: provider,
                state: state,
                access_token: token,
                token_type: params.get('token_type'),
                scope: params.get('scope'),
                expires_in: expiresIn,
                received_at: Date.now()
            });
            setTimeout(function () { window.close(); }, 1500);
            return;
        }

        if (code) {
            status.className = 'ok';
            status.textContent = '✓ Código recibido. Intercambiando por token…';
            postToOpener({
                type: 'oauth_code',
                provider: provider,
                code: code,
                state: state
            });
            setTimeout(function () { window.close(); }, 1500);
            return;
        }

        status.textContent = 'Sin datos de autorización en la URL.';
        manual.hidden = false;
    }

    function detectProvider(state) {
        // El state tiene formato <provider>:<nonce>
        if (!state) return 'unknown';
        const prefix = state.split(':')[0];
        if (['twitch', 'youtube', 'kick', 'trovo'].includes(prefix)) return prefix;
        // Fallback: referrer
        const ref = document.referrer.toLowerCase();
        if (ref.includes('twitch')) return 'twitch';
        if (ref.includes('google') || ref.includes('youtube')) return 'youtube';
        if (ref.includes('kick')) return 'kick';
        if (ref.includes('trovo')) return 'trovo';
        return 'unknown';
    }

    function postToOpener(data) {
        try {
            if (window.opener && !window.opener.closed) {
                window.opener.postMessage(data, window.location.origin);
            } else {
                // Si no hay opener (popup fue desacoplado), guardar en localStorage
                // para que el index lo recoja al recargar
                localStorage.setItem('esperantai-oauth-pending', JSON.stringify(data));
            }
        } catch (e) {
            console.error('postToOpener failed:', e);
        }
    }

    // Esperar DOMContentLoaded en lugar de IIFE inmediato — más robusto cuando
    // el script externo carga con `defer` o `async` o cuando hay race con el DOM.
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', init);
    } else {
        init();
    }
})();
