/* ============================================================================
 * EsperantAI — Calibration Wizard
 * Guided first-run wizard to personalize head-gesture thresholds.
 * ========================================================================== */

'use strict';

class CalibrationWizard {
    constructor({ config, detector, i18n, licenseManager }) {
        this.config = config;
        this.detector = detector;
        this.i18n = i18n;
        this.licenseManager = licenseManager;
        this.overlay = document.getElementById('calibration-wizard-overlay');
        this.step = 0;
        this.active = false;
        this.collecting = false;
        this.captureTarget = 0;
        this.captureCount = 0;
        this.captureKind = null;
        this.samples = [];
        this.state = this._makeState();
        this.onApplied = null;
        this.onCancelled = null;
        this._boundFrameHandler = this._onDetectorFrame.bind(this);
        this.STORAGE_KEY = 'esperantai-calibration-complete-v1';
    }

    _makeState() {
        return {
            baseline: null,
            leftRight: null,
            pitchTilt: null,
            handGesture: null,
            thresholds: null
        };
    }

    isAvailable() {
        return !!(this.licenseManager?.hasFeature?.('calibration'));
    }

    hasCompletedBefore() {
        return localStorage.getItem(this.STORAGE_KEY) === '1';
    }

    markCompleted() {
        localStorage.setItem(this.STORAGE_KEY, '1');
    }

    open({ auto = false } = {}) {
        if (!this.overlay || !this.isAvailable()) return;
        this.active = true;
        this.auto = auto;
        this.step = 0;
        this.state = this._makeState();
        this.collecting = false;
        this.overlay.hidden = false;
        document.body.classList.add('modal-open');
        this.detector?.on?.('frame', this._boundFrameHandler);
        this.render();
    }

    close({ completed = false } = {}) {
        this.active = false;
        this.collecting = false;
        this.captureKind = null;
        this.captureCount = 0;
        this.samples = [];
        this.overlay.hidden = true;
        this.overlay.innerHTML = '';
        document.body.classList.remove('modal-open');
        this.detector?.off?.('frame', this._boundFrameHandler);
        if (completed) this.markCompleted();
        else if (typeof this.onCancelled === 'function') this.onCancelled();
    }

    next() {
        if (this.step < 5) {
            this.step += 1;
            this.render();
        }
    }

    prev() {
        if (this.step > 0) {
            this.step -= 1;
            this.render();
        }
    }

    startCapture(kind) {
        this.collecting = true;
        this.captureKind = kind;
        this.captureCount = 0;
        this.samples = [];
        const perKind = {
            baseline: 45,
            leftRight: 90,
            pitchTilt: 90,
            handCheck: 120
        };
        this.captureTarget = perKind[kind] || 60;
        this.render();
    }

    _onDetectorFrame(payload) {
        if (!this.active || !this.collecting) return;
        const result = payload?.result;
        const face = result?.face?.[0];
        if (this.captureKind === 'handCheck') {
            const gestures = result?.gesture || [];
            const found = this._extractSupportedGesture(gestures);
            if (found) {
                this.state.handGesture = found;
                this.collecting = false;
                this.render();
            }
            return;
        }
        if (!face?.rotation?.angle) return;
        const yaw = Number(face.rotation.angle.yaw || 0);
        const pitch = Number(face.rotation.angle.pitch || 0);
        const roll = Number(face.rotation.angle.roll || 0);
        const size = face.box ? Number(Math.max(face.box[2], face.box[3])) : null;
        this.samples.push({ yaw, pitch, roll, size });
        this.captureCount += 1;
        if (this.captureCount >= this.captureTarget) {
            this.collecting = false;
            this._finalizeCapture();
            this.render();
        } else {
            this._updateProgress();
        }
    }

    _finalizeCapture() {
        if (!this.samples.length) return;
        if (this.captureKind === 'baseline') {
            this.state.baseline = {
                yaw: this._avg(this.samples.map(s => s.yaw)),
                pitch: this._avg(this.samples.map(s => s.pitch)),
                roll: this._avg(this.samples.map(s => s.roll)),
                size: this._avg(this.samples.map(s => s.size).filter(v => v != null))
            };
        }
        if (this.captureKind === 'leftRight') {
            const baselineYaw = this.state.baseline?.yaw || 0;
            const yaws = this.samples.map(s => s.yaw);
            const minYaw = Math.min(...yaws);
            const maxYaw = Math.max(...yaws);
            this.state.leftRight = {
                leftRange: Math.abs(minYaw - baselineYaw),
                rightRange: Math.abs(maxYaw - baselineYaw),
                minYaw,
                maxYaw
            };
        }
        if (this.captureKind === 'pitchTilt') {
            const baselinePitch = this.state.baseline?.pitch || 0;
            const baselineRoll = this.state.baseline?.roll || 0;
            const pitches = this.samples.map(s => s.pitch);
            const rolls = this.samples.map(s => s.roll);
            const minPitch = Math.min(...pitches);
            const maxPitch = Math.max(...pitches);
            const minRoll = Math.min(...rolls);
            const maxRoll = Math.max(...rolls);
            this.state.pitchTilt = {
                upRange: Math.abs(minPitch - baselinePitch),
                downRange: Math.abs(maxPitch - baselinePitch),
                tiltRange: Math.max(Math.abs(minRoll - baselineRoll), Math.abs(maxRoll - baselineRoll)),
                minPitch,
                maxPitch,
                minRoll,
                maxRoll
            };
            this.state.thresholds = this._computeThresholds();
        }
    }

