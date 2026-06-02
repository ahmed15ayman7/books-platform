import 'package:easy_localization/easy_localization.dart';
import 'package:flutter/material.dart';
import 'package:flutter_screenutil/flutter_screenutil.dart';
import 'package:google_fonts/google_fonts.dart';

import '../../../../../core/theme/app_colors.dart';
import '../../../domain/entities/book.dart';

class BookDetailBiblioTable extends StatelessWidget {
  const BookDetailBiblioTable({
    super.key,
    required this.book,
    required this.locale,
  });
  final Book book;
  final String locale;

  @override
  Widget build(BuildContext context) {
    final ar = locale == 'ar';
    final rows = [
      ('book_detail.publisher'.tr(), book.publisher),
      (
        'book_detail.country'.tr(),
        '${book.countryFlag} ${ar ? book.countryAr : book.countryEn}'
      ),
      ('book_detail.original_language'.tr(), book.originalLanguage),
      ('book_detail.pages'.tr(), '${book.pages}'),
      ('book_detail.edition'.tr(), book.edition),
      ('ISBN', book.isbn),
    ];
    return Container(
      decoration: BoxDecoration(
        color: AppColors.surface,
        border: Border.all(color: AppColors.divider),
        borderRadius: BorderRadius.circular(18.r),
        boxShadow: const [
          BoxShadow(
            color: Color(0x0D000000),
            blurRadius: 24,
            offset: Offset(0, 4),
          ),
        ],
      ),
      child: Column(
        children: rows.mapIndexed((i, row) {
          final isLast = i == rows.length - 1;
          return Container(
            padding: EdgeInsetsDirectional.fromSTEB(16.w, 11.h, 16.w, 11.h),
            decoration: BoxDecoration(
              border: isLast
                  ? null
                  : Border(
                      bottom: BorderSide(color: AppColors.inputFill),
                    ),
            ),
            child: Row(
              mainAxisAlignment: MainAxisAlignment.spaceBetween,
              children: [
                Text(
                  row.$1,
                  style: GoogleFonts.tajawal(
                    fontSize: 13.5.sp,
                    color: AppColors.textSecondary,
                  ),
                ),
                Flexible(
                  child: Text(
                    row.$2,
                    style: GoogleFonts.tajawal(
                      fontSize: 13.5.sp,
                      fontWeight: FontWeight.w600,
                      color: AppColors.textPrimary,
                    ),
                    textAlign: TextAlign.end,
                  ),
                ),
              ],
            ),
          );
        }).toList(),
      ),
    );
  }
}

extension on List {
  Iterable<T> mapIndexed<T>(T Function(int i, dynamic e) f) sync* {
    for (int i = 0; i < length; i++) {
      yield f(i, this[i]);
    }
  }
}
