import 'package:equatable/equatable.dart';

class Country extends Equatable {
  const Country({
    required this.slug,
    required this.nameEn,
    required this.nameAr,
  });

  final String slug;
  final String nameEn;
  final String nameAr;

  String displayName(String locale) =>
      locale == 'ar' && nameAr.isNotEmpty ? nameAr : nameEn;

  @override
  List<Object?> get props => [slug];
}
