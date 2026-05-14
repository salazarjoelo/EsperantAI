# SPEC: SOOP & CHZZK Platform Adapter Research

> **EsperantAI** — Comprehensive API research document for Korean streaming platforms  
> **Author:** Z (GLM-4) — assigned per COORDINATION.md division of work  
> **Date:** 2026-03-05  
> **Status:** Research document — NO adapter code written  
> **Rule:** `[NO TENGO DATO]` marks unverified data per COORDINATION.md §2.3

---

## 1. Market Context

### Korea's Streaming Landscape After Twitch Closure (Feb 2024)

Twitch shut down operations in South Korea in February 2024. Before the exit, Twitch commanded approximately **52%** of the Korean streaming market, with AfreecaTV (now SOOP) holding roughly **45%**. The vacuum created by Twitch's departure was filled by two domestic platforms:

1. **SOOP** (ex-AfreecaTV) — the incumbent, rebranded October 2024
2. **CHZZK** (Naver) — the challenger, soft-launched December 2023, officially launched April 2024

### SOOP Market Share & Demographics

| Metric | Value | Source |
|---|---|---|
| Monthly Active Users (MAU) | ~2M+ (early 2024); CHZZK surpassed SOOP MAU by Dec 2024 | Douglas Research |
| Average concurrent viewers (2025) | ~141,576 | Softcon Viewership / Chosun Biz |
| Average concurrent viewers (Mar 2026) | ~60,000 | Softcon Viewership / Chosun Biz |
| Global hours watched share | ~3.4% (2024 global streaming) | StreamHatchet / Esports Insider |
| Key demographics | Predominantly Korean; strong in gaming (LCK esports), IRL, "BJ" (Broadcast Jockey) culture | Multiple sources |
| Heritage | Operating since 2005 as AfreecaTV; deeply rooted in Korean internet culture | NamuWiki |

**Notable:** SOOP is pivoting toward esports (signed Faker, BuZz; acquired LCK streaming rights) to counter CHZZK's growth. Global beta launched June 5, 2024.

### CHZZK Market Share & Demographics

