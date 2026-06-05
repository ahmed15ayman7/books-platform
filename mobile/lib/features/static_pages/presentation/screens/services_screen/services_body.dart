import 'package:flutter/material.dart';
import 'package:flutter_screenutil/flutter_screenutil.dart';
import 'package:google_fonts/google_fonts.dart';

import 'package:booksplatform/core/theme/app_colors.dart';
import 'package:booksplatform/features/static_pages/presentation/widgets/belief_band.dart';
import 'package:booksplatform/features/static_pages/presentation/widgets/info_page_hero.dart';
import 'package:booksplatform/features/static_pages/presentation/widgets/section_title.dart';

import '../../helpers/bilingual_helper.dart';

// ignore_for_file: lines_longer_than_80_chars

// ── Content ────────────────────────────────────────────────────────────────

const _pageTitle = (ar: 'خدماتنا', en: 'Our Services');
const _heroSubtitle = (
  ar: 'خدمات جديدة ومميّزة وغير مسبوقة تقدّمها منصة الكتب العالمية للقارئ والمؤلّف والناشر والمترجم',
  en: 'New, distinctive and unprecedented services from Books Platform for readers, authors, publishers and translators',
);

const _listTitle = (ar: 'خدمات المنصة', en: 'Platform services');
const _listIntro = (
  ar: 'نوفّر خدمات جديدة ومميّزة وحصرية للقارئ والمؤلّف والناشر والمترجم، وفق ما يلي:',
  en: 'We offer new, distinctive and exclusive services for readers, authors, publishers and translators, as follows:',
);
const _servicesList = [
  (ar: 'رصد والتقاء أحدث الكتب الصادرة في العالم بكل اللغات وفي كافة التصنيفات.', en: 'Tracking the newest books worldwide, in every language and category.'),
  (ar: 'تقديم بيانات كاملة ووافية عن جديد الكتب في القسمين العربي والأجنبي.', en: 'Providing complete data on new books in both the Arabic and foreign sections.'),
  (ar: 'نشر بيانات الكتب في القسم المخصّص لها على المنصة بحسب تصنيفها.', en: 'Publishing book data in its dedicated section by classification.'),
  (ar: 'إعداد نشرات إخبارية يومية وفيديوهات وبودكاست عن أهمّ الكتب.', en: 'Producing daily bulletins, videos and podcasts on the most notable books.'),
  (ar: 'إعداد تقارير تحليلية مجمّعة لحصاد الكتب العربية والأجنبية تصدر أسبوعيًا.', en: 'Compiling weekly analytical round-ups of Arab and foreign books.'),
  (ar: 'تقديم خدمات تفاعلية وأدوات للتشبيك بين كافة عناصر العملية الثقافية.', en: 'Offering interactive tools that link every part of the cultural process.'),
  (ar: 'تعريف الناشرين العرب بالكتب الأجنبية الجديدة وترشيحها للترجمة.', en: 'Introducing Arab publishers to new foreign books and nominating them for translation.'),
  (ar: 'التنسيق مع المترجمين الراغبين في نيل حقوق ترجمة الكتب الأجنبية.', en: 'Coordinating with translators seeking foreign-book translation rights.'),
  (ar: 'التعريف بالأبحاث والمؤلّفات العربية الجديدة التي لم تُنشر بعد.', en: 'Showcasing new Arab research and works not yet published.'),
  (ar: 'التسويق الشبكي عبر منصّات التواصل الاجتماعي وقوائم بريدية خاصة بالقرّاء والباحثين.', en: 'Network marketing across social media and dedicated reader and researcher mailing lists.'),
  (ar: 'تسهيل شراء الكتب الجديدة بالإحالة إلى مصدر البيع وموقع الناشر، أو عبر الدفع الإلكتروني وشرائها مباشرة من المنصة.', en: 'Easing new-book purchases via the seller and publisher, or buying directly through the platform\'s e-payment.'),
];

