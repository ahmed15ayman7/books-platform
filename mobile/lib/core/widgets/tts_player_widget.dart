import 'dart:io';

import 'package:easy_localization/easy_localization.dart';
import 'package:flutter/material.dart';
import 'package:flutter_screenutil/flutter_screenutil.dart';
import 'package:flutter_tts/flutter_tts.dart';

import '../theme/app_colors.dart';
import '../theme/app_text_styles.dart';

class TtsPlayerWidget extends StatefulWidget {
  const TtsPlayerWidget({
    super.key,
    required this.text,
    required this.languageCode,
  });

  final String text;
  final String languageCode;

  @override
  State<TtsPlayerWidget> createState() => _TtsPlayerWidgetState();
}

class _TtsPlayerWidgetState extends State<TtsPlayerWidget> {
  late final FlutterTts _tts;
  late final String _cleanText;
  bool _isPlaying = false;
  double _speed = 1.0;
  // null = still checking, true = voice available, false = not installed
  bool? _isAvailable;

  static const _speeds = [1.0, 1.25, 1.5, 2.0];

  // iOS rate: 0.0–1.0, normal = 0.5. Android rate: 0.0–2.0, normal = 1.0.
  // Multiply user-facing speed by 0.5 on iOS so 1× maps to the natural rate.
  static double _toTtsRate(double speed) =>
      Platform.isIOS ? speed * 0.5 : speed;

  static String _stripMarkdown(String md) {
    return md
        // Images must be removed entirely — keeping alt text reads "صورة" aloud
        .replaceAll(RegExp(r'!\[[^\]]*\]\([^)]*\)'), '')
        // Keep display text of links, discard URL
        .replaceAllMapped(
            RegExp(r'\[([^\]]*)\]\([^)]*\)'), (m) => m.group(1) ?? '')
        // Bold and italic — unwrap inner text
        .replaceAllMapped(
            RegExp(r'\*\*(.+?)\*\*', dotAll: true), (m) => m.group(1) ?? '')
        .replaceAllMapped(
            RegExp(r'\*(.+?)\*', dotAll: true), (m) => m.group(1) ?? '')
        // Headings, code spans, blockquotes
        .replaceAll(RegExp(r'#{1,6}\s*'), '')
        .replaceAll(RegExp(r'`+'), '')
        .replaceAll(RegExp(r'^>\s*', multiLine: true), '')
        // Trailing whitespace on lines and collapsed blank lines
        .replaceAll(RegExp(r'[ \t]+\n'), '\n')
        .replaceAll(RegExp(r'\n{3,}'), '\n\n')
        .trim();
  }

  @override
  void initState() {
    super.initState();
    _cleanText = _stripMarkdown(widget.text);
    _tts = FlutterTts();
    _initTts();
  }

  Future<void> _initTts() async {
    await _tts.setSpeechRate(_toTtsRate(1.0));

    // Try the exact locale first (ar-SA), then the bare language code (ar).
    // setLanguage returns 1 on success (iOS) or true on Android.
    final primary = await _tts.setLanguage(widget.languageCode);
    if (primary == 1 || primary == true) {
      if (mounted) setState(() => _isAvailable = true);
    } else if (widget.languageCode.contains('-')) {
      final bare = widget.languageCode.split('-').first;
      final fallback = await _tts.setLanguage(bare);
      if (mounted) setState(() => _isAvailable = fallback == 1 || fallback == true);
    } else {
      if (mounted) setState(() => _isAvailable = false);
    }

    _tts.setCompletionHandler(() {
      if (mounted) setState(() => _isPlaying = false);
    });
    _tts.setErrorHandler((_) {
      if (mounted) setState(() => _isPlaying = false);
    });
  }

  Future<void> _play() async {
    await _tts.speak(_cleanText);
    if (mounted) setState(() => _isPlaying = true);
  }

  Future<void> _pause() async {
    await _tts.stop();
    if (mounted) setState(() => _isPlaying = false);
  }

  Future<void> _stop() async {
    await _tts.stop();
    if (mounted) setState(() => _isPlaying = false);
  }

  @override
  void dispose() {
    _tts.stop();
    super.dispose();
  }

  @override
  Widget build(BuildContext context) {
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
            'tts.listen'.tr(),
            style: AppTextStyles.labelLarge
                .copyWith(color: AppColors.textSecondary),
          ),
          SizedBox(height: 8.h),
          _buildControls(),
        ],
      ),
    );
  }

  Widget _buildControls() {
    // Still checking availability
    if (_isAvailable == null) {
      return SizedBox(
        height: 44.r,
        child: Center(
          child: SizedBox(
            width: 20.r,
            height: 20.r,
            child: CircularProgressIndicator(
              strokeWidth: 2,
              color: AppColors.primary,
            ),
          ),
        ),
      );
    }

    // Voice not installed on this device
    if (_isAvailable == false) {
      return Padding(
        padding: EdgeInsetsDirectional.only(top: 4.h, bottom: 4.h),
        child: Text(
          'tts.voice_not_available'.tr(),
          style: AppTextStyles.bodySmall.copyWith(color: AppColors.textSecondary),
        ),
      );
    }

    return Row(
      children: [
        IconButton(
          padding: EdgeInsets.zero,
          constraints: BoxConstraints(minWidth: 44.r, minHeight: 44.r),
          icon: Icon(
            _isPlaying
                ? Icons.pause_circle_filled_rounded
                : Icons.play_circle_filled_rounded,
            size: 44.r,
            color: AppColors.primary,
          ),
          onPressed: _isPlaying ? _pause : _play,
        ),
        if (_isPlaying)
          IconButton(
            padding: EdgeInsets.zero,
            constraints: BoxConstraints(minWidth: 44.r, minHeight: 44.r),
            icon: Icon(
              Icons.stop_circle_rounded,
              size: 44.r,
              color: AppColors.textSecondary,
            ),
            onPressed: _stop,
          ),
        const Spacer(),
        DropdownButton<double>(
          value: _speed,
          underline: const SizedBox.shrink(),
          items: _speeds
              .map(
                (s) => DropdownMenuItem(
                  value: s,
                  child: Text('${s}x', style: AppTextStyles.bodySmall),
                ),
              )
              .toList(),
          onChanged: (s) async {
            if (s == null) return;
            await _tts.setSpeechRate(_toTtsRate(s));
            setState(() => _speed = s);
          },
        ),
      ],
    );
  }
}
