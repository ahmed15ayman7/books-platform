import 'package:easy_localization/easy_localization.dart';
import 'package:flutter/material.dart';
import 'package:flutter_screenutil/flutter_screenutil.dart';
import 'package:google_fonts/google_fonts.dart';

import 'package:booksplatform/core/helpers/bottom_sheet_helper.dart';
import 'package:booksplatform/core/theme/app_colors.dart';
import 'package:booksplatform/features/newsletter/presentation/widgets/newsletter_bottom_sheet.dart';

class HomeNewsletterStrip extends StatelessWidget {
  const HomeNewsletterStrip({super.key, required this.locale});
  final String locale;

  @override
  Widget build(BuildContext context) {
    return GestureDetector(
      onTap: () => BottomSheetHelper.showAppBottomSheet(
        context: context,
        child: const NewsletterBottomSheet(),
        isScrollable: true,
      ),
      child: Container(
        padding: EdgeInsetsDirectional.all(20.r),
        decoration: BoxDecoration(
          color: AppColors.secondary,
          borderRadius: BorderRadius.circular(24.r),
        ),
        child: Column(
          crossAxisAlignment: CrossAxisAlignment.start,
          children: [
            Text(
              'newsletter_title'.tr(),
              style: GoogleFonts.cairo(
                fontSize: 17.sp,
                fontWeight: FontWeight.w800,
                color: Colors.white,
              ),
            ),
            SizedBox(height: 5.h),
            Text(
              'newsletter_subtitle'.tr(),
              style: GoogleFonts.tajawal(
                fontSize: 13.sp,
                color: Colors.white.withValues(alpha: 0.65),
              ),
            ),
            SizedBox(height: 14.h),
            Row(
              mainAxisAlignment: MainAxisAlignment.end,
              children: [
                Container(
                  padding: EdgeInsetsDirectional.symmetric(
                      horizontal: 18.w, vertical: 10.h),
                  decoration: BoxDecoration(
                    color: AppColors.primary,
                    borderRadius: BorderRadius.circular(14.r),
                  ),
                  child: Text(
                    'newsletter_subscribe'.tr(),
                    style: GoogleFonts.cairo(
                      fontSize: 14.sp,
                      fontWeight: FontWeight.w700,
                      color: Colors.white,
                    ),
                  ),
                ),
              ],
            ),
          ],
        ),
      ),
    );
  }
}
