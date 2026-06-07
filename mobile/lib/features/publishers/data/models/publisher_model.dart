import '../../domain/entities/publisher.dart';

class PublisherModel {
  const PublisherModel({
    required this.id,
    required this.slug,
    required this.title,
    required this.bookCount,
    required this.countries,
    required this.countriesAr,
    required this.countrySlugs,
    this.nameAr = '',
    this.isSponsored = false,
    this.imageUrl,
    this.excerpt,
    this.contentAr,
    this.website,
    this.email,
  });

  final String id;
  final String slug;
  final String title;
  final int bookCount;
  final List<String> countries;
  final List<String> countriesAr;
  final List<String> countrySlugs;
  final String nameAr;
  final bool isSponsored;
  final String? imageUrl;
  final String? excerpt;
  final String? contentAr;
  final String? website;
  final String? email;

  factory PublisherModel.fromJson(Map<String, dynamic> json) {
    final countriesRaw = json['countries'] as List<dynamic>? ?? [];
    // $mobile-debug-skill | Problem: e.toString() on country Map objects produced raw JSON strings like "{id:..., name: Russia,...}" displayed in the UI. Fix: extract 'name' (EN), 'nameAr' (AR), and 'slug' from each country object — slug is the value the API filter accepts.
    return PublisherModel(
      id: json['_id'] as String? ?? json['id'] as String? ?? '',
      slug: json['slug'] as String? ?? '',
      title: json['name'] as String? ?? json['title'] as String? ?? '',
      bookCount: (json['booksCount'] as num?)?.toInt() ??
          (json['bookCount'] as num?)?.toInt() ??
          (json['products'] as List?)?.length ?? 0,
      countries: countriesRaw
          .map((e) => e is Map ? (e['name'] as String? ?? '') : e.toString())
          .where((c) => c.isNotEmpty)
          .toList(),
      countriesAr: countriesRaw
          .map((e) => e is Map ? (e['nameAr'] as String? ?? '') : '')
          .where((c) => c.isNotEmpty)
          .toList(),
      countrySlugs: countriesRaw
          .map((e) => e is Map ? (e['slug'] as String? ?? '') : '')
          .where((c) => c.isNotEmpty)
          .toList(),
      isSponsored: json['isSponsored'] as bool? ?? false,
      imageUrl: json['imageUrl'] as String? ??
          json['imageFeatured'] as String? ??
          json['logoUrl'] as String?,
      excerpt: json['content'] as String? ??
          json['description'] as String? ??
          json['excerpt'] as String?,
      contentAr: json['contentAr'] as String?,
      website: json['websiteUrl'] as String? ?? json['website'] as String?,
      email: json['contactEmail'] as String? ?? json['email'] as String?,
      nameAr: json['nameAr'] as String? ?? '',
    );
  }

  Publisher toEntity() => Publisher(
        id: slug.isNotEmpty ? slug : id,
        name: title,
        nameAr: nameAr,
        countryAr: countriesAr.isNotEmpty
            ? countriesAr[0]
            : (countries.isNotEmpty ? countries[0] : ''),
        countryEn: countries.isNotEmpty ? countries[0] : '',
        countrySlug: countrySlugs.isNotEmpty ? countrySlugs[0] : '',
        countryFlag: '',
        bookCount: bookCount,
        isSponsored: isSponsored,
        imageUrl: imageUrl,
        website: website,
        aboutEn: excerpt,
        aboutAr: contentAr,
      );
}
