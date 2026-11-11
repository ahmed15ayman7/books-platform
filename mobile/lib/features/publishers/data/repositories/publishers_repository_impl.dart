import 'package:dartz/dartz.dart';
import 'package:injectable/injectable.dart';

import '../../../../core/network/failure.dart';
import '../../domain/entities/country.dart';
import '../../domain/entities/publisher.dart';
import '../../domain/entities/publisher_book.dart';
import '../../domain/repositories/base_publishers_repository.dart';
import '../datasources/base_publishers_data_source.dart';
import '../datasources/publishers_local_data_source_impl.dart';

@LazySingleton(as: PublishersRepository)
class PublishersRepositoryImpl implements PublishersRepository {
  const PublishersRepositoryImpl(
    @Named('remote') this._remote,
    @Named('local') this._local,
  );

  final BasePublishersDataSource _remote;
  final PublishersLocalDataSourceImpl _local;

  @override
  Future<Either<Failure, List<Country>>> getCountries() async {
    final result = await _remote.getCountries();
    return result.fold(
      (_) => _local.getCountries(),
      (countries) async {
        await _local.saveCountries(countries);
        return right(countries);
      },
    );
  }

  @override
  Future<Either<Failure, List<Publisher>>> getPublishers({
    String? countrySlug,
    String? search,
  }) async {
    final result =
        await _remote.getPublishers(countrySlug: countrySlug, search: search);
    return result.fold(
      (_) => _local.getPublishers(countrySlug: countrySlug, search: search),
      (publishers) async {
        if (countrySlug == null && search == null) {
          await _local.savePublishers(publishers);
        }
        return right(publishers);
      },
    );
  }

  @override
  Future<Either<Failure, (Publisher, List<PublisherBook>)>> getPublisherBySlug(
    String slug,
  ) async {
    final result = await _remote.getPublisherBySlug(slug);
    return result.fold(
      (_) => _local.getPublisherBySlug(slug),
      (record) async {
        final (publisher, books) = record;
        await _local.savePublisherDetail(slug, publisher, books);
        return right(record);
      },
    );
  }
}
