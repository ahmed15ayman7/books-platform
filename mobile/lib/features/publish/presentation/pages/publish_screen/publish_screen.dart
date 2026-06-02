import 'package:easy_localization/easy_localization.dart';
import 'package:flutter/material.dart';
import 'package:flutter_screenutil/flutter_screenutil.dart';

import '../../../../../core/router/app_routes.dart';
import '../../../../../core/theme/app_colors.dart';
import '../../../../../core/widgets/app_bar_widget.dart';
import '../../../../../core/widgets/bottom_nav_widget.dart';
import 'publish_author_step.dart';
import 'publish_book_step.dart';
import 'publish_navigation_section.dart';
import 'publish_promo_section.dart';
import 'publish_step_indicator.dart';
import 'publish_success_step.dart';

class PublishScreen extends StatefulWidget {
  const PublishScreen({super.key});

  @override
  State<PublishScreen> createState() => _PublishScreenState();
}

class _PublishScreenState extends State<PublishScreen> {
  int _step = 0;

  static const _steps = ['author', 'book', 'submit'];

  final _authorFormKey = GlobalKey<FormState>();
  final _bookFormKey = GlobalKey<FormState>();

  late final _nameCtrl = TextEditingController();
  late final _emailCtrl = TextEditingController();
  late final _phoneCtrl = TextEditingController();
  late final _bioCtrl = TextEditingController();
  late final _titleCtrl = TextEditingController();
  late final _summaryCtrl = TextEditingController();
  late final _categoryCtrl = TextEditingController();

  @override
  void dispose() {
    _nameCtrl.dispose();
    _emailCtrl.dispose();
    _phoneCtrl.dispose();
    _bioCtrl.dispose();
    _titleCtrl.dispose();
    _summaryCtrl.dispose();
    _categoryCtrl.dispose();
    super.dispose();
  }

  void _next() {
    final isValid = switch (_step) {
      0 => _authorFormKey.currentState?.validate() ?? false,
      1 => _bookFormKey.currentState?.validate() ?? false,
      _ => true,
    };
    if (isValid && _step < _steps.length - 1) setState(() => _step++);
  }

  void _back() {
    if (_step > 0) setState(() => _step--);
  }

  @override
  Widget build(BuildContext context) {
    final locale = context.locale.languageCode;
    final ar = locale == 'ar';
    final stepLabels = ar
        ? ['معلومات المؤلف', 'معلومات الكتاب', 'الإرسال']
        : ['Author Info', 'Book Info', 'Submit'];
    return Scaffold(
      backgroundColor: AppColors.background,
      body: Column(
        children: [
          AppBarWidget(
            variant: AppBarVariant.title,
            title: 'publish.title'.tr(),
            showBack: true,
            currentLocale: locale,
            onLocaleChanged: (l) => context.setLocale(Locale(l)),
          ),
          Expanded(
            child: SingleChildScrollView(
              padding: EdgeInsetsDirectional.fromSTEB(
                  16.w, 18.h, 16.w, 8.h),
              child: Column(
                children: [
                  PublishStepIndicator(
                    step: _step,
                    labels: stepLabels,
                  ),
                  SizedBox(height: 24.h),
                  if (_step == 0)
                    Form(
                      key: _authorFormKey,
                      child: PublishAuthorStep(
                        nameCtrl: _nameCtrl,
                        emailCtrl: _emailCtrl,
                        phoneCtrl: _phoneCtrl,
                        bioCtrl: _bioCtrl,
                      ),
                    ),
                  if (_step == 1)
                    Form(
                      key: _bookFormKey,
                      child: PublishBookStep(
                        titleCtrl: _titleCtrl,
                        summaryCtrl: _summaryCtrl,
                        categoryCtrl: _categoryCtrl,
                      ),
                    ),
                  if (_step == 2) PublishSuccessStep(locale: locale),
                  SizedBox(height: 16.h),
                  const PublishPromoSection(),
                  SizedBox(height: 18.h),
                  PublishNavigationSection(
                    step: _step,
                    totalSteps: _steps.length,
                    onBack: _back,
                    onPrimary: _step < _steps.length - 1
                        ? _next
                        : () => Navigator.of(context)
                            .pushReplacementNamed(AppRoutes.home),
                  ),
                  SizedBox(height: 16.h),
                ],
              ),
            ),
          ),
          BottomNavWidget(
            activeTab: null,
            onTabSelected: (tab) => _onTabSelected(context, tab),
            onPublishTap: () {},
            currentLocale: locale,
          ),
        ],
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
