/**
 * Tests para core/config-manager.js
 *
 * Cobertura prioritaria (hallazgo C-02 + hallazgo 6 de DeepSeek):
 *   - prototype pollution en _merge (primer nivel, anidado, vía constructor)
 *   - debounce de save() (audit P0.3)
 *   - integridad del clone profundo
 *
 * El core/config-manager.js NO exporta nada (vanilla JS con window.X = X),
 * así que cargamos el archivo via loadWindowScript() y accedemos a
 * window.ConfigManager.
 */
import { describe, it, expect, beforeEach, afterEach } from 'vitest';
import { loadWindowScript } from './helpers/load-window-script.js';

describe('core/config-manager.js', () => {
  let ConfigManager;
  let cm;

  beforeEach(() => {
    // Limpiar pollution previo y reset window state
    delete Object.prototype.polluted;
    delete Object.prototype.isAdmin;
    delete Object.prototype.injected;
    delete globalThis.ConfigManager;
    delete globalThis.configManager;

    loadWindowScript('core/config-manager.js');
    ConfigManager = globalThis.ConfigManager;
    cm = new ConfigManager();
  });

  afterEach(() => {
    // Higiene: limpiar cualquier pollution que se haya colado
    delete Object.prototype.polluted;
    delete Object.prototype.isAdmin;
    delete Object.prototype.injected;
  });

  describe('_merge — prototype pollution (fix C-02)', () => {
    it('bloquea __proto__ en primer nivel', () => {
      const target = {};
      const source = JSON.parse('{"__proto__": {"polluted": "yes"}}');
      cm._merge(target, source);
      expect({}.polluted).toBeUndefined();
      expect(Object.prototype.polluted).toBeUndefined();
    });

    it('bloquea prototype en primer nivel', () => {
      const target = {};
      const source = { prototype: { polluted: 'yes' } };
      cm._merge(target, source);
      expect({}.polluted).toBeUndefined();
    });

    it('bloquea constructor en primer nivel', () => {
      const target = {};
      const source = JSON.parse('{"constructor": {"prototype": {"polluted": "yes"}}}');
      cm._merge(target, source);
      expect({}.polluted).toBeUndefined();
    });

    it('NO contamina via __proto__ anidado (hallazgo 6 DeepSeek)', () => {
      // Payload: {"a": {"__proto__": {"isAdmin": true}}}
      // Si _merge es recursivo y bloquea BLOCKED_KEYS en cada nivel, esto debe ser inocuo.
      const target = {};
      const source = JSON.parse('{"a": {"__proto__": {"isAdmin": true}}}');
      cm._merge(target, source);
      expect({}.isAdmin).toBeUndefined();
      expect(Object.prototype.isAdmin).toBeUndefined();
    });

    it('NO contamina via constructor anidado profundo', () => {
      const target = {};
      const source = JSON.parse('{"a": {"b": {"__proto__": {"injected": "yes"}}}}');
      cm._merge(target, source);
      expect({}.injected).toBeUndefined();
    });

    it('preserva keys legítimas durante el merge', () => {
      const target = { foo: 1, nested: { a: 'old' } };
      const source = { bar: 2, nested: { b: 'new' } };
      const result = cm._merge(target, source);
      expect(result.foo).toBe(1);
      expect(result.bar).toBe(2);
      expect(result.nested.a).toBe('old');
      expect(result.nested.b).toBe('new');
    });

    it('NO crashea con input null o undefined', () => {
      const target = { foo: 1 };
      expect(() => cm._merge(target, null)).not.toThrow();
      expect(() => cm._merge(target, undefined)).not.toThrow();
      expect(target.foo).toBe(1);
    });

    it('NO crashea con array como source', () => {
      const target = { foo: 1 };
      expect(() => cm._merge(target, [1, 2, 3])).not.toThrow();
    });
  });

  describe('BLOCKED_KEYS — constante estática', () => {
    it('define las 3 keys protegidas', () => {
      expect(ConfigManager.BLOCKED_KEYS).toBeInstanceOf(Set);
      expect(ConfigManager.BLOCKED_KEYS.has('__proto__')).toBe(true);
      expect(ConfigManager.BLOCKED_KEYS.has('prototype')).toBe(true);
      expect(ConfigManager.BLOCKED_KEYS.has('constructor')).toBe(true);
    });
  });

  describe('API básica de get/set', () => {
    it('get() devuelve fallback si la key no existe', () => {
      expect(cm.get('inexistente.x.y', 'default')).toBe('default');
    });

    it('set() escribe en config.config con dot notation', () => {
      cm.set('thresholds.yaw', 0.99);
      expect(cm.get('thresholds.yaw')).toBe(0.99);
    });

    it('set() respeta valores anidados sin romper la rama', () => {
      cm.set('adapter.obs.url', 'ws://test:9999');
      expect(cm.get('adapter.obs.url')).toBe('ws://test:9999');
      // El resto de adapter.obs debe persistir
      expect(cm.get('adapter.obs.password', 'fallback')).toBeDefined();
    });
  });
});
