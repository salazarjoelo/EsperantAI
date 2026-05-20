# EsperantAI — 사용자 매뉴얼

> **정직한 제스처.** 전용 추가 하드웨어 없이 얼굴과 손동작으로 스트리밍 소프트웨어를 제어하세요.

**버전**: 3.0 · **언어**: 한국어 (추가 14개 언어 번역 제공)

**기술 검증**: OBS Studio, Streamlabs Desktop, vMix, PRISM Live Studio, XSplit, Twitch, YouTube Live, Kick, Trovo, StreamElements의 2026년 5월 20일 기준 공식 문서를 바탕으로 검토했습니다. 세부 내용: [`docs/MANUAL_PLATFORM_AUDIT_2026-05.md`](MANUAL_PLATFORM_AUDIT_2026-05.md).

---

## 목차

1. [EsperantAI란?](#esperantai란)
2. [최소 사양](#최소-사양)
3. [구매 및 활성화](#구매-및-활성화)
4. [처음 사용하기](#처음-사용하기)
5. [스트리밍 소프트웨어 연결](#스트리밍-소프트웨어-연결)
6. [제스처와 씬 설정](#제스처와-씬-설정)
7. [제스처 카테고리](#제스처-카테고리)
8. [스트리밍 플랫폼 연결](#스트리밍-플랫폼-연결)
9. [이벤트 + 제스처 조합 (고급)](#이벤트--제스처-조합-고급)
10. [감도와 데드존](#감도와-데드존)
11. [키보드 단축키](#키보드-단축키)
12. [트리거 기록](#트리거-기록)
13. [언어 변경](#언어-변경)
14. [라이선스 관리](#라이선스-관리)
15. [문제 해결](#문제-해결)
16. [개인정보](#개인정보)
17. [지원](#지원)

---

## EsperantAI란?

EsperantAI는 인공지능으로 얼굴과 손 제스처를 실시간 감지하고, 이를 스트리밍 소프트웨어 명령으로 변환하는 **웹 애플리케이션**입니다. 카메라 영상은 사용자의 브라우저 안에서 로컬로 처리됩니다.

![EsperantAI 로컬 흐름](assets/manual/01-esperantai-flow.svg)

다음 방송 프로그램과 함께 사용할 수 있습니다.

- **OBS Studio** 28+
- **Streamlabs Desktop**
- **vMix**
- **PRISM Live Studio**
- **XSplit Broadcaster** (베타)

플랫폼 이벤트를 받아 사용자의 제스처와 조합할 수도 있습니다.

- **Twitch**: EventSub WebSocket을 통한 직접 지원.
- **YouTube Live**: YouTube Data API v3를 통한 직접 지원. 활성 라이브 방송과 사용 가능한 할당량이 필요합니다.
- **Kick**: supported through the local **Streamer.bot bridge**. Streamer.bot receives Kick through its official integration and EsperantAI listens to those events through local WebSocket.
- **StreamElements**: 계정의 토큰/JWT를 사용하는 멀티플랫폼 브리지.
- **Trovo**: native support through Trovo OAuth + chat WebSocket.

### 왜 "정직한 제스처"인가요?

기본 얼굴 표정과 머리 회전은 **모든 인간 문화권에서 보편적**입니다(Paul Ekman, 1972). 거짓말하지 않고, 지역에 따라 의미가 크게 달라지지 않습니다. EsperantAI는 이런 제스처를 "🌐 보편" 제스처로 부르며, 나라에 따라 의미가 달라질 수 있는 "⚠️ 문화권별" 제스처(손동작)와 구분합니다.

어떤 제스처를 사용할지는 시청자층에 맞춰 직접 선택합니다.

---

## 최소 사양

### 하드웨어

- **USB 웹캠** 아무 모델이나 사용 가능(권장: 1080p 이상)
- **CPU**: 최근 5년 이내의 4코어 이상 프로세서
- **RAM**: 최소 8 GB. 동시에 스트리밍한다면 16 GB 권장
- **GPU**: WebGL 지원 GPU. 최신 내장 그래픽도 작동합니다

### 소프트웨어

- **운영 체제**: Windows 10/11, macOS 12+, 또는 최신 커널의 Linux
- **브라우저**: Chrome 90+, Edge 90+, 또는 Firefox 100+
- **스트리밍 소프트웨어**(최소 1개): OBS Studio 28+, Streamlabs Desktop, vMix, PRISM, XSplit

### 인터넷

- **라이선스 활성화**와 **7일마다 이루어지는 재검증**에 필요합니다
- 오프라인에서도 **최대 7일** 동안 사용할 수 있습니다(유예 기간)

---

## 구매 및 활성화

1. **https://edugame.digital**에 접속합니다.
2. **"라이선스 구매"**를 클릭합니다.
3. LemonSqueezy에서 결제를 완료합니다(카드, PayPal 등).
4. 다음 내용이 포함된 이메일을 받습니다.
   - **라이선스 키**(형식: `XXXX-XXXX-XXXX-XXXX-XXXX`)
   - EsperantAI 사용 링크
5. 브라우저에서 EsperantAI를 엽니다.
6. 활성화 화면이 표시되면 라이선스 키를 붙여넣습니다.
7. **"라이선스 활성화"**를 클릭합니다.
8. 완료입니다.

### 몇 대의 기기에서 사용할 수 있나요?

하나의 라이선스는 **최대 3대의 기기**에서 활성화할 수 있습니다. 다른 기기로 라이선스를 옮기려면 다음 순서로 진행합니다.

1. 기존 기기: **고급** 패널 → **라이선스** → **이 기기에서 비활성화**
2. 새 기기: 평소와 같이 활성화

---

## 처음 사용하기

### 1단계: 카메라 접근 허용

EsperantAI를 처음 열면 브라우저가 카메라 접근 권한을 요청합니다. **허용**을 선택하세요.

> 중요: EsperantAI는 사용자의 영상을 어떤 서버로도 전송하지 않습니다. 처리는 100% 사용자의 기기에서 로컬로 이루어집니다.

### 2단계: 카메라 선택

카메라가 여러 대라면 카메라 드롭다운 메뉴에서 사용할 카메라를 선택합니다.

### 3단계: 감지 확인

왼쪽 패널에 얼굴이 표시됩니다. EsperantAI가 얼굴을 감지하면 Yaw / Pitch / Roll 표시기에 값이 나타나기 시작합니다.

### 4단계: 보정 마법사 (Pro+)

Pro 또는 Pro+ 라이선스가 있으면 처음 사용할 때 **보정 마법사**가 자동으로 실행됩니다. 자연스러운 움직임 범위를 측정하고 최적 감도를 설정합니다. 나중에도 **재보정** 버튼으로 언제든 다시 실행할 수 있습니다.

---

## 스트리밍 소프트웨어 연결

![스트리밍 소프트웨어 연결 매트릭스](assets/manual/02-software-setup.svg)

이 섹션의 모든 연결은 로컬 연결입니다. EsperantAI는 같은 컴퓨터에서 실행 중인 방송 프로그램과 `127.0.0.1`을 통해 통신합니다.

### OBS Studio

1. OBS에서 **도구 → WebSocket 서버 설정**을 엽니다.
2. WebSocket 서버를 활성화합니다. OBS Studio 28+에는 obs-websocket이 이미 포함되어 있습니다.
3. EsperantAI에서 **연결** 패널을 엽니다.
4. 스트리밍 소프트웨어: **OBS Studio**를 선택합니다.
5. WebSocket URL: `ws://127.0.0.1:4455`(기본값)
6. 비밀번호: OBS에서 비밀번호를 켰다면 그 값을 입력합니다.
7. **연결**을 클릭합니다.

### Streamlabs Desktop

1. Streamlabs Desktop에서 **Settings → Remote Control**을 엽니다.
2. 로컬 원격 제어를 활성화합니다.
3. Remote Control 화면의 **API Token**을 복사합니다.
4. EsperantAI에서 스트리밍 소프트웨어를 **Streamlabs Desktop**으로 선택합니다.
5. API Token을 붙여넣습니다.
6. 포트: `59650`(기본값)
7. **연결**을 클릭합니다.

### vMix

1. vMix에서 **Settings → Web Controller**를 엽니다.
2. Web Controller를 활성화합니다. 기본 포트는 `8088`입니다.
3. EsperantAI에서 스트리밍 소프트웨어를 **vMix**로 선택합니다.
4. 호스트: `127.0.0.1`
5. 포트: `8088`
6. **연결**을 클릭합니다.

> 참고: 현재 EsperantAI의 vMix 어댑터는 vMix의 로컬 HTTP API를 사용합니다. Web Controller가 브라우저에서 접근할 수 없도록 네트워크 규칙이나 호환되지 않는 인증 방식으로 보호되어 있으면 연결이 실패할 수 있습니다.

### PRISM Live Studio

1. **PRISM Live Studio v4.0.5+**를 사용합니다.
2. OBS/PRISM과 호환되는 `obs-websocket` 플러그인을 수동으로 설치합니다.
3. PRISM의 공식 OBS 플러그인 안내에 따라 PRISM 플러그인 폴더에 복사합니다.
4. PRISM을 다시 시작합니다.
5. **도구 → WebSocket 서버 설정**에서 WebSocket을 활성화합니다.
6. EsperantAI에서 스트리밍 소프트웨어를 **PRISM Live Studio**로 선택합니다(OBS와 같은 방식으로 작동).

> 중요한 차이: OBS 28+에는 obs-websocket이 이미 포함되어 있습니다. PRISM은 플러그인을 직접 설치해야 합니다.

### XSplit Broadcaster (베타)

1. **XSplit XJS / Remote xjs**와 호환되는 로컬 브리지를 설치하거나 활성화합니다.
2. 해당 브리지가 로컬 WebSocket URL을 노출하는지 확인합니다.
3. EsperantAI에서 스트리밍 소프트웨어를 **XSplit**으로 선택합니다.
4. Remote xjs 프록시 URL: `ws://127.0.0.1:5555/xjs`(기본값)
5. **연결**을 클릭합니다.

> XSplit은 **베타/고급** 지원 상태입니다. 호환성은 설치된 로컬 XJS 브리지에 따라 달라지며, 고급 기능은 제한될 수 있습니다.

---

## 제스처와 씬 설정

연결이 완료되면 방송 소프트웨어의 실제 씬이 **트리거** 패널의 드롭다운 메뉴에 자동으로 표시됩니다.

### 기본 매핑

1. 각 제스처(예: "왼쪽 보기")마다 드롭다운에서 씬을 선택합니다.
2. 해당 제스처를 취하고 약 150ms 동안 안정적으로 유지하면 EsperantAI가 스트리밍 소프트웨어의 씬을 전환합니다.
3. 전환은 자동이며 거의 즉시 실행됩니다.

### 멀티 액션 (Pro+)

Pro 또는 Pro+ 라이선스가 있으면 하나의 제스처로 **여러 동작**을 동시에 실행할 수 있습니다.

- 씬 전환 + 소리 재생 + 오버레이 표시 + 채팅 메시지 전송

### 카테고리 활성화 / 비활성화

각 카테고리에는 별도의 "활성화" 체크박스가 있습니다.

- 🧠 **머리 회전**(보편 — 기본 활성화)
- 📏 **얼굴 거리**(카메라에 가까이 가기 또는 멀어지기)
- 👁️ **시선**(눈만 움직이기)
- 😀 **감정**(미소, 놀람, 화남, 중립)
- 👁️‍🗨️ **두 번 깜박임**
- ✋ **손 제스처**(문화권별 — 기본 비활성화)

필요하지 않은 카테고리를 끄면 CPU 사용량을 줄일 수 있습니다.

---

## 제스처 카테고리

### 🌐 보편 제스처 (어느 문화권에서도 같은 의미)

| 제스처 | 축 | 활성화 방법 |
|---|---|---|
| 중앙 | — | 정면을 보고 얼굴을 안정적으로 유지 |
| 왼쪽 보기 | yaw 음수 | 머리를 왼쪽으로 돌리기 |
| 오른쪽 보기 | yaw 양수 | 머리를 오른쪽으로 돌리기 |
| 위 보기 | pitch 음수 | 얼굴을 들어 올리기 |
| 아래 보기 | pitch 양수 | 얼굴을 아래로 내리기 |
| 왼쪽으로 기울이기 | roll 음수 | 머리를 왼쪽 어깨 쪽으로 기울이기 |
| 오른쪽으로 기울이기 | roll 양수 | 머리를 오른쪽 어깨 쪽으로 기울이기 |
| 가까이 가기 | 거리 | 카메라에 가까이 가기 |
| 멀어지기 | 거리 | 카메라에서 멀어지기 |
| 시선 | 시선 | 머리는 중앙에 둔 채 눈만 움직이기 |
| 미소 | 감정=행복 | 또렷하게 미소 짓기 |
| 놀람 | 감정=놀람 | 놀란 표정 짓기 |
| 화남 | 감정=화남 | 화난 표정 짓기 |
| 중립 | 감정=중립 | 편안한 얼굴 |
| 두 번 깜박임 | 깜박임 | 양쪽 눈을 빠르게 두 번 감기(< 700ms) |

### ⚠️ 문화권별 제스처 (나라에 따라 의미가 달라질 수 있음)

| 제스처 | 서구권에서의 의미 | 다른 문화권에서의 주의점 |
|---|---|---|
| 👍 엄지 올리기 | 승인 | 중동 / 서아시아: 모욕으로 받아들여질 수 있음 |
| ✌️ 평화 | 평화 / 승리 | 영국 / 아일랜드 / 호주(손바닥이 안쪽): 모욕 |
| 🤘 록 사인 | 록 / 메탈 | 이탈리아(손바닥이 아래): "cornuto"(모욕) |
| 👌 OK | OK / 완벽 | 브라질 / 튀르키예 / 독일: 모욕으로 받아들여질 수 있음 |
| ✊ 주먹 | 정치적 맥락에 따라 다름 | — |
| 🖐️ 펼친 손바닥 | "멈춤" 또는 인사 | 그리스(상대에게 mountza): 강한 모욕 |
| ☝️ 가리키기 | 지시 | 아시아: 손가락으로 가리키는 행동은 무례할 수 있음 |

EsperantAI는 인터페이스에서 각 제스처에 해당하는 배지를 표시합니다. 전 세계 시청자층을 고려해 사용할 제스처를 선택하세요.

### 🙏 합장 (合掌)

특별한 제스처입니다. 기도나 예를 갖춘 인사처럼 양손바닥을 가슴 앞에서 맞댑니다. 동아시아 문화권에서 존중이나 감사를 표현할 때 흔히 쓰입니다. 6개의 랜드마크 검사를 통해 높은 신뢰도로 감지됩니다.

---

## 스트리밍 플랫폼 연결

EsperantAI가 이벤트(도네이션, 구독, 레이드, 팔로우 또는 Super Chat)를 받으려면 방송 중인 플랫폼을 연결하세요.

![플랫폼별 이벤트 상태](assets/manual/03-platform-events.svg)

### Twitch

1. https://dev.twitch.tv/console 에서 Client ID를 만듭니다.
2. 리디렉트 URI를 등록합니다: `https://edugame.digital/oauth-callback.html`(또는 로컬 URL)
3. EsperantAI에서 **플랫폼 이벤트** 패널 → **Twitch EventSub**를 엽니다.
4. Client ID를 붙여넣습니다.
5. **연결**을 클릭합니다.
6. Twitch 인증 창이 열리면 권한을 허용합니다.
7. 창이 닫히고 "Twitch 연결됨"이 표시됩니다.

EsperantAI는 EventSub WebSocket을 사용합니다. 브라우저에는 어떤 Client Secret도 붙여넣지 마세요.

### YouTube Live

1. https://console.cloud.google.com 에서 사용자 인증 정보를 만듭니다.
2. YouTube Data API v3를 활성화합니다.
3. OAuth Client ID를 만듭니다(유형: 웹 애플리케이션).
4. Twitch와 같은 리디렉트 URI를 등록합니다.
5. EsperantAI에서 **플랫폼 이벤트** 패널 → **YouTube Live**를 엽니다.
6. Client ID를 붙여넣고 **연결**을 클릭합니다.

YouTube 요구 사항: 채팅을 사용할 수 있는 활성 라이브 방송이 있어야 하며, Google Cloud 프로젝트에 채팅 조회에 필요한 할당량이 충분해야 합니다.

### Kick via Streamer.bot

EsperantAI supports Kick through the **Streamer.bot bridge**. This is the recommended sales-ready route because it does not expose Kick secrets in the browser and does not rely on reverse engineering.

1. Install Streamer.bot 1.0.0 or newer.
2. In Streamer.bot, connect your Kick account.
3. In Streamer.bot: **Servers/Clients -> WebSocket Server** and enable the server.
4. Use `127.0.0.1`, port `8080`, and endpoint `/`, unless you changed those values.
5. In EsperantAI: **Platform Events** panel -> **Kick via Streamer.bot**.
6. Click **Connect**.

Events available through this bridge: follows, subscriptions, resubscriptions, gift subscriptions, and redemptions supported by Streamer.bot. Native official Kick backend/webhooks remain an advanced roadmap item.

### StreamElements (멀티플랫폼 브리지)

이미 StreamElements 계정이 있다면 여러 플랫폼의 알림을 위한 브리지로 사용할 수 있습니다.

1. https://streamelements.com/dashboard/account/channels 로 이동합니다.
2. JWT Token을 복사합니다.
3. EsperantAI에서 **플랫폼 이벤트** 패널 → **StreamElements**를 엽니다.
4. JWT를 붙여넣고 **연결**을 클릭합니다.

이 토큰은 비공개로 보관하세요. StreamElements 계정의 비밀번호처럼 취급해야 합니다.

### Trovo

EsperantAI supports Trovo natively through OAuth and Trovo's official chat WebSocket.

1. Create an app in the Trovo developer portal.
2. Register the EsperantAI redirect URI: `oauth-callback.html` on the same domain where you open the app.
3. In EsperantAI: **Platform Events** panel -> **Trovo**.
4. Paste your Client ID and click **Connect**.
5. Authorize the requested permissions.

Available events: subscriptions, resubscriptions, gift subscriptions, follows, raids, spells/gifts, and magic chat.

---

## 이벤트 + 제스처 조합 (고급)

EsperantAI의 핵심은 **플랫폼 이벤트**와 **사용자의 제스처**를 확인 단계로 결합하는 것입니다.

![이벤트와 제스처 조합 흐름](assets/manual/04-event-gesture-combo.svg)

### 예시: 엄지 올리기로 도네이션에 감사하기

1. **이벤트 트리거** 패널 → "💰 도네이션" 행
2. ✅ 활성화
3. 씬: `Escena_Gracias`
4. 필수 제스처: `👍 엄지 올리기`

**라이브 흐름**:

- 도네이션이 들어옴 → EsperantAI가 "제스처 대기 중..."을 표시
- 5초 안에 👍을 해야 함
- 제스처를 하면 → `Escena_Gracias`로 전환 + 설정된 다른 동작 실행
- 하지 않으면 → 자동으로 취소

### 필수 제스처 없음 (자동 실행)

"필수 제스처"를 `— 없음 —`으로 두면 이벤트가 즉시 동작을 실행합니다.

유용한 경우:

- 레이드가 들어오면 자동으로 축하 씬으로 전환
- 누군가 구독하면 자동으로 오버레이 표시

---

## 감도와 데드존

### 감도

임계값은 제스처가 실행되려면 얼마나 크게 움직여야 하는지를 제어합니다.

- **Yaw**: 머리를 좌우로 얼마나 돌려야 하는지(기본값: 0.15 rad ≈ 8.6°)
- **Pitch 위/아래**: 세로 방향 기울기
- **Roll**: 좌우 방향 기울기

값을 높이면 더 뚜렷한 제스처가 필요합니다. 값을 낮추면 더 민감해집니다.

### 데드존 (피로 방지)

거의 중앙에 있을 때(yaw < 0.05, pitch < 0.05, roll < 0.08)는 **아무것도 실행되지 않습니다**. 자연스럽게 움직여도 미세한 움직임이 트리거를 켜지 않도록 도와줍니다.

### 안정 프레임

`안정 프레임` = 트리거되기 전에 제스처를 몇 프레임 연속으로 유지해야 하는지. 기본값은 5프레임입니다(30fps 기준 약 150ms).

트리거가 너무 쉽게 켜진다면 값을 올리세요. 더 빠른 반응이 필요하면 낮추세요.

### 쿨다운

`쿨다운 (ms)` = 씬 전환 사이의 최소 시간. 기본값은 500ms입니다.

빠르게 흔들릴 때 전환이 불안정해지는 것을 막습니다.

---

## 키보드 단축키

| 키 | 동작 |
|---|---|
| `스페이스` | 감지 일시정지 / 재개 |
| `C` | 수동으로 중앙 씬으로 이동 |
| `R` | 소프트웨어에서 씬 목록 다시 불러오기 |
| `Esc` | 연결 해제 |

---

## 트리거 기록

**고급 → 트리거 기록** 패널에는 최근 실행된 50개의 동작이 표시됩니다.

- ✓ 초록 = 성공
- ✗ 빨강 = 실패
- · 회색 = 대기 중

DevTools를 열지 않고도 무엇이 실행되었는지 확인할 때 유용합니다.

**CSV 내보내기**: 오프라인 분석을 위해 기록을 다운로드합니다.

**지우기**: 기록을 삭제합니다(다른 항목에는 영향을 주지 않습니다).

---

## 언어 변경

EsperantAI는 운영 체제의 언어를 자동으로 감지합니다. 수동으로 변경하려면 다음을 사용하세요.

- 오른쪽 위: 언어 드롭다운 메뉴
- 원하는 언어 선택
- 인터페이스가 즉시 업데이트됩니다

사용 가능한 언어:

- 🇺🇸 English
- 🇪🇸 Español (España)
- 🇲🇽 Español (México)
- 🇧🇷 Português (Brasil)
- 🇫🇷 Français
- 🇩🇪 Deutsch
- 🇯🇵 日本語
- 🇷🇺 Русский
- 🇨🇳 中文
- 🇮🇹 Italiano
- 🇵🇱 Polski
- 🇸🇦 العربية (RTL)
- 🇰🇷 한국어
- 🇮🇳 हिन्दी
- 🇮🇩 Bahasa Indonesia

현재 인터페이스 파일에는 15개 언어가 번역되어 있습니다.

---

## 라이선스 관리

**고급 → 라이선스** 패널:

- **상태 보기**: 유효 / 무효
- **연결된 고객 이메일 보기**
- **마지막 온라인 검증 보기**
- **이 기기에서 비활성화**: PC를 바꾸기 전이나 사용 가능한 3개 슬롯 중 하나를 비울 때 사용합니다

## 문제 해결

### 라이선스 키를 붙여넣었는데도 "활성화 필요"가 계속 표시됨

- 키 전체를 복사했는지 확인합니다(하이픈으로 구분된 4자리 5그룹).
- 인터넷 연결을 확인합니다(첫 활성화에는 온라인 검증이 필요합니다).
- 이미 3대의 기기에서 활성화했다면 먼저 한 대를 비활성화합니다.
- 문제가 계속되면 soporte@edugame.digital 로 문의하세요.

### 얼굴이 보이는데도 "얼굴 검색 중..."이 계속 표시됨

- 조명을 개선하세요. 얼굴이 충분히 밝아야 합니다.
- 카메라에 조금 더 가까이 가세요(40-80 cm가 적절합니다).
- GPU를 사용하는 다른 탭을 닫으세요(Chrome은 탭이 너무 많으면 GPU 사용을 제한할 수 있습니다).
- Chrome 메모리 절약 모드가 켜져 있다면 이 탭에서는 끄세요.

### 드롭다운 메뉴에 씬이 나타나지 않음

- 스트리밍 소프트웨어에 연결되어 있는지 확인합니다(초록색 "연결됨" 배지).
- `R`을 눌러 씬 목록을 다시 불러옵니다.
- 그래도 비어 있다면 연결을 끊었다가 다시 연결합니다.
- vMix에서는 Web Controller가 활성화되어 있고 `http://127.0.0.1:8088/api/`에서 접근 가능한지 확인합니다.
- PRISM에서는 obs-websocket 플러그인이 설치되어 있고 활성화되어 있는지 확인합니다.
- XSplit에서는 로컬 XJS 브리지가 실행 중인지 확인합니다.

### 제스처를 하지 않았는데 씬 전환이 실행됨

- **감도** 패널에서 yaw / pitch / roll 임계값을 올립니다.
- `안정 프레임`을 5에서 8-10으로 올립니다.
- 데드존이 설정되어 있는지 확인합니다(yaw 0.05, pitch 0.05, roll 0.08).
- 화면 안에 다른 사람이 없는지 확인합니다(얼굴이 여러 개 있으면 불안정할 수 있습니다).

### 감지가 느림

- 게임, 영상 편집 프로그램처럼 무거운 앱을 닫습니다.
- 전용 GPU가 있다면 내장 그래픽이 아니라 전용 GPU를 사용 중인지 확인합니다.
- 카메라가 4K라면 해상도를 낮춥니다(감지에는 1080p가 적절합니다).

### EsperantAI는 "씬 변경됨"이라고 표시하지만 OBS가 반응하지 않음

- 드롭다운 메뉴의 씬 이름이 OBS의 씬 이름과 정확히 같은지 확인합니다(대소문자 구분).
- 해당 씬이 다른 씬 컬렉션에 있지 않은지 확인합니다.
- **트리거 기록** 패널을 확인합니다. ✗ 빨강이 표시되면 구체적인 오류가 있습니다.

### "OBS에 연결할 수 없음 — 수동으로 연결하세요" 오류

- OBS가 열려 있는지 확인합니다.
- OBS에서 WebSocket이 활성화되어 있는지 확인합니다.
- OBS에서 비밀번호를 설정했다면 정확히 일치해야 합니다.
- 일부 백신 프로그램이 4455 포트를 차단할 수 있습니다. 예외를 추가하세요.

### Twitch 또는 YouTube가 연결되지 않음

- 플랫폼 콘솔의 리디렉트 URI가 `oauth-callback.html`의 URL과 정확히 일치하는지 확인합니다.
- EsperantAI를 사용하는 도메인에서 팝업 창을 허용합니다.
- Twitch에서는 Client ID만 사용합니다. Client Secret은 붙여넣지 마세요.
- YouTube에서는 YouTube Data API v3가 활성화되어 있고 활성 라이브 방송이 있는지 확인합니다.

### Kick does not connect through Streamer.bot

Confirm that Streamer.bot 1.0.0+ is open, Kick is connected inside Streamer.bot, and **WebSocket Server** is enabled. Use `127.0.0.1:8080/` unless you changed the configuration. If Streamer.bot requires a password, enter the same password in EsperantAI.

---

## 개인정보

### EsperantAI가 하지 않는 일

- ❌ 영상을 어떤 서버에도 보내지 않습니다
- ❌ 영상이나 캡처를 저장하지 않습니다
- ❌ 생체 정보를 원격으로 수집하지 않습니다
- ❌ 데이터를 광고주나 제3자와 공유하지 않습니다

### EsperantAI가 처리하는 일

- ✅ 브라우저 안에서 로컬 얼굴 감지(Human.js + WebGL)
- ✅ OBS / Streamlabs / vMix / PRISM / XSplit로의 로컬 연결(loopback `127.0.0.1`)
- ✅ 라이선스 키의 주기적 검증(7일마다)
- ✅ Twitch/YouTube/Kick/StreamElements를 연결한 경우: 브라우저의 로컬 또는 세션 저장소에 플랫폼 토큰 저장

전체 세부 내용은 `docs/PRIVACY.html`에서 확인할 수 있습니다.

---

## 지원

- 📧 이메일: **soporte@edugame.digital**
- 🌐 웹: https://edugame.digital
- 📚 기술 문서: https://github.com/salazarjoelo/EsperantAI

응답 시간:

- 일반 문의: 24-72시간
- 기술 오류: 영업일 기준 1-3일

---

*최종 업데이트: 2026-05-20. 버전: 3.0.*
*© 2026 EdugameDigital — Joel Salazar Ramírez. EsperantAI™.*
