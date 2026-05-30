import 'package:flutter/material.dart';

import '../../../../core/enums/translation_status.dart';
import '../../domain/entities/book.dart';

class BookResponse {
  const BookResponse({
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

  factory BookResponse.fromJson(Map<String, dynamic> json) {
    return BookResponse(
      id: json['id'] as String,
      titleAr: json['titleAr'] as String,
      titleEn: json['titleEn'] as String,
      publisher: json['publisher'] as String,
      publisherId: json['publisherId'] as String,
      countryAr: json['countryAr'] as String,
      countryEn: json['countryEn'] as String,
      countryFlag: json['countryFlag'] as String,
      originalLanguage: json['originalLanguage'] as String,
      status: _parseStatus(json['status'] as String),
      price: (json['price'] as num).toDouble(),
      categorySlug: json['categorySlug'] as String,
      coverColors: (json['coverColors'] as List<dynamic>)
          .map((c) => Color(int.parse((c as String).replaceFirst('#', '0xFF'))))
          .toList(),
      isbn: json['isbn'] as String,
      pages: json['pages'] as int,
      edition: json['edition'] as String,
      year: json['year'] as int,
      descriptionAr: json['descriptionAr'] as String,
      isNew: json['isNew'] as bool? ?? false,
    );
  }

  Book toEntity() => Book(
        id: id,
        titleAr: titleAr,
        titleEn: titleEn,
        publisher: publisher,
        publisherId: publisherId,
        countryAr: countryAr,
        countryEn: countryEn,
        countryFlag: countryFlag,
        originalLanguage: originalLanguage,
        status: status,
        price: price,
        categorySlug: categorySlug,
        coverColors: coverColors,
        isbn: isbn,
        pages: pages,
        edition: edition,
        year: year,
        descriptionAr: descriptionAr,
        isNew: isNew,
      );

  static TranslationStatus _parseStatus(String s) => switch (s) {
        'TRANSLATED' => TranslationStatus.translated,
        'NOMINATED' => TranslationStatus.nominated,
        'NEW' => TranslationStatus.newBook,
        _ => TranslationStatus.notTranslated,
      };
}
