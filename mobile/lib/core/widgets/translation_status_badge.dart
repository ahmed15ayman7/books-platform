import 'package:flutter/material.dart';
import 'package:flutter_screenutil/flutter_screenutil.dart';
import 'package:google_fonts/google_fonts.dart';

import '../enums/translation_status.dart';
import '../theme/app_colors.dart';

class TranslationStatusBadge extends StatelessWidget {
  const TranslationStatusBadge({
    super.key,
    required this.status,
    this.small = false,
    this.locale = 'ar',
  });

  final TranslationStatus status;
  final bool small;
  final String locale;

  @override
  Widget build(BuildContext context) {
    final config = _config(status);
    if (config == null) return const SizedBox.shrink();

    final ar = locale == 'ar';
    return Container(
      padding: EdgeInsets.symmetric(
        horizontal: small ? 7.w : 10.w,
        vertical: small ? 2.h : 3.h,
      ),
      decoration: BoxDecoration(
        color: config.backgroundColor,
        borderRadius: BorderRadius.circular(999),
      ),
      child: Text(
        ar ? config.labelAr : config.labelEn,
        style: GoogleFonts.tajawal(
          fontSize: small ? 10.sp : 11.5.sp,
          fontWeight: FontWeight.w700,
          color: Colors.white,
          height: 1.3,
        ),
      ),
    );
  }

  _StatusConfig? _config(TranslationStatus s) => switch (s) {
        TranslationStatus.translated => _StatusConfig(
            backgroundColor: AppColors.success,
            labelAr: 'مترجم',
            labelEn: 'Translated',
          ),
        TranslationStatus.nominated => _StatusConfig(
            backgroundColor: AppColors.warning,
            labelAr: 'مرشح للترجمة',
            labelEn: 'Nominated',
          ),
        TranslationStatus.notTranslated => _StatusConfig(
            backgroundColor: AppColors.textHint,
            labelAr: 'غير مترجم',
            labelEn: 'Not Translated',
          ),
        TranslationStatus.newBook => _StatusConfig(
            backgroundColor: AppColors.primary,
            labelAr: 'جديد',
            labelEn: 'New',
          ),
      };
}

class _StatusConfig {
  const _StatusConfig({
    required this.backgroundColor,
    required this.labelAr,
    required this.labelEn,
  });
  final Color backgroundColor;
  final String labelAr;
  final String labelEn;
}
