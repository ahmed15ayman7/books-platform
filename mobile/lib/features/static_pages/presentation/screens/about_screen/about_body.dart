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

const _pageTitle = (ar: 'من نحن', en: 'About Us');
const _heroSubtitle = (
  ar: 'منصة الكتب العالمية | نافذة معرفية على ثقافات العالم',
  en: 'Books Platform | A knowledge window onto the world\'s cultures',
);
const _introTitle = (ar: 'تقديم', en: 'Introduction');
const _intro = [
  (
    ar: 'نشأت فكرة «منصة الكتب العالمية» لكي تكون مبادرة ثقافية عربية ومشروعًا رياديًا تنويريًا لمواكبة التقدّم العالمي في العلوم والمعارف، وتشجيع حركة الترجمة، وإعادة إحياء عادات القراءة ومفهوم الثقافة لدى المواطن العربي.',
    en: 'Books Platform began as an Arab cultural initiative and a pioneering, enlightening project — keeping pace with global progress in science and knowledge, encouraging translation, and reviving reading habits and the idea of culture for the Arab reader.',
  ),
  (
    ar: 'إن مبادرة «منصة الكتب العالمية» عملٌ طموح يحتاج إلى جهود كثيرة وشراكات متعدّدة، ومرشّح بقوة لأن يكون من أهم الكيانات الثقافية في العالم العربي. وهي مشروع مؤسسي يستوعب طاقات وكوادر مؤهّلة وخبرات فاعلة؛ لذا فهي منفتحة على كل أنواع الشراكة والدعم، ماديًا وتقنيًا وإعلاميًا وتسويقيًا.',
    en: 'It is an ambitious effort that needs many hands and partnerships, and a strong candidate to become one of the Arab world\'s foremost cultural entities. As an institutional project welcoming capable talent and real expertise, it is open to every form of partnership and support — material, technical, media and marketing.',
  ),
];
const _ideaTitle = (ar: 'فكرة المنصة', en: 'The platform idea');
const _idea = (
  ar: 'تقوم فكرة «منصة الكتب العالمية» على إطلاق موقع إلكتروني وتطبيق على الهواتف الذكية، يقدّمان خدمة التعريف بالكتب الأجنبية الصادرة حديثًا والتي لم تُترجم بعد إلى العربية. وذلك من خلال رصد حركة النشر الأجنبي، ومواكبة ما تصدره دور النشر العالمية في تصنيفات العلوم والفنون والآداب والمعارف، وتوفير البيانات الببليوجرافية لكل كتاب، ونقل ذلك كله إلى القارئ العربي؛ لتشجيعه على القراءة وتعريفه بالإنتاج العلمي والثقافي العالمي.',
  en: 'The idea rests on a website and a smartphone app that introduce newly released foreign books not yet translated into Arabic — by tracking foreign publishing, following what global publishers release across the sciences, arts, literature and knowledge, providing bibliographic data for every title, and bringing it all to the Arab reader to encourage reading and acquaint them with global scholarship and culture.',
);

const _pillars = [
  (
    icon: Icons.info_outline_rounded,
    title: (ar: 'الرؤية', en: 'Vision'),
    text: (
      ar: 'أن نشارك في ربط المجتمع العربي بمجتمعات العالم، وتعزيز التواصل والتفاهم بين الثقافات، وفتح مجالات الإبداع والتميّز عبر تنشيط حركة الترجمة من جهة، واستخدام وسائل منظّمة وموثّقة لتقديم خدمات الثقافة من جهة أخرى.',
      en: 'To connect Arab society with the world\'s communities, strengthen cross-cultural understanding, and open avenues of creativity by energizing translation and offering culture through organized, documented means.',
    ),
  ),
  (
    icon: Icons.send_rounded,
    title: (ar: 'الرسالة', en: 'Mission'),
    text: (
      ar: 'ندعم القارئ العربي بتقديم محتوى نافع يثري الوعي ويصقل الثقافة ويرفع درجة المعرفة، ونعيد المجتمعات العربية إلى عادات القراءة وساحات الثقافة، وننشئ بنية عربية متطوّرة معلوماتيًا وتكنولوجيًا.',
      en: 'To support the Arab reader with content that enriches awareness and culture, return Arab societies to reading and cultural life, and build an Arab base advanced in information and technology.',
    ),
  ),
  (
    icon: Icons.track_changes_rounded,
    title: (ar: 'الأهداف', en: 'Goals'),
    text: (
      ar: 'أن تكون «منصة الكتب العالمية» منصّة الثقافة الأولى عربيًا، وواحدة من أهم المراكز العالمية البارزة لنشر المعرفة والثقافة وبثّ الوعي والفكر والتنوير.',
      en: 'For Books Platform to be the Arab world\'s leading cultural platform and one of the foremost global hubs for spreading knowledge, culture and enlightenment.',
    ),
  ),
  (
    icon: Icons.security_rounded,
    title: (ar: 'السياسات', en: 'Policies'),
    text: (
      ar: 'أن ننفّذ كل أعمالنا وخدماتنا بشكل مهني واحترافي يراعي الضوابط والمعايير العلمية والقانونية والأخلاقية التي تحفظ حقوق الملكية الفكرية لكل الجهات.',
      en: 'To deliver all our work professionally, observing the scholarly, legal and ethical standards that protect every party\'s intellectual-property rights.',
    ),
  ),
];

