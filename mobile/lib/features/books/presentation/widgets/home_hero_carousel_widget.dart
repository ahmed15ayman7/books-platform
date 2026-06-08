import 'dart:async';

import 'package:cached_network_image/cached_network_image.dart';
import 'package:flutter/material.dart';
import 'package:flutter_screenutil/flutter_screenutil.dart';
import 'package:google_fonts/google_fonts.dart';

import '../../../../core/constants/app_constants.dart';
import '../../../../core/theme/app_colors.dart';
import '../../domain/entities/hero_slide.dart';

class HomeHeroCarouselWidget extends StatefulWidget {
  const HomeHeroCarouselWidget({
    super.key,
    required this.slides,
    required this.locale,
  });

  final List<HeroSlide> slides;
  final String locale;

  @override
  State<HomeHeroCarouselWidget> createState() => _HomeHeroCarouselWidgetState();
}

class _HomeHeroCarouselWidgetState extends State<HomeHeroCarouselWidget> {
  late final PageController _pageController;
  Timer? _autoAdvanceTimer;
  int _currentPage = 0;

  @override
  void initState() {
    super.initState();
    _pageController = PageController();
    _startAutoAdvance();
  }

  @override
  void didUpdateWidget(HomeHeroCarouselWidget oldWidget) {
    super.didUpdateWidget(oldWidget);
    if (oldWidget.slides.length != widget.slides.length) {
      _currentPage = 0;
      if (_pageController.hasClients) {
        _pageController.jumpToPage(0);
      }
      _restartAutoAdvance();
    }
  }

  @override
  void dispose() {
    _autoAdvanceTimer?.cancel();
    _pageController.dispose();
    super.dispose();
  }

  void _startAutoAdvance() {
    _autoAdvanceTimer?.cancel();
    if (widget.slides.length < 2) return;

    _autoAdvanceTimer = Timer.periodic(kHeroCarouselAutoAdvanceDuration, (_) {
      if (!_pageController.hasClients) return;
      final next = (_currentPage + 1) % widget.slides.length;
      _pageController.animateToPage(
        next,
        duration: const Duration(milliseconds: 400),
        curve: Curves.easeInOut,
      );
    });
  }

  void _restartAutoAdvance() {
    _autoAdvanceTimer?.cancel();
    _startAutoAdvance();
  }

  void _onPageChanged(int index) {
    setState(() => _currentPage = index);
    _restartAutoAdvance();
  }

  @override
  Widget build(BuildContext context) {
    final showDots = widget.slides.length >= 2;

    return Padding(
      padding: EdgeInsetsDirectional.fromSTEB(16.w, 16.h, 16.w, 8.h),
      child: Container(
        height: 200.h,
        decoration: BoxDecoration(
          borderRadius: BorderRadius.circular(26.r),
          boxShadow: const [
            BoxShadow(
              color: Color(0x2E000000),
              blurRadius: 40,
              offset: Offset(0, 14),
            ),
          ],
        ),
        clipBehavior: Clip.hardEdge,
        child: Stack(
          children: [
            PageView.builder(
              controller: _pageController,
              onPageChanged: _onPageChanged,
              itemCount: widget.slides.length,
              itemBuilder: (_, index) => _HeroSlidePage(
                slide: widget.slides[index],
                locale: widget.locale,
                reserveDotSpace: showDots,
              ),
            ),
            if (showDots)
              Positioned(
                left: 0,
                right: 0,
                bottom: 12.h,
                child: _DotIndicators(
                  count: widget.slides.length,
                  activeIndex: _currentPage,
                ),
              ),
          ],
        ),
      ),
    );
  }
}

class _HeroSlidePage extends StatelessWidget {
  const _HeroSlidePage({
    required this.slide,
    required this.locale,
    required this.reserveDotSpace,
  });

  final HeroSlide slide;
  final String locale;
  final bool reserveDotSpace;

  @override
  Widget build(BuildContext context) {
    final isAr = locale == 'ar';
    final title = isAr ? slide.titleAr : (slide.titleEn ?? slide.titleAr);
    final subtitle = isAr
        ? slide.subtitleAr
        : (slide.subtitleEn ?? slide.subtitleAr);

    if (slide.isLocalAsset) {
      return _HeroSlideStack(
        slide: slide,
        title: title,
        subtitle: subtitle,
        reserveDotSpace: reserveDotSpace,
        background: ColoredBox(
          color: AppColors.secondary,
          child: Center(
            child: Image.asset(
              slide.imageUrl,
              width: kHeroCarouselBrandingLogoWidth.w,
            ),
          ),
        ),
      );
    }

    return CachedNetworkImage(
      imageUrl: slide.imageUrl,
      fit: BoxFit.cover,
      placeholder: (_, _) => const ColoredBox(color: AppColors.shimmerBase),
      errorWidget: (_, _, _) => const ColoredBox(color: AppColors.shimmerBase),
      imageBuilder: (context, imageProvider) => _HeroSlideStack(
        slide: slide,
        title: title,
        subtitle: subtitle,
        reserveDotSpace: reserveDotSpace,
        background: Image(image: imageProvider, fit: BoxFit.cover),
      ),
    );
  }
}

