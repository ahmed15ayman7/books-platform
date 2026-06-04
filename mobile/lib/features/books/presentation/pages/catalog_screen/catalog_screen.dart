import 'package:easy_localization/easy_localization.dart';
import 'package:flutter/material.dart';
import 'package:flutter_bloc/flutter_bloc.dart';
import 'package:flutter_screenutil/flutter_screenutil.dart';

import '../../../../../core/enums/translation_status.dart';
import '../../../../../core/router/app_routes.dart';
import '../../../domain/entities/sort_order.dart';
import '../../../../../core/router/args/book_detail_args.dart';
import '../../../../../core/theme/app_colors.dart';
import '../../../../../core/widgets/app_bar_widget.dart';
import '../../../../../core/widgets/bottom_nav_widget.dart';
import '../../../../../core/widgets/error_state_widget.dart';
import '../../cubit/catalog_cubit/catalog_cubit.dart';
import '../../cubit/catalog_cubit/catalog_state.dart';
import '../../widgets/book_card_shimmer.dart';
import '../../widgets/book_card_widget.dart';
import 'catalog_filter_row.dart';
import 'catalog_shimmer.dart';

class CatalogScreen extends StatefulWidget {
  const CatalogScreen({super.key});

  @override
  State<CatalogScreen> createState() => _CatalogScreenState();
}

class _CatalogScreenState extends State<CatalogScreen> {
  TranslationStatus? _status;
  bool _newest = true;
  late final ScrollController _scrollController;

  @override
  void initState() {
    super.initState();
    context.read<CatalogCubit>().load();
    _scrollController = ScrollController()..addListener(_onScroll);
  }

  @override
  void dispose() {
    _scrollController.dispose();
    super.dispose();
  }

  void _onScroll() {
    if (_scrollController.position.pixels >=
        _scrollController.position.maxScrollExtent - 300) {
      context.read<CatalogCubit>().loadMore();
    }
  }

  // $mobile-debug-skill | Problem: single _applyFilter never forwarded sort to the cubit (sort param omitted), so "Oldest" toggled the UI chip but the API always received sort=newest. Fix: split into two focused methods — each passes exactly what it owns to applyFilter.
  void _onStatusChanged(TranslationStatus? status) {
    setState(() {
      _status = (status != null && status == _status) ? null : status;
    });
    context.read<CatalogCubit>().applyFilter(status: _status);
  }

  void _onSortChanged(bool newest) {
    setState(() => _newest = newest);
    context.read<CatalogCubit>().applyFilter(
      status: _status,
      sort: newest ? SortOrder.newest : SortOrder.oldest,
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
            variant: AppBarVariant.title,
            title: 'books.title'.tr(),
            subtitle: '4,654 ${'books.books_unit'.tr()}',
            currentLocale: locale,
            onSearch: () =>
                Navigator.of(context).pushNamed(AppRoutes.search),
            onCart: () => Navigator.of(context).pushNamed(AppRoutes.cart),
            onLocaleChanged: (l) => context.setLocale(Locale(l)),
            trailing: GestureDetector(
              child: Container(
                width: 38.r,
                height: 38.r,
                decoration: BoxDecoration(
                  color: AppColors.surface,
                  border: Border.all(color: AppColors.divider),
                  borderRadius: BorderRadius.circular(999),
                ),
                child: Icon(
                  Icons.tune_rounded,
                  size: 20.r,
                  color: AppColors.textPrimary,
                ),
              ),
            ),
          ),
          CatalogFilterRow(
            locale: locale,
            activeStatus: _status,
            newest: _newest,
            onStatusTap: _onStatusChanged,
            onSortTap: _onSortChanged,
          ),
          Expanded(
            child: BlocBuilder<CatalogCubit, CatalogState>(
              builder: (ctx, state) {
                return AnimatedSwitcher(
                  duration: const Duration(milliseconds: 300),
                  child: switch (state) {
                    CatalogLoading() =>
                      const CatalogShimmer(key: ValueKey('loading')),
                    CatalogError(:final message) => Center(
                        key: const ValueKey('error'),
                        child: ErrorStateWidget(
                          message: message,
                          onRetry: () => ctx.read<CatalogCubit>().load(),
                        ),
                      ),
                    CatalogSuccess(:final books, :final hasMore) =>
                      RefreshIndicator(
                        key: const ValueKey('success'),
                        onRefresh: () => ctx.read<CatalogCubit>().refresh(),
                        color: AppColors.primary,
                        child: GridView.builder(
                          controller: _scrollController,
                          padding: EdgeInsetsDirectional.all(16.r),
                          physics: const AlwaysScrollableScrollPhysics(),
                          gridDelegate:
                              SliverGridDelegateWithFixedCrossAxisCount(
                            crossAxisCount: 2,
                            crossAxisSpacing: 12.w,
                            mainAxisSpacing: 14.h,
                            childAspectRatio: 0.47,
                          ),
                          itemCount: books.length + (hasMore ? 2 : 0),
                          itemBuilder: (_, i) {
                            if (i >= books.length) {
                              return const BookCardShimmer();
                            }
                            return BookCardWidget(
                              book: books[i],
                              locale: locale,
                              onTap: () => Navigator.of(ctx).pushNamed(
                                AppRoutes.bookDetail,
                                arguments: BookDetailArgs(
                                  slug: books[i].slug,
                                  titleAr: books[i].titleAr,
                                ),
                              ),
                            );
                          },
                        ),
                      ),
                    _ => const SizedBox.shrink(key: ValueKey('initial')),
                  },
                );
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
        break;
      case BottomNavTab.articles:
        Navigator.of(context).pushReplacementNamed(AppRoutes.articles);
      case BottomNavTab.publishers:
        Navigator.of(context).pushReplacementNamed(AppRoutes.publishers);
    }
  }
}
