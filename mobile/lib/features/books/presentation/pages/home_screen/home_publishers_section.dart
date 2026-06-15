import 'package:easy_localization/easy_localization.dart';
import 'package:flutter/material.dart';
import 'package:flutter_screenutil/flutter_screenutil.dart';
import 'package:google_fonts/google_fonts.dart';

import '../../../../../core/theme/app_colors.dart';
import '../../../../../core/widgets/section_header_widget.dart';
import '../../../domain/entities/publisher_summary.dart';

class HomePublishersSection extends StatelessWidget {
  const HomePublishersSection({
    super.key,
    required this.publishers,
    required this.locale,
    required this.onSeeAll,
  });

  final List<PublisherSummary> publishers;
  final String locale;
  final VoidCallback onSeeAll;

  @override
  Widget build(BuildContext context) {
    return SliverToBoxAdapter(
      child: Column(
        children: [
          Padding(
            padding: EdgeInsetsDirectional.only(top: 26.h, bottom: 12.h),
            child: SectionHeaderWidget(
              title: 'home.top_publishers'.tr(),
              onSeeAll: onSeeAll,
            ),
          ),
          SingleChildScrollView(
            scrollDirection: Axis.horizontal,
            padding: EdgeInsetsDirectional.fromSTEB(16.w, 0, 16.w, 4.h),
            child: Row(
              children: publishers
                  .map(
                    (p) => Padding(
                      padding: EdgeInsetsDirectional.only(end: 10.w),
                      child: HomePublisherPill(
                        publisher: p,
                        locale: locale,
                        onTap: onSeeAll,
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

class HomePublisherPill extends StatelessWidget {
  const HomePublisherPill({
    super.key,
    required this.publisher,
    required this.locale,
    required this.onTap,
  });
  final PublisherSummary publisher;
  final String locale;
  final VoidCallback onTap;

  @override
  Widget build(BuildContext context) {
    final initials = publisher.name
        .split(' ')
        .take(2)
        .map((w) => w.isNotEmpty ? w[0] : '')
        .join();
    return GestureDetector(
      onTap: onTap,
      child: Container(
        padding: EdgeInsetsDirectional.fromSTEB(10.w, 8.h, 16.w, 8.h),
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
              width: 36.r,
              height: 36.r,
              decoration: BoxDecoration(
                color: AppColors.secondary,
                shape: BoxShape.circle,
              ),
              child: Center(
                child: Text(
                  initials,
                  style: GoogleFonts.cairo(
                    fontSize: 14.sp,
                    fontWeight: FontWeight.w800,
                    color: Colors.white,
                  ),
                ),
              ),
            ),
            SizedBox(width: 10.w),
            Column(
              crossAxisAlignment: CrossAxisAlignment.start,
              mainAxisSize: MainAxisSize.min,
              children: [
                Text(
                  publisher.name,
                  style: GoogleFonts.cairo(
                    fontSize: 13.sp,
                    fontWeight: FontWeight.w700,
                    color: AppColors.textPrimary,
                  ),
                  maxLines: 1,
                  overflow: TextOverflow.ellipsis,
                ),
                Text(
                  '${publisher.countryFlag} ${publisher.bookCount} ${'common.books'.tr()}',
                  style: GoogleFonts.inter(
                    fontSize: 11.sp,
                    color: AppColors.textSecondary,
                  ),
                ),
              ],
            ),
          ],
        ),
      ),
    );
  }
}
