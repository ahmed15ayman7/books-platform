import 'package:easy_localization/easy_localization.dart';

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

  static String? requiredValidator(String? value) {
    if (value == null || value.trim().isEmpty) return 'validation.required'.tr();
    return null;
  }

  static String? emailValidator(String? value) {
    if (value == null || value.trim().isEmpty) return 'validation.required'.tr();
    if (!validate(email, value.trim())) return 'validation.email'.tr();
    return null;
  }

  /// Phone is optional — validates format only when non-empty.
  static String? phoneValidator(String? value) {
    if (value == null || value.trim().isEmpty) return null;
    if (!validate(egyptianPhone, value.trim())) return 'validation.phone'.tr();
    return null;
  }

  static String? minLengthValidator(String? value, int min) {
    if (value == null || value.trim().length < min) {
      return 'validation.min_length'.tr(namedArgs: {'min': '$min'});
    }
    return null;
  }
}
