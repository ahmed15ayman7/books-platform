import 'package:flutter/material.dart';

import '../../features/articles/presentation/pages/articles_screen/articles_screen.dart';
import '../../features/books/presentation/pages/catalog_screen/catalog_screen.dart';
import '../../features/books/presentation/pages/home_screen/home_screen.dart';
import '../../features/media_creations/presentation/pages/media_screen/media_screen.dart';
import '../../features/publishers/presentation/pages/publishers_screen/publishers_screen.dart';
import '../../features/wishlist/presentation/screens/wishlist_screen/wishlist_screen.dart';
import '../di/injection_container.dart';
import '../theme/app_colors.dart';
import '../widgets/bottom_nav_widget.dart';
import 'app_routes.dart';
import 'args/main_shell_args.dart';
import 'shell_tab_notifier.dart';

/// Persistent shell hosting the six main tabs. Once a tab has been visited its
/// screen stays mounted in an [IndexedStack], so its state and scroll position
/// survive later tab switches. Tabs are built lazily on first visit rather than
/// all at once, so opening the app only kicks off the Home tab's initial load.
///
/// The selected tab is owned by [ShellTabNotifier]; the cubits behind each tab
/// are provided one level up in [AppRouter] so they outlive switches too.
class MainShellScreen extends StatefulWidget {
  const MainShellScreen({super.key, this.args = const MainShellArgs()});

  final MainShellArgs args;

  @override
  State<MainShellScreen> createState() => _MainShellScreenState();
}

class _MainShellScreenState extends State<MainShellScreen> {
  // Index order must match the BottomNavTab enum: home, books, articles,
  // media, publishers, wishlist.
  static const List<Widget> _tabScreens = [
    HomeScreen(),
    CatalogScreen(),
    ArticlesScreen(),
    MediaScreen(),
    PublishersScreen(),
    WishlistScreen(),
  ];

  final Set<int> _visited = {};

  ShellTabNotifier get _tabs => getIt<ShellTabNotifier>();

  @override
  void initState() {
    super.initState();
    _tabs.value = widget.args.initialTab.index;
  }

  /// Keeps every already-visited tab mounted (so its state persists) while
  /// leaving unvisited tabs as empty placeholders (so their `initState` — and
  /// initial network load — is deferred until the user first opens them).
  List<Widget> _visiblePages(int activeIndex) {
    _visited.add(activeIndex);
    return [
      for (var i = 0; i < _tabScreens.length; i++)
        if (_visited.contains(i)) _tabScreens[i] else const SizedBox.shrink(),
    ];
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      backgroundColor: AppColors.background,
      body: ValueListenableBuilder<int>(
        valueListenable: _tabs,
        builder: (_, index, _) => IndexedStack(
          index: index,
          children: _visiblePages(index),
        ),
      ),
      bottomNavigationBar: ValueListenableBuilder<int>(
        valueListenable: _tabs,
        builder: (_, index, _) => BottomNavWidget(
          activeTab: BottomNavTab.values[index],
          onTabSelected: _tabs.select,
          onPublishTap: () =>
              Navigator.of(context).pushNamed(AppRoutes.publish),
        ),
      ),
    );
  }
}
