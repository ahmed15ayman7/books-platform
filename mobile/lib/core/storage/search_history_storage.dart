import 'dart:convert';

import 'package:injectable/injectable.dart';
import 'package:shared_preferences/shared_preferences.dart';

import '../constants/app_constants.dart';

@lazySingleton
class SearchHistoryStorage {
  SearchHistoryStorage(this._prefs);

  final SharedPreferences _prefs;

  static const _maxEntries = 20;

  Future<List<String>> getHistory() async {
    final raw = _prefs.getString(kSearchHistoryKey);
    if (raw == null) return [];
    return List<String>.from(jsonDecode(raw) as List);
  }

  Future<void> addQuery(String query) async {
    final history = await getHistory();
    history.removeWhere((e) => e == query);
    history.insert(0, query);
    if (history.length > _maxEntries) history.removeRange(_maxEntries, history.length);
    await _prefs.setString(kSearchHistoryKey, jsonEncode(history));
  }

  Future<void> removeQuery(String query) async {
    final history = await getHistory();
    history.removeWhere((e) => e == query);
    await _prefs.setString(kSearchHistoryKey, jsonEncode(history));
  }

  Future<void> clearAll() => _prefs.remove(kSearchHistoryKey);
}
