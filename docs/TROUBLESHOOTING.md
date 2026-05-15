# EsperantAI Troubleshooting Guide

Version: for EsperantAI v2.0+. If you are using an older build, update first.

This guide is ordered by expected frequency × impact. Start at the top before contacting support.

Support: replace this placeholder with Joel's official support channel before publishing: `[SUPPORT_EMAIL_OR_DISCORD]`.

---

## Quick checklist before you troubleshoot

1. Open EsperantAI from the normal launcher or a local/web server, not directly from `file://`.
2. Use Chrome or Edge first if you are unsure.
3. Allow camera permissions in the browser.
4. Open your streaming app before connecting it in EsperantAI.
5. Keep your license key email available.

---

## Camera

### My camera does not appear (Camera)

**Symptom:** The camera dropdown is empty, the video preview stays black, or the browser asks for permission repeatedly.

**Cause:** The browser does not have camera permission, another app is already using the camera, or the camera driver is not available to the browser.

**Solution:**
1. Click the camera/lock icon in your browser address bar.
2. Set **Camera → Allow** for the EsperantAI page.
3. Close other apps that may use the camera: OBS Virtual Camera, Zoom, Meet, Discord, Teams, Snap Camera.
4. Reload EsperantAI.
5. Reopen **Camera tracking your face** and select your webcam.

**If persists:** Restart the browser, unplug/replug the webcam, then test it at a generic browser camera test page. Contact `[SUPPORT_EMAIL_OR_DISCORD]` if the camera works elsewhere but not in EsperantAI.

### Camera works, but EsperantAI does not detect my face (Camera)

**Symptom:** You can see the camera preview, but EsperantAI stays on “Searching for face...” or the face box appears only sometimes.

**Cause:** The AI needs a visible, well-lit face. Low light, strong backlight, extreme side angle, sunglasses, masks, or being too close/far can reduce detection.

**Solution:**
1. Face the camera directly.
2. Add light in front of you, not behind you.
3. Keep your full face inside the preview.
4. Sit around an arm’s length from the camera.
5. Remove anything covering eyes or face.
6. Run **Advanced → Calibration → Recalibrate** after your face is detected.

**If persists:** Try a different webcam resolution or another camera. If you use a virtual camera, test a physical webcam first.

### I have multiple cameras and do not know which one to choose (Camera)

**Symptom:** The dropdown shows several cameras, but the preview uses the wrong one.

**Cause:** Browsers expose physical cameras, virtual cameras, capture cards, and OBS Virtual Camera as separate devices.

**Solution:**
1. Open the camera dropdown.
2. Choose the device that shows your face in the preview.
3. If two names look identical, select them one by one and wait one second.
4. Save your configuration once the correct camera is selected.

**If persists:** Disconnect unused cameras temporarily, reload EsperantAI, then reconnect them later.

---

## OBS / Streamlabs / vMix

### OBS Connected stays red (OBS / Streamlabs / vMix)

**Symptom:** The connection badge remains red or says the streaming app is not connected.

**Cause:** OBS WebSocket is not enabled, the port is wrong, the password is wrong, or a firewall blocks local connections.

**Solution:**
1. Open OBS.
2. Go to **Tools → WebSocket Server Settings**.
3. Enable the WebSocket server.
4. Confirm the port. Default OBS WebSocket v5 is usually `4455`.
5. Copy the password exactly if you enabled authentication.
6. In EsperantAI, set the URL to `ws://127.0.0.1:4455`.
7. Paste the password and click **Connect**.

**If persists:** Temporarily disable firewall rules that block local ports, then try again. See also “Scene changes do not apply.”

### Scene changes do not apply (OBS / Streamlabs / vMix)

**Symptom:** EsperantAI says an action ran, but the visible scene does not change.

**Cause:** The scene may be unassigned, the streaming app connection may have dropped, or the saved scene name no longer matches the scene in the app.

**Solution:**
1. Reconnect your streaming app.
2. Wait for EsperantAI to reload the real scene list.
3. Open **Triggers** and check that the gesture has a scene assigned.
4. If the scene was renamed in OBS/Streamlabs/vMix, select it again.
5. Test the action from the Multi-Action modal.

**If persists:** Create a simple scene named `Test` and map one gesture to it. If `Test` works, the problem is the original scene/source configuration.

### vMix HTTP API does not respond (OBS / Streamlabs / vMix)

**Symptom:** vMix does not connect, or actions do not reach vMix.

**Cause:** The vMix Web Controller / HTTP API may be off, the port may be wrong, or Windows Firewall may block it.

