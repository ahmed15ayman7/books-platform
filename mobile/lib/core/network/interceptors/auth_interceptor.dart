import 'package:dio/dio.dart';
import 'package:flutter/material.dart';

import '../../router/app_routes.dart';
import '../../storage/secure_storage_helper.dart';

class AuthInterceptor extends Interceptor {
  final SecureStorageHelper _storage;
  final GlobalKey<NavigatorState> _navigatorKey;

  AuthInterceptor(this._storage, this._navigatorKey);

  @override
  Future<void> onRequest(
    RequestOptions options,
    RequestInterceptorHandler handler,
  ) async {
    final token = await _storage.getToken();
    if (token != null && token.isNotEmpty) {
      options.headers['Authorization'] = 'Bearer $token';
    }
    handler.next(options);
  }

  @override
  Future<void> onError(
    DioException err,
    ErrorInterceptorHandler handler,
  ) async {
    if (err.response?.statusCode == 401) {
      await _storage.deleteToken();
      _navigatorKey.currentState?.pushNamedAndRemoveUntil(
        AppRoutes.login,
        (_) => false,
      );
    }
    handler.next(err);
  }
}
