import '../../domain/entities/publisher_summary.dart';

class PublisherSummaryResponse {
  const PublisherSummaryResponse({
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

  factory PublisherSummaryResponse.fromJson(Map<String, dynamic> json) {
    return PublisherSummaryResponse(
      id: json['id'] as String,
      name: json['name'] as String,
      countryAr: json['countryAr'] as String,
      countryFlag: json['countryFlag'] as String,
      bookCount: json['bookCount'] as int,
      isSponsored: json['isSponsored'] as bool? ?? false,
    );
  }

  PublisherSummary toEntity() => PublisherSummary(
        id: id,
        name: name,
        countryAr: countryAr,
        countryFlag: countryFlag,
        bookCount: bookCount,
        isSponsored: isSponsored,
      );
}
