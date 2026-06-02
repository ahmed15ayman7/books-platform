import 'package:flutter/material.dart';

import '../../domain/entities/article_detail.dart';
import 'article_model.dart';

class ArticleDetailModel {
  const ArticleDetailModel({
    required this.id,
    required this.slug,
    required this.title,
    required this.authorFirstName,
    required this.authorLastName,
    required this.date,
    required this.readingTime,
    required this.channel,
    required this.categoryLabel,
    required this.bodyParagraphs,
    required this.relatedArticles,
    this.pullQuote,
    this.hasVideo = false,
    this.videoUrl,
  });

  final String id;
  final String slug;
  final String title;
  final String authorFirstName;
  final String authorLastName;
  final String date;
  final int readingTime;
  final String channel;
  final String categoryLabel;
  final List<String> bodyParagraphs;
  final List<ArticleModel> relatedArticles;
  final String? pullQuote;
  final bool hasVideo;
  final String? videoUrl; // TODO: confirm field name with backend (Risk #6)

  factory ArticleDetailModel.fromJson(Map<String, dynamic> json) {
    final author = json['author'] as Map<String, dynamic>?;
    final relatedRaw = json['relatedArticles'] as List<dynamic>? ?? [];
    final bodyRaw = json['bodyParagraphs'] as List<dynamic>? ?? [];
    return ArticleDetailModel(
      id: json['_id'] as String? ?? json['id'] as String? ?? '',
      slug: json['slug'] as String? ?? '',
      title: json['title'] as String? ?? '',
      authorFirstName: author?['firstName'] as String? ?? json['authorFirstName'] as String? ?? '',
      authorLastName: author?['lastName'] as String? ?? json['authorLastName'] as String? ?? '',
      date: json['createdAt'] as String? ?? json['date'] as String? ?? '',
      readingTime: (json['readingTime'] as num?)?.toInt() ?? 5,
      channel: json['channel'] as String? ?? '',
      categoryLabel: json['categoryLabel'] as String? ?? json['channel'] as String? ?? '',
      bodyParagraphs: bodyRaw.map((e) => e.toString()).toList(),
      relatedArticles: relatedRaw
          .map((e) => ArticleModel.fromJson(e as Map<String, dynamic>))
          .toList(),
      pullQuote: json['pullQuote'] as String?,
      hasVideo: json['hasVideo'] as bool? ?? false,
      videoUrl: json['videoUrl'] as String?,
    );
  }

  ArticleDetail toEntity() => ArticleDetail(
        id: id,
        slug: slug,
        title: title,
        authorName: '$authorFirstName $authorLastName'.trim(),
        authorFirstName: authorFirstName,
        authorLastName: authorLastName,
        date: date,
        readMinutes: readingTime,
        coverColors: const [Color(0xFF0D1B2A), Color(0xFF1B4F72)],
        channel: channel,
        categoryLabel: categoryLabel,
        bodyParagraphs: bodyParagraphs,
        relatedArticles: relatedArticles.map((m) => m.toEntity()).toList(),
        pullQuote: pullQuote,
        hasVideo: hasVideo,
        videoUrl: videoUrl,
      );
}
