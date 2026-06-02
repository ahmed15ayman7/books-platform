import 'package:equatable/equatable.dart';

class SearchSuggestion extends Equatable {
  const SearchSuggestion({
    required this.type,
    required this.label,
    required this.slug,
  });

  final String type;
  final String label;
  final String slug;

  @override
  List<Object?> get props => [type, slug];
}
