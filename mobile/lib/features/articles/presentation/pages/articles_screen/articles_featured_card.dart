import 'package:cached_network_image/cached_network_image.dart';
import 'package:easy_localization/easy_localization.dart' hide TextDirection;
import 'package:flutter/material.dart';
import 'package:flutter_screenutil/flutter_screenutil.dart';
import 'package:google_fonts/google_fonts.dart';

import '../../../../../core/theme/app_colors.dart';
import '../../../../../core/theme/app_shadows.dart';
import '../../../domain/entities/article.dart';

class ArticlesFeaturedCard extends StatelessWidget {
  const ArticlesFeaturedCard({
    super.key,
    required this.article,
    required this.locale,
    required this.onTap,
  });
  final Article article;
  final String locale;
  final VoidCallback onTap;

  @override
  Widget build(BuildContext context) {
    return GestureDetector(
      onTap: onTap,
      child: Container(
        decoration: BoxDecoration(
          color: AppColors.surface,
          border: Border.all(color: AppColors.divider),
          borderRadius: BorderRadius.circular(24.r),
          boxShadow: AppShadows.soft,
        ),
        clipBehavior: Clip.hardEdge,
        child: Column(
          crossAxisAlignment: CrossAxisAlignment.start,
          children: [
            Stack(
              children: [
                Container(
                  height: 150.h,
                  decoration: BoxDecoration(
                    gradient: LinearGradient(
                      begin: AlignmentDirectional.topStart,
                      end: AlignmentDirectional.bottomEnd,
                      colors: article.coverColors.length >= 2
                          ? [article.coverColors[1], article.coverColors[0]]
                          : [AppColors.secondary, AppColors.primary],
                    ),
                  ),
                ),
                if (article.imageUrl != null)
                  Positioned.fill(
                    child: CachedNetworkImage(
                      imageUrl: article.imageUrl!,
                      fit: BoxFit.cover,
                      placeholder: (_, _) => const SizedBox.shrink(),
                      errorWidget: (_, _, _) => const SizedBox.shrink(),
                    ),
                  ),
                PositionedDirectional(
                  top: 12.h,
                  start: 12.w,
                  child: Container(
                    padding:
                        EdgeInsets.symmetric(horizontal: 10.w, vertical: 4.h),
                    decoration: BoxDecoration(
                      color: Colors.black.withValues(alpha: 0.4),
                      borderRadius: BorderRadius.circular(999),
                    ),
                    child: Text(
                      'articles.featured'.tr(),
                      style: GoogleFonts.cairo(
                        fontSize: 11.sp,
                        fontWeight: FontWeight.w700,
                        color: Colors.white,
                      ),
                    ),
                  ),
                ),
              ],
            ),
            Padding(
              padding: EdgeInsetsDirectional.all(16.r),
              child: Column(
                crossAxisAlignment: CrossAxisAlignment.start,
                children: [
                  Text(
                    article.categoryLabel,
                    style: GoogleFonts.cairo(
                      fontSize: 11.5.sp,
                      fontWeight: FontWeight.w700,
                      color: AppColors.primary,
                    ),
                  ),
                  SizedBox(height: 5.h),
                  Text(
                    article.title,
                    style: GoogleFonts.cairo(
                      fontSize: 17.sp,
                      fontWeight: FontWeight.w800,
                      color: AppColors.textPrimary,
                      height: 1.45,
                    ),
                  ),
                  SizedBox(height: 7.h),
                  Text(
                    article.excerpt,
                    style: GoogleFonts.tajawal(
                      fontSize: 13.5.sp,
                      color: AppColors.textSecondary,
                      height: 1.7,
                    ),
                    maxLines: 2,
                    overflow: TextOverflow.ellipsis,
                  ),
                  SizedBox(height: 9.h),
                  // $mobile-debug-skill | Problem: same Arabic BiDi issue as article row — "د" at end scrambles layout. Fix: force LTR direction on this metadata Text.
                  Text(
                    '${article.date} · ${article.readMinutes} ${'articles.min_read'.tr()}',
                    textDirection: TextDirection.ltr,
                    style: GoogleFonts.inter(
                      fontSize: 11.5.sp,
                      color: AppColors.textHint,
                    ),
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
