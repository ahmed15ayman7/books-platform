import 'package:easy_localization/easy_localization.dart';
import 'package:flutter/material.dart';
import 'package:flutter_bloc/flutter_bloc.dart';
import 'package:flutter_screenutil/flutter_screenutil.dart';
import 'package:google_fonts/google_fonts.dart';
import 'package:shimmer/shimmer.dart';

import '../../../../core/router/app_routes.dart';
import '../../../../core/router/args/book_detail_args.dart';
import '../../../../core/router/args/category_books_args.dart';
import '../../../../core/theme/app_colors.dart';
import '../../../../core/widgets/app_bar_widget.dart';
import '../../../../core/widgets/bottom_nav_widget.dart';
import '../../../../core/widgets/error_state_widget.dart';
import '../../../../core/widgets/section_header_widget.dart';
import '../../domain/entities/category.dart';
import '../../domain/entities/publisher_summary.dart';
import '../cubit/home_content_cubit/home_content_cubit.dart';
import '../cubit/home_content_cubit/home_content_state.dart';
import '../widgets/book_card_shimmer.dart';
import '../widgets/book_card_widget.dart';
import '../widgets/featured_book_hero_widget.dart';

class HomeScreen extends StatefulWidget {
  const HomeScreen({super.key});

  @override
  State<HomeScreen> createState() => _HomeScreenState();
}

class _HomeScreenState extends State<HomeScreen> {
  @override
  void initState() {
    super.initState();
    context.read<HomeContentCubit>().load();
  }

  void _openBook(BuildContext ctx, String id, String titleAr) {
    Navigator.of(ctx).pushNamed(
      AppRoutes.bookDetail,
      arguments: BookDetailArgs(slug: id, titleAr: titleAr),
    );
  }

  @override
  Widget build(BuildContext context) {
    final locale = context.locale.languageCode;
    return Scaffold(
      backgroundColor: AppColors.background,
      body: Column(
        children: [
          AppBarWidget(
            variant: AppBarVariant.home,
            currentLocale: locale,
            onSearch: () =>
                Navigator.of(context).pushNamed(AppRoutes.search),
            onCart: () => Navigator.of(context).pushNamed(AppRoutes.cart),
            onLocaleChanged: (l) =>
                context.setLocale(Locale(l)),
          ),
          Expanded(
            child: BlocBuilder<HomeContentCubit, HomeContentState>(
              builder: (ctx, state) {
                return AnimatedSwitcher(
                  duration: const Duration(milliseconds: 300),
                  child: switch (state) {
                    HomeContentLoading() =>
                      const _HomeShimmer(key: ValueKey('loading')),
                    HomeContentError(:final message) => Center(
                        key: const ValueKey('error'),
                        child: ErrorStateWidget(
                          message: message,
                          onRetry: () => ctx.read<HomeContentCubit>().load(),
                        ),
                      ),
                    HomeContentSuccess() => _Body(
                        key: const ValueKey('success'),
                        state: state,
                        locale: locale,
                        onBookTap: (id, title) => _openBook(ctx, id, title),
                        onBrowse: () =>
                            Navigator.of(ctx).pushNamed(AppRoutes.books),
                        onPublisher: () =>
                            Navigator.of(ctx).pushNamed(AppRoutes.publishers),
                        onCategoryTap: (cat) => Navigator.of(ctx).pushNamed(
                          AppRoutes.categoryBooks,
                          arguments: CategoryBooksArgs(
                            slug: cat.slug,
                            nameAr: cat.nameAr,
                            nameEn: cat.nameEn,
                          ),
                        ),
                        onRefresh: () =>
                            ctx.read<HomeContentCubit>().refresh(),
                      ),
                    _ => const SizedBox.shrink(key: ValueKey('initial')),
                  },
                );
              },
            ),
          ),
          BottomNavWidget(
            activeTab: BottomNavTab.home,
            onTabSelected: (tab) => _onTabSelected(context, tab),
            onPublishTap: () =>
                Navigator.of(context).pushNamed(AppRoutes.publish),
            currentLocale: locale,
          ),
        ],
      ),
    );
  }

