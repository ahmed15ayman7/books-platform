# Pages Structure Audit

مرجع المتطلبات: [`pages-structure.md`](pages-structure.md)  
آخر تحديث: مايو 2026

| المسار | أقسام مطلوبة | ما هو مُنفَّذ | فجوات |
|--------|--------------|---------------|-------|
| `/[locale]` | Hero، بحث سريع، تصنيفات 7+، صدر حديثاً، ناشرون، مقالات، CTA | Hero carousel، `CategoryGrid`، صدر حديثاً، ناشرون، حصاد/حديث، بانر نشر، إحصائيات، CTA ثلاثي | بحث سريع في الهيرو؛ مقاطع «حسب التصنيف» (4–6 كتب لكل مجال) |
| `/[locale]/books` | Hero، فلاتر، شبكة، pagination | `PageHero`، فلاتر، شبكة، `EmptyState`، pagination | — |
| `/[locale]/books/nominated-for-translation` | Hero، فلاتر، شبكة، CTA ترجمة | `PageHero` + breadcrumbs Lucide، CTA انشر كتابك، رابط للمترجمة | فلاتر لغة/دولة كاملة (جزئي عبر `BooksFilters`) |
| `/[locale]/books/translated` | Hero، شبكة، ربط بالمرشحة | `PageHero`، شبكة، رابط للمرشحة أسفل | خلفية collage أغلفة (اختياري) |
| `/[locale]/books/category/[slug]` | Hero، breadcrumbs، شبكة، تصنيفات ذات صلة | `PageHero`، شبكة، related chips | وصف سطرين للتصنيف |
| `/[locale]/books/[slug]` | Hero، وصف، مشابهة، CTA | تفاصيل + tabs + Lucide placeholder | مراجعات (لاحقاً) |
| `/[locale]/articles/*` | Hero، قائمة، featured | `ArticleChannelPage` + `PageHero` | ترتيب dropdown؛ فيديو مميز (حديث الكتب/شاهد) |
| `/[locale]/articles/[slug]` | Hero، prose، تعليقات، ذات صلة | مقال + تعليقات | كتب inline في النص |
| `/[locale]/publishers` | Hero، بحث، فلاتر، شبكة | `PageHero`، بحث، فلاتر دولة، شبكة | خريطة (اختياري) |
| `/[locale]/publishers/[slug]` | Hero، نبذة، كتب | موجود | — |
| `/[locale]/publish` | Hero، خطوات، شروط، نموذج | `PageHero` + خطوات + نموذج | accordion شروط (نص ثابت في sidebar) |
| `/[locale]/about` | Hero، فكرة، رؤية، رسالة، أهداف، تمييز، CTA | صفحة كاملة | illustration اختياري |
| `/[locale]/services` | Hero، بطاقات خدمات، CTA | 6 بطاقات + CTA اتصل بنا | infographic تفاعلي |
| `/[locale]/team` | Hero، 9 أعضاء، CTA | `TeamGrid` 9 أعضاء | صور حقيقية |
| `/[locale]/contact` | Hero، tel/mailto، نموذج، سوشيال | `PageHero` + نموذج + `SOCIAL_LINKS` | API إرسال فعلي للنموذج |
| `/[locale]/privacy` | prose + فهرس جانبي | `LegalProseLayout` | CMS/MDX لاحقاً |
| `/[locale]/terms` | نفس privacy | `LegalProseLayout` | CMS/MDX لاحقاً |

## أيقونات (Lucide)

| العنصر | الحالة |
|--------|--------|
| `brand-social-icons.tsx` + `icons/index.ts` | ✅ |
| Footer / top bar → `SOCIAL_LINKS` | ✅ |
| `EmptyState`، stats، book/article cards | ✅ |
| `desktop-nav.tsx` (غير مستخدم) | ✅ محذوف |

## مكوّنات مشتركة جديدة

- [`web/components/sections/page-hero.tsx`](web/components/sections/page-hero.tsx) — breadcrumbs بـ `ChevronRight`
- [`web/components/sections/category-grid.tsx`](web/components/sections/category-grid.tsx)
- [`web/components/sections/team-grid.tsx`](web/components/sections/team-grid.tsx)
- [`web/components/sections/legal-prose-layout.tsx`](web/components/sections/legal-prose-layout.tsx)
- [`web/components/ui/empty-state.tsx`](web/components/ui/empty-state.tsx)
