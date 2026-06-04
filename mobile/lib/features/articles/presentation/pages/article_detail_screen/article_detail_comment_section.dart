import 'package:easy_localization/easy_localization.dart';
import 'package:flutter/material.dart';
import 'package:flutter_bloc/flutter_bloc.dart';
import 'package:flutter_screenutil/flutter_screenutil.dart';
import 'package:google_fonts/google_fonts.dart';

import '../../../../../core/theme/app_colors.dart';
import '../../../../../core/widgets/app_loading_indicator.dart';
import '../../../../../core/widgets/empty_state_widget.dart';
import '../../../../ratings/presentation/cubit/comments_cubit.dart';
import '../../../../ratings/presentation/cubit/comments_state.dart';
import '../../../../ratings/presentation/widgets/comment_card.dart';
import '../../../../ratings/presentation/widgets/comment_form.dart';

class ArticleDetailCommentSection extends StatelessWidget {
  const ArticleDetailCommentSection({
    super.key,
    required this.articleId,
  });

  final String articleId;

  @override
  Widget build(BuildContext context) {
    return Column(
      crossAxisAlignment: CrossAxisAlignment.start,
      children: [
        Text(
          'article_detail.comments'.tr(),
          style: GoogleFonts.cairo(
            fontSize: 17.sp,
            fontWeight: FontWeight.w800,
            color: AppColors.textPrimary,
          ),
        ),
        SizedBox(height: 14.h),
        CommentForm(articleId: articleId),
        SizedBox(height: 20.h),
        BlocBuilder<CommentsCubit, CommentsState>(
          builder: (context, state) => switch (state) {
            CommentsLoading() => const Center(child: AppLoadingIndicator()),
            CommentsLoadingMore(:final current) => Column(
                children: [
                  ...current.comments.map((c) => CommentCard(comment: c)),
                  const Center(child: AppLoadingIndicator()),
                ],
              ),
            CommentsLoaded(:final comments) when comments.isEmpty =>
              EmptyStateWidget(
                icon: Icons.chat_bubble_outline_rounded,
                title: 'article_detail.no_comments'.tr(),
              ),
            CommentsLoaded(:final comments) => Column(
                children: comments.map((c) => CommentCard(comment: c)).toList(),
              ),
            CommentsError(:final message) => Text(
                message,
                style: GoogleFonts.tajawal(
                  fontSize: 13.sp,
                  color: AppColors.error,
                ),
              ),
            _ => const SizedBox.shrink(),
          },
        ),
      ],
    );
  }
}
