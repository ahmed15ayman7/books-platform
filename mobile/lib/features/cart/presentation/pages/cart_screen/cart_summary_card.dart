import 'package:easy_localization/easy_localization.dart';
import 'package:flutter/material.dart';
import 'package:flutter_screenutil/flutter_screenutil.dart';
import 'package:google_fonts/google_fonts.dart';

import '../../../../../core/theme/app_colors.dart';
import '../../../../../core/theme/app_shadows.dart';
import '../../cubit/cart_cubit.dart';

class CartSummaryCard extends StatelessWidget {
  const CartSummaryCard({
    super.key,
    required this.state,
    required this.locale,
    required this.ar,
  });
  final CartState state;
  final String locale;
  final bool ar;

  @override
  Widget build(BuildContext context) {
    return Container(
      padding: EdgeInsetsDirectional.all(18.r),
      decoration: BoxDecoration(
        color: AppColors.surface,
        border: Border.all(color: AppColors.divider),
        borderRadius: BorderRadius.circular(20.r),
        boxShadow: AppShadows.soft,
      ),
      child: Column(
        children: [
          CartSummaryRow(
            label: 'cart.subtotal'.tr(),
            value: '\$${state.subtotal.toStringAsFixed(2)}',
          ),
          SizedBox(height: 5.h),
          CartSummaryRow(
            label: 'cart.service_fee'.tr(),
            value: '\$${state.serviceFee.toStringAsFixed(2)}',
          ),
          Padding(
            padding: EdgeInsetsDirectional.symmetric(vertical: 10.h),
            child: const Divider(),
          ),
          Row(
            mainAxisAlignment: MainAxisAlignment.spaceBetween,
            crossAxisAlignment: CrossAxisAlignment.baseline,
            textBaseline: TextBaseline.alphabetic,
            children: [
              Text(
                'cart.total'.tr(),
                style: GoogleFonts.cairo(
                  fontSize: 16.sp,
                  fontWeight: FontWeight.w800,
                  color: AppColors.textPrimary,
                ),
              ),
              Text(
                '\$${state.total.toStringAsFixed(2)}',
                style: GoogleFonts.cairo(
                  fontSize: 22.sp,
                  fontWeight: FontWeight.w800,
                  color: AppColors.primary,
                ),
              ),
            ],
          ),
          SizedBox(height: 16.h),
          SizedBox(
            width: double.infinity,
            child: ElevatedButton(
              onPressed: () {},
              child: Text('cart.checkout'.tr()),
            ),
          ),
          SizedBox(height: 10.h),
          Text(
            'cart.checkout_note'.tr(),
            style: GoogleFonts.inter(
              fontSize: 11.sp,
              color: AppColors.textHint,
            ),
            textAlign: TextAlign.center,
          ),
        ],
      ),
    );
  }
}

class CartSummaryRow extends StatelessWidget {
  const CartSummaryRow({super.key, required this.label, required this.value});
  final String label;
  final String value;

  @override
  Widget build(BuildContext context) {
    return Row(
      mainAxisAlignment: MainAxisAlignment.spaceBetween,
      children: [
        Text(
          label,
          style: GoogleFonts.tajawal(
            fontSize: 13.5.sp,
            color: AppColors.textSecondary,
          ),
        ),
        Text(
          value,
          style: GoogleFonts.tajawal(
            fontSize: 13.5.sp,
            fontWeight: FontWeight.w600,
            color: AppColors.textPrimary,
          ),
        ),
      ],
    );
  }
}
