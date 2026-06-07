import 'package:flutter/material.dart';
import 'package:flutter_screenutil/flutter_screenutil.dart';
import 'package:google_fonts/google_fonts.dart';

import '../theme/app_colors.dart';

const kExpandableContentThreshold = 250;
const kExpandableContentCollapsedHeight = 200.0;

class ExpandableContent extends StatefulWidget {
  const ExpandableContent({
    super.key,
    required this.child,
    required this.isLong,
    required this.seeMoreLabel,
    required this.seeLessLabel,
    this.fadeColor = AppColors.background,
  });

  final Widget child;
  final bool isLong;
  final String seeMoreLabel;
  final String seeLessLabel;
  final Color fadeColor;

  static bool isTextLong(String text) =>
      text.trim().length > kExpandableContentThreshold;

  static bool areParagraphsLong(List<String> paragraphs) =>
      paragraphs.fold(0, (sum, p) => sum + p.length) >
      kExpandableContentThreshold;

  @override
  State<ExpandableContent> createState() => _ExpandableContentState();
}

class _ExpandableContentState extends State<ExpandableContent> {
  bool _expanded = false;

  @override
  Widget build(BuildContext context) {
    if (!widget.isLong) return widget.child;

    return Column(
      crossAxisAlignment: CrossAxisAlignment.start,
      children: [
        if (_expanded)
          widget.child
        else
          _CollapsedContent(
            fadeColor: widget.fadeColor,
            child: widget.child,
          ),
        SizedBox(height: 12.h),
        GestureDetector(
          onTap: () => setState(() => _expanded = !_expanded),
          child: Row(
            mainAxisSize: MainAxisSize.min,
            children: [
              Text(
                _expanded ? widget.seeLessLabel : widget.seeMoreLabel,
                style: GoogleFonts.cairo(
                  fontSize: 14.sp,
                  fontWeight: FontWeight.w700,
                  color: AppColors.primary,
                ),
              ),
              SizedBox(width: 4.w),
              Icon(
                _expanded
                    ? Icons.keyboard_arrow_up_rounded
                    : Icons.keyboard_arrow_down_rounded,
                color: AppColors.primary,
                size: 18.r,
              ),
            ],
          ),
        ),
      ],
    );
  }
}

class _CollapsedContent extends StatelessWidget {
  const _CollapsedContent({
    required this.child,
    required this.fadeColor,
  });

  final Widget child;
  final Color fadeColor;

  @override
  Widget build(BuildContext context) {
    return Stack(
      children: [
        ClipRect(
          child: SizedBox(
            height: kExpandableContentCollapsedHeight.h,
            child: OverflowBox(
              alignment: Alignment.topCenter,
              maxHeight: double.infinity,
              child: child,
            ),
          ),
        ),
        Positioned(
          bottom: 0,
          left: 0,
          right: 0,
          height: 72.h,
          child: DecoratedBox(
            decoration: BoxDecoration(
              gradient: LinearGradient(
                begin: Alignment.topCenter,
                end: Alignment.bottomCenter,
                colors: [
                  fadeColor.withValues(alpha: 0),
                  fadeColor,
                ],
              ),
            ),
          ),
        ),
      ],
    );
  }
}
