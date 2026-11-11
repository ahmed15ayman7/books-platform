import 'package:flutter/foundation.dart';
import 'package:injectable/injectable.dart';

import '../widgets/bottom_nav_widget.dart';

/// Single source of truth for the currently selected main-shell tab.
///
/// [MainShellScreen] listens to this and drives its `IndexedStack`; any
/// descendant can switch tabs without pushing a route via [select].
@lazySingleton
class ShellTabNotifier extends ValueNotifier<int> {
  ShellTabNotifier() : super(BottomNavTab.home.index);

  void select(BottomNavTab tab) => value = tab.index;
}
