/* ============================================================================
 * EsperantAI — Gassho (🙏 prayer-hands) gesture detector
 *
 * Detecta el gesto 合掌 / 合十 / 합장 cuando el streamer junta las manos en
 * posición de oración / agradecimiento. THE courtesy gesture en CJK + SE Asia.
 *
 * Diseño completo en docs/CULTURAL_GESTURE_REVIEW.md sección 6.4 (autor: Z/GLM-4).
 * Heurística sobre los 21 landmarks de MediaPipe Hands (via Human.js).
 *
 * 6 checks secuenciales:
 *   1. Dos manos visibles con confianza ≥ 0.7 (una "left", otra "right")
 *   2. Fingertips proximales (al menos 4 de 5 pares < 0.07 normalizado)
 *   3. Palmas se enfrentan (dot product de normales < -0.3)
 *   4. Muñecas a misma altura (|delta Y| < 0.15)
 *   5. Manos centradas en el frame (|midX - 0.5| < 0.25)
 *   6. Hold ≥ 300ms (diferencia crítica vs clap, que dura 80-150ms)
 *
 * Accuracy esperada: ~85% true positive rate, <10% false positive rate.
 * ========================================================================== */

'use strict';

const GASSHO_CONFIG = {
    TIP_PROXIMITY_THRESHOLD: 0.07,
    MIN_CLOSE_TIPS: 4,
    PALM_NORMAL_DOT_MAX: -0.3,
    WRIST_Y_DELTA_MAX: 0.15,
    CENTER_X_MAX_OFFSET: 0.25,
    HAND_CONFIDENCE_MIN: 0.7,
    HOLD_MIN_MS: 300,
    HOLD_MAX_MS: 5000,
};

const FINGERTIP_IDS = [4, 8, 12, 16, 20]; // thumb, index, middle, ring, pinky tips

// Estado del detector — se resetea con resetGasshoState() en pause/destroy del detector.
let gasshoHoldStart = null;

/**
 * @param {Array} hands - Array de manos detectadas (Human.js result.hand[])
 * @param {number} now  - Timestamp actual (performance.now())
 * @returns {{ detected: boolean, confidence: number, holdMs: number }}
 */
