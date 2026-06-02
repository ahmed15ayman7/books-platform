import 'package:flutter/material.dart';
import 'package:flutter_screenutil/flutter_screenutil.dart';
import 'package:google_fonts/google_fonts.dart';

import '../../../../../core/theme/app_colors.dart';

class ArticleDetailBodyContent extends StatelessWidget {
  const ArticleDetailBodyContent({
    super.key,
    required this.paragraphs,
    this.pullQuote,
  });
  final List<String> paragraphs;
  final String? pullQuote;

  @override
  Widget build(BuildContext context) {
    final List<Widget> children = [];

    for (int i = 0; i < paragraphs.length; i++) {
      children.add(
        Text(
          paragraphs[i],
          style: GoogleFonts.tajawal(
            fontSize: 15.sp,
            color: AppColors.textPrimary,
            height: 1.7,
          ),
        ),
      );

      if (i == 1 && pullQuote != null) {
        children.add(SizedBox(height: 18.h));
        children.add(ArticleDetailPullQuote(text: pullQuote!));
        children.add(SizedBox(height: 18.h));
      } else if (i < paragraphs.length - 1) {
        children.add(SizedBox(height: 16.h));
      }
    }

    return Column(
      crossAxisAlignment: CrossAxisAlignment.start,
      children: children,
    );
  }
}

class ArticleDetailPullQuote extends StatelessWidget {
  const ArticleDetailPullQuote({super.key, required this.text});
  final String text;

  @override
  Widget build(BuildContext context) {
    return Container(
      padding: EdgeInsetsDirectional.fromSTEB(16.w, 14.h, 16.w, 14.h),
      decoration: BoxDecoration(
        color: AppColors.brandRedSoft,
        borderRadius: BorderRadius.circular(12.r),
        border: BorderDirectional(
          start: BorderSide(color: AppColors.primary, width: 4.w),
        ),
      ),
      child: Text(
        text,
        style: GoogleFonts.cairo(
          fontSize: 16.sp,
          fontWeight: FontWeight.w700,
          color: AppColors.primary,
          height: 1.6,
        ),
      ),
    );
  }
}
