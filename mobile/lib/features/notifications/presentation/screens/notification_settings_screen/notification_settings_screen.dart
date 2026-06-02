// ⚠️  BLOCKED (T093): Firebase config files not yet provided.
// Requires google-services.json at android/app/ and GoogleService-Info.plist
// at ios/Runner/. App will not compile until these are added.

import 'package:easy_localization/easy_localization.dart';
import 'package:firebase_messaging/firebase_messaging.dart';
import 'package:flutter/material.dart';
import 'package:flutter_bloc/flutter_bloc.dart';
import 'package:url_launcher/url_launcher.dart';

import 'package:booksplatform/core/theme/app_colors.dart';
import 'package:booksplatform/core/widgets/app_bar_widget.dart';
import 'package:booksplatform/core/widgets/app_loading_indicator.dart';

import '../../cubit/notification_settings_cubit.dart';
import '../../cubit/notification_settings_state.dart';

class NotificationSettingsScreen extends StatefulWidget {
  const NotificationSettingsScreen({super.key});

  @override
  State<NotificationSettingsScreen> createState() =>
      _NotificationSettingsScreenState();
}

class _NotificationSettingsScreenState
    extends State<NotificationSettingsScreen> {
  bool _permissionDenied = false;

  @override
  void initState() {
    super.initState();
    context.read<NotificationSettingsCubit>().load();
    _checkPermission();
  }

  Future<void> _checkPermission() async {
    final settings =
        await FirebaseMessaging.instance.getNotificationSettings();
    if (mounted) {
      setState(() {
        _permissionDenied =
            settings.authorizationStatus == AuthorizationStatus.denied;
      });
    }
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      backgroundColor: AppColors.background,
      body: Column(
        children: [
          AppBarWidget(
            variant: AppBarVariant.title,
            title: 'notifications_title'.tr(),
            showBack: true,
          ),
          Expanded(
            child: BlocBuilder<NotificationSettingsCubit,
                NotificationSettingsState>(
              builder: (context, state) {
                if (state is NotificationSettingsLoaded) {
                  return SafeArea(
                    top: false,
                    child: Column(
                      children: [
                        SwitchListTile(
                          title: Text('notifications_push_label'.tr()),
                          value: state.pushEnabled,
                          onChanged: (v) => context
                              .read<NotificationSettingsCubit>()
                              .togglePush(v),
                          activeTrackColor: AppColors.primary,
                        ),
                        if (_permissionDenied)
                          TextButton(
                            onPressed: () =>
                                launchUrl(Uri.parse('app-settings:')),
                            child: Text(
                                'notifications_open_settings'.tr()),
                          ),
                      ],
                    ),
                  );
                }
                return const Center(child: AppLoadingIndicator());
              },
            ),
          ),
        ],
      ),
    );
  }
}
