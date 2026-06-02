import 'package:easy_localization/easy_localization.dart';
import 'package:flutter/material.dart';
import 'package:flutter_screenutil/flutter_screenutil.dart';
import 'package:google_fonts/google_fonts.dart';

import '../../../../../core/theme/app_colors.dart';
import '../../../../../core/theme/app_text_styles.dart';

class PublishReviewStep extends StatefulWidget {
  const PublishReviewStep({
    super.key,
    required this.formData,
    required this.onAgreedChanged,
  });

  final Map<String, dynamic> formData;
  final ValueChanged<bool> onAgreedChanged;

  @override
  State<PublishReviewStep> createState() => _PublishReviewStepState();
}

class _PublishReviewStepState extends State<PublishReviewStep> {
  bool _agreed = false;

  @override
  Widget build(BuildContext context) {
    return Column(
      crossAxisAlignment: CrossAxisAlignment.start,
      children: [
        Text(
          'publish.review_title'.tr(),
          style: AppTextStyles.titleMedium,
        ),
        SizedBox(height: 16.h),
        _ReviewRow(
          label: 'publish.author_name_label'.tr(),
          value: widget.formData['authorName'] as String? ?? '—',
        ),
        _ReviewRow(
          label: 'publish.email_label'.tr(),
          value: widget.formData['authorEmail'] as String? ?? '—',
        ),
        _ReviewRow(
          label: 'publish.book_title_label'.tr(),
          value: widget.formData['bookTitleAr'] as String? ?? '—',
        ),
        SizedBox(height: 20.h),
        Container(
          padding: EdgeInsetsDirectional.all(14.r),
          decoration: BoxDecoration(
            color: AppColors.inputFill,
            borderRadius: BorderRadius.circular(12.r),
          ),
          child: Row(
            crossAxisAlignment: CrossAxisAlignment.start,
            children: [
              Checkbox(
                value: _agreed,
                activeColor: AppColors.primary,
                onChanged: (v) {
                  setState(() => _agreed = v ?? false);
                  widget.onAgreedChanged(_agreed);
                },
              ),
              Expanded(
                child: Padding(
                  padding: EdgeInsetsDirectional.only(top: 12.h),
                  child: Text(
                    'publish.content_standards'.tr(),
                    style: GoogleFonts.tajawal(
                      fontSize: 13.sp,
                      color: AppColors.textSecondary,
                      height: 1.6,
                    ),
                  ),
                ),
              ),
            ],
          ),
        ),
      ],
    );
  }
}

class _ReviewRow extends StatelessWidget {
  const _ReviewRow({required this.label, required this.value});

  final String label;
  final String value;

  @override
  Widget build(BuildContext context) {
    return Padding(
      padding: EdgeInsetsDirectional.only(bottom: 12.h),
      child: Row(
        crossAxisAlignment: CrossAxisAlignment.start,
        children: [
          SizedBox(
            width: 100.w,
            child: Text(
              label,
              style: AppTextStyles.bodySmall
                  .copyWith(color: AppColors.textSecondary),
            ),
          ),
          Expanded(
            child: Text(value, style: AppTextStyles.bodyMedium),
          ),
        ],
      ),
    );
  }
}
