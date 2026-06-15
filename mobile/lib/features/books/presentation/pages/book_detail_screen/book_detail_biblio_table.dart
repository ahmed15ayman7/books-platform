import 'package:easy_localization/easy_localization.dart';
import 'package:flutter/material.dart';
import 'package:flutter_screenutil/flutter_screenutil.dart';
import 'package:google_fonts/google_fonts.dart';

import '../../../../../core/helpers/book_biblio_helpers.dart';
import '../../../../../core/router/app_routes.dart';
import '../../../../../core/router/args/category_books_args.dart';
import '../../../../../core/router/args/publisher_detail_args.dart';
import '../../../../../core/theme/app_colors.dart';
import '../../../../../core/widgets/translation_status_badge.dart';
import '../../../domain/entities/book.dart';
import '../../../domain/entities/book_category_ref.dart';

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
    final rows = _buildRows(context, ar);
    if (rows.isEmpty) return const SizedBox.shrink();

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
        crossAxisAlignment: CrossAxisAlignment.stretch,
        children: [
          Container(
            padding: EdgeInsetsDirectional.fromSTEB(16.w, 12.h, 16.w, 12.h),
            decoration: BoxDecoration(
              color: AppColors.inputFill,
              borderRadius: BorderRadius.vertical(top: Radius.circular(18.r)),
              border: Border(bottom: BorderSide(color: AppColors.divider)),
            ),
            child: Text(
              'book_detail.biblio_section'.tr(),
              style: GoogleFonts.cairo(
                fontSize: 14.sp,
                fontWeight: FontWeight.w800,
                color: AppColors.textPrimary,
              ),
            ),
          ),
          ...rows,
        ],
      ),
    );
  }

  List<Widget> _buildRows(BuildContext context, bool ar) {
    final entries = <({String label, Widget value})>[];

    void addEntry(String label, Widget value) {
      entries.add((label: label, value: value));
    }

    final publisherName = resolvePublisherDisplayName(
      nameEn: book.publisherNameEn,
      nameAr: book.publisherNameAr,
      title: book.publisher,
      isAr: ar,
    );
    if (publisherName.isNotEmpty) {
      addEntry(
        'book_detail.publisher'.tr(),
        book.publisherId.isNotEmpty
            ? GestureDetector(
                onTap: () => Navigator.of(context).pushNamed(
                  AppRoutes.publisherDetail,
                  arguments: PublisherDetailArgs(
                    slug: book.publisherId,
                    name: publisherName,
                  ),
                ),
                child: Text(
                  publisherName,
                  style: GoogleFonts.tajawal(
                    fontSize: 13.5.sp,
                    fontWeight: FontWeight.w600,
                    color: AppColors.primary,
                  ),
                  textAlign: TextAlign.end,
                ),
              )
            : Text(
                publisherName,
                style: GoogleFonts.tajawal(
                  fontSize: 13.5.sp,
                  fontWeight: FontWeight.w600,
                  color: AppColors.textPrimary,
                ),
                textAlign: TextAlign.end,
              ),
      );
    }

    final publisherAddress = resolvePublisherAddress(
      address: book.publisherAddress,
      websiteUrl: book.publisherWebsiteUrl,
    );
    if (publisherAddress != null) {
      addEntry(
        'book_detail.publisher_address'.tr(),
        Text(
          publisherAddress,
          style: GoogleFonts.tajawal(
            fontSize: 13.sp,
            fontWeight: FontWeight.w500,
            color: AppColors.textSecondary,
            height: 1.5,
          ),
          textAlign: TextAlign.end,
        ),
      );
    }

    final country = ar ? book.countryAr : book.countryEn;
    if (country.isNotEmpty) {
      addEntry(
        'book_detail.country'.tr(),
        Text(
          '${book.countryFlag} $country'.trim(),
          style: GoogleFonts.tajawal(
            fontSize: 13.5.sp,
            fontWeight: FontWeight.w600,
            color: AppColors.textPrimary,
          ),
          textAlign: TextAlign.end,
        ),
      );
    }

    final pubYear = book.publicationYear ?? (book.year > 0 ? book.year : null);
    if (pubYear != null) {
      addEntry(
        'book_detail.publication_year'.tr(),
        Text(
          pubYear.toString(),
          style: GoogleFonts.tajawal(
            fontSize: 13.5.sp,
            fontWeight: FontWeight.w600,
            color: AppColors.textPrimary,
          ),
          textAlign: TextAlign.end,
        ),
      );
    }

    final editionLabel = resolveBookEdition(
      edition: book.edition.isNotEmpty ? book.edition : null,
      editionAr: book.editionAr,
      isAr: ar,
    );
    if (editionLabel != null && editionLabel.isNotEmpty) {
      addEntry(
        'book_detail.edition'.tr(),
        Text(
          editionLabel,
          style: GoogleFonts.tajawal(
            fontSize: 13.5.sp,
            fontWeight: FontWeight.w600,
            color: AppColors.textPrimary,
          ),
          textAlign: TextAlign.end,
        ),
      );
    }

    if (book.pages > 0) {
      addEntry(
        'book_detail.pages'.tr(),
        Text(
          '${book.pages} ${'book_detail.pages_suffix'.tr()}',
          style: GoogleFonts.tajawal(
            fontSize: 13.5.sp,
            fontWeight: FontWeight.w600,
            color: AppColors.textPrimary,
          ),
          textAlign: TextAlign.end,
        ),
      );
    }

    if (book.isbn.isNotEmpty) {
      addEntry(
        'book_detail.isbn'.tr(),
        Text(
          book.isbn,
          style: GoogleFonts.tajawal(
            fontSize: 13.5.sp,
            fontWeight: FontWeight.w600,
            color: AppColors.textPrimary,
          ),
          textAlign: TextAlign.end,
        ),
      );
    }

    if (book.dimensions != null && book.dimensions!.isNotEmpty) {
      addEntry(
        'book_detail.dimensions'.tr(),
        Text(
          book.dimensions!,
          style: GoogleFonts.tajawal(
            fontSize: 13.5.sp,
            fontWeight: FontWeight.w600,
            color: AppColors.textPrimary,
          ),
          textAlign: TextAlign.end,
        ),
      );
    }

    if (book.primaryCategory != null) {
      addEntry(
        'book_detail.primary_category'.tr(),
        _CategoryLink(
          category: book.primaryCategory!,
          locale: locale,
        ),
      );
    }

    final extraCategories = book.categories
        .where((c) => c.id != book.primaryCategory?.id)
        .toList();
    if (extraCategories.isNotEmpty) {
      addEntry(
        'book_detail.additional_categories'.tr(),
        Wrap(
          alignment: WrapAlignment.end,
          spacing: 6.w,
          runSpacing: 6.h,
          children: extraCategories
              .map((c) => _CategoryChip(category: c, locale: locale))
              .toList(),
        ),
      );
    }

    final languageLabel = resolveLanguageLabel(book.languageCode, isAr: ar);
    if (languageLabel != null) {
      addEntry(
        'book_detail.original_language'.tr(),
        Text(
          languageLabel,
          style: GoogleFonts.tajawal(
            fontSize: 13.5.sp,
            fontWeight: FontWeight.w600,
            color: AppColors.textPrimary,
          ),
          textAlign: TextAlign.end,
        ),
      );
    }

    addEntry(
      'book_detail.translation_status'.tr(),
      TranslationStatusBadge(status: book.status),
    );

    return [
      for (var i = 0; i < entries.length; i++)
        _BiblioRow(
          label: entries[i].label,
          value: entries[i].value,
          showDivider: i < entries.length - 1,
        ),
    ];
  }
}

