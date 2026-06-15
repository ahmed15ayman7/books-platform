import 'dart:async';

import 'package:easy_localization/easy_localization.dart';
import 'package:flutter/material.dart';
import 'package:flutter_bloc/flutter_bloc.dart';
import 'package:flutter_screenutil/flutter_screenutil.dart';

import 'package:booksplatform/core/di/injection_container.dart';
import 'package:booksplatform/core/helpers/regex_helper.dart';
import 'package:booksplatform/core/helpers/snack_bar_helper.dart';
import 'package:booksplatform/core/theme/app_colors.dart';
import 'package:booksplatform/core/theme/app_text_styles.dart';
import 'package:booksplatform/core/widgets/app_text_field.dart';

import '../cubit/newsletter_cubit.dart';
import '../cubit/newsletter_state.dart';

class NewsletterBottomSheet extends StatelessWidget {
  const NewsletterBottomSheet({super.key});

  @override
  Widget build(BuildContext context) {
    return BlocProvider(
      create: (_) => getIt<NewsletterCubit>(),
      child: const _NewsletterSheetContent(),
    );
  }
}

class _NewsletterSheetContent extends StatefulWidget {
  const _NewsletterSheetContent();

  @override
  State<_NewsletterSheetContent> createState() =>
      _NewsletterSheetContentState();
}

class _NewsletterSheetContentState extends State<_NewsletterSheetContent> {
  final _emailCtrl = TextEditingController();
  final _formKey = GlobalKey<FormState>();
  String _selectedLocale = 'ar';
  bool _showResend = false;
  Timer? _resendTimer;
  bool _localeInitialized = false;

  @override
  void initState() {
    super.initState();
  }

  @override
  void didChangeDependencies() {
    super.didChangeDependencies();
    // $mobile-debug-skill | Problem: context.locale in initState() called dependOnInheritedWidgetOfExactType before widget was mounted, crashing the bottom sheet. Fix: moved one-time locale read to didChangeDependencies, guarded by a flag so user selection isn't reset on subsequent dependency changes.
    if (!_localeInitialized) {
      _selectedLocale = context.locale.languageCode;
      _localeInitialized = true;
    }
  }

  @override
  void dispose() {
    _emailCtrl.dispose();
    _resendTimer?.cancel();
    super.dispose();
  }

  void _subscribe() {
    if (!(_formKey.currentState?.validate() ?? false)) return;
    context
        .read<NewsletterCubit>()
        .subscribe(_emailCtrl.text.trim(), _selectedLocale);
    _resendTimer?.cancel();
    _showResend = false;
    _resendTimer = Timer(const Duration(seconds: 60), () {
      if (mounted) setState(() => _showResend = true);
    });
  }

  @override
  Widget build(BuildContext context) {
    return BlocListener<NewsletterCubit, NewsletterState>(
      listener: (ctx, state) {
        debugPrint('[Newsletter] listener state: $state');
        if (state is NewsletterSuccess) {
          _resendTimer?.cancel();
          debugPrint('[Newsletter] success → popping sheet');
          Navigator.of(ctx).pop();
          debugPrint('[Newsletter] pop called → showing snackbar');
          getIt<SnackBarHelper>().showSuccess(state.message);
        } else if (state is NewsletterError) {
          debugPrint('[Newsletter] error → ${state.message}');
          getIt<SnackBarHelper>().showError(state.message);
        }
      },
      child: Padding(
        padding: EdgeInsetsDirectional.fromSTEB(
          20.w,
          8.h,
          20.w,
          MediaQuery.of(context).viewInsets.bottom + 16.h,
        ),
        child: Form(
          key: _formKey,
          child: Column(
            mainAxisSize: MainAxisSize.min,
            crossAxisAlignment: CrossAxisAlignment.stretch,
            children: [
              Text(
                'newsletter_title'.tr(),
                style: AppTextStyles.titleMedium,
              ),
              SizedBox(height: 6.h),
              Text(
                'newsletter_subtitle'.tr(),
                style: AppTextStyles.bodyMedium.copyWith(
                  color: AppColors.textSecondary,
                ),
              ),
              SizedBox(height: 16.h),
              // AR/EN locale toggle
              Row(
                children: [
                  _LocaleChip(
                    label: 'arabic'.tr(),
                    selected: _selectedLocale == 'ar',
                    onTap: () => setState(() => _selectedLocale = 'ar'),
                  ),
                  SizedBox(width: 8.w),
                  _LocaleChip(
                    label: 'english'.tr(),
                    selected: _selectedLocale == 'en',
                    onTap: () => setState(() => _selectedLocale = 'en'),
                  ),
                ],
              ),
              SizedBox(height: 14.h),
              AppTextField(
                controller: _emailCtrl,
                hint: 'newsletter_email_hint'.tr(),
                keyboardType: TextInputType.emailAddress,
                textInputAction: TextInputAction.done,
                maxLength: 254,
                onFieldSubmitted: (_) => _subscribe(),
                validator: RegexHelper.emailValidator,
              ),
              SizedBox(height: 14.h),
              BlocBuilder<NewsletterCubit, NewsletterState>(
                builder: (_, state) => ElevatedButton(
                  onPressed:
                      state is NewsletterLoading ? null : _subscribe,
                  child: state is NewsletterLoading
                      ? SizedBox(
                          width: 20.w,
                          height: 20.w,
                          child: const CircularProgressIndicator(
                            strokeWidth: 2,
                            color: Colors.white,
                          ),
                        )
                      : Text('newsletter_subscribe'.tr()),
                ),
              ),
              if (_showResend) ...[
                SizedBox(height: 8.h),
                TextButton(
                  onPressed: _subscribe,
                  child: Text('newsletter_resend'.tr()),
                ),
              ],
            ],
          ),
        ),
      ),
    );
  }
}

class _LocaleChip extends StatelessWidget {
  const _LocaleChip({
    required this.label,
    required this.selected,
    required this.onTap,
  });

  final String label;
  final bool selected;
  final VoidCallback onTap;

  @override
  Widget build(BuildContext context) {
    return GestureDetector(
      onTap: onTap,
      child: Container(
        padding: EdgeInsetsDirectional.symmetric(horizontal: 12.w, vertical: 6.h),
        decoration: BoxDecoration(
          color: selected ? AppColors.primary : AppColors.inputFill,
          borderRadius: BorderRadius.circular(20.r),
        ),
        child: Text(
          label,
          style: AppTextStyles.labelLarge.copyWith(
            color: selected ? Colors.white : AppColors.textSecondary,
          ),
        ),
      ),
    );
  }
}
