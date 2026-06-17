import 'package:dartz/dartz.dart';
import 'package:injectable/injectable.dart';

import '../../../../core/network/failure.dart';
import '../../domain/entities/country.dart';
import '../../domain/entities/publisher.dart';
import '../../domain/entities/publisher_book.dart';
import '../../domain/repositories/base_publishers_repository.dart';
import '../datasources/publishers_remote_data_source_impl.dart';

@LazySingleton(as: PublishersRepository)
class PublishersRepositoryImpl implements PublishersRepository {
  const PublishersRepositoryImpl(this._remote);
  final PublishersRemoteDataSourceImpl _remote;

  @override
  Future<Either<Failure, List<Country>>> getCountries() =>
      _remote.getCountries();

  @override
  Future<Either<Failure, List<Publisher>>> getPublishers({
    String? countrySlug,
    String? search,
  }) =>
      _remote.getPublishersLegacy(countrySlug: countrySlug, search: search);

  @override
  Future<Either<Failure, (Publisher, List<PublisherBook>)>> getPublisherBySlug(
    String slug,
  ) =>
      _remote.getPublisherBySlug(slug);
}
