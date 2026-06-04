import 'package:equatable/equatable.dart';
import 'package:flutter/material.dart';

import 'article.dart';

class ArticleDetail extends Equatable {
  const ArticleDetail({
    required this.id,
    required this.title,
    required this.authorName,
    required this.date,
    required this.readMinutes,
    required this.coverColors,
    required this.channel,
    required this.categoryLabel,
    required this.bodyParagraphs,
    required this.relatedArticles,
    this.pullQuote,
    this.hasVideo = false,
    this.slug = '',
    this.authorFirstName = '',
    this.authorLastName = '',
    this.videoUrl,
    this.imageUrl,
  });

  final String id;
  final String title;
  final String authorName;
  final String date;
  final int readMinutes;
  final List<Color> coverColors;
  final String channel;
  final String categoryLabel;
  final List<String> bodyParagraphs;
  final List<Article> relatedArticles;
  final String? pullQuote;
  final bool hasVideo;
  final String slug;
  final String authorFirstName;
  final String authorLastName;
  final String? videoUrl;
  final String? imageUrl;

  @override
  List<Object?> get props => [id];
}
