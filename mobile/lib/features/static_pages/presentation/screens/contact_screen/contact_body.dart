import 'package:flutter/material.dart';
import 'package:flutter_screenutil/flutter_screenutil.dart';
import 'package:google_fonts/google_fonts.dart';

import 'package:booksplatform/core/constants/social_links.dart';
import 'package:booksplatform/core/di/injection_container.dart';
import 'package:booksplatform/core/helpers/url_launcher_helper.dart';
import 'package:booksplatform/core/theme/app_colors.dart';
import 'package:booksplatform/features/static_pages/presentation/widgets/info_page_hero.dart';

import '../../helpers/bilingual_helper.dart';

// ignore_for_file: lines_longer_than_80_chars

// ── Content ────────────────────────────────────────────────────────────────

const _heroSubtitle = (
  ar: 'يسعدنا التواصل معك في أي وقت. راسلنا واستفسر عن أي شيء.',
  en: 'We are happy to hear from you at any time. Reach out with any question.',
);

const _phone = '01005772608 (2+)';
const _phoneDialUri = 'tel:+201005772608';
const _hours = (
  ar: 'متاح من الساعة 10:00 صباحًا حتى 19:00 مساءً',
  en: 'Available from 10:00 AM to 7:00 PM',
);
const _emails = ['info@booksplatform.net', 'atefmazhar@yahoo.com'];

const _followLabel = (ar: 'تابعنا على', en: 'Follow us on');

const _formTitle = (ar: 'أرسل رسالة', en: 'Send a message');
const _fieldName = (ar: 'الاسم الكامل', en: 'Full name');
const _fieldEmail = (ar: 'البريد الإلكتروني', en: 'Email address');
const _fieldPhone = (ar: 'رقم الهاتف (اختياري)', en: 'Phone (optional)');
const _fieldMessage = (ar: 'الرسالة', en: 'Message');
const _sendLabel = (ar: 'إرسال', en: 'Send');
const _sendingLabel = (ar: 'جاري الإرسال…', en: 'Sending…');
const _successMsg = (
  ar: 'تم إرسال رسالتك بنجاح! سنرد عليك في غضون 2–3 أيام عمل.',
  en: 'Your message was sent! We\'ll get back to you within 2–3 business days.',
);
const _sendAnotherLabel = (ar: 'إرسال رسالة أخرى', en: 'Send another');

// Social network items
const _socials = [
  (
    icon: Icons.close_rounded,
    url: SocialLinks.x,
    semanticsLabel: 'X',
  ),
  (
    icon: Icons.facebook_outlined,
    url: SocialLinks.facebook,
    semanticsLabel: 'Facebook',
  ),
  (
    icon: Icons.camera_alt_outlined,
    url: SocialLinks.instagram,
    semanticsLabel: 'Instagram',
  ),
  (
    icon: Icons.send_rounded,
    url: SocialLinks.telegram,
    semanticsLabel: 'Telegram',
  ),
  (
    icon: Icons.smart_display_outlined,
    url: SocialLinks.youtube,
    semanticsLabel: 'YouTube',
  ),
  (
    icon: Icons.business_center_outlined,
    url: SocialLinks.linkedIn,
    semanticsLabel: 'LinkedIn',
  ),
];

// ── Widget ─────────────────────────────────────────────────────────────────

class ContactBody extends StatelessWidget {
  const ContactBody({
    super.key,
    required this.lang,
    required this.nameCtrl,
    required this.emailCtrl,
    required this.phoneCtrl,
    required this.messageCtrl,
    required this.errors,
    required this.isLoading,
    required this.isSuccess,
    required this.onSubmit,
    required this.onReset,
  });

  final String lang;
  final TextEditingController nameCtrl;
  final TextEditingController emailCtrl;
  final TextEditingController phoneCtrl;
  final TextEditingController messageCtrl;
  final Map<String, String> errors;
  final bool isLoading;
  final bool isSuccess;
  final VoidCallback onSubmit;
  final VoidCallback onReset;

