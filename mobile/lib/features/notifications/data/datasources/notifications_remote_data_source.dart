import 'dart:io';

import 'package:dartz/dartz.dart';
import 'package:injectable/injectable.dart';

import 'package:booksplatform/core/network/api_manager.dart';
import 'package:booksplatform/core/network/failure.dart';

@lazySingleton
class NotificationsRemoteDataSource {
  NotificationsRemoteDataSource(this._api);

  final ApiManager _api;

  Future<Either<Failure, Unit>> registerFcmToken(
    String token,
    String locale,
  ) =>
      _api.post<Unit>(
        path: '/notifications/mobile/subscribe',
        data: {
          'token': token,
          'platform': Platform.isIOS ? 'ios' : 'android',
          'locale': locale,
          'topics': ['new-books'],
        },
        fromJson: (_) => unit,
      );

  Future<Either<Failure, Unit>> unregisterFcmToken(String token) =>
      _api.delete<Unit>(
        path: '/notifications/mobile/subscribe',
        data: {'token': token},
        fromJson: (_) => unit,
      );
}
