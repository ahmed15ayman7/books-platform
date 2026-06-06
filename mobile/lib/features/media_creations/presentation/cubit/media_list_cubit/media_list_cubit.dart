import 'package:flutter_bloc/flutter_bloc.dart';
import 'package:injectable/injectable.dart';

import 'package:booksplatform/core/network/failure_messages.dart' as core;

import '../../../domain/repositories/base_media_repository.dart';
import 'media_list_state.dart';

@injectable
class MediaListCubit extends Cubit<MediaListState> {
  MediaListCubit(this._repository) : super(const MediaListInitial());

  final MediaRepository _repository;

  String _activeSlug = '';

  static const List<({String name, String nameAr, String slug})> channels = [
    (name: 'All', nameAr: 'الكل', slug: ''),
    (name: 'Book Talk', nameAr: 'حديث الكتب', slug: 'books-talk'),
    (name: 'Novel & Story', nameAr: 'رواية وقصة', slug: 'novel-story'),
  ];

  Future<void> load() => _loadMedia(slug: '');

  Future<void> refresh() => _loadMedia(slug: _activeSlug);

  Future<void> switchChannel(String slug) => _loadMedia(slug: slug);

  Future<void> _loadMedia({required String slug}) async {
    _activeSlug = slug;
    emit(const MediaListLoading());
    final result = await _repository.getMedia(
      channel: slug.isEmpty ? null : slug,
      page: 1,
    );
    result.fold(
      (failure) => emit(MediaListError(core.failureToMessage(failure))),
      (paginated) => emit(MediaListSuccess(
        items: paginated.data,
        activeSlug: slug,
        hasNextPage: paginated.pagination.hasNextPage,
        page: 1,
      )),
    );
  }

  Future<void> loadMore() async {
    final current = state;
    if (current is! MediaListSuccess || !current.hasNextPage) return;
    final nextPage = current.page + 1;
    final result = await _repository.getMedia(
      channel: _activeSlug.isEmpty ? null : _activeSlug,
      page: nextPage,
    );
    result.fold(
      (failure) => emit(MediaListError(core.failureToMessage(failure))),
      (paginated) => emit(MediaListSuccess(
        items: [...current.items, ...paginated.data],
        activeSlug: _activeSlug,
        hasNextPage: paginated.pagination.hasNextPage,
        page: nextPage,
      )),
    );
  }
}
