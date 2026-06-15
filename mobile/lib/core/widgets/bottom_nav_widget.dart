import 'package:easy_localization/easy_localization.dart';
import 'package:flutter/material.dart';
import 'package:flutter_screenutil/flutter_screenutil.dart';
import 'package:google_fonts/google_fonts.dart';

import '../theme/app_colors.dart';
import '../theme/app_shadows.dart';

enum BottomNavTab { home, books, articles, media, publishers, wishlist }

class BottomNavWidget extends StatelessWidget {
  const BottomNavWidget({
    super.key,
    required this.activeTab,
    required this.onTabSelected,
    required this.onPublishTap,
    this.currentLocale = 'ar',
  });

  final BottomNavTab? activeTab;
  final ValueChanged<BottomNavTab> onTabSelected;
  final VoidCallback onPublishTap;
  final String currentLocale;

  @override
  Widget build(BuildContext context) {
    final bottomPadding = MediaQuery.of(context).padding.bottom;

    final tabs = [
      _TabItem(
        tab: BottomNavTab.home,
        icon: Icons.home_outlined,
        activeIcon: Icons.home_rounded,
        label: 'nav.home'.tr(),
      ),
      _TabItem(
        tab: BottomNavTab.books,
        icon: Icons.menu_book_outlined,
        activeIcon: Icons.menu_book_rounded,
        label: 'nav.books'.tr(),
      ),
      _TabItem(
        tab: BottomNavTab.articles,
        icon: Icons.article_outlined,
        activeIcon: Icons.article_rounded,
        label: 'nav.articles'.tr(),
      ),
      null, // FAB slot
      _TabItem(
        tab: BottomNavTab.wishlist,
        icon: Icons.favorite_border_rounded,
        activeIcon: Icons.favorite_rounded,
        label: 'nav.wishlist'.tr(),
      ),
      _TabItem(
        tab: BottomNavTab.media,
        icon: Icons.play_circle_outline_rounded,
        activeIcon: Icons.play_circle_rounded,
        label: 'nav.media'.tr(),
      ),
      _TabItem(
        tab: BottomNavTab.publishers,
        icon: Icons.business_outlined,
        activeIcon: Icons.business_rounded,
        label: 'nav.publishers'.tr(),
      ),
    ];

    // Shift the nav bar down by this amount so the FAB sits within Stack bounds.
    // Using Positioned(top: -22.h) caused !semantics.parentDataDirty assertions
    // because out-of-bounds Positioned coords dirty parent data during semantics pass.
    final fabProtrusion = 22.0.h;

    return Stack(
      alignment: Alignment.topCenter,
      children: [
        // Nav bar — shifted down to expose the FAB protrusion area
        Padding(
          padding: EdgeInsets.only(top: fabProtrusion),
          child: Container(
            decoration: BoxDecoration(
              color: AppColors.surface,
              border: Border(
                top: BorderSide(color: AppColors.divider, width: 1),
              ),
              boxShadow: AppShadows.softLg,
            ),
            child: Padding(
              padding: EdgeInsets.only(
                bottom: bottomPadding > 0 ? bottomPadding : 12.h,
                top: 8.h,
              ),
              child: Row(
                children: tabs.map((item) {
                  if (item == null) {
                    return Expanded(flex: 2, child: SizedBox(height: 56.h));
                  }
                  final isActive = activeTab == item.tab;
                  return Expanded(
                    child: GestureDetector(
                      onTap: () => onTabSelected(item.tab),
                      behavior: HitTestBehavior.opaque,
                      child: Column(
                        mainAxisSize: MainAxisSize.min,
                        children: [
                          Icon(
                            isActive ? item.activeIcon : item.icon,
                            size: 23.r,
                            color: isActive
                                ? AppColors.primary
                                : AppColors.textHint,
                          ),
                          SizedBox(height: 3.h),
                          Text(
                            item.label,
                            style: GoogleFonts.cairo(
                              fontSize: 10.5.sp,
                              fontWeight: isActive
                                  ? FontWeight.w700
                                  : FontWeight.w600,
                              color: isActive
                                  ? AppColors.primary
                                  : AppColors.textHint,
                            ),
                          ),
                        ],
                      ),
                    ),
                  );
                }).toList(),
              ),
            ),
          ),
        ),

        // Center elevated FAB — non-positioned, placed at top-center by Stack alignment.
        // Height 58.r > fabProtrusion so it overlaps the nav bar border as designed.
        GestureDetector(
          onTap: onPublishTap,
          child: Container(
            width: 58.r,
            height: 58.r,
            decoration: BoxDecoration(
              color: AppColors.primary,
              shape: BoxShape.circle,
              border: Border.all(
                color: AppColors.surface,
                width: 4,
              ),
              boxShadow: AppShadows.brand,
            ),
            child: Icon(
              Icons.add_rounded,
              size: 26.r,
              color: Colors.white,
            ),
          ),
        ),
      ],
    );
  }
}

class _TabItem {
  const _TabItem({
    required this.tab,
    required this.icon,
    required this.activeIcon,
    required this.label,
  });
  final BottomNavTab tab;
  final IconData icon;
  final IconData activeIcon;
  final String label;
}
