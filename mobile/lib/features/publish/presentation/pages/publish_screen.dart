import 'package:easy_localization/easy_localization.dart';
import 'package:flutter/material.dart';
import 'package:flutter_screenutil/flutter_screenutil.dart';
import 'package:google_fonts/google_fonts.dart';

import '../../../../core/router/app_routes.dart';
import '../../../../core/theme/app_colors.dart';
import '../../../../core/widgets/app_bar_widget.dart';
import '../../../../core/widgets/bottom_nav_widget.dart';

class PublishScreen extends StatefulWidget {
  const PublishScreen({super.key});

  @override
  State<PublishScreen> createState() => _PublishScreenState();
}

class _PublishScreenState extends State<PublishScreen> {
  int _step = 0;

  static const _steps = ['author', 'book', 'submit'];

  void _next() {
    if (_step < _steps.length - 1) setState(() => _step++);
  }

  void _back() {
    if (_step > 0) setState(() => _step--);
  }

  @override
  Widget build(BuildContext context) {
    final locale = context.locale.languageCode;
    final ar = locale == 'ar';
    final stepLabels = ar
        ? ['معلومات المؤلف', 'معلومات الكتاب', 'الإرسال']
        : ['Author Info', 'Book Info', 'Submit'];
    return Scaffold(
      backgroundColor: AppColors.background,
      body: Column(
        children: [
          AppBarWidget(
            variant: AppBarVariant.title,
            title: 'publish.title'.tr(),
            showBack: true,
            currentLocale: locale,
            onLocaleChanged: (l) => context.setLocale(Locale(l)),
          ),
          Expanded(
            child: SingleChildScrollView(
              padding: EdgeInsetsDirectional.fromSTEB(
                  16.w, 18.h, 16.w, 8.h),
              child: Column(
                children: [
                  // Step indicator
                  _StepIndicator(
                    step: _step,
                    labels: stepLabels,
                  ),
                  SizedBox(height: 24.h),
                  // Step content
                  if (_step == 0) _AuthorStep(locale: locale),
                  if (_step == 1) _BookStep(locale: locale),
                  if (_step == 2) _SuccessStep(locale: locale),
                  SizedBox(height: 16.h),
                  const _PromoSection(),
                  SizedBox(height: 18.h),
                  _NavigationSection(
                    step: _step,
                    totalSteps: _steps.length,
                    onBack: _back,
                    onPrimary: _step < _steps.length - 1
                        ? _next
                        : () => Navigator.of(context).pushReplacementNamed(AppRoutes.home),
                  ),
                  SizedBox(height: 16.h),
                ],
              ),
            ),
          ),
          BottomNavWidget(
            activeTab: null,
            onTabSelected: (tab) => _onTabSelected(context, tab),
            onPublishTap: () {},
            currentLocale: locale,
          ),
        ],
      ),
    );
  }

  void _onTabSelected(BuildContext context, BottomNavTab tab) {
    switch (tab) {
      case BottomNavTab.home:
        Navigator.of(context).pushReplacementNamed(AppRoutes.home);
      case BottomNavTab.books:
        Navigator.of(context).pushReplacementNamed(AppRoutes.books);
      case BottomNavTab.articles:
        Navigator.of(context).pushReplacementNamed(AppRoutes.articles);
      case BottomNavTab.publishers:
        Navigator.of(context).pushReplacementNamed(AppRoutes.publishers);
    }
  }
}

class _PromoSection extends StatelessWidget {
  const _PromoSection();

  @override
  Widget build(BuildContext context) {
    return Container(
      padding: EdgeInsetsDirectional.all(16.r),
      decoration: BoxDecoration(
        color: AppColors.brandRedSoft,
        border: Border.all(color: AppColors.primary.withValues(alpha: 0.2)),
        borderRadius: BorderRadius.circular(16.r),
      ),
      child: Row(
        children: [
          const Text('🎉', style: TextStyle(fontSize: 22)),
          SizedBox(width: 11.w),
          Column(
            crossAxisAlignment: CrossAxisAlignment.start,
            children: [
              Text(
                'publish.promo'.tr(),
                style: GoogleFonts.cairo(
                  fontSize: 14.sp,
                  fontWeight: FontWeight.w800,
                  color: AppColors.primary,
                ),
              ),
              Text(
                'publish.promo_subtitle'.tr(),
                style: GoogleFonts.tajawal(
                  fontSize: 11.5.sp,
                  color: AppColors.textSecondary,
                ),
              ),
            ],
          ),
        ],
      ),
    );
  }
}

