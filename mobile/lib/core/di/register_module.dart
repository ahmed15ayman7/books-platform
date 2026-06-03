import 'package:dio/dio.dart';
import 'package:flutter/material.dart';
import 'package:flutter_secure_storage/flutter_secure_storage.dart';
import 'package:injectable/injectable.dart';
import 'package:shared_preferences/shared_preferences.dart';

import '../network/dio_factory.dart';

@module
abstract class RegisterModule {
  @lazySingleton
  FlutterSecureStorage get secureStorage => const FlutterSecureStorage();

  @singleton
  GlobalKey<NavigatorState> get navigatorKey => GlobalKey<NavigatorState>();

  @singleton
  Dio dio(DioFactory factory) => factory.create();

  @preResolve
  @singleton
  Future<SharedPreferences> get prefs => SharedPreferences.getInstance();
}
