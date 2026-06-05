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
  final List<String> countriesAr;
  final List<String> countrySlugs;
  final bool isSponsored;
  final String? imageUrl;
  final String? excerpt;
  final String? website;
  final String? email;

  factory PublisherModel.fromJson(Map<String, dynamic> json) {
    final countriesRaw = json['countries'] as List<dynamic>? ?? [];
    // $mobile-debug-skill | Problem: e.toString() on country Map objects produced raw JSON strings like "{id:..., name: Russia,...}" displayed in the UI. Fix: extract 'name' (EN), 'nameAr' (AR), and 'slug' from each country object — slug is the value the API filter accepts.
    return PublisherModel(
      id: json['_id'] as String? ?? json['id'] as String? ?? '',
      slug: json['slug'] as String? ?? '',
      title: json['title'] as String? ?? json['name'] as String? ?? '',
      bookCount: (json['booksCount'] as num?)?.toInt() ??
          (json['bookCount'] as num?)?.toInt() ?? 0,
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
      imageUrl: json['imageUrl'] as String? ?? json['logoUrl'] as String?,
      excerpt: json['description'] as String? ?? json['excerpt'] as String?,
      website: json['website'] as String?,
      email: json['contactEmail'] as String? ?? json['email'] as String?,
    );
  }

  Publisher toEntity() => Publisher(
        // $mobile-debug-skill | Problem: entity id was set to the DB id (cmpyf…) so navigation called /publishers/<db-id> → 404. Fix: use the URL slug instead — it's what the detail endpoint accepts.
        id: slug.isNotEmpty ? slug : id,
        name: title,
        countryAr: countriesAr.isNotEmpty
            ? countriesAr[0]
            : (countries.isNotEmpty ? countries[0] : ''),
        countryEn: countries.isNotEmpty ? countries[0] : '',
        countrySlug: countrySlugs.isNotEmpty ? countrySlugs[0] : '',
        countryFlag: '',
        bookCount: bookCount,
        isSponsored: isSponsored,
        website: website,
        aboutAr: excerpt,
      );
}
