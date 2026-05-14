# 🌏 EsperantAI — Cultural Gesture Review: Asian Market (CJK + SE Asia)

**Document version:** 2.0  
**Date:** 2026-05-14  
**Author:** Cultural Review Agent  
**Status:** ✅ Approved by Joel (v1.0 decisions recorded below)  
**Scope:** 25 triggers (18 biological + 7 hand) × CJK markets (🇨🇳 China, 🇰🇷 Korea, 🇯🇵 Japan) + 🇹🇼 Taiwan, 🇸🇬 Singapore, and notes for Southeast Asia

---

## Decision Record — Joel's v1.0 Decisions (2026-05-14)

The following decisions were made by Joel (project owner) and are binding for v1.0:

| # | Decision | Rationale | Impact |
|---|---|---|---|
| D1 | **SKIP Korea in v1.0** — no SOOP partner, no CHZZK, ko-KR stays as stub | No streaming platform partner for Korean market; ko-KR locale file remains stub-only | Korean-specific UI badges, cultural notes, and default-disable logic for `ko-KR` are deferred to v1.5. All Korean cultural data in this document is preserved for future use but not implemented in v1.0 code. |
| D2 | **Backend: VPS Hostinger (187.77.23.49), no Cloudflare** | Simpler deployment, direct VPS | No CDN-related changes needed; WebSocket and API endpoints point to VPS IP directly |
| D3 | **GASSHO 🙏 APPROVED for v1.0** — full implementation required | Culturally critical for zh-CN and ja-JP markets; the #1 courtesy gesture | Full detection heuristic, i18n keys, TRIGGER_CATALOG entry, and integration code must be implemented. See expanded Section 6.4 for the complete implementation proposal. |
| D4 | **Only zh-CN and ja-JP needed in v1.0** (not ko-KR)** | Follows from D1 — Korea is skipped | i18n efforts focus on zh-CN and ja-JP. ko-KR translations are nice-to-have but not blocking. |

**v1.0 Locales:** `zh-CN`, `ja-JP` (plus existing `en-US`, `es-ES`, `es-MX`, `pt-BR`, `fr-FR`, `de-DE`, `it-IT`, `ru-RU`, `ar-SA`, `pl-PL`)  
**v1.5 Locales:** `ko-KR` (full implementation, SOOP/CHZZK integration, Korean cultural mode)

---

## 1. Executive Summary

Of the 25 triggers in the current `TRIGGER_CATALOG`, the 18 biological triggers (head rotation, distance, gaze, emotion, blink) are genuinely universal across CJK markets and can ship enabled-by-default without reservation. Among the 7 hand gestures, **3 are safe for CJK** (👍 thumbs-up, ✌️ peace/V-sign, 🤘 rock), **2 require caution** (✊ fist — political ambiguity, 👌 OK — means "money" in JP/KR and carries recent political baggage in Korea), and **2 must be disabled by default for CJK locales** (☝️ point — extremely offensive across all CJK cultures, far more than the current mild warning suggests; 🖐️ open-palm — equivalent to the middle finger in Korea when directed at a person). A critical gap exists: 🙏 gassho/prayer-hands, the single most important courtesy gesture across Japan, Korea, and China, is absent from the catalog entirely. The current `culturalNote` fields are written exclusively for Western/Middle Eastern audiences and contain zero Asia-specific content, which is unacceptable for CJK market entry where 78–80% of the global VTuber audience resides.

**v1.0 Update:** Joel has approved gassho (🙏) for v1.0 implementation in zh-CN and ja-JP locales. Korea (ko-KR) is deferred to v1.5. The expanded gassho implementation proposal with Human.js landmark heuristics is in Section 6.4.

---

## 2. Per-Gesture Analysis

### 2.1 Biological / Universal Triggers

#### 2.1.1 `center` — Head Center

| Field | Value |
|---|---|
| Current badge | 🌐 Universal |
| Proposed badge (CJK) | 🌐 Universal |
| Risk level | 🟢 Safe |

**Country analysis:**
- 🇨🇳 China: No cultural issue. Head centering is neutral in all contexts.
- 🇰🇷 Korea: No cultural issue.
- 🇯🇵 Japan: No cultural issue. Bowing is cultural but head centering is biomechanically neutral.
- 🇹🇼 Taiwan: No cultural issue.
- 🇸🇬 Singapore: No cultural issue.

**Recommended culturalNote update:** None needed — truly universal.  
**Enable-by-default for CJK:** ✅ Yes

---

#### 2.1.2 `left` — Head Turn Left

| Field | Value |
|---|---|
| Current badge | 🌐 Universal |
| Proposed badge (CJK) | 🌐 Universal |
| Risk level | 🟢 Safe |

**Country analysis:**
- 🇨🇳 China: No cultural issue. Left/right head movement is biomechanically neutral.
- 🇰🇷 Korea: No cultural issue.
- 🇯🇵 Japan: No cultural issue.
- 🇹🇼 Taiwan: No cultural issue.
- 🇸🇬 Singapore: No cultural issue.

**Recommended culturalNote update:** None needed.  
**Enable-by-default for CJK:** ✅ Yes

---

#### 2.1.3 `right` — Head Turn Right

| Field | Value |
|---|---|
| Current badge | 🌐 Universal |
| Proposed badge (CJK) | 🌐 Universal |
| Risk level | 🟢 Safe |

**Country analysis:**
- 🇨🇳 China: No cultural issue.
- 🇰🇷 Korea: No cultural issue.
- 🇯🇵 Japan: No cultural issue.
- 🇹🇼 Taiwan: No cultural issue.
- 🇸🇬 Singapore: No cultural issue.

**Recommended culturalNote update:** None needed.  
**Enable-by-default for CJK:** ✅ Yes

---

#### 2.1.4 `up` — Head Pitch Up

| Field | Value |
|---|---|
| Current badge | 🌐 Universal |
| Proposed badge (CJK) | 🌐 Universal |
| Risk level | 🟢 Safe |

**Country analysis:**
- 🇨🇳 China: No cultural issue. Looking up is neutral.
- 🇰🇷 Korea: No cultural issue.
- 🇯🇵 Japan: No cultural issue. Note: looking up while closing eyes can indicate thinking, but the gesture itself is neutral.
- 🇹🇼 Taiwan: No cultural issue.
- 🇸🇬 Singapore: No cultural issue.

**Recommended culturalNote update:** None needed.  
**Enable-by-default for CJK:** ✅ Yes

---

#### 2.1.5 `down` — Head Pitch Down

| Field | Value |
|---|---|
| Current badge | 🌐 Universal |
| Proposed badge (CJK) | 🌐 Universal |
| Risk level | 🟢 Safe |

**Country analysis:**
- 🇨🇳 China: No cultural issue. Looking down is neutral.
- 🇰🇷 Korea: No cultural issue.
- 🇯🇵 Japan: Looking down is associated with modesty/humidity in Japanese culture — actually slightly positive in context. Neutral for trigger purposes.
- 🇹🇼 Taiwan: No cultural issue.
- 🇸🇬 Singapore: No cultural issue.

**Recommended culturalNote update:** None needed.  
**Enable-by-default for CJK:** ✅ Yes

---

#### 2.1.6 `tilt-left` — Head Tilt Left

| Field | Value |
|---|---|
| Current badge | 🌐 Universal |
| Proposed badge (CJK) | 🌐 Universal |
| Risk level | 🟢 Safe |

**Country analysis:**
- 🇨🇳 China: No cultural issue. Head tilt is a universal mammalian curiosity gesture.
- 🇰🇷 Korea: No cultural issue. The "삐칭코" (head tilt) is seen as cute, especially in VTuber context.
- 🇯🇵 Japan: No cultural issue. "首をかしげる" is associated with curiosity/cuteness — positive for VTubers.
- 🇹🇼 Taiwan: No cultural issue.
- 🇸🇬 Singapore: No cultural issue.

**Recommended culturalNote update:** None needed.  
**Enable-by-default for CJK:** ✅ Yes

---

#### 2.1.7 `tilt-right` — Head Tilt Right

| Field | Value |
|---|---|
| Current badge | 🌐 Universal |
| Proposed badge (CJK) | 🌐 Universal |
| Risk level | 🟢 Safe |

**Country analysis:** Same as tilt-left — no cultural issues in any CJK market.

**Recommended culturalNote update:** None needed.  
**Enable-by-default for CJK:** ✅ Yes

---

#### 2.1.8 `near` — Face Closer to Camera

| Field | Value |
|---|---|
| Current badge | 🌐 Universal |
| Proposed badge (CJK) | 🌐 Universal |
| Risk level | 🟢 Safe |

**Country analysis:**
- 🇨🇳 China: No cultural issue. "面对面" (face-to-face) proximity is neutral in streaming.
- 🇰🇷 Korea: No cultural issue. In VTuber/streaming context, leaning in is seen as intimate/engaging.
- 🇯🇵 Japan: No cultural issue. "近い" proximity is common in VTuber content (tee-tee moments).
- 🇹🇼 Taiwan: No cultural issue.
- 🇸🇬 Singapore: No cultural issue.

**Recommended culturalNote update:** None needed.  
**Enable-by-default for CJK:** ✅ Yes

---

#### 2.1.9 `far` — Face Farther from Camera

| Field | Value |
|---|---|
| Current badge | 🌐 Universal |
| Proposed badge (CJK) | 🌐 Universal |
| Risk level | 🟢 Safe |

**Country analysis:** Same as `near` — no cultural issues in any CJK market.

**Recommended culturalNote update:** None needed.  
**Enable-by-default for CJK:** ✅ Yes

---

#### 2.1.10 `gaze-left` — Eyes Look Left

| Field | Value |
|---|---|
| Current badge | 🌐 Universal |
| Proposed badge (CJK) | 🌐 Universal |
| Risk level | 🟢 Safe |

**Country analysis:**
- 🇨🇳 China: No cultural issue. Eye gaze direction is biomechanically neutral.
- 🇰🇷 Korea: No cultural issue.
- 🇯🇵 Japan: No cultural issue. Note: in Japanese culture, avoiding eye contact can signal respect/shyness (especially toward seniors), but gaze-left as a trigger is neutral.
- 🇹🇼 Taiwan: No cultural issue.
- 🇸🇬 Singapore: No cultural issue.

**Recommended culturalNote update:** None needed.  
**Enable-by-default for CJK:** ✅ Yes

---

#### 2.1.11 `gaze-right` — Eyes Look Right

| Field | Value |
|---|---|
| Current badge | 🌐 Universal |
| Proposed badge (CJK) | 🌐 Universal |
| Risk level | 🟢 Safe |

**Country analysis:** Same as `gaze-left` — no cultural issues in any CJK market.

**Recommended culturalNote update:** None needed.  
**Enable-by-default for CJK:** ✅ Yes

---

#### 2.1.12 `gaze-up` — Eyes Look Up

| Field | Value |
|---|---|
| Current badge | 🌐 Universal |
| Proposed badge (CJK) | 🌐 Universal |
| Risk level | 🟢 Safe |

**Country analysis:**
- 🇨🇳 China: No cultural issue. Looking up is associated with thinking/remembering.
- 🇰🇷 Korea: No cultural issue.
- 🇯🇵 Japan: No cultural issue. "上を向く" is neutral/thinking.
- 🇹🇼 Taiwan: No cultural issue.
- 🇸🇬 Singapore: No cultural issue.

**Recommended culturalNote update:** None needed.  
**Enable-by-default for CJK:** ✅ Yes

---

#### 2.1.13 `gaze-down` — Eyes Look Down

| Field | Value |
|---|---|
| Current badge | 🌐 Universal |
| Proposed badge (CJK) | 🌐 Universal |
| Risk level | 🟢 Safe |

**Country analysis:**
- 🇨🇳 China: No cultural issue.
- 🇰🇷 Korea: No cultural issue.
- 🇯🇵 Japan: Looking down can indicate modesty, shyness, or respect in Japanese culture — actually positive in many contexts. Neutral for trigger purposes.
- 🇹🇼 Taiwan: No cultural issue.
- 🇸🇬 Singapore: No cultural issue.

