import 'package:flutter/material.dart';

import 'app_routes.dart';

class AppRouter {
  AppRouter._();

  static Route<dynamic> generateRoute(RouteSettings settings) {
    switch (settings.name) {
      case AppRoutes.splash:
      case AppRoutes.login:
      case AppRoutes.register:
      case AppRoutes.home:
      case AppRoutes.unknown:
        return _unknown(settings);
      default:
        return _unknown(settings);
    }
  }

  static Route<dynamic> _unknown(RouteSettings settings) => MaterialPageRoute(
        settings: settings,
        builder: (_) => const _UnknownScreen(),
      );
}

class _UnknownScreen extends StatelessWidget {
  const _UnknownScreen();

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: AppBar(title: const Text('Unknown')),
      body: const Center(
        child: Text('No screen registered for this route yet.'),
      ),
    );
  }
}
