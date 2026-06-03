import 'package:flutter/material.dart';

import '../../../../core/enums/translation_status.dart';
import '../../domain/entities/book.dart';
import '../../domain/enums/purchase_option.dart';

class BookModel {
  const BookModel({
    required this.id,
    required this.slug,
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
    required this.purchaseOption,
    this.imageUrl,
    this.referralLink,
    this.averageRating,
    this.ratingsCount,
    this.descriptionEn,
    this.isNew = false,
  });

  final String id;
  final String slug;
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
  final PurchaseOption purchaseOption;
  final String? imageUrl;
  final String? referralLink;
  final double? averageRating;
  final int? ratingsCount;
  final String? descriptionEn;
  final bool isNew;

  factory BookModel.fromJson(Map<String, dynamic> json) {
    final categories = json['categories'] as List<dynamic>? ?? [];
    final categorySlug = categories.isNotEmpty
        ? (categories[0] as Map<String, dynamic>)['slug'] as String? ?? ''
        : json['categorySlug'] as String? ?? '';

    return BookModel(
      id: json['_id'] as String? ?? json['id'] as String? ?? '',
      slug: json['slug'] as String? ?? '',
      titleAr: json['nameAr'] as String? ?? json['titleAr'] as String? ?? '',
      titleEn: json['nameEn'] as String? ?? json['titleEn'] as String? ?? '',
      publisher: (json['publisher'] as Map<String, dynamic>?)?['title'] as String? ?? '',
      publisherId: (json['publisher'] as Map<String, dynamic>?)?['slug'] as String? ??
          json['publisherId'] as String? ?? '',
      countryAr: json['publishingCountry'] as String? ?? json['countryAr'] as String? ?? '',
      countryEn: json['publishingCountry'] as String? ?? json['countryEn'] as String? ?? '',
      countryFlag: json['countryFlag'] as String? ?? '',
      originalLanguage: json['originalLanguage'] as String? ?? '',
      status: TranslationStatusX.fromString(json['translationStatus'] as String?),
      price: (json['price'] as num?)?.toDouble() ?? 0.0,
      categorySlug: categorySlug,
      coverColors: const [Color(0xFF2B2540), Color(0xFF46467F)],
      isbn: json['isbn'] as String? ?? '',
      pages: (json['pageCount'] as num?)?.toInt() ?? (json['pages'] as num?)?.toInt() ?? 0,
      edition: json['edition'] as String? ?? '',
      year: (json['year'] as num?)?.toInt() ?? 0,
      descriptionAr: json['descriptionAr'] as String? ?? '',
      descriptionEn: json['descriptionEn'] as String?,
      purchaseOption: PurchaseOptionX.fromString(json['purchaseOption'] as String?),
      imageUrl: json['imageUrl'] as String? ?? json['coverImageUrl'] as String?,
      referralLink: json['referralLink'] as String?,
      averageRating: (json['averageRating'] as num?)?.toDouble(),
      ratingsCount: (json['ratingsCount'] as num?)?.toInt(),
      isNew: json['isNew'] as bool? ?? false,
    );
  }

  Book toEntity() => Book(
        id: id,
        slug: slug,
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
        descriptionEn: descriptionEn,
        purchaseOption: purchaseOption,
        imageUrl: imageUrl,
        referralLink: referralLink,
        averageRating: averageRating,
        ratingsCount: ratingsCount,
        isNew: isNew,
      );
}
