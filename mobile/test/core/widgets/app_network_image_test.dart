import 'package:flutter/material.dart';
import 'package:flutter_test/flutter_test.dart';

import 'package:booksplatform/core/widgets/app_network_image.dart';

const _onePixelPng =
    'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAQAAAC1HAwCAAAAC0lEQVR42mNkYAAAAAYAAjCB0C8AAAAASUVORK5CYII=';

Widget _host(String? url) => MaterialApp(
  home: AppNetworkImage(
    url: url,
    placeholder: (_) => const Text('placeholder'),
    error: (_) => const Text('error'),
  ),
);

void main() {
  testWidgets('renders a data URI with Image.memory', (tester) async {
    await tester.pumpWidget(_host(_onePixelPng));
    final image = tester.widget<Image>(find.byType(Image));
    expect(image.image, isA<MemoryImage>());
  });

  testWidgets('renders the error builder for a null url', (tester) async {
    await tester.pumpWidget(_host(null));
    expect(find.text('error'), findsOneWidget);
  });
}
