import 'package:equatable/equatable.dart';

class HeroSlide extends Equatable {
  const HeroSlide({
    required this.id,
    required this.titleAr,
    this.titleEn,
    this.subtitleAr,
    this.subtitleEn,
    required this.imageUrl,
    this.foregroundImageUrl,
    this.linkUrl,
    required this.position,
    this.isLocalAsset = false,
  });

  final String id;
  final String titleAr;
  final String? titleEn;
  final String? subtitleAr;
  final String? subtitleEn;
  final String imageUrl;
  final String? foregroundImageUrl;
  final String? linkUrl;
  final int position;
  final bool isLocalAsset;

  @override
  List<Object?> get props => [id];
}
