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
import 'package:booksplatform/core/storage/cart_storage.dart' as _i498;
import 'package:booksplatform/core/storage/secure_storage_helper.dart' as _i759;
import 'package:booksplatform/core/storage/wishlist_storage.dart' as _i421;
import 'package:booksplatform/features/articles/data/datasources/articles_remote_data_source_impl.dart'
    as _i652;
import 'package:booksplatform/features/articles/data/repositories/articles_repository_impl.dart'
    as _i653;
import 'package:booksplatform/features/articles/domain/repositories/base_articles_repository.dart'
    as _i657;
import 'package:booksplatform/features/articles/presentation/cubit/article_detail_cubit/article_detail_cubit.dart'
    as _i165;
import 'package:booksplatform/features/articles/presentation/cubit/articles_list_cubit/articles_list_cubit.dart'
    as _i556;
import 'package:booksplatform/features/books/data/datasources/books_remote_data_source_impl.dart'
    as _i481;
import 'package:booksplatform/features/books/data/repositories/books_repository_impl.dart'
    as _i680;
import 'package:booksplatform/features/books/domain/repositories/base_books_repository.dart'
    as _i407;
import 'package:booksplatform/features/books/presentation/cubit/book_detail_cubit/book_detail_cubit.dart'
    as _i974;
import 'package:booksplatform/features/books/presentation/cubit/catalog_cubit/catalog_cubit.dart'
    as _i776;
import 'package:booksplatform/features/books/presentation/cubit/home_content_cubit/home_content_cubit.dart'
    as _i765;
import 'package:booksplatform/features/cart/presentation/cubit/cart_cubit.dart'
    as _i309;
import 'package:booksplatform/features/newsletter/data/datasources/newsletter_remote_data_source.dart'
    as _i684;
import 'package:booksplatform/features/newsletter/data/repositories/newsletter_repository_impl.dart'
    as _i954;
import 'package:booksplatform/features/newsletter/domain/repositories/newsletter_repository.dart'
    as _i785;
import 'package:booksplatform/features/newsletter/presentation/cubit/newsletter_cubit.dart'
    as _i47;
import 'package:booksplatform/features/notifications/data/datasources/notifications_remote_data_source.dart'
    as _i545;
import 'package:booksplatform/features/notifications/data/repositories/notifications_repository_impl.dart'
    as _i595;
import 'package:booksplatform/features/notifications/domain/repositories/notifications_repository.dart'
    as _i693;
import 'package:booksplatform/features/notifications/presentation/cubit/notification_settings_cubit.dart'
    as _i377;
import 'package:booksplatform/features/notifications/services/fcm_service.dart'
    as _i438;
import 'package:booksplatform/features/publish/data/datasources/publish_remote_data_source.dart'
    as _i1069;
import 'package:booksplatform/features/publish/data/repositories/publish_repository_impl.dart'
    as _i655;
import 'package:booksplatform/features/publish/domain/repositories/publish_repository.dart'
    as _i95;
import 'package:booksplatform/features/publish/presentation/cubit/publish_cubit.dart'
    as _i557;
import 'package:booksplatform/features/publish/services/file_upload_service.dart'
    as _i171;
import 'package:booksplatform/features/publishers/data/datasources/publishers_remote_data_source_impl.dart'
    as _i365;
import 'package:booksplatform/features/publishers/data/repositories/publishers_repository_impl.dart'
    as _i1006;
import 'package:booksplatform/features/publishers/domain/repositories/base_publishers_repository.dart'
    as _i674;
import 'package:booksplatform/features/publishers/presentation/cubit/publisher_detail_cubit/publisher_detail_cubit.dart'
    as _i618;
import 'package:booksplatform/features/publishers/presentation/cubit/publishers_list_cubit/publishers_list_cubit.dart'
    as _i935;
import 'package:booksplatform/features/ratings/data/datasources/ratings_remote_data_source.dart'
    as _i519;
import 'package:booksplatform/features/ratings/data/repositories/ratings_repository_impl.dart'
    as _i341;
import 'package:booksplatform/features/ratings/domain/repositories/ratings_repository.dart'
    as _i14;
import 'package:booksplatform/features/ratings/presentation/cubit/comments_cubit.dart'
    as _i105;
import 'package:booksplatform/features/ratings/presentation/cubit/ratings_cubit.dart'
    as _i849;
import 'package:booksplatform/features/search/data/datasources/search_remote_data_source.dart'
    as _i407;
import 'package:booksplatform/features/search/data/repositories/search_repository_impl.dart'
    as _i163;
import 'package:booksplatform/features/search/domain/repositories/search_repository.dart'
    as _i1067;
import 'package:booksplatform/features/search/presentation/cubit/search_cubit.dart'
    as _i1073;
