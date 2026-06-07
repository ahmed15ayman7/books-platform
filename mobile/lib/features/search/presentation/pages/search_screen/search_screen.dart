import 'package:easy_localization/easy_localization.dart';
import 'package:flutter/material.dart';
import 'package:flutter_bloc/flutter_bloc.dart';
import 'package:flutter_screenutil/flutter_screenutil.dart';
import 'package:google_fonts/google_fonts.dart';

import '../../../../../core/router/app_routes.dart';
import '../../../../../core/router/args/article_detail_args.dart';
import '../../../../../core/router/args/book_detail_args.dart';
import '../../../../../core/router/args/publisher_detail_args.dart';
import '../../../../../core/theme/app_colors.dart';
import '../../../../../core/widgets/app_loading_indicator.dart';
import '../../../../../core/widgets/error_state_widget.dart';
import '../../../domain/entities/search_section_type.dart';
import '../../../domain/entities/search_suggestion.dart';
import '../../cubit/search_cubit.dart';
import '../../cubit/search_state.dart';
import 'search_no_results.dart';
import 'search_recent_chips.dart';
import 'search_results_list.dart';
import 'search_suggestions_list.dart';
import 'search_tabs.dart';

class SearchScreen extends StatefulWidget {
  const SearchScreen({super.key});

  @override
  State<SearchScreen> createState() => _SearchScreenState();
}

class _SearchScreenState extends State<SearchScreen> {
  final _controller = TextEditingController();
  final _focusNode = FocusNode();
  late final ScrollController _scrollController;
  bool _isFocused = false;

  @override
  void initState() {
    super.initState();
    _scrollController = ScrollController()..addListener(_onScroll);
    _focusNode.addListener(() {
      setState(() => _isFocused = _focusNode.hasFocus);
    });
  }

  @override
  void dispose() {
    _controller.dispose();
    _focusNode.dispose();
    _scrollController.dispose();
    super.dispose();
  }

  void _onScroll() {
    if (_scrollController.position.pixels >=
        _scrollController.position.maxScrollExtent - 300) {
      context.read<SearchCubit>().loadMore();
    }
  }

  void _fillField(BuildContext ctx, String text) {
    final locale = ctx.locale.languageCode;
    _controller.text = text;
    _controller.selection = TextSelection.collapsed(offset: text.length);
    ctx.read<SearchCubit>().onQueryChanged(text, locale);
  }

  void _onSuggestionTap(BuildContext ctx, SearchSuggestion suggestion) {
    final locale = ctx.locale.languageCode;
    switch (suggestion.type) {
      case 'publisher':
        Navigator.of(ctx).pushNamed(
          AppRoutes.publisherDetail,
          arguments: PublisherDetailArgs(
            slug: suggestion.slug,
            name: suggestion.displayLabel(locale),
          ),
        );
      case 'article':
        Navigator.of(ctx).pushNamed(
          AppRoutes.articleDetail,
          arguments: ArticleDetailArgs(
            id: suggestion.slug,
            title: suggestion.displayLabel(locale),
          ),
        );
      default:
        Navigator.of(ctx).pushNamed(
          AppRoutes.bookDetail,
          arguments: BookDetailArgs(
            slug: suggestion.slug,
            titleAr: suggestion.label,
          ),
        );
    }
  }

  @override
  Widget build(BuildContext context) {
    final locale = context.locale.languageCode;
    return Scaffold(
      backgroundColor: AppColors.background,
      body: SafeArea(
        child: Column(
          children: [
            Container(
              color: AppColors.surface,
              padding: EdgeInsetsDirectional.fromSTEB(16.w, 8.h, 16.w, 12.h),
              child: Row(
                children: [
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
                                hintText: 'search.hint'.tr(),
                                hintStyle: GoogleFonts.cairo(
                                  fontSize: 14.sp,
                                  color: AppColors.textHint,
                                ),
                                border: InputBorder.none,
                                contentPadding: EdgeInsets.zero,
                                isDense: true,
                              ),
                              onChanged: (q) => context
                                  .read<SearchCubit>()
                                  .onQueryChanged(q, locale),
                            ),
                          ),
                          BlocBuilder<SearchCubit, SearchState>(
                            builder: (_, state) =>
                                state is! SearchInitial &&
                                        _controller.text.isNotEmpty
                                    ? GestureDetector(
                                        onTap: () {
                                          _controller.clear();
                                          context
                                              .read<SearchCubit>()
                                              .onQueryChanged('', locale);
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
                          child: SearchRecentChips(
                            locale: locale,
                            onChipTap: (s) => _fillField(ctx, s),
                          ),
                        ),
                      SearchLoading() => const Center(
                          key: ValueKey('loading'),
                          child: AppLoadingIndicator(),
                        ),
                      SearchSuccess(
                        :final suggestions,
                        :final tab,
                        :final response,
                        :final isLoadingMore,
                      ) =>
                        KeyedSubtree(
                          key: ValueKey('success-$tab'),
                          child: Column(
                            children: [
                              SearchSuggestionsList(
                                suggestions: suggestions,
                                locale: locale,
                                onSuggestionTap: (s) =>
                                    _onSuggestionTap(ctx, s),
                              ),
                              SearchTabs(
                                activeTab: tab,
                                totals: {
                                  SearchSectionType.all: response.totalResults,
                                  SearchSectionType.books: response.booksTotal,
                                  SearchSectionType.articles:
                                      response.articlesTotal,
                                  SearchSectionType.publishers:
                                      response.publishersTotal,
                                },
                                onTabTap: (t) =>
                                    ctx.read<SearchCubit>().changeTab(t),
                              ),
                              Expanded(
                                child: state.isTabEmpty
                                    ? _TabEmptyState(tab: tab)
                                    : SearchResultsList(
                                        results: state.results,
                                        locale: locale,
                                        isLoadingMore: isLoadingMore,
                                        scrollController: _scrollController,
                                        onBookTap: (b) =>
                                            Navigator.of(ctx).pushNamed(
                                          AppRoutes.bookDetail,
                                          arguments: BookDetailArgs(
                                            slug: b.slug,
                                            titleAr: b.titleAr,
                                          ),
                                        ),
                                        onPublisherTap: (p) =>
                                            Navigator.of(ctx).pushNamed(
                                          AppRoutes.publisherDetail,
                                          arguments: PublisherDetailArgs(
                                            slug: p.id,
                                            name: p.name,
                                          ),
                                        ),
                                        onArticleTap: (a) =>
                                            Navigator.of(ctx).pushNamed(
                                          AppRoutes.articleDetail,
                                          arguments: ArticleDetailArgs(
                                            id: a.slug,
                                            title: a.displayTitle(locale),
                                          ),
                                        ),
                                      ),
                              ),
                            ],
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

class _TabEmptyState extends StatelessWidget {
  const _TabEmptyState({required this.tab});
  final SearchSectionType tab;

  @override
  Widget build(BuildContext context) {
    final label = switch (tab) {
      SearchSectionType.books => 'search.tab_books'.tr(),
      SearchSectionType.articles => 'search.tab_articles'.tr(),
      SearchSectionType.publishers => 'search.tab_publishers'.tr(),
      SearchSectionType.all => 'search.tab_all'.tr(),
    };
    return Center(
      child: Padding(
        padding: EdgeInsetsDirectional.all(32.r),
        child: Text(
          'search.tab_empty'.tr(args: [label]),
          style: GoogleFonts.cairo(
            fontSize: 15.sp,
            fontWeight: FontWeight.w600,
            color: AppColors.textSecondary,
          ),
          textAlign: TextAlign.center,
        ),
      ),
    );
  }
}
