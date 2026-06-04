# Flutter Mobile Debugging with AI Agent (Claude Code)

A guide for giving Claude Code the ability to **see the console** and **interact with the iOS Simulator UI** — the mobile equivalent of Playwright MCP for web.

---

## The Two Capabilities We Need

| Web (Playwright MCP) | Mobile Equivalent |
|---|---|
| Browser console logs | `flutter run` output piped to a log file Claude can read |
| Interact with DOM (click, type) | `idb ui tap/text/swipe` + `xcrun simctl` screenshot |

---

## Installation (one-time)

```bash
# 1. Install the companion daemon (Meta's own Homebrew tap)
brew tap facebook/fb
brew install facebook/fb/idb-companion

# 2. Install the idb CLI client via uv
#    pip is broken on macOS when Python ≥ 3.12 due to a libexpat version mismatch.
#    uv bundles its own Python runtime and sidesteps this entirely.
brew install uv
uv tool install fb-idb --python 3.11   # fb-idb is incompatible with Python ≥ 3.12
```

Verify:

```bash
idb list-targets   # should list all your simulators
```

---

## Session Start — Do This Every Time

Run these steps at the beginning of every debug session, in order.

### Step 1 — Run the app with `flutter run` (piped so Claude can read it)

```bash
# Run from the mobile/ directory
# Pipe output to a log file so Claude can read it at any time
flutter run 2>&1 | tee /tmp/flutter_run.log
```

This does three things at once:
- Boots the app on the simulator
- Streams all console output (`print()`, `debugPrint()`, errors, Dio logs)
- Writes everything to `/tmp/flutter_run.log` so Claude can read it

**Run this in your terminal and leave it running.** Claude reads the log file — it does not need to run `flutter run` itself.

To read the latest console output at any point:

```bash
tail -100 /tmp/flutter_run.log        # last 100 lines
grep "ERROR\|Exception" /tmp/flutter_run.log   # errors only
```

### Step 2 — Start the idb companion daemon

Open a second terminal tab and run:

```bash
# Get the UDID of the booted simulator
UDID=$(xcrun simctl list devices | grep Booted | grep -oE '[A-F0-9-]{36}' | head -1)
echo $UDID   # verify it printed a UDID

# Start the companion daemon
idb_companion --udid $UDID --grpc-port 10882 &
sleep 2

# Connect the idb client
idb connect localhost 10882
```

Expected output of the connect step:
```
udid: <YOUR-UDID> is_local: True
```

Once connected, all `idb ui` commands work for the rest of the session. If the daemon dies (e.g. after a machine reboot), repeat this step.

---

## Layer 1 — Console Access

Claude reads `/tmp/flutter_run.log` (written by `flutter run` above) — **no separate log command needed**.

```bash
# Claude reads the log file to see console output
tail -100 /tmp/flutter_run.log

# Filter for specific output
grep -i "error\|exception\|dio" /tmp/flutter_run.log | tail -30
```

For deeper OS-level logs (native crashes, permissions, system events):

```bash
xcrun simctl syslog booted
```

---

## Layer 2 — UI Interaction

### Launch

The app is already running from `flutter run` in Step 1. If you need to relaunch without restarting `flutter run`:

```bash
xcrun simctl launch booted com.joe.booksplatform
```

**Never tap the home screen icon to launch.** It requires precise coordinate calculation and the companion must already be connected. Use the command above instead.

To find the bundle ID:

```bash
xcrun simctl listapps booted | grep -i "booksplatform"
# → CFBundleIdentifier = "com.joe.booksplatform"
```

### Core Interaction Commands

```bash
# Screenshot — Claude reads this image to see the current screen
xcrun simctl io booted screenshot /tmp/screen.png

# Tap at logical coordinates (see Coordinate System section below)
idb ui tap <x> <y>

# Type text into the currently focused field
idb ui text "your text here"

# Swipe (from x1,y1 to x2,y2 over duration in seconds)
idb ui swipe <x1> <y1> <x2> <y2> <duration>

# Press hardware buttons
idb ui button --button HOME
idb ui button --button LOCK
```

---

## Coordinate System — Critical

`idb ui tap` uses **logical points**, not pixel coordinates. The simulator screenshot is captured at native (3×) resolution. **Divide all pixel coordinates by 3** before passing them to `idb`.

```bash
# Check screenshot pixel dimensions
sips -g pixelWidth -g pixelHeight /tmp/screen.png
# → pixelWidth: 1206
# → pixelHeight: 2622

# Scale factor for modern iPhones (iPhone 14 and later) = 3
# logical = pixel / 3
# Full screen in logical points: 402 × 874
```

**Example:** element at pixel position (600, 1500) in the screenshot:

```bash
idb ui tap 200 500   # 600÷3=200, 1500÷3=500
```

### Approximate Logical Layout (iPhone 17 — 402×874 pts)

| Zone | Logical Y range |
|---|---|
| Status bar | 0 – 54 |
| App bar | 54 – 110 |
| Main content | 110 – 760 |
| Bottom navigation | 760 – 874 |
| Screen center | x=201, y=437 |

---

## The Working Loop (How Claude Uses These)

