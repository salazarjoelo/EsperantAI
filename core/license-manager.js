/* ============================================================================
 * EsperantAI — License Manager (TASK-001: backend de licencias firmadas)
 *
 * Cambio 2026-05-14: la validación ya NO se hace directamente contra
 * LemonSqueezy. Ahora pasa por el backend de Joel:
 *   - URL: https://license.edugame.digital/verify
 *   - Backend valida server-side con LEMONSQUEEZY_API_KEY (secreto)
 *   - Emite JWT firmado con Ed25519
 *   - Cliente verifica JWT con clave pública embebida (PUBLIC_KEY_PEM abajo)
 *
 * Por qué: el modelo anterior (cliente → LemonSqueezy directo) era bypasseable
 * editando el JS o localStorage (hallazgo C-05 auditoría). El JWT firmado NO
 * se puede falsificar sin la clave privada que vive solo en el VPS de Joel.
 *
 * Si el atacante modifica este archivo para skip la verificación: igual rompe
 * la firma. El JWT sigue siendo inválido cuando Joel hace un upgrade del
 * cliente y el atacante no recibe esos updates.
 *
 * Modelo: sin tier gratuito, sin trial. Sin license válida → app NO arranca.
 * ========================================================================== */

'use strict';

const LICENSE_BACKEND_URL = 'https://license.edugame.digital';
const LICENSE_STORAGE_KEY = 'esperantai-license-v2';
const REVALIDATE_INTERVAL_MS = 7 * 24 * 60 * 60 * 1000;  // 7 días
const OFFLINE_GRACE_MS = 7 * 24 * 60 * 60 * 1000;        // 7 días offline antes de bloquear (Z-SEC-07: reducido de 30 a 7)
const JWT_AUDIENCE = 'esperantai-client';
const JWT_ISSUER = 'license.edugame.digital';

/**
 * Clave pública Ed25519 del backend de Joel.
 * REEMPLAZAR con el contenido de backend/pub.pem tras ejecutar:
 *   cd backend && node scripts/generate-keypair.js
 *
 * El cliente verifica que los JWT vengan firmados por la clave privada del
 * backend. Si se cambia la clave pública aquí, los JWT existentes dejan de
 * validar y los usuarios deben re-verificar online.
 */
const PUBLIC_KEY_PEM = `-----BEGIN PUBLIC KEY-----
MCowBQYDK2VwAyEAiiFaUOEG7ys6VrnfG0L7i/PVXMGs30XrtnL9hcdnDT4=
-----END PUBLIC KEY-----`;

const TIER_FEATURES = {
    free: {
        maxTriggers: 5,
        adapters: ['obs'],
        platforms: ['twitch'],
        handGestures: false,
        comboTriggers: false,
        multiAction: false,
        streamElements: false,
        gazeTracking: false,
        emotionDetection: false,
        watermark: true,
        calibration: false,
        profiles: false,
        triggerHistory: false
    },
    pro: {
        maxTriggers: 18,
        adapters: ['obs', 'streamlabs', 'vmix', 'prism', 'xsplit'],
        platforms: ['twitch', 'youtube', 'kick', 'trovo'],
        handGestures: true,
        comboTriggers: false,
        multiAction: true,
        streamElements: false,
        gazeTracking: true,
        emotionDetection: true,
        watermark: false,
        calibration: true,
        profiles: true,
        triggerHistory: true
    },
    pro_plus: {
        maxTriggers: -1,
        adapters: ['obs', 'streamlabs', 'vmix', 'prism', 'xsplit'],
        platforms: ['twitch', 'youtube', 'kick', 'trovo', 'streamelements'],
        handGestures: true,
        comboTriggers: true,
        multiAction: true,
        streamElements: true,
        gazeTracking: true,
        emotionDetection: true,
        watermark: false,
        calibration: true,
        profiles: true,
        triggerHistory: true
    }
};

class LicenseManager {
    constructor() {
        this.state = this._loadState();
        this.listeners = [];
        this._operationLock = false;
        this._publicKeyPromise = null;
    }

