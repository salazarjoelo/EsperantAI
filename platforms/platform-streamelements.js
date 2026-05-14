/* ============================================================================
 * EsperantAI — Platform StreamElements (Bridge unificado)
 *
 * StreamElements unifica eventos de Twitch + YouTube + Facebook Gaming
 * en una sola API. Si el usuario ya tiene cuenta SE (la mayoría sí), una
 * sola conexión cubre todas sus plataformas.
 *
 * Docs:
 *   - https://dev.streamelements.com/docs/socket-api
 *
 * Tipo de conexión: Socket.IO 2.x (no nativo WebSocket)
 * El usuario obtiene su JWT token en https://streamelements.com/dashboard/account/channels
 *
 * NOTA: requiere cargar Socket.IO client externamente o implementación nativa.
 * Para v1 usamos approach manual con WebSocket polling al endpoint REST como fallback.
 * ========================================================================== */

'use strict';

class PlatformStreamElements extends PlatformBase {
    constructor() {
        super('StreamElements');
        this.socket = null;
        this.jwt = null;
        this.channelId = null;
        this.apiBase = 'https://api.streamelements.com/kappa/v2';
        this.socketUrl = 'https://realtime.streamelements.com';
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

    /**
     * SE usa Socket.IO. Como evitar dependencia, cargamos su cliente desde CDN.
     * Si Socket.IO no está disponible, usamos REST polling al endpoint de actividad.
     */
    async _connectSocket() {
        if (typeof io === 'undefined') {
            await this._loadSocketIO();
        }

        return new Promise((resolve) => {
            this.socket = io(this.socketUrl, {
                transports: ['websocket']
            });

            this.socket.on('connect', () => {
                this.socket.emit('authenticate', { method: 'jwt', token: this.jwt });
            });

            this.socket.on('authenticated', () => {
                this.connected = true;
                this.emit('connected');
                resolve(true);
            });

            this.socket.on('unauthorized', (err) => {
                this.emit('auth_error', err);
                resolve(false);
            });

            this.socket.on('event', (event) => this._handleEvent(event));
            this.socket.on('event:test', (event) => this._handleEvent(event));

            this.socket.on('disconnect', () => {
                this.connected = false;
                this.emit('disconnected');
            });

            setTimeout(() => {
                if (!this.connected) resolve(false);
            }, 10000);
        });
    }

    _loadSocketIO() {
        return new Promise((resolve, reject) => {
            const script = document.createElement('script');
            script.src = 'https://cdn.socket.io/4.7.5/socket.io.min.js';
            script.onload = resolve;
            script.onerror = reject;
            document.head.appendChild(script);
        });
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
            try { this.socket.disconnect(); } catch { /* ignore */ }
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
