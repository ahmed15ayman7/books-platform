import 'package:booksplatform/core/helpers/tts_text_chunker.dart';
import 'package:flutter_test/flutter_test.dart';

void main() {
  group('TtsTextChunker.split', () {
    test('returns empty list for blank text', () {
      expect(TtsTextChunker.split('   ', 100), isEmpty);
    });

    test('returns single chunk when text already fits', () {
      const text = 'وصف قصير للكتاب.';
      expect(TtsTextChunker.split(text, 100), [text]);
    });

    test('splits long Arabic text at sentence boundaries under the limit',
        () {
      const text = 'الجملة الأولى في المقال طويلة نسبيًا وتشرح الفكرة؟ '
          'الجملة الثانية تكمل الشرح بتفاصيل إضافية؛ '
          'الجملة الثالثة تختم الفقرة الأولى بوضوح. '
          'الجملة الرابعة تبدأ فقرة جديدة في المقال!';

      final chunks = TtsTextChunker.split(text, 100);

      expect(chunks.length, greaterThan(1));
      for (final chunk in chunks) {
        expect(chunk.length, lessThanOrEqualTo(100));
        expect(chunk.trim(), isNotEmpty);
      }
      expect(chunks.first, startsWith('الجملة الأولى'));
      expect(chunks.last, endsWith('!'));
    });

    test('preserves all words in original order across chunks', () {
      const text = 'أولاً نقرأ المقدمة. ثانياً نتابع التفاصيل؛ '
          'ثالثاً نصل إلى الخاتمة النهائية.';

      final chunks = TtsTextChunker.split(text, 30);

      expect(chunks.join(' ').split(RegExp(r'\s+')),
          text.split(RegExp(r'\s+')));
    });

    test('packs multiple short sentences into one chunk', () {
      const text = 'جملة أولى. جملة ثانية. جملة ثالثة. جملة رابعة.';
      final chunks = TtsTextChunker.split(text, 30);

      expect(chunks.length, lessThan(4));
      for (final chunk in chunks) {
        expect(chunk.length, lessThanOrEqualTo(30));
      }
    });

    test('hard-splits an oversized sentence at word boundaries', () {
      final text = List.filled(20, 'كلمة').join(' ');
      final chunks = TtsTextChunker.split(text, 25);

      expect(chunks.length, greaterThan(1));
      for (final chunk in chunks) {
        expect(chunk.length, lessThanOrEqualTo(25));
        expect(chunk, isNot(contains(RegExp(r'^\s|\s$'))));
      }
      expect(chunks.join(' ').split(' '), List.filled(20, 'كلمة'));
    });

    test('cuts a single word longer than the limit as last resort', () {
      final word = 'ا' * 50;
      final chunks = TtsTextChunker.split(word, 20);

      expect(chunks.map((c) => c.length).reduce((a, b) => a + b), 50);
      for (final chunk in chunks) {
        expect(chunk.length, lessThanOrEqualTo(20));
      }
    });

    test('treats paragraph breaks as boundaries', () {
      const text = 'فقرة أولى بدون علامة ترقيم\nفقرة ثانية تكمل النص';
      final chunks = TtsTextChunker.split(text, 30);

      expect(chunks, ['فقرة أولى بدون علامة ترقيم', 'فقرة ثانية تكمل النص']);
    });
  });
}
