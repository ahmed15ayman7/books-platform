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

  void _showCommentSheet(BuildContext context) {
    final cubit = context.read<CommentsCubit>();
    showModalBottomSheet<void>(
      context: context,
      isScrollControlled: true,
      useSafeArea: true,
      backgroundColor: AppColors.surface,
      shape: RoundedRectangleBorder(
        borderRadius: BorderRadius.vertical(top: Radius.circular(20.r)),
      ),
      builder: (sheetCtx) => BlocProvider.value(
        value: cubit,
        child: _CommentSheet(articleId: articleId),
      ),
    );
  }

  @override
  Widget build(BuildContext context) {
    return Column(
      crossAxisAlignment: CrossAxisAlignment.start,
      children: [
        Row(
          children: [
            Text(
              'article_detail.comments'.tr(),
              style: GoogleFonts.cairo(
                fontSize: 17.sp,
                fontWeight: FontWeight.w800,
                color: AppColors.textPrimary,
              ),
            ),
            const Spacer(),
            GestureDetector(
              onTap: () => _showCommentSheet(context),
              child: Container(
                padding: EdgeInsets.symmetric(horizontal: 14.w, vertical: 8.h),
                decoration: BoxDecoration(
                  color: AppColors.primary,
                  borderRadius: BorderRadius.circular(999),
                ),
                child: Row(
                  mainAxisSize: MainAxisSize.min,
                  children: [
                    Icon(Icons.add_comment_rounded,
                        color: Colors.white, size: 16.r),
                    SizedBox(width: 6.w),
                    Text(
                      'comments_leave_comment'.tr(),
                      style: GoogleFonts.cairo(
                        fontSize: 12.sp,
                        fontWeight: FontWeight.w700,
                        color: Colors.white,
                      ),
                    ),
                  ],
                ),
              ),
            ),
          ],
        ),
        SizedBox(height: 16.h),
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

class _CommentSheet extends StatelessWidget {
  const _CommentSheet({required this.articleId});

  final String articleId;

  @override
  Widget build(BuildContext context) {
    return Padding(
      padding: EdgeInsets.only(
        bottom: MediaQuery.of(context).viewInsets.bottom,
      ),
      child: SingleChildScrollView(
        padding: EdgeInsetsDirectional.fromSTEB(20.w, 0, 20.w, 24.h),
        child: Column(
          mainAxisSize: MainAxisSize.min,
          children: [
            SizedBox(height: 12.h),
            Center(
              child: Container(
                width: 36.w,
                height: 4.h,
                decoration: BoxDecoration(
                  color: AppColors.divider,
                  borderRadius: BorderRadius.circular(999),
                ),
              ),
            ),
            SizedBox(height: 20.h),
            CommentForm(
              articleId: articleId,
              onSubmitted: () => Navigator.of(context).pop(),
            ),
          ],
        ),
      ),
    );
  }
}
