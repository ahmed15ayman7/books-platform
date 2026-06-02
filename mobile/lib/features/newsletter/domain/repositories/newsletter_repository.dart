import 'package:dartz/dartz.dart';

import '../../../../core/network/failure.dart';
import '../entities/newsletter_result.dart';

abstract class NewsletterRepository {
  Future<Either<Failure, NewsletterResult>> subscribe(
    String email, {
    required String locale,
    String source,
  });
}
