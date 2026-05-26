class RegexHelper {
  RegexHelper._();

  static final RegExp email =
      RegExp(r'^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$');

  static final RegExp egyptianPhone = RegExp(r'^01[0125]\d{8}$');

  static final RegExp password =
      RegExp(r'^(?=.*[a-z])(?=.*[A-Z])(?=.*\d).{8,}$');

  static final RegExp strongPassword = RegExp(
    r'^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[!@#$%^&*(),.?":{}|<>]).{8,}$',
  );

  static final RegExp username = RegExp(r'^[a-zA-Z0-9_]{3,20}$');

  static final RegExp numericOnly = RegExp(r'^\d+$');

  static final RegExp arabicText = RegExp(r'^[؀-ۿ\s]+$');

  static final RegExp noSpecialChars = RegExp(r'^[a-zA-Z0-9\s]+$');

  static bool validate(RegExp pattern, String value) => pattern.hasMatch(value);
}
