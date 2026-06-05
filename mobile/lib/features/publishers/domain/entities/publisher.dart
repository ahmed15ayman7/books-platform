import 'package:equatable/equatable.dart';

class Publisher extends Equatable {
  const Publisher({
    required this.id,
    required this.name,
    required this.countryAr,
    required this.countryEn,
    required this.countryFlag,
    required this.bookCount,
    this.countrySlug = '',
    this.isSponsored = false,
    this.website,
    this.aboutAr,
  });

  final String id;
  final String name;
  final String countryAr;
  final String countryEn;
  final String countrySlug;
  final String countryFlag;
  final int bookCount;
  final bool isSponsored;
  final String? website;
  final String? aboutAr;

  @override
  List<Object?> get props => [id, name];
}
