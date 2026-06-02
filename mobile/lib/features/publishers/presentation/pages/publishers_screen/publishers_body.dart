import 'package:easy_localization/easy_localization.dart';
import 'package:flutter/material.dart';
import 'package:flutter_screenutil/flutter_screenutil.dart';
import 'package:google_fonts/google_fonts.dart';

import '../../../../../core/theme/app_colors.dart';
import '../../../../../core/theme/app_shadows.dart';
import '../../../domain/entities/publisher.dart';
import 'publishers_country_chip.dart';
import 'publishers_publisher_card.dart';

class PublishersBody extends StatelessWidget {
  const PublishersBody({
    super.key,
    required this.publishers,
    required this.countries,
    required this.activeCountry,
    required this.locale,
    required this.onCountryTap,
    required this.onPublisherTap,
    required this.onRefresh,
  });
  final List<Publisher> publishers;
  final List<String> countries;
  final String? activeCountry;
  final String locale;
  final ValueChanged<String> onCountryTap;
  final ValueChanged<Publisher> onPublisherTap;
  final Future<void> Function() onRefresh;

  @override
  Widget build(BuildContext context) {
    return RefreshIndicator(
      onRefresh: onRefresh,
      color: AppColors.primary,
      child: CustomScrollView(
        physics: const AlwaysScrollableScrollPhysics(),
        slivers: [
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
                      'publishers.search_hint'.tr(),
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
          SliverToBoxAdapter(
            child: SingleChildScrollView(
              scrollDirection: Axis.horizontal,
              padding: EdgeInsetsDirectional.fromSTEB(16.w, 8.h, 16.w, 4.h),
              child: Row(
                children: [
                  PublishersCountryChip(
                    label: 'publishers.all_countries'.tr(),
                    active: activeCountry == null,
                    onTap: () => onCountryTap(''),
                  ),
                  ...countries.map(
                    (c) => Padding(
                      padding: EdgeInsetsDirectional.only(start: 8.w),
                      child: PublishersCountryChip(
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
          SliverList.separated(
            itemCount: publishers.length,
            separatorBuilder: (_, i) => SizedBox(height: 12.h),
            itemBuilder: (_, i) => Padding(
              padding: EdgeInsetsDirectional.symmetric(horizontal: 16.w),
              child: PublishersPublisherCard(
                publisher: publishers[i],
                locale: locale,
                onTap: () => onPublisherTap(publishers[i]),
              ),
            ),
          ),
          SliverToBoxAdapter(child: SizedBox(height: 24.h)),
        ],
      ),
    );
  }
}
