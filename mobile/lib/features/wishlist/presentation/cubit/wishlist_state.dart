import 'package:equatable/equatable.dart';

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
  const WishlistLoaded(this.slugs);

  final List<String> slugs;

  @override
  List<Object?> get props => [slugs];
}

final class WishlistError extends WishlistState {
  const WishlistError(this.message);

  final String message;

  @override
  List<Object?> get props => [message];
}
