import 'package:cached_network_image/cached_network_image.dart';
import 'package:flutter/material.dart';
import 'package:flutter_screenutil/flutter_screenutil.dart';

import '../../../../../core/theme/app_colors.dart';

/// Compact book cover thumbnail for search result rows.
/// Renders the cover image when available, falling back to the gradient.
/// No text overlay — title and publisher are shown in the row beside it.
class SearchBookThumbnail extends StatelessWidget {
  const SearchBookThumbnail({
    super.key,
    required this.coverColors,
    this.imageUrl,
    this.borderRadius = 6,
  });

  final List<Color> coverColors;
  final String? imageUrl;
  final double borderRadius;

  @override
  Widget build(BuildContext context) {
    final gradient = LinearGradient(
      begin: AlignmentDirectional.topStart,
      end: AlignmentDirectional.bottomEnd,
      colors: coverColors.length >= 2
          ? [coverColors[1], coverColors[0]]
          : [AppColors.secondary, AppColors.primary],
    );

    return ClipRRect(
      borderRadius: BorderRadius.circular(borderRadius.r),
      child: Stack(
        fit: StackFit.expand,
        children: [
          Container(decoration: BoxDecoration(gradient: gradient)),
          PositionedDirectional(
            end: 0,
            top: 0,
            bottom: 0,
            child: Container(
              width: 4.w,
              decoration: BoxDecoration(
                color: Colors.black.withValues(alpha: 0.22),
                boxShadow: [
                  BoxShadow(
                    color: Colors.white.withValues(alpha: 0.15),
                    blurRadius: 2,
                    offset: const Offset(-1, 0),
                  ),
                ],
              ),
            ),
          ),
          if (imageUrl != null)
            CachedNetworkImage(
              imageUrl: imageUrl!,
              fit: BoxFit.cover,
              placeholder: (_, _) => const SizedBox.shrink(),
              errorWidget: (_, _, _) => const SizedBox.shrink(),
            ),
        ],
      ),
    );
  }
}
