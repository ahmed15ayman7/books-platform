import 'package:easy_localization/easy_localization.dart';
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
  });

  final TranslationStatus status;
  final bool small;

  @override
  Widget build(BuildContext context) {
    final config = _config(status);
    if (config == null) return const SizedBox.shrink();

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
        config.label,
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
            label: 'books.status.translated'.tr(),
          ),
        TranslationStatus.nominated => _StatusConfig(
            backgroundColor: AppColors.warning,
            label: 'books.status.nominated'.tr(),
          ),
        TranslationStatus.notTranslated => _StatusConfig(
            backgroundColor: AppColors.textHint,
            label: 'books.status.not_translated'.tr(),
          ),
        TranslationStatus.newBook => _StatusConfig(
            backgroundColor: AppColors.primary,
            label: 'common.new_badge'.tr(),
          ),
      };
}

class _StatusConfig {
  const _StatusConfig({
    required this.backgroundColor,
    required this.label,
  });
  final Color backgroundColor;
  final String label;
}
