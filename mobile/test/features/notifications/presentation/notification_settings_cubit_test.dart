import 'dart:async';

import 'package:dartz/dartz.dart';
import 'package:flutter_test/flutter_test.dart';
import 'package:mocktail/mocktail.dart';
import 'package:shared_preferences/shared_preferences.dart';

import 'package:booksplatform/core/constants/app_constants.dart';
import 'package:booksplatform/core/network/failure.dart';
import 'package:booksplatform/features/notifications/domain/repositories/notifications_repository.dart';
import 'package:booksplatform/features/notifications/presentation/cubit/notification_settings_cubit.dart';
import 'package:booksplatform/features/notifications/presentation/cubit/notification_settings_state.dart';
import 'package:booksplatform/features/notifications/services/fcm_service.dart';

class MockFcmService extends Mock implements FcmService {}

class MockNotificationsRepository extends Mock
    implements NotificationsRepository {}

void main() {
  late MockFcmService mockFcm;
  late MockNotificationsRepository mockRepo;
  late SharedPreferences prefs;
  late NotificationSettingsCubit cubit;

  setUp(() async {
    SharedPreferences.setMockInitialValues({});
    prefs = await SharedPreferences.getInstance();
    mockFcm = MockFcmService();
    mockRepo = MockNotificationsRepository();
    cubit = NotificationSettingsCubit(prefs, mockFcm, mockRepo);
  });

  tearDown(() => cubit.close());

  group('NotificationSettingsCubit.togglePush', () {
    test(
      'persists opt-in as soon as permission is granted, before token '
      'registration resolves — regression test for the toggle reading stale '
      '(off) state when a second cubit instance (e.g. Notification Settings '
      'screen) loads while registration is still in flight',
      () async {
        when(() => mockFcm.requestPermission()).thenAnswer((_) async => true);
        when(() => mockFcm.getToken()).thenAnswer((_) async => 'fcm-token');

        // registerFcmToken never resolves during this test — simulates a
        // slow/in-flight network call.
        when(() => mockRepo.registerFcmToken(any(), any()))
            .thenAnswer((_) => Completer<Either<Failure, Unit>>().future);

        expect(
          cubit.stream,
          emitsInOrder([
            isA<NotificationSettingsUpdating>(),
            predicate<NotificationSettingsState>(
              (s) => s is NotificationSettingsLoaded && s.pushEnabled,
            ),
          ]),
        );

        // Don't await — mirrors splash's fire-and-forget call.
        unawaited(cubit.togglePush(true));

        // Let requestPermission()/getToken() microtasks resolve, but
        // registerFcmToken() is still pending (Completer never completes).
        await Future<void>.delayed(Duration.zero);

        // A second, independent instance — exactly what AppRouter creates
        // when the user navigates to Notification Settings — must already
        // see the persisted opt-in, not the stale default.
        expect(prefs.getBool(kNotifOptInKey), isTrue);
      },
    );

    test('denies permission → persists false and emits Loaded(false)',
        () async {
      when(() => mockFcm.requestPermission()).thenAnswer((_) async => false);

      expect(
        cubit.stream,
        emitsInOrder([
          isA<NotificationSettingsUpdating>(),
          predicate<NotificationSettingsState>(
            (s) => s is NotificationSettingsLoaded && !s.pushEnabled,
          ),
        ]),
      );

      await cubit.togglePush(true);
      expect(prefs.getBool(kNotifOptInKey), isFalse);
      verifyNever(() => mockRepo.registerFcmToken(any(), any()));
    });

    test('toggling off persists false without requesting permission',
        () async {
      expect(
        cubit.stream,
        emitsInOrder([
          isA<NotificationSettingsUpdating>(),
          predicate<NotificationSettingsState>(
            (s) => s is NotificationSettingsLoaded && !s.pushEnabled,
          ),
        ]),
      );

      await cubit.togglePush(false);
      expect(prefs.getBool(kNotifOptInKey), isFalse);
      verifyNever(() => mockFcm.requestPermission());
    });
  });
}
