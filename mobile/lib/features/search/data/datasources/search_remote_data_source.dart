import 'package:dartz/dartz.dart';
import 'package:injectable/injectable.dart';

import '../../../../core/network/api_envelope.dart';
import '../../../../core/network/api_manager.dart';
import '../../../../core/network/failure.dart';
import '../../domain/entities/search_response.dart';
import '../../domain/entities/search_suggestion.dart';
import '../models/search_result_model.dart';

@lazySingleton
class SearchRemoteDataSource {
  SearchRemoteDataSource(this._api);

  final ApiManager _api;

  Future<Either<Failure, SearchResponse>> search(
    String query, {
    String? type,
    int page = 1,
    int limit = 20,
    String? locale,
  }) =>
      _api.get(
        path: '/search',
        queryParameters: {
          'q': query,
          'type': ?type,
          'page': page,
          'limit': limit,
          'locale': ?locale,
        },
        fromJson: (json) => ApiEnvelope.fromJson(
          json,
          fromData: SearchResponseModel.fromJson,
        ).data!.toEntity(),
      );

  Future<Either<Failure, List<SearchSuggestion>>> getSuggestions(
    String query, {
    int limit = 5,
  }) =>
      _api.get(
        path: '/search/suggestions',
        queryParameters: {'q': query, 'limit': limit},
        fromJson: (json) {
          final list = json as List<dynamic>;
          return list
              .map((e) => SearchSuggestionModel.fromJson(e as Map<String, dynamic>).toEntity())
              .toList();
        },
      );
}
