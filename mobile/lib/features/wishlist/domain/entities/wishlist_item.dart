import 'package:equatable/equatable.dart';

class WishlistItem extends Equatable {
  const WishlistItem({
    required this.bookSlug,
    this.titleAr = '',
    this.titleEn = '',
    this.imageUrl,
  });

  final String bookSlug;
  final String titleAr;
  final String titleEn;
  final String? imageUrl;

  @override
  List<Object?> get props => [bookSlug];
}