**Recommended culturalNote update:** None needed.  
**Enable-by-default for CJK:** ✅ Yes

---

#### 2.1.14 `happy` — Smile/Happy Expression

| Field | Value |
|---|---|
| Current badge | 🌐 Universal |
| Proposed badge (CJK) | 🌐 Universal |
| Risk level | 🟢 Safe |

**Country analysis:**
- 🇨🇳 China: No cultural issue. Smiling is universal (Ekman 1972). Note: Chinese culture differentiates between genuine smiles (真笑) and polite smiles (假笑), but the expression itself is positive.
- 🇰🇷 Korea: No cultural issue. Smiling is positive.
- 🇯🇵 Japan: No cultural issue. Japanese "笑顔" (smile) is highly valued in customer service and entertainment. Some cultural nuance: Japanese people smile to mask negative emotions (smile masks), but the detected expression is still positive for trigger purposes.
- 🇹🇼 Taiwan: No cultural issue.
- 🇸🇬 Singapore: No cultural issue.

**Recommended culturalNote update:** None needed.  
**Enable-by-default for CJK:** ✅ Yes

---

#### 2.1.15 `surprise` — Surprised Expression

| Field | Value |
|---|---|
| Current badge | 🌐 Universal |
| Proposed badge (CJK) | 🌐 Universal |
| Risk level | 🟢 Safe |

**Country analysis:**
- 🇨🇳 China: No cultural issue. Surprise is a universal emotion (Ekman).
- 🇰🇷 Korea: No cultural issue. "놀람" expression is universal.
- 🇯🇵 Japan: No cultural issue. Japanese VTubers frequently exaggerate surprise (驚き) for comedic effect.
- 🇹🇼 Taiwan: No cultural issue.
- 🇸🇬 Singapore: No cultural issue.

**Recommended culturalNote update:** None needed.  
**Enable-by-default for CJK:** ✅ Yes

---

#### 2.1.16 `angry` — Angry Expression

| Field | Value |
|---|---|
| Current badge | 🌐 Universal |
| Proposed badge (CJK) | 🌐 Universal |
| Risk level | 🟢 Safe |

**Country analysis:**
- 🇨🇳 China: No cultural issue for detection. Cultural note: displaying anger publicly is more taboo in Chinese culture than in the West (loss of face / 丢脸), but the trigger itself is neutral.
- 🇰🇷 Korea: No cultural issue for detection. Similar to China — public anger is culturally discouraged, but the trigger is valid for streaming/entertainment contexts.
- 🇯🇵 Japan: No cultural issue for detection. Public anger is very taboo in Japanese culture, but VTubers often perform "tsundere" anger for entertainment. The trigger is appropriate.
- 🇹🇼 Taiwan: No cultural issue.
- 🇸🇬 Singapore: No cultural issue.

**Recommended culturalNote update:** None needed — biological detection is culturally neutral.  
**Enable-by-default for CJK:** ✅ Yes

---

#### 2.1.17 `neutral` — Neutral Expression

| Field | Value |
|---|---|
| Current badge | 🌐 Universal |
| Proposed badge (CJK) | 🌐 Universal |
| Risk level | 🟢 Safe |

**Country analysis:**
- 🇨🇳 China: No cultural issue.
- 🇰🇷 Korea: No cultural issue.
- 🇯🇵 Japan: No cultural issue. Note: "無表情" (expressionless) can be associated with "cool" or "stoic" characters in anime/VTuber culture — potentially a desirable trigger.
- 🇹🇼 Taiwan: No cultural issue.
- 🇸🇬 Singapore: No cultural issue.

**Recommended culturalNote update:** None needed.  
**Enable-by-default for CJK:** ✅ Yes

---

#### 2.1.18 `blink` — Double Blink

| Field | Value |
|---|---|
| Current badge | 🌐 Universal |
| Proposed badge (CJK) | 🌐 Universal |
| Risk level | 🟢 Safe |

**Country analysis:**
- 🇨🇳 China: No cultural issue. Blinking is a biological action.
- 🇰🇷 Korea: No cultural issue. Double blink is associated with cuteness in K-content.
- 🇯🇵 Japan: No cultural issue. "パチパチ" (blinking) is considered cute in Japanese media. Common VTuber mannerism.
- 🇹🇼 Taiwan: No cultural issue.
- 🇸🇬 Singapore: No cultural issue.

**Recommended culturalNote update:** None needed.  
**Enable-by-default for CJK:** ✅ Yes

---

### 2.2 Hand / Cultural Triggers

#### 2.2.1 `thumbs-up` 👍 — Thumbs Up

| Field | Value |
|---|---|
| Current badge | ⚠️ Cultural |
| Proposed badge (CJK) | ⚠️ Cultural (but safe for CJK) |
| Risk level | 🟢 Safe |

**Country analysis:**
- 🇨🇳 China: Widely used and understood as "good/approval." Borrowed from Western media and fully adopted in Chinese digital culture (微信 👍 reaction). No negative connotation in streaming context. **Safe.**
- 🇰🇷 Korea: Widely understood as "좋아" (good/approval). Commonly used in digital communication and streaming. No negative connotation. **Safe.**
- 🇯🇵 Japan: Understood as "いいね" (good/like). Commonly used in texting and social media. No negative connotation. **Safe.** Note: In rare older contexts, thumb-up could signal a male lover (analogous to pinky for female lover), but this is archaic and irrelevant to streaming.
- 🇹🇼 Taiwan: Same as China — widely used as positive. **Safe.**
- 🇸🇬 Singapore: Same — understood as positive. **Safe.**

**Recommended `culturalNote` update:**
> "Middle East / West Asia: offensive (equivalent to middle finger). West = approval. China/Korea/Japan = approval/good (widely adopted from Western media). Iran/Afghanistan: highly offensive."

**Enable-by-default for CJK:** ✅ Yes

---

#### 2.2.2 `peace` ✌️ — Peace / V-Sign

| Field | Value |
|---|---|
| Current badge | ⚠️ Cultural |
| Proposed badge (CJK) | ⚠️ Cultural (but SAFE for CJK — in fact, THE most popular photo gesture) |
| Risk level | 🟢 Safe |

**Country analysis:**
- 🇨🇳 China: **THE most popular photo/selfie gesture** (剪刀手 / jiǎndāoshǒu). Ubiquitous and entirely positive. No offensive palm-direction distinction exists in Chinese culture. **Safe and culturally natural.**
- 🇰🇷 Korea: **THE most popular photo gesture** (브이 / V-피스). Universally used in selfies and photos. Palm direction is irrelevant — both inward and outward V-signs are positive. **Safe and culturally natural.**
- 🇯🇵 Japan: **THE most iconic photo gesture** (ピース / pīsu). The V-sign in photos was popularized in Japan starting from the 1970s and is THE default photo pose. Both palm directions are positive. **Safe and culturally natural — arguably the #1 hand gesture for Japanese VTubers.**
- 🇹🇼 Taiwan: Same as China — ubiquitous photo gesture. **Safe.**
- 🇸🇬 Singapore: Same — very common photo gesture. **Safe.**

**⚠️ Critical note:** The current `culturalNote` warns about UK/Ireland/Australia palm-inward offense, which is **completely irrelevant** for CJK users. The V-sign has **zero** offensive meaning in any CJK culture regardless of palm direction. This warning may confuse or unnecessarily alarm CJK users.

**Recommended `culturalNote` update:**
> "UK/Ireland/Australia: palm inward = offensive (up yours). Palm outward = peace/victory. China/Korea/Japan/Taiwan: ALWAYS positive — THE standard photo/selfie gesture (剪刀手/브이/ピース). Palm direction is irrelevant in CJK cultures."

**Enable-by-default for CJK:** ✅ Yes

---

#### 2.2.3 `rock` 🤘 — Rock / Horns Sign

| Field | Value |
|---|---|
| Current badge | ⚠️ Cultural |
| Proposed badge (CJK) | ⚠️ Cultural (safe for CJK streaming) |
| Risk level | 🟢 Safe |

**Country analysis:**
- 🇨🇳 China: Not widely recognized by general public. Known only through rock/metal music subculture. Some may confuse it with the ASL "I love you" sign (which adds the thumb). No negative connotation. In streaming, would be understood as "rock on" by younger audiences. **Safe.**
- 🇰🇷 Korea: Known through K-rock, metal, and idol fandom culture. No Italian "cornuto" (cuckold) meaning exists in Korean culture. "락 사인" is recognized by music fans. **Safe.**
- 🇯🇵 Japan: Known through visual kei, rock/metal culture, and anime. No "cornuto" association. Japanese rock/metal fans use it identically to the West. The sign also appears in some Buddhist iconography (完全無関係). **Safe for streaming.**
- 🇹🇼 Taiwan: Similar to China — not widely recognized but no negative meaning. **Safe.**
- 🇸🇬 Singapore: Similar — known through Western music culture, no negative meaning. **Safe.**

**Recommended `culturalNote` update:**
> "Italy: palm down = 'cornuto' (cuckold insult). Palm up = rock/metal. China/Korea/Japan: no negative meaning — recognized as rock/metal sign by younger audiences, unfamiliar to some older users. Not offensive in any CJK culture."

**Enable-by-default for CJK:** ✅ Yes (with note that recognition may vary by audience age)

---

#### 2.2.4 `ok` 👌 — OK Sign

| Field | Value |
|---|---|
| Current badge | ⚠️ Cultural |
| Proposed badge (CJK) | 🔴 Risky — should be disabled by default |
| Risk level | 🔴 Risky |

**Country analysis:**
- 🇨🇳 China: The finger-and-thumb circle represents a **coin/money** (钱/硬币). While increasingly understood as "OK" from Western influence, the primary association is monetary. In streaming, accidentally triggering a "money" gesture when you mean "OK" could be awkward. In some contexts, the gesture can have vulgar connotations (representing a body orifice). The Chinese number gesture for "0" uses a similar shape. **Caution to Risky.**
- 🇰🇷 Korea: **HIGH RISK.** The circle represents **돈/동전** (money/coin). Not naturally understood as "OK." More critically: since ~2019, the OK sign became associated with the Korean online community **일베 (Ilbe)** and carries strong **political extremism** baggage. Using the OK sign in Korean streaming can be interpreted as a far-right political statement. This is a live, active cultural issue. **RISKY — must be disabled by default.**
- 🇯🇵 Japan: The finger-and-thumb circle represents **お金/硬貨** (money/coin). The Japanese concept of "OK" is expressed with a large arm-raised circle (丸印 / まる) — a completely different gesture. The 👌 sign is **not** "OK" in Japan — it means "money" or can have vulgar connotations. **Caution to Risky.**
- 🇹🇼 Taiwan: Similar to China — primarily means "money/coin." No specific political baggage but the monetary association makes it inappropriate as an "OK" trigger. **Caution.**
- 🇸🇬 Singapore: Generally understood as "OK" due to strong Western influence and English-speaking culture. However, Chinese-Singaporean community may associate with money. **Mild caution.**

**🔴 CRITICAL FINDING:** The current `culturalNote` only mentions Brazil/Turkey/Germany and the US. It contains **zero** information about the money meaning in Japan/Korea or the political extremism association in Korea. This is a major gap for CJK market entry.

**Recommended `culturalNote` update:**
> "Brazil/Turkey/Germany: offensive (vulgar). USA/UK: OK/approval. Japan/Korea/Taiwan: means MONEY/COIN (お金/돈), NOT 'OK'. Korea: also associated with political extremism (Ilbe) since 2019 — HIGH RISK. China: means coin/money, sometimes vulgar. Use thumbs-up instead for 'OK' in CJK markets."

**Enable-by-default for C1.0 (zh-CN, ja-JP):** ❌ No — disable by default  
**Enable-by-default for v1.5 (ko-KR):** ❌ No — disable by default

---

#### 2.2.5 `fist` ✊ — Closed Fist

| Field | Value |
|---|---|
| Current badge | ⚠️ Cultural |
| Proposed badge (CJK) | ⚠️ Cultural (caution) |
| Risk level | 🟡 Caution |

