import 'package:easy_localization/easy_localization.dart';
import 'package:flutter/material.dart';
import 'package:flutter_screenutil/flutter_screenutil.dart';
import 'package:google_fonts/google_fonts.dart';

import '../../../../../core/theme/app_colors.dart';

class ArticleDetailVideoBadge extends StatelessWidget {
  const ArticleDetailVideoBadge({super.key, required this.locale});
  final String locale;

  @override
  Widget build(BuildContext context) {
    return Container(
      padding: EdgeInsetsDirectional.fromSTEB(12.w, 10.h, 12.w, 10.h),
      decoration: BoxDecoration(
        color: AppColors.secondary,
        borderRadius: BorderRadius.circular(12.r),
      ),
      child: Row(
        mainAxisSize: MainAxisSize.min,
        children: [
          Icon(Icons.play_circle_outline_rounded,
              color: Colors.white, size: 20.r),
          SizedBox(width: 8.w),
          Text(
            'article_detail.video_badge'.tr(),
            style: GoogleFonts.tajawal(
              fontSize: 13.sp,
              color: Colors.white,
            ),
          ),
        ],
      ),
    );
  }
}