  @override
  Widget build(BuildContext context) {
    return Column(
      crossAxisAlignment: CrossAxisAlignment.start,
      children: [
        InfoPageHero(
          icon: Icons.mail_outline_rounded,
          subtitle: localizedText(_heroSubtitle, lang),
        ),

        // ── Contact details card ──────────────────────────────────────────
        Padding(
          padding: EdgeInsetsDirectional.fromSTEB(16.w, 20.h, 16.w, 0),
          child: Container(
            width: double.infinity,
            decoration: BoxDecoration(
              color: AppColors.secondary,
              borderRadius: BorderRadius.circular(24.r),
            ),
            padding: EdgeInsets.symmetric(horizontal: 22.w, vertical: 26.h),
            child: Column(
              children: [
                Icon(Icons.phone_outlined,
                    color: Colors.white.withValues(alpha: 0.85), size: 34.r),
                SizedBox(height: 10.h),
                GestureDetector(
                  onTap: () => getIt<UrlLauncherHelper>()
                      .launchExternalUrl(_phoneDialUri),
                  child: Text(
                    _phone,
                    textDirection: TextDirection.ltr,
                    style: GoogleFonts.inter(
                      fontSize: 24.sp,
                      fontWeight: FontWeight.w800,
                      color: Colors.white,
                      letterSpacing: 0.01 * 24.sp,
                    ),
                  ),
                ),
                SizedBox(height: 8.h),
                Text(
                  localizedText(_hours, lang),
                  style: GoogleFonts.tajawal(
                    fontSize: 12.5.sp,
                    color: Colors.white.withValues(alpha: 0.6),
                  ),
                ),
                Padding(
                  padding: EdgeInsets.symmetric(vertical: 18.h),
                  child: Divider(
                      color: Colors.white.withValues(alpha: 0.12), height: 1),
                ),
                Column(
                  children: _emails
                      .map((em) => Padding(
                            padding: EdgeInsets.only(bottom: 11.h),
                            child: GestureDetector(
                              onTap: () => getIt<UrlLauncherHelper>()
                                  .launchExternalUrl('mailto:$em'),
                              child: Row(
                                mainAxisAlignment: MainAxisAlignment.center,
                                children: [
                                  Icon(Icons.mail_outline_rounded,
                                      color: AppColors.primary, size: 17.r),
                                  SizedBox(width: 9.w),
                                  Flexible(
                                    child: Text(
                                      em,
                                      textDirection: TextDirection.ltr,
                                      overflow: TextOverflow.ellipsis,
                                      style: GoogleFonts.inter(
                                        fontSize: 13.5.sp,
                                        color: Colors.white
                                            .withValues(alpha: 0.9),
                                      ),
                                    ),
                                  ),
                                ],
                              ),
                            ),
                          ))
                      .toList(),
                ),
              ],
            ),
          ),
        ),

        // ── Follow us ─────────────────────────────────────────────────────
        Padding(
          padding: EdgeInsetsDirectional.fromSTEB(16.w, 20.h, 16.w, 0),
          child: Column(
            crossAxisAlignment: CrossAxisAlignment.start,
            children: [
              Text(
                localizedText(_followLabel, lang),
                style: GoogleFonts.cairo(
                  fontSize: 13.sp,
                  fontWeight: FontWeight.w700,
                  color: AppColors.textSecondary,
                ),
              ),
              SizedBox(height: 11.h),
              Wrap(
                spacing: 10.w,
                runSpacing: 10.h,
                children: _socials
                    .map((s) => _SocialIcon(
                          icon: s.icon,
                          url: s.url,
                          semanticsLabel: s.semanticsLabel,
                        ))
                    .toList(),
              ),
            ],
          ),
        ),

        // ── Contact form ──────────────────────────────────────────────────
        Padding(
          padding: EdgeInsetsDirectional.fromSTEB(16.w, 24.h, 16.w, 30.h),
          child: Container(
            decoration: BoxDecoration(
              color: AppColors.surface,
              border: Border.all(color: AppColors.divider),
              borderRadius: BorderRadius.circular(24.r),
              boxShadow: [
                BoxShadow(
                  color: Colors.black.withValues(alpha: 0.05),
                  blurRadius: 24,
                  offset: const Offset(0, 4),
                ),
              ],
            ),
            padding: EdgeInsets.all(20.r),
            child: isSuccess ? _SuccessState(lang: lang, onReset: onReset) : _Form(
              lang: lang,
              nameCtrl: nameCtrl,
              emailCtrl: emailCtrl,
              phoneCtrl: phoneCtrl,
              messageCtrl: messageCtrl,
              errors: errors,
              isLoading: isLoading,
              onSubmit: onSubmit,
            ),
          ),
        ),
      ],
    );
  }
}

