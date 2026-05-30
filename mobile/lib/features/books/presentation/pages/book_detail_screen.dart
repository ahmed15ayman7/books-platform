import 'package:easy_localization/easy_localization.dart';
import 'package:flutter/material.dart';
import 'package:flutter_bloc/flutter_bloc.dart';
import 'package:flutter_screenutil/flutter_screenutil.dart';
import 'package:google_fonts/google_fonts.dart';

import '../../../../core/di/injection_container.dart';
import '../../../../core/router/app_routes.dart';
import '../../../../core/router/args/book_detail_args.dart';
import '../../../../core/theme/app_colors.dart';
import '../../../../core/widgets/app_loading_indicator.dart';
import '../../../../core/widgets/book_cover_widget.dart';
import '../../../../core/widgets/error_state_widget.dart';
import '../../../../core/widgets/translation_status_badge.dart';
import '../../../cart/presentation/cubit/cart_cubit.dart';
import '../../domain/entities/book.dart';
import '../cubit/book_detail_cubit/book_detail_cubit.dart';
import '../cubit/book_detail_cubit/book_detail_state.dart';
import '../widgets/book_card_widget.dart';

class BookDetailScreen extends StatefulWidget {
  const BookDetailScreen({super.key, required this.args});
  final BookDetailArgs args;

  @override
  State<BookDetailScreen> createState() => _BookDetailScreenState();
}

class _BookDetailScreenState extends State<BookDetailScreen> {
  bool _expanded = false;
  bool _saved = false;

  @override
  void initState() {
    super.initState();
    context.read<BookDetailCubit>().load(widget.args.slug);
  }

  @override
  Widget build(BuildContext context) {
    final locale = context.locale.languageCode;
    return Scaffold(
      backgroundColor: AppColors.background,
      body: BlocBuilder<BookDetailCubit, BookDetailState>(
        builder: (ctx, state) => switch (state) {
          BookDetailLoading() =>
            const Center(child: AppLoadingIndicator()),
          BookDetailError(:final message) => Center(
              child: ErrorStateWidget(
                message: message,
                onRetry: () =>
                    ctx.read<BookDetailCubit>().load(widget.args.slug),
              ),
            ),
          BookDetailSuccess(:final book, :final similarBooks) =>
            _DetailBody(
              book: book,
              similarBooks: similarBooks,
              locale: locale,
              expanded: _expanded,
              saved: _saved,
              onToggleExpand: () =>
                  setState(() => _expanded = !_expanded),
              onToggleSave: () => setState(() => _saved = !_saved),
              onAddCart: () {
                getIt<CartCubit>().addItem(book);
                Navigator.of(ctx).pushNamed(AppRoutes.cart);
              },
              onBookTap: (b) => Navigator.of(ctx).pushReplacementNamed(
                AppRoutes.bookDetail,
                arguments: BookDetailArgs(slug: b.id, titleAr: b.titleAr),
              ),
            ),
          _ => const SizedBox.shrink(),
        },
      ),
    );
  }
}

// ── Detail body ───────────────────────────────────────────────────────────
class _DetailBody extends StatelessWidget {
  const _DetailBody({
    required this.book,
    required this.similarBooks,
    required this.locale,
    required this.expanded,
    required this.saved,
    required this.onToggleExpand,
    required this.onToggleSave,
    required this.onAddCart,
    required this.onBookTap,
  });

  final Book book;
  final List<Book> similarBooks;
  final String locale;
  final bool expanded;
  final bool saved;
  final VoidCallback onToggleExpand;
  final VoidCallback onToggleSave;
  final VoidCallback onAddCart;
  final ValueChanged<Book> onBookTap;

