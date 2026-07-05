# Session Handoff — 2026-07-05

> **OUT OF PREVIOUS SESSION — NEW SESSION START**
>
> Read this file first. It contains everything from the prior session.
> Previous handoff: `doc/handoffs/010-google-play-production-access/001-2026-07-01-production-access-submitted.md`

## What Was Done

- Confirmed **Google Play production access was granted** on 2026-07-04, 8:53 PM (email from Google Play Support to youssefemad63.ye@gmail.com).
- Verified the two bugs flagged as pending in the prior handoff were already fixed on `feat/firebase-fcm-push-notifications` before this session started:
  - Article TTS bug — fixed via commits `9fe6a3b`, `a18590a`, `721c42e` (unified `ArticleTtsPlayerWidget` into `TtsPlayerWidget`, added `TtsTextChunker` for long-article chunked playback).
  - Arabic TTS fallback — verified clean in `lib/core/widgets/tts_player_widget.dart`: `_play()` tries `setLanguage` with full locale, then bare language code, then `_trySetVoiceByLanguage()` (scans `tts.voices` directly to bypass Android OEMs that misreport `LANG_NOT_SUPPORTED`). On total failure it sets `_hasTtsError` and shows a translated message — no crash. Translation keys confirmed present (nested JSON, not flat): `assets/translations/en.json:368-371` and `ar.json:368-371` (`tts.listen`, `tts.voice_not_available`).
