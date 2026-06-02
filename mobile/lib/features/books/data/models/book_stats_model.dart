import '../../domain/entities/book_stats.dart';

class BookStatsModel {
  const BookStatsModel({
    required this.totalBooks,
    required this.totalPublishers,
    required this.totalTranslatedBooks,
    required this.totalCountries,
  });

  final int totalBooks;
  final int totalPublishers;
  final int totalTranslatedBooks;
  final int totalCountries;

  factory BookStatsModel.fromJson(Map<String, dynamic> json) => BookStatsModel(
        totalBooks: (json['totalBooks'] as num?)?.toInt() ?? 0,
        totalPublishers: (json['totalPublishers'] as num?)?.toInt() ?? 0,
        totalTranslatedBooks: (json['totalTranslatedBooks'] as num?)?.toInt() ?? 0,
        totalCountries: (json['totalCountries'] as num?)?.toInt() ?? 0,
      );

  BookStats toEntity() => BookStats(
        totalBooks: totalBooks,
        totalPublishers: totalPublishers,
        totalTranslatedBooks: totalTranslatedBooks,
        totalCountries: totalCountries,
      );
}
