class ApiConstants {
  ApiConstants._();

  static const String _environment = String.fromEnvironment(
    'ENVIRONMENT',
    defaultValue: 'dev',
  );

  static const String _devBaseUrl = 'https://booksplatform.net/api/v1';
  static const String _prodBaseUrl = 'https://booksplatform.net/api/v1';

  static String get baseUrl =>
      _environment == 'prod' ? _prodBaseUrl : _devBaseUrl;

  /// Public web app host — used to build shareable links (no `/api/v1` suffix).
  static const String webBaseUrl = 'https://booksplatform.net';

  static const Duration connectTimeout = Duration(seconds: 30);
  static const Duration receiveTimeout = Duration(seconds: 30);
  static const Duration sendTimeout = Duration(seconds: 30);
}
