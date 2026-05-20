# EsperantAI — 用户手册

> **真诚的手势。** 用面部和手势控制你的直播软件，无需专用额外硬件。

**版本**：3.0 · **语言**：简体中文（另有 14 种语言翻译可用）

**技术验证**：已根据截至 **2026 年 5 月 20 日**可用的官方文档核对 OBS Studio、Streamlabs Desktop、vMix、PRISM Live Studio、XSplit、Twitch、YouTube Live、Kick、Trovo 和 StreamElements。详情见 [`docs/MANUAL_PLATFORM_AUDIT_2026-05.md`](MANUAL_PLATFORM_AUDIT_2026-05.md)。

---

## 目录

1. [EsperantAI 是什么？](#esperantai-是什么)
2. [最低配置要求](#最低配置要求)
3. [购买与激活](#购买与激活)
4. [首次使用](#首次使用)
5. [连接直播软件](#连接直播软件)
6. [配置手势与场景](#配置手势与场景)
7. [手势分类](#手势分类)
8. [连接直播平台](#连接直播平台)
9. [事件 + 手势组合（高级）](#事件--手势组合高级)
10. [灵敏度与死区](#灵敏度与死区)
11. [键盘快捷键](#键盘快捷键)
12. [触发历史](#触发历史)
13. [更改语言](#更改语言)
14. [管理你的许可证](#管理你的许可证)
15. [故障排除](#故障排除)
16. [隐私](#隐私)
17. [技术支持](#技术支持)

---

## EsperantAI 是什么？

EsperantAI 是一款**网页应用**，使用人工智能实时检测你的面部和手部动作，并把这些动作转换成直播软件命令。摄像头画面会在你的浏览器本地处理。

![EsperantAI 本地流程](assets/manual/01-esperantai-flow.svg)

它可配合以下直播软件使用：

- **OBS Studio** 28+
- **Streamlabs Desktop**
- **vMix**
- **PRISM Live Studio**
- **XSplit Broadcaster**（测试版）

它也可以接收平台事件，并与手势组合使用：

- **Twitch**：通过 EventSub WebSocket 直接支持。
- **YouTube Live**：通过 YouTube Data API v3 直接支持；需要正在进行的直播和可用配额。
- **Kick**：浏览器内为测试版/有限支持。完整 Kick 事件需要官方后端/webhook 或桥接方案。
- **StreamElements**：使用你账户的 token/JWT 作为跨平台桥接。
- **Trovo**：代码中已有技术适配器，但当前公共界面还没有公开 Trovo 连接面板。

### 为什么叫“真诚的手势”？

基础面部表情和头部旋转在**所有人类文化中都是共通的**（Paul Ekman，1972）。它们不会说谎，也不会因为地域不同而改变。EsperantAI 把这些手势标为“🌐 通用”，并把它们与“⚠️ 文化相关”手势（手势动作）区分开来，后者的含义可能因国家或地区而异。

请根据你的观众群体选择要使用的手势。

---

## 最低配置要求

### 硬件

- **任意 USB 网络摄像头**（推荐 1080p 或更高）
- **CPU**：近 5 年内的任意 4 核及以上处理器
- **内存**：最低 8 GB；如果同时直播，建议 16 GB
- **GPU**：任何支持 WebGL 的显卡（现代集成显卡也可以）

### 软件

- **操作系统**：Windows 10/11、macOS 12+，或使用较新内核的 Linux
- **浏览器**：Chrome 90+、Edge 90+ 或 Firefox 100+
- **直播软件**（至少一种）：OBS Studio 28+、Streamlabs Desktop、vMix、PRISM、XSplit

### 网络

- **激活许可证**需要联网，并且每 **7 天**需要重新验证
- 可**离线使用最多 7 天**（宽限期）

---

## 购买与激活

1. 访问 **https://edugame.digital**
2. 点击 **“购买许可证”**
3. 通过 LemonSqueezy 完成付款（银行卡、PayPal 等）
4. 你会收到一封电子邮件，其中包含：
   - 你的**许可证密钥**（格式：`XXXX-XXXX-XXXX-XXXX-XXXX`）
   - EsperantAI 使用链接
5. 在浏览器中打开 EsperantAI
6. 激活界面出现后，粘贴你的许可证密钥
7. 点击 **“激活许可证”**
8. 完成！

### 可以在几台设备上使用？

一个许可证最多可在 **3 台设备**上激活。如果要把许可证转移到另一台设备：

1. 在旧设备上：**高级**面板 → **许可证** → **在此设备上停用**
2. 在新设备上：正常激活即可

---

## 首次使用

### 第 1 步：允许摄像头访问

第一次打开 EsperantAI 时，浏览器会请求摄像头权限。请**允许**。

> 重要：EsperantAI 绝不会把你的视频发送到任何服务器。处理过程 100% 在你的设备本地完成。

### 第 2 步：选择摄像头

如果你有多个摄像头，请从摄像头下拉菜单中选择要使用的设备。

### 第 3 步：确认检测正常

左侧面板会显示你的面部。当 EsperantAI 检测到你的面部后，Yaw / Pitch / Roll 指示器会开始显示数值。

### 第 4 步：校准向导（Pro+）

如果你拥有 Pro 或 Pro+ 许可证，**校准向导**会在首次使用时自动启动。它会测量你的自然活动范围，并设置合适的灵敏度。你也可以随时通过 **重新校准** 按钮再次运行。

---

## 连接直播软件

![直播软件连接矩阵](assets/manual/02-software-setup.svg)

本节中的所有连接都是本地连接：EsperantAI 通过 `127.0.0.1` 与运行在同一台电脑上的直播软件通信。

### OBS Studio

1. 在 OBS 中打开：**工具 → WebSocket 服务器设置**
2. 启用 WebSocket 服务器。OBS Studio 28+ 已内置 obs-websocket。
3. 在 EsperantAI 中打开：**连接**面板
4. 直播软件选择：**OBS Studio**
5. WebSocket URL：`ws://127.0.0.1:4455`（默认）
6. 密码：如果你在 OBS 中启用了密码，请填写对应密码
7. 点击 **连接**

### Streamlabs Desktop

1. 在 Streamlabs Desktop 中打开：**Settings → Remote Control**
2. 启用本地远程控制
3. 从 Remote Control 页面复制 **API Token**
4. 在 EsperantAI 中选择直播软件：**Streamlabs Desktop**
5. 粘贴 API Token
6. 端口：`59650`（默认）
7. 点击 **连接**

### vMix

1. 在 vMix 中打开：**Settings → Web Controller**
2. 启用 Web Controller。默认端口为 `8088`。
3. 在 EsperantAI 中选择直播软件：**vMix**
4. 主机：`127.0.0.1`
5. 端口：`8088`
6. 点击 **连接**

> 注意：当前 EsperantAI 适配器使用 vMix 本地 HTTP API。如果你通过网络规则或浏览器不支持的凭据保护了 Web Controller，连接可能会失败。

### PRISM Live Studio

1. 使用 **PRISM Live Studio v4.0.5+**。
2. 手动安装与 OBS/PRISM 兼容的 `obs-websocket` 插件。
3. 按照 PRISM 官方 OBS 插件指南，把插件复制到 PRISM 的插件文件夹。
4. 重启 PRISM
5. 在 **工具 → WebSocket 服务器设置** 中启用 WebSocket
6. 在 EsperantAI 中选择直播软件：**PRISM Live Studio**（工作方式与 OBS 相同）

> 重要区别：OBS 28+ 已内置 obs-websocket；PRISM 需要手动安装插件。

### XSplit Broadcaster（测试版）

1. 安装或启用兼容 **XSplit XJS / Remote xjs** 的本地桥接。
2. 确认该桥接暴露本地 WebSocket URL。
3. 在 EsperantAI 中选择直播软件：**XSplit**
4. Remote xjs 代理 URL：`ws://127.0.0.1:5555/xjs`（默认）
5. 点击 **连接**

> XSplit 处于**测试版**。兼容性取决于已安装的本地 XJS 桥接；高级功能可能受限。

---

## 配置手势与场景

连接成功后，你的直播软件中的真实场景会自动显示在 **触发器** 面板的下拉菜单中。

### 基本映射

1. 为每个手势（例如“向左看”）从下拉菜单中选择一个场景
2. 当你做出该手势并稳定保持约 150ms 后，EsperantAI 会在直播软件中切换到对应场景
3. 切换是自动的，几乎即时完成

### 多动作（Pro+）

使用 Pro 或 Pro+ 许可证时，一个手势可以同时触发**多个动作**：
- 切换场景 + 播放声音 + 显示叠加层 + 向聊天发送消息

### 启用/禁用分类

每个分类都有自己的“启用”复选框：

- 🧠 **头部旋转**（通用 — 默认启用）
- 📏 **面部距离**（靠近或远离）
- 👁️ **视线**（只移动眼睛）
- 😀 **表情**（微笑、惊讶、愤怒、中性）
- 👁️‍🗨️ **双眨眼**
- ✋ **手势**（文化相关 — 默认禁用）

禁用不需要的分类可以节省 CPU。

---

## 手势分类

### 🌐 通用（在任何文化中含义相同）

| 手势 | 轴 | 如何触发 |
|---|---|---|
| 居中 | — | 正视前方，面部保持稳定 |
| 向左看 | yaw 负值 | 将头转向左侧 |
| 向右看 | yaw 正值 | 将头转向右侧 |
| 向上看 | pitch 负值 | 抬起脸 |
| 向下看 | pitch 正值 | 低下脸 |
| 向左倾斜 | roll 负值 | 将头向左肩倾斜 |
| 向右倾斜 | roll 正值 | 将头向右肩倾斜 |
| 靠近 | 距离 | 靠近摄像头 |
| 远离 | 距离 | 远离摄像头 |
| 视线 | 视线 | 只移动眼睛（头部居中） |
| 微笑 | 表情=高兴 | 清楚地微笑 |
| 惊讶 | 表情=惊讶 | 做出惊讶表情 |
| 愤怒 | 表情=愤怒 | 做出生气表情 |
| 中性 | 表情=中性 | 面部放松 |
| 双眨眼 | 眨眼 | 快速闭合双眼两次（< 700ms） |

### ⚠️ 文化相关（含义因国家或地区而异）

| 手势 | 西方含义 | 其他文化中的注意事项 |
|---|---|---|
| 👍 竖大拇指 | 赞同 | 中东 / 西亚：可能具有冒犯性 |
| ✌️ 胜利手势 | 和平 / 胜利 | 英国 / 爱尔兰 / 澳大利亚（手心向内）：侮辱手势 |
| 🤘 摇滚手势 | 摇滚 / 金属乐 | 意大利（手心向下）：“cornuto”（侮辱） |
| 👌 OK | OK / 完美 | 巴西 / 土耳其 / 德国：可能具有冒犯性 |
| ✊ 握拳 | 随政治语境而变 | — |
| 🖐️ 张开手掌 | “停”或问候 | 希腊（对人做 mountza）：强烈侮辱 |
| ☝️ 指向 | 指示 | 亚洲：用手指指人通常不礼貌 |

EsperantAI 会在界面中为每个手势显示对应标记。请根据你的全球观众选择要启用的手势。

### 🙏 合掌（合掌）

一个特殊手势：双手掌心在胸前合拢（类似祈祷或致意鞠躬）。在东亚文化中常用于表达尊重或感谢。EsperantAI 通过 6 项关键点检查来检测这个动作，可靠性较高。

---

## 连接直播平台

为了让 EsperantAI 接收事件（打赏、订阅、raid、关注或 Super Chat），请连接你进行直播的平台。

![平台事件状态](assets/manual/03-platform-events.svg)

### Twitch

1. 在 https://dev.twitch.tv/console 创建 Client ID
2. 注册重定向 URI：`https://edugame.digital/oauth-callback.html`（或你的本地 URL）
3. 在 EsperantAI 中打开：**平台事件**面板 → **Twitch EventSub**
4. 粘贴你的 Client ID
5. 点击 **连接**
6. Twitch 授权窗口会打开。接受权限。
7. 窗口关闭后，你会看到“Twitch 已连接”

EsperantAI 使用 EventSub WebSocket。不要把任何 Client Secret 粘贴到浏览器中。

### YouTube Live

1. 在 https://console.cloud.google.com 创建凭据
2. 启用 YouTube Data API v3
3. 创建 OAuth Client ID（类型：Web 应用）
4. 注册与 Twitch 相同的重定向 URI
5. 在 EsperantAI 中打开：**平台事件**面板 → **YouTube Live**
6. 粘贴 Client ID 并点击 **连接**

YouTube 要求：你必须有正在进行、且聊天可用的直播；你的 Google Cloud 项目也必须有足够配额来查询聊天。

### Kick via Streamer.bot

EsperantAI supports Kick through the **Streamer.bot bridge**. This is the recommended sales-ready route because it does not expose Kick secrets in the browser and does not rely on reverse engineering.

1. Install Streamer.bot 1.0.0 or newer.
2. In Streamer.bot, connect your Kick account.
3. In Streamer.bot: **Servers/Clients -> WebSocket Server** and enable the server.
4. Use `127.0.0.1`, port `8080`, and endpoint `/`, unless you changed those values.
5. In EsperantAI: **Platform Events** panel -> **Kick via Streamer.bot**.
6. Click **Connect**.

Events available through this bridge: follows, subscriptions, resubscriptions, gift subscriptions, and redemptions supported by Streamer.bot. Native official Kick backend/webhooks remain an advanced roadmap item.

### StreamElements（跨平台桥接）

如果你已经有 StreamElements 账户，可以把它作为多个平台提醒的桥接：

1. 前往 https://streamelements.com/dashboard/account/channels
2. 复制你的 JWT Token
3. 在 EsperantAI 中打开：**平台事件**面板 → **StreamElements**
4. 粘贴 JWT 并点击 **连接**

请将该 token 保密。把它当作你的 StreamElements 账户密码处理。

### Trovo

EsperantAI supports Trovo natively through OAuth and Trovo's official chat WebSocket.

1. Create an app in the Trovo developer portal.
2. Register the EsperantAI redirect URI: `oauth-callback.html` on the same domain where you open the app.
3. In EsperantAI: **Platform Events** panel -> **Trovo**.
4. Paste your Client ID and click **Connect**.
5. Authorize the requested permissions.

Available events: subscriptions, resubscriptions, gift subscriptions, follows, raids, spells/gifts, and magic chat.

---

## 事件 + 手势组合（高级）

这是 EsperantAI 的核心能力：把**平台事件**和**你的手势**组合起来，由手势作为确认。

![事件加手势流程](assets/manual/04-event-gesture-combo.svg)

### 示例：用竖大拇指感谢打赏

1. **事件触发器**面板 → “💰 打赏”行
2. ✅ 启用
3. 场景：`Escena_Gracias`
4. 必需手势：`👍 竖大拇指`

**直播流程**：
- 收到打赏 → EsperantAI 显示“等待手势...”
- 你有 5 秒时间做出 👍
- 如果做出手势 → 切换到 `Escena_Gracias` + 执行其他已配置动作
- 如果没有做出 → 自动取消

### 不要求手势（自动触发）

如果把“必需手势”保持为 `— 无 —`，事件会立即触发动作。

适用于：
- 收到 raid 时自动切换到庆祝场景
- 有人订阅时自动显示叠加层

---

## 灵敏度与死区

### 灵敏度

阈值控制手势需要多明显才会触发：

- **Yaw**：头部向左右转动的幅度（默认：0.15 rad ≈ 8.6°）
- **Pitch 上/下**：垂直倾斜
- **Roll**：侧向倾斜

调高数值需要更明显的手势。调低数值会提高灵敏度。

### 死区（防疲劳）

如果你几乎处于居中状态（yaw < 0.05、pitch < 0.05、roll < 0.08），**不会触发任何动作**。这样你可以自然移动，不会因细微动作误触发。

### 稳定帧数

`稳定帧数` = 触发前必须连续保持手势的帧数。默认：5 帧（30fps 时约 150ms）。

如果触发太容易，请调高。若需要更快响应，请调低。

### 冷却时间

`冷却时间 (ms)` = 两次场景切换之间的最短时间。默认：500ms。

它可以避免你快速摆动时切换不稳定。

---

## 键盘快捷键

| 按键 | 动作 |
|---|---|
| `空格` | 暂停 / 恢复检测 |
| `C` | 手动跳转到“居中”场景 |
| `R` | 从直播软件重新加载场景列表 |
| `Esc` | 断开连接 |

---

## 触发历史

**高级 → 触发历史**面板会显示最近 50 条已触发动作：

- ✓ 绿色 = 成功
- ✗ 红色 = 失败
- · 灰色 = 待处理

这有助于在不打开 DevTools 的情况下审计触发了哪些动作。

**导出 CSV**：下载历史记录，供离线分析。

**清除**：清空历史记录（不影响其他内容）。

---

## 更改语言

EsperantAI 会自动检测你的操作系统语言。如果要手动更改：

- 右上角：语言下拉菜单
- 选择你偏好的语言
- 界面会立即更新

可用语言：
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

当前界面文件已翻译为 15 种语言。

---

## 管理你的许可证

**高级 → 许可证**面板：

- **查看状态**：有效 / 无效
- **查看关联的客户电子邮件**
- **查看上次在线验证时间**
- **在此设备上停用**：更换电脑前使用，或释放一个设备名额（最多 3 个）

## 故障排除

### 粘贴许可证密钥后仍显示“需要激活”

- 确认你复制了完整密钥（5 组 4 个字符，以连字符分隔）
- 检查网络连接（首次激活需要在线验证）
- 如果已在 3 台设备上激活，请先停用其中一台
- 如果问题仍然存在，请联系 soporte@edugame.digital

### 面部可见，但一直显示“正在寻找面部...”

- 改善照明：你的面部应有足够光线
- 靠近摄像头（40-80 cm 最佳）
- 关闭其他使用 GPU 的标签页（打开太多标签页时，Chrome 可能限制 GPU）
- 如果 Chrome 内存节省程序已启用，请为此标签页停用

### 场景没有出现在下拉菜单中

- 确认你已经连接到直播软件（绿色“已连接”标记）
- 按 `R` 重新加载场景列表
- 如果仍然为空，请断开后重新连接
- 在 vMix 中，确认 Web Controller 已启用，并可通过 `http://127.0.0.1:8088/api/` 访问
- 在 PRISM 中，确认 obs-websocket 插件已安装并启用
- 在 XSplit 中，确认本地 XJS 桥接正在运行

### 没有做手势却触发了场景切换

- 在 **灵敏度** 面板中提高 yaw / pitch / roll 阈值
- 将 `稳定帧数` 从 5 提高到 8-10
- 确认死区已配置（yaw 0.05、pitch 0.05、roll 0.08）
- 检查画面中是否有其他人（多张面孔可能造成不稳定）

### 检测有延迟

- 关闭占用资源较高的应用（游戏、视频编辑软件）
- 如果有独立显卡，确认正在使用独立显卡而不是集成显卡
- 如果摄像头是 4K，请降低分辨率（1080p 对检测更合适）

### OBS 没有反应，但 EsperantAI 显示“场景已切换”

- 确认下拉菜单中的场景名称与 OBS 中的名称**完全一致**（区分大小写）
- 确认该场景不在其他场景集合中
- 查看 **触发历史** 面板。如果显示红色 ✗，里面会有具体错误

### 错误：“OBS 无法访问 — 请手动连接”

- 确认 OBS 已打开
- 确认 OBS 中已启用 WebSocket
- 如果你在 OBS 中设置了密码，密码必须完全一致
- 某些杀毒软件会阻止端口 4455，请添加例外

### Twitch 或 YouTube 无法连接

- 确认平台控制台里的重定向 URI 与 `oauth-callback.html` 的 URL 完全一致
- 允许 EsperantAI 所在域名打开弹出窗口
- 在 Twitch 中只使用 Client ID；不要粘贴 Client Secret
- 在 YouTube 中确认 YouTube Data API v3 已启用，并且有正在进行的直播

### Kick does not connect through Streamer.bot

Confirm that Streamer.bot 1.0.0+ is open, Kick is connected inside Streamer.bot, and **WebSocket Server** is enabled. Use `127.0.0.1:8080/` unless you changed the configuration. If Streamer.bot requires a password, enter the same password in EsperantAI.

---

## 隐私

### EsperantAI 不会做的事

- ❌ 不会把你的视频发送到任何服务器
- ❌ 不会存储你的视频或截图
- ❌ 不会远程收集生物特征信息
- ❌ 不会与广告商或第三方共享数据

### EsperantAI 会处理的内容

- ✅ 在你的浏览器中进行本地面部检测（Human.js + WebGL）
- ✅ 与 OBS / Streamlabs / vMix / PRISM / XSplit 建立本地连接（loopback `127.0.0.1`）
- ✅ 定期验证许可证密钥（每 7 天）
- ✅ 如果连接 Twitch/YouTube/Kick/StreamElements：平台 token 会保存在浏览器本地存储或会话存储中

完整详情见 `docs/PRIVACY.html`。

---

## 技术支持

- 📧 电子邮件：**soporte@edugame.digital**
- 🌐 网站：https://edugame.digital
- 📚 技术文档：https://github.com/salazarjoelo/EsperantAI

响应时间：
- 一般咨询：24-72 小时
- 技术错误：1-3 个工作日

---

*最后更新：2026-05-20。版本：3.0。*
*© 2026 EdugameDigital — Joel Salazar Ramírez. EsperantAI™.*