- Rewrote the production "what's new" release note (the user's pasted draft was missing TTS and Push Notification mentions) after exploring the actual code (`fcm_service.dart`, `tts_player_widget.dart`, translation keys) for accurate wording.
- **Fixed a bug in the `/release-notes` skill itself** (`C:\Users\youss\.claude\skills\release-notes\SKILL.md`): Step 2 previously instructed stripping the build number (`2.0.0+10` → `2.0.0`), causing folder/file names to collide across different builds of the same marketing version. Updated Steps 2, 5, and 6 so `VERSION` always includes the full `+N` build number, kept literally (not substituted with `-` or `b`) since `+` is valid in Windows/macOS/Linux paths.
- Walked through a versionCode collision on Google Play Console:
  - App version went through several renames this session: `2.0.0+12` (starting point) → user set `3.0.0+1` → Play Console rejected with **"Version code 1 has already been used"** → user tried `3.0.0+2` → flagged as still risky (git history shows scattered versionCodes 1, 2, 9, 11, 12 across branches, meaning Play Console's authoritative count is likely higher than what git shows) → user checked Play Console's App Bundle Explorer and set **`3.0.0+14`**, which was accepted.
  - Branch was renamed in lockstep each time: `release/v3.0.0+1` → `release/v3.0.0+2` → `release/v3.0.0+14`.
  - Release note folder/file renamed in lockstep each time to match: final path `doc/release-notes/003_v3.0.0+14_ProductionLaunch/release-note-v3.0.0+14.md`.
- **AAB was uploaded and accepted by Google Play Console** — confirmed by user ("app bundle accepted, done").
- Committed (`696b47b`) and pushed `release/v3.0.0+14` to `origin`, tracking set up.

---

## Bugs Found

None new. Both bugs from the prior handoff (article TTS, Arabic TTS fallback) were confirmed fixed and verified clean — see above.

---

## Files Changed

| File | Change | Why |
|---|---|---|
| `mobile/pubspec.yaml` | `version: 2.0.0+12` → `3.0.0+14` | New major version for first production release; build number bumped repeatedly to clear Play Console's versionCode uniqueness check |
| `mobile/doc/release-notes/003_v3.0.0+14_ProductionLaunch/release-note-v3.0.0+14.md` | New file | Production release notes (EN+AR), corrected to include TTS and Push Notifications that the user's original draft omitted |
| `C:\Users\youss\.claude\skills\release-notes\SKILL.md` | Steps 2, 5, 6 edited | Stop stripping the build number from `VERSION` — full version (e.g. `3.0.0+14`) now used in folder/file names and doc content to prevent collisions across builds |

Branch renamed (not a file change, but relevant): `feat/firebase-fcm-push-notifications` → `release/v3.0.0+1` → `release/v3.0.0+2` → `release/v3.0.0+14` (final). Pushed to `origin/release/v3.0.0+14`.

---

## Files Audited (no changes)

| File | Checked For | Result |
|---|---|---|
| `lib/core/widgets/tts_player_widget.dart` | Arabic TTS fallback graceful degradation | Clean — 3-tier fallback (`setLanguage` full locale → bare code → voice scan), sets `_hasTtsError` + translated message on total failure, never throws |
| `assets/translations/en.json` / `ar.json` (lines 368-371) | `tts.*` keys existence | Present in both languages, nested JSON structure |
| `lib/features/notifications/services/fcm_service.dart` | FCM topic subscription + notification tap deep-linking | Subscribes to `new-books` topic; tap routes to book/article detail via `_handleNotificationTap` |

---

## Pending Tasks

- [ ] **Decide whether to merge `release/v3.0.0+14` into `main`.** `main` is currently 12+ commits behind (missing all FCM and TTS-chunking work). GitHub offered a PR link: https://github.com/ahmed15ayman7/books-platform/pull/new/release/v3.0.0+14 — not yet created, user's call.
- [ ] **Create the production release in Play Console** (rollout percentage) — this is a Play Console web action the user handles themselves, not something done from this repo.
- [ ] Consider whether `release/v2.0.0+12` and `release/v2.0.0+13`-related staged work (abandoned early in this session when the user pivoted to `3.0.0`) needs any cleanup — the `2.0.0+13` version bump was staged but never committed on the old branch name.

---

## What's Next (ordered)

1. If the user wants `main` updated, open/merge the PR for `release/v3.0.0+14` (link above).
2. Once Play Console shows the production release live, no further action needed here — production access + first release is complete.
3. If any tester reports a new TTS or notification issue post-launch, start with `lib/core/widgets/tts_player_widget.dart` and `lib/features/notifications/services/fcm_service.dart` — both were freshly audited and confirmed clean in this session, so a regression would be new, not a repeat of prior bugs.

---

## Key References

- Previous handoff in this thread: `doc/handoffs/010-google-play-production-access/001-2026-07-01-production-access-submitted.md`
- Release notes skill (now fixed): `C:\Users\youss\.claude\skills\release-notes\SKILL.md`
- Production release note: `doc/release-notes/003_v3.0.0+14_ProductionLaunch/release-note-v3.0.0+14.md`
- Prior TTS handoffs: `doc/handoffs/011-tts-android-fix/`, `doc/handoffs/009-ios-appstore-rejection-fix/003.2-2026-07-02-android-tts-chunking-fix.md`

---

## Clarifications & Decisions

| Question | Answer |
|---|---|
| How should the branch/version be finalized before building the AAB (merge to main, merge to release branch, or build as-is)? | User rejected the question and handled branch/version renaming themselves throughout the session |
| How should the full version (e.g. `3.0.0+1`) appear in release-note folder/file names — literal `+`, dash, or `b` for build? | Keep the `+` literally (valid on all major filesystems) |
| Should `3.0.0+2` be tried after the `3.0.0+1` versionCode collision? | User initially said yes; was shown evidence it would likely collide too; user checked Play Console's App Bundle Explorer directly and set `3.0.0+14`, which was accepted |

---

## Notes

- Google Play's versionCode uniqueness is enforced globally per app across **all tracks and all time** by Play Console itself — git history is not authoritative for "what's the next safe build number." Always check Play Console's App Bundle Explorer / Release overview before guessing.
- The version was bumped to a new **major** version (`3.0.0`) this session, not a patch — worth confirming with the user in a future session whether that was an intentional decision tied to feature significance (FCM + TTS overhaul) or arbitrary, since it wasn't explicitly discussed, just executed via branch renames.
- App package ID: `com.booksplatform.booksplatform`
- Backend: `booksplatform.net`
- Final branch this session ended on: `release/v3.0.0+14` (pushed to origin, commit `696b47b`)

### Play Console state at end of session (Publishing overview screenshot)

- **Managed publishing:** off
- **Last published:** July 5, 2026
- **Changes in review:** "Your changes are now in review. We may find additional issues when reviewing your app."
- **Production** section shows one pending change:
  | Item changed | Description |
  |---|---|
  | `release/v3.0.0+14` | Start full rollout |
- This means the AAB upload succeeded and the **full rollout to production has been submitted and is under Google's review** — not yet live to users. Next session should check Play Console for whether this review has completed and the rollout has actually started, rather than assuming it's already live.
