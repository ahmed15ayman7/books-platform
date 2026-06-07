import 'package:easy_localization/easy_localization.dart';
import 'package:flutter/material.dart';
import 'package:flutter_screenutil/flutter_screenutil.dart';
import 'package:google_fonts/google_fonts.dart';

import '../../../../../core/theme/app_colors.dart';
import '../../../domain/entities/search_section_type.dart';

class SearchTabs extends StatelessWidget {
  const SearchTabs({
    super.key,
    required this.activeTab,
    required this.totals,
    required this.onTabTap,
  });

  final SearchSectionType activeTab;
  final Map<SearchSectionType, int> totals;
  final ValueChanged<SearchSectionType> onTabTap;

  @override
  Widget build(BuildContext context) {
    return SingleChildScrollView(
      scrollDirection: Axis.horizontal,
      padding: EdgeInsetsDirectional.fromSTEB(16.w, 8.h, 16.w, 4.h),
      child: Row(
        children: SearchSectionType.values.map((tab) {
          final total = totals[tab] ?? 0;
          final active = tab == activeTab;
          return Padding(
            padding: EdgeInsetsDirectional.only(end: 8.w),
            child: GestureDetector(
              onTap: () => onTabTap(tab),
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
                child: Row(
                  mainAxisSize: MainAxisSize.min,
                  children: [
                    Text(
                      _label(tab),
                      style: GoogleFonts.cairo(
                        fontSize: 13.sp,
                        fontWeight: FontWeight.w700,
                        color: active ? Colors.white : AppColors.textPrimary,
                      ),
                    ),
                    if (total > 0) ...[
                      SizedBox(width: 6.w),
                      Container(
                        padding: EdgeInsets.symmetric(
                          horizontal: 6.w,
                          vertical: 1.h,
                        ),
                        decoration: BoxDecoration(
                          color: active
                              ? Colors.white.withValues(alpha: 0.25)
                              : AppColors.inputFill,
                          borderRadius: BorderRadius.circular(999),
                        ),
                        child: Text(
                          '$total',
                          style: GoogleFonts.inter(
                            fontSize: 11.sp,
                            fontWeight: FontWeight.w700,
                            color: active ? Colors.white : AppColors.textSecondary,
                          ),
                        ),
                      ),
                    ],
                  ],
                ),
              ),
            ),
          );
        }).toList(),
      ),
    );
  }

  String _label(SearchSectionType tab) => switch (tab) {
        SearchSectionType.all => 'search.tab_all'.tr(),
        SearchSectionType.books => 'search.tab_books'.tr(),
        SearchSectionType.articles => 'search.tab_articles'.tr(),
        SearchSectionType.publishers => 'search.tab_publishers'.tr(),
      };
}
