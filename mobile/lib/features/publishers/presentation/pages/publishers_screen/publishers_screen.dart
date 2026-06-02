import 'package:easy_localization/easy_localization.dart';
import 'package:flutter/material.dart';
import 'package:flutter_bloc/flutter_bloc.dart';

import '../../../../../core/router/app_routes.dart';
import '../../../../../core/router/args/publisher_detail_args.dart';
import '../../../../../core/theme/app_colors.dart';
import '../../../../../core/widgets/app_bar_widget.dart';
import '../../../../../core/widgets/bottom_nav_widget.dart';
import '../../../../../core/widgets/error_state_widget.dart';
import '../../cubit/publishers_list_cubit/publishers_list_cubit.dart';
import '../../cubit/publishers_list_cubit/publishers_list_state.dart';
import 'publishers_body.dart';
import 'publishers_shimmer.dart';

class PublishersScreen extends StatefulWidget {
  const PublishersScreen({super.key});

  @override
  State<PublishersScreen> createState() => _PublishersScreenState();
}

class _PublishersScreenState extends State<PublishersScreen> {
  @override
  void initState() {
    super.initState();
    context.read<PublishersListCubit>().load();
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
            title: 'publishers.title'.tr(),
            subtitle: '665 ${'publishers.publishers_unit'.tr()}',
            currentLocale: locale,
            onCart: () => Navigator.of(context).pushNamed(AppRoutes.cart),
            onLocaleChanged: (l) => context.setLocale(Locale(l)),
          ),
          Expanded(
            child: BlocBuilder<PublishersListCubit, PublishersListState>(
              builder: (ctx, state) {
                return AnimatedSwitcher(
                  duration: const Duration(milliseconds: 300),
                  child: switch (state) {
                    PublishersListLoading() =>
                      const PublishersShimmer(key: ValueKey('loading')),
                    PublishersListError(:final message) => Center(
                        key: const ValueKey('error'),
                        child: ErrorStateWidget(
                          message: message,
                          onRetry: () =>
                              ctx.read<PublishersListCubit>().load(),
                        ),
                      ),
                    PublishersListSuccess(
                      :final publishers,
                      :final countries,
                      :final activeCountry,
                    ) =>
                      PublishersBody(
                        key: const ValueKey('success'),
                        publishers: publishers,
                        countries: countries,
                        activeCountry: activeCountry,
                        locale: locale,
                        onCountryTap: (c) =>
                            ctx.read<PublishersListCubit>().filterByCountry(
                                  c == activeCountry ? null : c,
                                ),
                        onPublisherTap: (p) => Navigator.of(ctx).pushNamed(
                          AppRoutes.publisherDetail,
                          arguments: PublisherDetailArgs(
                            slug: p.id,
                            name: p.name,
                          ),
                        ),
                        onRefresh: () =>
                            ctx.read<PublishersListCubit>().refresh(),
                      ),
                    _ => const SizedBox.shrink(key: ValueKey('initial')),
                  },
                );
              },
            ),
          ),
          BottomNavWidget(
            activeTab: BottomNavTab.publishers,
            onTabSelected: (tab) => _onTabSelected(context, tab),
            onPublishTap: () =>
                Navigator.of(context).pushNamed(AppRoutes.publish),
            currentLocale: locale,
          ),
        ],
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
        break;
    }
  }
}
