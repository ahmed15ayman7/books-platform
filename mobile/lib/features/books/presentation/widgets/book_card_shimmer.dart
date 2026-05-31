import 'package:flutter/material.dart';
import 'package:flutter_screenutil/flutter_screenutil.dart';
import 'package:shimmer/shimmer.dart';

import '../../../../core/theme/app_colors.dart';

class BookCardShimmer extends StatelessWidget {
  const BookCardShimmer({super.key, this.width});

  final double? width;

  @override
  Widget build(BuildContext context) {
    return Shimmer.fromColors(
      baseColor: AppColors.shimmerBase,
      highlightColor: AppColors.shimmerHighlight,
      child: Container(
        width: width,
        clipBehavior: Clip.hardEdge,
        decoration: BoxDecoration(
          borderRadius: BorderRadius.circular(24.r),
        ),
        child: Column(
          crossAxisAlignment: CrossAxisAlignment.start,
          children: [
            AspectRatio(
              aspectRatio: 3 / 4,
              child: Container(color: Colors.white),
            ),
            Padding(
              padding: EdgeInsetsDirectional.all(11.r),
              child: Column(
                crossAxisAlignment: CrossAxisAlignment.start,
                children: [
                  _bone(70.w, 10.h),
                  SizedBox(height: 6.h),
                  _bone(null, 13.h),
                  SizedBox(height: 4.h),
                  _bone(110.w, 13.h),
                  SizedBox(height: 6.h),
                  _bone(80.w, 10.h),
                  SizedBox(height: 7.h),
                  _pill(90.w, 22.h),
                ],
              ),
            ),
          ],
        ),
      ),
    );
  }

  Widget _bone(double? w, double h) => Container(
        width: w,
        height: h,
        decoration: BoxDecoration(
          color: Colors.white,
          borderRadius: BorderRadius.circular(4.r),
        ),
      );

  Widget _pill(double w, double h) => Container(
        width: w,
        height: h,
        decoration: BoxDecoration(
          color: Colors.white,
          borderRadius: BorderRadius.circular(999),
        ),
      );
}
