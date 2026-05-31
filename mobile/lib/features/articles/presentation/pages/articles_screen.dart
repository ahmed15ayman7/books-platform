import 'package:easy_localization/easy_localization.dart';
import 'package:flutter/material.dart';
import 'package:flutter_bloc/flutter_bloc.dart';
import 'package:flutter_screenutil/flutter_screenutil.dart';
import 'package:google_fonts/google_fonts.dart';
import 'package:shimmer/shimmer.dart';

import '../../../../core/router/app_routes.dart';
import '../../../../core/router/args/article_detail_args.dart';
import '../../../../core/theme/app_colors.dart';
import '../../../../core/theme/app_shadows.dart';
import '../../../../core/widgets/app_bar_widget.dart';
import '../../../../core/widgets/bottom_nav_widget.dart';
import '../../../../core/widgets/empty_state_widget.dart';
import '../../../../core/widgets/error_state_widget.dart';
import '../../domain/entities/article.dart';
import '../../domain/entities/article_channel.dart';
import '../cubit/articles_list_cubit/articles_list_cubit.dart';
import '../cubit/articles_list_cubit/articles_list_state.dart';

class ArticlesScreen extends StatefulWidget {
  const ArticlesScreen({super.key});

  @override
  State<ArticlesScreen> createState() => _ArticlesScreenState();
}

class _ArticlesScreenState extends State<ArticlesScreen> {
  @override
  void initState() {
    super.initState();
    context.read<ArticlesListCubit>().load();
  }

