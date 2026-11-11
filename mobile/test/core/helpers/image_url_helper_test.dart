import 'dart:convert';

import 'package:flutter_test/flutter_test.dart';

import 'package:booksplatform/core/helpers/image_url_helper.dart';

void main() {
  group('unwrapNextImageUrl', () {
    test('unwraps sup.org optimizer URL to the stanford origin file', () {
      const url =
          'https://www.sup.org/_next/image?url=https%3A%2F%2Fsupress.sites-pro.stanford.edu%2Fsites%2Fsupress%2Ffiles%2Fmedia%2Fcovers%2F38538.jpg&w=640&q=75';
      expect(
        unwrapNextImageUrl(url),
        'https://supress.sites-pro.stanford.edu/sites/supress/files/media/covers/38538.jpg',
      );
    });

    test('unwraps ucpress optimizer URL', () {
      const url =
          'https://www.ucpress.edu/_next/image?url=https%3A%2F%2Fwebfiles.ucpress.edu%2Fcoverimage%2Fisbn13%2F9780520440050.jpg&w=640&q=90';
      expect(
        unwrapNextImageUrl(url),
        'https://webfiles.ucpress.edu/coverimage/isbn13/9780520440050.jpg',
      );
    });

    test('resolves a relative url param against the optimizer host', () {
      expect(
        unwrapNextImageUrl(
          'https://example.com/_next/image?url=%2Fimg%2Fa.jpg&w=640',
        ),
        'https://example.com/img/a.jpg',
      );
    });

    test('leaves a regular image URL unchanged', () {
      const url = 'https://m.media-amazon.com/images/I/71tnqPNP4NL._SY342_.jpg';
      expect(unwrapNextImageUrl(url), url);
    });

    test('leaves an optimizer URL without url param unchanged', () {
      const url = 'https://example.com/_next/image?w=640';
      expect(unwrapNextImageUrl(url), url);
    });

    test('rejects a non-http url param', () {
      const url = 'https://example.com/_next/image?url=javascript%3Aalert(1)';
      expect(unwrapNextImageUrl(url), url);
    });
  });

  group('resolveImageSource', () {
    test('decodes a base64 data URI into bytes', () {
      final bytes = [1, 2, 3, 4];
      final source = resolveImageSource(
        'data:image/jpeg;base64,${base64Encode(bytes)}',
      );
      expect(source, isA<MemoryImageSource>());
      expect((source! as MemoryImageSource).bytes, bytes);
    });

    test('returns null for a malformed data URI', () {
      expect(
        resolveImageSource('data:image/jpeg;base64,@@@not-base64'),
        isNull,
      );
    });

    test('returns a network source with the unwrapped URL', () {
      final source = resolveImageSource(
        'https://www.ucpress.edu/_next/image?url=https%3A%2F%2Fwebfiles.ucpress.edu%2Fa.jpg',
      );
      expect(
        (source! as NetworkImageSource).url,
        'https://webfiles.ucpress.edu/a.jpg',
      );
    });

    test('returns null for null input', () {
      expect(resolveImageSource(null), isNull);
    });

    test('returns null for blank input', () {
      expect(resolveImageSource('   '), isNull);
    });
  });
}
