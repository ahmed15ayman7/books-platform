import 'package:easy_localization/easy_localization.dart';
import 'package:flutter/material.dart';
import 'package:flutter_screenutil/flutter_screenutil.dart';
import 'package:google_fonts/google_fonts.dart';

import '../../../../../core/theme/app_colors.dart';
import '../../../../../core/widgets/app_text_field.dart';

class ArticleDetailCommentSection extends StatelessWidget {
  const ArticleDetailCommentSection({
    super.key,
    required this.locale,
    required this.controller,
  });
  final String locale;
  final TextEditingController controller;

  @override
  Widget build(BuildContext context) {
    final ar = locale == 'ar';
    return Column(
      crossAxisAlignment: CrossAxisAlignment.start,
      children: [
        Text(
          'article_detail.comments'.tr(),
          style: GoogleFonts.cairo(
            fontSize: 17.sp,
            fontWeight: FontWeight.w800,
            color: AppColors.textPrimary,
          ),
        ),
        SizedBox(height: 10.h),
        Row(
          crossAxisAlignment: CrossAxisAlignment.start,
          children: [
            Expanded(
              child: AppTextField(
                controller: controller,
                hint: 'article_detail.comment_hint'.tr(),
                textInputAction: TextInputAction.send,
                onFieldSubmitted: (_) {
                  if (controller.text.trim().isEmpty) return;
                  controller.clear();
                },
              ),
            ),
            SizedBox(width: 8.w),
            GestureDetector(
              onTap: () {
                if (controller.text.trim().isEmpty) return;
                controller.clear();
              },
              child: Container(
                width: 44.r,
                height: 44.r,
                decoration: BoxDecoration(
                  color: AppColors.primary,
                  borderRadius: BorderRadius.circular(12.r),
                ),
                child: Icon(
                  Icons.send_rounded,
                  color: Colors.white,
                  size: 20.r,
                ),
              ),
            ),
          ],
        ),
        SizedBox(height: 16.h),
        ArticleDetailMockComment(
          initials: 'م',
          name: ar ? 'محمد العتيبي' : 'Mohammed',
          text: ar
              ? 'مقال رائع، استفدت كثيرًا من المحتوى المقدّم.'
              : 'Great article, very informative!',
          time: ar ? 'منذ 3 ساعات' : '3h ago',
        ),
        SizedBox(height: 10.h),
        ArticleDetailMockComment(
          initials: 'س',
          name: ar ? 'سارة الخالد' : 'Sara',
          text: ar
              ? 'شكرًا على هذا المحتوى القيّم، أتطلع للمزيد.'
              : 'Thanks for the valuable content, looking forward to more.',
          time: ar ? 'منذ 5 ساعات' : '5h ago',
        ),
      ],
    );
  }
}

class ArticleDetailMockComment extends StatelessWidget {
  const ArticleDetailMockComment({
    super.key,
    required this.initials,
    required this.name,
    required this.text,
    required this.time,
  });
  final String initials;
  final String name;
  final String text;
  final String time;

  @override
  Widget build(BuildContext context) {
    return Row(
      crossAxisAlignment: CrossAxisAlignment.start,
      children: [
        Container(
          width: 32.r,
          height: 32.r,
          decoration: const BoxDecoration(
            color: AppColors.secondary,
            shape: BoxShape.circle,
          ),
          child: Center(
            child: Text(
              initials,
              style: GoogleFonts.cairo(
                fontSize: 13.sp,
                fontWeight: FontWeight.w700,
                color: Colors.white,
              ),
            ),
          ),
        ),
        SizedBox(width: 10.w),
        Expanded(
          child: Container(
            padding: EdgeInsetsDirectional.fromSTEB(12.w, 10.h, 12.w, 10.h),
            decoration: BoxDecoration(
              color: AppColors.surface,
              borderRadius: BorderRadius.circular(12.r),
              border: Border.all(color: AppColors.divider),
            ),
            child: Column(
              crossAxisAlignment: CrossAxisAlignment.start,
              children: [
                Row(
                  children: [
                    Text(
                      name,
                      style: GoogleFonts.tajawal(
                        fontSize: 12.sp,
                        fontWeight: FontWeight.w700,
                        color: AppColors.textPrimary,
                      ),
                    ),
                    const Spacer(),
                    Text(
                      time,
                      style: GoogleFonts.inter(
                        fontSize: 10.sp,
                        color: AppColors.textHint,
                      ),
                    ),
                  ],
                ),
                SizedBox(height: 4.h),
                Text(
                  text,
                  style: GoogleFonts.tajawal(
                    fontSize: 12.sp,
                    color: AppColors.textSecondary,
                    height: 1.5,
                  ),
                ),
              ],
            ),
          ),
        ),
      ],
    );
  }
}
