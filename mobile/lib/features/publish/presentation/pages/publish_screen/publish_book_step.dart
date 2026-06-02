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
    this.onPickFile,
    this.onPickCover,
    this.formData = const {},
  });

  final TextEditingController titleCtrl;
  final TextEditingController summaryCtrl;
  final TextEditingController categoryCtrl;
  final VoidCallback? onPickFile;
  final VoidCallback? onPickCover;
  final Map<String, dynamic> formData;

  @override
  Widget build(BuildContext context) {
    final manuscriptPath = formData['manuscriptLocalPath'] as String?;
    final coverPath = formData['coverLocalPath'] as String?;

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
        // PDF upload row
        GestureDetector(
          onTap: onPickFile,
          child: Container(
            width: double.infinity,
            padding: EdgeInsetsDirectional.all(22.r),
            decoration: BoxDecoration(
              border: Border.all(
                color: manuscriptPath != null
                    ? AppColors.success
                    : AppColors.divider,
                width: 1.5,
              ),
              borderRadius: BorderRadius.circular(16.r),
            ),
            child: Column(
              children: [
                Icon(
                  manuscriptPath != null
                      ? Icons.check_circle_outline
                      : Icons.upload_file_outlined,
                  size: 26.r,
                  color: manuscriptPath != null
                      ? AppColors.success
                      : AppColors.primary,
                ),
                SizedBox(height: 8.h),
                Text(
                  manuscriptPath != null
                      ? manuscriptPath.split('/').last
                      : 'publish.upload_label'.tr(),
                  style: GoogleFonts.cairo(
                    fontSize: 13.5.sp,
                    fontWeight: FontWeight.w700,
                    color: manuscriptPath != null
                        ? AppColors.success
                        : AppColors.textPrimary,
                  ),
                  maxLines: 1,
                  overflow: TextOverflow.ellipsis,
                ),
              ],
            ),
          ),
        ),
        SizedBox(height: 12.h),
        // Cover image row
        GestureDetector(
          onTap: onPickCover,
          child: Container(
            width: double.infinity,
            padding: EdgeInsetsDirectional.all(22.r),
            decoration: BoxDecoration(
              border: Border.all(
                color:
                    coverPath != null ? AppColors.success : AppColors.divider,
                width: 1.5,
              ),
              borderRadius: BorderRadius.circular(16.r),
            ),
            child: Column(
              children: [
                Icon(
                  coverPath != null
                      ? Icons.check_circle_outline
                      : Icons.image_outlined,
                  size: 26.r,
                  color:
                      coverPath != null ? AppColors.success : AppColors.primary,
                ),
                SizedBox(height: 8.h),
                Text(
                  coverPath != null
                      ? coverPath.split('/').last
                      : 'publish.cover_label'.tr(),
                  style: GoogleFonts.cairo(
                    fontSize: 13.5.sp,
                    fontWeight: FontWeight.w700,
                    color: coverPath != null
                        ? AppColors.success
                        : AppColors.textPrimary,
                  ),
                  maxLines: 1,
                  overflow: TextOverflow.ellipsis,
                ),
              ],
            ),
          ),
        ),
      ],
    );
  }
}
