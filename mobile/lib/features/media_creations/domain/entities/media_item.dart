import 'package:equatable/equatable.dart';

class MediaItem extends Equatable {
  const MediaItem({
    required this.id,
    required this.slug,
    required this.title,
    required this.imageUrl,
    required this.channel,
    required this.date,
    required this.videoId,
    required this.youtubeUrl,
    this.channelLabel = '',
    this.channelLabelAr = '',
    this.hasVideo = true,
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
  final bool hasVideo;

  @override
  List<Object?> get props => [id, slug];
}
