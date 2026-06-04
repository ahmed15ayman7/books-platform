import 'dart:convert';

import 'package:injectable/injectable.dart';
import 'package:shared_preferences/shared_preferences.dart';

import '../constants/app_constants.dart';

@lazySingleton
class WishlistStorage {
  WishlistStorage(this._prefs);

  final SharedPreferences _prefs;

  // $mobile-debug-skill | Problem: old storage saved plain slugs List<String>; items had no title/imageUrl for display. Fix: save as JSON objects; backward-compat migration for plain string entries.
  List<Map<String, dynamic>> getItemMaps() {
    final raw = _prefs.getString(kWishlistKey);
    if (raw == null) return [];
    final list = jsonDecode(raw) as List<dynamic>;
    return list.map<Map<String, dynamic>>((e) {
      if (e is String) return {'slug': e};
      return Map<String, dynamic>.from(e as Map);
    }).toList();
  }

  Future<void> _saveItemMaps(List<Map<String, dynamic>> maps) =>
      _prefs.setString(kWishlistKey, jsonEncode(maps));

  Future<void> addItem(Map<String, dynamic> item) {
    final items = getItemMaps();
    final slug = item['slug'] as String;
    if (!items.any((m) => m['slug'] == slug)) items.add(item);
    return _saveItemMaps(items);
  }

  Future<void> removeItem(String slug) {
    final items = getItemMaps()..removeWhere((m) => m['slug'] == slug);
    return _saveItemMaps(items);
  }

  bool contains(String slug) => getItemMaps().any((m) => m['slug'] == slug);

  Future<void> clear() => _prefs.remove(kWishlistKey);
}
