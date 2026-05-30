import 'package:equatable/equatable.dart';

import '../../../books/domain/entities/book.dart';

class CartItem extends Equatable {
  const CartItem({required this.book, required this.quantity});
  final Book book;
  final int quantity;
  @override
  List<Object?> get props => [book.id, quantity];
}
