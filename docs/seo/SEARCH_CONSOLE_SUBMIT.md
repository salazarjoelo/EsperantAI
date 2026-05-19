# Submit sitemap a webmaster tools — INSTRUCCIONES PARA JOEL

Después del deploy SEO multilingüe (15 locales + sitemap.xml), hay que avisar a los buscadores manualmente para acelerar la indexación. Sin esto, Googlebot puede tardar 2-6 semanas en descubrir las URLs nuevas. Con submit, tarda 1-7 días.

**Sitemap a submitar en todas las consolas:**
```
https://edugame.digital/sitemap.xml
```

---

## 1. Google Search Console (PRIORIDAD MÁXIMA)

**URL directa**: https://search.google.com/search-console

### Pasos

1. Login con `joel@edugame.digital` (o la cuenta Google que administra el dominio)
2. ¿Aparece `edugame.digital` en la lista de propiedades?
   - **SÍ** → click en `edugame.digital` → ir paso 5
   - **NO** → "Agregar propiedad" → tipo "Dominio" → escribir `edugame.digital`
3. Verificar propiedad: Google pedirá agregar un registro TXT al DNS:
   - Copiar el TXT value (algo como `google-site-verification=ABC123...`)
   - Decirme el TXT → yo lo agrego al DNS via paramiko al server o por panel Hostinger
4. Esperar 1-2 min → click "Verificar"
5. Menú izquierdo → "Sitemaps"
6. Pegar: `sitemap.xml` (solo el path, NO la URL completa)
7. Click "Enviar"

### Verificación posterior (30 min después)

- Status del sitemap debe decir "Correcto"
- Páginas detectadas: debe ser **16** (root + 15 locales)
- Si dice "Error" → me dices el mensaje, lo investigo

### Bonus: pedir indexación manual de cada locale (1-2 días)

Para acelerar indexación los próximos 7 días:
1. Menú "Inspección de URL" (arriba)
2. Pegar `https://edugame.digital/en-us/` → buscar
3. Click "Solicitar indexación"
4. Repetir con los 14 locales restantes (toma 5 minutos total)

---

## 2. Bing Webmaster Tools

**URL directa**: https://www.bing.com/webmasters

### Pasos

1. Login con cuenta Microsoft (o Google/Facebook OAuth)
2. **TIP**: Bing permite importar verificación + sitemaps desde Google Search Console — sale un botón "Import from Google Search Console" después del login. Eso ahorra 90% del trabajo.
3. Si no importa: "Add a site" → `https://edugame.digital`
4. Verificación: opciones (XML, meta tag, BingSiteAuth.xml file) — la más fácil es el meta tag en `<head>`. Decírmelo y lo agrego al HTML.
5. Después de verificar: menú "Sitemaps" → "Submit sitemap" → `https://edugame.digital/sitemap.xml`

### Por qué importa Bing

- DuckDuckGo, Yahoo y Ecosia consumen el índice de Bing
- ChatGPT (Bing Search) cita resultados de Bing en sus respuestas
- Microsoft Copilot (Edge, Windows) usa Bing índex

---

## 3. Yandex Webmaster (mercado RU)

**URL directa**: https://webmaster.yandex.com

Para que `/ru-ru/` aparezca en yandex.ru. Yandex tiene ~60% market share en Rusia (Google está bloqueado parcialmente).

### Pasos

1. Login con cuenta Yandex (crear si no tienes)
2. "Add site" → `https://edugame.digital`
3. Verificación: archivo HTML, meta tag, o DNS TXT
4. Sitemaps → Add → `https://edugame.digital/sitemap.xml`
5. **Opcional pero recomendado**: en config decir "preferred mirror is https" (Yandex todavía pregunta esto en 2026)

---

## 4. Baidu Webmaster (mercado CN)

**URL directa**: https://ziyuan.baidu.com

Para que `/zh-cn/` aparezca en baidu.com. **Pero**: Baidu requiere que el sitio sea accesible desde China (GFW puede bloquear). Si edugame.digital responde bien desde IP china (verificable en https://www.websitepulse.com/tools/china-firewall-test), procede:

### Pasos

1. Crear cuenta Baidu (requiere SMS china — alternativa: WeChat OAuth)
2. Sitio + verificación via meta tag o archivo HTML
3. 链接提交 (link submission) → sitemap URL

**Si no es factible registrarse**: skip Baidu. zh-CN ranking se construirá orgánicamente con backlinks.

---

## ¿Cuál hacer primero?

| Prioridad | Consola | Tiempo | Por qué |
|-----------|---------|--------|---------|
| 🔴 **HOY** | Google Search Console | 5-10 min | 92% search market share global |
| 🟡 esta semana | Bing Webmaster | 3 min (import desde GSC) | Cubre DuckDuckGo, Yahoo, ChatGPT citations |
| 🟢 cuando puedas | Yandex | 5 min | Solo si quieres seguidores en RU |
| ⚪ opcional | Baidu | 30 min + verif | Solo si target seriamente CN |

## Cuando completes GSC

Avísame y verifico desde mi lado que:
- Google está crawleando (vía `site:edugame.digital` en buscador)
- Las 16 URLs aparecen en el índice (puede tardar 1-7 días)
- No hay errores hreflang (tab GSC "Internacionalización")
