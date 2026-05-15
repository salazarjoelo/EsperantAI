# Guía de solución de problemas de EsperantAI

Versión: para EsperantAI v2.0+. Si usas una versión anterior, actualiza primero.

Esta guía está ordenada por frecuencia esperada × impacto. Empieza por arriba antes de escribir a soporte.

Soporte: reemplazar este placeholder con el canal oficial de Joel antes de publicar: `[SUPPORT_EMAIL_OR_DISCORD]`.

---

## Checklist rápido antes de diagnosticar

1. Abre EsperantAI desde el lanzador normal o desde un servidor local/web, no directamente desde `file://`.
2. Usa Chrome o Edge primero si tienes duda.
3. Permite la cámara en el navegador.
4. Abre tu app de streaming antes de conectarla en EsperantAI.
5. Ten a la mano el correo con tu license key.

---

## Cámara

### No veo mi cámara (Cámara)

**Síntoma:** El selector de cámara está vacío, la vista previa está negra o el navegador pide permisos una y otra vez.

**Causa:** El navegador no tiene permiso de cámara, otra app ya está usando la cámara o el driver no está disponible para el navegador.

**Solución:**
1. Haz clic en el candado o ícono de cámara en la barra de direcciones del navegador.
2. Cambia **Cámara → Permitir** para la página de EsperantAI.
3. Cierra otras apps que puedan usar la cámara: OBS Virtual Camera, Zoom, Meet, Discord, Teams, Snap Camera.
4. Recarga EsperantAI.
5. Abre **Cámara que sigue tu rostro** y elige tu webcam.

**Si persiste:** Reinicia el navegador, desconecta y reconecta la webcam, y pruébala en una página genérica de test de cámara. Contacta `[SUPPORT_EMAIL_OR_DISCORD]` si la cámara funciona en otros sitios pero no en EsperantAI.

### La cámara funciona, pero EsperantAI no detecta mi cara (Cámara)

**Síntoma:** Ves la vista previa de la cámara, pero EsperantAI se queda en “Buscando rostro...” o el recuadro de la cara aparece solo a veces.

**Causa:** La IA necesita ver tu rostro con claridad. Poca luz, contraluz, ángulo extremo, lentes oscuros, cubrebocas o estar demasiado cerca/lejos pueden reducir la detección.

**Solución:**
1. Mira de frente a la cámara.
2. Agrega luz frente a ti, no detrás.
3. Mantén todo el rostro dentro de la vista previa.
4. Siéntate más o menos a un brazo de distancia.
5. Quita cualquier cosa que cubra ojos o rostro.
6. Ejecuta **Avanzado → Calibración → Recalibrar** cuando tu cara ya se detecte.

**Si persiste:** Prueba otra resolución de webcam u otra cámara. Si usas cámara virtual, prueba primero con una webcam física.

### Tengo varias cámaras y no sé cuál elegir (Cámara)

**Síntoma:** El selector muestra varias cámaras, pero la vista previa usa la incorrecta.

**Causa:** El navegador muestra cámaras físicas, cámaras virtuales, capturadoras y OBS Virtual Camera como dispositivos separados.

**Solución:**
1. Abre el selector de cámara.
2. Elige el dispositivo que muestre tu cara en la vista previa.
3. Si dos nombres se ven iguales, selecciónalos uno por uno y espera un segundo.
4. Guarda la configuración cuando quede la cámara correcta.

**Si persiste:** Desconecta temporalmente las cámaras que no uses, recarga EsperantAI y vuelve a conectarlas después.

---

## OBS / Streamlabs / vMix

### OBS Connected se queda en rojo (OBS / Streamlabs / vMix)

**Síntoma:** El indicador de conexión sigue rojo o dice que la app de streaming no está conectada.

**Causa:** OBS WebSocket no está activado, el puerto está mal, la contraseña no coincide o el firewall bloquea conexiones locales.

**Solución:**
1. Abre OBS.
2. Ve a **Herramientas → WebSocket Server Settings**.
3. Activa el servidor WebSocket.
4. Confirma el puerto. En OBS WebSocket v5 normalmente es `4455`.
5. Copia exactamente la contraseña si activaste autenticación.
6. En EsperantAI, usa la URL `ws://127.0.0.1:4455`.
7. Pega la contraseña y presiona **Conectar**.

