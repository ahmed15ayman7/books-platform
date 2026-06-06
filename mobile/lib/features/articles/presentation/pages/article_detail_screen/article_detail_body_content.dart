import 'package:easy_localization/easy_localization.dart';
import 'package:flutter/material.dart';
import 'package:flutter_markdown/flutter_markdown.dart';
import 'package:flutter_screenutil/flutter_screenutil.dart';
import 'package:google_fonts/google_fonts.dart';
import 'package:url_launcher/url_launcher.dart';

import '../../../../../core/theme/app_colors.dart';

const _kCollapseThreshold = 250;
const _kCollapsedHeight = 120.0;

class ArticleDetailBodyContent extends StatefulWidget {
  const ArticleDetailBodyContent({
    super.key,
    required this.paragraphs,
    this.pullQuote,
  });
  final List<String> paragraphs;
  final String? pullQuote;

  @override
  State<ArticleDetailBodyContent> createState() =>
      _ArticleDetailBodyContentState();
}

class _ArticleDetailBodyContentState extends State<ArticleDetailBodyContent> {
  bool _expanded = false;

  bool get _isLong =>
      widget.paragraphs.fold(0, (sum, p) => sum + p.length) >
      _kCollapseThreshold;

  @override
  Widget build(BuildContext context) {
    if (widget.paragraphs.isEmpty) return const SizedBox.shrink();

    final contentColumn = _buildContentColumn();

    if (!_isLong) return contentColumn;

    return Column(
      crossAxisAlignment: CrossAxisAlignment.start,
      children: [
        if (_expanded)
          contentColumn
        else
          _CollapsedContent(child: contentColumn),
        SizedBox(height: 12.h),
        _ToggleButton(
          expanded: _expanded,
          onTap: () => setState(() => _expanded = !_expanded),
        ),
      ],
    );
  }

  Widget _buildContentColumn() {
    final children = <Widget>[];
    for (int i = 0; i < widget.paragraphs.length; i++) {
      children.add(_buildMarkdown(widget.paragraphs[i]));
      if (i == 1 && widget.pullQuote != null) {
        children.add(SizedBox(height: 18.h));
        children.add(ArticleDetailPullQuote(text: widget.pullQuote!));
        children.add(SizedBox(height: 18.h));
      } else if (i < widget.paragraphs.length - 1) {
        children.add(SizedBox(height: 16.h));
      }
    }
    if (widget.pullQuote != null && widget.paragraphs.length <= 1) {
      children.add(SizedBox(height: 18.h));
      children.add(ArticleDetailPullQuote(text: widget.pullQuote!));
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

class _CollapsedContent extends StatelessWidget {
  const _CollapsedContent({required this.child});
  final Widget child;

  @override
  Widget build(BuildContext context) {
    return SizedBox(
      height: _kCollapsedHeight.h,
      child: ShaderMask(
        shaderCallback: (bounds) => LinearGradient(
          begin: Alignment.topCenter,
          end: Alignment.bottomCenter,
          stops: const [0.5, 1.0],
          colors: [Colors.white, Colors.white.withValues(alpha: 0)],
        ).createShader(bounds),
        blendMode: BlendMode.dstIn,
        child: OverflowBox(
          alignment: Alignment.topCenter,
          maxHeight: double.infinity,
          child: child,
        ),
      ),
    );
  }
}

class _ToggleButton extends StatelessWidget {
  const _ToggleButton({required this.expanded, required this.onTap});
  final bool expanded;
  final VoidCallback onTap;

  @override
  Widget build(BuildContext context) {
    return GestureDetector(
      onTap: onTap,
      child: Row(
        mainAxisSize: MainAxisSize.min,
        children: [
          Text(
            expanded ? 'articles.see_less'.tr() : 'articles.see_more'.tr(),
            style: GoogleFonts.cairo(
              fontSize: 14.sp,
              fontWeight: FontWeight.w700,
              color: AppColors.primary,
            ),
          ),
          SizedBox(width: 4.w),
          Icon(
            expanded
                ? Icons.keyboard_arrow_up_rounded
                : Icons.keyboard_arrow_down_rounded,
            color: AppColors.primary,
            size: 18.r,
          ),
        ],
      ),
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
