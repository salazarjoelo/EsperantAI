#!/usr/bin/env python
"""
Add `events` namespace to all 13 locales (L-02 fix, 2026-05-15).

Adds 19 keys per locale:
  - 10 event labels (sub, resub, gift_sub, follow, donation, cheer_bits, raid,
    super_chat, channel_points, member_milestone)
  - 6 gesture labels (none, thumbs_up, peace, rock, ok, open_palm)
  - 1 scene placeholder
  - 1 info tooltip
  - 1 toggle title

For locales NOT in TRANSLATIONS, falls back to English (in-code default
shown via i18n.t fallback). Translators can fill in later.

Updates _meta.completion accordingly.
"""
import json
from pathlib import Path

ROOT = Path(__file__).parent.parent
LOCALES_DIR = ROOT / 'locales'

# Canonical English source
EVENTS_EN = {
    "sub_label": "New subscription",
    "resub_label": "Resub",
    "gift_sub_label": "Gifted sub",
    "follow_label": "New follower",
    "donation_label": "Donation",
    "cheer_bits_label": "Bits / Cheer",
    "raid_label": "Raid received",
    "super_chat_label": "Super Chat (YT)",
    "channel_points_label": "Channel Points",
    "member_milestone_label": "Member milestone",
    "gesture_none_option": "— none (auto-trigger) —",
    "gesture_thumbs_up": "👍 Thumbs up",
    "gesture_peace": "✌️ Peace",
    "gesture_rock": "🤘 Rock",
    "gesture_ok": "👌 OK",
    "gesture_open_palm": "🖐️ Open palm",
    "scene_option_placeholder": "— scene —",
    "info_tooltip": "If you select a gesture, you must perform it within 5 seconds of the event to confirm the action.",
    "toggle_title": "Enable this event",
}

# Verified human translations only for languages Joel speaks (es) — everything
# else uses English fallback so we don't fabricate. Translators can fill in.
TRANSLATIONS = {
    "es-ES": {
        "sub_label": "Nueva suscripción",
        "resub_label": "Resuscripción",
        "gift_sub_label": "Sub regalada",
        "follow_label": "Nuevo follower",
        "donation_label": "Donación",
        "cheer_bits_label": "Bits / Cheer",
        "raid_label": "Raid recibido",
        "super_chat_label": "Super Chat (YT)",
        "channel_points_label": "Channel Points",
        "member_milestone_label": "Hito de miembros",
        "gesture_none_option": "— ninguno (disparo automático) —",
        "gesture_thumbs_up": "👍 Pulgar arriba",
        "gesture_peace": "✌️ Paz",
        "gesture_rock": "🤘 Rock",
        "gesture_ok": "👌 OK",
        "gesture_open_palm": "🖐️ Palma abierta",
        "scene_option_placeholder": "— escena —",
        "info_tooltip": "Si seleccionas un gesto, debes realizarlo dentro de 5 segundos después del evento para confirmar la acción.",
        "toggle_title": "Habilitar este evento",
    },
    "es-MX": {
        "sub_label": "Nueva suscripción",
        "resub_label": "Resuscripción",
        "gift_sub_label": "Sub regalada",
        "follow_label": "Nuevo follower",
        "donation_label": "Donación",
        "cheer_bits_label": "Bits / Cheer",
        "raid_label": "Raid recibido",
        "super_chat_label": "Super Chat (YT)",
        "channel_points_label": "Channel Points",
        "member_milestone_label": "Hito de miembros",
        "gesture_none_option": "— ninguno (disparo automático) —",
        "gesture_thumbs_up": "👍 Pulgar arriba",
        "gesture_peace": "✌️ Paz",
        "gesture_rock": "🤘 Rock",
        "gesture_ok": "👌 OK",
        "gesture_open_palm": "🖐️ Palma abierta",
        "scene_option_placeholder": "— escena —",
        "info_tooltip": "Si seleccionas un gesto, debes realizarlo dentro de 5 segundos después del evento para confirmar la acción.",
        "toggle_title": "Habilitar este evento",
    },
}

def count_leaves(obj):
    if not isinstance(obj, dict):
        return 1
    n = 0
    for k, v in obj.items():
        if k == "_meta":
            continue
        n += count_leaves(v)
    return n

def main():
    files = sorted(LOCALES_DIR.glob("*.json"))
    if not files:
        raise SystemExit("No locale files found")

    for f in files:
        code = f.stem  # "en-US", "es-MX", etc.
        with f.open(encoding='utf-8') as fp:
            data = json.load(fp)

        # Skip if events already exists
        if "events" in data:
            print(f"  [skip] {code} already has 'events'")
            continue

        # Pick translation or fall back to English source
        events = TRANSLATIONS.get(code, EVENTS_EN).copy()
        # Always seed with EN to guarantee complete key set
        for k, v in EVENTS_EN.items():
            events.setdefault(k, v)

        data["events"] = events

        # Update _meta.completion
        new_total = count_leaves(data)
        if "_meta" not in data:
            data["_meta"] = {}
        data["_meta"]["completion"] = new_total

        with f.open("w", encoding='utf-8') as fp:
            json.dump(data, fp, ensure_ascii=False, indent=2)
            fp.write("\n")
        print(f"  [+] {code}: added events ({len(events)} keys), total leaves = {new_total}")

if __name__ == "__main__":
    main()
