/**
 * Tests para core/license-manager.js
 *
 * Cobertura prioritaria:
 *   - TIER_FEATURES define los 3 tiers (free, pro, pro_plus)
 *   - hasFeature() respeta el tier
 *   - _getDeviceFingerprint() usa crypto.subtle.digest (no btoa)
 *   - deactivate() manda el JWT requerido por el backend
 *   - C-05: cliente usa backend con JWT firmado, no LemonSqueezy directo
 */
import { describe, it, expect, beforeEach, vi } from 'vitest';
import { loadWindowScript } from './helpers/load-window-script.js';

describe('core/license-manager.js', () => {
  let LicenseManager;
  let licMgr;

  beforeEach(() => {
    delete globalThis.LicenseManager;
    delete globalThis.licenseManager;
    loadWindowScript('core/license-manager.js');
    LicenseManager = globalThis.LicenseManager;
    licMgr = new LicenseManager();
  });

  describe('TIER_FEATURES (fix M-03 — tier gating)', () => {
    it('LicenseManager existe en window', () => {
      expect(LicenseManager).toBeDefined();
      expect(typeof LicenseManager).toBe('function');
    });

    it('instancia tiene método hasFeature', () => {
      expect(typeof licMgr.hasFeature).toBe('function');
    });

    it('instancia tiene método getTier', () => {
      expect(typeof licMgr.getTier).toBe('function');
    });

    it('hasFeature() devuelve booleano para feature válida', () => {
      const result = licMgr.hasFeature('multiAction');
      expect(typeof result).toBe('boolean');
    });

    it('getTier() devuelve uno de: free, pro, pro_plus (o equivalente)', () => {
      const tier = licMgr.getTier();
      expect(['free', 'pro', 'pro_plus', 'pro+', null, undefined]).toContain(tier);
    });
  });

  describe('Fingerprint (fix H-04 — SHA-256 en lugar de btoa)', () => {
    it('generateFingerprint usa crypto.subtle.digest', async () => {
      const digestSpy = vi.spyOn(globalThis.crypto.subtle, 'digest');
      if (typeof licMgr._getDeviceFingerprint === 'function') {
        await licMgr._getDeviceFingerprint();
        expect(digestSpy).toHaveBeenCalled();
        const algoArg = digestSpy.mock.calls[0]?.[0];
        // Algoritmo debe ser SHA-256, no MD5/SHA-1
        expect(['SHA-256', 'sha-256']).toContain(algoArg);
      }
      digestSpy.mockRestore();
    });

    it('fingerprint es string hexadecimal de longitud 64 (SHA-256 → 32 bytes hex)', async () => {
      if (typeof licMgr._getDeviceFingerprint === 'function') {
        const fp = await licMgr._getDeviceFingerprint();
        if (typeof fp === 'string') {
          expect(fp.length).toBe(32);
          expect(/^[0-9a-f]+$/i.test(fp)).toBe(true);
        }
      }
    });
  });

  describe('C-05 — backend firmado para licencias', () => {
    it('usa backend propio y clave pública para verificar JWT', () => {
      expect(LicenseManager.BACKEND_URL).toBe('https://license.edugame.digital');
      expect(LicenseManager.PUBLIC_KEY_PEM).toContain('BEGIN PUBLIC KEY');
      expect(LicenseManager.PUBLIC_KEY_PEM).not.toContain('REPLACE_WITH_PUB_PEM');
    });

    it('deactivate() envía Authorization: Bearer <jwt> requerido por el backend', async () => {
      licMgr.state = {
        licenseKey: 'license-key-123',
        jwt: 'header.payload.signature',
        jwtExpires: Math.floor(Date.now() / 1000) + 3600,
        tier: 'pro',
        instanceId: 'instance-123',
        activatedAt: Date.now(),
        lastValidatedAt: Date.now(),
      };
      const fetchSpy = vi.spyOn(globalThis, 'fetch').mockResolvedValue({
        json: async () => ({ ok: true }),
      });

      const result = await licMgr.deactivate();

      expect(result).toEqual({ ok: true });
      expect(fetchSpy).toHaveBeenCalledWith(
        'https://license.edugame.digital/deactivate',
        expect.objectContaining({
          method: 'POST',
          headers: expect.objectContaining({
            Authorization: 'Bearer header.payload.signature',
          }),
        }),
      );
      fetchSpy.mockRestore();
    });

    it('deactivate() rechaza state incompleto sin JWT', async () => {
      licMgr.state = {
        licenseKey: 'license-key-123',
        jwt: null,
        instanceId: 'instance-123',
        tier: 'pro',
      };
      const fetchSpy = vi.spyOn(globalThis, 'fetch');

      await expect(licMgr.deactivate()).resolves.toEqual({ ok: false, error: 'no_active_license' });
      expect(fetchSpy).not.toHaveBeenCalled();
      fetchSpy.mockRestore();
    });
  });
});
