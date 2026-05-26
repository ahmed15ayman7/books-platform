import 'package:flutter_secure_storage/flutter_secure_storage.dart';
import 'package:injectable/injectable.dart';

import '../constants/app_constants.dart';

@lazySingleton
class SecureStorageHelper {
  final FlutterSecureStorage _storage;

  const SecureStorageHelper(this._storage);

  Future<void> saveToken(String token) =>
      _storage.write(key: kTokenKey, value: token);

  Future<String?> getToken() => _storage.read(key: kTokenKey);

  Future<void> deleteToken() => _storage.delete(key: kTokenKey);

  Future<void> saveString(String key, String value) =>
      _storage.write(key: key, value: value);

  Future<String?> getString(String key) => _storage.read(key: key);

  Future<void> deleteKey(String key) => _storage.delete(key: key);

  Future<void> clearAll() => _storage.deleteAll();
}
