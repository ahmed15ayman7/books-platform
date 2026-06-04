import 'package:easy_localization/easy_localization.dart';
import 'package:flutter/material.dart';
import 'package:flutter_bloc/flutter_bloc.dart';
import 'package:flutter_screenutil/flutter_screenutil.dart';
import 'package:google_fonts/google_fonts.dart';

import '../../../../core/di/injection_container.dart';
import '../../../../core/helpers/regex_helper.dart';
import '../../../../core/helpers/snack_bar_helper.dart';
import '../../../../core/theme/app_colors.dart';
import '../../../../core/widgets/app_text_field.dart';
import '../cubit/comments_cubit.dart';
import '../cubit/comments_state.dart';

class CommentForm extends StatefulWidget {
  const CommentForm({super.key, this.productId, this.articleId});

  final String? productId;
  final String? articleId;

  @override
  State<CommentForm> createState() => _CommentFormState();
}

class _CommentFormState extends State<CommentForm> {
  final _formKey = GlobalKey<FormState>();
  final _nameCtrl = TextEditingController();
  final _emailCtrl = TextEditingController();
  final _commentCtrl = TextEditingController();
  bool _attempted = false;

  @override
  void dispose() {
    _nameCtrl.dispose();
    _emailCtrl.dispose();
    _commentCtrl.dispose();
    super.dispose();
  }

  void _submit(BuildContext context) {
    setState(() => _attempted = true);
    if (_formKey.currentState?.validate() != true) return;
    context.read<CommentsCubit>().submitComment(
          authorName: _nameCtrl.text.trim(),
          email: _emailCtrl.text.trim(),
          content: _commentCtrl.text.trim(),
          productId: widget.productId,
          articleId: widget.articleId,
        );
  }

  @override
  Widget build(BuildContext context) {
    return BlocConsumer<CommentsCubit, CommentsState>(
      listener: (context, state) {
        if (state is CommentsSubmitted) {
          _nameCtrl.clear();
          _emailCtrl.clear();
          _commentCtrl.clear();
          setState(() => _attempted = false);
          getIt<SnackBarHelper>().showSuccess('comments_submitted'.tr());
        }
      },
      builder: (context, state) {
        return Form(
          key: _formKey,
          autovalidateMode: _attempted
              ? AutovalidateMode.onUserInteraction
              : AutovalidateMode.disabled,
          child: Column(
            crossAxisAlignment: CrossAxisAlignment.start,
            children: [
              Text(
                'comments_leave_comment'.tr(),
                style: GoogleFonts.cairo(
                  fontSize: 16.sp,
                  fontWeight: FontWeight.w700,
                  color: AppColors.textPrimary,
                ),
              ),
              SizedBox(height: 12.h),
              AppTextField(
                controller: _nameCtrl,
                label: 'comments_author_name'.tr(),
                validator: (v) {
                  if (v == null || v.trim().length < 2) return 'comments_name_error'.tr();
                  if (v.trim().length > 100) return 'comments_name_too_long'.tr();
                  return null;
                },
              ),
              SizedBox(height: 10.h),
              AppTextField(
                controller: _emailCtrl,
                label: 'comments_email'.tr(),
                keyboardType: TextInputType.emailAddress,
                validator: (v) {
                  if (v == null || !RegexHelper.validate(RegexHelper.email, v.trim())) {
                    return 'comments_email_error'.tr();
                  }
                  return null;
                },
              ),
              SizedBox(height: 10.h),
              AppTextField(
                controller: _commentCtrl,
                label: 'comments_content'.tr(),
                maxLines: 4,
                maxLength: 2000,
                validator: (v) {
                  if (v == null || v.trim().length < 10) return 'comments_too_short'.tr();
                  return null;
                },
              ),
              SizedBox(height: 12.h),
              ElevatedButton(
                onPressed: state is CommentsSubmitting ? null : () => _submit(context),
                style: ElevatedButton.styleFrom(
                  backgroundColor: AppColors.primary,
                  foregroundColor: Colors.white,
                  minimumSize: Size(double.infinity, 44.h),
                  shape: RoundedRectangleBorder(
                    borderRadius: BorderRadius.circular(10.r),
                  ),
                ),
                child: state is CommentsSubmitting
                    ? const CircularProgressIndicator(color: Colors.white)
                    : Text('comments_submit'.tr(),
                        style: GoogleFonts.cairo(fontWeight: FontWeight.w600)),
              ),
            ],
          ),
        );
      },
    );
  }
}
