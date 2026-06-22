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
      bodyParagraphs: _parseBodyParagraphs(json),
      relatedArticles: relatedRaw
          .map((e) => ArticleModel.fromJson(e as Map<String, dynamic>))
          .toList(),
      pullQuote: json['pullQuote'] as String?,
      hasVideo: ((json['videoId'] as String?) ?? '').isNotEmpty,
      videoUrl: json['youtubeUrl'] as String? ??
          json['videoUrl'] as String? ??
          (((json['videoId'] as String?) ?? '').isNotEmpty
              ? 'https://www.youtube.com/watch?v=${json['videoId']}'
              : null),
      imageUrl: _encodeUrl(_parseFirstImageUrl(json['imageUrl'] as String? ?? json['coverImageUrl'] as String?))
          ?? (((json['videoId'] as String?) ?? '').isNotEmpty
              ? 'https://img.youtube.com/vi/${json['videoId']}/hqdefault.jpg'
              : null),
    );
  }

  // The live API returns the article body in the 'content' field as Markdown.
  // We return it as a single-element list so ArticleDetailBodyContent can
  // pass it directly to MarkdownBody as one document (not split into pieces,
  // which would break headers and multi-line formatting).
  static List<String> _parseBodyParagraphs(Map<String, dynamic> json) {
    final raw = json['bodyParagraphs'] as List<dynamic>?;
    if (raw != null && raw.isNotEmpty) {
      return raw
          .map((e) => e.toString().trim())
          .where((s) => s.isNotEmpty)
          .toList();
    }
    final text = json['content'] as String? ??
        json['body'] as String? ??
        json['excerpt'] as String? ??
        '';
    if (text.trim().isEmpty) return [];
    return [_stripWordPressShortcodes(text)];
  }

  // Strips WordPress caption shortcodes exported as escaped Markdown brackets.
  // Opening tags like \[caption id="..." align="..." width="..."\] and the
  // matching \[/caption\] are removed; any standard Markdown inside (e.g.
  // inline images ![](url)) is kept.
  static String _stripWordPressShortcodes(String raw) {
    return raw
        .replaceAll(RegExp(r'\\\[caption [^\]]*\]'), '')
        .replaceAll(RegExp(r'\\\[/caption\\\]'), '')
        .trim();
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
