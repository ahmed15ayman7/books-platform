import 'package:easy_localization/easy_localization.dart';
import 'package:flutter/material.dart';
import 'package:flutter_screenutil/flutter_screenutil.dart';
import 'package:google_fonts/google_fonts.dart';

import '../../../../../core/helpers/regex_helper.dart';
import '../../../../../core/theme/app_colors.dart';
import '../../../../../core/widgets/app_text_field.dart';

class PublishBookStep extends StatelessWidget {
  const PublishBookStep({
    super.key,
    required this.titleCtrl,
    required this.summaryCtrl,
    required this.categoryCtrl,
  });

  final TextEditingController titleCtrl;
  final TextEditingController summaryCtrl;
  final TextEditingController categoryCtrl;

  @override
  Widget build(BuildContext context) {
    return Column(
      children: [
        AppTextField(
          controller: titleCtrl,
          label: 'publish.book_title_label'.tr(),
          hint: 'publish.book_title_hint'.tr(),
          isRequired: true,
          validator: RegexHelper.requiredValidator,
          textInputAction: TextInputAction.next,
        ),
        SizedBox(height: 16.h),
        AppTextField(
          controller: summaryCtrl,
          label: 'publish.summary_label'.tr(),
          hint: 'publish.summary_hint'.tr(),
          isRequired: true,
          maxLines: 4,
          minLines: 3,
          validator: (v) => RegexHelper.minLengthValidator(v, 30),
          textInputAction: TextInputAction.next,
        ),
        SizedBox(height: 16.h),
        AppTextField(
          controller: categoryCtrl,
          label: 'publish.category_label'.tr(),
          hint: 'publish.category_hint'.tr(),
          isRequired: true,
          validator: RegexHelper.requiredValidator,
          textInputAction: TextInputAction.done,
        ),
        SizedBox(height: 16.h),
        Container(
          width: double.infinity,
          padding: EdgeInsetsDirectional.all(22.r),
          decoration: BoxDecoration(
            border: Border.all(
              color: AppColors.divider,
              style: BorderStyle.solid,
              width: 1.5,
            ),
            borderRadius: BorderRadius.circular(16.r),
          ),
          child: Column(
            children: [
              Icon(Icons.upload_file_outlined, size: 26.r, color: AppColors.primary),
              SizedBox(height: 8.h),
              Text(
                'publish.upload_label'.tr(),
                style: GoogleFonts.cairo(
                  fontSize: 13.5.sp,
                  fontWeight: FontWeight.w700,
                  color: AppColors.textPrimary,
                ),
              ),
            ],
          ),
        ),
      ],
    );
  }
}
