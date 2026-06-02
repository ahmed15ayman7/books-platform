import 'package:flutter/material.dart';
import 'package:flutter_screenutil/flutter_screenutil.dart';

import '../../cubit/cart_cubit.dart';
import 'cart_line_item.dart';
import 'cart_summary_card.dart';

class CartBody extends StatelessWidget {
  const CartBody({super.key, required this.state, required this.locale});
  final CartState state;
  final String locale;

  @override
  Widget build(BuildContext context) {
    final ar = locale == 'ar';
    return SingleChildScrollView(
      padding: EdgeInsetsDirectional.all(16.r),
      child: Column(
        children: [
          ...state.items.map((item) => Padding(
                padding: EdgeInsetsDirectional.only(bottom: 12.h),
                child: CartLineItem(item: item, locale: locale),
              )),
          SizedBox(height: 6.h),
          CartSummaryCard(state: state, locale: locale, ar: ar),
        ],
      ),
    );
  }
}
