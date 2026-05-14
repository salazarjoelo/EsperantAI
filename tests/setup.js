// Setup global para Vitest + jsdom
// Mocks de APIs de navegador que el código usa pero jsdom no provee.

import { beforeEach, vi } from 'vitest';

// crypto.subtle.digest no existe en jsdom — fake con un hash determinista
// para que los tests que llaman a generateFingerprint() no exploten.
if (!globalThis.crypto) globalThis.crypto = {};
if (!globalThis.crypto.subtle) globalThis.crypto.subtle = {};
if (!globalThis.crypto.subtle.digest) {
  globalThis.crypto.subtle.digest = async (algo, buf) => {
    // Hash sintético: SHA-256 simulado con longitud correcta (32 bytes).
    // No es real, solo para que el código que espera ArrayBuffer no falle.
    const arr = new Uint8Array(32);
    const view = new Uint8Array(buf);
    for (let i = 0; i < arr.length; i++) {
      arr[i] = view[i % view.length] ^ (i * 31);
    }
    return arr.buffer;
  };
}

if (!globalThis.crypto.randomUUID) {
  globalThis.crypto.randomUUID = () => {
    return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, (c) => {
      const r = Math.random() * 16 | 0;
      const v = c === 'x' ? r : (r & 0x3 | 0x8);
      return v.toString(16);
    });
  };
}

// fetch para los tests de license-manager (mockeado por test individual)
if (!globalThis.fetch) {
  globalThis.fetch = vi.fn();
}

// performance.now ya existe en jsdom pero algunos tests lo mockean
// — los tests específicos lo controlan con vi.useFakeTimers()

beforeEach(() => {
  // Reset localStorage entre tests
  if (globalThis.localStorage && typeof globalThis.localStorage.clear === 'function') {
    globalThis.localStorage.clear();
  }
  if (globalThis.sessionStorage && typeof globalThis.sessionStorage.clear === 'function') {
    globalThis.sessionStorage.clear();
  }
});