**Si persiste:** Desactiva temporalmente reglas de firewall que bloqueen puertos locales y vuelve a intentar. También revisa “El cambio de escena no se aplica”.

### El cambio de escena no se aplica (OBS / Streamlabs / vMix)

**Síntoma:** EsperantAI dice que una acción se ejecutó, pero la escena visible no cambia.

**Causa:** La escena puede estar sin asignar, la conexión con la app de streaming pudo caerse o el nombre guardado de la escena ya no coincide.

**Solución:**
1. Reconecta tu app de streaming.
2. Espera a que EsperantAI recargue la lista real de escenas.
3. Abre **Triggers** y checa que el gesto tenga una escena asignada.
4. Si renombraste la escena en OBS/Streamlabs/vMix, selecciónala de nuevo.
5. Prueba la acción desde el modal de Multi-Action.

**Si persiste:** Crea una escena simple llamada `Test` y asigna un gesto a esa escena. Si `Test` funciona, el problema está en la escena/source original.

### vMix HTTP API no responde (OBS / Streamlabs / vMix)

**Síntoma:** vMix no conecta o las acciones no llegan a vMix.

**Causa:** El Web Controller / HTTP API de vMix puede estar apagado, el puerto puede estar mal o Windows Firewall puede bloquearlo.

**Solución:**
1. Abre vMix.
2. Activa Web Controller / HTTP API.
3. Confirma que el host sea `127.0.0.1` si vMix corre en la misma computadora.
4. Confirma el puerto, comúnmente `8088`.
5. En EsperantAI, usa el mismo host y puerto.
6. Permite vMix en Windows Firewall si aparece el aviso.

**Si persiste:** Abre la URL de la API de vMix manualmente en el navegador. Si el navegador no la alcanza, EsperantAI tampoco.

---

## Plataformas: Twitch / YouTube / Kick / StreamElements

### OAuth callback se queda colgado (Plataformas)

**Síntoma:** Se abre la ventana de login, pero nunca termina, se cierra sin conectar o EsperantAI no recibe el resultado.

**Causa:** Un bloqueador de popups, redirect URI incorrecta, state OAuth viejo o ajustes de privacidad del navegador interrumpieron el login.

**Solución:**
1. Permite popups para la página de EsperantAI.
2. Cierra la ventana de login.
3. Presiona **Conectar** otra vez desde EsperantAI.
4. Checa que el Client ID pertenezca a una app configurada con la redirect URI correcta.
5. No abras manualmente la URL de callback.

**Si persiste:** Prueba un perfil limpio del navegador con extensiones desactivadas. Contacta `[SUPPORT_EMAIL_OR_DISCORD]` con el nombre de la plataforma y el error mostrado.

### No recibo eventos en vivo (Plataformas)

**Síntoma:** Twitch/YouTube/Kick conecta, pero subs, donaciones, raids, puntos de canal o Super Chats no disparan nada.

**Causa:** El token puede no tener los permisos necesarios, el canal no está en vivo, la fuente de eventos usa otra API o StreamElements no está conectado al mismo canal.

**Solución:**
1. Confirma que conectaste la cuenta correcta de streamer.
2. Confirma que el canal esté en vivo o que la plataforma soporte eventos de prueba offline.
3. Reconecta la plataforma desde EsperantAI.
4. Para StreamElements, verifica que el JWT pertenezca al canal correcto.
5. Crea un trigger simple de evento: evento → notificación o cambio de escena.
6. Prueba otra vez con un evento real o generado por la plataforma.

**Si persiste:** Prueba el mismo evento mediante StreamElements bridge si está disponible.

### El token expira muy seguido (Plataformas)

**Síntoma:** Reconectas bien, pero la plataforma deja de enviar eventos después de poco tiempo.

**Causa:** La plataforma puede emitir tokens de corta duración, o la sesión puede limpiarse cuando cierras el navegador. Algunas integraciones guardan tokens solo por sesión por privacidad.

**Solución:**
1. Reconecta la plataforma antes de transmitir.
2. No borres el almacenamiento del navegador antes de salir en vivo.
3. Mantén abierta la pestaña de EsperantAI durante el stream.
4. Si está disponible, usa StreamElements bridge para cobertura de eventos más larga.

