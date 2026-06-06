import 'package:easy_localization/easy_localization.dart';
import 'package:flutter/material.dart';
import 'package:flutter_screenutil/flutter_screenutil.dart';
import 'package:google_fonts/google_fonts.dart';

import 'package:booksplatform/core/theme/app_colors.dart';
import 'package:booksplatform/core/widgets/app_loading_indicator.dart';
import 'package:booksplatform/core/widgets/empty_state_widget.dart';

import '../../../domain/entities/media_item.dart';
import '../../../presentation/cubit/media_list_cubit/media_list_cubit.dart';
import 'media_video_card.dart';

class MediaBody extends StatelessWidget {
  const MediaBody({
    super.key,
    required this.items,
    required this.activeSlug,
    required this.hasNextPage,
    required this.locale,
    required this.scrollController,
    required this.onChannelTap,
    required this.onItemTap,
    required this.onRefresh,
  });

  final List<MediaItem> items;
  final String activeSlug;
  final bool hasNextPage;
  final String locale;
  final ScrollController scrollController;
  final ValueChanged<String> onChannelTap;
  final ValueChanged<MediaItem> onItemTap;
  final Future<void> Function() onRefresh;

  @override
  Widget build(BuildContext context) {
    final ar = locale == 'ar';
    return RefreshIndicator(
      onRefresh: onRefresh,
      color: AppColors.primary,
      child: CustomScrollView(
        controller: scrollController,
        physics: const AlwaysScrollableScrollPhysics(),
        slivers: [
          SliverToBoxAdapter(
            child: SingleChildScrollView(
              scrollDirection: Axis.horizontal,
              padding: EdgeInsetsDirectional.fromSTEB(16.w, 12.h, 16.w, 4.h),
              child: Row(
                children: MediaListCubit.channels.map((c) {
                  final active = c.slug == activeSlug;
                  return Padding(
                    padding: EdgeInsetsDirectional.only(end: 8.w),
                    child: GestureDetector(
                      onTap: () => onChannelTap(c.slug),
                      child: AnimatedContainer(
                        duration: const Duration(milliseconds: 180),
                        padding: EdgeInsets.symmetric(
                          horizontal: 14.w,
                          vertical: 8.h,
                        ),
                        decoration: BoxDecoration(
                          color: active ? AppColors.primary : AppColors.surface,
                          border: Border.all(
                            color: active ? AppColors.primary : AppColors.divider,
                          ),
                          borderRadius: BorderRadius.circular(999),
                        ),
                        child: Text(
                          ar ? c.nameAr : c.name,
                          style: GoogleFonts.cairo(
                            fontSize: 13.sp,
                            fontWeight: FontWeight.w700,
                            color: active ? Colors.white : AppColors.textPrimary,
                          ),
                        ),
                      ),
                    ),
                  );
                }).toList(),
              ),
            ),
          ),
          if (items.isEmpty)
            SliverFillRemaining(
              child: Center(
                child: EmptyStateWidget(
                  icon: Icons.play_circle_outline_rounded,
                  title: 'media.empty'.tr(),
                ),
              ),
            )
          else
            SliverPadding(
              padding: EdgeInsetsDirectional.fromSTEB(16.w, 12.h, 16.w, 0),
              sliver: SliverList.separated(
                itemCount: items.length,
                separatorBuilder: (_, _) => SizedBox(height: 16.h),
                itemBuilder: (_, i) => MediaVideoCard(
                  item: items[i],
                  locale: locale,
                  onTap: () => onItemTap(items[i]),
                ),
              ),
            ),
          if (hasNextPage)
            SliverToBoxAdapter(
              child: Padding(
                padding: EdgeInsets.symmetric(vertical: 16.h),
                child: const Center(child: AppLoadingIndicator()),
              ),
            ),
          SliverToBoxAdapter(child: SizedBox(height: 24.h)),
        ],
      ),
    );
  }
}
