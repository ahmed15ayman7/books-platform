import 'package:flutter/material.dart';
import 'package:flutter_screenutil/flutter_screenutil.dart';
import 'package:injectable/injectable.dart';

import '../theme/app_colors.dart';
import '../theme/app_text_styles.dart';

@lazySingleton
class SnackBarHelper {
  final GlobalKey<NavigatorState> _navigatorKey;

  SnackBarHelper(this._navigatorKey);

  void showSuccess(String message) =>
      _show(message, AppColors.success, Icons.check_circle_outline);

  void showError(String message) =>
      _show(message, AppColors.error, Icons.error_outline);

  void showInfo(String message) =>
      _show(message, AppColors.primary, Icons.info_outline);

  void showWarning(String message) =>
      _show(message, AppColors.warning, Icons.warning_amber_outlined);

  void _show(String message, Color color, IconData icon) {
    final context = _navigatorKey.currentContext;
    if (context == null) return;
    ScaffoldMessenger.of(context)
      ..hideCurrentSnackBar()
      ..showSnackBar(
        SnackBar(
          backgroundColor: color,
          behavior: SnackBarBehavior.floating,
          shape: RoundedRectangleBorder(
            borderRadius: BorderRadius.circular(12.r),
          ),
          margin: EdgeInsets.symmetric(horizontal: 16.w, vertical: 8.h),
          content: Row(
            children: [
              Icon(icon, color: AppColors.surface),
              SizedBox(width: 12.w),
              Expanded(
                child: Text(
                  message,
                  style: AppTextStyles.bodyMedium
                      .copyWith(color: AppColors.surface),
                ),
              ),
            ],
          ),
        ),
      );
  }
}
