import 'package:flutter/material.dart';
import 'package:flutter_bloc/flutter_bloc.dart';
import 'package:flutter_screenutil/flutter_screenutil.dart';
import 'package:google_fonts/google_fonts.dart';

import '../../features/cart/presentation/cubit/cart_cubit.dart';
import '../constants/app_constants.dart';
import '../di/injection_container.dart';
import '../theme/app_colors.dart';
import '../theme/app_shadows.dart';

enum AppBarVariant { home, title }

class AppBarWidget extends StatelessWidget {
  const AppBarWidget({
    super.key,
    required this.variant,
    this.title,
    this.subtitle,
    this.showBack = false,
    this.onBack,
    this.onSearch,
    this.onCart,
    this.trailing,
    this.currentLocale = 'ar',
    this.onLocaleChanged,
  });

  final AppBarVariant variant;
  final String? title;
  final String? subtitle;
  final bool showBack;
  final VoidCallback? onBack;
  final VoidCallback? onSearch;
  final VoidCallback? onCart;
  final Widget? trailing;
  final String currentLocale;
  final ValueChanged<String>? onLocaleChanged;

  @override
  Widget build(BuildContext context) {
    final topPadding = MediaQuery.of(context).padding.top;
    return Container(
      decoration: const BoxDecoration(
        color: AppColors.surface,
        boxShadow: AppShadows.soft,
      ),
      padding: EdgeInsetsDirectional.fromSTEB(
        16.w, topPadding + 8.h, 16.w, 12.h,
      ),
      child: Row(
        children: [
          Expanded(
            child: Row(
              children: [
                if (showBack) ...[
                  _BackButton(onBack: onBack),
                  SizedBox(width: 10.w),
                ],
                if (variant == AppBarVariant.home)
                  _BrandLogo(locale: currentLocale)
                else
                  Expanded(
                    child: _TitleBlock(title: title, subtitle: subtitle),
                  ),
              ],
            ),
          ),
          SizedBox(width: 10.w),
          Row(
            mainAxisSize: MainAxisSize.min,
            children: [
              _LangToggle(
                currentLocale: currentLocale,
                onChanged: onLocaleChanged,
              ),
              if (trailing != null) ...[SizedBox(width: 8.w), trailing!],
              if (onSearch != null) ...[
                SizedBox(width: 8.w),
                _IconButton(onTap: onSearch!, icon: Icons.search_rounded),
              ],
              if (onCart != null) ...[
                SizedBox(width: 8.w),
                _CartButton(onTap: onCart!),
              ],
            ],
          ),
        ],
      ),
    );
  }
}

// ── Brand logo (home variant) ─────────────────────────────────────────────
class _BrandLogo extends StatelessWidget {
  const _BrandLogo({required this.locale});
  final String locale;

  @override
  Widget build(BuildContext context) {
    return Row(
      mainAxisSize: MainAxisSize.min,
      children: [
        ClipRRect(
          borderRadius: BorderRadius.circular(9.r),
          child: Image.asset(
            kBrandingAppIconAsset,
            width: 34.r,
            height: 34.r,
            fit: BoxFit.cover,
          ),
        ),
        SizedBox(width: 8.w),
        Column(
          crossAxisAlignment: CrossAxisAlignment.start,
          mainAxisSize: MainAxisSize.min,
          children: [
            Text(
              locale == 'ar' ? 'منصة الكتب' : 'Books',
              style: GoogleFonts.cairo(
                fontSize: 15.sp,
                fontWeight: FontWeight.w800,
                color: AppColors.textPrimary,
                height: 1.1,
              ),
            ),
            Text(
              locale == 'ar' ? 'العالمية' : 'PLATFORM',
              style: GoogleFonts.inter(
                fontSize: 8.sp,
                fontWeight: FontWeight.w700,
                color: AppColors.primary,
                letterSpacing: 0.14 * 8.sp,
              ),
            ),
          ],
        ),
      ],
    );
  }
}

// ── Title block (inner screens) ───────────────────────────────────────────
class _TitleBlock extends StatelessWidget {
  const _TitleBlock({this.title, this.subtitle});
  final String? title;
  final String? subtitle;

  @override
  Widget build(BuildContext context) {
    return Column(
      crossAxisAlignment: CrossAxisAlignment.start,
      mainAxisSize: MainAxisSize.min,
      children: [
        if (title != null)
          Text(
            title!,
            style: GoogleFonts.cairo(
              fontSize: 18.sp,
              fontWeight: FontWeight.w800,
              color: AppColors.textPrimary,
            ),
            maxLines: 1,
            overflow: TextOverflow.ellipsis,
          ),
        if (subtitle != null)
          Text(
            subtitle!,
            style: GoogleFonts.tajawal(
              fontSize: 12.sp,
              color: AppColors.textSecondary,
            ),
          ),
      ],
    );
  }
}