class _NavigationSection extends StatelessWidget {
  const _NavigationSection({
    required this.step,
    required this.totalSteps,
    required this.onBack,
    required this.onPrimary,
  });

  final int step;
  final int totalSteps;
  final VoidCallback onBack;
  final VoidCallback onPrimary;

  @override
  Widget build(BuildContext context) {
    final isLast = step == totalSteps - 1;
    return Row(
      children: [
        if (step > 0) ...[
          GestureDetector(
            onTap: onBack,
            child: Container(
              width: 52.r,
              height: 52.r,
              decoration: BoxDecoration(
                color: AppColors.inputFill,
                borderRadius: BorderRadius.circular(24.r),
              ),
              child: Icon(Icons.arrow_back_rounded, size: 22.r, color: AppColors.textPrimary),
            ),
          ),
          SizedBox(width: 10.w),
        ],
        Expanded(
          child: ElevatedButton(
            onPressed: onPrimary,
            child: Row(
              mainAxisAlignment: MainAxisAlignment.center,
              children: [
                Text(isLast ? 'publish.submit'.tr() : 'publish.next'.tr()),
                if (!isLast) ...[
                  SizedBox(width: 8.w),
                  Icon(Icons.chevron_right_rounded, size: 18.r),
                ],
              ],
            ),
          ),
        ),
      ],
    );
  }
}

class _StepIndicator extends StatelessWidget {
  const _StepIndicator({required this.step, required this.labels});
  final int step;
  final List<String> labels;

  @override
  Widget build(BuildContext context) {
    return Row(
      children: List.generate(labels.length, (i) {
        final done = i < step;
        final active = i == step;
        return Expanded(
          child: Row(
            children: [
              Expanded(
                flex: 0,
                child: Column(
                  children: [
                    AnimatedContainer(
                      duration: const Duration(milliseconds: 300),
                      width: 32.r,
                      height: 32.r,
                      decoration: BoxDecoration(
                        color: active || done
                            ? AppColors.primary
                            : AppColors.surface,
                        shape: BoxShape.circle,
                        border: Border.all(
                          color: active || done
                              ? AppColors.primary
                              : AppColors.divider,
                        ),
                      ),
                      child: Center(
                        child: done
                            ? Icon(
                                Icons.check_rounded,
                                size: 16.r,
                                color: Colors.white,
                              )
                            : Text(
                                '${i + 1}',
                                style: GoogleFonts.cairo(
                                  fontSize: 14.sp,
                                  fontWeight: FontWeight.w800,
                                  color: active
                                      ? Colors.white
                                      : AppColors.textHint,
                                ),
                              ),
                      ),
                    ),
                    SizedBox(height: 6.h),
                    Text(
                      labels[i],
                      style: GoogleFonts.cairo(
                        fontSize: 10.5.sp,
                        fontWeight: FontWeight.w700,
                        color: active || done
                            ? AppColors.textPrimary
                            : AppColors.textHint,
                      ),
                      textAlign: TextAlign.center,
                    ),
                  ],
                ),
              ),
              if (i < labels.length - 1)
                Expanded(
                  child: Container(
                    height: 2,
                    margin: EdgeInsetsDirectional.only(bottom: 20.h),
                    color: done ? AppColors.primary : AppColors.divider,
                  ),
                ),
            ],
          ),
        );
      }),
    );
  }
}

