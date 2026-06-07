import 'package:easy_localization/easy_localization.dart';
import 'package:flutter/material.dart';
import 'package:flutter_screenutil/flutter_screenutil.dart';
import 'package:google_fonts/google_fonts.dart';

import '../../../../../core/theme/app_colors.dart';
import '../../../domain/entities/search_suggestion.dart';

class SearchSuggestionsList extends StatelessWidget {
  const SearchSuggestionsList({
    super.key,
    required this.suggestions,
    required this.locale,
    required this.onSuggestionTap,
  });

  final List<SearchSuggestion> suggestions;
  final String locale;
  final ValueChanged<SearchSuggestion> onSuggestionTap;

  @override
  Widget build(BuildContext context) {
    if (suggestions.isEmpty) return const SizedBox.shrink();

    return Padding(
      padding: EdgeInsetsDirectional.fromSTEB(16.w, 8.h, 16.w, 4.h),
      child: Column(
        crossAxisAlignment: CrossAxisAlignment.start,
        children: [
          Text(
            'search.suggestions_header'.tr(),
            style: GoogleFonts.cairo(
              fontSize: 13.sp,
              fontWeight: FontWeight.w700,
              color: AppColors.textSecondary,
            ),
          ),
          SizedBox(height: 8.h),
          ...suggestions.map(
            (s) => GestureDetector(
              onTap: () => onSuggestionTap(s),
              behavior: HitTestBehavior.opaque,
              child: Padding(
                padding: EdgeInsets.symmetric(vertical: 9.h),
                child: Row(
                  children: [
                    Icon(
                      _iconForType(s.type),
                      size: 16.r,
                      color: AppColors.textHint,
                    ),
                    SizedBox(width: 10.w),
                    Expanded(
                      child: Text(
                        s.displayLabel(locale),
                        style: GoogleFonts.cairo(
                          fontSize: 14.sp,
                          fontWeight: FontWeight.w600,
                          color: AppColors.textPrimary,
                        ),
                        maxLines: 1,
                        overflow: TextOverflow.ellipsis,
                      ),
                    ),
                    Container(
                      padding: EdgeInsetsDirectional.fromSTEB(
                        8.w,
                        3.h,
                        8.w,
                        3.h,
                      ),
                      decoration: BoxDecoration(
                        color: AppColors.inputFill,
                        borderRadius: BorderRadius.circular(999),
                      ),
                      child: Text(
                        _typeLabel(s.type),
                        style: GoogleFonts.tajawal(
                          fontSize: 10.5.sp,
                          fontWeight: FontWeight.w700,
                          color: AppColors.textSecondary,
                        ),
                      ),
                    ),
                  ],
                ),
              ),
            ),
          ),
          Divider(height: 1, color: AppColors.divider),
        ],
      ),
    );
  }

  IconData _iconForType(String type) => switch (type) {
        'publisher' => Icons.business_rounded,
        'article' => Icons.article_outlined,
        _ => Icons.menu_book_rounded,
      };

  String _typeLabel(String type) => switch (type) {
        'publisher' => 'search.publisher_label'.tr(),
        'article' => 'search.article_label'.tr(),
        _ => 'search.book_label'.tr(),
      };
}
