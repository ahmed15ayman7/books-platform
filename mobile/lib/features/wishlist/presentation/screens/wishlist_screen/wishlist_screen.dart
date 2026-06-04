import 'package:easy_localization/easy_localization.dart';
import 'package:flutter/material.dart';
import 'package:flutter_bloc/flutter_bloc.dart';
import 'package:flutter_screenutil/flutter_screenutil.dart';
import 'package:google_fonts/google_fonts.dart';

import 'package:booksplatform/core/theme/app_colors.dart';
import 'package:booksplatform/core/widgets/app_bar_widget.dart';
import 'package:booksplatform/core/widgets/empty_state_widget.dart';
import 'package:booksplatform/core/widgets/app_loading_indicator.dart';

import '../../cubit/wishlist_cubit.dart';
import '../../cubit/wishlist_state.dart';
import 'widgets/wishlist_item_card.dart';

class WishlistScreen extends StatefulWidget {
  const WishlistScreen({super.key});

  @override
  State<WishlistScreen> createState() => _WishlistScreenState();
}

class _WishlistScreenState extends State<WishlistScreen> {
  @override
  void initState() {
    super.initState();
    context.read<WishlistCubit>().load();
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      body: Column(
        children: [
          AppBarWidget(
            variant: AppBarVariant.title,
            title: 'wishlist_title'.tr(),
            showBack: true,
          ),
          Expanded(
            child: BlocBuilder<WishlistCubit, WishlistState>(
              builder: (context, state) {
                if (state is WishlistLoading) {
                  return const Center(child: AppLoadingIndicator());
                }
                if (state is WishlistError) {
                  return Center(
                    child: Text(state.message,
                        style: GoogleFonts.cairo(color: AppColors.error)),
                  );
                }
                if (state is WishlistLoaded) {
                  if (state.items.isEmpty) {
                    return EmptyStateWidget(
                      icon: Icons.favorite_border_rounded,
                      title: 'wishlist_empty_title'.tr(),
                      subtitle: 'wishlist_empty_subtitle'.tr(),
                    );
                  }
                  return SafeArea(
                    top: false,
                    child: ListView(
                      children: [
                        ...state.items.map(
                          (item) => WishlistItemCard(item: item),
                        ),
                        Padding(
                          padding: EdgeInsetsDirectional.all(16.r),
                          child: Text(
                            'wishlist_disclosure'.tr(),
                            style: GoogleFonts.cairo(
                              fontSize: 12.sp,
                              color: AppColors.textSecondary,
                            ),
                            textAlign: TextAlign.center,
                          ),
                        ),
                      ],
                    ),
                  );
                }
                return const SizedBox.shrink();
              },
            ),
          ),
        ],
      ),
    );
  }
}
