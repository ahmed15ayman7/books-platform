import 'package:easy_localization/easy_localization.dart';
import 'package:flutter/material.dart';
import 'package:flutter_bloc/flutter_bloc.dart';
import 'package:flutter_screenutil/flutter_screenutil.dart';
import 'package:google_fonts/google_fonts.dart';

import '../../../../core/router/app_routes.dart';
import '../../../../core/router/args/article_detail_args.dart';
import '../../../../core/theme/app_colors.dart';
import '../../../../core/widgets/app_loading_indicator.dart';
import '../../../../core/widgets/bottom_nav_widget.dart';
import '../../../../core/widgets/error_state_widget.dart';
import '../../../../core/widgets/section_header_widget.dart';
import '../../domain/entities/article.dart';
import '../../domain/entities/article_detail.dart';
import '../cubit/article_detail_cubit/article_detail_cubit.dart';
import '../cubit/article_detail_cubit/article_detail_state.dart';

class ArticleDetailScreen extends StatefulWidget {
  const ArticleDetailScreen({super.key, required this.args});
  final ArticleDetailArgs args;

  @override
  State<ArticleDetailScreen> createState() => _ArticleDetailScreenState();
}

class _ArticleDetailScreenState extends State<ArticleDetailScreen> {
  final _commentController = TextEditingController();

  @override
  void initState() {
    super.initState();
    context.read<ArticleDetailCubit>().load(widget.args.id);
  }

  @override
  void dispose() {
    _commentController.dispose();
    super.dispose();
  }

  @override
  Widget build(BuildContext context) {
    final locale = context.locale.languageCode;
    return Scaffold(
      backgroundColor: AppColors.background,
      body: BlocBuilder<ArticleDetailCubit, ArticleDetailState>(
        builder: (ctx, state) => switch (state) {
          ArticleDetailLoading() ||
          ArticleDetailInitial() =>
            const Center(child: AppLoadingIndicator()),
          ArticleDetailError(:final message) => Center(
              child: ErrorStateWidget(
                message: message,
                onRetry: () =>
                    ctx.read<ArticleDetailCubit>().load(widget.args.id),
              ),
            ),
          ArticleDetailSuccess(:final article) => Column(
              children: [
                Expanded(
                  child: _ArticleBody(
                    article: article,
                    locale: locale,
                    commentController: _commentController,
                    onBack: () => Navigator.of(ctx).pop(),
                    onRelatedTap: (a) => Navigator.of(ctx).pushReplacementNamed(
                      AppRoutes.articleDetail,
                      arguments: ArticleDetailArgs(id: a.id, title: a.title),
                    ),
                  ),
                ),
                BottomNavWidget(
                  activeTab: BottomNavTab.articles,
                  onTabSelected: (tab) => _onTabSelected(ctx, tab),
                  onPublishTap: () =>
                      Navigator.of(ctx).pushNamed(AppRoutes.publish),
                  currentLocale: locale,
                ),
              ],
            ),
        },
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
        Navigator.of(context).pushReplacementNamed(AppRoutes.articles);
      case BottomNavTab.publishers:
        Navigator.of(context).pushReplacementNamed(AppRoutes.publishers);
    }
  }
}

// ── Article body ──────────────────────────────────────────────────────────
class _ArticleBody extends StatelessWidget {
  const _ArticleBody({
    required this.article,
    required this.locale,
    required this.commentController,
    required this.onBack,
    required this.onRelatedTap,
  });

  final ArticleDetail article;
  final String locale;
  final TextEditingController commentController;
  final VoidCallback onBack;
  final ValueChanged<Article> onRelatedTap;