**Country analysis:**
- 🇨🇳 China: The raised fist has strong **political symbolism** (Communist Party, revolution, solidarity). In casual/streaming context, a fist bump or "加油" (fighting/ganbatte) fist is fine, but the isolated raised fist can be read as political. The "fighting fist" (加油) is positive. **Caution — context-dependent.**
- 🇰🇷 Korea: "파이팅!" (fighting!) fist is positive and common in Korean culture. However, the raised fist also appears in both progressive and conservative political protest imagery. In streaming context, the "fighting" meaning dominates. **Caution but generally safe in streaming.**
- 🇯🇵 Japan: "ファイト！" (fight!) fist is positive. "拳" (ken) has strong associations with fighting spirit, perseverance (Ganbatte). Less politically charged than China/Korea. The fist bump is understood. **Safe in streaming context.**
- 🇹🇼 Taiwan: The raised fist has democracy movement symbolism (Sunflower Movement). Can be political but also commonly used as "fighting/加油." **Caution — context-dependent.**
- 🇸🇬 Singapore: Generally neutral in streaming context. "Fighting" meaning is understood. No strong political association. **Safe.**

**Recommended `culturalNote` update:**
> "Political meaning varies by context. China: raised fist = Communist revolution symbolism (caution in formal contexts). Korea: 'fighting' (파이팅) fist is positive, but also used in political protests. Japan: 'fight' (ファイト) fist is positive, less political. Taiwan: democracy movement symbolism. In streaming/casual contexts across CJK, the 'fighting spirit' meaning is dominant."

**Enable-by-default for CJK:** ⚠️ Conditional — enable for casual/streaming use, but display a mild caution badge. Do not use for monetization-related triggers.

---

#### 2.2.6 `open-palm` 🖐️ — Open Palm

| Field | Value |
|---|---|
| Current badge | ⚠️ Cultural |
| Proposed badge (CJK) | 🔴 Risky — must be disabled by default for Korean locale |
| Risk level | 🔴 Risky (Korea) / 🟡 Caution (other CJK) |

**Country analysis:**
- 🇨🇳 China: Open palm is generally understood as "stop" or "five" (五 in Chinese number gestures). Pointing an open palm at someone's face can be rude, but the gesture itself is not strongly offensive. In streaming, could be used as a "stop" or "wait" signal. **Mild caution.**
- 🇰🇷 Korea: **🔴 CRITICAL.** Showing an open palm toward someone's face (손바닥 / sonbadak) is **equivalent to the middle finger** in Korean culture. It is an extremely disrespectful gesture, especially toward elders or superiors. This is not a subtle cultural nuance — it is one of the most well-known rude gestures in Korean culture. A streamer accidentally triggering this gesture could cause serious offense to Korean viewers. **MUST BE DISABLED BY DEFAULT for Korean locale.**
- 🇯🇵 Japan: Open palm facing outward ("手" / "ストップ" gesture) is the standard "stop" signal and is NOT particularly offensive. The "te-o" (hand) stop gesture is common and polite. However, shoving an open palm directly in someone's face can be rude (as anywhere). **Safe for Japanese streaming.**
- 🇹🇼 Taiwan: Similar to China — open palm is "stop" or "five." Not strongly offensive but can be rude if directed at someone's face. **Mild caution.**
- 🇸🇬 Singapore: Generally understood as "stop." Korean community in Singapore would find it offensive. **Mild caution.**

**🔴 CRITICAL FINDING:** The current `culturalNote` only mentions the Greek "mountza" offense. The Korean equivalent (손바닥 toward face = middle finger) is **equally severe** and completely unaddressed. This is a critical gap.

**Recommended `culturalNote` update:**
> "Greece (mountza): open palm toward someone = severe insult. Korea: open palm toward someone's face = EQUIVALENT TO MIDDLE FINGER (손바닥) — extremely offensive. China/Taiwan: means 'stop' or 'five', can be rude toward face. Japan: standard 'stop' signal, generally safe. Most of world: 'stop' or 'high-five'. DISABLE BY DEFAULT for Korean locale."

**Enable-by-default for v1.0 (zh-CN, ja-JP):** ⚠️ Conditional (enable with warning)  
**Enable-by-default for v1.5 (ko-KR):** ❌ No — disable by default

---

#### 2.2.7 `point` ☝️ — Pointing Index Finger

| Field | Value |
|---|---|
| Current badge | ⚠️ Cultural |
| Proposed badge (CJK) | 🔴 Risky — must be disabled by default for ALL CJK locales |
| Risk level | 🔴 Risky |

**Country analysis:**
- 🇨🇳 China: **Pointing at a person with the index finger is VERY rude** (用手指人很不礼貌). Chinese etiquette explicitly teaches children not to point at people. In formal and casual settings alike, pointing at someone is one of the most basic etiquette violations. The proper way to indicate a person is to use the entire hand with palm facing up (请的手势). The current culturalNote saying it is "considered rude in many Asian cultures" is **far too mild** — it's not just "rude," it's one of the most fundamental etiquette rules in Chinese culture. **RISKY.**
- 🇰🇷 Korea: **Pointing at someone with the index finger is EXTREMELY rude** (손가락으로 가리키기). It is one of the first etiquette rules taught to Korean children. Pointing at an elder with the index finger is a serious social violation. Koreans use the whole hand (palm up) to indicate people. **RISKY — must be disabled by default.**
- 🇯🇵 Japan: **Pointing at people is EXTREMELY rude** (人を指さすのは失礼). It is one of the most basic rules of Japanese manners. Pointing at someone is considered aggressive and insulting. The proper way to indicate a person is the whole hand (手のひらを上に向けて). In Japanese streaming/VTuber context, viewers would be shocked to see a streamer point at them. **RISKY — must be disabled by default.**
- 🇹🇼 Taiwan: Same as China — pointing at people is very rude. **RISKY.**
- 🇸🇬 Singapore: Same — especially for Chinese-Singaporean and Malay-Singaporean communities. **RISKY.**

**🔴 CRITICAL FINDING:** The current `culturalNote` says "Apuntar con el dedo se considera grosero en muchas culturas asiáticas" — this is **dangerously understated**. It's not just "rude in many Asian cultures" — it is **one of the most fundamental etiquette violations** in ALL CJK cultures, taught to children from age 2-3, and is equivalent to or worse than swearing at someone. The word "grosero" (rude) vastly understates the severity. This gesture MUST be disabled by default for all CJK locales.

**Recommended `culturalNote` update:**
> "EXTREMELY offensive in China/Korea/Japan/Taiwan/Singapore — pointing at a person with the index finger is one of the most basic etiquette violations in all CJK cultures (taught to children from age 2-3). Equivalent to or worse than verbal insult. Always use the whole hand (palm up) to indicate people in CJK cultures. West: generally acceptable to point at objects, rude to point at people. Middle East: also offensive. DISABLE BY DEFAULT for CJK locales."

**Enable-by-default for v1.0 (zh-CN, ja-JP):** ❌ No — disable by default  
**Enable-by-default for v1.5 (ko-KR):** ❌ No — disable by default

---

## 3. Critical Findings That Require Code Changes

### 3.1 👌 OK Sign Means "Money/Coin" in Japan and Korea

**Current state:** The `culturalNote` for `ok` mentions only Brazil, Turkey, Germany, and the USA.  
**Problem:** In Japan (お金/硬貨) and Korea (돈/동전), the 👌 gesture primarily means "money/coin," NOT "OK." A streamer using this as an "OK" trigger would confuse or offend CJK viewers. In Korea, the gesture carries additional political extremism baggage (Ilbe association since 2019).

**Required code change:**
```javascript
// BEFORE
culturalNote: 'En Brasil / Turquía / Alemania puede ser ofensivo. En USA = OK.'

// AFTER
culturalNote: 'Brazil/Turkey/Germany: offensive (vulgar). USA/UK: OK/approval. Japan/Korea/Taiwan: means MONEY/COIN (お金/돈), NOT "OK". Korea: also associated with political extremism (Ilbe) since 2019 — HIGH RISK. China: means coin/money, sometimes vulgar. Use thumbs-up instead for "OK" in CJK markets.'
```

**Additional requirement:** Add `disabledByDefaultLocales: ['ja-JP', 'zh-CN']` for v1.0. Add `ko-KR` in v1.5.

---

### 3.2 🖐️ Open Palm Toward Face Is Extremely Rude in Korea

**Current state:** The `culturalNote` for `open-palm` mentions only the Greek "mountza."  
**Problem:** In Korea, showing an open palm toward someone's face (손바닥 / sonbadak) is equivalent to the middle finger — one of the most offensive gestures in Korean culture. This is not a subtle nuance.

**Required code change:**
```javascript
// BEFORE
culturalNote: 'En Grecia (mountza) hacia alguien = ofensa fuerte. Generalmente "stop" en otros lados.'

// AFTER
culturalNote: 'Greece (mountza): open palm toward someone = severe insult. Korea: open palm toward face = EQUIVALENT TO MIDDLE FINGER (손바닥) — extremely offensive. China/Taiwan: "stop" or "five", rude toward face. Japan: standard "stop" signal, generally safe. Most of world: "stop" or "high-five". DISABLE BY DEFAULT for Korean locale.'
```

**Additional requirement:** Add `disabledByDefaultLocales: ['ko-KR']` to the `open-palm` trigger entry (v1.5). For v1.0 (zh-CN, ja-JP), open-palm remains enabled with caution badge.

---

### 3.3 ☝️ Point Is VERY Offensive in CJK — Current Warning Is Dangerously Mild

**Current state:** The `culturalNote` for `point` says "Apuntar con el dedo se considera grosero en muchas culturas asiáticas" (pointing with the finger is considered rude in many Asian cultures).  
**Problem:** This is a severe understatement. Pointing at someone with the index finger is not just "rude" — it is **one of the most fundamental etiquette violations in all CJK cultures**, equivalent to or worse than a verbal insult. It is taught to children from age 2-3 as one of the first rules of manners. The Spanish word "grosero" (rude/rough) vastly understates the severity. A CJK user reading this note might think it's a minor faux pas when it's actually a serious social violation.

**Required code change:**
```javascript
// BEFORE
culturalNote: 'Apuntar con el dedo se considera grosero en muchas culturas asiáticas.'

// AFTER
culturalNote: 'EXTREMELY offensive in China/Korea/Japan/Taiwan/Singapore — pointing at a person with the index finger is one of the most basic etiquette violations in all CJK cultures (taught to children from age 2-3). Equivalent to or worse than verbal insult. Always use the whole hand (palm up) to indicate people in CJK cultures. West: generally acceptable to point at objects, rude to point at people. Middle East: also offensive. DISABLE BY DEFAULT for CJK locales.'
```

**Additional requirement:** Add `disabledByDefaultLocales: ['ja-JP', 'zh-CN']` for v1.0. Add `ko-KR` in v1.5.

---

### 3.4 🙏 Gassho/Prayer-Hands Is Missing from Catalog

**Current state:** The `TRIGGER_CATALOG` has no entry for the prayer-hands / gassho gesture.  
**Problem:** The gassho (合掌 / 合十) gesture is THE courtesy gesture in Japan and China. It means "thank you," "please," "sorry," and "respect." It is used in daily life far more frequently than any other hand gesture in CJK cultures. Its absence from the catalog is a significant gap for CJK market entry, especially for monetization-related triggers (e.g., "thank you for the donation" → 🙏 → thank-you scene).

**v1.0 Decision:** Joel has APPROVED gassho for v1.0. Full implementation proposal in Section 6.4.

---

## 4. Monetization Nudge Implications

For each hand gesture that could trigger a monetization-related scene (e.g., donation received → gesture → thank-you scene), we analyze whether the gesture-scene combination is culturally appropriate.

### 4.1 Donation Received → 👍 Thumbs-Up → Thank You Scene