  @override
  Widget build(BuildContext context) {
    final ar = locale == 'ar';
    final isRtl = locale == 'ar';
    return CustomScrollView(
      slivers: [
        // Hero cover
        SliverToBoxAdapter(
          child: _HeroCover(
            book: book,
            locale: locale,
            isRtl: isRtl,
            onBack: () => Navigator.of(context).pop(),
          ),
        ),

        SliverToBoxAdapter(
          child: Padding(
            padding: EdgeInsetsDirectional.fromSTEB(16.w, 16.h, 16.w, 0),
            child: Column(
              crossAxisAlignment: CrossAxisAlignment.start,
              children: [
                // Badges + price row
                Row(
                  children: [
                    TranslationStatusBadge(status: book.status, locale: locale),
                    SizedBox(width: 8.w),
                    Container(
                      padding: EdgeInsetsDirectional.fromSTEB(
                          11.w, 3.h, 11.w, 3.h),
                      decoration: BoxDecoration(
                        color: AppColors.surface,
                        border: Border.all(color: AppColors.divider),
                        borderRadius: BorderRadius.circular(999),
                      ),
                      child: Text(
                        ar
                            ? _catNameAr(book.categorySlug)
                            : _catNameEn(book.categorySlug),
                        style: GoogleFonts.tajawal(
                          fontSize: 12.sp,
                          fontWeight: FontWeight.w700,
                          color: AppColors.textPrimary,
                        ),
                      ),
                    ),
                    const Spacer(),
                    Text(
                      '\$${book.price.toStringAsFixed(2)}',
                      style: GoogleFonts.cairo(
                        fontSize: 20.sp,
                        fontWeight: FontWeight.w800,
                        color: AppColors.primary,
                      ),
                    ),
                  ],
                ),
                SizedBox(height: 16.h),

                // Biblio table
                _BiblioTable(book: book, locale: locale),
                SizedBox(height: 20.h),

                // Description
                Text(
                  ar ? 'وصف الكتاب' : 'Book Description',
                  style: GoogleFonts.cairo(
                    fontSize: 16.sp,
                    fontWeight: FontWeight.w800,
                    color: AppColors.textPrimary,
                  ),
                ),
                SizedBox(height: 8.h),
                Text(
                  book.descriptionAr,
                  style: GoogleFonts.tajawal(
                    fontSize: 14.5.sp,
                    color: AppColors.textSecondary,
                    height: 1.8,
                  ),
                  maxLines: expanded ? null : 3,
                  overflow:
                      expanded ? TextOverflow.visible : TextOverflow.ellipsis,
                ),
                TextButton(
                  onPressed: onToggleExpand,
                  style: TextButton.styleFrom(padding: EdgeInsets.zero),
                  child: Text(
                    ar
                        ? (expanded ? 'عرض أقل' : 'قراءة المزيد')
                        : (expanded ? 'Show less' : 'Read more'),
                    style: GoogleFonts.cairo(
                      fontSize: 13.5.sp,
                      fontWeight: FontWeight.w700,
                      color: AppColors.primary,
                    ),
                  ),
                ),
                SizedBox(height: 18.h),

                // Action buttons
                SizedBox(
                  width: double.infinity,
                  child: ElevatedButton(
                    onPressed: onAddCart,
                    child: Row(
                      mainAxisAlignment: MainAxisAlignment.center,
                      children: [
                        const Icon(Icons.shopping_bag_outlined),
                        SizedBox(width: 8.w),
                        Text(
                          '${ar ? 'أضف إلى السلة' : 'Add to Cart'} · \$${book.price.toStringAsFixed(2)}',
                        ),
                      ],
                    ),
                  ),
                ),
                SizedBox(height: 10.h),
                SizedBox(
                  width: double.infinity,
                  child: OutlinedButton(
                    onPressed: onToggleSave,
                    child: Row(
                      mainAxisAlignment: MainAxisAlignment.center,
                      children: [
                        Icon(
                          saved
                              ? Icons.favorite_rounded
                              : Icons.favorite_border_rounded,
                          color: AppColors.primary,
                        ),
                        SizedBox(width: 8.w),
                        Text(
                          saved
                              ? (ar ? 'تم الحفظ' : 'Saved')
                              : (ar ? 'حفظ في القائمة' : 'Save to Wishlist'),
                        ),
                      ],
                    ),
                  ),
                ),
                SizedBox(height: 26.h),
              ],
            ),
          ),
        ),

        // Similar books
        if (similarBooks.isNotEmpty) ...[
          SliverToBoxAdapter(
            child: Padding(
              padding: EdgeInsetsDirectional.only(bottom: 12.h),
              child: Text(
                ar ? '  كتب مشابهة' : '  Similar Books',
                style: GoogleFonts.cairo(
                  fontSize: 19.sp,
                  fontWeight: FontWeight.w800,
                  color: AppColors.textPrimary,
                ),
              ),
            ),
          ),
          SliverToBoxAdapter(
            child: SingleChildScrollView(
              scrollDirection: Axis.horizontal,
              padding:
                  EdgeInsetsDirectional.fromSTEB(16.w, 0, 16.w, 4.h),
              child: Row(
                crossAxisAlignment: CrossAxisAlignment.start,
                children: similarBooks
                    .map(
                      (b) => Padding(
                        padding: EdgeInsetsDirectional.only(end: 12.w),
                        child: BookCardWidget(
                          book: b,
                          locale: locale,
                          width: 140.w,
                          onTap: () => onBookTap(b),
                        ),
                      ),
                    )
                    .toList(),
              ),
            ),
          ),
        ],
        SliverToBoxAdapter(child: SizedBox(height: 24.h)),
      ],
    );
  }

