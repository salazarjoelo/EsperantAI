# EsperantAI — 用户手册

> **真诚的手势。** 用你的面部和手势控制直播软件。无需 Stream Deck。无需额外硬件。

**版本**：3.0 · **语言**：简体中文（另有12种语言翻译可用）

---

## 目录

1. [EsperantAI 是什么？](#what-is-esperantai)
2. [最低配置要求](#minimum-requirements)
3. [购买与激活](#purchase--activation)
4. [首次使用](#first-use)
5. [连接直播软件](#connect-your-streaming-software)
6. [配置手势与场景](#configure-gestures--scenes)
7. [手势分类](#gesture-categories)
8. [连接直播平台](#connect-streaming-platforms)
9. [事件+手势组合（高级）](#event--gesture-combos-advanced)
10. [灵敏度与死区](#sensitivity--dead-zone)
11. [键盘快捷键](#keyboard-shortcuts)
12. [触发历史](#trigger-history)
13. [更改语言](#change-language)
14. [管理你的许可证](#manage-your-license)
15. [故障排除](#troubleshooting)
16. [隐私](#privacy)
17. [技术支持](#support)

---

## EsperantAI 是什么？

EsperantAI 是一款**网页应用**，利用人工智能实时检测你的面部和手势，并将其转化为直播软件的命令。支持以下软件：

- **OBS Studio** 28+
- **Streamlabs Desktop**
- **vMix**
- **PRISM Live Studio**
- **XSplit Broadcaster**（测试版）

并可接收以下平台的事件：

- **Twitch**
- **YouTube Live**
- **Kick**
- **Trovo**
- **StreamElements**（多平台桥接）

### 为什么叫"真诚的手势"？

基本的面部表情和头部旋转在**所有人类文化中都是共通的**（Paul Ekman，1972）。它们不会说谎，不会因地域而异。EsperantAI 将这些称为"🌐 通用"手势，并将其与含义可能因国家而异的"⚠️ 文化"手势（手语）区分开来。

请根据你的观众群体自行选择使用哪些手势。

---

## 最低配置要求

### 硬件

- **任意 USB 网络摄像头**（推荐：1080p 或更高）
- **CPU**：近5年内的4核及以上处理器
- **内存**：最低 8 GB。同时直播时建议 16 GB
- **GPU**：支持 WebGL 即可（现代集成显卡也可运行）

### 软件

- **操作系统**：Windows 10/11、macOS 12+ 或使用较新内核的 Linux
- **浏览器**：Chrome 90+、Edge 90+ 或 Firefox 100+
- **直播软件**（至少一款）：OBS Studio 28+、Streamlabs Desktop、vMix、PRISM、XSplit

### 网络

- **激活许可证**和**每7天的重新验证**需要联网
- 最长可**离线使用7天**（宽限期）

---

## 购买与激活

1. 访问 **https://esperantai.com**
2. 点击 **"Buy License"**
3. 通过 LemonSqueezy 完成支付（信用卡、PayPal 等）
4. 你将收到一封邮件，包含：
   - 你的**许可证密钥**（格式：`XXXX-XXXX-XXXX-XXXX-XXXX`）
   - EsperantAI 使用链接
5. 在浏览器中打开 EsperantAI
6. 会显示激活界面，粘贴你的许可证密钥
7. 点击 **"Activate License"**
8. 完成！🎉

### 可以在多台设备上使用吗？

一个许可证最多可在**3台设备**上激活。将许可证转移到其他设备：

1. 在旧设备上：**高级**面板 → **许可证** → **在此设备上停用**
2. 在新设备上：正常激活即可

---

## 首次使用

### 第1步：允许摄像头访问

首次打开 EsperantAI 时，浏览器会请求摄像头权限。**请允许**。

> 重要：EsperantAI 绝不会将你的视频发送到任何服务器。处理完全在你的电脑本地进行。

### 第2步：选择摄像头

如果你有多个摄像头，从摄像头下拉菜单中选择要使用的那个。

### 第3步：验证检测

左侧面板会显示你的面部。当 EsperantAI 检测到你的面部时，Yaw / Pitch / Roll 指示器将开始显示数值。

### 第4步：校正向导（Pro+）

如果你拥有 Pro 或 Pro+ 许可证，**校正向导**会在首次使用时自动启动。它会测量你自然的活动范围并设置最佳灵敏度。可随时通过**重新校正**按钮重新运行。

---

## 连接直播软件

### OBS Studio

1. 在 OBS 中：**工具 → WebSocket 服务器设置**
2. 启用 WebSocket。如果设置了密码请记下
3. 在 EsperantAI 中：**连接**面板
4. 直播软件：**OBS Studio**
5. WebSocket URL：`ws://127.0.0.1:4455`（默认）
6. 密码：你在 OBS 中设置的密码
7. 点击 **Connect**

### Streamlabs Desktop

1. 在 Streamlabs 中：**Settings → Remote Control**
2. 启用 Remote Control
3. 记下 API Token
4. 在 EsperantAI 中：直播软件：**Streamlabs Desktop**
5. API Token：粘贴
6. 端口：`59650`（默认）
7. 点击 **Connect**

### vMix

1. 在 vMix 中：**Settings → Web Controller**
2. 启用 Web Controller。默认端口：8088
3. 在 EsperantAI 中：直播软件：**vMix**
4. 主机：`127.0.0.1`
5. 端口：`8088`
6. 点击 **Connect**

### PRISM Live Studio

1. PRISM Live Studio v4.0.5+ 需要手动安装 obs-websocket 插件
2. 从 [OBS 论坛](https://obsproject.com/forum/resources/obs-websocket-remote-control-of-obs-studio-made-easy.466/)下载 `obs-websocket`
3. 复制到 PRISM 的插件文件夹
4. 重启 PRISM
5. 在 **工具 → WebSocket 服务器设置** 中启用 WebSocket
6. 在 EsperantAI 中：直播软件：**PRISM Live Studio**（与 OBS 相同方式工作）

### XSplit Broadcaster（测试版）

1. 在 XSplit 中安装 "Remote xjs" 扩展（Settings → Extensions）
2. 在首选项中启用 Remote
3. 在 EsperantAI 中：直播软件：**XSplit**
4. Remote xjs 代理 URL：`ws://127.0.0.1:5555/xjs`（默认）
5. 点击 **Connect**

> XSplit 目前为**测试版**，高级功能可能受限。

---

## 配置手势与场景

连接后，直播软件中的实际场景会自动显示在**触发器**面板的下拉菜单中。

### 基本映射

1. 为每个手势（例如"向左看"）从下拉菜单中选择一个场景
2. 当你做出该手势并保持稳定约150毫秒后，EsperantAI 将在直播软件中切换到该场景
3. 切换自动且近乎即时

### 多重动作（Pro+）

拥有 Pro 或 Pro+ 许可证时，一个手势可同时触发**多个动作**：
- 切换场景 + 播放声音 + 显示叠加层 + 发送聊天消息

### 启用/禁用分类

每个分类都有独立的"启用"复选框：

- 🧠 **头部旋转**（通用 — 默认启用）
- 📏 **面部距离**（靠近/远离）
- 👁️ **视线**（仅移动眼球）
- 😀 **表情**（微笑、惊讶、愤怒、中性）
- 👁️‍🗨️ **双眨眼**
- ✋ **手势**（文化相关 — 默认禁用）

禁用不需要的分类可节省 CPU 资源。

---

## 手势分类

### 🌐 通用（在任何文化中含义相同）

| 手势 | 轴 | 激活方式 |
|---|---|---|
| 中心 | — | 正视前方，面部保持稳定 |
| 向左看 | 负偏航 | 头向左转 |
| 向右看 | 正偏航 | 头向右转 |
| 向上看 | 负俯仰 | 抬起面部 |
| 向下看 | 正俯仰 | 低下面部 |
| 向左倾斜 | 负翻滚 | 头向左肩倾斜 |
| 向右倾斜 | 正翻滚 | 头向右肩倾斜 |
| 靠近 | 距离 | 面部靠近摄像头 |
| 远离 | 距离 | 面部远离摄像头 |
| 视线 | 视线 | 保持头部不动，仅移动眼球 |
| 微笑 | 表情=happy | 清晰地微笑 |
| 惊讶 | 表情=surprise | 做出惊讶表情 |
| 愤怒 | 表情=angry | 做出生气表情 |
| 中性 | 表情=neutral | 放松的面部 |
| 双眨眼 | 眨眼 | 快速闭合双眼两次（700毫秒内） |

### ⚠️ 文化相关（含义因国家而异）

| 手势 | 西方含义 | 其他文化中的注意事项 |
|---|---|---|
| 👍 竖大拇指 | 赞同、好 | 中东/西亚：可能具有冒犯性。※在中国无问题，广泛使用 |
| ✌️ 比耶 | 和平/胜利 | 英国/爱尔兰/澳大利亚（手心向内）：侮辱手势 |
| 🤘 金属角 | 摇滚 | 意大利（手心向下）："cornuto"（侮辱） |
| 👌 OK | 好/完美 | 巴西/土耳其/德国：可能具有冒犯性 |
| ✊ 握拳 | 因政治语境而异 | — |
| 🖐️ 张开手掌 | "停"或打招呼 | 希腊（对他人做mountza手势）：强烈侮辱 |
| ☝️ 指点 | 指示 | 亚洲：用手指指人是无礼的。※在中国尤其注意 |

EsperantAI 在界面中为每个手势标注相应的标识。请根据你的全球观众选择使用哪些手势。

### 🙏 合十（合十）

特殊手势：在胸前将双手掌心合拢（如同祈祷或鞠躬问候）。合十在中国文化中是常见的手势，广泛用于佛教礼仪、表达敬意、感恩和祈福。日常生活中也常在感谢、道歉或问候时配合使用。通过6个关键点检测，识别可靠性极高。

---

## 连接直播平台

为了让 EsperantAI 接收事件（打赏、订阅、突袭），请连接你直播的平台。

### Twitch

1. 在 https://dev.twitch.tv/console 创建 Client ID
2. 注册重定向 URI：`https://esperantai.com/oauth-callback.html`（或你的本地 URL）
3. 在 EsperantAI 中：**平台事件**面板 → **Twitch EventSub**
4. 粘贴你的 Client ID
5. 点击 **Connect**
6. 将打开 Twitch 授权窗口，接受权限
7. 窗口将关闭，显示"Twitch Connected"

### YouTube Live

1. 在 https://console.cloud.google.com 创建凭据
2. 启用 YouTube Data API v3
3. 创建 OAuth Client ID（类型：Web 应用）
4. 注册与 Twitch 相同的重定向 URI
5. 在 EsperantAI 中：**平台事件**面板 → **YouTube Live**
6. 粘贴 Client ID，点击 **Connect**

### Kick

1. 在 https://kick.com/settings/developer 创建应用
2. 注册重定向 URI
3. 在 EsperantAI 中：**平台事件**面板 → **Kick**
4. 粘贴 Client ID，点击 **Connect**
5. Kick 使用 OAuth 2.1 with PKCE（更安全）

### StreamElements（多平台桥接）

如果你已有 StreamElements 账号，可以用一个令牌统一管理 Twitch + YouTube + Facebook：

1. 访问 https://streamelements.com/dashboard/account/channels
2. 复制你的 JWT Token
3. 在 EsperantAI 中：**平台事件**面板 → **StreamElements**
4. 粘贴 JWT，点击 **Connect**

---

## 事件+手势组合（高级）

这就是 EsperantAI 的核心功能：将**平台事件**与**你的手势**作为确认进行组合。

### 示例：竖大拇指感谢打赏

1. **事件触发**面板 → "💰 打赏"行
2. ✅ 启用
3. 场景：`Thank_You_Scene`
4. 必选手势：`👍 竖大拇指`

**直播流程**：
- 收到打赏 → EsperantAI 显示"等待手势..."
- 你有5秒时间做出👍
- 做出手势 → 切换到 `Thank_You_Scene` + 执行其他已配置的动作
- 未做出 → 自动取消

### 无需必选手势（自动触发）

如果将"必选手势"保持为 `— 无 —`，事件将立即触发动作。

适用于：
- 收到突袭时自动切换到庆祝场景
- 有人订阅时自动显示叠加层

---

## 灵敏度与死区

### 灵敏度

阈值控制手势需要多大才能触发：

- **偏航**：头部向侧面转动的幅度（默认：0.15 rad ≈ 8.6°）
- **俯仰 上/下**：上下倾斜
- **翻滚**：左右倾斜

调高数值需要更大幅度的手势。调低则更灵敏。

### 死区（防疲劳）

当你几乎处于中心位置时（偏航 < 0.05、俯仰 < 0.05、翻滚 < 0.08），**不会触发任何动作**。这让你可以自然移动，而不会因微小动作触发。

### 稳定帧数

`稳定帧数` = 手势必须连续保持多少帧才会触发。默认：5帧（约150毫秒 / 30fps）。

如果触发太灵敏请调高，需要更快响应请调低。

### 冷却时间

`冷却时间 (ms)` = 场景切换之间的最短间隔。默认：500毫秒。

防止快速来回晃动时切换"抖动"。

---

## 键盘快捷键

| 按键 | 动作 |
|---|---|
| `Space` | 暂停/恢复检测 |
| `C` | 手动跳转到中心场景 |
| `R` | 从直播软件重新加载场景列表 |
| `Esc` | 断开连接 |

---

## 触发历史

**高级 → 触发历史**面板显示最近50条触发的动作：

- ✓ 绿色 = 成功
- ✗ 红色 = 失败
- · 灰色 = 待处理

无需打开 DevTools 即可查看触发记录，非常方便。

**导出 CSV**：下载历史记录进行离线分析。

**清除**：清空历史记录（不影响其他功能）。

---

## 更改语言

EsperantAI 会自动检测操作系统的语言。手动更改方法：

- 右上角：语言下拉菜单
- 选择你偏好的语言
- 界面立即更新

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

全部13种语言已完全翻译（各342个键）。

---

## 管理你的许可证

**高级 → 许可证**面板：

- **查看状态**：有效/无效
- **查看关联的客户邮箱**
- **查看上次在线验证时间**
- **在此设备上停用**：更换电脑前或释放名额时使用（共3个名额）

### 退款

如果 EsperantAI 未能满足你的预期，从购买之日起**14天内**可申请全额退款。请将许可证密钥发送至 soporte@edugame.digital。

---

## 故障排除

### 粘贴许可证密钥后仍显示"需要激活"

- 确认已复制完整密钥（5组4位字符，以连字符分隔）
- 检查网络连接（首次激活需要在线验证）
- 如已在3台设备上激活，请先停用其中一台
- 如仍未解决，请联系 soporte@edugame.digital

### 面部可见但一直显示"正在搜索面部..."

- 改善照明：确保面部光线充足
- 靠近摄像头（40-80厘米最佳）
- 关闭使用 GPU 的其他标签页（Chrome 可能会限制 GPU 使用）
- 如果 Chrome 的内存节省功能已开启，请对此标签页禁用

### 下拉菜单中不显示场景

- 确认已连接直播软件（绿色标记"Connected"）
- 按 `R` 键重新加载场景列表
- 如仍为空，请断开后重新连接

### 没有做手势却触发了场景切换

- 在**灵敏度**面板中提高偏航/俯仰/翻滚阈值
- 将`稳定帧数`从5提高到8-10
- 确认死区已配置（偏航 0.05、俯仰 0.05、翻滚 0.08）
- 检查画面中是否有其他人（多人面部可能导致不稳定）

### 检测延迟

- 关闭占用资源的程序（游戏、视频编辑）
- 确认使用的是独立显卡而非集成显卡（如有）
- 如果摄像头分辨率为4K，降低到1080p（1080p是检测的最佳分辨率）

### EsperantAI 显示"场景已更改"但 OBS 没有反应

- 确认下拉菜单中的场景名称与 OBS 中的完全一致（区分大小写）
- 确认场景不在其他场景集合中
- 查看**触发历史**面板 — 如果显示 ✗ 红色，说明有具体错误

### 错误"OBS 无法连接 — 请手动连接"

- 确认 OBS 已打开
- 确认 OBS 中已启用 WebSocket
- 如在 OBS 中设置了密码，必须完全匹配
- 部分杀毒软件会阻止端口 4455 — 请添加例外

---

## 隐私

### EsperantAI 不会做的事

- ❌ 不会将你的视频发送到任何服务器
- ❌ 不会存储你的视频或截图
- ❌ 不会远程收集生物特征信息
- ❌ 不会与广告商或第三方共享数据

### 会处理的内容

- ✅ 在浏览器中进行本地面部检测（Human.js + WebGL）
- ✅ 到 OBS / Streamlabs / vMix 的本地连接（回环 127.0.0.1）
- ✅ 定期许可证密钥验证（每7天）
- ✅ 如连接 Twitch/YouTube/Kick：OAuth 令牌存储在 sessionStorage 中（关闭浏览器时删除）

完整详情请参阅 `docs/PRIVACY.html`。

---

## 技术支持

- 📧 邮箱：**soporte@edugame.digital**
- 🌐 网站：https://esperantai.com
- 📚 技术文档：https://github.com/salazarjoelo/EsperantAI

响应时间：
- 一般问题：24-72小时
- 技术问题：1-3个工作日
- 退款请求：1-2个工作日

---

*最后更新：2026-05-14。版本：3.0。*
*© 2026 EdugameDigital — Joel Salazar Ramírez. EsperantAI™.*
