import 'package:flutter_bloc/flutter_bloc.dart';
import 'package:injectable/injectable.dart';

import 'package:booksplatform/core/network/failure_messages.dart' as core;

import '../../domain/entities/wishlist_item.dart';
import '../../domain/repositories/wishlist_repository.dart';
import 'wishlist_state.dart';

@injectable
class WishlistCubit extends Cubit<WishlistState> {
  WishlistCubit(this._repository) : super(const WishlistInitial());

  final WishlistRepository _repository;

  Future<void> load() async {
    emit(const WishlistLoading());
    final result = await _repository.getWishlist();
    result.fold(
      (failure) => emit(WishlistError(core.failureToMessage(failure))),
      (items) => emit(WishlistLoaded(items)),
    );
  }

  Future<void> toggle(WishlistItem item) async {
    final current = state;
    if (current is! WishlistLoaded) return;

    if (current.slugs.contains(item.bookSlug)) {
      await _repository.removeFromWishlist(item.bookSlug);
    } else {
      await _repository.addToWishlist(item);
    }
    await load();
  }

  Future<void> clear() async {
    await _repository.clearWishlist();
    await load();
  }
}
