/* ============================================================================
 * EsperantAI — Platform Trovo
 *
 * Trovo es una plataforma de streaming gaming popular en Asia/Sudeste Asiático.
 * Ofrece API oficial con OAuth + WebSocket chat service.
 *
 * Docs:
 *   - https://developer.trovo.live/docs/APIs.html
 *   - https://developer.trovo.live/docs/Chat%20Service.html
 *
 * Eventos disponibles via Trovo Chat WebSocket:
 *   - chat (mensajes)
 *   - spell (regalos/donaciones)
 *   - magic (super-chat equivalente)
 *   - subscription (nuevas subs)
 *   - sub_gift (regalos de sub)
 *   - follow (nuevos followers)
 *   - welcome (entrada al canal)
 *   - raid
 * ========================================================================== */

'use strict';

class PlatformTrovo extends PlatformBase {
    constructor() {
        super('Trovo');
        this.ws = null;
        this.token = null;
        this.clientId = null;
        this.channelId = null;
        this.nonceCounter = 0;
        this.chatWsUrl = 'wss://open-chat.trovo.live/chat';
        this.apiBase = 'https://open-api.trovo.live/openplatform';
    }

    authMethod() { return 'oauth_implicit'; }

    oauthUrl(clientId, redirectUri) {
        const scopes = ['user_details_self', 'channel_details_self', 'send_to_my_channel'].join('+');
        return `https://open.trovo.live/page/login.html?client_id=${clientId}&response_type=token&scope=${scopes}&redirect_uri=${encodeURIComponent(redirectUri)}`;
    }

    /**
     * @param {Object} cfg { token, clientId }
     */
    async connect(cfg) {
        this.token = cfg.token;
        this.clientId = cfg.clientId;

        if (!this.token) { this.emit('auth_error', new Error('Missing Trovo token')); return false; }

        // Validar + obtener user info
        try {
            const user = await this._apiGet('/getuserinfo');
            if (!user || !user.userId) {
                this.emit('auth_error', new Error('Invalid Trovo token'));
                return false;
            }
            this.userId = user.userId;
            this.userName = user.userName;
        } catch (e) {
            this.emit('auth_error', e);
            return false;
        }

        // Obtener chat token
        try {
            const chatToken = await this._apiGet('/chat/channel-token');
            return this._connectChat(chatToken.token);
        } catch (e) {
            this.emit('auth_error', e);
            return false;
        }
    }

    async _apiGet(path) {
        const res = await fetch(this.apiBase + path, {
            headers: {
                'Authorization': `OAuth ${this.token}`,
                'Client-ID': this.clientId
            }
        });
        if (!res.ok) throw new Error(`Trovo API ${res.status}`);
        return res.json();
    }

    _connectChat(chatToken) {
        return new Promise((resolve) => {
            this.ws = new WebSocket(this.chatWsUrl);
            this.ws.onopen = () => {
                this._send({
                    type: 'AUTH',
                    nonce: this._nonce(),
                    data: { token: chatToken }
                });
            };
            this.ws.onmessage = (event) => {
                const msg = JSON.parse(event.data);
                if (msg.type === 'RESPONSE' && msg.error) {
                    this.emit('auth_error', new Error(msg.error.message));
                    return resolve(false);
                }
                if (msg.type === 'RESPONSE' && !this.connected) {
                    this.connected = true;
                    this.emit('connected');
                    this._startPing();
                    return resolve(true);
                }
                if (msg.type === 'CHAT') {
                    this._handleChat(msg.data);
                }
            };
            this.ws.onclose = () => {
                this.connected = false;
                this.emit('disconnected');
                this._stopPing();
            };
            this.ws.onerror = (err) => this.emit('error', err);
            setTimeout(() => { if (!this.connected) resolve(false); }, 10000);
        });
    }

    _send(msg) {
        if (this.ws?.readyState === WebSocket.OPEN) {
            this.ws.send(JSON.stringify(msg));
        }
    }

    _nonce() {
        return `esperantai-${Date.now()}-${++this.nonceCounter}`;
    }

    _startPing() {
        this.pingInterval = setInterval(() => {
            this._send({ type: 'PING', nonce: this._nonce() });
        }, 25000);
    }

    _stopPing() {
        if (this.pingInterval) {
            clearInterval(this.pingInterval);
            this.pingInterval = null;
        }
    }

    _handleChat(data) {
        if (!data?.chats) return;
        for (const chat of data.chats) {
            // type semantics from Trovo docs
            switch (chat.type) {
                case 5: // Subscription
                    this.emit('sub', { user: chat.nick_name, tier: chat.sub_tier, months: chat.months });
                    break;
                case 7: // Gift sub (channel)
                    this.emit('gift_sub', { gifter: chat.nick_name });
                    break;
                case 5001: // Magic chat (super chat equivalente)
                    this.emit('super_chat', { user: chat.nick_name, amount: chat.content_data?.value, message: chat.content });
                    break;
                case 5004: // Stream activation (raid)
                    this.emit('raid', { from: chat.nick_name, viewers: chat.content_data?.viewers });
                    break;
                case 6: // Spell (gift)
                    this.emit('gift', { user: chat.nick_name, gift_name: chat.content_data?.gift, amount: chat.content_data?.value });
                    break;
                case 5008: // Follow
                    this.emit('follow', { user: chat.nick_name });
                    break;
            }
        }
    }

    async disconnect() {
        this._stopPing();
        if (this.ws) { try { this.ws.close(); } catch {} this.ws = null; }
        this.connected = false;
        this.emit('disconnected');
    }

    supportedEvents() {
        return ['sub', 'gift_sub', 'super_chat', 'raid', 'gift', 'follow'];
    }
}

window.PlatformTrovo = PlatformTrovo;
