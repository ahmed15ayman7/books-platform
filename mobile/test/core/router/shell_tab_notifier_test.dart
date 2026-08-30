import 'package:booksplatform/core/router/shell_tab_notifier.dart';
import 'package:booksplatform/core/widgets/bottom_nav_widget.dart';
import 'package:flutter_test/flutter_test.dart';

void main() {
  group('ShellTabNotifier', () {
    test('starts on the home tab', () {
      expect(ShellTabNotifier().value, BottomNavTab.home.index);
    });

    test('select() moves to the given tab index', () {
      final notifier = ShellTabNotifier();

      notifier.select(BottomNavTab.publishers);

      expect(notifier.value, BottomNavTab.publishers.index);
    });

    test('notifies listeners only when the tab actually changes', () {
      final notifier = ShellTabNotifier()..select(BottomNavTab.media);
      var notifications = 0;
      notifier.addListener(() => notifications++);

      notifier.select(BottomNavTab.media); // same tab — no-op
      notifier.select(BottomNavTab.books); // different — fires once

      expect(notifications, 1);
      expect(notifier.value, BottomNavTab.books.index);
    });
  });
}