    _loadState() {
        try {
            const raw = localStorage.getItem(LICENSE_STORAGE_KEY);
            if (!raw) return this._defaultState();
            return JSON.parse(raw);
        } catch {
            return this._defaultState();
        }
    }

    _defaultState() {
        return {
            licenseKey: null,
            jwt: null,                  // JWT firmado por el backend
            jwtExpires: 0,              // Unix epoch seconds
            tier: 'free',
            instanceId: null,
            activatedAt: null,
            lastValidatedAt: 0,
        };
    }

    _saveState() {
        try {
            localStorage.setItem(LICENSE_STORAGE_KEY, JSON.stringify(this.state));
            this._notify();
        } catch (e) {
            console.warn('License state save failed:', e);
        }
    }

    // ─── Public key handling (Ed25519 via crypto.subtle) ──────────────────

    async _getPublicKey() {
        if (this._publicKeyPromise) return this._publicKeyPromise;
        if (PUBLIC_KEY_PEM.includes('REPLACE_WITH_PUB_PEM')) {
            console.error('[license-manager] PUBLIC_KEY_PEM no fue reemplazado. Imposible verificar JWT.');
            return null;
        }
        this._publicKeyPromise = (async () => {
            const pemBody = PUBLIC_KEY_PEM
                .replace(/-----BEGIN PUBLIC KEY-----/, '')
                .replace(/-----END PUBLIC KEY-----/, '')
                .replace(/\s+/g, '');
            const der = Uint8Array.from(atob(pemBody), c => c.charCodeAt(0));
            try {
                return await crypto.subtle.importKey(
                    'spki',
                    der.buffer,
                    { name: 'Ed25519' },
                    false,
                    ['verify']
                );
            } catch (e) {
                console.error('[license-manager] importKey failed (Ed25519 no soportado en este browser?):', e);
                return null;
            }
        })();
        return this._publicKeyPromise;
    }

    /**
     * Verifica un JWT firmado por el backend.
     * @returns {Promise<object|null>} payload del JWT si válido, null si no
     */
    async _verifyJWT(token) {
        if (!token || typeof token !== 'string') return null;
        const parts = token.split('.');
        if (parts.length !== 3) return null;

        const [headerB64, payloadB64, sigB64] = parts;

        // Header — debe ser EdDSA
        let header;
        try {
            header = JSON.parse(this._b64urlDecode(headerB64));
        } catch { return null; }
        if (header.alg !== 'EdDSA' && header.alg !== 'Ed25519') return null;

        // Payload
        let payload;
        try {
            payload = JSON.parse(this._b64urlDecode(payloadB64));
        } catch { return null; }

        // Issuer + audience + expiration
        const now = Math.floor(Date.now() / 1000);
        if (payload.iss !== JWT_ISSUER) return null;
        if (payload.aud !== JWT_AUDIENCE) return null;
        if (!payload.exp || payload.exp < now) return null;

        // Verificar firma
        const key = await this._getPublicKey();
        if (!key) return null;
        const signedData = new TextEncoder().encode(`${headerB64}.${payloadB64}`);
        const sigBytes = this._b64urlToBytes(sigB64);
        let valid;
        try {
            valid = await crypto.subtle.verify('Ed25519', key, sigBytes, signedData);
        } catch (e) {
            console.error('[license-manager] verify failed:', e);
            return null;
        }
        if (!valid) return null;
        return payload;
    }

    _b64urlDecode(str) {
        const pad = '='.repeat((4 - (str.length % 4)) % 4);
        const base64 = (str + pad).replace(/-/g, '+').replace(/_/g, '/');
        return atob(base64);
    }

    _b64urlToBytes(str) {
        const decoded = this._b64urlDecode(str);
        return Uint8Array.from(decoded, c => c.charCodeAt(0)).buffer;
    }

    // ─── Activate / verify against backend ────────────────────────────────

