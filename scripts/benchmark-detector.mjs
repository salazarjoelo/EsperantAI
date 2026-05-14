/**
 * EsperantAI Detector Benchmark — DS-303
 *
 * Mide latencia (P50, P95, P99) y FPS del detector Human.js
 * en main-thread mode (Node.js, backend WASM).
 *
 * Worker mode requiere browser con OffscreenCanvas (stub aquí).
 *
 * Uso:
 *   node scripts/benchmark-detector.mjs --frames 100 --resolution 640x480
 *   node scripts/benchmark-detector.mjs --frames 100 --resolution 1280x720
 *
 * Output:
 *   stderr → tabla markdown con resultados
 *   stdout → JSON con métricas detalladas
 *
 * Requisitos:
 *   npm install @vladmandic/human @napi-rs/canvas
 *   npm install @tensorflow/tfjs-core @tensorflow/tfjs-converter @tensorflow/tfjs-backend-wasm @tensorflow/tfjs-backend-cpu
 */

'use strict';

import { createCanvas } from '@napi-rs/canvas';
import * as tf from '@tensorflow/tfjs-core';
import '@tensorflow/tfjs-converter';
import '@tensorflow/tfjs-backend-wasm';
import '@tensorflow/tfjs-backend-cpu';
import path from 'path';
import fs from 'fs';
import { fileURLToPath } from 'url';
import { createRequire } from 'module';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const require = createRequire(import.meta.url);
const ROOT = path.resolve(__dirname, '..');
const WASM_DIST = path.join(ROOT, 'node_modules', '@tensorflow', 'tfjs-backend-wasm', 'dist');

// Set WASM binary path before anything
process.env.TF_WASM_BINARY_PATH = path.join(WASM_DIST, 'tfjs-backend-wasm-simd.wasm');

// ── Parse args ──────────────────────────────────────────────────────────
function parseArgs() {
  const args = process.argv.slice(2);
  let frames = 100;
  let width = 640;
  let height = 480;

  for (let i = 0; i < args.length; i++) {
    if (args[i] === '--frames' && i + 1 < args.length) {
      frames = parseInt(args[++i], 10);
    }
    if (args[i] === '--resolution' && i + 1 < args.length) {
      const parts = args[++i].split('x');
      width = parseInt(parts[0], 10);
      height = parseInt(parts[1] || parts[0], 10);
    }
  }

  return { frames, width, height };
}

// ── Helpers ──────────────────────────────────────────────────────────────
function percentile(sorted, p) {
  if (sorted.length === 0) return 0;
  const idx = Math.ceil((p / 100) * sorted.length) - 1;
  return sorted[Math.max(0, Math.min(idx, sorted.length - 1))];
}

// ── Synthetic image tensor ───────────────────────────────────────────────
function createFaceTensor(tfInst, width, height) {
  const rawData = new Uint8Array(width * height * 3);
  const cx = width / 2;
  const cy = height / 2;
  const rx = width * 0.15;
  const ry = height * 0.25;

  for (let y = 0; y < height; y++) {
    for (let x = 0; x < width; x++) {
      const idx = (y * width + x) * 3;
      rawData[idx] = 128;
      rawData[idx + 1] = 128;
      rawData[idx + 2] = 128;
      const dx = x - cx;
      const dy = y - cy;
      if ((dx * dx) / (rx * rx) + (dy * dy) / (ry * ry) < 1) {
        rawData[idx] = 255;
        rawData[idx + 1] = 219;
        rawData[idx + 2] = 172;
      }
    }
  }
  return tfInst.tensor4d(rawData, [1, height, width, 3]);
}

