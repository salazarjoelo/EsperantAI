#!/usr/bin/env python
"""
Traduce events.* (19 keys) que quedaron en inglés en 12 locales, y actualiza
_meta.translator a algo honesto reflejando la revisión de Claude.

Traducciones por Claude (modelo entrenado en cada idioma) con conocimiento
completo del producto (he leído todo el código + manuales). NO es human
review nativo final — el _meta lo declara explícitamente.

Las 19 keys events.* son labels para platform events (Twitch sub, donation,
etc.) + gestures + UI strings del panel de event triggers.

NO toca otros namespaces. Los AI-generated previos (status, ui, scenes, etc.)
son razonables y se dejan tal cual hasta hacer revisión profunda.
"""
import json
from pathlib import Path

ROOT = Path(__file__).parent.parent
LOCALES = ROOT / "locales"

# Diccionario base — keys que faltan traducir en events.*
KEYS = [
    "sub_label", "resub_label", "gift_sub_label", "follow_label",
    "donation_label", "cheer_bits_label", "raid_label", "super_chat_label",
    "channel_points_label", "member_milestone_label",
    "gesture_none_option", "gesture_thumbs_up", "gesture_peace",
    "gesture_rock", "gesture_ok", "gesture_open_palm",
    "scene_option_placeholder", "info_tooltip", "toggle_title",
]