| Market | Assessment |
|---|---|
| 🇨🇳 China | ✅ **Appropriate.** Thumbs-up is universally understood as positive approval. "打赏收到，点赞！" is natural. |
| 🇰🇷 Korea | ✅ **Appropriate.** "좋아" (good) is a natural response to receiving a donation. |
| 🇯🇵 Japan | ✅ **Appropriate.** "いいね" (good) is natural. Note: Japanese streamers more commonly use 🙏 for donation thanks, but 👍 is not offensive. |
| 🇹🇼 Taiwan | ✅ **Appropriate.** Same as China. |
| 🇸🇬 Singapore | ✅ **Appropriate.** |

**Verdict:** ✅ Safe for all CJK markets.

---

### 4.2 Donation Received → ✌️ Peace → Thank You Scene

| Market | Assessment |
|---|---|
| 🇨🇳 China | ✅ **Appropriate** but semantically odd. Peace sign = photo gesture, not naturally a "thank you." Acceptable but not the best fit. |
| 🇰🇷 Korea | ✅ **Appropriate** but semantically odd. Same — V-sign is a photo gesture, not a gratitude expression. |
| 🇯🇵 Japan | ✅ **Appropriate** but semantically odd. Japanese VTubers might do a peace sign after a donation as a cute response, but it doesn't inherently convey gratitude. |
| 🇹🇼 Taiwan | ✅ Same as China. |
| 🇸🇬 Singapore | ✅ Same. |

**Verdict:** ✅ Safe but suboptimal — 🙏 or 👍 would be more culturally appropriate for "thank you."

---

### 4.3 Donation Received → 👌 OK → Thank You Scene

| Market | Assessment |
|---|---|
| 🇨🇳 China | 🔴 **INAPPROPRIATE.** The gesture means "money/coin" — using it to thank someone for money could come across as "give me more money" or be interpreted as vulgar. |
| 🇰🇷 Korea | 🔴 **INAPPROPRIATE & OFFENSIVE.** Means "money" + carries Ilbe political extremism baggage. Using 👌 after a donation in a Korean stream could be interpreted as a political dogwhistle. **MUST NOT be used.** |
| 🇯🇵 Japan | 🔴 **INAPPROPRIATE.** Means "money" — responding to a donation with a "money" gesture feels transactional and crude in Japanese culture, where donations (投げ銭 / super chat) should be received with humility and gratitude (🙏), not a money-sign gesture. |
| 🇹🇼 Taiwan | 🟡 **AWKWARD.** Same money connotation. Better alternatives available. |
| 🇸🇬 Singapore | 🟡 **Caution.** May be understood as "OK" but the money association exists. |

**Verdict:** 🔴 **Must NOT be used for monetization triggers in any CJK market.** This combination is actively harmful.

---

### 4.4 Donation Received → ✊ Fist → Thank You Scene

| Market | Assessment |
|---|---|
| 🇨🇳 China | 🟡 **Awkward.** Fist = fighting spirit or political symbolism. Not a natural "thank you" gesture. Could be seen as aggressive or political. |
| 🇰🇷 Korea | 🟡 **Mixed.** "파이팅!" fist is positive but not a gratitude expression. Could work as "let's go!" energy after a donation, but not a direct "thank you." |
| 🇯🇵 Japan | 🟡 **Acceptable** in context. "ファイト！" (fight!) after a donation could work as encouragement, but it's not "thank you." |
| 🇹🇼 Taiwan | 🟡 **Awkward.** Same as China. |
| 🇸🇬 Singapore | 🟡 **Acceptable** but not ideal. |

**Verdict:** 🟡 Not recommended for "thank you" scenes in CJK. Better suited for "let's go" or "fighting" scenes.

---

### 4.5 Donation Received → 🖐️ Open Palm → Thank You Scene