    /**
     * Activa license consultando al backend.
     * @returns {Promise<{ok: boolean, error?: string, tier?: string}>}
     */
    async activate(licenseKey) {
        if (this._operationLock) return { ok: false, error: 'in_progress' };
        this._operationLock = true;
        try {
            if (!licenseKey || licenseKey.trim().length < 10) {
                return { ok: false, error: 'invalid_format' };
            }
            const cleanKey = licenseKey.trim();
            const fingerprint = await this._getDeviceFingerprint();
            try {
                const res = await fetch(`${LICENSE_BACKEND_URL}/verify`, {
                    method: 'POST',
                    headers: { 'Accept': 'application/json', 'Content-Type': 'application/json' },
                    body: JSON.stringify({
                        license_key: cleanKey,
                        instance_name: `EsperantAI-${fingerprint}`,
                    }),
                });
                const data = await res.json();
                if (!data.ok) {
                    return { ok: false, error: data.error || 'invalid' };
                }
                // Verificar JWT antes de guardarlo
                const payload = await this._verifyJWT(data.token);
                if (!payload) {
                    return { ok: false, error: 'jwt_invalid' };
                }
                this.state = {
                    licenseKey: cleanKey,
                    jwt: data.token,
                    jwtExpires: payload.exp,
                    tier: data.tier || payload.tier || 'pro',
                    instanceId: payload.ls_instance || null,
                    activatedAt: Date.now(),
                    lastValidatedAt: Date.now(),
                };
                this._saveState();
                return { ok: true, tier: this.state.tier };
            } catch (e) {
                console.error('[license-manager] activate fetch failed:', e);
                return { ok: false, error: 'network_error' };
            }
        } finally {
            this._operationLock = false;
        }
    }

    /**
     * Valida el JWT actual. Si está cerca de expirar, intenta refrescar.
     * Si offline y dentro del grace period, mantiene válido.
     */
    async validate() {
        if (!this.state.licenseKey || !this.state.jwt) {
            this.state.tier = 'free';
            return false;
        }

        // Verificar JWT criptográficamente
        const payload = await this._verifyJWT(this.state.jwt);
        if (!payload) {
            // JWT inválido o expirado — intentar refrescar
            return await this._refresh();
        }

        // JWT válido. Si está por expirar (< 7 días) Y hay conexión, refrescar.
        const now = Math.floor(Date.now() / 1000);
        const expiresIn = payload.exp - now;
        if (expiresIn < REVALIDATE_INTERVAL_MS / 1000 && navigator.onLine) {
            // Refrescar pero NO bloquear si falla (JWT actual sigue válido)
            this._refresh().catch(() => {});
        }

        this.state.tier = payload.tier || 'pro';
        this.state.lastValidatedAt = Date.now();
        this._saveState();
        return true;
    }

    /**
     * Pide al backend un JWT nuevo.
     */
    async _refresh() {
        if (this._operationLock) return this.state.tier !== 'free';
        if (!navigator.onLine) {
            // Offline grace: el JWT puede haber expirado pero respetamos los 30 días
            const sinceValidated = Date.now() - this.state.lastValidatedAt;
            if (sinceValidated < OFFLINE_GRACE_MS) {
                return true; // Acepta provisionalmente
            }
            return false;
        }
        this._operationLock = true;
        try {
            const res = await fetch(`${LICENSE_BACKEND_URL}/verify`, {
                method: 'POST',
                headers: { 'Accept': 'application/json', 'Content-Type': 'application/json' },
                body: JSON.stringify({ license_key: this.state.licenseKey }),
            });
            const data = await res.json();
            if (!data.ok) {
                this.state.jwt = null;
                this.state.tier = 'free';
                this._saveState();
                return false;
            }
            const payload = await this._verifyJWT(data.token);
            if (!payload) return false;
            this.state.jwt = data.token;
            this.state.jwtExpires = payload.exp;
            this.state.tier = data.tier || 'pro';
            this.state.lastValidatedAt = Date.now();
            this._saveState();
            return true;
        } catch (e) {
            console.warn('[license-manager] refresh failed (network):', e);
            // Offline grace si dentro del periodo
            const sinceValidated = Date.now() - this.state.lastValidatedAt;
            return sinceValidated < OFFLINE_GRACE_MS;
        } finally {
            this._operationLock = false;
        }
    }

