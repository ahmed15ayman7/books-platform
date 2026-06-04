import 'package:equatable/equatable.dart';

import '../../domain/entities/wishlist_item.dart';

sealed class WishlistState extends Equatable {
  const WishlistState();
  @override
  List<Object?> get props => const [];
}

final class WishlistInitial extends WishlistState {
  const WishlistInitial();
}

final class WishlistLoading extends WishlistState {
  const WishlistLoading();
}

final class WishlistLoaded extends WishlistState {
  const WishlistLoaded(this.items);

  final List<WishlistItem> items;

  List<String> get slugs => items.map((i) => i.bookSlug).toList();

  @override
  List<Object?> get props => [items];
}

final class WishlistError extends WishlistState {
  const WishlistError(this.message);

  final String message;

  @override
  List<Object?> get props => [message];
}
