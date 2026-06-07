import 'package:easy_localization/easy_localization.dart';
import 'package:flutter/material.dart';
import 'package:flutter_screenutil/flutter_screenutil.dart';
import 'package:google_fonts/google_fonts.dart';

import '../../../../../core/theme/app_colors.dart';
import '../../../../../core/theme/app_shadows.dart';
import '../../../../../core/widgets/network_avatar_widget.dart';
import '../../../domain/entities/publisher.dart';

class PublishersPublisherCard extends StatelessWidget {
  const PublishersPublisherCard({
    super.key,
    required this.publisher,
    required this.locale,
    required this.onTap,
  });
  final Publisher publisher;
  final String locale;
  final VoidCallback onTap;

  @override
  Widget build(BuildContext context) {
    final ar = locale == 'ar';
    final displayName = publisher.displayName(locale);
    final initials = displayName
        .split(' ')
        .take(2)
        .map((w) => w.isNotEmpty ? w[0] : '')
        .join();
    return GestureDetector(
      onTap: onTap,
      child: Container(
        padding: EdgeInsetsDirectional.all(14.r),
        decoration: BoxDecoration(
          color: AppColors.surface,
          border: Border.all(color: AppColors.divider),
          borderRadius: BorderRadius.circular(20.r),
          boxShadow: AppShadows.soft,
        ),
        child: Row(
          children: [
            NetworkAvatarWidget(
              size: 54.r,
              initials: initials,
              imageUrl: publisher.imageUrl,
              borderRadius: BorderRadius.circular(16.r),
              initialsFontSize: 18.sp,
            ),
            SizedBox(width: 14.w),
            Expanded(
              child: Column(
                crossAxisAlignment: CrossAxisAlignment.start,
                children: [
                  Row(
                    children: [
                      Flexible(
                        child: Text(
                          displayName,
                          style: GoogleFonts.cairo(
                            fontSize: 15.sp,
                            fontWeight: FontWeight.w700,
                            color: AppColors.textPrimary,
                          ),
                          maxLines: 1,
                          overflow: TextOverflow.ellipsis,
                        ),
                      ),
                      if (publisher.isSponsored) ...[
                        SizedBox(width: 7.w),
                        Container(
                          padding: EdgeInsetsDirectional.fromSTEB(
                              8.w, 2.h, 8.w, 2.h),
                          decoration: BoxDecoration(
                            color: AppColors.primary,
                            borderRadius: BorderRadius.circular(999),
                          ),
                          child: Text(
                            'common.featured'.tr(),
                            style: GoogleFonts.tajawal(
                              fontSize: 10.sp,
                              fontWeight: FontWeight.w700,
                              color: Colors.white,
                            ),
                          ),
                        ),
                      ],
                    ],
                  ),
                  SizedBox(height: 3.h),
                  Text(
                    '${publisher.countryFlag} ${ar ? publisher.countryAr : publisher.countryEn}',
                    style: GoogleFonts.inter(
                      fontSize: 12.5.sp,
                      color: AppColors.textSecondary,
                    ),
                  ),
                ],
              ),
            ),
            Container(
              padding: EdgeInsetsDirectional.fromSTEB(11.w, 6.h, 11.w, 6.h),
              decoration: BoxDecoration(
                color: AppColors.brandRedSoft,
                borderRadius: BorderRadius.circular(999),
              ),
              child: Text(
                '${publisher.bookCount} ${'common.books'.tr()}',
                style: GoogleFonts.cairo(
                  fontSize: 12.sp,
                  fontWeight: FontWeight.w700,
                  color: AppColors.primary,
                ),
              ),
            ),
          ],
        ),
      ),
    );
  }
}
