import 'package:flutter/material.dart';
import 'package:flutter_bloc/flutter_bloc.dart';

import '../../features/articles/presentation/cubit/article_detail_cubit/article_detail_cubit.dart';
import '../../features/articles/presentation/cubit/articles_list_cubit/articles_list_cubit.dart';
import '../../features/articles/presentation/pages/article_detail_screen/article_detail_screen.dart';
import '../../features/media_creations/presentation/cubit/media_list_cubit/media_list_cubit.dart';
import '../../features/books/presentation/cubit/book_detail_cubit/book_detail_cubit.dart';
import '../../features/books/presentation/cubit/catalog_cubit/catalog_cubit.dart';
import '../../features/books/presentation/cubit/home_content_cubit/home_content_cubit.dart';
import '../../features/books/presentation/pages/book_detail_screen/book_detail_screen.dart';
import '../../features/books/presentation/pages/category_books_screen.dart';
import '../../features/cart/presentation/pages/cart_screen/cart_screen.dart';
import '../../features/onboarding/presentation/pages/language_screen.dart';
import '../../features/onboarding/presentation/pages/onboarding_screen/onboarding_screen.dart';
import '../../features/onboarding/presentation/pages/splash_screen.dart';
import '../../features/publish/presentation/cubit/publish_cubit.dart';
import '../../features/publish/presentation/pages/publish_screen/publish_screen.dart';
import '../../features/publishers/presentation/cubit/publisher_detail_cubit/publisher_detail_cubit.dart';
import '../../features/publishers/presentation/cubit/publishers_list_cubit/publishers_list_cubit.dart';
import '../../features/publishers/presentation/pages/publisher_detail_screen/publisher_detail_screen.dart';
import '../../features/books/presentation/pages/recommended_books_screen/recommended_books_screen.dart';
import '../../features/books/presentation/pages/translated_books_screen/translated_books_screen.dart';
import '../../features/ratings/presentation/cubit/comments_cubit.dart';
import '../../features/ratings/presentation/cubit/ratings_cubit.dart';
import '../../features/search/presentation/cubit/search_cubit.dart';
import '../../features/search/presentation/pages/search_screen/search_screen.dart';
import '../../features/static_pages/presentation/cubit/static_page_cubit.dart';
import '../../features/static_pages/presentation/screens/about_screen/about_screen.dart';
import '../../features/static_pages/presentation/screens/contact_screen/contact_screen.dart';
import '../../features/static_pages/presentation/screens/services_screen/services_screen.dart';
import '../../features/static_pages/presentation/screens/static_page_screen/static_page_screen.dart';
import '../../features/static_pages/presentation/screens/team_screen/team_screen.dart';
import '../../features/notifications/presentation/cubit/notification_settings_cubit.dart';
import '../../features/notifications/presentation/screens/notification_settings_screen/notification_settings_screen.dart';
import '../../features/wishlist/presentation/cubit/wishlist_cubit.dart';
import '../di/injection_container.dart';
import '../widgets/bottom_nav_widget.dart';
import 'app_routes.dart';
import 'args/article_detail_args.dart';
import 'args/book_detail_args.dart';
import 'args/category_books_args.dart';
import 'args/main_shell_args.dart';
import 'args/publisher_detail_args.dart';
import 'args/static_page_args.dart';
import 'main_shell_screen.dart';

class AppRouter {
  AppRouter._();

