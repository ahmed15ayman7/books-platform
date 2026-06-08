import 'package:equatable/equatable.dart';

class BookCategoryRef extends Equatable {
  const BookCategoryRef({
    required this.id,
    required this.slug,
    required this.nameEn,
    required this.nameAr,
  });

  final String id;
  final String slug;
  final String nameEn;
  final String nameAr;

  String displayName(String locale) =>
      locale == 'ar' && nameAr.isNotEmpty ? nameAr : nameEn;

  @override
  List<Object?> get props => [id, slug];
}
