import 'package:booksplatform/core/widgets/bottom_nav_widget.dart';
import 'package:flutter/material.dart';
import 'package:flutter_screenutil/flutter_screenutil.dart';
import 'package:flutter_test/flutter_test.dart';

Widget _host(Widget bar) => ScreenUtilInit(
      designSize: const Size(390, 844),
      builder: (_, _) => MaterialApp(
        home: Scaffold(
          body: const SizedBox.expand(),
          bottomNavigationBar: bar,
        ),
      ),
    );

void main() {
  testWidgets('renders as a compact bar, not a full-height panel', (tester) async {
    tester.view.physicalSize = const Size(1170, 2532);
    tester.view.devicePixelRatio = 3.0;
    addTearDown(tester.view.resetPhysicalSize);
    addTearDown(tester.view.resetDevicePixelRatio);

    await tester.pumpWidget(
      _host(
        BottomNavWidget(
          activeTab: BottomNavTab.home,
          onTabSelected: (_) {},
          onPublishTap: () {},
        ),
      ),
    );

    // Regression: an unbounded child once let the bar expand to fill the screen.
    final barHeight = tester.getSize(find.byType(BottomNavWidget)).height;
    expect(barHeight, lessThan(160));
    expect(barHeight, greaterThan(40));
  });
}
