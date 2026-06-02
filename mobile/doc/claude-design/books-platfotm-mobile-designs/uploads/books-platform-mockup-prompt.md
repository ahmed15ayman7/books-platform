> Design high-fidelity interactive mobile app mockups for منصة الكتب العالمية (Books Platform) — a bilingual AR/EN global book discovery and e-commerce Flutter app.

The attached codebase is the live Next.js web platform at booksplatform.ahmed15ayman7.com. Use it as the single source of truth for brand colors, typography, logo, and all content. Do not invent data — pull real book titles, category names, publisher names, and copy directly from the codebase.

---

**Phase 1 — Token Extraction (no screens yet)**

Before designing any screen, open the codebase and extract:

1. **Exact brand colors** — Find the Tailwind config or global CSS. Extract every color token: primary, accent, background, surface, text, border, error, success. Map each to a light-mode and dark-mode value.

2. **Typography** — Identify the font family used (likely a serif or premium sans). Extract heading sizes, body sizes, and any Arabic-specific line-height overrides.

3. **Logo asset** — Locate `/public/logo.webp` or equivalent. Note its aspect ratio and how it appears on light vs. dark backgrounds.

4. **Book cover image pattern** — Covers are hosted at `booksplatform.net/wp-content/uploads/`. Note the URL pattern for use in mockup image placeholders.

5. **Category slugs and Arabic labels** — Extract all 8 category names with their Arabic text:
   - أفكار وسياسات / ideas-and-policies
   - دراسات اجتماعية / social-studies
   - فلسفات وثقافات / philosophies-and-cultures
   - اقتصاد وتنمية / economy-and-development
   - لغات وآداب / languages-and-literature
   - تقنيات وعلوم / technologies-and-sciences
   - أديان وعقائد / religions-and-beliefs
   - أخرى / uncategorized

6. **Translation status badge labels** — Three states: مرشح للترجمة (Nominated) · مترجم (Translated) · غير مترجم (Not translated). Extract the exact colors used for each badge on the web.

⛔ Do not start any screen designs until token extraction is complete and confirmed.

---

**Phase 2 — Screen Designs**

Design the following 8 screens as hi-fi mobile mockups inside an iPhone 15 Pro frame (390×844pt). All screens must be RTL layout by default (Arabic-first), with the language toggle visibly present in the app bar. Use real content from the codebase — no lorem ipsum.

---

**Screen 1 — Home (الرئيسية)**

Layout (top to bottom):
- Status bar (9:41, signal, battery)
- App bar: logo right-aligned (RTL), language toggle (AR|EN) left, search icon left
- Hero featured book banner — large card spanning full width, showing one featured book with its cover image, title in Arabic, translation status badge (مرشح للترجمة in amber), and a CTA button "اقرأ التفاصيل ←"
- Section: "تصفّح حسب التصنيف" — horizontal scroll row of category chips (pill shape, icon + Arabic label). Show 4 visible: أفكار وسياسات, دراسات اجتماعية, فلسفات وثقافات, اقتصاد وتنمية. "الكل ←" link right side.
- Section: "صدر حديثاً" — horizontal scroll row of book cards (portrait cover + Arabic title + status badge). Show 3 partially visible cards. "عرض الكل ←" link.
- Section: "كتب مترجمة" — same card row format, 3 visible.
- Section: "أبرز دور النشر" — horizontal publisher chips with publisher name + country flag emoji + book count.
- Bottom navigation bar: 5 tabs — الرئيسية (home, active), الكتب (book), المقالات (article), الناشرون (building), + FAB center button for "انشر كتابك"

---

**Screen 2 — Books Catalog (الكتب)**

Layout:
- App bar: title "كتالوج الكتب" + book count "4,654+ كتاب", filter icon, search icon
- Filter bar: horizontal chips for active filters — translation status (الكل / مرشح / مترجم), sort order (الأحدث / الأقدم)
- Category sidebar OR top category scroll (choose whichever fits mobile better)
- Books grid: 2-column grid of BookCards. Each card: cover image (3:4 ratio), Arabic title (2 lines max), publisher name (muted), translation status badge bottom-left
- Pagination: infinite scroll with a subtle loading indicator at bottom
- Bottom nav (same as home, "الكتب" tab active)

---

**Screen 3 — Book Detail (تفاصيل الكتاب)**

Use "كتاب الذاكرة / The Book of Memory" as the example book.

Layout:
- Back arrow (RTL: right side), share icon
- Hero: large book cover image (full-width, 16:9 or top-cropped), title overlay at bottom
- Book title in Arabic: كتاب الذاكرة
- English subtitle: The Book of Memory
- Translation status badge: مرشح للترجمة
- Category chip: فلسفات وثقافات
- Bibliographic table (key-value rows):
  - دار النشر: Allen & Unwin
  - بلد النشر: المملكة المتحدة
  - اللغة الأصلية: الإنجليزية
  - عدد الصفحات: 160
  - الطبعة: First edition
  - ISBN: 9781803512648
