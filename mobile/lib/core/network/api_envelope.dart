import 'package:equatable/equatable.dart';

class PaginationMeta extends Equatable {
  const PaginationMeta({
    required this.page,
    required this.limit,
    required this.total,
    required this.totalPages,
    required this.hasNextPage,
  });

  final int page;
  final int limit;
  final int total;
  final int totalPages;
  final bool hasNextPage;

  factory PaginationMeta.fromJson(Map<String, dynamic> json) => PaginationMeta(
        page: (json['page'] as num?)?.toInt() ?? 1,
        limit: (json['limit'] as num?)?.toInt() ?? 20,
        total: (json['total'] as num?)?.toInt() ?? 0,
        totalPages: (json['totalPages'] as num?)?.toInt() ?? 0,
        hasNextPage: json['hasNextPage'] as bool? ?? false,
      );

  @override
  List<Object?> get props => [page, limit, total, totalPages, hasNextPage];
}

class PaginatedResponse<T> extends Equatable {
  const PaginatedResponse({required this.data, required this.pagination});

  final List<T> data;
  final PaginationMeta pagination;

  factory PaginatedResponse.fromJson(
    Object? json, {
    required T Function(Map<String, dynamic>) fromJsonT,
  }) {
    final map = json as Map<String, dynamic>;
    final items = (map['data'] as List<dynamic>)
        .map((e) => fromJsonT(e as Map<String, dynamic>))
        .toList();
    final paginationJson = map['pagination'] as Map<String, dynamic>? ?? {};
    return PaginatedResponse(
      data: items,
      pagination: PaginationMeta.fromJson(paginationJson),
    );
  }

  @override
  List<Object?> get props => [data, pagination];
}

class ApiError extends Equatable {
  const ApiError({this.code, required this.message});

  final String? code;
  final String message;

  @override
  List<Object?> get props => [code, message];
}

class ApiEnvelope<T> extends Equatable {
  const ApiEnvelope({required this.data, this.error});

  final T? data;
  final ApiError? error;

  factory ApiEnvelope.fromJson(
    Object? json, {
    required T Function(Map<String, dynamic>) fromData,
  }) {
    final map = json as Map<String, dynamic>;
    final dataJson = map['data'];
    if (dataJson == null) {
      final errMap = map['error'] as Map<String, dynamic>?;
      throw FormatException(
        errMap?['message'] as String? ?? 'Response data is null',
      );
    }
    return ApiEnvelope(data: fromData(dataJson as Map<String, dynamic>));
  }

  @override
  List<Object?> get props => [data, error];
}