class _BiblioRow extends StatelessWidget {
  const _BiblioRow({
    required this.label,
    required this.value,
    required this.showDivider,
  });

  final String label;
  final Widget value;
  final bool showDivider;

  @override
  Widget build(BuildContext context) {
    return Container(
      padding: EdgeInsetsDirectional.fromSTEB(16.w, 11.h, 16.w, 11.h),
      decoration: BoxDecoration(
        border: showDivider
            ? Border(bottom: BorderSide(color: AppColors.inputFill))
            : null,
      ),
      child: Row(
        crossAxisAlignment: CrossAxisAlignment.start,
        children: [
          Expanded(
            flex: 2,
            child: Text(
              label,
              style: GoogleFonts.tajawal(
                fontSize: 13.5.sp,
                color: AppColors.textSecondary,
              ),
            ),
          ),
          SizedBox(width: 12.w),
          Expanded(
            flex: 3,
            child: Align(
              alignment: AlignmentDirectional.centerEnd,
              child: value,
            ),
          ),
        ],
      ),
    );
  }
}

class _CategoryLink extends StatelessWidget {
  const _CategoryLink({
    required this.category,
    required this.locale,
  });

  final BookCategoryRef category;
  final String locale;

  @override
  Widget build(BuildContext context) {
    final name = category.displayName(locale);
    return GestureDetector(
      onTap: () => Navigator.of(context).pushNamed(
        AppRoutes.categoryBooks,
        arguments: CategoryBooksArgs(
          slug: category.slug,
          nameAr: category.nameAr,
          nameEn: category.nameEn,
        ),
      ),
      child: Text(
        name,
        style: GoogleFonts.tajawal(
          fontSize: 13.5.sp,
          fontWeight: FontWeight.w600,
          color: AppColors.primary,
        ),
        textAlign: TextAlign.end,
      ),
    );
  }
}

class _CategoryChip extends StatelessWidget {
  const _CategoryChip({
    required this.category,
    required this.locale,
  });

  final BookCategoryRef category;
  final String locale;

  @override
  Widget build(BuildContext context) {
    return GestureDetector(
      onTap: () => Navigator.of(context).pushNamed(
        AppRoutes.categoryBooks,
        arguments: CategoryBooksArgs(
          slug: category.slug,
          nameAr: category.nameAr,
          nameEn: category.nameEn,
        ),
      ),
      child: Container(
        padding: EdgeInsets.symmetric(horizontal: 10.w, vertical: 4.h),
        decoration: BoxDecoration(
          color: AppColors.surface,
          border: Border.all(color: AppColors.divider),
          borderRadius: BorderRadius.circular(999),
        ),
        child: Text(
          category.displayName(locale),
          style: GoogleFonts.tajawal(
            fontSize: 11.5.sp,
            fontWeight: FontWeight.w600,
            color: AppColors.textPrimary,
          ),
        ),
      ),
    );
  }
}
