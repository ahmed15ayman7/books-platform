import 'package:easy_localization/easy_localization.dart';
import 'package:flutter/material.dart';
import 'package:flutter_screenutil/flutter_screenutil.dart';
import 'package:google_fonts/google_fonts.dart';

import '../../../../../core/theme/app_colors.dart';
import '../../../../../core/widgets/section_header_widget.dart';
import '../../../domain/entities/article.dart';
import '../../../domain/entities/article_detail.dart';
import 'article_detail_audio_player.dart';
import 'article_detail_body_content.dart';
import 'article_detail_byline.dart';
import 'article_detail_comment_section.dart';
import 'article_detail_hero_header.dart';
import 'article_detail_related_card.dart';
import 'article_detail_video_badge.dart';
import 'article_detail_video_player.dart';

class ArticleDetailBody extends StatelessWidget {
  const ArticleDetailBody({
    super.key,
    required this.article,
    required this.locale,

    required this.onBack,
    required this.onRelatedTap,
  });

  final ArticleDetail article;
  final String locale;
  final VoidCallback onBack;
  final ValueChanged<Article> onRelatedTap;

  @override
  Widget build(BuildContext context) {
    return CustomScrollView(
      slivers: [
        SliverToBoxAdapter(
          child: ArticleDetailHeroHeader(article: article, onBack: onBack),
        ),
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
                ArticleDetailByline(article: article, locale: locale),
              ],
            ),
          ),
        ),
        if (article.hasVideo)
          SliverToBoxAdapter(
            child: Padding(
              padding: EdgeInsetsDirectional.fromSTEB(16.w, 14.h, 16.w, 0),
              child: ArticleDetailVideoBadge(locale: locale),
            ),
          ),
        // YouTube player for watch-your-book and novel-story channels
        if ((article.channel == Article.kChannelWatchYourBook ||
                article.channel == Article.kChannelNovelStory) &&
            article.videoUrl != null)
          SliverToBoxAdapter(
            child: Padding(
              padding: EdgeInsetsDirectional.fromSTEB(0, 14.h, 0, 0),
              child: ArticleDetailVideoPlayer(
                videoUrl: article.videoUrl!,
                showAiDisclosure:
                    article.channel == Article.kChannelNovelStory,
              ),
            ),
          ),
        // Audio player for books-talk channel
        if (article.channel == Article.kChannelBooksTalk &&
            article.videoUrl != null)
          SliverToBoxAdapter(
            child: Padding(
              padding: EdgeInsetsDirectional.fromSTEB(16.w, 14.h, 16.w, 0),
              child: ArticleDetailAudioPlayer(audioUrl: article.videoUrl!),
            ),
          ),
        SliverToBoxAdapter(
          child: Padding(
            padding: EdgeInsetsDirectional.fromSTEB(16.w, 18.h, 16.w, 0),
            child: ArticleDetailBodyContent(
              paragraphs: article.bodyParagraphs,
              pullQuote: article.pullQuote,
            ),
          ),
        ),
        SliverToBoxAdapter(
          child: Padding(
            padding: EdgeInsetsDirectional.fromSTEB(16.w, 28.h, 16.w, 0),
            child: ArticleDetailCommentSection(articleId: article.id),
          ),
        ),
        if (article.relatedArticles.isNotEmpty) ...[
          SliverToBoxAdapter(
            child: Padding(
              padding: EdgeInsetsDirectional.fromSTEB(16.w, 28.h, 16.w, 0),
              child: SectionHeaderWidget(
                title: 'articles.related'.tr(),
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
                        child: ArticleDetailRelatedCard(
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
