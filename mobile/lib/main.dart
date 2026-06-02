import 'package:easy_localization/easy_localization.dart';
import 'package:flutter/material.dart';
import 'package:flutter_screenutil/flutter_screenutil.dart';
import 'package:intl/date_symbol_data_local.dart';
import 'package:shared_preferences/shared_preferences.dart';

import 'core/constants/app_constants.dart';
import 'core/di/injection_container.dart';
import 'core/router/app_router.dart';
import 'core/router/app_routes.dart';
import 'core/theme/app_theme.dart';
import 'features/cart/presentation/cubit/cart_cubit.dart';

Future<void> main() async {
  WidgetsFlutterBinding.ensureInitialized();

  // ⚠️  BLOCKED (T093): Firebase config files not yet provided.
  // Requires google-services.json at android/app/ and GoogleService-Info.plist
  // at ios/Runner/. App will not compile with Firebase until these are added.
  // Uncomment after providing Firebase config files:
  //
  // try {
  //   await Firebase.initializeApp(
  //     options: DefaultFirebaseOptions.currentPlatform,
  //   );
  // } catch (_) {
  //   // Degrade gracefully — Firebase features unavailable until T093 resolved.
  // }

  await EasyLocalization.ensureInitialized();
  await initializeDateFormatting('en');
  await initializeDateFormatting('ar');
  await configureDependencies();
  // Eagerly resolve CartCubit so getIt<CartCubit>() is safe to call synchronously
  // from _CartButton.build() before the first frame renders.
  await getIt.getAsync<CartCubit>();

  // Uncomment after T093 is resolved:
  // getIt<FcmService>().initialize();

  runApp(
    EasyLocalization(
      supportedLocales: const [Locale('en'), Locale('ar')],
      path: 'assets/translations',
      fallbackLocale: const Locale('en'),
      child: const MyApp(),
    ),
  );

  // First-launch soft notification pre-prompt (runs after runApp so context exists)
  _scheduleNotificationPrePrompt();
}

Future<void> _scheduleNotificationPrePrompt() async {
  final prefs = await SharedPreferences.getInstance();
  if (prefs.getBool(kNotifOptInKey) != null) return;
  // Delay to ensure the home screen is visible before showing the sheet
  await Future<void>.delayed(const Duration(seconds: 2));
  final nav = getIt<GlobalKey<NavigatorState>>().currentState;
  if (nav == null) return;
  // Show a simple allow/not-now dialog (non-blocking, only once)
  nav.push(
    PageRouteBuilder<void>(
      opaque: false,
      barrierDismissible: true,
      barrierColor: Colors.black45,
      pageBuilder: (ctx, a1, a2) => const _NotifPrePromptDialog(),
    ),
  );
}

class MyApp extends StatelessWidget {
  const MyApp({super.key});

  @override
  Widget build(BuildContext context) {
    return ScreenUtilInit(
      designSize: const Size(kDesignWidth, kDesignHeight),
      minTextAdapt: true,
      builder: (ctx, child) => MaterialApp(
        title: kAppName,
        debugShowCheckedModeBanner: false,
        navigatorKey: getIt<GlobalKey<NavigatorState>>(),
        theme: AppTheme.lightTheme,
        localizationsDelegates: context.localizationDelegates,
        supportedLocales: context.supportedLocales,
        locale: context.locale,
        onGenerateRoute: AppRouter.generateRoute,
        initialRoute: AppRoutes.splash,
      ),
    );
  }
}

/// Soft notification pre-prompt shown exactly once on first launch.
/// Only the "Allow" tap triggers the OS permission dialog.
class _NotifPrePromptDialog extends StatelessWidget {
  const _NotifPrePromptDialog();

  @override
  Widget build(BuildContext context) {
    return Center(
      child: Material(
        borderRadius: BorderRadius.circular(16),
        child: Padding(
          padding: const EdgeInsets.all(24),
          child: Column(
            mainAxisSize: MainAxisSize.min,
            children: [
              const Icon(Icons.notifications_outlined, size: 48),
              const SizedBox(height: 12),
              Text(
                'notifications_prompt_title'.tr(),
                style: Theme.of(context).textTheme.titleMedium,
                textAlign: TextAlign.center,
              ),
              const SizedBox(height: 8),
              Text(
                'notifications_prompt_body'.tr(),
                style: Theme.of(context).textTheme.bodyMedium,
                textAlign: TextAlign.center,
              ),
              const SizedBox(height: 20),
              Row(
                children: [
                  Expanded(
                    child: OutlinedButton(
                      onPressed: () async {
                        final prefs = await SharedPreferences.getInstance();
                        await prefs.setBool(kNotifOptInKey, false);
                        if (context.mounted) Navigator.of(context).pop();
                      },
                      child: Text('notifications_not_now'.tr()),
                    ),
                  ),
                  const SizedBox(width: 12),
                  Expanded(
                    child: ElevatedButton(
                      onPressed: () async {
                        Navigator.of(context).pop();
                        // Uncomment after T093 is resolved:
                        // await getIt<FcmService>().requestPermission();
                        final prefs = await SharedPreferences.getInstance();
                        await prefs.setBool(kNotifOptInKey, true);
                      },
                      child: Text('notifications_allow'.tr()),
                    ),
                  ),
                ],
              ),
            ],
          ),
        ),
      ),
    );
  }
}
