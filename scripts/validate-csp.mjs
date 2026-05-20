#!/usr/bin/env node
/**
 * Audita los CSP headers en los HTML del repo.
 * Fase 1 (esta): solo WARNINGS — reporta 'unsafe-inline' y scripts/styles inline
 *                pero NO falla. Sirve para tracking de progreso de TASK-105.
 * Fase 2 (futura): FALLA si encuentra 'unsafe-inline' o script/style inline sin nonce.
 */
import { readFileSync } from 'node:fs';
import { join, relative } from 'node:path';
import { fileURLToPath } from 'node:url';
import { dirname } from 'node:path';
import { readdirSync, statSync } from 'node:fs';

const __dirname = dirname(fileURLToPath(import.meta.url));
const ROOT = join(__dirname, '..');

const SKIP_DIRS = new Set(['node_modules', '.git', 'libs', 'models', '.vps-work', 'dist']);

function* walkHtml(dir) {
  let entries;
  try {
    entries = readdirSync(dir);
  } catch {
    return;
  }
  for (const name of entries) {
    if (SKIP_DIRS.has(name)) continue;
    const full = join(dir, name);
    let stat;
    try {
      stat = statSync(full);
    } catch {
      continue;
    }
    if (stat.isDirectory()) {
      yield* walkHtml(full);
    } else if (name.endsWith('.html') || name.endsWith('.htm')) {
      yield full;
    }
  }
}

let warningCount = 0;
let unsafeInlineCount = 0;
let inlineScriptCount = 0;
let inlineStyleCount = 0;
let inlineStyleAttrCount = 0;

const FAIL_ON_FINDINGS = process.env.CSP_STRICT === '1';

for (const file of walkHtml(ROOT)) {
  const rel = relative(ROOT, file);
  const content = readFileSync(file, 'utf-8');

  // CSP unsafe-inline en meta http-equiv
  if (/<meta[^>]+http-equiv=["']Content-Security-Policy["'][^>]*unsafe-inline/i.test(content)) {
    console.warn(`WARN ${rel}: meta CSP contiene 'unsafe-inline'`);
    unsafeInlineCount++;
    warningCount++;
  }

  // <script>...</script> sin src (script inline)
  const scriptInlineMatches = [...content.matchAll(/<script\b(?![^>]*\bsrc=)[^>]*>[\s\S]*?<\/script>/gi)]
    .map(match => match[0])
    .filter(block => !/\btype=["']application\/ld\+json["']/i.test(block));
  if (scriptInlineMatches.length > 0) {
    const n = scriptInlineMatches.length;
    console.warn(`WARN ${rel}: ${n} bloque(s) <script> inline sin src`);
    inlineScriptCount += n;
    warningCount += n;
  }

  // <style>...</style> inline
  const styleInlineMatches = content.match(/<style\b[^>]*>[\s\S]*?<\/style>/gi);
  if (styleInlineMatches) {
    const n = styleInlineMatches.length;
    console.warn(`WARN ${rel}: ${n} bloque(s) <style> inline`);
    inlineStyleCount += n;
    warningCount += n;
  }

  // style="..." inline
  const styleAttrMatches = content.match(/\bstyle\s*=\s*["'][^"']*["']/gi);
  if (styleAttrMatches) {
    const n = styleAttrMatches.length;
    console.warn(`WARN ${rel}: ${n} atributo(s) style inline`);
    inlineStyleAttrCount += n;
    warningCount += n;
  }

  // onclick=, onerror=, onload= inline
  const onAttrMatches = content.match(/\bon[a-z]+\s*=\s*["'][^"']*["']/gi);
  if (onAttrMatches) {
    const n = onAttrMatches.length;
    console.warn(`WARN ${rel}: ${n} atributo(s) on* inline (onclick/onerror/etc.)`);
    warningCount += n;
  }
}

console.log('');
console.log(`Resumen CSP audit:`);
console.log(`  unsafe-inline en meta:     ${unsafeInlineCount}`);
console.log(`  <script> inline sin src:   ${inlineScriptCount}`);
console.log(`  <style> inline:            ${inlineStyleCount}`);
console.log(`  style="" inline:           ${inlineStyleAttrCount}`);
console.log(`  Total warnings:            ${warningCount}`);
console.log('');
console.log('Fase 1 actual: solo reporta. Set CSP_STRICT=1 para fallar (Fase 2).');

if (FAIL_ON_FINDINGS && warningCount > 0) {
  process.exit(1);
}
process.exit(0);
