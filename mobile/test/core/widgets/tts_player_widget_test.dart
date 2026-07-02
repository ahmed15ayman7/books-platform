import 'dart:async';

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
  late List<String> spokenTexts;

  void mockTtsChannel({
    required bool arabicAvailable,
    int maxInputLength = 4000,
    List<Completer<int>>? speakCompleters,
  }) {
    TestDefaultBinaryMessengerBinding.instance.defaultBinaryMessenger
        .setMockMethodCallHandler(_channel, (call) async {
      calls.add(call.method);
      switch (call.method) {
        case 'setLanguage':
          return arabicAvailable ? 1 : 0;
        case 'getMaxSpeechInputLength':
          return maxInputLength;
        // Android shape: voices carry only name + locale (no network_required)
        case 'getVoices':
          return arabicAvailable
              ? [
                  {'name': 'ar-x-ard-local', 'locale': 'ar'},
                ]
              : [
                  {'name': 'en-us-x-sfg-local', 'locale': 'en-US'},
                ];
        case 'speak':
          final args = call.arguments;
          spokenTexts.add(args is Map ? args['text'] as String : args as String);
          if (speakCompleters != null) {
            final completer = Completer<int>();
            speakCompleters.add(completer);
            return completer.future;
          }
          return 1;
        case 'stop':
          if (speakCompleters != null) {
            for (final completer in speakCompleters) {
              if (!completer.isCompleted) completer.complete(0);
            }
          }
          return 1;
        default:
          return 1;
      }
    });
  }

  final androidOnly = TargetPlatformVariant.only(TargetPlatform.android);

  setUp(() {
    calls = <String>[];
    spokenTexts = <String>[];
  });

  tearDown(() {
    TestDefaultBinaryMessengerBinding.instance.defaultBinaryMessenger
        .setMockMethodCallHandler(_channel, null);
  });

  // maxInputLength 200 → widget chunk limit 100 (after the safety margin)
  final longArabicText = List.generate(
    8,
    (i) => 'هذه الجملة رقم $i في المقال وتحتوي على كلمات كثيرة لاختبار التقسيم.',
  ).join(' ');

  group('TtsPlayerWidget voice selection', () {
    testWidgets(
        'asks the engine for the language first (setLanguage, not setVoice) '
        'and completes playback without the voice-not-available card',
        (tester) async {
      mockTtsChannel(arabicAvailable: true);

      await tester.pumpWidget(_wrap(
        const TtsPlayerWidget(text: 'نص قصير.', languageCode: 'ar-SA'),
      ));
      await tester.tap(find.byIcon(Icons.play_circle_filled_rounded));
      await tester.pumpAndSettle();

      final voiceSelectionCalls = calls
          .where((m) => m == 'setLanguage' || m == 'setVoice')
          .toList();
      expect(voiceSelectionCalls, isNotEmpty);
      expect(voiceSelectionCalls.first, 'setLanguage');
      expect(calls, contains('speak'));
      expect(find.text('tts.voice_not_available'), findsNothing);
      expect(find.byIcon(Icons.play_circle_filled_rounded), findsOneWidget);
    }, variant: androidOnly);

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
    }, variant: androidOnly);
  });

  group('TtsPlayerWidget chunked playback on Android', () {
    testWidgets(
        'speaks long text as multiple sequential chunks under the platform '
        'limit instead of failing', (tester) async {
      mockTtsChannel(arabicAvailable: true, maxInputLength: 200);

      await tester.pumpWidget(_wrap(
        TtsPlayerWidget(text: longArabicText, languageCode: 'ar-SA'),
      ));
      await tester.tap(find.byIcon(Icons.play_circle_filled_rounded));
      await tester.pumpAndSettle();

      expect(spokenTexts.length, greaterThan(1));
      for (final chunk in spokenTexts) {
        expect(chunk.length, lessThanOrEqualTo(100));
      }
      expect(spokenTexts.join(' ').split(RegExp(r'\s+')),
          longArabicText.split(RegExp(r'\s+')));
      expect(find.text('tts.voice_not_available'), findsNothing);
      expect(find.byIcon(Icons.play_circle_filled_rounded), findsOneWidget);
    }, variant: androidOnly);

    testWidgets('speaks short text as exactly one chunk', (tester) async {
      mockTtsChannel(arabicAvailable: true, maxInputLength: 200);

      await tester.pumpWidget(_wrap(
        const TtsPlayerWidget(text: 'وصف قصير للكتاب.', languageCode: 'ar-SA'),
      ));
      await tester.tap(find.byIcon(Icons.play_circle_filled_rounded));
      await tester.pumpAndSettle();

      expect(spokenTexts, ['وصف قصير للكتاب.']);
    }, variant: androidOnly);

    testWidgets('pausing mid-queue abandons the remaining chunks',
        (tester) async {
      final speakCompleters = <Completer<int>>[];
      mockTtsChannel(
        arabicAvailable: true,
        maxInputLength: 200,
        speakCompleters: speakCompleters,
      );

      await tester.pumpWidget(_wrap(
        TtsPlayerWidget(text: longArabicText, languageCode: 'ar-SA'),
      ));
      await tester.tap(find.byIcon(Icons.play_circle_filled_rounded));
      await tester.pumpAndSettle();

      expect(spokenTexts.length, 1);
      expect(find.byIcon(Icons.pause_circle_filled_rounded), findsOneWidget);

      await tester.tap(find.byIcon(Icons.pause_circle_filled_rounded));
      await tester.pumpAndSettle();

      expect(spokenTexts.length, 1);
      expect(find.byIcon(Icons.play_circle_filled_rounded), findsOneWidget);
      expect(find.byIcon(Icons.pause_circle_filled_rounded), findsNothing);
    }, variant: androidOnly);
  });
}
