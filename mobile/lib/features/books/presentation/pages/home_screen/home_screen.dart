import 'package:easy_localization/easy_localization.dart';
import 'package:flutter/material.dart';
import 'package:flutter_bloc/flutter_bloc.dart';

import '../../../../../core/router/app_routes.dart';
import '../../../../../core/router/args/book_detail_args.dart';
import '../../../../../core/router/args/category_books_args.dart';
import '../../../../../core/theme/app_colors.dart';
import '../../../../../core/widgets/app_bar_widget.dart';
import '../../../../../core/widgets/bottom_nav_widget.dart';
import '../../../../../core/widgets/error_state_widget.dart';
import '../../cubit/home_content_cubit/home_content_cubit.dart';
import '../../cubit/home_content_cubit/home_content_state.dart';
import 'home_body.dart';
import 'home_shimmer.dart';

class HomeScreen extends StatefulWidget {
  const HomeScreen({super.key});

  @override
  State<HomeScreen> createState() => _HomeScreenState();
}

class _HomeScreenState extends State<HomeScreen> {
  @override
  void initState() {
    super.initState();
    context.read<HomeContentCubit>().load();
  }

  void _openBook(BuildContext ctx, String id, String titleAr) {
    Navigator.of(ctx).pushNamed(
      AppRoutes.bookDetail,
      arguments: BookDetailArgs(slug: id, titleAr: titleAr),
    );
  }

  @override
  Widget build(BuildContext context) {
    final locale = context.locale.languageCode;
    return Scaffold(
      backgroundColor: AppColors.background,
      body: Column(
        children: [
          AppBarWidget(
            variant: AppBarVariant.home,
            currentLocale: locale,
            onSearch: () => Navigator.of(context).pushNamed(AppRoutes.search),
            onCart: () => Navigator.of(context).pushNamed(AppRoutes.cart),
            onLocaleChanged: (l) => context.setLocale(Locale(l)),
          ),
          Expanded(
            child: BlocBuilder<HomeContentCubit, HomeContentState>(
              builder: (ctx, state) {
                return AnimatedSwitcher(
                  duration: const Duration(milliseconds: 300),
                  child: switch (state) {
                    HomeContentLoading() => const HomeShimmer(
                        key: ValueKey('loading'),
                      ),
                    HomeContentError(:final message) => Center(
                        key: const ValueKey('error'),
                        child: ErrorStateWidget(
                          message: message,
                          onRetry: () => ctx.read<HomeContentCubit>().load(),
                        ),
                      ),
                    HomeContentSuccess() => HomeBody(
                        key: const ValueKey('success'),
                        state: state,
                        locale: locale,
                        onBookTap: (id, title) => _openBook(ctx, id, title),
                        onBrowse: () =>
                            Navigator.of(ctx).pushNamed(AppRoutes.books),
                        onPublisher: () =>
                            Navigator.of(ctx).pushNamed(AppRoutes.publishers),
                        onCategoryTap: (cat) => Navigator.of(ctx).pushNamed(
                          AppRoutes.categoryBooks,
                          arguments: CategoryBooksArgs(
                            slug: cat.slug,
                            nameAr: cat.nameAr,
                            nameEn: cat.nameEn,
                          ),
                        ),
                        onRefresh: () => ctx.read<HomeContentCubit>().refresh(),
                      ),
                    _ => const SizedBox.shrink(key: ValueKey('initial')),
                  },
                );
              },
            ),
          ),
          BottomNavWidget(
            activeTab: BottomNavTab.home,
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
        break;
      case BottomNavTab.books:
        Navigator.of(context).pushReplacementNamed(AppRoutes.books);
      case BottomNavTab.articles:
        Navigator.of(context).pushReplacementNamed(AppRoutes.articles);
      case BottomNavTab.publishers:
        Navigator.of(context).pushReplacementNamed(AppRoutes.publishers);
    }
  }
}
