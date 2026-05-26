# Web Tools & Libraries — Books Platform

مرجع تقني شامل لكل الأدوات والمكتبات المستخدمة في بناء **منصة الكتب العالمية**.

---

## 1. Core Framework

| الأداة | الإصدار | الغرض |
|--------|---------|--------|
| **Next.js** | v15 (App Router) | الإطار الأساسي — Fullstack: SSR، SSG، API Routes، Server Components |
| **TypeScript** | v5+ | Type safety عبر كامل المشروع |
| **Node.js** | v20 LTS | بيئة التشغيل |

> **ملاحظة App Router:** كل الصفحات تعتمد `[locale]` كـ dynamic segment — `/ar/...` و `/en/...`.  
> Server Components للصفحات الثقيلة (أرشيف الكتب، المقالات، الناشرين)؛ Client Components للتفاعلية (Carousel، Filters، Search، Forms).

---

## 2. Styling & UI

| الأداة | الإصدار | الغرض |
|--------|---------|--------|
| **Tailwind CSS** | v4 | Utility-first CSS — دعم RTL مدمج، Dark Mode |
| **shadcn/ui** | latest | مكونات UI جاهزة (Dialog، Sheet، Tabs، Dropdown، Badge، Skeleton، …) |
| **lucide-react** | latest | أيقونات SVG موحدة في كل الواجهة |
| **Framer Motion** | v11+ | انيميشن: page transitions، hero entrance، book cards hover |
| **class-variance-authority (CVA)** | latest | إدارة variants للمكونات مع Tailwind |
| **tailwind-merge** | latest | دمج كلاسات Tailwind بدون تعارض |

---

## 3. Internationalization

| الأداة | الإصدار | الغرض |
|--------|---------|--------|
| **next-intl** | v3+ | ترجمة الواجهة AR/EN، routing بـ `[locale]`، `useTranslations`، `getTranslations` في Server Components، تنسيق التواريخ والأرقام |

> **RTL/LTR:** `dir="rtl"` على `<html>` في layout العربي. Tailwind v4 يدعم `rtl:` variant مدمج.

---

## 4. 3D & Visual Effects

| الأداة | الإصدار | الغرض |
|--------|---------|--------|
| **Three.js** | latest | تأثيرات ثلاثية الأبعاد: Hero الرئيسية، Book 3D viewer، خلفيات تفاعلية |
| **@react-three/fiber** | latest | React wrapper لـ Three.js — تكامل أسهل مع Next.js |
| **@react-three/drei** | latest | helpers جاهزة (OrbitControls، Sparkles، Float، Environment) |

> **متى نستخدم Three.js:** Hero الصفحة الرئيسية (جزيئات/كتب تطير)، صفحة «شاهد كتابك»، خريطة الناشرين التفاعلية اختيارياً.

---

## 5. Database & ORM

| الأداة | الإصدار | الغرض |
|--------|---------|--------|
| **PostgreSQL** | v16 | قاعدة البيانات الرئيسية |
| **Prisma** | v5+ | ORM — schema معرّف في `schema.prisma`، migrations، type-safe queries |
| **Redis (Upstash)** | latest | Caching لـ hot data (أكثر الكتب زيارة، نتائج البحث)، Session store، Rate limiting |

---

## 6. Authentication & Security

| الأداة | الإصدار | الغرض |
|--------|---------|--------|
| **jose** | latest | توقيع والتحقق من JWT (Access Token + Refresh Token) — يعمل في Edge Runtime |
| **bcryptjs** | latest | تشفير كلمات المرور |
| **HTTP-only Cookies** | — | تخزين Refresh Token بأمان (لا يُقرأ من JavaScript) |
| **Authorization Header** | — | نقل Access Token (Bearer) في كل API request |
| **Upstash Rate Limit** | latest | حماية API endpoints من الـ abuse |
| **next-auth** | 

> **نمط JWT:**  
> - Access Token: صلاحية قصيرة (15 دقيقة)، يُرسل في `Authorization: Bearer <token>`  
> - Refresh Token: صلاحية طويلة (7 أيام)، يُخزن في HTTP-only Cookie  
> - Refresh Endpoint: `/api/auth/refresh` يُصدر access token جديد  
> - Middleware Next.js يحمي المسارات المحمية ويتحقق من التوكن