  @override
  Widget build(BuildContext context) {
    final locale = context.locale.languageCode;
    return Scaffold(
      backgroundColor: AppColors.background,
      body: Column(
        children: [
          AppBarWidget(
            variant: AppBarVariant.title,
            title: 'articles.title'.tr(),
            currentLocale: locale,
            onCart: () => Navigator.of(context).pushNamed(AppRoutes.cart),
            onLocaleChanged: (l) => context.setLocale(Locale(l)),
          ),
          Expanded(
            child: BlocBuilder<ArticlesListCubit, ArticlesListState>(
              builder: (ctx, state) {
                return AnimatedSwitcher(
                  duration: const Duration(milliseconds: 300),
                  child: switch (state) {
                    ArticlesListLoading() =>
                      const _ArticlesShimmer(key: ValueKey('loading')),
                    ArticlesListError(:final message) => Center(
                        key: const ValueKey('error'),
                        child: ErrorStateWidget(
                          message: message,
                          onRetry: () =>
                              ctx.read<ArticlesListCubit>().load(),
                        ),
                      ),
                    ArticlesListSuccess(
                      :final channels,
                      :final articles,
                      :final activeChannel,
                    ) =>
                      _Body(
                        key: const ValueKey('success'),
                        channels: channels,
                        articles: articles,
                        activeChannel: activeChannel,
                        locale: locale,
                        onChannelTap: (c) =>
                            ctx.read<ArticlesListCubit>().switchChannel(c),
                        onArticleTap: (a) => Navigator.of(ctx).pushNamed(
                          AppRoutes.articleDetail,
                          arguments:
                              ArticleDetailArgs(id: a.id, title: a.title),
                        ),
                        onRefresh: () =>
                            ctx.read<ArticlesListCubit>().refresh(),
                      ),
                    _ => const SizedBox.shrink(key: ValueKey('initial')),
                  },
                );
              },
            ),
          ),
          BottomNavWidget(
            activeTab: BottomNavTab.articles,
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
        Navigator.of(context).pushReplacementNamed(AppRoutes.home);
      case BottomNavTab.books:
        Navigator.of(context).pushReplacementNamed(AppRoutes.books);
      case BottomNavTab.articles:
        break;
      case BottomNavTab.publishers:
        Navigator.of(context).pushReplacementNamed(AppRoutes.publishers);
    }
  }
}

class _Body extends StatelessWidget {
  const _Body({
    super.key,
    required this.channels,
    required this.articles,
    required this.activeChannel,
    required this.locale,
    required this.onChannelTap,
    required this.onArticleTap,
    required this.onRefresh,
  });
  final List<ArticleChannel> channels;
  final List<Article> articles;
  final String activeChannel;
  final String locale;
  final ValueChanged<String> onChannelTap;
  final ValueChanged<Article> onArticleTap;
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
        // Channel tabs
        SliverToBoxAdapter(
          child: SingleChildScrollView(
            scrollDirection: Axis.horizontal,
            padding: EdgeInsetsDirectional.fromSTEB(16.w, 12.h, 16.w, 4.h),
            child: Row(
              children: channels.map((c) {
                final active = c.key == activeChannel;
                return Padding(
                  padding: EdgeInsetsDirectional.only(end: 8.w),
                  child: GestureDetector(
                    onTap: () => onChannelTap(c.key),
                    child: AnimatedContainer(
                      duration: const Duration(milliseconds: 180),
                      padding: EdgeInsets.symmetric(
                          horizontal: 14.w, vertical: 8.h),
                      decoration: BoxDecoration(
                        color: active ? AppColors.primary : AppColors.surface,
                        border: Border.all(
                          color:
                              active ? AppColors.primary : AppColors.divider,
                        ),
                        borderRadius: BorderRadius.circular(999),
                      ),
                      child: Row(
                        mainAxisSize: MainAxisSize.min,
                        children: [
                          Text(
                            ar ? c.nameAr : c.nameEn,
                            style: GoogleFonts.cairo(
                              fontSize: 13.sp,
                              fontWeight: FontWeight.w700,
                              color: active
                                  ? Colors.white
                                  : AppColors.textPrimary,
                            ),
                          ),
                          SizedBox(width: 6.w),
                          Container(
                            padding: EdgeInsets.symmetric(
                                horizontal: 4.w, vertical: 1.h),
                            constraints:
                                BoxConstraints(minWidth: 18.r, minHeight: 18.r),
                            decoration: BoxDecoration(
                              color: active
                                  ? Colors.white.withValues(alpha: 0.25)
                                  : AppColors.inputFill,
                              borderRadius: BorderRadius.circular(999),
                            ),
                            child: Center(
                              child: Text(
                                '${c.count}',
                                style: GoogleFonts.inter(
                                  fontSize: 11.sp,
                                  fontWeight: FontWeight.w700,
                                  color: active
                                      ? Colors.white
                                      : AppColors.textSecondary,
                                ),
                              ),
                            ),
                          ),
                        ],
                      ),
                    ),
                  ),
                );
              }).toList(),
            ),
          ),
        ),

        if (articles.isEmpty)
          SliverFillRemaining(
            child: Center(
              child: EmptyStateWidget(
                icon: Icons.article_outlined,
                title: 'articles.empty'.tr(),
                subtitle: ar
                    ? 'لم تُنشر مقالات في هذا القسم بعد. عُد قريباً.'
                    : 'No articles in this section yet. Check back soon.',
              ),
            ),
          )
        else ...[
          // Featured article
          SliverToBoxAdapter(
            child: Padding(
              padding: EdgeInsetsDirectional.fromSTEB(16.w, 18.h, 16.w, 18.h),
              child: _FeaturedCard(
                article: articles.first,
                locale: locale,
                onTap: () => onArticleTap(articles.first),
              ),
            ),
          ),
          // Rest of articles
          SliverList.separated(
            itemCount: articles.length - 1,
            separatorBuilder: (_, i) => SizedBox(height: 12.h),
            itemBuilder: (_, i) => Padding(
              padding: EdgeInsetsDirectional.symmetric(horizontal: 16.w),
              child: _ArticleRow(
                article: articles[i + 1],
                locale: locale,
                onTap: () => onArticleTap(articles[i + 1]),
              ),
            ),
          ),
        ],
        SliverToBoxAdapter(child: SizedBox(height: 24.h)),
      ],
      ),
    );
  }
}

class _FeaturedCard extends StatelessWidget {
  const _FeaturedCard({
    required this.article,
    required this.locale,
    required this.onTap,
  });
  final Article article;
  final String locale;
  final VoidCallback onTap;

