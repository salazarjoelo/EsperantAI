/**
 * Helper para cargar archivos JS del core/ que usan `window` globals
 * (no son módulos ES). Lee el archivo, lo evalúa en el contexto de jsdom,
 * y deja los símbolos disponibles en `window.<Name>`.
 *
 * El código del repo es vanilla JS con IIFE pattern y `window.X = X`. No tiene
 * exports. Esta función permite testearlo sin modificar el código.
 */
import { readFileSync } from 'node:fs';
import path from 'node:path';

const REPO_ROOT = path.resolve(import.meta.dirname, '..', '..');

export function loadWindowScript(relativePath) {
  const fullPath = path.join(REPO_ROOT, relativePath);
  const src = readFileSync(fullPath, 'utf-8');
  // Eval en el contexto global de jsdom (window === globalThis en jsdom)
  // Usamos Function constructor para no contaminar el scope del test directamente.
  const fn = new Function(src);
  fn.call(globalThis);
}
