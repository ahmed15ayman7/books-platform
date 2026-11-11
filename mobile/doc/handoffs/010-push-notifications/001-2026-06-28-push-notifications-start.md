# Session Handoff — 2026-06-28

> **OUT OF PREVIOUS SESSION — NEW SESSION START**
>
> Read this file first. It contains everything from the prior session.

## What Was Done (this session)

- Submitted App Store build 2.0.0 (11) with TTS feature via Transporter.
- Replied to Apple in App Store Connect citing the TTS feature (see rejected build 9 → build 11).
- Updated the submission to use build 11 in App Store Connect.
- Explored the full backend and mobile codebases to map out everything needed for Push Notifications.
- Wrote this handoff for the new session to implement push from A to Z.

---

## Full Codebase Exploration Findings

### Backend (`/Users/youssefemadeldin.ai/SOURCE-CODE/books-platform/web/`)

**Tech stack:** Next.js 16, Prisma ORM, PostgreSQL.

**What already exists for notifications:**

| File | What it does |
|---|---|
| `app/api/v1/notifications/push/subscribe/route.ts` | Stores a **Web Push (VAPID/browser)** subscription — `endpoint`, `p256dh`, `auth`. **This is NOT FCM.** |
| `app/api/v1/notifications/channels/subscribe/route.ts` | Stores WhatsApp/Telegram channel identifiers. |
| `app/api/v1/admin/notifications/broadcast/route.ts` | Admin broadcast — supports push/telegram/whatsapp/email channels. The push branch logs records but **does not actually send FCM** — it just creates `NotificationLog` rows. |
| `app/api/v1/admin/settings/notifications/route.ts` | GET/PATCH notification settings (enabled flags per channel). |

**What does NOT exist (gaps to fill):**

- No `firebase-admin` npm package installed.
- No `lib/firebase-admin.ts` singleton.
- No `DeviceToken` Prisma model for FCM tokens.
- No `POST /api/v1/notifications/mobile/register` endpoint.
- No `POST /api/v1/notifications/mobile/unregister` endpoint.
- No FCM send helper (`lib/fcm-service.ts`).
- No Firebase env vars in `.env.example`.

**Existing Prisma models (relevant):**

```
PushSubscription  — Web Push (browser VAPID). Keep as-is. Separate from FCM.
NotificationLog   — logs sent notifications. Reuse for FCM logs.
NotificationChannel — WhatsApp/Telegram identifiers. Not relevant for FCM.
User              — admin/ambassador/author only. Mobile users are ANONYMOUS.
```

**Critical architectural note:** The mobile app has NO user login. Device tokens cannot reference a `userId`. The `DeviceToken` model must be standalone (anonymous), similar to `PushSubscription`.

**Package already installed:** `web-push` (^3.6.7) — for browser VAPID only. Leave it.
**Package to add:** `firebase-admin` — for FCM mobile push.

---

### Mobile (`/Users/youssefemadeldin.ai/SOURCE-CODE/books-platform/mobile/`)

**What already exists (all commented out, blocked on Firebase config files):**

| File | State | Notes |
|---|---|---|
| `lib/features/notifications/services/fcm_service.dart` | Fully written, 100% commented out | `@lazySingleton`, constructor-injected `SecureStorageHelper` + `GlobalKey<NavigatorState>`. Handles init, permission, token get/store, foreground messages, background, tap. |
| `lib/features/notifications/presentation/cubit/notification_settings_cubit.dart` | Fully written, 100% commented out | Handles `load()` + `togglePush()`. Calls `FcmService` + `NotificationsRepository`. |
| `lib/features/notifications/presentation/screens/notification_settings_screen/notification_settings_screen.dart` | Fully written, 100% commented out | `StatefulWidget` — SwitchListTile + permission-denied TextButton. |
| `lib/features/notifications/presentation/cubit/notification_settings_state.dart` | **ACTIVE** (not commented) | Sealed states: Initial, Loaded, Updating, Error. |
| `lib/features/notifications/domain/repositories/notifications_repository.dart` | **ACTIVE** | Abstract contract: `registerFcmToken(String token, String locale)`. |
| `lib/features/notifications/data/repositories/notifications_repository_impl.dart` | **ACTIVE** (commented header only) | `@LazySingleton(as: NotificationsRepository)`. Delegates to data source. |
| `lib/features/notifications/data/datasources/notifications_remote_data_source.dart` | **ACTIVE but stubbed** | `registerFcmToken()` returns `right(unit)` — endpoint not implemented yet. |