  void _onTabSelected(BuildContext context, BottomNavTab tab) {
    switch (tab) {
      case BottomNavTab.home:
        break;
      case BottomNavTab.books:
        Navigator.of(context).pushReplacementNamed(AppRoutes.books);
      case BottomNavTab.articles:
        Navigator.of(context).pushReplacementNamed(AppRoutes.articles);
      case BottomNavTab.publishers:
        Navigator.of(context).pushReplacementNamed(AppRoutes.publishers);
    }
  }
}

// ── Body ──────────────────────────────────────────────────────────────────
class _Body extends StatelessWidget {
  const _Body({
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
    final ar = locale == 'ar';
    return RefreshIndicator(
      onRefresh: onRefresh,
      color: AppColors.primary,
      child: CustomScrollView(
        physics: const AlwaysScrollableScrollPhysics(),
        slivers: [
        // Featured hero
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

        // Categories
        if (state.categories.isNotEmpty) ...[
          SliverToBoxAdapter(
            child: Padding(
              padding: EdgeInsetsDirectional.only(top: 14.h, bottom: 12.h),
              child: SectionHeaderWidget(
                title: ar ? 'تصفح حسب التصنيف' : 'Browse by Category',
                onSeeAll: onBrowse,
                seeAllLabel: ar ? 'عرض الكل' : 'All',
              ),
            ),
          ),
          SliverToBoxAdapter(
            child: SingleChildScrollView(
              scrollDirection: Axis.horizontal,
              padding:
                  EdgeInsetsDirectional.fromSTEB(16.w, 0, 16.w, 4.h),
              child: Row(
                children: state.categories
                    .map(
                      (c) => Padding(
                        padding: EdgeInsetsDirectional.only(end: 10.w),
                        child: _CategoryChip(
                          nameAr: c.nameAr,
                          nameEn: c.nameEn,
                          locale: locale,
                          onTap: () => onCategoryTap(c),
                        ),
                      ),
                    )
                    .toList(),
              ),
            ),
          ),
        ],

        // Newly released
        if (state.freshBooks.isNotEmpty) ...[
          SliverToBoxAdapter(
            child: Padding(
              padding: EdgeInsetsDirectional.only(top: 26.h, bottom: 12.h),
              child: SectionHeaderWidget(
                title: ar ? 'صدر حديثًا' : 'Newly Released',
                onSeeAll: onBrowse,
              ),
            ),
          ),
          SliverToBoxAdapter(
            child: SingleChildScrollView(
              scrollDirection: Axis.horizontal,
              padding:
                  EdgeInsetsDirectional.fromSTEB(16.w, 0, 16.w, 4.h),
              child: Row(
                crossAxisAlignment: CrossAxisAlignment.start,
                children: state.freshBooks
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
          ),
        ],

        // Translated books
        if (state.translatedBooks.isNotEmpty) ...[
          SliverToBoxAdapter(
            child: Padding(
              padding: EdgeInsetsDirectional.only(top: 26.h, bottom: 12.h),
              child: SectionHeaderWidget(
                title: ar ? 'الكتب المترجمة' : 'Translated Books',
                onSeeAll: onBrowse,
              ),
            ),
          ),
          SliverToBoxAdapter(
            child: SingleChildScrollView(
              scrollDirection: Axis.horizontal,
              padding:
                  EdgeInsetsDirectional.fromSTEB(16.w, 0, 16.w, 4.h),
              child: Row(
                crossAxisAlignment: CrossAxisAlignment.start,
                children: state.translatedBooks
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
          ),
        ],

        // Top publishers
        if (state.topPublishers.isNotEmpty) ...[
          SliverToBoxAdapter(
            child: Padding(
              padding: EdgeInsetsDirectional.only(top: 26.h, bottom: 12.h),
              child: SectionHeaderWidget(
                title: ar ? 'أبرز الناشرين' : 'Top Publishers',
                onSeeAll: onPublisher,
              ),
            ),
          ),
          SliverToBoxAdapter(
            child: SingleChildScrollView(
              scrollDirection: Axis.horizontal,
              padding:
                  EdgeInsetsDirectional.fromSTEB(16.w, 0, 16.w, 4.h),
              child: Row(
                children: state.topPublishers
                    .map(
                      (p) => Padding(
                        padding: EdgeInsetsDirectional.only(end: 10.w),
                        child: _PublisherPill(
                          publisher: p,
                          locale: locale,
                          onTap: onPublisher,
                        ),
                      ),
                    )
                    .toList(),
              ),
            ),
          ),
        ],

        // Newsletter strip
        SliverToBoxAdapter(
          child: Padding(
            padding:
                EdgeInsetsDirectional.fromSTEB(16.w, 28.h, 16.w, 6.h),
            child: _NewsletterStrip(locale: locale),
          ),
        ),

        SliverToBoxAdapter(child: SizedBox(height: 16.h)),
      ],
      ),
    );
  }
}

// ── Category chip ─────────────────────────────────────────────────────────
class _CategoryChip extends StatelessWidget {
  const _CategoryChip({
    required this.nameAr,
    required this.nameEn,
    required this.locale,
    required this.onTap,
  });
  final String nameAr;
  final String nameEn;
  final String locale;
  final VoidCallback onTap;

  @override
  Widget build(BuildContext context) {
    return GestureDetector(
      onTap: onTap,
      child: Container(
        padding: EdgeInsetsDirectional.fromSTEB(12.w, 9.h, 15.w, 9.h),
        decoration: BoxDecoration(
          color: AppColors.surface,
          borderRadius: BorderRadius.circular(999),
          border: Border.all(color: AppColors.divider),
          boxShadow: const [
            BoxShadow(
              color: Color(0x0D000000),
              blurRadius: 24,
              offset: Offset(0, 4),
            ),
          ],
        ),
        child: Row(
          mainAxisSize: MainAxisSize.min,
          children: [
            Container(
              width: 30.r,
              height: 30.r,
              decoration: BoxDecoration(
                color: AppColors.brandRedSoft,
                shape: BoxShape.circle,
              ),
              child: Icon(
                Icons.menu_book_outlined,
                size: 17.r,
                color: AppColors.primary,
              ),
            ),
            SizedBox(width: 8.w),
            Text(
              locale == 'ar' ? nameAr : nameEn,
              style: GoogleFonts.cairo(
                fontSize: 13.5.sp,
                fontWeight: FontWeight.w700,
                color: AppColors.textPrimary,
              ),
            ),
          ],
        ),
      ),
    );
  }
}

// ── Publisher pill ────────────────────────────────────────────────────────
class _PublisherPill extends StatelessWidget {
  const _PublisherPill({
    required this.publisher,
    required this.locale,
    required this.onTap,
  });
  final PublisherSummary publisher;
  final String locale;
  final VoidCallback onTap;

  @override
  Widget build(BuildContext context) {
    final initials = publisher.name
        .split(' ')
        .take(2)
        .map((w) => w.isNotEmpty ? w[0] : '')
        .join();
    return GestureDetector(
      onTap: onTap,
      child: Container(
        padding: EdgeInsetsDirectional.fromSTEB(10.w, 8.h, 16.w, 8.h),
        decoration: BoxDecoration(
          color: AppColors.surface,
          borderRadius: BorderRadius.circular(999),
          border: Border.all(color: AppColors.divider),
          boxShadow: const [
            BoxShadow(
              color: Color(0x0D000000),
              blurRadius: 24,
              offset: Offset(0, 4),
            ),
          ],
        ),
        child: Row(
          mainAxisSize: MainAxisSize.min,
          children: [
            Container(
              width: 36.r,
              height: 36.r,
              decoration: BoxDecoration(
                color: AppColors.secondary,
                shape: BoxShape.circle,
              ),
              child: Center(
                child: Text(
                  initials,
                  style: GoogleFonts.cairo(
                    fontSize: 14.sp,
                    fontWeight: FontWeight.w800,
                    color: Colors.white,
                  ),
                ),
              ),
            ),
            SizedBox(width: 10.w),
            Column(
              crossAxisAlignment: CrossAxisAlignment.start,
              mainAxisSize: MainAxisSize.min,
              children: [
                Text(
                  publisher.name,
                  style: GoogleFonts.cairo(
                    fontSize: 13.sp,
                    fontWeight: FontWeight.w700,
                    color: AppColors.textPrimary,
                  ),
                  maxLines: 1,
                  overflow: TextOverflow.ellipsis,
                ),
                Text(
                  '${publisher.countryFlag} ${publisher.bookCount} ${locale == 'ar' ? 'كتاب' : 'books'}',
                  style: GoogleFonts.inter(
                    fontSize: 11.sp,
                    color: AppColors.textSecondary,
                  ),
                ),
              ],
            ),
          ],
        ),
      ),
    );
  }
}

// ── Newsletter strip ──────────────────────────────────────────────────────
class _NewsletterStrip extends StatelessWidget {
  const _NewsletterStrip({required this.locale});
  final String locale;

  @override
  Widget build(BuildContext context) {
    final ar = locale == 'ar';
    return Container(
      padding: EdgeInsetsDirectional.all(20.r),
      decoration: BoxDecoration(
        color: AppColors.secondary,
        borderRadius: BorderRadius.circular(24.r),
      ),
      child: Column(
        crossAxisAlignment: CrossAxisAlignment.start,
        children: [
          Text(
            ar ? 'اشترك في نشرتنا البريدية' : 'Subscribe to our newsletter',
            style: GoogleFonts.cairo(
              fontSize: 17.sp,
              fontWeight: FontWeight.w800,
              color: Colors.white,
            ),
          ),
          SizedBox(height: 5.h),
          Text(
            ar
                ? 'آخر الكتب والترجمات مباشرة إلى بريدك'
                : 'Latest books and translations straight to your inbox',
            style: GoogleFonts.tajawal(
              fontSize: 13.sp,
              color: Colors.white.withValues(alpha: 0.65),
            ),
          ),
          SizedBox(height: 14.h),
          Row(
            children: [
              Expanded(
                child: Container(
                  height: 46.h,
                  padding: EdgeInsetsDirectional.symmetric(horizontal: 14.w),
                  decoration: BoxDecoration(
                    color: Colors.white.withValues(alpha: 0.1),
                    border: Border.all(
                      color: Colors.white.withValues(alpha: 0.18),
                    ),
                    borderRadius: BorderRadius.circular(14.r),
                  ),
                  alignment: AlignmentDirectional.centerStart,
                  child: Text(
                    ar ? 'بريدك الإلكتروني' : 'Your email',
                    style: GoogleFonts.tajawal(
                      fontSize: 13.sp,
                      color: Colors.white.withValues(alpha: 0.6),
                    ),
                  ),
                ),
              ),
              SizedBox(width: 8.w),
              GestureDetector(
                child: Container(
                  height: 46.h,
                  padding: EdgeInsetsDirectional.symmetric(horizontal: 18.w),
                  decoration: BoxDecoration(
                    color: AppColors.primary,
                    borderRadius: BorderRadius.circular(14.r),
                  ),
                  child: Center(
                    child: Text(
                      ar ? 'اشترك' : 'Subscribe',
                      style: GoogleFonts.cairo(
                        fontSize: 14.sp,
                        fontWeight: FontWeight.w700,
                        color: Colors.white,
                      ),
                    ),
                  ),
                ),
              ),
            ],
          ),
        ],
      ),
    );
  }
}

// ── Shimmer skeletons ─────────────────────────────────────────────────────

class _HomeShimmer extends StatelessWidget {
  const _HomeShimmer({super.key});

  @override
  Widget build(BuildContext context) {
    return SingleChildScrollView(
      physics: const NeverScrollableScrollPhysics(),
      child: Column(
        crossAxisAlignment: CrossAxisAlignment.start,
        children: [
          const _FeaturedHeroShimmer(),
          SizedBox(height: 26.h),
          const _ShimmerSection(),
          SizedBox(height: 26.h),
          const _ShimmerSection(),
          Padding(
            padding: EdgeInsetsDirectional.fromSTEB(16.w, 28.h, 16.w, 6.h),
            child: Shimmer.fromColors(
              baseColor: AppColors.shimmerBase,
              highlightColor: AppColors.shimmerHighlight,
              child: Container(
                height: 120.h,
                decoration: BoxDecoration(
                  color: Colors.white,
                  borderRadius: BorderRadius.circular(24.r),
                ),
              ),
            ),
          ),
          SizedBox(height: 16.h),
        ],
      ),
    );
  }
}

class _FeaturedHeroShimmer extends StatelessWidget {
  const _FeaturedHeroShimmer();

  @override
  Widget build(BuildContext context) {
    return Padding(
      padding: EdgeInsetsDirectional.fromSTEB(16.w, 16.h, 16.w, 8.h),
      child: Shimmer.fromColors(
        baseColor: AppColors.shimmerBase,
        highlightColor: AppColors.shimmerHighlight,
        child: Container(
          decoration: BoxDecoration(
            color: Colors.white,
            borderRadius: BorderRadius.circular(26.r),
          ),
          padding: EdgeInsetsDirectional.all(18.r),
          child: IntrinsicHeight(
            child: Row(
              crossAxisAlignment: CrossAxisAlignment.stretch,
              children: [
                SizedBox(
                  width: 96.w,
                  child: AspectRatio(
                    aspectRatio: 3 / 4,
                    child: Container(
                      decoration: BoxDecoration(
                        color: Colors.white,
                        borderRadius: BorderRadius.circular(8.r),
                      ),
                    ),
                  ),
                ),
                SizedBox(width: 14.w),
                Expanded(
                  child: Column(
                    crossAxisAlignment: CrossAxisAlignment.start,
                    mainAxisAlignment: MainAxisAlignment.spaceBetween,
                    children: [
                      Column(
                        crossAxisAlignment: CrossAxisAlignment.start,
                        children: [
                          Container(
                            height: 10.h,
                            width: 90.w,
                            decoration: BoxDecoration(
                              color: Colors.white,
                              borderRadius: BorderRadius.circular(4.r),
                            ),
                          ),
                          SizedBox(height: 7.h),
                          Container(
                            height: 16.h,
                            decoration: BoxDecoration(
                              color: Colors.white,
                              borderRadius: BorderRadius.circular(4.r),
                            ),
                          ),
                          SizedBox(height: 5.h),
                          Container(
                            height: 16.h,
                            decoration: BoxDecoration(
                              color: Colors.white,
                              borderRadius: BorderRadius.circular(4.r),
                            ),
                          ),
                          SizedBox(height: 5.h),
                          Container(
                            height: 16.h,
                            width: 120.w,
                            decoration: BoxDecoration(
                              color: Colors.white,
                              borderRadius: BorderRadius.circular(4.r),
                            ),
                          ),
                          SizedBox(height: 9.h),
                          Container(
                            height: 24.h,
                            width: 90.w,
                            decoration: BoxDecoration(
                              color: Colors.white,
                              borderRadius: BorderRadius.circular(999),
                            ),
                          ),
                        ],
                      ),
                      Container(
                        margin: EdgeInsetsDirectional.only(top: 12.h),
                        height: 36.h,
                        width: 130.w,
                        decoration: BoxDecoration(
                          color: Colors.white,
                          borderRadius: BorderRadius.circular(999),
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
    );
  }
}

class _ShimmerSection extends StatelessWidget {
  const _ShimmerSection();

  @override
  Widget build(BuildContext context) {
    return Column(
      crossAxisAlignment: CrossAxisAlignment.start,
      children: [
        Padding(
          padding: EdgeInsetsDirectional.fromSTEB(16.w, 0, 16.w, 12.h),
          child: Shimmer.fromColors(
            baseColor: AppColors.shimmerBase,
            highlightColor: AppColors.shimmerHighlight,
            child: Container(
              height: 18.h,
              width: 140.w,
              decoration: BoxDecoration(
                color: Colors.white,
                borderRadius: BorderRadius.circular(4.r),
              ),
            ),
          ),
        ),
        SingleChildScrollView(
          scrollDirection: Axis.horizontal,
          physics: const NeverScrollableScrollPhysics(),
          padding: EdgeInsetsDirectional.fromSTEB(16.w, 0, 16.w, 4.h),
          child: Row(
            crossAxisAlignment: CrossAxisAlignment.start,
            children: [
              BookCardShimmer(width: 150.w),
              SizedBox(width: 12.w),
              BookCardShimmer(width: 150.w),
              SizedBox(width: 12.w),
              BookCardShimmer(width: 150.w),
            ],
          ),
        ),
      ],
    );
  }
}
