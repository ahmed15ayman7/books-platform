import 'package:cached_network_image/cached_network_image.dart';
import 'package:flutter/material.dart';
import 'package:flutter_screenutil/flutter_screenutil.dart';
import 'package:google_fonts/google_fonts.dart';

import 'package:booksplatform/core/theme/app_colors.dart';
import 'package:booksplatform/core/theme/app_shadows.dart';

import '../../../domain/entities/media_item.dart';

class MediaVideoCard extends StatelessWidget {
  const MediaVideoCard({
    super.key,
    required this.item,
    required this.locale,
    required this.onTap,
  });

  final MediaItem item;
  final String locale;
  final VoidCallback onTap;

  @override
  Widget build(BuildContext context) {
    final ar = locale == 'ar';
    return GestureDetector(
      onTap: onTap,
      child: Container(
        decoration: BoxDecoration(
          color: AppColors.surface,
          border: Border.all(color: AppColors.divider),
          borderRadius: BorderRadius.circular(16.r),
          boxShadow: AppShadows.soft,
        ),
        clipBehavior: Clip.hardEdge,
        child: Column(
          crossAxisAlignment: CrossAxisAlignment.start,
          children: [
            Stack(
              alignment: Alignment.center,
              children: [
                AspectRatio(
                  aspectRatio: 16 / 9,
                  child: CachedNetworkImage(
                    imageUrl: item.imageUrl,
                    fit: BoxFit.cover,
                    placeholder: (_, _) => Container(color: AppColors.shimmerBase),
                    errorWidget: (_, _, _) => Container(
                      color: AppColors.shimmerBase,
                      child: Icon(
                        Icons.play_circle_outline_rounded,
                        size: 48.r,
                        color: AppColors.textHint,
                      ),
                    ),
                  ),
                ),
                Container(
                  width: 48.r,
                  height: 48.r,
                  decoration: BoxDecoration(
                    color: Colors.white.withValues(alpha: 0.9),
                    shape: BoxShape.circle,
                    boxShadow: [
                      BoxShadow(
                        color: Colors.black.withValues(alpha: 0.2),
                        blurRadius: 8,
                        offset: const Offset(0, 2),
                      ),
                    ],
                  ),
                  child: Icon(
                    Icons.play_arrow_rounded,
                    size: 28.r,
                    color: AppColors.primary,
                  ),
                ),
              ],
            ),
            Padding(
              padding: EdgeInsetsDirectional.fromSTEB(12.w, 10.h, 12.w, 12.h),
              child: Column(
                crossAxisAlignment: CrossAxisAlignment.start,
                children: [
                  Text(
                    item.title,
                    style: GoogleFonts.cairo(
                      fontSize: 14.5.sp,
                      fontWeight: FontWeight.w700,
                      color: AppColors.textPrimary,
                      height: 1.45,
                    ),
                    maxLines: 2,
                    overflow: TextOverflow.ellipsis,
                  ),
                  SizedBox(height: 5.h),
                  Text(
                    '${ar && item.channelLabelAr.isNotEmpty ? item.channelLabelAr : item.channelLabel} · ${item.date}',
                    textDirection: TextDirection.ltr,
                    style: GoogleFonts.inter(
                      fontSize: 11.sp,
                      color: AppColors.textHint,
                    ),
                  ),
                ],
              ),
            ),
          ],
        ),
      ),
    );
  }
}
