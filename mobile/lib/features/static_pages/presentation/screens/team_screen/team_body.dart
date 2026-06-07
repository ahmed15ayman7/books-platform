import 'package:flutter/material.dart';
import 'package:flutter_screenutil/flutter_screenutil.dart';
import 'package:google_fonts/google_fonts.dart';

import 'package:booksplatform/core/theme/app_colors.dart';
import 'package:booksplatform/core/widgets/network_avatar_widget.dart';
import 'package:booksplatform/features/static_pages/presentation/widgets/belief_band.dart';
import 'package:booksplatform/features/static_pages/presentation/widgets/info_page_hero.dart';
import 'package:booksplatform/features/static_pages/presentation/widgets/section_title.dart';

import '../../helpers/bilingual_helper.dart';
import 'team_member_urls.dart';

// ignore_for_file: lines_longer_than_80_chars

// ── Content ────────────────────────────────────────────────────────────────

const _pageTitle = (ar: 'فريق العمل', en: 'Our Team');
const _heroSubtitle = (
  ar: 'نؤمن بأن العمل الجماعي هو أساس بناء محتوى معرفي مؤثّر ومستدام',
  en: 'We believe teamwork is the foundation of meaningful, lasting knowledge',
);
const _introTitle = (
  ar: 'فريق عمل منصة الكتب العالمية',
  en: 'The Books Platform team',
);
const _intro = (
  ar: 'يضمّ فريق عمل منصة الكتب العالمية نخبة من المتخصّصين في النشر والتقنية والإعلام والتسويق، يعملون معًا برؤية واحدة تهدف إلى دعم المعرفة، وتشجيع الإبداع، وتقديم محتوى ثقافي موثوق يخدم القارئ والكاتب والباحث.',
  en: 'The Books Platform team brings together specialists in publishing, technology, media and marketing, working toward one vision: supporting knowledge, encouraging creativity, and offering trustworthy cultural content for readers, writers and researchers.',
);
const _belief = (
  ar: 'العمل الجماعي هو أساس بناء محتوى معرفي مؤثّر ومستدام',
  en: 'Teamwork is the foundation of meaningful, lasting knowledge',
);

const _members = [
  (
    initials: 'ع م',
    imageUrl: TeamMemberUrls.atefMazhar,
    name: (ar: 'عاطف مظهر', en: 'Atef Mazhar'),
    role: (ar: 'المدير العام', en: 'General Manager'),
    bio: (
      ar: 'المؤسّس وصاحب الرؤية الاستراتيجية للمشروع، ويتولّى مهام الإدارة العليا والإشراف العام.',
      en: 'Founder and strategic visionary of the project; leads executive management and general oversight.',
    ),
  ),
  (
    initials: 'م م',
    imageUrl: TeamMemberUrls.mariamMazhar,
    name: (ar: 'مريم مظهر', en: 'Mariam Mazhar'),
    role: (ar: 'المدير التنفيذي', en: 'Executive Director'),
    bio: (
      ar: 'تقود رؤية المنصة وتشرف على استراتيجيات التطوير والتوسّع، بما يضمن تحقيق رسالتها الثقافية والمعرفية.',
      en: 'Leads the platform\'s vision and oversees growth strategy, ensuring its cultural and knowledge mission.',
    ),
  ),
  (
    initials: 'س م',
    imageUrl: TeamMemberUrls.saraMazhar,
    name: (ar: 'سارة مظهر', en: 'Sara Mazhar'),
    role: (ar: 'مديرة التقنيات', en: 'Head of Technology'),
    bio: (
      ar: 'تشرف على البنية التقنية للمنصة وتطوير الأنظمة الرقمية بما يضمن تجربة مستخدم سلسة وآمنة.',
      en: 'Oversees the platform\'s technical infrastructure and digital systems for a smooth, secure experience.',
    ),
  ),
  (
    initials: 'م و',
    imageUrl: TeamMemberUrls.mohamedAbouElwafa,
    name: (ar: 'محمد أبو الوفا', en: 'Mohamed Abu Al-Wafa'),
    role: (ar: 'مدير التحرير (الإنجليزية)', en: 'Editor-in-Chief (English)'),
    bio: (
      ar: 'يشرف على المحتوى التحريري ومراجعة الأعمال الأدبية والفكرية، وضمان جودتها واتساقها مع معايير المنصة.',
      en: 'Oversees editorial content and review of literary and intellectual works to platform standards.',
    ),
  ),
  (
    initials: 'ه م',
    imageUrl: TeamMemberUrls.hanyMowafi,
    name: (ar: 'هاني موافي', en: 'Hany Mowafy'),
    role: (ar: 'مدير التحرير (العربية)', en: 'Editor-in-Chief (Arabic)'),
    bio: (
      ar: 'يتولّى إدارة المحتوى الثقافي والفكري، والتنسيق مع الكتّاب والمؤلفين والباحثين.',
      en: 'Manages cultural and intellectual content and liaises with writers, authors and researchers.',
    ),
  ),
  (
    initials: 'ز ش',
    imageUrl: TeamMemberUrls.zakariaElShal,
    name: (ar: 'زكريا الشال', en: 'Zakaria El-Shal'),
    role: (ar: 'مدير التسويق', en: 'Marketing Director'),
    bio: (
      ar: 'مسؤول عن بناء الهوية التسويقية للمنصة وتعزيز حضورها الرقمي والتواصل مع الجمهور والمهتمين بصناعة الكتاب.',
      en: 'Builds the marketing identity, strengthens digital presence and engages the book-industry audience.',
    ),
  ),
  (
    initials: 'ع س',
    imageUrl: TeamMemberUrls.abdelrahmanSaeed,
    name: (ar: 'عبد الرحمن سعيد', en: 'Abdelrahman Saeed'),
    role: (ar: 'مدير وحدة المونتاج و AI', en: 'Head of Editing & AI'),
    bio: (
      ar: 'يشرف على المحتوى المرئي والتقنيات المعتمدة على الذكاء الاصطناعي لدعم التجربة البصرية والمعرفية.',
      en: 'Leads visual content and AI-based tooling supporting the platform\'s visual experience.',
    ),
  ),
  (
    initials: 'ح ف',
    imageUrl: TeamMemberUrls.hatemFarag,
    name: (ar: 'د. حاتم فرج', en: 'Dr. Hatem Farag'),
    role: (ar: 'المستشار العلمي', en: 'Scientific Advisor'),
    bio: (
      ar: 'يقدّم الإشراف العلمي والمنهجي على الأبحاث والأطروحات الأكاديمية المنشورة عبر المنصة.',
      en: 'Provides scientific and methodological oversight of research and academic work on the platform.',
    ),
  ),
  (
    initials: 'أ ش',
    imageUrl: TeamMemberUrls.ahmedElShal,
    name: (ar: 'أحمد الشال', en: 'Ahmed El-Shal'),
    role: (ar: 'مدير البرمجة و SEO', en: 'Dev & SEO Lead'),
    bio: (
      ar: 'مسؤول عن تطوير الموقع تقنيًا وتحسين ظهوره في محرّكات البحث لضمان وصول المحتوى لأكبر شريحة من القرّاء.',
      en: 'Handles site development and SEO so content reaches the widest possible readership.',
    ),
  ),
];

