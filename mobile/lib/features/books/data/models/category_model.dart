import '../../domain/entities/category.dart';

class CategoryModel {
  const CategoryModel({
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

  factory CategoryModel.fromJson(Map<String, dynamic> json) => CategoryModel(
        slug: json['slug'] as String? ?? '',
        nameAr: json['nameAr'] as String? ?? '',
        nameEn: json['name'] as String? ?? json['nameEn'] as String? ?? '',
        iconKey: json['iconKey'] as String? ?? '',
        bookCount: (json['linkedCount'] as num?)?.toInt() ??
            (json['bookCount'] as num?)?.toInt() ?? 0,
      );

  Category toEntity() => Category(
        slug: slug,
        nameAr: nameAr,
        nameEn: nameEn,
        iconKey: iconKey,
        bookCount: bookCount,
      );
}
