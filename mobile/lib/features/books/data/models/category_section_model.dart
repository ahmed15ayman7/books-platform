import '../../domain/entities/category_section.dart';
import 'book_model.dart';
import 'category_model.dart';

class CategorySectionModel {
  const CategorySectionModel({
    required this.category,
    required this.books,
  });

  final CategoryModel category;
  final List<BookModel> books;

  factory CategorySectionModel.fromJson(Map<String, dynamic> json) {
    final catJson = json['category'] as Map<String, dynamic>? ?? {};
    final booksJson = json['books'] as List<dynamic>? ?? [];
    return CategorySectionModel(
      category: CategoryModel.fromJson(catJson),
      books: booksJson
          .map((e) => BookModel.fromJson(e as Map<String, dynamic>))
          .toList(),
    );
  }

  CategorySection toEntity() => CategorySection(
        category: category.toEntity(),
        books: books.map((b) => b.toEntity()).toList(),
      );
}
