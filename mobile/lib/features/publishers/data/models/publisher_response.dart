import '../../domain/entities/publisher.dart';

class PublisherResponse {
  const PublisherResponse({
    required this.id,
    required this.name,
    required this.countryAr,
    required this.countryEn,
    required this.countryFlag,
    required this.bookCount,
    this.isSponsored = false,
    this.website,
    this.aboutAr,
  });

  final String id;
  final String name;
  final String countryAr;
  final String countryEn;
  final String countryFlag;
  final int bookCount;
  final bool isSponsored;
  final String? website;
  final String? aboutAr;

  factory PublisherResponse.fromJson(Map<String, dynamic> json) {
    return PublisherResponse(
      id: json['id'] as String,
      name: json['name'] as String,
      countryAr: json['countryAr'] as String,
      countryEn: json['countryEn'] as String,
      countryFlag: json['countryFlag'] as String,
      bookCount: json['bookCount'] as int,
      isSponsored: json['isSponsored'] as bool? ?? false,
      website: json['website'] as String?,
      aboutAr: json['aboutAr'] as String?,
    );
  }

  Publisher toEntity() => Publisher(
        id: id,
        name: name,
        countryAr: countryAr,
        countryEn: countryEn,
        countryFlag: countryFlag,
        bookCount: bookCount,
        isSponsored: isSponsored,
        website: website,
        aboutAr: aboutAr,
      );
}
