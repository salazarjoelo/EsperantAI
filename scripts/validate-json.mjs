#!/usr/bin/env node
/**
 * Valida que todos los archivos JSON del proyecto son válidos.
 * Falla con exit code 1 si encuentra un JSON malformado.
 * Usado por CI y por `npm run validate-json`.
 */
import { readdirSync, readFileSync, statSync } from 'node:fs';
import { join, relative } from 'node:path';
import { fileURLToPath } from 'node:url';
import { dirname } from 'node:path';

const __dirname = dirname(fileURLToPath(import.meta.url));
const ROOT = join(__dirname, '..');

const TARGETS = ['locales', 'docs', 'tests'];
const SKIP_DIRS = new Set(['node_modules', '.git', 'libs', 'models', '.vps-work']);

function* walkJson(dir) {
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
      yield* walkJson(full);
    } else if (name.endsWith('.json')) {
      yield full;
    }
  }
}

let exitCode = 0;
let okCount = 0;
let errCount = 0;

// 1) Locales (siempre obligatorios)
const localesDir = join(ROOT, 'locales');
for (const file of walkJson(localesDir)) {
  const rel = relative(ROOT, file);
  try {
    JSON.parse(readFileSync(file, 'utf-8'));
    console.log(`OK  ${rel}`);
    okCount++;
  } catch (e) {
    console.error(`ERR ${rel}: ${e.message}`);
    errCount++;
    exitCode = 1;
  }
}

// 2) package.json
try {
  JSON.parse(readFileSync(join(ROOT, 'package.json'), 'utf-8'));
  console.log('OK  package.json');
  okCount++;
} catch (e) {
  console.error(`ERR package.json: ${e.message}`);
  errCount++;
  exitCode = 1;
}

console.log('');
console.log(`Total: ${okCount} OK, ${errCount} con error`);
process.exit(exitCode);