// ── Fetch override for file:// model loading ────────────────────────────
function setupFetchOverride() {
  const originalFetch = globalThis.fetch;
  globalThis.fetch = async (url) => {
    const urlStr = (typeof url === 'string' ? url : url.toString());
    if (!urlStr.startsWith('file:///')) return originalFetch(url);
    const fp = decodeURIComponent(urlStr).replace('file:///', '').replace(/\//g, path.sep);
    const data = fs.readFileSync(fp);
    const isJson = path.extname(fp) === '.json';
    const body = isJson ? JSON.parse(data.toString()) : data;
    return {
      ok: true, status: 200, statusText: 'OK', url: urlStr,
      headers: { get: () => null, forEach: () => {} },
      json: async () => body,
      arrayBuffer: async () => data.buffer,
      text: async () => data.toString(),
    };
  };
}

// ── Load Human WASM variant (bypasses require→human.node.js→tfjs-node) ──
function loadHumanWasm() {
  const humanPath = path.join(ROOT, 'node_modules', '@vladmandic', 'human', 'dist', 'human.node-wasm.js');
  return require(humanPath);
}

// ── Main-thread benchmark ───────────────────────────────────────────────
async function benchmarkMainThread({ frames, width, height }) {
  const results = [];
  const modelsDir = 'file:///' + ROOT.replace(/\\/g, '/') + '/models/';
  const wasmDir = WASM_DIST.replace(/\\/g, '/') + '/';

  const config = {
    backend: 'wasm',
    modelBasePath: modelsDir,
    wasmPath: wasmDir,
    warmup: 'none',
    async: false,
    debug: false,
    filter: { enabled: false, return: false },
    face: {
      enabled: true,
      detector: { modelPath: 'blazeface.json', rotation: false, return: false, minConfidence: 0.15, maxDetected: 1 },
      mesh: { enabled: true, modelPath: 'facemesh.json' },
      iris: { enabled: false },
      emotion: { enabled: false },
      description: { enabled: false },
      attention: { enabled: false },
    },
    body: { enabled: false },
    hand: { enabled: false },
    gesture: { enabled: false },
    segmentation: { enabled: false },
  };

  const humanWasm = loadHumanWasm();
  const detector = new humanWasm.Human(config);
  const tensor = createFaceTensor(tf, width, height);

  try {
    await detector.load();
    // Warmup
    await detector.detect(tensor);
    // Measured runs
    for (let i = 0; i < frames; i++) {
      const start = performance.now();
      await detector.detect(tensor);
      results.push(performance.now() - start);
    }
  } finally {
    tf.dispose(tensor);
  }

  return results;
}

// ── Worker benchmark (stub — requires browser) ──────────────────────────
async function benchmarkWorker({ width, height }) {
  return {
    note: 'Worker mode no disponible en Node.js. Requiere browser con OffscreenCanvas.',
    results: [],
  };
}

// ── Main ────────────────────────────────────────────────────────────────
async function main() {
  const args = parseArgs();
  const { frames, width, height } = args;

  console.error('');
  console.error('╔════════════════════════════════════════════════════╗');
  console.error('║  EsperantAI Detector Benchmark — DS-303           ║');
  console.error('╚════════════════════════════════════════════════════╝');
  console.error('');
  console.error(`  Frames:     ${frames}`);
  console.error(`  Resolution: ${width}×${height}`);
  console.error(`  Date:       ${new Date().toISOString()}`);
  console.error(`  Hardware:   i5-11400H / 32GB DDR4 / Windows 11`);
  console.error(`  Backend:    WASM (SIMD singlethreaded, CPU only)`);
  console.error('');

  // Setup
  setupFetchOverride();
  await tf.ready();
  await tf.setBackend('wasm');
  console.error(`  TensorFlow backend: ${tf.getBackend()}`);
  console.error('');

  // ── Main-thread ──
  console.error('▶ Benchmarking main-thread mode...');
  console.error('');
  const mtResults = await benchmarkMainThread({ frames, width, height });

  if (mtResults.length === 0) {
    console.error('  ERROR: No results from main-thread benchmark');
    process.exit(1);
  }

  const mtSorted = [...mtResults].sort((a, b) => a - b);
  const mtP50 = Math.round(percentile(mtSorted, 50) * 10) / 10;
  const mtP95 = Math.round(percentile(mtSorted, 95) * 10) / 10;
  const mtP99 = Math.round(percentile(mtSorted, 99) * 10) / 10;
  const mtAvgMs = mtSorted.reduce((a, b) => a + b, 0) / mtSorted.length;
  const mtFps = mtAvgMs > 0 ? Math.round(1000 / mtAvgMs) : 0;

  // ── Worker (stub) ──
  const wr = await benchmarkWorker({ width, height });

  // ── Output table (stderr) ──
  console.error('');
  console.error('  Results:');
  console.error('');
  console.error('  | Mode        | P50 (ms) | P95 (ms) | P99 (ms) | FPS | Dropped |');
  console.error('  |-------------|---------:|---------:|---------:|----:|--------:|');
  console.error(
    `  | main-thread | ${String(mtP50).padStart(8)} | ${String(mtP95).padStart(8)} | ${String(mtP99).padStart(8)} | ${String(mtFps).padStart(3)} |       — |`
  );
  console.error(
    `  | worker      | ${'N/A'.padStart(8)} | ${'N/A'.padStart(8)} | ${'N/A'.padStart(8)} | ${'N/A'.padStart(3)} |     N/A |`
  );
  console.error('');
  if (wr.note) {
    console.error(`  ℹ ${wr.note}`);
  }

  // ── Output JSON (stdout) ──
  const output = {
    'main-thread': {
      p50: mtP50,
      p95: mtP95,
      p99: mtP99,
      fps: mtFps,
      samples: frames,
      resolution: `${width}×${height}`,
    },
    worker: { note: 'Requiere browser con OffscreenCanvas' },
    metadata: {
      hardware: 'i5-11400H / 32GB DDR4 / Windows 11',
      backend: 'wasm (CPU, SIMD singlethreaded)',
      humanVersion: '3.3.6',
      tfjsVersion: '4.22.0',
      date: new Date().toISOString(),
    },
  };

  process.stdout.write(JSON.stringify(output, null, 2) + '\n');
}

main().catch((err) => {
  console.error('FATAL:', err.message);
  console.error(err.stack?.substring(0, 500));
  process.exit(1);
});
