import 'package:equatable/equatable.dart';

import '../../../domain/entities/book.dart';

sealed class BookDetailState extends Equatable {
  const BookDetailState();
  @override
  List<Object?> get props => const [];
}

final class BookDetailInitial extends BookDetailState {
  const BookDetailInitial();
}

final class BookDetailLoading extends BookDetailState {
  const BookDetailLoading();
}

final class BookDetailSuccess extends BookDetailState {
  const BookDetailSuccess({required this.book, required this.similarBooks});
  final Book book;
  final List<Book> similarBooks;
  @override
  List<Object?> get props => [book, similarBooks];
}

final class BookDetailError extends BookDetailState {
  const BookDetailError(this.message);
  final String message;
  @override
  List<Object?> get props => [message];
}
