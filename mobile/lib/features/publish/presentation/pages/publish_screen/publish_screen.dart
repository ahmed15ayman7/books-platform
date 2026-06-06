import 'package:easy_localization/easy_localization.dart';
import 'package:flutter/material.dart';
import 'package:flutter_bloc/flutter_bloc.dart';
import 'package:flutter_screenutil/flutter_screenutil.dart';
import 'package:google_fonts/google_fonts.dart';

import '../../../../../core/di/injection_container.dart';
import '../../../../../core/helpers/snack_bar_helper.dart';
import '../../../../../core/router/app_routes.dart';
import '../../../../../core/theme/app_colors.dart';
import '../../../../../core/widgets/app_bar_widget.dart';
import '../../../../../core/widgets/bottom_nav_widget.dart';
import '../../cubit/publish_cubit.dart';
import '../../cubit/publish_state.dart';
import 'publish_author_step.dart';
import 'publish_book_step.dart';
import 'publish_navigation_section.dart';
import 'publish_promo_section.dart';
import 'publish_review_step.dart';
import 'publish_step_indicator.dart';

class PublishScreen extends StatefulWidget {
  const PublishScreen({super.key});

  @override
  State<PublishScreen> createState() => _PublishScreenState();
}

class _PublishScreenState extends State<PublishScreen> {
  static const _totalSteps = 3;

  final _authorFormKey = GlobalKey<FormState>();
  final _bookFormKey = GlobalKey<FormState>();

  late final _nameCtrl = TextEditingController();
  late final _emailCtrl = TextEditingController();
  late final _phoneCtrl = TextEditingController();
  late final _bioCtrl = TextEditingController();
  late final _titleCtrl = TextEditingController();
  late final _summaryCtrl = TextEditingController();
  late final _categoryCtrl = TextEditingController();

  bool _agreedToContentStandards = false;
  bool _showSuccess = false;

  @override
  void dispose() {
    _nameCtrl.dispose();
    _emailCtrl.dispose();
    _phoneCtrl.dispose();
    _bioCtrl.dispose();
    _titleCtrl.dispose();
    _summaryCtrl.dispose();
    _categoryCtrl.dispose();
    super.dispose();
  }

  void _pushFormDataToCubit(BuildContext context, int step) {
    final cubit = context.read<PublishCubit>();
    if (step == 0) {
      cubit
        ..updateField('authorName', _nameCtrl.text)
        ..updateField('authorEmail', _emailCtrl.text)
        ..updateField('authorPhone', _phoneCtrl.text)
        ..updateField('authorBio', _bioCtrl.text);
    } else if (step == 1) {
      cubit
        ..updateField('bookTitleAr', _titleCtrl.text)
        ..updateField('bookSummary', _summaryCtrl.text)
        ..updateField('bookCategory', _categoryCtrl.text);
    }
  }

  void _onNext(BuildContext context, int currentStep) {
    final valid = switch (currentStep) {
      0 => _authorFormKey.currentState?.validate() ?? false,
      1 => _bookFormKey.currentState?.validate() ?? false,
      _ => true,
    };
    if (!valid) return;
    _pushFormDataToCubit(context, currentStep);
    context.read<PublishCubit>().nextStep();
  }

  void _onBack(BuildContext context) {
    context.read<PublishCubit>().prevStep();
  }

