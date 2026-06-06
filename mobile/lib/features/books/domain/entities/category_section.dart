import 'package:equatable/equatable.dart';

import 'book.dart';
import 'category.dart';

final class CategorySection extends Equatable {
  const CategorySection({required this.category, required this.books});

  final Category category;
  final List<Book> books;

  @override
  List<Object?> get props => [category, books];
}
