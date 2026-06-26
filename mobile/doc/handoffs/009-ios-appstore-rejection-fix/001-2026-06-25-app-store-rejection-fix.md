# Session Handoff — 2026-06-25

> **OUT OF PREVIOUS SESSION — NEW SESSION START**
>
> Read this file first. It contains everything from the prior session.

## What Was Done

- Received and analysed the App Store rejection email for Books Platform iOS 2.0.0 (build 8)
- Retrieved full rejection details from App Store Connect — two guidelines violated:
  - **Guideline 2.1** — Information Needed (one specific question from Apple)
  - **Guideline 4.2.2** — Design: Minimum Functionality
- Identified the three root causes of the 4.2.2 rejection by reading the code:
  1. `checkout_note` translation contained `"Guest checkout · payment gateway TBD"` — Apple's reviewer literally saw "TBD" in the cart screen
  2. Checkout button (`cart_summary_card.dart:73`) had `onPressed: () {}` — did nothing
  3. All books have `price = 0.00` from the backend → Add to Cart button was disabled on every book (`onPressed: book.price > 0 ? onAddCart : null`)
- Confirmed the app has **no auth/login system** — all features are guest-accessible
- Confirmed **no payment gateway** is implemented in this version; was submitted as "no purchases"
- Decided: remove cart UI entry points entirely for this version (cart code stays for future use, just unreachable)
- Drafted full Apple reply text for both guidelines (see Notes section below)
- Applied all code fixes (see Files Changed)
- Ran `flutter analyze` on changed files — **No issues found**
- Confirmed build number is already `2.0.0+9` (incremented from the rejected build 8) — no pubspec change needed

## Bugs Found

| # | Bug | Severity | Location | Evidence |
|---|---|---|---|---|
| 1 | Developer placeholder "TBD" text visible in production UI | Critical | `assets/translations/en.json:85`, `ar.json:85` | Apple reviewer cited 4.2.2 after seeing "payment gateway TBD" |
| 2 | Checkout button does nothing | High | `lib/features/cart/presentation/pages/cart_screen/cart_summary_card.dart:73` | `onPressed: () {}` — no implementation |
| 3 | Add to Cart disabled on every book because backend set all prices to 0.00 | High | `lib/features/books/presentation/pages/book_detail_screen/book_detail_info_section.dart` | `onPressed: book.price > 0 ? onAddCart : null` with all prices = 0 |

All three bugs were resolved by removing the cart UI entry points.

## Files Changed

| File | Change | Why |
|---|---|---|
| `lib/core/widgets/app_bar_widget.dart` | Removed `if (onCart != null)` rendering block, removed `_CartButton` class, removed `flutter_bloc` / `cart_cubit.dart` / `injection_container.dart` imports | Cart icon was visible on every screen, leading reviewer to the broken cart |
| `lib/features/books/presentation/pages/book_detail_screen/book_detail_info_section.dart` | Removed `onAddCart` constructor param + field + entire Add to Cart `ElevatedButton` block + `SizedBox(height: 10.h)` spacing after it | All books at $0.00 → button was always disabled; misleading to reviewer |
| `lib/features/books/presentation/pages/book_detail_screen/book_detail_body.dart` | Removed `onAddCart` constructor param, field, and pass-through to `BookDetailInfoSection` | Dead parameter chain after button removal |
| `lib/features/books/presentation/pages/book_detail_screen/book_detail_screen.dart` | Removed `onAddCart` callback and `CartCubit` import | Callback referenced removed button; import became unused |
| `assets/translations/en.json:85` | `"checkout_note"` → `"Review your order before confirming"` | Removed "TBD" language |
| `assets/translations/ar.json:85` | `"checkout_note"` → `"راجع طلبك قبل التأكيد"` | Removed Arabic "TBD" equivalent |

## Files Audited (no changes)

| File | Checked For | Result |
|---|---|---|
| `lib/features/cart/presentation/cubit/cart_cubit.dart` | Whether cart logic needs removal | Left intact — cart code stays for future payment integration |
| `lib/features/cart/presentation/pages/cart_screen/` | Whether cart screen needs removal | Left intact — screen unreachable from UI, no harm keeping it |
| `lib/features/wishlist/` | Whether wishlist is local or backend | Local storage (`WishlistStorage`) — persists across sessions, no account needed |
| `lib/features/ratings/presentation/widgets/comment_form.dart` | Whether comments/ratings is functional | Fully functional — submits to backend, shows success snackbar |
| `lib/features/publish/presentation/pages/publish_screen/publish_success_step.dart` | Whether publish flow shows success | Yes — dedicated success screen shown after submission |
| `lib/core/router/app_routes.dart` | Auth routes | Comment confirms: `// Auth (placeholder — no login in this version)` |

## Pending Tasks

- [ ] Build the iOS release: `flutter build ios --dart-define=ENVIRONMENT=prod` (run from `mobile/`)
- [ ] Archive and export a signed IPA from Xcode Organizer (requires Mac + Apple Developer signing cert)
- [ ] Upload build `2.0.0+9` to App Store Connect via Xcode Organizer or Transporter
- [ ] In App Store Connect → iOS Submission → Messages → Reply to Apple with the text in the Notes section below
- [ ] In App Store Connect → attach new build `2.0.0+9` to the submission → click "Resubmit to App Review"

## What's Next (ordered)

1. Run `flutter build ios --dart-define=ENVIRONMENT=prod` and confirm it compiles cleanly
2. Open Xcode → Product → Archive → Distribute App → App Store Connect → upload
3. Wait for build to appear in App Store Connect (usually 5–15 min after upload)
4. Open the rejection message thread → paste the Guideline 2.1 reply → paste the Guideline 4.2.2 reply
5. Attach new build and resubmit

