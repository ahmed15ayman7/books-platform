import 'package:equatable/equatable.dart';

class Category extends Equatable {
  const Category({
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

  @override
  List<Object?> get props => [slug];
}
