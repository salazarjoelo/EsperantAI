#!/usr/bin/env node
/**
 * Construye la carpeta estatica que debe publicarse en edugame.digital.
 *
 * Mapping canonico:
 *   landing.html -> /
 *   index.html   -> /app/
 *
 * Al final valida que cada URL listada en .deploy-targets.json exista en _site.
 */
import {
  copyFileSync,
  cpSync,
  existsSync,
  mkdirSync,
  readFileSync,
  rmSync,
  statSync,
} from 'node:fs';
import { dirname, join, normalize } from 'node:path';
import { fileURLToPath } from 'node:url';

const ROOT = join(dirname(fileURLToPath(import.meta.url)), '..');
const OUT = join(ROOT, '_site');
const MANIFEST = join(ROOT, '.deploy-targets.json');

function ensureParent(dest) {
  mkdirSync(dirname(dest), { recursive: true });
}

function copyFile(srcRel, destRel = srcRel, optional = false) {
  const src = join(ROOT, srcRel);
  const dest = join(OUT, destRel);
  if (!existsSync(src)) {
    if (optional) return;
    throw new Error(`Falta archivo requerido: ${srcRel}`);
  }
  ensureParent(dest);
  copyFileSync(src, dest);
}

function copyDir(srcRel, destRel = srcRel) {
  const src = join(ROOT, srcRel);
  const dest = join(OUT, destRel);
  if (!existsSync(src) || !statSync(src).isDirectory()) {
    throw new Error(`Falta carpeta requerida: ${srcRel}`);
  }
  cpSync(src, dest, { recursive: true });
}

function targetToFilePath(urlPath) {
  let path = urlPath;
  if (path === '/') path = '/index.html';
  if (path.endsWith('/')) path += 'index.html';
  return normalize(path.replace(/^\/+/, ''));
}

function validateDeployTargets() {
  const manifest = JSON.parse(readFileSync(MANIFEST, 'utf-8'));
  const missing = [];
  for (const url of manifest.urls || []) {
    const localPath = targetToFilePath(url);
    const fullPath = join(OUT, localPath);
    if (!existsSync(fullPath)) missing.push(`${url} -> _site/${localPath}`);
  }
  if (missing.length) {
    console.error('ERR deploy targets faltantes:');
    for (const item of missing) console.error(`  - ${item}`);
    process.exit(1);
  }
  console.log(`OK deploy targets: ${(manifest.urls || []).length} URL(s) cubiertas en _site`);
}

rmSync(OUT, { recursive: true, force: true });
mkdirSync(OUT, { recursive: true });

// Landing publica.
copyFile('landing.html', 'index.html');
copyFile('robots.txt');
copyFile('sitemap.xml');
copyFile('llms.txt');
copyFile('hot-sale.json', 'hot-sale.json', true);
copyFile('LICENSE.txt', 'LICENSE.txt', true);
copyFile('README.md', 'README.md', true);
copyDir('css', 'css');
copyDir('js', 'js');
copyDir('assets', 'assets');
copyDir('docs', 'docs');

// App bajo /app/.
copyFile('index.html', 'app/index.html');
copyFile('app.js', 'app/app.js');
copyFile('oauth-callback.html', 'app/oauth-callback.html');
copyFile('LICENSE.txt', 'app/LICENSE.txt', true);
copyDir('libs', 'app/libs');
copyDir('core', 'app/core');
copyDir('adapters', 'app/adapters');
copyDir('platforms', 'app/platforms');
copyDir('locales', 'app/locales');
copyDir('models', 'app/models');
copyDir('css', 'app/css');
copyDir('js', 'app/js');
copyDir('assets', 'app/assets');

validateDeployTargets();
console.log(`OK deploy build: ${OUT}`);
