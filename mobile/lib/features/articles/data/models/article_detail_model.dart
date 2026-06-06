import 'package:flutter/material.dart';

import '../../../../core/helpers/date_formatter_helper.dart';
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
    this.imageUrl,
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
  final String? videoUrl;
  final String? imageUrl;

  static String? _parseFirstImageUrl(String? raw) {
    if (raw == null || raw.isEmpty) return null;
    final first = raw.split('|').first.trim();
    return first.isEmpty ? null : first;
  }

  static String? _encodeUrl(String? url) {
    if (url == null) return null;
    try {
      return Uri.encodeFull(url);
    } catch (_) {
      return url;
    }
  }

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
      date: json['date'] as String? ?? json['createdAt'] as String? ?? '',
      readingTime: (json['readingTimeMinutes'] as num?)?.toInt() ??
          (json['readingTime'] as num?)?.toInt() ?? 0,
      channel: json['channel'] as String? ?? '',
      categoryLabel: json['categoryLabel'] as String? ?? json['channel'] as String? ?? '',
      bodyParagraphs: bodyRaw.map((e) => e.toString()).toList(),
      relatedArticles: relatedRaw
          .map((e) => ArticleModel.fromJson(e as Map<String, dynamic>))
          .toList(),
      pullQuote: json['pullQuote'] as String?,
      // videoId presence determines whether this article has embeddable video
      hasVideo: ((json['videoId'] as String?) ?? '').isNotEmpty,
      videoUrl: json['youtubeUrl'] as String? ?? json['videoUrl'] as String?,
      imageUrl: _encodeUrl(_parseFirstImageUrl(json['imageUrl'] as String? ?? json['coverImageUrl'] as String?)),
    );
  }

  ArticleDetail toEntity() => ArticleDetail(
        id: id,
        slug: slug,
        title: title,
        authorName: '$authorFirstName $authorLastName'.trim(),
        authorFirstName: authorFirstName,
        authorLastName: authorLastName,
        // $mobile-debug-skill | Problem: raw ISO date string was passed to entity unchanged. Fix: parse and format here so the byline shows a human-readable date.
        date: DateFormatterHelper.formatDate(date.isNotEmpty ? DateTime.tryParse(date) : null),
        readMinutes: readingTime,
        coverColors: const [Color(0xFF0D1B2A), Color(0xFF1B4F72)],
        channel: channel,
        categoryLabel: categoryLabel,
        bodyParagraphs: bodyParagraphs,
        relatedArticles: relatedArticles.map((m) => m.toEntity()).toList(),
        pullQuote: pullQuote,
        hasVideo: hasVideo,
        videoUrl: videoUrl,
        imageUrl: imageUrl,
      );
}