**Si persiste:** Reporta la plataforma exacta y el tiempo aproximado hasta que expira a `[SUPPORT_EMAIL_OR_DISCORD]`.

---

## Triggers / Gestos

### El gesto se detecta pero no dispara acción (Triggers)

**Síntoma:** La vista previa detecta tu pose o gesto, pero no pasa nada en OBS o en tu app de streaming.

**Causa:** La categoría puede estar desactivada, el trigger puede no tener escena/acción o la app de streaming no está conectada.

**Solución:**
1. Abre **Triggers**.
2. Activa la categoría correspondiente: cabeza, mirada, emoción, parpadeo o mano.
3. Asigna una escena rápida o agrega acciones en el modal Multi-Action.
4. Conecta tu app de streaming.
5. Usa **Probar** en el modal de acciones cuando esté disponible.
6. Mira **Historial de disparos** para confirmar si el trigger se activó.

**Si persiste:** Asigna temporalmente el mismo gesto a una notificación del navegador. Si la notificación funciona, el problema está en la acción de la app de streaming.

### El trigger se dispara solo / falsos positivos (Triggers)

**Síntoma:** Las escenas cambian aunque no hiciste un gesto intencional.

**Causa:** Los umbrales de sensibilidad pueden estar muy bajos para tu ángulo de cámara, postura o movimiento natural.

**Solución:**
1. Ejecuta **Avanzado → Calibración → Recalibrar**.
2. Sube ligeramente los frames estables.
3. Sube el cooldown si las acciones se disparan demasiado seguido.
4. Desactiva categorías de gestos que no uses.
5. Evita asignar acciones importantes al gesto “centro”.

**Si persiste:** Coloca la cámara en un ángulo frontal estable y mejora la iluminación.

### Los gestos de mano no funcionan (Triggers)

**Síntoma:** El movimiento de cabeza funciona, pero pulgar arriba, palma abierta, señal de paz, gassho u otros gestos de mano no se disparan.

**Causa:** La detección de mano puede estar desactivada, tu mano puede estar fuera del encuadre o la función puede estar bloqueada por tu licencia.

**Solución:**
1. Abre **Triggers → Gestos de mano** y activa la categoría.
2. Mantén la mano visible cerca de la parte superior del cuerpo, no pegada al lente.
3. Usa buena iluminación.
4. Checa tu nivel de licencia si la UI dice que la función está bloqueada.
5. Ejecuta el chequeo de mano de la calibración si está disponible.

**Si persiste:** Prueba con un fondo limpio y mueve la mano más despacio.

### El combo trigger no confirma (Triggers)

**Síntoma:** Llega un evento de plataforma, pero la acción combo no se ejecuta después de hacer el gesto.

**Causa:** El combo espera el gesto exacto dentro de su ventana de tiempo. Si el gesto no se detecta, el evento expira.

**Solución:**
1. Confirma que el combo esté activado.
2. Verifica que el tipo de evento y el gesto de confirmación estén seleccionados.
3. Prueba el gesto de confirmación por separado en **Triggers**.
4. Haz el gesto pocos segundos después del evento de plataforma.
5. Agrega primero una notificación simple; después suma acciones complejas.

**Si persiste:** Usa un gesto que EsperantAI detecte de forma confiable para ti, como pulgar arriba o palma abierta.

---

## Licencia / Activación

### Mi license key no se activa (Licencia)

**Síntoma:** La pantalla de activación se queda abierta o EsperantAI dice que la licencia no es válida.

**Causa:** La key puede tener espacios extra, caracteres faltantes, guiones incorrectos o el servicio de licencia puede estar temporalmente inaccesible.

**Solución:**
1. Copia la license key completa desde tu correo de compra.
2. Pégala en el campo de activación.
3. Quita espacios antes o después de la key.
4. Asegúrate de tener internet.
5. Presiona **Activar licencia** otra vez.

**Si persiste:** Contacta `[SUPPORT_EMAIL_OR_DISCORD]` con el correo de compra, no con una captura de tu key completa.

### EsperantAI dice licencia inválida aunque pagué (Licencia)

**Síntoma:** Pagaste, pero la app dice “licencia inválida” o falla la activación.

**Causa:** Puedes estar pegando el texto incorrecto, usando otro correo de compra o el proveedor de pago/licencia aún no termina de emitir la key.

