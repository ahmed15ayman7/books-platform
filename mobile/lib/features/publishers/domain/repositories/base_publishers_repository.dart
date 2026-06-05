import 'package:dartz/dartz.dart';

import '../../../../core/network/failure.dart';
import '../../domain/entities/publisher.dart';

abstract class PublishersRepository {
  Future<Either<Failure, List<String>>> getCountries();
  Future<Either<Failure, List<Publisher>>> getPublishers({
    String? countryName,
    String? search,
  });
  Future<Either<Failure, Publisher>> getPublisherBySlug(String slug);
}