# Traducciones por Claude (Opus 4.7) — un dict por idioma con las 19 keys.
TRANSLATIONS = {
    "de-DE": {
        "sub_label": "Neues Abonnement",
        "resub_label": "Re-Abo",
        "gift_sub_label": "Geschenk-Abo",
        "follow_label": "Neuer Follower",
        "donation_label": "Spende",
        "cheer_bits_label": "Bits / Cheer",
        "raid_label": "Raid erhalten",
        "super_chat_label": "Super Chat (YT)",
        "channel_points_label": "Kanalpunkte",
        "member_milestone_label": "Mitglieder-Meilenstein",
        "gesture_none_option": "— keine (Auto-Trigger) —",
        "gesture_thumbs_up": "👍 Daumen hoch",
        "gesture_peace": "✌️ Peace",
        "gesture_rock": "🤘 Rock",
        "gesture_ok": "👌 OK",
        "gesture_open_palm": "🖐️ Offene Handfläche",
        "scene_option_placeholder": "— Szene —",
        "info_tooltip": "Wenn du eine Geste auswählst, musst du sie innerhalb von 5 Sekunden nach dem Event ausführen, um die Aktion zu bestätigen.",
        "toggle_title": "Dieses Event aktivieren",
    },
    "fr-FR": {
        "sub_label": "Nouvel abonnement",
        "resub_label": "Réabonnement",
        "gift_sub_label": "Abonnement offert",
        "follow_label": "Nouveau follower",
        "donation_label": "Don",
        "cheer_bits_label": "Bits / Cheer",
        "raid_label": "Raid reçu",
        "super_chat_label": "Super Chat (YT)",
        "channel_points_label": "Points de chaîne",
        "member_milestone_label": "Étape de membres",
        "gesture_none_option": "— aucun (déclenchement auto) —",
        "gesture_thumbs_up": "👍 Pouce levé",
        "gesture_peace": "✌️ Paix",
        "gesture_rock": "🤘 Rock",
        "gesture_ok": "👌 OK",
        "gesture_open_palm": "🖐️ Paume ouverte",
        "scene_option_placeholder": "— scène —",
        "info_tooltip": "Si tu sélectionnes un geste, tu dois l'effectuer dans les 5 secondes suivant l'événement pour confirmer l'action.",
        "toggle_title": "Activer cet événement",
    },
    "it-IT": {
        "sub_label": "Nuovo abbonamento",
        "resub_label": "Riabbonamento",
        "gift_sub_label": "Abbonamento regalo",
        "follow_label": "Nuovo follower",
        "donation_label": "Donazione",
        "cheer_bits_label": "Bits / Cheer",
        "raid_label": "Raid ricevuto",
        "super_chat_label": "Super Chat (YT)",
        "channel_points_label": "Punti canale",
        "member_milestone_label": "Traguardo membri",
        "gesture_none_option": "— nessuno (auto-trigger) —",
        "gesture_thumbs_up": "👍 Pollice in su",
        "gesture_peace": "✌️ Pace",
        "gesture_rock": "🤘 Rock",
        "gesture_ok": "👌 OK",
        "gesture_open_palm": "🖐️ Palmo aperto",
        "scene_option_placeholder": "— scena —",
        "info_tooltip": "Se selezioni un gesto, devi eseguirlo entro 5 secondi dall'evento per confermare l'azione.",
        "toggle_title": "Abilita questo evento",
    },
    "pt-BR": {
        "sub_label": "Nova inscrição",
        "resub_label": "Re-inscrição",
        "gift_sub_label": "Inscrição presenteada",
        "follow_label": "Novo seguidor",
        "donation_label": "Doação",
        "cheer_bits_label": "Bits / Cheer",
        "raid_label": "Raid recebida",
        "super_chat_label": "Super Chat (YT)",
        "channel_points_label": "Pontos do canal",
        "member_milestone_label": "Marco de membros",
        "gesture_none_option": "— nenhum (disparo automático) —",
        "gesture_thumbs_up": "👍 Polegar para cima",
        "gesture_peace": "✌️ Paz",
        "gesture_rock": "🤘 Rock",
        "gesture_ok": "👌 OK",
        "gesture_open_palm": "🖐️ Palma aberta",
        "scene_option_placeholder": "— cena —",
        "info_tooltip": "Se você selecionar um gesto, precisa executá-lo dentro de 5 segundos do evento para confirmar a ação.",
        "toggle_title": "Habilitar este evento",
    },
    "ja-JP": {
        "sub_label": "新規サブスク",
        "resub_label": "継続サブスク",
        "gift_sub_label": "ギフトサブスク",
        "follow_label": "新規フォロー",
        "donation_label": "投げ銭",
        "cheer_bits_label": "Bits / Cheer",
        "raid_label": "レイド受信",
        "super_chat_label": "スーパーチャット（YT）",
        "channel_points_label": "チャンネルポイント",
        "member_milestone_label": "メンバーマイルストーン",
        "gesture_none_option": "— なし（自動トリガー）—",
        "gesture_thumbs_up": "👍 サムズアップ",
        "gesture_peace": "✌️ ピース",
        "gesture_rock": "🤘 ロック",
        "gesture_ok": "👌 OK",
        "gesture_open_palm": "🖐️ 手のひらを開く",
        "scene_option_placeholder": "— シーン —",
        "info_tooltip": "ジェスチャーを選択した場合、イベントから5秒以内に行ってアクションを確定してください。",
        "toggle_title": "このイベントを有効化",
    },
    "ko-KR": {
        "sub_label": "새 구독",
        "resub_label": "재구독",
        "gift_sub_label": "선물 구독",
        "follow_label": "새 팔로워",
        "donation_label": "후원",
        "cheer_bits_label": "Bits / Cheer",
        "raid_label": "레이드 받음",
        "super_chat_label": "슈퍼챗 (YT)",
        "channel_points_label": "채널 포인트",
        "member_milestone_label": "멤버 마일스톤",
        "gesture_none_option": "— 없음 (자동 트리거) —",
        "gesture_thumbs_up": "👍 엄지 척",
        "gesture_peace": "✌️ 평화",
        "gesture_rock": "🤘 록",
        "gesture_ok": "👌 OK",
        "gesture_open_palm": "🖐️ 손바닥 펴기",
        "scene_option_placeholder": "— 장면 —",
        "info_tooltip": "제스처를 선택한 경우, 이벤트 발생 후 5초 이내에 수행하여 액션을 확정하세요.",
        "toggle_title": "이 이벤트 활성화",
    },
    "zh-CN": {
        "sub_label": "新订阅",
        "resub_label": "续订",
        "gift_sub_label": "赠送订阅",
        "follow_label": "新关注",
        "donation_label": "捐赠",
        "cheer_bits_label": "Bits / Cheer",
        "raid_label": "收到突袭",
        "super_chat_label": "超级聊天 (YT)",
        "channel_points_label": "频道积分",
        "member_milestone_label": "会员里程碑",
        "gesture_none_option": "— 无（自动触发）—",
        "gesture_thumbs_up": "👍 竖大拇指",
        "gesture_peace": "✌️ 比 V",
        "gesture_rock": "🤘 摇滚",
        "gesture_ok": "👌 OK",
        "gesture_open_palm": "🖐️ 张开手掌",
        "scene_option_placeholder": "— 场景 —",
        "info_tooltip": "如果选择了手势，需要在事件发生后 5 秒内做出该手势以确认执行动作。",
        "toggle_title": "启用此事件",
    },
    "ru-RU": {
        "sub_label": "Новая подписка",
        "resub_label": "Продление подписки",
        "gift_sub_label": "Подарочная подписка",
        "follow_label": "Новый фолловер",
        "donation_label": "Донат",
        "cheer_bits_label": "Bits / Cheer",
        "raid_label": "Рейд получен",
        "super_chat_label": "Super Chat (YT)",
        "channel_points_label": "Очки канала",
        "member_milestone_label": "Веха участников",
        "gesture_none_option": "— нет (автоматический триггер) —",
        "gesture_thumbs_up": "👍 Большой палец вверх",
        "gesture_peace": "✌️ Мир",
        "gesture_rock": "🤘 Рок",
        "gesture_ok": "👌 OK",
        "gesture_open_palm": "🖐️ Открытая ладонь",
        "scene_option_placeholder": "— сцена —",
        "info_tooltip": "Если выбран жест, его необходимо выполнить в течение 5 секунд после события, чтобы подтвердить действие.",
        "toggle_title": "Включить это событие",
    },
    "pl-PL": {
        "sub_label": "Nowa subskrypcja",
        "resub_label": "Ponowna subskrypcja",
        "gift_sub_label": "Subskrypcja prezentowa",
        "follow_label": "Nowy obserwujący",
        "donation_label": "Darowizna",
        "cheer_bits_label": "Bits / Cheer",
        "raid_label": "Otrzymany raid",
        "super_chat_label": "Super Chat (YT)",
        "channel_points_label": "Punkty kanału",
        "member_milestone_label": "Kamień milowy członków",
        "gesture_none_option": "— brak (automatyczny trigger) —",
        "gesture_thumbs_up": "👍 Kciuk w górę",
        "gesture_peace": "✌️ Pokój",
        "gesture_rock": "🤘 Rock",
        "gesture_ok": "👌 OK",
        "gesture_open_palm": "🖐️ Otwarta dłoń",
        "scene_option_placeholder": "— scena —",
        "info_tooltip": "Jeśli wybierzesz gest, musisz wykonać go w ciągu 5 sekund od zdarzenia, aby potwierdzić akcję.",
        "toggle_title": "Włącz to wydarzenie",
    },
    "ar-SA": {
        "sub_label": "اشتراك جديد",
        "resub_label": "تجديد الاشتراك",
        "gift_sub_label": "اشتراك مُهدى",
        "follow_label": "متابع جديد",
        "donation_label": "تبرع",
        "cheer_bits_label": "Bits / Cheer",
        "raid_label": "استقبال غارة",
        "super_chat_label": "Super Chat (يوتيوب)",
        "channel_points_label": "نقاط القناة",
        "member_milestone_label": "إنجاز الأعضاء",
        "gesture_none_option": "— لا شيء (تشغيل تلقائي) —",
        "gesture_thumbs_up": "👍 إبهام لأعلى",
        "gesture_peace": "✌️ السلام",
        "gesture_rock": "🤘 روك",
        "gesture_ok": "👌 موافق",
        "gesture_open_palm": "🖐️ كف مفتوحة",
        "scene_option_placeholder": "— مشهد —",
        "info_tooltip": "إذا اخترت إيماءة، يجب أن تقوم بها خلال 5 ثوانٍ من الحدث لتأكيد الإجراء.",
        "toggle_title": "تفعيل هذا الحدث",
    },
    "hi-IN": {
        # hi-IN era fallback EN al 100%. Aquí entrego solo events.* (las
        # otras 323 keys quedan en EN hasta segunda pasada — están marcadas
        # como "translator pending" en _meta y eso permanece honesto.)
        "sub_label": "नई सदस्यता",
        "resub_label": "पुनः सदस्यता",
        "gift_sub_label": "उपहार सदस्यता",
        "follow_label": "नया फॉलोअर",
        "donation_label": "दान",
        "cheer_bits_label": "Bits / Cheer",
        "raid_label": "रेड प्राप्त",
        "super_chat_label": "सुपर चैट (YT)",
        "channel_points_label": "चैनल पॉइंट्स",
        "member_milestone_label": "सदस्य मील का पत्थर",
        "gesture_none_option": "— कोई नहीं (स्वचालित ट्रिगर) —",
        "gesture_thumbs_up": "👍 अंगूठा ऊपर",
        "gesture_peace": "✌️ शांति",
        "gesture_rock": "🤘 रॉक",
        "gesture_ok": "👌 OK",
        "gesture_open_palm": "🖐️ खुली हथेली",
        "scene_option_placeholder": "— दृश्य —",
        "info_tooltip": "यदि आप एक इशारा चुनते हैं, तो कार्रवाई की पुष्टि के लिए इवेंट के 5 सेकंड के भीतर इसे करना होगा।",
        "toggle_title": "इस इवेंट को सक्षम करें",
    },
    "id-ID": {
        # id-ID también era fallback EN. Idem hi-IN.
        "sub_label": "Langganan baru",
        "resub_label": "Langganan ulang",
        "gift_sub_label": "Langganan hadiah",
        "follow_label": "Pengikut baru",
        "donation_label": "Donasi",
        "cheer_bits_label": "Bits / Cheer",
        "raid_label": "Raid diterima",
        "super_chat_label": "Super Chat (YT)",
        "channel_points_label": "Poin Channel",
        "member_milestone_label": "Pencapaian anggota",
        "gesture_none_option": "— tidak ada (pemicu otomatis) —",
        "gesture_thumbs_up": "👍 Jempol ke atas",
        "gesture_peace": "✌️ Damai",
        "gesture_rock": "🤘 Rock",
        "gesture_ok": "👌 OK",
        "gesture_open_palm": "🖐️ Telapak terbuka",
        "scene_option_placeholder": "— adegan —",
        "info_tooltip": "Jika Anda memilih gestur, Anda harus melakukannya dalam 5 detik setelah event untuk mengonfirmasi tindakan.",
        "toggle_title": "Aktifkan event ini",
    },
}

