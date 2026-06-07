import 'package:dartz/dartz.dart';
import 'package:injectable/injectable.dart';

import '../../../../core/network/api_envelope.dart';
import '../../../../core/network/api_manager.dart';
import '../../../../core/network/failure.dart';
import '../../domain/entities/publisher.dart';
import '../../domain/entities/publisher_book.dart';
import '../models/publisher_book_model.dart';
import '../models/publisher_model.dart';

@lazySingleton
class PublishersRemoteDataSourceImpl {
  PublishersRemoteDataSourceImpl(this._api);

  final ApiManager _api;

  List<String>? _cachedCountries;
  final Map<String, String> _arToEnCountry = {};

  Future<Either<Failure, PaginatedResponse<Publisher>>> getPublishers({
    String? country,
    int page = 1,
    int limit = 20,
    String? search,
    String? locale,
  }) =>
      _api.get<PaginatedResponse<Publisher>>(
        path: '/publishers',
        queryParameters: {
          'country': ?country,
          'page': page,
          'limit': limit,
          'search': ?search,
          'locale': ?locale,
        },
        fromJson: (json) => PaginatedResponse<Publisher>.fromJson(
          json,
          fromJsonT: (item) => PublisherModel.fromJson(item).toEntity(),
        ),
      );

  Future<Either<Failure, (Publisher, List<PublisherBook>)>>
      getPublisherBySlug(String slug) => _api.get(
            path: '/publishers/$slug',
            fromJson: (json) {
              final dataJson =
                  (json as Map<String, dynamic>)['data']
                      as Map<String, dynamic>;
              final publisherModel = PublisherModel.fromJson(dataJson);
              final publisher = publisherModel.toEntity();

              final productsRaw =
                  dataJson['products'] as List<dynamic>? ?? [];
              final books = productsRaw
                  .map((p) => PublisherBookModel.fromJson(
                        p as Map<String, dynamic>,
                        publisherName: publisherModel.title,
                      ).toEntity())
                  .toList();

              return (publisher, books);
            },
          );

  Future<Either<Failure, List<String>>> getCountries() async {
    if (_cachedCountries != null) return right(_cachedCountries!);
    final result = await getPublishers(limit: 100);
    return result.fold(
      (f) => left(f),
      (paginated) {
        _arToEnCountry.clear();
        for (final p in paginated.data) {
          if (p.countryAr.isNotEmpty && p.countrySlug.isNotEmpty) {
            _arToEnCountry[p.countryAr] = p.countrySlug;
          }
        }
        final countries = paginated.data
            .expand((p) => [p.countryAr].where((c) => c.isNotEmpty))
            .toSet()
            .toList()
          ..sort();
        _cachedCountries = countries;
        return right(countries);
      },
    );
  }

  Future<Either<Failure, List<Publisher>>> getPublishersLegacy({
    String? countryName,
    String? search,
  }) async {
    final englishCountry = countryName != null
        ? (_arToEnCountry[countryName] ?? countryName)
        : null;
    final result = await getPublishers(
      country: englishCountry,
      search: search,
      limit: 20,
    );
    return result.fold(
      (f) => left(f),
      (paginated) => right(paginated.data),
    );
  }
}
