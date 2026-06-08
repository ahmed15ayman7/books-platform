import 'package:equatable/equatable.dart';

class BookTagRef extends Equatable {
  const BookTagRef({
    required this.id,
    required this.slug,
    required this.name,
  });

  final String id;
  final String slug;
  final String name;

  @override
  List<Object?> get props => [id, slug];
}
