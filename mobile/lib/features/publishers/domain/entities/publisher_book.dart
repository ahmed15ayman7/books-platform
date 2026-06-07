import 'package:equatable/equatable.dart';
import 'package:flutter/material.dart';

import '../../../../core/enums/translation_status.dart';

class PublisherBook extends Equatable {
  const PublisherBook({
    required this.id,
    required this.titleAr,
    required this.titleEn,
    required this.publisher,
    required this.coverColors,
    required this.categorySlug,
    required this.status,
    this.imageUrl,
    this.isNew = false,
  });

  final String id;
  final String titleAr;
  final String titleEn;
  final String publisher;
  final String? imageUrl;
  final List<Color> coverColors;
  final String categorySlug;
  final TranslationStatus status;
  final bool isNew;

  @override
  List<Object?> get props => [id, titleAr, titleEn, status, categorySlug, imageUrl, isNew];
}
