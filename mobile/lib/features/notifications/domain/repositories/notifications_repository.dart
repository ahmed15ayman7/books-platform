import 'package:dartz/dartz.dart';

import 'package:booksplatform/core/network/failure.dart';

abstract class NotificationsRepository {
  Future<Either<Failure, Unit>> registerFcmToken(String token, String locale);
  Future<Either<Failure, Unit>> unregisterFcmToken(String token);
}
