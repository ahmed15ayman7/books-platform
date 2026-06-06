import 'package:equatable/equatable.dart';

import '../../../domain/entities/media_item.dart';

sealed class MediaListState extends Equatable {
  const MediaListState();
  @override
  List<Object?> get props => const [];
}

final class MediaListInitial extends MediaListState {
  const MediaListInitial();
}

final class MediaListLoading extends MediaListState {
  const MediaListLoading();
}

final class MediaListSuccess extends MediaListState {
  const MediaListSuccess({
    required this.items,
    required this.activeSlug,
    this.hasNextPage = false,
    this.page = 1,
  });

  final List<MediaItem> items;
  final String activeSlug;
  final bool hasNextPage;
  final int page;

  @override
  List<Object?> get props => [items, activeSlug, hasNextPage, page];
}

final class MediaListError extends MediaListState {
  const MediaListError(this.message);
  final String message;
  @override
  List<Object?> get props => [message];
}
