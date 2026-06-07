import 'package:easy_localization/easy_localization.dart';
import 'package:flutter/material.dart';
import 'package:flutter_screenutil/flutter_screenutil.dart';

import 'package:booksplatform/core/router/app_routes.dart';
import 'package:booksplatform/core/router/args/static_page_args.dart';
import 'package:booksplatform/core/theme/app_colors.dart';
import 'package:booksplatform/core/theme/app_text_styles.dart';

class MoreBottomSheet extends StatelessWidget {
  const MoreBottomSheet({super.key});

  @override
  Widget build(BuildContext context) {
    return Column(
      mainAxisSize: MainAxisSize.min,
      children: [
        _MoreTile(
          icon: Icons.translate_rounded,
          titleKey: 'recommended_for_translation_title',
          onTap: () => _navigate(context, AppRoutes.recommendedBooks),
        ),
        _MoreTile(
          icon: Icons.auto_stories_rounded,
          titleKey: 'translated_books_title',
          onTap: () => _navigate(context, AppRoutes.translatedBooks),
        ),
        const Divider(height: 1),
        _MoreTile(
          icon: Icons.info_outline_rounded,
          titleKey: 'about_us_title',
          onTap: () => _navigate(context, AppRoutes.aboutUs),
        ),
        _MoreTile(
          icon: Icons.work_outline_rounded,
          titleKey: 'services_title',
          onTap: () => _navigate(context, AppRoutes.services),
        ),
        _MoreTile(
          icon: Icons.people_outline_rounded,
          titleKey: 'team_title',
          onTap: () => _navigate(context, AppRoutes.team),
        ),
        _MoreTile(
          icon: Icons.mail_outline_rounded,
          titleKey: 'contact_us_title',
          onTap: () => _navigate(context, AppRoutes.contactUs),
        ),
        _MoreTile(
          icon: Icons.privacy_tip_outlined,
          titleKey: 'privacy_policy_title',
          onTap: () => _navigateStatic(
            context,
            AppRoutes.privacyPolicy,
            'privacy',
            'privacy_policy_title'.tr(),
          ),
        ),
        _MoreTile(
          icon: Icons.gavel_rounded,
          titleKey: 'terms_of_use_title',
          onTap: () => _navigateStatic(
            context,
            AppRoutes.termsOfUse,
            'terms',
            'terms_of_use_title'.tr(),
          ),
        ),
        SizedBox(height: 8.h),
      ],
    );
  }

  void _navigate(BuildContext context, String route) {
    Navigator.of(context).pop();
    Navigator.of(context).pushNamed(route);
  }

  void _navigateStatic(
      BuildContext context, String route, String slug, String title) {
    Navigator.of(context).pop();
    Navigator.of(context).pushNamed(
      route,
      arguments: StaticPageArgs(slug: slug, title: title),
    );
  }
}

class _MoreTile extends StatelessWidget {
  const _MoreTile({
    required this.icon,
    required this.titleKey,
    required this.onTap,
  });

  final IconData icon;
  final String titleKey;
  final VoidCallback onTap;

  @override
  Widget build(BuildContext context) {
    return ListTile(
      leading: Icon(icon, color: AppColors.primary, size: 22.sp),
      title: Text(titleKey.tr(), style: AppTextStyles.bodyLarge),
      trailing: Icon(
        Icons.chevron_right_rounded,
        color: AppColors.textSecondary,
        size: 20.sp,
      ),
      onTap: onTap,
    );
  }
}
