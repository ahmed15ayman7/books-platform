import 'package:equatable/equatable.dart';

class WishlistItem extends Equatable {
  const WishlistItem({required this.bookSlug});

  final String bookSlug;

  @override
  List<Object?> get props => [bookSlug];
}
