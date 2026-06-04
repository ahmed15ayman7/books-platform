import '../../domain/entities/article_category.dart';

class ArticleCategoryModel {
  const ArticleCategoryModel({
    required this.id,
    required this.name,
    required this.nameAr,
    required this.slug,
    required this.linkedCount,
  });

  final String id;
  final String name;
  final String nameAr;
  final String slug;
  final int linkedCount;

  factory ArticleCategoryModel.fromJson(Map<String, dynamic> json) =>
      ArticleCategoryModel(
        id: json['id'] as String? ?? '',
        name: json['name'] as String? ?? '',
        nameAr: json['nameAr'] as String? ?? '',
        slug: json['slug'] as String? ?? '',
        linkedCount: (json['linkedCount'] as num?)?.toInt() ?? 0,
      );

  ArticleCategory toEntity() => ArticleCategory(
        id: id,
        name: name,
        nameAr: nameAr,
        slug: slug,
        linkedCount: linkedCount,
      );
}
