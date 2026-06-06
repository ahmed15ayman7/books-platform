import 'package:dartz/dartz.dart';
import 'package:injectable/injectable.dart';

import 'package:booksplatform/core/network/api_envelope.dart';
import 'package:booksplatform/core/network/failure.dart';

import '../../domain/entities/media_item.dart';
import '../../domain/repositories/base_media_repository.dart';
import '../datasources/media_remote_data_source_impl.dart';

@LazySingleton(as: MediaRepository)
class MediaRepositoryImpl implements MediaRepository {
  const MediaRepositoryImpl(this._remote);

  final MediaRemoteDataSourceImpl _remote;

  @override
  Future<Either<Failure, PaginatedResponse<MediaItem>>> getMedia({
    String? channel,
    int page = 1,
    int limit = 12,
  }) =>
      _remote.getMedia(channel: channel, page: page, limit: limit);
}
