/* ============================================================================
 * EsperantAI Landing — i18n engine (standalone)
 * Detects navigator.language + ?lang param + localStorage preference.
 * Fetches /locales/landing-{locale}.json and applies to data-i18n elements.
 * Mirrors the pattern of core/i18n.js but works without app dependencies.
 * CSP-safe: only same-origin fetch, no eval, no inline handlers.
 * ========================================================================== */

(function () {
    'use strict';

    var SUPPORTED = [
        'es-ES', 'es-MX', 'en-US', 'pt-BR', 'fr-FR', 'de-DE',
        'ja-JP', 'ru-RU', 'zh-CN', 'it-IT', 'pl-PL', 'ar-SA',
        'ko-KR', 'hi-IN', 'id-ID'
    ];
    var FALLBACK = 'es-ES';
    var STORAGE_KEY = 'esperantai-landing-lang';

    // Generic-code → concrete locale map (browser quirks)
    var CANONICAL_MAP = {
        'es-419': 'es-MX',
        'es': 'es-MX',
        'pt': 'pt-BR',
        'zh': 'zh-CN',
        'zh-Hans': 'zh-CN',
        'zh-Hant': 'zh-CN',
        'en': 'en-US',
        'en-GB': 'en-US',
        'en-AU': 'en-US',
        'en-CA': 'en-US',
        'fr': 'fr-FR',
        'fr-CA': 'fr-FR',
        'de': 'de-DE',
        'de-AT': 'de-DE',
        'de-CH': 'de-DE',
        'ja': 'ja-JP',
        'ru': 'ru-RU',
        'it': 'it-IT',
        'pl': 'pl-PL',
        'ar': 'ar-SA',
        'ko': 'ko-KR',
        'hi': 'hi-IN',
        'id': 'id-ID'
    };

    // Native-name display for the language selector
    var LANG_NAMES = {
        'es-ES': 'Español (ES)',
        'es-MX': 'Español (MX)',
        'en-US': 'English',
        'pt-BR': 'Português (BR)',
        'fr-FR': 'Français',
        'de-DE': 'Deutsch',
        'ja-JP': '日本語',
        'ru-RU': 'Русский',
        'zh-CN': '中文',
        'it-IT': 'Italiano',
        'pl-PL': 'Polski',
        'ar-SA': 'العربية',
        'ko-KR': '한국어',
        'hi-IN': 'हिन्दी',
        'id-ID': 'Bahasa Indonesia'
    };

    var translations = null;
    var activeLocale = null;

    /* ----------------------------------------------------------------------
       Locale detection
       ---------------------------------------------------------------------- */

    function getQueryLang() {
        try {
            var qs = new URLSearchParams(window.location.search);
            var q = qs.get('lang');
            return q ? q.trim() : null;
        } catch (e) {
            return null;
        }
    }

    function getStoredLang() {
        try {
            return localStorage.getItem(STORAGE_KEY);
        } catch (e) {
            return null;
        }
    }

    function setStoredLang(locale) {
        try {
            localStorage.setItem(STORAGE_KEY, locale);
        } catch (e) {
            /* storage disabled — ignore */
        }
    }

    function canonicalize(locale) {
        if (!locale) return FALLBACK;
        if (CANONICAL_MAP[locale]) return CANONICAL_MAP[locale];
        if (SUPPORTED.indexOf(locale) !== -1) return locale;
        // Try base language match (e.g. "fr-BE" → "fr" → "fr-FR")
        var base = locale.split('-')[0];
        if (CANONICAL_MAP[base]) return CANONICAL_MAP[base];
        var match = SUPPORTED.filter(function (l) {
            return l.indexOf(base + '-') === 0;
        });
        if (match.length) return match[0];
        return FALLBACK;
    }

    function detectLocale() {
        // Priority: ?lang param → localStorage → navigator → fallback
        var q = getQueryLang();
        if (q) {
            var resolved = canonicalize(q);
            setStoredLang(resolved);
            return resolved;
        }
        var stored = getStoredLang();
        if (stored && SUPPORTED.indexOf(stored) !== -1) return stored;

        var browser = navigator.language || navigator.userLanguage || FALLBACK;
        return canonicalize(browser);
    }

    /* ----------------------------------------------------------------------
       JSON loading
       ---------------------------------------------------------------------- */

    function fetchLocale(locale) {
        return fetch('/locales/landing-' + locale + '.json', { credentials: 'same-origin' })
            .then(function (res) {
                if (!res.ok) return null;
                return res.json();
            })
            .catch(function () {
                return null;
            });
    }

    function lookup(obj, key) {
        if (!obj || !key) return null;
        var parts = key.split('.');
        var cur = obj;
        for (var i = 0; i < parts.length; i++) {
            if (cur == null || typeof cur !== 'object') return null;
            cur = cur[parts[i]];
        }
        return (typeof cur === 'string') ? cur : null;
    }

    /* ----------------------------------------------------------------------
       DOM application
       ---------------------------------------------------------------------- */

    function applyTextContent(el, value) {
        // Allow rich text only for keys ending in _html
        var key = el.getAttribute('data-i18n') || '';
        if (key.indexOf('_html') !== -1 || /<\w+/.test(value)) {
            el.innerHTML = value;
        } else {
            el.textContent = value;
        }
    }

    function applyToElements(root) {
        if (!translations) return;
        var els = root.querySelectorAll('[data-i18n]');
        for (var i = 0; i < els.length; i++) {
            var el = els[i];
            var key = el.getAttribute('data-i18n');
            var value = lookup(translations, key);
            if (value != null) applyTextContent(el, value);
        }

        var attrEls = root.querySelectorAll('[data-i18n-attr]');
        for (var j = 0; j < attrEls.length; j++) {
            var aEl = attrEls[j];
            var spec = aEl.getAttribute('data-i18n-attr');
            // spec format: "alt:key.path,aria-label:other.key"
            var pairs = spec.split(',');
            for (var k = 0; k < pairs.length; k++) {
                var pair = pairs[k].split(':');
                if (pair.length !== 2) continue;
                var attrName = pair[0].trim();
                var attrKey = pair[1].trim();
                var attrVal = lookup(translations, attrKey);
                if (attrVal != null) aEl.setAttribute(attrName, attrVal);
            }
        }
    }

    function applyMetaTags() {
        if (!translations) return;
        var titleEl = document.querySelector('title[data-i18n]');
        if (titleEl) {
            var tKey = titleEl.getAttribute('data-i18n');
            var tVal = lookup(translations, tKey);
            if (tVal) {
                titleEl.textContent = tVal;
                document.title = tVal;
            }
        }
        var metas = document.querySelectorAll('meta[data-i18n]');
        for (var i = 0; i < metas.length; i++) {
            var m = metas[i];
            var key = m.getAttribute('data-i18n');
            var val = lookup(translations, key);
            if (val) m.setAttribute('content', val);
        }
    }

    function setDocumentLang(locale) {
        document.documentElement.lang = locale;
        document.documentElement.dir = (locale && locale.indexOf('ar') === 0) ? 'rtl' : 'ltr';
    }

    /* ----------------------------------------------------------------------
       Language selector (built into topbar)
       ---------------------------------------------------------------------- */

    function buildLanguageSelector() {
        var topbarInner = document.querySelector('.topbar-inner');
        if (!topbarInner) return;
        if (document.getElementById('lang-select')) return; // already built

        var wrap = document.createElement('div');
        wrap.className = 'lang-switcher';

        var select = document.createElement('select');
        select.id = 'lang-select';
        select.className = 'lang-select';
        select.setAttribute('aria-label', 'Cambiar idioma');

        for (var i = 0; i < SUPPORTED.length; i++) {
            var code = SUPPORTED[i];
            var opt = document.createElement('option');
            opt.value = code;
            opt.textContent = LANG_NAMES[code] || code;
            opt.className = 'lang-option';
            select.appendChild(opt);
        }
        select.value = activeLocale || FALLBACK;

        select.addEventListener('change', function () {
            var choice = select.value;
            setStoredLang(choice);
            loadAndApply(choice).then(function () {
                select.value = activeLocale;
            });
        });

        wrap.appendChild(select);
        topbarInner.appendChild(wrap);
    }

    function updateSelectorValue() {
        var sel = document.getElementById('lang-select');
        if (sel && activeLocale) sel.value = activeLocale;
    }

    /* ----------------------------------------------------------------------
       Public flow
       ---------------------------------------------------------------------- */

    function loadAndApply(requestedLocale) {
        var locale = canonicalize(requestedLocale || detectLocale());

        return fetchLocale(locale).then(function (data) {
            if (!data && locale !== FALLBACK) {
                // Try fallback silently
                return fetchLocale(FALLBACK).then(function (fb) {
                    if (fb) {
                        translations = fb;
                        activeLocale = FALLBACK;
                    }
                    return commit();
                });
            }
            if (data) {
                translations = data;
                activeLocale = locale;
            }
            return commit();
        });
    }

    function commit() {
        if (!translations) return false;
        setDocumentLang(activeLocale);
        applyMetaTags();
        applyToElements(document);
        updateSelectorValue();
        return true;
    }

    function init() {
        // Build selector first so it has a stable place in the DOM even before
        // translations are applied — its labels live in fixed code, not JSON.
        buildLanguageSelector();
        loadAndApply();
    }

    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', init);
    } else {
        init();
    }

    // Expose minimal API
    window.LandingI18n = {
        setLocale: function (locale) {
            var resolved = canonicalize(locale);
            setStoredLang(resolved);
            return loadAndApply(resolved);
        },
        getLocale: function () { return activeLocale; },
        getSupported: function () { return SUPPORTED.slice(); }
    };
})();
