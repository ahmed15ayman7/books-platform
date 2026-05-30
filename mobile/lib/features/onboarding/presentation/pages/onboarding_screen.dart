import 'package:easy_localization/easy_localization.dart';
import 'package:flutter/material.dart';
import 'package:flutter_screenutil/flutter_screenutil.dart';
import 'package:google_fonts/google_fonts.dart';
import 'package:shared_preferences/shared_preferences.dart';

import '../../../../core/constants/app_constants.dart';
import '../../../../core/router/app_routes.dart';
import '../../../../core/theme/app_colors.dart';

class _Slide {
  const _Slide({
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

const _slides = [
  _Slide(
    titleAr: 'نافذة العالم على الكتب',
    titleEn: "The World's Window on Books",
    subAr:
        'اكتشف كل كتاب مهم يصدر حول العالم، مصنّفاً في ثمانية حقول معرفية ومقدَّماً للقارئ العربي.',
    subEn:
        'Discover every significant book published worldwide — sorted into eight fields of knowledge.',
    accentColor: AppColors.primary,
    imagePath: 'assets/onboard-discover.png',
  ),
  _Slide(
    titleAr: 'تابِع رحلة الترجمة',
    titleEn: 'Follow the Translation Journey',
    subAr:
        'اعرف ما تُرجم وما هو مرشّح للترجمة، وافتح نافذة معرفية على أفكار وعلوم العالم بلغتك.',
    subEn:
        "See what's translated and what's nominated — a window onto the world's ideas, in your language.",
    accentColor: Color(0xFF46467F),
    imagePath: 'assets/onboard-translate.png',
  ),
  _Slide(
    titleAr: 'اقرأ، اقتنِ، وانشر',
    titleEn: 'Read, Collect & Publish',
    subAr:
        'اقتنِ الكتب التي تحب، وامنح كتابك فرصته الأولى للانتشار — كتابك الأول يُنشر مجاناً.',
    subEn:
        'Collect the books you love and give your own book its first chance — your first book is free.',
    accentColor: AppColors.primary,
    imagePath: 'assets/onboard-publish.png',
  ),
];

class OnboardingScreen extends StatefulWidget {
  const OnboardingScreen({super.key});

  @override
  State<OnboardingScreen> createState() => _OnboardingScreenState();
}

class _OnboardingScreenState extends State<OnboardingScreen> {
  final _controller = PageController();
  int _page = 0;

  void _next() {
    if (_page < _slides.length - 1) {
      _controller.nextPage(
        duration: const Duration(milliseconds: 350),
        curve: Curves.easeInOut,
      );
    } else {
      _finish();
    }
  }

  Future<void> _finish() async {
    final prefs = await SharedPreferences.getInstance();
    await prefs.setBool(kOnboardingDoneKey, true);
    if (!mounted) return;
    Navigator.of(context).pushReplacementNamed(AppRoutes.home);
  }

  @override
  void dispose() {
    _controller.dispose();
    super.dispose();
  }

  @override
  Widget build(BuildContext context) {
    final locale = context.locale.languageCode;
    final isLast = _page == _slides.length - 1;

    return Scaffold(
      backgroundColor: AppColors.background,
      body: Stack(
        children: [
          PageView.builder(
            controller: _controller,
            onPageChanged: (i) => setState(() => _page = i),
            itemCount: _slides.length,
            itemBuilder: (_, i) => _SlidePage(slide: _slides[i], locale: locale),
          ),
          // Top bar
          SafeArea(
            child: Padding(
              padding: EdgeInsetsDirectional.fromSTEB(18.w, 4.h, 18.w, 0),
              child: Row(
                mainAxisAlignment: MainAxisAlignment.spaceBetween,
                children: [
                  Row(
                    children: [
                      Container(
                        width: 30.r,
                        height: 30.r,
                        decoration: BoxDecoration(
                          color: AppColors.primary,
                          borderRadius: BorderRadius.circular(8.r),
                        ),
                        child: Icon(
                          Icons.menu_book_rounded,
                          color: Colors.white,
                          size: 17.r,
                        ),
                      ),
                      SizedBox(width: 8.w),
                      Text(
                        locale == 'ar' ? 'منصة الكتب' : 'Books',
                        style: GoogleFonts.cairo(
                          fontSize: 14.sp,
                          fontWeight: FontWeight.w800,
                          color: AppColors.textPrimary,
                        ),
                      ),
                    ],
                  ),
                  if (!isLast)
                    TextButton(
                      onPressed: _finish,
                      child: Text(
                        locale == 'ar' ? 'تخطّي' : 'Skip',
                        style: GoogleFonts.cairo(
                          fontSize: 13.5.sp,
                          fontWeight: FontWeight.w700,
                          color: AppColors.textSecondary,
                        ),
                      ),
                    ),
                ],
              ),
            ),
          ),
          // Bottom controls
          Positioned(
            left: 0,
            right: 0,
            bottom: 0,
            child: SafeArea(
              top: false,
              child: Padding(
                padding: EdgeInsetsDirectional.fromSTEB(28.w, 0, 28.w, 28.h),
                child: Column(
                  mainAxisSize: MainAxisSize.min,
                  children: [
                    // Dot indicators
                    Row(
                      mainAxisAlignment: MainAxisAlignment.center,
                      children: List.generate(_slides.length, (i) {
                        final active = i == _page;
                        return AnimatedContainer(
                          duration: const Duration(milliseconds: 350),
                          curve: Curves.easeInOut,
                          margin: EdgeInsets.symmetric(horizontal: 4.w),
                          width: active ? 26.w : 8.w,
                          height: 8.h,
                          decoration: BoxDecoration(
                            color: active
                                ? AppColors.primary
                                : AppColors.divider,
                            borderRadius: BorderRadius.circular(999),
                          ),
                        );
                      }),
                    ),
                    SizedBox(height: 22.h),
                    SizedBox(
                      width: double.infinity,
                      child: ElevatedButton(
                        onPressed: _next,
                        child: Row(
                          mainAxisAlignment: MainAxisAlignment.center,
                          children: [
                            Text(
                              isLast
                                  ? (locale == 'ar' ? 'ابدأ الآن' : 'Get Started')
                                  : (locale == 'ar' ? 'التالي' : 'Next'),
                            ),
                            SizedBox(width: 8.w),
                            Icon(
                              isLast
                                  ? Icons.check_rounded
                                  : (locale == 'ar'
                                      ? Icons.chevron_left_rounded
                                      : Icons.chevron_right_rounded),
                              size: 18.r,
                            ),
                          ],
                        ),
                      ),
                    ),
                  ],
                ),
              ),
            ),
          ),
        ],
      ),
    );
  }
}

class _SlidePage extends StatelessWidget {
  const _SlidePage({required this.slide, required this.locale});
  final _Slide slide;
  final String locale;

  @override
  Widget build(BuildContext context) {
    final ar = locale == 'ar';
    return Padding(
      padding: EdgeInsetsDirectional.only(top: 100.h),
      child: Column(
        children: [
          // Illustration
          Expanded(
            child: Padding(
              padding: EdgeInsetsDirectional.symmetric(horizontal: 20.w),
              child: slide.imagePath != null
                  ? Image.asset(
                      slide.imagePath!,
                      fit: BoxFit.contain,
                      errorBuilder: (_, e, s) => _PlaceholderIllustration(
                        accentColor: slide.accentColor,
                      ),
                    )
                  : _PlaceholderIllustration(accentColor: slide.accentColor),
            ),
          ),
          // Text
          Padding(
            padding: EdgeInsetsDirectional.fromSTEB(28.w, 0, 28.w, 120.h),
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

class _PlaceholderIllustration extends StatelessWidget {
  const _PlaceholderIllustration({required this.accentColor});
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