// ── Widget ─────────────────────────────────────────────────────────────────

class TeamBody extends StatelessWidget {
  const TeamBody({super.key, required this.lang});

  final String lang;

  @override
  Widget build(BuildContext context) {
    return Column(
      crossAxisAlignment: CrossAxisAlignment.start,
      children: [
        InfoPageHero(
          icon: Icons.people_outline_rounded,
          title: localizedText(_pageTitle, lang),
          subtitle: localizedText(_heroSubtitle, lang),
        ),

        // ── Intro ─────────────────────────────────────────────────────────
        Padding(
          padding: EdgeInsetsDirectional.fromSTEB(16.w, 26.h, 16.w, 0),
          child: Column(
            children: [
              SectionTitle(title: localizedText(_introTitle, lang)),
              Text(
                localizedText(_intro, lang),
                textAlign: TextAlign.center,
                style: GoogleFonts.tajawal(
                  fontSize: 15.sp,
                  color: AppColors.textSecondary,
                  height: 1.85,
                ),
              ),
            ],
          ),
        ),

        // ── Members list ──────────────────────────────────────────────────
        Padding(
          padding: EdgeInsetsDirectional.fromSTEB(16.w, 26.h, 16.w, 0),
          child: Column(
            children: List.generate(_members.length, (i) {
              final m = _members[i];
              return Padding(
                padding: EdgeInsets.only(bottom: 13.h),
                child: Container(
                  decoration: BoxDecoration(
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
                  ),
                  padding: EdgeInsetsDirectional.fromSTEB(
                      16.w, 18.h, 16.w, 18.h),
                  child: Row(
                    crossAxisAlignment: CrossAxisAlignment.start,
                    children: [
                      DecoratedBox(
                        decoration: BoxDecoration(
                          shape: BoxShape.circle,
                          boxShadow: [
                            BoxShadow(
                              color: Colors.black.withValues(alpha: 0.18),
                              blurRadius: 14,
                              offset: const Offset(0, 4),
                            ),
                          ],
                          border: Border.all(
                            color: AppColors.surface,
                            width: 2,
                          ),
                        ),
                        child: NetworkAvatarWidget(
                          size: 64.r,
                          initials: m.initials,
                          imageUrl: m.imageUrl,
                          initialsFontSize: 18.sp,
                        ),
                      ),
                      SizedBox(width: 15.w),
                      Expanded(
                        child: Column(
                          crossAxisAlignment: CrossAxisAlignment.start,
                          children: [
                            Text(
                              localizedText(m.name, lang),
                              style: GoogleFonts.cairo(
                                fontSize: 17.sp,
                                fontWeight: FontWeight.w800,
                                color: AppColors.textPrimary,
                              ),
                            ),
                            SizedBox(height: 2.h),
                            Text(
                              localizedText(m.role, lang),
                              style: GoogleFonts.cairo(
                                fontSize: 12.5.sp,
                                fontWeight: FontWeight.w700,
                                color: AppColors.primary,
                              ),
                            ),
                            SizedBox(height: 8.h),
                            Text(
                              localizedText(m.bio, lang),
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
                ),
              );
            }),
          ),
        ),

        BeliefBand(text: localizedText(_belief, lang)),
        SizedBox(height: 4.h),
      ],
    );
  }
}
