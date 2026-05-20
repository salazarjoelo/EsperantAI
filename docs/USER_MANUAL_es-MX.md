# EsperantAI — Manual de usuario

> **Gestos honestos.** Controla tu software de streaming con la cara y las manos, sin hardware adicional dedicado.

**Versión**: 3.0 · **Idioma**: Español (México) (traducciones disponibles en 14 idiomas más)

**Validación técnica**: revisado contra documentación oficial disponible al **20 de mayo de 2026** para OBS Studio, Streamlabs Desktop, vMix, PRISM Live Studio, XSplit, Twitch, YouTube Live, Kick, Trovo y StreamElements. Detalle: [`docs/MANUAL_PLATFORM_AUDIT_2026-05.md`](MANUAL_PLATFORM_AUDIT_2026-05.md).

---

## Índice

1. [¿Qué es EsperantAI?](#qué-es-esperantai)
2. [Requisitos mínimos](#requisitos-mínimos)
3. [Compra y activación](#compra-y-activación)
4. [Primer uso](#primer-uso)
5. [Conecta tu software de streaming](#conecta-tu-software-de-streaming)
6. [Configura gestos y escenas](#configura-gestos-y-escenas)
7. [Categorías de gestos](#categorías-de-gestos)
8. [Conecta plataformas de streaming](#conecta-plataformas-de-streaming)
9. [Combinaciones de evento + gesto (Avanzado)](#combinaciones-de-evento--gesto-avanzado)
10. [Sensibilidad y zona muerta](#sensibilidad-y-zona-muerta)
11. [Atajos de teclado](#atajos-de-teclado)
12. [Historial de disparadores](#historial-de-disparadores)
13. [Cambiar idioma](#cambiar-idioma)
14. [Administra tu licencia](#administra-tu-licencia)
15. [Solución de problemas](#solución-de-problemas)
16. [Privacidad](#privacidad)
17. [Soporte](#soporte)

---

## ¿Qué es EsperantAI?

EsperantAI es una **aplicación web** que usa inteligencia artificial para detectar tus gestos faciales y manuales en tiempo real, y los traduce en comandos para tu software de streaming. El video de tu cámara se procesa localmente en tu navegador.

![Flujo local de EsperantAI](assets/manual/01-esperantai-flow.svg)

Funciona con estos programas de transmisión:

- **OBS Studio** 28+
- **Streamlabs Desktop**
- **vMix**
- **PRISM Live Studio**
- **XSplit Broadcaster** (beta)

También puede recibir eventos de plataformas para combinarlos con tus gestos:

- **Twitch**: soporte directo por EventSub WebSocket.
- **YouTube Live**: soporte directo por YouTube Data API v3; requiere directo activo y cuota disponible.
- **Kick**: soporte mediante **Streamer.bot bridge** local. Streamer.bot recibe Kick por su integración oficial y EsperantAI escucha esos eventos por WebSocket local.
- **StreamElements**: puente multiplataforma con token/JWT de tu cuenta.
- **Trovo**: soporte nativo por OAuth + WebSocket de chat de Trovo.

### ¿Por qué «gestos honestos»?

Las expresiones faciales básicas y la rotación de la cabeza son **universales en todas las culturas humanas** (Paul Ekman, 1972). No mienten, no varían según la geografía. EsperantAI llama a estos gestos «🌐 Universales» y los distingue de los gestos «⚠️ Culturales» (señas con las manos), cuyo significado puede variar según el país.

Tú decides qué gestos usar según tu audiencia.

---

## Requisitos mínimos

### Hardware

- **Cualquier cámara web USB** (recomendada: 1080p o superior)
- **CPU**: cualquier procesador de 4+ núcleos de los últimos 5 años
- **RAM**: 8 GB mínimo. 16 GB recomendados si haces streaming al mismo tiempo.
- **GPU**: cualquiera con soporte WebGL (incluso las GPU integradas modernas funcionan)

### Software

- **SO**: Windows 10/11, macOS 12+, o Linux con kernel reciente
- **Navegador**: Chrome 90+, Edge 90+, o Firefox 100+
- **Software de streaming** (al menos uno): OBS Studio 28+, Streamlabs Desktop, vMix, PRISM, XSplit

### Internet

- Necesario para **activar tu licencia** y cada **7 días** para revalidación
- Funciona **hasta 7 días sin conexión** (período de gracia)

---

## Compra y activación

1. Visita **https://edugame.digital**
2. Haz clic en **«Comprar licencia»**
3. Completa el pago por medio de LemonSqueezy (tarjeta, PayPal, etc.)
4. Recibirás un correo electrónico con:
   - Tu **clave de licencia** (formato: `XXXX-XXXX-XXXX-XXXX-XXXX`)
   - Enlace para usar EsperantAI
5. Abre EsperantAI en tu navegador
6. Aparecerá la pantalla de activación. Pega tu clave de licencia
7. Haz clic en **«Activar licencia»**
8. ¡Listo! 🎉

### ¿Cuántos dispositivos?

Una licencia se puede activar en **hasta 3 dispositivos**. Para mover tu licencia a otro dispositivo:

1. En el dispositivo anterior: panel **Avanzado** → **Licencia** → **Desactivar en este dispositivo**
2. En el dispositivo nuevo: activa normalmente

---

## Primer uso

### Paso 1: Permite el acceso a la cámara

Cuando abras EsperantAI por primera vez, tu navegador te pedirá permiso para acceder a la cámara. **Acepta**.

> Importante: EsperantAI nunca envía tu video a ningún servidor. El procesamiento es 100% local en tu dispositivo.

### Paso 2: Selecciona la cámara

Si tienes más de una cámara, elige cuál usar desde el menú desplegable de cámaras.

### Paso 3: Verifica la detección

Verás tu rostro en el panel izquierdo. Cuando EsperantAI detecte tu rostro, los indicadores de Yaw / Pitch / Roll empezarán a mostrar valores.

### Paso 4: Asistente de calibración (Pro+)

Si tienes una licencia Pro o Pro+, el **Asistente de calibración** se lanza automáticamente en el primer uso. Mide tu rango de movimiento natural y establece la sensibilidad óptima. Puedes volver a ejecutarlo en cualquier momento desde el botón **Recalibrar**.

---

## Conecta tu software de streaming

![Matriz de conexión de software de streaming](assets/manual/02-software-setup.svg)

Todas las conexiones de esta sección son locales: EsperantAI se comunica con el programa de transmisión que corre en tu misma computadora mediante `127.0.0.1`.

### OBS Studio

1. En OBS: **Herramientas → Configuración del servidor WebSocket**
2. Habilita el servidor WebSocket. OBS Studio 28+ ya incluye obs-websocket.
3. En EsperantAI: panel **Conexión**
4. Software de streaming: **OBS Studio**
5. URL de WebSocket: `ws://127.0.0.1:4455` (predeterminada)
6. Contraseña: la que configuraste en OBS, si activaste contraseña
7. Haz clic en **Conectar**

### Streamlabs Desktop

1. En Streamlabs Desktop: **Settings → Remote Control**
2. Habilita el control remoto local
3. Copia el **API Token** desde la pantalla de Remote Control
4. En EsperantAI: Software de streaming: **Streamlabs Desktop**
5. Token de API: pégalo
6. Puerto: `59650` (predeterminado)
7. Haz clic en **Conectar**

### vMix

1. En vMix: **Settings → Web Controller**
2. Habilita Web Controller. Puerto predeterminado: `8088`.
3. En EsperantAI: Software de streaming: **vMix**
4. Host: `127.0.0.1`
5. Puerto: `8088`
6. Haz clic en **Conectar**

> Nota: el adaptador actual de EsperantAI usa la API HTTP local de vMix. Si protegiste el Web Controller con reglas de red o credenciales no compatibles con el navegador, la conexión puede fallar.

### PRISM Live Studio

1. Usa **PRISM Live Studio v4.0.5+**.
2. Instala manualmente el plugin `obs-websocket` compatible con OBS/PRISM.
3. Cópialo a la carpeta de plugins de PRISM siguiendo la guía oficial de PRISM para plugins OBS.
4. Reinicia PRISM
5. Habilita WebSocket en **Herramientas → Configuración del servidor WebSocket**
6. En EsperantAI: Software de streaming: **PRISM Live Studio** (funciona igual que OBS)

> Diferencia importante: OBS 28+ ya incluye obs-websocket. PRISM requiere el plugin instalado manualmente.

### XSplit Broadcaster (beta)

1. Instala o habilita un puente local compatible con **XSplit XJS / Remote xjs**.
2. Verifica que el puente exponga una URL WebSocket local.
3. En EsperantAI: Software de streaming: **XSplit**
4. URL del proxy Remote xjs: `ws://127.0.0.1:5555/xjs` (predeterminada)
5. Haz clic en **Conectar**

> XSplit está en **beta**. La compatibilidad depende del puente XJS local instalado; las funciones avanzadas pueden estar limitadas.

---

## Configura gestos y escenas

Una vez conectado, las escenas reales de tu software aparecerán automáticamente en los menús desplegables del panel **Disparadores**.

### Mapeo básico

1. Para cada gesto (p. ej., «Mirar a la izquierda»), elige una escena del menú desplegable
2. Cuando hagas ese gesto y lo mantengas estable durante ~150ms, EsperantAI cambiará a esa escena en tu software de streaming
3. El cambio es automático y prácticamente instantáneo

### Multi-acción (Pro+)

Con una licencia Pro o Pro+, un gesto puede desencadenar **múltiples acciones** al mismo tiempo:
- Cambiar escena + reproducir sonido + mostrar overlay + enviar mensaje al chat

### Activar / desactivar categorías

Cada categoría tiene su propia casilla «Activar»:

- 🧠 **Rotación de cabeza** (universal — activada por defecto)
- 📏 **Distancia facial** (acércate o aléjate)
- 👁️ **Mirada** (mueve solo los ojos)
- 😀 **Emociones** (sonrisa, sorpresa, enojo, neutral)
- 👁️‍🗨️ **Doble parpadeo**
- ✋ **Gestos con las manos** (cultural — desactivados por defecto)

Desactiva las categorías que no necesites para ahorrar CPU.

---

## Categorías de gestos

### 🌐 Universales (mismo significado en cualquier cultura)

| Gesto | Eje | Cómo activarlo |
|---|---|---|
| Centro | — | Mirando al frente, rostro estable |
| Mirar a la izquierda | yaw negativo | Gira la cabeza hacia tu izquierda |
| Mirar a la derecha | yaw positivo | Gira la cabeza hacia tu derecha |
| Mirar arriba | pitch negativo | Levanta el rostro |
| Mirar abajo | pitch positivo | Baja el rostro |
| Inclinar a la izquierda | roll negativo | Inclina la cabeza hacia el hombro izquierdo |
| Inclinar a la derecha | roll positivo | Inclina la cabeza hacia el hombro derecho |
| Acercarse | distancia | Acércate a la cámara |
| Alejarse | distancia | Aléjate de la cámara |
| Mirada | mirada | Mueve solo los ojos (cabeza centrada) |
| Sonrisa | emoción=feliz | Sonríe claramente |
| Sorprendido | emoción=sorpresa | Muestra sorpresa |
| Enojado | emoción=enojo | Muestra enojo |
| Neutral | emoción=neutral | Rostro relajado |
| Doble parpadeo | parpadeo | Cierra ambos ojos dos veces rápido (< 700ms) |

### ⚠️ Culturales (el significado varía según el país)

| Gesto | Significado occidental | Precaución en otras culturas |
|---|---|---|
| 👍 Pulgar arriba | Aprobación | Medio Oriente / Asia occidental: puede ser ofensivo |
| ✌️ Paz | Paz / victoria | Reino Unido / Irlanda / Australia (palma hacia adentro): insulto |
| 🤘 Cuernos de rock | Rock / metal | Italia (palma hacia abajo): «cornuto» (insulto) |
| 👌 OK | OK / perfecto | Brasil / Turquía / Alemania: puede ser ofensivo |
| ✊ Puño cerrado | Varía según el contexto político | — |
| 🖐️ Palma abierta | «Alto» o saludo | Grecia (mountza hacia alguien): fuerte insulto |
| ☝️ Señalar | Indicar | Asia: señalar con el dedo es de mala educación |

EsperantAI marca cada gesto con su insignia correspondiente en la interfaz. Elige cuáles usar según tu audiencia global.

### 🙏 Gassho (合掌)

Un gesto especial: junta ambas palmas frente al pecho (como en una oración o reverencia de saludo). Común en las culturas de Asia oriental como señal de respeto o gratitud. Se detecta con alta confiabilidad mediante 6 comprobaciones de puntos de referencia.

---

## Conecta plataformas de streaming

Para que EsperantAI reciba eventos (donaciones, suscripciones, raids, follows o Super Chats), conecta las plataformas donde haces streaming.

![Estado de eventos por plataforma](assets/manual/03-platform-events.svg)

### Twitch

1. Crea un Client ID en https://dev.twitch.tv/console
2. Registra la URI de redirección: `https://edugame.digital/oauth-callback.html` (o tu URL local)
3. En EsperantAI: panel **Eventos de plataforma** → **Twitch EventSub**
4. Pega tu Client ID
5. Haz clic en **Conectar**
6. Se abrirá una ventana de autorización de Twitch. Acepta los permisos.
7. La ventana se cerrará y verás «Twitch conectado»

EsperantAI usa EventSub WebSocket. No pegues ningún Client Secret en el navegador.

### YouTube Live

1. Crea credenciales en https://console.cloud.google.com
2. Habilita YouTube Data API v3
3. Crea un OAuth Client ID (tipo: Aplicación web)
4. Registra la misma URI de redirección que en Twitch
5. En EsperantAI: panel **Eventos de plataforma** → **YouTube Live**
6. Pega tu Client ID y haz clic en **Conectar**

Requisitos de YouTube: debes tener un directo activo con chat disponible, y tu proyecto de Google Cloud debe tener cuota suficiente para consultar el chat.

### Kick via Streamer.bot

EsperantAI soporta Kick mediante **Streamer.bot bridge**. Esta es la ruta recomendada para venta porque no expone secretos de Kick en el navegador y no depende de ingeniería inversa.

1. Instala Streamer.bot 1.0.0 o superior.
2. En Streamer.bot, conecta tu cuenta de Kick.
3. En Streamer.bot: **Servers/Clients → WebSocket Server** y activa el servidor.
4. Usa `127.0.0.1`, puerto `8080` y endpoint `/`, salvo que hayas cambiado esos valores.
5. En EsperantAI: panel **Eventos de plataforma** → **Kick via Streamer.bot**.
6. Haz clic en **Conectar**.

Eventos disponibles por este puente: follows, suscripciones, resuscripciones, regalos de suscripción y redenciones soportadas por Streamer.bot. Kick nativo oficial con backend/webhooks queda como roadmap avanzado.

### StreamElements (puente multiplataforma)

Si ya tienes una cuenta de StreamElements, puedes usarlo como puente para alertas de varias plataformas:

1. Ve a https://streamelements.com/dashboard/account/channels
2. Copia tu JWT Token
3. En EsperantAI: panel **Eventos de plataforma** → **StreamElements**
4. Pega el JWT y haz clic en **Conectar**

Mantén ese token privado. Trátalo como una contraseña de tu cuenta de StreamElements.

### Trovo

EsperantAI soporta Trovo de forma nativa usando OAuth y el WebSocket oficial de chat de Trovo.

1. Crea una aplicación en el portal de desarrolladores de Trovo.
2. Registra la URI de redirección que usa EsperantAI: `oauth-callback.html` en el mismo dominio donde abras la app.
3. En EsperantAI: panel **Eventos de plataforma** → **Trovo**.
4. Pega tu Client ID y haz clic en **Conectar**.
5. Autoriza los permisos solicitados.

Eventos disponibles: suscripciones, resuscripciones, regalos de suscripción, follows, raids, spells/gifts y magic chat.

---

## Combinaciones de evento + gesto (Avanzado)

Esta es la magia de EsperantAI: combinar **eventos de plataforma** con **tus gestos** como confirmación.

![Flujo de evento más gesto](assets/manual/04-event-gesture-combo.svg)

### Ejemplo: agradecer donaciones con un pulgar arriba

1. Panel **Disparadores de eventos** → fila «💰 Donación»
2. ✅ Activa
3. Escena: `Escena_Gracias`
4. Gesto requerido: `👍 Pulgar arriba`

**Flujo en vivo**:
- Llega una donación → EsperantAI muestra «Esperando gesto...»
- Tienes 5 segundos para hacer 👍
- Si lo haces → cambia a `Escena_Gracias` + ejecuta cualquier otra acción configurada
- Si no → se descarta automáticamente

### Sin gesto requerido (disparo automático)

Si dejas «Gesto requerido» como `— ninguno —`, el evento desencadena la acción inmediatamente.

Útil para:
- Cambiar automáticamente a la escena de celebración cuando llegan raids
- Mostrar automáticamente un overlay cuando alguien se suscribe

---

## Sensibilidad y zona muerta

### Sensibilidad

Los umbrales controlan qué tan grande debe ser un gesto para que se dispare:

- **Yaw**: cuánto debes girar la cabeza hacia los lados (predeterminado: 0.15 rad ≈ 8.6°)
- **Pitch arriba/abajo**: inclinación vertical
- **Roll**: inclinación lateral

Sube los valores para gestos más marcados. Bájalos para mayor sensibilidad.

### Zona muerta (antifatiga)

Si estás casi centrado (yaw < 0.05, pitch < 0.05, roll < 0.08), **NADA se dispara**. Esto te permite moverte de forma natural sin que los micromovimientos activen disparadores.

### Fotogramas estables

`Fotogramas estables` = cuántos fotogramas consecutivos debes mantener el gesto antes de que se dispare. Predeterminado: 5 fotogramas (~150ms a 30fps).

Sube si los disparadores se activan con demasiada facilidad. Baja para una respuesta más rápida.

### Enfriamiento

`Enfriamiento (ms)` = tiempo mínimo entre cambios de escena. Predeterminado: 500ms.

Evita que el conmutador sea «inestable» si oscilas rápidamente.

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

Útil para auditar qué se disparó sin abrir DevTools.

**Exportar CSV**: descarga el historial para análisis sin conexión.

**Limpiar**: borra el historial (no afecta nada más).

---

## Cambiar idioma

EsperantAI detecta automáticamente el idioma de tu sistema operativo. Para cambiarlo manualmente:

- Esquina superior derecha: menú desplegable de idioma
- Selecciona tu idioma preferido
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
- 🇮🇳 हिन्दी
- 🇮🇩 Bahasa Indonesia

Los 15 idiomas están traducidos en los archivos de interfaz actuales.

---

## Administra tu licencia

Panel **Avanzado → Licencia**:

- **Ver estado**: Válida / Inválida
- **Ver correo electrónico del cliente asociado**
- **Ver última validación en línea**
- **Desactivar en este dispositivo**: úsalo antes de cambiar de PC o para liberar un espacio (de los 3 disponibles)

## Solución de problemas

### «Activación requerida» persiste después de pegar mi clave de licencia

- Verifica que copiaste la clave completa (5 grupos de 4 caracteres separados por guiones)
- Revisa tu conexión a Internet (la activación requiere validación en línea la primera vez)
- Si ya activaste en 3 dispositivos, desactiva uno primero
- Contacta a soporte@edugame.digital si el problema persiste

### «Buscando rostro...» persiste aunque mi rostro es visible

- Mejora la iluminación: tu rostro debe estar bien iluminado
- Acércate a la cámara (40-80 cm es óptimo)
- Cierra otras pestañas que usen GPU (Chrome puede limitar la GPU si hay demasiadas abiertas)
- Si el Ahorrador de memoria de Chrome está activo, desactívalo para esta pestaña

### Las escenas no aparecen en los menús desplegables

- Verifica que estás conectado al software de streaming (insignia verde «Conectado»)
- Presiona `R` para recargar la lista de escenas
- Si sigue vacía, desconecta y vuelve a conectar
- En vMix, confirma que Web Controller está habilitado y accesible desde `http://127.0.0.1:8088/api/`
- En PRISM, confirma que el plugin obs-websocket está instalado y habilitado
- En XSplit, confirma que el puente XJS local está corriendo

### Los cambios de escena se disparan sin que yo haga gestos

- Sube el umbral de yaw / pitch / roll en el panel **Sensibilidad**
- Sube los `Fotogramas estables` de 5 a 8-10
- Asegúrate de que la zona muerta esté configurada (yaw 0.05, pitch 0.05, roll 0.08)
- Revisa que no haya nadie más en el encuadre (varios rostros pueden causar inestabilidad)

### Retraso en la detección

- Cierra aplicaciónes pesadas (juegos, edición de video)
- Verifica que estás usando la GPU dedicada si tienes una (no la integrada)
- Reduce la resolución de la cámara si es 4K (1080p es óptimo para detección)

### OBS no reacciona aunque EsperantAI indica «Escena cambiada»

- Verifica que el nombre de la escena en el menú desplegable coincida EXACTAMENTE con el de OBS (sensible a mayúsculas)
- Verifica que la escena no esté en otra Colección de escenas
- Revisa el panel **Historial de disparadores** — si muestra ✗ rojo, hay un error específico

### Error «OBS inalcanzable — Conecta manualmente»

- Verifica que OBS está abierto
- Verifica que WebSocket está habilitado en OBS
- Si configuraste una contraseña en OBS, debe coincidir exactamente
- Algunos antivirus bloquean el puerto 4455 — agrega una excepción

### Twitch o YouTube no conectan

- Verifica que la URI de redirección en la consola de la plataforma coincida exactamente con la URL de `oauth-callback.html`
- Permite ventanas emergentes para el dominio donde estás usando EsperantAI
- En Twitch, usa solo el Client ID; no pegues Client Secret
- En YouTube, confirma que YouTube Data API v3 está habilitada y que hay un directo activo

### Kick no conecta con Streamer.bot

Confirma que Streamer.bot 1.0.0+ está abierto, que Kick está conectado dentro de Streamer.bot y que **WebSocket Server** está activo. Usa `127.0.0.1:8080/` salvo que hayas cambiado la configuración. Si Streamer.bot pide contraseña, escribe la misma contraseña en EsperantAI.

---

## Privacidad

### Lo que EsperantAI NO hace

- ❌ NO envía tu video a ningún servidor
- ❌ NO almacena tu video ni capturas
- ❌ NO recopila información biométrica de forma remota
- ❌ NO comparte datos con anunciantes ni terceros

### Lo que SÍ procesa

- ✅ Detección facial local en tu navegador (Human.js + WebGL)
- ✅ Conexiones locales a OBS / Streamlabs / vMix / PRISM / XSplit (loopback `127.0.0.1`)
- ✅ Validación periódica de la clave de licencia (cada 7 días)
- ✅ Si conectas Twitch/YouTube/Kick/StreamElements: tokens de plataforma en almacenamiento local o de sesión del navegador

Detalles completos en `docs/PRIVACY.html`.

---

## Soporte

- 📧 Correo electrónico: **soporte@edugame.digital**
- 🌐 Web: https://edugame.digital
- 📚 Documentación técnica: https://github.com/salazarjoelo/EsperantAI

Tiempos de respuesta:
- Consultas generales: 24-72 horas
- Errores técnicos: 1-3 días hábiles

---

*Última actualización: 2026-05-20. Versión: 3.0.*
*© 2026 EdugameDigital — Joel Salazar Ramírez. EsperantAI™.*
