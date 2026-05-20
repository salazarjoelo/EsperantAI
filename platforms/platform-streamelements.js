/* ============================================================================
 * EsperantAI — Platform StreamElements (Bridge unificado)
 *
 * StreamElements unifica eventos de Twitch + YouTube + Facebook Gaming
 * en una sola API. Si el usuario ya tiene cuenta SE (la mayoría sí), una
 * sola conexión cubre todas sus plataformas.
 *
 * Docs:
 *   - https://docs.streamelements.com/websockets
 *   - https://docs.streamelements.com/websockets/topics/channel-activities
 *
 * Tipo de conexión: Astro WebSocket Gateway
 * El usuario obtiene su JWT token en https://streamelements.com/dashboard/account/channels
 * ========================================================================== */

'use strict';

class PlatformStreamElements extends PlatformBase {
    constructor() {
        super('StreamElements');
        this.socket = null;
        this.jwt = null;
        this.channelId = null;
        this.apiBase = 'https://api.streamelements.com/kappa/v2';
        this.baseSocketUrl = 'wss://astro.streamelements.com/';
        this.socketUrl = this.baseSocketUrl;
        this._subscribeNonce = null;
        this._subscriptionSent = false;
    }

    authMethod() {
        return 'manual_token'; // El usuario pega su JWT
    }

    /**
     * @param {Object} cfg { jwt, channelId }
     *   jwt: JWT token de la cuenta SE
     *   channelId: opcional, si no se infiere del JWT
     */
    async connect(cfg) {
        this.jwt = cfg.jwt;
        this.channelId = cfg.channelId || null;
        this.socketUrl = this.baseSocketUrl;
        this._subscriptionSent = false;

        if (!this.jwt) {
            this.emit('auth_error', new Error('Missing StreamElements JWT'));
            return false;
        }

        // Validar JWT obteniendo el channel
        try {
            const channel = await this._fetchChannelInfo();
            if (!channel) {
                this.emit('auth_error', new Error('Invalid SE token'));
                return false;
            }
            this.channelId = channel._id;
        } catch (e) {
            this.emit('auth_error', e);
            return false;
        }

        return this._connectSocket();
    }

    async _fetchChannelInfo() {
        const res = await fetch(`${this.apiBase}/channels/me`, {
            headers: { Authorization: `Bearer ${this.jwt}` }
        });
        if (!res.ok) return null;
        return res.json();
    }

    async _connectSocket() {
        return new Promise((resolve) => {
            let settled = false;
            this.socket = new WebSocket(this.socketUrl);

            const finish = (ok) => {
                if (settled) return;
                settled = true;
                resolve(ok);
            };

            this.socket.onopen = () => {
                // Astro envía un welcome primero; si no llega, de todos modos
                // suscribimos al abrir para no bloquear clientes compatibles.
                setTimeout(() => {
                    if (!this.connected && this.socket) this._subscribeActivities();
                }, 250);
            };

            this.socket.onmessage = (event) => {
                let message;
                try {
                    message = JSON.parse(event.data);
                } catch (e) {
                    console.warn('StreamElements Astro bad message:', e);
                    return;
                }

                if (message.type === 'welcome') {
                    this._subscribeActivities();
                    return;
                }

                if (message.type === 'response' && message.nonce === this._subscribeNonce) {
                    if (message.error) {
                        this.emit('auth_error', new Error(message.error));
                        finish(false);
                        return;
                    }
                    this.connected = true;
                    this.emit('connected');
                    finish(true);
                    return;
                }

                if (message.type === 'message' && message.topic === 'channel.activities') {
                    this._handleEvent(message.data);
                    return;
                }

                if (message.type === 'reconnect') {
                    this._reconnect(message.data?.reconnect_token);
                }
            };

            this.socket.onerror = (event) => {
                this.emit('auth_error', event);
                finish(false);
            };

            this.socket.onclose = () => {
                const wasConnected = this.connected;
                this.connected = false;
                if (wasConnected) this.emit('disconnected');
                finish(false);
            };

            setTimeout(() => {
                if (!settled && !this.connected && this.socket?.readyState < 2) {
                    try { this.socket.close(); } catch { /* ignore */ }
                }
                finish(false);
            }, 10000);
        });
    }

    _subscribeActivities() {
        if (!this.socket || this.socket.readyState !== 1) return;
        if (this._subscriptionSent) return;
        this._subscriptionSent = true;
        this._subscribeNonce = `se-activities-${Date.now()}`;
        this.socket.send(JSON.stringify({
            type: 'subscribe',
            nonce: this._subscribeNonce,
            data: {
                topic: 'channel.activities',
                room: this.channelId || '',
                token: this.jwt,
                token_type: 'jwt'
            }
        }));
    }

    _reconnect(reconnectToken) {
        if (!reconnectToken) return;
        try {
            this.socket?.close();
        } catch { /* ignore */ }
        this.socketUrl = `wss://astro.streamelements.com/?reconnect_token=${encodeURIComponent(reconnectToken)}`;
        this._subscriptionSent = false;
        this._connectSocket();
    }

    _handleEvent(event) {
        const normalized = this._normalize(event);
        if (normalized) this.emit(normalized.type, normalized.data);
    }

    _normalize(event) {
        // SE manda: { type, provider, data: { username, amount, currency, message, ... } }
        const type = event.type;
        const provider = event.provider || 'unknown';
        const data = event.data || {};
        switch (type) {
            case 'subscriber':
                return { type: 'sub', data: { user: data.username, tier: data.tier, months: data.amount, provider } };
            case 'follow':
            case 'follower':
                return { type: 'follow', data: { user: data.username, provider } };
            case 'tip':
                return { type: 'donation', data: { user: data.username, amount: data.amount, currency: data.currency, message: data.message, provider } };
            case 'cheer':
                return { type: 'cheer_bits', data: { user: data.username, bits: data.amount, message: data.message, provider } };
            case 'host':
            case 'raid':
                return { type: 'raid', data: { from: data.username, viewers: data.amount, provider } };
            case 'redemption':
                return { type: 'channel_points', data: { user: data.username, reward_title: data.message, provider } };
            case 'superchat':
                return { type: 'super_chat', data: { user: data.username, amount: data.amount, currency: data.currency, message: data.message, provider } };
            case 'sponsor': // YouTube membership
                return { type: 'member_milestone', data: { user: data.username, months: data.amount, provider } };
            default:
                return null;
        }
    }

    async disconnect() {
        if (this.socket) {
            try { this.socket.close(); } catch { /* ignore */ }
            this.socket = null;
        }
        this.connected = false;
        this.emit('disconnected');
    }

    supportedEvents() {
        return [
            'sub', 'follow', 'donation', 'cheer_bits', 'raid',
            'channel_points', 'super_chat', 'member_milestone'
        ];
    }
}

window.PlatformStreamElements = PlatformStreamElements;
