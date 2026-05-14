# ChatGPT UX polish audit — paywall, microcopy, landing

Branch target: `feat/ux-polish-paywall-and-microcopy`

## Scope delivered

1. Multi-Action modal polish in `core/trigger-ui-builder.js`:
   - Replaced the minimal action picker with an accessible dialog (`role=dialog`, `aria-modal`, labelled title/description).
   - Added `label for` bindings for trigger scene selects, category toggles and action form fields.
   - Added keyboard handling: Escape closes, Tab focus trap, focus restoration to the trigger button.
   - Preserved the quick-scene dropdown when the first custom action is added, so users do not accidentally lose the scene switch.
   - Added dynamic parameter fields from `ActionEngine.getActionTypes()`.
   - Added per-action Test buttons through `triggerUI.onTestAction` hook in `app.js`.

2. Paywall rewritten as guided activation:
   - The lockout now explains compra → key → stream instead of feeling like a hard error.
   - License errors are rewritten as actionable streamer-friendly messages.
   - The input normalizes spaces/lowercase before activation.

3. Microcopy:
   - Added EN/ES strings for license activation, action builder labels and common error states.
   - Kept other locales untouched per NEXT_STEPS.

4. Landing copy:
   - Assumes the current default commercial decision: one unique license, no Free tier, no trial.
   - Reframes the product around flow, fewer interruptions and ethical monetization nudges.

## Risks / handoff notes

- This PR still keeps CSS in `index.html` because TASK-105 CSP extraction belongs to DeepSeek. No new `onclick`/`onfocus` attributes were introduced in the app UI.
- Composite action types (`sequence`, `random_choice`, `delay_then`) accept JSON text in the UI. A future UX pass should add nested builders.
- The actual price and checkout URL remain Joel/LemonSqueezy decisions.

Co-authored-by: ChatGPT <noreply@openai.com>
