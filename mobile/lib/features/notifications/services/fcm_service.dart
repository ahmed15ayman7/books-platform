// // ⚠️  BLOCKED (T093): Firebase config files not yet provided.
// // Requires google-services.json at android/app/ and GoogleService-Info.plist
// // at ios/Runner/. App will not compile until these are added.

// import 'package:firebase_messaging/firebase_messaging.dart';
// import 'package:flutter/material.dart';
// import 'package:flutter_local_notifications/flutter_local_notifications.dart';
// import 'package:injectable/injectable.dart';

// import 'package:booksplatform/core/router/app_routes.dart';
// import 'package:booksplatform/core/router/args/book_detail_args.dart';
// import 'package:booksplatform/core/storage/secure_storage_helper.dart';

// @lazySingleton
// class FcmService {
//   FcmService(this._secureStorage, this._navigatorKey);

//   final SecureStorageHelper _secureStorage;
//   final GlobalKey<NavigatorState> _navigatorKey;

//   final _localNotifications = FlutterLocalNotificationsPlugin();

//   Future<void> initialize() async {
//     await _initLocalNotifications();

//     FirebaseMessaging.onMessage.listen(_showLocalNotification);
//     FirebaseMessaging.onMessageOpenedApp.listen(_handleNotificationTap);

//     final initial = await FirebaseMessaging.instance.getInitialMessage();
//     if (initial != null) _handleNotificationTap(initial);
//   }

//   Future<bool> requestPermission() async {
//     final settings = await FirebaseMessaging.instance.requestPermission(
//       alert: true,
//       badge: true,
//       sound: true,
//     );
//     return settings.authorizationStatus == AuthorizationStatus.authorized ||
//         settings.authorizationStatus == AuthorizationStatus.provisional;
//   }

//   /// Fetches, stores, and returns the FCM token. Returns null if unavailable.
//   Future<String?> getToken() async {
//     final token = await FirebaseMessaging.instance.getToken();
//     if (token == null) return null;
//     // Token stored securely — never logged
//     await _secureStorage.saveString('fcm_token', token);
//     return token;
//   }

//   Future<void> _initLocalNotifications() async {
//     const androidInit = AndroidInitializationSettings('@mipmap/ic_launcher');
//     const iosInit = DarwinInitializationSettings();
//     await _localNotifications.initialize(
//       const InitializationSettings(android: androidInit, iOS: iosInit),
//     );
//   }

//   void _showLocalNotification(RemoteMessage msg) {
//     final notification = msg.notification;
//     if (notification == null) return;
//     _localNotifications.show(
//       notification.hashCode,
//       notification.title,
//       notification.body,
//       const NotificationDetails(
//         android: AndroidNotificationDetails(
//           'books_platform_channel',
//           'Books Platform',
//           importance: Importance.high,
//           priority: Priority.high,
//         ),
//         iOS: DarwinNotificationDetails(),
//       ),
//     );
//   }

//   void _handleNotificationTap(RemoteMessage msg) {
//     final type = msg.data['type'] as String?;
//     final slug = msg.data['slug'] as String?;
//     if (type == null || slug == null) return;

//     final nav = _navigatorKey.currentState;
//     if (nav == null) return;

//     switch (type) {
//       case 'book':
//         nav.pushNamed(
//           AppRoutes.bookDetail,
//           arguments: BookDetailArgs(slug: slug, titleAr: ''),
//         );
//       case 'article':
//         nav.pushNamed(AppRoutes.articles);
//       default:
//         nav.pushNamed(AppRoutes.home);
//     }
//   }
// }
