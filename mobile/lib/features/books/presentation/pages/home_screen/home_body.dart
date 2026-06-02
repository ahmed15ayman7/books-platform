import 'package:easy_localization/easy_localization.dart';
import 'package:flutter/material.dart';
import 'package:flutter_screenutil/flutter_screenutil.dart';

import '../../../../../core/theme/app_colors.dart';
import '../../../domain/entities/category.dart';
import '../../cubit/home_content_cubit/home_content_state.dart';
import '../../widgets/featured_book_hero_widget.dart';
import 'home_books_carousel_section.dart';
import 'home_categories_section.dart';
import 'home_newsletter_strip.dart';
import 'home_publishers_section.dart';

class HomeBody extends StatelessWidget {
  const HomeBody({
    super.key,
    required this.state,
    required this.locale,
    required this.onBookTap,
    required this.onBrowse,
    required this.onPublisher,
    required this.onCategoryTap,
    required this.onRefresh,
  });

  final HomeContentSuccess state;
  final String locale;
  final void Function(String id, String titleAr) onBookTap;
  final VoidCallback onBrowse;
  final VoidCallback onPublisher;
  final void Function(Category) onCategoryTap;
  final Future<void> Function() onRefresh;

  @override
  Widget build(BuildContext context) {
    return RefreshIndicator(
      onRefresh: onRefresh,
      color: AppColors.primary,
      child: CustomScrollView(
        physics: const AlwaysScrollableScrollPhysics(),
        slivers: [
          if (state.featured.isNotEmpty)
            SliverToBoxAdapter(
              child: FeaturedBookHeroWidget(
                book: state.featured.first,
                locale: locale,
                onTap: () => onBookTap(
                  state.featured.first.id,
                  state.featured.first.titleAr,
                ),
              ),
            ),
          if (state.categories.isNotEmpty)
            HomeCategoriesSection(
              categories: state.categories,
              locale: locale,
              onSeeAll: onBrowse,
              onCategoryTap: onCategoryTap,
            ),
          if (state.freshBooks.isNotEmpty)
            HomeBooksCarouselSection(
              title: 'home.newly_released'.tr(),
              books: state.freshBooks,
              locale: locale,
              onSeeAll: onBrowse,
              onBookTap: onBookTap,
            ),
          if (state.translatedBooks.isNotEmpty)
            HomeBooksCarouselSection(
              title: 'home.translated_books'.tr(),
              books: state.translatedBooks,
              locale: locale,
              onSeeAll: onBrowse,
              onBookTap: onBookTap,
            ),
          if (state.topPublishers.isNotEmpty)
            HomePublishersSection(
              publishers: state.topPublishers,
              locale: locale,
              onSeeAll: onPublisher,
            ),
          SliverToBoxAdapter(
            child: Padding(
              padding: EdgeInsetsDirectional.fromSTEB(16.w, 28.h, 16.w, 6.h),
              child: HomeNewsletterStrip(locale: locale),
            ),
          ),
          SliverToBoxAdapter(child: SizedBox(height: 16.h)),
        ],
      ),
    );
  }
}
