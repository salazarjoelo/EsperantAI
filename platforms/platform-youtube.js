/* ============================================================================
 * EsperantAI — Platform YouTube Live
 * Polling de YouTube Live Streaming API v3 desde el navegador.
 *
 * YouTube NO tiene webhooks nativos para Super Chat / memberships.
 * Solución: REST polling de liveChatMessages + superChatEvents cada N segundos.
 *
 * Docs:
 *   - https://developers.google.com/youtube/v3/live/docs/liveChatMessages
 *   - https://developers.google.com/youtube/v3/live/docs/superChatEvents
 *   - OAuth client-side: https://developers.google.com/youtube/v3/live/guides/auth/client-side-web-apps
 *
 * Quota: YouTube API tiene quota diaria (10K units por default).
 * - liveChatMessages.list: 1 unit por llamada
 * - superChatEvents.list: 1 unit
 * - Polling cada 5s × 12 horas = ~8,640 calls/día → cabe en quota
 * ========================================================================== */

'use strict';

class PlatformYouTube extends PlatformBase {
    constructor() {
        super('YouTube');
        this.token = null;
        this.clientId = null;
        this.liveChatId = null;
        this.broadcastId = null;
        this.pollMs = 5000;
        this.pollInterval = null;
        this.nextPageToken = null;
        this.seenMessageIds = new Set();
        this.apiBase = 'https://www.googleapis.com/youtube/v3';
    }

    authMethod() {
        return 'oauth_implicit';
    }

    /**
     * OAuth URL para Google Identity Services implicit flow.
     */
    oauthUrl(clientId, redirectUri, state) {
        const scope = [
            'https://www.googleapis.com/auth/youtube.readonly'
        ].join(' ');

        const params = new URLSearchParams({
            client_id: clientId,
            redirect_uri: redirectUri,
            response_type: 'token',
            scope,
            include_granted_scopes: 'true',
            prompt: 'consent'
        });
        if (state) params.set('state', state);
        return `https://accounts.google.com/o/oauth2/v2/auth?${params}`;
    }

    /**
     * @param {Object} cfg { token, clientId }
     */
    async connect(cfg) {
        this.token = cfg.token;
        this.clientId = cfg.clientId;

        if (!this.token) {
            this.emit('auth_error', new Error('Missing YouTube token'));
            return false;
        }

        // Buscar broadcast activo
        try {
            const broadcast = await this._fetchActiveBroadcast();
            if (!broadcast) {
                this.emit('auth_error', new Error('No active YouTube broadcast found'));
                return false;
            }
            this.broadcastId = broadcast.id;
            this.liveChatId = broadcast.snippet?.liveChatId;
        } catch (e) {
            this.emit('auth_error', e);
            return false;
        }

        this.connected = true;
        this.emit('connected');
        this._startPolling();
        return true;
    }

    async _fetchActiveBroadcast() {
        const res = await fetch(`${this.apiBase}/liveBroadcasts?part=snippet,status&broadcastStatus=active&broadcastType=all`, {
            headers: { Authorization: `Bearer ${this.token}` }
        });
        if (!res.ok) throw new Error(`YouTube API ${res.status}`);
        const data = await res.json();
        return data.items?.[0] || null;
    }

    _startPolling() {
        this._stopPolling();
        this.pollInterval = setInterval(() => this._pollChat(), this.pollMs);
        this._pollChat(); // primer poll inmediato
    }

    _stopPolling() {
        if (this.pollInterval) {
            clearInterval(this.pollInterval);
            this.pollInterval = null;
        }
    }

    async _pollChat() {
        if (!this.liveChatId) return;
        const params = new URLSearchParams({
            liveChatId: this.liveChatId,
            part: 'snippet,authorDetails',
            maxResults: '200'
        });
        if (this.nextPageToken) params.set('pageToken', this.nextPageToken);

        try {
            const res = await fetch(`${this.apiBase}/liveChat/messages?${params}`, {
                headers: { Authorization: `Bearer ${this.token}` }
            });
            if (!res.ok) {
                if (res.status === 401) {
                    this.emit('auth_error', new Error('YouTube token expired'));
                    this._stopPolling();
                }
                return;
            }
            const data = await res.json();
            this.nextPageToken = data.nextPageToken;
            const newPollMs = Math.max(data.pollingIntervalMillis || 5000, 3000);

            // Solo resetear el intervalo si el delay sugerido por YouTube cambió significativamente
            if (Math.abs(newPollMs - this.pollMs) > 500) {
                this.pollMs = newPollMs;
                this._stopPolling();
                this.pollInterval = setInterval(() => this._pollChat(), this.pollMs);
            }

            for (const msg of data.items || []) {
                if (this.seenMessageIds.has(msg.id)) continue;
                this.seenMessageIds.add(msg.id);
                // Limitar tamaño del set
                if (this.seenMessageIds.size > 5000) {
                    const arr = Array.from(this.seenMessageIds);
                    this.seenMessageIds = new Set(arr.slice(-2500));
                }
                this._handleMessage(msg);
            }
        } catch (e) {
            console.warn('YouTube poll error:', e);
        }
    }

    _handleMessage(msg) {
        const type = msg.snippet?.type;
        const author = msg.authorDetails?.displayName;
        switch (type) {
            case 'superChatEvent': {
                const sc = msg.snippet.superChatDetails;
                this.emit('super_chat', {
                    user: author,
                    amount: sc.amountMicros / 1e6,
                    currency: sc.currency,
                    message: sc.userComment
                });
                break;
            }
            case 'superStickerEvent': {
                const ss = msg.snippet.superStickerDetails;
                this.emit('super_chat', {
                    user: author,
                    amount: ss.amountMicros / 1e6,
                    currency: ss.currency,
                    message: '[super sticker]'
                });
                break;
            }
            case 'newSponsorEvent':
                this.emit('sub', { user: author, tier: msg.snippet.newSponsorDetails?.memberLevelName });
                break;
            case 'memberMilestoneChatEvent':
                this.emit('member_milestone', {
                    user: author,
                    months: msg.snippet.memberMilestoneChatDetails?.memberMonth
                });
                break;
            case 'membershipGiftingEvent':
                this.emit('gift_sub', {
                    gifter: author,
                    total: msg.snippet.membershipGiftingDetails?.giftMembershipsCount
                });
                break;
            case 'giftMembershipReceivedEvent':
                this.emit('sub', { user: author, gift: true });
                break;
            // textMessageEvent → ignorar para no spam
        }
    }

    async disconnect() {
        this._stopPolling();
        this.connected = false;
        this.emit('disconnected');
    }

    supportedEvents() {
        return ['super_chat', 'sub', 'gift_sub', 'member_milestone'];
    }
}

window.PlatformYouTube = PlatformYouTube;
