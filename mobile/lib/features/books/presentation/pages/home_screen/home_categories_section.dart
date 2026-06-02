import 'package:easy_localization/easy_localization.dart';
import 'package:flutter/material.dart';
import 'package:flutter_screenutil/flutter_screenutil.dart';
import 'package:google_fonts/google_fonts.dart';

import '../../../../../core/theme/app_colors.dart';
import '../../../../../core/widgets/section_header_widget.dart';
import '../../../domain/entities/category.dart';

class HomeCategoriesSection extends StatelessWidget {
  const HomeCategoriesSection({
    super.key,
    required this.categories,
    required this.locale,
    required this.onSeeAll,
    required this.onCategoryTap,
  });

  final List<Category> categories;
  final String locale;
  final VoidCallback onSeeAll;
  final void Function(Category) onCategoryTap;

  @override
  Widget build(BuildContext context) {
    return SliverToBoxAdapter(
      child: Column(
        children: [
          Padding(
            padding: EdgeInsetsDirectional.only(top: 14.h, bottom: 12.h),
            child: SectionHeaderWidget(
              title: 'home.browse_by_category'.tr(),
              onSeeAll: onSeeAll,
              seeAllLabel: 'common.see_all'.tr(),
            ),
          ),
          SingleChildScrollView(
            scrollDirection: Axis.horizontal,
            padding: EdgeInsetsDirectional.fromSTEB(16.w, 0, 16.w, 4.h),
            child: Row(
              children: categories
                  .map(
                    (c) => Padding(
                      padding: EdgeInsetsDirectional.only(end: 10.w),
                      child: HomeCategoryChip(
                        nameAr: c.nameAr,
                        nameEn: c.nameEn,
                        locale: locale,
                        onTap: () => onCategoryTap(c),
                      ),
                    ),
                  )
                  .toList(),
            ),
          ),
        ],
      ),
    );
  }
}

class HomeCategoryChip extends StatelessWidget {
  const HomeCategoryChip({
    super.key,
    required this.nameAr,
    required this.nameEn,
    required this.locale,
    required this.onTap,
  });
  final String nameAr;
  final String nameEn;
  final String locale;
  final VoidCallback onTap;

  @override
  Widget build(BuildContext context) {
    return GestureDetector(
      onTap: onTap,
      child: Container(
        padding: EdgeInsetsDirectional.fromSTEB(12.w, 9.h, 15.w, 9.h),
        decoration: BoxDecoration(
          color: AppColors.surface,
          borderRadius: BorderRadius.circular(999),
          border: Border.all(color: AppColors.divider),
          boxShadow: const [
            BoxShadow(
              color: Color(0x0D000000),
              blurRadius: 24,
              offset: Offset(0, 4),
            ),
          ],
        ),
        child: Row(
          mainAxisSize: MainAxisSize.min,
          children: [
            Container(
              width: 30.r,
              height: 30.r,
              decoration: BoxDecoration(
                color: AppColors.brandRedSoft,
                shape: BoxShape.circle,
              ),
              child: Icon(
                Icons.menu_book_outlined,
                size: 17.r,
                color: AppColors.primary,
              ),
            ),
            SizedBox(width: 8.w),
            Text(
              locale == 'ar' ? nameAr : nameEn,
              style: GoogleFonts.cairo(
                fontSize: 13.5.sp,
                fontWeight: FontWeight.w700,
                color: AppColors.textPrimary,
              ),
            ),
          ],
        ),
      ),
    );
  }
}
