# Session Handoff — 2026-06-06

> **OUT OF PREVIOUS SESSION — NEW SESSION START**
>
> Read this file first. It contains everything from the prior session.

## What Was Done

- **Diagnosed blank article body**: Traced the root cause to `ArticleDetailModel.fromJson` reading `json['bodyParagraphs']`, a field that does not exist in the live API. Confirmed via Python HTTP request to the live API at `booksplatform.ahmed15ayman7.com/api/v1/articles/{slug}`.
- **Identified correct field**: The article body is in `json['content']` (not `body`, `excerpt`, or `bodyParagraphs`). It is a full Markdown document (17–18 KB of Arabic Markdown with `##` headers, `**bold**`, `[links](url)`, and WordPress-exported `\[caption\]` shortcodes).
- **Fixed `_parseBodyParagraphs`** in `article_detail_model.dart`:
  - Priority order: `bodyParagraphs` (array) → `content` → `body` → `excerpt`
  - Strips WordPress caption shortcodes (`\[caption ...\]` / `\[/caption\]`) before rendering
  - Returns the **whole Markdown string as a single-element list** (not split by paragraph — splitting would break multi-line headers and formatting)
- **Added `flutter_markdown: ^0.7.7`** to `pubspec.yaml` and ran `flutter pub get`
- **Replaced plain-text rendering** in `ArticleDetailBodyContent` with `MarkdownBody`:
  - Custom `MarkdownStyleSheet`: Cairo font for H1–H4 headers, Tajawal for body text, `AppColors.primary` for links with underline
  - Blockquote styled with `AppColors.brandRedSoft` background and left border
  - `onTapLink` opens links via `url_launcher` (`LaunchMode.externalApplication`)
  - `pullQuote` appended after content when single-element (full Markdown) list; inserted after paragraph 1 when multiple elements (legacy plain-text split)
- **`flutter analyze`**: Zero new issues (only the 12 pre-existing issues in `test/features/notifications/` and `app_router.dart` — unrelated to articles).

## Bugs Found

| # | Bug | Severity | Location | Evidence |
|---|---|---|---|---|
| 1 | Article body blank — reads from non-existent `bodyParagraphs` JSON field | High | `data/models/article_detail_model.dart:60` | Live API response has no `bodyParagraphs`; body is in `content` field |
| 2 | Raw Markdown shown as plain text once `content` was read correctly | Medium | `presentation/pages/article_detail_screen/article_detail_body_content.dart` | `Text()` widget rendered `##`, `**`, `[link]()` as literal characters |

Both bugs are fixed.

## Files Changed

| File | Change | Why |
|---|---|---|
| `mobile/lib/features/articles/data/models/article_detail_model.dart` | Replaced `bodyRaw = json['bodyParagraphs']` with `_parseBodyParagraphs(json)` helper; added `_stripWordPressShortcodes()` | API uses `content` field, not `bodyParagraphs`; content contains WP shortcodes |
| `mobile/lib/features/articles/presentation/pages/article_detail_screen/article_detail_body_content.dart` | Replaced `Text(paragraph)` with `MarkdownBody(data, styleSheet, onTapLink)` | Content is Markdown; needs rendered headings, bold, links |
| `mobile/pubspec.yaml` | Added `flutter_markdown: ^0.7.7` | New dependency for Markdown rendering |

## Files Audited (no changes)

| File | Checked For | Result |
|---|---|---|
| `data/datasources/articles_remote_data_source_impl.dart` | Correct endpoint path for detail (`/articles/$slug`) | ✅ Correct — uses `ApiEnvelope.fromJson` |
| `data/models/article_detail_model.dart` — `videoUrl`, `hasVideo`, `imageUrl` | Previously fixed fields still correct | ✅ All correct from prior session |
| `presentation/pages/article_detail_screen/article_detail_body.dart` | Field-based media gating (`hasVideo` not channel string) | ✅ Already fixed in prior session |

## Pending Tasks

- [ ] None identified — articles screens feature is complete.

## What's Next (ordered)

1. Test the articles detail screen end-to-end in the simulator: navigate to an `ideas` channel article (e.g. `articles-53524`) and verify Markdown renders correctly (headers styled, bold text, links tappable).
2. Test a `books-talk` video article detail — should show YouTube player, no body text (since `content` and `excerpt` are empty for those articles), no crash.
3. Consider whether `readMinutes: 0` on video articles should display differently in the detail byline (currently shows "0 دقيقة قراءة" which looks wrong for a video).
4. Move on to other feature work as needed.

## Key References

- Live API base: `https://booksplatform.ahmed15ayman7.com/api/v1`
- Article list samples: `artical-endpints/get-all-articles.txt`, `artical-endpints/get-articles-with-slugs.txt`
- No detail endpoint sample file exists — confirmed via Python HTTP request to the live API
- Previous articles session handoff: `doc/handoffs/books-platform-mobile/003-2026-06-04-articles-screen-fixes.md`
- Architecture rules: `mobile/CLAUDE.md`

## Clarifications & Decisions

| Question | Answer |
|---|---|
| Which backend is the source of truth? | The live external API at `booksplatform.ahmed15ayman7.com`. The Next.js backend at `web/` is deprecated and should be ignored. |
| Where is the authoritative API response shape? | The `artical-endpints/` folder in the project root. Only list endpoint responses are available there; no detail endpoint sample file exists. |

## Notes

- The `content` field in the article detail response is Markdown exported from WordPress. It contains Arabic text with `## headers`, `**bold**`, `[links](url)`, inline images `![](url)`, and WordPress caption shortcodes in the format `\[caption id="..."\]...\[/caption\]` (square brackets escaped with backslashes). The shortcode stripper removes only the opening/closing tags, preserving any inline `![](url)` image markdown inside.
- `MarkdownBody` renders inside a `SliverToBoxAdapter` → `Padding` in the detail screen's `CustomScrollView`. `MarkdownBody` defaults to `shrinkWrap: true` so height is determined by content — no overflow issues.
- Articles with `videoId` set (books-talk channel) have `content: null` and `excerpt: ""` — `_parseBodyParagraphs` returns `[]` for these, and `ArticleDetailBodyContent` renders `SizedBox.shrink()`. This is correct behaviour; those articles show only the YouTube player.
- The `categoryLabel` in the detail entity falls back to the channel slug string (e.g. `"ideas"`) because the API does not return a flat `categoryLabel` field — it returns an `articleCategory` object. This was pre-existing behaviour and was not changed; no issue was reported.
