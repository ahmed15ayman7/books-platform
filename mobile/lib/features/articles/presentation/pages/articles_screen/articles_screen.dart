import 'package:easy_localization/easy_localization.dart';
import 'package:flutter/material.dart';
import 'package:flutter_bloc/flutter_bloc.dart';

import '../../../../../core/router/app_routes.dart';
import '../../../../../core/router/args/article_detail_args.dart';
import '../../../../../core/theme/app_colors.dart';
import '../../../../../core/widgets/app_bar_widget.dart';
import '../../../../../core/widgets/bottom_nav_widget.dart';
import '../../../../../core/widgets/error_state_widget.dart';
import '../../cubit/articles_list_cubit/articles_list_cubit.dart';
import '../../cubit/articles_list_cubit/articles_list_state.dart';
import 'articles_body.dart';
import 'articles_shimmer.dart';

class ArticlesScreen extends StatefulWidget {
  const ArticlesScreen({super.key});

  @override
  State<ArticlesScreen> createState() => _ArticlesScreenState();
}

class _ArticlesScreenState extends State<ArticlesScreen> {
  late final ScrollController _scrollController = ScrollController();

  @override
  void initState() {
    super.initState();
    context.read<ArticlesListCubit>().load();
    _scrollController.addListener(_onScroll);
  }

  @override
  void dispose() {
    _scrollController.dispose();
    super.dispose();
  }

  void _onScroll() {
    if (!_scrollController.hasClients) return;
    final position = _scrollController.position;
    if (position.pixels >= position.maxScrollExtent - 300) {
      context.read<ArticlesListCubit>().loadMore();
    }
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
                      const ArticlesShimmer(key: ValueKey('loading')),
                    ArticlesListError(:final message) => Center(
                        key: const ValueKey('error'),
                        child: ErrorStateWidget(
                          message: message,
                          onRetry: () =>
                              ctx.read<ArticlesListCubit>().load(),
                        ),
                      ),
                    ArticlesListSuccess(
                      :final articles,
                      :final activeSlug,
                      :final hasNextPage,
                    ) =>
                      ArticlesBody(
                        key: const ValueKey('success'),
                        categories: ArticlesListCubit.channels,
                        articles: articles,
                        activeSlug: activeSlug,
                        hasNextPage: hasNextPage,
                        locale: locale,
                        scrollController: _scrollController,
                        onCategoryTap: (slug) =>
                            ctx.read<ArticlesListCubit>().switchCategory(slug),
                        onArticleTap: (a) => Navigator.of(ctx).pushNamed(
                          AppRoutes.articleDetail,
                          arguments:
                              ArticleDetailArgs(id: a.slug, title: a.title),
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
      case BottomNavTab.media:
        Navigator.of(context).pushReplacementNamed(AppRoutes.media);
      case BottomNavTab.publishers:
        Navigator.of(context).pushReplacementNamed(AppRoutes.publishers);
      case BottomNavTab.wishlist:
        Navigator.of(context).pushReplacementNamed(AppRoutes.wishlist);
    }
  }
}
