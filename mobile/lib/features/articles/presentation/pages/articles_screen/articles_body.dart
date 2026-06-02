import 'package:easy_localization/easy_localization.dart';
import 'package:flutter/material.dart';
import 'package:flutter_screenutil/flutter_screenutil.dart';
import 'package:google_fonts/google_fonts.dart';

import '../../../../../core/theme/app_colors.dart';
import '../../../../../core/widgets/empty_state_widget.dart';
import '../../../domain/entities/article.dart';
import '../../../domain/entities/article_channel.dart';
import 'articles_article_row.dart';
import 'articles_featured_card.dart';

class ArticlesBody extends StatelessWidget {
  const ArticlesBody({
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
                          color:
                              active ? AppColors.primary : AppColors.surface,
                          border: Border.all(
                            color: active
                                ? AppColors.primary
                                : AppColors.divider,
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
                              constraints: BoxConstraints(
                                  minWidth: 18.r, minHeight: 18.r),
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
            SliverToBoxAdapter(
              child: Padding(
                padding:
                    EdgeInsetsDirectional.fromSTEB(16.w, 18.h, 16.w, 18.h),
                child: ArticlesFeaturedCard(
                  article: articles.first,
                  locale: locale,
                  onTap: () => onArticleTap(articles.first),
                ),
              ),
            ),
            SliverList.separated(
              itemCount: articles.length - 1,
              separatorBuilder: (_, i) => SizedBox(height: 12.h),
              itemBuilder: (_, i) => Padding(
                padding: EdgeInsetsDirectional.symmetric(horizontal: 16.w),
                child: ArticlesArticleRow(
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
