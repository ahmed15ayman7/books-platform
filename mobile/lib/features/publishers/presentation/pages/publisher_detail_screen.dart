import 'package:easy_localization/easy_localization.dart';
import 'package:flutter/material.dart';
import 'package:flutter_bloc/flutter_bloc.dart';
import 'package:flutter_screenutil/flutter_screenutil.dart';
import 'package:google_fonts/google_fonts.dart';

import '../../../../core/router/app_routes.dart';
import '../../../../core/router/args/book_detail_args.dart';
import '../../../../core/router/args/publisher_detail_args.dart';
import '../../../../core/theme/app_colors.dart';
import '../../../../core/theme/app_shadows.dart';
import '../../../../core/widgets/app_bar_widget.dart';
import '../../../../core/widgets/app_loading_indicator.dart';
import '../../../../core/widgets/book_cover_widget.dart';
import '../../../../core/widgets/bottom_nav_widget.dart';
import '../../../../core/widgets/empty_state_widget.dart';
import '../../../../core/widgets/error_state_widget.dart';
import '../../../../core/widgets/section_header_widget.dart';
import '../../../../core/widgets/translation_status_badge.dart';
import '../../domain/entities/publisher.dart';
import '../../domain/entities/publisher_book.dart';
import '../cubit/publisher_detail_cubit/publisher_detail_cubit.dart';
import '../cubit/publisher_detail_cubit/publisher_detail_state.dart';

class PublisherDetailScreen extends StatefulWidget {
  const PublisherDetailScreen({super.key, required this.args});
  final PublisherDetailArgs args;

  @override
  State<PublisherDetailScreen> createState() => _PublisherDetailScreenState();
}

class _PublisherDetailScreenState extends State<PublisherDetailScreen> {
  @override
  void initState() {
    super.initState();
    context.read<PublisherDetailCubit>().load(widget.args.slug);
  }

