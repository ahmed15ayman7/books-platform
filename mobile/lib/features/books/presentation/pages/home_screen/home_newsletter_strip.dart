import 'package:easy_localization/easy_localization.dart';
import 'package:flutter/material.dart';
import 'package:flutter_screenutil/flutter_screenutil.dart';
import 'package:google_fonts/google_fonts.dart';

import '../../../../../core/helpers/regex_helper.dart';
import '../../../../../core/theme/app_colors.dart';
import '../../../../../core/theme/app_text_styles.dart';
import '../../../../../core/widgets/app_text_field.dart';

class HomeNewsletterStrip extends StatefulWidget {
  const HomeNewsletterStrip({super.key, required this.locale});
  final String locale;

  @override
  State<HomeNewsletterStrip> createState() => _HomeNewsletterStripState();
}

class _HomeNewsletterStripState extends State<HomeNewsletterStrip> {
  final _emailCtrl = TextEditingController();
  final _formKey = GlobalKey<FormState>();

  @override
  void dispose() {
    _emailCtrl.dispose();
    super.dispose();
  }

  void _subscribe() {
    if (_formKey.currentState?.validate() ?? false) {
      _emailCtrl.clear();
    }
  }

  @override
  Widget build(BuildContext context) {
    final ar = widget.locale == 'ar';
    return Container(
      padding: EdgeInsetsDirectional.all(20.r),
      decoration: BoxDecoration(
        color: AppColors.secondary,
        borderRadius: BorderRadius.circular(24.r),
      ),
      child: Column(
        crossAxisAlignment: CrossAxisAlignment.start,
        children: [
          Text(
            'home.newsletter_title'.tr(),
            style: GoogleFonts.cairo(
              fontSize: 17.sp,
              fontWeight: FontWeight.w800,
              color: Colors.white,
            ),
          ),
          SizedBox(height: 5.h),
          Text(
            ar
                ? 'آخر الكتب والترجمات مباشرة إلى بريدك'
                : 'Latest books and translations straight to your inbox',
            style: GoogleFonts.tajawal(
              fontSize: 13.sp,
              color: Colors.white.withValues(alpha: 0.65),
            ),
          ),
          SizedBox(height: 14.h),
          Form(
            key: _formKey,
            child: Row(
              crossAxisAlignment: CrossAxisAlignment.start,
              children: [
                Expanded(
                  child: Theme(
                    data: Theme.of(context).copyWith(
                      inputDecorationTheme: Theme.of(context)
                          .inputDecorationTheme
                          .copyWith(
                            fillColor: Colors.white.withValues(alpha: 0.15),
                            hintStyle: GoogleFonts.tajawal(
                              fontSize: 13.sp,
                              color: Colors.white.withValues(alpha: 0.6),
                            ),
                            enabledBorder: OutlineInputBorder(
                              borderRadius: BorderRadius.circular(14.r),
                              borderSide: BorderSide(
                                color: Colors.white.withValues(alpha: 0.18),
                              ),
                            ),
                            focusedBorder: OutlineInputBorder(
                              borderRadius: BorderRadius.circular(14.r),
                              borderSide: const BorderSide(
                                color: Colors.white,
                                width: 1.5,
                              ),
                            ),
                            errorBorder: OutlineInputBorder(
                              borderRadius: BorderRadius.circular(14.r),
                              borderSide: BorderSide(
                                color: Colors.white.withValues(alpha: 0.7),
                              ),
                            ),
                            focusedErrorBorder: OutlineInputBorder(
                              borderRadius: BorderRadius.circular(14.r),
                              borderSide: const BorderSide(
                                color: Colors.white,
                                width: 1.5,
                              ),
                            ),
                            errorStyle: GoogleFonts.tajawal(
                              fontSize: 11.sp,
                              color: Colors.white.withValues(alpha: 0.85),
                            ),
                          ),
                    ),
                    child: AppTextField(
                      controller: _emailCtrl,
                      hint: 'home.newsletter_email_hint'.tr(),
                      keyboardType: TextInputType.emailAddress,
                      textInputAction: TextInputAction.done,
                      validator: RegexHelper.emailValidator,
                      onFieldSubmitted: (_) => _subscribe(),
                      textStyle: AppTextStyles.bodyMedium
                          .copyWith(color: Colors.white),
                    ),
                  ),
                ),
                SizedBox(width: 8.w),
                GestureDetector(
                  onTap: _subscribe,
                  child: Container(
                    height: 46.h,
                    padding: EdgeInsetsDirectional.symmetric(horizontal: 18.w),
                    decoration: BoxDecoration(
                      color: AppColors.primary,
                      borderRadius: BorderRadius.circular(14.r),
                    ),
                    child: Center(
                      child: Text(
                        'home.newsletter_subscribe'.tr(),
                        style: GoogleFonts.cairo(
                          fontSize: 14.sp,
                          fontWeight: FontWeight.w700,
                          color: Colors.white,
                        ),
                      ),
                    ),
                  ),
                ),
              ],
            ),
          ),
        ],
      ),
    );
  }
}
