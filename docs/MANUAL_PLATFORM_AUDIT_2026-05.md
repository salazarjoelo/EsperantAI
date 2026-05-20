# EsperantAI - Manual platform audit, May 2026

This audit is the source of truth for the May 2026 user manual refresh. It compares the current EsperantAI code and manual against official documentation for each streaming app and platform.

## Scope

- Local code reviewed: `index.html`, `app.js`, `adapters/*.js`, `platforms/*.js`.
- Manual reviewed: `docs/USER_MANUAL_*.md` and embedded `docs/manual.html`.
- Date of validation: 2026-05-20.

## Streaming software

| App | Code status | Official documentation check | Manual decision |
|---|---|---|---|
| OBS Studio | Supported by `AdapterOBS` through obs-websocket v5. | Official obs-websocket docs state it is included in OBS Studio 28+ and uses port `4455` by default. | Keep as production. Explain `Tools -> WebSocket Server Settings`, password, `ws://127.0.0.1:4455`. |
| Streamlabs Desktop | Supported by `AdapterStreamlabs` through local WebSocket JSON-RPC. | Streamlabs Desktop API docs describe remote connections from `Settings -> Remote Control`, token copy, first auth request, and default remote-control behavior. | Keep as production. Mention API token and port `59650`. |
| vMix | Supported by `AdapterVMix` through HTTP Web Controller API. | vMix help 29 documents HTTP API at `http://127.0.0.1:8088/api/` and says it is configured from the Web tab in Settings. | Keep as production. Clarify current EsperantAI adapter uses local HTTP host/port and requires the Web Controller/API to be reachable from the browser. |
| PRISM Live Studio | Supported by selecting PRISM, which reuses `AdapterOBS`. | PRISM official guide says OBS plugin support starts at v4.0.0 and recommends PRISM v4.0.5+ for OBS plugins. | Keep as production with caveat: unlike OBS 28+, PRISM requires installing the OBS plugin manually. |
| XSplit Broadcaster | Supported by `AdapterXSplit` through a local Remote XJS proxy. | XSplit XJS Framework docs exist, but the local `Remote xjs` proxy is not presented like a standard built-in user flow in the official API docs. | Keep as beta/advanced. Do not promise full parity. Say it requires a compatible local XJS remote bridge/proxy. |

## Streaming platforms and event sources

| Platform | Code status | Official documentation check | Manual decision |
|---|---|---|---|
| Twitch | Supported by `PlatformTwitch` using OAuth implicit flow and EventSub WebSocket. | Twitch docs say implicit flow is intended for apps without a server, and EventSub supports WebSocket at `wss://eventsub.wss.twitch.tv/ws`. | Keep as production. Mention Client ID, registered redirect URI, and no client secret in the browser. |
| YouTube Live | Supported by `PlatformYouTube` using OAuth token, active broadcast lookup, and live chat polling. | YouTube docs require `youtube.readonly` authorization for `liveBroadcasts.list`; live chat messages are available only while the live event is active and `liveChatMessages.list`/`streamList` are documented. | Keep as production with clear requirement: active live broadcast, YouTube Data API v3 enabled, quota applies. |
| Kick | Supported through `PlatformStreamerBotKick`, which connects to Streamer.bot's local WebSocket server and subscribes to Kick events. The older browser-only `PlatformKick` remains code-level roadmap/advanced and is not the recommended user path. | Kick official OAuth 2.1 token endpoint requires `client_secret`; official event subscriptions are webhook-based. Streamer.bot documents Kick support and a local WebSocket API that EsperantAI can consume without exposing Kick secrets. | Keep Kick as supported via Streamer.bot bridge. Do not market native browser-only Kick. Native official Kick backend/webhooks remain roadmap. |
| Trovo | Supported by `PlatformTrovo` plus public UI and OAuth flow in `index.html`/`app.js`. The adapter uses Trovo OAuth, `/chat/token`, and `wss://open-chat.trovo.live/chat`. | Trovo docs confirm WebSocket chat service at `wss://open-chat.trovo.live/chat`, OAuth/API token flow, and the own-channel chat token endpoint. | Keep Trovo as native supported. Mention Client ID, redirect URI, and supported chat events. |
| StreamElements | Supported by `PlatformStreamElements` with manual JWT and the current Astro WebSocket Gateway at `wss://astro.streamelements.com/`. | StreamElements current docs describe the Astro WebSocket Gateway, topics like `channel.activities`, and JWT/OAuth2/API key subscription tokens. | Keep as bridge. Say current app uses StreamElements bridge with JWT and may depend on the active StreamElements account/provider token. |

## Manual corrections applied

1. Kick wording says "Kick via Streamer.bot bridge".
2. Native browser-only Kick is marked as roadmap/backend, not the current user path.
3. YouTube requirements include active live broadcast, YouTube Data API v3, and quota.
4. vMix section states the local HTTP API requirement and browser limitation.
5. PRISM section states manual obs-websocket plugin installation, while OBS 28+ includes obs-websocket.
6. The manuals include images for the local flow, streaming software setup, platform event status, and event+gesture combinations.
7. The manuals do not promise a free trial or refund outside the legal policy.
8. `docs/manual-viewer.js` is synchronized from the markdown manuals.

## Official sources used

- OBS obs-websocket: https://github.com/obsproject/obs-websocket
- Streamlabs Desktop API: https://streamlabs.github.io/streamlabs-desktop-api-docs/docs/index.html
- vMix HTTP Web API: https://www.vmix.com/help29/DeveloperAPI.html
- PRISM OBS plugins: https://guide.prismlive.com/desktop/guides/features/obs-plugins/using-obs-plugins
- Twitch OAuth: https://dev.twitch.tv/docs/authentication/getting-tokens-oauth/
- Twitch EventSub WebSocket: https://dev.twitch.tv/docs/eventsub/handling-websocket-events
- YouTube Live Broadcasts: https://developers.google.com/youtube/v3/live/docs/liveBroadcasts/list
- YouTube Live Chat Messages: https://developers.google.com/youtube/v3/live/docs/liveChatMessages
- Kick OAuth 2.1: https://docs.kick.com/getting-started/generating-tokens-oauth2-flow
- Kick event subscriptions: https://docs.kick.com/events/subscribe-to-events
- Streamer.bot WebSocket configuration: https://docs.streamer.bot/api/websocket/guide/configuration
- Streamer.bot Kick events: https://docs.streamer.bot/api/websocket/events/kick
- Trovo Chat Service: https://developer.trovo.live/docs/Chat%20Service.html
- Trovo APIs: https://developer.trovo.live/docs/APIs.html
- StreamElements Websockets: https://docs.streamelements.com/websockets
- StreamElements Activities topic: https://docs.streamelements.com/websockets/topics/channel-activities
- XSplit XJS Framework: https://xjsframework.github.io/api.html