// ── Success state ──────────────────────────────────────────────────────────

class _SuccessState extends StatelessWidget {
  const _SuccessState({required this.lang, required this.onReset});

  final String lang;
  final VoidCallback onReset;

  @override
  Widget build(BuildContext context) {
    return Column(
      children: [
        Container(
          width: 56.r,
          height: 56.r,
          decoration: BoxDecoration(
            color: AppColors.brandRedSoft,
            shape: BoxShape.circle,
          ),
          child:
              Icon(Icons.check_rounded, color: AppColors.primary, size: 28.r),
        ),
        SizedBox(height: 14.h),
        Text(
          localizedText(_successMsg, lang),
          textAlign: TextAlign.center,
          style: GoogleFonts.cairo(
            fontSize: 15.sp,
            fontWeight: FontWeight.w700,
            color: AppColors.textPrimary,
          ),
        ),
        SizedBox(height: 16.h),
        OutlinedButton(
          onPressed: onReset,
          style: OutlinedButton.styleFrom(
            side: BorderSide(color: AppColors.primary),
            shape: RoundedRectangleBorder(
                borderRadius: BorderRadius.circular(12.r)),
            padding:
                EdgeInsets.symmetric(horizontal: 24.w, vertical: 12.h),
          ),
          child: Text(
            localizedText(_sendAnotherLabel, lang),
            style: GoogleFonts.cairo(
              fontSize: 14.sp,
              fontWeight: FontWeight.w700,
              color: AppColors.primary,
            ),
          ),
        ),
      ],
    );
  }
}

// ── Form ───────────────────────────────────────────────────────────────────

class _Form extends StatelessWidget {
  const _Form({
    required this.lang,
    required this.nameCtrl,
    required this.emailCtrl,
    required this.phoneCtrl,
    required this.messageCtrl,
    required this.errors,
    required this.isLoading,
    required this.onSubmit,
  });

  final String lang;
  final TextEditingController nameCtrl;
  final TextEditingController emailCtrl;
  final TextEditingController phoneCtrl;
  final TextEditingController messageCtrl;
  final Map<String, String> errors;
  final bool isLoading;
  final VoidCallback onSubmit;

  @override
  Widget build(BuildContext context) {
    return Column(
      crossAxisAlignment: CrossAxisAlignment.start,
      children: [
        Text(
          localizedText(_formTitle, lang),
          style: GoogleFonts.cairo(
            fontSize: 19.sp,
            fontWeight: FontWeight.w800,
            color: AppColors.textPrimary,
          ),
        ),
        SizedBox(height: 18.h),
        _Field(
            label: localizedText(_fieldName, lang),
            ctrl: nameCtrl,
            error: errors['name']),
        SizedBox(height: 15.h),
        _Field(
          label: localizedText(_fieldEmail, lang),
          ctrl: emailCtrl,
          error: errors['email'],
          keyboardType: TextInputType.emailAddress,
          textDirection: TextDirection.ltr,
        ),
        SizedBox(height: 15.h),
        _Field(
          label: localizedText(_fieldPhone, lang),
          ctrl: phoneCtrl,
          keyboardType: TextInputType.phone,
          textDirection: TextDirection.ltr,
        ),
        SizedBox(height: 15.h),
        _Field(
          label: localizedText(_fieldMessage, lang),
          ctrl: messageCtrl,
          error: errors['message'],
          maxLines: 4,
        ),
        SizedBox(height: 19.h),
        SizedBox(
          width: double.infinity,
          child: ElevatedButton(
            onPressed: isLoading ? null : onSubmit,
            style: ElevatedButton.styleFrom(
              backgroundColor: AppColors.primary,
              foregroundColor: Colors.white,
              disabledBackgroundColor: AppColors.primary.withValues(alpha: 0.7),
              shape: RoundedRectangleBorder(
                  borderRadius: BorderRadius.circular(14.r)),
              padding: EdgeInsets.symmetric(vertical: 14.h),
            ),
            child: isLoading
                ? Row(
                    mainAxisAlignment: MainAxisAlignment.center,
                    children: [
                      SizedBox(
                        width: 17.r,
                        height: 17.r,
                        child: CircularProgressIndicator(
                          strokeWidth: 2.5,
                          color: Colors.white.withValues(alpha: 0.8),
                        ),
                      ),
                      SizedBox(width: 10.w),
                      Text(localizedText(_sendingLabel, lang),
                          style: GoogleFonts.cairo(
                              fontSize: 15.sp,
                              fontWeight: FontWeight.w700,
                              color: Colors.white)),
                    ],
                  )
                : Row(
                    mainAxisAlignment: MainAxisAlignment.center,
                    children: [
                      Icon(Icons.send_rounded, size: 18.r),
                      SizedBox(width: 8.w),
                      Text(localizedText(_sendLabel, lang),
                          style: GoogleFonts.cairo(
                              fontSize: 15.sp,
                              fontWeight: FontWeight.w700,
                              color: Colors.white)),
                    ],
                  ),
          ),
        ),
      ],
    );
  }
}