class _HeroSlideStack extends StatelessWidget {
  const _HeroSlideStack({
    required this.slide,
    required this.title,
    required this.subtitle,
    required this.reserveDotSpace,
    required this.background,
  });

  final HeroSlide slide;
  final String title;
  final String? subtitle;
  final bool reserveDotSpace;
  final Widget background;

  @override
  Widget build(BuildContext context) {
    return Stack(
      fit: StackFit.expand,
      children: [
        background,
        if (slide.foregroundImageUrl != null)
          CachedNetworkImage(
            imageUrl: slide.foregroundImageUrl!,
            fit: BoxFit.contain,
            alignment: Alignment.center,
            placeholder: (_, _) => const SizedBox.shrink(),
            errorWidget: (_, _, _) => const SizedBox.shrink(),
          ),
        DecoratedBox(
          decoration: BoxDecoration(
            gradient: LinearGradient(
              begin: AlignmentDirectional.topCenter,
              end: AlignmentDirectional.bottomCenter,
              colors: [
                Colors.black.withValues(alpha: 0.25),
                Colors.black.withValues(alpha: 0.45),
                Colors.black.withValues(alpha: 0.85),
              ],
            ),
          ),
        ),
        DecoratedBox(
          decoration: BoxDecoration(
            gradient: LinearGradient(
              begin: AlignmentDirectional.centerStart,
              end: AlignmentDirectional.centerEnd,
              colors: [
                Colors.black.withValues(alpha: 0.6),
                Colors.transparent,
                Colors.black.withValues(alpha: 0.3),
              ],
            ),
          ),
        ),
        if (title.isNotEmpty)
          Padding(
            padding: EdgeInsetsDirectional.fromSTEB(
              20.w,
              16.h,
              20.w,
              reserveDotSpace ? 36.h : 16.h,
            ),
            child: Center(
              child: Column(
                mainAxisAlignment: MainAxisAlignment.center,
                children: [
                  Text(
                    title,
                    textAlign: TextAlign.center,
                    style: GoogleFonts.cairo(
                      fontSize: 18.sp,
                      fontWeight: FontWeight.w800,
                      color: Colors.white,
                      height: 1.4,
                      shadows: [
                        Shadow(
                          color: Colors.black.withValues(alpha: 0.4),
                          blurRadius: 10,
                        ),
                      ],
                    ),
                    maxLines: 3,
                    overflow: TextOverflow.ellipsis,
                  ),
                  if (subtitle case final resolvedSubtitle?
                      when resolvedSubtitle.isNotEmpty) ...[
                    SizedBox(height: 8.h),
                    Text(
                      resolvedSubtitle,
                      textAlign: TextAlign.center,
                      style: GoogleFonts.cairo(
                        fontSize: 13.sp,
                        fontWeight: FontWeight.w500,
                        color: Colors.white.withValues(alpha: 0.9),
                        height: 1.5,
                      ),
                      maxLines: 2,
                      overflow: TextOverflow.ellipsis,
                    ),
                  ],
                ],
              ),
            ),
          ),
      ],
    );
  }
}

class _DotIndicators extends StatelessWidget {
  const _DotIndicators({
    required this.count,
    required this.activeIndex,
  });

  final int count;
  final int activeIndex;

  @override
  Widget build(BuildContext context) {
    return Row(
      mainAxisAlignment: MainAxisAlignment.center,
      children: List.generate(count, (index) {
        final isActive = index == activeIndex;
        return AnimatedContainer(
          duration: const Duration(milliseconds: 250),
          margin: EdgeInsetsDirectional.symmetric(horizontal: 3.w),
          width: isActive ? 20.w : 6.r,
          height: 6.r,
          decoration: BoxDecoration(
            color: isActive
                ? AppColors.primary
                : Colors.white.withValues(alpha: 0.4),
            borderRadius: BorderRadius.circular(999),
          ),
        );
      }),
    );
  }
}
