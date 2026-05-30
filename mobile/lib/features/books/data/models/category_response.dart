import '../../domain/entities/category.dart';

class CategoryResponse {
  const CategoryResponse({
    required this.slug,
    required this.nameAr,
    required this.nameEn,
    required this.iconKey,
    required this.bookCount,
  });

  final String slug;
  final String nameAr;
  final String nameEn;
  final String iconKey;
  final int bookCount;

  factory CategoryResponse.fromJson(Map<String, dynamic> json) {
    return CategoryResponse(
      slug: json['slug'] as String,
      nameAr: json['nameAr'] as String,
      nameEn: json['nameEn'] as String,
      iconKey: json['iconKey'] as String,
      bookCount: json['bookCount'] as int,
    );
  }

  Category toEntity() => Category(
        slug: slug,
        nameAr: nameAr,
        nameEn: nameEn,
        iconKey: iconKey,
        bookCount: bookCount,
      );
}
