import 'package:easy_localization/easy_localization.dart';
import 'package:flutter/material.dart';
import 'package:flutter_bloc/flutter_bloc.dart';
import 'package:flutter_screenutil/flutter_screenutil.dart';

import 'package:booksplatform/core/router/args/static_page_args.dart';
import 'package:booksplatform/core/theme/app_colors.dart';
import 'package:booksplatform/core/widgets/app_bar_widget.dart';
import 'package:booksplatform/core/widgets/app_loading_indicator.dart';
import 'package:booksplatform/core/widgets/app_markdown_body.dart';
import 'package:booksplatform/core/widgets/error_state_widget.dart';

import '../../cubit/static_page_cubit.dart';
import '../../cubit/static_page_state.dart';

class StaticPageScreen extends StatefulWidget {
  const StaticPageScreen({super.key, required this.args});

  final StaticPageArgs args;

  @override
  State<StaticPageScreen> createState() => _StaticPageScreenState();
}

class _StaticPageScreenState extends State<StaticPageScreen> {
  var _didLoad = false;

  @override
  void didChangeDependencies() {
    super.didChangeDependencies();
    if (!_didLoad) {
      _didLoad = true;
      _loadPage();
    }
  }

  void _loadPage() {
    final locale = context.locale.languageCode;
    context.read<StaticPageCubit>().load(
          widget.args.slug,
          _titleForSlug(widget.args.slug),
          locale,
        );
  }

  String _titleForSlug(String slug) {
    return switch (slug) {
      'privacy' => 'privacy_policy_title'.tr(),
      'terms' => 'terms_of_use_title'.tr(),
      _ => widget.args.title,
    };
  }

  @override
  Widget build(BuildContext context) {
    final locale = context.locale.languageCode;
    return Scaffold(
      backgroundColor: AppColors.background,
      body: Column(
        children: [
          AppBarWidget(
            variant: AppBarVariant.title,
            title: _titleForSlug(widget.args.slug),
            showBack: true,
            currentLocale: locale,
            onLocaleChanged: (l) async {
              await context.setLocale(Locale(l));
              if (!context.mounted) return;
              context.read<StaticPageCubit>().load(
                    widget.args.slug,
                    _titleForSlug(widget.args.slug),
                    l,
                  );
            },
          ),
          Expanded(
            child: BlocBuilder<StaticPageCubit, StaticPageState>(
              builder: (context, state) {
                if (state is StaticPageLoading) {
                  return const Center(child: AppLoadingIndicator());
                }
                if (state is StaticPageError) {
                  return Center(
                    child: ErrorStateWidget(
                      message: state.message == 'static_page_unavailable'
                          ? 'static_page.unavailable'.tr()
                          : state.message,
                      onRetry: _loadPage,
                    ),
                  );
                }
                if (state is StaticPageLoaded) {
                  return SafeArea(
                    top: false,
                    child: SingleChildScrollView(
                      padding: EdgeInsetsDirectional.all(16.r),
                      child: AppMarkdownBody(data: state.content),
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
