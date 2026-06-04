import 'package:dartz/dartz.dart';
import 'package:flutter_test/flutter_test.dart';
import 'package:mocktail/mocktail.dart';
import 'package:shared_preferences/shared_preferences.dart';

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

  group('NotificationSettingsCubit', () {
    test('load emits NotificationSettingsLoaded with stored value', () async {
      await cubit.load();
      expect(cubit.state,
          const NotificationSettingsLoaded(pushEnabled: false));
    });

    test('togglePush(false) saves false without calling FCM', () async {
      await cubit.togglePush(false);
      verifyNever(() => mockFcm.requestPermission());
      expect(cubit.state,
          const NotificationSettingsLoaded(pushEnabled: false));
    });

    test(
        'togglePush(true) when permission denied emits loaded(pushEnabled: false)',
        () async {
      when(() => mockFcm.requestPermission()).thenAnswer((_) async => false);

      await cubit.togglePush(true);

      verifyNever(() => mockFcm.getToken());
      expect(cubit.state,
          const NotificationSettingsLoaded(pushEnabled: false));
    });

    test('togglePush(true) when token is null still saves enabled', () async {
      when(() => mockFcm.requestPermission()).thenAnswer((_) async => true);
      when(() => mockFcm.getToken()).thenAnswer((_) async => null);

      await cubit.togglePush(true, locale: 'ar');

      verifyNever(() => mockRepo.registerFcmToken(any(), any()));
      expect(cubit.state,
          const NotificationSettingsLoaded(pushEnabled: true));
    });

    test(
        'togglePush(true) when registerFcmToken fails emits error then loaded',
        () async {
      when(() => mockFcm.requestPermission()).thenAnswer((_) async => true);
      when(() => mockFcm.getToken()).thenAnswer((_) async => 'device-token');
      when(() => mockRepo.registerFcmToken(any(), any()))
          .thenAnswer((_) async => const Left(NetworkFailure()));

      expect(
        cubit.stream,
        emitsInOrder([
          isA<NotificationSettingsUpdating>(),
          isA<NotificationSettingsError>(),
          isA<NotificationSettingsLoaded>(),
        ]),
      );

      await cubit.togglePush(true, locale: 'ar');
    });
  });
}