  @override
  Widget build(BuildContext context) {
    return GestureDetector(
      onTap: onTap,
      child: Container(
        decoration: BoxDecoration(
          color: AppColors.surface,
          border: Border.all(color: AppColors.divider),
          borderRadius: BorderRadius.circular(24.r),
          boxShadow: AppShadows.soft,
        ),
        clipBehavior: Clip.hardEdge,
        child: Column(
          crossAxisAlignment: CrossAxisAlignment.start,
          children: [
            Stack(
              children: [
                Container(
                  height: 150.h,
                  decoration: BoxDecoration(
                    gradient: LinearGradient(
                      begin: AlignmentDirectional.topStart,
                      end: AlignmentDirectional.bottomEnd,
                      colors: article.coverColors.length >= 2
                          ? [article.coverColors[1], article.coverColors[0]]
                          : [AppColors.secondary, AppColors.primary],
                    ),
                  ),
                ),
                PositionedDirectional(
                  top: 12.h,
                  start: 12.w,
                  child: Container(
                    padding:
                        EdgeInsets.symmetric(horizontal: 10.w, vertical: 4.h),
                    decoration: BoxDecoration(
                      color: Colors.black.withValues(alpha: 0.4),
                      borderRadius: BorderRadius.circular(999),
                    ),
                    child: Text(
                      'articles.featured'.tr(),
                      style: GoogleFonts.cairo(
                        fontSize: 11.sp,
                        fontWeight: FontWeight.w700,
                        color: Colors.white,
                      ),
                    ),
                  ),
                ),
              ],
            ),
            Padding(
              padding: EdgeInsetsDirectional.all(16.r),
              child: Column(
                crossAxisAlignment: CrossAxisAlignment.start,
                children: [
                  Text(
                    article.categoryLabel,
                    style: GoogleFonts.cairo(
                      fontSize: 11.5.sp,
                      fontWeight: FontWeight.w700,
                      color: AppColors.primary,
                    ),
                  ),
                  SizedBox(height: 5.h),
                  Text(
                    article.title,
                    style: GoogleFonts.cairo(
                      fontSize: 17.sp,
                      fontWeight: FontWeight.w800,
                      color: AppColors.textPrimary,
                      height: 1.45,
                    ),
                  ),
                  SizedBox(height: 7.h),
                  Text(
                    article.excerpt,
                    style: GoogleFonts.tajawal(
                      fontSize: 13.5.sp,
                      color: AppColors.textSecondary,
                      height: 1.7,
                    ),
                    maxLines: 2,
                    overflow: TextOverflow.ellipsis,
                  ),
                  SizedBox(height: 9.h),
                  Text(
                    '${article.date} · ${article.readMinutes} ${'articles.min_read'.tr()}',
                    style: GoogleFonts.inter(
                      fontSize: 11.5.sp,
                      color: AppColors.textHint,
                    ),
                  ),
                ],
              ),
            ),
          ],
        ),
      ),
    );
  }
}

class _ArticleRow extends StatelessWidget {
  const _ArticleRow({
    required this.article,
    required this.locale,
    required this.onTap,
  });
  final Article article;
  final String locale;
  final VoidCallback onTap;

  @override
  Widget build(BuildContext context) {
    return GestureDetector(
      onTap: onTap,
      child: Container(
        padding: EdgeInsetsDirectional.all(11.r),
        decoration: BoxDecoration(
          color: AppColors.surface,
          border: Border.all(color: AppColors.divider),
          borderRadius: BorderRadius.circular(18.r),
          boxShadow: const [
            BoxShadow(
              color: Color(0x0A000000),
              blurRadius: 24,
              offset: Offset(0, 4),
            ),
          ],
        ),
        child: Row(
          children: [
            Container(
              width: 78.w,
              height: 78.h,
              decoration: BoxDecoration(
                borderRadius: BorderRadius.circular(12.r),
                gradient: LinearGradient(
                  begin: AlignmentDirectional.topStart,
                  end: AlignmentDirectional.bottomEnd,
                  colors: article.coverColors.length >= 2
                      ? [article.coverColors[1], article.coverColors[0]]
                      : [AppColors.secondary, AppColors.primary],
                ),
              ),
            ),
            SizedBox(width: 13.w),
            Expanded(
              child: Column(
                crossAxisAlignment: CrossAxisAlignment.start,
                children: [
                  Text(
                    article.categoryLabel,
                    style: GoogleFonts.cairo(
                      fontSize: 11.sp,
                      fontWeight: FontWeight.w700,
                      color: AppColors.primary,
                    ),
                  ),
                  SizedBox(height: 3.h),
                  Text(
                    article.title,
                    style: GoogleFonts.cairo(
                      fontSize: 14.5.sp,
                      fontWeight: FontWeight.w700,
                      color: AppColors.textPrimary,
                      height: 1.45,
                    ),
                    maxLines: 2,
                    overflow: TextOverflow.ellipsis,
                  ),
                  SizedBox(height: 5.h),
                  Text(
                    '${article.date} · ${article.readMinutes} ${'articles.min'.tr()}',
                    style: GoogleFonts.inter(
                      fontSize: 11.sp,
                      color: AppColors.textHint,
                    ),
                  ),
                ],
              ),
            ),
          ],
        ),
      ),
    );
  }
}

class _FeaturedArticleShimmer extends StatelessWidget {
  const _FeaturedArticleShimmer();