  @override
  Widget build(BuildContext context) {
    return CustomScrollView(
      slivers: [
        // Hero header
        SliverToBoxAdapter(
          child: _HeroHeader(article: article, onBack: onBack),
        ),

        // Title + byline
        SliverToBoxAdapter(
          child: Padding(
            padding: EdgeInsetsDirectional.fromSTEB(16.w, 20.h, 16.w, 0),
            child: Column(
              crossAxisAlignment: CrossAxisAlignment.start,
              children: [
                Text(
                  article.title,
                  style: GoogleFonts.cairo(
                    fontSize: 22.sp,
                    fontWeight: FontWeight.w800,
                    color: AppColors.textPrimary,
                    height: 1.4,
                  ),
                ),
                SizedBox(height: 12.h),
                _Byline(article: article, locale: locale),
              ],
            ),
          ),
        ),

        // Video badge
        if (article.hasVideo)
          SliverToBoxAdapter(
            child: Padding(
              padding: EdgeInsetsDirectional.fromSTEB(16.w, 14.h, 16.w, 0),
              child: _VideoBadge(locale: locale),
            ),
          ),

        // Body paragraphs
        SliverToBoxAdapter(
          child: Padding(
            padding: EdgeInsetsDirectional.fromSTEB(16.w, 18.h, 16.w, 0),
            child: _BodyContent(
              paragraphs: article.bodyParagraphs,
              pullQuote: article.pullQuote,
            ),
          ),
        ),

        // Comment section
        SliverToBoxAdapter(
          child: Padding(
            padding: EdgeInsetsDirectional.fromSTEB(16.w, 28.h, 16.w, 0),
            child: _CommentSection(
              locale: locale,
              controller: commentController,
            ),
          ),
        ),

        // Related articles
        if (article.relatedArticles.isNotEmpty) ...[
          SliverToBoxAdapter(
            child: Padding(
              padding: EdgeInsetsDirectional.fromSTEB(16.w, 28.h, 16.w, 0),
              child: SectionHeaderWidget(
                title: locale == 'ar' ? 'مقالات ذات صلة' : 'Related Articles',
              ),
            ),
          ),
          SliverToBoxAdapter(
            child: SingleChildScrollView(
              scrollDirection: Axis.horizontal,
              padding: EdgeInsetsDirectional.fromSTEB(16.w, 12.h, 16.w, 24.h),
              child: Row(
                crossAxisAlignment: CrossAxisAlignment.start,
                children: article.relatedArticles
                    .map(
                      (a) => Padding(
                        padding: EdgeInsetsDirectional.only(end: 12.w),
                        child: _RelatedCard(
                          article: a,
                          locale: locale,
                          onTap: () => onRelatedTap(a),
                        ),
                      ),
                    )
                    .toList(),
              ),
            ),
          ),
        ] else
          SliverToBoxAdapter(child: SizedBox(height: 24.h)),
      ],
    );
  }
}

// ── Hero header (230h gradient with floating back) ─────────────────────────
class _HeroHeader extends StatelessWidget {
  const _HeroHeader({required this.article, required this.onBack});
  final ArticleDetail article;
  final VoidCallback onBack;

  @override
  Widget build(BuildContext context) {
    return SizedBox(
      height: 230.h,
      child: Stack(
        fit: StackFit.expand,
        children: [
          // Gradient background
          DecoratedBox(
            decoration: BoxDecoration(
              gradient: LinearGradient(
                begin: Alignment.topCenter,
                end: Alignment.bottomCenter,
                colors: [
                  article.coverColors.first,
                  article.coverColors.last,
                ],
              ),
            ),
          ),
          // Bottom fade overlay
          Positioned(
            left: 0,
            right: 0,
            bottom: 0,
            height: 100.h,
            child: DecoratedBox(
              decoration: BoxDecoration(
                gradient: LinearGradient(
                  begin: Alignment.bottomCenter,
                  end: Alignment.topCenter,
                  colors: [
                    AppColors.background,
                    AppColors.background.withValues(alpha: 0),
                  ],
                ),
              ),
            ),
          ),
          // Channel badge
          PositionedDirectional(
            bottom: 16.h,
            start: 16.w,
            child: Container(
              padding: EdgeInsetsDirectional.fromSTEB(10.w, 4.h, 10.w, 4.h),
              decoration: BoxDecoration(
                color: AppColors.primary,
                borderRadius: BorderRadius.circular(999),
              ),
              child: Text(
                article.categoryLabel,
                style: GoogleFonts.inter(
                  fontSize: 11.sp,
                  fontWeight: FontWeight.w700,
                  color: Colors.white,
                ),
              ),
            ),
          ),
          // Video icon
          if (article.hasVideo)
            PositionedDirectional(
              bottom: 16.h,
              end: 16.w,
              child: Container(
                padding: EdgeInsets.all(8.r),
                decoration: BoxDecoration(
                  color: Colors.black45,
                  borderRadius: BorderRadius.circular(999),
                ),
                child: Icon(
                  Icons.play_circle_outline_rounded,
                  color: Colors.white,
                  size: 22.r,
                ),
              ),
            ),
          // Floating back button (SafeArea-aware)
          PositionedDirectional(
            top: MediaQuery.of(context).padding.top + 10.h,
            start: 16.w,
            child: GestureDetector(
              onTap: onBack,
              child: Container(
                width: 38.r,
                height: 38.r,
                decoration: BoxDecoration(
                  color: Colors.black38,
                  borderRadius: BorderRadius.circular(999),
                ),
                child: Icon(
                  Icons.arrow_back_ios_new_rounded,
                  color: Colors.white,
                  size: 18.r,
                ),
              ),
            ),
          ),
        ],
      ),
    );
  }
}

// ── Author byline ─────────────────────────────────────────────────────────
class _Byline extends StatelessWidget {
  const _Byline({required this.article, required this.locale});
  final ArticleDetail article;
  final String locale;