// ── Back button ───────────────────────────────────────────────────────────
class _BackButton extends StatelessWidget {
  const _BackButton({this.onBack});
  final VoidCallback? onBack;

  @override
  Widget build(BuildContext context) {
    return GestureDetector(
      onTap: onBack ?? () => Navigator.of(context).pop(),
      child: Container(
        width: 38.r,
        height: 38.r,
        decoration: BoxDecoration(
          color: AppColors.surface,
          border: Border.all(color: AppColors.divider),
          borderRadius: BorderRadius.circular(999),
        ),
        child: Icon(
          Icons.arrow_back_rounded,
          size: 20.r,
          color: AppColors.textPrimary,
        ),
      ),
    );
  }
}

// ── Language toggle ───────────────────────────────────────────────────────
class _LangToggle extends StatelessWidget {
  const _LangToggle({this.currentLocale = 'ar', this.onChanged});
  final String currentLocale;
  final ValueChanged<String>? onChanged;

  @override
  Widget build(BuildContext context) {
    return Container(
      padding: EdgeInsets.all(3.r),
      decoration: BoxDecoration(
        color: AppColors.inputFill,
        borderRadius: BorderRadius.circular(999),
        border: Border.all(color: AppColors.divider),
      ),
      child: Row(
        mainAxisSize: MainAxisSize.min,
        children: [
          _LangOption(
            label: 'ع',
            active: currentLocale == 'ar',
            onTap: () => onChanged?.call('ar'),
          ),
          _LangOption(
            label: 'EN',
            active: currentLocale == 'en',
            onTap: () => onChanged?.call('en'),
          ),
        ],
      ),
    );
  }
}

class _LangOption extends StatelessWidget {
  const _LangOption({
    required this.label,
    required this.active,
    required this.onTap,
  });
  final String label;
  final bool active;
  final VoidCallback onTap;

  @override
  Widget build(BuildContext context) {
    return GestureDetector(
      onTap: onTap,
      child: AnimatedContainer(
        duration: const Duration(milliseconds: 180),
        padding: EdgeInsets.symmetric(horizontal: 10.w, vertical: 4.h),
        decoration: BoxDecoration(
          color: active ? AppColors.primary : Colors.transparent,
          borderRadius: BorderRadius.circular(999),
        ),
        child: Text(
          label,
          style: GoogleFonts.inter(
            fontSize: 12.sp,
            fontWeight: FontWeight.w700,
            color: active ? Colors.white : AppColors.textSecondary,
          ),
        ),
      ),
    );
  }
}

// ── Generic icon button ───────────────────────────────────────────────────
class _IconButton extends StatelessWidget {
  const _IconButton({required this.onTap, required this.icon});
  final VoidCallback onTap;
  final IconData icon;

  @override
  Widget build(BuildContext context) {
    return GestureDetector(
      onTap: onTap,
      child: Container(
        width: 38.r,
        height: 38.r,
        decoration: BoxDecoration(
          color: AppColors.surface,
          border: Border.all(color: AppColors.divider),
          borderRadius: BorderRadius.circular(999),
        ),
        child: Icon(icon, size: 20.r, color: AppColors.textPrimary),
      ),
    );
  }
}

// ── Cart icon with badge ──────────────────────────────────────────────────
class _CartButton extends StatelessWidget {
  const _CartButton({required this.onTap});
  final VoidCallback onTap;

  @override
  Widget build(BuildContext context) {
    return BlocBuilder<CartCubit, CartState>(
      bloc: getIt<CartCubit>(),
      builder: (context, cartState) {
        final count = cartState.totalCount;
        return GestureDetector(
          onTap: onTap,
          child: Stack(
            clipBehavior: Clip.none,
            children: [
              Container(
                width: 38.r,
                height: 38.r,
                decoration: BoxDecoration(
                  color: AppColors.surface,
                  border: Border.all(color: AppColors.divider),
                  borderRadius: BorderRadius.circular(999),
                ),
                child: Icon(
                  Icons.shopping_bag_outlined,
                  size: 20.r,
                  color: AppColors.textPrimary,
                ),
              ),
              if (count > 0)
                PositionedDirectional(
                  top: -3,
                  end: -3,
                  child: Container(
                    constraints: BoxConstraints(minWidth: 17.r, minHeight: 17.r),
                    padding: EdgeInsets.symmetric(horizontal: 3.w),
                    decoration: BoxDecoration(
                      color: AppColors.primary,
                      borderRadius: BorderRadius.circular(999),
                    ),
                    child: Center(
                      child: Text(
                        '$count',
                        style: GoogleFonts.inter(
                          fontSize: 10.sp,
                          fontWeight: FontWeight.w700,
                          color: Colors.white,
                        ),
                      ),
                    ),
                  ),
                ),
            ],
          ),
        );
      },
    );
  }
}
