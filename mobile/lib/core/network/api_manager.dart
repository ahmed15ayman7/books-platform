import 'package:dartz/dartz.dart';
import 'package:dio/dio.dart';
import 'package:injectable/injectable.dart';

import 'api_result.dart';
import 'failure.dart';

typedef JsonMapper<T> = T Function(Object? json);

@lazySingleton
class ApiManager {
  final Dio _dio;

  ApiManager(this._dio);

  Future<Either<Failure, T>> get<T>({
    required String path,
    Map<String, dynamic>? queryParameters,
    required JsonMapper<T> fromJson,
  }) =>
      _request<T>(
        () => _dio.get<dynamic>(path, queryParameters: queryParameters),
        fromJson,
      );

  Future<Either<Failure, T>> post<T>({
    required String path,
    Object? data,
    Map<String, dynamic>? queryParameters,
    required JsonMapper<T> fromJson,
  }) =>
      _request<T>(
        () => _dio.post<dynamic>(
          path,
          data: data,
          queryParameters: queryParameters,
        ),
        fromJson,
      );

  Future<Either<Failure, T>> put<T>({
    required String path,
    Object? data,
    Map<String, dynamic>? queryParameters,
    required JsonMapper<T> fromJson,
  }) =>
      _request<T>(
        () => _dio.put<dynamic>(
          path,
          data: data,
          queryParameters: queryParameters,
        ),
        fromJson,
      );

  Future<Either<Failure, T>> patch<T>({
    required String path,
    Object? data,
    Map<String, dynamic>? queryParameters,
    required JsonMapper<T> fromJson,
  }) =>
      _request<T>(
        () => _dio.patch<dynamic>(
          path,
          data: data,
          queryParameters: queryParameters,
        ),
        fromJson,
      );

  Future<Either<Failure, T>> delete<T>({
    required String path,
    Object? data,
    Map<String, dynamic>? queryParameters,
    required JsonMapper<T> fromJson,
  }) =>
      _request<T>(
        () => _dio.delete<dynamic>(
          path,
          data: data,
          queryParameters: queryParameters,
        ),
        fromJson,
      );

  Future<Either<Failure, T>> _request<T>(
    Future<Response<dynamic>> Function() call,
    JsonMapper<T> fromJson,
  ) async {
    final result = await _safeCall<T>(call, fromJson);
    return switch (result) {
      ApiSuccess<T>(:final data) => Right(data),
      ApiFailure<T>(:final failure) => Left(failure),
    };
  }

  Future<ApiResult<T>> _safeCall<T>(
    Future<Response<dynamic>> Function() call,
    JsonMapper<T> fromJson,
  ) async {
    try {
      final response = await call();
      final data = fromJson(response.data);
      return ApiSuccess<T>(data);
    } on DioException catch (e) {
      return ApiFailure<T>(_mapDioError(e));
    } catch (e) {
      return ApiFailure<T>(UnexpectedFailure(e.toString()));
    }
  }

  Failure _mapDioError(DioException e) {
    switch (e.type) {
      case DioExceptionType.connectionTimeout:
      case DioExceptionType.sendTimeout:
      case DioExceptionType.receiveTimeout:
      case DioExceptionType.connectionError:
        return const NetworkFailure();
      case DioExceptionType.badResponse:
        final code = e.response?.statusCode;
        if (code == null) {
          return UnexpectedFailure(e.message ?? 'Malformed response');
        }
        if (code == 401) return const UnauthorizedFailure();
        return ServerFailure(code, _extractMessage(e.response));
      case DioExceptionType.cancel:
      case DioExceptionType.badCertificate:
      case DioExceptionType.unknown:
        return UnexpectedFailure(e.message ?? 'Unknown error');
    }
  }

  String _extractMessage(Response<dynamic>? response) {
    final data = response?.data;
    if (data is Map && data['message'] != null) {
      return data['message'].toString();
    }
    return 'Server error';
  }
}
