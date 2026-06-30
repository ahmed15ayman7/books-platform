import 'package:dartz/dartz.dart';
import 'package:injectable/injectable.dart';

import 'package:booksplatform/core/network/failure.dart';

import '../../domain/repositories/notifications_repository.dart';
import '../datasources/notifications_remote_data_source.dart';

@LazySingleton(as: NotificationsRepository)
class NotificationsRepositoryImpl implements NotificationsRepository {
  NotificationsRepositoryImpl(this._dataSource);

  final NotificationsRemoteDataSource _dataSource;

  @override
  Future<Either<Failure, Unit>> registerFcmToken(
          String token, String locale) =>
      _dataSource.registerFcmToken(token, locale);

  @override
  Future<Either<Failure, Unit>> unregisterFcmToken(String token) =>
      _dataSource.unregisterFcmToken(token);
}
