import 'package:easy_localization/easy_localization.dart';
import 'package:flutter/material.dart';
import 'package:flutter_screenutil/flutter_screenutil.dart';
import 'package:google_fonts/google_fonts.dart';

import 'package:booksplatform/features/publishers/domain/entities/publisher.dart';

import '../../../../../core/theme/app_colors.dart';
import '../../../../../core/theme/app_shadows.dart';
import '../../../../../core/widgets/network_avatar_widget.dart';
import '../../../domain/entities/search_result.dart';
import 'search_book_thumbnail.dart';

class SearchResultsList extends StatelessWidget {
  const SearchResultsList({
    super.key,
    required this.results,
    required this.locale,
    required this.onBookTap,
    required this.onPublisherTap,
    required this.onArticleTap,
    this.isLoadingMore = false,
    this.scrollController,
  });

  final List<SearchResult> results;
  final String locale;
  final ValueChanged<dynamic> onBookTap;
  final ValueChanged<dynamic> onPublisherTap;
  final ValueChanged<dynamic> onArticleTap;
  final bool isLoadingMore;
  final ScrollController? scrollController;

  @override
  Widget build(BuildContext context) {
    final ar = locale == 'ar';
    return ListView.separated(
      controller: scrollController,
      padding: EdgeInsetsDirectional.all(16.r),
      itemCount: results.length + (isLoadingMore ? 1 : 0),
      separatorBuilder: (_, i) {
        if (isLoadingMore && i == results.length - 1) {
          return const SizedBox.shrink();
        }
        return SizedBox(height: 10.h);
      },
      itemBuilder: (_, i) {
        if (i >= results.length) {
          return Padding(
            padding: EdgeInsets.symmetric(vertical: 12.h),
            child: const Center(
              child: SizedBox(
                width: 24,
                height: 24,
                child: CircularProgressIndicator(strokeWidth: 2),
              ),
            ),
          );
        }

        final r = results[i];
        return switch (r) {
          BookSearchResult(:final book) => GestureDetector(
              onTap: () => onBookTap(book),
              child: _ResultCard(
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
                          if (book.publisher.isNotEmpty) ...[
                            SizedBox(height: 3.h),
                            Text(
                              book.publisher,
                              style: GoogleFonts.inter(
                                fontSize: 11.5.sp,
                                color: AppColors.textSecondary,
                              ),
                            ),
                          ],
                        ],
                      ),
                    ),
                    _TypeBadge(
                      label: 'search.book_label'.tr(),
                      background: AppColors.brandRedSoft,
                      foreground: AppColors.primary,
                    ),
                  ],
                ),
              ),
            ),
          PublisherSearchResult(:final publisher) => GestureDetector(
              onTap: () => onPublisherTap(publisher),
              child: _PublisherResultRow(publisher: publisher, locale: locale),
            ),
          ArticleSearchResult(:final article) => GestureDetector(
              onTap: () => onArticleTap(article),
              child: _ResultCard(
                child: Row(
                  children: [
                    SizedBox(
                      width: 46.w,
                      height: 46.w,
                      child: ClipRRect(
                        borderRadius: BorderRadius.circular(8.r),
                        child: article.imageUrl != null
                            ? Image.network(
                                article.imageUrl!,
                                fit: BoxFit.cover,
                                errorBuilder: (_, error, stackTrace) =>
                                    _articlePlaceholder(),
                              )
                            : _articlePlaceholder(),
                      ),
                    ),
                    SizedBox(width: 12.w),
                    Expanded(
                      child: Column(
                        crossAxisAlignment: CrossAxisAlignment.start,
                        children: [
                          Text(
                            article.displayTitle(locale),
                            style: GoogleFonts.cairo(
                              fontSize: 14.sp,
                              fontWeight: FontWeight.w700,
                              color: AppColors.textPrimary,
                              height: 1.4,
                            ),
                            maxLines: 2,
                            overflow: TextOverflow.ellipsis,
                          ),
                          if (article.excerpt.isNotEmpty) ...[
                            SizedBox(height: 3.h),
                            Text(
                              article.excerpt,
                              style: GoogleFonts.inter(
                                fontSize: 11.5.sp,
                                color: AppColors.textSecondary,
                              ),
                              maxLines: 2,
                              overflow: TextOverflow.ellipsis,
                            ),
                          ],
                        ],
                      ),
                    ),
                    _TypeBadge(
                      label: 'search.article_label'.tr(),
                      background: AppColors.inputFill,
                      foreground: AppColors.textSecondary,
                    ),
                  ],
                ),
              ),
            ),
        };
      },
    );
  }

  Widget _articlePlaceholder() => Container(
        color: AppColors.inputFill,
        child: Icon(
          Icons.article_outlined,
          size: 22.r,
          color: AppColors.textHint,
        ),
      );
}

String _initialsFrom(String name) => name
    .split(' ')
    .take(2)
    .map((w) => w.isNotEmpty ? w[0] : '')
    .join();

class _PublisherResultRow extends StatelessWidget {
  const _PublisherResultRow({
    required this.publisher,
    required this.locale,
  });

  final Publisher publisher;
  final String locale;

  @override
  Widget build(BuildContext context) {
    final displayName = publisher.displayName(locale);
    return _ResultCard(
      child: Row(
        children: [
          NetworkAvatarWidget(
            size: 46.r,
            initials: _initialsFrom(displayName),
            imageUrl: publisher.imageUrl,
            borderRadius: BorderRadius.circular(12.r),
            initialsFontSize: 15.sp,
          ),
          SizedBox(width: 12.w),
          Expanded(
            child: Column(
              crossAxisAlignment: CrossAxisAlignment.start,
              children: [
                Text(
                  displayName,
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
          _TypeBadge(
            label: 'search.publisher_label'.tr(),
            background: AppColors.secondary,
            foreground: Colors.white,
          ),
        ],
      ),
    );
  }
}

class _ResultCard extends StatelessWidget {
  const _ResultCard({required this.child});
  final Widget child;

  @override
  Widget build(BuildContext context) {
    return Container(
      padding: EdgeInsetsDirectional.all(11.r),
      decoration: BoxDecoration(
        color: AppColors.surface,
        border: Border.all(color: AppColors.divider),
        borderRadius: BorderRadius.circular(16.r),
        boxShadow: AppShadows.soft,
      ),
      child: child,
    );
  }
}

class _TypeBadge extends StatelessWidget {
  const _TypeBadge({
    required this.label,
    required this.background,
    required this.foreground,
  });

  final String label;
  final Color background;
  final Color foreground;

  @override
  Widget build(BuildContext context) {
    return Container(
      padding: EdgeInsetsDirectional.fromSTEB(9.w, 3.h, 9.w, 3.h),
      decoration: BoxDecoration(
        color: background,
        borderRadius: BorderRadius.circular(999),
      ),
      child: Text(
        label,
        style: GoogleFonts.tajawal(
          fontSize: 10.5.sp,
          fontWeight: FontWeight.w700,
          color: foreground,
        ),
      ),
    );
  }
}