**Solution:**
1. Open vMix.
2. Enable the Web Controller / HTTP API.
3. Confirm the host is `127.0.0.1` if vMix runs on the same computer.
4. Confirm the port, commonly `8088`.
5. In EsperantAI, use the same host and port.
6. Allow vMix through Windows Firewall if prompted.

**If persists:** Open the vMix API URL manually in the browser. If the browser cannot reach it, EsperantAI cannot reach it either.

---

## Platforms: Twitch / YouTube / Kick / StreamElements

### OAuth callback gets stuck (Platforms)

**Symptom:** The login window opens but never finishes, closes without connecting, or EsperantAI does not receive the login result.

**Cause:** A popup blocker, wrong redirect URI, stale OAuth state, or browser privacy setting interrupted the login.

**Solution:**
1. Allow popups for the EsperantAI page.
2. Close the login popup.
3. Click **Connect** again from EsperantAI.
4. Check that the platform Client ID belongs to an app configured with the correct redirect URI.
5. Avoid opening the callback URL manually.

**If persists:** Try a clean browser profile with extensions disabled. Contact `[SUPPORT_EMAIL_OR_DISCORD]` with the platform name and any error shown.

### I do not receive live events (Platforms)

**Symptom:** Twitch/YouTube/Kick connects, but subs, donations, raids, channel points, or Super Chats do not trigger anything.

**Cause:** The platform token may not have the needed scopes, the channel is not live, the event source uses a different API, or StreamElements is not connected to the same channel.

**Solution:**
1. Confirm you are connected to the correct streamer account.
2. Confirm the channel is live or that the platform supports testing events offline.
3. Reconnect the platform from EsperantAI.
4. For StreamElements, verify the JWT belongs to the correct channel.
5. Create a simple event trigger: event → notification or scene switch.
6. Test again with a real or platform-generated test event.

**If persists:** Try the same event through StreamElements bridge if available.

### Token expires too often (Platforms)

**Symptom:** You reconnect successfully, but the platform stops sending events after a short time.

**Cause:** The platform may issue short-lived tokens, or the session may be cleared when the browser closes. Some integrations intentionally keep tokens in session storage for privacy.

**Solution:**
1. Reconnect the platform before a stream.
2. Do not clear browser storage before going live.
3. Keep the EsperantAI tab open during the stream.
4. If available, use StreamElements bridge for longer-running event coverage.

**If persists:** Report the exact platform and approximate time until expiration to `[SUPPORT_EMAIL_OR_DISCORD]`.

---

## Triggers / Gestures

### Gesture is detected but no action fires (Triggers)

**Symptom:** The preview detects your pose or gesture, but nothing happens in OBS or the streaming app.

**Cause:** The category may be disabled, the trigger may not have a scene/action, or the streaming app is not connected.

**Solution:**
1. Open **Triggers**.
2. Enable the relevant category: head, gaze, emotion, blink, or hand.
3. Assign a quick scene or add actions in the Multi-Action modal.
4. Connect your streaming app.
5. Use **Test** in the action modal when available.
6. Watch **Trigger History** to confirm whether the trigger fired.

**If persists:** Temporarily map the same gesture to a browser notification. If notification works, the issue is the streaming app action.

### Trigger fires by itself / false positives (Triggers)

**Symptom:** Scenes switch when you did not intentionally make a gesture.

**Cause:** Sensitivity thresholds may be too low for your camera angle, posture, or natural movement.

**Solution:**
1. Run **Advanced → Calibration → Recalibrate**.
2. Increase stable frames slightly.
3. Increase cooldown if actions fire too often.
4. Disable gesture categories you do not use.
5. Avoid mapping “center” to high-impact actions.

**If persists:** Move the camera to a stable frontal angle and improve lighting.

### Hand gestures do not work (Triggers)

**Symptom:** Head movement works, but thumbs-up, open palm, peace sign, gassho, or other hand gestures do not trigger.

**Cause:** Hand detection may be disabled, your hand may be outside the camera frame, or the feature may be locked by your license tier.

**Solution:**
1. Open **Triggers → Hand Gestures** and enable the category.
2. Keep your hand visible near your upper body, not too close to the lens.
3. Use good lighting.
4. Check your license tier if the UI says the feature is locked.
5. Run the calibration hand check if available.

**If persists:** Try a plain background and move your hand slower.

### Combo trigger does not confirm (Triggers)

**Symptom:** A platform event arrives, but the combo action does not run after you make the gesture.

**Cause:** The combo waits for the exact confirming gesture within its time window. If the gesture is not detected, the event expires.

