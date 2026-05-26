import 'package:flutter/material.dart';
import 'package:flutter_screenutil/flutter_screenutil.dart';

import '../theme/app_colors.dart';

class AppLoadingIndicator extends StatelessWidget {
  final Color? color;
  final double? size;

  const AppLoadingIndicator({super.key, this.color, this.size});

  @override
  Widget build(BuildContext context) {
    return Center(
      child: SizedBox(
        width: size ?? 32.w,
        height: size ?? 32.w,
        child: CircularProgressIndicator(
          color: color ?? AppColors.primary,
          strokeWidth: 2.5,
        ),
      ),
    );
  }
}