const _distinctTitle = (ar: 'ما يميّز المنصة', en: 'What sets us apart');
const _distinct = [
  (
    label: (ar: 'أولًا', en: 'First'),
    ar: 'نافذة إلكترونية تخاطب أكثر من 400 مليون عربي، وتتطلّع إلى خلق مناخ ثقافي منفتح على العالم، وتسعى إلى إتاحة فرص جديدة وواعدة لتنشيط حركة الترجمة وازدهار سوق الكتاب العربي.',
    en: 'An online window addressing over 400 million Arabs, aiming to create an open cultural climate and new opportunities to energize translation and the Arab book market.',
  ),
  (
    label: (ar: 'ثانيًا', en: 'Second'),
    ar: 'منصة ثقافية وإعلامية جديدة هي الأولى من نوعها في العالم العربي، يستفيد منها قطاع واسع من القرّاء والمثقفين المهتمين بالاطّلاع الدائم على الكتب العالمية الحديثة، وللباحثين في مجالات تخصّصاتهم وبكل لغات العالم.',
    en: 'A new cultural-media platform, the first of its kind in the Arab world, serving readers, intellectuals and researchers seeking the latest global books across every field and language.',
  ),
  (
    label: (ar: 'ثالثًا', en: 'Third'),
    ar: 'تقدّم خدمات ثقافية وإعلامية جديدة ومميّزة عبر إعداد نشرات إخبارية يومية عن الكتب الجديدة، وإنتاج فيديوهات وبودكاست عن أهمها، والتواصل مع الجمهور من خلال التطبيق وصفحات السوشيال ميديا.',
    en: 'It offers distinctive cultural-media services: daily bulletins on new books, videos and podcasts on the most notable, and audience engagement through the app and social media.',
  ),
  (
    label: (ar: 'رابعًا', en: 'Fourth'),
    ar: 'وسيلة عملية لتسهيل التنسيق والتواصل المباشر مع الكتّاب والمؤلفين والباحثين ومؤسسات الفكر والإبداع، والناشرين العرب والأجانب.',
    en: 'A practical channel for direct coordination with writers, authors, researchers, think-and-create institutions, and Arab and foreign publishers.',
  ),
];

const _effortsTitle = (
  ar: 'الجهود الحالية في نشر مبادرتنا',
  en: 'Current efforts to spread our initiative',
);
const _efforts = [
  (
    ar: 'تعريف المؤسسات الدولية والعربية المعنية بالثقافة والنشر، والشخصيات العامة والفاعلة، بمشروع «منصة الكتب» وشرح أهدافه وأدواره ومراحله؛ بهدف عقد اتفاقيات شراكة ورعاية وتوفير تمويل مناسب لتطوير المشروع وتنفيذ مراحله.',
    en: 'Introducing the project to international and Arab cultural and publishing institutions and public figures — to forge partnership and sponsorship agreements and secure suitable funding to develop it.',
  ),
  (
    ar: 'الاتجاه لإبرام اتفاقيات مع المكتبات الوطنية العربية لتوفير بيانات ببليوجرافية حديثة وكاملة ومتجدّدة يوميًا عن كل كتاب مهم يصدر في العالم وبكل اللغات، بما يفيد مراكز البحوث والدراسات ودور النشر الكبرى المعنية بالترجمة.',
    en: 'Pursuing agreements with Arab national libraries to provide fresh, complete, daily-updated bibliographic data on every important book worldwide — benefiting research centers and major publishers.',
  ),
  (
    ar: 'التنسيق مع كبريات المؤسسات الصحفية لعرض خدماتنا الإعلامية الجديدة: أخبار يومية وتقارير خاصة نوعية ومجمّعة بعنوان «العالم العربي يقرأ» عن أهم الكتب الأجنبية والعربية الصادرة حديثًا، تصدر أسبوعيًا وشهريًا.',
    en: 'Coordinating with leading press institutions for our new media services: daily news and special curated reports titled "The Arab World Reads", issued weekly and monthly.',
  ),
  (
    ar: 'التواصل مع قنوات تلفزيونية مهتمة بالمنتج الثقافي لعرض إنتاج فيديوهات قصيرة بعنوان «كلام الكتب»، يكون فيها الكتاب «متحدّثًا عن نفسه» باستخدام الجرافيك؛ بهدف جذب المشاهدين للقراءة عبر تبسيط المواد الثقافية.',
    en: 'Engaging TV channels for short videos titled "Books Speak", where a book "speaks for itself" through graphics — drawing viewers toward reading by simplifying cultural material.',
  ),
  (
    ar: 'ترشيح المشروع لنيل الجوائز الثقافية المختصّة عربيًا ودوليًا، باعتباره مبادرة عربية رائدة تتيح للقارئ العربي متابعة كل كتاب مهم وآخر ما توصّلت إليه العقول الإنسانية، وتسعى لتنشيط الترجمة وازدهار سوق الكتاب العربي.',
    en: 'Nominating the project for specialized Arab and international cultural awards as a pioneering initiative that lets the Arab reader follow every important book and the latest human thought.',
  ),
];

