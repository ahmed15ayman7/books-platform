import 'package:easy_localization/easy_localization.dart' hide TextDirection;
import 'package:flutter/material.dart';
import 'package:flutter_screenutil/flutter_screenutil.dart';

import '../../../../core/constants/app_constants.dart';
import '../../../../core/router/app_routes.dart';
import '../../../../core/theme/app_colors.dart';
import '../../../../core/theme/app_text_styles.dart';

class LanguageScreen extends StatefulWidget {
  const LanguageScreen({super.key});

  @override
  State<LanguageScreen> createState() => _LanguageScreenState();
}

class _LanguageScreenState extends State<LanguageScreen>
    with SingleTickerProviderStateMixin {
  late final AnimationController _controller;
  late final Animation<double> _fadeIn;
  Locale? _selectedLocale;

  @override
  void initState() {
    super.initState();
    _controller = AnimationController(
      vsync: this,
      duration: kSplashFadeDuration,
    );
    _fadeIn = CurvedAnimation(parent: _controller, curve: Curves.easeOut);
    _controller.forward();
  }

  @override
  void dispose() {
    _controller.dispose();
    super.dispose();
  }

  String get _suggestedLanguageCode {
    final code =
        WidgetsBinding.instance.platformDispatcher.locale.languageCode;
    return code == 'ar' ? 'ar' : 'en';
  }

  Future<void> _select(Locale locale) async {
    setState(() => _selectedLocale = locale);
    await Future<void>.delayed(kAnimationDuration);
    if (!mounted) return;
    await context.setLocale(locale);
    if (!mounted) return;
    Navigator.of(context).pushReplacementNamed(AppRoutes.onboarding);
  }

  @override
  Widget build(BuildContext context) {
    final suggested = _suggestedLanguageCode;

    return Scaffold(
      backgroundColor: AppColors.background,
      body: FadeTransition(
        opacity: _fadeIn,
        child: Column(
          children: [
            ColoredBox(
              color: AppColors.secondary,
              child: SafeArea(
                bottom: false,
                child: Padding(
                  padding: EdgeInsets.symmetric(vertical: 32.h),
                  child: Center(
                    child: Image.asset(
                      kBrandingLogoAsset,
                      width: 260.w,
                    ),
                  ),
                ),
              ),
            ),
            Expanded(
              child: SafeArea(
                top: false,
                child: SingleChildScrollView(
                  padding: EdgeInsetsDirectional.fromSTEB(24.w, 32.h, 24.w, 24.h),
                  child: Column(
                    children: [
                      Text(
                        'language_choose.title'.tr(),
                        textAlign: TextAlign.center,
                        style: AppTextStyles.headlineSmall,
                      ),
                      SizedBox(height: 8.h),
                      Text(
                        'language_choose.subtitle'.tr(),
                        textAlign: TextAlign.center,
                        style: AppTextStyles.bodyMedium.copyWith(
                          color: AppColors.textSecondary,
                        ),
                      ),
                      SizedBox(height: 32.h),
                      _LanguageCard(
                        locale: const Locale('ar'),
                        label: 'arabic'.tr(),
                        subtitle: 'language_choose.arabic_subtitle'.tr(),
                        labelStyle: AppTextStyles.headlineSmall.copyWith(
                          fontSize: 18.sp,
                          height: 1.3,
                        ),
                        subtitleStyle: AppTextStyles.labelSmall.copyWith(
                          fontSize: 12.sp,
                        ),
                        isRtl: true,
                        isSuggested: suggested == 'ar',
                        isSelected: _selectedLocale?.languageCode == 'ar',
                        onTap: _select,
                      ),
                      SizedBox(height: 16.h),
                      _LanguageCard(
                        locale: const Locale('en'),
                        label: 'english'.tr(),
                        subtitle: 'language_choose.english_subtitle'.tr(),
                        labelStyle: AppTextStyles.headlineSmall.copyWith(
                          fontSize: 18.sp,
                          height: 1.3,
                        ),
                        subtitleStyle: AppTextStyles.bodySmall,
                        isRtl: false,
                        isSuggested: suggested == 'en',
                        isSelected: _selectedLocale?.languageCode == 'en',
                        onTap: _select,
                      ),
                    ],
                  ),
                ),
              ),
            ),
          ],
        ),
      ),
    );
  }
}

class _LanguageCard extends StatelessWidget {
  const _LanguageCard({
    required this.locale,
    required this.label,
    required this.subtitle,
    required this.labelStyle,
    required this.subtitleStyle,
    required this.isRtl,
    required this.isSuggested,
    required this.isSelected,
    required this.onTap,
  });

  final Locale locale;
  final String label;
  final String subtitle;
  final TextStyle labelStyle;
  final TextStyle subtitleStyle;
  final bool isRtl;
  final bool isSuggested;
  final bool isSelected;
  final ValueChanged<Locale> onTap;

  @override
  Widget build(BuildContext context) {
    final borderColor = isSelected
        ? AppColors.primary
        : isSuggested
            ? AppColors.primary.withValues(alpha: 0.45)
            : AppColors.divider;
    final borderWidth = isSelected || isSuggested ? 2.0 : 1.0;

    return GestureDetector(
      onTap: isSelected ? null : () => onTap(locale),
      child: AnimatedContainer(
        duration: kAnimationDuration,
        curve: Curves.easeOut,
        padding: EdgeInsets.all(20.r),
        decoration: BoxDecoration(
          color: isSelected ? AppColors.brandRedSoft : AppColors.surface,
          borderRadius: BorderRadius.circular(20.r),
          border: Border.all(color: borderColor, width: borderWidth),
          boxShadow: const [
            BoxShadow(
              color: Color(0x0F000000),
              blurRadius: 24,
              offset: Offset(0, 4),
            ),
          ],
        ),
        child: Row(
          children: [
            Expanded(
              child: Column(
                crossAxisAlignment: CrossAxisAlignment.start,
                children: [
                  Text(label, style: labelStyle),
                  Text(subtitle, style: subtitleStyle),
                ],
              ),
            ),
            if (isSelected)
              Icon(Icons.check_circle_rounded, color: AppColors.primary, size: 24.r)
            else
              Directionality(
                textDirection: isRtl ? TextDirection.rtl : TextDirection.ltr,
                child: Icon(
                  Icons.chevron_right_rounded,
                  color: AppColors.primary,
                  size: 24.r,
                ),
              ),
          ],
        ),
      ),
    );
  }
}
