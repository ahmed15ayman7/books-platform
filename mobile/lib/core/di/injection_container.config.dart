// GENERATED CODE - DO NOT MODIFY BY HAND
// dart format width=80

// **************************************************************************
// InjectableConfigGenerator
// **************************************************************************

// ignore_for_file: type=lint
// coverage:ignore-file

// ignore_for_file: no_leading_underscores_for_library_prefixes
import 'package:booksplatform/core/di/register_module.dart' as _i4;
import 'package:booksplatform/core/helpers/dialog_helper.dart' as _i502;
import 'package:booksplatform/core/helpers/snack_bar_helper.dart' as _i517;
import 'package:booksplatform/core/network/api_manager.dart' as _i473;
import 'package:booksplatform/core/network/connectivity_helper.dart' as _i403;
import 'package:booksplatform/core/network/dio_factory.dart' as _i339;
import 'package:booksplatform/core/storage/secure_storage_helper.dart' as _i759;
import 'package:dio/dio.dart' as _i361;
import 'package:flutter/material.dart' as _i409;
import 'package:flutter_secure_storage/flutter_secure_storage.dart' as _i558;
import 'package:get_it/get_it.dart' as _i174;
import 'package:injectable/injectable.dart' as _i526;

extension GetItInjectableX on _i174.GetIt {
  // initializes the registration of main-scope dependencies inside of GetIt
  _i174.GetIt init({
    String? environment,
    _i526.EnvironmentFilter? environmentFilter,
  }) {
    final gh = _i526.GetItHelper(this, environment, environmentFilter);
    final registerModule = _$RegisterModule();
    gh.singleton<_i409.GlobalKey<_i409.NavigatorState>>(
      () => registerModule.navigatorKey,
    );
    gh.lazySingleton<_i558.FlutterSecureStorage>(
      () => registerModule.secureStorage,
    );
    gh.lazySingleton<_i403.ConnectivityHelper>(
      () => _i403.ConnectivityHelper(),
    );
    gh.lazySingleton<_i759.SecureStorageHelper>(
      () => _i759.SecureStorageHelper(gh<_i558.FlutterSecureStorage>()),
    );
    gh.lazySingleton<_i502.DialogHelper>(
      () => _i502.DialogHelper(gh<_i409.GlobalKey<_i409.NavigatorState>>()),
    );
    gh.lazySingleton<_i517.SnackBarHelper>(
      () => _i517.SnackBarHelper(gh<_i409.GlobalKey<_i409.NavigatorState>>()),
    );
    gh.lazySingleton<_i339.DioFactory>(
      () => _i339.DioFactory(
        gh<_i759.SecureStorageHelper>(),
        gh<_i409.GlobalKey<_i409.NavigatorState>>(),
      ),
    );
    gh.singleton<_i361.Dio>(() => registerModule.dio(gh<_i339.DioFactory>()));
    gh.lazySingleton<_i473.ApiManager>(() => _i473.ApiManager(gh<_i361.Dio>()));
    return this;
  }
}

class _$RegisterModule extends _i4.RegisterModule {}
