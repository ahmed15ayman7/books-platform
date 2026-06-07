import 'package:flutter/material.dart';
import 'package:flutter_screenutil/flutter_screenutil.dart';
import 'package:google_fonts/google_fonts.dart';

import '../../../../core/theme/app_colors.dart';
import '../../../../core/widgets/book_cover_filled_widget.dart';
import '../../../../core/widgets/translation_status_badge.dart';
import '../../domain/entities/book.dart';

class FeaturedBookHeroWidget extends StatelessWidget {
  const FeaturedBookHeroWidget({
    super.key,
    required this.book,
    required this.onTap,
    this.locale = 'ar',
  });

  final Book book;
  final VoidCallback onTap;
  final String locale;

  @override
  Widget build(BuildContext context) {
    return Padding(
      padding: EdgeInsetsDirectional.fromSTEB(16.w, 16.h, 16.w, 8.h),
      child: GestureDetector(
        onTap: onTap,
        child: Container(
          decoration: BoxDecoration(
            gradient: LinearGradient(
              begin: AlignmentDirectional.topStart,
              end: AlignmentDirectional.bottomEnd,
              colors: book.coverColors.length >= 2
                  ? [book.coverColors[0], book.coverColors[1]]
                  : [AppColors.secondary, AppColors.primary],
            ),
            borderRadius: BorderRadius.circular(26.r),
            boxShadow: const [
              BoxShadow(
                color: Color(0x2E000000),
                blurRadius: 40,
                offset: Offset(0, 14),
              ),
            ],
          ),
          child: Padding(
            padding: EdgeInsetsDirectional.all(18.r),
            child: IntrinsicHeight(
              child: Row(
                crossAxisAlignment: CrossAxisAlignment.stretch,
              children: [
                // Cover thumbnail
                SizedBox(
                  width: 96.w,
                  child: AspectRatio(
                    aspectRatio: 3 / 4,
                    child: ClipRRect(
                      borderRadius: BorderRadius.circular(8.r),
                      child: BookCoverFilledWidget(
                        coverColors: book.coverColors,
                        titleAr: book.titleAr,
                        titleEn: book.titleEn,
                        publisher: book.publisher,
                        imageUrl: book.imageUrl,
                      ),
                    ),
                  ),
                ),
                SizedBox(width: 14.w),
                // Text column
                Expanded(
                  child: Column(
                    crossAxisAlignment: CrossAxisAlignment.start,
                    mainAxisAlignment: MainAxisAlignment.spaceBetween,
                    children: [
                      Column(
                        crossAxisAlignment: CrossAxisAlignment.start,
                        children: [
                          Text(
                            locale == 'ar' ? 'كتاب الأسبوع' : 'Book of the week',
                            style: GoogleFonts.cairo(
                              fontSize: 11.sp,
                              fontWeight: FontWeight.w700,
                              color: Colors.white.withValues(alpha: 0.8),
                              letterSpacing: 0.06 * 11.sp,
                            ),
                          ),
                          SizedBox(height: 7.h),
                          Text(
                            locale == 'ar' ? book.titleAr : book.titleEn,
                            style: GoogleFonts.cairo(
                              fontSize: 19.sp,
                              fontWeight: FontWeight.w800,
                              color: Colors.white,
                              height: 1.4,
                              shadows: [
                                Shadow(
                                  color: Colors.black.withValues(alpha: 0.3),
                                  blurRadius: 10,
                                ),
                              ],
                            ),
                            maxLines: 3,
                            overflow: TextOverflow.ellipsis,
                          ),
                          SizedBox(height: 9.h),
                          TranslationStatusBadge(
                            status: book.status,
                            locale: locale,
                          ),
                        ],
                      ),
                      // "Read details" glass button
                      Align(
                        alignment: AlignmentDirectional.centerStart,
                        child: Container(
                          margin: EdgeInsetsDirectional.only(top: 12.h),
                          padding: EdgeInsetsDirectional.fromSTEB(
                            16.w, 9.h, 16.w, 9.h,
                          ),
                          decoration: BoxDecoration(
                            color: Colors.white.withValues(alpha: 0.16),
                            borderRadius: BorderRadius.circular(999),
                            border: Border.all(
                              color: Colors.white.withValues(alpha: 0.25),
                            ),
                          ),
                          child: Row(
                            mainAxisSize: MainAxisSize.min,
                            children: [
                              Text(
                                locale == 'ar' ? 'عرض التفاصيل' : 'Read details',
                                style: GoogleFonts.cairo(
                                  fontSize: 13.5.sp,
                                  fontWeight: FontWeight.w700,
                                  color: Colors.white,
                                ),
                              ),
                              SizedBox(width: 4.w),
                              Icon(
                                Icons.chevron_right_rounded,
                                size: 15.r,
                                color: Colors.white,
                              ),
                            ],
                          ),
                        ),
                      ),
                    ],
                  ),
                ),
              ],
            ),
          ),
        ),
      ),
    ),
  );
  }
}
