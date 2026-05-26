class ApiConstants {
  ApiConstants._();

  static const String _environment = String.fromEnvironment(
    'ENVIRONMENT',
    defaultValue: 'dev',
  );

  static const String _devBaseUrl = 'https://api-dev.placeholder.com/v1';
  static const String _prodBaseUrl = 'https://api.placeholder.com/v1';

  static String get baseUrl =>
      _environment == 'prod' ? _prodBaseUrl : _devBaseUrl;

  static const Duration connectTimeout = Duration(seconds: 30);
  static const Duration receiveTimeout = Duration(seconds: 30);
  static const Duration sendTimeout = Duration(seconds: 30);
}
