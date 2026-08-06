import 'dart:async';

import 'package:flutter/material.dart';
import 'package:flutter_screenutil/flutter_screenutil.dart';
import 'package:shared_preferences/shared_preferences.dart';

import '../../../../core/constants/app_constants.dart';
import '../../../../core/di/injection_container.dart';
import '../../../../core/router/app_routes.dart';
import '../../../../core/theme/app_colors.dart';
import '../../../notifications/presentation/cubit/notification_settings_cubit.dart';

class SplashScreen extends StatefulWidget {
  const SplashScreen({super.key});

  @override
  State<SplashScreen> createState() => _SplashScreenState();
}

class _SplashScreenState extends State<SplashScreen>
    with SingleTickerProviderStateMixin {
  late final AnimationController _controller;
  late final Animation<double> _fadeIn;

  @override
  void initState() {
    super.initState();
    _controller = AnimationController(
      vsync: this,
      duration: kSplashFadeDuration,
    );
    _fadeIn = CurvedAnimation(parent: _controller, curve: Curves.easeOut);
    _controller.forward();
    _navigate();
  }

  Future<void> _navigate() async {
    await Future.delayed(kSplashDuration);
    if (!mounted) return;
    final prefs = await SharedPreferences.getInstance();
    final done = prefs.getBool(kOnboardingDoneKey) ?? false;
    if (!mounted) return;
    Navigator.of(context).pushReplacementNamed(
      done ? AppRoutes.home : AppRoutes.language,
    );
    _requestNotificationPermissionOnce(prefs);
  }

  // Fires once ever, right after the first navigation away from splash, so
  // the OS asks for notification permission at a consistent, intentional
  // moment on both platforms instead of iOS asking early (fcm_service.dart)
  // or Android never asking at all.
  void _requestNotificationPermissionOnce(SharedPreferences prefs) {
    if (prefs.getBool(kNotifPermissionRequestedKey) ?? false) return;
    unawaited(prefs.setBool(kNotifPermissionRequestedKey, true));
    unawaited(getIt<NotificationSettingsCubit>().togglePush(true));
  }

  @override
  void dispose() {
    _controller.dispose();
    super.dispose();
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      backgroundColor: AppColors.secondary,
      body: SafeArea(
        child: FadeTransition(
          opacity: _fadeIn,
          child: Center(
            child: Image.asset(
              kBrandingLogoAsset,
              width: 300.w,
            ),
          ),
        ),
      ),
    );
  }
}
