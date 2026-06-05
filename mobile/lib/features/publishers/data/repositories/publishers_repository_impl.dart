import 'package:dartz/dartz.dart';
import 'package:injectable/injectable.dart';

import '../../../../core/network/failure.dart';
import '../../domain/entities/publisher.dart';
import '../../domain/repositories/base_publishers_repository.dart';
import '../datasources/publishers_remote_data_source_impl.dart';

@LazySingleton(as: PublishersRepository)
class PublishersRepositoryImpl implements PublishersRepository {
  const PublishersRepositoryImpl(this._remote);
  final PublishersRemoteDataSourceImpl _remote;

  @override
  Future<Either<Failure, List<String>>> getCountries() =>
      _remote.getCountries();

  @override
  Future<Either<Failure, List<Publisher>>> getPublishers({
    String? countryName,
    String? search,
  }) =>
      _remote.getPublishersLegacy(countryName: countryName, search: search);

  @override
  Future<Either<Failure, Publisher>> getPublisherBySlug(String slug) =>
      _remote.getPublisherBySlug(slug);
}
