import 'package:flutter/material.dart';
import 'package:flutter_bloc/flutter_bloc.dart';
import 'package:flutter_screenutil/flutter_screenutil.dart';
import 'package:google_fonts/google_fonts.dart';

import 'package:booksplatform/core/router/app_routes.dart';
import 'package:booksplatform/core/router/args/book_detail_args.dart';
import 'package:booksplatform/core/theme/app_colors.dart';
import 'package:booksplatform/core/widgets/book_cover_widget.dart';

import '../../../cubit/wishlist_cubit.dart';
import '../../../../domain/entities/wishlist_item.dart';

class WishlistItemCard extends StatelessWidget {
  const WishlistItemCard({super.key, required this.item});

  final WishlistItem item;

  @override
  Widget build(BuildContext context) {
    // $mobile-debug-skill | Problem: card only had slug → fed slug as titleAr to BookCoverWidget (overflow) and imageUrl was null. Fix: card now takes WishlistItem with real title and imageUrl stored at add-time.
    final displayTitle = item.titleAr.isNotEmpty ? item.titleAr : item.bookSlug;
    return Dismissible(
      key: Key(item.bookSlug),
      direction: DismissDirection.endToStart,
      onDismissed: (_) => context.read<WishlistCubit>().toggle(item),
      background: Container(
        alignment: AlignmentDirectional.centerEnd,
        color: AppColors.error,
        padding: EdgeInsetsDirectional.only(end: 20.w),
        child: Icon(Icons.delete_outline_rounded, color: Colors.white, size: 24.r),
      ),
      child: InkWell(
        onTap: () => Navigator.of(context).pushNamed(
          AppRoutes.bookDetail,
          arguments: BookDetailArgs(slug: item.bookSlug, titleAr: displayTitle),
        ),
        child: Padding(
          padding: EdgeInsetsDirectional.symmetric(horizontal: 16.w, vertical: 8.h),
          child: Row(
            children: [
              SizedBox(
                width: 60.w,
                child: AspectRatio(
                  aspectRatio: 3 / 4,
                  child: BookCoverWidget(
                    coverColors: const [Color(0xFF2B2540), Color(0xFF46467F)],
                    titleAr: item.titleAr,
                    titleEn: item.titleEn,
                    publisher: '',
                    imageUrl: item.imageUrl,
                    borderRadius: 6,
                  ),
                ),
              ),
              SizedBox(width: 12.w),
              Expanded(
                child: Text(
                  displayTitle,
                  style: GoogleFonts.cairo(
                    fontSize: 14.sp,
                    fontWeight: FontWeight.w600,
                    color: AppColors.textPrimary,
                  ),
                  maxLines: 2,
                  overflow: TextOverflow.ellipsis,
                ),
              ),
              Icon(Icons.chevron_right_rounded, color: AppColors.textSecondary, size: 20.r),
            ],
          ),
        ),
      ),
    );
  }
}
