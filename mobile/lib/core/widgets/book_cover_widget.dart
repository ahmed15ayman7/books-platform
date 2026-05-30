import 'package:flutter/material.dart';
import 'package:flutter_screenutil/flutter_screenutil.dart';
import 'package:google_fonts/google_fonts.dart';

import '../theme/app_colors.dart';

/// Gradient book-cover placeholder.
/// Caller wraps in [AspectRatio(aspectRatio: 3 / 4)] and provides a fixed width.
class BookCoverWidget extends StatelessWidget {
  const BookCoverWidget({
    super.key,
    required this.coverColors,
    required this.titleAr,
    required this.titleEn,
    required this.publisher,
    this.borderRadius = 0,
  });

  final List<Color> coverColors;
  final String titleAr;
  final String titleEn;
  final String publisher;
  final double borderRadius;

  @override
  Widget build(BuildContext context) {
    final gradient = LinearGradient(
      begin: Alignment.topLeft,
      end: Alignment.bottomRight,
      colors: coverColors.length >= 2
          ? [coverColors[1], coverColors[0]]
          : [AppColors.secondary, AppColors.primary],
    );

    return ClipRRect(
      borderRadius: BorderRadius.circular(borderRadius.r),
      child: Container(
        decoration: BoxDecoration(gradient: gradient),
        child: Stack(
          children: [
            // Spine (trailing edge strip)
            Positioned(
              right: 0,
              top: 0,
              bottom: 0,
              child: Container(
                width: 6.w,
                decoration: BoxDecoration(
                  color: Colors.black.withValues(alpha: 0.22),
                  boxShadow: [
                    BoxShadow(
                      color: Colors.white.withValues(alpha: 0.15),
                      blurRadius: 2,
                      offset: const Offset(-1, 0),
                    ),
                  ],
                ),
              ),
            ),

            Padding(
              padding: EdgeInsetsDirectional.fromSTEB(
                14.w, 12.h, 14.w, 12.h,
              ),
              child: Column(
                crossAxisAlignment: CrossAxisAlignment.start,
                children: [
                  // Publisher label
                  Text(
                    publisher.toUpperCase(),
                    style: GoogleFonts.inter(
                      fontSize: 8.sp,
                      fontWeight: FontWeight.w700,
                      color: Colors.white.withValues(alpha: 0.65),
                      letterSpacing: 0.12 * 8.sp,
                    ),
                    maxLines: 1,
                    overflow: TextOverflow.ellipsis,
                  ),
                  const Spacer(),
                  // Arabic title
                  Text(
                    titleAr,
                    style: GoogleFonts.cairo(
                      fontSize: 14.sp,
                      fontWeight: FontWeight.w700,
                      color: Colors.white,
                      height: 1.35,
                      shadows: [
                        Shadow(
                          color: Colors.black.withValues(alpha: 0.3),
                          blurRadius: 8,
                        ),
                      ],
                    ),
                    maxLines: 3,
                    overflow: TextOverflow.ellipsis,
                  ),
                  SizedBox(height: 4.h),
                  // Transliterated title
                  Text(
                    titleEn,
                    style: GoogleFonts.inter(
                      fontSize: 9.sp,
                      fontWeight: FontWeight.w400,
                      color: Colors.white.withValues(alpha: 0.7),
                      fontStyle: FontStyle.italic,
                    ),
                    maxLines: 1,
                    overflow: TextOverflow.ellipsis,
                  ),
                ],
              ),
            ),
          ],
        ),
      ),
    );
  }
}
