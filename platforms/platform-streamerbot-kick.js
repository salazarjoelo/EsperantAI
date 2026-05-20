/* ============================================================================
 * EsperantAI — Platform Kick via Streamer.bot
 *
 * Streamer.bot v1.0.0+ receives Kick through the official Kick Public API and
 * exposes normalized events through its local WebSocket server. EsperantAI uses
 * that local bridge instead of reverse engineering Kick endpoints or exposing
 * Kick client secrets in browser code.
 *
 * Docs:
 *   - https://docs.streamer.bot/api/websocket/guide/configuration
 *   - https://docs.streamer.bot/api/websocket/requests
 *   - https://docs.streamer.bot/api/websocket/events/kick
 * ========================================================================== */

'use strict';

class PlatformStreamerBotKick extends PlatformBase {
    constructor() {
        super('Kick via Streamer.bot');
        this.ws = null;
        this.host = '127.0.0.1';
        this.port = 8080;
        this.endpoint = '/';
        this.password = '';
        this.requestSeq = 0;
        this.pending = new Map();
        this.connectResolve = null;
        this.connectTimer = null;
    }

    authMethod() {
        return 'local_bridge';
    }

    async connect(cfg = {}) {
        this.host = cfg.host || this.host;
        this.port = Number(cfg.port || this.port);
        this.endpoint = cfg.endpoint || this.endpoint;
        this.password = cfg.password || '';

        return new Promise((resolve) => {
            this.connectResolve = resolve;
            const url = this._buildUrl();
            this.ws = new WebSocket(url);

            this.ws.onmessage = (event) => this._handleMessage(event.data);
            this.ws.onerror = (err) => {
                this.emit('error', err);
                this._finishConnect(false);
            };
            this.ws.onclose = () => {
                const wasConnected = this.connected;
                this.connected = false;
                this.pending.clear();
                if (wasConnected) this.emit('disconnected');
                this._finishConnect(false);
            };

            this.connectTimer = setTimeout(() => {
                this.emit('auth_error', new Error('Streamer.bot WebSocket did not respond'));
                this._finishConnect(false);
            }, 10000);
        });
    }

    _buildUrl() {
        const cleanEndpoint = String(this.endpoint || '/').startsWith('/')
            ? this.endpoint
            : `/${this.endpoint}`;
        return `ws://${this.host}:${this.port}${cleanEndpoint}`;
    }

    async _handleMessage(raw) {
        let msg;
        try {
            msg = JSON.parse(raw);
        } catch (e) {
            this.emit('error', e);
            return;
        }

        if (msg.request === 'Hello') {
            await this._handleHello(msg);
            return;
        }

        if (msg.id && this.pending.has(msg.id)) {
            const pending = this.pending.get(msg.id);
            this.pending.delete(msg.id);
            pending(msg);
            return;
        }

        if (msg.event?.source && String(msg.event.source).toLowerCase() === 'kick') {
            this._handleKickEvent(msg.event.type, msg.data || {});
        }
    }

    async _handleHello(msg) {
        if (msg.authentication) {
            if (!this.password) {
                this.emit('auth_error', new Error('Streamer.bot WebSocket requires a password'));
                this._finishConnect(false);
                return;
            }
            const ok = await this._authenticate(msg.authentication);
            if (!ok) {
                this.emit('auth_error', new Error('Streamer.bot WebSocket authentication failed'));
                this._finishConnect(false);
                return;
            }
        }
        await this._subscribeKickEvents();
    }

    async _authenticate(auth) {
        const secret = await this._sha256Base64(`${this.password}${auth.salt}`);
        const authentication = await this._sha256Base64(`${secret}${auth.challenge}`);
        const response = await this._sendRequest({
            request: 'Authenticate',
            authentication
        });
        return response?.status === 'ok';
    }

    async _subscribeKickEvents() {
        const response = await this._sendRequest({
            request: 'Subscribe',
            events: {
                Kick: [
                    'Follow',
                    'Subscription',
                    'Resubscription',
                    'GiftSubscription',
                    'MassGiftSubscription',
                    'RewardRedemption',
                    'StreamOnline',
                    'StreamOffline',
                    'ViewerCountUpdate',
                    'ChannelUpdate',
                    'ChatMessage'
                ]
            }
        });
        if (response?.status !== 'ok') {
            this.emit('auth_error', new Error('Streamer.bot Kick subscription failed'));
            this._finishConnect(false);
            return;
        }
        this.connected = true;
        this.emit('connected');
        this._finishConnect(true);
    }

    _sendRequest(payload) {
        return new Promise((resolve) => {
            const id = `esperantai:${Date.now()}:${++this.requestSeq}`;
            this.pending.set(id, resolve);
            this.ws.send(JSON.stringify({ ...payload, id }));
        });
    }

    async _sha256Base64(text) {
        const data = new TextEncoder().encode(text);
        const digest = await crypto.subtle.digest('SHA-256', data);
        const bytes = Array.from(new Uint8Array(digest));
        return btoa(String.fromCharCode(...bytes));
    }

    _handleKickEvent(type, data) {
        const normalized = this._normalize(type, data);
        if (normalized) this.emit(normalized.type, normalized.data);
    }

    _normalize(type, data) {
        const user = this._userName(data.user || data.viewer || data.broadcaster) ||
            data.username || data.userName || data.name;
        switch (type) {
            case 'Follow':
                return { type: 'follow', data: { user, provider: 'kick' } };
            case 'Subscription':
                return { type: 'sub', data: { user, tier: data.tier, provider: 'kick' } };
            case 'Resubscription':
                return { type: 'resub', data: { user, tier: data.tier, months: data.duration, provider: 'kick' } };
            case 'GiftSubscription':
                return {
                    type: 'gift_sub',
                    data: {
                        gifter: user,
                        recipient: this._userName(data.recipient),
                        provider: 'kick'
                    }
                };
            case 'MassGiftSubscription':
                return {
                    type: 'gift_sub',
                    data: {
                        gifter: user,
                        total: Array.isArray(data.recipients) ? data.recipients.length : data.total,
                        provider: 'kick'
                    }
                };
            case 'RewardRedemption':
                return {
                    type: 'channel_points',
                    data: {
                        user,
                        reward_title: data.reward?.title || data.rewardName || data.title,
                        input: data.input || data.message,
                        provider: 'kick'
                    }
                };
            default:
                return null;
        }
    }

    _userName(value) {
        if (!value) return undefined;
        if (typeof value === 'string') return value;
        return value.displayName || value.display_name || value.name || value.login || value.username;
    }

    async disconnect() {
        if (this.ws) {
            try { this.ws.close(); } catch { /* ignore */ }
            this.ws = null;
        }
        this.pending.clear();
        const wasConnected = this.connected;
        this.connected = false;
        if (wasConnected) this.emit('disconnected');
    }

    _finishConnect(ok) {
        if (this.connectTimer) {
            clearTimeout(this.connectTimer);
            this.connectTimer = null;
        }
        if (this.connectResolve) {
            const resolve = this.connectResolve;
            this.connectResolve = null;
            resolve(ok);
        }
    }

    supportedEvents() {
        return ['follow', 'sub', 'resub', 'gift_sub', 'channel_points'];
    }
}

window.PlatformStreamerBotKick = PlatformStreamerBotKick;
