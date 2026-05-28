# وثيقة التطوير الشاملة والبرومبت الهندسي للارتقاء بمنصة الكتب العالمية 
**إصدار الخطة:** 1.2 — **تاريخ التحديث:** مايو 2026
**الهدف:** دمج الذكاء الاصطناعي (AI)، والتحليلات البيانية (Charts)، والارتقاء بتجربة المستخدم (UI/UX) وسير العمل لأعلى مستويات الاحترافية.

---

## جدول المحتويات
1. [تحليل ما تم إنجازه في المشروع](#1-تحليل-ما-تم-إنجازه-في-المشروع)
2. [البرومبت الهندسي الشامل والعميق لتحسين التصميم وتجربة المستخدم (UI/UX Master Prompt)](#2-البرومبت-الهندسي-الشامل-والعميق-لتحسين-التصميم-وتجربة-المستخدم-uiux-master-prompt)
3. [خطة التطوير الكاملة للوحة التحكم المدعومة بالذكاء الاصطناعي (AI-Powered Dashboard Blueprint)](#3-خطة-التطوير-الكاملة-لللوحة-التحكم-المدعومة-بالذكاء-الاصطناعي-ai-powered-dashboard-blueprint)
4. [هندسة نظام الرسوم البيانية وتحليل البيانات المتقدم (Charts & Data Analytics System)](#4-هندسة-نظام-الرسوم-البيانية-وتحليل-البيانات-المتقدم-charts--data-analytics-system)
5. [خطوات التنفيذ وسير العمل العملي للشركاء والمطورين](#5-خطوات-التنفيذ-وسير-العمل-العملي-للشركاء-والمطورين)

---

## 1. تحليل ما تم إنجازه في المشروع

بناءً على مراجعة البنية الحالية للمشروع وثيقة نطاق الأعمال (v1.1) وملفات المشروع، فإن ما تم إنجازه يُمثل أساساً برمجياً ممتازاً وقوياً للبناء عليه:

### أ) الهيكل البرمجي والبنية الأساسية:
* **تأسيس متكامل للـ Fullstack SPA / Hybrid:** يعتمد النظام على تطبيق Next.js مع إطار عمل حديث وتكامل قوي مع Prisma ORM للتعامل مع قاعدة بيانات PostgreSQL.
* **نظام التدويل ثنائي اللغة (Bilingual i18n):** تفعيل حزمة `next-intl` وإعداد ملفات الأقسام البرمجية المترجمة بالكامل لضمان تقديم واجهة ممتازة باللغتين العربية والإنجليزية مع تطبيق دعم اتجاه النصوص (RTL/LTR) بدقة.
* **البنية الأساسية الموزعة والمنظمة:** تصميم موديولات مقسمة بطريقة احترافية مثل (كتالوج الكتب، الميديا والبودكاست، إدارات دور النشر، نظام المشتريات والسلة، إدارة طلبات السفراء، ونظام الإشعارات الذكي).
* **الأمان وسجلات الأحداث (Audit Logs):** وجود نظام تتبع العمليات وتطبيق سجلات الأحداث التي تسجل كل عملية إضافة أو تعديل أو حذف لضمان الشفافية وقابلية التدقيق.

### ب) الفجوات الحالية التي تتطلب تدخلاً هندسياً:
* **تكامل الذكاء الاصطناعي (AI Layer):** على الرغم من وجود ركائز الذكاء الاصطناعي في نطاق العمل، إلا أن المطورين يحتاجون لآلية ربط معمارية دقيقة تمكنهم من جلب البيانات وتوليد التراجم وكتابة المنشورات تلقائياً بك فاءة عالية.
* **واجهات لوحة التحكم (Dashboard UI Density):** تحتاج لوحة التحكم الحالية إلى تحسين طريقة عرض البيانات الكبيرة لكي لا تبدو تقليدية، بل يجب تعزيزها بمحركات تحليل بياني تفاعلية (Charts) لتبسيط القرارات التشغيلية لفريق العمل.
* **تناغم تجربة المستخدم البصرية (Visual Micro-Interactions):** الارتقاء بهوية الواجهة لتصبح ناعمة ورائعة تليق بـ "منصة ثقافية عالمية"، مع تلافي العشوائية في تحريك واجهات التصفح وقوائم الكتب الكاروسيل.

---

## 2. البرومبت الهندسي الشامل والعميق لتحسين التصميم وتجربة المستخدم (UI/UX Master Prompt)

> **إرشادات الاستخدام:** انسخ هذا البرومبت بالكامل وسلّمه للمطور أو لنموذج الذكاء الاصطناعي المسؤول عن كتابة كود الفرونت-إند (Frontend) للحصول على تصميم استثنائي للمنصة.

```text
[MASTER UI/UX & INTERACTIVITY CODING PROMPT]

ROLE & CORE PHILOSOPHY:
You are a world-class UI/UX Designer and Lead Frontend Engineer specializing in high-end, editorial, and cultural digital experiences. Your goal is to transform the "منصة الكتب العالمية" website into a premium, visually engaging, responsive, and performance-optimized application. We will strictly adhere to the established CSS-first Design System tokens: Red (#B11E2E), Black (#0B0B0B), and White (#FFFFFF) to create a warm, editorial, and prestigious feel.

CRITICAL DESIGN MANDATES:
1. No "AI Slop" or Unsolicited Technical Noise: Remove any mock system logs, ping states, or fake telemetry (e.g., "PORT: 3000", "CORE_ONLINE", "STATUS: LIVE"). Margins and gutters must be pristine, minimal, and completely free of margin-clutter.
2. Editorial Typography Pairing: Ensure the layout pairings use elegant display typography. For Arabic, utilize "Tajawal" with custom letter-spacing adjustments and clean bold weighting. For English/Latin text, utilize "Inter" or "Space Grotesk" to project a modern, sophisticated cultural aesthetic.
3. Fluid Layouts & Spacing Rhythm: Implement proportional container padding of 4rem to 6rem for section spacing, employing "w-full max-w-7xl mx-auto" wrappers to block content from expanding indefinitely on ultra-wide screens.
4. Smooth Micro-Interactions & Transitions: Every hover state, card entry, and route shift must feel buttery smooth. Use "framer-motion" with custom spring configurations: "stiffness: 380, damping: 22". Book cards must lift subtly on hover ("translate-y-[-6px]") with a soft drop-shadow transition.
5. Touch & Accessibility Hardening: Ensure touch targets on mobile viewports are at least 44px. All clickable and semantic elements must possess highly visible ":focus-visible" states with focus rings colored in brand red (#B11E2E) offset by white backing.

COMPONENT SPECIFIC EXECUTION INSTRUCTIONS:

A) HOME HERO CAROUSEL:
- Implement a zero-flicker slide transitions using a smooth horizontal translation or soft cross-fade.
- Overlay a subtle radial gradient mask over backgrounds to make bold title typography pop with extreme legibility.
- Show a custom elegant, thin layout indicator bar representing the active slide instead of old, blocky circles.

B) NEW RELEASES & CATAGORY CAROUSELS:
- Integrate "Embla Carousel" with frictionless dragging enabled. We strictly forbid standard horizontal scrollbars on desktop; instead, provide hidden custom boundaries featuring elegant, minimal arrow controls that appear gracefully on hover.
- Align cards with identical relative aspect ratios (3:4 aspect ratio for book covers) and apply soft skeletal shimmer loaders for pending images.

C) BOOK DETAIL & BIBLIOGRAPHIC VIEWS:
- Adopt a modern split-panel layout: A sticky, architectural sidebar (40% width) housing the 3:4 book cover, direct-checkout call-to-actions, and social shares, perfectly paired with a spacious editorial reading lane (60% width) for translations and metadata.
- Format bibliographic metadata into a clean table structure featuring subtle borders ("border-[var(--brand-gray-200)]") and alternating muted rows.

D) SITE HEADER & NAVIGATION LANE:
- Create a sticky, dual-tier header: The top bar focuses on quick search and language-switching, and the lower bar presents the main navigation.
- Implement an elastic drawer for mobile viewports that glides out from the right/left depending on the target language locale.

Apply these instructions to the codebase now. Rely strictly on tailwind utility classes, CSS variables, and clean, componentized JSX structure to achieve a timeless, elegant digital cultural magazine feel.
```

---

## 3. خطة التطوير الكاملة للوحة التحكم المدعومة بالذكاء الاصطناعي (AI-Powered Dashboard Blueprint)

تتطلب إدارة منصة كتب عالمية ذات محتوى بـ 7 مجالات مختلفة جهداً تحريرياً ضخماً. هنا يأتي دور **الذكاء الاصطناعي التوليدي (مع محرك Gemini)** لتسريع وتحسين سير العمل ليصبح مؤتمتاً بالكامل.

---

### أ) موديول إضافة الكتب الذكي (Smart Book Insertion)

#### 1. سير العمل التشغيلي (User Flow):
1. يدخل مدير المنصة إلى قسم "إضافة كتاب" بلوحة التحكم.
2. يجد خيارين: 
   * **الخيار الأول:** إدخال رابط الكتاب الخارجي (من موقع دار نشر، Amazon، Google Books، إلخ).
   * **الخيار الثاني:** رفع ملف الكتاب المسودة (Manuscript Word/PDF) الذي قدمه المؤلف عبر قسم "انشر كتابك".
3. يضغط على زر **"مسح وتوليد بالذكاء الاصطناعي" (Scan & Generate)**.
4. يقوم النظام بتحليل الصفحة أو الملف واستخراج البيانات الوصفية بدقة مذهلة، ثم كتابة النصوص التلخيصية باللغتين العربية والإنجليزية دفعة واحدة.

---

#### 2. الخوارزمية الفلسفية لاستخراج البيانات (Metadata Extraction Layer):
يتم تدريب وإرشاد نموذج الذكاء الاصطناعي على استدعاء دوال برمجية محددة (Structured JSON Outputs) ترجع البيانات ككائن برمجي نظيف يحتوي الحقول التالية:
* **الاسم الأصلي واسم الشهرة بالعربية:** ترجمة أدبية مبهرة لعنوان الكتاب وعنوانه الفرعي.
* **اسماء المؤلفين وتراجمهم الذاتية:** جلب الأسماء بشكل صحيح والبحث عن مسيرتهم الثقافية وتوليد نبذة من 150 كلمة عنهم.
* **البيانات الببليوغرافية الصارمة:** رقم الـ ISBN، دار النشر، سنة النشر، عدد الصفحات التقريبية، الحجم، الطبعة، ولغة الكتاب الأصلية.
* **التصنيف والتوسيم التلقائي:** تصنيف الكتاب تلقائياً ضمن مجالات المنصة السبعة (تقنيات وعلوم، دراسات اجتماعية، لغات وآداب، فلسفات وثقافات، أديان وعقائد، اقتصاد وتنمية، أفكار وسياسات) مع اقتراح الكلمات المفتاحية الذكية الأكثر بحثاً.

---

#### 3. البرومبت الهندسي لمحرك الذكاء الاصطناعي لتوليد بيانات الكتب بدقة (Master AI Book Ingester Prompt):

```text
[SYSTEM PROMPT FOR STRUCTURED BOOK METADATA GENERATION]

CONTEXT:
You are an expert literary curator, native bilingual (Arabic/English) translator, and bibliographic database specialist. Your task is to process raw text, raw URL scrapes, or files concerning a newly published book and output a highly accurate, structured JSON object that fits our precise bibliographic schema.

INPUT DATA PROVIDED:
[INSERT RAW DATA / TEXT / WEB SCRAPE / PDF EXTRACTION HERE]

PROCESSING REQUIREMENTS:
1. Title Localization: Extract the original title of the book. Translate it into a highly captivating, literary-grade Arabic title.
2. Author Bios: Identify All authors. Search/synthesize a highly professional biography for each author. Provide the bio in both Arabic (max 150 words) and English (max 150 words).
3. Bibliographic Extraction: Identify and structure: ISBN-10 or ISBN-13, original publisher, publication year (integer), original language (ISO 2-letter code), page count (integer), and edition details.
4. Pre-defined Categorization: Map the book to exactly ONE of our 7 platform categories:
   - "technology-science" (تقنيات وعلوم)
   - "social-studies" (دراسات اجتماعية)
   - "languages-literature" (لغات وآداب)
   - "philosophy-culture" (فلسفات وثقافات)
   - "religions-beliefs" (أديان وعقائد)
   - "economics-development" (اقتصاد وتنمية)
   - "ideas-politics" (أفكار وسياسات)
5. Editorial Summaries (Bilingual): Write a beautifully crafted, compelling, and academic-grade book summary. You must deliver:
   - "shortDescAr": Arabic hook (max 80 words)
   - "shortDescEn": English hook (max 80 words)
   - "descriptionAr": Rich Arabic overview of core theses, arguments, and chapters (300 to 500 words, structured with HTML tags like <p>, <ul>, <li>)
   - "descriptionEn": Rich English overview mirroring the Arabic version (300 to 500 words with HTML)
6. Tag Generation: Generate 5 specific, high-intent product tags/keywords relevant to the book theme.

JSON SCHEMA COMPLIANCE:
You must output ONLY a valid JSON object matching the following fields. Do not include markdown code block wrappings (```json) or conversational preamble. Return only the raw stringified JSON representing:
{
  "nameEn": "",
  "nameAr": "",
  "isbn": "",
  "language": "",
  "publicationYear": 2026,
  "publisherName": "",
  "categorySlug": "",
  "authors": [
    { "name": "", "nameAr": "", "bio": "", "bioAr": "" }
  ],
  "shortDesc": "",
  "shortDescAr": "",
  "description": "",
  "descriptionAr": "",
  "tags": []
}
```

---

### ب) موديول الترجمة التحريرية الذاتية (Contextual Translation Module)

#### 1. الفكرة وفوائدها:
عند مراجعة المقالات في الموديولات التحريرية (World Reads, Book Harvest, Essence of Ideas)، يكتب المحررون المقال باللغة العربية. يقوم هذا الموديول بترجمة كاملة واحترافية للمقال إلى الإنجليزية بضغطة زر واحدة، محافظاً على صياغة صحفية ثقافية جذابة تختلف عن محركات الترجمة الحرفية العامة.

---

#### 2. البرومبت الهندسي للترجمة التحريرية الثنائية (Master Translation Prompt):

```text
[SYSTEM PROMPT FOR CULTURAL/EDITORIAL JOURNALISTIC TRANSLATION]

CONTEXT:
You are an award-winning bilingual editor translating intellectual and cultural essays from Arabic to English (and vice versa). You understand nuances, metaphors, and cultural contexts of literary discussions.

INPUT TEXT TO TRANSLATE:
[INSERT USER ARTICLE BODY / TEXT HERE]

INSTRUCTIONS:
1. Translate the provided text while preserving the analytical, prestigious, and elegant vocabulary expected of literary journals.
2. Avoid literal word-for-word translations. Adapt metaphors, idioms, and compound phrases to sound natural and contextually deep in the target language.
3. Keep markdown syntax, paragraphs, list bullets, or inline tags completely intact during translation.
4. Output only the translated content, free of any comments, preambles, or postscripts.
```

---

### ج) موديول توليد منشورات السوشيال ميديا والتسويق (Smart Social Auto-Post Generator)

#### 1. آلية العمل (Mechanism):
عند تغيير حالة كتاب ما إلى "منشور" (Published) أو "مترجم" (Translated)، تظهر نافذة للمدير تمكنه من كتابة منشورات تسويقية وتوليد الكابشنز بضغطة زر واحدة لشبكات التواصل المتعددة وفقاً لخصائص كل منصة:
* **فيسبوك (Facebook):** منشورات تفصيلية تحكي قصة الكتاب بأسلوب جذاب وتشجع على القراءة والتفاعل.
* **إكس (X):** تغريدات قصيرة مركزة ومثيرة للاهتمام لا تتجاوز 280 حرفاً، ممتازة للتداول وزيادة الوعي الفوري.
* **إنستغرام (Instagram):** منشور يعتمد على النقاط وجذب الانتباه الفوري، مع توفير توجيه بنسخ النص لسهولة مشاركته من قِبل المشرفين مع صور الغلاف.

---

#### 2. البرومبت الهندسي المخصص للتسويق الرقمي (Master Social Auto-Post Generator Prompt):

```text
[SYSTEM PROMPT FOR HIGH-CONVERSION SOCIAL CAMPAIGN GENERATION]

CONTEXT:
You are an expert digital marketer and copywriter specializing in global book marketing and publishing campaigns. Your goal is to write custom, high-converting social media posts based on the provided book metadata.

INPUT BOOK DATA:
- Title: [INSERT TITLE]
- Category: [INSERT CATEGORY]
- Hook/Summary: [INSERT SUMMARY]
- Target URL: [INSERT URL]

CREATIVE OUTPUT MANDATES:
You must generate exactly three block variations:

1. FACEBOOK POST (العربية):
- Tone: Cultural, intriguing, intellectual.
- Structure: Clear opening hook, 3 key bullet points summarizing why this book matters, and a clear "Call to Action" prompting readers to browse and purchase the book on our platform. Include hashtags: #منصة_الكتب_العالمية, #[CategorySlug], #كتب_جديدة.

2. X (TWITTER) POST (العربية):
- Length: Strictly under 260 characters (excluding URL space).
- Tone: Urgent, highly impactful, punchy.
- Content: One provocative question or powerful intellectual quote from the summary, followed by a link. Must include hashtags: #كتاب_اليوم, #منصة_الكتب.

3. INSTAGRAM POST (العربية):
- Tone: Highly visual, energetic, young.
- Structure: Start with a series of emojis relevant to the book category. Write a passionate, brief description. Add a spacer block and a curated set of 10 relevant hashtags. Add a "Link in Bio" CTA.

Format the output clearly separating each platform using labeled markdown block headers. Return only the generated campaign text.
```

---

## 4. هندسة نظام الرسوم البيانية وتحليل البيانات المتقدم (Charts & Data Analytics System)

لتمكين فريق الإدارة والتسويق من اتخاذ قرارات ذكية مبنية على البيانات الحقيقية والامتثال لتعليمات نطاق الأعمال (Section 16L & Module 20)، يجب تأسيس لوحات تتبع بيانية رسومية غنية بالمحاور التفاعلية (باعتماد Recharts أو D3.js في واجهات فرونت-إند لوحة التحكم).

هنا تفصيل وتوزيع الواجهات البيانية المقترح دمجها باللوحة:

```
┌────────────────────────────────────────────────────────────────────────┐
│                        ADMIN ANALYTICS DASHBOARD                       │
├───────────────────────────────────┬────────────────────────────────────┤
│ 1. SALES & COUPOUN TRENDS (CHART) │ 2. READER CATEGORIES (PIE CHART)  │
│ [Line/Area: Daily Rev vs. orders]  │ [Visual distribution of 7 domains] │
├───────────────────────────────────┼────────────────────────────────────┤
│ 3. COUPOUNS & RECOVERY (BAR CHART)│ 4. TOP AMBASSADORS PERFORMANCE     │
│ [Abandoned Carts vs. Recovered]   │ [Bar: Sales driven per partner]    │
└───────────────────────────────────┴────────────────────────────────────┘
```

---

### أ) لوحة تتبع المبيعات والمشتريات (Sales, Revenue & Coupons Area Chart)

#### 1. تفاصيل الرسوم البيانية المطلوبة:
* **الأداة المقترحة بصرياً:** مخطط مساحي متداخل تفاعلي (Interactive Area/Line Chart) مع محاور مرنة للوقت (يومي، أسبوعي، شهري).
* **المحور الأفقي (X-Axis):** التواريخ في النطاق الزمني المحدد.
* **المحور العمودي الأيمن (Y-Axis):** قيمة الإيرادات الإجمالية بالعملة المحددة (ج.م أو USD).
* **المحور العمودي الأيسر (Y-Axis Secondary):** عدد الطلبات المكتملة كأعمدة أو خط فرعي.
* **معلومات التوليد والتصفية (Interactive Tooltips):** عند الوقوف على أي نقطة، يظهر مربع معلومات منبثق (Tooltip) يعرض:
  * إجمالي الإيرادات في اليوم.
  * عدد الطلبات المكتملة.
  * قيمة الكوبونات المخصومة المستخدمة في ذلك التاريخ.
  * عدد السلال التي تم استردادها بفعل نظام "الاسترداد الإلكتروني" (Abandoned Cart Recovery).

---

### ب) لوحة اهتمامات القراء وتوزيع المجالات (Reader Category Distribution Pie Chart)

#### 1. تفاصيل الرسوم البيانية المطلوبة:
* **الأداة المقترحة بصرياً:** مخطط دائري مجوّف (Donut/Pie Chart) لعرض نسب المساهمة ونقاط الثقل الجماهيري بالموقع.
* **وحدات البيانات (Datapoints):** المجالات السبعة الرئيسية للمنصة إضافة لقنوات الترجمة (مترجمة / مرشحة).
* **معلومات التفاعل والحركة (Visual Interaction):**
  * يتم تلوين كل قسم بلون متدرج متبادلاً بين درجات الأحمر القاني للبراند، والرمادي الصخري، والأسود ليعطي طابعاً ذكياً يتناسق مع توجهات المنصة.
  * يتيح النقر على أي شريحة من المخطط الدائري فلترة الجدول السفلي لعرض الكتب المنتمية لهذا التصنيف فقط تلقائياً.
  * يُظهر قسماً خاصاً بتحليل **"الكلمات البحثية التي لم تسفر عن نتائج" (Search queries with zero results)** ليكون بمثابة مرجع توريد ذكي لفريق المشتريات والترجمة للبحث عن كتب تناسب اهتمامات المستخدمين التي يعجز محرك البحث عن توفيرها حالياً.

---

### ج) لوحة أداء قنوات شركاء التسويق والسفراء (Ambassador Metrics Bar Chart)

#### 1. تفاصيل الرسوم البيانية المطلوبة:
* **الأداة المقترحة بصرياً:** مخطط الأعمدة المتراكمة والمقارنة (Stacked Bar Chart).
* **الهدف الاستراتيجي:** تقييم كفاءة برنامج السفراء والأرباح الناتجة موازنةً مع الزيارات الواردة.
* **المحور الأفقي (X-Axis):** أسماء السفراء المعتمدين بالبرنامج (Ambassadors).
* **المحور العمودي (Y-Axis):** القيم الإحصائية المقسمة إلى:
  * **العمود الأول (الأزرق/الرمادي الداكن):** عدد نقرات روابط الإحالة (Total Click count).
  * **العمود الثاني المتراص (الأحمر):** عدد المبيعات الفعلية الناتجة (Conversions driven).
* **مؤشرات الفعالية (Calculated KPIs):** يعرض رسماً بيانياً دائرياً فرعياً يوضح "معدل التحويل المتوسط" (Average ambassador conversion rate). هذا المخطط يمكّن الإدارة من تصفية السفراء الأكثر كفاءة والذين يمتلكون تأثيراً حقيقياً مقارنة بأولئك الذين يملكون عدداً ضخماً من النقرات عديمة التحويل الشرائي الفعلي.

---

### د) لوحة تحليل استرداد السلة المتروكة (Abandoned Cart Recovery Funnel)

#### 1. تفاصيل الرسوم البيانية المطلوبة:
* **الأداة المقترحة بصرياً:** مخطط مسار قمعي تفاعلي (Conversion Funnel Chart).
* **المراحل الممثلة (Funnel Stages):**
  1. **المرحلة الأولى:** السلال المتروكة الإجمالية التي بدأ المستخدمون كتابة بريدهم فيها بصفحة الخروج ولم يشتروا (100% - المرجعي).
  2. **المرحلة الثانية:** رسائل الاسترداد الإلكترونية التي تم إرسالها تلقائياً للمستخدمين بعد الفترة الزمنية المضبوطة (مثلاً 24 ساعة).
  3. **المرحلة الثالثة:** معدلات فتح الرسائل وقراءة محتواها (Emails Opened).
  4. **المرحلة الرابعة:** النقرات الواردة من الرسائل للعودة مجدداً لصفحة الدفع (Click-through to Checkout).
  5. **المرحلة الخامسة:** المبيعات المكتملة الفعالة باستخدام أكواد الخصم التسويقية المولدة (Recovered Carts).
* **العائد الاستثماري (ROAS Metrics):** يعرض مربع أرقام يسجل القيمة الإجمالية للأموال المستردة بفضل تفعيل هذا المحرك الذكي في فترات تصفية مرنة (يومية / شهرياً).

---

## 5. خطوات التنفيذ وسير العمل العملي للشركاء والمطورين

لضمان تحول هذه الرؤى والخطط الفلسفية إلى نظام برمجي قائم يخدم سير العمل الفعلي لـ "منصة الكتب العالمية"، يوصى بإدراج هذا الملف في جذر المشروع (Root folder) ليكون مرجعاً للفريق الفني في كل مراحله وخطواته التنفيذية بالتسلسل الآلي المقترح:

1. **الخطوة الأولى (التنفيذ البصري الشامل):** تمرير البرومبت المذكور في [القسم الثاني](#2-البرومبت-الهندسي-الشامل-والعميق-لتحسين-التصميم-وتجربة-المستخدم-uiux-master-prompt) لمطوري الواجهة الأمامية أو للذكاء الاصطناعي البرمجي لتعديل كود وهيكل تصفح الهيرو، وقوائم الكاروسيل، وعناصر الهيدر والفوتر والـ CSS Variables بالكامل لتلبية معايير الديزاين سيستم الأنيق.
2. **الخطوة الثانية (تكامل موديول الإضافة المدعوم بـ AI):** إقرار السيراميك المعماري لإنشاء API handlers في Express/Next JS تسمى `/api/v1/admin/ai/suggest` لتلقي الرابط أو النص وتصدير JSON المهيكل المعرف بالبرومبت في [القسم الثالث](#3-خطة-التطوير-الكاملة-لللوحة-التحكم-المدعومة-بالذكاء-الاصطناعي-ai-powered-dashboard-blueprint) بالاستعانة بمحرك Gemini API.
3. **الخطوة الثالثة (توليد الرسوم البيانية لوحدة التحليلات):** جلب البيانات الإحصائية في لوحة التحكم وتغذيتها لرسومات Recharts أو D3 المتفاعلة بمحاورها الدائرية والمساحية كما تم تدقيقه هندسياً في [القسم الرابع](#4-هندسة-نظام-الرسوم-البيانية-وتحليل-البيانات-المتقدم-charts--data-analytics-system)، لتتحول لوحة التحكم لمنصة عمل متكاملة تقود التحليل وتقارير B2B الذكية.

---
**تم إعداد وحفظ هذه الوثيقة لمشرفي ومطوري منصة الكتب العالمية لبدء التنفيذ الفوري والارتقاء بأكبر فاعلية وكفاءة ممكنة للمشروع الثقافي العظيم.**
