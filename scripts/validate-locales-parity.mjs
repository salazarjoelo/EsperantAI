#!/usr/bin/env node
/**
 * Valida paridad estructural de los locales contra en-US.json.
 *
 * Para cada locale:
 *   - Mismo conjunto de keys que en-US (cero missing, cero extra)
 *   - Cada string preserva los placeholders {x} de en-US
 *   - _meta tiene language, code, rtl, completion, translator
 *   - completion coincide con el número real de leaves
 *   - Strings no son idénticas a en-US (no quedó sin traducir)
 *     — excepción: app.title, _meta.code, valores Latin-only como
 *       "Twitch", "YouTube Live", "Kick", emojis, números
 *
 * Por defecto: warning sin fallar (modo audit).
 * Con LOCALE_STRICT=1: falla con exit code 1 si hay missing keys.
 *
 * Usado por:
 *   - npm run validate-locales         (warning)
 *   - CI con LOCALE_STRICT=1           (gate de TASK-107)
 */
import { readFileSync, readdirSync } from 'node:fs';
import { join, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';

const __dirname = dirname(fileURLToPath(import.meta.url));
const ROOT = join(__dirname, '..');
const LOCALES = join(ROOT, 'locales');
const STRICT = process.env.LOCALE_STRICT === '1';

/** Recursively flatten nested object into Map<dotted.key, value>. Skips _meta. */
function flatten(obj, prefix = '', out = new Map()) {
  for (const [k, v] of Object.entries(obj)) {
    if (k === '_meta') continue;
    const key = prefix ? `${prefix}.${k}` : k;
    if (v && typeof v === 'object' && !Array.isArray(v)) {
      flatten(v, key, out);
    } else {
      out.set(key, v);
    }
  }
  return out;
}

/** Extract placeholder names like {tier}, {count} from a string. */
function placeholders(s) {
  if (typeof s !== 'string') return [];
  const m = s.match(/\{[a-zA-Z_][a-zA-Z0-9_]*\}/g);
  return m ? [...new Set(m)].sort() : [];
}

/** True if value looks like content that legitimately stays in English/Latin. */
function legitimatelyUntranslated(value) {
  if (typeof value !== 'string') return true;
  const t = value.trim();
  if (t === '') return true;
  // Pure ASCII alphanumeric brand/platform names
  if (/^[A-Za-z0-9 .+/\-_:!?&()]+$/.test(t) && t.length <= 30) return true;
  // Pure punctuation/symbols
  if (/^[\W_]+$/.test(t)) return true;
  return false;
}

// === Load baseline ===
const enRaw = JSON.parse(readFileSync(join(LOCALES, 'en-US.json'), 'utf-8'));
const enFlat = flatten(enRaw);
const enKeys = new Set(enFlat.keys());

// Keys whose value, by design, is the same in every locale.
// Brand names, technical aeronautical/3D terms ("Yaw", "Pitch", "Roll"),
// debug format strings, and Unicode-only symbol strings.
const KEYS_ALWAYS_EQUAL = new Set([
  'app.title',
  'platforms.twitch',
  'platforms.youtube',
  'platforms.kick',
  'platforms.trovo',
  'platforms.facebook',
  'metrics.yaw_label',     // "Yaw (←/→)" — aeronautical term, universal
  'metrics.pitch_label',   // "Pitch (↑/↓)" — aeronautical term, universal
  'metrics.roll_label',    // "Roll (tilt)" — aeronautical term, universal
  'diagnostic.video_info', // debug format string, intentionally untranslated
]);

console.log(`Baseline en-US.json: ${enKeys.size} leaves\n`);
console.log(`Mode: ${STRICT ? 'STRICT (CI gate)' : 'AUDIT (warning only)'}\n`);

let hardFail = 0;
const reports = [];

for (const file of readdirSync(LOCALES).sort()) {
  if (!file.endsWith('.json') || file === 'en-US.json') continue;
  const locale = file.replace(/\.json$/, '');
  const data = JSON.parse(readFileSync(join(LOCALES, file), 'utf-8'));
  const flat = flatten(data);
  const keys = new Set(flat.keys());

  const missing = [...enKeys].filter(k => !keys.has(k));
  const extra = [...keys].filter(k => !enKeys.has(k));

  // Placeholder integrity
  const placeholderErrors = [];
  for (const [k, v] of flat) {
    if (!enFlat.has(k)) continue;
    const expected = placeholders(enFlat.get(k));
    const actual = placeholders(v);
    if (JSON.stringify(expected) !== JSON.stringify(actual)) {
      placeholderErrors.push({ key: k, expected, actual });
    }
  }

  // Untranslated strings (value identical to en-US for a non-trivial string)
  const untranslated = [];
  for (const [k, v] of flat) {
    if (!enFlat.has(k)) continue;
    if (KEYS_ALWAYS_EQUAL.has(k)) continue;
    const enVal = enFlat.get(k);
    if (typeof v === 'string' && v === enVal && !legitimatelyUntranslated(enVal)) {
      untranslated.push(k);
    }
  }

  // _meta sanity
  const meta = data._meta || {};
  const metaWarn = [];
  if (!meta.language) metaWarn.push('missing _meta.language');
  if (!meta.code) metaWarn.push('missing _meta.code');
  else if (meta.code !== locale) metaWarn.push(`_meta.code ${JSON.stringify(meta.code)} ≠ filename ${locale}`);
  if (typeof meta.rtl !== 'boolean') metaWarn.push('missing _meta.rtl (boolean)');
  if (typeof meta.completion === 'number' && meta.completion !== keys.size) {
    metaWarn.push(`_meta.completion=${meta.completion} but actual leaves=${keys.size}`);
  }

  const ok = missing.length === 0 && extra.length === 0 && placeholderErrors.length === 0;
  const symbol = ok ? '✓' : '✗';
  const summary = `${symbol} ${locale}: ${keys.size} leaves, ${missing.length} missing, ${extra.length} extra, ${placeholderErrors.length} bad placeholders, ${untranslated.length} untranslated`;
  console.log(summary);

  if (STRICT && (missing.length > 0 || extra.length > 0 || placeholderErrors.length > 0)) {
    hardFail++;
  }

  reports.push({ locale, missing, extra, placeholderErrors, untranslated, metaWarn });
}

// Detailed report
console.log('\n=== Detailed report ===\n');
for (const r of reports) {
  if (r.missing.length === 0 && r.extra.length === 0 && r.placeholderErrors.length === 0 && r.untranslated.length === 0 && r.metaWarn.length === 0) {
    continue;
  }
  console.log(`--- ${r.locale} ---`);
  if (r.metaWarn.length) {
    for (const w of r.metaWarn) console.log(`  meta: ${w}`);
  }
  if (r.missing.length) {
    console.log(`  missing (${r.missing.length}):`);
    for (const k of r.missing.slice(0, 10)) console.log(`    - ${k}`);
    if (r.missing.length > 10) console.log(`    ... and ${r.missing.length - 10} more`);
  }
  if (r.extra.length) {
    console.log(`  extra (not in en-US) (${r.extra.length}):`);
    for (const k of r.extra) console.log(`    + ${k}`);
  }
  if (r.placeholderErrors.length) {
    console.log(`  placeholder mismatches (${r.placeholderErrors.length}):`);
    for (const e of r.placeholderErrors.slice(0, 5)) {
      console.log(`    ${e.key}: expected ${JSON.stringify(e.expected)}, got ${JSON.stringify(e.actual)}`);
    }
    if (r.placeholderErrors.length > 5) console.log(`    ... and ${r.placeholderErrors.length - 5} more`);
  }
  if (r.untranslated.length) {
    console.log(`  untranslated (${r.untranslated.length}) — value identical to en-US:`);
    for (const k of r.untranslated.slice(0, 5)) console.log(`    ~ ${k}`);
    if (r.untranslated.length > 5) console.log(`    ... and ${r.untranslated.length - 5} more`);
  }
  console.log('');
}

if (STRICT && hardFail > 0) {
  console.error(`\nSTRICT mode: ${hardFail} locale(s) have missing/extra keys or bad placeholders.`);
  process.exit(1);
}

process.exit(0);
