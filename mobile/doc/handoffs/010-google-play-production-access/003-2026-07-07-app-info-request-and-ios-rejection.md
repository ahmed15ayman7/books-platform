# Session Handoff — 2026-07-07

> **OUT OF PREVIOUS SESSION — NEW SESSION START**
>
> Read this file first. It contains everything from the prior session.
> Previous handoff: `doc/handoffs/010-google-play-production-access/002-2026-07-05-production-approved-and-released.md`

## What Was Done

- Reviewed two inbound emails to youssefemad63.ye@gmail.com:
  - **IARC Live Rating Notice** (2026-07-05) — informational only, confirms the app's content rating is live on Google Play. No action needed.
  - **"Information needed regarding your app submission to Google Play" [9-4339000040855]** (2026-07-07) — Google requires the developer to fill out a **Google Play App Information Request** form within 14 days or risk app suspension. This is a separate/parallel step from the production rollout review noted in the 002 handoff (which was still "under review" as of 2026-07-05).
- Walked through the actual Google Play App Information Request form field-by-field and drafted answers:
  - **Does your app function differently based on geolocation or language?** → Yes, based on language only (bilingual AR/EN with full RTL/LTR mirroring), not geolocation.
  - **Login wall statement** → "I do not have any content locked behind a login wall" — confirmed correct since the app has no account/auth system; every feature works immediately without sign-in.
  - **What SDKs does your app use and why?** → Drafted from `pubspec.yaml`: firebase_core/firebase_messaging/flutter_local_notifications (push), flutter_tts/just_audio (TTS/audio), dio (own backend networking), cached_network_image, flutter_secure_storage/shared_preferences, connectivity_plus, image_picker/file_picker (Publish Your Book attachments), google_fonts/flutter_svg/flutter_screenutil/shimmer (UI only), easy_localization/intl. No analytics, ads, or crash-reporting SDKs.
  - **Proof of Permission for IP** (Yes / No / No third-party IP) — this was the hardest question. Investigated `books-platform/web` (the backend) via an Explore agent to determine the actual source of the book catalog:
    - No third-party book API or scraping code found (no Google Books, Open Library, Goodreads, cheerio, puppeteer).
    - Catalog (`Product`/`Publisher`/`Article` models in `web/prisma/schema.prisma`) carries WordPress/WooCommerce legacy fields (`originalId`, `postType`, `yoastMetadesc`), indicating the catalog was **migrated from the business's own prior WordPress/WooCommerce bookstore site**, not scraped from a third party.
    - Books are also added via an authenticated admin CMS (`app/api/v1/admin/books/route.ts`) and a reviewed "Publish Your Book" submission flow (`PublishBookSubmission` model, human approval + audit log before a submission becomes a real listing).
    - Cover images are self-hosted on Cloudflare R2 (`web/lib/storage/upload-image.ts`), not hotlinked from publishers or other sites.
  - User confirmed **"Atef Mazhar Ibrahime" is the same business that operated the original WordPress/WooCommerce bookstore** the catalog was migrated from.
  - Recommendation given: select **"No third party intellectual property appears in my app"** — reasoning is nominative fair use / standard bookseller practice (displaying covers of books you sell, same as Amazon/Barnes & Noble), not a licensing arrangement needing per-publisher proof-of-permission documents. Flagged this as a judgment call, not a legal guarantee — recommended having actual reseller/distribution agreements on hand if Google follows up.
  - Explain 3rd-party SDK compliance answer drafted around: pub.dev-only sourcing, stable maintained versions, no analytics/ads, HTTPS-only calls to own backend.
- **Form was submitted** — user confirmed with a screenshot showing "Your email has been sent... We'll follow up with you only if we need more information."
- Also reviewed (then corrected as a wrong-image mistake) an **App Store Connect iOS rejection** screenshot for a *different, older* submission: iOS App 2.0.0 (8), rejected under Guideline 2.1 (Information Needed — account creation question) and 4.2.2 (Design — Minimum Functionality, "marketing materials" concern). A reply from Atef Mazhar was already visible in the thread addressing both points (no accounts exist; listed 10 real interactive features; explained Add to Cart button + "payment gateway TBD" placeholder text were removed since no in-app purchases exist). **Resubmit to App Review button appeared greyed out** — not yet actually resubmitted as of that screenshot. This was flagged by the user as the wrong image/not the current topic — unclear if this iOS rejection is still open or already resolved via a later resubmission. Worth confirming in a future session since it wasn't the intended attachment.