- Action buttons: "أضف إلى السلة" (primary, full width) + "حفظ في المفضلة" (secondary, full width)
- Section: "كتب مشابهة" — horizontal scroll of 3 similar book cards
- Bottom nav (no active tab — detail screen)

---

**Screen 4 — Publishers Directory (الناشرون)**

Layout:
- App bar: title "دور النشر حول العالم" + subtitle "665 ناشر من 63 دولة"
- Search bar: "ابحث باسم الدار..."
- Country filter: horizontal scroll chips — الكل, أمريكا, المملكة المتحدة, فرنسا, مصر, ألمانيا (with flag emojis)
- Publisher list: single-column cards. Each card: publisher logo placeholder (initials circle), publisher name, country + flag, book count badge. Show 6 publishers from the real list (e.g. Simon and Schuster · Harvard University Press · Princeton University Press · Columbia University Press · Allen & Unwin · Knopf Doubleday)
- Bottom nav ("الناشرون" tab active)

---

**Screen 5 — Articles (قراءات وعروض)**

Layout:
- App bar: title "قراءات وعروض"
- Category tabs (horizontal scroll): حصاد الكتب · زبدة الأفكار · العالم يقرأ · حديث الكتب — with article count badges
- Featured article card: large thumbnail, category chip, title, short description
- Article list: vertical list of ArticleCards (thumbnail left, title + category + date right — or RTL reversed)
- Empty state for sections with no content: illustration placeholder + "لا توجد مقالات حالياً" message with a subtle retry/refresh action
- Bottom nav ("المقالات" tab active)

---

**Screen 6 — Cart (السلة)**

Layout:
- App bar: title "سلة المشتريات" + item count badge
- Cart items list: each item shows book cover (small), title, publisher, price placeholder, quantity stepper (− qty +), remove icon
- Order summary card at bottom:
  - المجموع الفرعي
  - رسوم الخدمة
  - الإجمالي (bold, larger)
- Primary CTA button: "متابعة الدفع" (full width, brand primary color)
- Empty cart state: illustration + "سلتك فارغة" + "تصفّح الكتب" button
- Bottom nav (no specific tab active)

---

**Screen 7 — Publish Your Book (انشر كتابك)**

Layout:
- App bar: title "انشر كتابك معنا" + back arrow
- Progress steps indicator at top: 3 steps — بيانات المؤلف · بيانات الكتاب · الإرسال
- Step 1 visible (بيانات المؤلف):
  - Field: اسم المؤلف * (text input)
  - Field: البريد الإلكتروني * (email input)
  - Field: رقم الهاتف (phone input)
  - Field: نبذة عن المؤلف (multiline textarea)
  - Next button: "التالي ←"
- Promo badge below form: 🎉 "الكتاب الأول مجاناً دائماً"
- Bottom nav (FAB "+" active state)

---

**Screen 8 — Search Results (نتائج البحث)**

Layout:
- Search bar at top (active state, with keyboard visible, RTL text cursor): placeholder "ابحث عن كتاب أو مؤلف أو دار نشر..."
- Recent searches chips: horizontal row — "ماركيز", "هارفارد", "فلسفة"
- Results section header: "نتائج البحث لـ «ماركيز»" + result count
- Results list: mixed cards — books and publishers in same list, differentiated by a type chip (كتاب / ناشر)
- No-results empty state variant: "لا توجد نتائج لـ «...»" + suggestion chips

---

**Design constraints for all screens:**

- RTL layout throughout (Arabic-first). All text right-aligned, icons mirrored appropriately, navigation flows right-to-left.
- Language toggle must be visible on every screen with an app bar — show "AR | EN" as a pill toggle.
- Translation status badges must use consistent colors across all screens — extract exact colors from codebase, do not invent.
- Book cover images: use colored placeholder rectangles (not gray boxes) — use the actual dominant colors from real book covers if inferable from the codebase, otherwise use the brand palette to create visually distinct cover placeholders.
- Bottom navigation: 5 items — الرئيسية · الكتب · + (FAB for publish) · المقالات · الناشرون. The FAB is centered and elevated above the nav bar.
- Typography: Arabic text needs generous line-height (1.7–1.8). Titles bold/500, body regular/400.
- No lorem ipsum anywhere. All text must be real Arabic content from the platform.
- All screens must work in both light and dark mode — show light mode as primary, note dark mode token values.

---

**Ambiguous parts — make these decisions and document them:**

- Price display: the web has no visible pricing. For the cart and book detail, design a price placeholder pattern (e.g. "السعر عند الطلب" or a mock price like "٢٥ USD") and note which you chose.
- Book description: book detail pages on the web have no description text visible. Design the description section as a placeholder "وصف الكتاب" block with a "اقرأ المزيد" expand pattern.
- Auth gate: since auth is not in this version, cart and publish form should work without login. Note this assumption.

⛔ Do not produce any screen before completing Phase 1 token extraction. Present the token sheet first, wait for approval, then proceed to all 8 screens.
