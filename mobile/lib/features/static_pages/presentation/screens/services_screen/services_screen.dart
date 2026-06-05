import 'package:easy_localization/easy_localization.dart';
import 'package:flutter/material.dart';

import 'package:booksplatform/core/theme/app_colors.dart';
import 'package:booksplatform/core/widgets/app_bar_widget.dart';

import 'services_body.dart';

class ServicesScreen extends StatelessWidget {
  const ServicesScreen({super.key});

  @override
  Widget build(BuildContext context) {
    final lang = context.locale.languageCode;
    return Scaffold(
      backgroundColor: AppColors.background,
      body: Column(
        children: [
          AppBarWidget(
            variant: AppBarVariant.title,
            title: 'services_title'.tr(),
            showBack: true,
            currentLocale: lang,
            onLocaleChanged: (l) => context.setLocale(Locale(l)),
          ),
          Expanded(
            child: SafeArea(
              top: false,
              child: SingleChildScrollView(
                child: ServicesBody(lang: lang),
              ),
            ),
          ),
        ],
      ),
    );
  }
}