import 'package:booksplatform/features/static_pages/presentation/cubit/static_page_cubit.dart'
    as _i101;
import 'package:booksplatform/features/wishlist/data/datasources/wishlist_data_source.dart'
    as _i1061;
import 'package:booksplatform/features/wishlist/data/repositories/wishlist_repository_impl.dart'
    as _i140;
import 'package:booksplatform/features/wishlist/domain/repositories/wishlist_repository.dart'
    as _i230;
import 'package:booksplatform/features/wishlist/presentation/cubit/wishlist_cubit.dart'
    as _i232;
import 'package:dio/dio.dart' as _i361;
import 'package:flutter/material.dart' as _i409;
import 'package:flutter_secure_storage/flutter_secure_storage.dart' as _i558;
import 'package:get_it/get_it.dart' as _i174;
import 'package:injectable/injectable.dart' as _i526;
import 'package:shared_preferences/shared_preferences.dart' as _i460;

extension GetItInjectableX on _i174.GetIt {
  // initializes the registration of main-scope dependencies inside of GetIt
  Future<_i174.GetIt> init({
    String? environment,
    _i526.EnvironmentFilter? environmentFilter,
  }) async {
    final gh = _i526.GetItHelper(this, environment, environmentFilter);
    final registerModule = _$RegisterModule();
    gh.factory<_i101.StaticPageCubit>(() => _i101.StaticPageCubit());
    gh.singleton<_i409.GlobalKey<_i409.NavigatorState>>(
      () => registerModule.navigatorKey,
    );
    await gh.singletonAsync<_i460.SharedPreferences>(
      () => registerModule.prefs,
      preResolve: true,
    );
    gh.lazySingleton<_i558.FlutterSecureStorage>(
      () => registerModule.secureStorage,
    );
    gh.lazySingleton<_i403.ConnectivityHelper>(
      () => _i403.ConnectivityHelper(),
    );
    gh.lazySingleton<_i545.NotificationsRemoteDataSource>(
      () => _i545.NotificationsRemoteDataSource(),
    );
    gh.lazySingleton<_i693.NotificationsRepository>(
      () => _i595.NotificationsRepositoryImpl(
        gh<_i545.NotificationsRemoteDataSource>(),
      ),
    );
    gh.lazySingleton<_i171.FileUploadService>(
      () => _i171.StubFileUploadServiceImpl(),
    );
    gh.lazySingleton<_i759.SecureStorageHelper>(
      () => _i759.SecureStorageHelper(gh<_i558.FlutterSecureStorage>()),
    );
    gh.lazySingleton<_i438.FcmService>(
      () => _i438.FcmService(
        gh<_i759.SecureStorageHelper>(),
        gh<_i409.GlobalKey<_i409.NavigatorState>>(),
      ),
    );
    gh.lazySingleton<_i498.CartStorage>(
      () => _i498.CartStorage(gh<_i460.SharedPreferences>()),
    );
    gh.lazySingleton<_i421.WishlistStorage>(
      () => _i421.WishlistStorage(gh<_i460.SharedPreferences>()),
    );
    gh.factory<_i377.NotificationSettingsCubit>(
      () => _i377.NotificationSettingsCubit(
        gh<_i460.SharedPreferences>(),
        gh<_i438.FcmService>(),
        gh<_i693.NotificationsRepository>(),
      ),
    );
    gh.lazySingleton<_i502.DialogHelper>(
      () => _i502.DialogHelper(gh<_i409.GlobalKey<_i409.NavigatorState>>()),
    );
    gh.lazySingleton<_i517.SnackBarHelper>(
      () => _i517.SnackBarHelper(gh<_i409.GlobalKey<_i409.NavigatorState>>()),
    );
    gh.lazySingleton<_i1061.WishlistDataSource>(
      () => _i1061.WishlistDataSource(gh<_i421.WishlistStorage>()),
    );
    gh.lazySingleton<_i339.DioFactory>(
      () => _i339.DioFactory(
        gh<_i759.SecureStorageHelper>(),
        gh<_i409.GlobalKey<_i409.NavigatorState>>(),
      ),
    );
    gh.lazySingleton<_i230.WishlistRepository>(
      () => _i140.WishlistRepositoryImpl(gh<_i1061.WishlistDataSource>()),
    );
    gh.factory<_i232.WishlistCubit>(
      () => _i232.WishlistCubit(gh<_i230.WishlistRepository>()),
    );
    gh.lazySingleton<_i309.CartCubit>(
      () => _i309.CartCubit(gh<_i498.CartStorage>()),
    );
    gh.singleton<_i361.Dio>(() => registerModule.dio(gh<_i339.DioFactory>()));
    gh.lazySingleton<_i473.ApiManager>(() => _i473.ApiManager(gh<_i361.Dio>()));
    gh.lazySingleton<_i652.ArticlesRemoteDataSourceImpl>(
      () => _i652.ArticlesRemoteDataSourceImpl(gh<_i473.ApiManager>()),
    );
    gh.lazySingleton<_i481.BooksRemoteDataSourceImpl>(
      () => _i481.BooksRemoteDataSourceImpl(gh<_i473.ApiManager>()),
    );
    gh.lazySingleton<_i684.NewsletterRemoteDataSource>(
      () => _i684.NewsletterRemoteDataSource(gh<_i473.ApiManager>()),
    );
    gh.lazySingleton<_i1069.PublishRemoteDataSource>(
      () => _i1069.PublishRemoteDataSource(gh<_i473.ApiManager>()),
    );
    gh.lazySingleton<_i365.PublishersRemoteDataSourceImpl>(
      () => _i365.PublishersRemoteDataSourceImpl(gh<_i473.ApiManager>()),
    );
    gh.lazySingleton<_i519.RatingsRemoteDataSource>(
      () => _i519.RatingsRemoteDataSource(gh<_i473.ApiManager>()),
    );
    gh.lazySingleton<_i407.SearchRemoteDataSource>(
      () => _i407.SearchRemoteDataSource(gh<_i473.ApiManager>()),
    );
    gh.lazySingleton<_i657.ArticlesRepository>(
      () => _i653.ArticlesRepositoryImpl(
        gh<_i652.ArticlesRemoteDataSourceImpl>(),
      ),
    );
    gh.lazySingleton<_i407.BooksRepository>(
      () => _i680.BooksRepositoryImpl(gh<_i481.BooksRemoteDataSourceImpl>()),
    );
    gh.factory<_i165.ArticleDetailCubit>(
      () => _i165.ArticleDetailCubit(gh<_i657.ArticlesRepository>()),
    );
    gh.factory<_i974.BookDetailCubit>(
      () => _i974.BookDetailCubit(gh<_i407.BooksRepository>()),
    );
    gh.factory<_i776.CatalogCubit>(
      () => _i776.CatalogCubit(gh<_i407.BooksRepository>()),
    );
    gh.factory<_i765.HomeContentCubit>(
      () => _i765.HomeContentCubit(gh<_i407.BooksRepository>()),
    );
    gh.lazySingleton<_i1067.SearchRepository>(
      () => _i163.SearchRepositoryImpl(gh<_i407.SearchRemoteDataSource>()),
    );
    gh.lazySingleton<_i95.PublishRepository>(
      () => _i655.PublishRepositoryImpl(gh<_i1069.PublishRemoteDataSource>()),
    );
    gh.lazySingleton<_i674.PublishersRepository>(
      () => _i1006.PublishersRepositoryImpl(
        gh<_i365.PublishersRemoteDataSourceImpl>(),
      ),
    );
    gh.factory<_i556.ArticlesListCubit>(
      () => _i556.ArticlesListCubit(gh<_i657.ArticlesRepository>()),
    );
    gh.lazySingleton<_i785.NewsletterRepository>(
      () => _i954.NewsletterRepositoryImpl(
        gh<_i684.NewsletterRemoteDataSource>(),
      ),
    );
    gh.lazySingleton<_i14.RatingsRepository>(
      () => _i341.RatingsRepositoryImpl(gh<_i519.RatingsRemoteDataSource>()),
    );
    gh.factory<_i1073.SearchCubit>(
      () => _i1073.SearchCubit(gh<_i1067.SearchRepository>()),
    );
    gh.factory<_i935.PublishersListCubit>(
      () => _i935.PublishersListCubit(gh<_i674.PublishersRepository>()),
    );
    gh.factory<_i618.PublisherDetailCubit>(
      () => _i618.PublisherDetailCubit(
        gh<_i674.PublishersRepository>(),
        gh<_i407.BooksRepository>(),
      ),
    );
    gh.factory<_i557.PublishCubit>(
      () => _i557.PublishCubit(
        gh<_i95.PublishRepository>(),
        gh<_i171.FileUploadService>(),
        gh<_i460.SharedPreferences>(),
      ),
    );
    gh.factory<_i47.NewsletterCubit>(
      () => _i47.NewsletterCubit(gh<_i785.NewsletterRepository>()),
    );
    gh.factory<_i105.CommentsCubit>(
      () => _i105.CommentsCubit(gh<_i14.RatingsRepository>()),
    );
    gh.factory<_i849.RatingsCubit>(
      () => _i849.RatingsCubit(gh<_i14.RatingsRepository>()),
    );
    return this;
  }
}

class _$RegisterModule extends _i4.RegisterModule {}
