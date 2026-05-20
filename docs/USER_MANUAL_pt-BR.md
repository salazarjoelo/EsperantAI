# EsperantAI — Manual do Usuário

> **Gestos sinceros.** Controle seu software de streaming com o rosto e as mãos. Sem Stream Deck. Sem hardware extra.

**Versão**: 3.0 · **Idioma**: Português (Brasil) (traduções disponíveis em mais 12 idiomas)

---

## Sumário

1. [O que é o EsperantAI?](#o-que-é-o-esperantai)
2. [Requisitos Mínimos](#requisitos-mínimos)
3. [Compra e Ativação](#compra-e-ativação)
4. [Primeiro Uso](#primeiro-uso)
5. [Conecte Seu Software de Streaming](#conecte-seu-software-de-streaming)
6. [Configure Gestos e Cenas](#configure-gestos-e-cenas)
7. [Categorias de Gestos](#categorias-de-gestos)
8. [Conecte Plataformas de Streaming](#conecte-plataformas-de-streaming)
9. [Combinações de Evento + Gesto (Avançado)](#combinações-de-evento--gesto-avançado)
10. [Sensibilidade e Zona Morta](#sensibilidade-e-zona-morta)
11. [Atalhos de Teclado](#atalhos-de-teclado)
12. [Histórico de Gatilhos](#histórico-de-gatilhos)
13. [Alterar Idioma](#alterar-idioma)
14. [Gerencie Sua Licença](#gerencie-sua-licença)
15. [Solução de Problemas](#solução-de-problemas)
16. [Privacidade](#privacidade)
17. [Suporte](#suporte)

---

## O que é o EsperantAI?

O EsperantAI é um **aplicativo web** que usa inteligência artificial para detectar seus gestos faciais e das mãos em tempo real, e os traduz em comandos para o seu software de streaming. Funciona com:

- **OBS Studio** 28+
- **Streamlabs Desktop**
- **vMix**
- **PRISM Live Studio**
- **XSplit Broadcaster** (beta)

E recebe eventos de plataformas como:

- **Twitch**
- **YouTube Live**
- **Kick**
- **Trovo**
- **StreamElements** (ponte multiplataforma)

### Por que "gestos sinceros"?

Expressões faciais básicas e rotação da cabeça são **universais em todas as culturas humanas** (Paul Ekman, 1972). Elas não mentem, não variam por geografia. O EsperantAI chama esses de gestos "🌐 Universais" e os distingue dos gestos "⚠️ Culturais" (sinais com as mãos), cujo significado pode variar por país.

Você decide quais gestos usar com base no seu público.

---

## Requisitos Mínimos

### Hardware

- **Qualquer webcam USB** (recomendada: 1080p ou superior)
- **CPU**: qualquer processador de 4+ núcleos dos últimos 5 anos
- **RAM**: 8 GB no mínimo. 16 GB recomendados se você estiver fazendo streaming simultaneamente.
- **GPU**: qualquer uma com suporte a WebGL (mesmo GPUs integradas modernas funcionam)

### Software

- **SO**: Windows 10/11, macOS 12+ ou Linux com kernel recente
- **Navegador**: Chrome 90+, Edge 90+ ou Firefox 100+
- **Software de streaming** (pelo menos um): OBS Studio 28+, Streamlabs Desktop, vMix, PRISM, XSplit

### Internet

- Necessária para **ativar sua licença** e a cada **7 dias** para revalidação
- Funciona **até 7 dias offline** (período de carência)

---

## Compra e Ativação

1. Acesse **https://edugame.digital**
2. Clique em **"Buy License"**
3. Conclua o pagamento via LemonSqueezy (cartão, PayPal, etc.)
4. Você receberá um e-mail com:
   - Sua **chave de licença** (formato: `XXXX-XXXX-XXXX-XXXX-XXXX`)
   - Link para usar o EsperantAI
5. Abra o EsperantAI no seu navegador
6. A tela de ativação aparecerá. Cole sua chave de licença
7. Clique em **"Activate License"**
8. Pronto! 🎉

### Quantos dispositivos?

Uma licença pode ser ativada em **até 3 dispositivos**. Para mover sua licença para outro dispositivo:

1. No dispositivo antigo: painel **Advanced** → **License** → **Deactivate on this device**
2. No novo dispositivo: ative normalmente

---

## Primeiro Uso

### Passo 1: Permitir acesso à câmera

Quando você abrir o EsperantAI pela primeira vez, o navegador pedirá permissão para usar a câmera. **Aceite**.

> Importante: o EsperantAI nunca envia seu vídeo para nenhum servidor. O processamento é 100% local no seu dispositivo.

### Passo 2: Selecionar câmera

Se você tiver mais de uma câmera, escolha qual usar no seletor de câmeras.

### Passo 3: Verificar detecção

Você verá seu rosto no painel esquerdo. Quando o EsperantAI detectar seu rosto, os indicadores de Yaw / Pitch / Roll começarão a exibir valores.

### Passo 4: Assistente de Calibração (Pro+)

Se você tiver uma licença Pro ou Pro+, o **Assistente de Calibração** será iniciado automaticamente no primeiro uso. Ele mede sua amplitude natural de movimento e define a sensibilidade ideal. Você pode reexecutá-lo a qualquer momento pelo botão **Recalibrate**.

---

## Conecte Seu Software de Streaming

### OBS Studio

1. No OBS: **Tools → WebSocket Server Settings**
2. Ative o WebSocket. Anote a senha, caso tenha definido uma.
3. No EsperantAI: painel **Connection**
4. Software de streaming: **OBS Studio**
5. URL do WebSocket: `ws://127.0.0.1:4455` (padrão)
6. Senha: a que você definiu no OBS
7. Clique em **Connect**

### Streamlabs Desktop

1. No Streamlabs: **Settings → Remote Control**
2. Ative o Remote Control
3. Anote o API Token
4. No EsperantAI: Software de streaming: **Streamlabs Desktop**
5. API Token: cole-o
6. Porta: `59650` (padrão)
7. Clique em **Connect**

### vMix

1. No vMix: **Settings → Web Controller**
2. Ative o Web Controller. Porta padrão: 8088.
3. No EsperantAI: Software de streaming: **vMix**
4. Host: `127.0.0.1`
5. Porta: `8088`
6. Clique em **Connect**

### PRISM Live Studio

1. O PRISM Live Studio v4.0.5+ requer instalação manual do plugin obs-websocket
2. Baixe o `obs-websocket` no [fórum do OBS](https://obsproject.com/forum/resources/obs-websocket-remote-control-of-obs-studio-made-easy.466/)
3. Copie para a pasta de plugins do PRISM
4. Reinicie o PRISM
5. Ative o WebSocket em **Tools → WebSocket Server Settings**
6. No EsperantAI: Software de streaming: **PRISM Live Studio** (funciona da mesma forma que o OBS)

### XSplit Broadcaster (beta)

1. Instale a extensão "Remote xjs" no XSplit (Settings → Extensions)
2. Ative o Remote nas preferências
3. No EsperantAI: Software de streaming: **XSplit**
4. URL do Proxy Remote xjs: `ws://127.0.0.1:5555/xjs` (padrão)
5. Clique em **Connect**

> O XSplit está em **beta**. Recursos avançados podem ser limitados.

---

## Configure Gestos e Cenas

Uma vez conectado, as cenas reais do seu software aparecerão automaticamente nos menus suspensos do painel **Triggers**.

### Mapeamento básico

1. Para cada gesto (por exemplo, "Look Left"), escolha uma cena no menu suspenso
2. Quando você fizer esse gesto e mantê-lo estável por ~150ms, o EsperantAI trocará para essa cena no seu software de streaming
3. A mudança é automática e praticamente instantânea

### Multi-acção (Pro+)

Com uma licença Pro ou Pro+, um gesto pode acionar **várias ações** simultaneamente:
- Trocar cena + reproduzir som + exibir overlay + enviar mensagem no chat

### Ativar / desativar categorias

Cada categoria tem sua própria caixa de seleção "Enable":

- 🧠 **Rotação da cabeça** (universal — ativada por padrão)
- 📏 **Distância do rosto** (aproximar/afastar)
- 👁️ **Olhar** (mover somente os olhos)
- 😀 **Emoções** (sorriso, surpresa, raiva, neutro)
- 👁️‍🗨️ **Piscada dupla**
- ✋ **Gestos com as mãos** (cultural — desativado por padrão)

Desative as categorias que você não precisa para economizar CPU.

---

## Categorias de Gestos

### 🌐 Universais (mesmo significado em qualquer cultura)

| Gesto | Eixo | Como ativar |
|---|---|---|
| Centro | — | Olhando para frente, rosto estável |
| Olhar para a esquerda | yaw negativo | Vire a cabeça para a sua esquerda |
| Olhar para a direita | yaw positivo | Vire a cabeça para a sua direita |
| Olhar para cima | pitch negativo | Levante o rosto |
| Olhar para baixo | pitch positivo | Abaixe o rosto |
| Inclinar para a esquerda | roll negativo | Incline a cabeça em direção ao ombro esquerdo |
| Inclinar para a direita | roll positivo | Incline a cabeça em direção ao ombro direito |
| Aproximar | distância | Aproxime o rosto da câmera |
| Afastar | distância | Afaste o rosto da câmera |
| Olhar direcional | olhar | Mova somente os olhos (cabeça centrada) |
| Sorrindo | emoção=feliz | Sorria claramente |
| Surpreso | emoção=surpresa | Demonstre surpresa |
| Com raiva | emoção=raiva | Demonstre raiva |
| Neutro | emoção=neutro | Rosto relaxado |
| Piscada dupla | piscada | Feche os dois olhos duas vezes rapidamente (< 700ms) |

### ⚠️ Culturais (significado varia por país)

| Gesto | Significado no Ocidente | Cautela em outras culturas |
|---|---|---|
| 👍 Joinha | Aprovação | Oriente Médio / Ásia Ocidental: pode ser ofensivo |
| ✌️ Paz | Paz / vitória | Reino Unido / Irlanda / Austrália (palma para dentro): insulto |
| 🤘 Chifre de rock | Rock/metal | Itália (palma para baixo): "cornuto" (insulto) |
| 👌 OK | OK / perfeito | **🇧🇷 Brasil / Turquia / Alemanha: pode ser EXTREMAMENTE ofensivo. No Brasil, este gesto é equivalente a mostrar o dedo do meio — NUNCA o use em stream para público brasileiro.** |
| ✊ Punho fechado | Varia conforme contexto político | — |
| 🖐️ Palma aberta | "Pare" ou saudação | Grécia (mountza em direção a alguém): insulto forte |
| ☝️ Apontar | Indicar | Ásia: apontar com o dedo é indelicado |

O EsperantAI marca cada gesto com seu respectivo distintivo na interface. Escolha quais usar com base no seu público global.

### 🙏 Gassho (合掌)

Um gesto especial: junte as duas palmas à frente do peito (como uma oração ou cumprimento). Comum em culturas do Leste Asiático como sinal de respeito ou gratidão. Detectado com alta confiabilidade usando 6 verificações de pontos de referência.

---

## Conecte Plataformas de Streaming

Para que o EsperantAI receba eventos (doações, subs, raids), conecte as plataformas onde você faz streaming.

### Twitch

1. Crie um Client ID em https://dev.twitch.tv/console
2. Registre a URI de redirecionamento: `https://edugame.digital/oauth-callback.html` (ou sua URL local)
3. No EsperantAI: painel **Platform Events** → **Twitch EventSub**
4. Cole seu Client ID
5. Clique em **Connect**
6. Uma janela de autorização da Twitch será aberta. Aceite as permissões.
7. A janela será fechada e você verá "Twitch Connected"

### YouTube Live

1. Crie credenciais em https://console.cloud.google.com
2. Ative a YouTube Data API v3
3. Crie um OAuth Client ID (tipo: Web Application)
4. Registre a mesma URI de redirecionamento usada na Twitch
5. No EsperantAI: painel **Platform Events** → **YouTube Live**
6. Cole seu Client ID e clique em **Connect**

### Kick

1. Crie um app em https://kick.com/settings/developer
2. Registre a URI de redirecionamento
3. No EsperantAI: painel **Platform Events** → **Kick**
4. Cole seu Client ID e clique em **Connect**
5. O Kick usa OAuth 2.1 com PKCE (mais seguro)

### StreamElements (ponte multiplataforma)

Se você já tem uma conta no StreamElements, pode unificar Twitch + YouTube + Facebook com um único token:

1. Acesse https://streamelements.com/dashboard/account/channels
2. Copie seu JWT Token
3. No EsperantAI: painel **Platform Events** → **StreamElements**
4. Cole o JWT e clique em **Connect**

---

## Combinações de Evento + Gesto (Avançado)

Essa é a mágica do EsperantAI: combinar **eventos de plataforma** com **seus gestos** como confirmação.

### Exemplo: agradecer doações com um joinha

1. Painel **Event Triggers** → linha "💰 Donation"
2. ✅ Ative
3. Cena: `Thank_You_Scene`
4. Gesto obrigatório: `👍 Thumbs up`

**Fluxo ao vivo**:
- Chega uma doação → o EsperantAI exibe "Waiting for gesture..."
- Você tem 5 segundos para fazer 👍
- Se você fizer → troca para `Thank_You_Scene` + executa quaisquer outras ações configuradas
- Se não fizer → é descartado automaticamente

### Sem gesto obrigatório (acionamento automático)

Se você deixar "Required gesture" como `— none —`, o evento aciona a ação imediatamente.

Útil para:
- Trocar automaticamente para a cena de celebração quando chegar uma raid
- Exibir automaticamente um overlay quando alguém se inscrever

---

## Sensibilidade e Zona Morta

### Sensibilidade

Os limites controlam o tamanho que um gesto deve ter para ser acionado:

- **Yaw**: quanto virar a cabeça para o lado (padrão: 0,15 rad ≈ 8,6°)
- **Pitch para cima/para baixo**: inclinação vertical
- **Roll**: inclinação lateral

Aumente os valores para exigir gestos mais exagerados. Diminua para mais sensibilidade.

### Zona morta (antifadiga)

Se você estiver quase centralizado (yaw < 0,05, pitch < 0,05, roll < 0,08), **NADA dispara**. Isso permite que você se mova naturalmente sem que micromovimentos ativem gatilhos.

### Frames estáveis

`Stable frames` = quantos frames consecutivos o gesto deve ser mantido antes de acionar. Padrão: 5 frames (~150ms a 30fps).

Aumente se os gatilhos estiverem sendo acionados com facilidade demais. Diminua para resposta mais rápida.

### Cooldown

`Cooldown (ms)` = tempo mínimo entre trocas de cena. Padrão: 500ms.

Evita que o alternador fique "instável" caso você oscile rapidamente.

---

## Atalhos de Teclado

| Tecla | Ação |
|---|---|
| `Espaço` | Pausar / Retomar detecção |
| `C` | Ir manualmente para a cena CENTER |
| `R` | Recarregar lista de cenas do software |
| `Esc` | Desconectar |

---

## Histórico de Gatilhos

O painel **Advanced → Trigger History** exibe as últimas 50 ações acionadas:

- ✓ verde = sucesso
- ✗ vermelho = falhou
- · cinza = pendente

Útil para auditar o que foi acionado sem abrir o DevTools.

**Export CSV**: baixe o histórico para análise offline.

**Clear**: apague o histórico (não afeta mais nada).

---

## Alterar Idioma

O EsperantAI detecta automaticamente o idioma do seu sistema operacional. Para alterá-lo manualmente:

- Canto superior direito: seletor de idiomas
- Selecione o idioma de sua preferência
- A interface é atualizada imediatamente

Idiomas disponíveis:
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

Todos os 13 idiomas estão totalmente traduzidos (342 chaves cada).

---

## Gerencie Sua Licença

Painel **Advanced → License**:

- **Ver status**: Válida / Inválida
- **Ver e-mail do cliente associado**
- **Ver última validação online**
- **Deactivate on this device**: use antes de trocar de PC ou para liberar uma vaga (das 3 disponíveis)

## Solução de Problemas

### "Activation required" persiste após colar minha chave de licença

- Verifique se você copiou a chave completa (5 grupos de 4 caracteres separados por traços)
- Verifique sua conexão com a internet (a ativação requer validação online na primeira vez)
- Se você já ativou em 3 dispositivos, desative um primeiro
- Entre em contato com soporte@edugame.digital se o problema persistir

### "Searching for face..." persiste mesmo com meu rosto visível

- Melhore a iluminação: seu rosto deve estar bem iluminado
- Aproxime-se da câmera (40-80 cm é o ideal)
- Feche outras abas que usem a GPU (o Chrome pode limitar a GPU se houver muitas abas abertas)
- se o Memory Saver do Chrome estiver ativo, desative-o para esta aba

### Cenas não aparecem nos menus suspensos

- Verifique se você está conectado ao software de streaming (distintivo verde "Connected")
- Pressione `R` para recarregar a lista de cenas
- Se continuar vazia, desconecte e reconecte

### Trocas de cena são acionadas sem eu fazer gestos

- Aumente o limite de yaw / pitch / roll no painel **Sensitivity**
- Aumente `Stable frames` de 5 para 8-10
- Certifique-se de que a zona morta esteja configurada (yaw 0,05, pitch 0,05, roll 0,08)
- Verifique se não há mais ninguém no enquadramento (múltiplos rostos podem causar instabilidade)

### Atraso na detecção

- Feche aplicativos pesados (jogos, edição de vídeo)
- Verifique se você está usando a GPU dedicada, se tiver uma (não a integrada)
- Reduza a resolução da câmera se for 4K (1080p é o ideal para detecção)

### O OBS não reage mesmo com o EsperantAI dizendo "Scene changed"

- Verifique se o nome da cena no menu suspenso corresponde EXATAMENTE ao do OBS (diferencia maiúsculas e minúsculas)
- Verifique se a cena não está em outra Coleção de Cenas
- Consulte o painel **Trigger History** — se mostrar ✗ vermelho, há um erro específico

### Erro "OBS unreachable — Connect manually"

- Verifique se o OBS está aberto
- Verifique se o WebSocket está ativado no OBS
- Se você definiu uma senha no OBS, ela deve corresponder exatamente
- Alguns antivírus bloqueiam a porta 4455 — adicione uma exceção

---

## Privacidade

### O que o EsperantAI NÃO faz

- ❌ NÃO envia seu vídeo para nenhum servidor
- ❌ NÃO armazena seu vídeo ou capturas
- ❌ NÃO coleta informações biométricas remotamente
- ❌ NÃO compartilha dados com anunciantes ou terceiros

### O que ELE processa

- ✅ Detecção facial local no seu navegador (Human.js + WebGL)
- ✅ Conexões locais ao seu OBS / Streamlabs / vMix (loopback 127.0.0.1)
- ✅ Validação periódica da chave de licença (a cada 7 dias)
- ✅ Se você conectar Twitch/YouTube/Kick: tokens OAuth no sessionStorage (excluídos ao fechar o navegador)

Detalhes completos em `docs/PRIVACY.html`.

---

## Suporte

- 📧 E-mail: **soporte@edugame.digital**
- 🌐 Web: https://edugame.digital
- 📚 Documentação técnica: https://github.com/salazarjoelo/EsperantAI

Tempos de resposta:
- Dúvidas gerais: 24-72 horas
- Bugs técnicos: 1-3 dias úteis
- Solicitações de reembolso: 1-2 dias úteis

---

*Última atualização: 2026-05-14. Versão: 3.0.*
*© 2026 EdugameDigital — Joel Salazar Ramírez. EsperantAI™.*
