import 'package:flutter/material.dart';
import 'package:flutter_screenutil/flutter_screenutil.dart';
import 'package:google_fonts/google_fonts.dart';

import '../../../../../core/theme/app_colors.dart';

class OnboardingSlide {
  const OnboardingSlide({
    required this.titleAr,
    required this.titleEn,
    required this.subAr,
    required this.subEn,
    required this.accentColor,
    this.imagePath,
  });
  final String titleAr;
  final String titleEn;
  final String subAr;
  final String subEn;
  final Color accentColor;
  final String? imagePath;
}

const kOnboardingSlides = [
  OnboardingSlide(
    titleAr: 'نافذة العالم على الكتب',
    titleEn: "The World's Window on Books",
    subAr:
        'اكتشف كل كتاب مهم يصدر حول العالم، مصنّفاً في ثمانية حقول معرفية ومقدَّماً للقارئ العربي.',
    subEn:
        'Discover every significant book published worldwide — sorted into eight fields of knowledge.',
    accentColor: AppColors.primary,
    imagePath: 'assets/onboarding/onboard-discover.png',
  ),
  OnboardingSlide(
    titleAr: 'تابِع رحلة الترجمة',
    titleEn: 'Follow the Translation Journey',
    subAr:
        'اعرف ما تُرجم وما هو مرشّح للترجمة، وافتح نافذة معرفية على أفكار وعلوم العالم بلغتك.',
    subEn:
        "See what's translated and what's nominated — a window onto the world's ideas, in your language.",
    accentColor: Color(0xFF46467F),
    imagePath: 'assets/onboarding/onboard-translate.png',
  ),
  OnboardingSlide(
    titleAr: 'اقرأ، اقتنِ، وانشر',
    titleEn: 'Read, Collect & Publish',
    subAr:
        'اقتنِ الكتب التي تحب، وامنح كتابك فرصته الأولى للانتشار — كتابك الأول يُنشر مجاناً.',
    subEn:
        'Collect the books you love and give your own book its first chance — your first book is free.',
    accentColor: AppColors.primary,
    imagePath: 'assets/onboarding/onboard-publish.png',
  ),
];

class OnboardingSlidePage extends StatelessWidget {
  const OnboardingSlidePage({
    super.key,
    required this.slide,
    required this.locale,
  });
  final OnboardingSlide slide;
  final String locale;

  @override
  Widget build(BuildContext context) {
    final ar = locale == 'ar';
    return Padding(
      padding: EdgeInsetsDirectional.only(top: 100.h),
      child: Column(
        children: [
          Expanded(
            child: Padding(
              padding: EdgeInsetsDirectional.symmetric(horizontal: 20.w),
              child: slide.imagePath != null
                  ? Image.asset(
                      slide.imagePath!,
                      fit: BoxFit.contain,
                      errorBuilder: (_, e, s) => OnboardingPlaceholderIllustration(
                        accentColor: slide.accentColor,
                      ),
                    )
                  : OnboardingPlaceholderIllustration(accentColor: slide.accentColor),
            ),
          ),
          Padding(
            padding: EdgeInsetsDirectional.fromSTEB(28.w, 0, 28.w, 28.h),
            child: Column(
              children: [
                Text(
                  ar ? slide.titleAr : slide.titleEn,
                  textAlign: TextAlign.center,
                  style: GoogleFonts.cairo(
                    fontSize: 25.sp,
                    fontWeight: FontWeight.w800,
                    color: AppColors.textPrimary,
                    height: 1.4,
                  ),
                ),
                SizedBox(height: 12.h),
                Text(
                  ar ? slide.subAr : slide.subEn,
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
        ],
      ),
    );
  }
}

class OnboardingPlaceholderIllustration extends StatelessWidget {
  const OnboardingPlaceholderIllustration({
    super.key,
    required this.accentColor,
  });
  final Color accentColor;

  @override
  Widget build(BuildContext context) {
    return Center(
      child: Container(
        width: 200.r,
        height: 200.r,
        decoration: BoxDecoration(
          color: accentColor.withValues(alpha: 0.1),
          shape: BoxShape.circle,
        ),
        child: Icon(
          Icons.menu_book_rounded,
          size: 80.r,
          color: accentColor.withValues(alpha: 0.4),
        ),
      ),
    );
  }
}