  String _catNameAr(String slug) => switch (slug) {
        'ideas-and-policies' => 'أفكار وسياسات',
        'social-studies' => 'دراسات اجتماعية',
        'philosophies-and-cultures' => 'فلسفات وثقافات',
        'economy-and-development' => 'اقتصاد وتنمية',
        'languages-and-literature' => 'لغات وآداب',
        'technologies-and-sciences' => 'تقنيات وعلوم',
        'religions-and-beliefs' => 'أديان وعقائد',
        _ => 'أخرى',
      };

  String _catNameEn(String slug) => switch (slug) {
        'ideas-and-policies' => 'Ideas & Policies',
        'social-studies' => 'Social Studies',
        'philosophies-and-cultures' => 'Philosophies & Cultures',
        'economy-and-development' => 'Economy & Development',
        'languages-and-literature' => 'Languages & Literature',
        'technologies-and-sciences' => 'Technologies & Sciences',
        'religions-and-beliefs' => 'Religions & Beliefs',
        _ => 'Other',
      };
}

// ── Hero cover ────────────────────────────────────────────────────────────
class _HeroCover extends StatelessWidget {
  const _HeroCover({
    required this.book,
    required this.locale,
    required this.isRtl,
    required this.onBack,
  });
  final Book book;
  final String locale;
  final bool isRtl;
  final VoidCallback onBack;

  @override
  Widget build(BuildContext context) {
    return SizedBox(
      height: 300.h,
      child: Stack(
        children: [
          // Gradient bg
          Positioned.fill(
            child: Container(
              decoration: BoxDecoration(
                gradient: LinearGradient(
                  begin: Alignment.topLeft,
                  end: Alignment.bottomRight,
                  colors: book.coverColors.length >= 2
                      ? [book.coverColors[1], book.coverColors[0]]
                      : [AppColors.secondary, AppColors.primary],
                ),
              ),
            ),
          ),
          // Cover at 50% opacity
          Positioned.fill(
            child: Opacity(
              opacity: 0.5,
              child: BookCoverWidget(
                coverColors: book.coverColors,
                titleAr: book.titleAr,
                titleEn: book.titleEn,
                publisher: book.publisher,
              ),
            ),
          ),
          // Dark gradient overlay
          Positioned.fill(
            child: DecoratedBox(
              decoration: BoxDecoration(
                gradient: LinearGradient(
                  begin: Alignment.topCenter,
                  end: Alignment.bottomCenter,
                  colors: [
                    Colors.transparent,
                    Colors.black.withValues(alpha: 0.62),
                  ],
                  stops: const [0.45, 1.0],
                ),
              ),
            ),
          ),
          // Controls row
          SafeArea(
            child: Padding(
              padding: EdgeInsetsDirectional.fromSTEB(16.w, 0, 16.w, 0),
              child: Row(
                mainAxisAlignment: MainAxisAlignment.spaceBetween,
                children: [
                  _GlassButton(
                    icon: Transform.scale(
                      scaleX: isRtl ? 1 : -1,
                      child: Icon(
                        Icons.chevron_right_rounded,
                        color: Colors.white,
                        size: 20.r,
                      ),
                    ),
                    onTap: onBack,
                  ),
                  _GlassButton(
                    icon: Icon(
                      Icons.share_outlined,
                      color: Colors.white,
                      size: 18.r,
                    ),
                  ),
                ],
              ),
            ),
          ),
          // Title overlay
          PositionedDirectional(
            bottom: 18.h,
            start: 18.w,
            end: 18.w,
            child: Column(
              crossAxisAlignment: CrossAxisAlignment.start,
              mainAxisSize: MainAxisSize.min,
              children: [
                Text(
                  book.titleAr,
                  style: GoogleFonts.cairo(
                    fontSize: 24.sp,
                    fontWeight: FontWeight.w800,
                    color: Colors.white,
                    height: 1.35,
                    shadows: [
                      Shadow(
                        color: Colors.black.withValues(alpha: 0.4),
                        blurRadius: 12,
                      ),
                    ],
                  ),
                  maxLines: 2,
                  overflow: TextOverflow.ellipsis,
                ),
                Text(
                  book.titleEn,
                  style: GoogleFonts.inter(
                    fontSize: 14.sp,
                    color: Colors.white.withValues(alpha: 0.8),
                    fontStyle: FontStyle.italic,
                  ),
                  maxLines: 1,
                  overflow: TextOverflow.ellipsis,
                ),
              ],
            ),
          ),
        ],
      ),
    );
  }
}

