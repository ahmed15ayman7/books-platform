import 'package:easy_localization/easy_localization.dart';
import 'package:flutter/material.dart';
import 'package:flutter_bloc/flutter_bloc.dart';
import 'package:flutter_screenutil/flutter_screenutil.dart';
import 'package:google_fonts/google_fonts.dart';

import '../../../../../core/theme/app_colors.dart';
import '../../cubit/search_cubit.dart';
import '../../cubit/search_state.dart';

class SearchHistorySheet extends StatelessWidget {
  const SearchHistorySheet({super.key, required this.onChipTap});

  final ValueChanged<String> onChipTap;

  @override
  Widget build(BuildContext context) {
    return BlocBuilder<SearchCubit, SearchState>(
      builder: (context, state) {
        if (state is! SearchInitial) return const SizedBox.shrink();

        final entries = state.recentSearches;

        if (entries.isEmpty) {
          WidgetsBinding.instance.addPostFrameCallback(
            (_) => Navigator.of(context).pop(),
          );
          return const SizedBox.shrink();
        }

        return Column(
          mainAxisSize: MainAxisSize.min,
          children: [
            Padding(
              padding: EdgeInsetsDirectional.fromSTEB(16.w, 4.h, 8.w, 0),
              child: Row(
                mainAxisAlignment: MainAxisAlignment.spaceBetween,
                children: [
                  Text(
                    'search.recent_searches'.tr(),
                    style: GoogleFonts.cairo(
                      fontSize: 14.sp,
                      fontWeight: FontWeight.w700,
                      color: AppColors.textPrimary,
                    ),
                  ),
                  TextButton(
                    onPressed: () =>
                        context.read<SearchCubit>().clearHistory(),
                    child: Text(
                      'search.clear_all'.tr(),
                      style: GoogleFonts.cairo(
                        fontSize: 13.sp,
                        fontWeight: FontWeight.w600,
                        color: AppColors.primary,
                      ),
                    ),
                  ),
                ],
              ),
            ),
            Divider(height: 1, color: AppColors.divider),
            Flexible(
              child: ListView.separated(
                shrinkWrap: true,
                itemCount: entries.length,
                separatorBuilder: (_, _) =>
                    Divider(height: 1, color: AppColors.divider),
                itemBuilder: (context, index) {
                  final query = entries[index];
                  return InkWell(
                    onTap: () {
                      Navigator.of(context).pop();
                      onChipTap(query);
                    },
                    child: Padding(
                      padding: EdgeInsetsDirectional.fromSTEB(
                          16.w, 12.h, 8.w, 12.h),
                      child: Row(
                        children: [
                          Icon(
                            Icons.search_rounded,
                            size: 18.r,
                            color: AppColors.textHint,
                          ),
                          SizedBox(width: 12.w),
                          Flexible(
                            child: Text(
                              query,
                              style: GoogleFonts.cairo(
                                fontSize: 14.sp,
                                fontWeight: FontWeight.w500,
                                color: AppColors.textPrimary,
                              ),
                              maxLines: 1,
                              overflow: TextOverflow.ellipsis,
                            ),
                          ),
                          IconButton(
                            onPressed: () => context
                                .read<SearchCubit>()
                                .removeFromHistory(query),
                            icon: Icon(
                              Icons.close_rounded,
                              size: 16.r,
                              color: AppColors.textHint,
                            ),
                            padding: EdgeInsets.all(8.r),
                            constraints: const BoxConstraints(),
                          ),
                        ],
                      ),
                    ),
                  );
                },
              ),
            ),
          ],
        );
      },
    );
  }
}
