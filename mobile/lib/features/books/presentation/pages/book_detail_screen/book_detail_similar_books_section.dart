import 'package:easy_localization/easy_localization.dart';
import 'package:flutter/material.dart';
import 'package:flutter_screenutil/flutter_screenutil.dart';
import 'package:google_fonts/google_fonts.dart';

import '../../../../../core/theme/app_colors.dart';
import '../../../domain/entities/book.dart';
import '../../widgets/book_card_widget.dart';

class BookDetailSimilarBooksSection extends StatelessWidget {
  const BookDetailSimilarBooksSection({
    super.key,
    required this.books,
    required this.locale,
    required this.onBookTap,
  });

  final List<Book> books;
  final String locale;
  final ValueChanged<Book> onBookTap;

  @override
  Widget build(BuildContext context) {
    return SliverToBoxAdapter(
      child: Column(
        crossAxisAlignment: CrossAxisAlignment.start,
        children: [
          Padding(
            padding: EdgeInsetsDirectional.only(bottom: 12.h),
            child: Text(
              '  ${'book_detail.similar_books'.tr()}',
              style: GoogleFonts.cairo(
                fontSize: 19.sp,
                fontWeight: FontWeight.w800,
                color: AppColors.textPrimary,
              ),
            ),
          ),
          SingleChildScrollView(
            scrollDirection: Axis.horizontal,
            padding: EdgeInsetsDirectional.fromSTEB(16.w, 0, 16.w, 4.h),
            child: Row(
              crossAxisAlignment: CrossAxisAlignment.start,
              children: books
                  .map(
                    (b) => Padding(
                      padding: EdgeInsetsDirectional.only(end: 12.w),
                      child: BookCardWidget(
                        book: b,
                        locale: locale,
                        width: 140.w,
                        onTap: () => onBookTap(b),
                      ),
                    ),
                  )
                  .toList(),
            ),
          ),
        ],
      ),
    );
  }
}
