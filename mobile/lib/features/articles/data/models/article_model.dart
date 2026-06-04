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
  });

  final String id;
  final String slug;
  final String title;
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
      excerpt: json['excerpt'] as String? ?? json['summary'] as String? ?? '',
      channel: json['channel'] as String? ?? '',
      categoryLabel: category?['name'] as String? ?? json['channel'] as String? ?? '',
      categoryLabelAr: category?['nameAr'] as String? ?? '',
      date: json['createdAt'] as String? ?? json['date'] as String? ?? '',
      readingTime: (json['readingTimeMinutes'] as num?)?.toInt() ??
          (json['readingTime'] as num?)?.toInt() ?? 5,
      authorFirstName: author?['firstName'] as String? ?? json['authorFirstName'] as String? ?? '',
      authorLastName: author?['lastName'] as String? ?? json['authorLastName'] as String? ?? '',
      // $mobile-debug-skill | Problem: imageUrl paths contain Arabic characters (e.g. /uploads/اللغة.jpg) which are invalid in HTTP requests without percent-encoding. Fix: Uri.encodeFull preserves scheme/host but encodes non-ASCII path characters.
      imageUrl: _encodeUrl(json['imageUrl'] as String? ?? json['coverImageUrl'] as String?),
      hasVideo: json['hasVideo'] as bool? ?? false,
    );
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
