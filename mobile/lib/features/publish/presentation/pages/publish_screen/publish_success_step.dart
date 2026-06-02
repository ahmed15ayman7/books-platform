import 'package:easy_localization/easy_localization.dart';
import 'package:flutter/material.dart';
import 'package:flutter_screenutil/flutter_screenutil.dart';
import 'package:google_fonts/google_fonts.dart';

import '../../../../../core/theme/app_colors.dart';

class PublishSuccessStep extends StatelessWidget {
  const PublishSuccessStep({super.key, required this.locale});
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
            child: Icon(
              Icons.check_rounded,
              size: 42.r,
              color: AppColors.primary,
            ),
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
