import 'package:flutter/material.dart';
import 'package:flutter_screenutil/flutter_screenutil.dart';
import 'package:google_fonts/google_fonts.dart';

import 'package:booksplatform/core/theme/app_colors.dart';

class SectionTitle extends StatelessWidget {
  const SectionTitle({
    super.key,
    required this.title,
    this.textAlign = TextAlign.center,
  });

  final String title;
  final TextAlign textAlign;

  @override
  Widget build(BuildContext context) {
    return Column(
      crossAxisAlignment: textAlign == TextAlign.center
          ? CrossAxisAlignment.center
          : CrossAxisAlignment.start,
      children: [
        Text(
          title,
          textAlign: textAlign,
          style: GoogleFonts.cairo(
            fontSize: 21.sp,
            fontWeight: FontWeight.w800,
            color: AppColors.textPrimary,
          ),
        ),
        SizedBox(height: 9.h),
        Icon(Icons.bookmark_rounded, color: AppColors.primary, size: 20.r),
        SizedBox(height: 16.h),
      ],
    );
  }
}
