import 'package:dartz/dartz.dart';
import 'package:injectable/injectable.dart';

import '../../../../core/network/api_envelope.dart';
import '../../../../core/network/api_manager.dart';
import '../../../../core/network/failure.dart';
import '../../domain/entities/newsletter_result.dart';

@lazySingleton
class NewsletterRemoteDataSource {
  NewsletterRemoteDataSource(this._api);

  final ApiManager _api;

  Future<Either<Failure, NewsletterResult>> subscribe(
    String email, {
    required String locale,
    String source = 'mobile',
  }) =>
      _api.post(
        path: '/newsletter/subscribe',
        data: {'email': email, 'locale': locale, 'source': source},
        fromJson: (json) {
          final data = ApiEnvelope.fromJson(
            json,
            fromData: (d) => d,
          ).data!;
          return NewsletterResult(
            message: data['message'] as String? ?? 'Subscribed successfully',
            alreadySubscribed: data['alreadySubscribed'] as bool? ?? false,
          );
        },
      );
}