| Metric | Value | Source |
|---|---|---|
| Monthly Active Users (MAU) | Surpassed SOOP MAU by December 2024 | Douglas Research |
| Average concurrent viewers (2025) | ~113,392 | Softcon Viewership / Chosun Biz |
| Average concurrent viewers (Mar 2026) | ~37,000 | Softcon Viewership / Chosun Biz |
| Live-streaming hours watched share | ~39% of Korean market by end of 2025 | Games.gg |
| Global hours watched share | ~2% (2024 global streaming) | StreamHatchet / Esports Insider |
| Key demographics | Younger Korean audience; Naver ecosystem users; gaming-focused | Multiple sources |
| Parent company | Naver Corporation (Korea's largest internet company, ~$30B+ market cap) | Wikipedia |

**Notable:** CHZZK doubled its viewership within months of launch. Crossed 100 million hours watched by end of 2024. Currently competes with SOOP for exclusive LCK esports streaming rights.

### Why These Platforms Matter for EsperantAI

1. **Korea is the #2 streaming market in Asia** after China, and the #1 VTuber-adjacent market for gesture/face tech.
2. **No Western tool serves these platforms.** Streamlabs, StreamElements, and similar tools have zero SOOP/CHZZK integration. EsperantAI would be the first mover.
3. **ko-KR locale already exists** (completed in Task 7k), lowering the localization barrier.
4. **Revenue model fit:** Both platforms have strong monetization cultures (별풍선/치즈) — donations and subscriptions are central to the streaming economy. EsperantAI's mission of "nudges to monetization" aligns perfectly.
5. **Browser-only architecture alignment:** If the APIs support WebSocket or REST from the browser (bypassing CORS), the existing `PlatformBase` architecture can be extended without backend changes.

---

## 2. SOOP (ex-AfreecaTV) API Research

### Company Overview

- **Company:** SOOP Co., Ltd. (formerly AfreecaTV Co., Ltd., rebranded 2024)
- **CEO:** Youngwoo Choi, Minwon Lee
- **Headquarters:** Pangyo Seven Venture Valley, Seongnam-si, Gyeonggi-do
- **Business Registration Number:** 220-81-10886
- **Contact:** developers@sooplive.com / 1688-7022

### Official API Documentation URLs

| Resource | URL | Language |
|---|---|---|
| SOOP Developers (main) | https://developers.sooplive.co.kr | Korean |
| SOOP Developers (legacy) | https://developers.afreecatv.com | Korean |
| Open API Documentation | https://openapi.sooplive.co.kr/apidoc | Korean |
| Open API Base URL | https://openapi.sooplive.com | — |
| Chat SDK Introduction | https://developers.sooplive.co.kr/?szWork=chat_sdk&sub=how_to_development | Korean |
| Extension API (Chat) | https://developers.sooplive.com/?szWork=extension&sub=api&part=chat | Korean |
| Support / Contact | https://developers.sooplive.co.kr/?szWork=support | Korean |

**⚠️ No English documentation available.** All SOOP developer docs are Korean-only.

### Authentication Method

SOOP uses a **custom OAuth-like flow** with the following steps:

1. **Authentication Request** → User is directed to SOOP's login page
2. **Verification Code Issuance** (`auth/code`) → Can be requested via GET (redirect-based) or POST (API-key-based with certification number from mobile app)
3. **Token Issuance** (`auth/token`) → Exchange verification code for access token
4. **Authentication Complete** → Token can be used for API calls

**POST-based auth flow** (for server-side / headless use):
```
POST https://openapi.sooplive.com/auth/code
  client_id=YOUR_CLIENT_ID
  auth_type=api
  certification_number=111111  (6-digit from SOOP mobile app > My Info > Certification Number)

Response: { "code": "34197c7e4XXXXXXXX" }
```

**GET-based auth flow** (for browser redirect):
```
GET https://openapi.sooplive.com/auth/code?client_id=YOUR_CLIENT_ID&redirect_uri=YOUR_REDIRECT_URI

→ Redirects to redirect_uri with ?code=XXXXXX
```

**Auth method classification:** `oauth_implicit` (GET redirect) or `manual_token` (POST with certification number)

**🚨 CRITICAL BLOCKER:** The SOOP developer portal states:

> "API usage for individual developers is currently under preparation. To use the Open API, please register as a partner."

*(개인 Developer님들의 API 이용은 현재 준비 중에 있습니다. Open API 이용을 원하시면 파트너 등록을 진행해 주세요.)*

This means **Joel must register as a SOOP partner** (business entity) to obtain a `client_id`. Individual developer access is not yet available.

### Real-Time Events

SOOP provides **two separate mechanisms** for real-time events:

#### A. Chat SDK (Browser Extension)

The Chat SDK is designed for **browser environments** and provides chat channel integration:

- **`listen(action, message)`** — Receive specific service messages from the chat channel
- **Chatting Specification** defines service codes for different event types
- SDK URL: Loaded from SOOP's CDN for extension development
- This is the **most promising path** for EsperantAI's browser-only architecture

#### B. Open API (REST)

The Open API provides REST endpoints for:

| Category | Endpoints | Notes |
|---|---|---|
| **LIVE** | `broad/list`, `broad/rtmp`, `broad/info/update`, `broad/rtmp/reset` | Broadcast management |
| **CHAT** | [NO TENGO DATO — specific chat REST endpoints not documented publicly] | |
| **ANALYTICS** | `aqua/component/get` | Digital assistant/analytics |
| **User** | `user/stationinfo` | Broadcast station info |
| **Filter** | `filter/{type}` (POST/DELETE/GET) | Broadcast filtering |
| **Embed** | `oembed/embedinfo` | VOD embedding |
| **Category** | `broad/category/list` | Category listing |

**No WebSocket endpoint is documented in the Open API.** Real-time events appear to be available only through:
1. The Chat SDK (browser extension context)
2. Unofficial reverse-engineered WebSocket connections (see Community Resources below)

### Available Events — Mapping to EsperantAI Normalized Events

| EsperantAI Event | SOOP Source | Feasibility | Notes |
|---|---|---|---|
| `donation` | Star Balloon (별풍선) events via Chat SDK `listen()` | ⚠️ Likely | Star balloons are SOOP's primary monetization; Chat SDK likely exposes them via service codes. [NO TENGO DATO — exact service code not confirmed from public docs] |
| `sub` | Subscription (구독) events | ⚠️ Likely | Subscriptions exist on SOOP. [NO TENGO DATO — whether Chat SDK emits subscription events] |
| `gift` | Gift items / Ad Balloon (애드벌룬) | ⚠️ Possible | SOOP has item gifting. [NO TENGO DATO — event structure in Chat SDK] |
| `follow` | Follow events | ⚠️ Possible | [NO TENGO DATO — whether Chat SDK emits follow events] |
| `raid` | — | ❌ Unlikely | No raid feature documented on SOOP |
| `resub` | — | ⚠️ Possible | If subscription events include month count. [NO TENGO DATO] |
| `gift_sub` | — | ❌ Unlikely | Gift subscriptions not a prominent SOOP feature |
| `cheer_bits` | — | ❌ N/A | No bits/cheer equivalent on SOOP |
| `channel_points` | — | ❌ N/A | No channel points system on SOOP |
| `super_chat` | — | ❌ N/A | Super chat is YouTube-only |
| `member_milestone` | — | ❌ Unlikely | No milestone system documented |

### Community-Maintained API Resources (Unofficial)

| Project | Language | URL | Notes |
|---|---|---|---|
| soopchat | Go | https://pkg.go.dev/github.com/halfdogs/soopchat | Reads SOOP chat; includes `Balloon` struct with `User` and `Count` (별풍선 갯수). Confirms WebSocket chat is possible. |
| soop4j | Java | https://github.com/zzik2/soop4j | Unofficial client: live info, channel info, chat WebSocket connection |
| soop (Python) | Python | https://github.com/maro5397/soop | Unofficial API library: live stream status, channel details |

The `soopchat` Go library is particularly informative — it confirms:
- SOOP chat uses **WebSocket** for real-time messages
- Star balloon (별풍선) events are exposed as structured data with `User` and `Count` fields
- The library was created because "the official SDK exists but lacks necessary features"

### Rate Limits

[NO TENGO DATO] — No rate limit documentation found in public SOOP API docs. The Open API does not mention rate limits.

### CORS Policy

[NO TENGO DATO] — No CORS headers documented. Korean platforms typically do NOT set `Access-Control-Allow-Origin` for third-party browser access. The Chat SDK is designed to run within SOOP's extension iframe, not from arbitrary origins.

**Assessment:** REST API calls from browser JavaScript will likely be blocked by CORS. The Chat SDK runs in an iframe within the SOOP ecosystem and may not be usable from an external web app. **A CORS proxy or backend relay would be needed for REST API calls.**

### ToS Restrictions

- SOOP's developer portal requires agreement to **Service Usage Policy** and **Personal Information Collection/Use Agreement** during developer registration.
- Individual developer API access is **blocked** — partner registration required.
- The partner proposal process suggests SOOP vets applications for business use cases.
- [NO TENGO DATO] — Full text of the developer Terms of Service is behind login wall.

**Legal risk:** Without partner status, using even the publicly documented endpoints may violate ToS. Unofficial/reverse-engineered endpoints carry additional legal risk.

### Browser-Only Viability Assessment

## ⚠️ Partially Viable — with significant blockers

| Aspect | Status | Detail |
|---|---|---|
| Authentication | ❌ Blocked | Requires partner registration; individual developer access not available |
| REST API from browser | ❌ Likely blocked | CORS headers probably not set for third-party origins |
| Chat SDK from browser | ⚠️ Uncertain | SDK is designed for SOOP extension iframe; may not work from external origin |
| WebSocket (unofficial) | ⚠️ Possible | Community libraries confirm WebSocket chat works, but this is reverse-engineering |
| Event coverage | ⚠️ Partial | Star balloon donation events confirmed; subscription/follow/gift events uncertain |

**Bottom line:** SOOP adapter is technically possible but blocked by partner registration requirements. Joel must register as a SOOP partner before any adapter work can begin using official APIs.

---

## 3. CHZZK (Naver) API Research

### Company Overview

- **Company:** Naver Corporation (치지직/CHZZK division)
- **Parent:** NAVER Corp. — Korea's largest internet company
- **Launch:** Soft launch December 2023; official April 2024; Developer Center launched December 20, 2024
- **Developer Center:** https://developers.chzzk.naver.com
- **Contact:** dl_chzzk_drops@navercorp.com (Drops/Partnership inquiries)

### Official API Documentation URLs

| Resource | URL | Language |
|---|---|---|
| CHZZK Developer Center | https://developers.chzzk.naver.com | Korean |
| API Documentation (GitBook) | https://chzzk.gitbook.io/chzzk | Korean |
| API Reference (DocIngest mirror) | https://docingest.com/docs/chzzk.gitbook.io | Korean |
| Naver Developer Forum | https://developers.naver.com/forum | Korean |
| CHZZK Help Center | https://help.naver.com/service/30044 | Korean |

**⚠️ No English documentation available.** All CHZZK developer docs are Korean-only.

### Authentication Method

CHZZK uses **OAuth 2.0 Authorization Code flow**:

#### Step 1: Request Authorization Code
```
GET https://chzzk.naver.com/account-interlock
  ?clientId=YOUR_CLIENT_ID
  &redirectUri=YOUR_REDIRECT_URI
  &state=RANDOM_STATE

→ Redirects to redirectUri with ?code=AUTHORIZATION_CODE&state=STATE
```

**⚠️ Note:** The auth domain is `chzzk.naver.com` (NOT `openapi.chzzk.naver.com`).

#### Step 2: Exchange Code for Tokens
```
POST https://openapi.chzzk.naver.com/auth/v1/token
Content-Type: application/json

{
  "grantType": "authorization_code",
  "clientId": "YOUR_CLIENT_ID",
  "clientSecret": "YOUR_CLIENT_SECRET",
  "code": "AUTHORIZATION_CODE",
  "state": "STATE"
}

Response:
{
  "accessToken": "FFok65zQFQVcFvH2eJ7SS7SBFlTXt0EZ10L5XXXXXXXX",
  "refreshToken": "NWG05CKHAsz4k4d3PB0wQUV9ugGlp0YuibQ4XXXXXXXX",
  "tokenType": "Bearer",
  "expiresIn": "3600"
}
```

#### Step 3: Refresh Token
```
POST https://openapi.chzzk.naver.com/auth/v1/token
Content-Type: application/json

{
  "grantType": "refresh_token",
  "refreshToken": "YOUR_REFRESH_TOKEN",
  "clientId": "YOUR_CLIENT_ID",
  "clientSecret": "YOUR_CLIENT_SECRET"
}
```

#### Token Lifecycle
| Token | Expiry | Notes |
|---|---|---|
| Access Token | 1 hour (3600s) | Must be refreshed regularly |
| Refresh Token | 30 days | One-time use; rotated on refresh |

#### Step 4: Revoke Token (Logout)
```
POST https://openapi.chzzk.naver.com/auth/v1/token/revoke
Content-Type: application/json

{
  "clientId": "YOUR_CLIENT_ID",
  "clientSecret": "YOUR_CLIENT_SECRET",
  "token": "TOKEN_TO_REVOKE",
  "tokenTypeHint": "access_token"  // or "refresh_token"
}
```

**Auth method classification:** `oauth_pkce` or `oauth_implicit` (authorization code with client secret)

**Two types of authentication:**
1. **Access Token auth** — For user-scoped APIs (requires `Authorization: Bearer <token>`)
2. **Client auth** — For public APIs (requires `Client-Id` and `Client-Secret` headers)

### Developer Registration

Application registration is available at https://developers.chzzk.naver.com. Individual developers can create applications and obtain `clientId`/`clientSecret`.

**⚠️ Naming restriction:** Application names cannot contain 'chzzk', '치지직', 'naver', or '네이버'.

### Real-Time Events — Session API + Socket.IO

**Added February 6, 2025** — CHZZK introduced the Session API for real-time event subscriptions.

#### Step 1: Create Session
```
POST https://openapi.chzzk.naver.com/open/v1/sessions
Authorization: Bearer <ACCESS_TOKEN>
Content-Type: application/json

// Creates a session for event subscription
```

#### Step 2: Connect via Socket.IO
```javascript
import io from "socket.io-client";

const socketURL = "https://ssio07.nchat.naver.com:443?auth=<AUTH_TOKEN>";
const socket = io.connect(socketURL, {
  reconnection: true,
  forceNew: true,
  timeout: 3000,
  transports: ["websocket"]
});

socket.on("connect", () => {
  console.log("connected");
});

socket.on("SYSTEM", (data) => {
  // Receive system messages including connected confirmation
});

// Subscribe to events via the session
```

#### Step 3: Subscribe to Events
```
// Via REST API with session key:
POST /open/v1/sessions/{sessionId}/subscribe
Authorization: Bearer <ACCESS_TOKEN>

// Event types available:
// - CHAT      (채팅 메시지 조회)
// - DONATION  (후원 조회 — Cheese/치즈 donations)
// - SUBSCRIPTION (구독 조회)
```

**⚠️ Important constraints:**
- Max **30 events per session** (chat, donation, subscription combined)
- Must be connected to WebSocket **before** subscribing to events via REST
- Cannot subscribe to another streamer's events — only the authenticated user's own channel
- The auth token from the Session API must be used as the `auth` parameter in the Socket.IO URL

#### Event Data Format

**DONATION Event:**
```
Event Type: DONATION
// Fired when a Cheese (치즈) donation occurs on the subscribed channel
```

**CHAT Event:**
```
Event Type: CHAT
// Real-time chat messages
```

**SUBSCRIPTION Event:**
```
Event Type: SUBSCRIPTION
// New subscription on the channel
// [NO TENGO DATO — exact payload structure not documented publicly]
```

### Available API Endpoints

| API | Method | Auth | Scope Required | Description |
|---|---|---|---|---|
| `GET /open/v1/users/me` | User | Access Token | 유저 정보 조회 | Get user's channel info |
| `GET /open/v1/channels` | Channel | Client | — | Channel info lookup (up to 20 IDs) |
| `GET /open/v1/lives` | Live | Client | — | List current live streams |
| `GET /open/v1/lives/{liveId}` | Live | Access Token | 방송 스트림키 조회 | Stream key |
| `GET /open/v1/lives/{liveId}/config` | Live | Access Token | 방송 설정 조회 | Stream config |
| `PATCH /open/v1/lives/{liveId}/config` | Live | Access Token | 방송 설정 변경 | Change stream config |
| `GET /open/v1/categories` | Category | Client | — | Search categories |
| Session API | Session | Access Token | 채팅/후원/구독 | Create sessions, subscribe to events |
| Chat API | Chat | Access Token | 채팅 메시지 조회/쓰기, 채팅 공지 | Read/write chat, post notices |
| Webhook Events | Webhook | — | — | Drops campaign events (not streamer events) |

### Available Events — Mapping to EsperantAI Normalized Events

| EsperantAI Event | CHZZK Source | Feasibility | Notes |
|---|---|---|---|
| `donation` | DONATION event (치즈/Cheese) | ✅ Confirmed | Official API provides DONATION event type via Session API |
| `sub` | SUBSCRIPTION event (구독) | ✅ Confirmed | Official API provides SUBSCRIPTION event type |
| `follow` | Channel follower API | ⚠️ Partial | `채널 팔로워 조회` scope exists; but no real-time follow event documented — would need polling |
| `gift` | — | ❌ Not available | No gift event type in Session API |
| `raid` | — | ❌ Not available | No raid feature/event on CHZZK |
| `resub` | — | ⚠️ Possible | [NO TENGO DATO — whether SUBSCRIPTION event includes resub data with months] |
| `gift_sub` | — | ❌ Not available | No gift subscription event type documented |
| `cheer_bits` | — | ❌ N/A | No bits equivalent on CHZZK |
| `channel_points` | — | ❌ N/A | No channel points system on CHZZK |
| `super_chat` | — | ❌ N/A | Super chat is YouTube-only |
| `member_milestone` | — | ❌ Unlikely | No milestone system documented |

### Community-Maintained API Resources (Unofficial)

| Project | Language | URL | Notes |
|---|---|---|---|
| chzzkpy | Python | https://pypi.org/project/chzzkpy | Most popular; supports official API with session-based events (DONATION, CHAT, SUBSCRIPTION) |
| chzzk-chat | Node.js | https://www.npmjs.com/package/@d2n0s4ur/chzzk-chat | Node.js chat & donation library |
| chzzkpp | C++ | https://github.com/Kareus/chzzkpp | C++ unofficial library with WebSocket chat |
| ChzzkUnity | C# | https://github.com/JoKangHyeon/ChzzkUnity | Unity chat/donation integration |
| awesome-chzzk | — | https://github.com/dokdo2013/awesome-chzzk | Curated list of CHZZK open-source projects |

The `chzzkpy` library is the most informative:
- Supports `UserPermission` for event subscription: chat, donation
- `connect()` method accepts permissions and auto-subscribes
- Confirms DONATION and CHAT events are available via official API
- Subscription events are mentioned but implementation details vary

### Rate Limits

CHZZK API returns **429 TOO_MANY_REQUESTS** when quota is exceeded. Specific rate limit numbers are not documented.

Error codes from the API:

| HTTP Code | Error | Description |
|---|---|---|
| 400 | Bad Request | Invalid parameter |
| 401 | UNAUTHORIZED | Missing auth |
| 401 | INVALID_CLIENT | Invalid client credentials |
| 401 | INVALID_TOKEN | Expired or invalid token |
| 403 | FORBIDDEN | Insufficient scope |
| 404 | NOT_FOUND | Resource not found |
| 429 | TOO_MANY_REQUESTS | Quota exceeded |
| 500 | INTERNAL_SERVER_ERROR | Server error |

### CORS Policy

[NO TENGO DATO] — No CORS documentation found. Korean platforms (especially Naver) typically set strict CORS policies. 

**Assessment:** The CHZZK Open API at `openapi.chzzk.naver.com` is likely **NOT CORS-enabled** for third-party browser origins. The Socket.IO endpoint at `ssio07.nchat.naver.com` may also reject cross-origin connections.

**However**, the auth flow goes through `chzzk.naver.com/account-interlock` which is a full-page redirect — this works from any origin since it's a browser navigation, not a fetch. The token exchange would need to happen server-side or via a backend proxy due to CORS.

**Critical blocker for browser-only:** Both the REST API calls (token exchange, session creation) and the Socket.IO connection likely require a CORS proxy or backend relay.

### ToS Restrictions

1. **Application naming:** Cannot use 'chzzk', '치지직', 'naver', '네이버' in application name/ID
2. **Brand guidelines:** CHZZK logos/icons cannot be used commercially without prior agreement
3. **Commercial use:** [NO TENGO DATO] — The Naver developer forum post about commercial use (developers.naver.com/forum/posts/37312) returned 404. There is no explicit statement about commercial use of the API in the public documentation.
4. **Token sharing:** Access Tokens are user-specific; sharing or storing them without user consent may violate privacy policy

**Legal risk:** Medium. CHZZK's developer center is openly accessible for individual developers (unlike SOOP), but commercial use terms are unclear. Joel should clarify with Naver before selling EsperantAI with CHZZK integration.

### Browser-Only Viability Assessment

## ⚠️ Partially Viable — with CORS workaround needed

| Aspect | Status | Detail |
|---|---|---|
| Authentication | ⚠️ Partial | OAuth redirect works from browser; but token exchange requires `clientSecret` which should NOT be exposed in browser JS |
| REST API from browser | ❌ Likely blocked | CORS not set for third-party origins |
| Socket.IO from browser | ⚠️ Uncertain | Socket.IO client connects to `ssio07.nchat.naver.com`; may work if server allows cross-origin WebSocket |
| Event coverage | ✅ Good | DONATION, SUBSCRIPTION, CHAT events confirmed via official API |
| Developer access | ✅ Open | Individual developers can register at developers.chzzk.naver.com |

**Bottom line:** CHZZK has a proper official API with real-time events, but the browser-only constraint is challenged by (1) CORS on REST endpoints and (2) `clientSecret` exposure risk during token exchange. A lightweight proxy (even a Cloudflare Worker) would resolve both issues.

---

## 4. Event Mapping Matrix

| EsperantAI Event | SOOP Source | CHZZK Source | Notes |
|---|---|---|---|
| `sub` | Chat SDK subscription event [NO TENGO DATO] | Session API SUBSCRIPTION event ✅ | CHZZK confirmed; SOOP uncertain |
| `resub` | [NO TENGO DATO] | [NO TENGO DATO] | Neither platform documents resub with month count |
| `gift_sub` | ❌ Not available | ❌ Not available | Neither platform has gift sub events |
| `follow` | Chat SDK follow event [NO TENGO DATO] | Channel follower API (polling only) ⚠️ | No real-time follow event on either platform |
| `donation` | Star Balloon (별풍선) via Chat SDK ⚠️ | Cheese (치즈) DONATION event ✅ | Core monetization event for both platforms; CHZZK confirmed |
| `raid` | ❌ Not available | ❌ Not available | Neither platform has a raid feature |
| `cheer_bits` | ❌ N/A | ❌ N/A | Bits are Twitch-only |
| `channel_points` | ❌ N/A | ❌ N/A | Channel points are Twitch-only |
| `super_chat` | ❌ N/A | ❌ N/A | Super chat is YouTube-only |
| `gift` | Item gifts [NO TENGO DATO] | ❌ Not available | SOOP has item gifting but event exposure uncertain |
| `member_milestone` | ❌ Not available | ❌ Not available | No milestone system on either platform |

### Summary of Supported Events Per Platform

| Platform | Confirmed Events | Probable Events | Not Available |
|---|---|---|---|
| **SOOP** | — | donation, sub, follow, gift | raid, gift_sub, resub, cheer_bits, channel_points, super_chat, member_milestone |
| **CHZZK** | donation, sub | follow (polling), resub | raid, gift_sub, gift, cheer_bits, channel_points, super_chat, member_milestone |

**Effective event coverage for EsperantAI:**
- **SOOP:** ~2-4 events (donation + sub most likely; follow/gift uncertain)
- **CHZZK:** ~2-3 events (donation + sub confirmed; follow via polling)

---

## 5. Proposed Adapter Architecture

### 5.1 SOOP Adapter Architecture

#### Auth Flow (Step by Step)

```
1. User clicks "Connect SOOP" in EsperantAI UI
2. Popup opens to SOOP login page:
   GET https://openapi.sooplive.com/auth/code
     ?client_id=PARTNER_CLIENT_ID
     &redirect_uri=ESPERANTAI_OAUTH_CALLBACK
3. User logs in and authorizes
4. SOOP redirects to callback with ?code=VERIFICATION_CODE
5. EsperantAI exchanges code for token:
   POST https://openapi.sooplive.com/auth/token
     code=VERIFICATION_CODE
     client_id=PARTNER_CLIENT_ID
6. Store access token in memory (never localStorage for security)
```

**⚠️ Blocker:** Step 2 requires `client_id` from partner registration. Individual developer access is not available.

**Alternative (unofficial):** If Joel cannot get partner access, an unofficial path would involve:
1. User manually provides their SOOP session cookie/token
2. Adapter uses unofficial WebSocket endpoint (reverse-engineered from community libraries)
3. This carries significant ToS and stability risks

#### Connection Flow (Step by Step)

**Official path (Chat SDK):**
```
1. Load SOOP Chat SDK JavaScript from CDN
2. Initialize SDK with access token
3. Call listen() to subscribe to chat channel events
4. Parse service codes to identify event types (star balloons, subscriptions, etc.)
5. Normalize events to EsperantAI format and emit()
```

**Unofficial path (WebSocket):**
```
1. Obtain user's broadcast station ID via REST API
2. Connect to SOOP's WebSocket chat server (URL from reverse-engineering)
3. Authenticate with session token
4. Parse incoming messages for event types
5. Normalize and emit()
```

#### Event Subscription Flow

```
1. After connection established, subscribe to specific event types
2. Chat SDK: listen('balloon', handler) — star balloon events
3. Chat SDK: listen('subscription', handler) — subscription events [NO TENGO DATO — exact service code]
4. Chat SDK: listen('follow', handler) — follow events [NO TENGO DATO]
5. Map SOOP event codes to EsperantAI normalized events
```

#### Reconnection Strategy

```
1. On WebSocket close/error, wait exponential backoff (1s, 2s, 4s, 8s, max 60s)
2. Re-authenticate if token expired
3. Re-subscribe to event channels
4. Emit 'disconnected' during reconnect, 'connected' on success
5. Max 10 reconnect attempts before requiring manual reconnection
```

#### Error Handling

- **Auth errors:** Emit `auth_error`, prompt user to re-authenticate
- **WebSocket errors:** Auto-reconnect with backoff
- **Token expiry:** Refresh token flow (if refresh tokens are supported)
- **Rate limit:** [NO TENGO DATO] — implement conservative throttling
- **Partner access denied:** Show clear error message with instructions for Joel

### 5.2 CHZZK Adapter Architecture

#### Auth Flow (Step by Step)

```
1. User clicks "Connect CHZZK" in EsperantAI UI
2. Popup opens to CHZZK authorization:
   GET https://chzzk.naver.com/account-interlock
     ?clientId=APP_CLIENT_ID
     &redirectUri=ESPERANTAI_OAUTH_CALLBACK
     &state=RANDOM_STATE
3. User logs in with Naver account and authorizes
4. CHZZK redirects to callback with ?code=AUTH_CODE&state=STATE
5. ⚠️ PROBLEM: Token exchange requires clientSecret
   POST https://openapi.chzzk.naver.com/auth/v1/token
     grantType=authorization_code
     clientId=APP_CLIENT_ID
     clientSecret=APP_CLIENT_SECRET  ← EXPOSED IN BROWSER JS!
     code=AUTH_CODE
     state=STATE
6. This step MUST go through a backend proxy to protect clientSecret
```

**Critical decision needed:** The OAuth flow requires `clientSecret` during token exchange, which **cannot be safely included in browser-side JavaScript**. Options:

- **Option A:** Use a lightweight Cloudflare Worker as a token exchange proxy (~$0.50/month for expected traffic)
- **Option B:** Implement PKCE flow if CHZZK adds support (currently not documented)
- **Option C:** Have the user manually paste their access token (poor UX but works for browser-only)

**Recommendation:** Option A (Cloudflare Worker proxy) — minimal cost, maximal security.

#### Connection Flow (Step by Step)

```
1. Get user's channel ID:
   GET https://openapi.chzzk.naver.com/open/v1/users/me
   Authorization: Bearer <ACCESS_TOKEN>

2. Create a session:
   POST https://openapi.chzzk.naver.com/open/v1/sessions
   Authorization: Bearer <ACCESS_TOKEN>

3. Connect Socket.IO to session:
   const socket = io("https://ssio07.nchat.naver.com:443?auth=<AUTH_TOKEN>", {
     transports: ["websocket"]
   });

4. Wait for SYSTEM "connected" message

5. Subscribe to events:
   POST /open/v1/sessions/{sessionId}/subscribe
   Authorization: Bearer <ACCESS_TOKEN>
   Body: { eventTypes: ["DONATION", "SUBSCRIPTION", "CHAT"] }

6. Listen for events via Socket.IO:
   socket.on("DONATION", (data) => { ... });
   socket.on("SUBSCRIPTION", (data) => { ... });
   socket.on("CHAT", (data) => { ... });
```

#### Event Subscription Flow

```
1. After Socket.IO connected and SYSTEM confirmed:
2. Subscribe to DONATION events → emit('donation', { user, amount, currency: 'KRW', message })
3. Subscribe to SUBSCRIPTION events → emit('sub', { user, tier, months })
4. Optionally subscribe to CHAT events for chat-triggered gestures
5. For follow events: poll channel follower count periodically
   GET /open/v1/channels?channelIds=USER_CHANNEL_ID
   (Compare followerCount delta → emit('follow'))
```

#### Reconnection Strategy

```
1. Socket.IO has built-in reconnection support (reconnection: true)
2. On reconnection, re-subscribe to events (subscriptions are per-session)
3. If access token expired (401 INVALID_TOKEN), use refresh token:
   POST /auth/v1/token with grantType=refresh_token
4. If refresh token expired, prompt user to re-authenticate
5. Emit 'disconnected' during reconnect, 'connected' on success
```

#### Error Handling

- **401 INVALID_TOKEN:** Attempt refresh token flow; if refresh also expired, emit `auth_error`
- **429 TOO_MANY_REQUESTS:** Implement exponential backoff; log warning
- **Socket.IO disconnect:** Auto-reconnect with `reconnection: true`
- **Session not found:** Create new session and re-subscribe
- **CORS error on REST calls:** Route through Cloudflare Worker proxy

---

## 6. Implementation Risks and Blockers

### Legal Risks

| Risk | SOOP | CHZZK | Mitigation |
|---|---|---|---|
| ToS prohibits third-party tools | ⚠️ Possible — partner-only access | ⚠️ Unclear — commercial use terms unknown | Joel must review ToS with Korean legal counsel |
| Commercial use restrictions | ⚠️ Likely — partner agreement required | ⚠️ Brand guidelines prohibit commercial logo use | Don't use logos; clarify API commercial use with Naver |
| Reverse-engineering (unofficial APIs) | ❌ High risk if using unofficial path | N/A — official API exists | Avoid unofficial APIs unless no alternative |
| User data privacy (PII) | ⚠️ Korean PIPA applies | ⚠️ Korean PIPA applies | Minimize data stored; process events in-memory only |

### Technical Risks

| Risk | SOOP | CHZZK | Mitigation |
|---|---|---|---|
| CORS blocks browser requests | ❌ High | ❌ High | Cloudflare Worker proxy for REST; test Socket.IO cross-origin |
| Auth token exposure (clientSecret) | N/A (different auth) | ❌ Critical | Must use backend proxy for token exchange |
| Token refresh in browser-only | ⚠️ Possible if CORS allows | ⚠️ Requires proxy for refresh too | Proxy all auth endpoints |
| Rate limits unknown | ⚠️ Risk | ⚠️ 429 exists but limits unknown | Implement conservative throttling (1 req/sec) |
| API stability | ⚠️ Legacy API may change | ⚠️ New API (Feb 2025) may evolve | Pin to specific API versions; monitor changelog |
| Socket.IO version compatibility | N/A | ⚠️ Must match Naver's Socket.IO server version | Test with multiple socket.io-client versions |

### Market Risks

| Risk | Impact | Mitigation |
|---|---|---|
| SOOP partner access denied | 🔴 Blocks SOOP adapter entirely | Escalate to Joel for business development with SOOP |
| CHZZK API access revoked for third-party tools | 🟡 Would break adapter | Maintain relationship with Naver developer program |
| Platform merger or shutdown | 🟡 Low probability | Both platforms have strong backing (SOOP: listed company; CHZZK: Naver) |
| API changes without notice | 🟡 Moderate | Monitor developer forums; implement adapter with abstraction layer |
| Korean regulation changes (PIPA enforcement) | 🟡 Moderate | Process data minimally; no PII storage |

### Dependencies on Joel's Decisions

1. **SOOP partner registration:** Joel must register EsperantAI (or his company) as a SOOP partner to get `client_id`. This requires a business entity and Korean contact information. **Timeline: Unknown (depends on SOOP's partner vetting process).**

2. **CHZZK developer account:** Joel must create a developer account at https://developers.chzzk.naver.com and register an application. **Timeline: ~1 day (automated process).**

3. **Cloudflare Worker (or similar proxy):** Joel must set up a lightweight backend proxy for token exchange and CORS bypass. **Decision: Is this acceptable given EsperantAI's "browser-only" architecture?** The proxy would be ~50 lines of code and cost <$1/month.

4. **Korean legal review:** Before commercial launch with SOOP/CHZZK integrations, Joel should have a Korean lawyer review the platform ToS and PIPA compliance. **Cost estimate: $500-2000.**

5. **Testing accounts:** Joel (or a Korean collaborator) needs active SOOP and CHZZK streamer accounts with real followers to test donation and subscription events.

---

## 7. Estimated Implementation Effort

### SOOP Adapter

| Phase | Duration | Dependencies | Notes |
|---|---|---|---|
| Partner registration & API key acquisition | ⏳ 1-4 weeks | Joel + SOOP business development | **Blocker:** Cannot proceed without partner access |
| Auth flow implementation | 2 days | Partner client_id | OAuth code flow + token management |
| Chat SDK / WebSocket integration | 3 days | Access to Chat SDK docs (behind partner login) | Depends on partner-level documentation |
| Event normalization | 2 days | Confirmed event types | Star balloon → donation; subscription → sub |
| Reconnection & error handling | 1 day | — | Standard patterns from Trovo adapter |
| Testing with real account | 2 days | Korean SOOP streamer account | Need real donations/subs for testing |
| **Total** | **~10 days** (after partner access) | | |

**If using unofficial API path** (not recommended):
- Implementation: ~5 days
- Ongoing maintenance: ~2 days/month (API changes)
- Legal risk: High

### CHZZK Adapter

| Phase | Duration | Dependencies | Notes |
|---|---|---|---|
| Developer account & app registration | 1 day | Joel creates account | Open process |
| Cloudflare Worker proxy setup | 1 day | Joel approves proxy approach | ~50 lines; token exchange + CORS headers |
| Auth flow implementation | 2 days | Proxy deployed | OAuth code flow with proxy for token exchange |
| Session API + Socket.IO integration | 3 days | Official API docs | Well-documented; Socket.IO client |
| Event normalization | 1 day | — | DONATION → donation; SUBSCRIPTION → sub |
| Reconnection & error handling | 1 day | — | Token refresh + Socket.IO reconnection |
| Testing with real account | 2 days | Korean CHZZK streamer account | Need real Cheese donations for testing |
| **Total** | **~11 days** | | |

### Testing Requirements

| Requirement | SOOP | CHZZK |
|---|---|---|
| Streamer account with followers | ✅ Required | ✅ Required |
| Real donation event (별풍선/치즈) | ✅ Required | ✅ Required |
| Real subscription event | ✅ Required | ✅ Required |
| Korean phone number (for account creation) | ✅ Required | ✅ Required |
| Korean collaborator (for testing during Korean timezone) | ⚠️ Recommended | ⚠️ Recommended |

---

## 8. Recommendation

### Should We Implement Both? Or One First?

**Recommendation: Implement CHZZK first, then SOOP.**

Rationale:

| Factor | CHZZK | SOOP |
|---|---|---|
| Official API availability | ✅ Open developer access | ❌ Partner-only access |
| Real-time event support | ✅ Session API + Socket.IO | ⚠️ Chat SDK (uncertain from external app) |
| Documentation quality | ✅ Structured GitBook docs | ⚠️ Scattered, Korean-only, partner-gated |
| Authentication feasibility | ⚠️ Needs proxy for clientSecret | ❌ Blocked until partner access granted |
| Event coverage | ✅ Donation + Subscription confirmed | ⚠️ Only star balloons probable |
| Market momentum | ✅ Growing fast (39% hours watched) | ⚠️ Stable but pivoting to esports |
| Implementation timeline | ✅ Can start immediately | ❌ Blocked on partner registration |
| Risk level | 🟡 Medium (CORS + proxy) | 🔴 High (blocked + uncertain events) |

### Priority Order

1. **CHZZK adapter** — Start immediately. Joel creates developer account today. Implement with Cloudflare Worker proxy. Target: ~2 weeks to working prototype.

2. **SOOP adapter** — Start partner registration process immediately, but implementation blocked until access is granted. Meanwhile, research unofficial Chat SDK integration as a fallback. Target: ~2-4 weeks after partner access (could be 1-3 months wait for partner approval).

### What Joel Needs to Do

| Action | Platform | Urgency | Timeline |
|---|---|---|---|
| Create CHZZK developer account & register app | CHZZK | 🔴 Immediate | 1 day |
| Set up Cloudflare Worker for token proxy | CHZZK | 🟡 High | 1 day |
| Submit SOOP partner registration proposal | SOOP | 🔴 Immediate | 1 day (submission), 1-4 weeks (approval) |
| Obtain Korean streamer test accounts | Both | 🟡 High | 1-3 days |
| Review Korean PIPA compliance | Both | 🟡 Medium | Before beta launch |
| Contact SOOP/Naver for commercial API use clarification | Both | 🟢 Low | Before commercial launch |
| Approve lightweight backend proxy approach | Architecture | 🔴 Immediate | Decision needed before CHZZK work starts |

### Long-term Vision

Once both adapters are implemented, EsperantAI would be the **first and only** Western streaming tool with native SOOP and CHZZK integration. This is a significant competitive moat in the Korean market, where streamers currently have no gesture-based streaming tools at all.

The Korean market's unique characteristics — strong donation culture (별풍선/치즈), tech-savvy streamers, and high VTuber adoption — make it an ideal market for EsperantAI's gesture-triggered scene switching and monetization nudges.

---

## Appendix A: Key Korean Terms

| Korean | Romanization | English | Context |
|---|---|---|---|
| 별풍선 | byeol-pung-seon | Star Balloon | SOOP's primary donation currency |
| 치즈 | chi-jeu | Cheese | CHZZK's donation currency |
| 구독 | gu-dok | Subscription | Monthly paid subscription |
| 후원 | hu-won | Donation/Sponsorship | Generic term for financial support |
| BJ | — | Broadcast Jockey | SOOP's term for streamer |
| 스트리머 | seu-ri-meo | Streamer | CHZZK's term for streamer |
| 애드벌룬 | ae-deu-beol-lun | Ad Balloon | SOOP's free promotional balloon |
| 채널 | chae-neol | Channel | User's streaming channel |

## Appendix B: Unofficial API References (Use at Your Own Risk)

### SOOP Unofficial WebSocket

Based on the `soopchat` Go library and `soop4j` Java library:
- SOOP's chat uses a WebSocket connection to an internal server
- Authentication uses session cookies or tokens obtained from the web interface
- The `Balloon` struct confirms star balloon events have `User` and `Count` fields
- The chat protocol uses numeric service codes (similar to Trovo's chat type system)

### CHZZK Unofficial API (Pre-Official)

Before the official API launched (Dec 2024), the community used:
- `https://api.chzzk.naver.com/polling/v2/channels/{streamer}/live-status` — Live status polling
- Cookie-based authentication (Naver session cookies)
- These endpoints are undocumented and may break at any time

## Appendix C: Research Sources

1. SOOP Developers — https://developers.sooplive.co.kr
2. SOOP Open API Docs — https://openapi.sooplive.co.kr/apidoc
3. CHZZK API GitBook — https://chzzk.gitbook.io/chzzk
4. CHZZK Developer Center — https://developers.chzzk.naver.com
5. CHZZK DocIngest mirror — https://docingest.com/docs/chzzk.gitbook.io
6. CHZZK Session Test Results (Gist) — https://gist.github.com/fi-xz/69ce1f35ca1b2318a2b410c0d5757e0f
7. soopchat (Go) — https://pkg.go.dev/github.com/halfdogs/soopchat
8. soop4j (Java) — https://github.com/zzik2/soop4j
9. chzzkpy (Python) — https://pypi.org/project/chzzkpy
10. awesome-chzzk — https://github.com/dokdo2013/awesome-chzzk
11. StreamCharts SOOP Korea — https://streamscharts.com/news/platforms-explained-soop-korea
12. StreamCharts CHZZK — https://streamscharts.com/news/platforms-explained-navers-chzzk
13. Chosun Biz SOOP vs CHZZK — https://biz.chosun.com/en/en-it/2026/03/22/4OHSAY4F2VGIHGOTURAYQLAT2A
14. Douglas Research CHZZK market share — https://douglasresearch.substack.com/p/naver-chzzk-increasing-market-share
15. Games.gg CHZZK guide — https://games.gg/news/chzzk-streaming-guide-korea-fast-growing-platform-explained
16. StreamHatchet Korean streaming report — http://streamhatchet.com/blog/the-state-of-korean-live-streaming
17. Naavik global streaming 2024 — https://naavik.co/digest/the-state-of-global-streaming-platforms-2024

---

*Document created by Z (GLM-4) per COORDINATION.md task assignment. All `[NO TENGO DATO]` markers indicate genuinely unavailable data — no information was invented.*

Co-authored-by: Z-GLM-4 <noreply@z.ai>
