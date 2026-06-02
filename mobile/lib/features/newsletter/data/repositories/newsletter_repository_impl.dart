import 'package:dartz/dartz.dart';
import 'package:injectable/injectable.dart';

import '../../../../core/network/failure.dart';
import '../../domain/entities/newsletter_result.dart';
import '../../domain/repositories/newsletter_repository.dart';
import '../datasources/newsletter_remote_data_source.dart';

@LazySingleton(as: NewsletterRepository)
class NewsletterRepositoryImpl implements NewsletterRepository {
  NewsletterRepositoryImpl(this._remote);

  final NewsletterRemoteDataSource _remote;

  @override
  Future<Either<Failure, NewsletterResult>> subscribe(
    String email, {
    required String locale,
    String source = 'mobile',
  }) =>
      _remote.subscribe(email, locale: locale, source: source);
}
