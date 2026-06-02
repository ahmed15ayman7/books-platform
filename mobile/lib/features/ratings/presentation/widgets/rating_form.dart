import 'package:easy_localization/easy_localization.dart';
import 'package:flutter/material.dart';
import 'package:flutter_bloc/flutter_bloc.dart';
import 'package:flutter_screenutil/flutter_screenutil.dart';
import 'package:google_fonts/google_fonts.dart';

import '../../../../core/theme/app_colors.dart';
import '../cubit/ratings_cubit.dart';
import '../cubit/ratings_state.dart';
import 'star_rating_bar.dart';

class RatingForm extends StatefulWidget {
  const RatingForm({super.key, required this.productId, required this.email});

  final String productId;
  final String email;

  @override
  State<RatingForm> createState() => _RatingFormState();
}

class _RatingFormState extends State<RatingForm> {
  int _selectedStars = 0;
  bool _submitted = false;

  @override
  Widget build(BuildContext context) {
    return BlocListener<RatingsCubit, RatingsState>(
      listener: (context, state) {
        if (state is RatingsSubmitted) setState(() => _submitted = true);
      },
      child: _submitted
          ? Padding(
              padding: EdgeInsetsDirectional.symmetric(vertical: 12.h),
              child: Text(
                'ratings_thank_you'.tr(),
                style: GoogleFonts.cairo(
                  fontSize: 14.sp,
                  color: AppColors.success,
                  fontWeight: FontWeight.w600,
                ),
                textAlign: TextAlign.center,
              ),
            )
          : Column(
              crossAxisAlignment: CrossAxisAlignment.start,
              children: [
                Text(
                  'ratings_rate_this'.tr(),
                  style: GoogleFonts.cairo(
                    fontSize: 14.sp,
                    fontWeight: FontWeight.w600,
                    color: AppColors.textPrimary,
                  ),
                ),
                SizedBox(height: 8.h),
                StarRatingBar(
                  rating: _selectedStars.toDouble(),
                  interactive: true,
                  onRatingSelected: (s) => setState(() => _selectedStars = s),
                ),
                SizedBox(height: 12.h),
                BlocBuilder<RatingsCubit, RatingsState>(
                  builder: (context, state) => ElevatedButton(
                    onPressed: _selectedStars > 0 && state is! RatingsSubmitting
                        ? () => context.read<RatingsCubit>().submitRating(
                              widget.productId,
                              widget.email,
                              _selectedStars,
                            )
                        : null,
                    style: ElevatedButton.styleFrom(
                      backgroundColor: AppColors.primary,
                      foregroundColor: Colors.white,
                      minimumSize: Size(double.infinity, 44.h),
                      shape: RoundedRectangleBorder(
                        borderRadius: BorderRadius.circular(10.r),
                      ),
                    ),
                    child: state is RatingsSubmitting
                        ? const CircularProgressIndicator(color: Colors.white)
                        : Text('ratings_submit'.tr(),
                            style: GoogleFonts.cairo(fontWeight: FontWeight.w600)),
                  ),
                ),
              ],
            ),
    );
  }
}
