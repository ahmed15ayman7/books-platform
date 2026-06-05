import 'package:easy_localization/easy_localization.dart';
import 'package:flutter/material.dart';
import 'package:flutter_screenutil/flutter_screenutil.dart';
import 'package:google_fonts/google_fonts.dart';

import '../../../../../core/theme/app_colors.dart';
import '../../../../../core/theme/app_shadows.dart';
import '../../../domain/entities/search_result.dart';
import 'search_book_thumbnail.dart';

class SearchResultsList extends StatelessWidget {
  const SearchResultsList({
    super.key,
    required this.results,
    required this.locale,
    required this.onBookTap,
    required this.onPublisherTap,
  });
  final List<SearchResult> results;
  final String locale;
  final ValueChanged<dynamic> onBookTap;
  // $mobile-debug-skill | Problem: publisher results had no GestureDetector — taps were silently dropped. Fix: onPublisherTap callback added; wrapped publisher Container in GestureDetector.
  final ValueChanged<dynamic> onPublisherTap;

  @override
  Widget build(BuildContext context) {
    final ar = locale == 'ar';
    return ListView.separated(
      padding: EdgeInsetsDirectional.all(16.r),
      itemCount: results.length,
      separatorBuilder: (_, i) => SizedBox(height: 10.h),
      itemBuilder: (_, i) {
        final r = results[i];
        return switch (r) {
          BookSearchResult(:final book) => GestureDetector(
              onTap: () => onBookTap(book),
              child: Container(
                padding: EdgeInsetsDirectional.all(11.r),
                decoration: BoxDecoration(
                  color: AppColors.surface,
                  border: Border.all(color: AppColors.divider),
                  borderRadius: BorderRadius.circular(16.r),
                  boxShadow: AppShadows.soft,
                ),
                child: Row(
                  children: [
                    SizedBox(
                      width: 46.w,
                      child: AspectRatio(
                        aspectRatio: 3 / 4,
                        child: ClipRRect(
                          borderRadius: BorderRadius.circular(6.r),
                          child: SearchBookThumbnail(
                            coverColors: book.coverColors,
                            imageUrl: book.imageUrl,
                          ),
                        ),
                      ),
                    ),
                    SizedBox(width: 12.w),
                    Expanded(
                      child: Column(
                        crossAxisAlignment: CrossAxisAlignment.start,
                        children: [
                          Text(
                            ar ? book.titleAr : book.titleEn,
                            style: GoogleFonts.cairo(
                              fontSize: 14.sp,
                              fontWeight: FontWeight.w700,
                              color: AppColors.textPrimary,
                              height: 1.4,
                            ),
                            maxLines: 2,
                            overflow: TextOverflow.ellipsis,
                          ),
                          SizedBox(height: 3.h),
                          Text(
                            book.publisher,
                            style: GoogleFonts.inter(
                              fontSize: 11.5.sp,
                              color: AppColors.textSecondary,
                            ),
                          ),
                        ],
                      ),
                    ),
                    Container(
                      padding: EdgeInsetsDirectional.fromSTEB(
                          9.w, 3.h, 9.w, 3.h),
                      decoration: BoxDecoration(
                        color: AppColors.brandRedSoft,
                        borderRadius: BorderRadius.circular(999),
                      ),
                      child: Text(
                        'search.book_label'.tr(),
                        style: GoogleFonts.tajawal(
                          fontSize: 10.5.sp,
                          fontWeight: FontWeight.w700,
                          color: AppColors.primary,
                        ),
                      ),
                    ),
                  ],
                ),
              ),
            ),
          PublisherSearchResult(:final publisher) => GestureDetector(
              onTap: () => onPublisherTap(publisher),
              child: Container(
              padding: EdgeInsetsDirectional.all(11.r),
              decoration: BoxDecoration(
                color: AppColors.surface,
                border: Border.all(color: AppColors.divider),
                borderRadius: BorderRadius.circular(16.r),
                boxShadow: AppShadows.soft,
              ),
              child: Row(
                children: [
                  Container(
                    width: 46.r,
                    height: 46.r,
                    decoration: BoxDecoration(
                      color: AppColors.secondary,
                      borderRadius: BorderRadius.circular(12.r),
                    ),
                    child: Center(
                      child: Text(
                        publisher.name
                            .split(' ')
                            .take(2)
                            .map((w) => w.isNotEmpty ? w[0] : '')
                            .join(),
                        style: GoogleFonts.cairo(
                          fontSize: 15.sp,
                          fontWeight: FontWeight.w800,
                          color: Colors.white,
                        ),
                      ),
                    ),
                  ),
                  SizedBox(width: 12.w),
                  Expanded(
                    child: Column(
                      crossAxisAlignment: CrossAxisAlignment.start,
                      children: [
                        Text(
                          publisher.name,
                          style: GoogleFonts.cairo(
                            fontSize: 14.sp,
                            fontWeight: FontWeight.w700,
                            color: AppColors.textPrimary,
                          ),
                        ),
                        SizedBox(height: 3.h),
                        Text(
                          '${publisher.countryFlag} ${publisher.bookCount} ${'common.books'.tr()}',
                          style: GoogleFonts.inter(
                            fontSize: 11.5.sp,
                            color: AppColors.textSecondary,
                          ),
                        ),
                      ],
                    ),
                  ),
                  Container(
                    padding: EdgeInsetsDirectional.fromSTEB(
                        9.w, 3.h, 9.w, 3.h),
                    decoration: BoxDecoration(
                      color: AppColors.secondary,
                      borderRadius: BorderRadius.circular(999),
                    ),
                    child: Text(
                      'search.publisher_label'.tr(),
                      style: GoogleFonts.tajawal(
                        fontSize: 10.5.sp,
                        fontWeight: FontWeight.w700,
                        color: Colors.white,
                      ),
                    ),
                  ),
                ],
              ),
            ),
          ),
        };
      },
    );
  }
}
