import 'package:cached_network_image/cached_network_image.dart';
import 'package:flutter/material.dart';
import 'package:flutter_screenutil/flutter_screenutil.dart';
import 'package:google_fonts/google_fonts.dart';

import '../theme/app_colors.dart';

/// Book cover that fills its frame with the photo ([BoxFit.cover]).
/// Used where the cover should bleed edge-to-edge (hero banners, detail header).
/// For list cards that must show the full image, use [BookCoverWidget] instead.
class BookCoverFilledWidget extends StatelessWidget {
  const BookCoverFilledWidget({
    super.key,
    required this.coverColors,
    required this.titleAr,
    required this.titleEn,
    required this.publisher,
    this.imageUrl,
  });

  final List<Color> coverColors;
  final String titleAr;
  final String titleEn;
  final String publisher;
  final String? imageUrl;

  @override
  Widget build(BuildContext context) {
    final gradient = LinearGradient(
      begin: AlignmentDirectional.topStart,
      end: AlignmentDirectional.bottomEnd,
      colors: coverColors.length >= 2
          ? [coverColors[1], coverColors[0]]
          : [AppColors.secondary, AppColors.primary],
    );

    return Container(
      decoration: BoxDecoration(gradient: gradient),
      child: Stack(
        children: [
          PositionedDirectional(
            end: 0,
            top: 0,
            bottom: 0,
            child: Container(
              width: 6.w,
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
          Positioned.fill(
            child: Padding(
              padding: EdgeInsetsDirectional.fromSTEB(
                14.w, 12.h, 14.w, 12.h,
              ),
              child: Column(
                crossAxisAlignment: CrossAxisAlignment.start,
                children: [
                  Text(
                    publisher.toUpperCase(),
                    style: GoogleFonts.inter(
                      fontSize: 8.sp,
                      fontWeight: FontWeight.w700,
                      color: Colors.white.withValues(alpha: 0.65),
                      letterSpacing: 0.12 * 8.sp,
                    ),
                    maxLines: 1,
                    overflow: TextOverflow.ellipsis,
                  ),
                  const Spacer(),
                  Text(
                    titleAr,
                    style: GoogleFonts.cairo(
                      fontSize: 14.sp,
                      fontWeight: FontWeight.w700,
                      color: Colors.white,
                      height: 1.35,
                      shadows: [
                        Shadow(
                          color: Colors.black.withValues(alpha: 0.3),
                          blurRadius: 8,
                        ),
                      ],
                    ),
                    maxLines: 3,
                    overflow: TextOverflow.ellipsis,
                  ),
                  SizedBox(height: 4.h),
                  Text(
                    titleEn,
                    style: GoogleFonts.inter(
                      fontSize: 9.sp,
                      fontWeight: FontWeight.w400,
                      color: Colors.white.withValues(alpha: 0.7),
                      fontStyle: FontStyle.italic,
                    ),
                    maxLines: 1,
                    overflow: TextOverflow.ellipsis,
                  ),
                ],
              ),
            ),
          ),
          if (imageUrl != null)
            Positioned.fill(
              child: CachedNetworkImage(
                imageUrl: imageUrl!,
                fit: BoxFit.cover,
                placeholder: (_, _) => const SizedBox.shrink(),
                errorWidget: (_, _, _) => const SizedBox.shrink(),
              ),
            ),
        ],
      ),
    );
  }
}