const _mapTitle = (ar: 'خريطة مكوّنات المنصة', en: 'Map of platform components');
const _components = [
  (
    icon: Icons.menu_book_rounded,
    title: (ar: 'أقسام الكتب', en: 'Book sections'),
    desc: (ar: 'سبعة أقسام رئيسية تغطّي تصنيفات الكتب في جميع المجالات العلمية والمعرفية، وتُنشر بيانات وعروض الكتب مع الأغلفة في القسم المخصّص لها.', en: 'Seven main sections covering all scholarly classifications; book data, previews and covers appear in their dedicated section.'),
    chips: ['تقنيات وعلوم', 'دراسات اجتماعية', 'لغات وآداب', 'فلسفات وثقافات', 'أديان وعقائد', 'اقتصاد وتنمية', 'أفكار وسياسات'],
  ),
  (
    icon: Icons.translate_rounded,
    title: (ar: 'كتب مرشّحة للترجمة', en: 'Nominated for translation'),
    desc: (ar: 'قسم لعرض أحدث وأهمّ الكتب المنشورة على المنصة من كل الأقسام والتصنيفات ومن جميع اللغات.', en: 'A section featuring the newest and most important books across all sections, categories and languages.'),
    chips: <String>[],
  ),
  (
    icon: Icons.bookmark_rounded,
    title: (ar: 'كتب مترجمة', en: 'Translated books'),
    desc: (ar: 'قسم خاص يقدّم أحدث الكتب الأجنبية المترجمة إلى العربية.', en: 'A dedicated section presenting the latest foreign books translated into Arabic.'),
    chips: <String>[],
  ),
  (
    icon: Icons.account_balance_outlined,
    title: (ar: 'ناشرون', en: 'Publishers'),
    desc: (ar: 'صفحة تعريفية لدور النشر العربية والأجنبية، مصنّفة بحسب البلد، ومربوطة بكتبها المنشورة وموقعها وبريدها الإلكتروني.', en: 'Profile pages for Arab and foreign publishers, sorted by country and linked to their published books, site and email.'),
    chips: <String>[],
  ),
  (
    icon: Icons.add_circle_outline_rounded,
    title: (ar: 'انشر كتابك', en: 'Publish your book'),
    desc: (ar: 'يعرض نبذات عن أعمال المؤلّفين والأدباء التي لم تُطبع بعد، والأطروحات الأكاديمية للباحثين، بهدف ترويجها وتعريف الناشرين بها.', en: 'Showcases unpublished works by authors and writers and academic theses, to promote them to publishers.'),
    chips: <String>[],
  ),
  (
    icon: Icons.newspaper_rounded,
    title: (ar: 'حصاد الكتب', en: 'Book Harvest'),
    desc: (ar: 'تقارير دورية متخصّصة لأهمّ الكتب الصادرة في الأدب والفكر والثقافة والعلوم والفنون — لكل تصنيف تقرير منفصل.', en: 'Periodic specialized reports on top books in literature, thought, culture, sciences and arts — one per category.'),
    chips: <String>[],
  ),
  (
    icon: Icons.article_outlined,
    title: (ar: 'العالم يقرأ', en: 'The World Reads'),
    desc: (ar: 'أخبار ونشرات صحفية يومية عن أهمّ الكتب الصادرة حديثًا.', en: 'Daily news and press bulletins on the most important newly released books.'),
    chips: <String>[],
  ),
  (
    icon: Icons.mic_none_rounded,
    title: (ar: 'شاهد كتابك', en: 'Watch Your Book'),
    desc: (ar: 'فيديوهات قصيرة عن أهمّ الكتب الأجنبية والعربية الصادرة حديثًا، مرتبطة بقناة اليوتيوب ومنصّات السوشيال ميديا.', en: 'Short videos on the latest foreign and Arab books, linked to YouTube and social platforms.'),
    chips: <String>[],
  ),
  (
    icon: Icons.lightbulb_outline_rounded,
    title: (ar: 'زبدة الأفكار', en: 'Essence of Ideas'),
    desc: (ar: 'قسم خاص يقدّم قراءات تحليلية ومعمّقة للكتب المهمّة الصادرة حديثًا.', en: 'A section offering deep, analytical readings of important new books.'),
    chips: <String>[],
  ),
  (
    icon: Icons.auto_stories_rounded,
    title: (ar: 'رواية في حكاية', en: 'A Novel in a Story'),
    desc: (ar: 'فيديوهات مختصرة للروايات الشهيرة لكبار الأدباء العرب والعالميين، في قالب سينمائي مبتكر.', en: 'Short videos on famous novels by leading Arab and world authors, in an innovative cinematic style.'),
    chips: <String>[],
  ),
  (
    icon: Icons.headphones_rounded,
    title: (ar: 'حديث الكتب', en: 'Books Talk'),
    desc: (ar: 'مقاطع صوتية عن الكتب الجديدة في عرض سريع وموجز (3–5 دقائق).', en: 'Audio clips on new books in a quick, concise format (3–5 minutes).'),
    chips: <String>[],
  ),
];

