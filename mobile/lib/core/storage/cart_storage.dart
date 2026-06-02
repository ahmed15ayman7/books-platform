import 'dart:convert';

import 'package:injectable/injectable.dart';
import 'package:shared_preferences/shared_preferences.dart';

import '../constants/app_constants.dart';

@lazySingleton
class CartStorage {
  CartStorage(this._prefs);

  final SharedPreferences _prefs;

  List<Map<String, dynamic>> getItems() {
    final raw = _prefs.getString(kCartKey);
    if (raw == null) return [];
    return (jsonDecode(raw) as List<dynamic>)
        .map((e) => (e as Map<String, dynamic>))
        .toList();
  }

  Future<void> saveItems(List<Map<String, dynamic>> items) =>
      _prefs.setString(kCartKey, jsonEncode(items));

  Future<void> clear() => _prefs.remove(kCartKey);
}
