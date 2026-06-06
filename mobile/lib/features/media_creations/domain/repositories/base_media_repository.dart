import 'package:dartz/dartz.dart';

import 'package:booksplatform/core/network/api_envelope.dart';
import 'package:booksplatform/core/network/failure.dart';

import '../entities/media_item.dart';

abstract class MediaRepository {
  Future<Either<Failure, PaginatedResponse<MediaItem>>> getMedia({
    String? channel,
    int page = 1,
    int limit = 12,
  });
}