  @override
  Widget build(BuildContext context) {
    return Shimmer.fromColors(
      baseColor: AppColors.shimmerBase,
      highlightColor: AppColors.shimmerHighlight,
      child: Container(
        decoration: BoxDecoration(
          color: Colors.white,
          borderRadius: BorderRadius.circular(24.r),
        ),
        clipBehavior: Clip.hardEdge,
        child: Column(
          crossAxisAlignment: CrossAxisAlignment.start,
          children: [
            Container(height: 150.h, color: Colors.white),
            Padding(
              padding: EdgeInsetsDirectional.all(16.r),
              child: Column(
                crossAxisAlignment: CrossAxisAlignment.start,
                children: [
                  Container(
                    height: 10.h,
                    width: 80.w,
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
                  SizedBox(height: 4.h),
                  Container(
                    height: 16.h,
                    width: 200.w,
                    decoration: BoxDecoration(
                      color: Colors.white,
                      borderRadius: BorderRadius.circular(4.r),
                    ),
                  ),
                  SizedBox(height: 9.h),
                  Container(
                    height: 12.h,
                    decoration: BoxDecoration(
                      color: Colors.white,
                      borderRadius: BorderRadius.circular(4.r),
                    ),
                  ),
                  SizedBox(height: 4.h),
                  Container(
                    height: 12.h,
                    width: 150.w,
                    decoration: BoxDecoration(
                      color: Colors.white,
                      borderRadius: BorderRadius.circular(4.r),
                    ),
                  ),
                  SizedBox(height: 9.h),
                  Container(
                    height: 10.h,
                    width: 100.w,
                    decoration: BoxDecoration(
                      color: Colors.white,
                      borderRadius: BorderRadius.circular(4.r),
                    ),
                  ),
                ],
              ),
            ),
          ],
        ),
      ),
    );
  }
}

class _ArticleRowShimmer extends StatelessWidget {
  const _ArticleRowShimmer();

  @override
  Widget build(BuildContext context) {
    return Shimmer.fromColors(
      baseColor: AppColors.shimmerBase,
      highlightColor: AppColors.shimmerHighlight,
      child: Container(
        padding: EdgeInsetsDirectional.all(11.r),
        decoration: BoxDecoration(
          color: Colors.white,
          borderRadius: BorderRadius.circular(18.r),
        ),
        child: Row(
          children: [
            Container(
              width: 78.w,
              height: 78.h,
              decoration: BoxDecoration(
                color: Colors.white,
                borderRadius: BorderRadius.circular(12.r),
              ),
            ),
            SizedBox(width: 13.w),
            Expanded(
              child: Column(
                crossAxisAlignment: CrossAxisAlignment.start,
                children: [
                  Container(
                    height: 10.h,
                    width: 60.w,
                    decoration: BoxDecoration(
                      color: Colors.white,
                      borderRadius: BorderRadius.circular(4.r),
                    ),
                  ),
                  SizedBox(height: 5.h),
                  Container(
                    height: 13.h,
                    decoration: BoxDecoration(
                      color: Colors.white,
                      borderRadius: BorderRadius.circular(4.r),
                    ),
                  ),
                  SizedBox(height: 4.h),
                  Container(
                    height: 13.h,
                    width: 140.w,
                    decoration: BoxDecoration(
                      color: Colors.white,
                      borderRadius: BorderRadius.circular(4.r),
                    ),
                  ),
                  SizedBox(height: 6.h),
                  Container(
                    height: 10.h,
                    width: 80.w,
                    decoration: BoxDecoration(
                      color: Colors.white,
                      borderRadius: BorderRadius.circular(4.r),
                    ),
                  ),
                ],
              ),
            ),
          ],
        ),
      ),
    );
  }
}

class _ArticlesShimmer extends StatelessWidget {
  const _ArticlesShimmer({super.key});

  @override
  Widget build(BuildContext context) {
    return SingleChildScrollView(
      physics: const NeverScrollableScrollPhysics(),
      padding: EdgeInsetsDirectional.fromSTEB(16.w, 18.h, 16.w, 24.h),
      child: Column(
        crossAxisAlignment: CrossAxisAlignment.start,
        children: [
          const _FeaturedArticleShimmer(),
          SizedBox(height: 12.h),
          const _ArticleRowShimmer(),
          SizedBox(height: 12.h),
          const _ArticleRowShimmer(),
          SizedBox(height: 12.h),
          const _ArticleRowShimmer(),
          SizedBox(height: 12.h),
          const _ArticleRowShimmer(),
        ],
      ),
    );
  }
}
