import 'package:easy_localization/easy_localization.dart';
import 'package:flutter/material.dart';
import 'package:flutter_screenutil/flutter_screenutil.dart';

import '../../../../../core/helpers/regex_helper.dart';
import '../../../../../core/widgets/app_text_field.dart';

class PublishAuthorStep extends StatelessWidget {
  const PublishAuthorStep({
    super.key,
    required this.nameCtrl,
    required this.emailCtrl,
    required this.phoneCtrl,
    required this.bioCtrl,
  });

  final TextEditingController nameCtrl;
  final TextEditingController emailCtrl;
  final TextEditingController phoneCtrl;
  final TextEditingController bioCtrl;

  @override
  Widget build(BuildContext context) {
    return Column(
      children: [
        AppTextField(
          controller: nameCtrl,
          label: 'publish.author_name_label'.tr(),
          hint: 'publish.author_name_hint'.tr(),
          isRequired: true,
          validator: RegexHelper.requiredValidator,
          textInputAction: TextInputAction.next,
        ),
        SizedBox(height: 16.h),
        AppTextField(
          controller: emailCtrl,
          label: 'publish.email_label'.tr(),
          hint: 'name@example.com',
          isRequired: true,
          keyboardType: TextInputType.emailAddress,
          validator: RegexHelper.emailValidator,
          textInputAction: TextInputAction.next,
        ),
        SizedBox(height: 16.h),
        AppTextField(
          controller: phoneCtrl,
          label: 'publish.phone_label'.tr(),
          hint: '+20 1XX XXX XXXX',
          keyboardType: TextInputType.phone,
          validator: RegexHelper.phoneValidator,
          textInputAction: TextInputAction.next,
        ),
        SizedBox(height: 16.h),
        AppTextField(
          controller: bioCtrl,
          label: 'publish.bio_label'.tr(),
          hint: 'publish.bio_hint'.tr(),
          maxLines: 4,
          minLines: 3,
          validator: (v) => v != null && v.trim().isNotEmpty
              ? RegexHelper.minLengthValidator(v, 20)
              : null,
          textInputAction: TextInputAction.done,
        ),
      ],
    );
  }
}
