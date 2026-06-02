class AppRoutes {
  AppRoutes._();

  // Onboarding
  static const String splash = '/';
  static const String language = '/language';
  static const String onboarding = '/onboarding';

  // Main tabs
  static const String home = '/home';
  static const String books = '/books';
  static const String articles = '/articles';
  static const String publishers = '/publishers';

  // Detail screens
  static const String bookDetail = '/books/detail';
  static const String categoryBooks = '/books/category';
  static const String publisherDetail = '/publishers/detail';
  static const String articleDetail = '/articles/detail';

  // Actions
  static const String search = '/search';
  static const String cart = '/cart';
  static const String publish = '/publish';

  // Auth (placeholder — no login in this version; used by AuthInterceptor)
  static const String login = '/login';

  // New screens (Phase 4)
  static const String wishlist = '/wishlist';
  static const String translatedBooks = '/translated-books';
  static const String recommendedBooks = '/recommended-books';
  static const String notificationSettings = '/notification-settings';
  static const String staticPage = '/static-page';
  static const String aboutUs = '/about-us';
  static const String contactUs = '/contact-us';
  static const String privacyPolicy = '/privacy-policy';
  static const String termsOfUse = '/terms-of-use';

  // Fallback
  static const String unknown = '/unknown';
}
