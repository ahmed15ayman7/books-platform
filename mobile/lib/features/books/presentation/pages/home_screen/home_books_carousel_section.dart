import 'package:flutter/material.dart';
import 'package:flutter_screenutil/flutter_screenutil.dart';

import '../../../../../core/widgets/section_header_widget.dart';
import '../../../domain/entities/book.dart';
import '../../widgets/book_card_widget.dart';

class HomeBooksCarouselSection extends StatelessWidget {
  const HomeBooksCarouselSection({
    super.key,
    required this.title,
    required this.books,
    required this.locale,
    required this.onSeeAll,
    required this.onBookTap,
  });

  final String title;
  final List<Book> books;
  final String locale;
  final VoidCallback onSeeAll;
  final void Function(String id, String titleAr) onBookTap;

  @override
  Widget build(BuildContext context) {
    return SliverToBoxAdapter(
      child: Column(
        children: [
          Padding(
            padding: EdgeInsetsDirectional.only(top: 26.h, bottom: 12.h),
            child: SectionHeaderWidget(title: title, onSeeAll: onSeeAll),
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
                        width: 150.w,
                        onTap: () => onBookTap(b.id, b.titleAr),
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
