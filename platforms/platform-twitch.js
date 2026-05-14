/* ============================================================================
 * EsperantAI — Platform Twitch
 * Cliente Twitch EventSub WebSocket directo desde el navegador.
 * No requiere servidor — usa OAuth Implicit Grant Flow (token en URL fragment).
 *
 * Docs:
 *   - OAuth: https://dev.twitch.tv/docs/authentication/getting-tokens-oauth/
 *   - EventSub WebSocket: https://dev.twitch.tv/docs/eventsub/handling-websocket-events/
 *   - Subscription types: https://dev.twitch.tv/docs/eventsub/eventsub-subscription-types/
 * ========================================================================== */

'use strict';

class PlatformTwitch extends PlatformBase {
    constructor() {
        super('Twitch');
        this.ws = null;
        this.sessionId = null;
        this.token = null;
        this.clientId = null;
        this.userId = null;
        this.eventSubBaseUrl = 'wss://eventsub.wss.twitch.tv/ws';
        this.helixBaseUrl = 'https://api.twitch.tv/helix';
    }

    authMethod() {
        return 'oauth_implicit';
    }

    /**
     * URL para iniciar OAuth en popup. El usuario approves y Twitch redirige al
     * redirectUri con #access_token=... en el fragment.
     *
     * @param {string} clientId — App Client ID registrado en dev.twitch.tv/console
     * @param {string} redirectUri — debe estar registrado en la consola Twitch
     */
    oauthUrl(clientId, redirectUri) {
        const scopes = [
            'channel:read:subscriptions',
            'bits:read',
            'channel:read:redemptions',
            'channel:read:hype_train',
            'moderator:read:followers'
        ].join(' ');

        const params = new URLSearchParams({
            client_id: clientId,
            redirect_uri: redirectUri,
            response_type: 'token',
            scope: scopes,
            force_verify: 'true'
        });

        return `https://id.twitch.tv/oauth2/authorize?${params}`;
    }

    /**
     * Después del redirect OAuth, llamar esto con el token del fragment.
     * @param {Object} cfg { token, clientId }
     */
    async connect(cfg) {
        if (!cfg.token || !cfg.clientId) {
            this.emit('auth_error', new Error('Missing token or clientId'));
            return false;
        }
        this.token = cfg.token;
        this.clientId = cfg.clientId;

        // Validar token + obtener user_id
        try {
            const validation = await this._validateToken();
            if (!validation) {
                this.emit('auth_error', new Error('Invalid Twitch token'));
                return false;
            }
            this.userId = validation.user_id;
            this.login = validation.login;
        } catch (e) {
            this.emit('auth_error', e);
            return false;
        }

        return this._connectWebSocket();
    }

    async _validateToken() {
        const res = await fetch('https://id.twitch.tv/oauth2/validate', {
            headers: { Authorization: `OAuth ${this.token}` }
        });
        if (!res.ok) return null;
        return res.json();
    }

    _connectWebSocket() {
        return new Promise((resolve) => {
            this.ws = new WebSocket(this.eventSubBaseUrl);

            this.ws.onopen = () => {
                console.log('🟣 Twitch EventSub WebSocket open');
            };

            this.ws.onmessage = (event) => {
                this._handleMessage(JSON.parse(event.data));
            };

            this.ws.onerror = (err) => {
                this.emit('error', err);
            };

            this.ws.onclose = () => {
                this.connected = false;
                this.emit('disconnected');
            };

            // Esperar al primer mensaje "session_welcome" antes de marcar conectado
            const checkSession = setInterval(() => {
                if (this.sessionId) {
                    clearInterval(checkSession);
                    this.connected = true;
                    this.emit('connected');
                    this._subscribeToAllEvents();
                    resolve(true);
                }
            }, 100);

            // Timeout 10s
            setTimeout(() => {
                if (!this.sessionId) {
                    clearInterval(checkSession);
                    resolve(false);
                }
            }, 10000);
        });
    }

    _handleMessage(msg) {
        const type = msg.metadata?.message_type;
        if (type === 'session_welcome') {
            this.sessionId = msg.payload.session.id;
        } else if (type === 'session_keepalive') {
            // pong implícito, no hacer nada
        } else if (type === 'notification') {
            this._handleNotification(msg.payload);
        } else if (type === 'session_reconnect') {
            // Twitch pide reconectar a otra URL
            const newUrl = msg.payload.session.reconnect_url;
            this._reconnect(newUrl);
        } else if (type === 'revocation') {
            this.emit('error', new Error(`Subscription revoked: ${msg.payload.subscription.type}`));
        }
    }

