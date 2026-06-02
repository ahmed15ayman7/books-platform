import 'package:easy_localization/easy_localization.dart';
import 'package:flutter/material.dart';
import 'package:flutter_bloc/flutter_bloc.dart';

import '../../../../../core/router/app_routes.dart';
import '../../../../../core/router/args/article_detail_args.dart';
import '../../../../../core/theme/app_colors.dart';
import '../../../../../core/widgets/app_loading_indicator.dart';
import '../../../../../core/widgets/bottom_nav_widget.dart';
import '../../../../../core/widgets/error_state_widget.dart';
import '../../cubit/article_detail_cubit/article_detail_cubit.dart';
import '../../cubit/article_detail_cubit/article_detail_state.dart';
import 'article_detail_body.dart';

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
              ArticleDetailSuccess(:final article) => Column(
                  key: const ValueKey('success'),
                  children: [
                    Expanded(
                      child: ArticleDetailBody(
                        article: article,
                        locale: locale,
                        commentController: _commentController,
                        onBack: () => Navigator.of(ctx).pop(),
                        onRelatedTap: (a) =>
                            Navigator.of(ctx).pushReplacementNamed(
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
          );
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
