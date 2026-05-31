import 'package:easy_localization/easy_localization.dart';
import 'package:flutter/material.dart';
import 'package:flutter_bloc/flutter_bloc.dart';
import 'package:flutter_screenutil/flutter_screenutil.dart';
import 'package:google_fonts/google_fonts.dart';

import '../../../../core/router/app_routes.dart';
import '../../../../core/router/args/book_detail_args.dart';
import '../../../../core/theme/app_colors.dart';
import '../../../../core/theme/app_shadows.dart';
import '../../../../core/widgets/app_loading_indicator.dart';
import '../../../../core/widgets/book_cover_widget.dart';
import '../../domain/entities/search_result.dart';
import '../cubit/search_cubit.dart';
import '../cubit/search_state.dart';

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
      body: Column(
        children: [
          // Sticky search header
          Container(
            color: AppColors.surface,
            padding: EdgeInsetsDirectional.fromSTEB(
              16.w,
              MediaQuery.of(context).padding.top + 8.h,
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
                    padding: EdgeInsetsDirectional.symmetric(horizontal: 16.w),
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
          // Results area
          Expanded(
            child: BlocBuilder<SearchCubit, SearchState>(
              builder: (ctx, state) => switch (state) {
                SearchInitial() => _RecentChips(locale: locale),
                SearchLoading() =>
                  const Center(child: AppLoadingIndicator()),
                SearchSuccess(:final results) => _ResultsList(
                    results: results,
                    locale: locale,
                    onBookTap: (b) => Navigator.of(ctx).pushNamed(
                      AppRoutes.bookDetail,
                      arguments: BookDetailArgs(slug: b.id, titleAr: b.titleAr),
                    ),
                  ),
                SearchEmpty(:final query) => _NoResults(
                    query: query,
                    locale: locale,
                    onSuggestion: (s) {
                      _controller.text = s;
                      ctx.read<SearchCubit>().onQueryChanged(s);
                    },
                  ),
                SearchError(:final message) => Center(
                    child: Text(
                      message,
                      style: GoogleFonts.tajawal(
                        color: AppColors.textSecondary,
                      ),
                    ),
                  ),
              },
            ),
          ),
        ],
      ),
    );
  }
}

// ── Recent chips ──────────────────────────────────────────────────────────
class _RecentChips extends StatelessWidget {
  const _RecentChips({required this.locale});
  final String locale;

  @override
  Widget build(BuildContext context) {
    final ar = locale == 'ar';
    final recent = ['هارفارد', 'فلسفة', 'ماركيز'];
    return Padding(
      padding: EdgeInsetsDirectional.fromSTEB(16.w, 16.h, 16.w, 4.h),
      child: Column(
        crossAxisAlignment: CrossAxisAlignment.start,
        children: [
          Text(
            ar ? 'عمليات بحث حديثة' : 'Recent searches',
            style: GoogleFonts.cairo(
              fontSize: 13.sp,
              fontWeight: FontWeight.w700,
              color: AppColors.textSecondary,
            ),
          ),
          SizedBox(height: 10.h),
          Wrap(
            spacing: 8.w,
            children: recent
                .map(
                  (r) => Container(
                    padding:
                        EdgeInsets.symmetric(horizontal: 14.w, vertical: 7.h),
                    decoration: BoxDecoration(
                      color: AppColors.surface,
                      border: Border.all(color: AppColors.divider),
                      borderRadius: BorderRadius.circular(999),
                    ),
                    child: Row(
                      mainAxisSize: MainAxisSize.min,
                      children: [
                        Icon(
                          Icons.search_rounded,
                          size: 13.r,
                          color: AppColors.textHint,
                        ),
                        SizedBox(width: 6.w),
                        Text(
                          r,
                          style: GoogleFonts.cairo(
                            fontSize: 13.sp,
                            fontWeight: FontWeight.w600,
                            color: AppColors.textPrimary,
                          ),
                        ),
                      ],
                    ),
                  ),
                )
                .toList(),
          ),
        ],
      ),
    );
  }
}

