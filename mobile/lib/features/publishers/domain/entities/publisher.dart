import 'package:equatable/equatable.dart';

class Publisher extends Equatable {
  const Publisher({
    required this.id,
    required this.name,
    this.nameAr = '',
    required this.countryAr,
    required this.countryEn,
    required this.countryFlag,
    required this.bookCount,
    this.countrySlug = '',
    this.isSponsored = false,
    this.imageUrl,
    this.website,
    this.aboutEn,
    this.aboutAr,
  });

  final String id;
  final String name;
  final String nameAr;
  final String countryAr;
  final String countryEn;
  final String countrySlug;
  final String countryFlag;
  final int bookCount;
  final bool isSponsored;
  final String? imageUrl;
  final String? website;
  final String? aboutEn;
  final String? aboutAr;

  String displayName(String locale) =>
      locale == 'ar' && nameAr.isNotEmpty ? nameAr : name;

  String? displayAbout(String locale) {
    if (locale == 'ar') {
      if (aboutAr != null && aboutAr!.isNotEmpty) return aboutAr;
      return aboutEn;
    }
    if (aboutEn != null && aboutEn!.isNotEmpty) return aboutEn;
    return aboutAr;
  }

  @override
  List<Object?> get props => [id, name];
}
