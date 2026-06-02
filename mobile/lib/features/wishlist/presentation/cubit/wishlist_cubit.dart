import 'package:flutter_bloc/flutter_bloc.dart';
import 'package:injectable/injectable.dart';

import 'package:booksplatform/core/network/failure_messages.dart' as core;

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
      (slugs) => emit(WishlistLoaded(slugs)),
    );
  }

  Future<void> toggle(String slug) async {
    final current = state;
    if (current is! WishlistLoaded) return;

    if (current.slugs.contains(slug)) {
      await _repository.removeFromWishlist(slug);
    } else {
      await _repository.addToWishlist(slug);
    }
    await load();
  }

  Future<void> clear() async {
    await _repository.clearWishlist();
    await load();
  }
}
