/* ============================================================================
 * EsperantAI — Platform Kick
 * Kick OAuth 2.1 PKCE + REST polling para eventos.
 *
 * Kick es importante: 10M MAU (early 2026), dominante en LATAM + MENA + Polonia.
 * 6 de los top 10 followed channels son hispanohablantes.
 *
 * Docs:
 *   - https://github.com/KickEngineering/KickDevDocs
 *   - https://docs.kick.com/
 *
 * Kick API soporta:
 *   - chat.message.sent
 *   - channel.followed
 *   - channel.subscription.new / renewal / gifts
 *   - livestream.status.updated
 *
 * Webhook-only nativamente (requiere servidor). En browser-only usamos REST polling
 * a los endpoints de followers/subscribers/livestream cada N segundos.
 * (Polling no es ideal pero browser-only sin backend obliga a esto.)
 *
 * NOTA: Kick anunció WebSocket EventSub futuro — cuando llegue, migrar a WS.
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
        return 'oauth_pkce';
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

    async oauthUrl(clientId, redirectUri, state) {
        const { challenge } = await this.generatePKCE();
        const params = new URLSearchParams({
            response_type: 'code',
            client_id: clientId,
            redirect_uri: redirectUri,
            scope: 'user:read channel:read events:subscribe',
            code_challenge: challenge,
            code_challenge_method: 'S256',
            // Usar state pasado desde app.js (validado en callback). Fallback a random si no se pasa.
            state: state || this._randomString(16)
        });
        return `https://id.kick.com/oauth/authorize?${params}`;
    }

    /**
     * Exchange code → token. PKCE no requiere client_secret.
     */
    async exchangeCodeForToken(code, clientId, redirectUri) {
        const params = new URLSearchParams({
            grant_type: 'authorization_code',
            client_id: clientId,
            redirect_uri: redirectUri,
            code,
            code_verifier: this.codeVerifier
        });
        const res = await fetch('https://id.kick.com/oauth/token', {
            method: 'POST',
            headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
            body: params
        });
        if (!res.ok) throw new Error(`Kick token exchange failed: ${res.status}`);
        return res.json();
    }

    /**
     * @param {Object} cfg { token, clientId, channelSlug }
     */
    async connect(cfg) {
        this.token = cfg.token;
        this.clientId = cfg.clientId;

        // Obtener info del canal del usuario actual
        try {
            const channels = await this._fetchChannels();
            if (!channels?.[0]) {
                this.emit('auth_error', new Error('No Kick channel found'));
                return false;
            }
            this.channelId = channels[0].broadcaster_user_id;
            this.channelSlug = channels[0].slug;
        } catch (e) {
            this.emit('auth_error', e);
            return false;
        }

        this.connected = true;
        this.emit('connected');
        this._startPolling();
        return true;
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
        // Eventos detectables por polling browser-only (limitado)
        return ['follow'];
        // Para sub/donation/raid completos: requiere webhook server (futura v3.5+)
    }
}

window.PlatformKick = PlatformKick;
