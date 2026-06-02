import 'package:dartz/dartz.dart';
import 'package:injectable/injectable.dart';

import '../../../../core/network/failure.dart';
import '../../domain/entities/search_response.dart';
import '../../domain/entities/search_suggestion.dart';
import '../../domain/repositories/search_repository.dart';
import '../datasources/search_remote_data_source.dart';

@LazySingleton(as: SearchRepository)
class SearchRepositoryImpl implements SearchRepository {
  SearchRepositoryImpl(this._remote);

  final SearchRemoteDataSource _remote;

  @override
  Future<Either<Failure, SearchResponse>> search(
    String query, {
    String? type,
    int page = 1,
    int limit = 20,
    String? locale,
  }) =>
      _remote.search(query, type: type, page: page, limit: limit, locale: locale);

  @override
  Future<Either<Failure, List<SearchSuggestion>>> getSuggestions(
    String query, {
    int limit = 5,
  }) =>
      _remote.getSuggestions(query, limit: limit);
}
