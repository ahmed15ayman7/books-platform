import 'package:easy_localization/easy_localization.dart';
import 'package:flutter/material.dart';
import 'package:flutter_screenutil/flutter_screenutil.dart';
import 'package:google_fonts/google_fonts.dart';

import '../../../../../core/theme/app_colors.dart';
import '../../../../../core/widgets/empty_state_widget.dart';
import '../../../../../core/widgets/section_header_widget.dart';
import '../../../domain/entities/publisher.dart';
import '../../../domain/entities/publisher_book.dart';
import 'publisher_detail_book_card.dart';
import 'publisher_detail_header.dart';

class PublisherDetailBody extends StatelessWidget {
  const PublisherDetailBody({
    super.key,
    required this.publisher,
    required this.books,
    required this.locale,
    required this.onBookTap,
  });

  final Publisher publisher;
  final List<PublisherBook> books;
  final String locale;
  final ValueChanged<PublisherBook> onBookTap;

  @override
  Widget build(BuildContext context) {
    final ar = locale == 'ar';
    return CustomScrollView(
      slivers: [
        SliverToBoxAdapter(
          child: PublisherDetailHeader(publisher: publisher, ar: ar),
        ),
        if (publisher.aboutAr != null && publisher.aboutAr!.isNotEmpty) ...[
          SliverToBoxAdapter(
            child: Padding(
              padding: EdgeInsetsDirectional.fromSTEB(16.w, 20.h, 16.w, 0),
              child: SectionHeaderWidget(
                title: 'publishers.about'.tr(),
              ),
            ),
          ),
          SliverToBoxAdapter(
            child: Padding(
              padding: EdgeInsetsDirectional.fromSTEB(16.w, 10.h, 16.w, 0),
              child: Text(
                publisher.aboutAr!,
                style: GoogleFonts.tajawal(
                  fontSize: 14.sp,
                  color: AppColors.textSecondary,
                  height: 1.7,
                ),
              ),
            ),
          ),
        ],
        SliverToBoxAdapter(
          child: Padding(
            padding: EdgeInsetsDirectional.fromSTEB(16.w, 24.h, 16.w, 0),
            child: SectionHeaderWidget(
              title: 'publishers.their_books'.tr(),
            ),
          ),
        ),
        if (books.isEmpty)
          SliverFillRemaining(
            child: EmptyStateWidget(
              icon: Icons.menu_book_outlined,
              title: 'publishers.no_books'.tr(),
            ),
          )
        else
          SliverPadding(
            padding: EdgeInsetsDirectional.fromSTEB(16.w, 12.h, 16.w, 24.h),
            sliver: SliverGrid(
              gridDelegate: SliverGridDelegateWithFixedCrossAxisCount(
                crossAxisCount: 2,
                crossAxisSpacing: 12.w,
                mainAxisSpacing: 14.h,
                childAspectRatio: 0.46,
              ),
              delegate: SliverChildBuilderDelegate(
                (_, i) => PublisherDetailBookCard(
                  book: books[i],
                  locale: locale,
                  onTap: () => onBookTap(books[i]),
                ),
                childCount: books.length,
              ),
            ),
          ),
      ],
    );
  }
}
