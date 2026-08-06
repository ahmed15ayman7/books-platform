import 'package:flutter/foundation.dart';
import 'package:flutter_bloc/flutter_bloc.dart';
import 'package:injectable/injectable.dart';
import 'package:shared_preferences/shared_preferences.dart';

import 'package:booksplatform/core/constants/app_constants.dart';
import 'package:booksplatform/core/network/failure_messages.dart' as core;

import '../../domain/repositories/notifications_repository.dart';
import '../../services/fcm_service.dart';
import 'notification_settings_state.dart';

@injectable
class NotificationSettingsCubit extends Cubit<NotificationSettingsState> {
  NotificationSettingsCubit(
    this._prefs,
    this._fcmService,
    this._repository,
  ) : super(const NotificationSettingsInitial());

  final SharedPreferences _prefs;
  final FcmService _fcmService;
  final NotificationsRepository _repository;

  Future<void> load() async {
    final enabled = _prefs.getBool(kNotifOptInKey) ?? false;
    emit(NotificationSettingsLoaded(pushEnabled: enabled));
  }

  Future<void> togglePush(bool enabled, {String locale = 'ar'}) async {
    debugPrint('>>> [FCM DEBUG] togglePush called with enabled=$enabled');
    emit(const NotificationSettingsUpdating());
    if (!enabled) {
      await _prefs.setBool(kNotifOptInKey, false);
      emit(const NotificationSettingsLoaded(pushEnabled: false));
      return;
    }

    final granted = await _fcmService.requestPermission();
    debugPrint('>>> [FCM DEBUG] requestPermission granted=$granted');
    if (!granted) {
      await _prefs.setBool(kNotifOptInKey, false);
      emit(const NotificationSettingsLoaded(pushEnabled: false));
      return;
    }

    // Persist opt-in as soon as OS permission is confirmed, decoupled from
    // token registration latency — the toggle reflects user consent, not
    // whether the backend call has finished yet.
    await _prefs.setBool(kNotifOptInKey, true);
    emit(const NotificationSettingsLoaded(pushEnabled: true));

    debugPrint('>>> [FCM DEBUG] calling getToken()...');
    final token = await _fcmService.getToken();
    debugPrint('>>> [FCM DEBUG] getToken() returned: ${token == null ? 'null' : '${token.substring(0, 12)}...'}');
    if (token != null) {
      final result = await _repository.registerFcmToken(token, locale);
      result.fold(
        (failure) {
          debugPrint('>>> [FCM DEBUG] registerFcmToken FAILED: ${core.failureToMessage(failure)}');
          emit(NotificationSettingsError(core.failureToMessage(failure)));
        },
        (_) => debugPrint('>>> [FCM DEBUG] registerFcmToken SUCCESS'),
      );
    } else {
      debugPrint('>>> [FCM DEBUG] token was null — registerFcmToken NOT called');
    }
  }
}
