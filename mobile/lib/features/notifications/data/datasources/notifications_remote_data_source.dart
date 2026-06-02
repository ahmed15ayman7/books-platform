// ⚠️  BLOCKED (T093): Firebase config files not yet provided.
// Requires google-services.json at android/app/ and GoogleService-Info.plist
// at ios/Runner/. App will not compile until these are added.

import 'package:dartz/dartz.dart';
import 'package:injectable/injectable.dart';

import 'package:booksplatform/core/network/failure.dart';

@lazySingleton
class NotificationsRemoteDataSource {
  // TODO: POST /notifications/mobile/subscribe — endpoint not yet implemented (Risk #1)
  Future<Either<Failure, Unit>> registerFcmToken(
      String token, String locale) async {
    return right(unit);
  }
}
