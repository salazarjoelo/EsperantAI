#!/usr/bin/env node
/**
 * Verifica HTTP 200 para las URLs declaradas en .deploy-targets.json.
 * Uso normal despues de publicar: npm run check:deploy
 */
import { existsSync, readFileSync } from 'node:fs';
import { join, normalize } from 'node:path';
import { fileURLToPath } from 'node:url';
import { dirname } from 'node:path';
import { createHash } from 'node:crypto';

const ROOT = join(dirname(fileURLToPath(import.meta.url)), '..');
const manifest = JSON.parse(readFileSync(join(ROOT, '.deploy-targets.json'), 'utf-8'));
const baseUrl = process.env.DEPLOY_BASE_URL || manifest.base_url;
const compareLocal = process.argv.includes('--compare-local');
const outDir = join(ROOT, '_site');

if (!baseUrl) {
  console.error('ERR falta base_url en .deploy-targets.json');
  process.exit(1);
}

const failures = [];

function targetToFilePath(urlPath) {
  let path = urlPath;
  if (path === '/') path = '/index.html';
  if (path.endsWith('/')) path += 'index.html';
  return normalize(path.replace(/^\/+/, ''));
}

function sha256(bytes) {
  return createHash('sha256').update(bytes).digest('hex');
}

for (const path of manifest.urls || []) {
  const url = new URL(path, baseUrl).toString();
  try {
    const res = await fetch(url, {
      method: 'GET',
      redirect: 'manual',
      headers: {
        'User-Agent': 'EsperantAI deploy target checker',
      },
    });
    if (res.status !== 200) {
      failures.push(`${res.status} ${url}`);
      console.error(`ERR ${res.status} ${url}`);
    } else {
      if (compareLocal) {
        const localPath = join(outDir, targetToFilePath(path));
        if (!existsSync(localPath)) {
          failures.push(`LOCAL-MISSING ${path}`);
          console.error(`ERR LOCAL-MISSING ${path}`);
          continue;
        }
        const remoteBytes = Buffer.from(await res.arrayBuffer());
        const localBytes = readFileSync(localPath);
        const remoteHash = sha256(remoteBytes);
        const localHash = sha256(localBytes);
        if (remoteHash !== localHash) {
          failures.push(`HASH ${url}`);
          console.error(`ERR HASH ${url} local=${localHash.slice(0, 12)} remote=${remoteHash.slice(0, 12)}`);
          continue;
        }
      }
      console.log(`OK  ${url}`);
    }
  } catch (error) {
    failures.push(`ERR ${url}: ${error.message}`);
    console.error(`ERR ${url}: ${error.message}`);
  }
}

if (failures.length) {
  console.error('');
  console.error(`Deploy target check fallo: ${failures.length} URL(s)`);
  process.exit(1);
}

console.log('');
const suffix = compareLocal ? ' con hash local' : '';
console.log(`Deploy target check OK${suffix}: ${(manifest.urls || []).length} URL(s)`);