const _biblioTitle = (ar: 'ببليوجرافيا المنصة', en: 'Platform bibliography');
const _biblio = (
  ar: 'من أهمّ مخرجات المنصة توفير بيانات ببليوجرافية حديثة وكاملة عن الكتب الجديدة الصادرة في العالم. يقدّم المشروع خدمة توفير هذه البيانات المتجدّدة «يوميًا» إلى المكتبات الوطنية ومراكز البحوث ودور النشر العربية الكبرى المعنية بالترجمة، ويُنتقى نوع الكتب من بين أحدث الإصدارات في جميع أنحاء العالم وبكل اللغات؛ طبقًا لمعايير محدّدة تراعي مجالات الجهة المستفيدة.',
  en: 'A core output is fresh, complete bibliographic data on new books worldwide. The project delivers this data — updated daily — to national libraries, research centers and major Arab publishers, with titles selected from the latest global releases by defined criteria.',
);

const _outputsTitle = (ar: 'مخرجات ومنتجات المنصة', en: 'Platform outputs & products');
const _outputs = [
  (
    title: (ar: 'مخرجات ببليوغرافية', en: 'Bibliographic outputs'),
    desc: (ar: 'بيانات حديثة ومتجدّدة عن الكتب الجديدة الصادرة في العالم مترجمة إلى العربية.', en: 'Fresh, recurring data on new books worldwide translated into Arabic.'),
    who: (ar: 'المكتبات الوطنية · الجامعات ومراكز البحوث · دور النشر · الباحثون والمترجمون', en: 'National libraries · Universities & research centers · Publishers · Researchers & translators'),
  ),
  (
    title: (ar: 'مخرجات صحفية', en: 'Press outputs'),
    desc: (ar: 'خدمة خبرية يومية عن أخبار الكتب.', en: 'A daily news service on books.'),
    who: (ar: 'الصحف والمجلات · المواقع الإلكترونية · القنوات التلفزيونية', en: 'Newspapers & magazines · Websites · TV channels'),
  ),
  (
    title: (ar: 'مخرجات بحثية', en: 'Research outputs'),
    desc: (ar: 'تقارير خاصة ونوعية مجمّعة وتحليلية عن الكتب الجديدة، تصدر أسبوعيًا وشهريًا.', en: 'Curated, analytical reports on new books, issued weekly and monthly.'),
    who: (ar: 'مراكز البحوث والدراسات · المجلات العلمية المتخصّصة', en: 'Research centers · Specialized scholarly journals'),
  ),
  (
    title: (ar: 'مخرجات صوتية ومرئية', en: 'Audio & video outputs'),
    desc: (ar: 'إنتاج بودكاست وفيديوهات عن أهمّ الكتب.', en: 'Podcasts and videos on the most notable books.'),
    who: (ar: 'القنوات التلفزيونية والإذاعية · قنوات اليوتيوب والإنستغرام والتيك توك', en: 'TV & radio channels · YouTube, Instagram & TikTok'),
  ),
  (
    title: (ar: 'مخرجات السوشيال ميديا', en: 'Social media outputs'),
    desc: (ar: 'صفحات متخصّصة بأخبار وعروض الكتب الأجنبية الجديدة.', en: 'Dedicated pages for news and previews of new foreign books.'),
    who: (ar: 'الجمهور العربي على منصّات السوشيال ميديا', en: 'Arab audiences across social platforms'),
  ),
];

