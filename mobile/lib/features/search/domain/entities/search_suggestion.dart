import 'package:equatable/equatable.dart';

class SearchSuggestion extends Equatable {
  const SearchSuggestion({
    required this.type,
    required this.label,
    required this.slug,
    this.labelEn,
  });

  final String type;
  final String label;
  final String slug;
  final String? labelEn;

  String displayLabel(String locale) {
    if (locale == 'ar') return label;
    if (labelEn != null && labelEn!.isNotEmpty) return labelEn!;
    return label;
  }

  @override
  List<Object?> get props => [type, slug];
}
