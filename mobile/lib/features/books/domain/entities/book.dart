import 'package:equatable/equatable.dart';
import 'package:flutter/material.dart';

import '../../../../core/enums/translation_status.dart';

class Book extends Equatable {
  const Book({
    required this.id,
    required this.titleAr,
    required this.titleEn,
    required this.publisher,
    required this.publisherId,
    required this.countryAr,
    required this.countryEn,
    required this.countryFlag,
    required this.originalLanguage,
    required this.status,
    required this.price,
    required this.categorySlug,
    required this.coverColors,
    required this.isbn,
    required this.pages,
    required this.edition,
    required this.year,
    required this.descriptionAr,
    this.isNew = false,
  });

  final String id;
  final String titleAr;
  final String titleEn;
  final String publisher;
  final String publisherId;
  final String countryAr;
  final String countryEn;
  final String countryFlag;
  final String originalLanguage;
  final TranslationStatus status;
  final double price;
  final String categorySlug;
  final List<Color> coverColors;
  final String isbn;
  final int pages;
  final String edition;
  final int year;
  final String descriptionAr;
  final bool isNew;

  @override
  List<Object?> get props => [id, titleAr, titleEn, status, price, categorySlug, isNew];
}
