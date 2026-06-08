import 'package:equatable/equatable.dart';
import 'package:flutter/material.dart';

import '../../../../core/enums/translation_status.dart';
import '../enums/purchase_option.dart';
import 'book_author_ref.dart';
import 'book_category_ref.dart';
import 'book_tag_ref.dart';

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
    this.slug = '',
    this.imageUrl,
    this.purchaseOption = PurchaseOption.notAvailable,
    this.referralLink,
    this.averageRating,
    this.ratingsCount,
    this.descriptionEn,
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
  final String slug;
  final String? imageUrl;
  final PurchaseOption purchaseOption;
  final String? referralLink;
  final double? averageRating;
  final int? ratingsCount;
  final String? descriptionEn;
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

  String categoryDisplayName(String locale) {
    if (primaryCategory != null) {
      return primaryCategory!.displayName(locale);
    }
    if (categories.isNotEmpty) {
      return categories.first.displayName(locale);
    }
    return '';
  }

  @override
  List<Object?> get props => [id, titleAr, titleEn, status, price, categorySlug, isNew, slug];
}
