import 'package:flutter/material.dart';
import 'package:flutter_screenutil/flutter_screenutil.dart';
import 'package:google_fonts/google_fonts.dart';

import '../../../../../core/theme/app_colors.dart';
import '../../../domain/entities/article_detail.dart';

class ArticleDetailHeroHeader extends StatelessWidget {
  const ArticleDetailHeroHeader({
    super.key,
    required this.article,
    required this.onBack,
  });
  final ArticleDetail article;
  final VoidCallback onBack;

  @override
  Widget build(BuildContext context) {
    return SizedBox(
      height: 230.h,
      child: Stack(
        fit: StackFit.expand,
        children: [
          DecoratedBox(
            decoration: BoxDecoration(
              gradient: LinearGradient(
                begin: Alignment.topCenter,
                end: Alignment.bottomCenter,
                colors: [
                  article.coverColors.first,
                  article.coverColors.last,
                ],
              ),
            ),
          ),
          PositionedDirectional(
            start: 0,
            end: 0,
            bottom: 0,
            height: 100.h,
            child: DecoratedBox(
              decoration: BoxDecoration(
                gradient: LinearGradient(
                  begin: Alignment.bottomCenter,
                  end: Alignment.topCenter,
                  colors: [
                    AppColors.background,
                    AppColors.background.withValues(alpha: 0),
                  ],
                ),
              ),
            ),
          ),
          PositionedDirectional(
            bottom: 16.h,
            start: 16.w,
            child: Container(
              padding: EdgeInsetsDirectional.fromSTEB(10.w, 4.h, 10.w, 4.h),
              decoration: BoxDecoration(
                color: AppColors.primary,
                borderRadius: BorderRadius.circular(999),
              ),
              child: Text(
                article.categoryLabel,
                style: GoogleFonts.inter(
                  fontSize: 11.sp,
                  fontWeight: FontWeight.w700,
                  color: Colors.white,
                ),
              ),
            ),
          ),
          if (article.hasVideo)
            PositionedDirectional(
              bottom: 16.h,
              end: 16.w,
              child: Container(
                padding: EdgeInsets.all(8.r),
                decoration: BoxDecoration(
                  color: Colors.black45,
                  borderRadius: BorderRadius.circular(999),
                ),
                child: Icon(
                  Icons.play_circle_outline_rounded,
                  color: Colors.white,
                  size: 22.r,
                ),
              ),
            ),
          PositionedDirectional(
            top: MediaQuery.of(context).padding.top + 10.h,
            start: 16.w,
            child: GestureDetector(
              onTap: onBack,
              child: Container(
                width: 38.r,
                height: 38.r,
                decoration: BoxDecoration(
                  color: Colors.black38,
                  borderRadius: BorderRadius.circular(999),
                ),
                child: Icon(
                  Icons.arrow_back_rounded,
                  color: Colors.white,
                  size: 18.r,
                ),
              ),
            ),
          ),
        ],
      ),
    );
  }
}