    _computeThresholds() {
        const baseline = this.state.baseline || { yaw: 0, pitch: 0, roll: 0 };
        const lr = this.state.leftRight || { leftRange: 0.18, rightRange: 0.18 };
        const pt = this.state.pitchTilt || { upRange: 0.18, downRange: 0.22, tiltRange: 0.22 };
        const safety = 0.60;
        const yawThreshold = this._clamp(Math.abs(baseline.yaw) + (Math.max(lr.leftRange, lr.rightRange) * safety), 0.08, 0.55);
        const pitchUp = this._clamp(baseline.pitch - Math.max(0.05, pt.upRange * safety), -0.45, -0.03);
        const pitchDown = this._clamp(baseline.pitch + Math.max(0.06, pt.downRange * safety), 0.05, 0.45);
        const roll = this._clamp(Math.abs(baseline.roll) + Math.max(0.08, pt.tiltRange * safety), 0.08, 0.55);
        return {
            yaw: this._round(yawThreshold),
            pitchUp: this._round(pitchUp),
            pitchDown: this._round(pitchDown),
            roll: this._round(roll)
        };
    }

    applyThresholds() {
        const thresholds = this.state.thresholds || this._computeThresholds();
        this.config.set('thresholds.yaw', thresholds.yaw);
        this.config.set('thresholds.pitchUp', thresholds.pitchUp);
        this.config.set('thresholds.pitchDown', thresholds.pitchDown);
        this.config.set('thresholds.roll', thresholds.roll);
        this.config.flush?.();
        if (typeof this.onApplied === 'function') this.onApplied(thresholds);
        this.close({ completed: true });
    }

    render() {
        if (!this.overlay) return;
        const t = (key, fb) => this.i18n?.t?.(key, {}, fb) || fb || key;
        const progress = ((this.step + 1) / 6) * 100;
        const canGoNext = this._canGoNext();
        const stepTitles = [
            t('calibration.steps.welcome_title', 'Calibration wizard'),
            t('calibration.steps.baseline_title', 'Step 1 · Baseline'),
            t('calibration.steps.left_right_title', 'Step 2 · Left and right range'),
            t('calibration.steps.pitch_tilt_title', 'Step 3 · Up/down and tilt range'),
            t('calibration.steps.hand_title', 'Step 4 · Hand check'),
            t('calibration.steps.confirm_title', 'Step 5 · Confirm your settings')
        ];
        let body = '';
        if (this.step === 0) body = this._renderWelcome(t);
        if (this.step === 1) body = this._renderCaptureStep(t, 'baseline');
        if (this.step === 2) body = this._renderCaptureStep(t, 'leftRight');
        if (this.step === 3) body = this._renderCaptureStep(t, 'pitchTilt');
        if (this.step === 4) body = this._renderCaptureStep(t, 'handCheck');
        if (this.step === 5) body = this._renderConfirm(t);

        this.overlay.innerHTML = `
            <div class="cw-backdrop"></div>
            <section class="cw-modal" role="dialog" aria-modal="true" aria-labelledby="cw-title" aria-describedby="cw-subtitle">
                <header class="cw-header">
                    <div>
                        <div class="cw-kicker">${t('calibration.kicker', 'Personalized setup')}</div>
                        <h2 id="cw-title">${stepTitles[this.step]}</h2>
                        <p id="cw-subtitle">${t('calibration.subtitle', 'We will personalize gesture sensitivity for your face and movement range.')}</p>
                    </div>
                    <button type="button" class="cw-close" id="cw-close" aria-label="${t('ui.close', 'Close')}">×</button>
                </header>
                <progress class="cw-progress" max="100" value="${progress}">${progress}%</progress>
                <div class="cw-step-body">${body}</div>
                <footer class="cw-footer">
                    <button type="button" class="secondary" id="cw-back" ${this.step === 0 ? 'disabled' : ''}>${t('calibration.back', 'Back')}</button>
                    <div class="cw-footer-right">
                        <button type="button" class="secondary" id="cw-skip">${this.step === 5 ? t('ui.close','Close') : t('calibration.skip', 'Skip for now')}</button>
                        ${this.step === 5
                            ? `<button type="button" id="cw-apply">${t('calibration.apply', 'Apply calibration')}</button>`
                            : `<button type="button" id="cw-next" ${canGoNext ? '' : 'disabled'}>${this.step === 0 ? t('calibration.start', 'Start') : t('calibration.next', 'Next')}</button>`}
                    </div>
                </footer>
            </section>
        `;
        const close = () => this.close({ completed: false });
        this.overlay.querySelector('#cw-close')?.addEventListener('click', close);
        this.overlay.querySelector('#cw-skip')?.addEventListener('click', close);
        this.overlay.querySelector('#cw-back')?.addEventListener('click', () => this.prev());
        this.overlay.querySelector('#cw-next')?.addEventListener('click', () => this.next());
        this.overlay.querySelector('#cw-apply')?.addEventListener('click', () => this.applyThresholds());
        this.overlay.querySelectorAll('[data-capture-kind]').forEach(btn => {
            btn.addEventListener('click', () => this.startCapture(btn.dataset.captureKind));
        });
        // focus primary
        const primary = this.overlay.querySelector('#cw-apply, #cw-next, [data-capture-kind], #cw-close');
        primary?.focus?.();
    }