**Solution:**
1. Confirm the combo is enabled.
2. Verify the event type and confirming gesture are selected.
3. Test the confirming gesture alone under **Triggers**.
4. Make the gesture within a few seconds of the platform event.
5. Add a simple notification action first, then add complex actions later.

**If persists:** Use a gesture that detects reliably for you, such as thumbs-up or open palm.

---

## License / Activation

### My license key does not activate (License)

**Symptom:** The activation screen stays open, or EsperantAI says the license is invalid.

**Cause:** The key may have extra spaces, missing characters, wrong hyphens, or the license service may be temporarily unreachable.

**Solution:**
1. Copy the full license key from your purchase email.
2. Paste it into the activation field.
3. Remove spaces before or after the key.
4. Make sure you are online.
5. Click **Activate license** again.

**If persists:** Contact `[SUPPORT_EMAIL_OR_DISCORD]` with the purchase email, not a screenshot of the full key.

### EsperantAI says license invalid although I paid (License)

**Symptom:** You paid, but the app says “invalid license” or activation fails.

**Cause:** You may be pasting the wrong text, using a different purchase email, or the payment/license provider has not finished issuing the key.

**Solution:**
1. Search your email for “EsperantAI” and “license”.
2. Copy only the license key, not the order ID or invoice number.
3. Wait a few minutes if the purchase just completed.
4. Try again in the same browser.

**If persists:** Contact `[SUPPORT_EMAIL_OR_DISCORD]` with the purchase email and order reference.

### I changed PC and get too many activations (License)

**Symptom:** EsperantAI says the license reached the device limit.

**Cause:** A license can be activated on a limited number of devices. Old devices may still count until deactivated.

**Solution:**
1. On the old device, open EsperantAI.
2. Go to **Advanced → License**.
3. Click **Deactivate license on this device**.
4. Return to the new device and activate again.

**If persists:** Contact `[SUPPORT_EMAIL_OR_DISCORD]` and ask to reset an old activation.

---

## Performance

### EsperantAI is slow or OBS loses FPS (Performance)

**Symptom:** The app feels laggy, camera preview stutters, or OBS FPS drops while EsperantAI is open.

**Cause:** Browser AI, OBS encoding, game capture, and overlays may be competing for CPU/GPU resources.

**Solution:**
1. Close unused browser tabs and heavy apps.
2. Use a 720p or 1080p webcam, not 4K.
3. Disable gesture categories you do not use.
4. Lower camera resolution if available.
5. Keep OBS and EsperantAI on the same GPU when possible.
6. Use a wired power connection on laptops.

**If persists:** Test without your game open. If performance improves, lower game or OBS encoder settings.

### Battery drains fast on laptop (Performance)

**Symptom:** Battery drops quickly while using EsperantAI.

**Cause:** Real-time AI detection uses CPU/GPU continuously.

**Solution:**
1. Plug in the laptop during streams.
2. Lower screen brightness.
3. Close unused apps.
4. Disable unused gesture categories.
5. Use a lower webcam resolution.

**If persists:** Use EsperantAI on AC power for live streams.

---

## Audio / TTS / Sounds

### TTS does not play (Audio / TTS)

**Symptom:** Text-to-speech action runs, but you hear nothing.

**Cause:** Browser audio may be muted, the OS has no default voice, or autoplay policy prevented sound before user interaction.

**Solution:**
1. Click anywhere inside EsperantAI once before testing TTS.
2. Check the browser tab is not muted.
3. Check system volume and output device.
4. Confirm your OS has a speech voice installed.
5. Test with a short message first.

**If persists:** Try another browser. Chrome/Edge usually have the best Web Speech support.

### play_sound does not reproduce audio (Audio / TTS)

**Symptom:** The play sound action runs, but no sound plays.

**Cause:** The sound URL may be blocked, unavailable, not supported, or browser autoplay policy may require a user click first.

**Solution:**
1. Use a local or same-origin sound file if possible.
2. Open the sound URL directly in the browser to confirm it plays.
3. Click inside EsperantAI once, then test again.
4. Use a common format such as `.mp3` or `.wav`.
5. Lower the volume parameter if the sound is clipping.

**If persists:** Replace the sound URL with a short known-working file and test again.

---

## What to send support

When contacting support, include:

1. Operating system and browser.
2. Streaming app and version.
3. Platform integration used: Twitch, YouTube, Kick, Trovo, or StreamElements.
4. Exact symptom.
5. What you already tried from this guide.
6. A screenshot of the error message, but never post your full license key publicly.
