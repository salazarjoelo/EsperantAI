/* ============================================================================
 * EsperantAI — License Manager
 *
 * Validación de license keys contra LemonSqueezy License API (pública).
 * NO requiere servidor propio.
 *
 * Modelo: sin tier gratuito, sin trial. El usuario activa license al primer
 * inicio. Sin license válida → la app no permite uso.
 *
 * Docs: https://docs.lemonsqueezy.com/api/license-api
 * ========================================================================== */

'use strict';

const LICENSE_STORAGE_KEY = 'esperantai-license-v1';
const LS_API_BASE = 'https://api.lemonsqueezy.com/v1';
const REVALIDATE_INTERVAL_MS = 7 * 24 * 60 * 60 * 1000; // 7 días
const OFFLINE_GRACE_MS = 30 * 24 * 60 * 60 * 1000;     // 30 días offline antes de bloquear

class LicenseManager {
    constructor() {
        this.state = this._loadState();
        this.listeners = [];
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
            valid: false,
            customerId: null,
            customerEmail: null,
            productName: null,
            activatedAt: null,
            lastValidatedAt: null,
            instanceId: null
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

    /**
     * Fingerprint del dispositivo para identificar instalación.
     */
    async _getDeviceFingerprint() {
        const parts = [
            navigator.userAgent,
            navigator.language,
            navigator.platform,
            screen.width + 'x' + screen.height,
            new Date().getTimezoneOffset()
        ].join('|');
        try {
            const hashBuffer = await crypto.subtle.digest('SHA-256', new TextEncoder().encode(parts));
            const hashArray = Array.from(new Uint8Array(hashBuffer));
            return hashArray.map(b => b.toString(16).padStart(2, '0')).join('').slice(0, 32);
        } catch {
            // Fallback for insecure contexts
            return btoa(parts).slice(0, 32);
        }
    }

    /**
     * Activa license contra LemonSqueezy.
     * @returns {{ok: boolean, error?: string, customerEmail?: string}}
     */
    async activate(licenseKey) {
        if (!licenseKey || licenseKey.length < 10) {
            return { ok: false, error: 'Invalid license key format' };
        }
        const fingerprint = await this._getDeviceFingerprint();
        try {
            const res = await fetch(`${LS_API_BASE}/licenses/activate`, {
                method: 'POST',
                headers: { 'Accept': 'application/json', 'Content-Type': 'application/x-www-form-urlencoded' },
                body: new URLSearchParams({
                    license_key: licenseKey,
                    instance_name: `EsperantAI-${fingerprint}`
                })
            });
            const data = await res.json();
            if (!res.ok || !data.activated) {
                return { ok: false, error: data.error || `Activation failed (${res.status})` };
            }
            this.state = {
                licenseKey,
                valid: true,
                customerId: data.meta?.customer_id,
                customerEmail: data.meta?.customer_email,
                productName: data.meta?.product_name,
                activatedAt: Date.now(),
                lastValidatedAt: Date.now(),
                instanceId: data.instance?.id
            };
            this._saveState();
            return { ok: true, customerEmail: this.state.customerEmail };
        } catch (e) {
            console.error('License activation error:', e);
            return { ok: false, error: 'Network error during activation' };
        }
    }

    /**
     * Validate la license al inicio + cada 7 días.
     * Offline grace 30 días.
     */
    async validate() {
        if (!this.state.licenseKey || !this.state.instanceId) {
            this.state.valid = false;
            this._saveState();
            return false;
        }
        try {
            const res = await fetch(`${LS_API_BASE}/licenses/validate`, {
                method: 'POST',
                headers: { 'Accept': 'application/json', 'Content-Type': 'application/x-www-form-urlencoded' },
                body: new URLSearchParams({
                    license_key: this.state.licenseKey,
                    instance_id: this.state.instanceId
                })
            });
            const data = await res.json();
            const valid = !!(res.ok && data.valid);
            this.state.valid = valid;
            this.state.lastValidatedAt = Date.now();
            this._saveState();
            return valid;
        } catch (e) {
            // Offline grace period
            const lastOk = this.state.lastValidatedAt || 0;
            const offlineOk = (Date.now() - lastOk) < OFFLINE_GRACE_MS && this.state.valid;
            console.warn('License validation offline; grace period:', offlineOk);
            return offlineOk;
        }
    }

    async deactivate() {
        if (!this.state.licenseKey || !this.state.instanceId) return false;
        try {
            await fetch(`${LS_API_BASE}/licenses/deactivate`, {
                method: 'POST',
                headers: { 'Accept': 'application/json', 'Content-Type': 'application/x-www-form-urlencoded' },
                body: new URLSearchParams({
                    license_key: this.state.licenseKey,
                    instance_id: this.state.instanceId
                })
            });
        } catch {}
        this.state = this._defaultState();
        this._saveState();
        return true;
    }

    /**
     * Re-validation cada 7 días en background.
     */
    startBackgroundRevalidation() {
        if (!this.state.licenseKey) return;
        const elapsed = Date.now() - (this.state.lastValidatedAt || 0);
        if (elapsed > REVALIDATE_INTERVAL_MS) this.validate();
        setInterval(() => this.validate(), REVALIDATE_INTERVAL_MS);
    }

    // ===== Public API =====

    isValid() {
        return this.state.valid === true;
    }

    customerEmail() {
        return this.state.customerEmail || null;
    }

    licenseKey() {
        return this.state.licenseKey || null;
    }

    onChange(fn) { this.listeners.push(fn); }
    _notify() { this.listeners.forEach(fn => { try { fn(this.state); } catch {} }); }
}

window.LicenseManager = LicenseManager;
window.licenseManager = new LicenseManager();
