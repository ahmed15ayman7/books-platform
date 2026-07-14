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
    emit(const NotificationSettingsUpdating());
    if (!enabled) {
      await _prefs.setBool(kNotifOptInKey, false);
      emit(const NotificationSettingsLoaded(pushEnabled: false));
      return;
    }

    final granted = await _fcmService.requestPermission();
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

    final token = await _fcmService.getToken();
    if (token != null) {
      final result = await _repository.registerFcmToken(token, locale);
      result.fold(
        (failure) =>
            emit(NotificationSettingsError(core.failureToMessage(failure))),
        (_) {},
      );
    }
  }
}