    _handleNotification(payload) {
        const subType = payload.subscription?.type;
        const event = payload.event;
        // Normalizar a eventos comunes
        const normalized = this._normalize(subType, event);
        if (normalized) {
            this.emit(normalized.type, normalized.data);
        }
    }

    _normalize(twitchType, event) {
        switch (twitchType) {
            case 'channel.subscribe':
                return { type: 'sub', data: { user: event.user_name, tier: event.tier, gift: event.is_gift } };
            case 'channel.subscription.message':
                return { type: 'resub', data: { user: event.user_name, tier: event.tier, months: event.cumulative_months, message: event.message?.text } };
            case 'channel.subscription.gift':
                return { type: 'gift_sub', data: { gifter: event.user_name, total: event.total, tier: event.tier } };
            case 'channel.follow':
                return { type: 'follow', data: { user: event.user_name } };
            case 'channel.cheer':
                return { type: 'cheer_bits', data: { user: event.user_name, bits: event.bits, message: event.message } };
            case 'channel.raid':
                return { type: 'raid', data: { from: event.from_broadcaster_user_name, viewers: event.viewers } };
            case 'channel.channel_points_custom_reward_redemption.add':
                return { type: 'channel_points', data: { user: event.user_name, reward_title: event.reward?.title, input: event.user_input } };
            case 'channel.hype_train.begin':
                return { type: 'hype_train_begin', data: { total: event.total } };
            default:
                return null;
        }
    }

    /**
     * Crea las suscripciones a todos los eventos relevantes después de conectar.
     */
    async _subscribeToAllEvents() {
        const desired = [
            { type: 'channel.subscribe', version: '1' },
            { type: 'channel.subscription.message', version: '1' },
            { type: 'channel.subscription.gift', version: '1' },
            { type: 'channel.follow', version: '2', extraCondition: { moderator_user_id: this.userId } },
            { type: 'channel.cheer', version: '1' },
            { type: 'channel.raid', version: '1', conditionKey: 'to_broadcaster_user_id' },
            { type: 'channel.channel_points_custom_reward_redemption.add', version: '1' },
            { type: 'channel.hype_train.begin', version: '1' }
        ];

        for (const sub of desired) {
            await this._createSubscription(sub);
        }
    }

    async _createSubscription({ type, version, extraCondition = {}, conditionKey = 'broadcaster_user_id' }) {
        const body = {
            type,
            version,
            condition: { [conditionKey]: this.userId, ...extraCondition },
            transport: { method: 'websocket', session_id: this.sessionId }
        };
        try {
            const res = await fetch(`${this.helixBaseUrl}/eventsub/subscriptions`, {
                method: 'POST',
                headers: {
                    Authorization: `Bearer ${this.token}`,
                    'Client-Id': this.clientId,
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(body)
            });
            if (!res.ok) {
                const err = await res.json().catch(() => ({}));
                console.warn(`Twitch sub failed for ${type}:`, err.message || res.status);
            }
        } catch (e) {
            console.warn(`Twitch sub error for ${type}:`, e);
        }
    }

    _reconnect(newUrl) {
        const oldWs = this.ws;
        this.sessionId = null;
        this.ws = new WebSocket(newUrl);
        this.ws.onopen = () => {
            try { oldWs.close(); } catch { /* ignore */ }
        };
        this.ws.onmessage = (event) => this._handleMessage(JSON.parse(event.data));
        this.ws.onerror = (err) => this.emit('error', err);
        this.ws.onclose = () => {
            this.connected = false;
            this.emit('disconnected');
        };
    }

    async disconnect() {
        if (this.ws) {
            try { this.ws.close(); } catch { /* ignore */ }
            this.ws = null;
        }
        this.sessionId = null;
        this.connected = false;
        this.emit('disconnected');
    }

    supportedEvents() {
        return [
            'sub', 'resub', 'gift_sub', 'follow', 'cheer_bits',
            'raid', 'channel_points', 'hype_train_begin'
        ];
    }
}

window.PlatformTwitch = PlatformTwitch;
