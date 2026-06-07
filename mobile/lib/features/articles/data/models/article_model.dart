import 'package:flutter/material.dart';

import '../../../../core/helpers/date_formatter_helper.dart';
import '../../domain/entities/article.dart';

class ArticleModel {
  const ArticleModel({
    required this.id,
    required this.slug,
    required this.title,
    required this.excerpt,
    required this.channel,
    required this.categoryLabel,
    required this.date,
    required this.readingTime,
    this.categoryLabelAr = '',
    this.authorFirstName = '',
    this.authorLastName = '',
    this.imageUrl,
    this.hasVideo = false,
    this.titleEn,
  });

  final String id;
  final String slug;
  final String title;
  final String? titleEn;
  final String excerpt;
  final String channel;
  final String categoryLabel;
  final String categoryLabelAr;
  final String date;
  final int readingTime;
  final String authorFirstName;
  final String authorLastName;
  final String? imageUrl;
  final bool hasVideo;

  factory ArticleModel.fromJson(Map<String, dynamic> json) {
    final author = json['author'] as Map<String, dynamic>?;
    final category = json['articleCategory'] as Map<String, dynamic>?;
    return ArticleModel(
      id: json['_id'] as String? ?? json['id'] as String? ?? '',
      slug: json['slug'] as String? ?? '',
      title: json['title'] as String? ?? json['titleAr'] as String? ?? '',
      titleEn: json['titleEn'] as String?,
      excerpt: json['excerpt'] as String? ?? json['summary'] as String? ?? '',
      channel: json['channel'] as String? ?? '',
      categoryLabel: category?['name'] as String? ?? json['channel'] as String? ?? '',
      categoryLabelAr: category?['nameAr'] as String? ?? '',
      date: json['date'] as String? ?? json['createdAt'] as String? ?? '',
      readingTime: (json['readingTimeMinutes'] as num?)?.toInt() ??
          (json['readingTime'] as num?)?.toInt() ?? 0,
      authorFirstName: author?['firstName'] as String? ?? json['authorFirstName'] as String? ?? '',
      authorLastName: author?['lastName'] as String? ?? json['authorLastName'] as String? ?? '',
      imageUrl: _encodeUrl(_parseFirstImageUrl(json['imageUrl'] as String? ?? json['coverImageUrl'] as String?)),
      // videoId presence determines whether this article has embeddable video
      hasVideo: ((json['videoId'] as String?) ?? '').isNotEmpty,
    );
  }

  // Takes the first URL from a pipe-separated list (API sends multiple images as "url1|url2|...")
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

  Article toEntity() => Article(
        id: id,
        slug: slug,
        title: title,
        titleEn: titleEn,
        excerpt: excerpt,
        channel: channel,
        categoryLabel: categoryLabel,
        categoryLabelAr: categoryLabelAr,
        // $mobile-debug-skill | Problem: raw ISO date string (e.g. "2026-05-18T21:00:00.000Z") was passed to entity unchanged and rendered verbatim in both featured card and article row. Fix: parse and format here at the model boundary so all consumers receive a human-readable date.
        date: DateFormatterHelper.formatDate(date.isNotEmpty ? DateTime.tryParse(date) : null),
        readMinutes: readingTime,
        readingTime: readingTime,
        coverColors: const [Color(0xFF0D1B2A), Color(0xFF1B4F72)],
        hasVideo: hasVideo,
        authorFirstName: authorFirstName,
        authorLastName: authorLastName,
        imageUrl: imageUrl,
      );
}