// ── Results list ──────────────────────────────────────────────────────────
class _ResultsList extends StatelessWidget {
  const _ResultsList({
    required this.results,
    required this.locale,
    required this.onBookTap,
  });
  final List<SearchResult> results;
  final String locale;
  final ValueChanged<dynamic> onBookTap;

  @override
  Widget build(BuildContext context) {
    final ar = locale == 'ar';
    return ListView.separated(
      padding: EdgeInsetsDirectional.all(16.r),
      itemCount: results.length,
      separatorBuilder: (_, i) => SizedBox(height: 10.h),
      itemBuilder: (_, i) {
        final r = results[i];
        return switch (r) {
          BookSearchResult(:final book) => GestureDetector(
              onTap: () => onBookTap(book),
              child: Container(
                padding: EdgeInsetsDirectional.all(11.r),
                decoration: BoxDecoration(
                  color: AppColors.surface,
                  border: Border.all(color: AppColors.divider),
                  borderRadius: BorderRadius.circular(16.r),
                  boxShadow: AppShadows.soft,
                ),
                child: Row(
                  children: [
                    SizedBox(
                      width: 46.w,
                      child: AspectRatio(
                        aspectRatio: 3 / 4,
                        child: ClipRRect(
                          borderRadius: BorderRadius.circular(6.r),
                          child: BookCoverWidget(
                            coverColors: book.coverColors,
                            titleAr: book.titleAr,
                            titleEn: book.titleEn,
                            publisher: book.publisher,
                          ),
                        ),
                      ),
                    ),
                    SizedBox(width: 12.w),
                    Expanded(
                      child: Column(
                        crossAxisAlignment: CrossAxisAlignment.start,
                        children: [
                          Text(
                            ar ? book.titleAr : book.titleEn,
                            style: GoogleFonts.cairo(
                              fontSize: 14.sp,
                              fontWeight: FontWeight.w700,
                              color: AppColors.textPrimary,
                              height: 1.4,
                            ),
                            maxLines: 2,
                            overflow: TextOverflow.ellipsis,
                          ),
                          SizedBox(height: 3.h),
                          Text(
                            book.publisher,
                            style: GoogleFonts.inter(
                              fontSize: 11.5.sp,
                              color: AppColors.textSecondary,
                            ),
                          ),
                        ],
                      ),
                    ),
                    Container(
                      padding: EdgeInsetsDirectional.fromSTEB(
                          9.w, 3.h, 9.w, 3.h),
                      decoration: BoxDecoration(
                        color: AppColors.brandRedSoft,
                        borderRadius: BorderRadius.circular(999),
                      ),
                      child: Text(
                        ar ? 'كتاب' : 'Book',
                        style: GoogleFonts.tajawal(
                          fontSize: 10.5.sp,
                          fontWeight: FontWeight.w700,
                          color: AppColors.primary,
                        ),
                      ),
                    ),
                  ],
                ),
              ),
            ),
          PublisherSearchResult(:final publisher) => Container(
              padding: EdgeInsetsDirectional.all(11.r),
              decoration: BoxDecoration(
                color: AppColors.surface,
                border: Border.all(color: AppColors.divider),
                borderRadius: BorderRadius.circular(16.r),
                boxShadow: AppShadows.soft,
              ),
              child: Row(
                children: [
                  Container(
                    width: 46.r,
                    height: 46.r,
                    decoration: BoxDecoration(
                      color: AppColors.secondary,
                      borderRadius: BorderRadius.circular(12.r),
                    ),
                    child: Center(
                      child: Text(
                        publisher.name
                            .split(' ')
                            .take(2)
                            .map((w) => w.isNotEmpty ? w[0] : '')
                            .join(),
                        style: GoogleFonts.cairo(
                          fontSize: 15.sp,
                          fontWeight: FontWeight.w800,
                          color: Colors.white,
                        ),
                      ),
                    ),
                  ),
                  SizedBox(width: 12.w),
                  Expanded(
                    child: Column(
                      crossAxisAlignment: CrossAxisAlignment.start,
                      children: [
                        Text(
                          publisher.name,
                          style: GoogleFonts.cairo(
                            fontSize: 14.sp,
                            fontWeight: FontWeight.w700,
                            color: AppColors.textPrimary,
                          ),
                        ),
                        SizedBox(height: 3.h),
                        Text(
                          '${publisher.countryFlag} ${publisher.bookCount} ${ar ? 'كتاب' : 'books'}',
                          style: GoogleFonts.inter(
                            fontSize: 11.5.sp,
                            color: AppColors.textSecondary,
                          ),
                        ),
                      ],
                    ),
                  ),
                  Container(
                    padding: EdgeInsetsDirectional.fromSTEB(
                        9.w, 3.h, 9.w, 3.h),
                    decoration: BoxDecoration(
                      color: AppColors.secondary,
                      borderRadius: BorderRadius.circular(999),
                    ),
                    child: Text(
                      ar ? 'ناشر' : 'Publisher',
                      style: GoogleFonts.tajawal(
                        fontSize: 10.5.sp,
                        fontWeight: FontWeight.w700,
                        color: Colors.white,
                      ),
                    ),
                  ),
                ],
              ),
            ),
        };
      },
    );
  }
}

