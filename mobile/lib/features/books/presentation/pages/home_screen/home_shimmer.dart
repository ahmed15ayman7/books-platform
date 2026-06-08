import 'package:flutter/material.dart';
import 'package:flutter_screenutil/flutter_screenutil.dart';
import 'package:shimmer/shimmer.dart';

import '../../../../../core/theme/app_colors.dart';
import '../../widgets/book_card_shimmer.dart';

class HomeShimmer extends StatelessWidget {
  const HomeShimmer({super.key});

  @override
  Widget build(BuildContext context) {
    return SingleChildScrollView(
      physics: const NeverScrollableScrollPhysics(),
      child: Column(
        crossAxisAlignment: CrossAxisAlignment.start,
        children: [
          const HomeFeaturedHeroShimmer(),
          SizedBox(height: 26.h),
          const HomeShimmerSection(),
          SizedBox(height: 26.h),
          const HomeShimmerSection(),
          Padding(
            padding: EdgeInsetsDirectional.fromSTEB(16.w, 28.h, 16.w, 6.h),
            child: Shimmer.fromColors(
              baseColor: AppColors.shimmerBase,
              highlightColor: AppColors.shimmerHighlight,
              child: Container(
                height: 120.h,
                decoration: BoxDecoration(
                  color: Colors.white,
                  borderRadius: BorderRadius.circular(24.r),
                ),
              ),
            ),
          ),
          SizedBox(height: 16.h),
        ],
      ),
    );
  }
}

class HomeFeaturedHeroShimmer extends StatelessWidget {
  const HomeFeaturedHeroShimmer({super.key});

  @override
  Widget build(BuildContext context) {
    return Padding(
      padding: EdgeInsetsDirectional.fromSTEB(16.w, 16.h, 16.w, 8.h),
      child: Shimmer.fromColors(
        baseColor: AppColors.shimmerBase,
        highlightColor: AppColors.shimmerHighlight,
        child: Container(
          height: 200.h,
          decoration: BoxDecoration(
            color: Colors.white,
            borderRadius: BorderRadius.circular(26.r),
          ),
        ),
      ),
    );
  }
}

class HomeShimmerSection extends StatelessWidget {
  const HomeShimmerSection({super.key});

  @override
  Widget build(BuildContext context) {
    return Column(
      crossAxisAlignment: CrossAxisAlignment.start,
      children: [
        Padding(
          padding: EdgeInsetsDirectional.fromSTEB(16.w, 0, 16.w, 12.h),
          child: Shimmer.fromColors(
            baseColor: AppColors.shimmerBase,
            highlightColor: AppColors.shimmerHighlight,
            child: Container(
              height: 18.h,
              width: 140.w,
              decoration: BoxDecoration(
                color: Colors.white,
                borderRadius: BorderRadius.circular(4.r),
              ),
            ),
          ),
        ),
        SingleChildScrollView(
          scrollDirection: Axis.horizontal,
          physics: const NeverScrollableScrollPhysics(),
          padding: EdgeInsetsDirectional.fromSTEB(16.w, 0, 16.w, 4.h),
          child: Row(
            crossAxisAlignment: CrossAxisAlignment.start,
            children: [
              BookCardShimmer(width: 150.w),
              SizedBox(width: 12.w),
              BookCardShimmer(width: 150.w),
              SizedBox(width: 12.w),
              BookCardShimmer(width: 150.w),
            ],
          ),
        ),
      ],
    );
  }
}
