import '../../domain/entities/publisher.dart';

class PublisherModel {
  const PublisherModel({
    required this.id,
    required this.slug,
    required this.title,
    required this.bookCount,
    required this.countries,
    this.isSponsored = false,
    this.imageUrl,
    this.excerpt,
    this.website,
    this.email,
  });

  final String id;
  final String slug;
  final String title;
  final int bookCount;
  final List<String> countries;
  final bool isSponsored;
  final String? imageUrl;
  final String? excerpt;
  final String? website;
  final String? email;

  factory PublisherModel.fromJson(Map<String, dynamic> json) {
    final countriesRaw = json['countries'] as List<dynamic>? ?? [];
    return PublisherModel(
      id: json['_id'] as String? ?? json['id'] as String? ?? '',
      slug: json['slug'] as String? ?? '',
      title: json['title'] as String? ?? json['name'] as String? ?? '',
      bookCount: (json['booksCount'] as num?)?.toInt() ??
          (json['bookCount'] as num?)?.toInt() ?? 0,
      countries: countriesRaw.map((e) => e.toString()).toList(),
      isSponsored: json['isSponsored'] as bool? ?? false,
      imageUrl: json['imageUrl'] as String? ?? json['logoUrl'] as String?,
      excerpt: json['excerpt'] as String?,
      website: json['website'] as String?,
      email: json['email'] as String?,
    );
  }

  Publisher toEntity() => Publisher(
        id: id.isNotEmpty ? id : slug,
        name: title,
        countryAr: countries.isNotEmpty ? countries[0] : '',
        countryEn: countries.isNotEmpty ? countries[0] : '',
        countryFlag: '',
        bookCount: bookCount,
        isSponsored: isSponsored,
        website: website,
        aboutAr: excerpt,
      );
}
