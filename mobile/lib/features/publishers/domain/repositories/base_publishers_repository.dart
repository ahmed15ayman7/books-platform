import 'package:dartz/dartz.dart';

import '../../../../core/network/failure.dart';
import '../../domain/entities/country.dart';
import '../../domain/entities/publisher.dart';
import '../../domain/entities/publisher_book.dart';

abstract class PublishersRepository {
  Future<Either<Failure, List<Country>>> getCountries();
  Future<Either<Failure, List<Publisher>>> getPublishers({
    String? countrySlug,
    String? search,
  });
  Future<Either<Failure, (Publisher, List<PublisherBook>)>> getPublisherBySlug(
    String slug,
  );
}
