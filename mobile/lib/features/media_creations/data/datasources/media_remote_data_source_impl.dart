import 'package:dartz/dartz.dart';
import 'package:injectable/injectable.dart';

import 'package:booksplatform/core/network/api_envelope.dart';
import 'package:booksplatform/core/network/api_manager.dart';
import 'package:booksplatform/core/network/failure.dart';

import '../../domain/entities/media_item.dart';
import '../models/media_item_model.dart';

@lazySingleton
class MediaRemoteDataSourceImpl {
  const MediaRemoteDataSourceImpl(this._api);

  final ApiManager _api;

  Future<Either<Failure, PaginatedResponse<MediaItem>>> getMedia({
    String? channel,
    int page = 1,
    int limit = 12,
  }) =>
      _api.get<PaginatedResponse<MediaItem>>(
        path: '/media',
        queryParameters: {
          'page': page,
          'limit': limit,
          'sort': 'newest',
          'channel': ?channel,
        },
        fromJson: (json) => PaginatedResponse<MediaItem>.fromJson(
          json,
          fromJsonT: (item) => MediaItemModel.fromJson(item).toEntity(),
        ),
      );
}
