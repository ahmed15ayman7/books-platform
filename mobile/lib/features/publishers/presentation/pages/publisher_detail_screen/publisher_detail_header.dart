import 'package:easy_localization/easy_localization.dart';
import 'package:flutter/material.dart';
import 'package:flutter_screenutil/flutter_screenutil.dart';
import 'package:google_fonts/google_fonts.dart';

import '../../../../../core/theme/app_colors.dart';
import '../../../../../core/theme/app_shadows.dart';
import '../../../../../core/widgets/network_avatar_widget.dart';
import '../../../domain/entities/publisher.dart';

class PublisherDetailHeader extends StatelessWidget {
  const PublisherDetailHeader({
    super.key,
    required this.publisher,
    required this.ar,
  });
  final Publisher publisher;
  final bool ar;

  @override
  Widget build(BuildContext context) {
    final displayName = publisher.displayName(ar ? 'ar' : 'en');
    final initials = displayName
        .split(' ')
        .take(2)
        .map((w) => w.isNotEmpty ? w[0].toUpperCase() : '')
        .join();

    return Container(
      width: double.infinity,
      decoration: const BoxDecoration(
        gradient: LinearGradient(
          begin: AlignmentDirectional.topStart,
          end: AlignmentDirectional.bottomEnd,
          colors: [AppColors.secondary, Color(0xFF2C2C2C)],
        ),
        boxShadow: AppShadows.softLg,
      ),
      padding: EdgeInsetsDirectional.fromSTEB(
        16.w,
        MediaQuery.of(context).padding.top + 16.h,
        16.w,
        28.h,
      ),
      child: Column(
        children: [
          NetworkAvatarWidget(
            size: 80.r,
            initials: initials,
            imageUrl: publisher.imageUrl,
            backgroundColor: Colors.white,
            initialsColor: AppColors.primary,
            initialsFontSize: 28.sp,
          ),
          SizedBox(height: 12.h),
          Text(
            displayName,
            textAlign: TextAlign.center,
            style: GoogleFonts.cairo(
              fontSize: 20.sp,
              fontWeight: FontWeight.w800,
              color: Colors.white,
            ),
          ),
          SizedBox(height: 6.h),
          Row(
            mainAxisAlignment: MainAxisAlignment.center,
            children: [
              Text(
                publisher.countryFlag,
                style: TextStyle(fontSize: 16.sp),
              ),
              SizedBox(width: 6.w),
              Text(
                ar ? publisher.countryAr : publisher.countryEn,
                style: GoogleFonts.tajawal(
                  fontSize: 13.sp,
                  color: Colors.white70,
                ),
              ),
              SizedBox(width: 12.w),
              Container(
                padding: EdgeInsetsDirectional.fromSTEB(10.w, 3.h, 10.w, 3.h),
                decoration: BoxDecoration(
                  color: AppColors.primary,
                  borderRadius: BorderRadius.circular(999),
                ),
                child: Text(
                  '${publisher.bookCount} ${'common.books'.tr()}',
                  style: GoogleFonts.inter(
                    fontSize: 11.sp,
                    fontWeight: FontWeight.w700,
                    color: Colors.white,
                  ),
                ),
              ),
            ],
          ),
        ],
      ),
    );
  }
}
