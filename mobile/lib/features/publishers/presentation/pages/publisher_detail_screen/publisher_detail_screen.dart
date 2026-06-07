import 'package:easy_localization/easy_localization.dart';
import 'package:flutter/material.dart';
import 'package:flutter_bloc/flutter_bloc.dart';

import '../../../../../core/router/app_routes.dart';
import '../../../../../core/router/args/book_detail_args.dart';
import '../../../../../core/router/args/publisher_detail_args.dart';
import '../../../../../core/theme/app_colors.dart';
import '../../../../../core/widgets/app_bar_widget.dart';
import '../../../../../core/widgets/app_loading_indicator.dart';
import '../../../../../core/widgets/bottom_nav_widget.dart';
import '../../../../../core/widgets/error_state_widget.dart';
import '../../cubit/publisher_detail_cubit/publisher_detail_cubit.dart';
import '../../cubit/publisher_detail_cubit/publisher_detail_state.dart';
import 'publisher_detail_body.dart';

class PublisherDetailScreen extends StatefulWidget {
  const PublisherDetailScreen({super.key, required this.args});
  final PublisherDetailArgs args;

  @override
  State<PublisherDetailScreen> createState() => _PublisherDetailScreenState();
}

class _PublisherDetailScreenState extends State<PublisherDetailScreen> {
  @override
  void initState() {
    super.initState();
    context.read<PublisherDetailCubit>().load(widget.args.slug);
  }

  @override
  Widget build(BuildContext context) {
    final locale = context.locale.languageCode;
    return Scaffold(
      backgroundColor: AppColors.background,
      body: BlocBuilder<PublisherDetailCubit, PublisherDetailState>(
        builder: (ctx, state) {
          return AnimatedSwitcher(
            duration: const Duration(milliseconds: 300),
            child: switch (state) {
              PublisherDetailLoading() ||
              PublisherDetailInitial() =>
                const Center(key: ValueKey('loading'), child: AppLoadingIndicator()),
              PublisherDetailError(:final message) => Center(
                  key: const ValueKey('error'),
                  child: ErrorStateWidget(
                    message: message,
                    onRetry: () =>
                        ctx.read<PublisherDetailCubit>().load(widget.args.slug),
                  ),
                ),
              PublisherDetailSuccess(:final publisher, :final books) => Column(
                  key: const ValueKey('success'),
                  children: [
                AppBarWidget(
                  variant: AppBarVariant.title,
                  title: publisher.displayName(locale),
                  showBack: true,
                  currentLocale: locale,
                  onLocaleChanged: (l) => context.setLocale(Locale(l)),
                  onCart: () =>
                      Navigator.of(ctx).pushNamed(AppRoutes.cart),
                ),
                Expanded(
                  child: PublisherDetailBody(
                    publisher: publisher,
                    books: books,
                    locale: locale,
                    onBookTap: (book) => Navigator.of(ctx).pushNamed(
                      AppRoutes.bookDetail,
                      arguments: BookDetailArgs(slug: book.id, titleAr: book.titleAr),
                    ),
                  ),
                ),
                BottomNavWidget(
                  activeTab: BottomNavTab.publishers,
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
      case BottomNavTab.media:
        Navigator.of(context).pushReplacementNamed(AppRoutes.media);
      case BottomNavTab.publishers:
        Navigator.of(context).pushReplacementNamed(AppRoutes.publishers);
      case BottomNavTab.wishlist:
        Navigator.of(context).pushReplacementNamed(AppRoutes.wishlist);
    }
  }
}