## Key References

- `lib/core/router/app_routes.dart` — all route names; confirms no login route is active
- `lib/features/cart/presentation/pages/cart_screen/cart_summary_card.dart` — checkout button still has `onPressed: () {}`, cart screen is now unreachable from UI but code is intact
- `pubspec.yaml` — current version is `2.0.0+9`; next upload after this will need `2.0.0+10`

## Clarifications & Decisions

| Question | Answer |
|---|---|
| Does the app have a login/auth system? | No — no auth feature exists. All features (search, wishlist, comments, articles, media, publish, publishers, newsletter) are accessible to everyone without an account |
| Does submitting a book create a user account? | No — the publish form collects author name/email/book details and sends to the editorial team. User sees a success screen. No account is created |
| Is the payment gateway implemented? | No — no payment integration exists in this version. App was submitted to App Store as "no purchases" |
| Why are all books showing $0.00? | The backend set all book prices to 0.00. Add to Cart was intentionally disabled for $0.00 books |
| Target platforms? | iOS only — no iPad, no Android for this submission |
| Fix approach — remove cart or keep it? | Remove cart UI entry points (cart icon + Add to Cart button) for this version. Cart code stays intact in the codebase for future use |
| Fix everything first or reply to Apple first? | Fix everything first, then reply and resubmit in one go |

## Notes

### Apple Reply — Guideline 2.1 (paste as-is into App Store Connect)

> **Re: Guideline 2.1 — Book Submission Account Creation**
>
> Thank you for your question.
>
> No — submitting a book does not create a user account or profile. Books Platform has no account registration or authentication system in this version. All features of the app are available to every user immediately without signing in.
>
> The "Publish Your Book" flow is a 3-step editorial submission form: the user enters their name, email, and book details, then confirms and submits. The submission goes to our editorial team for review. The user sees an in-app success screen confirming that the team will contact them within 5 business days. No account, profile, or credentials are created on the user's side.
>
> Please let us know if you need any further clarification.

---

### Apple Reply — Guideline 4.2.2 (paste as-is into App Store Connect)

> **Re: Guideline 4.2.2 — App Functionality**
>
> Thank you for your review. We'd like to address this concern directly and explain the app's full feature set, which may not have been immediately apparent.
>
> **Books Platform is a book discovery and publishing submission platform.** It does not require an account — every feature below is available immediately to any user who opens the app.
>
> ---
>
> **Interactive features available in this version:**
>
> **1. Book discovery & browsing**
> From the Home screen, users can browse books by category (7 categories), view newly released titles, and navigate to Recommended Books and Translated Books sections. Each book opens a full detail page with cover image, title, author, description (expandable), complete bibliographic information (ISBN, pages, edition, publisher, language), and similar books.
>
> **2. Search**
> Tap the search icon in the top bar. Users can search the full book catalog. The app maintains a recent searches history that persists between sessions.
>
> **3. Wishlist**
> On any book detail page, tap "Save to Wishlist." The book is saved locally and appears in the Wishlist tab. Users can remove books from the wishlist. This works without any account.
>
> **4. Comments and ratings**
> On any book detail page or article, scroll to the bottom and tap "Leave a Comment." Users enter their name, an optional email, and their comment (minimum 10 characters). The form validates in real time and submits to our backend. A success confirmation appears immediately. Comments are moderated and published by our editorial team.
>
> **5. Publish Your Book**
> Tap the + button in the bottom navigation bar. This opens a 3-step wizard:
> - Step 1: Author info (name, email, phone, nationality)
> - Step 2: Book info (title, description, genre, language, file upload)
> - Step 3: Review and confirm (with content rights checkbox)
>
> On submission, a success screen confirms the request was received and that the team will respond within 5 business days.
>
> **6. Articles**
> The Articles tab contains full editorial articles about books and the publishing world. Each article opens a full reading view.
>
> **7. Media**
> The Media tab contains video and audio content about books (linked to external media platforms). Users can browse and navigate to each piece of content.
>
> **8. Publisher directory**
> The Publishers tab lists book publishers with profile pages. Each publisher page shows their catalog of books, country, website, and contact information.
>
> **9. Newsletter subscription**
> From the Home screen, users can subscribe to the Books Platform newsletter by entering their email.
>
> **10. Language switching**
> The app is fully bilingual (Arabic/English). Users can switch languages at any time using the language toggle in the top bar. The entire app — including layout direction (RTL/LTR) — updates immediately.
>
> ---
>
> **Regarding the cart / purchase UI:**
>
> We understand the confusion. In the version submitted, the app displayed an "Add to Cart" button and a cart icon in the app bar. However, no books in the current catalog have a price assigned (all show $0.00), so the Add to Cart button was disabled on every single book. Additionally, the cart checkout screen contained placeholder text ("payment gateway TBD") that we inadvertently left in the build — this was internal developer text that should not have been visible.
>
> We have removed the cart icon and the "Add to Cart" button from the resubmission. This version of the app has no in-app purchases, as declared in our submission. A purchase flow will be introduced in a future version once our payment gateway integration is complete.
>
> ---
>
> We are happy to answer any further questions. We can also be reached directly through App Store Connect if a call or screen share would help clarify the app's functionality.

---

### Version / Build Number Rules
- Marketing version (`2.0.0`) stays the same for this resubmission
- Build number increments by 1 on every upload — current is `+9`, next will be `+10`
- Format in pubspec.yaml: `version: <marketing>+<build>` e.g. `2.0.0+10`

### Apple Review Environment
- Review device was **iPad Air 11-inch (M3)** — app ran in iPhone compatibility mode (small centered box on black screen)
- This contributed to the "limited functionality" perception but is **not** a rejection reason by itself
- App targets iPhone only — no iPad UI changes needed for this submission
