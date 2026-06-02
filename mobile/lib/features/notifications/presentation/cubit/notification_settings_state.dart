import 'package:equatable/equatable.dart';

sealed class NotificationSettingsState extends Equatable {
  const NotificationSettingsState();
  @override
  List<Object?> get props => const [];
}

final class NotificationSettingsInitial extends NotificationSettingsState {
  const NotificationSettingsInitial();
}

final class NotificationSettingsLoaded extends NotificationSettingsState {
  const NotificationSettingsLoaded({required this.pushEnabled, this.fcmToken});
  final bool pushEnabled;
  final String? fcmToken;
  @override
  List<Object?> get props => [pushEnabled, fcmToken];
}

final class NotificationSettingsUpdating extends NotificationSettingsState {
  const NotificationSettingsUpdating();
}

final class NotificationSettingsError extends NotificationSettingsState {
  const NotificationSettingsError(this.message);
  final String message;
  @override
  List<Object?> get props => [message];
}
