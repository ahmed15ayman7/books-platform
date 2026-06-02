import 'package:easy_localization/easy_localization.dart';
import 'package:flutter/material.dart';
import 'package:flutter_screenutil/flutter_screenutil.dart';
import 'package:google_fonts/google_fonts.dart';

import '../../../../../core/theme/app_colors.dart';
import '../../../../../core/widgets/translation_status_badge.dart';
import '../../../domain/entities/book.dart';
import 'book_detail_biblio_table.dart';

class BookDetailInfoSection extends StatelessWidget {
  const BookDetailInfoSection({
    super.key,
    required this.book,
    required this.locale,
    required this.expanded,
    required this.saved,
    required this.onToggleExpand,
    required this.onToggleSave,
    required this.onAddCart,
  });

  final Book book;
  final String locale;
  final bool expanded;
  final bool saved;
  final VoidCallback onToggleExpand;
  final VoidCallback onToggleSave;
  final VoidCallback onAddCart;

  @override
  Widget build(BuildContext context) {
    return Column(
      crossAxisAlignment: CrossAxisAlignment.start,
      children: [
        Row(
          children: [
            TranslationStatusBadge(status: book.status, locale: locale),
            SizedBox(width: 8.w),
            Container(
              padding: EdgeInsetsDirectional.fromSTEB(11.w, 3.h, 11.w, 3.h),
              decoration: BoxDecoration(
                color: AppColors.surface,
                border: Border.all(color: AppColors.divider),
                borderRadius: BorderRadius.circular(999),
              ),
              child: Text(
                _categoryName(book.categorySlug),
                style: GoogleFonts.tajawal(
                  fontSize: 12.sp,
                  fontWeight: FontWeight.w700,
                  color: AppColors.textPrimary,
                ),
              ),
            ),
            const Spacer(),
            Text(
              '\$${book.price.toStringAsFixed(2)}',
              style: GoogleFonts.cairo(
                fontSize: 20.sp,
                fontWeight: FontWeight.w800,
                color: AppColors.primary,
              ),
            ),
          ],
        ),
        SizedBox(height: 16.h),
        BookDetailBiblioTable(book: book, locale: locale),
        SizedBox(height: 20.h),
        Text(
          'book_detail.description'.tr(),
          style: GoogleFonts.cairo(
            fontSize: 16.sp,
            fontWeight: FontWeight.w800,
            color: AppColors.textPrimary,
          ),
        ),
        SizedBox(height: 8.h),
        Text(
          book.descriptionAr,
          style: GoogleFonts.tajawal(
            fontSize: 14.5.sp,
            color: AppColors.textSecondary,
            height: 1.8,
          ),
          maxLines: expanded ? null : 3,
          overflow: expanded ? TextOverflow.visible : TextOverflow.ellipsis,
        ),
        TextButton(
          onPressed: onToggleExpand,
          style: TextButton.styleFrom(padding: EdgeInsets.zero),
          child: Text(
            expanded
                ? 'book_detail.show_less'.tr()
                : 'book_detail.read_more'.tr(),
            style: GoogleFonts.cairo(
              fontSize: 13.5.sp,
              fontWeight: FontWeight.w700,
              color: AppColors.primary,
            ),
          ),
        ),
        SizedBox(height: 18.h),
        SizedBox(
          width: double.infinity,
          child: ElevatedButton(
            onPressed: onAddCart,
            child: Row(
              mainAxisAlignment: MainAxisAlignment.center,
              children: [
                const Icon(Icons.shopping_bag_outlined),
                SizedBox(width: 8.w),
                Text(
                  '${'book_detail.add_to_cart'.tr()} · \$${book.price.toStringAsFixed(2)}',
                ),
              ],
            ),
          ),
        ),
        SizedBox(height: 10.h),
        SizedBox(
          width: double.infinity,
          child: OutlinedButton(
            onPressed: onToggleSave,
            child: Row(
              mainAxisAlignment: MainAxisAlignment.center,
              children: [
                Icon(
                  saved
                      ? Icons.favorite_rounded
                      : Icons.favorite_border_rounded,
                  color: AppColors.primary,
                ),
                SizedBox(width: 8.w),
                Text(
                  saved
                      ? 'book_detail.saved'.tr()
                      : 'book_detail.save_to_wishlist'.tr(),
                ),
              ],
            ),
          ),
        ),
        SizedBox(height: 26.h),
      ],
    );
  }

  String _categoryName(String slug) => switch (slug) {
        'ideas-and-policies' => 'categories.ideas_and_policies'.tr(),
        'social-studies' => 'categories.social_studies'.tr(),
        'philosophies-and-cultures' =>
          'categories.philosophies_and_cultures'.tr(),
        'economy-and-development' => 'categories.economy_and_development'.tr(),
        'languages-and-literature' =>
          'categories.languages_and_literature'.tr(),
        'technologies-and-sciences' =>
          'categories.technologies_and_sciences'.tr(),
        'religions-and-beliefs' => 'categories.religions_and_beliefs'.tr(),
        _ => 'categories.other'.tr(),
      };
}
