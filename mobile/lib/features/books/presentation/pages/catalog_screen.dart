import 'package:easy_localization/easy_localization.dart';
import 'package:flutter/material.dart';
import 'package:flutter_bloc/flutter_bloc.dart';
import 'package:flutter_screenutil/flutter_screenutil.dart';
import 'package:google_fonts/google_fonts.dart';

import '../../../../core/enums/translation_status.dart';
import '../../../../core/router/app_routes.dart';
import '../../../../core/router/args/book_detail_args.dart';
import '../../../../core/theme/app_colors.dart';
import '../../../../core/widgets/app_bar_widget.dart';
import '../../../../core/widgets/bottom_nav_widget.dart';
import '../../../../core/widgets/error_state_widget.dart';
import '../cubit/catalog_cubit/catalog_cubit.dart';
import '../cubit/catalog_cubit/catalog_state.dart';
import '../widgets/book_card_shimmer.dart';
import '../widgets/book_card_widget.dart';

class CatalogScreen extends StatefulWidget {
  const CatalogScreen({super.key});

  @override
  State<CatalogScreen> createState() => _CatalogScreenState();
}

class _CatalogScreenState extends State<CatalogScreen> {
  TranslationStatus? _status;
  bool _newest = true;

  @override
  void initState() {
    super.initState();
    context.read<CatalogCubit>().load();
  }

  void _applyFilter({TranslationStatus? status, bool? newest}) {
    setState(() {
      if (status != null) _status = status == _status ? null : status;
      if (newest != null) _newest = newest;
    });
    context.read<CatalogCubit>().applyFilter(
          status: _status,
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
          // Filter chips
          _FilterRow(
            locale: locale,
            activeStatus: _status,
            newest: _newest,
            onStatusTap: (s) => _applyFilter(status: s),
            onSortTap: (n) => _applyFilter(newest: n),
          ),
          // Book grid
          Expanded(
            child: BlocBuilder<CatalogCubit, CatalogState>(
              builder: (ctx, state) {
                return AnimatedSwitcher(
                  duration: const Duration(milliseconds: 300),
                  child: switch (state) {
                    CatalogLoading() =>
                      const _CatalogShimmer(key: ValueKey('loading')),
                    CatalogError(:final message) => Center(
                        key: const ValueKey('error'),
                        child: ErrorStateWidget(
                          message: message,
                          onRetry: () => ctx.read<CatalogCubit>().load(),
                        ),
                      ),
                    CatalogSuccess(:final books) => RefreshIndicator(
                        key: const ValueKey('success'),
                        onRefresh: () => ctx.read<CatalogCubit>().refresh(),
                        color: AppColors.primary,
                        child: GridView.builder(
                          padding: EdgeInsetsDirectional.all(16.r),
                          physics: const AlwaysScrollableScrollPhysics(),
                          gridDelegate:
                              SliverGridDelegateWithFixedCrossAxisCount(
                            crossAxisCount: 2,
                            crossAxisSpacing: 12.w,
                            mainAxisSpacing: 14.h,
                            childAspectRatio: 0.46,
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

class _FilterRow extends StatelessWidget {
  const _FilterRow({
    required this.locale,
    required this.activeStatus,
    required this.newest,
    required this.onStatusTap,
    required this.onSortTap,
  });

  final String locale;
  final TranslationStatus? activeStatus;
  final bool newest;
  final ValueChanged<TranslationStatus> onStatusTap;
  final ValueChanged<bool> onSortTap;

  @override
  Widget build(BuildContext context) {
    return SingleChildScrollView(
      scrollDirection: Axis.horizontal,
      padding: EdgeInsetsDirectional.fromSTEB(16.w, 12.h, 16.w, 4.h),
      child: Row(
        children: [
          _Chip(
            label: 'books.status.all'.tr(),
            active: activeStatus == null,
            onTap: () {},
          ),
          SizedBox(width: 8.w),
          _Chip(
            label: 'books.status.nominated'.tr(),
            active: activeStatus == TranslationStatus.nominated,
            onTap: () => onStatusTap(TranslationStatus.nominated),
          ),
          SizedBox(width: 8.w),
          _Chip(
            label: 'books.status.translated'.tr(),
            active: activeStatus == TranslationStatus.translated,
            onTap: () => onStatusTap(TranslationStatus.translated),
          ),
          SizedBox(width: 8.w),
          Container(width: 1, height: 24.h, color: AppColors.divider),
          SizedBox(width: 8.w),
          _Chip(
            label: 'books.sort.newest'.tr(),
            active: newest,
            onTap: () => onSortTap(true),
          ),
          SizedBox(width: 8.w),
          _Chip(
            label: 'books.sort.oldest'.tr(),
            active: !newest,
            onTap: () => onSortTap(false),
          ),
        ],
      ),
    );
  }
}

class _Chip extends StatelessWidget {
  const _Chip({required this.label, required this.active, required this.onTap});
  final String label;
  final bool active;
  final VoidCallback onTap;

  @override
  Widget build(BuildContext context) {
    return GestureDetector(
      onTap: onTap,
      child: AnimatedContainer(
        duration: const Duration(milliseconds: 180),
        padding: EdgeInsets.symmetric(horizontal: 14.w, vertical: 7.h),
        decoration: BoxDecoration(
          color: active ? AppColors.primary : AppColors.surface,
          border: Border.all(
            color: active ? AppColors.primary : AppColors.divider,
          ),
          borderRadius: BorderRadius.circular(999),
        ),
        child: Text(
          label,
          style: GoogleFonts.cairo(
            fontSize: 12.5.sp,
            fontWeight: FontWeight.w700,
            color: active ? Colors.white : AppColors.textPrimary,
          ),
        ),
      ),
    );
  }
}

class _CatalogShimmer extends StatelessWidget {
  const _CatalogShimmer({super.key});

  @override
  Widget build(BuildContext context) {
    return GridView.builder(
      padding: EdgeInsetsDirectional.all(16.r),
      physics: const NeverScrollableScrollPhysics(),
      gridDelegate: SliverGridDelegateWithFixedCrossAxisCount(
        crossAxisCount: 2,
        crossAxisSpacing: 12.w,
        mainAxisSpacing: 14.h,
        childAspectRatio: 0.46,
      ),
      itemCount: 6,
      itemBuilder: (_, _) => const BookCardShimmer(),
    );
  }
}
