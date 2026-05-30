import 'package:easy_localization/easy_localization.dart';
import 'package:flutter/material.dart';
import 'package:flutter_bloc/flutter_bloc.dart';
import 'package:flutter_screenutil/flutter_screenutil.dart';
import 'package:google_fonts/google_fonts.dart';

import '../../../../core/router/app_routes.dart';
import '../../../../core/theme/app_colors.dart';
import '../../../../core/theme/app_shadows.dart';
import '../../../../core/widgets/app_bar_widget.dart';
import '../../../../core/widgets/app_loading_indicator.dart';
import '../../../../core/widgets/bottom_nav_widget.dart';
import '../../../../core/widgets/error_state_widget.dart';
import '../../domain/entities/publisher.dart';
import '../cubit/publishers_list_cubit/publishers_list_cubit.dart';
import '../cubit/publishers_list_cubit/publishers_list_state.dart';

class PublishersScreen extends StatefulWidget {
  const PublishersScreen({super.key});

  @override
  State<PublishersScreen> createState() => _PublishersScreenState();
}

class _PublishersScreenState extends State<PublishersScreen> {
  @override
  void initState() {
    super.initState();
    context.read<PublishersListCubit>().load();
  }

  @override
  Widget build(BuildContext context) {
    final locale = context.locale.languageCode;
    final ar = locale == 'ar';
    return Scaffold(
      backgroundColor: AppColors.background,
      body: Column(
        children: [
          AppBarWidget(
            variant: AppBarVariant.title,
            title: ar ? 'الناشرون' : 'Publishers',
            subtitle: '665 ${ar ? 'دار نشر' : 'publishers'}',
            currentLocale: locale,
            onCart: () => Navigator.of(context).pushNamed(AppRoutes.cart),
            onLocaleChanged: (l) => context.setLocale(Locale(l)),
          ),
          Expanded(
            child: BlocBuilder<PublishersListCubit, PublishersListState>(
              builder: (ctx, state) => switch (state) {
                PublishersListLoading() =>
                  const Center(child: AppLoadingIndicator()),
                PublishersListError(:final message) => Center(
                    child: ErrorStateWidget(
                      message: message,
                      onRetry: () => ctx.read<PublishersListCubit>().load(),
                    ),
                  ),
                PublishersListSuccess(
                  :final publishers,
                  :final countries,
                  :final activeCountry,
                ) =>
                  _Body(
                    publishers: publishers,
                    countries: countries,
                    activeCountry: activeCountry,
                    locale: locale,
                    onCountryTap: (c) =>
                        ctx.read<PublishersListCubit>().filterByCountry(
                              c == activeCountry ? null : c,
                            ),
                  ),
                _ => const SizedBox.shrink(),
              },
            ),
          ),
          BottomNavWidget(
            activeTab: BottomNavTab.publishers,
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
        break;
    }
  }
}

class _Body extends StatelessWidget {
  const _Body({
    required this.publishers,
    required this.countries,
    required this.activeCountry,
    required this.locale,
    required this.onCountryTap,
  });
  final List<Publisher> publishers;
  final List<String> countries;
  final String? activeCountry;
  final String locale;
  final ValueChanged<String> onCountryTap;

  @override
  Widget build(BuildContext context) {
    final ar = locale == 'ar';
    return CustomScrollView(
      slivers: [
        // Search bar (visual only — future enhancement)
        SliverToBoxAdapter(
          child: Padding(
            padding: EdgeInsetsDirectional.fromSTEB(16.w, 14.h, 16.w, 4.h),
            child: Container(
              height: 48.h,
              decoration: BoxDecoration(
                color: AppColors.surface,
                border: Border.all(color: AppColors.divider),
                borderRadius: BorderRadius.circular(999),
                boxShadow: AppShadows.soft,
              ),
              padding: EdgeInsetsDirectional.symmetric(horizontal: 18.w),
              child: Row(
                children: [
                  Icon(
                    Icons.search_rounded,
                    size: 18.r,
                    color: AppColors.textHint,
                  ),
                  SizedBox(width: 10.w),
                  Text(
                    ar ? 'ابحث عن دار نشر…' : 'Search publishers…',
                    style: GoogleFonts.tajawal(
                      fontSize: 14.sp,
                      color: AppColors.textHint,
                    ),
                  ),
                ],
              ),
            ),
          ),
        ),
        // Country filter
        SliverToBoxAdapter(
          child: SingleChildScrollView(
            scrollDirection: Axis.horizontal,
            padding: EdgeInsetsDirectional.fromSTEB(16.w, 8.h, 16.w, 4.h),
            child: Row(
              children: [
                _CountryChip(
                  label: ar ? 'الكل' : 'All',
                  active: activeCountry == null,
                  onTap: () => onCountryTap(''),
                ),
                ...countries.map(
                  (c) => Padding(
                    padding: EdgeInsetsDirectional.only(start: 8.w),
                    child: _CountryChip(
                      label: c,
                      active: activeCountry == c,
                      onTap: () => onCountryTap(c),
                    ),
                  ),
                ),
              ],
            ),
          ),
        ),
        // Publisher list
        SliverList.separated(
          itemCount: publishers.length,
          separatorBuilder: (_, i) => SizedBox(height: 12.h),
          itemBuilder: (_, i) => Padding(
            padding: EdgeInsetsDirectional.symmetric(horizontal: 16.w),
            child: _PublisherCard(
              publisher: publishers[i],
              locale: locale,
            ),
          ),
        ),
        SliverToBoxAdapter(child: SizedBox(height: 24.h)),
      ],
    );
  }
}

class _CountryChip extends StatelessWidget {
  const _CountryChip({
    required this.label,
    required this.active,
    required this.onTap,
  });
  final String label;
  final bool active;
  final VoidCallback onTap;

  @override
  Widget build(BuildContext context) {
    return GestureDetector(
      onTap: onTap,
      child: AnimatedContainer(
        duration: const Duration(milliseconds: 180),
        padding: EdgeInsets.symmetric(horizontal: 14.w, vertical: 8.h),
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

class _PublisherCard extends StatelessWidget {
  const _PublisherCard({required this.publisher, required this.locale});
  final Publisher publisher;
  final String locale;

  @override
  Widget build(BuildContext context) {
    final ar = locale == 'ar';
    final initials = publisher.name
        .split(' ')
        .take(2)
        .map((w) => w.isNotEmpty ? w[0] : '')
        .join();
    return Container(
      padding: EdgeInsetsDirectional.all(14.r),
      decoration: BoxDecoration(
        color: AppColors.surface,
        border: Border.all(color: AppColors.divider),
        borderRadius: BorderRadius.circular(20.r),
        boxShadow: AppShadows.soft,
      ),
      child: Row(
        children: [
          // Avatar
          Container(
            width: 54.r,
            height: 54.r,
            decoration: BoxDecoration(
              color: AppColors.secondary,
              borderRadius: BorderRadius.circular(16.r),
            ),
            child: Center(
              child: Text(
                initials,
                style: GoogleFonts.cairo(
                  fontSize: 18.sp,
                  fontWeight: FontWeight.w800,
                  color: Colors.white,
                ),
              ),
            ),
          ),
          SizedBox(width: 14.w),
          // Info
          Expanded(
            child: Column(
              crossAxisAlignment: CrossAxisAlignment.start,
              children: [
                Row(
                  children: [
                    Flexible(
                      child: Text(
                        publisher.name,
                        style: GoogleFonts.cairo(
                          fontSize: 15.sp,
                          fontWeight: FontWeight.w700,
                          color: AppColors.textPrimary,
                        ),
                        maxLines: 1,
                        overflow: TextOverflow.ellipsis,
                      ),
                    ),
                    if (publisher.isSponsored) ...[
                      SizedBox(width: 7.w),
                      Container(
                        padding: EdgeInsetsDirectional.fromSTEB(
                            8.w, 2.h, 8.w, 2.h),
                        decoration: BoxDecoration(
                          color: AppColors.primary,
                          borderRadius: BorderRadius.circular(999),
                        ),
                        child: Text(
                          ar ? 'مُميَّز' : 'Featured',
                          style: GoogleFonts.tajawal(
                            fontSize: 10.sp,
                            fontWeight: FontWeight.w700,
                            color: Colors.white,
                          ),
                        ),
                      ),
                    ],
                  ],
                ),
                SizedBox(height: 3.h),
                Text(
                  '${publisher.countryFlag} ${ar ? publisher.countryAr : publisher.countryEn}',
                  style: GoogleFonts.inter(
                    fontSize: 12.5.sp,
                    color: AppColors.textSecondary,
                  ),
                ),
              ],
            ),
          ),
          // Book count chip
          Container(
            padding: EdgeInsetsDirectional.fromSTEB(11.w, 6.h, 11.w, 6.h),
            decoration: BoxDecoration(
              color: AppColors.brandRedSoft,
              borderRadius: BorderRadius.circular(999),
            ),
            child: Text(
              '${publisher.bookCount} ${ar ? 'كتاب' : 'books'}',
              style: GoogleFonts.cairo(
                fontSize: 12.sp,
                fontWeight: FontWeight.w700,
                color: AppColors.primary,
              ),
            ),
          ),
        ],
      ),
    );
  }
}