const _belief = (
  ar: 'غايتنا أن يعرف القارئ العربي بكل كتاب جديد يصدر في العالم',
  en: 'Our aim: that the Arab reader knows every new book published in the world',
);

// ── Widget ─────────────────────────────────────────────────────────────────

class AboutBody extends StatelessWidget {
  const AboutBody({super.key, required this.lang});

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
    final bodyStyle = GoogleFonts.tajawal(
      fontSize: 15.sp,
      color: AppColors.textSecondary,
      height: 1.85,
    );

    return Column(
      crossAxisAlignment: CrossAxisAlignment.start,
      children: [
        InfoPageHero(
          icon: Icons.bookmark_rounded,
          title: localizedText(_pageTitle, lang),
          subtitle: localizedText(_heroSubtitle, lang),
        ),

        // ── Introduction ──────────────────────────────────────────────────
        _Section(
          child: Column(
            children: [
              SectionTitle(title: localizedText(_introTitle, lang)),
              Container(
                decoration: cardDecor,
                padding: EdgeInsets.all(20.r),
                child: Column(
                  children: _intro
                      .map((p) => Padding(
                            padding: EdgeInsets.only(bottom: 16.h),
                            child: Text(localizedText(p, lang), style: bodyStyle),
                          ))
                      .toList(),
                ),
              ),
            ],
          ),
        ),

        // ── Platform Idea — dark chrome ───────────────────────────────────
        _Section(
          child: Container(
            decoration: BoxDecoration(
              color: AppColors.secondary,
              borderRadius: BorderRadius.circular(24.r),
            ),
            clipBehavior: Clip.hardEdge,
            child: Stack(
              children: [
                PositionedDirectional(
                  start: -26.r,
                  top: -26.r,
                  child: Container(
                    width: 110.r,
                    height: 110.r,
                    decoration: BoxDecoration(
                      color: AppColors.primary.withValues(alpha: 0.18),
                      shape: BoxShape.circle,
                    ),
                  ),
                ),
                Padding(
                  padding: EdgeInsets.all(24.r),
                  child: Column(
                    crossAxisAlignment: CrossAxisAlignment.start,
                    children: [
                      Text(
                        localizedText(_ideaTitle, lang),
                        style: GoogleFonts.cairo(
                          fontSize: 24.sp,
                          fontWeight: FontWeight.w800,
                          color: Colors.white,
                        ),
                      ),
                      SizedBox(height: 14.h),
                      Text(
                        localizedText(_idea, lang),
                        style: GoogleFonts.tajawal(
                          fontSize: 15.sp,
                          color: Colors.white.withValues(alpha: 0.8),
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

        // ── Pillars 2×2 grid ──────────────────────────────────────────────
        _Section(
          child: GridView.count(
            crossAxisCount: 2,
            crossAxisSpacing: 12.w,
            mainAxisSpacing: 12.h,
            childAspectRatio: 0.85,
            shrinkWrap: true,
            physics: const NeverScrollableScrollPhysics(),
            children: _pillars
                .map((p) => Container(
                      decoration: cardDecor,
                      padding: EdgeInsetsDirectional.fromSTEB(
                          15.w, 18.h, 15.w, 18.h),
                      child: Column(
                        crossAxisAlignment: CrossAxisAlignment.start,
                        children: [
                          Container(
                            width: 42.r,
                            height: 42.r,
                            decoration: BoxDecoration(
                              color: AppColors.brandRedSoft,
                              borderRadius: BorderRadius.circular(12.r),
                            ),
                            child: Icon(p.icon,
                                color: AppColors.primary, size: 22.r),
                          ),
                          SizedBox(height: 10.h),
                          Text(
                            localizedText(p.title, lang),
                            style: GoogleFonts.cairo(
                              fontSize: 16.5.sp,
                              fontWeight: FontWeight.w800,
                              color: AppColors.textPrimary,
                            ),
                          ),
                          SizedBox(height: 6.h),
                          Expanded(
                            child: Text(
                              localizedText(p.text, lang),
                              style: GoogleFonts.tajawal(
                                fontSize: 12.sp,
                                color: AppColors.textSecondary,
                                height: 1.75,
                              ),
                              overflow: TextOverflow.fade,
                            ),
                          ),
                        ],
                      ),
                    ))
                .toList(),
          ),
        ),

        // ── What sets us apart ────────────────────────────────────────────
        _Section(
          child: Column(
            crossAxisAlignment: CrossAxisAlignment.start,
            children: [
              SectionTitle(
                  title: localizedText(_distinctTitle, lang),
                  textAlign: TextAlign.start),
              Column(
                children: _distinct
                    .map((d) => Padding(
                          padding: EdgeInsets.only(bottom: 11.h),
                          child: Container(
                            decoration: cardDecor,
                            padding: EdgeInsetsDirectional.fromSTEB(
                                16.w, 16.h, 16.w, 16.h),
                            child: Row(
                              crossAxisAlignment: CrossAxisAlignment.start,
                              children: [
                                Container(
                                  constraints: BoxConstraints(minWidth: 52.w),
                                  height: 30.h,
                                  decoration: BoxDecoration(
                                    color: AppColors.primary,
                                    borderRadius: BorderRadius.circular(999),
                                  ),
                                  padding: EdgeInsets.symmetric(
                                      horizontal: 10.w),
                                  alignment: Alignment.center,
                                  child: Text(
                                    localizedText(d.label, lang),
                                    style: GoogleFonts.cairo(
                                      fontSize: 13.sp,
                                      fontWeight: FontWeight.w800,
                                      color: Colors.white,
                                    ),
                                  ),
                                ),
                                SizedBox(width: 13.w),
                                Expanded(
                                  child: Text(
                                    localizedText((ar: d.ar, en: d.en), lang),
                                    style: GoogleFonts.tajawal(
                                      fontSize: 14.sp,
                                      color: AppColors.textSecondary,
                                      height: 1.8,
                                    ),
                                  ),
                                ),
                              ],
                            ),
                          ),
                        ))
                    .toList(),
              ),
            ],
          ),
        ),

        // ── Current efforts ───────────────────────────────────────────────
        _Section(
          child: Column(
            crossAxisAlignment: CrossAxisAlignment.start,
            children: [
              SectionTitle(
                  title: localizedText(_effortsTitle, lang),
                  textAlign: TextAlign.start),
              Container(
                decoration: cardDecor,
                padding:
                    EdgeInsetsDirectional.fromSTEB(18.w, 8.h, 18.w, 8.h),
                child: Column(
                  children: List.generate(_efforts.length, (i) {
                    final e = _efforts[i];
                    final isLast = i == _efforts.length - 1;
                    return Container(
                      decoration: isLast
                          ? null
                          : BoxDecoration(
                              border: Border(
                                bottom: BorderSide(color: AppColors.divider),
                              ),
                            ),
                      padding:
                          EdgeInsetsDirectional.fromSTEB(0, 16.h, 0, 16.h),
                      child: Row(
                        crossAxisAlignment: CrossAxisAlignment.start,
                        children: [
                          Container(
                            width: 30.r,
                            height: 30.r,
                            decoration: BoxDecoration(
                              shape: BoxShape.circle,
                              border: Border.all(
                                  color: AppColors.primary, width: 1.5),
                            ),
                            alignment: Alignment.center,
                            child: Text(
                              '${i + 1}',
                              style: GoogleFonts.cairo(
                                fontSize: 13.sp,
                                fontWeight: FontWeight.w800,
                                color: AppColors.primary,
                              ),
                            ),
                          ),
                          SizedBox(width: 14.w),
                          Expanded(
                            child: Text(
                              localizedText(e, lang),
                              style: GoogleFonts.tajawal(
                                fontSize: 14.sp,
                                color: AppColors.textSecondary,
                                height: 1.8,
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

        BeliefBand(text: localizedText(_belief, lang)),
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