    _renderWelcome(t) {
        return `
            <div class="cw-intro-grid">
                <div class="cw-card">
                    <h3>${t('calibration.what_you_will_do', 'What you will do')}</h3>
                    <ul>
                        <li>${t('calibration.intro_item_1', 'Hold a neutral center pose for two seconds.')}</li>
                        <li>${t('calibration.intro_item_2', 'Turn left/right and look up/down so we learn your comfortable range.')}</li>
                        <li>${t('calibration.intro_item_3', 'Show one hand gesture to verify hand tracking.')}</li>
                    </ul>
                </div>
                <div class="cw-card tone">
                    <h3>${t('calibration.why_it_matters', 'Why it matters')}</h3>
                    <p>${t('calibration.why_it_matters_desc', 'EsperantAI will use 60% of your personal range as a safe dead zone. That reduces false triggers while keeping your gestures responsive.')}</p>
                </div>
            </div>
        `;
    }

    _renderCaptureStep(t, key) {
        const captureMap = {
            baseline: {
                title: t('calibration.baseline_title', 'Capture your neutral pose'),
                desc: t('calibration.baseline_desc', 'Look straight at the camera, relax your shoulders and keep your head centered.'),
                btn: t('calibration.capture_baseline', 'Capture baseline'),
                status: this.state.baseline ? `${t('calibration.capture_done','Capture completed')}: yaw ${this._round(this.state.baseline.yaw)}, pitch ${this._round(this.state.baseline.pitch)}, roll ${this._round(this.state.baseline.roll)}` : ''
            },
            leftRight: {
                title: t('calibration.left_right_title', 'Measure left and right movement'),
                desc: t('calibration.left_right_desc', 'Turn gently to the left and right a few times. Use your natural streaming posture.'),
                btn: t('calibration.capture_left_right', 'Capture left/right range'),
                status: this.state.leftRight ? `${t('calibration.capture_done','Capture completed')}: L ${this._round(this.state.leftRight.leftRange)} · R ${this._round(this.state.leftRight.rightRange)}` : ''
            },
            pitchTilt: {
                title: t('calibration.pitch_tilt_title', 'Measure up/down and tilt range'),
                desc: t('calibration.pitch_tilt_desc', 'Look up, look down and tilt your head naturally to both sides.'),
                btn: t('calibration.capture_pitch_tilt', 'Capture pitch/tilt range'),
                status: this.state.pitchTilt ? `${t('calibration.capture_done','Capture completed')}: ↑ ${this._round(this.state.pitchTilt.upRange)} · ↓ ${this._round(this.state.pitchTilt.downRange)} · ⤿ ${this._round(this.state.pitchTilt.tiltRange)}` : ''
            },
            handCheck: {
                title: t('calibration.hand_title', 'Check one hand gesture'),
                desc: t('calibration.hand_desc', 'Raise one hand and show a thumbs-up, open palm or peace sign.'),
                btn: t('calibration.capture_hand', 'Start hand check'),
                status: this.state.handGesture ? `${t('calibration.hand_detected','Detected gesture')}: ${this.state.handGesture}` : ''
            }
        };
        const s = captureMap[key];
        const currentKind = { baseline:'baseline', leftRight:'leftRight', pitchTilt:'pitchTilt', handCheck:'handCheck' }[key];
        const isCollectingThis = this.collecting && ((key === 'leftRight' && this.captureKind === 'leftRight') || (key === 'pitchTilt' && this.captureKind === 'pitchTilt') || (key === 'baseline' && this.captureKind === 'baseline') || (key === 'handCheck' && this.captureKind === 'handCheck'));
        const progress = this.captureTarget ? Math.min(100, Math.round((this.captureCount / this.captureTarget) * 100)) : 0;
        return `
            <div class="cw-card">
                <h3>${s.title}</h3>
                <p>${s.desc}</p>
                <div class="cw-actions-row">
                    <button type="button" data-capture-kind="${currentKind}">${s.btn}</button>
                    ${isCollectingThis ? `<span class="cw-capture-pill">${t('calibration.capturing','Capturing')} ${this.captureCount}/${this.captureTarget}</span>` : ''}
                </div>
                ${isCollectingThis ? `<progress class="cw-inline-progress" max="100" value="${progress}">${progress}%</progress>` : ''}
                ${s.status ? `<div class="cw-status ok">${s.status}</div>` : `<div class="cw-status">${t('calibration.ready_when_you_are','Ready when you are.')}</div>`}
            </div>
        `;
    }