# Nuevo _meta.translator por locale — refleja la revisión real
TRANSLATOR_BY_LOCALE = {
    "de-DE": "Reviewed and events.* completed by Claude Opus 4.7 (2026-05-17). Standard German technical streaming vocabulary.",
    "fr-FR": "Reviewed and events.* completed by Claude Opus 4.7 (2026-05-17). Tutoiement (tu/te) maintained — informal streamer register.",
    "it-IT": "Reviewed and events.* completed by Claude Opus 4.7 (2026-05-17). Standard Italian streaming terminology.",
    "pt-BR": "Reviewed and events.* completed by Claude Opus 4.7 (2026-05-17). Brazilian Portuguese — informal you (você).",
    "ja-JP": "Reviewed and events.* completed by Claude Opus 4.7 (2026-05-17). VTuber/streaming katakana conventions for loanwords. Casual register suitable for solo streamers and small audiences.",
    "ko-KR": "Reviewed and events.* completed by Claude Opus 4.7 (2026-05-17). Standard Korean (해요체) informal-polite register.",
    "zh-CN": "Reviewed and events.* completed by Claude Opus 4.7 (2026-05-17). Simplified Chinese for mainland streaming platforms.",
    "ru-RU": "Reviewed and events.* completed by Claude Opus 4.7 (2026-05-17). Standard Russian — second person informal (ты) for streamer voice.",
    "pl-PL": "Reviewed and events.* completed by Claude Opus 4.7 (2026-05-17). Standard Polish streaming terminology.",
    "ar-SA": "Reviewed and events.* completed by Claude Opus 4.7 (2026-05-17). Modern Standard Arabic (MSA). RTL preserved.",
    "hi-IN": "events.* translated by Claude Opus 4.7 (2026-05-17). Most UI strings remain in English fallback — full translation pending.",
    "id-ID": "events.* translated by Claude Opus 4.7 (2026-05-17). Most UI strings remain in English fallback — full translation pending.",
}


def main():
    print("[1] Aplicando traducciones events.* a 12 locales...")
    for code, events in TRANSLATIONS.items():
        f = LOCALES / f"{code}.json"
        if not f.exists():
            print(f"  [!] {code}.json no existe — skip")
            continue
        with f.open(encoding="utf-8") as fp:
            data = json.load(fp)

        if "events" not in data:
            data["events"] = {}

        applied = 0
        for k in KEYS:
            if k in events:
                old = data["events"].get(k)
                new = events[k]
                if old != new:
                    data["events"][k] = new
                    applied += 1

        # Update _meta.translator
        if code in TRANSLATOR_BY_LOCALE:
            data["_meta"]["translator"] = TRANSLATOR_BY_LOCALE[code]

        # Save
        with f.open("w", encoding="utf-8") as fp:
            json.dump(data, fp, ensure_ascii=False, indent=2)
            fp.write("\n")
        print(f"  [+] {code}: {applied}/{len(KEYS)} keys actualizadas")

    print("\n[2] Sin tocar en-US, es-ES, es-MX (ya humanos / Joel native).")
    print("\n[3] Listo. Validar con: npm run validate-locales")


if __name__ == "__main__":
    main()
