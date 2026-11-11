import 'package:easy_localization/easy_localization.dart';
import 'package:flutter/material.dart';
import 'package:flutter_bloc/flutter_bloc.dart';

import '../../../../../core/router/app_routes.dart';
import '../../../../../core/router/args/article_detail_args.dart';
import '../../../../../core/theme/app_colors.dart';
import '../../../../../core/widgets/app_loading_indicator.dart';
import '../../../../../core/widgets/error_state_widget.dart';
import '../../cubit/article_detail_cubit/article_detail_cubit.dart';
import '../../cubit/article_detail_cubit/article_detail_state.dart';
import 'article_detail_body.dart';
import '../../../../ratings/presentation/cubit/comments_cubit.dart';

class ArticleDetailScreen extends StatefulWidget {
  const ArticleDetailScreen({super.key, required this.args});
  final ArticleDetailArgs args;

  @override
  State<ArticleDetailScreen> createState() => _ArticleDetailScreenState();
}

class _ArticleDetailScreenState extends State<ArticleDetailScreen> {
  @override
  void initState() {
    super.initState();
    context.read<ArticleDetailCubit>().load(widget.args.id);
    // $mobile-debug-skill | Problem: CommentsCubit was provided in router but never loaded, so comment section was always empty. Fix: load comments with the article's ID on screen init.
    context.read<CommentsCubit>().load(articleId: widget.args.id);
  }

  @override
  Widget build(BuildContext context) {
    final locale = context.locale.languageCode;
    return Scaffold(
      backgroundColor: AppColors.background,
      body: BlocBuilder<ArticleDetailCubit, ArticleDetailState>(
        builder: (ctx, state) {
          return AnimatedSwitcher(
            duration: const Duration(milliseconds: 300),
            child: switch (state) {
              ArticleDetailLoading() ||
              ArticleDetailInitial() =>
                const Center(
                  key: ValueKey('loading'),
                  child: AppLoadingIndicator(),
                ),
              ArticleDetailError(:final message) => Center(
                  key: const ValueKey('error'),
                  child: ErrorStateWidget(
                    message: message,
                    onRetry: () =>
                        ctx.read<ArticleDetailCubit>().load(widget.args.id),
                  ),
                ),
              ArticleDetailSuccess(:final article) => ArticleDetailBody(
                  key: const ValueKey('success'),
                  article: article,
                  locale: locale,
                  onBack: () => Navigator.of(ctx).pop(),
                  onRelatedTap: (a) => Navigator.of(ctx).pushReplacementNamed(
                    AppRoutes.articleDetail,
                    arguments: ArticleDetailArgs(id: a.id, title: a.title),
                  ),
                ),
            },
          );
        },
      ),
    );
  }
}