**Packages in `pubspec.yaml` (commented out):**
```yaml
# firebase_core: ^3.11.0
# firebase_messaging: ^15.2.4
# flutter_local_notifications: ^18.0.1
```

**What's missing in mobile:**
- Firebase config files: `android/app/google-services.json` and `ios/Runner/GoogleService-Info.plist`.
- `kNotifOptInKey` constant is referenced in `NotificationSettingsCubit` but **not defined** in `AppConstants`.
- Notification settings route is **not registered** in `AppRouter` or `AppRoutes`.
- `Firebase.initializeApp()` is **not called** in `main.dart`.
- `FcmService.initialize()` is **not called** from `main.dart`.
- Translation keys for notifications are **not added** to `en.json` / `ar.json`.

---

## Implementation Plan — A to Z

### PART 1 — BACKEND

**Step B-1: Install firebase-admin**

In `/Users/youssefemadeldin.ai/SOURCE-CODE/books-platform/web/`:
```bash
npm install firebase-admin
```

**Step B-2: Add DeviceToken model to Prisma**

In `web/prisma/schema.prisma`, add after the `PushSubscription` model:
```prisma
model DeviceToken {
  id        String   @id @default(cuid())
  token     String   @unique
  platform  String                   // "android" | "ios"
  locale    String   @default("ar")  // for locale-targeted sends
  createdAt DateTime @default(now()) @map("created_at")
  updatedAt DateTime @default(now()) @updatedAt @map("updated_at")

  @@index([platform])
  @@map("device_tokens")
}
```
Note: No `userId` — mobile users are anonymous.

Run migration:
```bash
cd web && npx prisma migrate dev --name add_device_tokens
```

**Step B-3: Create Firebase Admin singleton**

Create `web/lib/firebase-admin.ts`:
```typescript
import admin from 'firebase-admin';

if (!admin.apps.length) {
  admin.initializeApp({
    credential: admin.credential.cert({
      projectId: process.env.FIREBASE_PROJECT_ID,
      clientEmail: process.env.FIREBASE_CLIENT_EMAIL,
      privateKey: process.env.FIREBASE_PRIVATE_KEY?.replace(/\\n/g, '\n'),
    }),
  });
}

export const messaging = admin.messaging();
```

**Step B-4: Create FCM send helper**

Create `web/lib/fcm-service.ts`:
```typescript
import { messaging } from './firebase-admin';

export async function sendTopicPush(
  topic: string,
  title: string,
  body: string,
  data?: Record<string, string>,
) {
  return messaging.send({
    topic,
    notification: { title, body },
    data,
    apns: { payload: { aps: { sound: 'default' } } },
    android: { priority: 'high' },
  });
}
```

**Step B-5: Create register endpoint**

Create `web/app/api/v1/notifications/mobile/register/route.ts`:
```typescript
import { type NextRequest } from 'next/server';
import { db } from '@/lib/db';
import { z } from 'zod';
import { apiSuccess, ApiErrors } from '@/lib/api-client/response';

const schema = z.object({
  token: z.string().min(1),
  platform: z.enum(['android', 'ios']),
  locale: z.enum(['ar', 'en']).default('ar'),
});

export async function POST(request: NextRequest) {
  try {
    const body = await request.json() as unknown;
    const parsed = schema.safeParse(body);
    if (!parsed.success) return ApiErrors.badRequest('Validation failed', parsed.error.issues);

    const { token, platform, locale } = parsed.data;
    await db.deviceToken.upsert({
      where: { token },
      create: { token, platform, locale },
      update: { platform, locale, updatedAt: new Date() },
    });

    return apiSuccess({ message: 'Device registered' });
  } catch (error) {
    console.error('[POST /api/v1/notifications/mobile/register]', error);
    return ApiErrors.internal();
  }
}
```

**Step B-6: Create unregister endpoint**

Create `web/app/api/v1/notifications/mobile/unregister/route.ts`:
```typescript
import { type NextRequest } from 'next/server';
import { db } from '@/lib/db';
import { z } from 'zod';
import { apiSuccess, ApiErrors } from '@/lib/api-client/response';

const schema = z.object({ token: z.string().min(1) });

export async function POST(request: NextRequest) {
  try {
    const body = await request.json() as unknown;
    const parsed = schema.safeParse(body);
    if (!parsed.success) return ApiErrors.badRequest('Validation failed', parsed.error.issues);

    await db.deviceToken.deleteMany({ where: { token: parsed.data.token } });
    return apiSuccess({ message: 'Device unregistered' });
  } catch (error) {
    console.error('[POST /api/v1/notifications/mobile/unregister]', error);
    return ApiErrors.internal();
  }
}
```

