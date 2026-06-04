import 'package:equatable/equatable.dart';

final class ArticleCategory extends Equatable {
  const ArticleCategory({
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

  @override
  List<Object?> get props => [id];
}
