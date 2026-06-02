import 'package:dartz/dartz.dart';

import '../../../../core/network/failure.dart';
import '../entities/search_response.dart';
import '../entities/search_suggestion.dart';

abstract class SearchRepository {
  Future<Either<Failure, SearchResponse>> search(
    String query, {
    String? type,
    int page = 1,
    int limit = 20,
    String? locale,
  });

  Future<Either<Failure, List<SearchSuggestion>>> getSuggestions(
    String query, {
    int limit = 5,
  });
}