  @override
  Widget build(BuildContext context) {
    final locale = context.locale.languageCode;
    return Scaffold(
      backgroundColor: AppColors.background,
      body: BlocBuilder<PublisherDetailCubit, PublisherDetailState>(
        builder: (ctx, state) {
          return AnimatedSwitcher(
            duration: const Duration(milliseconds: 300),
            child: switch (state) {
              PublisherDetailLoading() ||
              PublisherDetailInitial() =>
                const Center(key: ValueKey('loading'), child: AppLoadingIndicator()),
              PublisherDetailError(:final message) => Center(
                  key: const ValueKey('error'),
                  child: ErrorStateWidget(
                    message: message,
                    onRetry: () =>
                        ctx.read<PublisherDetailCubit>().load(widget.args.slug),
                  ),
                ),
              PublisherDetailSuccess(:final publisher, :final books) => Column(
                  key: const ValueKey('success'),
                  children: [
                AppBarWidget(
                  variant: AppBarVariant.title,
                  title: publisher.name,
                  showBack: true,
                  currentLocale: locale,
                  onLocaleChanged: (l) => context.setLocale(Locale(l)),
                  onCart: () =>
                      Navigator.of(ctx).pushNamed(AppRoutes.cart),
                ),
                Expanded(
                  child: _DetailBody(
                    publisher: publisher,
                    books: books,
                    locale: locale,
                    onBookTap: (book) => Navigator.of(ctx).pushNamed(
                      AppRoutes.bookDetail,
                      arguments: BookDetailArgs(slug: book.id, titleAr: book.titleAr),
                    ),
                  ),
                ),
                BottomNavWidget(
                  activeTab: BottomNavTab.publishers,
                  onTabSelected: (tab) => _onTabSelected(ctx, tab),
                  onPublishTap: () =>
                      Navigator.of(ctx).pushNamed(AppRoutes.publish),
                  currentLocale: locale,
                ),
              ],
            ),
            },
          );
        },
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

class _DetailBody extends StatelessWidget {
  const _DetailBody({
    required this.publisher,
    required this.books,
    required this.locale,
    required this.onBookTap,
  });

  final Publisher publisher;
  final List<PublisherBook> books;
  final String locale;
  final ValueChanged<PublisherBook> onBookTap;

  @override
  Widget build(BuildContext context) {
    final ar = locale == 'ar';
    return CustomScrollView(
      slivers: [
        SliverToBoxAdapter(child: _PublisherHeader(publisher: publisher, ar: ar)),
        if (publisher.aboutAr != null && publisher.aboutAr!.isNotEmpty) ...[
          SliverToBoxAdapter(
            child: Padding(
              padding: EdgeInsetsDirectional.fromSTEB(16.w, 20.h, 16.w, 0),
              child: SectionHeaderWidget(
                title: 'publishers.about'.tr(),
              ),
            ),
          ),
          SliverToBoxAdapter(
            child: Padding(
              padding: EdgeInsetsDirectional.fromSTEB(16.w, 10.h, 16.w, 0),
              child: Text(
                publisher.aboutAr!,
                style: GoogleFonts.tajawal(
                  fontSize: 14.sp,
                  color: AppColors.textSecondary,
                  height: 1.7,
                ),
              ),
            ),
          ),
        ],
        SliverToBoxAdapter(
          child: Padding(
            padding: EdgeInsetsDirectional.fromSTEB(16.w, 24.h, 16.w, 0),
            child: SectionHeaderWidget(
              title: 'publishers.their_books'.tr(),
            ),
          ),
        ),
        if (books.isEmpty)
          SliverFillRemaining(
            child: EmptyStateWidget(
              icon: Icons.menu_book_outlined,
              title: 'publishers.no_books'.tr(),
            ),
          )
        else
          SliverPadding(
            padding: EdgeInsetsDirectional.fromSTEB(16.w, 12.h, 16.w, 24.h),
            sliver: SliverGrid(
              gridDelegate: SliverGridDelegateWithFixedCrossAxisCount(
                crossAxisCount: 2,
                crossAxisSpacing: 12.w,
                mainAxisSpacing: 14.h,
                childAspectRatio: 0.46,
              ),
              delegate: SliverChildBuilderDelegate(
                (_, i) => _PublisherBookCard(
                  book: books[i],
                  locale: locale,
                  onTap: () => onBookTap(books[i]),
                ),
                childCount: books.length,
              ),
            ),
          ),
      ],
    );
  }
}

// ── Publisher header ──────────────────────────────────────────────────────
class _PublisherHeader extends StatelessWidget {
  const _PublisherHeader({required this.publisher, required this.ar});
  final Publisher publisher;
  final bool ar;

  @override
  Widget build(BuildContext context) {
    final initials = publisher.name
        .split(' ')
        .take(2)
        .map((w) => w.isNotEmpty ? w[0].toUpperCase() : '')
        .join();

    return Container(
      width: double.infinity,
      decoration: const BoxDecoration(
        gradient: LinearGradient(
          begin: AlignmentDirectional.topStart,
          end: AlignmentDirectional.bottomEnd,
          colors: [AppColors.secondary, Color(0xFF2C2C2C)],
        ),
        boxShadow: AppShadows.softLg,
      ),
      padding: EdgeInsetsDirectional.fromSTEB(
        16.w,
        MediaQuery.of(context).padding.top + 16.h,
        16.w,
        28.h,
      ),
      child: Column(
        children: [
          Container(
            width: 80.r,
            height: 80.r,
            decoration: const BoxDecoration(
              color: Colors.white,
              shape: BoxShape.circle,
            ),
            child: Center(
              child: Text(
                initials,
                style: GoogleFonts.cairo(
                  fontSize: 28.sp,
                  fontWeight: FontWeight.w800,
                  color: AppColors.primary,
                ),
              ),
            ),
          ),
          SizedBox(height: 12.h),
          Text(
            publisher.name,
            textAlign: TextAlign.center,
            style: GoogleFonts.cairo(
              fontSize: 20.sp,
              fontWeight: FontWeight.w800,
              color: Colors.white,
            ),
          ),
          SizedBox(height: 6.h),
          Row(
            mainAxisAlignment: MainAxisAlignment.center,
            children: [
              Text(
                publisher.countryFlag,
                style: TextStyle(fontSize: 16.sp),
              ),
              SizedBox(width: 6.w),
              Text(
                ar ? publisher.countryAr : publisher.countryEn,
                style: GoogleFonts.tajawal(
                  fontSize: 13.sp,
                  color: Colors.white70,
                ),
              ),
              SizedBox(width: 12.w),
              Container(
                padding: EdgeInsetsDirectional.fromSTEB(10.w, 3.h, 10.w, 3.h),
                decoration: BoxDecoration(
                  color: AppColors.primary,
                  borderRadius: BorderRadius.circular(999),
                ),
                child: Text(
                  '${publisher.bookCount} ${'common.books'.tr()}',
                  style: GoogleFonts.inter(
                    fontSize: 11.sp,
                    fontWeight: FontWeight.w700,
                    color: Colors.white,
                  ),
                ),
              ),
            ],
          ),
        ],
      ),
    );
  }
}

class _PublisherBookCard extends StatelessWidget {
  const _PublisherBookCard({
    required this.book,
    required this.onTap,
    this.locale = 'ar',
  });

  final PublisherBook book;
  final VoidCallback onTap;
  final String locale;

  @override
  Widget build(BuildContext context) {
    return GestureDetector(
      onTap: onTap,
      child: Container(
        decoration: BoxDecoration(
          color: AppColors.surface,
          borderRadius: BorderRadius.circular(24.r),
          border: Border.all(color: AppColors.divider),
          boxShadow: AppShadows.soft,
        ),
        clipBehavior: Clip.hardEdge,
        child: Column(
          crossAxisAlignment: CrossAxisAlignment.start,
          children: [
            AspectRatio(
              aspectRatio: 3 / 4,
              child: Stack(
                children: [
                  BookCoverWidget(
                    coverColors: book.coverColors,
                    titleAr: book.titleAr,
                    titleEn: book.titleEn,
                    publisher: book.publisher,
                  ),
                  if (book.isNew)
                    PositionedDirectional(
                      top: 8.h,
                      start: 8.w,
                      child: Container(
                        padding: EdgeInsets.symmetric(
                          horizontal: 8.w,
                          vertical: 3.h,
                        ),
                        decoration: BoxDecoration(
                          color: AppColors.primary,
                          borderRadius: BorderRadius.circular(999),
                        ),
                        child: Text(
                          'common.new_badge'.tr(),
                          style: GoogleFonts.tajawal(
                            fontSize: 10.sp,
                            fontWeight: FontWeight.w700,
                            color: Colors.white,
                          ),
                        ),
                      ),
                    ),
                ],
              ),
            ),
            Padding(
              padding: EdgeInsetsDirectional.all(11.r),
              child: Column(
                crossAxisAlignment: CrossAxisAlignment.start,
                children: [
                  Text(
                    locale == 'ar' ? book.titleAr : book.titleEn,
                    style: GoogleFonts.cairo(
                      fontSize: 14.5.sp,
                      fontWeight: FontWeight.w700,
                      color: AppColors.textPrimary,
                      height: 1.45,
                    ),
                    maxLines: 2,
                    overflow: TextOverflow.ellipsis,
                  ),
                  SizedBox(height: 4.h),
                  Text(
                    book.publisher,
                    style: GoogleFonts.inter(
                      fontSize: 11.5.sp,
                      color: AppColors.textSecondary,
                    ),
                    maxLines: 1,
                    overflow: TextOverflow.ellipsis,
                  ),
                  SizedBox(height: 5.h),
                  TranslationStatusBadge(
                    status: book.status,
                    small: true,
                    locale: locale,
                  ),
                ],
              ),
            ),
          ],
        ),
      ),
    );
  }
}