  @override
  Widget build(BuildContext context) {
    final locale = context.locale.languageCode;
    final ar = locale == 'ar';
    final stepLabels = ar
        ? ['معلومات المؤلف', 'معلومات الكتاب', 'المراجعة']
        : ['Author Info', 'Book Info', 'Review'];

    return BlocConsumer<PublishCubit, PublishState>(
      listener: (ctx, state) {
        if (state is PublishSuccess) {
          setState(() => _showSuccess = true);
        } else if (state is PublishError) {
          getIt<SnackBarHelper>().showError(state.message);
        }
      },
      builder: (ctx, state) {
        if (_showSuccess) {
          return _SuccessScreen(
            locale: locale,
            onSubmitAnother: () {
              setState(() => _showSuccess = false);
              _agreedToContentStandards = false;
              _nameCtrl.clear();
              _emailCtrl.clear();
              _phoneCtrl.clear();
              _bioCtrl.clear();
              _titleCtrl.clear();
              _summaryCtrl.clear();
              _categoryCtrl.clear();
              ctx.read<PublishCubit>().resetForm();
            },
            onHome: () =>
                Navigator.of(ctx).pushReplacementNamed(AppRoutes.home),
          );
        }

        final currentStep = state is PublishStep ? state.step : 0;
        final formData = state is PublishStep
            ? state.formData
            : <String, dynamic>{};
        final isLoading =
            state is PublishSubmitting ||
            state is UploadingFile ||
            state is CheckingEligibility;
        final isEligible = state is EligibilityLoaded
            ? state.isEligibleForFree
            : null;

        return Scaffold(
          backgroundColor: AppColors.background,
          bottomNavigationBar: SafeArea(
            top: false,
            child: PublishNavigationSection(
              step: currentStep,
              totalSteps: _totalSteps,
              onBack: () => _onBack(ctx),
              onPrimary: currentStep < _totalSteps - 1
                  ? () => _onNext(ctx, currentStep)
                  : (_agreedToContentStandards && !isLoading)
                  ? () => ctx.read<PublishCubit>().submit()
                  : null,
              isLoading: isLoading,
            ),
          ),
          body: SafeArea(
            bottom: false,
            child: Column(
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
                      16.w,
                      18.h,
                      16.w,
                      8.h,
                    ),
                    child: Column(
                      children: [
                        PublishStepIndicator(
                          step: currentStep,
                          labels: stepLabels,
                        ),
                        SizedBox(height: 24.h),
                        if (currentStep == 0)
                          Form(
                            key: _authorFormKey,
                            child: PublishAuthorStep(
                              nameCtrl: _nameCtrl,
                              emailCtrl: _emailCtrl,
                              phoneCtrl: _phoneCtrl,
                              bioCtrl: _bioCtrl,
                            ),
                          ),
                        if (currentStep == 0 && isEligible != null)
                          _EligibilityBadge(isEligibleForFree: isEligible),
                        if (currentStep == 1)
                          Form(
                            key: _bookFormKey,
                            child: PublishBookStep(
                              titleCtrl: _titleCtrl,
                              summaryCtrl: _summaryCtrl,
                              categoryCtrl: _categoryCtrl,
                              onPickFile: () =>
                                  ctx.read<PublishCubit>().pickFile(),
                              onPickCover: () =>
                                  ctx.read<PublishCubit>().pickCoverImage(),
                              formData: formData,
                            ),
                          ),
                        if (currentStep == 2)
                          PublishReviewStep(
                            formData: formData,
                            onAgreedChanged: (v) =>
                                setState(() => _agreedToContentStandards = v),
                          ),
                        SizedBox(height: 16.h),
                        const PublishPromoSection(),
                        SizedBox(height: 18.h),
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
          ),
        );
      },
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
      case BottomNavTab.media:
        Navigator.of(context).pushReplacementNamed(AppRoutes.media);
      case BottomNavTab.publishers:
        Navigator.of(context).pushReplacementNamed(AppRoutes.publishers);
    }
  }
}

class _EligibilityBadge extends StatelessWidget {
  const _EligibilityBadge({required this.isEligibleForFree});
  final bool isEligibleForFree;

  @override
  Widget build(BuildContext context) {
    return Padding(
      padding: EdgeInsetsDirectional.only(top: 8.h),
      child: Container(
        padding: EdgeInsetsDirectional.symmetric(
          horizontal: 12.w,
          vertical: 8.h,
        ),
        decoration: BoxDecoration(
          color: isEligibleForFree
              ? AppColors.success.withValues(alpha: 0.1)
              : AppColors.warning.withValues(alpha: 0.1),
          borderRadius: BorderRadius.circular(8.r),
        ),
        child: Row(
          mainAxisSize: MainAxisSize.min,
          children: [
            Icon(
              isEligibleForFree
                  ? Icons.check_circle_outline
                  : Icons.info_outline,
              color: isEligibleForFree ? AppColors.success : AppColors.warning,
              size: 16.sp,
            ),
            SizedBox(width: 6.w),
            Text(
              isEligibleForFree
                  ? 'publish.eligibility_free'.tr()
                  : 'publish.eligibility_paid'.tr(),
              style: TextStyle(
                fontSize: 12.sp,
                color: isEligibleForFree
                    ? AppColors.success
                    : AppColors.warning,
              ),
            ),
          ],
        ),
      ),
    );
  }
}

class _SuccessScreen extends StatelessWidget {
  const _SuccessScreen({
    required this.locale,
    required this.onSubmitAnother,
    required this.onHome,
  });

  final String locale;
  final VoidCallback onSubmitAnother;
  final VoidCallback onHome;

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      backgroundColor: AppColors.background,
      body: SafeArea(
        child: Padding(
          padding: EdgeInsetsDirectional.all(24.r),
          child: Column(
            mainAxisAlignment: MainAxisAlignment.center,
            children: [
              Container(
                width: 88.r,
                height: 88.r,
                decoration: BoxDecoration(
                  color: AppColors.brandRedSoft,
                  shape: BoxShape.circle,
                ),
                child: Icon(
                  Icons.check_rounded,
                  size: 42.r,
                  color: AppColors.primary,
                ),
              ),
              SizedBox(height: 18.h),
              Text(
                'publish.success_title'.tr(),
                textAlign: TextAlign.center,
                style: GoogleFonts.cairo(
                  fontSize: 20.sp,
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
              SizedBox(height: 32.h),
              SizedBox(
                width: double.infinity,
                child: ElevatedButton(
                  onPressed: onSubmitAnother,
                  child: Text('publish.submit_another'.tr()),
                ),
              ),
              SizedBox(height: 12.h),
              SizedBox(
                width: double.infinity,
                child: OutlinedButton(
                  onPressed: onHome,
                  child: Text('publish.back_to_home'.tr()),
                ),
              ),
            ],
          ),
        ),
      ),
    );
  }
}