// ── Form helpers ──────────────────────────────────────────────────────────
Widget _formField(String label, String placeholder,
    {bool required = false, bool multiline = false, String locale = 'ar'}) {
  return Padding(
    padding: EdgeInsetsDirectional.only(bottom: 16.h),
    child: Column(
      crossAxisAlignment: CrossAxisAlignment.start,
      children: [
        Row(
          children: [
            Text(
              label,
              style: GoogleFonts.cairo(
                fontSize: 13.5.sp,
                fontWeight: FontWeight.w700,
                color: AppColors.textPrimary,
              ),
            ),
            if (required)
              Text(
                ' *',
                style: GoogleFonts.inter(
                  color: AppColors.primary,
                  fontSize: 13.5.sp,
                ),
              ),
          ],
        ),
        SizedBox(height: 7.h),
        Container(
          height: multiline ? null : 50.h,
          constraints: multiline
              ? BoxConstraints(minHeight: 92.h)
              : null,
          padding: EdgeInsetsDirectional.fromSTEB(15.w, 13.h, 15.w, 13.h),
          decoration: BoxDecoration(
            color: AppColors.surface,
            border: Border.all(color: AppColors.divider),
            borderRadius: BorderRadius.circular(14.r),
          ),
          alignment:
              multiline ? AlignmentDirectional.topStart : AlignmentDirectional.centerStart,
          child: Text(
            placeholder,
            style: GoogleFonts.tajawal(
              fontSize: 14.sp,
              color: AppColors.textHint,
            ),
          ),
        ),
      ],
    ),
  );
}

// ── Step 0: Author ────────────────────────────────────────────────────────
class _AuthorStep extends StatelessWidget {
  const _AuthorStep({required this.locale});
  final String locale;

  @override
  Widget build(BuildContext context) {
    return Column(
      children: [
        _formField(
          'publish.author_name_label'.tr(),
          'publish.author_name_hint'.tr(),
          required: true,
          locale: locale,
        ),
        _formField(
          'publish.email_label'.tr(),
          'name@example.com',
          required: true,
          locale: locale,
        ),
        _formField(
          'publish.phone_label'.tr(),
          '+20 1XX XXX XXXX',
          locale: locale,
        ),
        _formField(
          'publish.bio_label'.tr(),
          'publish.bio_hint'.tr(),
          multiline: true,
          locale: locale,
        ),
      ],
    );
  }
}

// ── Step 1: Book ──────────────────────────────────────────────────────────
class _BookStep extends StatelessWidget {
  const _BookStep({required this.locale});
  final String locale;

  @override
  Widget build(BuildContext context) {
    return Column(
      children: [
        _formField(
          'publish.book_title_label'.tr(),
          'publish.book_title_hint'.tr(),
          required: true,
          locale: locale,
        ),
        _formField(
          'publish.summary_label'.tr(),
          'publish.summary_hint'.tr(),
          required: true,
          multiline: true,
          locale: locale,
        ),
        _formField(
          'publish.category_label'.tr(),
          'publish.category_hint'.tr(),
          required: true,
          locale: locale,
        ),
        // PDF upload zone
        Container(
          width: double.infinity,
          padding: EdgeInsetsDirectional.all(22.r),
          decoration: BoxDecoration(
            border: Border.all(
              color: AppColors.divider,
              style: BorderStyle.solid,
              width: 1.5,
            ),
            borderRadius: BorderRadius.circular(16.r),
          ),
          child: Column(
            children: [
              Icon(Icons.upload_file_outlined, size: 26.r, color: AppColors.primary),
              SizedBox(height: 8.h),
              Text(
                'publish.upload_label'.tr(),
                style: GoogleFonts.cairo(
                  fontSize: 13.5.sp,
                  fontWeight: FontWeight.w700,
                  color: AppColors.textPrimary,
                ),
              ),
            ],
          ),
        ),
      ],
    );
  }
}

// ── Step 2: Success ───────────────────────────────────────────────────────
class _SuccessStep extends StatelessWidget {
  const _SuccessStep({required this.locale});
  final String locale;

  @override
  Widget build(BuildContext context) {
    return Padding(
      padding: EdgeInsetsDirectional.symmetric(vertical: 16.h),
      child: Column(
        children: [
          Container(
            width: 88.r,
            height: 88.r,
            decoration: BoxDecoration(
              color: AppColors.brandRedSoft,
              shape: BoxShape.circle,
            ),
            child:
                Icon(Icons.check_rounded, size: 42.r, color: AppColors.primary),
          ),
          SizedBox(height: 18.h),
          Text(
            'publish.ready_title'.tr(),
            style: GoogleFonts.cairo(
              fontSize: 18.sp,
              fontWeight: FontWeight.w800,
              color: AppColors.textPrimary,
            ),
          ),
          SizedBox(height: 8.h),
          Text(
            'publish.success_description'.tr(),
            textAlign: TextAlign.center,
            style: GoogleFonts.tajawal(
              fontSize: 14.sp,
              color: AppColors.textSecondary,
              height: 1.8,
            ),
          ),
        ],
      ),
    );
  }
}
