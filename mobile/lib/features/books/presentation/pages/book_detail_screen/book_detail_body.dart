import 'package:flutter/material.dart';
import 'package:flutter_screenutil/flutter_screenutil.dart';

import '../../../domain/entities/book.dart';
import 'book_detail_hero_cover.dart';
import 'book_detail_info_section.dart';
import 'book_detail_similar_books_section.dart';

class BookDetailBody extends StatelessWidget {
  const BookDetailBody({
    super.key,
    required this.book,
    required this.similarBooks,
    required this.locale,
    required this.expanded,
    required this.saved,
    required this.onToggleExpand,
    required this.onToggleSave,
    required this.onBookTap,
  });

  final Book book;
  final List<Book> similarBooks;
  final String locale;
  final bool expanded;
  final bool saved;
  final VoidCallback onToggleExpand;
  final VoidCallback onToggleSave;
  final ValueChanged<Book> onBookTap;

  @override
  Widget build(BuildContext context) {
    return CustomScrollView(
      slivers: [
        SliverToBoxAdapter(
          child: BookDetailHeroCover(
            book: book,
            locale: locale,
            onBack: () => Navigator.of(context).pop(),
          ),
        ),
        SliverToBoxAdapter(
          child: Padding(
            padding: EdgeInsetsDirectional.fromSTEB(16.w, 16.h, 16.w, 0),
            child: BookDetailInfoSection(
              book: book,
              locale: locale,
              expanded: expanded,
              saved: saved,
              onToggleExpand: onToggleExpand,
              onToggleSave: onToggleSave,
            ),
          ),
        ),
        if (similarBooks.isNotEmpty)
          BookDetailSimilarBooksSection(
            books: similarBooks,
            locale: locale,
            onBookTap: onBookTap,
          ),
        SliverToBoxAdapter(child: SizedBox(height: 24.h)),
      ],
    );
  }
}
