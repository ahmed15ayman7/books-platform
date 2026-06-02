import 'package:easy_localization/easy_localization.dart';
import 'package:flutter/material.dart';
import 'package:flutter_screenutil/flutter_screenutil.dart';

import '../../../../../core/theme/app_colors.dart';

class PublishNavigationSection extends StatelessWidget {
  const PublishNavigationSection({
    super.key,
    required this.step,
    required this.totalSteps,
    required this.onBack,
    this.onPrimary,
    this.isLoading = false,
  });

  final int step;
  final int totalSteps;
  final VoidCallback onBack;
  final VoidCallback? onPrimary;
  final bool isLoading;

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
              child: Icon(
                Icons.arrow_back_rounded,
                size: 22.r,
                color: AppColors.textPrimary,
              ),
            ),
          ),
          SizedBox(width: 10.w),
        ],
        Expanded(
          child: ElevatedButton(
            onPressed: isLoading ? null : onPrimary,
            child: isLoading
                ? SizedBox(
                    width: 20.w,
                    height: 20.w,
                    child: const CircularProgressIndicator(
                        strokeWidth: 2, color: Colors.white),
                  )
                : Row(
                    mainAxisAlignment: MainAxisAlignment.center,
                    children: [
                      Text(
                          isLast ? 'publish.submit'.tr() : 'publish.next'.tr()),
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