**Step B-7: Add Firebase env vars to `.env.example`**

In `web/.env.example`, add after the VAPID section:
```
# === Firebase Admin (Mobile Push Notifications / FCM) ===
FIREBASE_PROJECT_ID="your-firebase-project-id"
FIREBASE_CLIENT_EMAIL="firebase-adminsdk-xxxxx@your-project.iam.gserviceaccount.com"
FIREBASE_PRIVATE_KEY="-----BEGIN PRIVATE KEY-----\n...\n-----END PRIVATE KEY-----\n"
```

**Step B-8: Wire `sendTopicPush` into new book creation**

Find the admin endpoint that creates/publishes a book (grep for `prisma.product.create` or `prisma.book.create` in `web/app/api/v1/admin/`). After a book is created, add:
```typescript
import { sendTopicPush } from '@/lib/fcm-service';

// After book/product creation:
await sendTopicPush(
  'new_books',
  'كتاب جديد',          // or use book's nameAr
  book.nameAr ?? book.nameEn,
  { type: 'book', slug: book.slug },
).catch((err) => console.error('[FCM topic send failed]', err));
```
Wrap in `.catch` so a failed push never blocks the HTTP response.

---

### PART 2 — MOBILE

**Step M-1: Obtain Firebase config files**

You need two files from the Firebase Console → Project Settings → Your Apps:
- `google-services.json` → place at `android/app/google-services.json`
- `GoogleService-Info.plist` → place at `ios/Runner/GoogleService-Info.plist`

**OR use FlutterFire CLI (recommended):**
```bash
dart pub global activate flutterfire_cli
flutterfire configure --project=your-firebase-project-id
```
This generates `lib/firebase_options.dart` and places both config files automatically.

**Step M-2: Uncomment Firebase packages in `pubspec.yaml`**

File: `mobile/pubspec.yaml`
```yaml
firebase_core: ^3.11.0
firebase_messaging: ^15.2.4
flutter_local_notifications: ^18.0.1
```
Run: `flutter pub get`

**Step M-3: Configure Android build files**

In `android/build.gradle` (project-level), under `dependencies {}`:
```groovy
classpath 'com.google.gms:google-services:4.4.2'
```

In `android/app/build.gradle` (app-level), at the very bottom:
```groovy
apply plugin: 'com.google.gms.google-services'
```

Also confirm `minSdkVersion 21` is set in `android/app/build.gradle`.

**Step M-4: Configure iOS in Xcode**

1. Open `ios/Runner.xcworkspace` in Xcode.
2. Runner target → Signing & Capabilities → **+** → **Push Notifications**.
3. Runner target → Signing & Capabilities → **+** → **Background Modes** → check **Remote notifications**.
4. If `GoogleService-Info.plist` was added manually (not via CLI): drag it into Xcode → check "Add to target: Runner".
5. Upload APNs key to Firebase: Firebase Console → Project Settings → Cloud Messaging → iOS app → APNs Authentication Key (`.p8` file from Apple Developer portal).

**Step M-5: Add `kNotifOptInKey` to AppConstants**

File: `lib/core/constants/app_constants.dart`

Add:
```dart
static const String kNotifOptInKey = 'notif_opt_in';
```

**Step M-6: Add `Firebase.initializeApp()` to `main.dart`**

File: `lib/main.dart`

Add import:
```dart
import 'package:firebase_core/firebase_core.dart';
import 'firebase_options.dart'; // generated by FlutterFire CLI
```

In `main()`, after `WidgetsFlutterBinding.ensureInitialized()` and before `configureDependencies()`:
```dart
await Firebase.initializeApp(options: DefaultFirebaseOptions.currentPlatform);
```

**Step M-7: Uncomment and update `FcmService`**

File: `lib/features/notifications/services/fcm_service.dart`

Uncomment the entire class. Key adaptation needed from the skeleton:
- The skeleton uses `_secureStorage` and `_navigatorKey` constructor injection — keep this (matches DI pattern).
- Add background handler as **top-level function** (not inside the class):
  ```dart
  @pragma('vm:entry-point')
  Future<void> _firebaseBackgroundHandler(RemoteMessage message) async {
    await Firebase.initializeApp(options: DefaultFirebaseOptions.currentPlatform);
  }
  ```
- In `initialize()`, register background handler as the FIRST line:
  ```dart
  FirebaseMessaging.onBackgroundMessage(_firebaseBackgroundHandler);
  ```