    async deactivate() {
        if (!this.state.licenseKey || !this.state.instanceId) {
            return { ok: false, error: 'no_active_license' };
        }
        try {
            const res = await fetch(`${LICENSE_BACKEND_URL}/deactivate`, {
                method: 'POST',
                headers: { 'Accept': 'application/json', 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    license_key: this.state.licenseKey,
                    instance_id: this.state.instanceId,
                }),
            });
            const data = await res.json();
            if (data.ok) {
                this.state = this._defaultState();
                this._saveState();
            }
            return data;
        } catch (e) {
            return { ok: false, error: 'network_error' };
        }
    }

    // ─── Fingerprint (anti-piratería suave + identificación de instance) ──

    async _getDeviceFingerprint() {
        const parts = [
            navigator.userAgent,
            navigator.language,
            navigator.platform,
            screen.width + 'x' + screen.height,
            new Date().getTimezoneOffset(),
        ].join('|');
        try {
            const hashBuffer = await crypto.subtle.digest('SHA-256', new TextEncoder().encode(parts));
            const hashArray = Array.from(new Uint8Array(hashBuffer));
            return hashArray.map(b => b.toString(16).padStart(2, '0')).join('').slice(0, 32);
        } catch {
            return btoa(parts).slice(0, 32);
        }
    }

    // ─── Public API consumida por app.js y core/* ─────────────────────────

    isValid() {
        return !!this.state.jwt && (this.state.jwtExpires * 1000) > Date.now();
    }

    getTier() {
        return this.state.tier || 'free';
    }

    getLicenseKey() {
        return this.state.licenseKey;
    }

    hasFeature(name) {
        const tier = this.getTier();
        const features = TIER_FEATURES[tier] || TIER_FEATURES.free;
        return !!features[name];
    }

    getFeatureLimit(name) {
        const tier = this.getTier();
        const features = TIER_FEATURES[tier] || TIER_FEATURES.free;
        return features[name] ?? 0;
    }

    on(event, fn) {
        this.listeners.push({ event, fn });
    }

    _notify() {
        this.listeners.forEach(l => {
            try { l.fn(this.state); } catch {}
        });
    }

    /**
     * Programa revalidación periódica de la licencia contra el backend.
     * Llamado desde app.js tras isValid() === true.
     * Si la licencia expira o se revoca durante la sesión, el siguiente
     * tick lo detecta y showLicenseLockout() se dispara via _notify().
     *
     * Fix Z-SEC-06: este método se llamaba desde app.js:31 pero no existía,
     * causando TypeError que crasheaba el bootstrap para usuarios de pago.
     */
    startBackgroundRevalidation() {
        // Limpiar timer previo si lo hubiera (re-arranque limpio)
        if (this._revalidationTimer) {
            clearInterval(this._revalidationTimer);
            this._revalidationTimer = null;
        }
        // 7 días en milisegundos. La validación es silenciosa: si falla red,
        // se respeta el grace period offline definido en validate().
        const INTERVAL_MS = 7 * 24 * 60 * 60 * 1000;
        this._revalidationTimer = setInterval(() => {
            this.validate().catch(err => {
                console.warn('[License] Background revalidation failed:', err);
            });
        }, INTERVAL_MS);
    }

    /** Detiene el timer de revalidación. Útil en teardown / logout. */
    stopBackgroundRevalidation() {
        if (this._revalidationTimer) {
            clearInterval(this._revalidationTimer);
            this._revalidationTimer = null;
        }
    }
}

LicenseManager.TIER_FEATURES = TIER_FEATURES;
LicenseManager.PUBLIC_KEY_PEM = PUBLIC_KEY_PEM;
LicenseManager.BACKEND_URL = LICENSE_BACKEND_URL;

window.LicenseManager = LicenseManager;
window.licenseManager = new LicenseManager();