```
1. tail /tmp/flutter_run.log   →  Claude reads current console state
2. screenshot                  →  Claude sees the current screen visually
3. identify element            →  Claude estimates pixel position from screenshot
4. divide by 3                 →  convert pixel coords to logical points
5. idb ui tap                  →  Claude taps the element
6. screenshot                  →  Claude verifies the result changed
7. tail /tmp/flutter_run.log   →  Claude reads new console output from the action
```

Example prompt:

> "Read the flutter_run.log, take a screenshot, find the Search button, tap it, then check the log again for what happened."

---

## Limitation: Coordinates vs. Semantic Selectors

`idb` taps by **screen coordinates**, not widget name. Claude must take a screenshot first to locate the element, then convert to logical points. This is the main difference from Playwright's DOM selectors.

**Workaround — use Flutter `Key` properties for integration tests:**

```dart
ElevatedButton(
  key: const Key('login_button'),
  onPressed: () {},
  child: const Text('Login'),
)
```

With `Key` properties, the `integration_test` package finds widgets by name — no coordinates needed (see Layer 2B).

---

## Layer 2B — Formal Testing with `integration_test` (Optional)

For structured, repeatable, assertion-based scenarios. No companion daemon needed.

```bash
flutter test integration_test/app_test.dart -d <device_id>
```

Example test Claude can write and iterate on:

```dart
import 'package:flutter_test/flutter_test.dart';
import 'package:integration_test/integration_test.dart';
import 'package:your_app/main.dart' as app;

void main() {
  IntegrationTestWidgetsFlutterBinding.ensureInitialized();

  testWidgets('login flow', (tester) async {
    app.main();
    await tester.pumpAndSettle();

    await tester.tap(find.byKey(const Key('email_field')));
    await tester.enterText(find.byKey(const Key('email_field')), 'test@test.com');
    await tester.tap(find.byKey(const Key('login_button')));
    await tester.pumpAndSettle();

    expect(find.byKey(const Key('home_screen')), findsOneWidget);
  });
}
```

---

## Tool Comparison

| Approach | Setup | Interactive (ad-hoc) | Semantic selectors | Best for |
|---|---|---|---|---|
| `idb` + `simctl` screenshot | Medium (`brew` tap + `uv` + session setup) | Yes | No (coordinates ÷ 3) | Ad-hoc interactive debugging |
| `integration_test` | Zero (in Flutter SDK) | No (write test code) | Yes (`find.byKey`) | Repeatable automated tests |
| Appium | Heavy (Java, WDA, server) | Yes | Yes | Cross-platform enterprise testing |
| Maestro | Medium | No (YAML flows) | Yes (by text/ID) | QA flow recording |

---

## Troubleshooting

### `idb ui tap` fails — "No companions, unclear which target to run against"

The companion daemon is not running. Run Step 2 from the **Session Start** section above.

### `idb list-targets --udid <X>` fails — unrecognized argument

`--udid` is not a valid flag for `list-targets`. Get the UDID via `xcrun simctl list devices | grep Booted` instead, then pass it to `idb_companion`.

### Tap lands in the wrong place / nothing happens

You used raw pixel coordinates. Divide by 3 to get logical points. See the **Coordinate System** section.

### App won't open after tapping its home screen icon

Don't tap the icon. Use `xcrun simctl launch booted <bundle_id>` or just let `flutter run` handle it. Icon tapping is unreliable because coordinates must be exact and the companion must already be connected.

### `pip install fb-idb` fails with libexpat ImportError

`pip` is broken due to a system `libexpat` version mismatch affecting all Homebrew Python versions on this machine. Use `uv tool install fb-idb --python 3.11` — `uv` bundles its own Python.

### `fb-idb` crashes with asyncio RuntimeError

`fb-idb` is incompatible with Python ≥ 3.12. Fix: `uv tool uninstall fb-idb && uv tool install fb-idb --python 3.11`.

---

## Quick Reference

```bash
# === SESSION START (every time) ===

# Terminal 1 — run app + stream console to log file
cd mobile && flutter run 2>&1 | tee /tmp/flutter_run.log

# Terminal 2 — start idb companion and connect
UDID=$(xcrun simctl list devices | grep Booted | grep -oE '[A-F0-9-]{36}' | head -1)
idb_companion --udid $UDID --grpc-port 10882 &
sleep 2
idb connect localhost 10882

# === PER INTERACTION ===

# Read console
tail -100 /tmp/flutter_run.log

# Screenshot
xcrun simctl io booted screenshot /tmp/screen.png

# Tap (pixel ÷ 3 = logical)
idb ui tap 201 524

# Type
idb ui text "hello world"

# Swipe up
idb ui swipe 201 700 201 200 0.4

# Relaunch app without restarting flutter run
xcrun simctl launch booted com.joe.booksplatform
```

---

## Setup Checklist

- [x] `brew tap facebook/fb && brew install facebook/fb/idb-companion`
- [x] `brew install uv && uv tool install fb-idb --python 3.11`
- [x] Verified with `idb list-targets` — simulators visible
- [x] Claude Code permissions added in `.claude/settings.json`
- [ ] Terminal 1: `flutter run 2>&1 | tee /tmp/flutter_run.log` running before each session
- [ ] Terminal 2: companion started and `idb connect localhost 10882` confirmed
