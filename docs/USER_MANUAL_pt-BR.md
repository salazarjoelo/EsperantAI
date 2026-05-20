# EsperantAI — Manual do usuário

> **Gestos honestos.** Controle seu software de streaming com o rosto e as mãos, sem hardware adicional dedicado.

**Versão**: 2.0 · **Idioma**: Português (Brasil) (traduções disponíveis em outros 14 idiomas; 15 idiomas no total)

**Validação técnica**: revisado contra a documentação oficial disponível em **20 de maio de 2026** para OBS Studio, Streamlabs Desktop, vMix, PRISM Live Studio, XSplit, Twitch, YouTube Live, Kick, Trovo e StreamElements. Detalhes: [`docs/MANUAL_PLATFORM_AUDIT_2026-05.md`](MANUAL_PLATFORM_AUDIT_2026-05.md).

---

## Sumário

1. [O que é o EsperantAI?](#o-que-é-o-esperantai)
2. [Requisitos mínimos](#requisitos-mínimos)
3. [Compra e ativação](#compra-e-ativação)
4. [Primeiro uso](#primeiro-uso)
5. [Conecte seu software de streaming](#conecte-seu-software-de-streaming)
6. [Configure gestos e cenas](#configure-gestos-e-cenas)
7. [Categorias de gestos](#categorias-de-gestos)
8. [Conecte plataformas de streaming](#conecte-plataformas-de-streaming)
9. [Combinações de evento + gesto (Avançado)](#combinações-de-evento--gesto-avançado)
10. [Sensibilidade e zona morta](#sensibilidade-e-zona-morta)
11. [Atalhos de teclado](#atalhos-de-teclado)
12. [Histórico de gatilhos](#histórico-de-gatilhos)
13. [Alterar idioma](#alterar-idioma)
14. [Gerencie sua licença](#gerencie-sua-licença)
15. [Solução de problemas](#solução-de-problemas)
16. [Privacidade](#privacidade)
17. [Suporte](#suporte)

---

## O que é o EsperantAI?

O EsperantAI é uma **aplicação web** que usa inteligência artificial para detectar seus gestos faciais e manuais em tempo real, e os traduz em comandos para o seu software de streaming. O vídeo da sua câmera é processado localmente no navegador.

![Fluxo local do EsperantAI](assets/manual/01-esperantai-flow.svg)

Funciona com estes programas de transmissão:

- **OBS Studio** 28+
- **Streamlabs Desktop**
- **vMix**
- **PRISM Live Studio**
- **XSplit Broadcaster** (beta)

Também pode receber eventos de plataformas para combiná-los com seus gestos:

- **Twitch**: suporte direto por EventSub WebSocket.
- **YouTube Live**: suporte direto pela YouTube Data API v3; requer live ativa e quota disponível.
- **Kick**: suporte pelo **bridge local do Streamer.bot**. O Streamer.bot recebe Kick por sua integracao oficial e o EsperantAI escuta esses eventos por WebSocket local.
- **StreamElements**: ponte multiplataforma com token/JWT da sua conta.
- **Trovo**: suporte direto por OAuth + WebSocket oficial de chat do Trovo.

### Por que "gestos honestos"?

As expressões faciais básicas e a rotação da cabeça são **universais em todas as culturas humanas** (Paul Ekman, 1972). Elas não mentem, não variam por geografia. O EsperantAI chama esses gestos de "🌐 Universais" e os distingue dos gestos "⚠️ Culturais" (sinais com as mãos), cujo significado pode variar de país para país.

Você decide quais gestos usar de acordo com o seu público.

---

## Requisitos mínimos

### Hardware

- **Qualquer webcam USB** (recomendada: 1080p ou superior)
- **CPU**: qualquer processador de 4+ núcleos dos últimos 5 anos
- **RAM**: 8 GB no mínimo. 16 GB recomendados se você fizer streaming ao mesmo tempo.
- **GPU**: qualquer uma com suporte a WebGL (até GPUs integradas modernas funcionam)

### Software

- **Sistema operacional**: Windows 10/11, macOS 12+ ou Linux com kernel recente
- **Navegador**: Chrome 90+, Edge 90+ ou Firefox 100+
- **Software de streaming** (pelo menos um): OBS Studio 28+, Streamlabs Desktop, vMix, PRISM, XSplit

### Internet

- Necessária para **ativar sua licença** e a cada **7 dias** para revalidação
- Funciona **até 7 dias sem conexão** (período de carência)

---

## Compra e ativação

1. Acesse **https://edugame.digital**
2. Clique em **"Comprar licença"**
3. Conclua o pagamento via LemonSqueezy (cartão, PayPal, etc.)
4. Você receberá um e-mail com:
   - Sua **chave de licença** (formato: `XXXX-XXXX-XXXX-XXXX-XXXX`)
   - Link para usar o EsperantAI
5. Abra o EsperantAI no seu navegador
6. A tela de ativação será exibida. Cole sua chave de licença
7. Clique em **"Ativar licença"**
8. Pronto! 🎉

### Quantos dispositivos?

Uma licença pode ser ativada em **até 3 dispositivos**. Para mover sua licença para outro dispositivo:

1. No dispositivo antigo: painel **Avançado** → **Licença** → **Desativar neste dispositivo**
2. No dispositivo novo: ative normalmente

---

## Primeiro uso

### Passo 1: Permita o acesso à câmera

Quando você abrir o EsperantAI pela primeira vez, o navegador pedirá permissão para acessar a câmera. **Aceite**.

> Importante: o EsperantAI nunca envia seu vídeo para nenhum servidor. O processamento é 100% local no seu dispositivo.

### Passo 2: Selecione a câmera

Se você tiver mais de uma câmera, escolha qual usar no menu suspenso de câmeras.

### Passo 3: Verifique a detecção

Você verá seu rosto no painel esquerdo. Quando o EsperantAI detectar seu rosto, os indicadores de Yaw / Pitch / Roll começarão a mostrar valores.

### Passo 4: Assistente de calibração (Pro+)

Se você tiver uma licença Pro ou Pro+, o **Assistente de calibração** será iniciado automaticamente no primeiro uso. Ele mede sua amplitude natural de movimento e define a sensibilidade ideal. Você pode executá-lo novamente a qualquer momento pelo botão **Recalibrar**.

---

## Conecte seu software de streaming

![Matriz de conexão do software de streaming](assets/manual/02-software-setup.svg)

Todas as conexões desta seção são locais: o EsperantAI se comunica com o programa de transmissão que está rodando no mesmo computador por meio de `127.0.0.1`.

### OBS Studio

1. No OBS: **Ferramentas → Configurações do servidor WebSocket**
2. Ative o servidor WebSocket. O OBS Studio 28+ já inclui obs-websocket.
3. No EsperantAI: painel **Conexão**
4. Software de streaming: **OBS Studio**
5. URL do WebSocket: `ws://127.0.0.1:4455` (padrão)
6. Senha: a que você configurou no OBS, se tiver ativado senha
7. Clique em **Conectar**

### Streamlabs Desktop

1. No Streamlabs Desktop: **Settings → Remote Control**
2. Ative o controle remoto local
3. Copie o **API Token** na tela de Remote Control
4. No EsperantAI: Software de streaming: **Streamlabs Desktop**
5. Token de API: cole o token
6. Porta: `59650` (padrão)
7. Clique em **Conectar**

### vMix

1. No vMix: **Settings → Web Controller**
2. Ative o Web Controller. Porta padrão: `8088`.
3. No EsperantAI: Software de streaming: **vMix**
4. Host: `127.0.0.1`
5. Porta: `8088`
6. Clique em **Conectar**

> Observação: o adaptador atual do EsperantAI usa a API HTTP local do vMix. Se você protegeu o Web Controller com regras de rede ou credenciais incompatíveis com o navegador, a conexão pode falhar.

### PRISM Live Studio

1. Use **PRISM Live Studio v4.0.5+**.
2. Instale manualmente o plugin `obs-websocket` compatível com OBS/PRISM.
3. Copie-o para a pasta de plugins do PRISM seguindo o guia oficial da PRISM para plugins OBS.
4. Reinicie o PRISM
5. Ative o WebSocket em **Ferramentas → Configurações do servidor WebSocket**
6. No EsperantAI: Software de streaming: **PRISM Live Studio** (funciona como o OBS)

> Diferença importante: o OBS 28+ já inclui obs-websocket. O PRISM exige instalação manual do plugin.

### XSplit Broadcaster (beta)

1. Instale ou habilite uma ponte local compatível com **XSplit XJS / Remote xjs**.
2. Verifique se a ponte expõe uma URL WebSocket local.
3. No EsperantAI: Software de streaming: **XSplit**
4. URL do proxy Remote xjs: `ws://127.0.0.1:5555/xjs` (padrão)
5. Clique em **Conectar**

> O XSplit está em **beta/avançado**. A compatibilidade depende da ponte XJS local instalada; recursos avançados podem estar limitados.

---

## Configure gestos e cenas

Depois de conectado, as cenas reais do seu software aparecerão automaticamente nos menus suspensos do painel **Gatilhos**.

### Mapeamento básico

1. Para cada gesto (por exemplo, "Olhar para a esquerda"), escolha uma cena no menu suspenso
2. Quando você fizer esse gesto e o mantiver estável por ~150ms, o EsperantAI mudará para essa cena no seu software de streaming
3. A mudança é automática e praticamente instantânea

### Multi-ação (Pro+)

Com uma licença Pro ou Pro+, um gesto pode acionar **múltiplas ações** ao mesmo tempo:
- Mudar cena + reproduzir som + mostrar overlay + enviar mensagem ao chat

### Ativar / desativar categorias

Cada categoria tem sua própria caixa "Ativar":

- 🧠 **Rotação da cabeça** (universal — ativada por padrão)
- 📏 **Distância facial** (aproxime-se ou afaste-se)
- 👁️ **Olhar** (mova só os olhos)
- 😀 **Emoções** (sorriso, surpresa, raiva, neutro)
- 👁️‍🗨️ **Piscada dupla**
- ✋ **Gestos com as mãos** (cultural — desativados por padrão)

Desative as categorias de que você não precisa para economizar CPU.

---

## Categorias de gestos

### 🌐 Universais (mesmo significado em qualquer cultura)

| Gesto | Eixo | Como ativar |
|---|---|---|
| Centro | — | Olhando para a frente, rosto estável |
| Olhar para a esquerda | yaw negativo | Vire a cabeça para a sua esquerda |
| Olhar para a direita | yaw positivo | Vire a cabeça para a sua direita |
| Olhar para cima | pitch negativo | Levante o rosto |
| Olhar para baixo | pitch positivo | Abaixe o rosto |
| Inclinar para a esquerda | roll negativo | Incline a cabeça em direção ao ombro esquerdo |
| Inclinar para a direita | roll positivo | Incline a cabeça em direção ao ombro direito |
| Aproximar-se | distância | Aproxime-se da câmera |
| Afastar-se | distância | Afaste-se da câmera |
| Olhar direcional | olhar | Mova só os olhos (cabeça centralizada) |
| Sorriso | emoção=feliz | Sorria claramente |
| Surpresa | emoção=surpresa | Mostre surpresa |
| Raiva | emoção=raiva | Mostre raiva |
| Neutro | emoção=neutro | Rosto relaxado |
| Piscada dupla | piscada | Feche os dois olhos duas vezes rapidamente (< 700ms) |

### ⚠️ Culturais (o significado varia conforme o país)

| Gesto | Significado ocidental | Cuidado em outras culturas |
|---|---|---|
| 👍 Joinha | Aprovação | Oriente Médio / Ásia Ocidental: pode ser ofensivo |
| ✌️ Paz | Paz / vitória | Reino Unido / Irlanda / Austrália (palma para dentro): insulto |
| 🤘 Chifres do rock | Rock / metal | Itália (palma para baixo): "cornuto" (insulto) |
| 👌 OK | OK / perfeito | Brasil / Turquia / Alemanha: pode ser ofensivo |
| ✊ Punho fechado | Varia conforme o contexto político | — |
| 🖐️ Palma aberta | "Pare" ou saudação | Grécia (mountza em direção a alguém): insulto forte |
| ☝️ Apontar | Indicar | Ásia: apontar com o dedo é falta de educação |

O EsperantAI marca cada gesto com o respectivo selo na interface. Escolha quais usar de acordo com o seu público global.

### 🙏 Gassho (合掌)

Um gesto especial: junte as duas palmas à frente do peito (como em uma oração ou reverência de saudação). Comum em culturas do Leste Asiático como sinal de respeito ou gratidão. É detectado com alta confiabilidade por meio de 6 verificações de pontos de referência.

---

## Conecte plataformas de streaming

Para que o EsperantAI receba eventos (doações, inscrições, raids, follows ou Super Chats), conecte as plataformas onde você faz streaming.

![Estado de eventos por plataforma](assets/manual/03-platform-events.svg)

### Twitch

1. Crie um Client ID em https://dev.twitch.tv/console
2. Registre a URI de redirecionamento: `https://TU-DOMINIO/oauth-callback.html` (ou sua URL local)
3. No EsperantAI: painel **Eventos de plataforma** → **Twitch EventSub**
4. Cole seu Client ID
5. Clique em **Conectar**
6. Uma janela de autorização da Twitch será aberta. Aceite as permissões.
7. A janela será fechada e você verá "Twitch conectado"

O EsperantAI usa EventSub WebSocket. Não cole nenhum Client Secret no navegador.

### YouTube Live

1. Crie credenciais em https://console.cloud.google.com
2. Ative a YouTube Data API v3
3. Crie um OAuth Client ID (tipo: Aplicação web)
4. Registre a mesma URI de redirecionamento usada na Twitch
5. No EsperantAI: painel **Eventos de plataforma** → **YouTube Live**
6. Cole seu Client ID e clique em **Conectar**

Requisitos do YouTube: você precisa ter uma live ativa com chat disponível, e seu projeto no Google Cloud deve ter quota suficiente para consultar o chat.

### Kick via Streamer.bot

O EsperantAI recebe eventos da Kick por meio do **bridge do Streamer.bot**. Esta é a rota recomendada para venda porque não expõe segredos da Kick no navegador e evita depender de engenharia reversa.

1. Instale o Streamer.bot 1.0.0 ou superior.
2. No Streamer.bot, conecte sua conta da Kick.
3. No Streamer.bot: **Servers/Clients -> WebSocket Server** e ative o servidor.
4. Use `127.0.0.1`, porta `8080` e endpoint `/`, a menos que você tenha alterado esses valores.
5. No EsperantAI: painel **Eventos de plataforma** -> **Kick via Streamer.bot**.
6. Clique em **Conectar**.

Os eventos disponíveis dependem da integração da Kick ativa no Streamer.bot. A integração oficial da Kick com backend/webhooks permanece como item avançado de roadmap.

### StreamElements (ponte multiplataforma)

Se você já tem uma conta no StreamElements, pode usá-lo como ponte para alertas de várias plataformas:

1. Acesse https://streamelements.com/dashboard/account/channels
2. Copie seu JWT Token
3. No EsperantAI: painel **Eventos de plataforma** → **StreamElements**
4. Cole o JWT e clique em **Conectar**

Mantenha esse token privado. Trate-o como uma senha da sua conta do StreamElements.

### Trovo

O EsperantAI conecta-se ao Trovo por OAuth e pelo WebSocket oficial de chat do Trovo.

1. Crie um app no portal de desenvolvedores do Trovo.
2. Registre a URI de redirecionamento do EsperantAI: `https://TU-DOMINIO/oauth-callback.html` no mesmo domínio onde você abre o app.
3. No EsperantAI: painel **Eventos de plataforma** -> **Trovo**.
4. Cole seu Client ID e clique em **Conectar**.
5. Autorize as permissões solicitadas.

Os eventos disponíveis dependem das mensagens do chat do Trovo e do fluxo oficial de token de chat.

---

## Combinações de evento + gesto (Avançado)

Esta é a mágica do EsperantAI: combinar **eventos de plataforma** com **seus gestos** como confirmação.

![Fluxo de evento mais gesto](assets/manual/04-event-gesture-combo.svg)

### Exemplo: agradecer doações com um joinha

1. Painel **Gatilhos de eventos** → linha "💰 Doação"
2. ✅ Ative
3. Cena: `Cena_Obrigado`
4. Gesto obrigatório: `👍 Joinha`

**Fluxo ao vivo**:
- Chega uma doação → o EsperantAI mostra "Aguardando gesto..."
- Você tem 5 segundos para fazer 👍
- Se fizer → muda para `Cena_Obrigado` + executa qualquer outra ação configurada
- Se não fizer → é descartado automaticamente

### Sem gesto obrigatório (acionamento automático)

Se você deixar "Gesto obrigatório" como `— nenhum —`, o evento aciona a ação imediatamente.

Útil para:
- Mudar automaticamente para a cena de celebração quando chegam raids
- Mostrar automaticamente um overlay quando alguém se inscreve

---

## Sensibilidade e zona morta

### Sensibilidade

Os limites controlam o quanto um gesto precisa ser amplo para disparar:

- **Yaw**: quanto você deve virar a cabeça para os lados (padrão: 0,15 rad ≈ 8,6°)
- **Pitch para cima/baixo**: inclinação vertical
- **Roll**: inclinação lateral

Aumente os valores para exigir gestos mais marcados. Diminua para maior sensibilidade.

### Zona morta (antifadiga)

Se você estiver quase centralizado (yaw < 0,05, pitch < 0,05, roll < 0,08), **NADA dispara**. Isso permite que você se mova de forma natural sem que micromovimentos ativem gatilhos.

### Quadros estáveis

`Quadros estáveis` = quantos quadros consecutivos você deve manter o gesto antes que ele dispare. Padrão: 5 quadros (~150ms a 30fps).

Aumente se os gatilhos estiverem disparando com facilidade demais. Diminua para uma resposta mais rápida.

### Resfriamento

`Resfriamento (ms)` = tempo mínimo entre mudanças de cena. Padrão: 500ms.

Evita que o alternador fique "instável" se você oscilar rapidamente.

---

## Atalhos de teclado

| Tecla | Ação |
|---|---|
| `Espaço` | Pausar / Retomar detecção |
| `C` | Ir manualmente para a cena CENTRO |
| `R` | Recarregar lista de cenas do software |
| `Esc` | Desconectar |

---

## Histórico de gatilhos

O painel **Avançado → Histórico de gatilhos** mostra as últimas 50 ações disparadas:

- ✓ verde = bem-sucedida
- ✗ vermelho = falhou
- · cinza = pendente

Útil para auditar o que foi disparado sem abrir o DevTools.

**Exportar CSV**: baixa o histórico para análise offline.

**Limpar**: apaga o histórico (não afeta mais nada).

---

## Alterar idioma

O EsperantAI detecta automaticamente o idioma do seu sistema operacional. Para alterar manualmente:

- Canto superior direito: menu suspenso de idioma
- Selecione seu idioma preferido
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
- 🇮🇳 हिन्दी
- 🇮🇩 Bahasa Indonesia

Os 15 idiomas estão traduzidos nos arquivos atuais da interface.

---

## Gerencie sua licença

Painel **Avançado → Licença**:

- **Ver status**: Válida / Inválida
- **Ver e-mail do cliente associado**
- **Ver última validação online**
- **Desativar neste dispositivo**: use antes de trocar de PC ou para liberar uma vaga (das 3 disponíveis)

## Solução de problemas

### "Ativação necessária" persiste depois de colar minha chave de licença

- Verifique se você copiou a chave completa (5 grupos de 4 caracteres separados por hífens)
- Verifique sua conexão com a internet (a ativação requer validação online na primeira vez)
- Se você já ativou em 3 dispositivos, desative um primeiro
- Entre em contato com soporte@edugame.digital se o problema persistir

### "Procurando rosto..." persiste mesmo com meu rosto visível

- Melhore a iluminação: seu rosto deve estar bem iluminado
- Aproxime-se da câmera (40-80 cm é o ideal)
- Feche outras abas que usem GPU (o Chrome pode limitar a GPU se houver muitas abas abertas)
- Se o Economizador de memória do Chrome estiver ativo, desative-o para esta aba

### As cenas não aparecem nos menus suspensos

- Verifique se você está conectado ao software de streaming (selo verde "Conectado")
- Pressione `R` para recarregar a lista de cenas
- Se continuar vazia, desconecte e conecte novamente
- No vMix, confirme que o Web Controller está ativado e acessível em `http://127.0.0.1:8088/api/`
- No PRISM, confirme que o plugin obs-websocket está instalado e habilitado
- No XSplit, confirme que a ponte XJS local está rodando

### As mudanças de cena disparam sem eu fazer gestos

- Aumente o limite de yaw / pitch / roll no painel **Sensibilidade**
- Aumente os `Quadros estáveis` de 5 para 8-10
- Verifique se a zona morta está configurada (yaw 0,05, pitch 0,05, roll 0,08)
- Confira se não há mais ninguém no enquadramento (vários rostos podem causar instabilidade)

### Atraso na detecção

- Feche aplicativos pesados (jogos, edição de vídeo)
- Verifique se você está usando a GPU dedicada, se tiver uma (não a integrada)
- Reduza a resolução da câmera se for 4K (1080p é ideal para detecção)

### O OBS não reage embora o EsperantAI indique "Cena alterada"

- Verifique se o nome da cena no menu suspenso corresponde EXATAMENTE ao nome no OBS (diferencia maiúsculas de minúsculas)
- Verifique se a cena não está em outra Coleção de cenas
- Consulte o painel **Histórico de gatilhos** — se mostrar ✗ vermelho, há um erro específico

### Erro "OBS inalcançável — Conecte manualmente"

- Verifique se o OBS está aberto
- Verifique se o WebSocket está ativado no OBS
- Se você configurou uma senha no OBS, ela deve corresponder exatamente
- Alguns antivírus bloqueiam a porta 4455 — adicione uma exceção

### Twitch ou YouTube não conectam

- Verifique se a URI de redirecionamento na console da plataforma corresponde exatamente à URL de `oauth-callback.html`
- Permita pop-ups para o domínio onde você está usando o EsperantAI
- Na Twitch, use apenas o Client ID; não cole Client Secret
- No YouTube, confirme que a YouTube Data API v3 está ativada e que há uma live ativa

### A Kick não mostra todos os eventos

Confirme que o Streamer.bot 1.0.0+ está aberto, que o Kick está conectado dentro do Streamer.bot e que **WebSocket Server** está ativo. Use 127.0.0.1:8080/ a menos que tenha alterado a configuração. Se o Streamer.bot exigir senha, informe a mesma senha no EsperantAI.

---

## Privacidade

### O que o EsperantAI NÃO faz

- ❌ NÃO envia seu vídeo para nenhum servidor
- ❌ NÃO armazena seu vídeo nem capturas
- ❌ NÃO coleta informações biométricas remotamente
- ❌ NÃO compartilha dados com anunciantes nem terceiros

### O que ELE processa

- ✅ Detecção facial local no seu navegador (Human.js + WebGL)
- ✅ Conexões locais com OBS / Streamlabs / vMix / PRISM / XSplit (loopback `127.0.0.1`)
- ✅ Validação periódica da chave de licença (a cada 7 dias)
- ✅ Se você conectar Twitch/YouTube/Kick/StreamElements: tokens de plataforma em armazenamento local ou de sessão do navegador

Detalhes completos em `docs/PRIVACY.html`.

---

## Suporte

- 📧 E-mail: **soporte@edugame.digital**
- 🌐 Web: https://edugame.digital
- 📚 Manual web: https://edugame.digital/docs/manual.html

Tempos de resposta:
- Dúvidas gerais: 24-72 horas
- Erros técnicos: 1-3 dias úteis

---

*Última atualização: 2026-05-20. Versão: 2.0.*
*© 2026 EdugameDigital — Joel Salazar Ramírez. EsperantAI™.*
