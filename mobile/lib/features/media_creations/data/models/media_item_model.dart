import 'package:booksplatform/core/helpers/date_formatter_helper.dart';

import '../../domain/entities/media_item.dart';

class MediaItemModel {
  const MediaItemModel({
    required this.id,
    required this.slug,
    required this.title,
    required this.imageUrl,
    required this.channel,
    required this.date,
    required this.videoId,
    required this.youtubeUrl,
    required this.channelLabel,
    required this.channelLabelAr,
  });

  final String id;
  final String slug;
  final String title;
  final String imageUrl;
  final String channel;
  final String date;
  final String videoId;
  final String youtubeUrl;
  final String channelLabel;
  final String channelLabelAr;

  factory MediaItemModel.fromJson(Map<String, dynamic> json) {
    final category = json['articleCategory'] as Map<String, dynamic>?;
    final channel = json['channel'] as String? ?? '';
    final videoId = json['videoId'] as String? ?? '';
    final rawImageUrl = json['imageUrl'] as String? ?? '';
    final imageUrl = rawImageUrl.isNotEmpty
        ? rawImageUrl
        : (videoId.isNotEmpty
            ? 'https://img.youtube.com/vi/$videoId/hqdefault.jpg'
            : '');
    return MediaItemModel(
      id: json['id'] as String? ?? '',
      slug: json['slug'] as String? ?? '',
      title: json['title'] as String? ?? '',
      imageUrl: imageUrl,
      channel: channel,
      date: json['date'] as String? ?? json['createdAt'] as String? ?? '',
      videoId: videoId,
      youtubeUrl: json['youtubeUrl'] as String? ?? '',
      channelLabel: category?['name'] as String? ?? channel,
      channelLabelAr: category?['nameAr'] as String? ?? '',
    );
  }

  MediaItem toEntity() => MediaItem(
        id: id,
        slug: slug,
        title: title,
        imageUrl: imageUrl,
        channel: channel,
        date: DateFormatterHelper.formatDate(
          date.isNotEmpty ? DateTime.tryParse(date) : null,
        ),
        videoId: videoId,
        youtubeUrl: youtubeUrl,
        channelLabel: channelLabel,
        channelLabelAr: channelLabelAr,
      );
}
