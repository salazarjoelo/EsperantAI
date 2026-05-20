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
| Kick | Partially supported by `PlatformKick`. The UI has a Kick button, but code exchanges a PKCE code without `client_secret` and only detects follower count by polling. | Kick official OAuth 2.1 token endpoint currently requires `client_secret`; official event subscriptions are webhook-based and require `events:subscribe`. | Mark as beta/limited in the user manual. Do not promise subscriptions, donations, or raids directly from Kick browser-only. Recommend StreamElements bridge or backend/webhook for full Kick events. |
| Trovo | `PlatformTrovo` exists and is loaded, but `index.html` and `app.js` do not expose a Trovo connect panel or OAuth flow. | Trovo docs confirm WebSocket chat service at `wss://open-chat.trovo.live/chat`, OAuth/API token flow, and chat-token requirements. | Do not list Trovo as a normal UI-supported platform in the manual. State it is technical/advanced support in code until the UI connection panel is added. |
| StreamElements | Supported by `PlatformStreamElements` with manual JWT and Socket.IO legacy realtime endpoint. | StreamElements current docs describe the Astro WebSocket Gateway at `wss://astro.streamelements.com/`, topics like `channel.activities`, and JWT/OAuth2/API key subscription tokens. | Keep as bridge, but avoid overpromising exact legacy endpoint. Say current app uses StreamElements bridge with JWT and may depend on the active StreamElements account/provider token. Add technical note that the code should migrate to Astro Gateway. |

## Manual corrections required

1. Replace generic "receives events from Trovo" wording with a clear status note.
2. Mark Kick as beta/limited and explain that full Kick events require backend/webhooks or a bridge.
3. Add YouTube requirements: active live broadcast, YouTube Data API v3, quota.
4. Add vMix local API requirement and no-password limitation of the current adapter.
5. Clarify PRISM needs obs-websocket plugin installation, while OBS 28+ includes obs-websocket.
6. Add images for the user flow, streaming software setup, platform event status, and event+gesture combinations.
7. Remove refund/free/trial promises from manuals unless commercial policy documents explicitly require them.
8. Synchronize `docs/manual.html` from the markdown manuals after translation updates.

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
- Trovo Chat Service: https://developer.trovo.live/docs/Chat%20Service.html
- Trovo APIs: https://developer.trovo.live/docs/APIs.html
- StreamElements Websockets: https://docs.streamelements.com/websockets
- StreamElements Activities topic: https://docs.streamelements.com/websockets/topics/channel-activities
- XSplit XJS Framework: https://xjsframework.github.io/api.html
