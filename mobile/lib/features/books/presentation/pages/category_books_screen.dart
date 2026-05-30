import 'package:easy_localization/easy_localization.dart';
import 'package:flutter/material.dart';
import 'package:flutter_bloc/flutter_bloc.dart';
import 'package:flutter_screenutil/flutter_screenutil.dart';

import '../../../../core/router/app_routes.dart';
import '../../../../core/router/args/book_detail_args.dart';
import '../../../../core/router/args/category_books_args.dart';
import '../../../../core/theme/app_colors.dart';
import '../../../../core/widgets/app_bar_widget.dart';
import '../../../../core/widgets/app_loading_indicator.dart';
import '../../../../core/widgets/bottom_nav_widget.dart';
import '../../../../core/widgets/empty_state_widget.dart';
import '../../../../core/widgets/error_state_widget.dart';
import '../cubit/catalog_cubit/catalog_cubit.dart';
import '../cubit/catalog_cubit/catalog_state.dart';
import '../widgets/book_card_widget.dart';

class CategoryBooksScreen extends StatefulWidget {
  const CategoryBooksScreen({super.key, required this.args});
  final CategoryBooksArgs args;

  @override
  State<CategoryBooksScreen> createState() => _CategoryBooksScreenState();
}

class _CategoryBooksScreenState extends State<CategoryBooksScreen> {
  @override
  void initState() {
    super.initState();
    context.read<CatalogCubit>().applyFilter(categorySlug: widget.args.slug);
  }

  @override
  Widget build(BuildContext context) {
    final locale = context.locale.languageCode;
    final ar = locale == 'ar';
    final title = ar ? widget.args.nameAr : widget.args.nameEn;

    return Scaffold(
      backgroundColor: AppColors.background,
      body: Column(
        children: [
          AppBarWidget(
            variant: AppBarVariant.title,
            title: title,
            showBack: true,
            currentLocale: locale,
            onLocaleChanged: (l) => context.setLocale(Locale(l)),
            onCart: () => Navigator.of(context).pushNamed(AppRoutes.cart),
          ),
          Expanded(
            child: BlocBuilder<CatalogCubit, CatalogState>(
              builder: (ctx, state) => switch (state) {
                CatalogLoading() =>
                  const Center(child: AppLoadingIndicator()),
                CatalogError(:final message) => Center(
                    child: ErrorStateWidget(
                      message: message,
                      onRetry: () => ctx
                          .read<CatalogCubit>()
                          .applyFilter(categorySlug: widget.args.slug),
                    ),
                  ),
                CatalogSuccess(:final books) when books.isEmpty =>
                  EmptyStateWidget(
                    icon: Icons.menu_book_outlined,
                    title: ar ? 'لا توجد كتب' : 'No books',
                    subtitle: ar
                        ? 'لا توجد كتب في هذه الفئة بعد'
                        : 'No books in this category yet',
                  ),
                CatalogSuccess(:final books) => GridView.builder(
                    padding: EdgeInsetsDirectional.all(16.r),
                    gridDelegate: SliverGridDelegateWithFixedCrossAxisCount(
                      crossAxisCount: 2,
                      crossAxisSpacing: 12.w,
                      mainAxisSpacing: 14.h,
                      childAspectRatio: 0.52,
                    ),
                    itemCount: books.length,
                    itemBuilder: (_, i) => BookCardWidget(
                      book: books[i],
                      locale: locale,
                      onTap: () => Navigator.of(ctx).pushNamed(
                        AppRoutes.bookDetail,
                        arguments: BookDetailArgs(
                          slug: books[i].id,
                          titleAr: books[i].titleAr,
                        ),
                      ),
                    ),
                  ),
                _ => const SizedBox.shrink(),
              },
            ),
          ),
          BottomNavWidget(
            activeTab: BottomNavTab.books,
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
      case BottomNavTab.publishers:
        Navigator.of(context).pushReplacementNamed(AppRoutes.publishers);
    }
  }
}
