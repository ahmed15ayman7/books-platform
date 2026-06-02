import 'package:equatable/equatable.dart';

class BookStats extends Equatable {
  const BookStats({
    required this.totalBooks,
    required this.totalPublishers,
    required this.totalTranslatedBooks,
    required this.totalCountries,
  });

  final int totalBooks;
  final int totalPublishers;
  final int totalTranslatedBooks;
  final int totalCountries;

  @override
  List<Object?> get props => [totalBooks, totalPublishers, totalTranslatedBooks, totalCountries];
}
