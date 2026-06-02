import 'package:flutter_test/flutter_test.dart';

import 'package:booksplatform/core/network/api_envelope.dart';

void main() {
  group('ApiEnvelope', () {
    test('fromJson returns data on success envelope', () {
      final json = {
        'success': true,
        'data': {'name': 'test', 'value': 42},
      };
      final envelope = ApiEnvelope.fromJson(
        json,
        fromData: (d) => d['name'] as String,
      );
      expect(envelope.data, 'test');
    });

    test('fromJson throws FormatException when data is null', () {
      final json = {
        'success': false,
        'error': {'message': 'Not found'},
      };
      expect(
        () => ApiEnvelope.fromJson(json, fromData: (d) => d),
        throwsA(isA<FormatException>()),
      );
    });
  });

  group('PaginatedResponse', () {
    test('fromJson returns correct data list length', () {
      final json = {
        'data': [
          {'id': '1'},
          {'id': '2'},
          {'id': '3'},
        ],
        'pagination': {
          'page': 1,
          'limit': 20,
          'total': 3,
          'totalPages': 1,
          'hasNextPage': false,
        },
      };
      final paginated = PaginatedResponse.fromJson(
        json,
        fromJsonT: (item) => item['id'] as String,
      );
      expect(paginated.data.length, 3);
      expect(paginated.pagination.hasNextPage, false);
    });

    test('fromJson sets hasNextPage correctly', () {
      final json = {
        'data': [{'id': '1'}],
        'pagination': {
          'page': 1,
          'limit': 1,
          'total': 10,
          'totalPages': 10,
          'hasNextPage': true,
        },
      };
      final paginated = PaginatedResponse.fromJson(
        json,
        fromJsonT: (item) => item['id'] as String,
      );
      expect(paginated.pagination.hasNextPage, true);
      expect(paginated.pagination.total, 10);
    });
  });
}
