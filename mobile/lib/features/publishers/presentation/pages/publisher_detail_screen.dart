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
import '../../../../core/widgets/bottom_nav_widget.dart';
import '../../../../core/widgets/empty_state_widget.dart';
import '../../../../core/widgets/error_state_widget.dart';
import '../../../../core/widgets/section_header_widget.dart';
import '../../../books/domain/entities/book.dart';
import '../../../books/presentation/widgets/book_card_widget.dart';
import '../cubit/publisher_detail_cubit/publisher_detail_cubit.dart';
import '../cubit/publisher_detail_cubit/publisher_detail_state.dart';
import '../../domain/entities/publisher.dart';

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
        builder: (ctx, state) => switch (state) {
          PublisherDetailLoading() ||
          PublisherDetailInitial() =>
            const Center(child: AppLoadingIndicator()),
          PublisherDetailError(:final message) => Center(
              child: ErrorStateWidget(
                message: message,
                onRetry: () =>
                    ctx.read<PublisherDetailCubit>().load(widget.args.slug),
              ),
            ),
          PublisherDetailSuccess(:final publisher, :final books) => Column(
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
                      arguments: BookDetailArgs(
                        slug: book.id,
                        titleAr: book.titleAr,
                      ),
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

// ── Detail body ───────────────────────────────────────────────────────────
class _DetailBody extends StatelessWidget {
  const _DetailBody({
    required this.publisher,
    required this.books,
    required this.locale,
    required this.onBookTap,
  });

  final Publisher publisher;
  final List<Book> books;
  final String locale;
  final ValueChanged<Book> onBookTap;

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
                title: ar ? 'حول الناشر' : 'About',
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
              title: ar ? 'كتبهم' : 'Their Books',
            ),
          ),
        ),
        if (books.isEmpty)
          SliverFillRemaining(
            child: EmptyStateWidget(
              icon: Icons.menu_book_outlined,
              title: ar ? 'لا توجد كتب' : 'No books yet',
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
                (_, i) => BookCardWidget(
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
          begin: Alignment.topLeft,
          end: Alignment.bottomRight,
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
                  '${publisher.bookCount} ${ar ? 'كتاب' : 'books'}',
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
