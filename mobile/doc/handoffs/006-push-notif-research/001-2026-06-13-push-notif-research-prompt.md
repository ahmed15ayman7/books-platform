# Session Handoff — 2026-06-13

> **OUT OF PREVIOUS SESSION — NEW SESSION START**
>
> Read this file first. It contains everything from the prior session.
> Also read `004-2026-06-13-firebase-removal-notif-audit.md` for the full backend + mobile audit from the prior session.

## What Was Done

- Continued push notification planning from session 004.
- Discussed all mobile push delivery options beyond Firebase (FCM, APNs direct, OneSignal, Expo Push, WebSockets).
- Ruled out **WebSockets** as insufficient — they require the app to be open; OS kills connections aggressively on iOS in the background and in all cases when the app is killed.
- Ruled out **Expo Push (EAS)** — it is React Native-only and fundamentally incompatible with Flutter. Cannot be used.
- Identified that on iOS, every push solution ultimately routes through APNs; on Android through FCM. The question is only who manages that relay.
- Shortlisted two viable paths: **Firebase FCM** (direct, already has skeleton code) and **OneSignal** (relay on top of FCM + APNs, simpler setup, free tier up to 10k subscribers).
- Created a new Claude Code skill: `.claude/skills/prompt-for-chat/SKILL.md` — generates professional Claude.ai chat prompts using the 6-layer anatomy (Role → Task → Context → Reasoning → Stop Conditions → Output).
- Generated a professional Claude.ai chat prompt for researching the best push notification service for this exact stack (Flutter + Next.js + PostgreSQL + Prisma).
- User sent the prompt to Claude.ai chat and received research results. **Those results will be shared in the next session.**

## Files Changed

| File | Change | Why |
|---|---|---|
| `.claude/skills/prompt-for-chat/SKILL.md` | Created new skill | Generates professional 6-layer Claude.ai chat prompts for any task type (web search, image gen, slides, diagrams, docs) |

## Files Audited (no changes)

| File | Checked For | Result |
|---|---|---|
| `mobile/pubspec.yaml` | Notification packages | No firebase or push packages — all removed in session 004 |
| `mobile/lib/features/notifications/` | All 7 files | Skeleton exists, all code commented out, ready to activate |
| `web/package.json` | Push notification packages | `web-push v3.6.7` installed, no `firebase-admin`, no OneSignal SDK |
| `web/prisma/schema.prisma` (lines 640–729) | Notification models | `PushSubscription`, `NotificationChannel`, `NotificationLog` exist. No `DeviceToken` model. |
| `web/app/api/v1/admin/notifications/broadcast/route.ts` | FCM / mobile push logic | Not present — only web push logging (no actual send) |

## Pending Tasks

- [ ] **Receive and review Claude.ai chat research results** — user will share in next session
- [ ] **Make final decision**: Firebase FCM vs OneSignal (decision depends on research results)
- [ ] **Answer the product questions** raised in this session (see Clarifications table below)
- [ ] Then proceed with implementation in the order defined in session 004's "What's Next" list (adapted to chosen service)

## What's Next (ordered)

1. **User shares the Claude.ai chat research results** — read them carefully and summarize the recommendation
2. **Answer the 5 product questions** in the Clarifications table — these gate scope decisions
3. **Decide: Firebase FCM or OneSignal** — based on research + product answers
4. **Adapt the session 004 implementation plan** to the chosen service (the steps are similar; the packages and config differ)
5. **Begin implementation** starting from the backend (device token model + registration endpoint), then mobile

## Key References

- Prior audit handoff: `doc/handoffs/books-platform-mobile/004-2026-06-13-firebase-removal-notif-audit.md`
- Mobile notification skeleton: `mobile/lib/features/notifications/` (all commented out, ready to activate)
- Backend broadcast route: `web/app/api/v1/admin/notifications/broadcast/route.ts`
- Backend Prisma schema (notification models): `web/prisma/schema.prisma` lines 640–729
- New skill (prompt generator): `.claude/skills/prompt-for-chat/SKILL.md`

## Clarifications & Decisions

| Question | Answer |
|---|---|
| Is Firebase the only way to push to mobile? | No — alternatives include OneSignal, direct APNs, Novu. All eventually route through FCM (Android) and APNs (iOS). |
| Can WebSockets replace push notifications? | No — WebSockets die when the app is closed or backgrounded (iOS is especially aggressive). Only viable if users must have the app open. |
| Can Expo Push (EAS) be used with Flutter? | No — Expo is React Native-only. Incompatible with Flutter. |
| Who should receive the new-book notification? | **Not yet answered** — all users? opted-in only? by genre/author? |
| What triggers the notification — creation or publish? | **Not yet answered** — when admin creates book, or when it's published/approved? |
| Should the notification work when the app is killed? | **Not yet answered** — determines whether push is required or WebSocket suffices |
| Do users need opt-in/opt-out on mobile? | **Not yet answered** — determines if notification settings screen must be activated |
| Should tapping the notification open the book detail screen? | **Not yet answered** — determines if deep linking is in scope |
| Which channels should get the new-book notification? | **Not yet answered** — mobile push only, or also Telegram/WhatsApp/email? |

## Notes

- The backend's existing `PushSubscription` table is Web Push (VAPID) — browser only. Do **not** repurpose it for FCM/mobile tokens. A separate `DeviceToken` table is required regardless of which push service is chosen.
- The `web-push` npm package already installed handles browser push only. Mobile push requires a different package (`firebase-admin` for FCM, or the OneSignal server SDK).
- The existing notification skeleton in `mobile/lib/features/notifications/` was built for Firebase FCM. If OneSignal is chosen, the skeleton can be adapted — the cubit/state/repository structure stays the same; only the service layer (`fcm_service.dart`) changes.
- The 6-layer Claude.ai prompt anatomy (Role → Task → Context → Reasoning → Stop Conditions → Output) is now encoded in the `/prompt-for-chat` skill and can be reused for any future research task.
