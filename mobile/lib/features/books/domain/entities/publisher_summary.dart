import 'package:equatable/equatable.dart';

class PublisherSummary extends Equatable {
  const PublisherSummary({
    required this.id,
    required this.name,
    required this.countryAr,
    required this.countryFlag,
    required this.bookCount,
    this.isSponsored = false,
  });

  final String id;
  final String name;
  final String countryAr;
  final String countryFlag;
  final int bookCount;
  final bool isSponsored;

  @override
  List<Object?> get props => [id, name];
}
