import 'package:easy_localization/easy_localization.dart';
import 'package:flutter/material.dart';
import 'package:flutter_screenutil/flutter_screenutil.dart';
import 'package:google_fonts/google_fonts.dart';

import '../../../../../core/theme/app_colors.dart';
import '../../../../../core/widgets/expandable_content.dart';
import '../../../../../core/widgets/section_header_widget.dart';

class PublisherDetailAboutSection extends StatelessWidget {
  const PublisherDetailAboutSection({
    super.key,
    required this.text,
  });

  final String text;

  @override
  Widget build(BuildContext context) {
    return Column(
      crossAxisAlignment: CrossAxisAlignment.start,
      children: [
        Padding(
          padding: EdgeInsetsDirectional.fromSTEB(16.w, 20.h, 16.w, 0),
          child: SectionHeaderWidget(
            title: 'publishers.about'.tr(),
          ),
        ),
        Padding(
          padding: EdgeInsetsDirectional.fromSTEB(16.w, 10.h, 16.w, 0),
          child: ExpandableContent(
            isLong: ExpandableContent.isTextLong(text),
            seeMoreLabel: 'articles.see_more'.tr(),
            seeLessLabel: 'articles.see_less'.tr(),
            child: Text(
              text,
              style: GoogleFonts.tajawal(
                fontSize: 14.sp,
                color: AppColors.textSecondary,
                height: 1.7,
              ),
            ),
          ),
        ),
      ],
    );
  }
}
