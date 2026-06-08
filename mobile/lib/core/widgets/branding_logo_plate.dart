import 'package:flutter/material.dart';
import 'package:flutter_screenutil/flutter_screenutil.dart';

import '../constants/app_constants.dart';
import '../theme/app_colors.dart';

class BrandingLogoPlate extends StatelessWidget {
  const BrandingLogoPlate({super.key, this.logoWidth});

  final double? logoWidth;

  @override
  Widget build(BuildContext context) {
    return ColoredBox(
      color: AppColors.secondary,
      child: Center(
        child: Image.asset(
          kBrandingLogoAsset,
          width: logoWidth ?? kHeroCarouselBrandingLogoWidth.w,
        ),
      ),
    );
  }
}
