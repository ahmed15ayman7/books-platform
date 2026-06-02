import 'package:easy_localization/easy_localization.dart';
import 'package:flutter/material.dart';
import 'package:flutter_bloc/flutter_bloc.dart';
import 'package:flutter_screenutil/flutter_screenutil.dart';

import '../../../../../core/enums/translation_status.dart';
import '../../../../../core/router/app_routes.dart';
import '../../../../../core/router/args/book_detail_args.dart';
import '../../../../../core/theme/app_colors.dart';
import '../../../../../core/widgets/app_bar_widget.dart';
import '../../../../../core/widgets/app_loading_indicator.dart';
import '../../../../../core/widgets/error_state_widget.dart';
import '../../cubit/catalog_cubit/catalog_cubit.dart';
import '../../cubit/catalog_cubit/catalog_state.dart';
import '../../widgets/book_card_widget.dart';

class TranslatedBooksScreen extends StatefulWidget {
  const TranslatedBooksScreen({super.key});

  @override
  State<TranslatedBooksScreen> createState() => _TranslatedBooksScreenState();
}

class _TranslatedBooksScreenState extends State<TranslatedBooksScreen> {
  @override
  void initState() {
    super.initState();
    context.read<CatalogCubit>().applyFilter(status: TranslationStatus.translated);
  }

  @override
  Widget build(BuildContext context) {
    final locale = context.locale.languageCode;
    return Scaffold(
      backgroundColor: AppColors.background,
      body: Column(
        children: [
          AppBarWidget(
            variant: AppBarVariant.title,
            title: 'translated_books_title'.tr(),
            showBack: true,
            currentLocale: locale,
          ),
          Expanded(
            child: BlocBuilder<CatalogCubit, CatalogState>(
              builder: (ctx, state) => switch (state) {
                CatalogLoading() => const Center(child: AppLoadingIndicator()),
                CatalogError(:final message) => Center(
                    child: ErrorStateWidget(
                      message: message,
                      onRetry: () => ctx.read<CatalogCubit>().applyFilter(
                            status: TranslationStatus.translated,
                          ),
                    ),
                  ),
                CatalogSuccess(:final books) => SafeArea(
                    top: false,
                    child: RefreshIndicator(
                      onRefresh: () => ctx.read<CatalogCubit>().refresh(),
                      color: AppColors.primary,
                      child: GridView.builder(
                        padding: EdgeInsetsDirectional.all(16.r),
                        gridDelegate: SliverGridDelegateWithFixedCrossAxisCount(
                          crossAxisCount: 2,
                          crossAxisSpacing: 12.w,
                          mainAxisSpacing: 14.h,
                          childAspectRatio: 0.46,
                        ),
                        itemCount: books.length,
                        itemBuilder: (_, i) => BookCardWidget(
                          book: books[i],
                          locale: locale,
                          onTap: () => Navigator.of(ctx).pushNamed(
                            AppRoutes.bookDetail,
                            arguments: BookDetailArgs(
                              slug: books[i].slug.isNotEmpty ? books[i].slug : books[i].id,
                              titleAr: books[i].titleAr,
                            ),
                          ),
                        ),
                      ),
                    ),
                  ),
                _ => const SizedBox.shrink(),
              },
            ),
          ),
        ],
      ),
    );
  }
}
