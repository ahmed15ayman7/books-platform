import 'package:dartz/dartz.dart';
import 'package:injectable/injectable.dart';

import '../../../../core/network/api_envelope.dart';
import '../../../../core/network/api_manager.dart';
import '../../../../core/network/failure.dart';
import '../../domain/entities/publisher.dart';
import '../models/publisher_model.dart';

@lazySingleton
class PublishersRemoteDataSourceImpl {
  PublishersRemoteDataSourceImpl(this._api);

  final ApiManager _api;

  List<String>? _cachedCountries;

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

  Future<Either<Failure, Publisher>> getPublisherBySlug(String slug) =>
      _api.get(
        path: '/publishers/$slug',
        fromJson: (json) => ApiEnvelope.fromJson(
          json,
          fromData: PublisherModel.fromJson,
        ).data!.toEntity(),
      );

  Future<Either<Failure, PaginatedResponse<Publisher>>> getPublisherBooks(
    String slug, {
    int page = 1,
    int limit = 20,
  }) =>
      _api.get<PaginatedResponse<Publisher>>(
        path: '/publishers/$slug/books',
        queryParameters: {'page': page, 'limit': limit},
        fromJson: (json) => PaginatedResponse<Publisher>.fromJson(
          json,
          fromJsonT: (item) => PublisherModel.fromJson(item).toEntity(),
        ),
      );

  Future<Either<Failure, List<String>>> getCountries() async {
    if (_cachedCountries != null) return right(_cachedCountries!);
    final result = await getPublishers(limit: 100);
    return result.fold(
      (f) => left(f),
      (paginated) {
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

  // Kept for backward compatibility with mock-data callers (e.g. the home cubit)
  Future<Either<Failure, List<Publisher>>> getPublishersLegacy({
    String? countryName,
  }) async {
    final result = await getPublishers(country: countryName, limit: 20);
    return result.fold(
      (f) => left(f),
      (paginated) => right(paginated.data),
    );
  }
}
