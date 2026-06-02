import 'dart:convert';

import 'package:injectable/injectable.dart';
import 'package:shared_preferences/shared_preferences.dart';

import '../constants/app_constants.dart';

@lazySingleton
class WishlistStorage {
  WishlistStorage(this._prefs);

  final SharedPreferences _prefs;

  List<String> getSlugs() {
    final raw = _prefs.getString(kWishlistKey);
    if (raw == null) return [];
    return (jsonDecode(raw) as List<dynamic>).cast<String>();
  }

  Future<void> saveSlugs(List<String> slugs) =>
      _prefs.setString(kWishlistKey, jsonEncode(slugs));

  Future<void> addSlug(String slug) {
    final slugs = getSlugs();
    if (!slugs.contains(slug)) slugs.add(slug);
    return saveSlugs(slugs);
  }

  Future<void> removeSlug(String slug) {
    final slugs = getSlugs()..remove(slug);
    return saveSlugs(slugs);
  }

  bool contains(String slug) => getSlugs().contains(slug);

  Future<void> clear() => _prefs.remove(kWishlistKey);
}
