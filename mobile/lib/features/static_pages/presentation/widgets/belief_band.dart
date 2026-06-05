import 'package:flutter/material.dart';
import 'package:flutter_screenutil/flutter_screenutil.dart';
import 'package:google_fonts/google_fonts.dart';

import 'package:booksplatform/core/theme/app_colors.dart';

class BeliefBand extends StatelessWidget {
  const BeliefBand({super.key, required this.text});

  final String text;

  @override
  Widget build(BuildContext context) {
    return Container(
      width: double.infinity,
      color: AppColors.secondary,
      padding: EdgeInsets.symmetric(horizontal: 24.w, vertical: 26.h),
      child: Column(
        children: [
          Icon(Icons.bookmark_rounded, color: AppColors.primary, size: 22.r),
          SizedBox(height: 12.h),
          Text(
            text,
            textAlign: TextAlign.center,
            style: GoogleFonts.cairo(
              fontSize: 16.sp,
              fontWeight: FontWeight.w700,
              color: Colors.white,
              height: 1.7,
            ),
          ),
        ],
      ),
    );
  }
}
