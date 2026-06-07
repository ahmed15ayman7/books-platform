import 'package:cached_network_image/cached_network_image.dart';
import 'package:flutter/material.dart';
import 'package:google_fonts/google_fonts.dart';

import '../theme/app_colors.dart';

class NetworkAvatarWidget extends StatelessWidget {
  const NetworkAvatarWidget({
    super.key,
    required this.size,
    required this.initials,
    this.imageUrl,
    this.borderRadius,
    this.backgroundColor = AppColors.secondary,
    this.initialsColor = Colors.white,
    this.initialsFontSize,
  });

  final double size;
  final String initials;
  final String? imageUrl;
  final BorderRadius? borderRadius;
  final Color backgroundColor;
  final Color initialsColor;
  final double? initialsFontSize;

  @override
  Widget build(BuildContext context) {
    final radius = borderRadius ?? BorderRadius.circular(size / 2);
    final hasImage = imageUrl != null && imageUrl!.isNotEmpty;

    return Container(
      width: size,
      height: size,
      decoration: BoxDecoration(
        color: backgroundColor,
        borderRadius: radius,
      ),
      clipBehavior: Clip.antiAlias,
      child: hasImage
          ? CachedNetworkImage(
              imageUrl: imageUrl!,
              fit: BoxFit.cover,
              placeholder: (_, _) => _initials(),
              errorWidget: (_, _, _) => _initials(),
            )
          : _initials(),
    );
  }

  Widget _initials() => Center(
        child: Text(
          initials,
          style: GoogleFonts.cairo(
            fontSize: initialsFontSize ?? size * 0.35,
            fontWeight: FontWeight.w800,
            color: initialsColor,
          ),
        ),
      );
}
