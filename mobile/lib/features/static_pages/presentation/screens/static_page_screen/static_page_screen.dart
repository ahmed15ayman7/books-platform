import 'package:flutter/material.dart';
import 'package:flutter_bloc/flutter_bloc.dart';
import 'package:flutter_screenutil/flutter_screenutil.dart';
import 'package:google_fonts/google_fonts.dart';
import 'package:url_launcher/url_launcher.dart';

import 'package:booksplatform/core/router/args/static_page_args.dart';
import 'package:booksplatform/core/theme/app_colors.dart';
import 'package:booksplatform/core/widgets/app_bar_widget.dart';
import 'package:booksplatform/core/widgets/app_loading_indicator.dart';
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
  @override
  void initState() {
    super.initState();
    context.read<StaticPageCubit>().load(widget.args.slug, widget.args.title);
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      backgroundColor: AppColors.background,
      body: Column(
        children: [
          AppBarWidget(
            variant: AppBarVariant.title,
            title: widget.args.title,
            showBack: true,
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
                      message: state.message,
                      onRetry: () => context
                          .read<StaticPageCubit>()
                          .load(widget.args.slug, widget.args.title),
                    ),
                  );
                }
                if (state is StaticPageLoaded) {
                  return SafeArea(
                    top: false,
                    child: SingleChildScrollView(
                      padding: EdgeInsetsDirectional.all(16.r),
                      child: Column(
                        crossAxisAlignment: CrossAxisAlignment.start,
                        children: [
                          SelectableText(
                            state.content,
                            style: GoogleFonts.cairo(
                              fontSize: 14.sp,
                              color: AppColors.textPrimary,
                              height: 1.7,
                            ),
                          ),
                          if (state.slug == 'contact') ...[
                            SizedBox(height: 16.h),
                            GestureDetector(
                              onTap: () => launchUrl(
                                Uri.parse('mailto:contact@booksplatform.net'),
                              ),
                              child: Text(
                                'contact@booksplatform.net',
                                style: GoogleFonts.inter(
                                  fontSize: 14.sp,
                                  color: AppColors.primary,
                                  decoration: TextDecoration.underline,
                                ),
                              ),
                            ),
                          ],
                        ],
                      ),
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
