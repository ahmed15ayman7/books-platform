import 'dart:convert';

import 'package:dartz/dartz.dart';
import 'package:flutter/material.dart';
import 'package:injectable/injectable.dart';
import 'package:shared_preferences/shared_preferences.dart';

import '../../../../core/enums/translation_status.dart';
import '../../../../core/network/failure.dart';
import '../../domain/entities/country.dart';
import '../../domain/entities/publisher.dart';
import '../../domain/entities/publisher_book.dart';
import 'base_publishers_data_source.dart';

@Named('local')
@lazySingleton
class PublishersLocalDataSourceImpl implements BasePublishersDataSource {
  PublishersLocalDataSourceImpl(this._prefs);

  final SharedPreferences _prefs;

  static const _kPublishersListKey = 'cache_publishers_list';
  static const _kCountriesKey = 'cache_countries';
  static const _kPublisherDetailPrefix = 'cache_publisher_detail_';

  @override
  Future<Either<Failure, List<Publisher>>> getPublishers({
    String? countrySlug,
    String? search,
  }) async {
    if (countrySlug != null || search != null) return left(const CacheFailure());
    final raw = _prefs.getString(_kPublishersListKey);
    if (raw == null) return left(const CacheFailure());
    try {
      final list = (jsonDecode(raw) as List<dynamic>)
          .map((e) => _publisherFromJson(e as Map<String, dynamic>))
          .toList();
      return right(list);
    } catch (_) {
      return left(const CacheFailure());
    }
  }

  Future<void> savePublishers(List<Publisher> publishers) => _prefs.setString(
        _kPublishersListKey,
        jsonEncode(publishers.map(_publisherToJson).toList()),
      );

  @override
  Future<Either<Failure, List<Country>>> getCountries() async {
    final raw = _prefs.getString(_kCountriesKey);
    if (raw == null) return left(const CacheFailure());
    try {
      final list = (jsonDecode(raw) as List<dynamic>)
          .map((e) => _countryFromJson(e as Map<String, dynamic>))
          .toList();
      return right(list);
    } catch (_) {
      return left(const CacheFailure());
    }
  }

  Future<void> saveCountries(List<Country> countries) => _prefs.setString(
        _kCountriesKey,
        jsonEncode(countries.map(_countryToJson).toList()),
      );

  @override
  Future<Either<Failure, (Publisher, List<PublisherBook>)>> getPublisherBySlug(
    String slug,
  ) async {
    final raw = _prefs.getString('$_kPublisherDetailPrefix$slug');
    if (raw == null) return left(const CacheFailure());
    try {
      final map = jsonDecode(raw) as Map<String, dynamic>;
      final publisher =
          _publisherFromJson(map['publisher'] as Map<String, dynamic>);
      final books = (map['books'] as List<dynamic>)
          .map((e) => _bookFromJson(e as Map<String, dynamic>))
          .toList();
      return right((publisher, books));
    } catch (_) {
      return left(const CacheFailure());
    }
  }

  Future<void> savePublisherDetail(
    String slug,
    Publisher publisher,
    List<PublisherBook> books,
  ) =>
      _prefs.setString(
        '$_kPublisherDetailPrefix$slug',
        jsonEncode({
          'publisher': _publisherToJson(publisher),
          'books': books.map(_bookToJson).toList(),
        }),
      );

  Map<String, dynamic> _publisherToJson(Publisher p) => {
        'id': p.id,
        'name': p.name,
        'nameAr': p.nameAr,
        'countryAr': p.countryAr,
        'countryEn': p.countryEn,
        'countrySlug': p.countrySlug,
        'countryFlag': p.countryFlag,
        'bookCount': p.bookCount,
        'isSponsored': p.isSponsored,
        'imageUrl': p.imageUrl,
        'website': p.website,
        'aboutEn': p.aboutEn,
        'aboutAr': p.aboutAr,
      };

  Publisher _publisherFromJson(Map<String, dynamic> json) => Publisher(
        id: json['id'] as String,
        name: json['name'] as String,
        nameAr: json['nameAr'] as String? ?? '',
        countryAr: json['countryAr'] as String,
        countryEn: json['countryEn'] as String,
        countrySlug: json['countrySlug'] as String? ?? '',
        countryFlag: json['countryFlag'] as String,
        bookCount: json['bookCount'] as int,
        isSponsored: json['isSponsored'] as bool? ?? false,
        imageUrl: json['imageUrl'] as String?,
        website: json['website'] as String?,
        aboutEn: json['aboutEn'] as String?,
        aboutAr: json['aboutAr'] as String?,
      );

  Map<String, dynamic> _countryToJson(Country c) => {
        'slug': c.slug,
        'nameEn': c.nameEn,
        'nameAr': c.nameAr,
      };

  Country _countryFromJson(Map<String, dynamic> json) => Country(
        slug: json['slug'] as String,
        nameEn: json['nameEn'] as String,
        nameAr: json['nameAr'] as String,
      );

  Map<String, dynamic> _bookToJson(PublisherBook b) => {
        'id': b.id,
        'titleAr': b.titleAr,
        'titleEn': b.titleEn,
        'publisher': b.publisher,
        'imageUrl': b.imageUrl,
        'coverColors': b.coverColors.map((c) => c.toARGB32()).toList(),
        'categorySlug': b.categorySlug,
        'status': b.status.name,
        'isNew': b.isNew,
      };

  PublisherBook _bookFromJson(Map<String, dynamic> json) => PublisherBook(
        id: json['id'] as String,
        titleAr: json['titleAr'] as String,
        titleEn: json['titleEn'] as String,
        publisher: json['publisher'] as String,
        imageUrl: json['imageUrl'] as String?,
        coverColors: (json['coverColors'] as List<dynamic>)
            .map((c) => Color(c as int))
            .toList(),
        categorySlug: json['categorySlug'] as String,
        status: TranslationStatus.values.byName(json['status'] as String),
        isNew: json['isNew'] as bool? ?? false,
      );
}
