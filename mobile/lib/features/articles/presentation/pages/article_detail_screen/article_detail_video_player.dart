import 'package:easy_localization/easy_localization.dart';
import 'package:flutter/material.dart';
import 'package:flutter_screenutil/flutter_screenutil.dart';
import 'package:google_fonts/google_fonts.dart';
import 'package:url_launcher/url_launcher.dart';

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
  String? _videoId;

  static String? _extractVideoId(String url) {
    final uri = Uri.tryParse(url);
    if (uri == null || uri.host.isEmpty) {
      return RegExp(r'^[a-zA-Z0-9_-]{11}$').hasMatch(url) ? url : null;
    }
    if (uri.host.contains('youtu.be')) {
      return uri.pathSegments.firstOrNull;
    }
    if (uri.host.contains('youtube.com')) {
      final v = uri.queryParameters['v'];
      if (v != null && v.isNotEmpty) return v;
      if (uri.pathSegments.length >= 2 &&
          (uri.pathSegments.first == 'embed' ||
              uri.pathSegments.first == 'v' ||
              uri.pathSegments.first == 'shorts')) {
        return uri.pathSegments[1];
      }
    }
    return null;
  }

  @override
  void initState() {
    super.initState();
    _videoId = _extractVideoId(widget.videoUrl);
  }

  Future<void> _openInYoutube() async {
    final uri = Uri.parse(
      _videoId != null
          ? 'https://www.youtube.com/watch?v=$_videoId'
          : widget.videoUrl,
    );
    final openedInApp = await launchUrl(uri, mode: LaunchMode.inAppBrowserView);
    if (!openedInApp) {
      await launchUrl(uri, mode: LaunchMode.externalApplication);
    }
  }

  @override
  Widget build(BuildContext context) {
    return Column(
      crossAxisAlignment: CrossAxisAlignment.start,
      children: [
        AspectRatio(
          aspectRatio: 16 / 9,
          child: _VideoLauncher(videoId: _videoId, onTap: _openInYoutube),
        ),
        if (widget.showAiDisclosure) ...[
          SizedBox(height: 8.h),
          const _AiDisclosureBanner(),
        ],
      ],
    );
  }
}

class _VideoLauncher extends StatelessWidget {
  const _VideoLauncher({this.videoId, required this.onTap});

  final String? videoId;
  final VoidCallback onTap;

  @override
  Widget build(BuildContext context) {
    return GestureDetector(
      onTap: onTap,
      child: Container(
        decoration: BoxDecoration(
          color: Colors.black,
          borderRadius: BorderRadius.circular(8.r),
          image: videoId != null
              ? DecorationImage(
                  image: NetworkImage(
                    'https://img.youtube.com/vi/$videoId/hqdefault.jpg',
                  ),
                  fit: BoxFit.cover,
                  colorFilter: const ColorFilter.mode(
                    Colors.black45,
                    BlendMode.darken,
                  ),
                )
              : null,
        ),
        child: Center(
          child: Column(
            mainAxisSize: MainAxisSize.min,
            children: [
              Icon(Icons.play_circle_outline, color: Colors.white, size: 48.sp),
              SizedBox(height: 8.h),
              Text(
                'watch_on_youtube'.tr(),
                style: GoogleFonts.tajawal(
                  fontSize: 14.sp,
                  color: Colors.white,
                  fontWeight: FontWeight.w600,
                ),
              ),
            ],
          ),
        ),
      ),
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
          Icon(
            Icons.auto_awesome_rounded,
            size: 16.sp,
            color: AppColors.warning,
          ),
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
  const ArticleDetailVideoPlaceholder({
    super.key,
    this.showAiDisclosure = false,
  });
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