const _closing = (
  ar: 'ليست القصة هي عرض الكتب والتعريف بها وحدها، بل نهدف إلى جمع كل عناصر العملية الثقافية — من كُتّاب وناشرين ومترجمين وقرّاء — لتصبح المنصة منشّطًا لحركة الترجمة ومحرّكًا لصناعة النشر.',
  en: 'Beyond presenting books, we aim to unite every part of the cultural process — writers, publishers, translators and readers — so the platform becomes an engine for translation and publishing.',
);

// ── Widget ─────────────────────────────────────────────────────────────────

class ServicesBody extends StatelessWidget {
  const ServicesBody({super.key, required this.lang});

  final String lang;

  @override
  Widget build(BuildContext context) {
    final cardDecor = BoxDecoration(
      color: AppColors.surface,
      border: Border.all(color: AppColors.divider),
      borderRadius: BorderRadius.circular(22.r),
      boxShadow: [
        BoxShadow(
          color: Colors.black.withValues(alpha: 0.05),
          blurRadius: 24,
          offset: const Offset(0, 4),
        ),
      ],
    );

    return Column(
      crossAxisAlignment: CrossAxisAlignment.start,
      children: [
        InfoPageHero(
          icon: Icons.work_outline_rounded,
          title: localizedText(_pageTitle, lang),
          subtitle: localizedText(_heroSubtitle, lang),
        ),

        // ── Services list ─────────────────────────────────────────────────
        _Section(
          child: Column(
            children: [
              SectionTitle(title: localizedText(_listTitle, lang)),
              Padding(
                padding: EdgeInsets.only(bottom: 16.h),
                child: Text(
                  localizedText(_listIntro, lang),
                  textAlign: TextAlign.center,
                  style: GoogleFonts.tajawal(
                    fontSize: 15.sp,
                    color: AppColors.textSecondary,
                    height: 1.8,
                  ),
                ),
              ),
              Container(
                decoration: cardDecor,
                padding:
                    EdgeInsetsDirectional.fromSTEB(18.w, 8.h, 18.w, 8.h),
                child: Column(
                  children: List.generate(_servicesList.length, (i) {
                    final isLast = i == _servicesList.length - 1;
                    return Container(
                      decoration: isLast
                          ? null
                          : BoxDecoration(
                              border: Border(
                                bottom:
                                    BorderSide(color: AppColors.divider),
                              ),
                            ),
                      padding: EdgeInsets.symmetric(vertical: 15.h),
                      child: Row(
                        crossAxisAlignment: CrossAxisAlignment.start,
                        children: [
                          Container(
                            width: 28.r,
                            height: 28.r,
                            decoration: BoxDecoration(
                              color: AppColors.primary,
                              shape: BoxShape.circle,
                            ),
                            alignment: Alignment.center,
                            child: Text(
                              '${i + 1}',
                              style: GoogleFonts.cairo(
                                fontSize: 12.5.sp,
                                fontWeight: FontWeight.w800,
                                color: Colors.white,
                              ),
                            ),
                          ),
                          SizedBox(width: 14.w),
                          Expanded(
                            child: Text(
                              localizedText(_servicesList[i], lang),
                              style: GoogleFonts.tajawal(
                                fontSize: 14.sp,
                                color: AppColors.textPrimary,
                                height: 1.75,
                              ),
                            ),
                          ),
                        ],
                      ),
                    );
                  }),
                ),
              ),
            ],
          ),
        ),

        // ── Components map ────────────────────────────────────────────────
        _Section(
          child: Column(
            children: [
              SectionTitle(title: localizedText(_mapTitle, lang)),
              Column(
                children: _components.map((c) {
                  return Padding(
                    padding: EdgeInsets.only(bottom: 12.h),
                    child: Container(
                      decoration: cardDecor,
                      padding: EdgeInsetsDirectional.fromSTEB(
                          16.w, 18.h, 16.w, 18.h),
                      child: Column(
                        crossAxisAlignment: CrossAxisAlignment.start,
                        children: [
                          Row(
                            crossAxisAlignment: CrossAxisAlignment.start,
                            children: [
                              Container(
                                width: 44.r,
                                height: 44.r,
                                decoration: BoxDecoration(
                                  color: AppColors.brandRedSoft,
                                  borderRadius:
                                      BorderRadius.circular(12.r),
                                ),
                                child: Icon(c.icon,
                                    color: AppColors.primary, size: 22.r),
                              ),
                              SizedBox(width: 13.w),
                              Expanded(
                                child: Column(
                                  crossAxisAlignment:
                                      CrossAxisAlignment.start,
                                  children: [
                                    Text(
                                      localizedText(c.title, lang),
                                      style: GoogleFonts.cairo(
                                        fontSize: 16.5.sp,
                                        fontWeight: FontWeight.w800,
                                        color: AppColors.textPrimary,
                                      ),
                                    ),
                                    SizedBox(height: 6.h),
                                    Text(
                                      localizedText(c.desc, lang),
                                      style: GoogleFonts.tajawal(
                                        fontSize: 13.5.sp,
                                        color: AppColors.textSecondary,
                                        height: 1.75,
                                      ),
                                    ),
                                  ],
                                ),
                              ),
                            ],
                          ),
                          if (c.chips.isNotEmpty) ...[
                            SizedBox(height: 13.h),
                            Wrap(
                              spacing: 7.w,
                              runSpacing: 7.h,
                              children: c.chips
                                  .map((ch) => Container(
                                        padding: EdgeInsets.symmetric(
                                            horizontal: 11.w,
                                            vertical: 5.h),
                                        decoration: BoxDecoration(
                                          color: AppColors.inputFill,
                                          border: Border.all(
                                              color: AppColors.divider),
                                          borderRadius:
                                              BorderRadius.circular(999),
                                        ),
                                        child: Text(
                                          ch,
                                          style: GoogleFonts.cairo(
                                            fontSize: 12.sp,
                                            fontWeight: FontWeight.w700,
                                            color: AppColors.textPrimary,
                                          ),
                                        ),
                                      ))
                                  .toList(),
                            ),
                          ],
                        ],
                      ),
                    ),
                  );
                }).toList(),
              ),
            ],
          ),
        ),

        // ── Bibliography — red gradient panel ─────────────────────────────
        _Section(
          child: Container(
            decoration: BoxDecoration(
              gradient: LinearGradient(
                begin: AlignmentDirectional.topStart,
                end: AlignmentDirectional.bottomEnd,
                colors: [AppColors.primary, AppColors.primaryDark],
              ),
              borderRadius: BorderRadius.circular(24.r),
            ),
            clipBehavior: Clip.hardEdge,
            child: Stack(
              children: [
                PositionedDirectional(
                  end: 18.r,
                  top: 18.r,
                  child: Icon(Icons.bookmark_rounded,
                      color: Colors.white.withValues(alpha: 0.9),
                      size: 30.r),
                ),
                PositionedDirectional(
                  start: -30.r,
                  bottom: -34.r,
                  child: Container(
                    width: 130.r,
                    height: 130.r,
                    decoration: BoxDecoration(
                      color: Colors.white.withValues(alpha: 0.08),
                      shape: BoxShape.circle,
                    ),
                  ),
                ),
                Padding(
                  padding: EdgeInsets.all(26.r),
                  child: Column(
                    crossAxisAlignment: CrossAxisAlignment.start,
                    children: [
                      Text(
                        localizedText(_biblioTitle, lang),
                        style: GoogleFonts.cairo(
                          fontSize: 24.sp,
                          fontWeight: FontWeight.w800,
                          color: Colors.white,
                          height: 1.25,
                        ),
                      ),
                      SizedBox(height: 14.h),
                      Text(
                        localizedText(_biblio, lang),
                        style: GoogleFonts.tajawal(
                          fontSize: 14.5.sp,
                          color: Colors.white.withValues(alpha: 0.92),
                          height: 1.85,
                        ),
                      ),
                    ],
                  ),
                ),
              ],
            ),
          ),
        ),

        // ── Outputs ───────────────────────────────────────────────────────
        _Section(
          child: Column(
            children: [
              SectionTitle(title: localizedText(_outputsTitle, lang)),
              Column(
                children: _outputs.map((o) {
                  return Padding(
                    padding: EdgeInsets.only(bottom: 12.h),
                    child: Container(
                      decoration: BoxDecoration(
                        color: AppColors.secondary,
                        borderRadius: BorderRadius.circular(20.r),
                      ),
                      clipBehavior: Clip.hardEdge,
                      child: Stack(
                        children: [
                          // Red left accent bar
                          PositionedDirectional(
                            start: 0,
                            top: 0,
                            bottom: 0,
                            child: Container(
                              width: 4.w,
                              color: AppColors.primary,
                            ),
                          ),
                          Padding(
                            padding: EdgeInsetsDirectional.fromSTEB(
                                20.w, 20.h, 18.w, 20.h),
                            child: Column(
                              crossAxisAlignment: CrossAxisAlignment.start,
                              children: [
                                Text(
                                  localizedText(o.title, lang),
                                  style: GoogleFonts.cairo(
                                    fontSize: 18.sp,
                                    fontWeight: FontWeight.w800,
                                    color: Colors.white,
                                  ),
                                ),
                                SizedBox(height: 7.h),
                                Text(
                                  localizedText(o.desc, lang),
                                  style: GoogleFonts.tajawal(
                                    fontSize: 14.sp,
                                    color: Colors.white
                                        .withValues(alpha: 0.78),
                                    height: 1.75,
                                  ),
                                ),
                                SizedBox(height: 14.h),
                                Container(
                                  decoration: BoxDecoration(
                                    border: Border(
                                      top: BorderSide(
                                          color: Colors.white
                                              .withValues(alpha: 0.12)),
                                    ),
                                  ),
                                  padding: EdgeInsets.only(top: 12.h),
                                  child: Column(
                                    crossAxisAlignment:
                                        CrossAxisAlignment.start,
                                    children: [
                                      Text(
                                        lang == 'ar'
                                            ? 'الجهات المستهدفة'
                                            : 'Target audience',
                                        style: GoogleFonts.cairo(
                                          fontSize: 11.5.sp,
                                          fontWeight: FontWeight.w700,
                                          color: AppColors.primary,
                                          letterSpacing: 0.04 * 11.5.sp,
                                        ),
                                      ),
                                      SizedBox(height: 5.h),
                                      Text(
                                        localizedText(o.who, lang),
                                        style: GoogleFonts.tajawal(
                                          fontSize: 13.sp,
                                          color: Colors.white
                                              .withValues(alpha: 0.7),
                                          height: 1.7,
                                        ),
                                      ),
                                    ],
                                  ),
                                ),
                              ],
                            ),
                          ),
                        ],
                      ),
                    ),
                  );
                }).toList(),
              ),
            ],
          ),
        ),

        BeliefBand(text: localizedText(_closing, lang)),
        SizedBox(height: 4.h),
      ],
    );
  }
}

// ── Section spacing wrapper ────────────────────────────────────────────────

class _Section extends StatelessWidget {
  const _Section({required this.child});
  final Widget child;

  @override
  Widget build(BuildContext context) {
    return Padding(
      padding: EdgeInsetsDirectional.fromSTEB(16.w, 26.h, 16.w, 0),
      child: child,
    );
  }
}
