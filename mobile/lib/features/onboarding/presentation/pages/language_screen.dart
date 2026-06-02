import 'package:easy_localization/easy_localization.dart' hide TextDirection;
import 'package:flutter/material.dart';
import 'package:flutter_screenutil/flutter_screenutil.dart';
import 'package:google_fonts/google_fonts.dart';

import '../../../../core/router/app_routes.dart';
import '../../../../core/theme/app_colors.dart';

class LanguageScreen extends StatelessWidget {
  const LanguageScreen({super.key});

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      backgroundColor: AppColors.background,
      body: SafeArea(
        child: Padding(
          padding: EdgeInsetsDirectional.symmetric(horizontal: 24.w),
          child: Column(
            children: [
              SizedBox(height: 48.h),
              // Brand logo
              Container(
                width: 60.r,
                height: 60.r,
                decoration: BoxDecoration(
                  color: AppColors.primary,
                  borderRadius: BorderRadius.circular(16.r),
                ),
                child: Icon(
                  Icons.menu_book_rounded,
                  color: Colors.white,
                  size: 34.r,
                ),
              ),
              SizedBox(height: 32.h),
              Text(
                'اختر لغتك\nChoose your language',
                textAlign: TextAlign.center,
                style: GoogleFonts.cairo(
                  fontSize: 22.sp,
                  fontWeight: FontWeight.w800,
                  color: AppColors.textPrimary,
                  height: 1.4,
                ),
              ),
              SizedBox(height: 8.h),
              Text(
                'يمكنك تغيير اللغة لاحقاً من الإعدادات\nYou can change this later in Settings',
                textAlign: TextAlign.center,
                style: GoogleFonts.tajawal(
                  fontSize: 13.sp,
                  color: AppColors.textSecondary,
                  height: 1.7,
                ),
              ),
              SizedBox(height: 48.h),
              _LanguageCard(
                locale: const Locale('ar'),
                label: 'العربية',
                subtitle: 'Arabic',
                isRtl: true,
                onTap: (l) => _select(context, l),
              ),
              SizedBox(height: 16.h),
              _LanguageCard(
                locale: const Locale('en'),
                label: 'English',
                subtitle: 'اللغة الإنجليزية',
                isRtl: false,
                onTap: (l) => _select(context, l),
              ),
            ],
          ),
        ),
      ),
    );
  }

  Future<void> _select(BuildContext context, Locale locale) async {
    await context.setLocale(locale);
    if (!context.mounted) return;
    Navigator.of(context).pushReplacementNamed(AppRoutes.onboarding);
  }
}

class _LanguageCard extends StatelessWidget {
  const _LanguageCard({
    required this.locale,
    required this.label,
    required this.subtitle,
    required this.isRtl,
    required this.onTap,
  });

  final Locale locale;
  final String label;
  final String subtitle;
  final bool isRtl;
  final ValueChanged<Locale> onTap;

  @override
  Widget build(BuildContext context) {
    return GestureDetector(
      onTap: () => onTap(locale),
      child: Container(
        padding: EdgeInsets.all(20.r),
        decoration: BoxDecoration(
          color: AppColors.surface,
          borderRadius: BorderRadius.circular(20.r),
          border: Border.all(color: AppColors.divider),
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
                  Text(
                    label,
                    style: GoogleFonts.cairo(
                      fontSize: 18.sp,
                      fontWeight: FontWeight.w700,
                      color: AppColors.textPrimary,
                    ),
                  ),
                  Text(
                    subtitle,
                    style: GoogleFonts.inter(
                      fontSize: 12.sp,
                      color: AppColors.textSecondary,
                    ),
                  ),
                ],
              ),
            ),
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
