import 'package:flutter/material.dart';
import 'package:flutter_bloc/flutter_bloc.dart';
import 'package:flutter_screenutil/flutter_screenutil.dart';
import 'package:google_fonts/google_fonts.dart';

import '../../../../../core/theme/app_colors.dart';
import '../../../../../core/widgets/book_cover_widget.dart';
import '../../../domain/entities/cart_item.dart';
import '../../cubit/cart_cubit.dart';

class CartLineItem extends StatelessWidget {
  const CartLineItem({super.key, required this.item, required this.locale});
  final CartItem item;
  final String locale;

  @override
  Widget build(BuildContext context) {
    final cart = context.read<CartCubit>();
    return Container(
      padding: EdgeInsetsDirectional.all(12.r),
      decoration: BoxDecoration(
        color: AppColors.surface,
        border: Border.all(color: AppColors.divider),
        borderRadius: BorderRadius.circular(18.r),
        boxShadow: const [
          BoxShadow(
            color: Color(0x0A000000),
            blurRadius: 24,
            offset: Offset(0, 4),
          ),
        ],
      ),
      child: Row(
        children: [
          SizedBox(
            width: 60.w,
            child: AspectRatio(
              aspectRatio: 3 / 4,
              child: ClipRRect(
                borderRadius: BorderRadius.circular(8.r),
                child: BookCoverWidget(
                  coverColors: item.book.coverColors,
                  titleAr: item.book.titleAr,
                  titleEn: item.book.titleEn,
                  publisher: item.book.publisher,
                ),
              ),
            ),
          ),
          SizedBox(width: 13.w),
          Expanded(
            child: Column(
              crossAxisAlignment: CrossAxisAlignment.start,
              children: [
                Row(
                  crossAxisAlignment: CrossAxisAlignment.start,
                  children: [
                    Expanded(
                      child: Text(
                        item.book.titleAr,
                        style: GoogleFonts.cairo(
                          fontSize: 14.sp,
                          fontWeight: FontWeight.w700,
                          color: AppColors.textPrimary,
                          height: 1.4,
                        ),
                        maxLines: 2,
                        overflow: TextOverflow.ellipsis,
                      ),
                    ),
                    GestureDetector(
                      onTap: () => cart.removeItem(item.book.id),
                      child: Icon(
                        Icons.delete_outline_rounded,
                        size: 18.r,
                        color: AppColors.textHint,
                      ),
                    ),
                  ],
                ),
                SizedBox(height: 2.h),
                Text(
                  item.book.publisher,
                  style: GoogleFonts.inter(
                    fontSize: 11.5.sp,
                    color: AppColors.textSecondary,
                  ),
                ),
                SizedBox(height: 8.h),
                Row(
                  mainAxisAlignment: MainAxisAlignment.spaceBetween,
                  children: [
                    Text(
                      '\$${(item.book.price * item.quantity).toStringAsFixed(2)}',
                      style: GoogleFonts.cairo(
                        fontSize: 15.sp,
                        fontWeight: FontWeight.w800,
                        color: AppColors.primary,
                      ),
                    ),
                    CartStepper(item: item, cart: cart),
                  ],
                ),
              ],
            ),
          ),
        ],
      ),
    );
  }
}

class CartStepper extends StatelessWidget {
  const CartStepper({
    super.key,
    required this.item,
    required this.cart,
  });
  final CartItem item;
  final CartCubit cart;

  @override
  Widget build(BuildContext context) {
    return Container(
      decoration: BoxDecoration(
        border: Border.all(color: AppColors.divider),
        borderRadius: BorderRadius.circular(999),
      ),
      child: Row(
        children: [
          CartStepBtn(
            icon: Icons.remove_rounded,
            onTap: () => cart.updateQuantity(item.book.id, -1),
          ),
          SizedBox(
            width: 30.w,
            child: Text(
              '${item.quantity}',
              textAlign: TextAlign.center,
              style: GoogleFonts.cairo(
                fontSize: 14.sp,
                fontWeight: FontWeight.w700,
                color: AppColors.textPrimary,
              ),
            ),
          ),
          CartStepBtn(
            icon: Icons.add_rounded,
            onTap: () => cart.updateQuantity(item.book.id, 1),
          ),
        ],
      ),
    );
  }
}

class CartStepBtn extends StatelessWidget {
  const CartStepBtn({super.key, required this.icon, required this.onTap});
  final IconData icon;
  final VoidCallback onTap;

  @override
  Widget build(BuildContext context) {
    return GestureDetector(
      onTap: onTap,
      child: SizedBox(
        width: 32.r,
        height: 32.r,
        child: Icon(icon, size: 15.r, color: AppColors.textPrimary),
      ),
    );
  }
}
