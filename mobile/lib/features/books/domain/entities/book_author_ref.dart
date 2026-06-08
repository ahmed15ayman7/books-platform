import 'package:equatable/equatable.dart';

class BookAuthorRef extends Equatable {
  const BookAuthorRef({
    required this.id,
    required this.slug,
    required this.name,
    required this.nameAr,
  });

  final String id;
  final String slug;
  final String name;
  final String nameAr;

  String displayName(String locale) =>
      locale == 'ar' && nameAr.isNotEmpty ? nameAr : name;

  @override
  List<Object?> get props => [id, slug];
}
