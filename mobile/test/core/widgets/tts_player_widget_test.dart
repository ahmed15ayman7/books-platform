import 'package:booksplatform/core/widgets/tts_player_widget.dart';
import 'package:flutter/material.dart';
import 'package:flutter/services.dart';
import 'package:flutter_screenutil/flutter_screenutil.dart';
import 'package:flutter_test/flutter_test.dart';

const _channel = MethodChannel('flutter_tts');

Widget _wrap(Widget child) => ScreenUtilInit(
      designSize: const Size(390, 844),
      builder: (_, _) => MaterialApp(home: Scaffold(body: child)),
    );

void main() {
  TestWidgetsFlutterBinding.ensureInitialized();

  late List<String> calls;

  void mockTtsChannel({required bool arabicAvailable}) {
    TestDefaultBinaryMessengerBinding.instance.defaultBinaryMessenger
        .setMockMethodCallHandler(_channel, (call) async {
      calls.add(call.method);
      return switch (call.method) {
        'setLanguage' => arabicAvailable ? 1 : 0,
        // Android shape: voices carry only name + locale (no network_required)
        'getVoices' => arabicAvailable
            ? [
                {'name': 'ar-x-ard-local', 'locale': 'ar'},
              ]
            : [
                {'name': 'en-us-x-sfg-local', 'locale': 'en-US'},
              ],
        _ => 1,
      };
    });
  }

  setUp(() => calls = <String>[]);

  tearDown(() {
    TestDefaultBinaryMessengerBinding.instance.defaultBinaryMessenger
        .setMockMethodCallHandler(_channel, null);
  });

  group('TtsPlayerWidget play path', () {
    testWidgets(
        'asks the engine for the language first (setLanguage, not setVoice) '
        'and plays without showing the voice-not-available card',
        (tester) async {
      mockTtsChannel(arabicAvailable: true);

      await tester.pumpWidget(_wrap(
        const TtsPlayerWidget(text: 'نص المقال', languageCode: 'ar-SA'),
      ));
      await tester.tap(find.byIcon(Icons.play_circle_filled_rounded));
      await tester.pumpAndSettle();

      final voiceSelectionCalls = calls
          .where((m) => m == 'setLanguage' || m == 'setVoice')
          .toList();
      expect(voiceSelectionCalls, isNotEmpty);
      expect(voiceSelectionCalls.first, 'setLanguage');
      expect(calls, contains('speak'));
      expect(find.byIcon(Icons.pause_circle_filled_rounded), findsOneWidget);
      expect(find.text('tts.voice_not_available'), findsNothing);
    });

    testWidgets(
        'shows the voice-not-available card when the language is genuinely '
        'unsupported and no matching voice exists', (tester) async {
      mockTtsChannel(arabicAvailable: false);

      await tester.pumpWidget(_wrap(
        const TtsPlayerWidget(text: 'نص المقال', languageCode: 'ar-SA'),
      ));
      await tester.tap(find.byIcon(Icons.play_circle_filled_rounded));
      await tester.pumpAndSettle();

      expect(calls, isNot(contains('speak')));
      expect(find.text('tts.voice_not_available'), findsOneWidget);
      expect(find.byIcon(Icons.play_circle_filled_rounded), findsNothing);
    });
  });
}
