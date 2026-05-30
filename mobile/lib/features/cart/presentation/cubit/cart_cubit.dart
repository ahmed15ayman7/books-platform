import 'package:equatable/equatable.dart';
import 'package:flutter_bloc/flutter_bloc.dart';
import 'package:injectable/injectable.dart';

import '../../../books/domain/entities/book.dart';
import '../../domain/entities/cart_item.dart';

// ── State ─────────────────────────────────────────────────────────────────
class CartState extends Equatable {
  const CartState({this.items = const []});
  final List<CartItem> items;

  int get totalCount => items.fold(0, (s, i) => s + i.quantity);
  double get subtotal =>
      items.fold(0.0, (s, i) => s + i.book.price * i.quantity);
  double get serviceFee => items.isEmpty ? 0.0 : 2.50;
  double get total => subtotal + serviceFee;

  CartState copyWith({List<CartItem>? items}) =>
      CartState(items: items ?? this.items);

  @override
  List<Object?> get props => [items];
}

// ── Cubit ─────────────────────────────────────────────────────────────────
@lazySingleton
class CartCubit extends Cubit<CartState> {
  CartCubit() : super(const CartState());

  void addItem(Book book) {
    final existing = state.items.indexWhere((i) => i.book.id == book.id);
    if (existing >= 0) {
      final updated = List<CartItem>.from(state.items);
      updated[existing] = CartItem(
        book: book,
        quantity: updated[existing].quantity + 1,
      );
      emit(state.copyWith(items: updated));
    } else {
      emit(state.copyWith(
        items: [...state.items, CartItem(book: book, quantity: 1)],
      ));
    }
  }

  void removeItem(String bookId) {
    emit(state.copyWith(
      items: state.items.where((i) => i.book.id != bookId).toList(),
    ));
  }

  void updateQuantity(String bookId, int delta) {
    final updated = state.items
        .map((i) {
          if (i.book.id != bookId) return i;
          final newQty = i.quantity + delta;
          return newQty <= 0 ? null : CartItem(book: i.book, quantity: newQty);
        })
        .whereType<CartItem>()
        .toList();
    emit(state.copyWith(items: updated));
  }

  void clear() => emit(const CartState());
}