---

## Bugs Found

None — this session was documentation/compliance/support-ticket work, no code was investigated for bugs.

---

## Files Changed

*No app code changed this session.* Only this handoff file was added.

---

## Files Audited (no changes)

| File | Checked For | Result |
|---|---|---|
| `mobile/pubspec.yaml` | Full SDK/dependency list for the Google Play form | No analytics/ads/crash SDKs; confirmed Firebase, TTS, dio, storage, image picker packages |
| `web/prisma/schema.prisma` | Book (`Product`) model fields, legacy migration fields, `PublishBookSubmission` model | Confirmed first-party catalog — WooCommerce/WordPress migration fields present, no external API source fields |
| `web/lib/storage/upload-image.ts` | Cover image storage/hosting | Self-hosted on Cloudflare R2, SHA-256 deduped, admin-auth gated upload endpoint |
| `web/app/api/v1/admin/books/route.ts`, `.../admin/submissions/[id]/approve/route.ts` | Admin book creation + submission approval flow | Confirmed human-in-the-loop review with audit logging before a submission becomes a real product listing |
| Full repo grep for scraping/book-API libraries | Third-party IP risk (Google Books, Open Library, Goodreads, cheerio, puppeteer) | None found |

---

## Pending Tasks

- [ ] **Confirm status of the iOS App Store rejection** (Guideline 2.1 + 4.2.2, submission `cfdbc13b-79d3-4686-a7be-7379747b7dec`, version 2.0.0 (8)) — the user showed this by mistake mid-session and didn't confirm whether it's still open, already resolved, or superseded by a newer iOS submission. Check App Store Connect directly at the start of next session.
- [ ] **Watch for a Google Play follow-up** on the App Information Request submitted today (2026-07-07) — Google said they'll only respond if they need more info or have something to share; no fixed timeline given.
- [ ] **Check whether the production rollout review (from the 002 handoff, submitted 2026-07-05) has completed** — as of that handoff it was still "in review," and it's unclear if it's related to or independent from today's App Information Request. Both may need to clear before the app is fully live.
- [ ] Carried over from 002: decide whether to merge `release/v3.0.0+14` into `main` (12+ commits behind).

---

## What's Next (ordered)

1. Check Play Console's Publishing overview for whether the production rollout is now live (separate from today's info request).
2. Check App Store Connect for the actual current status of the iOS rejection shown by mistake this session — confirm if a resubmission already happened after the June reply, or if `Resubmit to App Review` still needs to be triggered.
3. If Google Play sends a follow-up question, use the same `web/` backend investigation approach (checked schema, admin routes, storage) rather than guessing — this session's method of tracing actual code before answering compliance questions worked well and should be repeated.

---

## Key References

- Previous handoffs in this thread: `doc/handoffs/010-google-play-production-access/001-2026-07-01-production-access-submitted.md`, `.../002-2026-07-05-production-approved-and-released.md`
- iOS rejection context (needs status check): `doc/handoffs/009-ios-appstore-rejection-fix/`
- Backend book/catalog models: `web/prisma/schema.prisma` (`Product`, `Publisher`, `PublishBookSubmission`)
- Cover image upload: `web/lib/storage/upload-image.ts`, `web/app/api/v1/admin/uploads/image/route.ts`

---

## Clarifications & Decisions

| Question | Answer |
|---|---|
| Is "Atef Mazhar Ibrahime" the same business that operated the original WordPress/WooCommerce bookstore the catalog was migrated from? | Yes — confirmed by user |
| Which IP-permission radio button to select on the Google Play form? | "No third party intellectual property appears in my app" — based on nominative fair use / standard bookseller display practice, since it's the business's own migrated catalog, not scraped or unlicensed third-party content |

---

## Notes

- App package ID: `com.booksplatform.booksplatform`
- Backend: `booksplatform.net` (Next.js app under `books-platform/web`, Prisma ORM, Cloudflare R2 storage)
- The Google Play "Information needed" ticket number: `9-4339000040855`
- The book catalog's legal safety net (nominative fair use as a bookseller) is a reasonable position but not a legal guarantee — if this is challenged further by Google or by a publisher, having documented reseller/distribution agreements from the original WooCommerce business would strengthen the position considerably.
- Current branch at time of writing: `release/v3.0.0+14` (per git status), one commit ahead of the last pushed commit noted in handoff 002.
