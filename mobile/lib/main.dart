import 'dart:async';

import 'package:easy_localization/easy_localization.dart';
import 'package:firebase_core/firebase_core.dart';
import 'package:flutter/material.dart';
import 'package:flutter_screenutil/flutter_screenutil.dart';
import 'package:intl/date_symbol_data_local.dart';

import 'core/constants/app_constants.dart';
import 'core/di/injection_container.dart';
import 'core/router/app_router.dart';
import 'core/router/app_routes.dart';
import 'core/theme/app_theme.dart';
import 'features/cart/presentation/cubit/cart_cubit.dart';
import 'features/notifications/services/fcm_service.dart';
import 'firebase_options.dart';

Future<void> main() async {
  WidgetsFlutterBinding.ensureInitialized();

  await EasyLocalization.ensureInitialized();
  await initializeDateFormatting('en');
  await initializeDateFormatting('ar');
  await Firebase.initializeApp(options: DefaultFirebaseOptions.currentPlatform);
  await configureDependencies();
  // Eagerly resolve CartCubit so getIt<CartCubit>() is safe to call synchronously
  // from _CartButton.build() before the first frame renders.
  getIt<CartCubit>();

  runApp(
    EasyLocalization(
      supportedLocales: const [Locale('en'), Locale('ar')],
      path: 'assets/translations',
      fallbackLocale: const Locale('en'),
      child: const MyApp(),
    ),
  );

  // Intentionally fire-and-forget after runApp(). On iOS, getInitialMessage()
  // blocks until APNs token registration completes — awaiting it before runApp()
  // causes a black screen. The navigator is mounted by the time getInitialMessage()
  // resolves, so cold-start deep links still work correctly.
  unawaited(getIt<FcmService>().initialize());
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