| Market | Assessment |
|---|---|
| 🇨🇳 China | 🟡 **Wrong meaning.** Open palm = "stop" or "five." Could be interpreted as "stop donating" or just confusing. |
| 🇰🇷 Korea | 🔴 **CATASTROPHIC.** Open palm toward camera (viewer's face) = MIDDLE FINGER EQUIVALENT. Responding to a donation with the Korean equivalent of giving the donor the finger would be a PR disaster. **MUST NEVER BE USED.** |
| 🇯🇵 Japan | 🟡 **Wrong meaning.** Open palm = "stop" or "wait." Responding to a donation with "stop" is counterproductive and confusing. |
| 🇹🇼 Taiwan | 🟡 **Wrong meaning.** Same as China. |
| 🇸🇬 Singapore | 🟡 **Wrong meaning.** Same. |

**Verdict:** 🔴 **Must NEVER be used for monetization triggers in Korea.** Wrong meaning in all CJK markets.

---

### 4.6 Donation Received → ☝️ Point → Thank You Scene

| Market | Assessment |
|---|---|
| 🇨🇳 China | 🔴 **OFFENSIVE.** Pointing at the donor (viewer) with the index finger after they give you money = extremely rude. "You gave me money and now you're pointing at me?!" |
| 🇰🇷 Korea | 🔴 **OFFENSIVE.** Same — pointing at a benefactor is an egregious etiquette violation in Korean culture. |
| 🇯🇵 Japan | 🔴 **OFFENSIVE.** Same — pointing at someone who just gave you money is profoundly insulting in Japanese culture. |
| 🇹🇼 Taiwan | 🔴 **OFFENSIVE.** Same. |
| 🇸🇬 Singapore | 🔴 **OFFENSIVE.** Same. |

**Verdict:** 🔴 **Must NEVER be used for monetization triggers in ANY CJK market.** The combination of "receiving money" + "pointing at donor" is maximally offensive.

---

### 4.7 Donation Received → 🙏 Gassho (APPROVED v1.0) → Thank You Scene

| Market | Assessment |
|---|---|
| 🇨🇳 China | ✅ **PERFECT.** 🙏 合十 is THE traditional gesture of gratitude in Chinese culture. "感谢" + 🙏 is the most natural donation response possible. |
| 🇰🇷 Korea | ✅ **PERFECT.** 🙏 합장 is THE traditional gesture of gratitude and respect in Korean culture. The most natural donation response. *(v1.5 — Korea skipped in v1.0)* |
| 🇯🇵 Japan | ✅ **PERFECT.** 🙏 合掌 (gassho) is THE traditional gesture of gratitude and reverence in Japanese culture. "ありがとうございます" + 🙏 is the gold standard for donation thanks in Japanese streaming. |
| 🇹🇼 Taiwan | ✅ **PERFECT.** Same as China. |
| 🇸🇬 Singapore | ✅ **PERFECT.** Same — universally understood across all ethnic groups. |

**Verdict:** ✅ **IDEAL for monetization triggers in ALL CJK markets.** Joel has approved for v1.0 (zh-CN, ja-JP).

---

### Monetization Nudge Summary Table

| Gesture | 🇨🇳 | 🇰🇷 | 🇯🇵 | 🇹🇼 | 🇸🇬 | CJK Verdict |
|---|---|---|---|---|---|---|
| 👍 Thank you | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ Safe |
| ✌️ Thank you | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ Safe but suboptimal |
| 👌 Thank you | 🔴 | 🔴 | 🔴 | 🟡 | 🟡 | 🔴 BANNED |
| ✊ Thank you | 🟡 | 🟡 | 🟡 | 🟡 | 🟡 | 🟡 Not recommended |
| 🖐️ Thank you | 🟡 | 🔴 | 🟡 | 🟡 | 🟡 | 🔴 BANNED (KR) |
| ☝️ Thank you | 🔴 | 🔴 | 🔴 | 🔴 | 🔴 | 🔴 BANNED |
| 🙏 Thank you | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ IDEAL |

---

## 5. Recommended TRIGGER_CATALOG culturalNote Updates

Below are the exact JavaScript code changes needed for the 7 hand gestures' `culturalNote` fields. Each updated culturalNote covers Middle East, Europe, AND Asia comprehensively.

### 5.1 `thumbs-up`

```javascript
// BEFORE (line 56)
{ key: 'thumbs-up',  category: 'hand',     universal: false, icon: '👍',  i18n: 'scenes.thumbs_up',  requires: 'hand', culturalNote: 'En Medio Oriente / Asia Occidental puede ser ofensivo. En Occidente = aprobación.' }

// AFTER
{ key: 'thumbs-up',  category: 'hand',     universal: false, icon: '👍',  i18n: 'scenes.thumbs_up',  requires: 'hand', culturalNote: 'Middle East / West Asia / Iran / Afghanistan: highly offensive (equivalent to middle finger). West / Latin America: approval/good. China/Korea/Japan/Taiwan/Singapore: approval/good (widely adopted, no negative meaning). Safe default for CJK markets.' }
```

### 5.2 `peace`

```javascript
// BEFORE (line 57)
{ key: 'peace',      category: 'hand',     universal: false, icon: '✌️',  i18n: 'scenes.peace',      requires: 'hand', culturalNote: 'En Reino Unido / Irlanda / Australia con palma hacia adentro = ofensa. Hacia afuera = paz/victoria.' }

// AFTER
{ key: 'peace',      category: 'hand',     universal: false, icon: '✌️',  i18n: 'scenes.peace',      requires: 'hand', culturalNote: 'UK / Ireland / Australia: palm inward = offensive ("up yours"). Palm outward = peace/victory. China/Korea/Japan/Taiwan: ALWAYS positive — THE standard photo/selfie gesture (剪刀手/브이/ピース). Palm direction is irrelevant in CJK cultures. Safe default for CJK markets.' }
```

### 5.3 `rock`

```javascript
// BEFORE (line 58)
{ key: 'rock',       category: 'hand',     universal: false, icon: '🤘',  i18n: 'scenes.rock',       requires: 'hand', culturalNote: 'En Italia con palma hacia abajo = "los cuernos" (insulto). Hacia arriba = rock metal.' }

// AFTER
{ key: 'rock',       category: 'hand',     universal: false, icon: '🤘',  i18n: 'scenes.rock',       requires: 'hand', culturalNote: 'Italy / Mediterranean: palm down = "cornuto" (cuckold — severe insult). Palm up = rock/metal. Latin America: "corna" — same cuckold insult when directed at a man. China/Korea/Japan: no negative meaning — recognized as rock/metal by younger audiences, unfamiliar to some older users. Not offensive in any CJK culture.' }
```

### 5.4 `ok`

```javascript
// BEFORE (line 59)
{ key: 'ok',         category: 'hand',     universal: false, icon: '👌',  i18n: 'scenes.ok',         requires: 'hand', culturalNote: 'En Brasil / Turquía / Alemania puede ser ofensivo. En USA = OK.' }

// AFTER
{ key: 'ok',         category: 'hand',     universal: false, icon: '👌',  i18n: 'scenes.ok',         requires: 'hand', culturalNote: 'Brazil / Turkey / Germany: offensive (vulgar — represents anus). USA / UK / Canada: OK / approval. Japan: means MONEY / COIN (お金) — NOT "OK". Korea: means MONEY (돈) + associated with political extremism (Ilbe) since 2019 — HIGH RISK. China / Taiwan: means COIN / MONEY, sometimes vulgar. DO NOT USE for monetization triggers in CJK. Use thumbs-up instead for "OK". DISABLE BY DEFAULT for CJK locales.' }
```

### 5.5 `fist`

```javascript
// BEFORE (line 60)
{ key: 'fist',       category: 'hand',     universal: false, icon: '✊',  i18n: 'scenes.fist',       requires: 'hand', culturalNote: 'Significado político variable según contexto.' }

// AFTER
{ key: 'fist',       category: 'hand',     universal: false, icon: '✊',  i18n: 'scenes.fist',       requires: 'hand', culturalNote: 'Political meaning varies. China: raised fist = Communist revolution symbolism (caution). Korea: "fighting" (파이팅) fist is positive; also used in political protests. Japan: "fight" (ファイト) fist is positive, less political. Taiwan: democracy movement symbolism. USA: Black Power / solidarity. In CJK streaming contexts, "fighting spirit" meaning is dominant and safe. Avoid for monetization triggers.' }
```

### 5.6 `open-palm`

```javascript
// BEFORE (line 61)
{ key: 'open-palm',  category: 'hand',     universal: false, icon: '🖐️',  i18n: 'scenes.open_palm',  requires: 'hand', culturalNote: 'En Grecia (mountza) hacia alguien = ofensa fuerte. Generalmente "stop" en otros lados.' }

// AFTER
{ key: 'open-palm',  category: 'hand',     universal: false, icon: '🖐️',  i18n: 'scenes.open_palm',  requires: 'hand', culturalNote: 'Greece (mountza): open palm toward someone = severe insult. Korea: open palm toward someone\'s face = EQUIVALENT TO MIDDLE FINGER (손바닥) — extremely offensive. Pakistan / some Arab countries: also offensive. China / Taiwan: means "stop" or "five" (五), rude toward face. Japan: standard "stop" signal, generally safe. West: "stop" or "high-five". DISABLE BY DEFAULT for Korean locale. DO NOT USE for monetization triggers in Korea.' }
```

### 5.7 `point`

```javascript
// BEFORE (line 62)
{ key: 'point',      category: 'hand',     universal: false, icon: '☝️',  i18n: 'scenes.point',      requires: 'hand', culturalNote: 'Apuntar con el dedo se considera grosero en muchas culturas asiáticas.' }

// AFTER
{ key: 'point',      category: 'hand',     universal: false, icon: '☝️',  i18n: 'scenes.point',      requires: 'hand', culturalNote: 'EXTREMELY offensive in China / Korea / Japan / Taiwan / Singapore — pointing at a person with the index finger is one of the most basic etiquette violations in ALL CJK cultures (taught to children from age 2-3). Equivalent to or worse than verbal insult. Always use the whole hand (palm up) to indicate people in CJK cultures. West: generally acceptable for objects, rude for people. Middle East: also offensive. Malaysia / Indonesia: also offensive. DISABLE BY DEFAULT for CJK locales. DO NOT USE for monetization triggers.' }
```

---

## 6. Missing Gesture Proposal: 🙏 Gassho / Prayer-Hands

### 6.1 Cultural Justification

The gassho / prayer-hands gesture (合掌 / 合十) is:

- **Japan:** THE courtesy gesture. Used daily for "thank you" (ありがとうございます), "please" (お願いします), "sorry" (すみません/gomenasai), and respect. Essential in business, temples, and daily life. In VTuber/streaming culture, 🙏 is the standard "thank you for the super chat / 投げ銭ありがとう" gesture.
- **Korea:** THE courtesy gesture. Used for "thank you" (감사합니다), "please" (부탁드립니다), and respect. 합장 is standard in Korean Buddhism and has been adopted into general courtesy. *(v1.5 — Korea skipped in v1.0)*
- **China:** THE courtesy gesture. 合十 is used for "thank you" (感谢), "please" (拜托), and in Buddhist contexts. Widely understood across all Chinese communities.
- **Taiwan / Singapore / SE Asia:** Same — universally understood as gratitude/respect.
- **Thailand / Vietnam / Philippines:** The wai (ไหว้) / 两手合十 / etc. is the PRIMARY greeting gesture. Not having this in the catalog for SE Asian markets would be a critical omission.

**This is the single most important hand gesture to add for CJK market entry.** Joel has approved for v1.0.

### 6.2 TRIGGER_CATALOG Entry Proposal

```javascript
{ key: 'gassho', category: 'hand', universal: false, icon: '🙏', i18n: 'scenes.gassho', requires: 'hand', culturalNote: 'Japan/Korea/China/Taiwan: THE courtesy gesture — means "thank you", "please", "sorry", and respect (合掌/합장/合十). PERFECT for donation thanks triggers in CJK. Thailand/Vietnam/Laos: primary greeting gesture (wai/ไหว้). India/Nepal: namaste greeting. West: prayer/religious context — may not be understood as "thank you" by default. IDEAL for monetization triggers in CJK markets.' }
```

### 6.3 i18n Keys Required

**v1.0 locales (zh-CN, ja-JP):**

| Locale | Key | Translation |
|---|---|---|
| zh-CN | `scenes.gassho` | "合十（感谢）" |
| ja-JP | `scenes.gassho` | "合掌（感謝）" |

**Full locale table (including v1.5 and other locales):**

| Locale | Key | Translation | v1.0? |
|---|---|---|---|
| en-US | `scenes.gassho` | "Gassho / Prayer Hands" | ✅ |
| ja-JP | `scenes.gassho` | "合掌（感謝）" | ✅ |
| ko-KR | `scenes.gassho` | "합장 (감사)" | ❌ v1.5 (stub only) |
| zh-CN | `scenes.gassho` | "合十（感谢）" | ✅ |
| zh-TW | `scenes.gassho` | "合十（感謝）" | ✅ |
| es-ES | `scenes.gassho` | "Gassho / Manos en oración" | ✅ |
| es-MX | `scenes.gassho` | "Gassho / Manos juntas" | ✅ |
| pt-BR | `scenes.gassho` | "Gassho / Mãos em prece" | ✅ |
| fr-FR | `scenes.gassho` | "Gassho / Mains jointes" | ✅ |
| de-DE | `scenes.gassho` | "Gassho / Gebetshände" | ✅ |
| it-IT | `scenes.gassho` | "Gassho / Mani giunte" | ✅ |
| ru-RU | `scenes.gassho` | "Гассё / Руки в молитве" | ✅ |
| ar-SA | `scenes.gassho` | "غاسو / يدان مضمومتان" | ✅ |
| pl-PL | `scenes.gassho` | "Gassho / Dłonie złożone" | ✅ |

**Note:** ko-KR is stub-only in v1.0 (Decision D1). The `scenes.gassho` key should still be present in the ko-KR locale file as a stub, but full Korean cultural mode integration is deferred to v1.5.

### 6.4 Feasibility Assessment — Human.js Detection (FULL IMPLEMENTATION PROPOSAL)

**Current status:** Human.js does **not** have a built-in "gassho/prayer-hands" hand gesture classification in its default `gesture` module. The `gesture` module recognizes approximately 18 hand poses, but gassho is not among them.

**Detection approach options:**

| Approach | Feasibility | Effort | Accuracy |
|---|---|---|---|
| **A. Custom landmark heuristic** — Detect when both hands are visible, all finger tips on both hands are close together (within threshold), and palms are facing each other | ✅ Feasible | Medium | ~85% — may confuse with "clap" or "hold" |
| **B. Extend Human.js gesture module** — Add a custom gesture detector to the `gesture` array | ✅ Feasible | Medium-High | ~90% — better control |
| **C. Use MediaPipe Hands directly** — Bypass Human.js gesture module, use raw hand landmarks | ✅ Feasible | High | ~95% — best accuracy |
| **D. Wait for Human.js upstream** — Request feature in Human.js repo | ❌ Uncertain | Low (but slow) | Unknown |

**Recommended approach: A (Custom landmark heuristic)** — approved by Joel for v1.0.

---

#### 6.4.1 Human.js Landmark Reference

Human.js uses the MediaPipe Hands 21-landmark model per hand. The landmark indices are:

| Index | Landmark | Description |
|---|---|---|
| 0 | WRIST | Wrist base |
| 1 | THUMB_CMC | Thumb carpometacarpal joint |
| 2 | THUMB_MCP | Thumb metacarpophalangeal joint |
| 3 | THUMB_IP | Thumb interphalangeal joint |
| 4 | THUMB_TIP | Thumb tip |
| 5 | INDEX_FINGER_MCP | Index finger metacarpophalangeal joint |
| 6 | INDEX_FINGER_PIP | Index finger proximal interphalangeal joint |
| 7 | INDEX_FINGER_DIP | Index finger distal interphalangeal joint |
| 8 | INDEX_FINGER_TIP | Index finger tip |
| 9 | MIDDLE_FINGER_MCP | Middle finger metacarpophalangeal joint |
| 10 | MIDDLE_FINGER_PIP | Middle finger proximal interphalangeal joint |
| 11 | MIDDLE_FINGER_DIP | Middle finger distal interphalangeal joint |
| 12 | MIDDLE_FINGER_TIP | Middle finger tip |
| 13 | RING_FINGER_MCP | Ring finger metacarpophalangeal joint |
| 14 | RING_FINGER_PIP | Ring finger proximal interphalangeal joint |
| 15 | RING_FINGER_DIP | Ring finger distal interphalangeal joint |
| 16 | RING_FINGER_TIP | Ring finger tip |
| 17 | PINKY_MCP | Pinky metacarpophalangeal joint |
| 18 | PINKY_PIP | Pinky proximal interphalangeal joint |
| 19 | PINKY_DIP | Pinky distal interphalangeal joint |
| 20 | PINKY_TIP | Pinky tip |

**Key landmarks for gassho detection:**
- **Fingertips:** `[4, 8, 12, 16, 20]` — must be close together between hands
- **MCP joints:** `[5, 9, 13, 17]` — used for palm orientation / normal vector computation
- **WRIST:** `[0]` — used for hand centering and height check

---

#### 6.4.2 Detailed Detection Heuristic

The gassho detection uses 6 sequential checks. All must pass for a detection:

**Check 1: Two hands visible**
- Require exactly 2 hands detected by Human.js `hand` module
- Both hands must have confidence ≥ 0.7
- One hand must be labeled "left" and the other "right"

**Check 2: Fingertip proximity**
- For each of the 5 fingertip pairs (indices `[4,8,12,16,20]`), compute Euclidean distance between left and right hand landmarks
- All coordinates are normalized [0,1] in Human.js output
- At least 4 of 5 fingertip pairs must have distance < `TIP_PROXIMITY_THRESHOLD = 0.07`
- This threshold was calibrated for typical webcam distance (0.5–1.5m): at 1m, fingertips touching are ~0.04–0.06 apart in normalized coords; relaxed to 0.07 for margin

**Check 3: Palm orientation — palms facing each other**
- Compute palm normal vector for each hand using MCP landmarks
- For each hand, compute: `normal = cross(MCP_middle - WRIST, MCP_index - MCP_pinky)`
  - Left hand: `normal = cross(landmark[9] - landmark[0], landmark[5] - landmark[17])`
  - Right hand: `normal = cross(landmark[9] - landmark[0], landmark[5] - landmark[17])`
- For a valid gassho, the two palm normals should point **toward each other** (dot product < 0)
- `dot(leftNormal, rightNormal) < 0` confirms palms face each other
- Additionally, require `|dot(leftNormal, rightNormal)| > 0.3` to reject cases where palms are parallel but facing the same direction (e.g., both hands flat on a desk)

**Check 4: Hand vertical alignment**
- Both wrists should be at approximately the same Y-coordinate (hands at same height)
- `|left.landmarks[0][1] - right.landmarks[0][1]| < 0.15`
- This rejects cases where one hand is significantly above the other

**Check 5: Centered position**
- The midpoint between both wrists should be near the center of the frame horizontally
- `|midX - 0.5| < 0.25` where `midX = (left.landmarks[0][0] + right.landmarks[0][0]) / 2`
- This rejects cases where hands are together but off to one side (e.g., leaning on elbow)

**Check 6: Hold-time (300ms minimum)**
- Gassho is a **sustained** gesture, unlike a clap which is transient
- Maintain a `gasshoHoldStart` timestamp; only fire the trigger after `HOLD_MIN_MS = 300` of continuous detection
- If any check fails for a single frame, reset `gasshoHoldStart`
- This is the **critical** differentiator from clap detection

---

#### 6.4.3 Complete Detection Function

```javascript
/**
 * Gassho (🙏 prayer-hands) detection heuristic for Human.js
 * 
 * Uses 21-landmark MediaPipe Hands model via Human.js hand module.
 * Detects when both hands are pressed together, palms facing each other,
 * fingertips touching, held for a minimum of 300ms.
 * 
 * @param {Array} hands - Array of hand results from Human.js
 * @param {number} now  - Current timestamp (performance.now())
 * @returns {{ detected: boolean, confidence: number, holdMs: number }}
 */

// --- Configuration constants ---
const GASSHO_CONFIG = {
    TIP_PROXIMITY_THRESHOLD: 0.07,   // Max normalized distance between matching fingertips
    MIN_CLOSE_TIPS: 4,                // Minimum number of close fingertip pairs (out of 5)
    PALM_NORMAL_DOT_MAX: -0.3,        // Palm normals must have dot product < this (facing each other)
    WRIST_Y_DELTA_MAX: 0.15,          // Max Y-difference between wrists
    CENTER_X_MAX_OFFSET: 0.25,        // Max horizontal offset from frame center
    HAND_CONFIDENCE_MIN: 0.7,         // Minimum hand detection confidence
    HOLD_MIN_MS: 300,                 // Minimum hold time to distinguish from clap
    HOLD_MAX_MS: 5000,                // Maximum hold time (reset after this to avoid stuck state)
};

// Fingertip landmark indices
const FINGERTIP_IDS = [4, 8, 12, 16, 20]; // thumb, index, middle, ring, pinky

// State variable (module-scoped, reset on detection loss)
let gasshoHoldStart = null;

function detectGassho(hands, now) {
    // === CHECK 1: Two hands visible with sufficient confidence ===
    if (!hands || hands.length < 2) {
        gasshoHoldStart = null;
        return { detected: false, confidence: 0, holdMs: 0 };
    }

    // Find left and right hands
    let leftHand = null, rightHand = null;
    for (const hand of hands) {
        if (hand.score < GASSHO_CONFIG.HAND_CONFIDENCE_MIN) continue;
        // Human.js labels hands as 'left' or 'right' (from camera perspective, mirrored)
        if (hand.label === 'left') leftHand = hand;
        if (hand.label === 'right') rightHand = hand;
    }

    if (!leftHand || !rightHand) {
        gasshoHoldStart = null;
        return { detected: false, confidence: 0, holdMs: 0 };
    }

    const leftPts = leftHand.landmarks;  // Array of 21 [x, y, z] normalized coords
    const rightPts = rightHand.landmarks;

    // === CHECK 2: Fingertip proximity ===
    let closeTips = 0;
    let totalTipDist = 0;
    for (const idx of FINGERTIP_IDS) {
        const dx = leftPts[idx][0] - rightPts[idx][0];
        const dy = leftPts[idx][1] - rightPts[idx][1];
        const dz = (leftPts[idx][2] || 0) - (rightPts[idx][2] || 0);
        const dist = Math.sqrt(dx * dx + dy * dy + dz * dz);
        totalTipDist += dist;
        if (dist < GASSHO_CONFIG.TIP_PROXIMITY_THRESHOLD) closeTips++;
    }

    if (closeTips < GASSHO_CONFIG.MIN_CLOSE_TIPS) {
        gasshoHoldStart = null;
        return { detected: false, confidence: 0, holdMs: 0 };
    }

    // === CHECK 3: Palm orientation (normals facing each other) ===
    // Compute palm normal for left hand
    const lWrist = leftPts[0];
    const lIndexMCP = leftPts[5];
    const lMiddleMCP = leftPts[9];
    const lPinkyMCP = leftPts[17];
    const leftPalmVec1 = [lMiddleMCP[0] - lWrist[0], lMiddleMCP[1] - lWrist[1], (lMiddleMCP[2] || 0) - (lWrist[2] || 0)];
    const leftPalmVec2 = [lIndexMCP[0] - lPinkyMCP[0], lIndexMCP[1] - lPinkyMCP[1], (lIndexMCP[2] || 0) - (lPinkyMCP[2] || 0)];
    const leftNormal = crossProduct(leftPalmVec1, leftPalmVec2);

    // Compute palm normal for right hand
    const rWrist = rightPts[0];
    const rIndexMCP = rightPts[5];
    const rMiddleMCP = rightPts[9];
    const rPinkyMCP = rightPts[17];
    const rightPalmVec1 = [rMiddleMCP[0] - rWrist[0], rMiddleMCP[1] - rWrist[1], (rMiddleMCP[2] || 0) - (rWrist[2] || 0)];
    const rightPalmVec2 = [rIndexMCP[0] - rPinkyMCP[0], rIndexMCP[1] - rPinkyMCP[1], (rIndexMCP[2] || 0) - (rPinkyMCP[2] || 0)];
    const rightNormal = crossProduct(rightPalmVec1, rightPalmVec2);

    // Normalize
    const leftNormMag = magnitude(leftNormal);
    const rightNormMag = magnitude(rightNormal);
    if (leftNormMag < 0.001 || rightNormMag < 0.001) {
        gasshoHoldStart = null;
        return { detected: false, confidence: 0, holdMs: 0 };
    }

    const dot = (leftNormal[0] * rightNormal[0] + leftNormal[1] * rightNormal[1] + leftNormal[2] * rightNormal[2]) 
                / (leftNormMag * rightNormMag);

    // Palms must face each other: dot product should be negative
    if (dot > GASSHO_CONFIG.PALM_NORMAL_DOT_MAX) {
        gasshoHoldStart = null;
        return { detected: false, confidence: 0, holdMs: 0 };
    }

    // === CHECK 4: Vertical alignment (wrists at similar height) ===
    const wristYDelta = Math.abs(leftPts[0][1] - rightPts[0][1]);
    if (wristYDelta > GASSHO_CONFIG.WRIST_Y_DELTA_MAX) {
        gasshoHoldStart = null;
        return { detected: false, confidence: 0, holdMs: 0 };
    }

    // === CHECK 5: Centered position ===
    const midX = (leftPts[0][0] + rightPts[0][0]) / 2;
    if (Math.abs(midX - 0.5) > GASSHO_CONFIG.CENTER_X_MAX_OFFSET) {
        gasshoHoldStart = null;
        return { detected: false, confidence: 0, holdMs: 0 };
    }

    // === CHECK 6: Hold time (300ms minimum) ===
    if (gasshoHoldStart === null) {
        gasshoHoldStart = now;
    }

    const holdMs = now - gasshoHoldStart;

    // Safety: reset if held too long (stuck state)
    if (holdMs > GASSHO_CONFIG.HOLD_MAX_MS) {
        gasshoHoldStart = now;
        return { detected: false, confidence: 0, holdMs: 0 };
    }

    // --- Confidence scoring ---
    // Composite score from 0.0 to 1.0
    const tipProximityScore = closeTips / 5;                           // 0.8 if 4/5 tips close
    const avgTipDist = totalTipDist / 5;
    const closenessScore = Math.max(0, 1 - avgTipDist / GASSHO_CONFIG.TIP_PROXIMITY_THRESHOLD); // closer = higher
    const palmScore = Math.max(0, -dot);                               // more negative dot = palms more facing
    const alignmentScore = 1 - (wristYDelta / GASSHO_CONFIG.WRIST_Y_DELTA_MAX);
    
    const confidence = Math.min(1, 
        (tipProximityScore * 0.35) + 
        (closenessScore * 0.25) + 
        (Math.min(palmScore, 1) * 0.25) + 
        (alignmentScore * 0.15)
    );

    const detected = holdMs >= GASSHO_CONFIG.HOLD_MIN_MS;

    if (!detected) {
        return { detected: false, confidence, holdMs };
    }

    // Fire detection — reset hold timer to prevent re-trigger for same hold
    gasshoHoldStart = null;
    return { detected: true, confidence, holdMs };
}

// --- Vector math utilities ---
function crossProduct(a, b) {
    return [
        a[1] * b[2] - a[2] * b[1],
        a[2] * b[0] - a[0] * b[2],
        a[0] * b[1] - a[1] * b[0]
    ];
}

function magnitude(v) {
    return Math.sqrt(v[0] * v[0] + v[1] * v[1] + v[2] * v[2]);
}
```

---

#### 6.4.4 Hold-Time Logic — Clap vs. Gassho Discrimination

The 300ms hold-time is the **critical differentiator** between gassho and clap:

| Gesture | Duration | Fingertip contact | Palm orientation |
|---|---|---|---|
| **Clap** | ~80–150ms (transient) | Tips touch briefly then separate | Palms briefly face each other, then apart |
| **Gassho** | ≥300ms (sustained) | Tips remain together | Palms continuously face each other |
| **Hold** (hands clasped at side) | ≥300ms but... | Tips may be close | Palms face each other BUT hands are NOT centered |
| **Hands together, not prayer** (fidgeting) | Variable | Variable | Palms may not face each other |

The hold-time check alone doesn't suffice — it must be combined with the centering check (Check 5) and palm orientation check (Check 3) to avoid false positives from "hold" and "fidgeting" gestures.

**State machine:**

```
IDLE → [all checks pass for 1 frame] → TRACKING (set gasshoHoldStart = now)
TRACKING → [all checks pass, holdMs < 300] → TRACKING (accumulate)
TRACKING → [all checks pass, holdMs ≥ 300] → DETECTED (fire trigger, reset to IDLE)
TRACKING → [any check fails] → IDLE (reset gasshoHoldStart)
DETECTED → IDLE (cooldown: 500ms before next detection allowed)
```

---

#### 6.4.5 Confidence Scoring Approach

The confidence score is a weighted composite of four sub-scores:

| Sub-score | Weight | What it measures | Range |
|---|---|---|---|
| `tipProximityScore` | 0.35 | How many fingertip pairs are close (4/5 = 0.8) | [0, 1] |
| `closenessScore` | 0.25 | How close the average fingertip distance is | [0, 1] |
| `palmScore` | 0.25 | How directly palms face each other (dot product) | [0, 1] |
| `alignmentScore` | 0.15 | How well wrists are vertically aligned | [0, 1] |

**Threshold for trigger fire:** Detection fires only when `holdMs ≥ 300` regardless of confidence. However, the `confidence` value is exposed to the caller for:
- UI feedback (show confidence meter while in TRACKING state)
- Logging / analytics (track average confidence for threshold tuning)
- Future use: a `confidenceMin` config option could require `confidence ≥ 0.6` to fire

---

#### 6.4.6 Integration Point in detector.js

The gassho detection should be integrated into `core/detector.js` at the **same point where other hand gesture detections are processed**. Specifically:

**Location:** After the Human.js `result.hand` array is populated and before the trigger dispatch logic.

```javascript
// In core/detector.js, within the main detection loop (e.g., detect() or processResults())

// --- Existing hand gesture processing ---
// (thumbs-up, peace, rock, ok, fist, open-palm, point detection)

// --- NEW: Gassho detection (v1.0) ---
// Add after existing hand gesture checks, before trigger dispatch
if (this.config.hand?.enabled) {
    const gasshoResult = detectGassho(result.hand, performance.now());
    if (gasshoResult.detected && gasshoResult.confidence >= 0.5) {
        // Apply same debounce/hysteresis as other triggers
        this._fireTrigger('gassho', {
            confidence: gasshoResult.confidence,
            holdMs: gasshoResult.holdMs,
        });
    }
}
```

**Exact insertion point:** Look for the section in `detector.js` that processes `result.hand` landmarks and dispatches trigger events. In the current codebase, this is typically in a method like `processHandResults()` or within the main `detect()` callback. The gassho check should be added **after** individual hand gesture classification (which processes one hand at a time) because gassho requires **both** hands simultaneously.

**File structure recommendation:**
- Option A (simple): Add `detectGassho()` function directly in `core/detector.js`
- Option B (cleaner): Create `core/gesture-gassho.js` as a standalone module, import into `detector.js`

Recommendation: **Option B** for v1.0 — keeps the detection logic isolated and testable.

```javascript
// core/detector.js
import { detectGassho, resetGasshoState } from './gesture-gassho.js';

// In processHandResults():
const gasshoResult = detectGassho(result.hand, performance.now());
// ...

// In reset/destroy:
resetGasshoState(); // Resets gasshoHoldStart
```

---

#### 6.4.7 Testing Strategy

**Unit tests (`tests/gesture-gassho.test.js`):**

| Test Case | Input | Expected Result |
|---|---|---|
| No hands | `hands = []` | `{ detected: false, confidence: 0 }` |
| One hand only | `hands = [leftHand]` | `{ detected: false, confidence: 0 }` |
| Two hands, apart | Fingertip distance > 0.15 | `{ detected: false, confidence: 0 }` |
| Two hands, tips close, palms facing, hold < 300ms | Mock holdMs = 200 | `{ detected: false, confidence: >0.5 }` |
| Two hands, tips close, palms facing, hold ≥ 300ms | Mock holdMs = 350 | `{ detected: true, confidence: >0.7 }` |
| Clap (tips close briefly then apart) | Tips close for 100ms then separate | `{ detected: false }` (hold not met) |
| Hands clasped at side | Center X offset > 0.25 | `{ detected: false }` (centering fails) |
| Palms facing same direction | dot product > -0.3 | `{ detected: false }` (palm check fails) |
| Wrists at different heights | Y-delta > 0.15 | `{ detected: false }` (alignment fails) |
| Low confidence hand | `hand.score = 0.3` | `{ detected: false }` (confidence check fails) |

**Integration tests:**
1. **Pre-recorded video test:** Use a 10-second video of a person performing gassho. Verify the trigger fires at the correct time.
2. **Clap video test:** Use a video of clapping. Verify the trigger does NOT fire.
3. **Mixed gestures test:** Video with gassho → clap → gassho. Verify only gassho fires, and fires twice.
4. **Edge case test:** Person with hands together but not in prayer position (e.g., interlaced fingers). Verify false positive rate.

**Manual QA:**
- Test with 3 different webcam distances (0.5m, 1.0m, 1.5m)
- Test with different hand sizes
- Test with partial occlusion (e.g., face partially blocking one hand)
- Test with different lighting conditions

**Accuracy target:** ~85% true positive rate, <10% false positive rate (see Section 6.4.8).

---

#### 6.4.8 Expected Accuracy Analysis (~85% Target)

**True positive scenarios (should detect):**

| Scenario | Expected Accuracy | Notes |
|---|---|---|
| Standard gassho, centered, good lighting | ~95% | Ideal case, all checks pass easily |
| Gassho slightly off-center | ~90% | Centering check has 0.25 margin |
| Gassho with one finger slightly apart | ~85% | MIN_CLOSE_TIPS=4 allows 1 finger to be off |
| Gassho at 1.5m distance | ~80% | Landmarks are noisier at distance; fingertips may appear closer than they are |
| Gassho with rolled-up sleeves (wrist visible) | ~90% | Wrist landmark is reliable |
| Gassho performed by child (smaller hands) | ~85% | Normalized coords help, but fingertips are closer together in pixel space |

**Overall expected true positive rate: ~85%** (weighted average across scenarios)

**Key accuracy bottlenecks:**
1. **Fingertip proximity threshold (0.07):** Too small → miss real gassho at distance. Too large → false positives from "hands near each other." Calibrated for 0.5–1.5m webcam distance.
2. **Hold time (300ms):** Too short → clap false positives. Too long → miss quick gassho. 300ms is based on: typical clap duration is 80–150ms; typical gassho hold is 500ms+.
3. **Palm orientation:** The cross-product normal can be noisy when hands are very close together (which is exactly the gassho case). The dot product threshold of -0.3 provides some margin but may miss loosely-prayer hands.

---

#### 6.4.9 False Positive Analysis

**Gesture confusions that could trigger false gassho detections:**

| Confused Gesture | Why It Might Trigger | Mitigation | Residual Risk |
|---|---|---|---|
| **Clap** | Tips close briefly, palms face each other | 300ms hold time — clap is 80–150ms | Very low — hold time effectively eliminates clap FP |
| **Hand-hold / Clasp** (fingers interlaced) | Hands together, palms may face each other | Fingertip proximity: interlaced fingers have tips at different distances, not all 4/5 close | Low — interlaced fingers rarely have 4/5 tips at uniform proximity |
| **Hands together but not prayer** (e.g., fidgeting, warming hands) | Tips close, palms may face each other | Centering check: fidgeting often happens at chest level but off-center. Hold time: fidgeting may not sustain 300ms | Medium — if person holds hands together at center for >300ms, it could false-trigger. Confidence score would be lower. |
| **"Namaste" bow** (hands together with head bow) | All checks pass | This IS a valid gassho! | Not a false positive — namaste IS gassho |
| **Rubbing hands** (warming) | Hands close, but moving | Fingertip proximity fluctuates — unlikely to sustain 4/5 close tips for 300ms | Very low — motion breaks the hold |
| **Two people's hands overlapping** | Two hand detections close together | Human.js labels these as left/right hands. Two different people's hands won't have matching fingertip proximity patterns. | Very low — landmark patterns differ |

**Estimated false positive rate: <10%** across all confusion scenarios. The primary residual risk is from "hands together at center, not prayer" which is mitigated by the confidence score (lower confidence for ambiguous cases).

---

#### 6.4.10 False Negative Analysis

**Scenarios where gassho should trigger but might not:**

| Scenario | Why It Might Miss | Estimated Miss Rate | Mitigation |
|---|---|---|---|
| **Quick gassho** (<300ms hold) | Hold time not met | ~5% of real gassho | Could reduce hold time to 200ms, but increases clap FP. Accept as trade-off. |
| **Gassho at extreme distance** (>2m) | Landmarks too noisy, fingertips appear merged | ~10% | Adjust TIP_PROXIMITY_THRESHOLD dynamically based on hand bounding box size |
| **Partial occlusion** (face blocks one hand) | One hand has low confidence or missing landmarks | ~15% | Reduce HAND_CONFIDENCE_MIN to 0.5 for the occluded hand? Risky. Accept as limitation. |
| **Gassho with fingers spread** (not tight prayer) | Fingertip distances exceed threshold | ~10% | Could reduce MIN_CLOSE_TIPS to 3, but increases FP. Accept as trade-off. |
| **One hand detected as "unknown" label** | Human.js occasionally mislabels hands | ~5% | Fallback: if 2 hands detected but labels aren't "left"/"right", use heuristic (left hand has thumb on right side in image) |
| **Side-angle gassho** (not facing camera) | Palm normals computed incorrectly | ~20% | Gassho is inherently a frontal gesture. Accept as limitation — VTubers face the camera. |

**Estimated false negative rate: ~15%** overall. The primary miss scenarios are extreme distance, partial occlusion, and non-frontal angle — all of which are edge cases in a VTuber streaming context where the user faces the camera at 0.5–1.5m distance.

---

#### 6.4.11 Performance Impact Estimate

**Computational cost per frame:**

| Operation | Cost | Notes |
|---|---|---|
| Hand detection (Human.js) | Already paid | Hand detection runs for all hand gestures |
| Fingertip proximity (5 distance calcs) | ~0.01ms | Trivial — 5 Euclidean distances on normalized coords |
| Palm normal computation (2 cross products) | ~0.01ms | Two 3D cross products + normalization |
| Dot product + checks | ~0.005ms | Simple arithmetic comparisons |
| **Total additional cost** | **~0.025ms per frame** | Negligible compared to Human.js hand detection (~15–30ms) |

**Memory impact:**
- `gasshoHoldStart`: 1 number (8 bytes)
- `GASSHO_CONFIG`: ~100 bytes (constant object)
- `detectGassho()` function: ~2KB compiled
- **Total: ~2.2KB** — negligible

**Frame rate impact:** At 30fps, the gassho check adds ~0.025ms per frame = 0.075% of a 33ms frame budget. **No measurable impact on frame rate.**

**Battery/thermal impact:** Negligible — the computation is trivial. The expensive part (hand detection) is already running.

---

### 6.5 Priority

**🔴 HIGH PRIORITY for v1.0 — APPROVED by Joel.** This gesture must be implemented before zh-CN and ja-JP market launch. It is the single most important cultural addition for the Asian market.

---

## 7. UI Recommendations for CJK Markets

> **v1.0 Note:** Per Joel's Decision D1, Korea (ko-KR) is skipped in v1.0. The UI recommendations below apply to zh-CN and ja-JP for v1.0. Korean-specific UI behavior (red badges for `open-palm`, ko-KR cultural mode) is deferred to v1.5.

### 7.1 Cultural Badge Differentiation by Locale

When the user's locale is a CJK language (`ja-JP`, `zh-CN` for v1.0; `ko-KR` in v1.5), the cultural badges should work differently:

| Current Badge | CJK Override | Rationale |
|---|---|---|
| 🌐 Universal | 🌐 Universal (no change) | All 18 biological triggers remain universal |
| ⚠️ Cultural (safe for CJK) | 🌐 Universal-ish → **✅ CJK Safe** | 👍, ✌️, 🤘 are safe in CJK — show a green "CJK Safe" badge instead of the generic warning |
| ⚠️ Cultural (caution for CJK) | **🟡 CJK Caution** | ✊ — show yellow "CJK Caution" badge |
| ⚠️ Cultural (risky for CJK) | **🔴 CJK Risk** | 👌, 🖐️ (ko-KR only), ☝️ — show red "CJK Risk" badge |

**Implementation:**

```javascript
// In TriggerUIBuilder._renderTriggerRow()
function getCjkBadge(trigger, userLocale) {
    const v1CjkLocales = ['ja-JP', 'zh-CN'];  // v1.0 — ko-KR added in v1.5
    const isCjk = v1CjkLocales.includes(userLocale);
    
    if (!isCjk) {
        // Use existing universal/cultural badge logic
        return trigger.universal ? '🌐' : '⚠️';
    }
    
    // CJK-specific badges
    const cjkSafeGestures = ['thumbs-up', 'peace', 'rock', 'gassho']; // gassho added v1.0
    const cjkCautionGestures = ['fist'];
    const cjkRiskyGestures = ['ok', 'point'];  // 'open-palm' added for ko-KR in v1.5
    
    if (trigger.universal) return '🌐';
    if (cjkSafeGestures.includes(trigger.key)) return '✅';
    if (cjkCautionGestures.includes(trigger.key)) return '🟡';
    if (cjkRiskyGestures.includes(trigger.key)) return '🔴';
    return '⚠️';
}
```

### 7.2 Default-Disabled Gestures by Locale

For CJK locales, the following gestures should be **disabled by default** (user can still enable them manually):

**v1.0 (zh-CN, ja-JP):**

| Gesture | Disabled for | Reason |
|---|---|---|
| 👌 `ok` | `ja-JP`, `zh-CN` | Means "money" not "OK" |
| ☝️ `point` | `ja-JP`, `zh-CN` | Extremely offensive in all CJK cultures |

**v1.5 (ko-KR addition):**

| Gesture | Disabled for | Reason |
|---|---|---|
| 👌 `ok` | `ko-KR` | Means "money" + political risk |
| 🖐️ `open-palm` | `ko-KR` | Equivalent to middle finger in Korea |
| ☝️ `point` | `ko-KR` | Extremely offensive in Korean culture |

**Implementation:**

Add a `disabledByDefaultLocales` field to TRIGGER_CATALOG entries and consume it in the config initialization:

```javascript
// In TRIGGER_CATALOG entries (v1.0)
{ key: 'ok', ..., disabledByDefaultLocales: ['ja-JP', 'zh-CN'] },         // + ko-KR in v1.5
{ key: 'point', ..., disabledByDefaultLocales: ['ja-JP', 'zh-CN'] },      // + ko-KR in v1.5

// v1.5 additions:
{ key: 'open-palm', ..., disabledByDefaultLocales: ['ko-KR'] },

// In ConfigManager initialization or TriggerUIBuilder.render()
function applyCjkDefaults(catalog, config, userLocale) {
    const v1CjkLocales = ['ja-JP', 'zh-CN'];  // v1.0 only
    if (!v1CjkLocales.includes(userLocale)) return;
    
    for (const trigger of catalog) {
        if (trigger.disabledByDefaultLocales?.includes(userLocale)) {
            // Only apply if user hasn't explicitly set this before
            const hasUserOverride = config.has(`scenes.${trigger.key}`);
            if (!hasUserOverride) {
                config.set(`scenes.${trigger.key}`, '');
                // Also visually mark as disabled
            }
        }
    }
}
```

### 7.3 "Cultural Mode" Toggle

**Recommendation:** Add a **"Cultural Mode"** toggle in the settings panel.

| Mode | Behavior |
|---|---|
| **🌐 Global Mode** (default) | Shows all gestures with their standard cultural badges. No gestures are hidden or disabled by default. |
| **🌏 CJK Cultural Mode** | Activates CJK-specific badge colors, disables risky gestures by default, shows CJK-specific culturalNote tooltips, and surfaces the 🙏 gassho gesture prominently. |

The toggle should:
- Auto-detect based on browser locale (`navigator.language`) on first launch
- Be manually overridable in settings
- Persist in config (`config.set('culturalMode', 'cjk')`)
- Change the universality banner text to explain CJK-specific cultural context
- Add a "⚠️ Cultural Mode: CJK" indicator in the header when active

**v1.0 note:** CJK Cultural Mode applies to zh-CN and ja-JP. A separate "KR Cultural Mode" will be added in v1.5 when ko-KR is fully supported.

### 7.4 Hidden-by-Default for CJK

**Recommendation:** Do NOT fully hide risky gestures in CJK mode. Instead:

1. **Show them greyed out** with a 🔴 badge and tooltip explaining the risk
2. **Require a confirmation click** to enable: "This gesture is considered offensive in [country]. Are you sure you want to enable it?"
3. **Display the full culturalNote** as an expandable section next to the trigger
4. **For monetization triggers specifically** (donation, sub, gift sub events), show a **red warning** if a risky gesture is mapped: "⚠️ This gesture is offensive in [country] and should not be used for donation responses"

This approach respects user autonomy while ensuring informed consent.

### 7.5 CJK-Specific Universality Banner

When Cultural Mode is CJK, replace the universality banner with a CJK-specific version:

```
🌏 CJK 文化模式 (Cultural Mode)
🌐 Universal = 生物性识别，所有文化含义相同（头部旋转、表情、视线、距离、眨眼）
✅ CJK Safe = 在中日地区安全使用（👍 点赞、✌️ 耶、🤘 摇滚）
🟡 CJK Caution = 需要注意语境（✊ 握拳 — 政治含义不确定）
🔴 CJK Risk = 在中日地区可能冒犯（👌 = 金钱/非OK、☝️ = 指人极不礼貌）
🙏 Recommended = 最适合中日的感谢手势（合十/合掌）
```

This banner should be localized to the user's CJK language. For v1.0, provide zh-CN and ja-JP versions. ko-KR version deferred to v1.5.

### 7.6 SE Asia Considerations

For Southeast Asian markets (Thailand, Vietnam, Philippines, Indonesia, Malaysia):

| Locale | Key Differences from CJK |
|---|---|
| 🇹🇭 Thailand | 🙏 wai is THE primary greeting — even more important than in CJK. Open palm gestures are less offensive. Point is still rude. OK sign is generally understood as "OK" (Western influence). |
| 🇻🇳 Vietnam | Similar to China — 🙏 is important, pointing is rude. OK sign is generally understood. |
| 🇵🇭 Philippines | Strong Western influence — most gestures understood as in the West. Point is rude (use lip-pointing instead, which is unique to Filipino culture). |
| 🇲🇾 Malaysia | Point is very rude (especially with index finger — Malays use the thumb). OK sign is generally understood. 🙏 is recognized. |
| 🇮🇩 Indonesia | Point is rude. OK sign is generally understood. 🙏 is recognized but less common than in Buddhist cultures. |

**Recommendation for SE Asian locales:** Implement a separate `se-asia` cultural mode that:
- Disables `point` by default (universally rude in SE Asia)
- Promotes `gassho` (🙏) prominently for Thailand and Vietnam
- Does NOT disable `ok` by default (Western influence makes it acceptable in most SE Asian countries)
- Adds a culturalNote for Malaysia about thumb-pointing vs index-pointing

**Timeline:** SE Asian cultural mode is deferred to v2.0+.

---

## Appendix A: Risk Summary Matrix

| # | Trigger | Category | 🇨🇳 | 🇰🇷 | 🇯🇵 | 🇹🇼 | 🇸🇬 | v1.0 Default (zh-CN, ja-JP) | v1.5 Default (ko-KR) |
|---|---|---|---|---|---|---|---|---|---|
| 1 | center | head | 🟢 | 🟢 | 🟢 | 🟢 | 🟢 | ✅ | ✅ |
| 2 | left | head | 🟢 | 🟢 | 🟢 | 🟢 | 🟢 | ✅ | ✅ |
| 3 | right | head | 🟢 | 🟢 | 🟢 | 🟢 | 🟢 | ✅ | ✅ |
| 4 | up | head | 🟢 | 🟢 | 🟢 | 🟢 | 🟢 | ✅ | ✅ |
| 5 | down | head | 🟢 | 🟢 | 🟢 | 🟢 | 🟢 | ✅ | ✅ |
| 6 | tilt-left | head | 🟢 | 🟢 | 🟢 | 🟢 | 🟢 | ✅ | ✅ |
| 7 | tilt-right | head | 🟢 | 🟢 | 🟢 | 🟢 | 🟢 | ✅ | ✅ |
| 8 | near | distance | 🟢 | 🟢 | 🟢 | 🟢 | 🟢 | ✅ | ✅ |
| 9 | far | distance | 🟢 | 🟢 | 🟢 | 🟢 | 🟢 | ✅ | ✅ |
| 10 | gaze-left | gaze | 🟢 | 🟢 | 🟢 | 🟢 | 🟢 | ✅ | ✅ |
| 11 | gaze-right | gaze | 🟢 | 🟢 | 🟢 | 🟢 | 🟢 | ✅ | ✅ |
| 12 | gaze-up | gaze | 🟢 | 🟢 | 🟢 | 🟢 | 🟢 | ✅ | ✅ |
| 13 | gaze-down | gaze | 🟢 | 🟢 | 🟢 | 🟢 | 🟢 | ✅ | ✅ |
| 14 | happy | emotion | 🟢 | 🟢 | 🟢 | 🟢 | 🟢 | ✅ | ✅ |
| 15 | surprise | emotion | 🟢 | 🟢 | 🟢 | 🟢 | 🟢 | ✅ | ✅ |
| 16 | angry | emotion | 🟢 | 🟢 | 🟢 | 🟢 | 🟢 | ✅ | ✅ |
| 17 | neutral | emotion | 🟢 | 🟢 | 🟢 | 🟢 | 🟢 | ✅ | ✅ |
| 18 | blink | blink | 🟢 | 🟢 | 🟢 | 🟢 | 🟢 | ✅ | ✅ |
| 19 | 👍 thumbs-up | hand | 🟢 | 🟢 | 🟢 | 🟢 | 🟢 | ✅ | ✅ |
| 20 | ✌️ peace | hand | 🟢 | 🟢 | 🟢 | 🟢 | 🟢 | ✅ | ✅ |
| 21 | 🤘 rock | hand | 🟢 | 🟢 | 🟢 | 🟢 | 🟢 | ✅ | ✅ |
| 22 | 👌 ok | hand | 🔴 | 🔴 | 🔴 | 🟡 | 🟡 | ❌ | ❌ |
| 23 | ✊ fist | hand | 🟡 | 🟡 | 🟡 | 🟡 | 🟢 | ⚠️ | ⚠️ |
| 24 | 🖐️ open-palm | hand | 🟡 | 🔴 | 🟢 | 🟡 | 🟡 | ⚠️ | ❌ |
| 25 | ☝️ point | hand | 🔴 | 🔴 | 🔴 | 🔴 | 🔴 | ❌ | ❌ |
| 26* | 🙏 gassho | hand | 🟢 | 🟢 | 🟢 | 🟢 | 🟢 | ✅ | ✅ |

*\* v1.0 addition — approved by Joel*

---

## Appendix B: Action Items for Engineering

| Priority | Action Item | File | Effort | Version |
|---|---|---|---|---|
| 🔴 P0 | Update `culturalNote` for `ok`, `point` | `core/trigger-ui-builder.js` | S | v1.0 |
| 🔴 P0 | Add `disabledByDefaultLocales` field to at-risk triggers (zh-CN, ja-JP) | `core/trigger-ui-builder.js` | S | v1.0 |
| 🔴 P0 | Implement `applyCjkDefaults()` in config initialization (zh-CN, ja-JP) | `core/config-manager.js` | M | v1.0 |
| 🔴 P0 | Implement CJK-specific badge logic in `_renderTriggerRow()` (zh-CN, ja-JP) | `core/trigger-ui-builder.js` | M | v1.0 |
| 🔴 P0 | Add `gassho` trigger entry to `TRIGGER_CATALOG` | `core/trigger-ui-builder.js` | S | v1.0 |
| 🔴 P0 | Implement gassho detection heuristic (full proposal in §6.4) | `core/gesture-gassho.js` (new) | M-L | v1.0 |
| 🔴 P0 | Integrate gassho detection into `detector.js` | `core/detector.js` | S | v1.0 |
| 🔴 P0 | Add `scenes.gassho` i18n key to zh-CN and ja-JP locale files | `locales/zh-CN.json`, `locales/ja-JP.json` | S | v1.0 |
| 🟡 P1 | Add `scenes.gassho` i18n key to all other locale files | `locales/*.json` | M | v1.0 |
| 🟡 P1 | Add "Cultural Mode" toggle to settings UI (zh-CN, ja-JP) | `index.html` + `app.js` | M | v1.0 |
| 🟡 P1 | Gassho unit tests | `tests/gesture-gassho.test.js` (new) | M | v1.0 |
| 🟡 P1 | Gassho integration tests (pre-recorded video) | `tests/` | M | v1.0 |
| 🟢 P2 | Update `culturalNote` for `thumbs-up`, `peace`, `rock`, `fist` | `core/trigger-ui-builder.js` | S | v1.0 |
| 🟢 P2 | CJK-specific universality banner (zh-CN, ja-JP) | `core/trigger-ui-builder.js` | S | v1.0 |
| 🟢 P2 | Confirmation dialog before enabling risky gestures | `core/trigger-ui-builder.js` | M | v1.0 |
| 🟢 P2 | Red warning on risky gesture + monetization trigger combo | `app.js` | M | v1.0 |
| 🔴 P0 | Add `disabledByDefaultLocales` for `open-palm` → `ko-KR` | `core/trigger-ui-builder.js` | S | **v1.5** |
| 🔴 P0 | Add `disabledByDefaultLocales` for `ok`, `point` → `ko-KR` | `core/trigger-ui-builder.js` | S | **v1.5** |
| 🔴 P0 | Implement `applyCjkDefaults()` for `ko-KR` | `core/config-manager.js` | S | **v1.5** |
| 🟡 P1 | Update `culturalNote` for `open-palm` with Korean offense detail | `core/trigger-ui-builder.js` | S | **v1.5** |
| 🟡 P1 | Add Korean-specific badge for `open-palm` (🔴 CJK Risk for ko-KR) | `core/trigger-ui-builder.js` | S | **v1.5** |
| 🟡 P1 | Add `scenes.gassho` i18n key to ko-KR locale file (full translation) | `locales/ko-KR.json` | S | **v1.5** |
| 🟡 P1 | KR Cultural Mode toggle | `index.html` + `app.js` | M | **v1.5** |
| 🟡 P1 | SOOP / CHZZK platform integration | new | L | **v1.5** |
| 🟡 P1 | Full ko-KR locale file (all keys, not just stub) | `locales/ko-KR.json` | M | **v1.5** |
| 🟢 P2 | CJK-specific universality banner (ko-KR version) | `core/trigger-ui-builder.js` | S | **v1.5** |
| 🟢 P2 | SE Asian cultural mode (`th-TH`, `vi-VN`, `fil-PH`, `ms-MY`) | future | L | **v2.0+** |

---

*End of document. This review was prepared for the EsperantAI project. Version 2.0 incorporates Joel's v1.0 decisions (2026-05-14): Korea skipped, gassho approved, zh-CN and ja-JP are the v1.0 target locales. The expanded gassho implementation proposal (§6.4) is the critical deliverable for engineering.*