  static Route<dynamic> generateRoute(RouteSettings settings) {
    switch (settings.name) {
      case AppRoutes.splash:
        return MaterialPageRoute(
          settings: settings,
          builder: (_) => const SplashScreen(),
        );

      case AppRoutes.language:
        return MaterialPageRoute(
          settings: settings,
          builder: (_) => const LanguageScreen(),
        );

      case AppRoutes.onboarding:
        return MaterialPageRoute(
          settings: settings,
          builder: (_) => const OnboardingScreen(),
        );

      case AppRoutes.home:
        return _mainShell(settings, BottomNavTab.home);

      case AppRoutes.books:
        return _mainShell(settings, BottomNavTab.books);

      case AppRoutes.bookDetail:
        final args = settings.arguments as BookDetailArgs?;
        if (args == null) return _unknown(settings);
        return MaterialPageRoute(
          settings: settings,
          builder: (_) => MultiBlocProvider(
            providers: [
              BlocProvider(create: (_) => getIt<BookDetailCubit>()),
              BlocProvider(create: (_) => getIt<WishlistCubit>()),
              BlocProvider(create: (_) => getIt<RatingsCubit>()),
              BlocProvider(create: (_) => getIt<CommentsCubit>()),
            ],
            child: BookDetailScreen(args: args),
          ),
        );

      case AppRoutes.publishers:
        return _mainShell(settings, BottomNavTab.publishers);

      case AppRoutes.articles:
        return _mainShell(settings, BottomNavTab.articles);

      case AppRoutes.media:
        return _mainShell(settings, BottomNavTab.media);

      case AppRoutes.categoryBooks:
        final args = settings.arguments as CategoryBooksArgs?;
        if (args == null) return _unknown(settings);
        return MaterialPageRoute(
          settings: settings,
          builder: (_) => BlocProvider(
            create: (_) => getIt<CatalogCubit>(),
            child: CategoryBooksScreen(args: args),
          ),
        );

      case AppRoutes.publisherDetail:
        final args = settings.arguments as PublisherDetailArgs?;
        if (args == null) return _unknown(settings);
        return MaterialPageRoute(
          settings: settings,
          builder: (_) => BlocProvider(
            create: (_) => getIt<PublisherDetailCubit>(),
            child: PublisherDetailScreen(args: args),
          ),
        );

      case AppRoutes.articleDetail:
        final args = settings.arguments as ArticleDetailArgs?;
        if (args == null) return _unknown(settings);
        return MaterialPageRoute(
          settings: settings,
          builder: (_) => MultiBlocProvider(
            providers: [
              BlocProvider(create: (_) => getIt<ArticleDetailCubit>()),
              BlocProvider(create: (_) => getIt<CommentsCubit>()),
            ],
            child: ArticleDetailScreen(args: args),
          ),
        );

      case AppRoutes.search:
        return MaterialPageRoute(
          settings: settings,
          builder: (_) => BlocProvider(
            create: (_) => getIt<SearchCubit>(),
            child: const SearchScreen(),
          ),
        );

      case AppRoutes.cart:
        return MaterialPageRoute(
          settings: settings,
          builder: (_) => const CartScreen(),
        );

      case AppRoutes.publish:
        return MaterialPageRoute(
          settings: settings,
          builder: (_) => BlocProvider(
            create: (_) => getIt<PublishCubit>(),
            child: const PublishScreen(),
          ),
        );

      case AppRoutes.wishlist:
        return _mainShell(settings, BottomNavTab.wishlist);

      case AppRoutes.translatedBooks:
        return MaterialPageRoute(
          settings: settings,
          builder: (_) => BlocProvider(
            create: (_) => getIt<CatalogCubit>(),
            child: const TranslatedBooksScreen(),
          ),
        );

      case AppRoutes.recommendedBooks:
        return MaterialPageRoute(
          settings: settings,
          builder: (_) => BlocProvider(
            create: (_) => getIt<CatalogCubit>(),
            child: const RecommendedBooksScreen(),
          ),
        );

      case AppRoutes.aboutUs:
        return MaterialPageRoute(
          settings: settings,
          builder: (_) => const AboutScreen(),
        );

      case AppRoutes.contactUs:
        return MaterialPageRoute(
          settings: settings,
          builder: (_) => const ContactScreen(),
        );

      case AppRoutes.services:
        return MaterialPageRoute(
          settings: settings,
          builder: (_) => const ServicesScreen(),
        );

      case AppRoutes.team:
        return MaterialPageRoute(
          settings: settings,
          builder: (_) => const TeamScreen(),
        );

      case AppRoutes.notificationSettings:
        return MaterialPageRoute(
          settings: settings,
          builder: (_) => BlocProvider(
            create: (_) => getIt<NotificationSettingsCubit>(),
            child: const NotificationSettingsScreen(),
          ),
        );

      case AppRoutes.staticPage:
      case AppRoutes.privacyPolicy:
      case AppRoutes.termsOfUse:
        final args = settings.arguments as StaticPageArgs?;
        if (args == null) return _unknown(settings);
        return MaterialPageRoute(
          settings: settings,
          builder: (_) => BlocProvider(
            create: (_) => getIt<StaticPageCubit>(),
            child: StaticPageScreen(args: args),
          ),
        );

      default:
        return _unknown(settings);
    }
  }

  static Route<dynamic> _unknown(RouteSettings settings) => MaterialPageRoute(
    settings: settings,
    builder: (_) => const _UnknownScreen(),
  );

  /// Builds the persistent main-tab shell. The six tab cubits are provided here
  /// (one level above the shell) so they survive tab switches. An explicit
  /// [MainShellArgs] in `settings.arguments` wins over [initialTab], letting
  /// callers such as "continue shopping" land the shell on a specific tab.
  static Route<dynamic> _mainShell(
    RouteSettings settings,
    BottomNavTab initialTab,
  ) {
    final args = settings.arguments as MainShellArgs? ??
        MainShellArgs(initialTab: initialTab);
    return MaterialPageRoute(
      settings: settings,
      builder: (_) => MultiBlocProvider(
        providers: [
          BlocProvider(create: (_) => getIt<HomeContentCubit>()),
          BlocProvider(create: (_) => getIt<CatalogCubit>()),
          BlocProvider(create: (_) => getIt<ArticlesListCubit>()),
          BlocProvider(create: (_) => getIt<MediaListCubit>()),
          BlocProvider(create: (_) => getIt<PublishersListCubit>()),
          BlocProvider(create: (_) => getIt<WishlistCubit>()),
        ],
        child: MainShellScreen(args: args),
      ),
    );
  }
}

class _UnknownScreen extends StatelessWidget {
  const _UnknownScreen();

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: AppBar(title: const Text('Unknown')),
      body: const Center(child: Text('Route not found.')),
    );
  }
}
