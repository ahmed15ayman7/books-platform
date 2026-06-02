import 'package:easy_localization/easy_localization.dart';
import 'package:flutter/material.dart';
import 'package:flutter_bloc/flutter_bloc.dart';
import 'package:flutter_screenutil/flutter_screenutil.dart';
import 'package:google_fonts/google_fonts.dart';

import '../../../../../core/router/app_routes.dart';
import '../../../../../core/router/args/book_detail_args.dart';
import '../../../../../core/theme/app_colors.dart';
import '../../../../../core/widgets/app_loading_indicator.dart';
import '../../../../../core/widgets/error_state_widget.dart';
import '../../cubit/search_cubit.dart';
import '../../cubit/search_state.dart';
import 'search_no_results.dart';
import 'search_recent_chips.dart';
import 'search_results_list.dart';

class SearchScreen extends StatefulWidget {
  const SearchScreen({super.key});

  @override
  State<SearchScreen> createState() => _SearchScreenState();
}

class _SearchScreenState extends State<SearchScreen> {
  final _controller = TextEditingController();

  @override
  void dispose() {
    _controller.dispose();
    super.dispose();
  }

  @override
  Widget build(BuildContext context) {
    final locale = context.locale.languageCode;
    final ar = locale == 'ar';
    return Scaffold(
      backgroundColor: AppColors.background,
      body: SafeArea(
        child: Column(
          children: [
            Container(
              color: AppColors.surface,
              padding: EdgeInsetsDirectional.fromSTEB(
                16.w,
                8.h,
                16.w,
                12.h,
              ),
              child: Row(
                children: [
                  GestureDetector(
                    onTap: () => Navigator.of(context).pop(),
                    child: Icon(
                      Icons.arrow_back_rounded,
                      size: 22.r,
                      color: AppColors.textPrimary,
                    ),
                  ),
                  SizedBox(width: 10.w),
                  Expanded(
                    child: Container(
                      height: 46.h,
                      decoration: BoxDecoration(
                        color: AppColors.inputFill,
                        borderRadius: BorderRadius.circular(999),
                        border: Border.all(color: AppColors.primary, width: 1.5),
                      ),
                      padding:
                          EdgeInsetsDirectional.symmetric(horizontal: 16.w),
                      child: Row(
                        children: [
                          Icon(
                            Icons.search_rounded,
                            size: 18.r,
                            color: AppColors.textSecondary,
                          ),
                          SizedBox(width: 9.w),
                          Expanded(
                            child: TextField(
                              controller: _controller,
                              autofocus: true,
                              style: GoogleFonts.cairo(
                                fontSize: 14.sp,
                                color: AppColors.textPrimary,
                              ),
                              decoration: InputDecoration(
                                hintText: ar
                                    ? 'ابحث عن كتاب أو ناشر…'
                                    : 'Search books or publishers…',
                                hintStyle: GoogleFonts.cairo(
                                  fontSize: 14.sp,
                                  color: AppColors.textHint,
                                ),
                                border: InputBorder.none,
                                contentPadding: EdgeInsets.zero,
                                isDense: true,
                              ),
                              onChanged: (q) =>
                                  context.read<SearchCubit>().onQueryChanged(q),
                            ),
                          ),
                          BlocBuilder<SearchCubit, SearchState>(
                            builder: (_, state) => state is! SearchInitial
                                ? GestureDetector(
                                    onTap: () {
                                      _controller.clear();
                                      context
                                          .read<SearchCubit>()
                                          .onQueryChanged('');
                                    },
                                    child: Icon(
                                      Icons.close_rounded,
                                      size: 17.r,
                                      color: AppColors.textHint,
                                    ),
                                  )
                                : const SizedBox.shrink(),
                          ),
                        ],
                      ),
                    ),
                  ),
                ],
              ),
            ),
            Expanded(
              child: BlocBuilder<SearchCubit, SearchState>(
                builder: (ctx, state) {
                  return AnimatedSwitcher(
                    duration: const Duration(milliseconds: 300),
                    child: switch (state) {
                      SearchInitial() => KeyedSubtree(
                          key: const ValueKey('initial'),
                          child: SearchRecentChips(locale: locale),
                        ),
                      SearchLoading() => const Center(
                          key: ValueKey('loading'),
                          child: AppLoadingIndicator(),
                        ),
                      SearchSuccess(:final results) => KeyedSubtree(
                          key: const ValueKey('success'),
                          child: SearchResultsList(
                            results: results,
                            locale: locale,
                            onBookTap: (b) => Navigator.of(ctx).pushNamed(
                              AppRoutes.bookDetail,
                              arguments:
                                  BookDetailArgs(slug: b.id, titleAr: b.titleAr),
                            ),
                          ),
                        ),
                      SearchEmpty(:final query) => KeyedSubtree(
                          key: const ValueKey('empty'),
                          child: SearchNoResults(
                            query: query,
                            locale: locale,
                            onSuggestion: (s) {
                              _controller.text = s;
                              ctx.read<SearchCubit>().onQueryChanged(s);
                            },
                          ),
                        ),
                      SearchError(:final message) => Center(
                          key: const ValueKey('error'),
                          child: ErrorStateWidget(message: message),
                        ),
                    },
                  );
                },
              ),
            ),
          ],
        ),
      ),
    );
  }
}
