# Session Handoff — 2026-06-30 (Push Notifications — Manual Setup Complete)

> **OUT OF PREVIOUS SESSION — NEW SESSION START**
>
> Read this file first. It contains everything from the prior session.
>
> **Important:** This session happened entirely OUTSIDE Claude Code, in the
> Claude.ai chat interface, working through Xcode and two web consoles
> (Apple Developer Portal + Firebase Console) via screenshots. Claude Code's
> own context stopped right after handoff `005-2026-06-30-firebase-fcm-implementation.md`,
> at the "Remaining tasks" list. Everything below picks up from that exact
> point and should be treated as new, verified information — not a guess.

---

## What Was Done (this session, outside Claude Code)

All 3 of the 4 "Manual (Xcode + Firebase Console)" tasks listed in handoff 005
are now **complete**. Only task 4 (production env vars) remains, and it has
been re-scoped to a separate backend developer (see "Handoff to Backend
Developer" section below).

### 1. Xcode — Push Notifications capability ✅
- Added via Runner target → Signing & Capabilities → **+ Capability** → Push Notifications
- Confirmed visible in Xcode UI with "Push Notifications Console" button present

### 2. Xcode — Background Modes → Remote notifications ✅
- Added via **+ Capability** → Background Modes
- Only the **Remote notifications** checkbox was enabled — all other options
  (Background fetch, Audio/AirPlay, Bluetooth, etc.) were intentionally left
  unchecked to avoid raising unnecessary Apple review questions about unused
  background capabilities (relevant given this app has an active history of
  4.2.2 rejections — see handoffs 001–003).

### 3. Firebase Console — APNs Authentication Key upload ✅

**Created on Apple Developer Portal:**
- Navigated to Certificates, Identifiers & Profiles → Keys → Register a New Key
- Key Name: `Books Platform Push Key`
- Enabled service: **Apple Push Notifications service (APNs)**
- Configured with:
  - **Environment:** `Sandbox & Production` (chosen specifically so the same
    key works for both Xcode debug runs and the eventual App Store build —
    this setting is permanent and cannot be changed after saving)
  - **Key Restriction:** `Team Scoped (All Topics)` (not restricted to a
    single app/topic — reusable across any future app under this Apple
    Developer team)
- Downloaded the key file: **`AuthKey_M9YZ28FHFL.p8`**
  - ⚠️ This file can only be downloaded once. The user has it saved locally.
    If lost, the key must be revoked and regenerated from scratch.

**Apple-side identifiers (needed for Firebase upload):**
| Field | Value |
|---|---|
| Key Name | Books Platform Push Key |
| Key ID | `M9YZ28FHFL` |
| Team ID | `PW882S9X59` |

**Uploaded to Firebase Console:**
- Project Settings → Cloud Messaging tab → Apple app configuration →
  `booksplatform (ios)` (`com.booksplatform.booksplatform`)
- Uploaded the same `.p8` file **twice** — once under "Development APNs auth
  key" and once under "Production APNs auth key" (Firebase requires separate
  upload actions for each slot even though it's the same key file, since the
  key itself was configured for both environments on Apple's side)
- **Verified end state:** both rows now show:
  - File: `Development APNs auth key` / `Production APNs auth key`
  - Key ID: `M9YZ28FHFL`
  - Team ID: `PW882S9X59`
  - Action: `Delete` (confirming the upload succeeded — Firebase only shows
    "Delete" for keys that are actually stored, vs "Upload" for empty slots)

---

## Current State of the 4 Manual Tasks from Handoff 005

| # | Task | Status |
|---|---|---|
| 1 | Xcode — Push Notifications capability | ✅ Done |
| 2 | Xcode — Background Modes → Remote notifications | ✅ Done |
| 3 | Firebase Console — APNs key upload | ✅ Done |
| 4 | Production `.env` — real Firebase credentials | 🔁 **Re-scoped to backend developer** — see below |

---

## Files Changed

No code files were changed this session. All changes were made through:
- Xcode project settings (capabilities — these DO modify
  `ios/Runner/Runner.entitlements` and `ios/Runner.xcodeproj/project.pbxproj`
  under the hood, but were applied via Xcode UI, not manually edited)
- Apple Developer Portal (key creation — external, no repo files affected)
- Firebase Console (key upload — external, no repo files affected)

**Action for Claude Code next session:** Pull the latest Xcode project state
and verify `ios/Runner/Runner.entitlements` now contains the
`aps-environment` key, and that `project.pbxproj` reflects the Push
Notifications + Background Modes capabilities. These were added via Xcode
GUI in this session and should now be present in git status as modified
files, ready to be reviewed/committed.

---

## Handoff to Backend Developer — Remaining Task

This task requires access to the production deployment environment
(Vercel/Railway/whatever hosts `web/`), which the mobile/Firebase-focused
work in this session did not have. It should be assigned to whoever owns
backend deployment.

### Task: Set real Firebase Admin credentials in production `web/.env`

**Why:** The backend (`web/server/services/fcm.service.ts` and
`web/lib/firebase/admin.ts`, both already implemented per handoff 005) needs
a Firebase service account to authenticate as an admin and call
`sendMobileNotification()`. Without real credentials in production, the
`POST`/`PATCH` book endpoints will throw or silently fail when trying to
send a push notification after a book is published.

**Steps for the backend developer:**

1. Go to Firebase Console → `books-platform-9cfbb` project → **Project
   Settings** → **Service Accounts** tab
2. Click **"Generate new private key"** — this downloads a JSON file
   containing `project_id`, `client_email`, and `private_key`
3. ⚠️ This file should never be committed to git. Treat it like the `.p8`
   file — one-time download, store securely.
4. Extract the three values and set them in the **production** environment
   (not just local `.env` — wherever the actual deployed `web/` app reads
   its env vars from, e.g. Vercel project settings → Environment Variables):
   ```
   FIREBASE_PROJECT_ID="books-platform-9cfbb"
   FIREBASE_CLIENT_EMAIL="<client_email from the downloaded JSON>"
   FIREBASE_PRIVATE_KEY="<private_key from the downloaded JSON, keep \n escaped>"
   ```
5. **Common gotcha:** `FIREBASE_PRIVATE_KEY` contains literal `\n` characters
   in the JSON. Depending on the hosting platform's env var UI, these may
   need to stay as the literal two-character sequence `\n` (not real
   newlines) — `web/lib/firebase/admin.ts` should already handle
   `.replace(/\\n/g, '\n')` internally per the existing implementation, but
   verify this didn't get lost.
6. Redeploy / restart the production service so the new env vars take effect
7. **Verification:** Publish or update a book via the admin panel in
   production and confirm:
   - No error is thrown in server logs
   - A row appears/updates in the `FcmToken`-adjacent send flow (check
     `NotificationLog` table per the schema referenced in handoff 004)
   - (Once a test device is registered) the device actually receives the push

**Do NOT need to touch:** Any mobile code, any of the FCM service logic, the
`FcmToken` Prisma model, or the `/notifications/mobile/subscribe` endpoint —
all of that is already built and was verified working in handoff 005. This
is purely a "supply the missing credentials" deployment task.

---

## What's Next (ordered)

1. **Backend developer:** Complete the production env var task above
   (independent — can happen in parallel with anything else)
2. **Claude Code (next session):** Verify `ios/Runner/Runner.entitlements`
   and `project.pbxproj` reflect the two new Xcode capabilities added this
   session; commit if not already tracked
3. **End-to-end test on a real device** (cannot use simulator — iOS
   simulator does not support receiving real FCM/APNs pushes):
   1. Open the app → Notification Settings screen → toggle push ON
   2. Grant the system permission prompt
   3. Confirm a token was registered: check `FcmToken` table for a new row,
      or backend logs for the `POST /notifications/mobile/subscribe` call
   4. Publish a new book from the admin panel (requires step 1 of the
      backend task to be done first, otherwise this will fail silently or error)
   5. Confirm the device receives the push notification
   6. Tap the notification → confirm it opens `BookDetailScreen` for that
      specific book (deep link verification)
4. **Android build verification:** Run `flutter build apk --dart-define=ENVIRONMENT=prod`
   and confirm it compiles cleanly with the Google Services Gradle plugin
   now applied (per handoff 005, this hadn't been build-tested yet)

---

## Key References

- Original push notification research: `doc/handoffs/006-push-notif-research/push-notification-strategy.md`
  (note: folder name collision — that's a different "006" from a much
  earlier research session; this current file's folder is
  `006-push-notif-manual-setup` to disambiguate)
- Backend + mobile code implementation: `doc/handoffs/005-2026-06-30-firebase-fcm-implementation.md`
- FCM service (mobile): `mobile/lib/features/notifications/services/fcm_service.dart`
- Backend FCM service: `web/server/services/fcm.service.ts`
- Backend Firebase admin init: `web/lib/firebase/admin.ts`
- Firebase project console: `console.firebase.google.com/project/books-platform-9cfbb`
- Apple Developer Portal keys: `developer.apple.com/account/resources/authkeys/list`

---

## Clarifications & Decisions

| Question | Answer |
|---|---|
| Should the APNs key be Sandbox-only, Production-only, or both? | Both ("Sandbox & Production") — chosen upfront since this setting is permanent and cannot be changed after saving. Avoids having to regenerate a second key later. |
| Should the APNs key be Team Scoped or Topic Specific? | Team Scoped (All Topics) — kept reusable for any future app under this Apple Developer account rather than locking it to this one app/bundle ID. |
| Which Background Modes options should be enabled? | Only "Remote notifications." All others left unchecked to avoid signaling unused capabilities to Apple App Review, given this app's rejection history under Guideline 4.2.2. |
| Who should set the production Firebase Admin env vars? | Re-scoped to a separate backend developer who has access to the production deployment environment — this session's owner does not have that access. |
| Does the same `.p8` file get uploaded once or twice to Firebase? | Twice — once to the "Development APNs auth key" slot, once to "Production APNs auth key" slot. Same file both times; Firebase treats them as separate upload actions even though the underlying key supports both environments. |

---

## Notes

### Why Claude Code's context needs this file

The Claude Code session that produced handoff 005 ended by listing the 4
manual tasks and asking "What's next?" — it had no visibility into the
subsequent work because that work happened in a separate Claude.ai chat
session (browser screenshots, Xcode UI, Apple/Firebase consoles), not in the
terminal/IDE environment Claude Code operates in. This file exists
specifically to close that visibility gap: a fresh Claude Code session
reading this file should treat tasks 1–3 from handoff 005 as **done and
verified**, not as open items to re-investigate or redo.

### Apple's "configuration cannot be changed once saved" warning

Apple Developer Portal showed a one-time warning when configuring the APNs
key: *"The APNs configuration for accessible environment and key
restriction type can't be changed once saved."* This is why both
Environment and Key Restriction were decided upfront in this session rather
than starting narrow and expanding later — expanding later would require
generating an entirely new key and re-uploading to Firebase, plus revoking
the old one.

### Apple also recommended environment-specific keys

After selecting "Sandbox & Production," Apple's UI displayed an additional
advisory: *"It's recommended to use different, environment-specific keys to
create distinct workflows and to safely manage your development process."*
This was a soft recommendation, not a requirement — for a project of this
size (single developer, single backend), a single combined key was judged
sufficient and simpler to manage. Worth revisiting if the team grows or a
staging environment with its own Firebase project is introduced later.
