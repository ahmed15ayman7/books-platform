import 'package:easy_localization/easy_localization.dart';
import 'package:flutter/material.dart';
import 'package:flutter_bloc/flutter_bloc.dart';
import 'package:flutter_screenutil/flutter_screenutil.dart';
import 'package:google_fonts/google_fonts.dart';

import '../../../../../core/router/app_routes.dart';
import '../../../../../core/router/args/book_detail_args.dart';
import '../../../../../core/router/args/publisher_detail_args.dart';
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
  // $mobile-debug-skill | Problem: border was always AppColors.primary (red) regardless of focus, making unfocused state look like an error. Fix: FocusNode drives border colour — divider when idle, primary when focused.
  final _focusNode = FocusNode();
  bool _isFocused = false;

  @override
  void initState() {
    super.initState();
    _focusNode.addListener(() {
      setState(() => _isFocused = _focusNode.hasFocus);
    });
  }

  @override
  void dispose() {
    _controller.dispose();
    _focusNode.dispose();
    super.dispose();
  }

  void _fillField(BuildContext ctx, String text) {
    _controller.text = text;
    _controller.selection = TextSelection.collapsed(offset: text.length);
    ctx.read<SearchCubit>().onQueryChanged(text);
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
                  // $mobile-debug-skill | Problem: back button was a bare unstyled Icon with tiny tap area. Fix: wrapped in a styled circular container matching AppBarWidget._BackButton pattern.
                  GestureDetector(
                    onTap: () => Navigator.of(context).pop(),
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
                  ),
                  SizedBox(width: 10.w),
                  Expanded(
                    child: Container(
                      height: 46.h,
                      decoration: BoxDecoration(
                        color: AppColors.inputFill,
                        borderRadius: BorderRadius.circular(999),
                        border: Border.all(
                          color: _isFocused
                              ? AppColors.primary
                              : AppColors.divider,
                          width: _isFocused ? 1.5 : 1.0,
                        ),
                      ),
                      padding:
                          EdgeInsetsDirectional.symmetric(horizontal: 16.w),
                      child: Row(
                        children: [
                          Icon(
                            Icons.search_rounded,
                            size: 18.r,
                            color: _isFocused
                                ? AppColors.primary
                                : AppColors.textHint,
                          ),
                          SizedBox(width: 9.w),
                          Expanded(
                            child: TextField(
                              controller: _controller,
                              focusNode: _focusNode,
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
                          // $mobile-debug-skill | Problem: recent chips had no tap handler — tapping did nothing. Fix: onChipTap fills the controller and triggers the cubit.
                          child: SearchRecentChips(
                            locale: locale,
                            onChipTap: (s) => _fillField(ctx, s),
                          ),
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
                                  BookDetailArgs(slug: b.slug, titleAr: b.titleAr),
                            ),
                            // $mobile-debug-skill | Problem: publisher results had no tap handler — tapping was silently ignored. Fix: onPublisherTap navigates to publisher detail using slug and name.
                            onPublisherTap: (p) => Navigator.of(ctx).pushNamed(
                              AppRoutes.publisherDetail,
                              arguments:
                                  PublisherDetailArgs(slug: p.id, name: p.name),
                            ),
                          ),
                        ),
                      SearchEmpty(:final query) => KeyedSubtree(
                          key: const ValueKey('empty'),
                          child: SearchNoResults(
                            query: query,
                            locale: locale,
                            onSuggestion: (s) => _fillField(ctx, s),
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
