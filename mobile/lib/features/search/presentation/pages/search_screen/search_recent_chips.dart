import 'package:easy_localization/easy_localization.dart';
import 'package:flutter/material.dart';
import 'package:flutter_screenutil/flutter_screenutil.dart';
import 'package:google_fonts/google_fonts.dart';

import '../../../../../core/theme/app_colors.dart';

class SearchRecentChips extends StatelessWidget {
  const SearchRecentChips({
    super.key,
    required this.locale,
    required this.onChipTap,
  });
  final String locale;
  // $mobile-debug-skill | Problem: chips were purely decorative — no tap handler. Fix: onChipTap callback fills the search field with the chip text.
  final ValueChanged<String> onChipTap;

  @override
  Widget build(BuildContext context) {
    final recent = ['هارفارد', 'فلسفة', 'ماركيز'];
    return Padding(
      padding: EdgeInsetsDirectional.fromSTEB(16.w, 16.h, 16.w, 4.h),
      child: Column(
        crossAxisAlignment: CrossAxisAlignment.start,
        children: [
          Text(
            'search.recent_searches'.tr(),
            style: GoogleFonts.cairo(
              fontSize: 13.sp,
              fontWeight: FontWeight.w700,
              color: AppColors.textSecondary,
            ),
          ),
          SizedBox(height: 10.h),
          Wrap(
            spacing: 8.w,
            children: recent
                .map(
                  (r) => GestureDetector(
                    onTap: () => onChipTap(r),
                    child: Container(
                      padding: EdgeInsets.symmetric(
                          horizontal: 14.w, vertical: 7.h),
                      decoration: BoxDecoration(
                        color: AppColors.surface,
                        border: Border.all(color: AppColors.divider),
                        borderRadius: BorderRadius.circular(999),
                      ),
                      child: Row(
                        mainAxisSize: MainAxisSize.min,
                        children: [
                          Icon(
                            Icons.search_rounded,
                            size: 13.r,
                            color: AppColors.textHint,
                          ),
                          SizedBox(width: 6.w),
                          Text(
                            r,
                            style: GoogleFonts.cairo(
                              fontSize: 13.sp,
                              fontWeight: FontWeight.w600,
                              color: AppColors.textPrimary,
                            ),
                          ),
                        ],
                      ),
                    ),
                  ),
                )
                .toList(),
          ),
        ],
      ),
    );
  }
}