// ── No results ────────────────────────────────────────────────────────────
class _NoResults extends StatelessWidget {
  const _NoResults({
    required this.query,
    required this.locale,
    required this.onSuggestion,
  });
  final String query;
  final String locale;
  final ValueChanged<String> onSuggestion;

  @override
  Widget build(BuildContext context) {
    final ar = locale == 'ar';
    final suggestions = ['فلسفة', 'اقتصاد', 'Harvard'];
    return Padding(
      padding: EdgeInsetsDirectional.all(32.r),
      child: Column(
        mainAxisAlignment: MainAxisAlignment.center,
        children: [
          Container(
            width: 88.r,
            height: 88.r,
            decoration: BoxDecoration(
              color: AppColors.inputFill,
              shape: BoxShape.circle,
            ),
            child: Icon(
              Icons.search_off_rounded,
              size: 38.r,
              color: AppColors.textHint,
            ),
          ),
          SizedBox(height: 18.h),
          Text(
            '${ar ? 'لا نتائج لـ' : 'No results for'} «$query»',
            style: GoogleFonts.cairo(
              fontSize: 17.sp,
              fontWeight: FontWeight.w800,
              color: AppColors.textPrimary,
            ),
            textAlign: TextAlign.center,
          ),
          SizedBox(height: 8.h),
          Text(
            ar ? 'جرّب إحدى هذه الاقتراحات:' : 'Try one of these suggestions:',
            style: GoogleFonts.tajawal(
              fontSize: 13.sp,
              color: AppColors.textSecondary,
            ),
          ),
          SizedBox(height: 18.h),
          Wrap(
            spacing: 8.w,
            children: suggestions
                .map(
                  (s) => GestureDetector(
                    onTap: () => onSuggestion(s),
                    child: Container(
                      padding: EdgeInsets.symmetric(
                          horizontal: 15.w, vertical: 7.h),
                      decoration: BoxDecoration(
                        color: Colors.transparent,
                        border: Border.all(color: AppColors.primary),
                        borderRadius: BorderRadius.circular(999),
                      ),
                      child: Text(
                        s,
                        style: GoogleFonts.cairo(
                          fontSize: 13.sp,
                          fontWeight: FontWeight.w700,
                          color: AppColors.primary,
                        ),
                      ),
                    ),
                  ),
                )
                .toList(),
          ),
        ],
      ),
    );
  }
}
