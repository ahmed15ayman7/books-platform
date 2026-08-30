import 'package:easy_localization/easy_localization.dart';
import 'package:flutter/material.dart';
import 'package:flutter_bloc/flutter_bloc.dart';

import '../../../../../core/di/injection_container.dart';
import '../../../../../core/router/app_routes.dart';
import '../../../../../core/router/args/main_shell_args.dart';
import '../../../../../core/theme/app_colors.dart';
import '../../../../../core/widgets/app_bar_widget.dart';
import '../../../../../core/widgets/bottom_nav_widget.dart' show BottomNavTab;
import '../../../../../core/widgets/empty_state_widget.dart';
import '../../cubit/cart_cubit.dart';
import 'cart_body.dart';

class CartScreen extends StatelessWidget {
  const CartScreen({super.key});

  @override
  Widget build(BuildContext context) {
    final locale = context.locale.languageCode;
    return BlocProvider.value(
      value: getIt<CartCubit>(),
      child: Scaffold(
        backgroundColor: AppColors.background,
        body: BlocBuilder<CartCubit, CartState>(
          builder: (ctx, state) => Column(
            children: [
              AppBarWidget(
                variant: AppBarVariant.title,
                title: 'cart.title'.tr(),
                subtitle: state.totalCount > 0
                    ? '${state.totalCount} ${'cart.books_unit'.tr()}'
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
                          title: 'cart.empty_title'.tr(),
                          subtitle: 'cart.empty_subtitle'.tr(),
                          actionLabel: 'cart.browse_books'.tr(),
                          onAction: () =>
                              Navigator.of(ctx).pushNamedAndRemoveUntil(
                            AppRoutes.home,
                            (_) => false,
                            arguments: const MainShellArgs(
                              initialTab: BottomNavTab.books,
                            ),
                          ),
                        ),
                      )
                    : CartBody(state: state, locale: locale),
              ),
            ],
          ),
        ),
      ),
    );
  }
}
