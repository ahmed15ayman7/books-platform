import 'package:flutter/material.dart';
import 'package:flutter_screenutil/flutter_screenutil.dart';
import 'package:google_fonts/google_fonts.dart';

import '../../../../core/theme/app_colors.dart';
import '../../domain/entities/rating.dart';
import 'star_rating_bar.dart';

class RatingSummaryWidget extends StatelessWidget {
  const RatingSummaryWidget({super.key, required this.rating});

  final Rating rating;

  @override
  Widget build(BuildContext context) {
    if (rating.count == 0) return const SizedBox.shrink();
    return Row(
      crossAxisAlignment: CrossAxisAlignment.start,
      children: [
        Column(
          children: [
            Text(
              rating.average.toStringAsFixed(1),
              style: GoogleFonts.inter(
                fontSize: 40.sp,
                fontWeight: FontWeight.w700,
                color: AppColors.textPrimary,
              ),
            ),
            StarRatingBar(rating: rating.average),
            SizedBox(height: 4.h),
            Text(
              '${rating.count}',
              style: GoogleFonts.inter(
                fontSize: 12.sp,
                color: AppColors.textSecondary,
              ),
            ),
          ],
        ),
        SizedBox(width: 16.w),
        Expanded(
          child: Column(
            children: List.generate(5, (i) {
              final star = 5 - i;
              final count = rating.distribution[star] ?? 0;
              final fraction = rating.count > 0 ? count / rating.count : 0.0;
              return Padding(
                padding: EdgeInsetsDirectional.only(bottom: 4.h),
                child: Row(
                  children: [
                    Text(
                      '$star',
                      style: GoogleFonts.inter(
                        fontSize: 12.sp,
                        color: AppColors.textSecondary,
                      ),
                    ),
                    SizedBox(width: 4.w),
                    Expanded(
                      child: ClipRRect(
                        borderRadius: BorderRadius.circular(4.r),
                        child: LinearProgressIndicator(
                          value: fraction,
                          backgroundColor: AppColors.divider,
                          color: AppColors.warning,
                          minHeight: 8.h,
                        ),
                      ),
                    ),
                  ],
                ),
              );
            }),
          ),
        ),
      ],
    );
  }
}
