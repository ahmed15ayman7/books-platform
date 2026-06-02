// TODO: confirm audio URL format with backend (Risk #7)

import 'package:easy_localization/easy_localization.dart';
import 'package:flutter/material.dart';
import 'package:flutter_screenutil/flutter_screenutil.dart';
import 'package:just_audio/just_audio.dart';

import '../../../../../core/theme/app_colors.dart';
import '../../../../../core/theme/app_text_styles.dart';

class ArticleDetailAudioPlayer extends StatefulWidget {
  const ArticleDetailAudioPlayer({super.key, required this.audioUrl});
  final String audioUrl;

  @override
  State<ArticleDetailAudioPlayer> createState() =>
      _ArticleDetailAudioPlayerState();
}

class _ArticleDetailAudioPlayerState extends State<ArticleDetailAudioPlayer> {
  late final AudioPlayer _player;
  double _speed = 1.0;
  bool _loading = true;

  static const _speeds = [1.0, 1.25, 1.5, 2.0];

  @override
  void initState() {
    super.initState();
    _player = AudioPlayer();
    _initAudio();
  }

  Future<void> _initAudio() async {
    try {
      await _player.setUrl(widget.audioUrl);
    } catch (_) {
      // Audio load failure handled gracefully via player state
    } finally {
      if (mounted) setState(() => _loading = false);
    }
  }

  @override
  void dispose() {
    _player.dispose();
    super.dispose();
  }

  String _formatDuration(Duration d) {
    final m = d.inMinutes.remainder(60).toString().padLeft(2, '0');
    final s = d.inSeconds.remainder(60).toString().padLeft(2, '0');
    return '$m:$s';
  }

  @override
  Widget build(BuildContext context) {
    if (_loading) {
      return const Center(child: CircularProgressIndicator());
    }

    return Container(
      padding: EdgeInsetsDirectional.all(16.r),
      decoration: BoxDecoration(
        color: AppColors.surface,
        borderRadius: BorderRadius.circular(16.r),
        boxShadow: [
          BoxShadow(
            color: Colors.black.withValues(alpha: 0.06),
            blurRadius: 8,
            offset: const Offset(0, 2),
          ),
        ],
      ),
      child: Column(
        crossAxisAlignment: CrossAxisAlignment.start,
        children: [
          Text(
            'channel_books_talk'.tr(),
            style: AppTextStyles.labelLarge
                .copyWith(color: AppColors.textSecondary),
          ),
          SizedBox(height: 12.h),
          // Seek bar
          StreamBuilder<Duration>(
            stream: _player.positionStream,
            builder: (context, snapshot) {
              final position = snapshot.data ?? Duration.zero;
              final total = _player.duration ?? Duration.zero;
              return Column(
                children: [
                  Slider(
                    value: total.inMilliseconds > 0
                        ? position.inMilliseconds
                            .toDouble()
                            .clamp(0, total.inMilliseconds.toDouble())
                        : 0,
                    max: total.inMilliseconds.toDouble().clamp(1, double.infinity),
                    activeColor: AppColors.primary,
                    onChanged: (v) => _player
                        .seek(Duration(milliseconds: v.toInt())),
                  ),
                  Padding(
                    padding: EdgeInsetsDirectional.symmetric(horizontal: 4.w),
                    child: Row(
                      mainAxisAlignment: MainAxisAlignment.spaceBetween,
                      children: [
                        Text(_formatDuration(position),
                            style: AppTextStyles.bodySmall
                                .copyWith(color: AppColors.textSecondary)),
                        Text(_formatDuration(total),
                            style: AppTextStyles.bodySmall
                                .copyWith(color: AppColors.textSecondary)),
                      ],
                    ),
                  ),
                ],
              );
            },
          ),
          SizedBox(height: 8.h),
          Row(
            mainAxisAlignment: MainAxisAlignment.spaceBetween,
            children: [
              // Play / pause
              StreamBuilder<PlayerState>(
                stream: _player.playerStateStream,
                builder: (context, snapshot) {
                  final playing = snapshot.data?.playing ?? false;
                  return IconButton(
                    icon: Icon(
                      playing
                          ? Icons.pause_circle_filled_rounded
                          : Icons.play_circle_filled_rounded,
                      size: 44.r,
                      color: AppColors.primary,
                    ),
                    onPressed: playing ? _player.pause : _player.play,
                  );
                },
              ),
              // Speed control
              DropdownButton<double>(
                value: _speed,
                underline: const SizedBox.shrink(),
                items: _speeds
                    .map((s) => DropdownMenuItem(
                          value: s,
                          child: Text('${s}x',
                              style: AppTextStyles.bodySmall),
                        ))
                    .toList(),
                onChanged: (s) async {
                  if (s == null) return;
                  await _player.setSpeed(s);
                  setState(() => _speed = s);
                },
              ),
            ],
          ),
        ],
      ),
    );
  }
}
