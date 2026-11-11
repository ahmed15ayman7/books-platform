import 'package:easy_localization/easy_localization.dart';
import 'package:flutter/material.dart';
import 'package:flutter_bloc/flutter_bloc.dart';

import '../../../../../core/di/injection_container.dart';
import '../../../../../core/helpers/snack_bar_helper.dart';
import '../../../../../core/helpers/url_launcher_helper.dart';
import '../../../../../core/router/app_routes.dart';
import '../../../../../core/router/args/book_detail_args.dart';
import '../../../../../core/theme/app_colors.dart';
import '../../../../../core/widgets/app_loading_indicator.dart';
import '../../../../../core/widgets/error_state_widget.dart';
import '../../../../wishlist/domain/entities/wishlist_item.dart';
import '../../../../wishlist/presentation/cubit/wishlist_cubit.dart';
import '../../../../wishlist/presentation/cubit/wishlist_state.dart';
import '../../../domain/entities/book.dart';
import '../../cubit/book_detail_cubit/book_detail_cubit.dart';
import '../../cubit/book_detail_cubit/book_detail_state.dart';
import 'book_detail_body.dart';
import 'book_detail_bottom_bar.dart';

class BookDetailScreen extends StatefulWidget {
  const BookDetailScreen({super.key, required this.args});
  final BookDetailArgs args;

  @override
  State<BookDetailScreen> createState() => _BookDetailScreenState();
}

class _BookDetailScreenState extends State<BookDetailScreen> {
  bool _expanded = false;

  @override
  void initState() {
    super.initState();
    context.read<BookDetailCubit>().load(widget.args.slug);
    context.read<WishlistCubit>().load();
  }

  bool _isSaved(Book book, WishlistState wishlistState) {
    final slugs = switch (wishlistState) {
      WishlistLoaded(:final slugs) => slugs,
      _ => <String>[],
    };
    return slugs.contains(book.slug.isNotEmpty ? book.slug : book.id);
  }

  VoidCallback _buildToggleSave(BuildContext ctx, Book book, bool isSaved) {
    return () {
      final slug = book.slug.isNotEmpty ? book.slug : book.id;
      ctx.read<WishlistCubit>().toggle(WishlistItem(
            bookSlug: slug,
            titleAr: book.titleAr,
            titleEn: book.titleEn,
            imageUrl: book.imageUrl,
          ));
      if (isSaved) {
        getIt<SnackBarHelper>().showInfo('wishlist_removed'.tr());
      } else {
        getIt<SnackBarHelper>().showSuccess('wishlist_added'.tr());
      }
    };
  }

  @override
  Widget build(BuildContext context) {
    final locale = context.locale.languageCode;
    return BlocBuilder<BookDetailCubit, BookDetailState>(
      builder: (ctx, state) {
        return Scaffold(
          backgroundColor: AppColors.background,
          body: AnimatedSwitcher(
            duration: const Duration(milliseconds: 300),
            child: switch (state) {
              BookDetailLoading() => const Center(
                  key: ValueKey('loading'),
                  child: AppLoadingIndicator(),
                ),
              BookDetailError(:final message) => Center(
                  key: const ValueKey('error'),
                  child: ErrorStateWidget(
                    message: message,
                    onRetry: () =>
                        ctx.read<BookDetailCubit>().load(widget.args.slug),
                  ),
                ),
              BookDetailSuccess(:final book, :final similarBooks) =>
                BlocBuilder<WishlistCubit, WishlistState>(
                  builder: (wCtx, wishlistState) {
                    final isSaved = _isSaved(book, wishlistState);
                    return KeyedSubtree(
                      key: const ValueKey('success'),
                      child: BookDetailBody(
                        book: book,
                        similarBooks: similarBooks,
                        locale: locale,
                        expanded: _expanded,
                        saved: isSaved,
                        onToggleExpand: () =>
                            setState(() => _expanded = !_expanded),
                        onToggleSave: _buildToggleSave(wCtx, book, isSaved),
                        onBookTap: (b) => Navigator.of(ctx).pushReplacementNamed(
                          AppRoutes.bookDetail,
                          arguments: BookDetailArgs(slug: b.slug.isNotEmpty ? b.slug : b.id, titleAr: b.titleAr),
                        ),
                      ),
                    );
                  },
                ),
              _ => const SizedBox.shrink(key: ValueKey('initial')),
            },
          ),
          bottomNavigationBar: switch (state) {
            BookDetailSuccess(:final book)
                when book.downloadUrl != null && book.downloadUrl!.isNotEmpty =>
              BlocBuilder<WishlistCubit, WishlistState>(
                builder: (wCtx, wishlistState) {
                  final isSaved = _isSaved(book, wishlistState);
                  return BookDetailBottomBar(
                    saved: isSaved,
                    onToggleSave: _buildToggleSave(wCtx, book, isSaved),
                    onDownloadTap: () =>
                        getIt<UrlLauncherHelper>().launchExternalUrl(book.downloadUrl!),
                  );
                },
              ),
            _ => null,
          },
        );
      },
    );
  }
}
