# EsperantAI — Manual de usuario

> **Gestos honestos.** Controlad vuestro software de streaming con la cara y las manos. Sin Stream Deck. Sin hardware adicional.

**Versión**: 3.0 · **Idioma**: Español (España) (traducciones disponibles en 12 idiomas más)

---

## Índice de contenidos

1. [¿Qué es EsperantAI?](#qué-es-esperantai)
2. [Requisitos mínimos](#requisitos-mínimos)
3. [Compra y activación](#compra-y-activación)
4. [Primer uso](#primer-uso)
5. [Conectad vuestro software de streaming](#conectad-vuestro-software-de-streaming)
6. [Configurad gestos y escenas](#configurad-gestos-y-escenas)
7. [Categorías de gestos](#categorías-de-gestos)
8. [Conectad plataformas de streaming](#conectad-plataformas-de-streaming)
9. [Combinaciones de evento + gesto (Avanzado)](#combinaciones-de-evento--gesto-avanzado)
10. [Sensibilidad y zona muerta](#sensibilidad-y-zona-muerta)
11. [Atajos de teclado](#atajos-de-teclado)
12. [Historial de disparadores](#historial-de-disparadores)
13. [Cambiar idioma](#cambiar-idioma)
14. [Gestionad vuestra licencia](#gestionad-vuestra-licencia)
15. [Solución de problemas](#solución-de-problemas)
16. [Privacidad](#privacidad)
17. [Soporte](#soporte)

---

## ¿Qué es EsperantAI?

EsperantAI es una **aplicación web** que utiliza inteligencia artificial para detectar vuestros gestos faciales y manuales en tiempo real, y los traduce en comandos para vuestro software de streaming. Funciona con:

- **OBS Studio** 28+
- **Streamlabs Desktop**
- **vMix**
- **PRISM Live Studio**
- **XSplit Broadcaster** (beta)

Y recibe eventos de plataformas como:

- **Twitch**
- **YouTube Live**
- **Kick**
- **Trovo**
- **StreamElements** (puente multiplataforma)

### ¿Por qué «gestos honestos»?

Las expresiones faciales básicas y la rotación de la cabeza son **universales en todas las culturas humanas** (Paul Ekman, 1972). No mienten, no varían según la geografía. EsperantAI denomina a estos gestos «🌐 Universales» y los distingue de los gestos «⚠️ Culturales» (señas con las manos), cuyo significado puede variar según el país.

Vosotros decidís qué gestos utilizar en función de vuestra audiencia.

---

## Requisitos mínimos

### Hardware

- **Cualquier cámara web USB** (recomendada: 1080p o superior)
- **CPU**: cualquier procesador de 4+ núcleos de los últimos 5 años
- **RAM**: 8 GB mínimo. 16 GB recomendados si hacéis streaming simultáneamente.
- **GPU**: cualquiera con soporte WebGL (incluso las GPU integradas modernas funcionan)

### Software

- **SO**: Windows 10/11, macOS 12+, o Linux con kernel reciente
- **Navegador**: Chrome 90+, Edge 90+, o Firefox 100+
- **Software de streaming** (al menos uno): OBS Studio 28+, Streamlabs Desktop, vMix, PRISM, XSplit

### Internet

- Necesario para **activar vuestra licencia** y cada **7 días** para revalidación
- Funciona **hasta 7 días sin conexión** (período de gracia)

---

## Compra y activación

1. Visitad **https://edugame.digital**
2. Haced clic en **«Comprar licencia»**
3. Completad el pago a través de LemonSqueezy (tarjeta, PayPal, etc.)
4. Recibiréis un correo electrónico con:
   - Vuestra **clave de licencia** (formato: `XXXX-XXXX-XXXX-XXXX-XXXX`)
   - Enlace para usar EsperantAI
5. Abrid EsperantAI en vuestro navegador
6. Aparecerá la pantalla de activación. Pegad vuestra clave de licencia
7. Haced clic en **«Activar licencia»**
8. ¡Listo! 🎉

### ¿Cuántos dispositivos?

Una licencia puede activarse en **hasta 3 dispositivos**. Para trasladar vuestra licencia a otro dispositivo:

1. En el dispositivo antiguo: panel **Avanzado** → **Licencia** → **Desactivar en este dispositivo**
2. En el dispositivo nuevo: activad normalmente

---

## Primer uso

### Paso 1: Permitid el acceso a la cámara

Cuando abráis EsperantAI por primera vez, vuestro navegador solicitará permiso para acceder a la cámara. **Aceptadlo**.

> Importante: EsperantAI nunca envía vuestro vídeo a ningún servidor. El procesamiento es 100% local en vuestro ordenador.

### Paso 2: Seleccionad la cámara

Si tenéis más de una cámara, elegid cuál utilizar desde el menú desplegable de cámaras.

### Paso 3: Verificad la detección

Veréis vuestro rostro en el panel izquierdo. Cuando EsperantAI detecte vuestro rostro, los indicadores de Yaw / Pitch / Roll empezarán a mostrar valores.

### Paso 4: Asistente de calibración (Pro+)

Si tenéis una licencia Pro o Pro+, el **Asistente de calibración** se inicia automáticamente en el primer uso. Mide vuestro rango de movimiento natural y establece la sensibilidad óptima. Podéis volver a ejecutarlo en cualquier momento desde el botón **Recalibrar**.

---

## Conectad vuestro software de streaming

### OBS Studio

1. En OBS: **Herramientas → Ajustes del servidor WebSocket**
2. Habilitad WebSocket. Anotad la contraseña si habéis configurado una.
3. En EsperantAI: panel **Conexión**
4. Software de streaming: **OBS Studio**
5. URL de WebSocket: `ws://127.0.0.1:4455` (predeterminada)
6. Contraseña: la que habéis configurado en OBS
7. Haced clic en **Conectar**

### Streamlabs Desktop

1. En Streamlabs: **Configuración → Control remoto**
2. Habilitad el Control remoto
3. Anotad el Token de API
4. En EsperantAI: Software de streaming: **Streamlabs Desktop**
5. Token de API: pegadlo
6. Puerto: `59650` (predeterminado)
7. Haced clic en **Conectar**

### vMix

1. En vMix: **Settings → Web Controller**
2. Habilitad Web Controller. Puerto predeterminado: 8088.
3. En EsperantAI: Software de streaming: **vMix**
4. Host: `127.0.0.1`
5. Puerto: `8088`
6. Haced clic en **Conectar**

### PRISM Live Studio

1. PRISM Live Studio v4.0.5+ requiere la instalación manual del plugin obs-websocket
2. Descargad `obs-websocket` desde el [foro de OBS](https://obsproject.com/forum/resources/obs-websocket-remote-control-of-obs-studio-made-easy.466/)
3. Copiadlo a la carpeta de plugins de PRISM
4. Reiniciad PRISM
5. Habilitad WebSocket en **Herramientas → Ajustes del servidor WebSocket**
6. En EsperantAI: Software de streaming: **PRISM Live Studio** (funciona igual que OBS)

### XSplit Broadcaster (beta)

1. Instalad la extensión «Remote xjs» en XSplit (Configuración → Extensiones)
2. Habilitad Remote en las preferencias
3. En EsperantAI: Software de streaming: **XSplit**
4. URL del proxy Remote xjs: `ws://127.0.0.1:5555/xjs` (predeterminada)
5. Haced clic en **Conectar**

> XSplit está en **beta**. Las funciones avanzadas pueden estar limitadas.

---

## Configurad gestos y escenas

Una vez conectados, las escenas reales de vuestro software aparecerán automáticamente en los menús desplegables del panel **Disparadores**.

### Mapeo básico

1. Para cada gesto (p. ej., «Mirar a la izquierda»), elegid una escena del menú desplegable
2. Cuando hagáis ese gesto y lo mantengáis estable durante ~150ms, EsperantAI cambiará a esa escena en vuestro software de streaming
3. El cambio es automático y prácticamente instantáneo

### Multi-acción (Pro+)

Con una licencia Pro o Pro+, un gesto puede desencadenar **múltiples acciones** simultáneamente:
- Cambiar escena + reproducir sonido + mostrar overlay + enviar mensaje al chat

### Habilitar / deshabilitar categorías

Cada categoría tiene su propia casilla «Habilitar»:

- 🧠 **Rotación de cabeza** (universal — habilitada por defecto)
- 📏 **Distancia facial** (acercaos o alejaos)
- 👁️ **Mirada** (moved solo los ojos)
- 😀 **Emociones** (sonrisa, sorpresa, enfado, neutral)
- 👁️‍🗨️ **Doble parpadeo**
- ✋ **Gestos manuales** (cultural — deshabilitados por defecto)

Deshabilitad las categorías que no necesitéis para ahorrar CPU.

---

## Categorías de gestos

### 🌐 Universales (mismo significado en cualquier cultura)

| Gesto | Eje | Cómo activarlo |
|---|---|---|
| Centro | — | Mirando al frente, rostro estable |
| Mirar a la izquierda | yaw negativo | Girad la cabeza hacia vuestra izquierda |
| Mirar a la derecha | yaw positivo | Girad la cabeza hacia vuestra derecha |
| Mirar arriba | pitch negativo | Levantad el rostro |
| Mirar abajo | pitch positivo | Bajad el rostro |
| Inclinar a la izquierda | roll negativo | Inclinad la cabeza hacia el hombro izquierdo |
| Inclinar a la derecha | roll positivo | Inclinad la cabeza hacia el hombro derecho |
| Acercarse | distancia | Acercaos a la cámara |
| Alejarse | distancia | Alejaos de la cámara |
| Mirada | mirada | Moved solo los ojos (cabeza centrada) |
| Sonrisa | emoción=feliz | Sonreíd claramente |
| Sorprendido | emoción=sorpresa | Mostraos sorprendidos |
| Enfadado | emoción=enfado | Mostraos enfadados |
| Neutral | emoción=neutral | Rostro relajado |
| Doble parpadeo | parpadeo | Cerrad ambos ojos dos veces rápido (< 700ms) |

### ⚠️ Culturales (el significado varía según el país)

| Gesto | Significado occidental | Precaución en otras culturas |
|---|---|---|
| 👍 Pulgar arriba | Aprobación | Oriente Medio / Asia occidental: puede ser ofensivo |
| ✌️ Paz | Paz / victoria | Reino Unido / Irlanda / Australia (palma hacia dentro): insulto |
| 🤘 Cuernos de rock | Rock / metal | Italia (palma hacia abajo): «cornuto» (insulto) |
| 👌 OK | OK / perfecto | Brasil / Turquía / Alemania: puede ser ofensivo |
| ✊ Puño cerrado | Varía según el contexto político | — |
| 🖐️ Palma abierta | «Para» o saludo | Grecia (mountza hacia alguien): fuerte insulto |
| ☝️ Señalar | Indicar | Asia: señalar con el dedo es de mala educación |

EsperantAI marca cada gesto con su correspondiente insignia en la interfaz. Elegid cuáles utilizar en función de vuestra audiencia global.

### 🙏 Gassho (合掌)

Un gesto especial: juntad ambas palmas frente al pecho (como en una oración o reverencia de saludo). Común en las culturas de Asia oriental como señal de respeto o gratitud. Se detecta con alta fiabilidad mediante 6 comprobaciones de puntos de referencia.

---

## Conectad plataformas de streaming

Para que EsperantAI reciba eventos (donaciones, suscripciones, raids), conectad las plataformas donde hacéis streaming.

### Twitch

1. Cread un Client ID en https://dev.twitch.tv/console
2. Registrad la URI de redirección: `https://edugame.digital/oauth-callback.html` (o vuestra URL local)
3. En EsperantAI: panel **Eventos de plataforma** → **Twitch EventSub**
4. Pegad vuestro Client ID
5. Haced clic en **Conectar**
6. Se abrirá una ventana de autorización de Twitch. Aceptad los permisos.
7. La ventana se cerrará y veréis «Twitch conectado»

### YouTube Live

1. Cread credenciales en https://console.cloud.google.com
2. Habilitad YouTube Data API v3
3. Cread un OAuth Client ID (tipo: Aplicación web)
4. Registrad la misma URI de redirección que en Twitch
5. En EsperantAI: panel **Eventos de plataforma** → **YouTube Live**
6. Pegad vuestro Client ID y haced clic en **Conectar**

### Kick

1. Cread una aplicación en https://kick.com/settings/developer
2. Registrad la URI de redirección
3. En EsperantAI: panel **Eventos de plataforma** → **Kick**
4. Pegad vuestro Client ID y haced clic en **Conectar**
5. Kick utiliza OAuth 2.1 con PKCE (más seguro)

### StreamElements (puente multiplataforma)

Si ya tenéis una cuenta de StreamElements, podéis unificar Twitch + YouTube + Facebook con un solo token:

1. Id a https://streamelements.com/dashboard/account/channels
2. Copiad vuestro JWT Token
3. En EsperantAI: panel **Eventos de plataforma** → **StreamElements**
4. Pegad el JWT y haced clic en **Conectar**

---

## Combinaciones de evento + gesto (Avanzado)

Esta es la magia de EsperantAI: combinar **eventos de plataforma** con **vuestros gestos** como confirmación.

### Ejemplo: agradecer donaciones con un pulgar arriba

1. Panel **Disparadores de eventos** → fila «💰 Donación»
2. ✅ Habilitad
3. Escena: `Escena_Gracias`
4. Gesto requerido: `👍 Pulgar arriba`

**Flujo en vivo**:
- Llega una donación → EsperantAI muestra «Esperando gesto...»
- Tenéis 5 segundos para hacer 👍
- Si lo hacéis → cambia a `Escena_Gracias` + ejecuta cualquier otra acción configurada
- Si no → se descarta automáticamente

### Sin gesto requerido (disparo automático)

Si dejáis «Gesto requerido» como `— ninguno —`, el evento desencadena la acción inmediatamente.

Útil para:
- Cambiar automáticamente a la escena de celebración cuando llegan raids
- Mostrar automáticamente un overlay cuando alguien se suscribe

---

## Sensibilidad y zona muerta

### Sensibilidad

Los umbrales controlan la magnitud que debe tener un gesto para dispararse:

- **Yaw**: cuánto debéis girar la cabeza hacia los lados (predeterminado: 0,15 rad ≈ 8,6°)
- **Pitch arriba/abajo**: inclinación vertical
- **Roll**: inclinación lateral

Aumentad los valores para gestos más marcados. Reducidlos para mayor sensibilidad.

### Zona muerta (antifatiga)

Si estáis casi centrado (yaw < 0,05, pitch < 0,05, roll < 0,08), **NADA se dispara**. Esto os permite moveros de forma natural sin que los micromovimientos activen disparadores.

### Fotogramas estables

`Fotogramas estables` = cuántos fotogramas consecutivos debéis mantener el gesto antes de que se dispare. Predeterminado: 5 fotogramas (~150ms a 30fps).

Aumentad si los disparadores se activan con demasiada facilidad. Reducid para una respuesta más rápida.

### Enfriamiento

`Enfriamiento (ms)` = tiempo mínimo entre cambios de escena. Predeterminado: 500ms.

Evita que el conmutador sea «nervioso» si osciláis rápidamente.

---

## Atajos de teclado

| Tecla | Acción |
|---|---|
| `Espacio` | Pausar / Reanudar detección |
| `C` | Saltar manualmente a la escena CENTRO |
| `R` | Recargar lista de escenas desde el software |
| `Esc` | Desconectar |

---

## Historial de disparadores

El panel **Avanzado → Historial de disparadores** muestra las últimas 50 acciones disparadas:

- ✓ verde = exitosa
- ✗ rojo = fallida
- · gris = pendiente

Útil para auditar qué se ha disparado sin abrir DevTools.

**Exportar CSV**: descargad el historial para análisis sin conexión.

**Limpiar**: borra el historial (no afecta a nada más).

---

## Cambiar idioma

EsperantAI detecta automáticamente el idioma de vuestro sistema operativo. Para cambiarlo manualmente:

- Esquina superior derecha: menú desplegable de idioma
- Seleccionad vuestro idioma preferido
- La interfaz se actualiza inmediatamente

Idiomas disponibles:
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

Los 13 idiomas están completamente traducidos (342 claves cada uno).

---

## Gestionad vuestra licencia

Panel **Avanzado → Licencia**:

- **Ver estado**: Válida / Inválida
- **Ver correo electrónico del cliente asociado**
- **Ver última validación en línea**
- **Desactivar en este dispositivo**: usadlo antes de cambiar de PC o para liberar una plaza (de las 3 disponibles)

## Solución de problemas

### «Activación requerida» persiste después de pegar mi clave de licencia

- Verificad que habéis copiado la clave completa (5 grupos de 4 caracteres separados por guiones)
- Comprobad vuestra conexión a Internet (la activación requiere validación en línea la primera vez)
- Si ya habéis activado en 3 dispositivos, desactivad uno primero
- Contactad con soporte@edugame.digital si el problema persiste

### «Buscando rostro...» persiste aunque mi rostro es visible

- Mejorad la iluminación: vuestro rostro debe estar bien iluminado
- Acercaos a la cámara (40-80 cm es óptimo)
- Cerrad otras pestañas que usen GPU (Chrome puede limitar la GPU si hay demasiadas abiertas)
- Si el Ahorrador de memoria de Chrome está activo, desactivadlo para esta pestaña

### Las escenas no aparecen en los menús desplegables

- Verificad que estáis conectados al software de streaming (insignia verde «Conectado»)
- Pulsad `R` para recargar la lista de escenas
- Si sigue vacía, desconectad y volved a conectar

### Los cambios de escena se disparan sin que yo haga gestos

- Aumentad el umbral de yaw / pitch / roll en el panel **Sensibilidad**
- Aumentad los `Fotogramas estables` de 5 a 8-10
- Aseguraos de que la zona muerta esté configurada (yaw 0,05, pitch 0,05, roll 0,08)
- Comprobad que no hay nadie más en el encuadre (varios rostros pueden causar inestabilidad)

### Retraso en la detección

- Cerrad aplicaciones pesadas (juegos, edición de vídeo)
- Verificad que estáis usando la GPU dedicada si tenéis una (no la integrada)
- Reducid la resolución de la cámara si es 4K (1080p es óptimo para detección)

### OBS no reacciona aunque EsperantAI indica «Escena cambiada»

- Verificad que el nombre de la escena en el menú desplegable coincida EXACTAMENTE con el de OBS (sensible a mayúsculas)
- Verificad que la escena no esté en otra Colección de escenas
- Comprobad el panel **Historial de disparadores** — si muestra ✗ rojo, hay un error específico

### Error «OBS inalcanzable — Conectad manualmente»

- Verificad que OBS está abierto
- Verificad que WebSocket está habilitado en OBS
- Si habéis configurado una contraseña en OBS, debe coincidir exactamente
- Algunos antivirus bloquean el puerto 4455 — añadid una excepción

---

## Privacidad

### Lo que EsperantAI NO hace

- ❌ NO envía vuestro vídeo a ningún servidor
- ❌ NO almacena vuestro vídeo ni capturas
- ❌ NO recopila información biométrica de forma remota
- ❌ NO comparte datos con anunciantes ni terceros

### Lo que SÍ procesa

- ✅ Detección facial local en vuestro navegador (Human.js + WebGL)
- ✅ Conexiones locales a vuestro OBS / Streamlabs / vMix (loopback 127.0.0.1)
- ✅ Validación periódica de la clave de licencia (cada 7 días)
- ✅ Si conectáis Twitch/YouTube/Kick: tokens OAuth en sessionStorage (se eliminan al cerrar el navegador)

Detalles completos en `docs/PRIVACY.html`.

---

## Soporte

- 📧 Correo electrónico: **soporte@edugame.digital**
- 🌐 Web: https://edugame.digital
- 📚 Documentación técnica: https://github.com/salazarjoelo/EsperantAI

Tiempos de respuesta:
- Consultas generales: 24-72 horas
- Errores técnicos: 1-3 días laborables
- Solicitudes de reembolso: 1-2 días laborables

---

*Última actualización: 2026-05-14. Versión: 3.0.*
*© 2026 EdugameDigital — Joel Salazar Ramírez. EsperantAI™.*
