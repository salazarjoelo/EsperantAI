/* ============================================================================
 * EsperantAI — Platform Kick (referencia nativa, no expuesta en UI)
 *
 * Docs:
 *   - https://docs.kick.com/
 *
 * Estado real al 2026-05-20:
 *   - El OAuth oficial pide client_secret en el token endpoint.
 *   - Los eventos oficiales son webhooks y requieren backend.
 *   - Por regla de seguridad, EsperantAI NO pone secretos de Kick en frontend.
 *
 * Ruta de producto activa: platforms/platform-streamerbot-kick.js.
 * Ruta futura: backend propio que maneje OAuth + webhooks server-side.
 * ========================================================================== */

'use strict';

class PlatformKick extends PlatformBase {
    constructor() {
        super('Kick');
        this.token = null;
        this.clientId = null;
        this.codeVerifier = null;
        this.channelId = null;
        this.channelSlug = null;
        this.apiBase = 'https://api.kick.com/public/v1';
        this.pollMs = 10000; // polling cada 10s (conservador para evitar rate-limit)
        this.pollInterval = null;
        this.lastFollowerCount = null;
        this.lastSubscriberIds = new Set();
    }

    authMethod() {
        return 'backend_required';
    }

    /**
     * OAuth 2.1 PKCE flow. Genera code_verifier + code_challenge.
     */
    async generatePKCE() {
        const verifier = this._randomString(64);
        const hash = await crypto.subtle.digest('SHA-256', new TextEncoder().encode(verifier));
        const challenge = btoa(String.fromCharCode(...new Uint8Array(hash)))
            .replace(/\+/g, '-').replace(/\//g, '_').replace(/=+$/, '');
        this.codeVerifier = verifier;
        return { verifier, challenge };
    }

    _randomString(length) {
        const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789-._~';
        const random = new Uint8Array(length);
        crypto.getRandomValues(random);
        return Array.from(random, b => chars[b % chars.length]).join('');
    }

    async oauthUrl(_clientId, _redirectUri, _state) {
        throw new Error('Kick native OAuth requires a server-side client_secret. Use Kick via Streamer.bot in this browser app.');
    }

    /**
     * Exchange code → token. La documentación oficial de Kick requiere
     * client_secret, así que este intercambio debe vivir en backend.
     */
    async exchangeCodeForToken(_code, _clientId, _redirectUri) {
        throw new Error('Kick token exchange is backend-only because it requires client_secret.');
    }

    /**
     * @param {Object} cfg { token, clientId, channelSlug }
     */
    async connect(_cfg) {
        this.emit(
            'auth_error',
            new Error('Kick native browser connection is disabled. Use Kick via Streamer.bot.')
        );
        return false;
    }

    async _fetchChannels() {
        const res = await fetch(`${this.apiBase}/channels`, {
            headers: { Authorization: `Bearer ${this.token}` }
        });
        if (!res.ok) throw new Error(`Kick channels API ${res.status}`);
        const data = await res.json();
        return data.data || [];
    }

    _startPolling() {
        this._stopPolling();
        this.pollInterval = setInterval(() => this._poll(), this.pollMs);
    }

    _stopPolling() {
        if (this.pollInterval) {
            clearInterval(this.pollInterval);
            this.pollInterval = null;
        }
    }

    async _poll() {
        // Polling de stats — esto detecta cambios pero NO da eventos en tiempo real
        // perfecto. Para eventos reales (subs, follows con metadata) se necesita
        // webhook server. Aquí solo detectamos cambios numéricos como proxy.
        try {
            const channel = (await this._fetchChannels())[0];
            if (!channel) return;
            const followers = channel.follower_count;
            if (this.lastFollowerCount !== null && followers > this.lastFollowerCount) {
                const diff = followers - this.lastFollowerCount;
                for (let i = 0; i < diff; i++) {
                    this.emit('follow', { user: '(unknown)', provider: 'kick' });
                }
            }
            this.lastFollowerCount = followers;
        } catch (e) {
            console.warn('Kick poll error:', e);
        }
    }

    async disconnect() {
        this._stopPolling();
        this.connected = false;
        this.emit('disconnected');
    }

    supportedEvents() {
        // Eventos oficiales de Kick requieren backend/webhooks o bridge local.
        return [];
    }
}

window.PlatformKick = PlatformKick;
