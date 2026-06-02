import 'package:dartz/dartz.dart';
import 'package:flutter_test/flutter_test.dart';
import 'package:mocktail/mocktail.dart';

import 'package:booksplatform/core/network/api_manager.dart';
import 'package:booksplatform/features/newsletter/data/datasources/newsletter_remote_data_source.dart';
import 'package:booksplatform/features/newsletter/domain/entities/newsletter_result.dart';

class MockApiManager extends Mock implements ApiManager {}

void main() {
  late MockApiManager mockApiManager;
  late NewsletterRemoteDataSource dataSource;

  setUp(() {
    mockApiManager = MockApiManager();
    dataSource = NewsletterRemoteDataSource(mockApiManager);
  });

  group('NewsletterRemoteDataSource', () {
    test('subscribe success returns Right(NewsletterResult(message, false))',
        () async {
      final responseJson = {
        'data': {
          'message': 'Check your inbox to confirm',
          'alreadySubscribed': false,
        }
      };
      when(() => mockApiManager.post<NewsletterResult>(
            path: any(named: 'path'),
            data: any(named: 'data'),
            fromJson: any(named: 'fromJson'),
          )).thenAnswer((inv) async {
        final fromJson = inv.namedArguments[#fromJson] as Function;
        return Right(fromJson(responseJson) as NewsletterResult);
      });

      final result =
          await dataSource.subscribe('test@example.com', locale: 'ar');
      expect(result.isRight(), true);
      result.fold((_) {}, (r) {
        expect(r.message, 'Check your inbox to confirm');
        expect(r.alreadySubscribed, false);
      });
    });

    test(
        'subscribe with alreadySubscribed:true returns Right(NewsletterResult(message, true))',
        () async {
      final responseJson = {
        'data': {
          'message': 'You are already subscribed',
          'alreadySubscribed': true,
        }
      };
      when(() => mockApiManager.post<NewsletterResult>(
            path: any(named: 'path'),
            data: any(named: 'data'),
            fromJson: any(named: 'fromJson'),
          )).thenAnswer((inv) async {
        final fromJson = inv.namedArguments[#fromJson] as Function;
        return Right(fromJson(responseJson) as NewsletterResult);
      });

      final result =
          await dataSource.subscribe('test@example.com', locale: 'en');
      result.fold((_) {}, (r) {
        expect(r.alreadySubscribed, true);
      });
    });

    test("POST body always includes source:'mobile'", () async {
      final responseJson = {
        'data': {
          'message': 'Subscribed',
          'alreadySubscribed': false,
        }
      };
      Map<String, dynamic>? capturedData;
      when(() => mockApiManager.post<NewsletterResult>(
            path: any(named: 'path'),
            data: any(named: 'data'),
            fromJson: any(named: 'fromJson'),
          )).thenAnswer((inv) async {
        capturedData = inv.namedArguments[#data] as Map<String, dynamic>?;
        final fromJson = inv.namedArguments[#fromJson] as Function;
        return Right(fromJson(responseJson) as NewsletterResult);
      });

      await dataSource.subscribe('user@test.com', locale: 'ar');
      expect(capturedData?['source'], 'mobile');
    });
  });
}