---

## 7. API Documentation

| الأداة | الإصدار | الغرض |
|--------|---------|--------|
| **Swagger (OpenAPI 3.0)** | latest | توثيق كل API endpoints |
| **swagger-ui-react** | latest | واجهة تصفح التوثيق على `/api-docs` |
| **zod-to-openapi** | latest | توليد OpenAPI schema تلقائياً من Zod schemas |

---

## 8. Forms & Validation

| الأداة | الإصدار | الغرض |
|--------|---------|--------|
| **react-hook-form** | latest | إدارة الفورمز (انشر كتابك، اتصل بنا، التعليقات) — أداء عالي، لا re-renders |
| **zod** | latest | Schema validation — مستخدم في Client + Server (API routes) |
| **@hookform/resolvers** | latest | ربط zod مع react-hook-form |

---

## 9. Data Fetching & State Management

| الأداة | الإصدار | الغرض |
|--------|---------|--------|
| **TanStack Query (React Query)** | v5 | Client-side fetching: infinite scroll، مزامنة cache، refetch عند focus |
| **Zustand** | v5 | Global state: cart، wishlist، notification preferences، locale |
| **Axios** | latest | HTTP client مع interceptors لـ token refresh تلقائي |

> **متى Server Components vs Client Fetching:**  
> - Server Components: الصفحات الأولى (SEO critical)  
> - TanStack Query: pagination، infinite scroll، real-time data في الـ client

---

## 10. Search

| الأداة | الإصدار | الغرض |
|--------|---------|--------|
| **Fuse.js** | latest | Fuzzy search client-side للبحث السريع (اقتراحات فورية) |
| **cmdk** | latest | `SearchCommand` palette (الـ Ctrl+K experience) |
| **use-debounce** | latest | Debounced search input لتقليل API calls |

> للبحث الكامل على السيرفر: `WHERE title ILIKE %query%` أو Prisma full-text search. لو احتجنا scale لاحقاً → Meilisearch أو Algolia.

---

## 11. Media & Content

| الأداة | الإصدار | الغرض |
|--------|---------|--------|
| **React Player** | latest | تضمين فيديوهات YouTube/Vimeo في «شاهد كتابك»، «رواية فحكاية»، «حديث الكتب» |
| **next-mdx-remote** | latest | Render محتوى MDX للمقالات من CMS أو ملفات `content/` |
| **reading-time** | latest | حساب وقت قراءة المقال تلقائياً |
| **date-fns** | latest | تنسيق التواريخ بعدة لغات (AR/EN) |

---

## 12. Carousel & Scrolling

| الأداة | الإصدار | الغرض |
|--------|---------|--------|
| **Embla Carousel** | latest | `BookCarousel`، `PublisherMarquee`، CategoryCard horizontal scroll — lightweight وperformant |

---

## 13. Maps (Publishers Page)

| الأداة | الإصدار | الغرض |
|--------|---------|--------|
| **React Simple Maps** | latest | خريطة عالمية خفيفة لـ «الناشرون حول العالم» و«العالم يقرأ» |

> بديل أثقل لكن أجمل: **Mapbox GL JS** إن احتجنا تفاعلية أعمق (نقر على دولة يفلتر الناشرين).

---

## 14. File Upload & Storage

| الأداة | الإصدار | الغرض |
|--------|---------|--------|
| **s3 from my server in coolifyn + hetzener** | latest | رفع صور أغلفة الكتب وملفات submissions في «انشر كتابك» |
| **Cloudinary** (اختياري) | latest | CDN للصور مع resize/optimize تلقائي |

> Next.js `<Image>` يتولى optimization للصور الموجودة في الـ DB.

---

## 15. Email & Notifications

| الأداة | الإصدار | الغرض |
|--------|---------|--------|
| **Resend** | latest | إرسال إيميلات: Newsletter، تأكيد submission، إشعارات Wishlist |
| **React Email** | latest | تصميم قوالب إيميل بـ React components |
| **web-push** | latest | Web Push Notifications (Opt-in alerts لكتب جديدة) |

---

## 16. Analytics