  @override
  Widget build(BuildContext context) {
    final initials = article.authorName.isNotEmpty
        ? article.authorName.trim().split(' ').map((w) => w.isNotEmpty ? w[0] : '').join().substring(0, 1)
        : '?';

    return Row(
      children: [
        Container(
          width: 34.r,
          height: 34.r,
          decoration: BoxDecoration(
            color: AppColors.primary,
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
        Expanded(
          child: Column(
            crossAxisAlignment: CrossAxisAlignment.start,
            children: [
              Text(
                article.authorName,
                style: GoogleFonts.tajawal(
                  fontSize: 13.sp,
                  fontWeight: FontWeight.w700,
                  color: AppColors.textPrimary,
                ),
              ),
              Row(
                children: [
                  Text(
                    article.date,
                    style: GoogleFonts.inter(
                      fontSize: 11.sp,
                      color: AppColors.textHint,
                    ),
                  ),
                  SizedBox(width: 6.w),
                  Container(
                    width: 3.r,
                    height: 3.r,
                    decoration: const BoxDecoration(
                      color: AppColors.textHint,
                      shape: BoxShape.circle,
                    ),
                  ),
                  SizedBox(width: 6.w),
                  Text(
                    '${article.readMinutes} ${locale == 'ar' ? 'دقائق' : 'min'}',
                    style: GoogleFonts.inter(
                      fontSize: 11.sp,
                      color: AppColors.textHint,
                    ),
                  ),
                ],
              ),
            ],
          ),
        ),
      ],
    );
  }
}

// ── Video badge ───────────────────────────────────────────────────────────
class _VideoBadge extends StatelessWidget {
  const _VideoBadge({required this.locale});
  final String locale;

  @override
  Widget build(BuildContext context) {
    return Container(
      padding: EdgeInsetsDirectional.fromSTEB(12.w, 10.h, 12.w, 10.h),
      decoration: BoxDecoration(
        color: AppColors.secondary,
        borderRadius: BorderRadius.circular(12.r),
      ),
      child: Row(
        mainAxisSize: MainAxisSize.min,
        children: [
          Icon(Icons.play_circle_outline_rounded,
              color: Colors.white, size: 20.r),
          SizedBox(width: 8.w),
          Text(
            locale == 'ar' ? 'يتضمن هذا المقال مقطع فيديو' : 'This article includes a video',
            style: GoogleFonts.tajawal(
              fontSize: 13.sp,
              color: Colors.white,
            ),
          ),
        ],
      ),
    );
  }
}

// ── Body paragraphs + pull quote ──────────────────────────────────────────
class _BodyContent extends StatelessWidget {
  const _BodyContent({required this.paragraphs, this.pullQuote});
  final List<String> paragraphs;
  final String? pullQuote;

  @override
  Widget build(BuildContext context) {
    final List<Widget> children = [];

    for (int i = 0; i < paragraphs.length; i++) {
      children.add(
        Text(
          paragraphs[i],
          style: GoogleFonts.tajawal(
            fontSize: 15.sp,
            color: AppColors.textPrimary,
            height: 1.7,
          ),
        ),
      );

      // Insert pull quote after the second paragraph
      if (i == 1 && pullQuote != null) {
        children.add(SizedBox(height: 18.h));
        children.add(_PullQuote(text: pullQuote!));
        children.add(SizedBox(height: 18.h));
      } else if (i < paragraphs.length - 1) {
        children.add(SizedBox(height: 16.h));
      }
    }

    return Column(
      crossAxisAlignment: CrossAxisAlignment.start,
      children: children,
    );
  }
}

class _PullQuote extends StatelessWidget {
  const _PullQuote({required this.text});
  final String text;

  @override
  Widget build(BuildContext context) {
    return Container(
      padding: EdgeInsetsDirectional.fromSTEB(16.w, 14.h, 16.w, 14.h),
      decoration: BoxDecoration(
        color: AppColors.brandRedSoft,
        borderRadius: BorderRadius.circular(12.r),
        border: BorderDirectional(
          start: BorderSide(color: AppColors.primary, width: 4.w),
        ),
      ),
      child: Text(
        text,
        style: GoogleFonts.cairo(
          fontSize: 16.sp,
          fontWeight: FontWeight.w700,
          color: AppColors.primary,
          height: 1.6,
        ),
      ),
    );
  }
}

// ── Comment section ───────────────────────────────────────────────────────
class _CommentSection extends StatelessWidget {
  const _CommentSection({required this.locale, required this.controller});
  final String locale;
  final TextEditingController controller;

  @override
  Widget build(BuildContext context) {
    final ar = locale == 'ar';
    return Column(
      crossAxisAlignment: CrossAxisAlignment.start,
      children: [
        Text(
          ar ? 'التعليقات' : 'Comments',
          style: GoogleFonts.cairo(
            fontSize: 17.sp,
            fontWeight: FontWeight.w800,
            color: AppColors.textPrimary,
          ),
        ),
        SizedBox(height: 10.h),
        Row(
          children: [
            Expanded(
              child: TextField(
                controller: controller,
                decoration: InputDecoration(
                  hintText: ar ? 'أضف تعليقك...' : 'Add a comment...',
                  hintStyle: GoogleFonts.tajawal(
                    fontSize: 13.sp,
                    color: AppColors.textHint,
                  ),
                  filled: true,
                  fillColor: AppColors.inputFill,
                  contentPadding: EdgeInsetsDirectional.fromSTEB(
                      14.w, 10.h, 14.w, 10.h),
                  border: OutlineInputBorder(
                    borderRadius: BorderRadius.circular(12.r),
                    borderSide: BorderSide.none,
                  ),
                ),
              ),
            ),
            SizedBox(width: 8.w),
            GestureDetector(
              onTap: () {},
              child: Container(
                width: 44.r,
                height: 44.r,
                decoration: BoxDecoration(
                  color: AppColors.primary,
                  borderRadius: BorderRadius.circular(12.r),
                ),
                child: Icon(
                  Icons.send_rounded,
                  color: Colors.white,
                  size: 20.r,
                ),
              ),
            ),
          ],
        ),
        SizedBox(height: 16.h),
        // Placeholder comment thread
        _MockComment(
          initials: 'م',
          name: ar ? 'محمد العتيبي' : 'Mohammed',
          text: ar
              ? 'مقال رائع، استفدت كثيرًا من المحتوى المقدّم.'
              : 'Great article, very informative!',
          time: ar ? 'منذ 3 ساعات' : '3h ago',
        ),
        SizedBox(height: 10.h),
        _MockComment(
          initials: 'س',
          name: ar ? 'سارة الخالد' : 'Sara',
          text: ar
              ? 'شكرًا على هذا المحتوى القيّم، أتطلع للمزيد.'
              : 'Thanks for the valuable content, looking forward to more.',
          time: ar ? 'منذ 5 ساعات' : '5h ago',
        ),
      ],
    );
  }
}

class _MockComment extends StatelessWidget {
  const _MockComment({
    required this.initials,
    required this.name,
    required this.text,
    required this.time,
  });
  final String initials;
  final String name;
  final String text;
  final String time;

  @override
  Widget build(BuildContext context) {
    return Row(
      crossAxisAlignment: CrossAxisAlignment.start,
      children: [
        Container(
          width: 32.r,
          height: 32.r,
          decoration: const BoxDecoration(
            color: AppColors.secondary,
            shape: BoxShape.circle,
          ),
          child: Center(
            child: Text(
              initials,
              style: GoogleFonts.cairo(
                fontSize: 13.sp,
                fontWeight: FontWeight.w700,
                color: Colors.white,
              ),
            ),
          ),
        ),
        SizedBox(width: 10.w),
        Expanded(
          child: Container(
            padding: EdgeInsetsDirectional.fromSTEB(12.w, 10.h, 12.w, 10.h),
            decoration: BoxDecoration(
              color: AppColors.surface,
              borderRadius: BorderRadius.circular(12.r),
              border: Border.all(color: AppColors.divider),
            ),
            child: Column(
              crossAxisAlignment: CrossAxisAlignment.start,
              children: [
                Row(
                  children: [
                    Text(
                      name,
                      style: GoogleFonts.tajawal(
                        fontSize: 12.sp,
                        fontWeight: FontWeight.w700,
                        color: AppColors.textPrimary,
                      ),
                    ),
                    const Spacer(),
                    Text(
                      time,
                      style: GoogleFonts.inter(
                        fontSize: 10.sp,
                        color: AppColors.textHint,
                      ),
                    ),
                  ],
                ),
                SizedBox(height: 4.h),
                Text(
                  text,
                  style: GoogleFonts.tajawal(
                    fontSize: 12.sp,
                    color: AppColors.textSecondary,
                    height: 1.5,
                  ),
                ),
              ],
            ),
          ),
        ),
      ],
    );
  }
}

// ── Related article card ──────────────────────────────────────────────────
class _RelatedCard extends StatelessWidget {
  const _RelatedCard({
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
      child: SizedBox(
        width: 200.w,
        child: Container(
          decoration: BoxDecoration(
            color: AppColors.surface,
            borderRadius: BorderRadius.circular(16.r),
            border: Border.all(color: AppColors.divider),
          ),
          child: Column(
            crossAxisAlignment: CrossAxisAlignment.start,
            children: [
              // Thumbnail
              ClipRRect(
                borderRadius:
                    BorderRadius.vertical(top: Radius.circular(16.r)),
                child: Container(
                  height: 100.h,
                  decoration: BoxDecoration(
                    gradient: LinearGradient(
                      colors: article.coverColors,
                      begin: Alignment.topLeft,
                      end: Alignment.bottomRight,
                    ),
                  ),
                  child: article.hasVideo
                      ? Center(
                          child: Icon(
                            Icons.play_circle_outline_rounded,
                            color: Colors.white54,
                            size: 32.r,
                          ),
                        )
                      : null,
                ),
              ),
              Padding(
                padding: EdgeInsetsDirectional.fromSTEB(10.w, 8.h, 10.w, 10.h),
                child: Column(
                  crossAxisAlignment: CrossAxisAlignment.start,
                  children: [
                    Text(
                      article.title,
                      maxLines: 2,
                      overflow: TextOverflow.ellipsis,
                      style: GoogleFonts.cairo(
                        fontSize: 12.sp,
                        fontWeight: FontWeight.w700,
                        color: AppColors.textPrimary,
                        height: 1.4,
                      ),
                    ),
                    SizedBox(height: 4.h),
                    Text(
                      '${article.readMinutes} ${locale == 'ar' ? 'دقائق' : 'min'}',
                      style: GoogleFonts.inter(
                        fontSize: 10.sp,
                        color: AppColors.textHint,
                      ),
                    ),
                  ],
                ),
              ),
            ],
          ),
        ),
      ),
    );
  }
}