class _GlassButton extends StatelessWidget {
  const _GlassButton({required this.icon, this.onTap});
  final Widget icon;
  final VoidCallback? onTap;

  @override
  Widget build(BuildContext context) {
    return GestureDetector(
      onTap: onTap,
      child: Container(
        width: 40.r,
        height: 40.r,
        decoration: BoxDecoration(
          color: Colors.white.withValues(alpha: 0.16),
          borderRadius: BorderRadius.circular(999),
          border:
              Border.all(color: Colors.white.withValues(alpha: 0.3)),
        ),
        child: Center(child: icon),
      ),
    );
  }
}

// ── Biblio table ──────────────────────────────────────────────────────────
class _BiblioTable extends StatelessWidget {
  const _BiblioTable({required this.book, required this.locale});
  final Book book;
  final String locale;

  @override
  Widget build(BuildContext context) {
    final ar = locale == 'ar';
    final rows = [
      (ar ? 'الناشر' : 'Publisher', book.publisher),
      (
        ar ? 'البلد' : 'Country',
        '${book.countryFlag} ${ar ? book.countryAr : book.countryEn}'
      ),
      (ar ? 'اللغة الأصلية' : 'Original Language', book.originalLanguage),
      (ar ? 'عدد الصفحات' : 'Pages', '${book.pages}'),
      (ar ? 'الطبعة' : 'Edition', book.edition),
      (ar ? 'ISBN' : 'ISBN', book.isbn),
    ];
    return Container(
      decoration: BoxDecoration(
        color: AppColors.surface,
        border: Border.all(color: AppColors.divider),
        borderRadius: BorderRadius.circular(18.r),
        boxShadow: const [
          BoxShadow(
            color: Color(0x0D000000),
            blurRadius: 24,
            offset: Offset(0, 4),
          ),
        ],
      ),
      child: Column(
        children: rows.mapIndexed((i, row) {
          final isLast = i == rows.length - 1;
          return Container(
            padding: EdgeInsetsDirectional.fromSTEB(16.w, 11.h, 16.w, 11.h),
            decoration: BoxDecoration(
              border: isLast
                  ? null
                  : Border(
                      bottom: BorderSide(color: AppColors.inputFill),
                    ),
            ),
            child: Row(
              mainAxisAlignment: MainAxisAlignment.spaceBetween,
              children: [
                Text(
                  row.$1,
                  style: GoogleFonts.tajawal(
                    fontSize: 13.5.sp,
                    color: AppColors.textSecondary,
                  ),
                ),
                Flexible(
                  child: Text(
                    row.$2,
                    style: GoogleFonts.tajawal(
                      fontSize: 13.5.sp,
                      fontWeight: FontWeight.w600,
                      color: AppColors.textPrimary,
                    ),
                    textAlign: TextAlign.end,
                  ),
                ),
              ],
            ),
          );
        }).toList(),
      ),
    );
  }
}

extension on List {
  Iterable<T> mapIndexed<T>(T Function(int i, dynamic e) f) sync* {
    for (int i = 0; i < length; i++) {
      yield f(i, this[i]);
    }
  }
}