| الأداة | الإصدار | الغرض |
|--------|---------|--------|
| **Vercel Analytics** | latest | Page views، performance، visitor insights |
| **Vercel Speed Insights** | latest | Core Web Vitals monitoring |
| **PostHog** (اختياري) | latest | Event tracking، user behavior، funnels — للـ Recommendation Engine |

---

## 17. SEO & Meta

| الأداة | الإصدار | الغرض |
|--------|---------|--------|
| **Next.js Metadata API** | built-in | `generateMetadata()` لكل صفحة — Open Graph، Twitter Cards، JSON-LD |
| **next-sitemap** | latest | توليد `sitemap.xml` و`robots.txt` تلقائياً |
| **Schema.org JSON-LD** | — | Structured data للكتب (Book schema) لتحسين Google Rich Results |

---

## 18. Code Quality & DX

| الأداة | الإصدار | الغرض |
|--------|---------|--------|
| **ESLint** | v9 | Linting مع config Next.js |
| **Prettier** | latest | تنسيق موحد للكود |
| **Husky + lint-staged** | latest | Pre-commit hooks: lint + format قبل كل commit |
| **commitlint** | latest | توحيد صيغة commit messages (Conventional Commits) |

---

## 19. Deployment & Infrastructure

| الأداة | الإصدار | الغرض |
|--------|---------|--------|
| **Vercel** | — | Hosting + CI/CD — تكامل مباشر مع Next.js |
| **Neon** (أو Supabase) | — | PostgreSQL cloud managed — Serverless-friendly |
| **Upstash Redis** | — | Redis Serverless — يعمل بدون cold start مع Vercel Edge |

---

## 20. Development Utilities

| الأداة | الإصدار | الغرض |
|--------|---------|--------|
| **dotenv** | built-in Next.js | إدارة environment variables |
| **cross-env** | latest | توافق env variables عبر OS |
| **tsx** | latest | تشغيل TypeScript scripts مباشرة (seed DB، migration scripts) |

---

## ملخص حسب Feature

| الـ Feature | الأدوات المستخدمة |
|-------------|-------------------|
| **صفحة كتاب** | Prisma + Server Component + Next Image + Embla Carousel + next-intl |
| **بحث عام** | cmdk + use-debounce + Fuse.js + TanStack Query |
| **Carousel كتب** | Embla Carousel + Framer Motion |
| **فيديو (شاهد كتابك)** | React Player + Three.js hero |
| **خريطة ناشرين** | React Simple Maps + Zustand (filter state) |
| **انشر كتابك** | react-hook-form + zod + UploadThing + Resend |
| **API (كل شيء)** | Next.js Route Handlers + Prisma + jose (JWT) + Swagger |
| **Auth (Admin)** | JWT (Access + Refresh) + bcryptjs + Upstash Rate Limit |
| **i18n AR/EN** | next-intl + Tailwind RTL |
| **3D Hero** | Three.js + @react-three/fiber + @react-three/drei |
| **Analytics** | Vercel Analytics + PostHog |
| **Push Notifications** | web-push + Upstash Redis (subscriptions store) |
| **Newsletter** | Resend + React Email |
| **SEO** | Next.js Metadata API + next-sitemap + JSON-LD |

---

## نقاط مهمة للتنفيذ

1. **Server vs Client Components:** كل صفحة أرشيف (كتب، مقالات، ناشرين) = Server Component + pagination. الـ Filters، Search، Carousel = Client Components.
2. **Token Refresh:** Axios interceptor يراقب `401` ويستدعي `/api/auth/refresh` تلقائياً قبل إعادة الـ request الأصلي.
3. **Three.js + Next.js:** استخدم `dynamic(() => import(...), { ssr: false })` لأي scene ثلاثية الأبعاد — لا تُدرج في SSR.
4. **Swagger:** كل Route Handler يحتوي JSDoc comment بـ OpenAPI format — يُجمع تلقائياً في `/api-docs`.
5. **RTL:** `tailwind.config` يفعّل `rtl` plugin، وكل component يستخدم `rtl:` prefix عند الحاجة.
6. **Images:** كل صور الكتب والناشرين من DB تُمرر عبر `next/image` مع `remotePatterns` في `next.config`.
