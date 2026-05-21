#!/usr/bin/env node
/**
 * Verifica HTTP 200 para las URLs declaradas en .deploy-targets.json.
 * Uso normal despues de publicar: npm run check:deploy
 */
import { readFileSync } from 'node:fs';
import { join } from 'node:path';
import { fileURLToPath } from 'node:url';
import { dirname } from 'node:path';

const ROOT = join(dirname(fileURLToPath(import.meta.url)), '..');
const manifest = JSON.parse(readFileSync(join(ROOT, '.deploy-targets.json'), 'utf-8'));
const baseUrl = process.env.DEPLOY_BASE_URL || manifest.base_url;

if (!baseUrl) {
  console.error('ERR falta base_url en .deploy-targets.json');
  process.exit(1);
}

const failures = [];

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
console.log(`Deploy target check OK: ${(manifest.urls || []).length} URL(s)`);
