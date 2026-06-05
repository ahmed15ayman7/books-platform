import 'package:easy_localization/easy_localization.dart';
import 'package:flutter/material.dart';

import 'package:booksplatform/core/theme/app_colors.dart';
import 'package:booksplatform/core/widgets/app_bar_widget.dart';

import 'team_body.dart';

class TeamScreen extends StatelessWidget {
  const TeamScreen({super.key});

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      backgroundColor: AppColors.background,
      body: Column(
        children: [
          AppBarWidget(
            variant: AppBarVariant.title,
            title: 'team_title'.tr(),
            showBack: true,
          ),
          Expanded(
            child: SafeArea(
              top: false,
              child: SingleChildScrollView(
                child: TeamBody(lang: context.locale.languageCode),
              ),
            ),
          ),
        ],
      ),
    );
  }
}
