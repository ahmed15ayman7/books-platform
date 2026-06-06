import 'package:easy_localization/easy_localization.dart';
import 'package:flutter/material.dart';
import 'package:flutter_bloc/flutter_bloc.dart';

import 'package:booksplatform/core/router/app_routes.dart';
import 'package:booksplatform/core/router/args/article_detail_args.dart';
import 'package:booksplatform/core/theme/app_colors.dart';
import 'package:booksplatform/core/widgets/app_bar_widget.dart';
import 'package:booksplatform/core/widgets/bottom_nav_widget.dart';
import 'package:booksplatform/core/widgets/error_state_widget.dart';

import '../../cubit/media_list_cubit/media_list_cubit.dart';
import '../../cubit/media_list_cubit/media_list_state.dart';
import 'media_body.dart';
import 'media_shimmer.dart';

class MediaScreen extends StatefulWidget {
  const MediaScreen({super.key});

  @override
  State<MediaScreen> createState() => _MediaScreenState();
}

class _MediaScreenState extends State<MediaScreen> {
  late final ScrollController _scrollController = ScrollController();

  @override
  void initState() {
    super.initState();
    context.read<MediaListCubit>().load();
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
      context.read<MediaListCubit>().loadMore();
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
            title: 'media.title'.tr(),
            currentLocale: locale,
            onCart: () => Navigator.of(context).pushNamed(AppRoutes.cart),
            onLocaleChanged: (l) => context.setLocale(Locale(l)),
          ),
          Expanded(
            child: BlocBuilder<MediaListCubit, MediaListState>(
              builder: (ctx, state) {
                return AnimatedSwitcher(
                  duration: const Duration(milliseconds: 300),
                  child: switch (state) {
                    MediaListLoading() =>
                      const MediaShimmer(key: ValueKey('loading')),
                    MediaListError(:final message) => Center(
                        key: const ValueKey('error'),
                        child: ErrorStateWidget(
                          message: message,
                          onRetry: () => ctx.read<MediaListCubit>().load(),
                        ),
                      ),
                    MediaListSuccess(
                      :final items,
                      :final activeSlug,
                      :final hasNextPage,
                    ) =>
                      MediaBody(
                        key: const ValueKey('success'),
                        items: items,
                        activeSlug: activeSlug,
                        hasNextPage: hasNextPage,
                        locale: locale,
                        scrollController: _scrollController,
                        onChannelTap: (slug) =>
                            ctx.read<MediaListCubit>().switchChannel(slug),
                        onItemTap: (item) => Navigator.of(ctx).pushNamed(
                          AppRoutes.articleDetail,
                          arguments: ArticleDetailArgs(
                            id: item.slug,
                            title: item.title,
                          ),
                        ),
                        onRefresh: () => ctx.read<MediaListCubit>().refresh(),
                      ),
                    _ => const SizedBox.shrink(key: ValueKey('initial')),
                  },
                );
              },
            ),
          ),
          BottomNavWidget(
            activeTab: BottomNavTab.media,
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
        Navigator.of(context).pushReplacementNamed(AppRoutes.articles);
      case BottomNavTab.media:
        break;
      case BottomNavTab.publishers:
        Navigator.of(context).pushReplacementNamed(AppRoutes.publishers);
      case BottomNavTab.wishlist:
        Navigator.of(context).pushReplacementNamed(AppRoutes.wishlist);
    }
  }
}