function detectGassho(hands, now) {
    // === CHECK 1: dos manos visibles con confianza suficiente ===
    if (!hands || hands.length < 2) {
        gasshoHoldStart = null;
        return { detected: false, confidence: 0, holdMs: 0 };
    }

    let leftHand = null;
    let rightHand = null;
    for (const hand of hands) {
        const score = (hand.score !== undefined ? hand.score : hand.confidence) || 0;
        if (score < GASSHO_CONFIG.HAND_CONFIDENCE_MIN) continue;
        // Human.js labels hands as 'left' or 'right' (perspectiva de cámara, espejado).
        if (hand.label === 'left') leftHand = hand;
        else if (hand.label === 'right') rightHand = hand;
    }

    if (!leftHand || !rightHand) {
        gasshoHoldStart = null;
        return { detected: false, confidence: 0, holdMs: 0 };
    }

    const leftPts = leftHand.landmarks || leftHand.keypoints || leftHand.annotations;
    const rightPts = rightHand.landmarks || rightHand.keypoints || rightHand.annotations;
    if (!leftPts || !rightPts || leftPts.length < 21 || rightPts.length < 21) {
        gasshoHoldStart = null;
        return { detected: false, confidence: 0, holdMs: 0 };
    }

    // === CHECK 2: fingertip proximity ===
    let closeTips = 0;
    let totalTipDist = 0;
    for (const idx of FINGERTIP_IDS) {
        const a = leftPts[idx];
        const b = rightPts[idx];
        if (!a || !b) continue;
        const dx = (a[0] || 0) - (b[0] || 0);
        const dy = (a[1] || 0) - (b[1] || 0);
        const dz = (a[2] || 0) - (b[2] || 0);
        const dist = Math.sqrt(dx * dx + dy * dy + dz * dz);
        totalTipDist += dist;
        if (dist < GASSHO_CONFIG.TIP_PROXIMITY_THRESHOLD) closeTips++;
    }

    if (closeTips < GASSHO_CONFIG.MIN_CLOSE_TIPS) {
        gasshoHoldStart = null;
        return { detected: false, confidence: 0, holdMs: 0 };
    }

    // === CHECK 3: palm orientation — normales se enfrentan ===
    const leftNormal = computePalmNormal(leftPts);
    const rightNormal = computePalmNormal(rightPts);
    const leftMag = magnitude(leftNormal);
    const rightMag = magnitude(rightNormal);
    if (leftMag < 0.001 || rightMag < 0.001) {
        gasshoHoldStart = null;
        return { detected: false, confidence: 0, holdMs: 0 };
    }

    const dot = (leftNormal[0] * rightNormal[0]
                + leftNormal[1] * rightNormal[1]
                + leftNormal[2] * rightNormal[2]) / (leftMag * rightMag);

    if (dot > GASSHO_CONFIG.PALM_NORMAL_DOT_MAX) {
        gasshoHoldStart = null;
        return { detected: false, confidence: 0, holdMs: 0 };
    }

    // === CHECK 4: alineación vertical de muñecas ===
    const wristYDelta = Math.abs((leftPts[0][1] || 0) - (rightPts[0][1] || 0));
    if (wristYDelta > GASSHO_CONFIG.WRIST_Y_DELTA_MAX) {
        gasshoHoldStart = null;
        return { detected: false, confidence: 0, holdMs: 0 };
    }

    // === CHECK 5: posición centrada ===
    const midX = ((leftPts[0][0] || 0) + (rightPts[0][0] || 0)) / 2;
    if (Math.abs(midX - 0.5) > GASSHO_CONFIG.CENTER_X_MAX_OFFSET) {
        gasshoHoldStart = null;
        return { detected: false, confidence: 0, holdMs: 0 };
    }

    // === CHECK 6: hold time (300ms minimum) ===
    if (gasshoHoldStart === null) {
        gasshoHoldStart = now;
    }

    const holdMs = now - gasshoHoldStart;

    // Safety: reset si lleva demasiado tiempo (stuck state)
    if (holdMs > GASSHO_CONFIG.HOLD_MAX_MS) {
        gasshoHoldStart = now;
        return { detected: false, confidence: 0, holdMs: 0 };
    }

    // Confidence scoring (compuesto)
    const tipProximityScore = closeTips / 5;
    const avgTipDist = totalTipDist / 5;
    const closenessScore = Math.max(0, 1 - avgTipDist / GASSHO_CONFIG.TIP_PROXIMITY_THRESHOLD);
    const palmScore = Math.max(0, -dot);
    const alignmentScore = 1 - (wristYDelta / GASSHO_CONFIG.WRIST_Y_DELTA_MAX);

    const confidence = Math.min(1,
        (tipProximityScore * 0.35) +
        (closenessScore * 0.25) +
        (Math.min(palmScore, 1) * 0.25) +
        (alignmentScore * 0.15)
    );

    const detected = holdMs >= GASSHO_CONFIG.HOLD_MIN_MS;

    if (!detected) {
        return { detected: false, confidence, holdMs };
    }

    // Fire — resetear hold para evitar re-trigger sobre el mismo hold
    gasshoHoldStart = null;
    return { detected: true, confidence, holdMs };
}

/**
 * Resetea el estado interno. Llamar al destruir o pausar el detector.
 */
function resetGasshoState() {
    gasshoHoldStart = null;
}

// ─── Helpers de vectores (privados) ────────────────────────────────────────

function computePalmNormal(pts) {
    // pts: 21 landmarks de MediaPipe Hands
    // Normal = cross(MCP_middle - WRIST, MCP_index - MCP_pinky)
    const wrist = pts[0];
    const indexMCP = pts[5];
    const middleMCP = pts[9];
    const pinkyMCP = pts[17];

    const v1 = [
        (middleMCP[0] || 0) - (wrist[0] || 0),
        (middleMCP[1] || 0) - (wrist[1] || 0),
        (middleMCP[2] || 0) - (wrist[2] || 0),
    ];
    const v2 = [
        (indexMCP[0] || 0) - (pinkyMCP[0] || 0),
        (indexMCP[1] || 0) - (pinkyMCP[1] || 0),
        (indexMCP[2] || 0) - (pinkyMCP[2] || 0),
    ];
    return crossProduct(v1, v2);
}

function crossProduct(a, b) {
    return [
        a[1] * b[2] - a[2] * b[1],
        a[2] * b[0] - a[0] * b[2],
        a[0] * b[1] - a[1] * b[0],
    ];
}

function magnitude(v) {
    return Math.sqrt(v[0] * v[0] + v[1] * v[1] + v[2] * v[2]);
}

// Export al window (mantener consistencia con el patrón del repo: no ES modules)
window.detectGassho = detectGassho;
window.resetGasshoState = resetGasshoState;
window.GASSHO_CONFIG = GASSHO_CONFIG;
