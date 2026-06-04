import 'package:dartz/dartz.dart';
import 'package:flutter_test/flutter_test.dart';
import 'package:mocktail/mocktail.dart';

import 'package:booksplatform/core/network/failure.dart';
import 'package:booksplatform/features/newsletter/domain/entities/newsletter_result.dart';
import 'package:booksplatform/features/newsletter/domain/repositories/newsletter_repository.dart';
import 'package:booksplatform/features/newsletter/presentation/cubit/newsletter_cubit.dart';
import 'package:booksplatform/features/newsletter/presentation/cubit/newsletter_state.dart';

class MockNewsletterRepository extends Mock implements NewsletterRepository {}

void main() {
  late MockNewsletterRepository mockRepo;
  late NewsletterCubit cubit;

  setUp(() {
    mockRepo = MockNewsletterRepository();
    cubit = NewsletterCubit(mockRepo);
  });

  tearDown(() => cubit.close());

  group('NewsletterCubit', () {
    test('subscribe emits loading then success on repository success', () async {
      when(() => mockRepo.subscribe(
            any(),
            locale: any(named: 'locale'),
          )).thenAnswer(
        (_) async => const Right(
          NewsletterResult(
              message: 'Subscribed successfully', alreadySubscribed: false),
        ),
      );

      expect(
        cubit.stream,
        emitsInOrder([
          isA<NewsletterLoading>(),
          predicate<NewsletterState>(
            (s) =>
                s is NewsletterSuccess &&
                s.message == 'Subscribed successfully' &&
                !s.alreadySubscribed,
          ),
        ]),
      );

      await cubit.subscribe('test@example.com', 'ar');
    });

    test('subscribe emits loading then error on NetworkFailure', () async {
      when(() => mockRepo.subscribe(
            any(),
            locale: any(named: 'locale'),
          )).thenAnswer((_) async => const Left(NetworkFailure()));

      expect(
        cubit.stream,
        emitsInOrder([
          isA<NewsletterLoading>(),
          isA<NewsletterError>(),
        ]),
      );

      await cubit.subscribe('test@example.com', 'ar');
    });

    test('subscribe with alreadySubscribed true emits success with flag set',
        () async {
      when(() => mockRepo.subscribe(
            any(),
            locale: any(named: 'locale'),
          )).thenAnswer(
        (_) async => const Right(
          NewsletterResult(
              message: 'Already subscribed', alreadySubscribed: true),
        ),
      );

      expect(
        cubit.stream,
        emitsInOrder([
          isA<NewsletterLoading>(),
          predicate<NewsletterState>(
            (s) => s is NewsletterSuccess && s.alreadySubscribed,
          ),
        ]),
      );

      await cubit.subscribe('test@example.com', 'en');
    });
  });
}
