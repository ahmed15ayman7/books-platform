import 'package:easy_localization/easy_localization.dart';
import 'package:flutter/material.dart';
import 'package:flutter_screenutil/flutter_screenutil.dart';
import 'package:google_fonts/google_fonts.dart';

import '../../../../../core/theme/app_colors.dart';

class SearchRecentChips extends StatelessWidget {
  const SearchRecentChips({
    super.key,
    required this.recentSearches,
    required this.onChipTap,
    required this.onRemove,
    required this.onClearAll,
    required this.onShowAll,
  });

  final List<String> recentSearches;
  final ValueChanged<String> onChipTap;
  final ValueChanged<String> onRemove;
  final VoidCallback onClearAll;
  final VoidCallback onShowAll;

  static const _maxVisible = 5;

  @override
  Widget build(BuildContext context) {
    if (recentSearches.isEmpty) return const SizedBox.shrink();

    final visible = recentSearches.take(_maxVisible).toList();

    return Padding(
      padding: EdgeInsetsDirectional.fromSTEB(16.w, 16.h, 16.w, 4.h),
      child: Column(
        crossAxisAlignment: CrossAxisAlignment.start,
        children: [
          Row(
            mainAxisAlignment: MainAxisAlignment.spaceBetween,
            children: [
              Text(
                'search.recent_searches'.tr(),
                style: GoogleFonts.cairo(
                  fontSize: 13.sp,
                  fontWeight: FontWeight.w700,
                  color: AppColors.textSecondary,
                ),
              ),
              GestureDetector(
                onTap: onClearAll,
                child: Text(
                  'search.clear_all'.tr(),
                  style: GoogleFonts.cairo(
                    fontSize: 12.sp,
                    fontWeight: FontWeight.w600,
                    color: AppColors.primary,
                  ),
                ),
              ),
            ],
          ),
          SizedBox(height: 10.h),
          Wrap(
            spacing: 8.w,
            runSpacing: 8.h,
            children: visible
                .map(
                  (query) => _RecentChip(
                    query: query,
                    onTap: () => onChipTap(query),
                    onRemove: () => onRemove(query),
                  ),
                )
                .toList(),
          ),
          if (recentSearches.length > _maxVisible)
            TextButton(
              onPressed: onShowAll,
              style: TextButton.styleFrom(
                padding: EdgeInsetsDirectional.only(start: 2.w),
                minimumSize: Size.zero,
                tapTargetSize: MaterialTapTargetSize.shrinkWrap,
              ),
              child: Text(
                'search.show_more'.tr(
                  args: [(recentSearches.length - _maxVisible).toString()],
                ),
                style: GoogleFonts.cairo(
                  fontSize: 12.sp,
                  fontWeight: FontWeight.w600,
                  color: AppColors.primary,
                ),
              ),
            ),
        ],
      ),
    );
  }
}

class _RecentChip extends StatelessWidget {
  const _RecentChip({
    required this.query,
    required this.onTap,
    required this.onRemove,
  });

  final String query;
  final VoidCallback onTap;
  final VoidCallback onRemove;

  @override
  Widget build(BuildContext context) {
    return GestureDetector(
      onTap: onTap,
      child: Container(
        padding: EdgeInsetsDirectional.only(start: 12.w, end: 4.w, top: 6.h, bottom: 6.h),
        decoration: BoxDecoration(
          color: AppColors.surface,
          border: Border.all(color: AppColors.divider),
          borderRadius: BorderRadius.circular(999),
        ),
        child: Row(
          mainAxisSize: MainAxisSize.min,
          children: [
            Icon(Icons.search_rounded, size: 13.r, color: AppColors.textHint),
            SizedBox(width: 6.w),
            Text(
              query,
              style: GoogleFonts.cairo(
                fontSize: 13.sp,
                fontWeight: FontWeight.w600,
                color: AppColors.textPrimary,
              ),
            ),
            SizedBox(width: 4.w),
            GestureDetector(
              onTap: onRemove,
              behavior: HitTestBehavior.opaque,
              child: Padding(
                padding: EdgeInsets.all(4.r),
                child: Icon(Icons.close_rounded, size: 12.r, color: AppColors.textHint),
              ),
            ),
          ],
        ),
      ),
    );
  }
}
