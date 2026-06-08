import 'package:flutter/material.dart';

import '../../../../core/enums/translation_status.dart';
import '../../../../core/helpers/book_biblio_helpers.dart';
import '../../domain/entities/book.dart';
import '../../domain/entities/book_author_ref.dart';
import '../../domain/entities/book_category_ref.dart';
import '../../domain/entities/book_tag_ref.dart';
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
    this.publisherNameEn = '',
    this.publisherNameAr = '',
    this.publisherAddress,
    this.publisherWebsiteUrl,
    this.languageCode,
    this.editionAr,
    this.publicationYear,
    this.dimensions,
    this.notes,
    this.primaryCategory,
    this.categories = const [],
    this.authors = const [],
    this.tags = const [],
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
  final String publisherNameEn;
  final String publisherNameAr;
  final String? publisherAddress;
  final String? publisherWebsiteUrl;
  final String? languageCode;
  final String? editionAr;
  final int? publicationYear;
  final String? dimensions;
  final String? notes;
  final BookCategoryRef? primaryCategory;
  final List<BookCategoryRef> categories;
  final List<BookAuthorRef> authors;
  final List<BookTagRef> tags;

  factory BookModel.fromJson(Map<String, dynamic> json) {
    final primaryCat = json['primaryCategory'] as Map<String, dynamic>?;
    final categoriesJson = json['categories'] as List<dynamic>? ?? [];
    final categorySlug = primaryCat != null
        ? primaryCat['slug'] as String? ?? ''
        : categoriesJson.isNotEmpty
            ? (categoriesJson[0] as Map<String, dynamic>)['slug'] as String? ?? ''
            : json['categorySlug'] as String? ?? '';

    final pub = json['publisher'] as Map<String, dynamic>?;
    final publisherTitle = pub?['title'] as String? ?? '';
    final publisherNameEn = pub?['name'] as String? ?? '';
    final publisherNameAr = pub?['nameAr'] as String? ?? '';
    final publisherWebsiteUrl = pub?['websiteUrl'] as String?;
    final publisherAddressRaw = pub?['address'] as String?;
    final countries = (pub?['countries'] as List<dynamic>? ?? [])
        .whereType<Map<String, dynamic>>()
        .toList();

    final topLevelCountry = json['country'] as String?;
    final legacyPublishingCountry = json['publishingCountry'] as String?;
    final legacyCountryAr = json['countryAr'] as String?;
    final legacyCountryEn = json['countryEn'] as String?;

    final countryAr = resolveBookCountry(
          countries: countries,
          topLevelCountry: topLevelCountry,
          legacyPublishingCountry: legacyPublishingCountry,
          legacyCountryAr: legacyCountryAr,
          legacyCountryEn: legacyCountryEn,
          isAr: true,
        ) ??
        '';
    final countryEn = resolveBookCountry(
          countries: countries,
          topLevelCountry: topLevelCountry,
          legacyPublishingCountry: legacyPublishingCountry,
          legacyCountryAr: legacyCountryAr,
          legacyCountryEn: legacyCountryEn,
          isAr: false,
        ) ??
        '';

    final languageCode = json['language'] as String?;
    final publicationYear = (json['publicationYear'] as num?)?.toInt();

    return BookModel(
      id: json['_id'] as String? ?? json['id'] as String? ?? '',
      slug: json['slug'] as String? ?? '',
      titleAr: json['nameAr'] as String? ?? json['titleAr'] as String? ?? '',
      titleEn: json['nameEn'] as String? ?? json['titleEn'] as String? ?? '',
      publisher: publisherTitle,
      publisherId: pub?['slug'] as String? ?? json['publisherId'] as String? ?? '',
      publisherNameEn: publisherNameEn,
      publisherNameAr: publisherNameAr,
      publisherAddress: publisherAddressRaw,
      publisherWebsiteUrl: publisherWebsiteUrl,
      countryAr: countryAr,
      countryEn: countryEn,
      countryFlag: json['countryFlag'] as String? ?? '',
      languageCode: languageCode,
      originalLanguage: json['originalLanguage'] as String? ?? '',
      status: TranslationStatusX.fromString(json['translationStatus'] as String?),
      price: (json['price'] as num?)?.toDouble() ?? 0.0,
      categorySlug: categorySlug,
      coverColors: const [Color(0xFF2B2540), Color(0xFF46467F)],
      isbn: json['isbn'] as String? ?? '',
      pages: (json['pageCount'] as num?)?.toInt() ?? (json['pages'] as num?)?.toInt() ?? 0,
      edition: json['edition'] as String? ?? '',
      editionAr: json['editionAr'] as String?,
      year: publicationYear ?? (json['year'] as num?)?.toInt() ?? 0,
      publicationYear: publicationYear,
      dimensions: json['dimensions'] as String?,
      notes: json['notes'] as String?,
      descriptionAr: json['descriptionAr'] as String? ?? '',
      descriptionEn: json['descriptionEn'] as String?,
      purchaseOption: PurchaseOptionX.fromString(json['purchaseOption'] as String?),
      imageUrl: json['imageUrl'] as String? ?? json['coverImageUrl'] as String?,
      referralLink: json['referralLink'] as String?,
      averageRating: (json['averageRating'] as num?)?.toDouble(),
      ratingsCount: (json['ratingsCount'] as num?)?.toInt(),
      isNew: json['isNew'] as bool? ?? false,
      primaryCategory: _parseCategoryRef(primaryCat),
      categories: categoriesJson
          .whereType<Map<String, dynamic>>()
          .map(_parseCategoryRef)
          .whereType<BookCategoryRef>()
          .toList(),
      authors: (json['authors'] as List<dynamic>? ?? [])
          .whereType<Map<String, dynamic>>()
          .map(_parseAuthorRef)
          .whereType<BookAuthorRef>()
          .toList(),
      tags: (json['tags'] as List<dynamic>? ?? [])
          .whereType<Map<String, dynamic>>()
          .map(_parseTagRef)
          .whereType<BookTagRef>()
          .toList(),
    );
  }

  Book toEntity() => Book(
        id: id,
        slug: slug,
        titleAr: titleAr,
        titleEn: titleEn,
        publisher: publisher,
        publisherId: publisherId,
        publisherNameEn: publisherNameEn,
        publisherNameAr: publisherNameAr,
        publisherAddress: publisherAddress,
        publisherWebsiteUrl: publisherWebsiteUrl,
        countryAr: countryAr,
        countryEn: countryEn,
        countryFlag: countryFlag,
        languageCode: languageCode,
        originalLanguage: originalLanguage,
        status: status,
        price: price,
        categorySlug: categorySlug,
        coverColors: coverColors,
        isbn: isbn,
        pages: pages,
        edition: edition,
        editionAr: editionAr,
        year: year,
        publicationYear: publicationYear,
        dimensions: dimensions,
        notes: notes,
        descriptionAr: descriptionAr,
        descriptionEn: descriptionEn,
        purchaseOption: purchaseOption,
        imageUrl: imageUrl,
        referralLink: referralLink,
        averageRating: averageRating,
        ratingsCount: ratingsCount,
        isNew: isNew,
        primaryCategory: primaryCategory,
        categories: categories,
        authors: authors,
        tags: tags,
      );

  static BookCategoryRef? _parseCategoryRef(Map<String, dynamic>? json) {
    if (json == null) return null;
    return BookCategoryRef(
      id: json['id'] as String? ?? '',
      slug: json['slug'] as String? ?? '',
      nameEn: json['name'] as String? ?? json['nameEn'] as String? ?? '',
      nameAr: json['nameAr'] as String? ?? '',
    );
  }

  static BookAuthorRef? _parseAuthorRef(Map<String, dynamic> json) {
    final name = json['name'] as String? ?? '';
    if (name.isEmpty && (json['nameAr'] as String? ?? '').isEmpty) return null;
    return BookAuthorRef(
      id: json['id'] as String? ?? '',
      slug: json['slug'] as String? ?? '',
      name: name,
      nameAr: json['nameAr'] as String? ?? '',
    );
  }

  static BookTagRef? _parseTagRef(Map<String, dynamic> json) {
    final name = json['name'] as String? ?? '';
    if (name.isEmpty) return null;
    return BookTagRef(
      id: json['id'] as String? ?? '',
      slug: json['slug'] as String? ?? '',
      name: name,
    );
  }
}
