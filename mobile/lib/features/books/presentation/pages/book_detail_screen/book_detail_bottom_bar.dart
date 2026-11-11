import 'package:easy_localization/easy_localization.dart';
import 'package:flutter/material.dart';
import 'package:flutter_screenutil/flutter_screenutil.dart';
import 'package:google_fonts/google_fonts.dart';

import '../../../../../core/theme/app_colors.dart';

class BookDetailBottomBar extends StatelessWidget {
  const BookDetailBottomBar({
    super.key,
    required this.saved,
    required this.onToggleSave,
    required this.onDownloadTap,
  });

  final bool saved;
  final VoidCallback onToggleSave;
  final VoidCallback onDownloadTap;

  @override
  Widget build(BuildContext context) {
    return DecoratedBox(
      decoration: BoxDecoration(
        color: AppColors.surface,
        border: Border(top: BorderSide(color: AppColors.divider)),
      ),
      child: SafeArea(
        top: false,
        child: Padding(
          padding: EdgeInsetsDirectional.fromSTEB(16.w, 12.h, 16.w, 12.h),
          child: Row(
            children: [
              IconButton(
                onPressed: onToggleSave,
                style: IconButton.styleFrom(
                  backgroundColor: AppColors.surface,
                  side: BorderSide(color: AppColors.divider),
                  shape: const CircleBorder(),
                  fixedSize: Size(48.w, 48.w),
                ),
                icon: Icon(
                  saved ? Icons.favorite_rounded : Icons.favorite_border_rounded,
                  color: AppColors.primary,
                ),
              ),
              SizedBox(width: 12.w),
              Expanded(
                child: ElevatedButton.icon(
                  onPressed: onDownloadTap,
                  style: ElevatedButton.styleFrom(
                    backgroundColor: AppColors.primary,
                    foregroundColor: Colors.white,
                    minimumSize: Size(double.infinity, 48.h),
                    shape: RoundedRectangleBorder(
                      borderRadius: BorderRadius.circular(12.r),
                    ),
                  ),
                  icon: const Icon(Icons.download_rounded),
                  label: Text(
                    'book_detail.free_download'.tr(),
                    style: GoogleFonts.cairo(
                      fontSize: 15.sp,
                      fontWeight: FontWeight.w700,
                    ),
                  ),
                ),
              ),
            ],
          ),
        ),
      ),
    );
  }
}
