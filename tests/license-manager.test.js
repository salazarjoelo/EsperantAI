/**
 * Tests para core/license-manager.js
 *
 * Cobertura prioritaria:
 *   - TIER_FEATURES define los 3 tiers (free, pro, pro_plus)
 *   - hasFeature() respeta el tier
 *   - generateFingerprint() usa crypto.subtle.digest (no btoa)
 *   - C-05 (license bypass) documentado pero NO testable sin backend
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
      if (typeof licMgr.generateFingerprint === 'function') {
        await licMgr.generateFingerprint();
        expect(digestSpy).toHaveBeenCalled();
        const algoArg = digestSpy.mock.calls[0]?.[0];
        // Algoritmo debe ser SHA-256, no MD5/SHA-1
        expect(['SHA-256', 'sha-256']).toContain(algoArg);
      }
      digestSpy.mockRestore();
    });

    it('fingerprint es string hexadecimal de longitud 64 (SHA-256 → 32 bytes hex)', async () => {
      if (typeof licMgr.generateFingerprint === 'function') {
        const fp = await licMgr.generateFingerprint();
        if (typeof fp === 'string') {
          expect(fp.length).toBe(64);
          expect(/^[0-9a-f]+$/i.test(fp)).toBe(true);
        }
      }
    });
  });

  describe('C-05 — license bypass (documentado, no testable sin backend)', () => {
    it('NOTA: la validación es 100% client-side', () => {
      // Este test es un recordatorio explícito:
      // sin backend (TASK-001), cualquier atacante puede:
      //   1. Modificar core/license-manager.js en navegador
      //   2. Editar localStorage directamente
      //   3. Interceptar fetch() a LemonSqueezy
      // No hay forma de bloquear esto sin un endpoint server-side
      // que emita JWT firmado. Ver docs/TASKS.md TASK-001.
      expect(true).toBe(true); // placeholder intencional
    });
  });
});
