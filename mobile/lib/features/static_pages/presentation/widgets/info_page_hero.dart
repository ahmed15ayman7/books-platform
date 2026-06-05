import 'package:flutter/material.dart';
import 'package:flutter_screenutil/flutter_screenutil.dart';
import 'package:google_fonts/google_fonts.dart';

import 'package:booksplatform/core/theme/app_colors.dart';

/// Dark hero block for info screens.
/// Provide [title] for the full PageHero variant (About / Services / Team).
/// Omit [title] for the simpler InfoHero variant (Contact).
class InfoPageHero extends StatelessWidget {
  const InfoPageHero({
    super.key,
    required this.icon,
    required this.subtitle,
    this.title,
  });

  final IconData icon;
  final String subtitle;
  final String? title;

  @override
  Widget build(BuildContext context) {
    return Container(
      width: double.infinity,
      color: AppColors.secondary,
      child: Stack(
        clipBehavior: Clip.hardEdge,
        children: [
          // Decorative red circle — overflows at top-end corner
          PositionedDirectional(
            end: -30.r,
            top: -30.r,
            child: Container(
              width: 140.r,
              height: 140.r,
              decoration: BoxDecoration(
                color: AppColors.primary.withValues(alpha: 0.16),
                shape: BoxShape.circle,
              ),
            ),
          ),
          // Decorative white circle — overflows at bottom-start (PageHero only)
          if (title != null)
            PositionedDirectional(
              start: -34.r,
              bottom: -40.r,
              child: Container(
                width: 120.r,
                height: 120.r,
                decoration: BoxDecoration(
                  color: Colors.white.withValues(alpha: 0.04),
                  shape: BoxShape.circle,
                ),
              ),
            ),
          // Main content — non-positioned, drives Stack height
          Padding(
            padding: EdgeInsetsDirectional.fromSTEB(18.w, 26.h, 18.w, 28.h),
            child: Column(
              crossAxisAlignment: CrossAxisAlignment.start,
              children: [
                Container(
                  width: 48.r,
                  height: 48.r,
                  decoration: BoxDecoration(
                    color: AppColors.primary,
                    borderRadius: BorderRadius.circular(14.r),
                  ),
                  child: Icon(icon, color: Colors.white, size: 25.r),
                ),
                if (title != null) ...[
                  SizedBox(height: 16.h),
                  Text(
                    title!,
                    style: GoogleFonts.cairo(
                      fontSize: 27.sp,
                      fontWeight: FontWeight.w800,
                      color: Colors.white,
                      height: 1.2,
                    ),
                  ),
                  SizedBox(height: 8.h),
                ] else
                  SizedBox(height: 14.h),
                Text(
                  subtitle,
                  style: GoogleFonts.tajawal(
                    fontSize: 14.5.sp,
                    color: Colors.white.withValues(alpha: 0.74),
                    height: 1.7,
                  ),
                ),
              ],
            ),
          ),
        ],
      ),
    );
  }
}
