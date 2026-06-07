import 'package:flutter/material.dart';

import '../../../../core/enums/translation_status.dart';
import '../../domain/entities/publisher_book.dart';

class PublisherBookModel {
  const PublisherBookModel({
    required this.id,
    required this.titleAr,
    required this.titleEn,
    required this.publisher,
    required this.categorySlug,
    required this.status,
    this.imageUrl,
    this.isNew = false,
  });

  final String id;
  final String titleAr;
  final String titleEn;
  final String publisher;
  final String categorySlug;
  final TranslationStatus status;
  final String? imageUrl;
  final bool isNew;

  factory PublisherBookModel.fromJson(
    Map<String, dynamic> json, {
    String publisherName = '',
  }) {
    final primaryCat = json['primaryCategory'] as Map<String, dynamic>?;
    final categorySlug = primaryCat?['slug'] as String? ?? '';

    return PublisherBookModel(
      id: json['slug'] as String? ?? json['_id'] as String? ?? json['id'] as String? ?? '',
      titleAr: json['nameAr'] as String? ?? '',
      titleEn: json['nameEn'] as String? ?? '',
      publisher: json['publisher'] as String? ?? publisherName,
      categorySlug: categorySlug,
      status: TranslationStatusX.fromString(
          json['translationStatus'] as String?),
      imageUrl: json['imageUrl'] as String?,
      isNew: json['isNew'] as bool? ?? false,
    );
  }

  PublisherBook toEntity() => PublisherBook(
        id: id,
        titleAr: titleAr,
        titleEn: titleEn,
        publisher: publisher,
        imageUrl: imageUrl,
        coverColors: const [Color(0xFF1A1A2E), Color(0xFF16213E)],
        categorySlug: categorySlug,
        status: status,
        isNew: isNew,
      );
}
