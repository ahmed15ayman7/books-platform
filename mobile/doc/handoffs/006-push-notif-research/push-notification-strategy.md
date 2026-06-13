# Push Notification Strategy: Flutter + Next.js + Prisma
> **Books Platform — Mobile Push Reference Guide**
> Researched: June 2026 | Stack: Flutter (Dart) · Next.js 16 · PostgreSQL · Prisma ORM

---

## Table of Contents

1. [Strategy Comparison — FCM vs OneSignal vs Novu](#1-strategy-comparison)
2. [Recommended Approach & Rationale](#2-recommended-approach)
3. [Next.js Backend Integration](#3-nextjs-backend-integration)
4. [Trigger Hook: Book Inserted → Push Notification](#4-trigger-hook)
5. [End-to-End Architecture Diagram](#5-architecture-diagram)
6. [Step-by-Step Implementation Plan](#6-implementation-plan)
   - [Backend Steps](#backend-steps)
   - [Flutter Mobile Steps](#flutter-mobile-steps)
7. [Environment Variables Checklist](#7-env-vars)
8. [Token Hygiene & Best Practices](#8-best-practices)
9. [Sources](#9-sources)

---

## 1. Strategy Comparison

### Option A — Firebase Cloud Messaging (FCM) Direct

| Dimension | Detail |
|---|---|
| **Cost** | Completely free — no subscriber limits, no message caps, no hidden fees |
| **Reliability** | Industry standard; Android delivery is **mandatory via FCM** (Google Play Store requirement) |
| **Flutter SDK** | `firebase_messaging` ^15.x — first-party FlutterFire plugin, actively maintained (last updated Jun 2026) |
| **Setup complexity** | Medium — requires Firebase project, `google-services.json` (Android), `GoogleService-Info.plist` (iOS), and `firebase-admin` on the backend |
| **iOS support** | Routes through APNs automatically via FCM |
| **Vendor lock-in** | Google ecosystem; FCM is mandatory under the hood for Android regardless of which layer you pick |
| **API version** | Legacy FCM API was **deprecated Jun 2024** — must use **FCM HTTP v1 API** with OAuth2 |
| **Best for** | Teams that want zero infrastructure cost, full control, and don't need a marketing dashboard |

### Option B — OneSignal (Managed Platform above FCM)

| Dimension | Detail |
|---|---|
| **Cost** | Free tier: unlimited mobile push; Growth from $19/mo adds segmentation & A/B testing |
| **Reliability** | Routes Android through FCM and iOS through APNs under the hood — same delivery layer |
| **Flutter SDK** | `onesignal_flutter` — community-supported, works well but adds an abstraction |
| **Setup complexity** | Lower initial setup — configure credentials in OneSignal dashboard, no raw Firebase JSON in your code |
| **Features added** | Visual dashboard, segmentation, templates, scheduling, A/B testing, analytics |
| **Vendor lock-in** | Medium — migration away requires replacing SDK and token DB |
| **Best for** | Consumer apps where marketing team needs a visual push composer; teams that want to avoid raw Firebase config |

### Option C — Novu (Open-Source Multi-Channel Orchestration)

| Dimension | Detail |
|---|---|
| **Cost** | Cloud: free tier → $30/mo; Self-hosted: free (Docker required) |
| **Reliability** | Still routes through FCM/APNs — adds workflow orchestration layer |
| **Flutter SDK** | No official Flutter SDK — you call Novu REST API manually |
| **Setup complexity** | Higher — requires Novu instance + workflow config + topic mapping |
| **Best for** | Teams already handling email/SMS/in-app in one orchestration layer; B2B SaaS |
| **Verdict for this project** | Overkill for a single "new book" broadcast use case |

### Quick Decision Matrix

```
Need zero cost + full control?              → FCM Direct  ✅
Need a visual dashboard for marketing?     → OneSignal
Need multi-channel (email + push + SMS)?   → Novu / SuprSend
Already using Firebase elsewhere?          → FCM Direct  ✅ (obvious choice)
```

---

## 2. Recommended Approach

**→ Firebase FCM Direct (HTTP v1 API) + `firebase-admin` on Next.js**

**Reasons for this project specifically:**

1. **Your Flutter skeleton is already FCM-shaped** — `FcmService`, `NotificationSettingsCubit`, and `NotificationSettingsScreen` are already scaffolded. Activating FCM is filling in what's already planned.
2. **Completely free** at any scale for mobile push — Books Platform user base does not change this math.
3. **FCM is mandatory for Android** regardless of which layer you pick; OneSignal just wraps it.
4. **`firebase-admin` integrates cleanly with Next.js API routes** — one npm package, one service account JSON, done.
5. **Topics API** means you can broadcast "new book" to all subscribed users with a single API call — no loop over every device token.

---

## 3. Next.js Backend Integration

### 3.1 New Prisma Models

Add these two models to `prisma/schema.prisma`:

```prisma
model DeviceToken {
  id         String   @id @default(cuid())
  userId     String
  token      String   @unique          // FCM registration token
  platform   String                    // "android" | "ios"
  createdAt  DateTime @default(now())
  updatedAt  DateTime @updatedAt

  user User @relation(fields: [userId], references: [id], onDelete: Cascade)

  @@index([userId])
}
```

> The existing `PushSubscription` model stores VAPID Web Push tokens (browser-only). Keep it.
> `DeviceToken` is specifically for mobile FCM tokens. They are different things.

Run migration:
```bash
npx prisma migrate dev --name add_device_tokens
```

### 3.2 New npm Package

```bash
npm install firebase-admin
```

**No other push-specific packages needed.** `web-push` (already installed) handles browser VAPID — leave it. `firebase-admin` handles mobile FCM.

### 3.3 Firebase Admin Initialisation

Create `lib/firebase-admin.ts` (singleton pattern — critical in Next.js to avoid re-initialisation):

```typescript
import admin from 'firebase-admin';

if (!admin.apps.length) {
  admin.initializeApp({
    credential: admin.credential.cert({
      projectId: process.env.FIREBASE_PROJECT_ID,
      clientEmail: process.env.FIREBASE_CLIENT_EMAIL,
      // Replace literal \n in env var with actual newlines
      privateKey: process.env.FIREBASE_PRIVATE_KEY?.replace(/\\n/g, '\n'),
    }),
  });
}

export const messaging = admin.messaging();
```

### 3.4 New API Endpoints

#### `POST /api/v1/notifications/mobile/register`
Registers (or refreshes) a device token for the authenticated user.

```typescript
// app/api/v1/notifications/mobile/register/route.ts
import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { getServerSession } from 'next-auth';

export async function POST(req: NextRequest) {
  const session = await getServerSession();
  if (!session?.user?.id) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

  const { token, platform } = await req.json();
  if (!token || !platform) return NextResponse.json({ error: 'Missing token or platform' }, { status: 400 });

  // Upsert: update if token exists, create if new
  await prisma.deviceToken.upsert({
    where: { token },
    update: { userId: session.user.id, platform, updatedAt: new Date() },
    create: { userId: session.user.id, token, platform },
  });

  return NextResponse.json({ success: true });
}
```

#### `POST /api/v1/notifications/mobile/unregister`
Removes a device token (call on logout).

```typescript
export async function POST(req: NextRequest) {
  const { token } = await req.json();
  await prisma.deviceToken.deleteMany({ where: { token } });
  return NextResponse.json({ success: true });
}
```

### 3.5 FCM Send Utility

Create `lib/notifications/send-fcm.ts`:

```typescript
import { messaging } from '@/lib/firebase-admin';
import { prisma } from '@/lib/prisma';

interface PushPayload {
  title: string;
  body: string;
  data?: Record<string, string>;
  topic?: string;       // Use topic for broadcasts (preferred)
  userIds?: string[];   // Or target specific users
}

/**
 * Broadcast to FCM topic (best for "new book" announcements)
 * All devices subscribed to the topic receive the notification.
 */
export async function sendTopicPush(
  topic: string,
  title: string,
  body: string,
  data?: Record<string, string>
) {
  return messaging.send({
    topic,
    notification: { title, body },
    data,
    android: {
      priority: 'high',
      notification: { channelId: 'new_books', clickAction: 'FLUTTER_NOTIFICATION_CLICK' },
    },
    apns: {
      payload: { aps: { alert: { title, body }, sound: 'default', badge: 1 } },
    },
  });
}

/**
 * Send to specific user's registered devices (for personalised notifications)
 */
export async function sendUserPush(
  userId: string,
  title: string,
  body: string,
  data?: Record<string, string>
) {
  const devices = await prisma.deviceToken.findMany({ where: { userId } });
  if (!devices.length) return;

  const tokens = devices.map((d) => d.token);

  return messaging.sendEachForMulticast({
    tokens,
    notification: { title, body },
    data,
    android: { priority: 'high' },
    apns: { payload: { aps: { sound: 'default' } } },
  });
}
```

---

## 4. Trigger Hook

### The Right Pattern: Service Function called from the Admin API Route

**Do NOT use Prisma middleware for this.** Prisma's `$use()` middleware is deprecated in favour of Prisma Extensions, and Extensions run synchronously inside the query — they are not designed for async side effects like HTTP calls. They also execute in every environment including edge runtimes where `firebase-admin` cannot run.

**The correct pattern** for Next.js + Prisma is to call the notification service directly inside the API route that creates the book:

```typescript
// app/api/v1/admin/books/route.ts  (or your existing book creation route)
import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { sendTopicPush } from '@/lib/notifications/send-fcm';
import { prisma as prismaClient } from '@/lib/prisma';

export async function POST(req: NextRequest) {
  const body = await req.json();

  // 1. Insert the book
  const book = await prisma.book.create({ data: body });

  // 2. Fire push notification (non-blocking — don't await if you want fast response)
  sendTopicPush(
    'new_books',                              // FCM topic all users subscribe to
    'New Book Available! 📚',
    `"${book.title}" by ${book.author} is now on Books Platform`,
    {
      bookId: book.id,
      type: 'NEW_BOOK',
      route: `/books/${book.id}`,             // Deep link for Flutter to handle
    }
  ).catch((err) => console.error('[FCM] Failed to send push:', err));

  // 3. Log to existing NotificationLog if desired
  await prisma.notificationLog.create({
    data: {
      channel: 'FCM_TOPIC',
      target: 'new_books',
      title: 'New Book Available!',
      body: `"${book.title}" added`,
      status: 'SENT',
    },
  });

  return NextResponse.json(book, { status: 201 });
}
```

### Why Not Other Approaches?

| Approach | Verdict |
|---|---|
| Prisma `$use()` middleware | ❌ Deprecated — use Prisma Extensions instead |
| Prisma Extension (`$extends`) | ⚠️ Works but runs synchronously inside query — HTTP side effects cause timeouts |
| Database triggers (PostgreSQL) | ⚠️ Works but requires `LISTEN/NOTIFY` polling daemon — extra infrastructure |
| Job queue (BullMQ / Trigger.dev) | ✅ Best for scale (retries, dead-letter, rate limiting) — overkill for MVP |
| **Direct call in API route** | ✅ **Recommended for MVP** — simple, transparent, no extra infrastructure |

**For scale:** When the book catalogue grows and fan-out to millions of devices is needed, extract into a Trigger.dev or BullMQ job. For now, the FCM Topics API handles broadcast fan-out server-side — one API call from Next.js, FCM delivers to all subscribed devices.

---

## 5. Architecture Diagram

```
┌─────────────────────────────────────────────────────────────────────┐
│                        BOOKS PLATFORM BACKEND                        │
│                         (Next.js 16 + Prisma)                        │
│                                                                       │
│  Admin Panel ──POST /api/v1/admin/books──► books.create()            │
│                                                   │                   │
│                                                   ▼                   │
│                                          PostgreSQL (book row)        │
│                                                   │                   │
│                           (same request handler)  │                   │
│                                                   ▼                   │
│                                          sendTopicPush()              │
│                                          (lib/notifications/          │
│                                           send-fcm.ts)                │
│                                                   │                   │
│                                          firebase-admin SDK           │
└───────────────────────────────────────────────────┼───────────────────┘
                                                    │ HTTPS POST
                                                    │ FCM HTTP v1 API
                                                    ▼
                                    ┌───────────────────────────┐
                                    │  Firebase Cloud Messaging  │
                                    │  (Google infrastructure)   │
                                    │                            │
                                    │  Topic: "new_books"        │
                                    │  Fan-out to all tokens     │
                                    │  subscribed to this topic  │
                                    └──────────────┬────────────┘
                                                   │
                             ┌─────────────────────┼────────────────────┐
                             │                     │                    │
                             ▼                     ▼                    ▼
                    ┌─────────────┐      ┌─────────────────┐   ┌──────────────┐
                    │   Android   │      │      iOS         │   │  Android     │
                    │   Device    │      │     Device       │   │  Device      │
                    │             │      │                  │   │   (another)  │
                    │ FCM SDK     │      │ FCM → APNs       │   │              │
                    │ delivers    │      │ APNs delivers    │   │ FCM SDK      │
                    │ directly    │      │ to device        │   │ delivers     │
                    └──────┬──────┘      └────────┬─────────┘   └──────┬───────┘
                           │                      │                    │
                           ▼                      ▼                    ▼
              ┌─────────────────────────────────────────────────────────────┐
              │               Flutter App (firebase_messaging)               │
              │                                                               │
              │  App TERMINATED → System shows notification tray banner      │
              │  App BACKGROUND  → System shows notification tray banner      │
              │  App FOREGROUND  → onMessage stream → flutter_local_         │
              │                    notifications shows banner manually        │
              │                                                               │
              │  User taps → FirebaseMessaging.onMessageOpenedApp            │
              │            → router.push(data['route'])  // deep link        │
              └─────────────────────────────────────────────────────────────┘

─────────────── TOKEN REGISTRATION FLOW (one-time per install) ──────────────

  Flutter App boot
      │
      ├─ FirebaseMessaging.instance.getToken() ──► FCM token string
      │
      ├─ FirebaseMessaging.instance.subscribeToTopic('new_books')
      │   (client-side topic subscription — no backend call needed)
      │
      └─ POST /api/v1/notifications/mobile/register
             { token, platform: "android"|"ios" }
             ──► DeviceToken row in PostgreSQL
             (for future per-user targeting)
```

---

## 6. Implementation Plan

### Backend Steps

#### Step B-1: Firebase Project Setup
1. Go to [console.firebase.google.com](https://console.firebase.google.com) → Create project (or reuse existing).
2. Project Settings → General → Add app:
   - Add **Android app** (package name = your Flutter app ID, e.g. `net.booksplatform.app`)
   - Add **iOS app** (bundle ID = same)
3. Download `google-services.json` → give to Flutter developer.
4. Download `GoogleService-Info.plist` → give to Flutter developer.
5. Project Settings → **Service Accounts** → Generate new private key → download JSON.
6. Enable **Firebase Cloud Messaging API (V1)** in Google Cloud Console → APIs & Services.

#### Step B-2: Add Environment Variables
Add to `.env.local` (and to your production secret manager):
```
FIREBASE_PROJECT_ID=your-project-id
FIREBASE_CLIENT_EMAIL=firebase-adminsdk-xxxx@your-project.iam.gserviceaccount.com
FIREBASE_PRIVATE_KEY="-----BEGIN PRIVATE KEY-----\nMIIE...\n-----END PRIVATE KEY-----\n"
```
Store the entire private key value from the downloaded JSON. In `.env.local`, keep `\n` as literal `\n` — the `replace(/\\n/g, '\n')` in the init file handles it.

#### Step B-3: Install firebase-admin
```bash
npm install firebase-admin
# Verify version ≥ 12.x for FCM HTTP v1 support
```

#### Step B-4: Add Prisma Model
In `prisma/schema.prisma`, add the `DeviceToken` model (see §3.1 above).
```bash
npx prisma migrate dev --name add_device_tokens
npx prisma generate
```

#### Step B-5: Create Firebase Admin Singleton
Create `lib/firebase-admin.ts` with the singleton initialisation (see §3.3).

#### Step B-6: Create Notification Utilities
Create `lib/notifications/send-fcm.ts` with `sendTopicPush` and `sendUserPush` (see §3.5).

#### Step B-7: Create Device Token Endpoints
Create `app/api/v1/notifications/mobile/register/route.ts` and `unregister/route.ts` (see §3.4).

#### Step B-8: Wire Trigger Into Book Creation Route
Find the existing admin endpoint that creates books. After `prisma.book.create()`, add the `sendTopicPush(...)` call (see §4).

#### Step B-9: Test from Backend
Use the Firebase Console → Cloud Messaging → Send test message (paste a device token to test before wiring topic).

---

### Flutter Mobile Steps

#### Step M-1: Add Firebase Config Files
Place files at these **exact** paths:
- `android/app/google-services.json`
- `ios/Runner/GoogleService-Info.plist`

#### Step M-2: Configure Android Build Files

In `android/build.gradle` (project-level):
```groovy
dependencies {
  classpath 'com.google.gms:google-services:4.4.2'
}
```

In `android/app/build.gradle` (app-level), at the bottom:
```groovy
apply plugin: 'com.google.gms.google-services'
```

Also ensure `minSdkVersion 21` (FCM requirement).

#### Step M-3: Configure iOS (Xcode)

1. Open `ios/Runner.xcworkspace` in Xcode.
2. Runner target → Signing & Capabilities → **+ Capability** → add **Push Notifications**.
3. Also add **Background Modes** → check **Remote notifications**.
4. `GoogleService-Info.plist` must be added to the Runner target (drag into Xcode, check "Add to target: Runner").

#### Step M-4: Add Flutter Packages

In `pubspec.yaml`:
```yaml
dependencies:
  firebase_core: ^3.6.0
  firebase_messaging: ^15.1.4
  flutter_local_notifications: ^17.2.3
```
```bash
flutter pub get
```

#### Step M-5: Activate the FCM Service Skeleton

The project already has `FcmService` (commented out). Uncomment and complete it. The service should:

```dart
// lib/services/fcm_service.dart
import 'package:firebase_core/firebase_core.dart';
import 'package:firebase_messaging/firebase_messaging.dart';
import 'package:flutter_local_notifications/flutter_local_notifications.dart';

// Top-level handler — MUST be a top-level function (not a class method)
@pragma('vm:entry-point')
Future<void> _firebaseBackgroundHandler(RemoteMessage message) async {
  await Firebase.initializeApp();
  // Background messages with only data payload need manual handling here
  // Notification payload is shown automatically by the system
}

class FcmService {
  static final _localNotifications = FlutterLocalNotificationsPlugin();
  static const _channelId = 'new_books';
  static const _channelName = 'New Books';

  static Future<void> init() async {
    // Register background handler BEFORE runApp()
    FirebaseMessaging.onBackgroundMessage(_firebaseBackgroundHandler);

    // Create Android notification channel
    const channel = AndroidNotificationChannel(
      _channelId,
      _channelName,
      description: 'Notifications for newly added books',
      importance: Importance.max,
    );
    await _localNotifications
        .resolvePlatformSpecificImplementation<AndroidFlutterLocalNotificationsPlugin>()
        ?.createNotificationChannel(channel);

    // Initialise flutter_local_notifications
    await _localNotifications.initialize(
      const InitializationSettings(
        android: AndroidInitializationSettings('@mipmap/ic_launcher'),
        iOS: DarwinInitializationSettings(),
      ),
      onDidReceiveNotificationResponse: (details) {
        // Handle tap on local notification (foreground)
        _handleNotificationTap(details.payload);
      },
    );

    // Request permission (iOS) — do NOT request on first launch
    // Call this after user has taken a meaningful action
    await FirebaseMessaging.instance.requestPermission(
      alert: true, badge: true, sound: true,
    );

    // Subscribe to topic for broadcast notifications
    await FirebaseMessaging.instance.subscribeToTopic('new_books');

    // Get and register token with backend
    final token = await FirebaseMessaging.instance.getToken();
    if (token != null) await _registerToken(token);

    // Listen for token refresh
    FirebaseMessaging.instance.onTokenRefresh.listen(_registerToken);

    // Handle foreground messages (system does NOT show these automatically)
    FirebaseMessaging.onMessage.listen((message) {
      final notification = message.notification;
      if (notification == null) return;
      _localNotifications.show(
        notification.hashCode,
        notification.title,
        notification.body,
        NotificationDetails(
          android: AndroidNotificationDetails(
            _channelId, _channelName,
            importance: Importance.max, priority: Priority.high,
          ),
        ),
        payload: message.data['route'],
      );
    });

    // Handle tap when app was in background
    FirebaseMessaging.onMessageOpenedApp.listen((message) {
      _handleNotificationTap(message.data['route']);
    });

    // Handle tap when app was terminated
    final initialMessage = await FirebaseMessaging.instance.getInitialMessage();
    if (initialMessage != null) {
      _handleNotificationTap(initialMessage.data['route']);
    }
  }

  static Future<void> _registerToken(String token) async {
    // POST to your backend
    await yourApiClient.post(
      '/api/v1/notifications/mobile/register',
      body: { 'token': token, 'platform': Platform.isIOS ? 'ios' : 'android' },
    );
  }

  static void _handleNotificationTap(String? route) {
    if (route == null) return;
    // Use your router: GoRouter, AutoRoute, etc.
    // e.g. AppRouter.instance.go(route);
  }
}
```

#### Step M-6: Initialize in main.dart

```dart
void main() async {
  WidgetsFlutterBinding.ensureInitialized();
  await Firebase.initializeApp(
    options: DefaultFirebaseOptions.currentPlatform, // generated by FlutterFire CLI
  );
  await FcmService.init(); // Before runApp
  runApp(const MyApp());
}
```

#### Step M-7: (Recommended) Use FlutterFire CLI for Config

Instead of manually placing JSON/plist files, use the CLI:
```bash
dart pub global activate flutterfire_cli
flutterfire configure --project=your-firebase-project-id
```
This generates `lib/firebase_options.dart` — the idiomatic approach that avoids manually handling JSON config files. The CLI still downloads `google-services.json` and `GoogleService-Info.plist` and places them correctly.

#### Step M-8: Activate NotificationSettingsCubit

The existing `NotificationSettingsCubit` and `NotificationSettingsScreen` skeleton can be wired to:
- Toggle `subscribeToTopic('new_books')` / `unsubscribeFromTopic('new_books')` based on user preference.
- Persist the preference via your existing preferences service.

---

## 7. Env Vars

| Variable | Where | Notes |
|---|---|---|
| `FIREBASE_PROJECT_ID` | Backend `.env.local` | From Firebase project settings |
| `FIREBASE_CLIENT_EMAIL` | Backend `.env.local` | From service account JSON |
| `FIREBASE_PRIVATE_KEY` | Backend `.env.local` | Full private key; use `\n` as literal newlines |
| `google-services.json` | `android/app/` | NOT an env var — file in repo (or CI secret) |
| `GoogleService-Info.plist` | `ios/Runner/` | NOT an env var — file in repo (or CI secret) |

> **Security:** Never commit `FIREBASE_PRIVATE_KEY` to Git. Never commit `google-services.json` or `GoogleService-Info.plist` to a public repo (they contain API keys). For CI/CD, store as encrypted secrets.

---

## 8. Best Practices

### Token Hygiene
- **Always upsert, never blindly insert** — FCM tokens change after app reinstall, token refresh, or OS upgrade. The `upsert` on `token` field handles this.
- **Handle `messaging/registration-token-not-registered` error** — delete the `DeviceToken` row when FCM returns this error code. Stale tokens inflate your DB and slow multicast sends.
- **Call `/unregister` on logout** — do not accumulate orphaned tokens.

### Permission Timing
- **Do NOT request push permission on app first launch.** Users deny at much higher rates. Ask after the user takes a meaningful action (e.g., after completing profile, after browsing 3 books, after saving a favourite).

### Foreground Notifications
- FCM does NOT auto-display notifications when the app is in the foreground on Android or iOS. You **must** listen to `FirebaseMessaging.onMessage` and call `flutter_local_notifications` manually. This is the most common FCM confusion.

### Background Handler
- The `_firebaseBackgroundHandler` function **must be a top-level function** (not inside a class or closure). It runs in an isolate and must call `Firebase.initializeApp()` itself.

### Topic vs Token Targeting
- **Topic (`new_books`)** — for broadcasts like "new book added". One server-side API call. FCM handles fan-out to all subscribed devices. Use this for your use case.
- **Token targeting** — for personalised notifications (e.g., "your order shipped"). Use `sendEachForMulticast` with a list of tokens.

### APNs Setup (iOS — Easy to Miss)
- You must upload your APNs key (`.p8` file) to Firebase: Firebase Console → Project Settings → Cloud Messaging → iOS app → APNs Authentication Key.
- Without this, iOS will silently not receive any FCM notifications.

---

## 9. Sources

| Claim | Source |
|---|---|
| FCM is free, no limits | [APIScout — Best Push Notification APIs 2026](https://apiscout.dev/guides/best-push-notification-apis-2026) |
| FCM mandatory for Android; other providers route through it | [buildmvpfast.com FCM Alternatives](https://www.buildmvpfast.com/alternatives/firebase-fcm) |
| Legacy FCM API deprecated Jun 2024; must use HTTP v1 | [Intercom FCM Migration Guide](https://developers.intercom.com/installing-intercom/android/fcm-migration-guide) |
| OneSignal pricing (free tier; Growth $19/mo) | [SuprSend FCM Alternatives May 2026](https://www.suprsend.com/post/fcm-alternatives) |
| Foreground notifications require flutter_local_notifications | [FlutterFire Notifications Docs](https://firebase.flutter.dev/docs/messaging/notifications/) & [LeanCode Flutter Push Guide](https://leancode.co/glossary/push-notifications-in-flutter) |
| Background handler must be top-level function | [FlutterFire Notifications Docs](https://firebase.flutter.dev/docs/messaging/notifications/) |
| Permission timing best practice | [Flutter Gems Push Notification Guide (May 2026)](https://fluttergems.dev/messaging-push-notification/) |
| firebase-admin Node.js service account setup | [Medium: Send FCM from Node.js Jan 2026](https://medium.com/@rhythm6194/send-fcm-push-notification-in-node-js-using-firebase-cloud-messaging-fcm-http-v1-2024-448c0d921fff) |
| FCM + Next.js integration pattern | [DEV.to: Push Notifications with Next.js + FCM](https://dev.to/kalama_ayubu_920a009aeba9/push-notifications-with-nextjs-fcmfirebase-cloud-messaging-4588) |
| Firebase official Flutter FCM getting started | [Firebase Docs (updated Jun 11, 2026)](https://firebase.google.com/docs/cloud-messaging/flutter/get-started) |
| flutter_local_notifications & firebase_messaging compatibility | [pub.dev flutter_local_notifications](https://pub.dev/packages/flutter_local_notifications) |
| Novu open-source, $30/mo cloud | [Sequenzy OneSignal Alternatives 2026](https://www.sequenzy.com/alternatives/onesignal-alternatives) |