**Solución:**
1. Busca en tu correo “EsperantAI” y “license”.
2. Copia solo la license key, no el order ID ni el número de factura.
3. Espera unos minutos si acabas de comprar.
4. Intenta de nuevo en el mismo navegador.

**Si persiste:** Contacta `[SUPPORT_EMAIL_OR_DISCORD]` con el correo de compra y referencia de orden.

### Cambié de PC y aparece too many activations (Licencia)

**Síntoma:** EsperantAI dice que la licencia llegó al límite de dispositivos.

**Causa:** Una licencia puede activarse en un número limitado de dispositivos. Los equipos anteriores siguen contando hasta que los desactives.

**Solución:**
1. En la computadora anterior, abre EsperantAI.
2. Ve a **Avanzado → Licencia**.
3. Presiona **Desactivar licencia en este dispositivo**.
4. Regresa a la nueva computadora y activa otra vez.

**Si persiste:** Contacta `[SUPPORT_EMAIL_OR_DISCORD]` y pide resetear una activación anterior.

---

## Rendimiento

### EsperantAI va lento u OBS pierde FPS (Rendimiento)

**Síntoma:** La app se siente lenta, la vista previa de cámara se traba u OBS pierde FPS mientras EsperantAI está abierto.

**Causa:** La IA en navegador, OBS, el juego, la captura y los overlays pueden competir por CPU/GPU.

**Solución:**
1. Cierra pestañas y apps pesadas que no uses.
2. Usa webcam de 720p o 1080p, no 4K.
3. Desactiva categorías de gestos que no uses.
4. Baja la resolución de cámara si está disponible.
5. Mantén OBS y EsperantAI en la misma GPU cuando sea posible.
6. Si usas laptop, conéctala a corriente.

**Si persiste:** Prueba sin el juego abierto. Si mejora, baja ajustes del juego o del encoder de OBS.

### La batería de mi laptop se baja rápido (Rendimiento)

**Síntoma:** La batería baja muy rápido mientras usas EsperantAI.

**Causa:** La detección de IA en tiempo real usa CPU/GPU continuamente.

**Solución:**
1. Conecta la laptop durante tus streams.
2. Baja el brillo de pantalla.
3. Cierra apps que no uses.
4. Desactiva categorías de gestos innecesarias.
5. Usa una resolución de cámara menor.

**Si persiste:** Usa EsperantAI conectado a corriente para transmisiones en vivo.

---

## Audio / TTS / Sonidos

### TTS no se escucha (Audio / TTS)

**Síntoma:** La acción de texto a voz se ejecuta, pero no escuchas nada.

**Causa:** El audio del navegador puede estar silenciado, el sistema puede no tener voz predeterminada o la política de autoplay pudo bloquear el sonido antes de una interacción del usuario.

**Solución:**
1. Haz clic una vez dentro de EsperantAI antes de probar TTS.
2. Checa que la pestaña del navegador no esté silenciada.
3. Revisa volumen del sistema y dispositivo de salida.
4. Confirma que tu sistema operativo tenga una voz instalada.
5. Prueba con un mensaje corto primero.

**Si persiste:** Prueba otro navegador. Chrome/Edge suelen tener el mejor soporte de Web Speech.

### play_sound no reproduce audio (Audio / TTS)

**Síntoma:** La acción de reproducir sonido se ejecuta, pero no se escucha.

**Causa:** La URL del sonido puede estar bloqueada, no disponible, no ser compatible o la política de autoplay del navegador puede requerir un clic del usuario primero.

**Solución:**
1. Usa un archivo local o del mismo origen si es posible.
2. Abre la URL del sonido directamente en el navegador para confirmar que reproduce.
3. Haz clic dentro de EsperantAI una vez y prueba otra vez.
4. Usa un formato común como `.mp3` o `.wav`.
5. Baja el volumen si el sonido se satura.

**Si persiste:** Reemplaza la URL por un archivo corto que sepas que funciona y prueba de nuevo.

---

## Qué enviar a soporte

Cuando contactes soporte, incluye:

1. Sistema operativo y navegador.
2. App de streaming y versión.
3. Integración de plataforma usada: Twitch, YouTube, Kick, Trovo o StreamElements.
4. Síntoma exacto.
5. Qué pasos ya probaste de esta guía.
6. Captura del mensaje de error, pero nunca publiques tu license key completa.
