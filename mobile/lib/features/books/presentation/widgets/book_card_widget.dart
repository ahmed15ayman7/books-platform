import 'package:easy_localization/easy_localization.dart';
import 'package:flutter/material.dart';
import 'package:flutter_screenutil/flutter_screenutil.dart';
import 'package:google_fonts/google_fonts.dart';

import '../../../../core/theme/app_colors.dart';
import '../../../../core/theme/app_shadows.dart';
import '../../../../core/widgets/book_cover_widget.dart';
import '../../../../core/widgets/translation_status_badge.dart';
import '../../domain/entities/book.dart';

class BookCardWidget extends StatelessWidget {
  const BookCardWidget({
    super.key,
    required this.book,
    required this.onTap,
    this.locale = 'ar',
    this.width,
  });

  final Book book;
  final VoidCallback onTap;
  final String locale;
  final double? width;

  @override
  Widget build(BuildContext context) {
    return GestureDetector(
      onTap: onTap,
      child: Container(
        width: width,
        decoration: BoxDecoration(
          color: AppColors.surface,
          borderRadius: BorderRadius.circular(24.r),
          border: Border.all(color: AppColors.divider),
          boxShadow: AppShadows.soft,
        ),
        clipBehavior: Clip.hardEdge,
        child: Column(
          crossAxisAlignment: CrossAxisAlignment.start,
          children: [
            // Cover (3:4 aspect ratio)
            AspectRatio(
              aspectRatio: 3 / 4,
              child: Stack(
                children: [
                  BookCoverWidget(
                    coverColors: book.coverColors,
                    titleAr: book.titleAr,
                    titleEn: book.titleEn,
                    publisher: book.publisher,
                    imageUrl: book.imageUrl,
                  ),
                  if (book.isNew)
                    PositionedDirectional(
                      top: 8.h,
                      start: 8.w,
                      child: Container(
                        padding: EdgeInsets.symmetric(
                          horizontal: 8.w,
                          vertical: 3.h,
                        ),
                        decoration: BoxDecoration(
                          color: AppColors.primary,
                          borderRadius: BorderRadius.circular(999),
                        ),
                        child: Text(
                          'common.new_badge'.tr(),
                          style: GoogleFonts.tajawal(
                            fontSize: 10.sp,
                            fontWeight: FontWeight.w700,
                            color: Colors.white,
                          ),
                        ),
                      ),
                    ),
                ],
              ),
            ),
            // Info
            Padding(
              padding: EdgeInsetsDirectional.all(11.r),
              child: Column(
                crossAxisAlignment: CrossAxisAlignment.start,
                children: [
                  // $mobile-debug-skill | Problem: empty categorySlug always hit the wildcard case and showed "اخري". Fix: hide the chip entirely when no category is assigned.
                  if (book.categorySlug.isNotEmpty) ...[
                    Text(
                      _categoryName(book.categorySlug),
                      style: GoogleFonts.tajawal(
                        fontSize: 11.sp,
                        fontWeight: FontWeight.w700,
                        color: AppColors.primary,
                      ),
                    ),
                    SizedBox(height: 4.h),
                  ],
                  Text(
                    locale == 'ar' ? book.titleAr : book.titleEn,
                    style: GoogleFonts.cairo(
                      fontSize: 14.5.sp,
                      fontWeight: FontWeight.w700,
                      color: AppColors.textPrimary,
                      height: 1.45,
                    ),
                    maxLines: 2,
                    overflow: TextOverflow.ellipsis,
                  ),
                  SizedBox(height: 4.h),
                  Text(
                    book.publisher,
                    style: GoogleFonts.inter(
                      fontSize: 11.5.sp,
                      color: AppColors.textSecondary,
                    ),
                    maxLines: 1,
                    overflow: TextOverflow.ellipsis,
                  ),
                  SizedBox(height: 5.h),
                  TranslationStatusBadge(
                    status: book.status,
                    small: true,
                    locale: locale,
                  ),
                ],
              ),
            ),
          ],
        ),
      ),
    );
  }

  String _categoryName(String slug) => switch (slug) {
        'ideas-and-policies' => 'categories.ideas_and_policies'.tr(),
        'social-studies' => 'categories.social_studies'.tr(),
        'philosophies-and-cultures' => 'categories.philosophies_and_cultures'.tr(),
        'economy-and-development' => 'categories.economy_and_development'.tr(),
        'languages-and-literature' => 'categories.languages_and_literature'.tr(),
        'technologies-and-sciences' => 'categories.technologies_and_sciences'.tr(),
        'religions-and-beliefs' => 'categories.religions_and_beliefs'.tr(),
        _ => 'categories.other'.tr(),
      };
}
