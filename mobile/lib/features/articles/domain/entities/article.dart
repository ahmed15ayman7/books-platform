import 'package:equatable/equatable.dart';
import 'package:flutter/material.dart';

class Article extends Equatable {
  const Article({
    required this.id,
    required this.title,
    required this.excerpt,
    required this.categoryLabel,
    required this.channel,
    required this.date,
    required this.readMinutes,
    required this.coverColors,
    this.categoryLabelAr = '',
    this.hasVideo = false,
    this.slug = '',
    this.authorFirstName = '',
    this.authorLastName = '',
    this.readingTime = 0,
    this.imageUrl,
  });

  final String id;
  final String title;
  final String excerpt;
  final String categoryLabel;
  final String categoryLabelAr;
  final String channel;
  final String date;
  final int readMinutes;
  final List<Color> coverColors;
  final bool hasVideo;
  final String slug;
  final String authorFirstName;
  final String authorLastName;
  final int readingTime;
  final String? imageUrl;

  String get authorFullName => '$authorFirstName $authorLastName'.trim();

  // Channel key constants
  static const String kChannelHarvest = 'harvest';
  static const String kChannelIdeas = 'ideas';
  static const String kChannelWorldReads = 'world-reads';
  static const String kChannelBooksTalk = 'books-talk';
  static const String kChannelWatchYourBook = 'watch-your-book';
  static const String kChannelNovelStory = 'novel-story';

  @override
  List<Object?> get props => [id, slug];
}
