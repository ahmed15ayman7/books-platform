// TODO: confirm videoUrl field name with backend (Risk #6)

import 'package:easy_localization/easy_localization.dart';
import 'package:flutter/material.dart';
import 'package:flutter_screenutil/flutter_screenutil.dart';
import 'package:google_fonts/google_fonts.dart';
import 'package:youtube_player_iframe/youtube_player_iframe.dart';

import '../../../../../core/theme/app_colors.dart';

class ArticleDetailVideoPlayer extends StatefulWidget {
  const ArticleDetailVideoPlayer({
    super.key,
    required this.videoUrl,
    this.showAiDisclosure = false,
  });

  final String videoUrl;
  final bool showAiDisclosure;

  @override
  State<ArticleDetailVideoPlayer> createState() =>
      _ArticleDetailVideoPlayerState();
}

class _ArticleDetailVideoPlayerState extends State<ArticleDetailVideoPlayer> {
  late final YoutubePlayerController _controller;

  static String? _extractVideoId(String url) {
    // Handle youtu.be/ID and youtube.com/watch?v=ID formats
    final uri = Uri.tryParse(url);
    if (uri == null) return null;
    if (uri.host.contains('youtu.be')) return uri.pathSegments.firstOrNull;
    return uri.queryParameters['v'];
  }

  @override
  void initState() {
    super.initState();
    final videoId = _extractVideoId(widget.videoUrl) ?? widget.videoUrl;
    _controller = YoutubePlayerController.fromVideoId(
      videoId: videoId,
      autoPlay: false,
      params: const YoutubePlayerParams(showFullscreenButton: true),
    );
  }

  @override
  void dispose() {
    _controller.close();
    super.dispose();
  }

  @override
  Widget build(BuildContext context) {
    return Column(
      crossAxisAlignment: CrossAxisAlignment.start,
      children: [
        AspectRatio(
          aspectRatio: 16 / 9,
          child: YoutubePlayer(controller: _controller),
        ),
        if (widget.showAiDisclosure) ...[
          SizedBox(height: 8.h),
          const _AiDisclosureBanner(),
        ],
      ],
    );
  }
}

class _AiDisclosureBanner extends StatelessWidget {
  const _AiDisclosureBanner();

  @override
  Widget build(BuildContext context) {
    return Container(
      padding: EdgeInsetsDirectional.fromSTEB(12.w, 10.h, 12.w, 10.h),
      decoration: BoxDecoration(
        color: AppColors.warning.withValues(alpha: 0.1),
        borderRadius: BorderRadius.circular(8.r),
        border: Border.all(color: AppColors.warning.withValues(alpha: 0.3)),
      ),
      child: Row(
        children: [
          Icon(Icons.auto_awesome_rounded,
              size: 16.sp, color: AppColors.warning),
          SizedBox(width: 8.w),
          Expanded(
            child: Text(
              'ai_disclosure'.tr(),
              style: GoogleFonts.tajawal(
                fontSize: 12.sp,
                color: AppColors.warning,
              ),
            ),
          ),
        ],
      ),
    );
  }
}

class ArticleDetailVideoPlaceholder extends StatelessWidget {
  const ArticleDetailVideoPlaceholder({super.key, this.showAiDisclosure = false});
  final bool showAiDisclosure;

  @override
  Widget build(BuildContext context) {
    return Column(
      crossAxisAlignment: CrossAxisAlignment.start,
      children: [
        AspectRatio(
          aspectRatio: 16 / 9,
          child: Container(
            decoration: BoxDecoration(
              color: AppColors.inputFill,
              borderRadius: BorderRadius.circular(8.r),
            ),
            child: const Center(
              child: Icon(Icons.play_circle_outline, size: 48),
            ),
          ),
        ),
        if (showAiDisclosure) ...[
          SizedBox(height: 8.h),
          const _AiDisclosureBanner(),
        ],
      ],
    );
  }
}