// ── Reusable field ─────────────────────────────────────────────────────────

class _Field extends StatelessWidget {
  const _Field({
    required this.label,
    required this.ctrl,
    this.error,
    this.keyboardType,
    this.textDirection,
    this.maxLines = 1,
  });

  final String label;
  final TextEditingController ctrl;
  final String? error;
  final TextInputType? keyboardType;
  final TextDirection? textDirection;
  final int maxLines;

  @override
  Widget build(BuildContext context) {
    final hasError = error != null;
    return Column(
      crossAxisAlignment: CrossAxisAlignment.start,
      children: [
        Text(
          label,
          style: GoogleFonts.cairo(
            fontSize: 13.sp,
            fontWeight: FontWeight.w700,
            color: AppColors.textSecondary,
          ),
        ),
        SizedBox(height: 6.h),
        TextField(
          controller: ctrl,
          keyboardType: keyboardType,
          textDirection: textDirection,
          maxLines: maxLines,
          style: GoogleFonts.tajawal(
              fontSize: 15.sp, color: AppColors.textPrimary),
          decoration: InputDecoration(
            filled: true,
            fillColor: AppColors.inputFill,
            contentPadding:
                EdgeInsets.symmetric(horizontal: 15.w, vertical: 13.h),
            enabledBorder: OutlineInputBorder(
              borderRadius: BorderRadius.circular(14.r),
              borderSide: BorderSide(
                  color: hasError ? AppColors.error : AppColors.divider,
                  width: 1.5),
            ),
            focusedBorder: OutlineInputBorder(
              borderRadius: BorderRadius.circular(14.r),
              borderSide: BorderSide(
                  color: hasError ? AppColors.error : AppColors.primary,
                  width: 1.5),
            ),
            errorBorder: OutlineInputBorder(
              borderRadius: BorderRadius.circular(14.r),
              borderSide:
                  BorderSide(color: AppColors.error, width: 1.5),
            ),
            focusedErrorBorder: OutlineInputBorder(
              borderRadius: BorderRadius.circular(14.r),
              borderSide:
                  BorderSide(color: AppColors.error, width: 1.5),
            ),
          ),
        ),
        if (hasError) ...[
          SizedBox(height: 4.h),
          Text(
            error!,
            style: GoogleFonts.tajawal(
                fontSize: 12.sp, color: AppColors.error),
          ),
        ],
      ],
    );
  }
}

// ── Social icon ────────────────────────────────────────────────────────────

class _SocialIcon extends StatelessWidget {
  const _SocialIcon({
    required this.icon,
    required this.url,
    required this.semanticsLabel,
  });

  final IconData icon;
  final String? url;
  final String semanticsLabel;

  bool get _isActive => url != null;

  @override
  Widget build(BuildContext context) {
    final child = Opacity(
      opacity: _isActive ? 1 : 0.45,
      child: Container(
        width: 44.r,
        height: 44.r,
        decoration: BoxDecoration(
          color: AppColors.surface,
          border: Border.all(color: AppColors.divider),
          shape: BoxShape.circle,
        ),
        child: Icon(icon, color: AppColors.textPrimary, size: 20.r),
      ),
    );

    return Semantics(
      label: semanticsLabel,
      button: _isActive,
      enabled: _isActive,
      child: _isActive
          ? Material(
              color: Colors.transparent,
              child: InkWell(
                customBorder: const CircleBorder(),
                onTap: () =>
                    getIt<UrlLauncherHelper>().launchExternalUrl(url!),
                child: child,
              ),
            )
          : child,
    );
  }
}
