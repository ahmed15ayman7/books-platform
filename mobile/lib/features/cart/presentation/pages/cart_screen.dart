import 'package:easy_localization/easy_localization.dart';
import 'package:flutter/material.dart';
import 'package:flutter_bloc/flutter_bloc.dart';
import 'package:flutter_screenutil/flutter_screenutil.dart';
import 'package:google_fonts/google_fonts.dart';

import '../../../../core/di/injection_container.dart';
import '../../../../core/router/app_routes.dart';
import '../../../../core/theme/app_colors.dart';
import '../../../../core/theme/app_shadows.dart';
import '../../../../core/widgets/app_bar_widget.dart';
import '../../../../core/widgets/book_cover_widget.dart';
import '../../../../core/widgets/bottom_nav_widget.dart';
import '../../../../core/widgets/empty_state_widget.dart';
import '../../domain/entities/cart_item.dart';
import '../cubit/cart_cubit.dart';

class CartScreen extends StatelessWidget {
  const CartScreen({super.key});

  @override
  Widget build(BuildContext context) {
    final locale = context.locale.languageCode;
    final ar = locale == 'ar';
    return BlocProvider.value(
      value: getIt<CartCubit>(),
      child: Scaffold(
        backgroundColor: AppColors.background,
        body: BlocBuilder<CartCubit, CartState>(
          builder: (ctx, state) => Column(
            children: [
              AppBarWidget(
                variant: AppBarVariant.title,
                title: ar ? 'السلة' : 'Cart',
                subtitle: state.totalCount > 0
                    ? '${state.totalCount} ${ar ? 'كتاب' : 'books'}'
                    : null,
                showBack: true,
                currentLocale: locale,
                onLocaleChanged: (l) => context.setLocale(Locale(l)),
              ),
              Expanded(
                child: state.items.isEmpty
                    ? Center(
                        child: EmptyStateWidget(
                          icon: Icons.shopping_bag_outlined,
                          title: ar ? 'السلة فارغة' : 'Cart is empty',
                          subtitle: ar
                              ? 'أضِف كتباً من الكتالوج لتبدأ الطلب.'
                              : 'Add books from the catalog to start an order.',
                          actionLabel: ar ? 'تصفح الكتب' : 'Browse Books',
                          onAction: () =>
                              Navigator.of(ctx).pushReplacementNamed(
                            AppRoutes.books,
                          ),
                        ),
                      )
                    : _CartBody(state: state, locale: locale),
              ),
              BottomNavWidget(
                activeTab: null,
                onTabSelected: (tab) => _onTabSelected(ctx, tab),
                onPublishTap: () =>
                    Navigator.of(ctx).pushNamed(AppRoutes.publish),
                currentLocale: locale,
              ),
            ],
          ),
        ),
      ),
    );
  }

  void _onTabSelected(BuildContext context, BottomNavTab tab) {
    switch (tab) {
      case BottomNavTab.home:
        Navigator.of(context).pushReplacementNamed(AppRoutes.home);
      case BottomNavTab.books:
        Navigator.of(context).pushReplacementNamed(AppRoutes.books);
      case BottomNavTab.articles:
        Navigator.of(context).pushReplacementNamed(AppRoutes.articles);
      case BottomNavTab.publishers:
        Navigator.of(context).pushReplacementNamed(AppRoutes.publishers);
    }
  }
}

class _CartBody extends StatelessWidget {
  const _CartBody({required this.state, required this.locale});
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
                child: _LineItem(item: item, locale: locale),
              )),
          SizedBox(height: 6.h),
          _SummaryCard(state: state, locale: locale, ar: ar),
        ],
      ),
    );
  }
}

class _LineItem extends StatelessWidget {
  const _LineItem({required this.item, required this.locale});
  final CartItem item;
  final String locale;

  @override
  Widget build(BuildContext context) {
    final ar = locale == 'ar';
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
                    _Stepper(item: item, ar: ar, cart: cart),
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

class _Stepper extends StatelessWidget {
  const _Stepper({
    required this.item,
    required this.ar,
    required this.cart,
  });
  final CartItem item;
  final bool ar;
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
          _StepBtn(
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
          _StepBtn(
            icon: Icons.add_rounded,
            onTap: () => cart.updateQuantity(item.book.id, 1),
          ),
        ],
      ),
    );
  }
}

class _StepBtn extends StatelessWidget {
  const _StepBtn({required this.icon, required this.onTap});
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

class _SummaryCard extends StatelessWidget {
  const _SummaryCard({
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
          _SRow(
            label: ar ? 'المجموع الفرعي' : 'Subtotal',
            value: '\$${state.subtotal.toStringAsFixed(2)}',
          ),
          SizedBox(height: 5.h),
          _SRow(
            label: ar ? 'رسوم الخدمة' : 'Service fee',
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
                ar ? 'الإجمالي' : 'Total',
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
              child: Text(ar ? 'إتمام الشراء' : 'Checkout'),
            ),
          ),
          SizedBox(height: 10.h),
          Text(
            ar
                ? 'الدفع بدون حساب · بوابة الدفع تُحدَّد لاحقاً'
                : 'Guest checkout · payment gateway TBD',
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

class _SRow extends StatelessWidget {
  const _SRow({required this.label, required this.value});
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
