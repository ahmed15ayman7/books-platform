import Flutter
import UIKit

@main
@objc class AppDelegate: FlutterAppDelegate, FlutterImplicitEngineDelegate {
  override func application(
    _ application: UIApplication,
    didFinishLaunchingWithOptions launchOptions: [UIApplication.LaunchOptionsKey: Any]?
  ) -> Bool {
    return super.application(application, didFinishLaunchingWithOptions: launchOptions)
  }

  func didInitializeImplicitFlutterEngine(_ engineBridge: FlutterImplicitEngineBridge) {
    GeneratedPluginRegistrant.register(with: engineBridge.pluginRegistry)
  }

  // [FCM DEBUG][Native] Traces the APNs handshake itself. The Dart-side
  // FirebaseMessaging.getToken() flow has no visibility into whether this
  // ever fires — if neither callback below prints, remote notification
  // registration never completed at the OS level (entitlement/provisioning
  // mismatch, no Apple ID signed in on device, or no network route to APNs).
  override func application(
    _ application: UIApplication,
    didRegisterForRemoteNotificationsWithDeviceToken deviceToken: Data
  ) {
    print(">>> [FCM DEBUG][Native] didRegisterForRemoteNotificationsWithDeviceToken — \(deviceToken.count) bytes")
    super.application(application, didRegisterForRemoteNotificationsWithDeviceToken: deviceToken)
  }

  override func application(
    _ application: UIApplication,
    didFailToRegisterForRemoteNotificationsWithError error: Error
  ) {
    print(">>> [FCM DEBUG][Native] didFailToRegisterForRemoteNotificationsWithError: \(error.localizedDescription)")
    super.application(application, didFailToRegisterForRemoteNotificationsWithError: error)
  }
}
