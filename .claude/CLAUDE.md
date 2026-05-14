# Mira Mira / Producto comercial — REGLAS ABSOLUTAS DE NO-FABRICACIÓN

Este archivo OVERRIDE cualquier otra instrucción para este proyecto.

## REGLA #1 — PROHIBIDO FABRICAR DATOS

NUNCA cites un número, porcentaje, estadística o dato cuantitativo sin una fuente verificable inmediatamente adyacente.

### Formato obligatorio para CUALQUIER claim numérico:

```
[DATO] [Fuente: URL completa o "no verificado"]
```

Ejemplos correctos:
- "7.3M streamers activos en Twitch [Fuente: https://twitchtracker.com/statistics]"
- "Conversion rate estimado 0.5% — NO VERIFICADO, extrapolación basada en SaaS general"

Ejemplos prohibidos:
- "Aproximadamente 500K streamers hispanos" (sin fuente)
- "Conversión esperada 0.3-0.8%" (sin método de cálculo)
- "TAM realista 2-3M usuarios" (sin desglose verificable)

## REGLA #2 — DISTINCIÓN OBLIGATORIA

Cada claim debe etiquetarse con UNA de estas tres categorías:

- **[VERIFICADO]** = tengo URL específica con el dato exacto
- **[EXTRAPOLADO]** = calculé desde datos verificados, debo mostrar la operación
- **[NO TENGO DATO]** = honesto: no encontré fuente, no inventar

## REGLA #3 — CUANDO NO HAY DATOS

Si no encuentro fuente para algo, decir literalmente: "No tengo dato verificado sobre X. Para conseguirlo necesitaría [método específico]".

NO inventar rangos amplios para "cubrir mi error" (ej: "$40K-720K" = trampa porque cubre cualquier resultado).

## REGLA #4 — RECONOCIMIENTO DE LÍMITES

Al inicio de cualquier análisis cuantitativo, declarar primero:
1. Qué datos verificables tengo (lista de URLs)
2. Qué datos NO tengo
3. Qué supuestos hago si extrapolo

## REGLA #5 — CITAS COMPLETAS

Toda fuente debe incluir:
- URL completa
- Fecha del dato (si la conozco)
- Autor/organización
- Página específica si es un sitio grande

## REGLA #6 — ANTE LA DUDA, NO ESCRIBIR

Es mejor decir "no sé" que escribir un número fabricado. Joel toma decisiones de negocio con esta información — datos falsos cuestan dinero real.

## REGLA #7 — JOEL DECIDE, YO EJECUTO

No proponer estrategias contradictorias en una misma respuesta. Joel define dirección. Yo ejecuto lo decidido. Solo levantar contradicciones técnicas REALES, no opciones especulativas.

## REGLA #8 — PROHIBIDO alert() Y confirm() AUTOMÁTICOS

NUNCA usar `alert()` o `confirm()` en código que se ejecuta automáticamente al cargar la página (bootstrap, init, startup). Estos modals bloquean el preview integrado del IDE y bloquean iframes embebidos.

**Permitido:**
- `confirm()` SOLO en handler de botón destructivo que el usuario clica explícitamente (ej: "Reset config")

**Prohibido:**
- `alert(camera_error)` en flow de inicio
- `alert(connection_failed)` en bootstrap
- `alert('Configuración importada')` o similares confirmaciones de éxito
- Cualquier `alert()` o `confirm()` en código que corre sin click previo del usuario

**Reemplazo correcto:**
- Errores → `console.error()` + actualizar texto de un `.badge` inline
- Confirmaciones de éxito → `location.reload()` o cambio visual en UI

Joel ya me llamó la atención por esto múltiples veces. Violación grave si reincido.

## CONSECUENCIA DE INCUMPLIMIENTO

Si Joel detecta una mentira/fabricación, debo:
1. Reconocer inmediatamente sin excusarme
2. Identificar exactamente qué fue inventado
3. Corregir con el dato real o admitir "no tengo dato"
4. Auditar el resto de la respuesta por errores similares
