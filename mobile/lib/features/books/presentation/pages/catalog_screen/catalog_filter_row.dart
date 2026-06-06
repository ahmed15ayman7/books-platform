import 'package:easy_localization/easy_localization.dart';
import 'package:flutter/material.dart';
import 'package:flutter_screenutil/flutter_screenutil.dart';
import 'package:google_fonts/google_fonts.dart';

import '../../../../../core/enums/translation_status.dart';
import '../../../../../core/theme/app_colors.dart';
import '../../../domain/entities/category.dart';

class CatalogFilterRow extends StatelessWidget {
  const CatalogFilterRow({
    super.key,
    required this.locale,
    required this.activeStatus,
    required this.activeCategory,
    required this.newest,
    required this.categories,
    required this.onStatusTap,
    required this.onSortTap,
    required this.onCategoryTap,
  });

  final String locale;
  final TranslationStatus? activeStatus;
  final String? activeCategory;
  final bool newest;
  final List<Category> categories;
  final ValueChanged<TranslationStatus?> onStatusTap;
  final ValueChanged<bool> onSortTap;
  final ValueChanged<String> onCategoryTap;

  @override
  Widget build(BuildContext context) {
    return SingleChildScrollView(
      scrollDirection: Axis.horizontal,
      padding: EdgeInsetsDirectional.fromSTEB(16.w, 12.h, 16.w, 4.h),
      child: Row(
        children: [
          CatalogFilterChip(
            label: 'books.status.all'.tr(),
            active: activeStatus == null,
            onTap: () => onStatusTap(null),
          ),
          SizedBox(width: 8.w),
          CatalogFilterChip(
            label: 'books.status.nominated'.tr(),
            active: activeStatus == TranslationStatus.nominated,
            onTap: () => onStatusTap(TranslationStatus.nominated),
          ),
          SizedBox(width: 8.w),
          CatalogFilterChip(
            label: 'books.status.translated'.tr(),
            active: activeStatus == TranslationStatus.translated,
            onTap: () => onStatusTap(TranslationStatus.translated),
          ),
          SizedBox(width: 8.w),
          Container(width: 1, height: 24.h, color: AppColors.divider),
          SizedBox(width: 8.w),
          CatalogFilterChip(
            label: 'books.sort.newest'.tr(),
            active: newest,
            onTap: () => onSortTap(true),
          ),
          SizedBox(width: 8.w),
          CatalogFilterChip(
            label: 'books.sort.oldest'.tr(),
            active: !newest,
            onTap: () => onSortTap(false),
          ),
          if (categories.isNotEmpty) ...[
            SizedBox(width: 8.w),
            Container(width: 1, height: 24.h, color: AppColors.divider),
            SizedBox(width: 8.w),
            ...categories.map(
              (cat) => Padding(
                padding: EdgeInsetsDirectional.only(end: 8.w),
                child: CatalogFilterChip(
                  label: locale == 'ar' ? cat.nameAr : cat.nameEn,
                  active: activeCategory == cat.slug,
                  onTap: () => onCategoryTap(cat.slug),
                ),
              ),
            ),
          ],
        ],
      ),
    );
  }
}

class CatalogFilterChip extends StatelessWidget {
  const CatalogFilterChip({
    super.key,
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
