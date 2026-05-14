# Manual de Usuario — EsperantAI

> **Los gestos honestos.** Controla tu software de streaming con tu rostro y tus manos. Sin Stream Deck. Sin hardware extra.

**Versión**: 2.0 · **Idioma**: Español (versiones en inglés/portugués/francés/alemán/japonés/coreano/chino/árabe/etc. en `docs/USER_MANUAL_<locale>.md`)

---

## Tabla de contenidos

1. [¿Qué es EsperantAI?](#qué-es-esperantai)
2. [Requisitos mínimos](#requisitos-mínimos)
3. [Compra y activación](#compra-y-activación)
4. [Primer uso](#primer-uso)
5. [Conectar tu software de streaming](#conectar-tu-software-de-streaming)
6. [Configurar gestos y escenas](#configurar-gestos-y-escenas)
7. [Categorías de gestos](#categorías-de-gestos)
8. [Conectar plataformas de streaming](#conectar-plataformas-de-streaming)
9. [Eventos + gestos combinados (avanzado)](#eventos--gestos-combinados-avanzado)
10. [Sensibilidad y dead zone](#sensibilidad-y-dead-zone)
11. [Atajos de teclado](#atajos-de-teclado)
12. [Trigger History](#trigger-history)
13. [Cambiar idioma](#cambiar-idioma)
14. [Gestionar tu licencia](#gestionar-tu-licencia)
15. [Solución de problemas](#solución-de-problemas)
16. [Privacidad](#privacidad)
17. [Soporte](#soporte)

---

## ¿Qué es EsperantAI?

EsperantAI es una **web app** que usa inteligencia artificial para detectar tus gestos faciales y de mano en tiempo real, y traducirlos en comandos para tu software de streaming. Funciona con:

- **OBS Studio** 28 o superior
- **Streamlabs Desktop**
- **vMix**
- **PRISM Live Studio**
- **XSplit Broadcaster** (beta)

Y recibe eventos de plataformas como:

- **Twitch**
- **YouTube Live**
- **Kick**
- **Trovo**
- **StreamElements** (bridge multi-plataforma)

### ¿Por qué "los gestos honestos"?

Las expresiones faciales básicas y la rotación de cabeza son **universales en todas las culturas humanas** (Paul Ekman, 1972). No mienten, no varían por geografía. EsperantAI llama a estos gestos "🌐 Universales" y los distingue de los gestos "⚠️ Culturales" (gestos de mano), cuyo significado puede variar por país.

Tú decides qué gestos usar según tu audiencia.

---

## Requisitos mínimos

### Hardware

- **Cualquier webcam USB** (recomendado: 1080p o superior)
- **CPU**: cualquiera con 4+ núcleos publicado en los últimos 5 años
- **RAM**: 8 GB mínimo. 16 GB recomendado si haces streaming en paralelo.
- **GPU**: cualquiera con soporte WebGL (incluso integradas modernas funcionan)

### Software

- **Sistema operativo**: Windows 10/11, macOS 12+, o Linux con kernel reciente
- **Navegador**: Chrome 90+, Edge 90+, o Firefox 100+
- **Streaming software** (al menos uno): OBS Studio 28+, Streamlabs Desktop, vMix, PRISM, XSplit

### Internet

- Necesario al **activar la licencia** y cada **7 días** para revalidación
- Hasta **30 días sin internet** funciona en modo offline (período de gracia)

---

## Compra y activación

1. Visita **https://esperantai.com**
2. Haz clic en **"Adquirir EsperantAI"**
3. Completa el pago en LemonSqueezy con tu método preferido (tarjeta, PayPal, etc.)
4. Recibirás un email con:
   - Tu **license key** (formato: `XXXX-XXXX-XXXX-XXXX-XXXX`)
   - Link para descargar EsperantAI (o usar la web app directamente)
5. Abre EsperantAI en tu navegador
6. Aparecerá la pantalla de activación. Pega tu license key
7. Haz clic en **"Activar licencia"**
8. ¡Listo!

### Cuántos dispositivos

Una licencia se activa en **hasta 3 dispositivos**. Si necesitas mover la licencia a otro dispositivo:

1. En el dispositivo viejo: panel **Avanzado** → **License** → **Desactivar licencia en este dispositivo**
2. En el dispositivo nuevo: activar normalmente

---

## Primer uso

### Paso 1: Permitir cámara

Cuando abras EsperantAI por primera vez, tu navegador pedirá permiso para usar la cámara. **Acepta**.

> Importante: EsperantAI nunca envía tu video a ningún servidor. El procesamiento es 100% local en tu computadora.

### Paso 2: Seleccionar cámara

Si tienes más de una cámara, elige cuál usar en el dropdown "Cámara que sigue tu rostro".

### Paso 3: Verificar detección

Verás tu rostro en el panel izquierdo. Cuando EsperantAI detecte tu cara, los indicadores de Yaw / Pitch / Roll empezarán a mostrar valores.

---

## Conectar tu software de streaming

### OBS Studio

1. En OBS: **Herramientas → Configuración del Servidor WebSocket**
2. Habilita WebSocket. Anota la contraseña si pusiste una.
3. En EsperantAI: panel **Connection**
4. Streaming software: **OBS Studio**
5. WebSocket URL: `ws://127.0.0.1:4455` (default)
6. Password: la que pusiste en OBS
7. Clic **Conectar**

### Streamlabs Desktop

1. En Streamlabs: **Settings → Remote Control**
2. Habilita Remote Control
3. Anota el API Token
4. En EsperantAI: Streaming software: **Streamlabs Desktop**
5. API Token: pégalo
6. Port: `59650` (default)
7. Clic **Conectar**

### vMix

1. En vMix: **Settings → Web Controller**
2. Habilita Web Controller. Default port: 8088.
3. En EsperantAI: Streaming software: **vMix**
4. Host: `127.0.0.1`
5. Port: `8088`
6. Clic **Conectar**

### PRISM Live Studio

1. PRISM Live Studio v4.0.5+ requiere instalación manual del plugin obs-websocket
2. Descarga `obs-websocket` del [foro oficial de OBS](https://obsproject.com/forum/resources/obs-websocket-remote-control-of-obs-studio-made-easy.466/)
3. Cópialo a la carpeta de plugins de PRISM
4. Reinicia PRISM
5. Habilita WebSocket en **Herramientas → Configuración del Servidor WebSocket**
6. En EsperantAI: Streaming software: **PRISM Live Studio** (funciona igual que OBS)

### XSplit Broadcaster (beta)

1. Instala la extensión "Remote xjs" en XSplit (Settings → Extensions)
2. Habilita Remote en preferencias
3. En EsperantAI: Streaming software: **XSplit**
4. Remote xjs Proxy URL: `ws://127.0.0.1:5555/xjs` (default)
5. Clic **Conectar**

> XSplit está en **beta**. Funcionalidades avanzadas pueden estar limitadas.

---

## Configurar gestos y escenas

Una vez conectado, las escenas reales de tu software aparecerán automáticamente en los dropdowns del panel **Triggers**.

### Mapeo básico

1. Por cada gesto (ej: "Mirar Izquierda"), elige una escena del dropdown
2. Cuando hagas ese gesto y se mantenga estable ~150ms, EsperantAI cambiará a esa escena en tu software de streaming
3. El cambio es automático y casi instantáneo

### Habilitar / deshabilitar categorías

Cada categoría tiene su propio checkbox "Habilitar":

- 🧠 **Rotación de cabeza** (universal — habilitado por default)
- 📏 **Distancia al rostro** (acercar/alejar)
- 👁️ **Mirada** (mover solo los ojos)
- 😀 **Emociones** (sonrisa, sorpresa, enojo, neutral)
- 👁️‍🗨️ **Parpadeo doble**
- ✋ **Gestos de mano** (cultural — desactivado por default)

Si una categoría no te interesa, deshabilítala para ahorrar CPU.

---

## Categorías de gestos

### 🌐 Universales (mismo significado en cualquier cultura)

| Gesto | Eje | Cómo activarlo |
|---|---|---|
| Centro | — | Mirando al frente, cara estable |
| Mirar Izquierda | yaw negativo | Girar cabeza a tu izquierda |
| Mirar Derecha | yaw positivo | Girar cabeza a tu derecha |
| Mirar Arriba | pitch negativo | Levantar cara |
| Mirar Abajo | pitch positivo | Bajar cara |
| Inclinar Izq | roll negativo | Inclinar cabeza al hombro izquierdo |
| Inclinar Der | roll positivo | Inclinar cabeza al hombro derecho |
| Acercarse | distancia | Acercar la cara a la cámara |
| Alejarse | distancia | Alejar la cara de la cámara |
| Mirar con ojos | gaze | Mover solo los ojos (cabeza al centro) |
| Sonriendo | emotion=happy | Sonreír claramente |
| Sorprendido | emotion=surprise | Cara de sorpresa |
| Enojado | emotion=angry | Cara de enojo |
| Neutral | emotion=neutral | Cara relajada |
| Parpadeo doble | blink | Cerrar ambos ojos 2 veces rápido (< 700ms) |

### ⚠️ Culturales (significado varía por país)

| Gesto | Significado en occidente | Cuidado en otras culturas |
|---|---|---|
| 👍 Pulgar arriba | Aprobación | Medio Oriente / Asia Occidental: puede ser ofensivo |
| ✌️ Paz | Paz / victoria | Reino Unido / Irlanda / Australia (palma adentro): ofensa |
| 🤘 Cuernos rock | Rock metal | Italia (palma abajo): "los cuernos" (insulto) |
| 👌 OK | OK / perfecto | Brasil / Turquía / Alemania: puede ser ofensivo |
| ✊ Puño cerrado | Variable según contexto político | — |
| 🖐️ Palma abierta | "Stop" o saludo | Grecia (mountza hacia alguien): ofensa fuerte |
| ☝️ Apuntar | Indicar | Asia: apuntar con dedo se considera grosero |

EsperantAI marca cada gesto con su badge correspondiente en la UI. Decide cuáles usar según tu audiencia global.

---

## Conectar plataformas de streaming

Para que EsperantAI reciba eventos (donaciones, subs, raids), debes conectar las plataformas donde stream.

### Twitch

1. Crea un Client ID en https://dev.twitch.tv/console
2. Registra el redirect URI: `https://esperantai.com/oauth-callback.html` (o tu URL local)
3. En EsperantAI: panel **Platform Events** → **Twitch EventSub**
4. Pega el Client ID
5. Clic **Connect**
6. Se abrirá una ventana de autorización Twitch. Acepta los permisos.
7. La ventana se cerrará y verás "Twitch Connected"

### YouTube Live

1. Crea credenciales en https://console.cloud.google.com
2. Activa YouTube Data API v3
3. Crea OAuth Client ID (tipo: Web Application)
4. Registra el redirect URI igual que Twitch
5. En EsperantAI: panel **Platform Events** → **YouTube Live**
6. Pega el Client ID y clic **Connect**

### Kick

1. Crea aplicación en https://kick.com/settings/developer
2. Registra el redirect URI
3. En EsperantAI: panel **Platform Events** → **Kick**
4. Pega el Client ID y clic **Connect**
5. Kick usa OAuth 2.1 con PKCE (más seguro)

### StreamElements (bridge multi-plataforma)

Si ya tienes cuenta StreamElements, puedes unificar Twitch + YouTube + Facebook con un solo token:

1. Ve a https://streamelements.com/dashboard/account/channels
2. Copia tu JWT Token
3. En EsperantAI: panel **Platform Events** → **StreamElements**
4. Pega el JWT y clic **Connect**

---

## Eventos + gestos combinados (avanzado)

Esta es la magia de EsperantAI: combinar **eventos de plataforma** con **tus gestos** como confirmación.

### Ejemplo: agradecer donaciones con un pulgar arriba

1. Panel **Event Triggers** → fila "💰 Donación"
2. ✅ Habilitar
3. Escena: `Escena_Agradecimiento`
4. Gesto requerido: `👍 Pulgar arriba`

**Flujo en vivo**:
- Llega una donación → EsperantAI muestra "Esperando gesto..."
- Tienes 5 segundos para hacer 👍
- Si lo haces → cambia a `Escena_Agradecimiento` + ejecuta cualquier otra acción configurada
- Si no lo haces → se descarta automáticamente

### Sin gesto requerido (disparo automático)

Si dejas "Gesto requerido" en `— ninguno —`, el evento dispara la acción inmediatamente.

Útil para:
- Auto-cambio a escena celebratoria cuando llegan raids
- Auto-mostrar overlay cuando alguien se suscribe

---

## Sensibilidad y dead zone

### Sensibilidad

Los thresholds controlan qué tan grande debe ser un gesto para disparar:

- **Yaw**: cuánto girar la cabeza lateralmente (default: 0.15 rad ≈ 8.6°)
- **Pitch arriba/abajo**: inclinación vertical
- **Roll**: inclinación lateral

Sube los valores si quieres gestos más exagerados. Bájalos si quieres más sensible.

### Dead zone (anti-fatiga)

Si estás casi al centro (yaw < 0.05, pitch < 0.05, roll < 0.08), **NADA dispara**. Esto permite que te muevas naturalmente sin que micro-movimientos activen triggers.

### Frames estables

`Frames estables` = cuántos frames consecutivos debe mantenerse el gesto antes de disparar. Default: 5 frames (~150ms a 30fps).

Sube si tienes triggers nerviosos. Baja si quieres respuesta más rápida.

### Cooldown

`Cooldown (ms)` = tiempo mínimo entre cambios de escena. Default: 500ms.

Evita que el switcher esté "nervioso" si oscilas rápido.

---

## Atajos de teclado

| Tecla | Acción |
|---|---|
| `Espacio` | Pausar / Reanudar detección |
| `C` | Saltar manualmente a la escena CENTRO |
| `R` | Recargar lista de escenas desde el software |
| `Esc` | Desconectar |

---

## Trigger History

Panel **Avanzado → Trigger History** muestra las últimas 50 acciones disparadas:

- ✓ verde = exitoso
- ✗ rojo = falló
- · gris = pendiente

Útil para auditar qué se disparó sin abrir DevTools.

**Export CSV**: descarga el historial para análisis offline.

**Clear**: borra el historial (no afecta nada más).

---

## Cambiar idioma

EsperantAI detecta automáticamente el idioma de tu sistema operativo. Si quieres cambiarlo manualmente:

- Esquina superior derecha: dropdown de idiomas
- Selecciona tu idioma preferido
- La UI se actualiza inmediatamente

Idiomas disponibles (al momento de escribir este manual):
- 🇪🇸 Español (España) ← completo
- 🇲🇽 Español (México / LatAm) ← parcial
- 🇺🇸 English ← completo
- 🇧🇷 Português (Brasil) ← traducción en progreso
- 🇫🇷 Français ← en progreso
- 🇩🇪 Deutsch ← en progreso
- 🇯🇵 日本語 ← en progreso
- 🇷🇺 Русский ← en progreso
- 🇨🇳 中文 ← en progreso
- 🇮🇹 Italiano ← en progreso
- 🇵🇱 Polski ← en progreso
- 🇸🇦 العربية ← en progreso
- 🇰🇷 한국어 ← en progreso

Si tu idioma está marcado "en progreso", verás algunas frases en inglés mientras lo completamos.

---

## Gestionar tu licencia

Panel **Avanzado → License**:

- **Ver estado**: Válida / Inválida
- **Ver email del cliente** asociado
- **Ver última validación online**
- **Desactivar licencia en este dispositivo**: úsalo antes de cambiar de PC o si quieres liberar un slot (de los 3 disponibles)

### Reembolsos

Si EsperantAI no cumple tus expectativas, tienes **14 días** desde la compra para solicitar reembolso completo. Escribe a soporte@edugame.digital con tu license key.

---

## Solución de problemas

### "Activación requerida" persiste después de pegar mi license key

- Verifica que copiaste la key completa (5 grupos de 4 caracteres separados por guiones)
- Verifica tu conexión a internet (la activación requiere validar online la primera vez)
- Si ya activaste en 3 dispositivos, desactiva uno antes
- Contacta soporte@edugame.digital si persiste

### "Buscando rostro..." persiste aunque mi cara está visible

- Mejora la iluminación: la cara debe estar bien iluminada
- Acerca la cara a la cámara (entre 40 y 80 cm es óptimo)
- Cierra otras pestañas que estén usando GPU (Chrome puede limitar GPU si hay muchas)
- Si tienes Chrome con Memory Saver activo, desactívalo para esta pestaña

### Las escenas no aparecen en los dropdowns

- Verifica que estás conectado al streaming software (badge verde "OBS Conectado")
- Presiona `R` para recargar la lista de escenas
- Si sigue vacío, desconecta y vuelve a conectar

### Cambios de escena se disparan sin que yo haga gestos

- Sube el threshold de yaw / pitch / roll en panel **Sensibilidad**
- Sube `Frames estables` de 5 a 8-10
- Asegúrate de que la dead zone esté configurada (yaw 0.05, pitch 0.05, roll 0.08)
- Verifica que no haya alguien más en frame (multi-face puede causar inestabilidad)

### Lag en la detección

- Cierra apps pesadas (juegos, edición de video)
- Verifica que estás usando la GPU dedicada si tienes una (no la integrada)
- Reduce la resolución de la cámara si está en 4K (1080p es óptimo para detección)

### OBS no reacciona aunque EsperantAI dice "Escena cambiada"

- Verifica que el nombre de escena en el dropdown coincide EXACTAMENTE con el de OBS (case-sensitive)
- Verifica que la escena no esté en otro Scene Collection
- Mira el panel **Trigger History** — si dice ✗ rojo, hay un error específico

### Error "OBS no responde — Conecta manualmente"

- Verifica que OBS está abierto
- Verifica que WebSocket está habilitado en OBS
- Si pusiste contraseña en OBS, debe coincidir exactamente
- Algunos antivirus bloquean el puerto 4455 — añade excepción

---

## Privacidad

### Lo que EsperantAI NO hace

- ❌ NO envía tu video a ningún servidor
- ❌ NO almacena tu video ni capturas
- ❌ NO recolecta información biométrica de forma remota
- ❌ NO comparte datos con anunciantes o terceros

### Lo que SÍ procesa

- ✅ Detección facial local en tu navegador (Human.js + WebGL)
- ✅ Conexiones locales a tu OBS / Streamlabs / vMix (loopback 127.0.0.1)
- ✅ Validación periódica de tu license key contra LemonSqueezy (cada 7 días)
- ✅ Si conectas Twitch/YouTube/Kick: tokens OAuth en sessionStorage (se borran al cerrar el navegador)

Detalle completo en `docs/PRIVACY.html`.

---

## Soporte

- 📧 Email: **soporte@edugame.digital**
- 💬 Discord: (próximamente)
- 🌐 Web: https://esperantai.com
- 📚 Docs técnicas: https://github.com/salazarjoelo/EsperantAI

Tiempos de respuesta:
- Preguntas generales: 24-72 horas
- Bugs técnicos: 1-3 días laborales
- Solicitudes de reembolso: 1-2 días laborales

---

## Roadmap visible

Características en desarrollo (orden no necesariamente cronológico):

- [ ] Sistema de Perfiles (gaming, IRL, art, etc.)
- [ ] Calibration Wizard al primer inicio
- [ ] UI Multi-Action por trigger (combinar scene_switch + sonido + overlay)
- [ ] Soporte SOOP + CHZZK (mercado coreano post-éxodo Twitch)
- [ ] Web Worker para Human.js (mejor performance)
- [ ] Source Transform en OBS (mover/escalar overlays con gestos)
- [ ] Gestos secuenciales ("mirar izquierda + 👍 = X")
- [ ] Cloud config backup
- [ ] Analytics dashboard

---

*Última actualización: 2026-05-14. Versión: 2.0.*
*© 2026 EdugameDigital — Joel Salazar Ramírez. EsperantAI™.*
