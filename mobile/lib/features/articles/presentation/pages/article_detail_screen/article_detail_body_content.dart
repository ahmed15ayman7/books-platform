import 'package:flutter/material.dart';
import 'package:flutter_markdown/flutter_markdown.dart';
import 'package:flutter_screenutil/flutter_screenutil.dart';
import 'package:google_fonts/google_fonts.dart';
import 'package:url_launcher/url_launcher.dart';

import '../../../../../core/theme/app_colors.dart';

class ArticleDetailBodyContent extends StatelessWidget {
  const ArticleDetailBodyContent({
    super.key,
    required this.paragraphs,
    this.pullQuote,
  });
  final List<String> paragraphs;
  final String? pullQuote;

  @override
  Widget build(BuildContext context) {
    if (paragraphs.isEmpty) return const SizedBox.shrink();

    final children = <Widget>[];
    for (int i = 0; i < paragraphs.length; i++) {
      children.add(_buildMarkdown(paragraphs[i]));
      if (i == 1 && pullQuote != null) {
        children.add(SizedBox(height: 18.h));
        children.add(ArticleDetailPullQuote(text: pullQuote!));
        children.add(SizedBox(height: 18.h));
      } else if (i < paragraphs.length - 1) {
        children.add(SizedBox(height: 16.h));
      }
    }
    // Single-element list = full Markdown doc; pullQuote wasn't hit at i==1,
    // so append it after the content.
    if (pullQuote != null && paragraphs.length <= 1) {
      children.add(SizedBox(height: 18.h));
      children.add(ArticleDetailPullQuote(text: pullQuote!));
    }

    return Column(
      crossAxisAlignment: CrossAxisAlignment.start,
      children: children,
    );
  }

  Widget _buildMarkdown(String data) {
    return MarkdownBody(
      data: data,
      styleSheet: _styleSheet(),
      onTapLink: (_, href, _) async {
        if (href == null) return;
        final uri = Uri.tryParse(href);
        if (uri != null && await canLaunchUrl(uri)) {
          await launchUrl(uri, mode: LaunchMode.externalApplication);
        }
      },
    );
  }

  MarkdownStyleSheet _styleSheet() {
    final body = GoogleFonts.tajawal(
      fontSize: 15.sp,
      color: AppColors.textPrimary,
      height: 1.7,
    );
    final h2 = GoogleFonts.cairo(
      fontSize: 19.sp,
      fontWeight: FontWeight.w700,
      color: AppColors.textPrimary,
      height: 1.4,
    );
    final h3 = GoogleFonts.cairo(
      fontSize: 16.sp,
      fontWeight: FontWeight.w600,
      color: AppColors.textPrimary,
      height: 1.4,
    );
    return MarkdownStyleSheet(
      p: body,
      h1: h2.copyWith(fontSize: 22.sp),
      h2: h2,
      h3: h3,
      h4: h3.copyWith(fontSize: 15.sp),
      strong: body.copyWith(fontWeight: FontWeight.w700),
      em: body.copyWith(fontStyle: FontStyle.italic),
      a: body.copyWith(
        color: AppColors.primary,
        decoration: TextDecoration.underline,
        decorationColor: AppColors.primary,
      ),
      blockquote: body.copyWith(
        color: AppColors.textSecondary,
        fontStyle: FontStyle.italic,
      ),
      blockquoteDecoration: BoxDecoration(
        color: AppColors.brandRedSoft,
        borderRadius: BorderRadius.circular(8.r),
        border: BorderDirectional(
          start: BorderSide(color: AppColors.primary, width: 3.w),
        ),
      ),
      blockquotePadding: EdgeInsets.symmetric(horizontal: 12.w, vertical: 8.h),
      listBullet: body,
      tableHead: body.copyWith(fontWeight: FontWeight.w700),
      tableBody: body,
    );
  }
}

class ArticleDetailPullQuote extends StatelessWidget {
  const ArticleDetailPullQuote({super.key, required this.text});
  final String text;

  @override
  Widget build(BuildContext context) {
    return Container(
      padding: EdgeInsetsDirectional.fromSTEB(16.w, 14.h, 16.w, 14.h),
      decoration: BoxDecoration(
        color: AppColors.brandRedSoft,
        borderRadius: BorderRadius.circular(12.r),
        border: BorderDirectional(
          start: BorderSide(color: AppColors.primary, width: 4.w),
        ),
      ),
      child: Text(
        text,
        style: GoogleFonts.cairo(
          fontSize: 16.sp,
          fontWeight: FontWeight.w700,
          color: AppColors.primary,
          height: 1.6,
        ),
      ),
    );
  }
}
