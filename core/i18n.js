/* ============================================================================
 * EsperantAI — i18n system
 * Sistema de traducciones con auto-detección del locale del SO + fallback chain.
 * Carga JSON files de /locales/ dinámicamente.
 * ========================================================================== */

'use strict';

class I18n {
    constructor() {
        this.locale = null;
        this.fallbackLocale = 'en-US';
        this.translations = {};
        this.fallbackTranslations = {};
        this.rtl = false;
        this.listeners = [];
    }

    /**
     * Detecta el locale preferido del usuario.
     * Fuentes en orden: 1) localStorage user choice, 2) navigator.language, 3) en-US
     */
    detectLocale() {
        // 1. Override manual del usuario
        const saved = localStorage.getItem('esperantai-locale');
        if (saved) return saved;

        // 2. Navegador (refleja SO en mayoría de casos)
        const browserLocale = navigator.language || navigator.userLanguage || 'en-US';
        return browserLocale;
    }

    /**
     * Carga un locale. Si no existe el exacto, prueba el idioma base.
     * Siempre carga fallback (en-US) también.
     */
    async load(localeRequested = null) {
        // Canonicaliza locales genéricos antes de cualquier fetch
        // (ej: navigator.language='es-419' -> 'es-MX' que sí existe).
        const locale = this._canonicalizeLocale(localeRequested || this.detectLocale());

        // Carga siempre fallback primero
        if (!Object.keys(this.fallbackTranslations).length) {
            this.fallbackTranslations = await this._fetchJson(this.fallbackLocale);
        }

        // Intenta locale exacto
        let translations = await this._fetchJson(locale);

        // Si falla, intenta idioma base (ej: "es-MX" → "es-ES" → "es")
        if (!translations) {
            const baseLang = locale.split('-')[0];
            const candidates = await this._findLocaleByBaseLang(baseLang);
            for (const candidate of candidates) {
                translations = await this._fetchJson(candidate);
                if (translations) {
                    this.locale = candidate;
                    break;
                }
            }
        } else {
            this.locale = locale;
        }

        // Último fallback
        if (!translations) {
            translations = this.fallbackTranslations;
            this.locale = this.fallbackLocale;
        }

        this.translations = translations;
        this.rtl = translations?._meta?.rtl === true;

        // Aplicar dirección al DOM
        document.documentElement.lang = this.locale;
        document.documentElement.dir = this.rtl ? 'rtl' : 'ltr';

        this._notify();
        return this.locale;
    }

    async _fetchJson(locale) {
        try {
            const res = await fetch(`locales/${locale}.json`);
            if (!res.ok) return null;
            return await res.json();
        } catch {
            return null;
        }
    }

    async _findLocaleByBaseLang(baseLang) {
        // Lista canónica de locales soportados. Incluye hi-IN + id-ID que
        // se agregaron como fallbacks al inglés en 2026-05-15 con el manual web.
        const supported = [
            'en-US', 'es-ES', 'es-MX', 'pt-BR', 'fr-FR', 'de-DE',
            'ja-JP', 'ru-RU', 'zh-CN', 'it-IT', 'pl-PL', 'ar-SA', 'ko-KR',
            'hi-IN', 'id-ID'
        ];
        return supported.filter(l => l.startsWith(baseLang + '-'));
    }

    /**
     * Mapea locales genéricos del navegador a uno concreto que sí tenemos
     * en /locales/. Bug runtime detectado 2026-05-15: navegadores LATAM
     * devuelven "es-419" (Spanish Latin America genérico) y "es-419.json"
     * no existe -> 404 en cada page load.
     * Resolución: mapear "es-419" -> "es-MX" antes del fetch.
     */
    _canonicalizeLocale(locale) {
        if (!locale) return locale;
        const map = {
            'es-419': 'es-MX',    // Spanish Latin America genérico -> es-MX
            'es':     'es-MX',    // Spanish a secas -> es-MX (mercado principal Joel)
            'pt':     'pt-BR',
            'zh':     'zh-CN',
            'zh-Hans': 'zh-CN',
        };
        return map[locale] || locale;
    }

    /**
     * Traduce una key. Soporta interpolación: t('hello', {name: 'Joel'})
     * Key con dots: t('ui.connect') busca translations.ui.connect
     */
    t(key, params = {}, fallback = null) {
        const value = this._lookup(this.translations, key)
                   ?? this._lookup(this.fallbackTranslations, key)
                   ?? fallback
                   ?? key; // último fallback: la key misma

        if (typeof value !== 'string') return fallback || key;
        return this._interpolate(value, params);
    }

    _lookup(obj, key) {
        const parts = key.split('.');
        let cur = obj;
        for (const p of parts) {
            if (cur == null || typeof cur !== 'object') return null;
            cur = cur[p];
        }
        return cur;
    }

    _interpolate(str, params) {
        return str.replace(/\{(\w+)\}/g, (m, k) => (k in params ? params[k] : m));
    }

    setLocale(locale) {
        localStorage.setItem('esperantai-locale', locale);
        return this.load(locale);
    }

    getAvailableLocales() {
        return [
            { code: 'en-US', name: 'English', rtl: false },
            { code: 'es-ES', name: 'Español (España)', rtl: false },
            { code: 'es-MX', name: 'Español (México)', rtl: false },
            { code: 'pt-BR', name: 'Português (Brasil)', rtl: false },
            { code: 'fr-FR', name: 'Français', rtl: false },
            { code: 'de-DE', name: 'Deutsch', rtl: false },
            { code: 'ja-JP', name: '日本語', rtl: false },
            { code: 'ru-RU', name: 'Русский', rtl: false },
            { code: 'zh-CN', name: '中文', rtl: false },
            { code: 'it-IT', name: 'Italiano', rtl: false },
            { code: 'pl-PL', name: 'Polski', rtl: false },
            { code: 'ar-SA', name: 'العربية', rtl: true },
            { code: 'ko-KR', name: '한국어', rtl: false }
        ];
    }

    /**
     * Aplica traducciones a todos los elementos con data-i18n="key.path" del DOM.
     */
    applyToDom(root = document) {
        root.querySelectorAll('[data-i18n]').forEach(el => {
            const key = el.dataset.i18n;
            const translated = this.t(key);
            if (el.dataset.i18nAttr) {
                el.setAttribute(el.dataset.i18nAttr, translated);
            } else {
                el.textContent = translated;
            }
        });
        // Placeholders
        root.querySelectorAll('[data-i18n-placeholder]').forEach(el => {
            el.placeholder = this.t(el.dataset.i18nPlaceholder);
        });
        // Titles (tooltips)
        root.querySelectorAll('[data-i18n-title]').forEach(el => {
            el.title = this.t(el.dataset.i18nTitle);
        });
    }

    onChange(callback) {
        this.listeners.push(callback);
    }

    _notify() {
        this.listeners.forEach(fn => {
            try { fn(this.locale); } catch (e) { console.error(e); }
        });
    }
}

// Singleton global
window.i18n = new I18n();