- Subscribe to FCM topic in `initialize()`:
  ```dart
  await FirebaseMessaging.instance.subscribeToTopic('new_books');
  ```
- Add foreground local notification display (the skeleton already has `_showLocalNotification` — keep it).
- The `_handleNotificationTap` method already handles `'book'` and `'article'` types using `BookDetailArgs`.

**Step M-8: Wire FcmService.initialize() in main.dart**

After `Firebase.initializeApp()` and after `configureDependencies()`:
```dart
await getIt<FcmService>().initialize();
```
`FcmService` is `@lazySingleton` — so `getIt<FcmService>()` creates it on first call, injecting `SecureStorageHelper` and `GlobalKey<NavigatorState>` which are already registered.

**Step M-9: Implement `NotificationsRemoteDataSource.registerFcmToken()`**

File: `lib/features/notifications/data/datasources/notifications_remote_data_source.dart`

Replace the stub implementation:
```dart
@lazySingleton
class NotificationsRemoteDataSource {
  NotificationsRemoteDataSource(this._api);
  final ApiManager _api;

  Future<Either<Failure, Unit>> registerFcmToken(String token, String locale) =>
      _api.post<Unit>(
        path: '/notifications/mobile/register',
        data: {'token': token, 'platform': Platform.isIOS ? 'ios' : 'android', 'locale': locale},
        fromJson: (_) => unit,
      );

  Future<Either<Failure, Unit>> unregisterFcmToken(String token) =>
      _api.post<Unit>(
        path: '/notifications/mobile/unregister',
        data: {'token': token},
        fromJson: (_) => unit,
      );
}
```

Add `unregisterFcmToken` to the domain repository interface and impl as well.

**Step M-10: Uncomment `NotificationSettingsCubit`**

File: `lib/features/notifications/presentation/cubit/notification_settings_cubit.dart`

Uncomment the entire class. It is `@injectable` (factory). Verify imports after uncommenting.

**Step M-11: Uncomment `NotificationSettingsScreen`**

File: `lib/features/notifications/presentation/screens/notification_settings_screen/notification_settings_screen.dart`

Uncomment the entire class. Verify imports.

**Step M-12: Add notification route to router**

File: `lib/core/router/app_routes.dart`
```dart
static const String notificationSettings = '/notification-settings';
```

File: `lib/core/router/app_router.dart`
```dart
case AppRoutes.notificationSettings:
  return MaterialPageRoute(
    settings: settings,
    builder: (_) => BlocProvider(
      create: (_) => getIt<NotificationSettingsCubit>(),
      child: const NotificationSettingsScreen(),
    ),
  );
```

**Step M-13: Add translation keys**

File: `assets/translations/en.json`
```json
"notifications": {
  "title": "Notifications",
  "push_label": "New book alerts",
  "open_settings": "Open Settings to enable notifications"
}
```

File: `assets/translations/ar.json`
```json
"notifications": {
  "title": "الإشعارات",
  "push_label": "تنبيهات الكتب الجديدة",
  "open_settings": "افتح الإعدادات لتفعيل الإشعارات"
}
```

Update translation keys in `NotificationSettingsScreen` to match (currently uses `notifications_title`, `notifications_push_label`, `notifications_open_settings` — update to `notifications.title` etc. if you change the structure, or keep the flat key names).

**Step M-14: Re-run DI codegen**

After all changes:
```bash
dart run build_runner build --delete-conflicting-outputs
```
Verify `lib/core/di/injection_container.config.dart` registers `FcmService`, `NotificationSettingsCubit`, `NotificationsRemoteDataSource`, `NotificationsRepositoryImpl`.

**Step M-15: Run flutter analyze**

```bash
flutter analyze
```
Must show: No issues found.

---

## Pending Tasks (ordered for new session)

### Backend
- [ ] `npm install firebase-admin` in `web/`
- [ ] Add `DeviceToken` model to `web/prisma/schema.prisma`
- [ ] `npx prisma migrate dev --name add_device_tokens`
- [ ] Create `web/lib/firebase-admin.ts`
- [ ] Create `web/lib/fcm-service.ts`
- [ ] Create `web/app/api/v1/notifications/mobile/register/route.ts`
- [ ] Create `web/app/api/v1/notifications/mobile/unregister/route.ts`
- [ ] Add Firebase env vars to `web/.env.example`
- [ ] Find book creation admin endpoint and wire `sendTopicPush('new_books', ...)`

