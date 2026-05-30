import 'package:flutter/material.dart';
import 'package:flutter_bloc/flutter_bloc.dart';

import '../../features/articles/presentation/cubit/article_detail_cubit/article_detail_cubit.dart';
import '../../features/articles/presentation/cubit/articles_list_cubit/articles_list_cubit.dart';
import '../../features/articles/presentation/pages/article_detail_screen.dart';
import '../../features/articles/presentation/pages/articles_screen.dart';
import '../../features/books/presentation/cubit/book_detail_cubit/book_detail_cubit.dart';
import '../../features/books/presentation/cubit/catalog_cubit/catalog_cubit.dart';
import '../../features/books/presentation/cubit/home_content_cubit/home_content_cubit.dart';
import '../../features/books/presentation/pages/book_detail_screen.dart';
import '../../features/books/presentation/pages/catalog_screen.dart';
import '../../features/books/presentation/pages/category_books_screen.dart';
import '../../features/books/presentation/pages/home_screen.dart';
import '../../features/cart/presentation/pages/cart_screen.dart';
import '../../features/onboarding/presentation/pages/language_screen.dart';
import '../../features/onboarding/presentation/pages/onboarding_screen.dart';
import '../../features/onboarding/presentation/pages/splash_screen.dart';
import '../../features/publish/presentation/pages/publish_screen.dart';
import '../../features/publishers/presentation/cubit/publisher_detail_cubit/publisher_detail_cubit.dart';
import '../../features/publishers/presentation/cubit/publishers_list_cubit/publishers_list_cubit.dart';
import '../../features/publishers/presentation/pages/publisher_detail_screen.dart';
import '../../features/publishers/presentation/pages/publishers_screen.dart';
import '../../features/search/presentation/cubit/search_cubit.dart';
import '../../features/search/presentation/pages/search_screen.dart';
import '../di/injection_container.dart';
import 'app_routes.dart';
import 'args/article_detail_args.dart';
import 'args/book_detail_args.dart';
import 'args/category_books_args.dart';
import 'args/publisher_detail_args.dart';

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
        return MaterialPageRoute(
          settings: settings,
          builder: (_) => BlocProvider(
            create: (_) => getIt<HomeContentCubit>(),
            child: const HomeScreen(),
          ),
        );

      case AppRoutes.books:
        return MaterialPageRoute(
          settings: settings,
          builder: (_) => BlocProvider(
            create: (_) => getIt<CatalogCubit>(),
            child: const CatalogScreen(),
          ),
        );

      case AppRoutes.bookDetail:
        final args = settings.arguments as BookDetailArgs?;
        if (args == null) return _unknown(settings);
        return MaterialPageRoute(
          settings: settings,
          builder: (_) => BlocProvider(
            create: (_) => getIt<BookDetailCubit>(),
            child: BookDetailScreen(args: args),
          ),
        );

      case AppRoutes.publishers:
        return MaterialPageRoute(
          settings: settings,
          builder: (_) => BlocProvider(
            create: (_) => getIt<PublishersListCubit>(),
            child: const PublishersScreen(),
          ),
        );

      case AppRoutes.articles:
        return MaterialPageRoute(
          settings: settings,
          builder: (_) => BlocProvider(
            create: (_) => getIt<ArticlesListCubit>(),
            child: const ArticlesScreen(),
          ),
        );

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
          builder: (_) => BlocProvider(
            create: (_) => getIt<ArticleDetailCubit>(),
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
          builder: (_) => const PublishScreen(),
        );

      default:
        return _unknown(settings);
    }
  }

  static Route<dynamic> _unknown(RouteSettings settings) => MaterialPageRoute(
        settings: settings,
        builder: (_) => const _UnknownScreen(),
      );
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
