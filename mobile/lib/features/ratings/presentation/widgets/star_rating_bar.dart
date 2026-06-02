import 'package:flutter/material.dart';
import 'package:flutter_screenutil/flutter_screenutil.dart';

import '../../../../core/theme/app_colors.dart';

class StarRatingBar extends StatelessWidget {
  const StarRatingBar({
    super.key,
    required this.rating,
    this.interactive = false,
    this.onRatingSelected,
    this.size,
  });

  final double rating;
  final bool interactive;
  final ValueChanged<int>? onRatingSelected;
  final double? size;

  @override
  Widget build(BuildContext context) {
    final starSize = size ?? 24.r;
    return Row(
      mainAxisSize: MainAxisSize.min,
      children: List.generate(5, (index) {
        final starIndex = index + 1;
        final filled = rating >= starIndex;
        final halfFilled = !filled && rating >= starIndex - 0.5;
        return GestureDetector(
          onTap: interactive ? () => onRatingSelected?.call(starIndex) : null,
          child: Icon(
            filled
                ? Icons.star_rounded
                : halfFilled
                    ? Icons.star_half_rounded
                    : Icons.star_outline_rounded,
            size: starSize,
            color: AppColors.warning,
          ),
        );
      }),
    );
  }
}