    _renderConfirm(t) {
        const th = this.state.thresholds || this._computeThresholds();
        return `
            <div class="cw-summary-grid">
                <div class="cw-card">
                    <h3>${t('calibration.summary_title', 'Your personalized thresholds')}</h3>
                    <ul class="cw-metric-list">
                        <li><span>${t('sensitivity.yaw','Yaw')}</span><strong>${th.yaw}</strong></li>
                        <li><span>${t('sensitivity.pitch_up','Pitch up')}</span><strong>${th.pitchUp}</strong></li>
                        <li><span>${t('sensitivity.pitch_down','Pitch down')}</span><strong>${th.pitchDown}</strong></li>
                        <li><span>${t('sensitivity.roll','Roll')}</span><strong>${th.roll}</strong></li>
                    </ul>
                </div>
                <div class="cw-card tone">
                    <h3>${t('calibration.outcome_title', 'What will change')}</h3>
                    <p>${t('calibration.outcome_desc', 'These values create a personalized dead zone. Small natural movements stay centered, and intentional gestures cross the threshold sooner.')}</p>
                    ${this.state.handGesture ? `<p>${t('calibration.hand_saved','Hand tracking checked with')}: <strong>${this.state.handGesture}</strong></p>` : ''}
                </div>
            </div>
        `;
    }

    _canGoNext() {
        if (this.step === 0) return true;
        if (this.step === 1) return !!this.state.baseline;
        if (this.step === 2) return !!this.state.leftRight;
        if (this.step === 3) return !!this.state.pitchTilt;
        if (this.step === 4) return !!this.state.handGesture;
        return true;
    }

    _updateProgress() {
        const bar = this.overlay.querySelector('.cw-inline-progress');
        if (bar && this.captureTarget) {
            bar.value = Math.min(100, Math.round((this.captureCount / this.captureTarget) * 100));
        }
        const pill = this.overlay.querySelector('.cw-capture-pill');
        if (pill) pill.textContent = `${this.i18n.t('calibration.capturing', {}, 'Capturing')} ${this.captureCount}/${this.captureTarget}`;
    }

    _extractSupportedGesture(gestures) {
        if (!Array.isArray(gestures)) return null;
        for (const g of gestures) {
            const text = String(g?.gesture || '').toLowerCase();
            if (!text) continue;
            if (text.includes('thumb') && text.includes('up')) return 'thumbs-up';
            if (text.includes('open') && text.includes('palm')) return 'open-palm';
            if (text.includes('peace') || (text.includes('index') && text.includes('middle') && text.includes('up'))) return 'peace';
            if (text.includes('ok') || text.includes('o-sign')) return 'ok';
            if (text.includes('point') || text.includes('index')) return 'point';
            if (text.includes('fist')) return 'fist';
            if (text.includes('rock') || text.includes('horn')) return 'rock';
        }
        return null;
    }

    _avg(arr) {
        if (!arr.length) return 0;
        return arr.reduce((a, b) => a + b, 0) / arr.length;
    }
    _clamp(v, min, max) { return Math.min(max, Math.max(min, v)); }
    _round(v) { return Math.round(v * 1000) / 1000; }
}

window.CalibrationWizard = CalibrationWizard;
