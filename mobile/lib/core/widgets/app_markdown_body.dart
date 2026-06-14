import 'package:flutter/material.dart';
import 'package:flutter_markdown/flutter_markdown.dart';
import 'package:flutter_screenutil/flutter_screenutil.dart';
import 'package:google_fonts/google_fonts.dart';
import 'package:url_launcher/url_launcher.dart';

import '../theme/app_colors.dart';

class AppMarkdownBody extends StatelessWidget {
  const AppMarkdownBody({
    super.key,
    required this.data,
    this.shrinkWrap = true,
  });

  final String data;
  final bool shrinkWrap;

  @override
  Widget build(BuildContext context) {
    return MarkdownBody(
      data: data,
      shrinkWrap: shrinkWrap,
      styleSheet: _styleSheet(),
      onTapLink: (text, href, title) async {
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
    final heading = GoogleFonts.cairo(
      fontSize: 17.sp,
      fontWeight: FontWeight.w700,
      color: AppColors.textPrimary,
      height: 1.35,
    );
    return MarkdownStyleSheet(
      p: body,
      h1: heading.copyWith(fontSize: 22.sp, fontWeight: FontWeight.w800),
      h2: heading,
      h3: heading.copyWith(fontSize: 16.sp, fontWeight: FontWeight.w600),
      listBullet: body,
      strong: body.copyWith(fontWeight: FontWeight.w700),
      a: GoogleFonts.inter(
        fontSize: 15.sp,
        color: AppColors.primary,
        decoration: TextDecoration.underline,
        decorationColor: AppColors.primary,
      ),
      blockSpacing: 12.h,
      listIndent: 20.w,
    );
  }
}