### Mobile
- [ ] Obtain `google-services.json` and `GoogleService-Info.plist` from Firebase Console (ask user)
- [ ] Uncomment Firebase packages in `pubspec.yaml`, run `flutter pub get`
- [ ] Configure Android `build.gradle` (project + app level)
- [ ] Configure iOS in Xcode (Push Notifications capability + Background Modes)
- [ ] Add `kNotifOptInKey` to `AppConstants`
- [ ] Add `Firebase.initializeApp()` to `main.dart`
- [ ] Uncomment and update `FcmService` (add background top-level handler + topic subscribe)
- [ ] Wire `FcmService.initialize()` in `main.dart` after `configureDependencies()`
- [ ] Implement real `registerFcmToken()` + add `unregisterFcmToken()` in data source
- [ ] Update domain repository + impl with `unregisterFcmToken`
- [ ] Uncomment `NotificationSettingsCubit`
- [ ] Uncomment `NotificationSettingsScreen`
- [ ] Add route to `AppRoutes` + `AppRouter`
- [ ] Add translation keys to `en.json` + `ar.json`
- [ ] `dart run build_runner build --delete-conflicting-outputs`
- [ ] `flutter analyze` → No issues found
- [ ] Test on device: permission prompt → token registered → topic subscribed → backend sends push → device receives it

---

## What's Next (new session entry point)

1. **Ask the user**: do you have the Firebase config files (`google-services.json` + `GoogleService-Info.plist`) ready, or do you need to create a Firebase project first? This is the only prerequisite you cannot resolve from code.
2. Start with the backend (Steps B-1 through B-8) — it has no blockers.
3. Then do the mobile (Steps M-1 through M-15).
4. Test end-to-end by triggering a book creation on the backend and confirming the device receives the push.

---

## Key References

- Push notification strategy + research: `doc/handoffs/006-push-notif-research/push-notification-strategy.md`
- Existing FCM service skeleton (commented): `lib/features/notifications/services/fcm_service.dart`
- Existing cubit skeleton (commented): `lib/features/notifications/presentation/cubit/notification_settings_cubit.dart`
- Existing screen skeleton (commented): `lib/features/notifications/presentation/screens/notification_settings_screen/notification_settings_screen.dart`
- Active domain contract: `lib/features/notifications/domain/repositories/notifications_repository.dart`
- Active stubbed data source: `lib/features/notifications/data/datasources/notifications_remote_data_source.dart`
- Backend push subscribe (Web Push / VAPID — NOT FCM): `web/app/api/v1/notifications/push/subscribe/route.ts`
- Backend broadcast admin endpoint: `web/app/api/v1/admin/notifications/broadcast/route.ts`
- Prisma web schema: `web/prisma/schema.prisma`
- Backend env example: `web/.env.example`
- Mobile pubspec: `mobile/pubspec.yaml`

---

## Clarifications & Decisions

| Question | Answer |
|---|---|
| Option A (TTS only) or Option B (TTS + Push) for App Store resubmission? | Option A — submitted TTS only (build 11). Push notifications are next after Apple responds. |
| What is the current App Store submission state? | Build 2.0.0 (11) delivered and submitted. Reply sent to Apple citing TTS. Awaiting response. |
| Does the backend use Firebase Admin SDK? | No. Backend uses `web-push` (VAPID) for browser push only. Firebase Admin SDK must be added. |
| Do mobile users have accounts/login? | No. The mobile app is fully anonymous. `DeviceToken` must NOT have a `userId` FK. |
| Are Firebase config files available? | Unknown at time of writing — first question to ask in new session. |

---

## Notes

### The backend push system is Web Push (browser), NOT FCM

The existing `PushSubscription` model and VAPID keys are for **browser push notifications** (booksplatform.net website). The mobile app needs **FCM** which is a completely separate delivery channel. Both can coexist. Do not modify the existing Web Push infrastructure.

### The broadcast admin endpoint needs updating (optional)

The `admin/notifications/broadcast/route.ts` currently logs push as "sent" but doesn't fire FCM. After adding `sendTopicPush()`, you could update the push branch of that endpoint to actually call FCM. This is optional for now — focus on the A-to-Z flow (register token → new book → push fires) first.

### APNs key upload is easy to forget

Without uploading the APNs `.p8` key to Firebase (Firebase Console → Project Settings → Cloud Messaging → iOS app), iOS devices will silently never receive FCM notifications. This step lives outside the codebase. Flag it clearly when doing iOS setup.

### Permission timing

The `NotificationSettingsCubit.togglePush()` only calls `requestPermission()` when the user turns the toggle ON — this is correct. Do NOT add an automatic permission request on app start. Current implementation follows best practice.
