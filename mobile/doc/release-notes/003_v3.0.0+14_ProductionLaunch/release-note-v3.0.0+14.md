# Release Note — 003 v3.0.0+14 · Production Launch

**Date:** 2026-07-05
**Version:** 3.0.0+14
**Platform:** Google Play — first production release
**Scope:** Full app welcome note, updated to include Push Notifications and Text-to-Speech (previously missing from the drafted production "what's new" text)

---

## Play Console — copy this block

```
<en-US>
Welcome to Books Platform!

• Browse a growing catalog of books, articles, and media
• Discover translated and recommended titles picked for you
• Listen to articles and book descriptions with adjustable playback speed
• Get notified about new releases and translations
• Rate books, follow publishers, and build your wishlist
• Search the whole catalog in seconds — Arabic and English supported

Thank you for being an early user!
</en-US>
<ar>
أهلاً بيك في منصة الكتب!

• تصفح كتالوجًا متناميًا من الكتب والمقالات والوسائط
• اكتشف الكتب المترجمة والموصى بها المختارة لك
• استمع إلى المقالات ووصف الكتب بصوت مسموع مع التحكم في سرعة التشغيل
• استقبل إشعارات عند صدور كتب وترجمات جديدة
• قيّم ما تقرأه، وتابع دور النشر المفضلة، واحفظ الكتب في قائمة أمنياتك
• ابحث في الكتالوج بالكامل خلال ثوانٍ — بالعربية والإنجليزية

شكرًا لكونك من أوائل مستخدمينا!
</ar>
```

---

## Character counts

| Language | Count | Limit |
|----------|-------|-------|
| en-US    | 431   | 500   |
| ar       | 403   | 500   |

---

## What changed vs. the original draft

The original draft (used as the base) covered catalog browsing, wishlist, ratings, and search, but omitted two features already shipped on this branch:

- **Text-to-Speech** (`lib/core/widgets/tts_player_widget.dart`, `TtsTextChunker`) — listen to articles and book descriptions, adjustable playback speed (1×, 1.25×, 1.5×, 2×). Confirmed present via commits `9fe6a3b`, `a18590a`, `721c42e`.
- **Push Notifications** (`lib/features/notifications/services/fcm_service.dart`) — FCM topic `new-books`; tapping a notification deep-links to the relevant book or article. Confirmed via commit `3fa6249` and the `notifications` feature translation keys (`notifications_prompt_body`: "Get notified about new book releases, translations, and exclusive offers").

Both bullets were added above without exceeding the 500-character limit in either language.
