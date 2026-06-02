import 'package:equatable/equatable.dart';
import 'package:flutter/material.dart';
import 'package:flutter_bloc/flutter_bloc.dart';
import 'package:injectable/injectable.dart';

import '../../../../core/enums/translation_status.dart';
import '../../../../core/storage/cart_storage.dart';
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
  CartCubit(this._storage) : super(const CartState()) {
    _loadFromStorage();
  }

  final CartStorage _storage;

  void _loadFromStorage() {
    final rawItems = _storage.getItems();
    final items = rawItems.map(_cartItemFromMap).whereType<CartItem>().toList();
    if (items.isNotEmpty) emit(CartState(items: items));
  }

  void _persist() => _storage.saveItems(_serializeItems(state.items));

  List<Map<String, dynamic>> _serializeItems(List<CartItem> items) =>
      items.map((i) => {
            'slug': i.book.slug.isNotEmpty ? i.book.slug : i.book.id,
            'quantity': i.quantity,
            'titleAr': i.book.titleAr,
            'titleEn': i.book.titleEn,
            'price': i.book.price,
            'imageUrl': i.book.imageUrl,
          }).toList();

  CartItem? _cartItemFromMap(Map<String, dynamic> m) {
    try {
      final slug = m['slug'] as String? ?? '';
      if (slug.isEmpty) return null;
      final book = Book(
        id: slug,
        slug: slug,
        titleAr: m['titleAr'] as String? ?? '',
        titleEn: m['titleEn'] as String? ?? '',
        publisher: '',
        publisherId: '',
        countryAr: '',
        countryEn: '',
        countryFlag: '',
        originalLanguage: '',
        status: TranslationStatus.notTranslated,
        price: (m['price'] as num?)?.toDouble() ?? 0.0,
        categorySlug: '',
        coverColors: const [Color(0xFF2B2540), Color(0xFF46467F)],
        isbn: '',
        pages: 0,
        edition: '',
        year: 0,
        descriptionAr: '',
        imageUrl: m['imageUrl'] as String?,
      );
      return CartItem(
        book: book,
        quantity: (m['quantity'] as num?)?.toInt() ?? 1,
      );
    } catch (_) {
      return null;
    }
  }

  void addItem(Book book) {
    final bookId = book.slug.isNotEmpty ? book.slug : book.id;
    final existing = state.items.indexWhere(
      (i) => (i.book.slug.isNotEmpty ? i.book.slug : i.book.id) == bookId,
    );
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
    _persist();
  }

  void removeItem(String bookId) {
    emit(state.copyWith(
      items: state.items
          .where((i) =>
              i.book.id != bookId &&
              (i.book.slug.isEmpty || i.book.slug != bookId))
          .toList(),
    ));
    _persist();
  }

  void updateQuantity(String bookId, int delta) {
    final updated = state.items
        .map((i) {
          final id = i.book.slug.isNotEmpty ? i.book.slug : i.book.id;
          if (id != bookId) return i;
          final newQty = i.quantity + delta;
          return newQty <= 0 ? null : CartItem(book: i.book, quantity: newQty);
        })
        .whereType<CartItem>()
        .toList();
    emit(state.copyWith(items: updated));
    _persist();
  }

  void clear() {
    emit(const CartState());
    _storage.clear();
  }
}
