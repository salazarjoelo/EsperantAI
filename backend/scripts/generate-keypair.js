#!/usr/bin/env node
/**
 * Genera un par de claves Ed25519 para firmar JWTs.
 * Salida: priv.pem + pub.pem.
 *
 * Uso (solo una vez en el setup inicial del VPS):
 *   cd backend && node scripts/generate-keypair.js
 *
 * IMPORTANTE:
 *   - priv.pem va en el VPS, fuera del repo (chmod 600).
 *   - pub.pem se copia a core/license-manager.js como string embebido.
 *   - Cualquier rotación de claves invalida TODOS los JWTs en circulación
 *     (los usuarios reciben uno nuevo en su próximo /verify).
 */
import { generateKeyPair, exportPKCS8, exportSPKI } from 'jose';
import { writeFile } from 'node:fs/promises';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';

const __dirname = dirname(fileURLToPath(import.meta.url));
const ROOT = join(__dirname, '..');

const { publicKey, privateKey } = await generateKeyPair('EdDSA', { crv: 'Ed25519' });

const privPem = await exportPKCS8(privateKey);
const pubPem = await exportSPKI(publicKey);

await writeFile(join(ROOT, 'priv.pem'), privPem, { mode: 0o600 });
await writeFile(join(ROOT, 'pub.pem'), pubPem, { mode: 0o644 });

console.log('[+] priv.pem escrito (chmod 600).');
console.log('[+] pub.pem escrito.');
console.log('');
console.log('SIGUIENTE PASO:');
console.log('  1. Copia el contenido de pub.pem a core/license-manager.js como string PUBLIC_KEY_PEM');
console.log('  2. NUNCA comitees priv.pem (.gitignore ya lo excluye)');
console.log('  3. En el VPS, mueve priv.pem a /etc/esperantai/priv.pem con chmod 600 chown root:root');
