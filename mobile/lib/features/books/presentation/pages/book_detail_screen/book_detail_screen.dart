import 'package:easy_localization/easy_localization.dart';
import 'package:flutter/material.dart';
import 'package:flutter_bloc/flutter_bloc.dart';

import '../../../../../core/di/injection_container.dart';
import '../../../../../core/helpers/snack_bar_helper.dart';
import '../../../../../core/router/app_routes.dart';
import '../../../../../core/router/args/book_detail_args.dart';
import '../../../../../core/theme/app_colors.dart';
import '../../../../../core/widgets/app_loading_indicator.dart';
import '../../../../../core/widgets/error_state_widget.dart';
import '../../../../cart/presentation/cubit/cart_cubit.dart';
import '../../../../wishlist/presentation/cubit/wishlist_cubit.dart';
import '../../../../wishlist/presentation/cubit/wishlist_state.dart';
import '../../cubit/book_detail_cubit/book_detail_cubit.dart';
import '../../cubit/book_detail_cubit/book_detail_state.dart';
import 'book_detail_body.dart';

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

  @override
  Widget build(BuildContext context) {
    final locale = context.locale.languageCode;
    return Scaffold(
      backgroundColor: AppColors.background,
      body: BlocBuilder<BookDetailCubit, BookDetailState>(
        builder: (ctx, state) {
          return AnimatedSwitcher(
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
                    final slugs = switch (wishlistState) {
                      WishlistLoaded(:final slugs) => slugs,
                      _ => <String>[],
                    };
                    final isSaved = slugs.contains(book.slug.isNotEmpty ? book.slug : book.id);
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
                        onToggleSave: () {
                          final slug = book.slug.isNotEmpty ? book.slug : book.id;
                          ctx.read<WishlistCubit>().toggle(slug);
                          if (isSaved) {
                            getIt<SnackBarHelper>().showInfo('wishlist_removed'.tr());
                          } else {
                            getIt<SnackBarHelper>().showSuccess('wishlist_added'.tr());
                          }
                        },
                        onAddCart: () {
                          getIt<CartCubit>().addItem(book);
                          Navigator.of(ctx).pushNamed(AppRoutes.cart);
                        },
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
          );
        },
      ),
    );
  }
}
